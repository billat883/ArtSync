"use client";

import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";

export default function Page() {
  return (
    <div className="min-h-screen relative">
      <div className="scanline"></div>
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative z-10 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {/* Split Layout Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-block border border-primary/50 px-4 py-2 text-xs font-mono tracking-[0.3em] text-primary mb-4">
                FHE_ENCRYPTED_EXHIBITIONS
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-mono">
                <span className="text-white">ART</span>
                <span className="text-primary">SYNC</span>
                <br />
                <span className="text-techblue">EXPO</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed font-light max-w-lg">
                On-chain exhibition check-in system with FHE encryption. Privacy-preserved, decentralized, immutable.
              </p>
              
              <div className="flex gap-4 pt-6">
                <Link href="/organizer/create" className="btn-gradient text-sm px-6 py-3 font-mono tracking-wider">
                  [CREATE_EXHIBIT]
                </Link>
                <Link href="/explore" className="btn-primary text-sm px-6 py-3 font-mono tracking-wider">
                  [EXPLORE]
                </Link>
              </div>
            </div>

            {/* Tech Specs Display */}
            <div className="space-y-4">
              <div className="card animate-border-flow p-6">
                <div className="text-xs font-mono text-primary mb-2 tracking-wider">PRIVACY_LAYER</div>
                <div className="text-white/90 text-sm leading-relaxed">
                  FHEVM fully homomorphic encryption. Attendance data encrypted on-chain, decryptable only by authorized parties.
                </div>
              </div>
              <div className="card animate-border-flow p-6" style={{animationDelay: '0.3s'}}>
                <div className="text-xs font-mono text-techblue mb-2 tracking-wider">ON_CHAIN_PROOF</div>
                <div className="text-white/90 text-sm leading-relaxed">
                  Exhibition metadata permanently stored on-chain. Check-in records immutable and verifiable.
                </div>
              </div>
              <div className="card animate-border-flow p-6" style={{animationDelay: '0.6s'}}>
                <div className="text-xs font-mono text-primary mb-2 tracking-wider">NFT_PASSES</div>
                <div className="text-white/90 text-sm leading-relaxed">
                  Optional NFT art passes minting. Permanent record of attendee participation.
                </div>
              </div>
            </div>
          </div>

          {/* Protocol Section */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <div className="inline-block text-2xl font-mono tracking-[0.2em] text-white mb-2">
                [ PROTOCOL_WORKFLOW ]
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'SCHEDULE', desc: 'Create exhibition and deploy on-chain' },
                { step: '02', title: 'DISPLAY_QR', desc: 'Show QR code for check-in' },
                { step: '03', title: 'CHECK_IN', desc: 'FHE encrypted check-in on-chain' },
                { step: '04', title: 'DECRYPT', desc: 'Authorized decryption of stats' }
              ].map((item, i) => (
                <div key={i} className="card group hover:border-primary/60 transition-all">
                  <div className="text-4xl font-mono text-primary/40 mb-3 group-hover:text-primary transition-colors">
                    {item.step}
                  </div>
                  <div className="text-sm font-mono tracking-wider text-white mb-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Terminal Style */}
          <div className="border-2 border-primary/50 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-8 border-b border-primary/30 bg-primary/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              <span className="text-xs font-mono text-white/50 ml-2">terminal://artsync_expo</span>
            </div>
            <div className="pt-8">
              <div className="text-xs font-mono text-white/50 mb-4 tracking-wider">
                $ initialize_exhibition --protocol fhevm
              </div>
              <h2 className="text-3xl font-mono mb-6 text-white tracking-wider">
                READY_TO_DEPLOY?
              </h2>
              <Link href="/organizer/create" className="btn-gradient text-sm px-8 py-3 font-mono inline-block tracking-wider">
                [START_NOW]
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 text-center font-mono text-xs text-white/40 tracking-wider">
          <p>POWERED_BY_FHEVM · ARTSYNC_EXPO · 2025</p>
        </div>
      </footer>
    </div>
  );
}


