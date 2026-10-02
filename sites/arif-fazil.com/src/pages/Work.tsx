import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'
import { discoveries } from '@/data/discoveries'
import { SeismicAmplitudeCanvas } from '@/components/SeismicAmplitudeCanvas'

/**
 * Featured cases — decision-first summaries for time-constrained evaluators.
 * Facts are derived from the corresponding entries in @/data/discoveries.
 */
const featuredCases = [
  {
    id: 'bekantan-1',
    decision: 'Evaluate shallow clastic reservoir potential on the Cendor Graben flank.',
    outcome: 'Shallowest flowing oil discovery recorded in the Malay Basin.',
  },
  {
    id: 'lebah-emas-1',
    decision: 'Test a frontier wildcat on the western hinge fault zone, Group H–J sands.',
    outcome: '11 hydrocarbon-bearing intervals; opened a new hinge play fairway. Block PM6/12 subsequently entered commercial farm-out arrangements.',
  },
  {
    id: 'bunga-tasbih-1',
    decision: 'Evaluate syn-rift and post-rift plays on the eastern basin margin.',
    outcome: 'Commercial oil in post-rift Group I and J sands; syn-rift risk recalibrated across the margin; supported an MBR+ Round I Small Field Asset PSC award (2024).',
  },
] as const

const organBadges: Record<string, { badge: string; color: string }> = {
  mcp: { badge: 'GATEWAY', color: 'border-[#9AA0A8]/30 text-[#9AA0A8] bg-[#9AA0A8]/10' },
  hermes: { badge: 'VOICE', color: 'border-[#E4572E]/30 text-[#E4572E] bg-[#E4572E]/10' },
  geox: { badge: 'EARTH', color: 'border-[#31C48D]/30 text-[#31C48D] bg-[#31C48D]/10' },
  well: { badge: 'VITALITY', color: 'border-[#D4A853]/30 text-[#D4A853] bg-[#D4A853]/10' },
  wealth: { badge: 'CAPITAL', color: 'border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10' },
  aaa: { badge: 'FEDERATION', color: 'border-[#91B0F2]/30 text-[#91B0F2] bg-[#91B0F2]/10' },
  arifos: { badge: 'KERNEL', color: 'border-[#00D4AA]/30 text-[#00D4AA] bg-[#00D4AA]/10' },
  forge: { badge: 'EXECUTION', color: 'border-[#E4572E]/30 text-[#E4572E] bg-[#E4572E]/10' },
}

export const agenticMirrors = [
  { label: 'mcp', name: 'MCP Gateway', href: 'https://mcp.arif-fazil.com/mcp', desc: 'WebMCP & Tool Discovery' },
  { label: 'hermes', name: 'HERMES', href: 'https://hermes.arif-fazil.com', desc: 'Meaning Integrity & Civic Voice' },
  { label: 'geox', name: 'GEOX', href: 'https://geox.arif-fazil.com', desc: 'Subsurface Earth Engine' },
  { label: 'well', name: 'WELL', href: 'https://well.arif-fazil.com', desc: 'Vitality & Homeostasis' },
  { label: 'wealth', name: 'WEALTH', href: 'https://wealth.arif-fazil.com', desc: 'Capital & Claims Registry' },
  { label: 'aaa', name: 'AAA', href: 'https://aaa.arif-fazil.com', desc: 'Sovereign Agent Cards & Skills' },
  { label: 'arifos', name: 'arifOS', href: 'https://arifos.arif-fazil.com', desc: 'F1-F13 Governance Kernel' },
  { label: 'forge', name: 'A-FORGE', href: 'https://forge.arif-fazil.com', desc: 'Execution & Mutation Shell' },
]

