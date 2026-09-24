import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CompassLexigramCodex } from '@/components/CompassLexigramCodex'
import essaysData from '@/data/essays.json'

const SERIES_LABELS: Record<string, string> = {
  ALL: 'All Series',
  S1: 'S1 · ORIGIN',
  S2: 'S2 · NAMING DIPTYCH',
  S3: 'S3 · MCP WEEK',
  S4: 'S4 · GOVERNANCE CANON',
  S5: 'S5 · CONSTITUTIONAL PHYSICS',
  S6: 'S6 · EUREKA TRILOGY',
  S7: 'S7 · BAHASA & MALAYSIA',
  S8: 'S8 · FIELD NOTES',
  S9: 'S9 · REFLECTIONS',
  M1: 'M1 · PETRONAS DNA',
  M2: 'M2 · SEARAH & GAS',
  M3: 'M3 · YTL & ILMU',
  M4: 'M4 · RAKYAT',
  M5: 'M5 · AKAL',
}

const WIKI_TOPICS = [
  {
    category: 'Identity & Biography',
    items: [
      { title: 'Arif Fazil — Sovereign Dossier', desc: '13 years petroleum geoscientist, architect of arifOS, founder of GEOX.' },
      { title: 'Ontology & Human Sovereign Anchor', desc: 'Why AI systems require an explicit human sovereign veto at F13.' },
      { title: 'Philosophy of Ditempa Bukan Diberi', desc: 'Systems forged through reality contact, not granted by assumption.' },
    ]
  },
  {
    category: 'Subsurface & Earth Methodology',
    items: [
      { title: 'AVO Fluid Factor & Attention Residuals', desc: 'Physics-constrained attention mechanism derived from Zoeppritz equations.' },
      { title: 'Malay & Sabah Deepwater Basin Models', desc: 'Structural geology, shallow-flow discoveries, and fault seal calibration.' },
    ]
  },
  {
    category: 'Agents & Federation Architecture',
    items: [
      { title: 'The Seven-Contract Agent Model', desc: 'Definition of an authentic agent: boundary, context, tool veto, accountability.' },
      { title: 'The Holy 8 Verbs of arifOS', desc: 'init → observe → think → route → memory → judge → forge → seal.' },
    ]
  },
  {
    category: 'Civilizational Order & Geopolitics',
    items: [
      { title: 'The Seven Civilizational Languages of AI', desc: 'Mapping Kissinger’s World Order, Isaacson’s humanist lens, and Nusantara statecraft into the autonomous agentic era.' },
      { title: 'Musyawarah vs. Unilateral Algorithmic Diktat', desc: 'How archipelagic consensus (333 Architect + 555 Auditor) prevents institutional epistemic collapse.' },
      { title: 'Batu & Enjin: Reality Constraints at Depth', desc: 'Why rock formations at 3,000m constrain corporate and artificial narratives alike.' },
    ]
  }
]

