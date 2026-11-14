/**
 * HeaderCanon — THE one header. Sole header of every ATLAS shell; no page may
 * render its own navbar (verify-design-canon enforces single-nav on mandated
 * routes). Nav data: navCanon.ts (generated from canon/navigation.json —
 * never hand-edit nav lists).
 */
import { brand, machineNav, primaryNav } from '@/data/navCanon';
import { RING_ACCENTS, type ShellRing } from '@/shells/ringTokens';

export interface HeaderCanonProps {
  ring?: ShellRing;
}

function mytClock(): string {
  const t = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour12: false,
  });
  return `${t} MYT`;
}

export function HeaderCanon({ ring }: HeaderCanonProps) {
  const ra = ring ? RING_ACCENTS[ring] : undefined;
  return (
    <header className="atlas-header">
      <a className="atlas-brand" href={brand.href}>
        <span className="brand-dot">▞</span> {brand.label}
      </a>
      <nav className="atlas-nav" aria-label="Primary">
        {primaryNav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      {ra && (
        <span className="atlas-ringpill">
          <span className="pill-dot" /> {ra.label}
        </span>
      )}
      {/* M2 federation switcher — human cross-domain movement. Data:
          navCanon.machineNav (generated, external organ hosts only). Native
          <details>: keyboard/screen-reader operable, zero JS, no hover-only. */}
      <details className="atlas-fed">
        <summary aria-label="Federation domain switcher">
          <span className="fed-dot" /> FED
        </summary>
        <div className="atlas-fed-menu">
          {machineNav
            .filter((item) => item.external)
            .map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
        </div>
      </details>
      <span className="atlas-clock">{mytClock()}</span>
    </header>
  );
}
