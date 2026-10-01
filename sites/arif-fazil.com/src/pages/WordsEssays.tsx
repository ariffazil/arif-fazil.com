import { useState, useMemo, useEffect } from 'react'
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

export function WordsEssays() {
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = 'Essays — Words | arif-fazil.com'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', `Long-form essays by Arif Fazil — ${essaysData.length} published across 9 series + civic arc.`)
  }, [])

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
        {/* Breadcrumb */}
        <nav className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-6 flex flex-wrap gap-2">
          <Link to="/words/" className="hover:text-[#C9A227] transition-colors">Words</Link>
          <span>›</span>
          <span className="text-[#C9A227]">Essays</span>
        </nav>

        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#E4572E] uppercase tracking-widest mb-3">
            <span>📖 ESSAYS</span>
            <span>·</span>
            <span>{essaysData.length} PUBLISHED</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Words — Essays
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            Long-form essays, formal derivations, philosophical treatises.
            Every word published directly. Series 1–9 plus PETRONAS / civic arc M1–M5.
          </p>
        </div>

        {/* Compact Astrolabe */}
        <div className="my-8 overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#0B0D13] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="p-4 md:p-6 border-t border-[#1F2733]/80 bg-gradient-to-b from-[#0F1219] to-[#0A0B0D]">
            <CompassLexigramCodex />
          </div>
        </div>

        {/* Search & Filter */}
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

        {/* Sister surfaces */}
        <div className="mt-16 pt-8 border-t border-[#1F2733] flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
          <Link to="/words/wiki/" className="text-[#C9A227] hover:text-white transition-colors">🏛️ Wiki & Knowledge →</Link>
          <Link to="/words/makcikgpt/" className="text-[#D9A62E] hover:text-white transition-colors">🌍 MakcikGPT (Column) →</Link>
          <Link to="/words/" className="text-[#9AA0A8] hover:text-white transition-colors">← Back to Words hub</Link>
        </div>
      </div>
    </div>
  )
}

export default WordsEssays