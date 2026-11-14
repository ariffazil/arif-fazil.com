/**
 * EssayPage — universal essay renderer, M1-aligned.
 * Wraps ALL essays (essays.json + essayModules) in the ATLAS ArticleShell:
 * one HeaderCanon, ring-soul accents, one trinity torus, RGBY dark tokens.
 * Mandated by web-canon/canon/shell-mandate.json (pattern route).
 */
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArticleShell } from '@/shells/ArticleShell';
import { getEssay } from '@/data/essays/index';

export function EssayPage() {
  const { slug } = useParams<{ slug: string }>();
  const essay = getEssay(slug || '');

  useEffect(() => {
    if (essay) {
      document.title = `${essay.title} — Arif Fazil | arifOS`;
    }
  }, [essay]);

  if (!essay) {
    return (
      <div className="bg-forge-black min-h-screen">
        <section className="py-24">
          <div className="site-frame text-center">
            <h1 className="text-4xl font-black uppercase mb-4">Essay Not Found</h1>
            <Link to="/words" className="text-forge-gold hover:underline font-mono">
              ← Back to Essays
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const isMirror = Boolean(essay.mediumUrl);

  return (
    <ArticleShell
      ring="soul"
      kicker={`ESSAY · ${isMirror ? 'MEDIUM MIRROR' : 'DIRECT PUBLICATION'}`}
      title={essay.title}
      date={new Date(essay.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      tags={essay.tags ?? []}
      readStats={essay.isDirectPublication ? ['ARIF-FAZIL.COM'] : []}
      coda={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {essay.mediumUrl ? (
            <a href={essay.mediumUrl} target="_blank" rel="noopener noreferrer">
              ✍️ mirror · medium ↗
            </a>
          ) : (
            essay.isDirectPublication && <span>⚒️ forged, not given — published directly</span>
          )}
          <Link to="/words">← /words</Link>
        </div>
      }
      related={[{ label: '← all essays', href: '/words/essays' }]}
    >
      <div dangerouslySetInnerHTML={{ __html: essay.html }} />
    </ArticleShell>
  );
}

export const ssgOptions = {
  slug: 'essay',
  routeUrl: '/essays/:slug',
};

export default EssayPage;
