"use client";

import { Navbar } from "@/src/components/Navbar";
import { useMetaMaskEthersSigner } from "@/src/hooks/metamask/useMetaMaskEthersSigner";
import { useBadges } from "@/src/hooks/useBadges";

export default function BadgesPage() {
  const { chainId, ethersSigner, ethersReadonlyProvider } = useMetaMaskEthersSigner();
  const { items, loading, error, claim } = useBadges({ chainId, signer: ethersSigner, readonlyProvider: ethersReadonlyProvider });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">🏅 My Passes</h2>
          <p className="text-white/60">Claim your NFT art passes after successful check-in</p>
        </div>

        {loading && <div className="card text-center py-10">Loading...</div>}
        {error && <div className="card text-center py-10 text-red-300">{error}</div>}

        {!loading && !error && (
          <div className="space-y-6">
            <section>
              <h3 className="text-2xl font-bold mb-3">Claimable</h3>
              <List items={items.filter(i => i.canClaim)} onClaim={claim} emptyHint="No passes available to claim" />
            </section>
            <section>
              <h3 className="text-2xl font-bold mb-3">Claimed / Checked-in</h3>
              <List items={items.filter(i => !i.canClaim && i.hasSigned)} onClaim={claim} emptyHint="No records yet" />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function List({ items, onClaim, emptyHint }: { items: { id: number; canClaim: boolean; hasSigned: boolean; claimed: boolean }[]; onClaim: (eventId: number) => Promise<void>; emptyHint: string; }) {
  if (items.length === 0) return <div className="card text-center py-8 text-white/60">{emptyHint}</div>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((i) => (
        <div key={i.id} className="card flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">Event #{i.id}</div>
            <div className="text-white/60 text-sm">{i.canClaim ? "Claimable" : i.claimed ? "Claimed" : i.hasSigned ? "Checked-in" : ""}</div>
          </div>
          <div>
            {i.canClaim ? (
              <button className="btn-gradient" onClick={async () => await onClaim(i.id)}>🎉 Claim</button>
            ) : (
              <button className="btn-primary" disabled>Not available</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


