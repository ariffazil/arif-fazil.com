import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { makcikArticlesMeta, getMakcikArticle } from '@/data/makcikgpt/index'

function estimateReadingTime(slug: string): number {
  const article = getMakcikArticle(slug)
  if (!article?.html) return 0
  const text = article.html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

const SERIES_TABS = [
  { id: 'ALL', label: 'Semua Siri' },
  { id: 'PETRONAS', label: 'M1 · PETRONAS & Tenaga' },
  { id: 'SARAWAK', label: 'M2 · Sarawak & SEARAH' },
  { id: 'YTL', label: 'M3 · YTL & Sovereign AI' },
  { id: 'MALAYSIA', label: 'M4 · Rakyat & Kedaulatan' },
  { id: 'AKAL', label: 'M5 · Akal & Politik' },
]

export function MakcikGPT() {
  const [selectedSeries, setSelectedSeries] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = 'MakcikGPT — Civic Intelligence in Bahasa Makcik | arif-fazil.com'
  }, [])

  const filteredArticles = useMemo(() => {
    return makcikArticlesMeta.filter((a) => {
      const domainUpper = a.domain ? a.domain.toUpperCase() : ''
      const tagsUpper = a.tags ? a.tags.map(t => t.toUpperCase()) : []
      const textCorpus = `${a.title} ${a.subtitle || ''} ${a.excerpt || ''} ${domainUpper} ${tagsUpper.join(' ')}`.toUpperCase()

      let seriesMatch = selectedSeries === 'ALL'
      if (selectedSeries === 'PETRONAS') {
        seriesMatch = domainUpper.includes('PETRONAS') || textCorpus.includes('PETRONAS') || textCorpus.includes('TENAGA')
      } else if (selectedSeries === 'SARAWAK') {
        seriesMatch = domainUpper.includes('SARAWAK') || domainUpper.includes('SEARAH') || domainUpper.includes('PETROS') || textCorpus.includes('SARAWAK')
      } else if (selectedSeries === 'YTL') {
        seriesMatch = domainUpper.includes('YTL') || domainUpper.includes('AI') || textCorpus.includes('YTL')
      } else if (selectedSeries === 'MALAYSIA') {
        seriesMatch = domainUpper.includes('MALAYSIA') || domainUpper.includes('MYKAD') || domainUpper.includes('RAKYAT') || textCorpus.includes('RAKYAT')
      } else if (selectedSeries === 'AKAL') {
        seriesMatch = domainUpper.includes('AKAL') || domainUpper.includes('DAP') || domainUpper.includes('PSYCHOLOGY') || textCorpus.includes('AKAL')
      }

      const searchMatch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(search.toLowerCase())) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(search.toLowerCase()))
      return seriesMatch && searchMatch
    })
  }, [selectedSeries, search])

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* ── HEADER & KICKER ─────────────────────────────── */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#31C48D] uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-[#31C48D]" />
            <span>HERMES CIVIC INTELLIGENCE · BAHASA MAKCIK · MEANING INTEGRITY</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            MakcikGPT
          </h1>

          <p className="font-sans text-lg md:text-xl text-[#9AA0A8] max-w-3xl leading-relaxed">
            Kewartawanan penyiasatan sivik untuk jiran-jiran. Bila RM70 bilion beralih tangan dan tiada siapa berani tanya,
            MakcikGPT tanya dalam Bahasa Makcik. Diterbitkan terus. Sifar pintu tengah.
          </p>

          {/* Featured Quote Box */}
          <div className="mt-8 rounded-lg border border-[#1F2733] bg-[#11151C] p-6 border-l-4 border-l-[#D9A62E]">
            <p className="font-serif text-lg md:text-xl text-[#EDEAE2] italic mb-2">
              "Bila senyum CEO lebih manis dari biasa dekat majlis tandatangan kontrak, itu bukan petanda untung. Itu petanda kita kena semak siapa yang dapat apa."
            </p>
            <div className="font-mono text-xs text-[#9AA0A8]">
              — MakcikGPT · Siri M2 (Gas Sarawak & SEARAH) · Cop Mohor 999
            </div>
          </div>

          {/* Series Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
            <div className="flex flex-wrap gap-2">
              {SERIES_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedSeries(t.id)}
                  className={`font-mono text-xs uppercase px-3.5 py-1.5 rounded transition-colors ${
                    selectedSeries === t.id
                      ? 'bg-[#D9A62E] text-[#0A0B0D] font-bold'
                      : 'bg-[#11151C] text-[#9AA0A8] border border-[#1F2733] hover:text-[#EDEAE2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel makcik..."
              className="font-mono text-xs px-3.5 py-1.5 rounded bg-[#11151C] border border-[#1F2733] text-[#EDEAE2] placeholder-[#9AA0A8]/50 focus:outline-none focus:border-[#D9A62E]"
            />
          </div>
        </div>

        {/* ── ARTICLE CARDS (BROADSHEET EDITORIAL) ────────── */}
        {filteredArticles.length === 0 ? (
          <div className="no-results">
            <div className="no-results-emoji">🔍</div>
            <h3>Tak jumpa</h3>
            <p>Cuba cari dengan kata kunci lain, atau tapis mengikut siri.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => {
            const rt = estimateReadingTime(article.slug)
            return (
            <article
              key={article.slug || idx}
              className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 hover:border-[#9AA0A8]/40 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-[#D9A62E]">
                    {article.domain ? `${article.domain} · ` : ''}{article.date}
                  </span>
                  <div className="flex items-center gap-2">
                    {rt > 0 && (
                      <span className="reading-time">{rt} min</span>
                    )}
                    <span className="font-mono text-[10px] uppercase text-[#E4572E] px-2 py-0.5 rounded border border-[#E4572E]/30 bg-[#E4572E]/10">
                      SEAL 999
                    </span>
                  </div>
                </div>

                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#EDEAE2] mb-3 group-hover:text-[#D9A62E] transition-colors leading-snug">
                  <Link to={`/makcikgpt/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                {article.subtitle && (
                  <p className="font-sans text-sm text-[#9AA0A8] mb-3 leading-relaxed">
                    {article.subtitle}
                  </p>
                )}

                {article.excerpt && (
                  <p className="font-sans text-xs text-[#9AA0A8]/70 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#1F2733] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {(article.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="font-mono text-[10px] text-[#9AA0A8]/60 bg-[#0A0B0D] px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/makcikgpt/${article.slug}`}
                  className="font-mono text-xs font-semibold text-[#EDEAE2] group-hover:text-[#D9A62E] transition-colors flex items-center gap-1"
                >
                  <span>Baca</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}
export default MakcikGPT
