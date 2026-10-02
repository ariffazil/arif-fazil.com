import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'
import {
  portfolioPdf,
  heroData,
  thirtySecondArif,
  careerArc,
  careerArcNarrative,
  theatres,
  flagshipCases,
  uncertaintyData,
  humanTransfer,
  aiGeoscience,
  realityManifesto,
  nextHorizon,
  claims,
  claimsWithheld,
} from '@/data/work/portfolio'

/**
 * /work/exploration-2013-2026/ — web-native career artifact.
 * Content source: ARIF_FAZIL_PETRONAS_PORTFOLIO_2026.pdf (18p, first-party extraction).
 * Design language: warm off-white, graphite, deep teal, restrained mineral gold —
 * geological, quiet, precise, editorial, human. Existing tokens respected.
 *
 * Core story works without JavaScript (progressive enhancement only).
 */

const GRAPHITE_SOFT = '#9AA0A8'
const TEAL = '#E4572E'
const GOLD = '#E4572E'

const truthBadge: Record<string, string> = {
  DOCUMENTED: `${TEAL}`,
  SYNTHETIC_EXPLANATORY: `${GOLD}`,
  OPINION: `${GRAPHITE_SOFT}`,
  WITHHELD: `#8B1A1A`,
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="font-mono text-xs tracking-[0.2em] text-[#E4572E] uppercase">{n}</span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-[#EDEAE2] mt-2">{title}</h2>
    </div>
  )
}

