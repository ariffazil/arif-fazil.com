import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * SPA twin of public/institution/index.html.
 * Caddy may serve the static file on a full load. This component exists so
 * in-app React Router cannot resurrect the old organ-dump "audience switcher".
 */

export function InstitutionPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="Briefing — Arif Fazil"
        description="Institutional briefing: what Arif Fazil can contribute, what you can inspect, boundaries, and how to start a professional conversation."
        path="/institution/"
      />
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[44rem] px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-4">
            Institution · briefing
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
            Work together, inspect first.
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] leading-relaxed mb-6">
            Muhammad Arif bin Fazil — exploration geoscientist at PETRONAS Carigali,
            and builder of evidence-bounded agent systems. This page is the professional
            conversation path. It is not a sales funnel and not a doctrine dump.
          </p>
          <a
            className="inline-flex items-center justify-center px-5 min-h-[44px] rounded bg-[#E4572E] text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E4572E]/90"
            href="mailto:arifbfazil@gmail.com?subject=Briefing%20request%20%E2%80%94%20arif-fazil.com"
          >
            Email a briefing request
          </a>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[44rem] px-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            I can contribute to
          </h2>
          <ul className="font-sans text-[#9AA0A8] space-y-2">
            <li>Basin synthesis, seismic / stratigraphic reasoning, prospect-risk framing under incomplete data</li>
            <li>Evidence systems: claim → evidence → uncertainty → decision consequence</li>
            <li>Governed agent architecture: policy before execute, human veto, audit trail</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[44rem] px-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Evidence you can inspect
          </h2>
          <div className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5 space-y-3 font-sans text-[#9AA0A8]">
            <p>
              <a className="text-[#E4572E] hover:underline" href="/earth">/earth</a>
              {' '}— live, source-linked Earth model (Macrostrat, PB2002, USGS). Computes. Does not adjudicate.
            </p>
            <p>
              <Link className="text-[#E4572E] hover:underline" to="/work">/work</Link>
              {' '}— selected wells and systems, with withheld-material notes.
            </p>
            <p>
              <a className="text-[#E4572E] hover:underline" href="https://github.com/ariffazil">github.com/ariffazil</a>
              {' '}— GEOX, arifOS, this site.
            </p>
            <p>
              <a className="text-[#E4572E] hover:underline" href="/999/">/999/</a>
              {' '}— verification and provenance records (evidence snapshots, not self-issued certificates).
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[44rem] px-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Boundaries
          </h2>
          <ul className="font-sans text-[#9AA0A8] space-y-2">
            <li>No confidential PETRONAS material. Public work is personal unless marked as published institutional material.</li>
            <li>No investment advice. No autonomous authority is delegated by reading this site.</li>
            <li>Civic commentary (MakcikGPT) is editorial. It is not the professional identity contract.</li>
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[44rem] px-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Engagement path
          </h2>
          <p className="font-sans text-[#9AA0A8] mb-4">
            Email{' '}
            <a className="text-[#E4572E] hover:underline" href="mailto:arifbfazil@gmail.com">
              arifbfazil@gmail.com
            </a>{' '}
            with: who you are, what decision you are under, what you want inspected, and what you do not want shared.
          </p>
          <p className="font-sans text-[#9AA0A8]">
            Agents: start at <Link className="text-[#E4572E] hover:underline" to="/human">/human</Link> and{' '}
            <a className="text-[#E4572E] hover:underline" href="/llms.txt">/llms.txt</a>. Do not POST to /a2a.
          </p>
        </div>
      </section>
    </div>
  )
}

export default InstitutionPage
