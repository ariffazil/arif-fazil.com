/**
 * UnitCell — the orthogonal fractal unit cell (canon/geometry.json PRIMER-1).
 * 16×16 cell: └-bracket Q1 · ┼-cross Q2 · •-dot Q3 · ┘-bracket Q4.
 * Seamless tiling via SVG pattern; scale = half(8) · base(16) · double(32).
 * Decorative only — never carries meaning. One source: geometry.json marks.
 */
import { useId } from 'react';

const CELL_PATH = 'M0 0 H4 V4 M12 0 V4 H16 M8 8 V16 M0 12 H4 V8';

const SCALES = { half: 8, base: 16, double: 32 } as const;

export type UnitCellScale = keyof typeof SCALES;

export interface UnitCellProps {
  scale?: UnitCellScale;
  className?: string;
  opacity?: number;
}

export function UnitCell({ scale = 'base', className, opacity = 1 }: UnitCellProps) {
  const raw = useId();
  const pid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const k = SCALES[scale] / 16;

  return (
    <svg
      className={className}
      aria-hidden="true"
      width="100%"
      height="100%"
      style={opacity !== 1 ? { opacity } : undefined}
    >
      <defs>
        <pattern id={`unit-cell-${pid}`} width={SCALES[scale]} height={SCALES[scale]} patternUnits="userSpaceOnUse">
          <path d={CELL_PATH} transform={`scale(${k})`} stroke="currentColor" strokeWidth={1} fill="none" />
          <circle cx={4 * k} cy={12 * k} r={Math.max(1, k)} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#unit-cell-${pid})`} />
    </svg>
  );
}
