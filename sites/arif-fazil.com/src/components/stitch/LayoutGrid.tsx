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
 * LayoutGrid — Shared Dark-Triad (#0a0c10 Void, #e6edf3 Bone, #5f8fb3 Blue, #c24a3d Red, #d9a62e Yellow)
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
      className="relative min-h-screen w-full bg-[#0a0c10] text-[#e6edf3] font-body antialiased selection:bg-[#5f8fb3]/25 selection:text-[#e6edf3] overflow-x-hidden rounded-canon"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(56, 189, 248, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.06) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Orthogonal Registration Crosshairs (+) at Viewport Vertices */}
      <div className="pointer-events-none fixed inset-0 z-40 border border-[#2a3340]/80 rounded-canon">
        <span className="absolute top-1 left-1.5 font-mono text-[10px] leading-none text-[#5f8fb3]/70 select-none">+</span>
        <span className="absolute top-1 right-1.5 font-mono text-[10px] leading-none text-[#c24a3d]/70 select-none">+</span>
        <span className="absolute bottom-1 left-1.5 font-mono text-[10px] leading-none text-[#d9a62e]/70 select-none">+</span>
        <span className="absolute bottom-1 right-1.5 font-mono text-[10px] leading-none text-[#5f8fb3]/70 select-none">+</span>
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
            <circle cx="50" cy="50" r="46" stroke="#5f8fb3" strokeDasharray="2 4" strokeWidth="0.75" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#5f8fb3" strokeWidth="0.6" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#c24a3d" strokeWidth="0.6" transform="rotate(90 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#d9a62e" strokeWidth="0.6" transform="rotate(150 50 50)" />
            {showFractalOverlay && (
              <>
                <polygon points="50,8 90,28 90,72 50,92 10,72 10,28" stroke="#5f8fb3" strokeWidth="0.4" strokeOpacity="0.6" />
                <polygon points="50,20 78,34 78,66 50,80 22,66 22,34" stroke="#d9a62e" strokeWidth="0.4" strokeOpacity="0.6" />
              </>
            )}
            <circle cx="50" cy="50" r="10" stroke="#c24a3d" strokeWidth="0.9" />
          </svg>
        </div>
      )}

      {/* Territory eyebrow strip — non-fixed; the app shell owns the main nav
          (sovereign 2026-11-04: no duplicate header) */}
      <div className="px-5 pt-6 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-[#11151c] border border-[#5f8fb3]/50">
          <span className="w-1.5 h-1.5 rounded-canon bg-[#5f8fb3]" />
          <span className="text-[#5f8fb3] font-semibold tracking-wider uppercase">{substrateStatus}</span>
        </span>
        <span className="text-[#8b98a8] truncate">{subtitle}</span>
        <span className="text-[#2a3340]">/</span>
        <span className="text-[#d9a62e] font-bold uppercase tracking-wider">{territory}</span>
      </div>

      {/* Screen Content Slot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LayoutGrid;
