import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
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

function truncateHash(hash: string, chars = 16): string {
  if (hash.length <= chars) return hash
  return hash.slice(0, chars) + '…'
}

function CopyableHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [hash])

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[11px] text-[#9AA0A8] hover:text-[#D9A62E] transition-colors cursor-pointer bg-transparent border-none p-0"
      title="Click to copy full hash"
    >
      <span className="text-[#5C636C]">sha256:</span>{truncateHash(hash.replace('sha256:', ''), 20)}
      <span className="ml-1.5 text-[10px]">{copied ? '✓ copied' : '⎘'}</span>
    </button>
  )
}

function computeStats(meta: MakcikArticleMeta) {
  const claims = meta.claim_register || []
  const byTag: Record<string, number> = {}
  for (const c of claims) {
    byTag[c.tag] = (byTag[c.tag] || 0) + 1
  }
  // Check for UNK (claims without a valid tag)
  const validTags: EpistemicTag[] = ['OBS', 'DER', 'INT', 'SPEC']
  let unknowns = 0
  for (const c of claims) {
    if (!validTags.includes(c.tag)) unknowns++
  }

  const sources = meta.source_ledger || []
  const verifiedSources = sources.filter(s => s.content_hash && !s.content_hash.includes('pending')).length
  const contradictions = meta.counter_evidence?.length || 0

  return {
    totalClaims: claims.length,
    byTag: byTag as Record<EpistemicTag, number>,
    unknowns,
    totalSources: sources.length,
    verifiedSources,
    contradictions,
  }
}

