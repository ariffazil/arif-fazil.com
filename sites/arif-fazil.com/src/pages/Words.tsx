import { Link } from 'react-router-dom'
import { CompassLexigramCodex } from '@/components/CompassLexigramCodex'
import essaysData from '@/data/essays.json'
import { makcikArticlesMeta } from '@/data/makcikgpt'

const HUB_CARDS = [
  {
    href: '/words/essays/',
    icon: '📖',
    accent: 'text-[#E4572E]',
    border: 'hover:border-[#E4572E]/60',
    eyebrow: 'ESSAYS',
    count: essaysData.length,
    countLabel: 'PUBLISHED',
    title: 'Long-form Essays',
    desc: 'Formal derivations, philosophical treatises, the PETRONAS arc, the Eureka trilogy. Series 1–9 plus civic arc M1–M5.',
    cta: 'Open Essays →',
  },
  {
    href: '/words/wiki/',
    icon: '🏛️',
    accent: 'text-[#C9A227]',
    border: 'hover:border-[#C9A227]/60',
    eyebrow: 'WIKI & KNOWLEDGE',
    count: '4',
    countLabel: 'DOMAINS',
    title: 'Arif Fazil Wiki',
    desc: 'Canonical documentation: identity, subsurface methodology, agents & federation, civilizational order. Each entry links to its primary source.',
    cta: 'Open Wiki →',
  },
  {
    href: '/words/makcikgpt/',
    icon: '🌍',
    accent: 'text-[#D9A62E]',
    border: 'hover:border-[#D9A62E]/60',
    eyebrow: 'CIVIC COLUMN',
    count: makcikArticlesMeta.length,
    countLabel: 'ARTICLES',
    title: 'MakcikGPT',
    desc: 'Civic commentary in Bahasa Makcik. A column inside writing, not a peer of the name. Canonical surface: /world/makcikgpt/.',
    cta: 'Open Column →',
  },
]

export function Words() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#C9A227] uppercase tracking-widest mb-3">
            <span>📖 WORDS</span>
            <span>·</span>
            <span>INTELLECTUAL CANON</span>
            <span>·</span>
            <span>3 SECTIONS</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Words & Knowledge
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            The writing hub. Long-form essays, canonical wiki, and the MakcikGPT civic column.
            Three peer sections — pick one.
          </p>
        </div>

        {/* Visual Hero: The Atlas & Compass of Thought */}
        <div className="my-8 overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#0B0D13] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[21/9] w-full overflow-hidden max-h-[380px]">
            <img
              src="/images/atlas-compass-hero.jpg"
              alt="The Atlas & Compass of Thought — Nusantara Archipelago Caelestis"
              className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.1] transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-[#0B0D13]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D13]/90 via-transparent to-[#0B0D13]/60" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0B0D]/80 border border-[#C9A227]/40 font-mono text-[0.65rem] text-[#C9A227] uppercase tracking-widest backdrop-blur-sm mb-3">
                <span>🧭 CARTOGRAPHY OF ORDER</span>
                <span>·</span>
                <span>NUSANTARA CAELESTIS</span>
                <span>·</span>
                <span>7 CIVILIZATIONS</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-[#EDEAE2] drop-shadow-md">
                The Atlas & The Compass
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#D8D4CC]/90 leading-relaxed mt-2 drop-shadow">
                Navigating the frontier of AI governance, civilizational order, and physical reality.
                Grounded at the maritime crossroads of Nusantara where truth is forged, not granted.
              </p>
            </div>
          </div>

          {/* Interactive Astrolabe Dial */}
          <div className="p-4 md:p-6 border-t border-[#1F2733]/80 bg-gradient-to-b from-[#0F1219] to-[#0A0B0D]">
            <CompassLexigramCodex />
          </div>
        </div>

        {/* Three Peer Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className={`group rounded-lg border border-[#1F2733] bg-[#11151C] p-6 flex flex-col justify-between transition-colors ${card.border}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8]">
                    {card.eyebrow}
                  </span>
                  <span className={`font-mono text-2xl ${card.accent}`}>
                    {card.icon}
                  </span>
                </div>
                <div className={`font-mono text-[10px] uppercase tracking-widest ${card.accent} mb-1`}>
                  {card.count} {card.countLabel}
                </div>
                <h3 className="font-display text-2xl font-black uppercase text-[#EDEAE2] mb-3 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className={`font-mono text-xs uppercase tracking-widest ${card.accent} mt-6 pt-4 border-t border-[#1F2733]/60 group-hover:text-white transition-colors`}>
                {card.cta}
              </div>
            </Link>
          ))}
        </div>

        {/* Doctrine footer — keeps the MAKCIKGPT separation explicit */}
        <div className="rounded-lg border border-[#D9A62E]/30 bg-[#0E131A] p-5">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#D9A62E] mb-1">Doctrinal Note</div>
          <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
            MakcikGPT appears here as a <span className="text-[#EDEAE2]">column</span> inside the writing hub —
            not as a peer of the personal / professional identity at <Link to="/about" className="underline hover:text-[#D9A62E]">/about</Link>.
            Its canonical surface remains <Link to="/world/makcikgpt/" className="underline hover:text-[#D9A62E]">/world/makcikgpt/</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Words