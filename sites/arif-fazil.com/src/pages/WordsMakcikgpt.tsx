import { useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makcikArticlesMeta } from '@/data/makcikgpt'

export function WordsMakcikgpt() {
  useEffect(() => {
    document.title = 'MakcikGPT (column) — Words | arif-fazil.com'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', 'Civic commentary in Bahasa Makcik. A column inside writing, not a peer of the name. Canonical surface: /world/makcikgpt/.')
  }, [])
  // Latest first; show a curated top window inside the Words hub
  const sortedArticles = useMemo(() => {
    return [...makcikArticlesMeta].sort((a, b) => {
      const da = new Date(a.date).getTime() || 0
      const db = new Date(b.date).getTime() || 0
      return db - da
    })
  }, [])

  const latest = sortedArticles.slice(0, 6)
  const totalCount = sortedArticles.length

  // Domain roll-up for the archive teaser
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of sortedArticles) {
      const d = a.domain || 'Lain'
      counts[d] = (counts[d] || 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [sortedArticles])

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Breadcrumb */}
        <nav className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-6 flex flex-wrap gap-2">
          <Link to="/words/" className="hover:text-[#C9A227] transition-colors">Words</Link>
          <span>›</span>
          <span className="text-[#D9A62E]">MakcikGPT</span>
        </nav>

        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#D9A62E] uppercase tracking-widest mb-3">
            <span>🌍 MAKCIKGPT</span>
            <span>·</span>
            <span>CIVIC COLUMN</span>
            <span>·</span>
            <span>NOT A PEER OF THE NAME</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            MakcikGPT — Civic Voice
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed mb-4">
            Civic commentary in Bahasa Makcik. Editorial column under the writing hub.
            Distinct from the personal / professional identity at <Link to="/about" className="underline hover:text-[#D9A62E]">/about</Link> and the governance kernel at <Link to="/arifos" className="underline hover:text-[#D9A62E]">/arifos</Link>.
          </p>

          {/* Doctrine banner — keep the separation explicit */}
          <div className="rounded-lg border border-[#D9A62E]/30 bg-[#0E131A] p-4 mb-6">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#D9A62E] mb-1">Doctrinal Note</div>
            <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
              MakcikGPT is a civic column, not the professional identity contract.
              Canonical surface is <span className="text-[#EDEAE2] font-mono">/world/makcikgpt/</span> —
              this hub page is a discovery surface only. All article URLs and the full archive remain canonical there.
            </p>
          </div>

          <Link
            to="/world/makcikgpt/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 rounded bg-[#D9A62E] text-[#0A0B0D] hover:bg-[#D9A62E]/90 transition-colors"
          >
            🌍 Open canonical /world/makcikgpt/ →
          </Link>
        </div>

        {/* Latest 6 */}
        <div className="mb-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] mb-4">Latest Articles</h2>
          <div className="space-y-4">
            {latest.map((article) => (
              <article
                key={article.slug}
                className="rounded-lg border border-[#1F2733] bg-[#11151C] p-5 hover:border-[#D9A62E]/40 transition-colors group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#D9A62E]">
                    {article.domain || 'CIVIC'} · {article.date}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#9AA0A8] px-2 py-0.5 rounded border border-[#1F2733] bg-[#0A0B0D]">
                    {article.language === 'ms' || article.language === 'bilingual' ? 'Bahasa Malaysia' : 'English'}
                  </span>
                </div>

                <h3 className="font-serif text-lg md:text-xl font-bold text-[#EDEAE2] mb-2 group-hover:text-[#D9A62E] transition-colors">
                  <Link to={`/world/makcikgpt/${article.slug}`}>{article.title}</Link>
                </h3>

                {article.subtitle && (
                  <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-3">
                    {article.subtitle}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#1F2733]/60">
                  <div className="flex flex-wrap gap-1.5">
                    {(article.tags || []).slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-[#9AA0A8]/60 bg-[#0A0B0D] px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/world/makcikgpt/${article.slug}`}
                    className="font-mono text-xs text-[#EDEAE2] group-hover:text-[#D9A62E] transition-colors"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Archive teaser + topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Archive teaser */}
          <div className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] mb-2">Full Archive</div>
            <h3 className="font-display text-xl font-bold uppercase text-[#EDEAE2] mb-3">
              {totalCount} civic pieces
            </h3>
            <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
              The full archive — with reading-time estimates, domain tags, and per-article receipts — lives at the canonical surface.
            </p>
            <Link
              to="/world/makcikgpt/"
              className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] hover:text-white transition-colors"
            >
              Open full archive →
            </Link>
          </div>

          {/* Domain roll-up */}
          <div className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] mb-4 pb-2 border-b border-[#1F2733]">Topics</div>
            <div className="space-y-2">
              {domainCounts.slice(0, 8).map(([domain, count]) => (
                <div key={domain} className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#EDEAE2]">{domain}</span>
                  <span className="font-mono text-xs text-[#9AA0A8]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sister surfaces */}
        <div className="pt-8 border-t border-[#1F2733] flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
          <Link to="/words/essays/" className="text-[#E4572E] hover:text-white transition-colors">📖 Essays →</Link>
          <Link to="/words/wiki/" className="text-[#C9A227] hover:text-white transition-colors">🏛️ Wiki & Knowledge →</Link>
          <Link to="/world/makcikgpt/" className="text-[#D9A62E] hover:text-white transition-colors">🌍 /world/makcikgpt/ (canonical) →</Link>
          <Link to="/words/" className="text-[#9AA0A8] hover:text-white transition-colors">← Back to Words hub</Link>
        </div>
      </div>
    </div>
  )
}

export default WordsMakcikgpt