function StatusDot({ fresh }: { fresh: boolean }) {
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${fresh ? 'bg-[#4CAF50]' : 'bg-[#FF9800]'}`} />
  )
}

interface RealityReceiptPanelProps {
  meta: MakcikArticleMeta
}

export function RealityReceiptPanel({ meta }: RealityReceiptPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const stats = computeStats(meta)
  const lineage = meta.version_lineage

  const isStale = (() => {
    if (!meta.temporal_validity?.stale_after) return false
    return new Date(meta.temporal_validity.stale_after) < new Date()
  })()

  return (
    <div className="mt-6 mb-8">
      {/* Compact Reality Status Bar */}
      <div className="bg-[#0D0F13] border border-[#1F2733] rounded-lg overflow-hidden">
        {/* Top bar — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#11151C] transition-colors cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8]">
              Reality Status
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
            <StatusDot fresh={!isStale} />
            {isStale && (
              <span className="font-mono text-[9px] text-[#FF9800] uppercase">stale</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-[#5C636C]">
            <span>{stats.verifiedSources}/{stats.totalSources} src</span>
            <span>{stats.totalClaims} claims</span>
            {stats.contradictions > 0 && (
              <span className="text-[#FF9800]">{stats.contradictions} contra</span>
            )}
            {/* Seal badge — clickable */}
            <span
              className="font-mono text-[10px] uppercase text-[#E4572E] px-2 py-0.5 rounded border border-[#E4572E]/40 bg-[#E4572E]/10 font-semibold tracking-wider hover:bg-[#E4572E]/20 hover:border-[#E4572E]/60 transition-all"
              title="Expand receipt details"
            >
              SEAL {meta.seal || '999'}
            </span>
            <span className="text-[#5C636C]">{expanded ? '▾' : '▸'}</span>
          </div>
        </button>

        {/* Expandable Receipt Panel */}
        {expanded && (
          <div className="border-t border-[#1F2733] px-4 py-5 space-y-5 bg-[#0A0B0D]">
            {/* Meta row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
              <div>
                <span className="text-[#5C636C] uppercase block mb-1">Article ID</span>
                <span className="text-[#EDEAE2]">{meta.slug}</span>
              </div>
              <div>
                <span className="text-[#5C636C] uppercase block mb-1">Version</span>
                <span className="text-[#EDEAE2]">{lineage?.version || '—'}</span>
              </div>
              <div>
                <span className="text-[#5C636C] uppercase block mb-1">Published</span>
                <span className="text-[#EDEAE2]">{lineage?.published || meta.date}</span>
              </div>
              <div>
                <span className="text-[#5C636C] uppercase block mb-1">Last Updated</span>
                <span className="text-[#EDEAE2]">{lineage?.last_updated || '—'}</span>
              </div>
            </div>

            {/* Temporal validity */}
            {meta.temporal_validity && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] font-mono border-t border-[#1F2733] pt-4">
                <div>
                  <span className="text-[#5C636C] uppercase block mb-1">Valid As Of</span>
                  <span className="text-[#EDEAE2]">{meta.temporal_validity.valid_as_of || '—'}</span>
                </div>
                <div>
                  <span className="text-[#5C636C] uppercase block mb-1">Verify At</span>
                  <span className="text-[#EDEAE2]">{meta.temporal_validity.verify_at || '—'}</span>
                </div>
                <div>
                  <span className="text-[#5C636C] uppercase block mb-1">Stale After</span>
                  <span className={isStale ? 'text-[#FF9800]' : 'text-[#EDEAE2]'}>
                    {meta.temporal_validity.stale_after || '—'}
                    {isStale && ' ⚠'}
                  </span>
                </div>
              </div>
            )}

            {/* Merkle leaf */}
            {meta.merkle_leaf && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-1.5">Merkle Leaf</span>
                <CopyableHash hash={meta.merkle_leaf} />
              </div>
            )}

            {/* Epistemic summary */}
            {(stats.totalClaims > 0) && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-2">
                  Claims by Epistemic Tag
                </span>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(TAG_COLORS) as Array<EpistemicTag | 'UNK'>).map(tag => {
                    const count = tag === 'UNK' ? stats.unknowns : (stats.byTag as Record<string, number>)[tag] || 0
                    if (count === 0 && tag === 'UNK') return null
                    const colors = TAG_COLORS[tag]
                    return (
                      <span
                        key={tag}
                        className={`font-mono text-[10px] px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {colors.label}: {count}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Claim Register */}
            {meta.claim_register && meta.claim_register.length > 0 && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-2">
                  Claim Register ({meta.claim_register.length} claims)
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {meta.claim_register.map(claim => {
                    const tagInfo = TAG_COLORS[claim.tag] || TAG_COLORS.UNK
                    return (
                      <div key={claim.claim_id} className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#5C636C] shrink-0 w-16">{claim.claim_id}</span>
                        <span className={`font-mono text-[9px] px-1 py-0 rounded shrink-0 ${tagInfo.bg} ${tagInfo.text} border ${tagInfo.border}`}>
                          {claim.tag}
                        </span>
                        <span className="text-[#9AA0A8] line-clamp-1">
                          {claim.text.length > 100 ? claim.text.slice(0, 100) + '…' : claim.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Source Ledger */}
            {meta.source_ledger && meta.source_ledger.length > 0 && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-2">
                  Source Ledger ({meta.source_ledger.length} sources)
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {meta.source_ledger.map(source => {
                    const typeColor = SOURCE_TYPE_COLORS[source.type] || 'bg-[#757575]/15 text-[#9AA0A8]'
                    return (
                      <div key={source.source_id} className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#5C636C] shrink-0 w-20">{source.source_id}</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0 rounded shrink-0 ${typeColor}`}>
                          {source.type}
                        </span>
                        {source.url && source.url !== '' && source.url !== 'internal-receipt' ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D9A62E] hover:underline line-clamp-1"
                          >
                            {source.title}
                          </a>
                        ) : (
                          <span className="text-[#9AA0A8] line-clamp-1">{source.title}</span>
                        )}
                        {source.content_hash && !source.content_hash.includes('pending') && (
                          <CopyableHash hash={source.content_hash} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Counter-evidence */}
            {meta.counter_evidence && meta.counter_evidence.length > 0 && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-2">
                  Counter-Evidence ({meta.counter_evidence.length})
                </span>
                <div className="space-y-2">
                  {meta.counter_evidence.map((ce, i) => (
                    <div key={i} className="text-[11px] bg-[#11151C] rounded p-2.5 border border-[#1F2733]">
                      <p className="text-[#9AA0A8] mb-1">{ce.summary}</p>
                      <p className="text-[#5C636C] text-[10px] italic">Disposition: {ce.disposition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Version Lineage */}
            {lineage && (
              <div className="border-t border-[#1F2733] pt-4">
                <span className="text-[10px] font-mono text-[#5C636C] uppercase block mb-2">
                  Version Lineage
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  {lineage.supersedes && (
                    <span className="text-[#5C636C]">← supersedes: <span className="text-[#9AA0A8]">{lineage.supersedes}</span></span>
                  )}
                  <span className="text-[#E4572E] font-semibold">v{lineage.version}</span>
                  {lineage.superseded_by && (
                    <span className="text-[#5C636C]">→ superseded by: <span className="text-[#9AA0A8]">{lineage.superseded_by}</span></span>
                  )}
                </div>
              </div>
            )}

            {/* Link to standalone receipt */}
            <div className="border-t border-[#1F2733] pt-4 flex items-center justify-between">
              <Link
                to={`/world/makcikgpt/${meta.slug}/receipt`}
                className="font-mono text-[11px] text-[#D9A62E] hover:text-[#EDEAE2] transition-colors uppercase"
              >
                Verify this receipt →
              </Link>
              <span className="font-mono text-[9px] text-[#5C636C]">
                {meta.provenance_status === 'sealed' ? '999 METERAI · VAULT999' : 'PROVENANCE PENDING'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
