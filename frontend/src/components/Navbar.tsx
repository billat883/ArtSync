"use client";

import Link from "next/link";
import { useMetaMaskEthersSigner } from "@/src/hooks/metamask/useMetaMaskEthersSigner";

export function Navbar() {
  const { isConnected, connect, accounts, chainId } = useMetaMaskEthersSigner();
  const addr = accounts?.[0];
  const short = addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-bold text-2xl text-primary group-hover:border-techblue group-hover:text-techblue transition-all duration-300 font-mono">
            A
          </div>
          <div className="leading-tight">
            <div className="font-bold text-xl tracking-widest font-mono">ARTSYNC</div>
            <div className="text-[10px] text-white/50 tracking-[0.2em] font-mono">FHE_EXPO</div>
          </div>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Link 
            href="/organizer" 
            className="px-4 py-2 border border-transparent hover:border-white/20 transition-all text-sm font-mono tracking-wider"
          >
            [ORGANIZE]
          </Link>
          <Link 
            href="/explore" 
            className="px-4 py-2 border border-transparent hover:border-white/20 transition-all text-sm font-mono tracking-wider"
          >
            [EXPLORE]
          </Link>
          <Link 
            href="/badges" 
            className="px-4 py-2 border border-transparent hover:border-white/20 transition-all text-sm font-mono tracking-wider"
          >
            [PASSES]
          </Link>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="badge-success">
                <span className="w-1.5 h-1.5 bg-green-400"></span>
                {short}
              </span>
              <span className="badge-info">{chainId}</span>
            </div>
          ) : (
            <button className="btn-gradient px-4 py-2 text-sm font-mono" onClick={connect}>
              [CONNECT]
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}


