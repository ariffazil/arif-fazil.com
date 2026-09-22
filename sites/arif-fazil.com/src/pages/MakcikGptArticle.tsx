import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { getMakcikArticle, getMakcikMeta, makcikArticlesMeta } from '@/data/makcikgpt/index'
import { RealityReceiptPanel } from '@/components/RealityReceiptPanel'

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

export function MakcikGptArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = getMakcikArticle(slug || '')
  const meta = getMakcikMeta(slug || '')

  const { coverEmoji, cleanHtml } = useMemo(() => {
    if (!article?.html) return { coverEmoji: null, cleanHtml: '' }

    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      return { coverEmoji: null, cleanHtml: article.html }
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(article.html, 'text/html')

      // Extract emoji before removing elements
      const emojiEl = doc.querySelector('.cover-emoji')
      const emoji = emojiEl ? emojiEl.textContent?.trim() || null : null

      // Remove any cover, article-opener, or article-header blocks
      doc.querySelectorAll('.cover, .article-opener, .article-header, header.cover').forEach(el => el.remove())

      // Remove any standalone cover elements
      doc.querySelectorAll('.cover-title, .cover-subtitle, .cover-kicker, .cover-byline, .cover-emoji').forEach(el => el.remove())

      // Remove all <h1> elements from the article body (the authoritative <h1> is rendered in the page header above)
      doc.querySelectorAll('h1').forEach(el => el.remove())

      // Remove any leading hr separators right at the top
      while (doc.body.firstElementChild && doc.body.firstElementChild.tagName.toLowerCase() === 'hr') {
        doc.body.firstElementChild.remove()
      }

      return {
        coverEmoji: emoji,
        cleanHtml: doc.body.innerHTML.trim()
      }
    } catch {
      return { coverEmoji: null, cleanHtml: article.html }
    }
  }, [article])

  const readingTime = useMemo(() => {
    if (!cleanHtml) return 0
    return estimateReadingTime(cleanHtml)
  }, [cleanHtml])

  const { prev, next } = useMemo(() => {
    if (!meta) return { prev: null, next: null }
    const idx = makcikArticlesMeta.findIndex(a => a.slug === meta.slug)
    return {
      prev: idx < makcikArticlesMeta.length - 1 ? makcikArticlesMeta[idx + 1] : null,
      next: idx > 0 ? makcikArticlesMeta[idx - 1] : null,
    }
  }, [meta])

  useEffect(() => {
    if (meta) {
      document.title = `${meta.title} — MakcikGPT | arif-fazil.com`
      window.scrollTo(0, 0)
    }
  }, [meta])

  if (!article || !meta) {
    return (
      <div className="min-h-screen bg-[#07080A] text-[#EDEAE2] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl font-bold uppercase mb-4 text-[#EDEAE2]">Artikel Tidak Dijumpai</h1>
          <p className="font-sans text-sm text-[#9AA0A8] mb-8">
            Artikel MakcikGPT yang diminta tiada dalam arkib atau telah dipindahkan.
          </p>
          <Link
            to="/world/makcikgpt/"
            className="inline-block px-5 py-2 rounded bg-[#E4572E] text-white font-mono text-xs uppercase hover:bg-[#E4572E]/80 transition-colors"
          >
            ← Kembali ke MakcikGPT
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080A] text-[#EDEAE2] py-16 md:py-24 relative overflow-hidden makcik-ambient selection:bg-[#E4572E]/30 selection:text-white">
      {/* Fractal Geometry Watermark Motif */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 opacity-[0.035] text-[#EDEAE2]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" />
          <polygon points="50,5 89,27 89,73 50,95 11,73 11,27" />
          <polygon points="50,95 89,73 89,27 50,5 11,27 11,73" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="11" y1="27" x2="89" y2="73" />
          <line x1="11" y1="73" x2="89" y2="27" />
        </svg>
      </div>

      <div className="mx-auto max-w-[800px] px-6 makcik-article relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2733] pb-4">
          <nav className="flex items-center gap-2 font-mono text-xs text-[#9AA0A8] uppercase tracking-wider" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#EDEAE2] transition-colors">Arif Fazil</Link>
            <span className="text-[#5C636C]">/</span>
            <Link to="/world" className="hover:text-[#EDEAE2] transition-colors">World</Link>
            <span className="text-[#5C636C]">/</span>
            <Link to="/world/makcikgpt/" className="text-[#D9A62E] hover:underline font-semibold">MakcikGPT</Link>
          </nav>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-[#9AA0A8] px-2 py-0.5 rounded border border-[#1F2733] bg-[#11151C]">
              Civic Intelligence
            </span>
          </div>
        </div>

        {/* Unified Authoritative Article Header (Rendered ONCE) */}
        <header className="mb-10 pb-8 border-b border-[#1F2733]">
          {coverEmoji && (
            <div className="text-2xl mb-4 tracking-widest" aria-hidden="true">
              {coverEmoji}
            </div>
          )}
          <div className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4572E]" />
            <span>{meta.domain || 'CIVIC INTELLIGENCE'}</span>
            <span className="text-[#9AA0A8]/50">·</span>
            <span className="text-[#9AA0A8] font-normal">{meta.date}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#EDEAE2] leading-[1.12] mb-4 tracking-tight">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="font-sans text-lg md:text-xl text-[#A1A7B3] leading-relaxed mb-6 font-normal">
              {meta.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1F2733]/60 text-xs font-mono text-[#9AA0A8]">
            <span>Ditulis oleh: <strong className="text-[#D9A62E]">MakcikGPT</strong></span>
            <span>·</span>
            <span>Bahasa: <strong className="text-[#EDEAE2]">{meta.language === 'ms' ? 'Bahasa Malaysia' : 'English'}</strong></span>
            {readingTime > 0 && (
              <>
                <span>·</span>
                <span className="reading-time">{readingTime} minit baca</span>
              </>
            )}
          </div>
        </header>

        {/* Reality Receipt Panel — clickable seal badge, expandable provenance */}
        <RealityReceiptPanel meta={meta} />

        {/* Article Body (Clean, comfortable reading experience without duplicate cover) */}
        <article className="prose prose-invert max-w-none font-sans text-base md:text-lg leading-relaxed text-[#EDEAE2]/90 space-y-6">
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="space-y-6 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#EDEAE2] [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[#1F2733] [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#D9A62E] [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-[#D9A62E] [&>blockquote]:bg-[#11151C] [&>blockquote]:p-4 [&>blockquote]:italic [&>blockquote]:text-[#EDEAE2] [&>strong]:text-[#D9A62E] [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2"
          />
        </article>

        {/* Next/Prev Article Navigation */}
        <div className="article-nav">
          {prev ? (
            <Link to={`/makcikgpt/${prev.slug}`}>
              <span className="nav-label">← Artikel sebelumnya</span>
              <span className="nav-title">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/makcikgpt/${next.slug}`} className="nav-next">
              <span className="nav-label">Artikel seterusnya →</span>
              <span className="nav-title">{next.title}</span>
            </Link>
          ) : <div />}
        </div>

        {/* Footer & Related links */}
        <div className="mt-8 pt-6 border-t border-[#1F2733] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <Link
            to="/makcikgpt/"
            className="text-[#31C48D] hover:underline uppercase font-bold"
          >
            ← Kembali ke Semua Artikel Makcik
          </Link>
          <Link
            to="/words"
            className="text-[#9AA0A8] hover:text-[#EDEAE2] uppercase"
          >
            Lihat Esei Intelektual (/words) →
          </Link>
        </div>
      </div>
    </div>
  )
}
export default MakcikGptArticle
