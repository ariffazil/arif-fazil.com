import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { getMakcikMeta } from '@/data/makcikgpt/index'
import type { MakcikArticleMeta, EpistemicTag } from '@/data/makcikgpt/types'

const TAG_COLORS: Record<EpistemicTag | 'UNK', { bg: string; text: string; border: string; label: string }> = {
  OBS:   { bg: 'bg-[#4CAF50]/15', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]/40', label: 'OBSERVED' },
  DER:   { bg: 'bg-[#2196F3]/15', text: 'text-[#2196F3]', border: 'border-[#2196F3]/40', label: 'DERIVED' },
  INT:   { bg: 'bg-[#FF9800]/15', text: 'text-[#FF9800]', border: 'border-[#FF9800]/40', label: 'INTERPRETATION' },
  SPEC:  { bg: 'bg-[#9C27B0]/15', text: 'text-[#9C27B0]', border: 'border-[#9C27B0]/40', label: 'SPECULATION' },
  UNK:   { bg: 'bg-[#757575]/15', text: 'text-[#757575]', border: 'border-[#757575]/40', label: 'UNKNOWN' },
}

const SOURCE_TYPE_COLORS: Record<string, string> = {
  filing: 'bg-[#607D8B]/20 text-[#90A4AE]',
  document: 'bg-[#5C6BC0]/20 text-[#9FA8DA]',
  court_record: 'bg-[#D32F2F]/20 text-[#EF9A9A]',
  news: 'bg-[#FBC02D]/20 text-[#FFF176]',
  official_statement: 'bg-[#388E3C]/20 text-[#A5D6A7]',
  analysis: 'bg-[#E4572E]/20 text-[#FF8A65]',
}

function computeStats(meta: MakcikArticleMeta) {
  const claims = meta.claim_register || []
  const byTag: Record<string, number> = {}
  for (const c of claims) {
    byTag[c.tag] = (byTag[c.tag] || 0) + 1
  }
  const validTags: EpistemicTag[] = ['OBS', 'DER', 'INT', 'SPEC']
  let unknowns = 0
  for (const c of claims) {
    if (!validTags.includes(c.tag)) unknowns++
  }
  const sources = meta.source_ledger || []
  const verifiedSources = sources.filter(s => s.content_hash && !s.content_hash.includes('pending')).length
  const contradictions = meta.counter_evidence?.length || 0
  return { totalClaims: claims.length, byTag: byTag as Record<EpistemicTag, number>, unknowns, totalSources: sources.length, verifiedSources, contradictions }
}

