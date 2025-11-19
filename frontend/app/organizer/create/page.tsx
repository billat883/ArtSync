"use client";

import { useMetaMaskEthersSigner } from "@/src/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/src/fhevm/useFhevm";
import { useState } from "react";
import { ethers } from "ethers";
import { ArtExpoABI } from "@/src/abi/ArtExpoABI";
import { ArtExpoAddresses } from "@/src/abi/ArtExpoAddresses";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";

async function uploadToPinata(json: unknown): Promise<string> {
  const token = process.env.NEXT_PUBLIC_PINATA_JWT as string | undefined;
  if (!token) throw new Error("Missing NEXT_PUBLIC_PINATA_JWT");
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pinataContent: json })
  });
  if (!res.ok) throw new Error("Pinata upload failed");
  const data = await res.json();
  return data.IpfsHash as string;
}

export default function CreateEventPage() {
  const { provider, chainId, isConnected, ethersSigner, initialMockChains } = useMetaMaskEthersSigner();
  const { instance } = useFhevm({ provider: provider!, chainId, enabled: true, initialMockChains });
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mintPOAP, setMintPOAP] = useState(true);
  const [creating, setCreating] = useState(false);
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState("");

  const emEntry = chainId ? ArtExpoAddresses[chainId.toString() as keyof typeof ArtExpoAddresses] : undefined;
  const emAddress = emEntry?.address && emEntry.address !== ethers.ZeroAddress ? emEntry.address : undefined;

  const onCreate = async () => {
    if (!isConnected || !ethersSigner || !emAddress) { setMessage("⚠️ Please connect wallet or deploy contract"); return; }
    if (!title || !location || !start || !end) { setMessage("⚠️ Please fill in all required fields"); return; }
    
    try {
      setCreating(true); 
      setMessage("📤 Uploading to IPFS...");
      const metadata = { title, location, description };
      const cid = await uploadToPinata(metadata);
      
      const c = new ethers.Contract(emAddress, ArtExpoABI.abi, ethersSigner);
      setMessage("⛓️ Creating on-chain exhibition...");
      const tx = await c.scheduleExhibit(cid, Math.floor(new Date(start).getTime()/1000), Math.floor(new Date(end).getTime()/1000), mintPOAP);
      
      setMessage("⏳ Waiting for transaction confirmation...");
      await tx.wait();
      
      const eid = Number(await c.nextExhibitId()) - 1;
      setEventId(eid);
      setMessage("✅ Created successfully!");
    } catch (e: any) {
      setMessage(`❌ Creation failed: ${e.message || "Unknown error"}`);
    } finally { 
      setCreating(false); 
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="scanline"></div>
      <Navbar />
      
      <main className="relative z-10 pt-24 mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="inline-block border border-primary/50 px-3 py-1 text-xs font-mono tracking-[0.2em] text-primary mb-4">
            CREATE_EXHIBIT
          </div>
          <h2 className="text-5xl font-bold font-mono mb-3 tracking-tight">NEW_EXHIBITION</h2>
          <p className="text-white/50 font-mono text-sm tracking-wider">Fill in metadata and deploy on-chain</p>
        </div>

        {eventId !== undefined ? (
          // Success State
          <div className="card text-center space-y-6 p-12">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-3xl font-bold font-mono tracking-wider">DEPLOYMENT_SUCCESS</h3>
            <p className="text-white/70 font-mono">EXHIBIT_ID: #{eventId}</p>
            <div className="flex gap-4 justify-center">
              <Link href={`/event/${eventId}`} className="btn-gradient font-mono text-sm tracking-wider">
                VIEW_DETAILS
              </Link>
              <Link href={`/organizer/qr?id=${eventId}`} className="btn-primary font-mono text-sm tracking-wider">
                GENERATE_QR
              </Link>
            </div>
            <button onClick={() => { setEventId(undefined); setTitle(""); setLocation(""); setDescription(""); setStart(""); setEnd(""); setMessage(""); }} className="btn-primary font-mono text-sm tracking-wider mt-4">
              CREATE_ANOTHER
            </button>
          </div>
        ) : (
          // Form
          <div className="card space-y-6 p-8">
            <div>
              <label className="block text-xs font-mono mb-2 text-white/60 tracking-wider">TITLE *</label>
              <input 
                className="input-field font-mono" 
                placeholder="e.g. On-Chain Art Exhibition 2025" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-2 text-white/60 tracking-wider">LOCATION *</label>
              <input 
                className="input-field font-mono" 
                placeholder="e.g. Museum of Contemporary Art" 
                value={location} 
                onChange={e=>setLocation(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-2 text-white/60 tracking-wider">DESCRIPTION</label>
              <textarea 
                className="input-field resize-none font-mono text-sm" 
                rows={3}
                placeholder="Brief introduction to exhibition theme and artworks..." 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-2 text-white/60 tracking-wider">START_TIME *</label>
                <input 
                  type="datetime-local" 
                  className="input-field font-mono text-sm" 
                  value={start} 
                  onChange={e=>setStart(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-2 text-white/60 tracking-wider">END_TIME *</label>
                <input 
                  type="datetime-local" 
                  className="input-field font-mono text-sm" 
                  value={end} 
                  onChange={e=>setEnd(e.target.value)} 
                />
              </div>
            </div>

            <div className="border border-white/20 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mintPOAP} 
                  onChange={e=>setMintPOAP(e.target.checked)}
                  className="mt-1 w-4 h-4 border-white/20 bg-transparent checked:bg-primary"
                />
                <div>
                  <div className="font-mono text-sm flex items-center gap-2 tracking-wider">
                    ENABLE_NFT_PASSES
                  </div>
                  <p className="text-xs text-white/50 mt-1 font-mono">
                    Mint art pass NFTs for attendees after check-in
                  </p>
                </div>
              </label>
            </div>

            {message && (
              <div className={`p-4 border ${message.includes('✅') ? 'border-green-400/50 bg-green-500/10' : message.includes('❌') ? 'border-red-400/50 bg-red-500/10' : 'border-blue-400/50 bg-blue-500/10'}`}>
                <p className="text-sm font-mono">{message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                disabled={creating || !isConnected} 
                onClick={onCreate} 
                className="btn-gradient flex-1 disabled:opacity-30 font-mono text-sm tracking-wider"
              >
                {creating ? "DEPLOYING..." : "DEPLOY_EXHIBIT"}
              </button>
              <Link href="/organizer" className="btn-primary font-mono text-sm tracking-wider">
                CANCEL
              </Link>
            </div>

            {!isConnected && (
              <div className="text-center text-yellow-300 text-xs font-mono tracking-wider">
                ⚠ WALLET_NOT_CONNECTED
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


