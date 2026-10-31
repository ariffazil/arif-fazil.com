import React from 'react';

export type SovereignTerritory = 'PORTAL' | 'ARCHIVE' | 'GEOX' | 'ARIFOS';

export interface LayoutGridProps {
  territory: SovereignTerritory;
  subtitle?: string;
  substrateStatus?: string;
  showTorusAnchor?: boolean;
  showFractalOverlay?: boolean;
  children: React.ReactNode;
}

/**
 * LayoutGrid — Shared Dark-Triad (#0A0C10 Void, #E2E2E8 Bone, #38BDF8 Blue, #EF4444 Red, #F59E0B Yellow)
 * Orthogonal 0px Grid, Fractal Subdivision Overlay & Toroidal Manifold SVG Wrapper.
 * Design System Asset: assets/53930e338fa249e8bec7808f181df468
 */
export const LayoutGrid: React.FC<LayoutGridProps> = ({
  territory,
  subtitle = 'Sovereign Intelligence Constellation',
  substrateStatus = 'SUBSTRATE HEALTHY',
  showTorusAnchor = true,
  showFractalOverlay = true,
  children,
}) => {
  return (
    <div
      className="relative min-h-screen w-full bg-[#0A0C10] text-[#E2E2E8] font-body-md antialiased selection:bg-[#38BDF8]/25 selection:text-[#E2E2E8] overflow-x-hidden rounded-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Orthogonal Registration Crosshairs (+) at Viewport Vertices */}
      <div className="pointer-events-none fixed inset-0 z-40 border border-[#232B3E]/80 rounded-none">
        <span className="absolute top-1 left-1.5 font-mono text-[10px] leading-none text-[#38BDF8]/70 select-none">+</span>
        <span className="absolute top-1 right-1.5 font-mono text-[10px] leading-none text-[#EF4444]/70 select-none">+</span>
        <span className="absolute bottom-1 left-1.5 font-mono text-[10px] leading-none text-[#F59E0B]/70 select-none">+</span>
        <span className="absolute bottom-1 right-1.5 font-mono text-[10px] leading-none text-[#38BDF8]/70 select-none">+</span>
      </div>

      {/* Shared Toroidal Manifold & Fractal Vector Overlay (1 Anchor Per Viewport Rule) */}
      {showTorusAnchor && (
        <div className="pointer-events-none fixed top-20 right-4 w-44 h-44 opacity-20 z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="50" cy="50" r="46" stroke="#38BDF8" strokeDasharray="2 4" strokeWidth="0.75" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#38BDF8" strokeWidth="0.6" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#EF4444" strokeWidth="0.6" transform="rotate(90 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#F59E0B" strokeWidth="0.6" transform="rotate(150 50 50)" />
            {showFractalOverlay && (
              <>
                <polygon points="50,8 90,28 90,72 50,92 10,72 10,28" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.6" />
                <polygon points="50,20 78,34 78,66 50,80 22,66 22,34" stroke="#F59E0B" strokeWidth="0.4" strokeOpacity="0.6" />
              </>
            )}
            <circle cx="50" cy="50" r="10" stroke="#EF4444" strokeWidth="0.9" />
          </svg>
        </div>
      )}

      {/* Canonical Sovereign Top Telemetry Header (0px Orthogonal) */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0C10]/95 backdrop-blur-xl border-b border-[#232B3E] rounded-none">
        <div className="h-20 px-5 flex items-center justify-between gap-2 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#38BDF8]/60 via-[#F59E0B]/50 to-[#EF4444]/60" />
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-none bg-[#10141D] border border-[#38BDF8] text-[#38BDF8] flex items-center justify-center font-mono text-xs font-bold tracking-widest shrink-0">
              AF
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-[#E2E2E8] tracking-tight truncate leading-none">
                  ARIF FAZIL
                </span>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-[#10141D] border border-[#38BDF8]/50 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-none bg-[#38BDF8]" />
                  <span className="font-mono text-[10px] text-[#38BDF8] font-semibold tracking-wider uppercase">
                    {substrateStatus}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-mono text-[11px] text-[#87929A] truncate">{subtitle}</span>
                <span className="text-[#3E484F] font-mono text-[11px]">/</span>
                <span className="font-mono text-[11px] text-[#F59E0B] font-bold uppercase tracking-wider">
                  {territory}
                </span>
              </div>
            </div>
          </div>
          {/* Primary Triad Indicator Ledger (Blue / Yellow / Red) */}
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 bg-[#00354A] border border-[#38BDF8] text-[#8ED5FF] rounded-none">
              BLUE:INST
            </span>
            <span className="px-1.5 py-0.5 bg-[#613B00] border border-[#F59E0B] text-[#FFC174] rounded-none">
              YEL:HUM
            </span>
            <span className="px-1.5 py-0.5 bg-[#68000A] border border-[#EF4444] text-[#FFB3AD] rounded-none">
              RED:F13
            </span>
          </div>
        </div>
      </header>

      {/* Screen Content Slot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LayoutGrid;