export function ExplorationPortfolio() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-[#E4572E] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[#0A0B0D] font-bold">
        Skip to content
      </a>
      <PageMeta
        title="Exploration 2013–2026"
        description="Thirteen years of offshore exploration geoscience, evidence-tagged. Malay Basin and offshore Sabah — flagged work, uncertainty discipline, and what was proven."
        path="/work/exploration-2013-2026/"
      />

      {/* ── SECTION 1 — HERO ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-[#1F2733]" style={{ background: `linear-gradient(180deg, #0D1017 0%, #0A0B0D 100%)` }}>
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-24 md:pb-24 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-8 items-center">
          <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E4572E] mb-6">
            Career artifact · Evidence-grounded · 2026
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-[#EDEAE2]">
            {heroData.name}
          </h1>
          <p className="mt-5 font-mono text-sm md:text-base tracking-[0.25em] uppercase text-[#E4572E]">
            {heroData.tagline}
          </p>
          <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-[#9AA0A8]">
            Thirteen years of exploration geoscience across the Malaysian and Southeast Asian
            subsurface. One continuing question, asked of every dataset and every model:
          </p>
          <p className="mt-4 font-display text-xl md:text-2xl font-bold italic text-[#E4572E]">
            {heroData.question}
          </p>
          <p className="mt-8 font-mono text-xs tracking-wider uppercase text-[#9AA0A8]">
            {heroData.affiliation} · {heroData.location}
          </p>

          {/* CTA row */}
          <nav aria-label="Portfolio navigation" className="mt-10 flex flex-wrap gap-3">
            <a href="#flagship" className="inline-flex items-center rounded-sm border border-[#E4572E] bg-[#E4572E] px-5 py-3 font-mono text-xs tracking-widest uppercase text-[#0A0B0D] font-bold hover:bg-[#C7491F] transition-colors">
              Explore the work
            </a>
            <a
              href={portfolioPdf.path}
              download
              className="inline-flex items-center rounded-sm border border-[#1F2733] px-5 py-3 font-mono text-xs tracking-widest uppercase text-[#EDEAE2] hover:bg-[#11151C] transition-colors"
            >
              Download portfolio PDF
            </a>
            <Link
              to="/work/exploration-2013-2026/evidence/"
              className="inline-flex items-center rounded-sm border border-[#E4572E]/60 px-5 py-3 font-mono text-xs tracking-widest uppercase text-[#E4572E] hover:bg-[#E4572E] hover:text-[#0A0B0D] transition-colors"
            >
              Inspect evidence
            </Link>
          </nav>
          </div>
          <div className="justify-self-center md:justify-self-end order-first md:order-last">
            <ClockArrowOfTime />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        {/* ── SECTION 2 — 30 SECOND ARIF ─────────────────────────────── */}
        <section aria-labelledby="thirty-second" id="thirty-second">
          <SectionLabel n="01" title="The 30-Second Arif" />
          <p className="max-w-3xl text-lg leading-relaxed text-[#9AA0A8] mb-10">
            {thirtySecondArif.thesis}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {thirtySecondArif.pillars.map((p) => (
              <article key={p.id} className="rounded-sm border border-[#1F2733] bg-[#11151C] p-6">
                <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-4">{p.title}</h3>
                <p className="text-sm leading-relaxed text-[#9AA0A8]">{p.body}</p>
              </article>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#1F2733] pt-8">
            {thirtySecondArif.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-4xl md:text-5xl font-black text-[#E4572E]">{s.value}</span>
                  <span className="mt-2 block font-mono text-[10px] leading-snug tracking-widest uppercase text-[#9AA0A8]">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── SECTION 3 — CAREER ARC ─────────────────────────────────── */}
        <section aria-labelledby="career-arc" id="career-arc">
          <SectionLabel n="02" title="Career Arc — 2013 → 2026" />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-4">
            A PETRONAS scholarship in 2009, a dual degree in geology and economics, and thirteen years
            inside one of the region's most consequential institutions. Every milestone below is anchored
            to a documented record.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#E4572E] mb-10">
            No item is dated from memory.
          </p>

          {/* Core timeline in plain HTML — works without JS */}
          <ol className="relative border-l border-[#1F2733] ml-2 space-y-8">
            {careerArc.map((m) => (
              <li key={m.date + m.label} className="ml-6">
                <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-[#E4572E] border-2 border-[#FAF7F0]" aria-hidden="true" />
                <time className="font-mono text-xs tracking-widest uppercase text-[#E4572E]">{m.date}</time>
                <p className="mt-1 text-base font-medium text-[#EDEAE2]">{m.label}</p>
                <p className="mt-1 font-mono text-[11px] text-[#9AA0A8]">
                  evidence: {m.evidence_ref} · <span className="uppercase" style={{ color: truthBadge[m.truth_class] }}>{m.truth_class}</span>
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-sm border-l-4 border-[#E4572E] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-3">What has held</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{careerArcNarrative.held}</p>
            </div>
            <div className="rounded-sm border-l-4 border-[#A67C2E] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-3">What has grown</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{careerArcNarrative.grown}</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — WHERE THE WORK LIVES ───────────────────────── */}
        <section aria-labelledby="theatres" id="theatres">
          <SectionLabel n="03" title="Where the Work Lives — Two Theatres, One Margin" />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-10">
            The Malay Basin and offshore NW Sabah are not two separate stories — they are different
            expressions of the same regional tectonic machine. Reading that connection is a core part
            of the technical contribution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theatres.map((t) => (
              <article key={t.id} className="rounded-sm border border-[#1F2733] bg-[#11151C] p-6 flex flex-col">
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-[#E4572E] mb-4">{t.name}</h3>
                <p className="text-sm leading-relaxed text-[#9AA0A8] flex-1">{t.description}</p>
                <a href={t.geox_link} className="mt-6 inline-flex items-center font-mono text-xs tracking-widest uppercase text-[#E4572E] hover:text-[#E4572E] transition-colors">
                  {t.geox_label}
                </a>
              </article>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]">
            Basin names and well names are used as published identifiers only. No reserve, resource,
            or economic figure is stated anywhere in this artifact. GEOX computes geological context;
            this portfolio explains the human role. They are not the same responsibility.
          </p>
        </section>

        {/* ── SECTION 6 — FLAGSHIP WORK ──────────────────────────────── */}
        <section aria-labelledby="flagship" id="flagship">
          <SectionLabel n="04" title="Flagship Work" />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-10">
            Six cases, each following the same five-part structure. Every detail below passed the
            PUBLICATION_SAFE gate before it was rendered. What could not be paid for by evidence
            was removed, not softened.
          </p>
          <div className="space-y-10">
            {flagshipCases.map((c, i) => (
              <FlagshipCase key={c.id} index={i + 1} c={c} />
            ))}
          </div>
        </section>

        {/* ── SECTION 7/8 — UNCERTAINTY ──────────────────────────────── */}
        <section aria-labelledby="uncertainty" id="uncertainty">
          <SectionLabel n="05" title={uncertaintyData.title} />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-4">{uncertaintyData.subtitle}</p>
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-10">{uncertaintyData.example}</p>

          {/* Revision flow — plain HTML sequence, no animation dependency */}
          <ol className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-12">
            {uncertaintyData.flow.map((f, i) => (
              <li key={f.step} className="relative rounded-sm border border-[#1F2733] bg-[#11151C] p-4">
                <span className="font-mono text-[10px] tracking-widest text-[#E4572E]">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-mono text-xs font-bold tracking-wider uppercase text-[#E4572E]">{f.step}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#9AA0A8]">{f.description}</p>
                {i < uncertaintyData.flow.length - 1 && (
                  <span className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-[#E4572E] z-10" aria-hidden="true">→</span>
                )}
              </li>
            ))}
          </ol>

          <ul className="space-y-4 border-t border-[#1F2733] pt-8">
            {uncertaintyData.principles.map((p) => (
              <li key={p} className="flex gap-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E4572E]" aria-hidden="true" />
                <p className="text-base leading-relaxed text-[#EDEAE2]">{p}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-[11px] leading-relaxed text-[#9AA0A8]">
            Note on economics — this page deliberately describes decision structure, not monetary
            outcome. No NPV, IRR, EMV, or reserve figure is stated anywhere. Inventing them would
            destroy the credibility of everything else.
          </p>
        </section>

        {/* ── SECTION 10 — HUMAN TRANSFER ────────────────────────────── */}
        <section aria-labelledby="human-transfer" id="human-transfer">
          <SectionLabel n="06" title={humanTransfer.thesis} />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-10">{humanTransfer.body}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-sm border border-[#1F2733] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-4">{humanTransfer.mentoring.title}</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{humanTransfer.mentoring.body}</p>
            </div>
            <div className="rounded-sm border border-[#1F2733] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-4">{humanTransfer.handover.title}</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{humanTransfer.handover.body}</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 11 — AI + GEOSCIENCE ───────────────────────────── */}
        <section aria-labelledby="ai-geo" id="ai-geo">
          <SectionLabel n="07" title={`AI + Geoscience — ${aiGeoscience.title}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-sm border-l-4 border-[#E4572E] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-3">What carries across</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{aiGeoscience.carries}</p>
            </div>
            <div className="rounded-sm border-l-4 border-[#5A5A52] bg-[#11151C] p-6">
              <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#9AA0A8] mb-3">What does not</h3>
              <p className="text-sm leading-relaxed text-[#9AA0A8]">{aiGeoscience.doesNot}</p>
            </div>
          </div>
          <ol className="flex flex-col md:flex-row gap-2 md:items-center mb-6" aria-label="Progression of AI in geoscience practice">
            {aiGeoscience.stages.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="rounded-sm border border-[#1F2733] bg-[#11151C] px-3 py-2 font-mono text-[11px] tracking-wider uppercase text-[#EDEAE2]">{s}</span>
                {i < aiGeoscience.stages.length - 1 && <span className="text-[#E4572E]" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <p className="font-mono text-[11px] leading-relaxed text-[#9AA0A8]">
            {aiGeoscience.arifOS_note}{' '}
            <a href="https://arifos.arif-fazil.com" className="text-[#E4572E] hover:underline">arifOS ↗</a>
          </p>
        </section>

        {/* ── SECTION 12 — REALITY > EVERYTHING ──────────────────────── */}
        <section aria-labelledby="reality" id="reality" className="text-center py-8">
          <h2 id="reality" className="sr-only">Reality &gt; Everything</h2>
          <div className="space-y-3">
            {realityManifesto.lines.map((l) => (
              <p key={l} className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#EDEAE2]">{l}</p>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-[#9AA0A8] italic">
            {realityManifesto.closing}
          </p>
          <p className="mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-[#E4572E]">
            {realityManifesto.tag}
          </p>
        </section>

        {/* ── SECTION 13 — NEXT HORIZON ──────────────────────────────── */}
        <section aria-labelledby="next-horizon" id="next-horizon">
          <SectionLabel n="08" title="The Next Technical Horizon" />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-10">
            Not a resignation narrative. Not a departure story. A statement of where the technical work
            goes next — and what kind of role it is ready for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[nextHorizon.depth, nextHorizon.systems, nextHorizon.transfer].map((h) => (
              <article key={h.title} className="rounded-sm border border-[#1F2733] bg-[#11151C] p-6">
                <h3 className="font-mono text-xs tracking-[0.25em] uppercase text-[#E4572E] mb-4">{h.title}</h3>
                <p className="text-sm leading-relaxed text-[#9AA0A8]">{h.body}</p>
              </article>
            ))}
          </div>
          <div className="rounded-sm border border-[#E4572E]/40 bg-[#E4572E]/5 p-6">
            <p className="font-mono text-xs tracking-widest uppercase text-[#E4572E] mb-2">
              Title discipline · {nextHorizon.current_title} ≠ {nextHorizon.target_title}
            </p>
            <p className="text-sm leading-relaxed text-[#9AA0A8]">{nextHorizon.title_note}</p>
          </div>
        </section>

        {/* ── SECTION 14 — EVIDENCE POINTER ──────────────────────────── */}
        <section aria-labelledby="evidence" id="evidence" className="rounded-sm border border-[#1F2733] bg-[#11151C] p-8 md:p-10">
          <SectionLabel n="09" title="Evidence" />
          <p className="max-w-3xl text-base leading-relaxed text-[#9AA0A8] mb-4">
            {claims.length} published claims, {claimsWithheld.length} deliberately withheld — each with a truth class,
            a publication class, and a source. The withheld list matters as much as the published one:
            an evidence appendix that only lists what supports the story is marketing.
          </p>
          <Link
            to="/work/exploration-2013-2026/evidence/"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#E4572E] hover:text-[#E4572E] transition-colors"
          >
            Inspect the full evidence ledger →
          </Link>
        </section>

        {/* ── SECTION 15 — DOWNLOAD ──────────────────────────────────── */}
        <section aria-labelledby="download" id="download" className="rounded-sm border border-[#1F2733] bg-[#11151C] p-8 md:p-10">
          <SectionLabel n="10" title="Frozen Artifact" />
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 font-mono text-xs text-[#9AA0A8] mb-8">
            <div className="flex gap-3"><dt className="uppercase tracking-widest shrink-0 text-[#E4572E]">Title</dt><dd className="text-[#EDEAE2]">{portfolioPdf.title}</dd></div>
            <div className="flex gap-3"><dt className="uppercase tracking-widest shrink-0 text-[#E4572E]">Pages</dt><dd className="text-[#EDEAE2]">{portfolioPdf.pages}</dd></div>
            <div className="flex gap-3"><dt className="uppercase tracking-widest shrink-0 text-[#E4572E]">Compiled</dt><dd className="text-[#EDEAE2]">{portfolioPdf.compiled}</dd></div>
            <div className="flex gap-3"><dt className="uppercase tracking-widest shrink-0 text-[#E4572E]">Renderer</dt><dd className="text-[#EDEAE2]">{portfolioPdf.renderer}</dd></div>
            <div className="flex flex-col md:flex-row md:gap-3 md:items-baseline"><dt className="uppercase tracking-widest shrink-0 text-[#E4572E]">SHA-256</dt><dd className="text-[#EDEAE2] break-all">{portfolioPdf.sha256}</dd></div>
          </dl>
          <a
            href={portfolioPdf.path}
            download
            className="inline-flex items-center rounded-sm border border-[#E4572E] bg-[#E4572E] px-6 py-3 font-mono text-xs tracking-widest uppercase text-[#0A0B0D] font-bold hover:bg-[#C7491F] transition-colors"
          >
            Download PDF · {portfolioPdf.pages} pages
          </a>
          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]">
            {portfolioPdf.note} The PDF is the frozen, auditable career artifact. This site is the
            living interface to the same evidence. If the PDF source is rebuilt, the hash updates with it.
          </p>
        </section>
      </main>

      {/* ── CLOSING ──────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1F2733] bg-[#0D1017]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <p className="font-display text-xl md:text-2xl font-bold italic text-[#FAF7F0] max-w-2xl mx-auto leading-relaxed">
            The object of the work was never to be certain. It was to be honest about how much could be defended.
          </p>
          <p className="mt-8 font-mono text-xs tracking-[0.3em] uppercase text-[#E4572E]">
            Arif Fazil · Kuala Lumpur · 2026
          </p>
          <nav aria-label="Portfolio footer navigation" className="mt-8 flex justify-center gap-6 font-mono text-xs tracking-widest uppercase">
            <Link to="/work/" className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors">Work index</Link>
            <Link to="/work/exploration-2013-2026/evidence/" className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors">Evidence</Link>
            <a href="/earth/malay-basin/" className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors">Malay Basin</a>
            <a href="/earth/kinabalu-basin/" className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors">Kinabalu Basin</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}


/**
 * ClockArrowOfTime — the visual hero. Analog clock face, one tick per year
 * 2013 → 2026, arrow sweeping clockwise from first year to now. Red accent
 * on the travelled arc. Static SVG: no JS, no motion dependency (reduced-motion
 * safe by construction); meaning available to screen readers via title/desc.
 */
function ClockArrowOfTime() {
  const CX = 160
  const CY = 160
  const TICKS = 14 // 2013..2026 inclusive
  const SWEEP = 334 // degrees the arrow travels
  const angle = (i: number) => -90 + (i * SWEEP) / (TICKS - 1)
  const pt = (i: number, r: number) => {
    const a = (angle(i) * Math.PI) / 180
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }
  const start = pt(0, 120)
  const end = pt(TICKS - 1, 120)
  const arrowTip = pt(TICKS - 1, 96)
  const largeArc = SWEEP > 180 ? 1 : 0
  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const a = pt(i, 108)
    const b = pt(i, 128)
    const major = i === 0 || i === TICKS - 1
    return (
      <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={major ? '#E4572E' : '#3A4454'} strokeWidth={major ? 3 : 1.5} />
    )
  })
  return (
    <svg viewBox="0 0 320 320" className="w-[min(72vw,320px)] h-auto" role="img" aria-labelledby="clock-title clock-desc">
      <title id="clock-title">Clock arrow of time — thirteen years, 2013 to 2026</title>
      <desc id="clock-desc">An analog clock face with one tick per year. A red arrow sweeps clockwise from 2013 at the top, once around the face, to 2026. Thirteen years of exploration geoscience.</desc>
      <circle cx={CX} cy={CY} r={136} fill="#0D1017" stroke="#1F2733" strokeWidth="2" />
      <circle cx={CX} cy={CY} r={120} fill="none" stroke="#1F2733" strokeWidth="1" />
      {ticks}
      <path d={`M ${start.x} ${start.y} A 120 120 0 ${largeArc} 1 ${end.x} ${end.y}`} fill="none" stroke="#E4572E" strokeWidth="2.5" opacity="0.85" />
      <line x1={CX} y1={CY} x2={arrowTip.x} y2={arrowTip.y} stroke="#E4572E" strokeWidth="3.5" strokeLinecap="round" />
      {(() => {
        const aEnd = ((angle(TICKS - 1) + 90) * Math.PI) / 180
        const rot = (Math.atan2(Math.sin(aEnd), Math.cos(aEnd)) * 180) / Math.PI
        return <polygon points="14,0 -6,7 -6,-7" fill="#E4572E" transform={`translate(${end.x} ${end.y}) rotate(${rot})`} />
      })()}
      <circle cx={CX} cy={CY} r="5" fill="#E4572E" />
      <text x={CX} y={CY - 2} textAnchor="middle" fill="#EDEAE2" fontSize="52" fontWeight="800" fontFamily="Fraunces, Georgia, serif">13</text>
      <text x={CX} y={CY + 30} textAnchor="middle" fill="#9AA0A8" fontSize="12" letterSpacing="4" fontFamily="ui-monospace, monospace">YEARS</text>
      <text x={160} y={14} textAnchor="middle" fill="#9AA0A8" fontSize="12" fontFamily="ui-monospace, monospace">2013</text>
      <text x={92} y={26} textAnchor="middle" fill="#E4572E" fontSize="12" fontWeight="700" fontFamily="ui-monospace, monospace">2026</text>
    </svg>
  )
}

function FlagshipCase({ index, c }: { index: number; c: (typeof flagshipCases)[number] }) {
  return (
    <article className="rounded-sm border border-[#1F2733] bg-[#11151C] overflow-hidden" aria-labelledby={`case-${c.id}`}>
      <header className="border-b border-[#1F2733] bg-[#11151C] px-6 py-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#E4572E]">Case {String(index).padStart(2, '0')}</span>
            <h3 id={`case-${c.id}`} className="mt-1 font-display text-xl md:text-2xl font-bold text-[#EDEAE2]">
              {c.project}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-widest uppercase text-[#E4572E]">{c.year} · {c.basin}</p>
            {c.block && <p className="font-mono text-[10px] text-[#9AA0A8]">{c.block}</p>}
          </div>
        </div>
        <p className="mt-2 font-mono text-[11px] tracking-wider uppercase text-[#9AA0A8]">{c.role}</p>
      </header>

      {/* Five-part structure — native <details> for small screens; content always in HTML */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DED7C8]">
        <Part label="The Problem" body={c.problem} />
        <Part label="The Earth Signal" body={c.earth_signal} />
        <Part label="Role & Decision" body={c.role_and_decision} />
        <Part label="What Followed" body={c.what_followed} />
      </div>
      <div className="border-t border-[#1F2733] bg-[#E4572E]/5 px-6 py-5 md:px-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#E4572E] mb-2">What was proven</p>
        <p className="text-sm md:text-base leading-relaxed text-[#EDEAE2]">{c.what_was_proven}</p>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1F2733] px-6 py-4 md:px-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[#9AA0A8]">
          {c.publication_class.replace(/_/g, ' ')} · claims: {c.claim_ids.join(', ')}
        </p>
        {c.geox_link && (
          <a href={c.geox_link} className="font-mono text-[10px] tracking-widest uppercase text-[#E4572E] hover:text-[#E4572E] transition-colors">
            Geological context ↗
          </a>
        )}
      </footer>
    </article>
  )
}

function Part({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-[#11151C] p-6 md:p-8">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#E4572E] mb-2">{label}</p>
      <p className="text-sm leading-relaxed text-[#9AA0A8]">{body}</p>
    </div>
  )
}

export default ExplorationPortfolio
