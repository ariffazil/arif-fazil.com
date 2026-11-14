/**
 * TorusAnchor — canon/geometry.json toroidal anchor.
 * LAW: exactly ONE torus per page. Two or more = design VOID
 * (verify-design-canon enforces torus_count <= 1 per route).
 *   trinity-ring  : three arcs around the bridge center (narrative pages)
 *   mission-wheel : six arcs for the six missions (organ pages)
 */
export type TorusVariant = 'trinity-ring' | 'mission-wheel';

export interface TorusAnchorProps {
  variant?: TorusVariant;
  size?: number;
  className?: string;
  opacity?: number;
}

export function TorusAnchor({
  variant = 'trinity-ring',
  size = 220,
  className,
  opacity = 0.9,
}: TorusAnchorProps) {
  const c = 50;
  const arcs =
    variant === 'trinity-ring'
      ? [0, 120, 240].map((a) => ({ a, r: 34 }))
      : [0, 60, 120, 180, 240, 300].map((a) => ({ a, r: 20 + (a / 60) * 7 }));

  return (
    <svg
      className={className}
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity, animation: 'atlas-torus-spin 160s linear infinite' }}
    >
      <circle cx={c} cy={c} r={44} fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.35} />
      {arcs.map(({ a, r }, i) => {
        const rad = ((a + 90) * Math.PI) / 180;
        const x = c + r * Math.cos(rad);
        const y = c + r * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.9}
            strokeDasharray="46 12"
            opacity={0.8}
          />
        );
      })}
      <circle cx={c} cy={c} r={2.4} fill="currentColor" />
    </svg>
  );
}