export function Words() {
  const [activeTab, setActiveTab] = useState<'essays' | 'wiki'>('essays')
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  const filteredEssays = useMemo(() => {
    return essaysData.filter((e) => {
      const seriesId = e.series?.id || ''
      const matchSeries = selectedSeries === 'ALL' || seriesId === selectedSeries
      const matchQuery =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
      return matchSeries && matchQuery
    })
  }, [selectedSeries, search])

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#C9A227] uppercase tracking-widest mb-3">
            <span>📖 WORDS · ESSAYS · WIKI</span>
            <span>·</span>
            <span>INTELLECTUAL CANON</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Words & Knowledge
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            Long-form essays, formal derivations, philosophical treatises, and the Arif Fazil Wiki knowledge base.
            Every word published directly.
          </p>

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

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab('essays')}
              className={`font-mono text-xs uppercase px-4 py-2 rounded transition-colors ${
                activeTab === 'essays'
                  ? 'bg-[#E4572E] text-white font-bold'
                  : 'bg-[#11151C] text-[#9AA0A8] border border-[#1F2733] hover:text-[#EDEAE2]'
              }`}
            >
              📖 Essays ({essaysData.length})
            </button>
            <button
              onClick={() => setActiveTab('wiki')}
              className={`font-mono text-xs uppercase px-4 py-2 rounded transition-colors ${
                activeTab === 'wiki'
                  ? 'bg-[#E4572E] text-white font-bold'
                  : 'bg-[#11151C] text-[#9AA0A8] border border-[#1F2733] hover:text-[#EDEAE2]'
              }`}
            >
              🏛️ Arif Fazil Wiki & Knowledge
            </button>
            <Link
              to="/world/makcikgpt/"
              className="font-mono text-xs uppercase px-4 py-2 rounded bg-[#11151C] text-[#D9A62E] border border-[#D9A62E]/30 hover:bg-[#D9A62E]/10 transition-colors"
            >
              🌍 MakcikGPT Civic Articles →
            </Link>
          </div>
        </div>

        {/* Tab 1: Essays */}
        {activeTab === 'essays' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {Object.keys(SERIES_LABELS).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeries(s)}
                    className={`font-mono text-[11px] uppercase px-3 py-1.5 rounded transition-colors ${
                      selectedSeries === s
                        ? 'bg-[#EDEAE2] text-[#0A0B0D] font-bold'
                        : 'bg-[#11151C] text-[#9AA0A8] border border-[#1F2733] hover:text-[#EDEAE2]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search essays..."
                className="font-mono text-xs px-3.5 py-1.5 rounded bg-[#11151C] border border-[#1F2733] text-[#EDEAE2] placeholder-[#9AA0A8]/50 focus:outline-none focus:border-[#E4572E]"
              />
            </div>

            {/* Essays List */}
            <div className="space-y-4">
              {filteredEssays.map((essay, idx) => (
                <article
                  key={essay.id || idx}
                  className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 hover:border-[#9AA0A8]/40 transition-colors group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#E4572E]">
                      {essay.series?.id ? `${essay.series.id} · ` : ''}{essay.date}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#9AA0A8] px-2 py-0.5 rounded border border-[#1F2733] bg-[#0A0B0D]">
                      {essay.lang === 'ms' || essay.lang === 'bm' ? 'Bahasa Malaysia' : 'English'}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[#EDEAE2] mb-3 group-hover:text-[#E4572E] transition-colors">
                    {essay.dest?.type === 'onsite' && essay.dest.path ? (
                      <Link to={essay.dest.path}>{essay.title}</Link>
                    ) : (
                      <a href={essay.dest?.url || essay.dest?.path} target="_blank" rel="noreferrer">{essay.title} ↗</a>
                    )}
                  </h2>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1F2733]/60">
                    <div className="flex flex-wrap gap-1.5">
                      {(essay.tags || []).slice(0, 4).map((t) => (
                        <span key={t} className="font-mono text-[10px] text-[#9AA0A8]/60 bg-[#0A0B0D] px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                    {essay.dest?.type === 'onsite' && essay.dest.path ? (
                      <Link to={essay.dest.path} className="font-mono text-xs text-[#EDEAE2] group-hover:text-[#E4572E] transition-colors">
                        Read Essay →
                      </Link>
                    ) : (
                      <a href={essay.dest?.url || essay.dest?.path} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#EDEAE2] group-hover:text-[#E4572E] transition-colors">
                        Read on Medium ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Wiki & Knowledge */}
        {activeTab === 'wiki' && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 mb-8">
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
                Unified Wiki Surface
              </div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#EDEAE2] mb-3">
                Arif Fazil Knowledge Base
              </h2>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
                The canonical documentation for concepts, biographical evidence, geological derivations, and agent guides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WIKI_TOPICS.map((group) => (
                <div key={group.category} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-4 pb-2 border-b border-[#1F2733]">
                      {group.category}
                    </h3>
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <div key={item.title} className="group">
                          <h4 className="font-sans text-sm font-bold text-[#EDEAE2] group-hover:text-[#E4572E] transition-colors">
                            {item.title}
                          </h4>
                          <p className="font-sans text-xs text-[#9AA0A8] mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Words
