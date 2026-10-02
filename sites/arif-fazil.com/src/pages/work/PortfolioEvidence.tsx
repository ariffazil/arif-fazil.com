import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'
import {
  portfolioPdf,
  claims,
  claimsWithheld,
  type PublicationClass,
  type TruthClass,
} from '@/data/work/portfolio'

/**
 * /work/exploration-2013-2026/evidence/ — evidence ledger for the portfolio.
 * Human-readable audit surface: claim → truth class → publication class → source.
 * Machine companion: JSON-LD inline. PUBLICATION_SAFE verified before rendering.
 */

const CREAM = '#FAF7F0'
const GRAPHITE_SOFT = '#5A5A52'
const TEAL = '#0F5E5A'
const GOLD = '#A67C2E'

const truthColor: Record<TruthClass, string> = {
  DOCUMENTED: TEAL,
  SYNTHETIC_EXPLANATORY: GOLD,
  OPINION: GRAPHITE_SOFT,
  WITHHELD: '#8B1A1A',
}

const pubColor: Record<PublicationClass, string> = {
  PUBLICATION_SAFE: TEAL,
  DOCUMENTED_PRIVATE: GRAPHITE_SOFT,
  PUBLIC_SOURCE: GOLD,
  EXCLUDED: '#8B1A1A',
  NEVER_REPRODUCED: '#8B1A1A',
}

