import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * SPA twin of public/institution/index.html — keep the two in sync.
 * Caddy may serve the static file on a full load; this component covers
 * in-app navigation. Revamped 2026-10-02 (#64362): same dark+red language
 * as the portfolio redesign, evidence-first hierarchy, briefing substance
 * unchanged.
 */

const CONTRIB = [
  {
    t: 'Basin synthesis',
    d: 'Seismic and stratigraphic reasoning, prospect-risk framing under incomplete data. Thirteen years, two basins, six flagship decisions — each with its evidence class attached.',
  },
  {
    t: 'Evidence systems',
    d: 'Claim → evidence → uncertainty → decision consequence. Every public claim carries its truth class; the withheld list is published with the published list.',
  },
  {
    t: 'Governed agent architecture',
    d: 'Policy before execute, human veto, audit trail. Governance measured against a running system — not against a slide.',
  },
]

const INSPECT = [
  {
    flag: '2026 · career artifact',
    t: 'Exploration 2013–2026',
    href: '/work/exploration-2013-2026/',
    ext: false,
    d: 'Thirteen years in one evidence-tagged artifact: career arc, six flagship cases, what was proven, what is withheld — plus a frozen PDF with a published SHA-256.',
  },
  { t: '/earth', href: '/earth', ext: true, d: 'Live, source-linked Earth model (Macrostrat, PB2002, USGS). Computes. Does not adjudicate.' },
  { t: '/work', href: '/work', ext: false, d: 'Selected wells and systems, with withheld-material notes.' },
  { t: 'github.com/ariffazil', href: 'https://github.com/ariffazil', ext: true, d: 'GEOX, arifOS, this site — in the open.' },
  { t: '/vitals/', href: '/vitals/', ext: true, d: 'PETRONAS in public numbers. Cash against sellable barrels.' },
  { t: '/arifos/', href: '/arifos/', ext: true, d: 'The rules the machines follow. Judge before they act.' },
  { t: '/999/', href: '/999/', ext: true, d: 'Verification and provenance records — evidence snapshots, not self-issued certificates.' },
]

const QUESTIONS = [
  'How many AI actions bypass the policy controls?',
  'How long does it take to revoke an autonomous agent?',
  'Can every consequential decision be reconstructed after the fact?',
  'Can an auditor verify the chain of authority?',
]

function SectionHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.14em] text-[#E4572E] mt-16 mb-5">
      <span className="text-[#3A4454]">{n}</span>
      {children}
    </h2>
  )
}

