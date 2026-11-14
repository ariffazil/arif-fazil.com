/**
 * RootShell — ATLAS shell for hub/root pages (atlas.yaml page_types.root-home).
 * Provides: HeaderCanon (one) · MainContent (page supplies its own hero) ·
 * CanonFooter. Geometry is page-owned here (respecting the ONE-torus law).
 */
import { HeaderCanon } from '@/components/canon/HeaderCanon';
import { CanonFooter } from '@/components/canon/CanonFooter';
import { RING_ACCENTS, type ShellRing } from '@/shells/ringTokens';
import './shell.css';

export interface RootShellProps {
  ring?: ShellRing;
  children: React.ReactNode;
}

export function RootShell({ ring = 'soul', children }: RootShellProps) {
  const ra = RING_ACCENTS[ring];
  const accentVars = {
    '--shell-accent': ra.accent,
    '--shell-accent-bg': ra.bg,
  } as React.CSSProperties;

  return (
    <div className="atlas-shell" data-ring={ra.dataRing} style={accentVars}>
      <HeaderCanon ring={ring} />
      {children}
      <CanonFooter />
    </div>
  );
}