export function PortfolioEvidence() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2A2A26]">
      <PageMeta
        title="Exploration Portfolio — Evidence Ledger"
        description="Every claim in the exploration portfolio, tagged by truth class and publication class. Includes what was deliberately withheld, and why."
        path="/work/exploration-2013-2026/evidence/"
      />

      <header className="border-b border-[#DED7C8]" style={{ background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE0 100%)` }}>
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-20">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[11px] tracking-widest uppercase text-[#A67C2E]">
            <Link to="/work/" className="hover:underline">Work</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link to="/work/exploration-2013-2026/" className="hover:underline">Exploration 2013–2026</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#5A5A52]">Evidence</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-[#2A2A26]">
            Evidence Ledger
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-[#5A5A52]">
            This appendix exists so the portfolio can be audited rather than believed. Each claim carries a
            truth class and a publication class. An evidence appendix that only lists what supports the story
            is not an appendix — it is marketing. The withheld list matters as much as the published one.
          </p>
          <p className="mt-4 font-mono text-xs text-[#5A5A52]">
            Source artifact: {portfolioPdf.title} · {portfolioPdf.pages} pages · compiled {portfolioPdf.compiled}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16 space-y-16">
        {/* ── PUBLISHED CLAIMS ─────────────────────────────────────────── */}
        <section aria-labelledby="published">
          <div className="mb-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#A67C2E]">Section 01</span>
            <h2 id="published" className="font-display text-2xl md:text-3xl font-bold text-[#2A2A26] mt-2">
              Published Claims ({claims.length})
            </h2>
            <p className="mt-2 text-sm text-[#5A5A52]">
              Every headline statement in the portfolio, with its strongest supporting source.
            </p>
          </div>
          <div className="space-y-3">
            {claims.map((c) => (
              <article key={c.id} className="rounded-sm border border-[#DED7C8] bg-white p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#A67C2E]">{c.id}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase rounded-sm border px-2 py-0.5" style={{ color: truthColor[c.truth_class], borderColor: truthColor[c.truth_class] }}>
                    {c.truth_class.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase rounded-sm px-2 py-0.5 text-white" style={{ background: pubColor[c.publication_class] }}>
                    {c.publication_class.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm md:text-base font-medium text-[#2A2A26] leading-relaxed">{c.statement}</p>
                <p className="mt-2 font-mono text-[11px] text-[#5A5A52]">
                  Source: {c.source}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── WITHHELD ─────────────────────────────────────────────────── */}
        <section aria-labelledby="withheld">
          <div className="mb-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#A67C2E]">Section 02</span>
            <h2 id="withheld" className="font-display text-2xl md:text-3xl font-bold text-[#2A2A26] mt-2">
              Claims Held Back ({claimsWithheld.length})
            </h2>
            <p className="mt-2 text-sm text-[#5A5A52]">
              Statements considered and deliberately not made. Where a number has no source, the number is
              dropped, not softened.
            </p>
          </div>
          <div className="overflow-x-auto rounded-sm border border-[#DED7C8] bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#DED7C8] bg-[#F0EBE0]">
                  <th scope="col" className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-[#A67C2E]">Statement considered</th>
                  <th scope="col" className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-[#A67C2E]">Disposition</th>
                  <th scope="col" className="px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-[#A67C2E]">Reason</th>
                </tr>
              </thead>
              <tbody>
                {claimsWithheld.map((w) => (
                  <tr key={w.id} className="border-b border-[#DED7C8] last:border-0">
                    <td className="px-4 py-3 text-[#2A2A26]">
                      <span className="font-mono text-[10px] text-[#A67C2E] mr-2">{w.id}</span>
                      {w.considered}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] tracking-widest uppercase rounded-sm px-2 py-0.5 whitespace-nowrap text-white" style={{ background: '#8B1A1A' }}>
                        {w.disposition.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5A5A52] leading-relaxed">{w.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-[#5A5A52]">
            On small screens this table scrolls horizontally by design; the same content is readable in the
            frozen PDF (Appendix II) without scrolling.
          </p>
        </section>

        {/* ── CLASSES GLOSSARY ─────────────────────────────────────────── */}
        <section aria-labelledby="classes">
          <div className="mb-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#A67C2E]">Section 03</span>
            <h2 id="classes" className="font-display text-2xl md:text-3xl font-bold text-[#2A2A26] mt-2">
              Truth & Publication Classes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-sm border border-[#DED7C8] bg-white p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#0F5E5A] mb-4">Truth classes</h3>
              <dl className="space-y-3 text-sm text-[#5A5A52]">
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">DOCUMENTED</dt><dd>Anchored to a file-backed record (CV, career form, public registry).</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">SYNTHETIC_EXPLANATORY</dt><dd>Figure or example constructed to explain method — carries no real data.</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">OPINION</dt><dd>Position held as an opinion, labelled as such.</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">WITHHELD</dt><dd>Exists in the record; not published. Reason stated.</dd></div>
              </dl>
            </div>
            <div className="rounded-sm border border-[#DED7C8] bg-white p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#0F5E5A] mb-4">Publication classes</h3>
              <dl className="space-y-3 text-sm text-[#5A5A52]">
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">PUBLICATION_SAFE</dt><dd>Verified safe for public rendering. Required gate before any case detail renders.</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">DOCUMENTED_PRIVATE</dt><dd>Documented in private records. Not automatically publishable.</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">PUBLIC_SOURCE</dt><dd>Traceable to public literature or registries.</dd></div>
                <div><dt className="font-mono text-xs font-bold text-[#2A2A26]">EXCLUDED / NEVER_REPRODUCED</dt><dd>Confidential by doctrine: volumes, economics, maps, logs, coordinates.</dd></div>
              </dl>
            </div>
          </div>
          <div className="mt-6 rounded-sm border border-[#A67C2E]/40 bg-[#A67C2E]/5 p-5">
            <p className="text-sm leading-relaxed text-[#5A5A52]">
              <span className="font-mono text-xs font-bold uppercase text-[#A67C2E]">Confidentiality posture — </span>
              this artifact contains no proprietary reservoir, well-test, acreage, coordinate, or economic data.
              Visual content is synthetic or public-domain. Where an evidence source was private, it is cited as a
              source category but its contents are abstracted, not reproduced. Reading this evidence grants zero authority.
            </p>
          </div>
        </section>

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav aria-label="Continue" className="flex flex-wrap gap-4 border-t border-[#DED7C8] pt-8">
          <Link to="/work/exploration-2013-2026/" className="font-mono text-xs tracking-widest uppercase text-[#0F5E5A] hover:text-[#A67C2E]">← Back to portfolio</Link>
          <a href={portfolioPdf.path} download className="font-mono text-xs tracking-widest uppercase text-[#0F5E5A] hover:text-[#A67C2E]">Download frozen PDF</a>
          <Link to="/evidence/" className="font-mono text-xs tracking-widest uppercase text-[#0F5E5A] hover:text-[#A67C2E]">Site-wide evidence register</Link>
        </nav>
      </main>
    </div>
  )
}

export default PortfolioEvidence
