import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * /human — canonical agent "Start Here" on a path Caddy already serves.
 * Public /agent 404s without a Caddy matcher (HOLD). This page is the live contract.
 */

const MATRIX: {
  resource: string
  discover: string
  read: string
  write: string
  auth: string
  approval: string
  audit: string
}[] = [
  {
    resource: 'Site documents, llms.txt, identity',
    discover: 'Yes',
    read: 'Yes',
    write: 'No',
    auth: 'No',
    approval: 'No',
    audit: 'Access logs',
  },
  {
    resource: 'Earth public globe / dossiers',
    discover: 'Yes',
    read: 'Yes',
    write: 'No',
    auth: 'No',
    approval: 'No',
    audit: 'Source + time on page',
  },
  {
    resource: 'MCP diagnostics (mcp.arif-fazil.com)',
    discover: 'Yes',
    read: 'Limited',
    write: 'No',
    auth: 'Optional',
    approval: 'No',
    audit: 'Trace ID',
  },
  {
    resource: 'Work requests / briefing',
    discover: 'Yes',
    read: 'Limited',
    write: 'Email only',
    auth: 'Yes',
    approval: 'Required',
    audit: 'Mailbox + reply',
  },
  {
    resource: 'Deploy / execution',
    discover: 'No',
    read: 'Limited',
    write: 'Yes',
    auth: 'Strong',
    approval: 'Required',
    audit: 'Git + deploy receipt',
  },
  {
    resource: 'Public A2A POST /a2a',
    discover: 'No',
    read: 'No',
    write: 'No',
    auth: '—',
    approval: 'HOLD',
    audit: 'Explicit 404',
  },
]

export function Human() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="Start here — agents"
        description="Canonical agent entry for arif-fazil.com: identity, read-only resources, MCP, and what requires human approval."
        path="/human"
      />
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Agent start here
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
            Read first.<br />
            <span className="text-[#9AA0A8]">Then retrieve.</span>
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-2xl leading-relaxed">
            This site is the public home of Muhammad Arif bin Fazil: exploration geoscience,
            evidence-linked Earth computation, and governed agent architecture.
            Reading these pages does not grant authority. Public surfaces are informational
            unless a capability file explicitly says otherwise.
          </p>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-2xl font-bold uppercase mb-6">Start here</h2>
          <ul className="space-y-3 font-sans text-[#9AA0A8]">
            <li>
              <a className="text-[#EDEAE2] hover:underline" href="/llms.txt">
                /llms.txt
              </a>{' '}
              — short content map (canonical)
            </li>
            <li>
              <a className="text-[#EDEAE2] hover:underline" href="/.well-known/agent.json">
                /.well-known/agent.json
              </a>{' '}
              — machine contract
            </li>
            <li>
              <a className="text-[#EDEAE2] hover:underline" href="/policy.json">
                /policy.json
              </a>{' '}
              — public limits
            </li>
            <li>
              <Link className="text-[#EDEAE2] hover:underline" to="/about">
                /about
              </Link>{' '}
              — who Arif is
            </li>
            <li>
              <a className="text-[#EDEAE2] hover:underline" href="/institution/">
                /institution/
              </a>{' '}
              — human briefing / engagement
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-2xl font-bold uppercase mb-3">Capability matrix</h2>
          <p className="font-sans text-sm text-[#9AA0A8] mb-6 max-w-3xl">
            Compatibility is not an open invitation. State-changing work requires authenticated
            authorization and explicit human approval.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border border-[#1F2733]">
              <thead className="bg-[#11151C] text-[#9AA0A8] uppercase tracking-wider">
                <tr>
                  {['Resource', 'Discover', 'Read', 'Write', 'Auth', 'Human approval', 'Audit'].map((h) => (
                    <th key={h} className="px-3 py-2 border-b border-[#1F2733] font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.resource} className="border-b border-[#1F2733]">
                    <td className="px-3 py-2 text-[#EDEAE2]">{row.resource}</td>
                    <td className="px-3 py-2">{row.discover}</td>
                    <td className="px-3 py-2">{row.read}</td>
                    <td className="px-3 py-2">{row.write}</td>
                    <td className="px-3 py-2">{row.auth}</td>
                    <td className="px-3 py-2">{row.approval}</td>
                    <td className="px-3 py-2">{row.audit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1F2733] py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-2xl font-bold uppercase mb-6">Trust zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                t: 'Public',
                d: 'This site, /earth, /llms.txt, GitHub. Informational. No mutation.',
              },
              {
                t: 'Authenticated',
                d: 'MCP tools that require a session. Still read-mostly. No deploy.',
              },
              {
                t: 'Privileged',
                d: 'Governed execution (A-FORGE) after a policy check. Human veto holds.',
              },
              {
                t: 'Private',
                d: 'Confidential subsurface, medical, keys, Caddy. Not on this site.',
              },
            ].map((z) => (
              <div key={z.t} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5">
                <h3 className="font-display text-lg font-bold uppercase mb-2">{z.t}</h3>
                <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">{z.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-2xl font-bold uppercase mb-4">Safety boundaries</h2>
          <ul className="font-sans text-[#9AA0A8] space-y-2 max-w-3xl">
            <li>No authority is delegated by reading this site.</li>
            <li>GEOX computes. It does not adjudicate.</li>
            <li>Do not infer private, confidential, or employer information from public pages.</li>
            <li>Public A2A on this host is not offered. Do not treat a 404 as an invitation to retry.</li>
            <li>
              Civic commentary (MakcikGPT) is editorial, not the professional identity contract.
              See /llms.txt Optional.
            </li>
          </ul>
          <p className="mt-8 font-mono text-xs text-[#9AA0A8]">
            MCP:{' '}
            <a className="text-[#E4572E] hover:underline" href="https://mcp.arif-fazil.com/mcp">
              mcp.arif-fazil.com/mcp
            </a>
            {' · '}
            Email:{' '}
            <a className="text-[#E4572E] hover:underline" href="mailto:arifbfazil@gmail.com">
              arifbfazil@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Human
