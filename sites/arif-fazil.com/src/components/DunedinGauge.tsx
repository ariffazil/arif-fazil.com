import { useMemo } from 'react'

/**
 * DunedinGauge — radial visualization of pace-of-aging deceleration.
 * Chronological age = full circle. Biological age = golden arc.
 * The gap between them is the deceleration — visible at a glance.
 */

interface DunedinGaugeProps {
  chronoYears: number
  bioYears: number
  rho: number
  size?: number
}

export function DunedinGauge({ chronoYears, bioYears, rho, size = 200 }: DunedinGaugeProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const strokeWidth = size * 0.06

  // Normalize to max ~90 years (typical lifespan) for the gauge sweep
  const maxYears = 90
  const chronoAngle = (chronoYears / maxYears) * 360
  const bioAngle = (bioYears / maxYears) * 360

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const arcPath = (angleDeg: number, r: number) => {
    if (angleDeg <= 0) return ''
    const clamped = Math.min(angleDeg, 359.999)
    const start = toXY(0, r)
    const end = toXY(clamped, r)
    const large = clamped > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
  }

  const chronoPath = useMemo(() => arcPath(chronoAngle, radius), [chronoAngle, radius])
  const bioPath = useMemo(() => arcPath(bioAngle, radius), [bioAngle, radius])

  // Tick marks every 10 years
  const ticks = useMemo(() => {
    const result = []
    for (let yr = 0; yr <= 80; yr += 10) {
      const angle = (yr / maxYears) * 360
      const outer = toXY(angle, radius + strokeWidth * 0.8)
      const inner = toXY(angle, radius - strokeWidth * 0.8)
      const label = toXY(angle, radius + strokeWidth * 2.2)
      result.push({ outer, inner, label, yr })
    }
    return result
  }, [radius, strokeWidth])

  // Age marker dots
  const chronoDot = useMemo(() => toXY(chronoAngle, radius), [chronoAngle, radius])
  const bioDot = useMemo(() => toXY(bioAngle, radius), [bioAngle, radius])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="select-none"
      role="img"
      aria-label={`DunedinPACE gauge: chronological ${Math.round(chronoYears)} years, biological ${Math.round(bioYears)} years, pace ${rho}`}
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#1F2733"
        strokeWidth={strokeWidth}
        opacity={0.6}
      />

      {/* Chronological arc (dim white) */}
      <path
        d={chronoPath}
        fill="none"
        stroke="#6A7382"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.35}
      />

      {/* Biological arc (gold — the deceleration story) */}
      <path
        d={bioPath}
        fill="none"
        stroke="#C9A227"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.85}
      >
        <animate
          attributeName="opacity"
          from="0"
          to="0.85"
          dur="1.5s"
          fill="freeze"
        />
      </path>

      {/* Gap fill — subtle accent showing the "saved" years */}
      {bioAngle < chronoAngle && (
        <path
          d={arcPath(chronoAngle - bioAngle, radius * 0.7)}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="round"
          opacity={0.4}
          transform={`rotate(${bioAngle}, ${cx}, ${cy})`}
        />
      )}

      {/* Tick marks */}
      {ticks.map((t) => (
        <g key={t.yr}>
          <line
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke="#1F2733"
            strokeWidth={1}
          />
          <text
            x={t.label.x}
            y={t.label.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#6A7382"
            fontSize={size * 0.04}
            fontFamily="IBM Plex Mono, monospace"
          >
            {t.yr}
          </text>
        </g>
      ))}

      {/* Chrono marker dot */}
      <circle cx={chronoDot.x} cy={chronoDot.y} r={3.5} fill="#6A7382" />
      <circle cx={chronoDot.x} cy={chronoDot.y} r={6} fill="none" stroke="#6A7382" strokeWidth={0.5} opacity={0.5} />

      {/* Bio marker dot with pulse */}
      <circle cx={bioDot.x} cy={bioDot.y} r={4} fill="#C9A227">
        <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={bioDot.x} cy={bioDot.y} r={8} fill="none" stroke="#C9A227" strokeWidth={0.5} opacity={0.3}>
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Center: rho value */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C9A227"
        fontSize={size * 0.09}
        fontFamily="IBM Plex Mono, monospace"
        fontWeight="bold"
      >
        ρ={rho}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#9AA0A8"
        fontSize={size * 0.04}
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="0.1em"
      >
        PACE
      </text>

      {/* Bottom label: deceleration */}
      <text
        x={cx}
        y={cy + radius * 0.65}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#10B981"
        fontSize={size * 0.045}
        fontFamily="IBM Plex Mono, monospace"
        fontWeight="bold"
      >
        -{Math.round((1 - rho) * 100)}% DECELERATION
      </text>
    </svg>
  )
}

export default DunedinGauge
