/**
 * ChordialField — canon/geometry.json "chordial_lines".
 * Lines through shared points, orthogonal or stellated:
 *   light  = 2 chords  (1H + 1V through center)   "+"
 *   medium = 4 chords  (2H + 2V offset, X-shape)  "✕"
 *   dense  = 8 chords  (4D + 2H + 2V stellated)   "✳"
 * Decorative background layer — never interactive, never semantic.
 */
export type ChordialDensity = 'light' | 'medium' | 'dense';

const CHORDS: Record<ChordialDensity, Array<[number, number, number, number]>> = {
  light: [
    [50, 0, 50, 100],
    [0, 50, 100, 50],
  ],
  medium: [
    [50, 0, 50, 100],
    [0, 50, 100, 50],
    [0, 0, 100, 100],
    [100, 0, 0, 100],
  ],
  dense: [
    [50, 0, 50, 100],
    [0, 50, 100, 50],
    [0, 0, 100, 100],
    [100, 0, 0, 100],
    [25, 0, 75, 100],
    [75, 0, 25, 100],
    [0, 25, 100, 75],
    [0, 75, 100, 25],
  ],
};

export interface ChordialFieldProps {
  density?: ChordialDensity;
  className?: string;
  opacity?: number;
}

export function ChordialField({ density = 'light', className, opacity = 0.08 }: ChordialFieldProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{ opacity }}
    >
      {CHORDS[density].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={0.4} />
      ))}
    </svg>
  );
}
