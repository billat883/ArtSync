"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Navbar } from "@/src/components/Navbar";
import Link from "next/link";

function QRInner() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const url = typeof window !== "undefined" ? `${window.location.origin}${basePath}/event?id=${encodeURIComponent(id)}` : "";

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { 
      width: 400, 
      margin: 2, 
      color: { dark: "#6C4FF7", light: "#ffffff" } 
    });
  }, [url]);

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
          <p className="text-white/60">Event #{id || "?"}</p>
        </div>

        <div className="card text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-block p-8 bg-white rounded-2xl shadow-2xl animate-float">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

        <div className="space-y-3">
            <p className="text-white/60 text-sm">Scan the QR or open the link to check in</p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input type="text" value={url} readOnly className="flex-1 bg-transparent outline-none text-sm font-mono" />
              <button onClick={copyLink} className="btn-primary py-2 px-4 text-sm">
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link href={`/event?id=${encodeURIComponent(id)}`} className="btn-gradient">
              📋 View details
            </Link>
            <Link href="/organizer" className="btn-primary">
              ← Back to dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-white/50 text-sm">
          <p>💡 Tip: Right click the QR to save, or use browser print</p>
        </div>
      </main>
    </div>
  );
}

export default function QRPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/60">Loading...</div>}>
      <QRInner />
    </Suspense>
  );
}

