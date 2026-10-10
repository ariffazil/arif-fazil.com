import { Link } from 'react-router-dom';
import { discoveries } from '@/data/discoveries';

export function EvidenceHub() {
  const wells = discoveries.filter((d) => d.category === 'wells');

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2] pb-24">
      {/* ── HEADER ── */}
      <div className="border-b border-[#1F2733] bg-[#0A0D14] py-12 px-6">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Reality Atlas · Witness Substrate</span>
            <span className="text-[#1F2733]">/</span>
            <span>First-Party Evidence</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Evidence Register
          </h1>

          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            Reality is not established by narrative or synthetic consensus. Every claim across the Reality Atlas
            must resolve into physical rocks, audited balance sheets, market trades, or verifiable telemetry.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-6 py-12 space-y-16">
        {/* ── 1. INSTITUTION & FISCAL: PETRONAS VITALS ── */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1F2733]">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] mb-1">
                Domain: Institution & Economics
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                PETRONAS Vitals — Dompet vs Tangki
              </h2>
            </div>
            <a
              href="/vitals/"
              className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
            >
              Open Full Vitals Register →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-2">
                First-Party Source
              </div>
              <h3 className="font-display text-lg font-bold text-[#EDEAE2] mb-2">
                Audited Financial Reports
              </h3>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                National oil company cash balance, CAPEX allocation, and dividend extraction ratios vs sovereign needs.
              </p>
              <div className="font-mono text-xs text-[#31C48D]">● Verified Provenance</div>
            </div>

            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-2">
                The Tangki Dilemma
              </div>
              <h3 className="font-display text-lg font-bold text-[#EDEAE2] mb-2">
                Reserve Replacement Horizons
              </h3>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                Depletion rates across mature Peninsular, Sarawak, and deepwater Sabah assets against replenishment CAPEX.
              </p>
              <div className="font-mono text-xs text-[#F59E0B]">▲ Structural Tension</div>
            </div>

            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-2">
                  Actionable Access
                </div>
                <h3 className="font-display text-lg font-bold text-[#EDEAE2] mb-2">
                  Interactive Audit Terminal
                </h3>
                <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                  Visualized balance sheet indicators and forward capital constraint curves.
                </p>
              </div>
              <a
                href="/vitals/"
                className="w-full py-2.5 rounded bg-[#10141D] border border-[#1F2733] hover:border-[#EDEAE2]/40 text-center font-mono text-xs uppercase tracking-wider text-[#EDEAE2] transition-colors"
              >
                Inspect Vitals Surface →
              </a>
            </div>
          </div>
        </section>

        {/* ── 2. PHYSICAL GROUND: SUBSURFACE WELLS & BASINS ── */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1F2733]">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-1">
                Domain: Earth & Subsurface
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Subsurface Well Portfolio & Ground Reality
              </h2>
            </div>
            <a
              href="/earth/"
              className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
            >
              Open 3D Earth Globe →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wells.slice(0, 4).map((w) => (
              <div
                key={w.id}
                className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-display text-lg font-bold text-[#EDEAE2]">
                      {w.title}
                    </h3>
                    <span className="font-mono text-xs text-[#9AA0A8]">{w.year}</span>
                  </div>
                  <div className="font-mono text-[11px] uppercase text-[#9AA0A8]/70 mb-3">
                    {w.location}
                  </div>
                  <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                    {w.summary}
                  </p>
                  <ul className="space-y-1 mb-4 border-l-2 border-[#1F2733] pl-3">
                    {w.evidence.map((e, idx) => (
                      <li key={idx} className="font-sans text-xs text-[#9AA0A8]/90">
                        — {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#1F2733] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[#9AA0A8]/60">
                    Role: {w.role}
                  </span>
                  <a
                    href="/earth/"
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
                  >
                    Explore Ground →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        
        {/* ── CONSEQUENCE EPISODE: INTENT → EVIDENCE → DECISION → EXECUTION → CONSEQUENCE → CONTINUITY ── */}
        <section className="rounded-xl border border-[#1F2733] bg-[#0A0D14] p-8 mb-16">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1F2733]">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#10B981] mb-1">
                Causal Trajectory · Non-Synthetic Chain
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Consequence Episode
              </h2>
            </div>
            <span className="font-mono text-xs text-[#9AA0A8] uppercase tracking-wider">
              Strict Falsifiability
            </span>
          </div>

          <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-6 max-w-3xl">
            No action or claim is sealed without tracing its consequence arc. If any evidence packet is missing, the chain fail-closes explicitly rather than fabricating closure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 font-mono text-xs mb-8">
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#E4572E] font-bold block mb-1">01. INTENT</span>
              <span className="text-[#EDEAE2]">Ground public surface in witnessed reality</span>
            </div>
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#38BDF8] font-bold block mb-1">02. EVIDENCE</span>
              <span className="text-[#EDEAE2]">Observed endpoints & hash-verified files</span>
            </div>
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#F59E0B] font-bold block mb-1">03. DECISION</span>
              <span className="text-[#EDEAE2]">Zero fake quotes, UNKNOWN preserved</span>
            </div>
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#10B981] font-bold block mb-1">04. EXECUTION</span>
              <span className="text-[#EDEAE2]">Atomic build & deployment pass</span>
            </div>
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#A78BFA] font-bold block mb-1">05. CONSEQUENCE</span>
              <span className="text-[#EDEAE2]">Public projections match reality without drift</span>
            </div>
            <div className="p-3 rounded bg-[#0F131D] border border-[#1F2733]">
              <span className="text-[#9AA0A8] font-bold block mb-1">06. CONTINUITY</span>
              <span className="text-[#EDEAE2]">Immutable audit trail & rollback readiness</span>
            </div>
          </div>

          <div className="p-4 rounded border border-[#1F2733] bg-[#07090E] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[#9AA0A8] block">UNVERIFIED PACKET FALLBACK TEST:</span>
              <span className="font-mono text-xs text-[#E4572E]">EVIDENCE UNAVAILABLE · DECISION NOT DERIVED · EXECUTION NOT CLAIMED</span>
            </div>
            <div className="font-mono text-[11px] text-[#9AA0A8]">
              Public Digest Ref: <code className="text-[#EDEAE2]">hash-bound::ep-20261010-001</code>
            </div>
          </div>
        </section>
        {/* ── 3. COMMODITY & MARKET TERMINALS ── */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1F2733]">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#F59E0B] mb-1">
                Domain: Economics & Physical Commodities
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Commodity & Market Terminals
              </h2>
            </div>
            <Link
              to="/economics"
              className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
            >
              Macroeconomics Surface →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Oil (Brent)', href: '/oil', desc: 'Crude Benchmarks' },
              { label: 'Gas (Henry Hub)', href: '/gas', desc: 'LNG Export Parity' },
              { label: 'Gold (XAUUSD)', href: '/gold', desc: 'Two-Rail Simpan/Trade' },
              { label: 'KLCI Index', href: '/klci', desc: 'Bursa Equities' },
              { label: 'USDMYR', href: '/usdmyr', desc: 'Sovereign FX' },
            ].map((term) => (
              <Link
                key={term.href}
                to={term.href}
                className="p-4 rounded-lg border border-[#1F2733] bg-[#0F131D] hover:border-[#F59E0B]/60 transition-colors group"
              >
                <div className="font-display font-bold text-base text-[#EDEAE2] group-hover:text-[#F59E0B] transition-colors">
                  {term.label}
                </div>
                <div className="font-mono text-[11px] text-[#9AA0A8] mt-1">
                  {term.desc}
                </div>
                <div className="font-mono text-[10px] text-[#E4572E] mt-3 uppercase tracking-wider">
                  Open Terminal →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
