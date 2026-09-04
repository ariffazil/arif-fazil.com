import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * About — human-readable on-ramp for first-time visitors.
 * /000 is cryptographic attestation for machines. This page is for people.
 * OBS: real professional identity. DER: from public career context.
 */
export function About() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="About"
        description="Muhammad Arif bin Fazil — exploration geoscientist, builder of governed systems. Based in Kuala Lumpur, Malaysia."
        path="/about"
      />
      {/* Hero */}
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            About
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-6">
            Muhammad Arif<br />bin Fazil
          </h1>
          <p className="font-sans text-xl md:text-2xl text-[#9AA0A8] leading-relaxed max-w-2xl">
            Exploration geoscientist. Builder of governed systems.
            Based in Kuala Lumpur, Malaysia.
          </p>
        </div>
      </section>

      {/* Professional */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Work
          </h2>
          <div className="space-y-6 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed">
            <p>
              I am an exploration geoscientist with PETRONAS Carigali, specialising in
              basin analysis, seismic interpretation, and prospect evaluation across
              offshore Malaysia. My work spans the Malay Basin, Sarawak Basin, and
              deepwater frontier targets.
            </p>
            <p>
              Thirteen years of subsurface work taught me one thing: the earth does not
              care about your model. The data is always incomplete. The uncertainty is
              the signal. My job is to read what the ground actually says — not what the
              model wants it to say.
            </p>
            <p>
              That same discipline drove me to build arifOS — a constitutional AI
              governance kernel with thirteen hard floors (F1–F13) that every
              consequential machine call must pass. Humans decide. AI computes.
              Evidence constrains.
            </p>
          </div>
        </div>
      </section>

      {/* Systems */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Systems
          </h2>
          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed mb-8 max-w-2xl">
            Every system began as a practical problem met in the field. None were
            built for their own sake.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'arifOS', desc: 'Constitutional AI governance kernel', sigil: 'Ψ', to: '/AAA' },
              { name: 'GEOX', desc: 'Subsurface earth intelligence', sigil: 'G', to: '/earth' },
              { name: 'WEALTH', desc: 'Capital & market compute', sigil: 'W', to: '/world' },
              { name: 'WELL', desc: 'Human vitality mirror', sigil: '◉', to: '/work' },
            ].map((s) => (
              <Link
                key={s.name}
                to={s.to}
                className="flex items-start gap-4 p-4 rounded-lg border border-[#1F2733] bg-[#11151C] hover:border-[#9AA0A8]/40 transition-colors group"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded border border-[#E4572E]/30 bg-[#E4572E]/10 font-mono text-sm font-bold text-[#E4572E] shrink-0">
                  {s.sigil}
                </span>
                <div>
                  <div className="font-display text-lg font-bold uppercase text-[#EDEAE2] group-hover:text-[#E4572E] transition-colors">
                    {s.name}
                  </div>
                  <div className="font-mono text-xs text-[#9AA0A8] mt-0.5">{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Writing */}
      <section className="border-b border-[#1F2733] py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Writing
          </h2>
          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed mb-6 max-w-2xl">
            Sixty-three essays across nine series — from basin analysis
            methodology to constitutional AI governance. Each piece is evidence-first,
            uncertainty-tagged, and linked to source material.
          </p>
          <Link
            to="/words"
            className="inline-flex items-center justify-center px-5 min-h-[44px] rounded bg-[#E4572E] text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E4572E]/90 transition-colors"
          >
            Read the Words →
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            Connect
          </h2>
          <div className="space-y-4">
            <a
              href="mailto:arifos@arif-fazil.com"
              className="flex items-center gap-3 font-mono text-sm text-[#9AA0A8] hover:text-[#EDEAE2] transition-colors"
            >
              <span className="text-[#E4572E]">↗</span> arifos@arif-fazil.com
            </a>
            <a
              href="https://github.com/ariffazil"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-mono text-sm text-[#9AA0A8] hover:text-[#EDEAE2] transition-colors"
            >
              <span className="text-[#E4572E]">↗</span> GitHub — ariffazil
            </a>
            <a
              href="https://t.me/ariffazil"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-mono text-sm text-[#9AA0A8] hover:text-[#EDEAE2] transition-colors"
            >
              <span className="text-[#E4572E]">↗</span> Telegram — @ariffazil
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1F2733]">
            <p className="font-mono text-[11px] text-[#9AA0A8]/60 max-w-2xl">
              Personal site of Muhammad Arif bin Fazil. Views are personal unless
              explicitly identified as published institutional material. No confidential
              subsurface or commercial information is presented.
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

export default About
