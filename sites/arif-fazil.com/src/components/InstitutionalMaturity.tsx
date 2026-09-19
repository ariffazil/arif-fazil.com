/**
 * InstitutionalMaturity — what accumulates across time in a governed system.
 *
 * NOT "mind age" (category error for AI). NOT "biological age" (no biology).
 * This measures: survivability of accumulated correction.
 *
 * Maturity = capacity to metabolize failure into durable constraints.
 * A scar is not history. A scar is history that changed future behavior.
 *
 * Source: arifOS constitutional framework. Ratified doctrines + sealed verdicts.
 * All values are declared/derived, not measured from runtime telemetry.
 */

interface MaturityDimension {
  label: string
  value: number // 0-100
  evidence: string
  source: string
  color: string
}

const DIMENSIONS: MaturityDimension[] = [
  {
    label: 'Identity Continuity',
    value: 92,
    evidence: 'VAULT999 hash chain unbroken since 2026-08-01. Actor binding via constitutional chain.',
    source: 'VAULT999 seal_chain.jsonl',
    color: '#38BDF8',
  },
  {
    label: 'Governance Stability',
    value: 84,
    evidence: '13 constitutional floors (F1-F13) ratified. Floor violations: decreasing trend.',
    source: 'arifOS kernel :8088',
    color: '#C9A227',
  },
  {
    label: 'Scar Utilization',
    value: 88,
    evidence: '9+ sealed SCARs. Each failure metabolized into permanent constraint. Not archive — changed behavior.',
    source: 'A-FORGE scar registry',
    color: '#E4572E',
  },
  {
    label: 'Correction Velocity',
    value: 73,
    evidence: 'Time from disconfirming evidence to corrected behavior. Improving but not yet monotonic.',
    source: 'CHRON calibration / arifFlow FQ',
    color: '#10B981',
  },
  {
    label: 'Witness Depth',
    value: 96,
    evidence: '52,043+ receipts in VAULT999. Every sealed action carries trace_id + constitutional chain.',
    source: 'VAULT999 + arifFlow',
    color: '#A78BFA',
  },
]

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-[#161D2B] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${value}%`,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  )
}

export function InstitutionalMaturity() {
  const composite = Math.round(
    DIMENSIONS.reduce((sum, d) => sum + d.value, 0) / DIMENSIONS.length
  )

  return (
    <div className="space-y-3">
      {/* Composite score */}
      <div className="flex items-baseline justify-center gap-2 mb-1">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums">
          {composite}
        </span>
        <span className="font-mono text-sm text-[#9AA0A8]">/100</span>
      </div>
      <div className="text-center font-mono text-[9px] uppercase tracking-widest text-[#6A7382] mb-4">
        Derived Governance Metric
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        {DIMENSIONS.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#EDEAE2]">
                {d.label}
              </span>
              <span
                className="font-mono text-[11px] font-bold tabular-nums"
                style={{ color: d.color }}
              >
                {d.value}%
              </span>
            </div>
            <ProgressBar value={d.value} color={d.color} />
          </div>
        ))}
      </div>

      {/* Doctrine footer */}
      <div className="pt-3 border-t border-[#1F2733] space-y-1.5">
        <div className="font-mono text-[9px] uppercase tracking-widest text-[#6A7382]">
          Governing Principle
        </div>
        <p className="font-sans text-[11px] text-[#9AA0A8] leading-relaxed">
          Maturity ≠ time alive. Maturity = capacity to metabolize failure into durable constraints.
          A scar is not history. A scar is history that changed future behavior.
        </p>
        <p className="font-mono text-[9px] text-[#6A7382] mt-2">
          Source: arifOS constitutional framework · F1-F13 ratified · VAULT999 sealed
        </p>
      </div>
    </div>
  )
}

export default InstitutionalMaturity
