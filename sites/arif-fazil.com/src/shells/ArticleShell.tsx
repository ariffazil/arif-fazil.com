/**
 * ArticleShell — ATLAS shell for long-form / narrative pages (atlas.yaml
 * page_types.article). Provides: HeaderCanon (one) · ArticleHero with ONE
 * toroidal anchor · MainContent · CanonFooter. Pages supply content only.
 * Ring scoping: ring prop sets --shell-accent (RGBY map, ringTokens.ts).
 */
import { HeaderCanon } from '@/components/canon/HeaderCanon';
import { CanonFooter } from '@/components/canon/CanonFooter';
import { UnitCell } from '@/components/canon/UnitCell';
import { ChordialField } from '@/components/canon/ChordialField';
import { TorusAnchor } from '@/components/canon/TorusAnchor';
import { RING_ACCENTS, type ShellRing } from '@/shells/ringTokens';
import './shell.css';

export interface ArticleShellProps {
  ring?: ShellRing;
  kicker: string;
  title: string;
  titleAccent?: string;
  date?: string;
  tags?: string[];
  readStats?: string[];
  children: React.ReactNode;
  coda?: React.ReactNode;
  related?: Array<{ label: string; href: string }>;
}

export function ArticleShell({
  ring = 'soul',
  kicker,
  title,
  titleAccent,
  date,
  tags = [],
  readStats = [],
  children,
  coda,
  related = [],
}: ArticleShellProps) {
  const ra = RING_ACCENTS[ring];
  const accentVars = {
    '--shell-accent': ra.accent,
    '--shell-accent-bg': ra.bg,
  } as React.CSSProperties;

  return (
    <div className="atlas-shell" data-ring={ra.dataRing} style={accentVars}>
      <HeaderCanon ring={ring} />

      <section className="atlas-hero">
        <UnitCell scale="double" className="hero-cell" />
        <ChordialField density="light" className="hero-chords" />
        <TorusAnchor variant="trinity-ring" className="atlas-torus" size={230} />
        <div className="hero-inner">
          <div className="atlas-kicker">
            ( {kicker} ) / {ra.label}
          </div>
          <h1 className="atlas-title">
            {title}
            {titleAccent && <span className="title-accent"> {titleAccent}</span>}
          </h1>
          <div className="atlas-meta">
            {date && <span className="meta-chip">{date}</span>}
            {readStats.map((s) => (
              <span key={s} className="meta-chip">
                {s}
              </span>
            ))}
            {tags.map((t) => (
              <span key={t} className="meta-chip">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main className="atlas-main">
        <article className="atlas-article">{children}</article>
        {coda && <div className="atlas-coda">{coda}</div>}
        {related.length > 0 && (
          <div className="atlas-related">
            {related.map((r) => (
              <a key={r.href} href={r.href}>
                {r.label}
              </a>
            ))}
          </div>
        )}
      </main>

      <CanonFooter />
    </div>
  );
}
