import { Link } from 'react-router-dom'
import { agenticMirrors } from '@/components/ArrowNavbar'
import { PageMeta } from '@/components/PageMeta'
import { discoveries } from '@/data/discoveries'
import { SeismicAmplitudeCanvas } from '@/components/SeismicAmplitudeCanvas'

/**
 * Featured cases — decision-first summaries for time-constrained evaluators.
 * Facts are derived from the corresponding entries in @/data/discoveries
 * (the ledger below). Nothing here asserts beyond that record.
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

export function Work() {
  const cases = featuredCases
    .map((c) => ({ ...c, record: discoveries.find((d) => d.id === c.id)! }))
    .filter((c) => c.record)

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <PageMeta
        title="Selected Work"
        description="Selected offshore exploration work, public evidence, roles, outcomes, and governed AI systems by Arif Fazil."
        path="/work/"
      />
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-[#31C48D] uppercase tracking-widest mb-3">
            <span>WORK · SYSTEMS · THE WELLS</span>
            <span>·</span>
            <span>OPERATIONAL LEDGER</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            The Work & The Record
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            Thirteen years of offshore decisions under incomplete data, and the systems built so machines cannot pretend certainty.
            Each well below follows the same template: context, uncertainty, evidence, role, outcome, what remains withheld.
          </p>
        </div>

        {/* Featured cases — the decision-first read (20–30 seconds) */}
        <section className="mb-12" aria-labelledby="featured-cases">
          <h2 id="featured-cases" className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-6">
            Featured cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <article
                key={c.id}
                className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 flex flex-col"
              >
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#EDEAE2]">
                    {c.record.title}
                  </h3>
                  <span className="font-mono text-xs text-[#31C48D] whitespace-nowrap">{c.record.year}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-4">
                  {c.record.location}
                </p>
                <dl className="space-y-3 flex-1">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#E4572E] mb-1">Decision</dt>
                    <dd className="font-sans text-sm text-[#EDEAE2]/90 leading-relaxed">{c.decision}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#E4572E] mb-1">My role</dt>
                    <dd className="font-sans text-sm text-[#EDEAE2]/90 leading-relaxed">{c.record.role}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#E4572E] mb-1">Outcome</dt>
                    <dd className="font-sans text-sm text-[#EDEAE2]/90 leading-relaxed">{c.outcome}</dd>
                  </div>
                </dl>
                <p className="mt-4 pt-4 border-t border-[#1F2733] font-mono text-[11px] text-[#9AA0A8]">
                  {c.record.evidence.length} public evidence item{c.record.evidence.length === 1 ? '' : 's'}.{' '}
                  {c.record.limits ?? 'Internal technical detail withheld.'}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Hero Visual: Interactive Seismic Amplitude Canvas Map — supports the proof, after it */}
        <div className="mb-16">
          <SeismicAmplitudeCanvas />
        </div>

        {/* Section 1: The Wells Record */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold uppercase text-[#EDEAE2]">
              1. Offshore Wells Ledger (Petronas Carigali)
            </h2>
            <Link to="/earth" className="font-mono text-xs text-[#E4572E] hover:underline uppercase">
              3D Earth & Basin Maps →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoveries.map((d) => (
              <div key={d.id} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-base font-bold text-[#EDEAE2]">{d.title}</span>
                  <span className="font-mono text-xs text-[#31C48D] px-2 py-0.5 rounded border border-[#31C48D]/30 bg-[#31C48D]/10">
                    {d.year}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 font-mono text-xs text-[#9AA0A8] mb-3 pb-3 border-b border-[#1F2733]">
                  <div>Location: <span className="text-[#EDEAE2]">{d.location}</span></div>
                  <div>Role: <span className="text-[#EDEAE2]">{d.role}</span></div>
                  <div>Limits: <span className="text-[#EDEAE2]">{d.limits ?? 'Internal technical detail withheld.'}</span></div>
                </div>
                <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-3">
                  {d.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#9AA0A8]">
                    {d.evidence.length} evidence item{d.evidence.length === 1 ? '' : 's'}
                  </span>
                  <a
                    href={d.link ?? 'https://geox.arif-fazil.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
                  >
                    {d.linkLabel ?? 'Explore GEOX'} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/80 max-w-3xl">
            Results reflect publicly reported outcomes and personal professional contribution — not institutional
            claims on behalf of PETRONAS. Internal technical detail is withheld. Last verified 2026-08-17.
          </p>
        </section>

        {/* Section 2: Federation Systems Architecture */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold uppercase text-[#EDEAE2]">
              2. Sovereign AI Systems (The Federation)
            </h2>
            <Link to="/AAA" className="font-mono text-xs text-[#91B0F2] hover:underline uppercase">
              Read AAA Doctrine →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agenticMirrors.map((m) => (
              <div key={m.label} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-mono text-sm font-bold uppercase text-[#EDEAE2]">{m.name}</span>
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
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>Launch Portal</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
export default Work
