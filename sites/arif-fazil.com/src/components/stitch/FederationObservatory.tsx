import React, { useEffect, useState } from 'react';
import { LayoutGrid } from './LayoutGrid';

export interface FederationFloor {
  id: string;
  name: string;
  type?: string;
  one_liner?: string;
}

/**
 * Screen 04 — arifOS Federation Observatory
 * Structure from Stitch wireframe `arifos-federation-observatory-dark-mode.html`.
 * F2 TRUTH rework (2026-11-04): the original component shipped fabricated
 * telemetry (fake GB/s, 99.2% deliberation, 41°C substrate, an invented
 * VAULT999 receipt log, fictional floor names). All of it was stripped.
 * Floors now come LIVE from the canonical /floors.json; status claims link
 * to the real reporters (/status.json, /ledger, /api/federation-probe)
 * instead of being asserted here. This page reports, never adjudicates.
 */
export const FederationObservatory: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [floors, setFloors] = useState<FederationFloor[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'live' | 'unreachable'>('loading');

  useEffect(() => {
    fetch('/floors.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then((d) => {
        setFloors(Array.isArray(d) ? d : Array.isArray(d?.floors) ? d.floors : []);
        setLoadState('live');
      })
      .catch(() => setLoadState('unreachable'));
  }, []);

  return (
    <LayoutGrid territory="ARIFOS">
      <div className={`rounded-canon ${className}`.trim()}>
        <div className="flex flex-col w-full px-margin-mobile pb-space-xl">

          <header className="flex flex-col gap-space-xs mt-space-sm p-space-sm rounded-canon bg-[#11151c]/80 border border-forge-iron/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-forge-dim">
              <span className="font-mono text-[10px] tracking-widest uppercase text-forge-dim font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-canon bg-sky-400 animate-ping"></span>
                OBSERVATORY // FEDERATION // F1–F13
              </span>
              <span className="font-mono text-[10px] text-sky-400 font-bold tracking-wider">
                {loadState === 'live' ? `${floors.length} FLOORS · CANON LIVE` : loadState === 'loading' ? 'LOADING CANON…' : 'CANON UNREACHABLE'}
              </span>
            </div>
          </header>

          <section className="flex flex-col gap-space-sm mt-space-lg">
            <h1 className="font-display text-headline-lg text-white tracking-tight leading-tight font-serif">
              arifOS Federation Observatory
            </h1>
            <p className="font-body text-body-md text-forge-white italic">
              Constitutional floors, organs, and evidence chains — observed, not adjudicated.
            </p>
            <p className="font-mono text-[11px] text-forge-dim leading-relaxed">
              Floors enforced by the arifOS kernel. This page reports, never adjudicates.{' '}
              <a className="text-sky-300 underline" href="/status.json">/status.json</a> ·{' '}
              <a className="text-human-300 underline" href="/ledger">/ledger</a> ·{' '}
              <a className="text-sky-300 underline" href="/api/federation-probe">/api/federation-probe</a>
            </p>
          </section>

          <section className="flex flex-col gap-space-sm mt-space-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="mi-glyph text-[18px] text-primary">⛨</span>
                <h2 className="font-display text-headline-sm text-on-surface">Constitutional Floors</h2>
              </div>
              <span className="font-mono text-label-sm text-primary bg-[#0d1424] border border-primary/40 px-2 py-0.5 rounded-canon font-medium">
                {loadState === 'live' ? `${floors.length} / ${floors.length} IN CANON` : 'SOURCE: /floors.json'}
              </span>
            </div>

            {loadState === 'unreachable' && (
              <p className="font-mono text-label-sm text-forge-dim p-space-sm bg-surface-container-low border border-forge-iron rounded-canon">
                /floors.json unreachable — no floor state is asserted here. Treat advertised
                capabilities as unverified until the canon source responds.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              {floors.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 bg-surface-container-low border border-outline-variant/50 rounded-canon"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className={`font-mono text-label-sm font-bold w-7 ${f.id === 'F13' ? 'text-red-400' : 'text-primary'}`}>{f.id}</span>
                    <span className="font-body text-body-sm text-on-surface font-medium truncate">{f.name}</span>
                    {f.type && (
                      <span className="font-mono text-[9px] tracking-widest text-forge-dim border border-forge-iron px-1.5 py-0.5 rounded-canon">
                        {f.type}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-label-sm text-on-surface-variant truncate max-w-[45%] hidden sm:block">
                    {f.one_liner || ''}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-space-lg flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="mi-glyph text-[18px] text-human-400">≡</span>
              <h2 className="font-display text-headline-sm text-on-surface">Evidence Chains</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
              <a href="/ledger" className="bg-surface-container border border-outline-variant/60 rounded-canon p-space-sm flex flex-col gap-1 no-underline hover:border-primary/40 transition-colors">
                <span className="font-mono text-label-sm text-human-400 font-semibold tracking-wide">WITNESS LEDGER ↗</span>
                <span className="font-mono text-[10px] text-on-surface-variant">VAULT999 receipts — live at /ledger</span>
              </a>
              <a href="/status.json" className="bg-surface-container border border-outline-variant/60 rounded-canon p-space-sm flex flex-col gap-1 no-underline hover:border-primary/40 transition-colors">
                <span className="font-mono text-label-sm text-sky-300 font-semibold tracking-wide">RUNTIME STATUS ↗</span>
                <span className="font-mono text-[10px] text-on-surface-variant">organ endpoints & floor compliance</span>
              </a>
              <a href="/999/" className="bg-surface-container border border-outline-variant/60 rounded-canon p-space-sm flex flex-col gap-1 no-underline hover:border-primary/40 transition-colors">
                <span className="font-mono text-label-sm text-forge-dim font-semibold tracking-wide">PROOF CHAMBER ↗</span>
                <span className="font-mono text-[10px] text-on-surface-variant">verification surfaces & hashes</span>
              </a>
            </div>
          </section>

        </div>
      </div>
    </LayoutGrid>
  );
};

export default FederationObservatory;
