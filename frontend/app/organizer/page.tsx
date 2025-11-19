"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";

export default function OrganizerPage() {
  const [id, setId] = useState("");
  
  return (
    <div className="min-h-screen relative">
      <div className="scanline"></div>
      <Navbar />
      
      <main className="relative z-10 pt-24 mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12">
          <div className="inline-block border border-primary/50 px-3 py-1 text-xs font-mono tracking-[0.2em] text-primary mb-4">
            ORGANIZER_DASHBOARD
          </div>
          <h2 className="text-5xl font-bold font-mono mb-3 tracking-tight">CONTROL_PANEL</h2>
          <p className="text-white/50 font-mono text-sm tracking-wider">Manage exhibitions and access control</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Create Event Card */}
          <Link href="/organizer/create" className="card group cursor-pointer hover:border-primary transition-all p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl font-mono text-primary/60 group-hover:text-primary transition-colors">+</div>
              <div className="text-xs font-mono text-white/40 border border-white/20 px-2 py-1">NEW</div>
            </div>
            <h3 className="text-xl font-bold font-mono mb-3 tracking-wider">[CREATE_EXHIBIT]</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Create new exhibition and deploy on-chain · IPFS metadata storage supported
            </p>
          </Link>

          {/* Quick Access Card */}
          <div className="card p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl font-mono text-techblue/60">#</div>
              <div className="text-xs font-mono text-white/40 border border-white/20 px-2 py-1">QUICK</div>
            </div>
            <h3 className="text-xl font-bold font-mono mb-3 tracking-wider">[JUMP_TO]</h3>
            <p className="text-sm text-white/60 mb-4">Enter exhibit ID for quick access</p>
            
            <div className="space-y-3">
              <input 
                className="input-field font-mono text-sm" 
                placeholder="EXHIBIT_ID" 
                value={id} 
                onChange={e=>setId(e.target.value)}
                type="number"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href={id ? `/event?id=${id}` : "#"} 
                  className={`btn-gradient text-center text-xs font-mono tracking-wider ${!id && 'opacity-30 pointer-events-none'}`}
                >
                  DETAILS
                </Link>
                <Link 
                href={id ? `/organizer/qr?id=${id}` : "#"}
                  className={`btn-primary text-center text-xs font-mono tracking-wider ${!id && 'opacity-30 pointer-events-none'}`}
                >
                  QR_CODE
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Info Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'ON_CHAIN', value: 'IMMUTABLE', icon: '▣' },
            { label: 'PRIVACY', value: 'FHE_ENCRYPTED', icon: '▦' },
            { label: 'NFT_MINT', value: 'OPTIONAL', icon: '▧' }
          ].map((item, i) => (
            <div key={i} className="border border-white/20 p-4 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/50 tracking-wider">{item.label}</span>
                <span className="text-primary/60 text-xl">{item.icon}</span>
              </div>
              <div className="text-sm font-mono text-white tracking-wide">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Protocol Guide */}
        <div className="border-2 border-primary/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-primary"></div>
            <h3 className="text-lg font-mono tracking-wider text-white">PROTOCOL_GUIDE</h3>
          </div>
          <div className="space-y-4 text-sm font-mono text-white/70 leading-relaxed">
            <div className="flex gap-4">
              <span className="text-primary shrink-0">[01]</span>
              <p>Create exhibit → Fill metadata → IPFS storage → On-chain deployment</p>
            </div>
            <div className="flex gap-4">
              <span className="text-primary shrink-0">[02]</span>
              <p>Generate QR code → Display on-site → Users scan to access</p>
            </div>
            <div className="flex gap-4">
              <span className="text-primary shrink-0">[03]</span>
              <p>User connects wallet → FHE encrypted check-in → Write on-chain</p>
            </div>
            <div className="flex gap-4">
              <span className="text-primary shrink-0">[04]</span>
              <p>Authorized decryption → View attendance count → Verifiable data</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
