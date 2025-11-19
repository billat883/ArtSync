"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { Navbar } from "@/src/components/Navbar";
import Link from "next/link";

export default function QRStaticPage() {
  return (
    <Suspense fallback={<div className="min-h-screen"><Navbar /><main className="mx-auto max-w-4xl px-6 py-12"><div className="card p-8 text-center">Loading...</div></main></div>}>
      <QRInner />
    </Suspense>
  );
}

function QRInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" && id ? `${window.location.origin}/event/${id}` : "";

  useEffect(() => {
    if (!canvasRef.current || !id) return;
    QRCode.toCanvas(canvasRef.current, url, { 
      width: 400, 
      margin: 2, 
      color: { dark: "#6C4FF7", light: "#ffffff" } 
    });
  }, [url, id]);

  const copyLink = () => {
    if (!url) return;
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
          <p className="text-white/60">Event #{id || "—"}</p>
        </div>

        <div className="card text-center space-y-6 max-w-2xl mx-auto">
          {/* QR Code */}
          <div className="inline-block p-8 bg-white rounded-2xl shadow-2xl animate-float">
            {id ? <canvas ref={canvasRef} className="rounded-lg" /> : <div className="text-white/60">Provide ?id=EXHIBIT_ID</div>}
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
                className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
                disabled={!id}
              >
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center pt-4">
            <Link href={id ? `/event/${id}` : "#"} className={`btn-gradient ${!id && 'opacity-30 pointer-events-none'}`}>
              📋 View details
            </Link>
            <Link href="/organizer" className="btn-primary">
              ← Back to dashboard
            </Link>
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