export function RealityReceiptPage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = getMakcikMeta(slug || '')

  useEffect(() => {
    if (meta) {
      document.title = `Receipt: ${meta.title} — MakcikGPT`
      window.scrollTo(0, 0)
    }
  }, [meta])

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#07080A] text-[#EDEAE2] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-mono text-lg font-bold uppercase mb-4 text-[#E4572E]">Receipt Not Found</h1>
          <p className="font-sans text-sm text-[#9AA0A8] mb-8">
            No provenance data available for this article.
          </p>
          <Link to="/world/makcikgpt/" className="inline-block px-5 py-2 rounded bg-[#E4572E] text-white font-mono text-xs uppercase hover:bg-[#E4572E]/80 transition-colors">
            ← Kembali ke MakcikGPT
          </Link>
        </div>
      </div>
    )
  }

  const stats = computeStats(meta)
  const lineage = meta.version_lineage
  const isStale = meta.temporal_validity?.stale_after
    ? new Date(meta.temporal_validity.stale_after) < new Date()
    : false

  return (
    <div className="min-h-screen bg-[#07080A] text-[#EDEAE2] py-12 md:py-20 selection:bg-[#E4572E]/30 selection:text-white">
      <div className="mx-auto max-w-[720px] px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-mono text-[10px] text-[#5C636C] uppercase tracking-wider" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#9AA0A8] transition-colors">Arif Fazil</Link>
          <span>/</span>
          <Link to="/world" className="hover:text-[#9AA0A8] transition-colors">World</Link>
          <span>/</span>
          <Link to="/world/makcikgpt/" className="hover:text-[#9AA0A8] transition-colors">MakcikGPT</Link>
          <span>/</span>
          <Link to={`/world/makcikgpt/${meta.slug}`} className="hover:text-[#9AA0A8] transition-colors">{meta.slug}</Link>
          <span>/</span>
          <span className="text-[#E4572E]">receipt</span>
        </nav>

        {/* Header */}
        <header className="mb-8 pb-6 border-b border-[#1F2733]">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] uppercase text-[#E4572E] px-2 py-0.5 rounded border border-[#E4572E]/40 bg-[#E4572E]/10 font-semibold tracking-wider">
              SEAL {meta.seal || '999'}
            </span>
            {meta.provenance_status && (
              <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border ${
                meta.provenance_status === 'sealed'
                  ? 'text-[#4CAF50] border-[#4CAF50]/30 bg-[#4CAF50]/10'
                  : 'text-[#FF9800] border-[#FF9800]/30 bg-[#FF9800]/10'
              }`}>
                {meta.provenance_status}
              </span>
            )}
            {isStale && (
              <span className="font-mono text-[9px] text-[#FF9800] uppercase px-1.5 py-0.5 rounded border border-[#FF9800]/30 bg-[#FF9800]/10">
                stale evidence
              </span>
            )}
          </div>
          <h1 className="font-mono text-xl md:text-2xl font-bold text-[#EDEAE2] mb-2">
            Reality Receipt
          </h1>
          <p className="font-serif text-lg text-[#A1A7B3] mb-4">
            {meta.title}
          </p>
          <div className="font-mono text-[10px] text-[#5C636C] uppercase">
            arifos.record.v1 · SESSION_RECEIPT
          </div>
        </header>

        {/* Record Metadata */}
        <section className="mb-8">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
            Record Metadata
          </h2>
          <div className="grid grid-cols-2 gap-3 text-[12px] font-mono">
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Article ID</span>
              <span className="text-[#EDEAE2]">{meta.slug}</span>
            </div>
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Version</span>
              <span className="text-[#EDEAE2]">v{lineage?.version || '—'}</span>
            </div>
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Published</span>
              <span className="text-[#EDEAE2]">{lineage?.published || meta.date}</span>
            </div>
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Last Updated</span>
              <span className="text-[#EDEAE2]">{lineage?.last_updated || '—'}</span>
            </div>
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Domain</span>
              <span className="text-[#9AA0A8] text-[11px]">{meta.domain}</span>
            </div>
            <div>
              <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Canonical URL</span>
              <a href={`https://arif-fazil.com/world/makcikgpt/${meta.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#D9A62E] hover:underline text-[11px]">
                arif-fazil.com/world/makcikgpt/{meta.slug}
              </a>
            </div>
          </div>
        </section>

        {/* Temporal Validity */}
        {meta.temporal_validity && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Temporal Validity
            </h2>
            <div className="grid grid-cols-3 gap-3 text-[12px] font-mono">
              <div>
                <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Valid As Of</span>
                <span className="text-[#EDEAE2]">{meta.temporal_validity.valid_as_of || '—'}</span>
              </div>
              <div>
                <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Verify At</span>
                <span className="text-[#EDEAE2]">{meta.temporal_validity.verify_at || '—'}</span>
              </div>
              <div>
                <span className="text-[#5C636C] uppercase block mb-1 text-[10px]">Stale After</span>
                <span className={isStale ? 'text-[#FF9800]' : 'text-[#EDEAE2]'}>
                  {meta.temporal_validity.stale_after || '—'}
                  {isStale && ' ⚠'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Merkle Leaf */}
        {meta.merkle_leaf && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Merkle Leaf
            </h2>
            <div className="bg-[#11151C] rounded p-3 border border-[#1F2733]">
              <code className="font-mono text-[11px] text-[#9AA0A8] break-all select-all cursor-text">
                {meta.merkle_leaf}
              </code>
            </div>
          </section>
        )}

        {/* Epistemic Summary */}
        {stats.totalClaims > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Epistemic Summary
            </h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TAG_COLORS) as Array<EpistemicTag | 'UNK'>).map(tag => {
                const count = tag === 'UNK' ? stats.unknowns : (stats.byTag as Record<string, number>)[tag] || 0
                if (count === 0 && tag === 'UNK') return null
                const colors = TAG_COLORS[tag]
                return (
                  <span key={tag} className={`font-mono text-[11px] px-2.5 py-1 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {colors.label}: {count}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {/* Claim Register */}
        {meta.claim_register && meta.claim_register.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Claim Register ({meta.claim_register.length})
            </h2>
            <div className="space-y-2">
              {meta.claim_register.map(claim => {
                const tagInfo = TAG_COLORS[claim.tag] || TAG_COLORS.UNK
                return (
                  <div key={claim.claim_id} className="bg-[#0D0F13] border border-[#1F2733] rounded p-3 text-[12px]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[#5C636C] text-[10px]">{claim.claim_id}</span>
                      <span className={`font-mono text-[9px] px-1.5 py-0 rounded ${tagInfo.bg} ${tagInfo.text} border ${tagInfo.border}`}>
                        {tagInfo.label}
                      </span>
                      {claim.maruah_review && (
                        <span className={`font-mono text-[9px] px-1.5 py-0 rounded ${
                          claim.maruah_review === 'approved'
                            ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                            : claim.maruah_review === 'pending'
                              ? 'bg-[#FF9800]/10 text-[#FF9800]'
                              : 'bg-[#757575]/10 text-[#757575]'
                        }`}>
                          MARUAH: {claim.maruah_review}
                        </span>
                      )}
                    </div>
                    <p className="text-[#EDEAE2] mb-1">{claim.text}</p>
                    {claim.confidence_basis && (
                      <p className="text-[10px] text-[#5C636C] italic">
                        Confidence: {claim.confidence_basis}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Source Ledger */}
        {meta.source_ledger && meta.source_ledger.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Source Ledger ({meta.source_ledger.length})
            </h2>
            <div className="space-y-2">
              {meta.source_ledger.map(source => {
                const typeColor = SOURCE_TYPE_COLORS[source.type] || 'bg-[#757575]/15 text-[#9AA0A8]'
                return (
                  <div key={source.source_id} className="bg-[#0D0F13] border border-[#1F2733] rounded p-3 text-[12px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[#5C636C] text-[10px]">{source.source_id}</span>
                      <span className={`font-mono text-[9px] px-1.5 py-0 rounded ${typeColor}`}>
                        {source.type}
                      </span>
                      {source.retrieved_at && (
                        <span className="font-mono text-[9px] text-[#5C636C]">
                          retrieved: {source.retrieved_at}
                        </span>
                      )}
                    </div>
                    {source.url && source.url !== '' && source.url !== 'internal-receipt' ? (
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#D9A62E] hover:underline">
                        {source.title}
                      </a>
                    ) : (
                      <span className="text-[#EDEAE2]">{source.title}</span>
                    )}
                    {source.content_hash && !source.content_hash.includes('pending') && (
                      <div className="mt-1">
                        <code className="font-mono text-[10px] text-[#5C636C] break-all select-all">
                          hash: {source.content_hash}
                        </code>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Counter-Evidence */}
        {meta.counter_evidence && meta.counter_evidence.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Counter-Evidence ({meta.counter_evidence.length})
            </h2>
            <div className="space-y-2">
              {meta.counter_evidence.map((ce, i) => (
                <div key={i} className="bg-[#11151C] rounded p-3 border border-[#1F2733] text-[12px]">
                  <p className="text-[#EDEAE2] mb-1.5">{ce.summary}</p>
                  <p className="text-[10px] text-[#5C636C] italic">Disposition: {ce.disposition}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Version Lineage */}
        {lineage && (
          <section className="mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3 border-b border-[#1F2733] pb-2">
              Version Lineage
            </h2>
            <div className="bg-[#0D0F13] border border-[#1F2733] rounded p-3 text-[12px] font-mono">
              {lineage.supersedes && (
                <div className="text-[#5C636C] mb-1">← supersedes: <span className="text-[#9AA0A8]">{lineage.supersedes}</span></div>
              )}
              <div className="text-[#E4572E] font-semibold text-[14px]">v{lineage.version}</div>
              <div className="text-[#5C636C] mt-1">published: {lineage.published} · last updated: {lineage.last_updated}</div>
              {lineage.superseded_by && (
                <div className="text-[#5C636C] mt-1">→ superseded by: <span className="text-[#9AA0A8]">{lineage.superseded_by}</span></div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-[#1F2733] pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <Link
            to={`/world/makcikgpt/${meta.slug}`}
            className="text-[#D9A62E] hover:underline uppercase font-bold"
          >
            ← Back to Article
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/world/makcikgpt/" className="text-[#9AA0A8] hover:text-[#EDEAE2] uppercase">
              Semua Artikel
            </Link>
            <span className="text-[#5C636C]">·</span>
            <span className="text-[#5C636C] text-[10px]">
              {meta.provenance_status === 'sealed' ? '999 METERAI · VAULT999' : 'PROVENANCE PENDING'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default RealityReceiptPage
