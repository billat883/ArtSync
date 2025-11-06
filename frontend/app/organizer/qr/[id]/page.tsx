"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Navbar } from "@/src/components/Navbar";
import Link from "next/link";

export default function QRPage() {
  const params = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/event/${params.id}` : "";

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { 
      width: 400, 
      margin: 2, 
      color: { 
        dark: "#6C4FF7", 
        light: "#ffffff" 
      } 
    });
  }, [url]);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-2">📱 Check-in QR</h2>
          <p className="text-white/60">Event #{params.id}</p>
        </div>

        <div className="card text-center space-y-6 max-w-2xl mx-auto">
          {/* QR Code */}
          <div className="inline-block p-8 bg-white rounded-2xl shadow-2xl animate-float">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          {/* URL Display */}
          <div className="space-y-3">
            <p className="text-white/60 text-sm">Scan the QR or open the link to check in</p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input 
                type="text" 
                value={url} 
                readOnly 
                className="flex-1 bg-transparent outline-none text-sm font-mono"
              />
              <button 
                onClick={copyLink}
                className="btn-primary py-2 px-4 text-sm"
              >
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center pt-4">
            <Link href={`/event/${params.id}`} className="btn-gradient">
              📋 View details
            </Link>
            <Link href="/organizer" className="btn-primary">
              ← Back to dashboard
            </Link>
          </div>

          {/* Tips */}
          <div className="card bg-blue-500/10 border-blue-400/20 text-left">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span>💡</span> Usage tips
            </h4>
            <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
              <li>Display this QR at the venue</li>
              <li>Attendees scan to access the check-in page</li>
              <li>Check-in requires Web3 wallet (MetaMask)</li>
              <li>Data is written on-chain with FHE encryption</li>
            </ul>
          </div>
        </div>

        {/* Download Tips */}
        <div className="mt-8 text-center text-white/50 text-sm">
          <p>💡 Tip: Right click the QR to save, or use browser print</p>
        </div>
      </main>
    </div>
  );
}
