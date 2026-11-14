/**
 * /words/amodei-flight-recorder — FIRST canonical proof page.
 * Amodei six-essay synthesis rendered through ArticleShell, ring-soul.
 * M1 proof: single HeaderCanon · one trinity torus · RGBY soul red ·
 * orthogonal fractal + chordial field geometry. Enforced by
 * verify-design-canon (canon/shell-mandate.json).
 */
import { ArticleShell } from '@/shells/ArticleShell';
import content from '@/data/essays/amodei-flight-recorder';

export function AmodeiFlightRecorder() {
  return (
    <ArticleShell
      ring="soul"
      kicker="FLIGHT RECORDER · ARCHIVE 2024–2026"
      title="The Flight Recorder of the"
      titleAccent="Agentic Transition"
      date="14 November 2026"
      readStats={['SIX ESSAYS · 60,072 WORDS', 'D. AMODEI · OCT 2024 – SEPT 2026', 'CANON PROOF PAGE · M1']}
      tags={['amodei', 'agentic-transition', 'f1-f13']}
      coda={
        <>
          <strong>PROVENANCE</strong> · Sources: six D. Amodei essays, Oct 2024 – Sept 2026
          (darioamodei.com) · 60,072 words <span className="atlas-claim">MEASURED</span> from the
          sovereign's compilation · Claims tagged REP (reported by source) / OBS / DER / INT /
          UNK per F2 · C2 and C3 rest on the source's reports; independent arifOS verification:
          UNKNOWN · Not peer-reviewed · Direct publication on arif-fazil.com ·{' '}
          <strong>DITEMPA BUKAN DIBERI</strong>
        </>
      }
      related={[
        { label: '← /words', href: '/words' },
        { label: 'essay #21 · three timelines', href: '/words/three-timelines-one-boundary' },
        { label: '/doctrine · F1–F13', href: '/doctrine' },
      ]}
    >
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </ArticleShell>
  );
}