export function InstitutionPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="Briefing — Arif Fazil"
        description="Institutional briefing: what Arif Fazil can contribute, what you can inspect, boundaries, and how to start a professional conversation."
        path="/institution/"
      />
      <div className="h-[3px] bg-gradient-to-r from-[#E4572E] to-transparent" />

      <div className="mx-auto max-w-[52rem] px-6 pb-24">
        {/* Hero */}
        <section className="pt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E4572E] mb-5">
            Institution · Briefing
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight leading-[1.05]">
            Work together,
            <br />
            inspect first.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#C9C4B8]">
            <strong className="text-[#EDEAE2] font-semibold">Muhammad Arif bin Fazil</strong> —
            exploration geoscientist at PETRONAS Carigali, and builder of evidence-bounded agent
            systems. This page is the professional conversation path. It is not a sales funnel and
            not a doctrine dump.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center px-6 min-h-[44px] rounded-sm bg-[#E4572E] text-[#0A0B0D] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#C7491F] transition-colors"
              href="mailto:arifbfazil@gmail.com?subject=Briefing%20request%20%E2%80%94%20arif-fazil.com"
            >
              Email a briefing request
            </a>
            <Link
              to="/work/exploration-2013-2026/"
              className="inline-flex items-center px-6 min-h-[44px] rounded-sm border border-[#1F2733] text-[#EDEAE2] font-mono text-xs uppercase tracking-wider hover:bg-[#11151C] transition-colors"
            >
              See the evidence first
            </Link>
          </div>
        </section>

        {/* 01 — Contribute */}
        <SectionHead n="01">I can contribute to</SectionHead>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONTRIB.map((c) => (
            <div key={c.t} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5">
              <h3 className="text-[#EDEAE2] font-semibold text-[0.95rem] mb-1.5">{c.t}</h3>
              <p className="text-sm text-[#9AA0A8] leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        {/* 02 — Inspect */}
        <SectionHead n="02">Evidence you can inspect</SectionHead>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INSPECT.map((i) =>
            i.ext ? (
              <div key={i.t} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5">
                <h3 className="text-[0.95rem] font-semibold mb-1.5">
                  <a className="text-[#E4572E] hover:underline" href={i.href}>
                    {i.t}
                  </a>
                </h3>
                <p className="text-sm text-[#9AA0A8] leading-relaxed">{i.d}</p>
              </div>
            ) : (
              <div key={i.t} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5">
                {i.flag && (
                  <span className="inline-block mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#E4572E] border border-[#E4572E]/40 rounded-sm px-1.5 py-px">
                    {i.flag}
                  </span>
                )}
                <h3 className="text-[0.95rem] font-semibold mb-1.5">
                  <Link className="text-[#E4572E] hover:underline" to={i.href}>
                    {i.t}
                  </Link>
                </h3>
                <p className="text-sm text-[#9AA0A8] leading-relaxed">{i.d}</p>
              </div>
            ),
          )}
        </div>

        {/* 03 — Questions */}
        <SectionHead n="03">Questions this answers</SectionHead>
        <div className="rounded-lg border border-[#1F2733] bg-[#11151C] px-5">
          {QUESTIONS.map((q, idx) => (
            <div
              key={q}
              className={`flex items-baseline gap-4 py-3.5 ${idx < QUESTIONS.length - 1 ? 'border-b border-[#1F2733]' : ''}`}
            >
              <span className="font-mono text-sm text-[#E4572E] min-w-[2rem]">Q{idx + 1}</span>
              <p className="text-sm text-[#9AA0A8]">{q}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#9AA0A8] leading-relaxed">
          Asked against a running system, not against a slide. Two of the four already have dated,
          uncomfortable answers in a public failure record — published with the raw probes,
          including the numbers that do not flatter the system that produced them.
        </p>

        {/* 04 — Pilot */}
        <SectionHead n="04">If you want it built around your workflow</SectionHead>
        <div className="rounded-lg border border-[#E4572E]/45 bg-gradient-to-br from-[#11151C] to-[#120F0D] p-6">
          <h3 className="text-[#EDEAE2] font-semibold mb-2">
            <Link className="text-[#E4572E] hover:underline" to="/pilot/">
              Design partner pilot
            </Link>
          </h3>
          <p className="text-sm text-[#9AA0A8] leading-relaxed">
            Four weeks, one live AI-agent workflow, eight exit criteria measured weekly and
            reported honestly: unauthorised actions reaching execution, governance coverage of
            high-risk action classes, false holds, approver latency, configuration drift.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#EDEAE2]">
            Band RM 20,000–50,000 · If a number misses, the weekly report says so.
          </p>
        </div>

        {/* 05 — Boundaries */}
        <SectionHead n="05">Boundaries</SectionHead>
        <ul className="text-sm text-[#9AA0A8] space-y-2 list-disc pl-5">
          <li>
            No confidential PETRONAS material. Public work is personal unless marked as published
            institutional material.
          </li>
          <li>No investment advice. No autonomous authority is delegated by reading this site.</li>
          <li>Civic commentary (MakcikGPT) is editorial. It is not the professional identity contract.</li>
        </ul>

        {/* 06 — Engagement */}
        <SectionHead n="06">Engagement path</SectionHead>
        <p className="text-sm text-[#9AA0A8] leading-relaxed">
          Email{' '}
          <a className="text-[#E4572E] hover:underline" href="mailto:arifbfazil@gmail.com">
            arifbfazil@gmail.com
          </a>{' '}
          with: who you are, what decision you are under, what you want inspected, and what you do
          not want shared.
        </p>
        <p className="mt-3 font-mono text-xs text-[#9AA0A8]">
          Agents: start at{' '}
          <Link className="text-[#E4572E] hover:underline" to="/human">
            /human
          </Link>{' '}
          and{' '}
          <a className="text-[#E4572E] hover:underline" href="/llms.txt">
            /llms.txt
          </a>
          . Do not POST to /a2a.
        </p>

        {/* Footer nav */}
        <nav className="mt-16 pt-6 border-t border-[#1F2733] text-sm flex flex-wrap gap-x-6 gap-y-2">
          <Link className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors" to="/">
            Home
          </Link>
          <Link className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors" to="/work/exploration-2013-2026/">
            Portfolio
          </Link>
          <a className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors" href="/earth/">
            Earth
          </a>
          <a className="text-[#9AA0A8] hover:text-[#E4572E] transition-colors" href="/999/">
            Verification
          </a>
        </nav>
      </div>
    </div>
  )
}

export default InstitutionPage
