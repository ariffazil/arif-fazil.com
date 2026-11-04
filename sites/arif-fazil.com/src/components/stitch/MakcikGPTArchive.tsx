import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from './LayoutGrid';

export interface ArchiveArticle {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  domain?: string;
  excerpt?: string;
  sourceCount?: number;
}

export interface MakcikGPTArchiveProps {
  article: ArchiveArticle;
  className?: string;
}

/**
 * Screen 02 — MakcikGPT Civic Archive (reader band)
 * Structure from Stitch wireframe `makcikgpt-civic-archive-dark-mode.html`;
 * content is 100% props-bound to real article data (F2 TRUTH: the original
 * mock dossier — fabricated tonnage, dates and telemetry — was stripped in
 * the 2026-11-04 PRIMER-1 re-skin; no mock claims ship).
 */
export const MakcikGPTArchive: React.FC<MakcikGPTArchiveProps> = ({ article, className = '' }) => {
  return (
    <LayoutGrid territory="ARCHIVE">
      <div className={`rounded-canon ${className}`.trim()}>
        <div className="flex flex-col w-full px-margin-mobile pb-space-xl">

          <header className="flex flex-col gap-space-xs mt-space-sm p-space-sm rounded-canon bg-[#11151c]/80 border border-forge-iron/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-forge-dim">
              <span className="font-mono text-[10px] tracking-widest uppercase text-forge-dim font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-canon bg-sky-400 animate-ping"></span>
                ARCHIVE // CIVIC INTELLIGENCE // {article.slug.toUpperCase().slice(0, 28)}
              </span>
              <span className="font-mono text-[10px] text-sky-400 font-bold tracking-wider">
                {article.date}
              </span>
            </div>
          </header>

          <section className="flex flex-col gap-space-sm mt-space-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-canon bg-sky-950/70 border border-sky-400/40 text-sky-300 w-max shadow-[0_0_10px_rgba(46,95,138,0.15)]">
              <span className="w-1.5 h-1.5 rounded-canon bg-sky-400 shadow-[0_0_6px_#5f8fb3]"></span>
              <span className="font-mono text-label-sm font-semibold tracking-wider">DOSSIER TERKINI // LATEST</span>
            </div>
            <h1 className="font-display text-headline-lg text-white tracking-tight leading-tight font-serif drop-shadow-sm">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="font-body text-body-md text-forge-white italic">{article.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-space-xs font-mono text-forge-dim">
              <span className="text-human-300 font-semibold px-2 py-0.5 rounded bg-human-500/10 border border-human-500/30">
                Arif Fazil with MakcikGPT
              </span>
              <span className="text-forge-dim">•</span>
              <span className="text-forge-white font-mono">{article.date}</span>
              {article.domain && (
                <>
                  <span className="text-forge-dim">•</span>
                  <span className="text-sky-300 font-medium tracking-wide">{article.domain}</span>
                </>
              )}
            </div>
          </section>

          {article.excerpt && (
            <div className="flex flex-col gap-space-xs bg-[#11151c]/90 backdrop-blur p-space-md mt-space-lg rounded-canon border border-human-500/25 shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-canon bg-human-600/20 border border-human-400/40 text-human-200 font-mono text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-canon bg-human-400 shadow-[0_0_6px_#d9a62e]"></span>
                  RINGKASAN — EXCERPT
                </span>
                {typeof article.sourceCount === 'number' && (
                  <span className="font-mono text-[10px] text-forge-dim tracking-wider">
                    {article.sourceCount} SUMBER BERGARIS
                  </span>
                )}
              </div>
              <p className="font-body text-body-md text-forge-white leading-relaxed pt-1">
                {article.excerpt}
              </p>
              <Link
                to={`/world/makcikgpt/${article.slug}`}
                className="mt-space-xs w-max px-4 py-2 rounded-canon bg-gradient-to-r from-sky-500 to-sky-700 text-white font-mono text-label-sm font-bold tracking-wider shadow-[0_0_12px_rgba(46,95,138,0.35)] border border-sky-300/40 transition-transform hover:translate-x-0.5"
              >
                BACA DOSSIER PENUH ↗
              </Link>
            </div>
          )}

        </div>
      </div>
    </LayoutGrid>
  );
};

export default MakcikGPTArchive;
