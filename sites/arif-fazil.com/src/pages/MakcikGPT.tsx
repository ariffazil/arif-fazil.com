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
    document.title = 'MakcikGPT — Civic Intelligence in Bahasa Makcik | World | arif-fazil.com'
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
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-12 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        
        {/* ── BREADCRUMB: HIERARCHICAL COHERENCE ───────────── */}
        <nav className="flex items-center gap-2 font-mono text-xs text-[#9AA0A8] uppercase tracking-wider mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#EDEAE2] transition-colors">Arif Fazil</Link>
          <span className="text-[#5C636C]">/</span>
          <Link to="/world" className="hover:text-[#EDEAE2] transition-colors">World</Link>
          <span className="text-[#5C636C]">/</span>
          <span className="text-[#D9A62E] font-semibold">MakcikGPT</span>
        </nav>

        {/* ── VISUAL HERO: ATTENTION PRESERVATION ──────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1F2733] bg-[#0E1218] mb-12 shadow-2xl">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D9A62E]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#31C48D]/10 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 items-center relative z-10">
            {/* Left Column: Semantic Hierarchy & Editorial Callout */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Context Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#D9A62E]/10 border border-[#D9A62E]/30 text-[#D9A62E] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9A62E] animate-pulse" />
                  MakcikGPT · Public Interface of World
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#1A222D] border border-[#2A3441] text-[#9AA0A8]">
                  Civic Intelligence Layer
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-[#5C636C]">
                  Powered by Arif Fazil
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-3 leading-[1.05]">
                MakcikGPT
              </h1>

              <p className="font-serif italic text-lg md:text-xl text-[#D9A62E] mb-4">
                "Kewartawanan penyiasatan sivik untuk jiran-jiran."
              </p>

              <p className="font-sans text-sm md:text-base text-[#9AA0A8] leading-relaxed mb-6 max-w-2xl">
                Bila puluhan bilion ringgit dana negara beralih tangan, konsesi tenaga dipersoal, dan dasar ekonomi menyentuh poket rakyat tanpa penjelasan telus — MakcikGPT menyiasat dan merungkainya dalam Bahasa Makcik: mudah difahami, tajam berasaskan angka primer, sifar pintu tengah.
              </p>

              {/* Primary Actions (Two Only) */}
              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href="#current-signal"
                  className="inline-flex items-center px-4 py-2.5 rounded bg-[#D9A62E] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E]/90 transition-colors shadow-lg"
                >
                  Baca Isu Semasa ↓
                </a>
                <a
                  href="#live-dossiers"
                  className="inline-flex items-center px-4 py-2.5 rounded bg-[#1A222D] border border-[#2A3441] text-[#EDEAE2] font-mono text-xs font-bold uppercase tracking-wider hover:border-[#D9A62E] transition-colors"
                >
                  Cari Mengikut Topik →
                </a>
              </div>

              {/* Semantic Ladder: WHO → WHY → HOW */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#1F2733]/80 mb-6">
                <Link to="/" className="rounded border border-[#1F2733] bg-[#11151C]/80 p-2.5 hover:border-[#9AA0A8]/40 transition-colors group">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#5C636C] group-hover:text-[#EDEAE2]">Level 1 · WHO</div>
                  <div className="text-xs font-semibold text-[#EDEAE2]">Arif Fazil</div>
                  <div className="text-[10px] text-[#9AA0A8]">Sovereign Identity</div>
                </Link>
                <Link to="/world" className="rounded border border-[#1F2733] bg-[#11151C]/80 p-2.5 hover:border-[#9AA0A8]/40 transition-colors group">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#5C636C] group-hover:text-[#EDEAE2]">Level 2 · WHY</div>
                  <div className="text-xs font-semibold text-[#EDEAE2]">World</div>
                  <div className="text-[10px] text-[#9AA0A8]">Civic Intelligence</div>
                </Link>
                <div className="rounded border border-[#D9A62E]/40 bg-[#D9A62E]/5 p-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#D9A62E]">Level 3 · HOW</div>
                  <div className="text-xs font-semibold text-[#EDEAE2]">MakcikGPT</div>
                  <div className="text-[10px] text-[#D9A62E]">Citizen Interface</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#9AA0A8]">
                <span className="px-2.5 py-1 rounded bg-[#11151C] border border-[#1F2733] flex items-center gap-1.5">
                  <span>⚡</span> {makcikArticlesMeta.length} Siri Siasatan
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11151C] border border-[#1F2733] flex items-center gap-1.5">
                  <span>🛡️</span> F1–F13 Berperlembagaan
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11151C] border border-[#1F2733] flex items-center gap-1.5">
                  <span>📊</span> Data Primer Sahih
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11151C] border border-[#1F2733] flex items-center gap-1.5">
                  <span>🔓</span> Sifar Paywall
                </span>
              </div>
            </div>

            {/* Right Column: Visual Hero for Attention Preservation */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-xl overflow-hidden border border-[#D9A62E]/30 bg-[#11151C] shadow-[0_0_35px_-8px_rgba(217,166,46,0.3)]">
                <img
                  src="/images/makcikgpt/makcikgpt-hero.jpg"
                  alt="MakcikGPT — Kecerdasan Sivik Rakyat dan Kewartawanan Data Awam"
                  className="w-full h-auto object-cover aspect-[16/9] transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/30 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#EDEAE2]">
                    <span className="flex items-center gap-1.5 text-[#D9A62E] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#D9A62E]" />
                      Kecerdasan Sivik Waktu Subuh
                    </span>
                    <span className="text-[#9AA0A8] text-[10px]">Data · Polisi · Ketirisan</span>
                  </div>
                  <p className="text-xs text-[#EDEAE2]/80 mt-1 line-clamp-2 font-serif italic">
                    "Penyelidikan data belanjawan negara, kontrak konsesi, dan tadbir urus bersama secawan kopi-o."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TIER 1: CURRENT SIGNAL (LEAD INVESTIGATION) ─── */}
        {makcikArticlesMeta[0] && (
          <section id="current-signal" className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D9A62E] animate-pulse" />
                Tier 1 · Isu Semasa / Current Signal
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#D9A62E]/15 border border-[#D9A62E]/40 text-[#D9A62E] font-bold">
                STATUS: CURRENT
              </span>
            </div>
            <article className="rounded-2xl border-2 border-[#D9A62E] bg-[#0E131A] p-6 md:p-8 shadow-[0_0_35px_-8px_rgba(217,166,46,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="font-mono text-xs font-bold text-[#D9A62E]">
                  {makcikArticlesMeta[0].domain || 'CIVIC INTELLIGENCE'} · {makcikArticlesMeta[0].date}
                </span>
                <span className="font-mono text-[11px] text-[#9AA0A8] bg-[#0A0B0D] px-2.5 py-1 rounded border border-[#1F2733]">
                  SEAL 999 · REVISION LINEAGE
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#EDEAE2] mb-4 leading-tight hover:text-[#D9A62E] transition-colors">
                <Link to={`/world/makcikgpt/${makcikArticlesMeta[0].slug}`}>
                  {makcikArticlesMeta[0].title}
                </Link>
              </h2>
              {makcikArticlesMeta[0].subtitle && (
                <p className="font-sans text-sm md:text-base text-[#D1D5DB] mb-4 leading-relaxed">
                  {makcikArticlesMeta[0].subtitle}
                </p>
              )}
              {makcikArticlesMeta[0].excerpt && (
                <p className="font-sans text-xs md:text-sm text-[#9AA0A8] mb-6 leading-relaxed">
                  {makcikArticlesMeta[0].excerpt}
                </p>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-[#1F2733] flex-wrap gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(makcikArticlesMeta[0].tags || []).slice(0, 4).map((t) => (
                    <span key={t} className="font-mono text-[10px] text-[#9AA0A8] bg-[#0A0B0D] px-2 py-0.5 rounded border border-[#1F2733]">
                      #{t}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/world/makcikgpt/${makcikArticlesMeta[0].slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#D9A62E] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E]/90 transition-colors"
                >
                  <span>Siasat Dokumen Penuh</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          </section>
        )}

        {/* ── TIER 2: LIVE DOSSIERS (GROUPED HUBS) ─────────── */}
        <section id="live-dossiers" className="mb-12">
          <div className="mb-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9AA0A8]">
              Tier 2 · Fail Siasatan Berkelompok / Live Dossiers
            </h3>
            <p className="text-xs text-[#5C636C] mt-1">
              Tiga medan siasatan berterusan — kontrak tenaga, hak wilayah, dan prasarana data negara.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-[#1F2733] border-t-2 border-t-[#38BDF8] bg-[#11151C] p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-[#38BDF8] mb-2">
                  Dossier 01 · Siri M1 & M6
                </div>
                <h4 className="font-serif text-lg font-bold text-[#EDEAE2] mb-2">
                  PETRONAS & Kedaulatan Tenaga
                </h4>
                <p className="text-xs text-[#9AA0A8] leading-relaxed mb-4">
                  Penyelidikan DNA korporat, dividen kerajaan, konsesi luar negara, dan status rizab minyak negara.
                </p>
              </div>
              <button
                onClick={() => setSelectedSeries('PETRONAS')}
                className="font-mono text-xs font-semibold text-[#38BDF8] hover:underline text-left"
              >
                Lihat fail siasatan M1 →
              </button>
            </div>

            <div className="rounded-xl border border-[#1F2733] border-t-2 border-t-[#EF4444] bg-[#11151C] p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-[#EF4444] mb-2">
                  Dossier 02 · Siri M2
                </div>
                <h4 className="font-serif text-lg font-bold text-[#EDEAE2] mb-2">
                  Gas Sarawak, SEARAH & PDA 1974
                </h4>
                <p className="text-xs text-[#9AA0A8] leading-relaxed mb-4">
                  Rundingan Eni Italy, pengagihan gas asli Sarawak, status RM70 bilion, dan semakan perlembagaan.
                </p>
              </div>
              <button
                onClick={() => setSelectedSeries('SARAWAK')}
                className="font-mono text-xs font-semibold text-[#EF4444] hover:underline text-left"
              >
                Lihat fail siasatan M2 →
              </button>
            </div>

            <div className="rounded-xl border border-[#1F2733] border-t-2 border-t-[#31C48D] bg-[#11151C] p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-[#31C48D] mb-2">
                  Dossier 03 · Siri M3 & M4
                </div>
                <h4 className="font-serif text-lg font-bold text-[#EDEAE2] mb-2">
                  Sovereign AI & Poket Rakyat
                </h4>
                <p className="text-xs text-[#9AA0A8] leading-relaxed mb-4">
                  Pusat data Johor, konsesi MyKad, monopoli YTL, dan impak inflasi teknologi terhadap rakyat marhaen.
                </p>
              </div>
              <button
                onClick={() => setSelectedSeries('YTL')}
                className="font-mono text-xs font-semibold text-[#31C48D] hover:underline text-left"
              >
                Lihat fail siasatan M3 & M4 →
              </button>
            </div>
          </div>
        </section>

        {/* ── FEATURED QUOTE BOX ──────────────────────────── */}
        <div className="mb-10 rounded-xl border border-[#1F2733] bg-[#11151C] p-6 border-l-4 border-l-[#D9A62E]">
          <p className="font-serif text-lg md:text-xl text-[#EDEAE2] italic mb-2">
            "Bila senyum CEO lebih manis dari biasa dekat majlis tandatangan kontrak, itu bukan petanda untung. Itu petanda kita kena semak siapa yang dapat apa."
          </p>
          <div className="font-mono text-xs text-[#9AA0A8] flex items-center justify-between flex-wrap gap-2">
            <span>— MakcikGPT · Siri M2 (Gas Sarawak & SEARAH) · Cop Mohor 999</span>
            <span className="text-[#D9A62E]">Bahasa Makcik · Kebenaran Realiti</span>
          </div>
        </div>

        {/* ── TIER 3: SERIES FILTER BAR & SEARCH ──────────── */}
        <div id="series-archive" className="flex flex-wrap items-center justify-between gap-4 mb-8">
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

        {/* ── ARTICLE CARDS (BROADSHEET EDITORIAL) ────────── */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 border border-[#1F2733] rounded-xl bg-[#11151C]">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-serif text-lg text-[#EDEAE2]">Tiada artikel dijumpai</h3>
            <p className="text-xs text-[#9AA0A8] mt-1">Cuba cari dengan kata kunci lain, atau pilih siri lain.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => {
            const rt = estimateReadingTime(article.slug)
            const isGenesis = article.slug === 'surat-kepada-yang-arif'
            const isStandalone = article.slug.startsWith('petronas-full-reality') || article.slug.startsWith('petronas-leadership')
            const articleUrl = `/world/makcikgpt/${article.slug}`
            return (
            <article
              key={article.slug || idx}
              className={`rounded-xl bg-[#11151C] p-6 hover:border-[#9AA0A8]/40 transition-colors flex flex-col justify-between group ${
                isGenesis ? 'border-2 border-[#D9A62E] shadow-[0_0_24px_-8px_rgba(217,166,46,0.4)]' : 'border border-[#1F2733]'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-[#D9A62E]">
                    {article.domain ? `${article.domain} · ` : ''}{article.date}
                  </span>
                  <div className="flex items-center gap-2">
                    {isGenesis && (
                      <span className="font-mono text-[10px] uppercase text-[#D9A62E] px-2 py-0.5 rounded border border-[#D9A62E] bg-[#D9A62E]/15 font-bold">
                        ✦ Genesis #001
                      </span>
                    )}
                    {isStandalone && (
                      <span className="font-mono text-[10px] uppercase text-[#38BDF8] px-2 py-0.5 rounded border border-[#38BDF8]/30 bg-[#38BDF8]/10 font-bold">
                        📄 Dossier Khas
                      </span>
                    )}
                    {rt > 0 && (
                      <span className="font-mono text-[10px] text-[#9AA0A8] bg-[#0A0B0D] px-2 py-0.5 rounded border border-[#1F2733]">{rt} min</span>
                    )}
                    <span className="font-mono text-[10px] uppercase text-[#E4572E] px-2 py-0.5 rounded border border-[#E4572E]/30 bg-[#E4572E]/10">
                      SEAL 999
                    </span>
                  </div>
                </div>

                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#EDEAE2] mb-3 group-hover:text-[#D9A62E] transition-colors leading-snug">
                  {isStandalone ? (
                    <a href={articleUrl}>
                      {article.title}
                    </a>
                  ) : (
                    <Link to={articleUrl}>
                      {article.title}
                    </Link>
                  )}
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
                {isStandalone ? (
                  <a
                    href={articleUrl}
                    className="font-mono text-xs font-semibold text-[#38BDF8] group-hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Buka Dossier</span>
                    <span>→</span>
                  </a>
                ) : (
                  <Link
                    to={articleUrl}
                    className="font-mono text-xs font-semibold text-[#EDEAE2] group-hover:text-[#D9A62E] transition-colors flex items-center gap-1"
                  >
                    <span>Baca</span>
                    <span>→</span>
                  </Link>
                )}
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
