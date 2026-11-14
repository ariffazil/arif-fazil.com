/**
 * DoctrinePage — /words/doctrine · M1.2.
 * Full canonical doctrine (13 Floors + 13 Shadow Paradoxes) ported verbatim
 * from the static prerender shell into the ATLAS ArticleShell. Legacy d-*
 * styles scoped under .doctrine-legacy (doctrine-legacy.css); legacy h1/meta
 * stripped — the shell hero owns the title.
 */
import { useEffect } from 'react';
import { ArticleShell } from '@/shells/ArticleShell';
import { doctrineBody } from '@/pages/DoctrineBody';
import '@/pages/doctrine-legacy.css';

export function DoctrinePage() {
  useEffect(() => {
    document.title = 'Doctrine — The 13 Floors + 13 Shadow Paradoxes | arif-fazil.com';
  }, []);

  return (
    <ArticleShell
      ring="soul"
      kicker="WORDS · DOCTRINE"
      title="Doctrine."
      titleAccent="13 Floors + 13 Paradoxes"
      readStats={['F1–F13 HARD + SOFT + DERIVED', 'CANON · STATIC']}
      tags={['arifos', 'floors', 'paradoxes']}
      related={[
        { label: '← /words', href: '/words' },
        { label: 'flight recorder', href: '/words/amodei-flight-recorder' },
        { label: 'full canon →', href: '/words/constitution/' },
      ]}
    >
      <article className="doctrine-legacy" dangerouslySetInnerHTML={{ __html: doctrineBody }} />
    </ArticleShell>
  );
}

export default DoctrinePage;