export function Work() {
  const [filter, setFilter] = useState<'all' | 'wells' | 'regional' | 'systems'>('all')

  const cases = featuredCases
    .map((c) => ({ ...c, record: discoveries.find((d) => d.id === c.id)! }))
    .filter((c) => c.record)

  const filteredDiscoveries = discoveries.filter((d) => {
    if (filter === 'all') return true
    return d.category === filter
  })

  const countFor = (cat: 'wells' | 'regional' | 'systems') =>
    discoveries.filter((d) => d.category === cat).length

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2] py-16 md:py-24">
      <PageMeta
        title="Selected Work & Evidence Ledger — Arif Fazil"
        description="Thirteen years of offshore decisions under incomplete data, and the governed AI systems built so machines cannot pretend certainty."
        path="/work/"
      />
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#31C48D] uppercase tracking-widest mb-3">
            <span>EXPLORATION GEOSCIENCE</span>
            <span>·</span>
            <span>OFFSHORE WELLS</span>
            <span>·</span>
            <span>GOVERNED SYSTEMS</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            The Work & The Record
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed mb-6">
            Thirteen years of offshore decisions under incomplete data, and the systems built so machines cannot pretend certainty.
            Each record follows the same discipline: context, uncertainty, evidence, role, outcome, and what remains withheld.
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/institution/"
              className="inline-flex items-center justify-center px-5 min-h-[40px] rounded bg-[#E4572E] text-[#07090E] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#E4572E]/90 transition-colors"
            >
              Request a briefing →
            </a>
            <a
              href="/earth/"
              className="inline-flex items-center justify-center px-5 min-h-[40px] rounded border border-[#1F2733] bg-[#0F131D] text-[#EDEAE2] font-mono text-xs uppercase tracking-wider font-semibold hover:border-[#31C48D]/50 hover:text-[#31C48D] transition-colors"
            >
              3D Earth & Basins ↗
            </a>
            <Link
              to="/999"
              className="inline-flex items-center justify-center px-5 min-h-[40px] rounded border border-[#1F2733] bg-[#0F131D] text-[#EDEAE2] font-mono text-xs uppercase tracking-wider font-semibold hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
            >
              Proof & Verification →
            </Link>
          </div>
        </div>

        {/* Portfolio artifact — full career narrative (deep surface) */}
        <Link
          to="/work/exploration-2013-2026/"
          className="group mb-14 block rounded-lg border border-[#31C48D]/30 bg-gradient-to-br from-[#0F131D] to-[#0A1412] p-8 hover:border-[#31C48D]/60 transition-colors"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-widest text-[#31C48D] mb-2">
                Career Artifact · Evidence-Grounded · 2026
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-3">
                Exploration 2013–2026 — The Full Portfolio
              </h2>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
                Thirteen years of exploration geoscience in one web-native artifact: career arc, six flagship
                cases, uncertainty discipline — and every claim tagged with its evidence class. Frozen PDF included.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#31C48D] group-hover:translate-x-1 transition-transform">
              Open the portfolio →
            </span>
          </div>
        </Link>

        {/* Featured cases — the decision-first read (20–30 seconds) */}
        <section className="mb-14" aria-labelledby="featured-cases">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-1">
                Executive Readout (30-Second Summary)
              </div>
              <h2 id="featured-cases" className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Featured Exploration Decisions
              </h2>
            </div>
            <span className="hidden sm:inline font-mono text-xs text-[#9AA0A8]">
              3 Flagship Outcomes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <article
                key={c.id}
                className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between hover:border-[#9AA0A8]/40 transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                      {c.record.title}
                    </h3>
                    <span className="font-mono text-xs text-[#31C48D] px-2 py-0.5 rounded border border-[#31C48D]/30 bg-[#31C48D]/10">
                      {c.record.year}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-4">
                    {c.record.location}
                  </p>
                  <dl className="space-y-3">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#E4572E] mb-1">Decision</dt>
                      <dd className="font-sans text-sm text-[#EDEAE2] leading-relaxed">{c.decision}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-1">My role</dt>
                      <dd className="font-sans text-sm text-[#9AA0A8] leading-relaxed">{c.record.role}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#31C48D] mb-1">Outcome</dt>
                      <dd className="font-sans text-sm text-[#EDEAE2] font-medium leading-relaxed">{c.outcome}</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-5 pt-4 border-t border-[#1F2733] flex items-center justify-between font-mono text-[11px] text-[#9AA0A8]">
                  <span>{c.record.evidence.length} evidence items</span>
                  <a
                    href={c.record.link ?? 'https://geox.arif-fazil.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E4572E] hover:underline uppercase tracking-wider"
                  >
                    Inspect ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Hero Visual: Interactive Seismic Amplitude Canvas Map */}
        <section className="mb-16">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold uppercase text-[#EDEAE2]">
              Malay Basin Cross-Section (3D Kirchhoff Seismic Volume)
            </h2>
            <span className="font-mono text-xs text-[#9AA0A8]">
              Interactive Synthetic Canvas
            </span>
          </div>
          <SeismicAmplitudeCanvas />
        </section>

        {/* Section 1: The Comprehensive Evidence Ledger with Category Filters */}
        <section className="mb-20" id="ledger">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
                Operational Records & Grounding
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Evidence Ledger
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === 'all'
                    ? 'bg-[#E4572E] text-[#07090E] font-bold'
                    : 'bg-[#0F131D] border border-[#1F2733] text-[#9AA0A8] hover:text-[#EDEAE2]'
                }`}
              >
                All ({discoveries.length})
              </button>
              <button
                onClick={() => setFilter('wells')}
                className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === 'wells'
                    ? 'bg-[#31C48D] text-[#07090E] font-bold'
                    : 'bg-[#0F131D] border border-[#1F2733] text-[#9AA0A8] hover:text-[#EDEAE2]'
                }`}
              >
                Wells ({countFor('wells')})
              </button>
              <button
                onClick={() => setFilter('regional')}
                className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === 'regional'
                    ? 'bg-[#E4572E] text-[#07090E] font-bold'
                    : 'bg-[#0F131D] border border-[#1F2733] text-[#9AA0A8] hover:text-[#EDEAE2]'
                }`}
              >
                Basin Syntheses ({countFor('regional')})
              </button>
              <button
                onClick={() => setFilter('systems')}
                className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === 'systems'
                    ? 'bg-[#91B0F2] text-[#07090E] font-bold'
                    : 'bg-[#0F131D] border border-[#1F2733] text-[#9AA0A8] hover:text-[#EDEAE2]'
                }`}
              >
                Systems ({countFor('systems')})
              </button>
            </div>
          </div>

          {/* Ledger Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDiscoveries.map((d) => (
              <article
                key={d.id}
                className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between hover:border-[#9AA0A8]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className={`inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border mb-2 ${
                        d.category === 'wells'
                          ? 'border-[#31C48D]/30 text-[#31C48D] bg-[#31C48D]/10'
                          : d.category === 'regional'
                          ? 'border-[#E4572E]/30 text-[#E4572E] bg-[#E4572E]/10'
                          : 'border-[#91B0F2]/30 text-[#91B0F2] bg-[#91B0F2]/10'
                      }`}>
                        {d.categoryLabel}
                      </span>
                      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                        {d.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#9AA0A8] whitespace-nowrap bg-[#161B26] px-2 py-1 rounded border border-[#1F2733]">
                      {d.year}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 font-mono text-xs text-[#9AA0A8] mb-3 pb-3 border-b border-[#1F2733]">
                    <div>Location: <span className="text-[#EDEAE2]">{d.location}</span></div>
                    <div>Role: <span className="text-[#EDEAE2]">{d.role}</span></div>
                  </div>

                  <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                    {d.summary}
                  </p>

                  {/* Interactive Evidence Drawer */}
                  <details className="mt-3 group">
                    <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-wider text-[#9AA0A8] hover:text-[#E4572E] transition-colors flex items-center justify-between py-1 border-t border-[#1F2733]">
                      <span>Evidence packet ({d.evidence.length} items)</span>
                      <span className="group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="mt-3 space-y-2 text-xs">
                      <ul className="space-y-1.5 border-l-2 border-[#1F2733] pl-3">
                        {d.evidence.map((e, idx) => (
                          <li key={idx} className="text-[#EDEAE2]/90 leading-relaxed">
                            <span className="font-mono text-[#31C48D] mr-1.5">✓</span>
                            {e}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 font-mono text-[11px] text-[#9AA0A8]/80 bg-[#141822] p-2.5 rounded border border-[#1F2733]">
                        <span className="text-[#E4572E] font-semibold">Boundary limits:</span>{' '}
                        {d.limits ?? 'Internal technical detail withheld.'}
                      </div>
                    </div>
                  </details>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1F2733] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#9AA0A8]">
                    Verified Public Record
                  </span>
                  <a
                    href={d.link ?? 'https://geox.arif-fazil.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider font-semibold"
                  >
                    {d.linkLabel ?? 'Explore Surface'} ↗
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 p-4 rounded border border-[#1F2733] bg-[#0A0D14] font-mono text-xs text-[#9AA0A8] leading-relaxed">
            <span className="text-[#EDEAE2] font-semibold">Institutional Notice:</span> Work reflects personal professional contributions and publicly reported outcomes — never institutional claims on behalf of PETRONAS. Internal technical packs, seismic coordinates, and commercial evaluations are withheld under arifOS F1 Amanah.
          </div>
        </section>

        {/* Section 2: Sovereign AI Systems (The Federation) */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#91B0F2] mb-1">
                Autonomous Infrastructure
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-[#EDEAE2]">
                Sovereign Agent Federation Organs
              </h2>
            </div>
            <Link to="/AAA" className="font-mono text-xs text-[#91B0F2] hover:underline uppercase">
              Read AAA Doctrine →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agenticMirrors.map((m) => {
              const meta = organBadges[m.label] ?? { badge: 'ORGAN', color: 'border-[#1F2733] text-[#9AA0A8] bg-[#161B26]' }
              return (
                <div key={m.label} className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5 flex flex-col justify-between hover:border-[#91B0F2]/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-sm font-bold uppercase text-[#EDEAE2]">{m.name}</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.color}`}>
                        {meta.badge}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
                      {m.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1F2733]">
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[#91B0F2] hover:underline uppercase tracking-wider flex items-center justify-between font-semibold"
                    >
                      <span>Open Organ</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Work
