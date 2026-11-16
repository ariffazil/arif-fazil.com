import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * Sovereign — the F13 anchor.
 * Not a dashboard. Not an operations surface. The human seat: authority, contract,
 * and the boundary that every agent must read before acting.
 * Machine identity is carried by /.well-known/did.json + identity.json, not invented here.
 */

const SEAT = [
  {
    sigil: 'F13',
    name: 'Human veto',
    desc: 'Every irreversible act stops at the human. No agent, score, benchmark, or model may widen its own authority.',
  },
  {
    sigil: '≠',
    name: 'Capability is not authority',
    desc: 'Installed is not permitted. Operational is not authorised. Confidence is not a grant.',
  },
  {
    sigil: '§',
    name: 'Author is not judge',
    desc: 'No agent seals its own work. 333 proposes, 555 verifies, 888 judges, F13 witnesses.',
  },
]

const RECORD = [
  { label: 'About — the person', to: '/about' },
  { label: 'Work — the record', to: '/work/' },
  { label: 'Words — the essays', to: '/words/' },
  { label: 'World — the analysis', to: '/world/' },
]

const CONTRACT = [
  { label: 'Core Laws — F1–F13', href: '/laws/' },
  { label: 'Agent contract', href: '/human/' },
  { label: 'Public policy', href: '/policy.json' },
  { label: 'Identity record', href: '/.well-known/identity.json' },
  { label: 'DID document', href: '/.well-known/did.json' },
  { label: 'Agent manifest', href: '/.well-known/agent.json' },
]

export function Sovereign() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="The Human Seat"
        description="Sovereign anchor of the arifOS federation. Muhammad Arif bin Fazil: final authority, human veto, and the contract every agent reads before acting."
        path="/arif"
      />

      {/* Hero */}
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Sovereign anchor · F13
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-6">
            The Human Seat
          </h1>
          <p className="font-sans text-xl md:text-2xl text-[#9AA0A8] leading-relaxed max-w-2xl">
            Muhammad Arif bin Fazil. Final authority in the arifOS federation.
            No agent, score, benchmark, or model may widen its own authority.
          </p>
          <p className="font-mono text-sm text-[#9AA0A8]/70 mt-6">
            The machine carries structure. The human carries consequence.
          </p>
        </div>
      </section>

      {/* The seat */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The seat
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SEAT.map((s) => (
              <div key={s.name} className="p-5 rounded-lg border border-[#1F2733] bg-[#11151C]">
                <div className="flex items-center justify-center w-9 h-9 rounded border border-[#E4572E]/30 bg-[#E4572E]/10 font-mono text-sm font-bold text-[#E4572E] mb-4">
                  {s.sigil}
                </div>
                <div className="font-display text-lg font-bold uppercase text-[#EDEAE2] mb-2">
                  {s.name}
                </div>
                <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The record */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The public record
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {RECORD.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="flex items-center justify-between p-4 rounded-lg border border-[#1F2733] bg-[#11151C] hover:border-[#9AA0A8]/40 transition-colors group"
              >
                <span className="font-mono text-sm text-[#9AA0A8] group-hover:text-[#EDEAE2] transition-colors">
                  {r.label}
                </span>
                <span className="text-[#E4572E] font-mono text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The contract */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-4">
            The contract
          </h2>
          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed max-w-2xl mb-8">
            These are the machine-readable and human-readable instruments that bind every
            agent in the federation. Reading them is not endorsement. Acting under them
            requires authority.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {CONTRACT.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="flex items-center justify-between p-4 rounded-lg border border-[#1F2733] bg-[#11151C] hover:border-[#9AA0A8]/40 transition-colors group"
              >
                <span className="font-mono text-sm text-[#9AA0A8] group-hover:text-[#EDEAE2] transition-colors">
                  {c.label}
                </span>
                <span className="text-[#E4572E] font-mono text-sm">↗</span>
              </a>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-lg border border-[#E4572E]/20 bg-[#E4572E]/5">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
              Machine identity
            </div>
            <p className="font-mono text-sm text-[#9AA0A8]">
              did:web:arif-fazil.com · /.well-known/did.json · /.well-known/identity.json
            </p>
          </div>
        </div>
      </section>

      {/* The boundary */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The boundary
          </h2>
          <div className="space-y-5 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed max-w-2xl">
            <p>
              Reading this site does not grant authority. Public surfaces are informational
              unless a capability file explicitly states otherwise.
            </p>
            <p>
              State-changing operations require authenticated authorization and explicit
              human approval. No transport, receipt, or prior approval widens that boundary.
            </p>
            <p>
              A representation of a person is not the person. A profile, a transcript, a
              model, or a memory of a human is not the human.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1F2733]">
            <p className="font-mono text-[11px] text-[#9AA0A8]/60 max-w-2xl">
              This page is the sovereign anchor. It renders no live operational data; the
              observatory at <Link to="/arifos/" className="text-[#E4572E] hover:underline">/arifos/</Link>{' '}
              owns that. The attention desk at{' '}
              <a href="https://aaa.arif-fazil.com/" className="text-[#E4572E] hover:underline">
                aaa.arif-fazil.com
              </a>{' '}
              owns the decision queue.
            </p>
            <p className="font-mono text-[11px] text-[#9AA0A8]/40 mt-2">
              Ditempa bukan diberi — forged, not given.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sovereign
