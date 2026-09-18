import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { getMakcikArticle, getMakcikMeta, makcikArticlesMeta } from '@/data/makcikgpt/index'

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

export function MakcikGptArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = getMakcikArticle(slug || '')
  const meta = getMakcikMeta(slug || '')

  const readingTime = useMemo(() => {
    if (!article?.html) return 0
    return estimateReadingTime(article.html)
  }, [article])

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
      <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl font-bold uppercase mb-4">Artikel Tidak Dijumpai</h1>
          <p className="font-sans text-sm text-[#9AA0A8] mb-8">
            Artikel MakcikGPT yang diminta tiada dalam arkib atau telah dipindahkan.
          </p>
          <Link
            to="/makcikgpt/"
            className="inline-block px-5 py-2 rounded bg-[#E4572E] text-white font-mono text-xs uppercase"
          >
            ← Kembali ke MakcikGPT
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6 makcik-article">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-[#1F2733] pb-4">
          <Link
            to="/makcikgpt/"
            className="font-mono text-xs text-[#31C48D] hover:underline uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Arkib MakcikGPT (HERMES)</span>
          </Link>
          <span className="font-mono text-[10px] uppercase text-[#E4572E] px-2 py-0.5 rounded border border-[#E4572E]/30 bg-[#E4572E]/10">
            SEAL {meta.seal || '999'}
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="font-mono text-xs font-bold text-[#31C48D] uppercase tracking-widest mb-3">
            {meta.domain || 'CIVIC INTELLIGENCE'} · {meta.date}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#EDEAE2] leading-[1.1] mb-4">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="font-sans text-lg md:text-xl text-[#9AA0A8] leading-relaxed mb-6">
              {meta.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1F2733] text-xs font-mono text-[#9AA0A8]">
            <span>Ditulis oleh: <strong className="text-[#EDEAE2]">MakcikGPT</strong></span>
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

        {/* Article Body (Clean, comfortable reading experience) */}
        <article className="prose prose-invert max-w-none font-sans text-base md:text-lg leading-relaxed text-[#EDEAE2]/90 space-y-6">
          <div
            dangerouslySetInnerHTML={{ __html: article.html || '' }}
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
