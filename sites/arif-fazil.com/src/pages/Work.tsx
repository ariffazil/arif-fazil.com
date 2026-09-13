import { Link } from 'react-router-dom'
import { agenticMirrors } from '@/components/ArrowNavbar'
import { discoveries } from '@/data/discoveries'
import { SeismicAmplitudeCanvas } from '@/components/SeismicAmplitudeCanvas'

export function Work() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
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
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed mb-8">
            Thirteen years of offshore decisions under incomplete data, and the systems built so machines cannot pretend certainty.
            Each well below follows the same template: context, uncertainty, evidence, role, outcome, what remains withheld.
          </p>

          {/* Hero Visual: Interactive Seismic Amplitude Canvas Map */}
          <div className="my-6">
            <SeismicAmplitudeCanvas />
          </div>
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
                  <span className="font-mono text-[11px] text-[#9AA0A8]/70">
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

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/60 max-w-3xl">
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
