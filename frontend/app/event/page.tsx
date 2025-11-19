"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMetaMaskEthersSigner } from "@/src/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/src/fhevm/useFhevm";
import { useEffect, useState } from "react";
import { useEventManager } from "@/src/hooks/useEventManager";
import { Navbar } from "@/src/components/Navbar";
import { buildIpfsGatewayUrl } from "@/src/utils/ipfs";
import { FhevmDecryptionSignature } from "@/src/fhevm/FhevmDecryptionSignature";
import { GenericStringInMemoryStorage } from "@/src/fhevm/GenericStringStorage";

function EventDetailInner() {
  const sp = useSearchParams();
  const idParam = sp.get("id");
  const eventId = idParam ? Number(idParam) : NaN;
  const { provider, chainId, ethersSigner, ethersReadonlyProvider, initialMockChains, isConnected } = useMetaMaskEthersSigner();
  const { instance } = useFhevm({ provider: provider!, chainId, enabled: true, initialMockChains });
  const em = useEventManager({ instance, chainId, ethersSigner, ethersReadonlyProvider });
  const [now, setNow] = useState<number>(Math.floor(Date.now()/1000));
  const [metaOpen, setMetaOpen] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | undefined>(undefined);
  const [meta, setMeta] = useState<{ title?: string; location?: string; description?: string } | undefined>(undefined);
  const [hasDecryptAuth, setHasDecryptAuth] = useState(false);

  useEffect(() => { 
    if (!Number.isFinite(eventId)) return;
    em.loadEvent(eventId); 
    const t = setInterval(()=>setNow(Math.floor(Date.now()/1000)), 1000); 
    return ()=>clearInterval(t); 
  }, [em.loadEvent, eventId]);

  const started = em.event ? Number(em.event.startTime) <= now : false;
  const ended = em.event ? now > Number(em.event.endTime) : false;
  const canSignIn = started && !ended && isConnected;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">📋 Exhibit Details {Number.isFinite(eventId) ? `#${eventId}` : ""}</h2>
        </div>

        {!Number.isFinite(eventId) ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">❓</div>
            <p className="text-white/60">Missing or invalid event id. Try /event?id=1</p>
          </div>
        ) : em.event ? (
          <div className="space-y-6">
            <div className="card space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Information</h3>
                  <div className="space-y-2 text-white/80">
                    <p><span className="text-white/60">📦 IPFS CID:</span> {em.event.metadataCID}</p>
                    <p><span className="text-white/60">👤 Organizer:</span> {em.event.organizer.slice(0,6)}...{em.event.organizer.slice(-4)}</p>
                    <p><span className="text-white/60">⏰ Starts:</span> {new Date(Number(em.event.startTime)*1000).toLocaleString()}</p>
                    <p><span className="text-white/60">⏰ Ends:</span> {new Date(Number(em.event.endTime)*1000).toLocaleString()}</p>
                    <p><span className="text-white/60">🎨 NFT Pass:</span> {em.event.mintPOAP ? "✅ Enabled" : "❌ Disabled"}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <button
                    className="btn-primary"
                    onClick={async () => {
                      if (metaOpen) { setMetaOpen(false); return; }
                      if (!hasDecryptAuth) {
                        try {
                          if (!instance || !ethersSigner || !em.contractAddress) throw new Error("no instance/signer");
                          const storage = new GenericStringInMemoryStorage();
                          const sig = await FhevmDecryptionSignature.loadOrSign(
                            instance,
                            [em.contractAddress],
                            ethersSigner,
                            storage
                          );
                          if (!sig) throw new Error("no signature");
                          setHasDecryptAuth(true);
                        } catch {
                          setMetaError("Decryption authorization required (sign-in or organizer wallet)");
                          setMetaOpen(true);
                          return;
                        }
                      }
                      setMetaOpen(true);
                      if (meta) return;
                      try {
                        setMetaLoading(true); setMetaError(undefined);
                        const currentEvent = em.event;
                        if (!currentEvent) throw new Error("event not loaded");
                        const url = buildIpfsGatewayUrl(currentEvent.metadataCID);
                        const res = await fetch(url);
                        if (!res.ok) throw new Error(`IPFS ${res.status}`);
                        const j = await res.json();
                        setMeta({ title: j.title, location: j.location, description: j.description });
                      } catch {
                        setMetaError("Failed to fetch IPFS details");
                      } finally { setMetaLoading(false); }
                    }}
                  >
                    {metaOpen ? "Hide details" : (!hasDecryptAuth ? "🔐 View details (auth)" : "View details")}
                  </button>
                  {ended ? (
                    <span className="badge bg-gray-500/20 text-gray-300">Ended</span>
                  ) : started ? (
                    <span className="badge-success animate-pulse">Ongoing</span>
                  ) : (
                    <span className="badge-warning">Upcoming</span>
                  )}
                </div>
              </div>
              {metaOpen && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  {metaLoading ? (
                    <p className="text-white/70">🔄 Loading details from IPFS...</p>
                  ) : metaError ? (
                    <p className="text-red-300">{metaError}</p>
                  ) : meta ? (
                    <div className="space-y-2">
                      {meta.title && (<p><span className="text-white/60">📝 Title:</span> {meta.title}</p>)}
                      {meta.location && (<p><span className="text-white/60">📍 Location:</span> {meta.location}</p>)}
                      {meta.description && (
                        <div>
                          <p className="text-white/60">📄 Description:</p>
                          <p className="whitespace-pre-wrap">{meta.description}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-white/70">No details found</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold mb-4">🔐 Encrypted Stats</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">Encrypted count handle</p>
                    <p className="font-mono text-xs break-all">{em.countHandle || "Loading..."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">Plain attendance</p>
                    <p className="text-2xl font-bold">{em.clearCount !== undefined ? String(em.clearCount) : "🔒 Not decrypted"}</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold mb-4">⚡ Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={()=>Number.isFinite(eventId) && em.signIn(eventId)} 
                    disabled={!Number.isFinite(eventId) || !canSignIn || em.isSigningIn}
                    className="btn-gradient w-full disabled:opacity-50"
                  >
                    {em.isSigningIn ? "🔄 Checking in..." : canSignIn ? "✍️ Check-in now" : ended ? "❌ Ended" : !started ? "⏰ Not started" : "🔗 Connect wallet first"}
                  </button>
                  <button 
                    onClick={em.decryptCount} 
                    disabled={!em.countHandle || !instance || !ethersSigner}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    🔓 Decrypt attendance
                  </button>
                </div>
              </div>
            </div>

            {em.message && (
              <div className={`card ${/success|succeed|decrypted/i.test(em.message) ? 'bg-green-500/10 border-green-400/30' : /fail|error/i.test(em.message) ? 'bg-red-500/10 border-red-400/30' : 'bg-blue-500/10 border-blue-400/30'}`}>
                <p className="font-medium">{em.message}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-white/60">{em.message || "Loading exhibit..."}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/60">Loading...</div>}>
      <EventDetailInner />
    </Suspense>
  );
}

