/**
 * CanonFooter — THE one footer for ATLAS shells. Creed + canon pointer +
 * provenance line. No nav lists (header is the only nav).
 */
import { brand } from '@/data/navCanon';

export function CanonFooter() {
  return (
    <footer className="atlas-footer">
      <span>
        {brand.label} · <em>{brand.creed}</em>
      </span>
      <a href="/words">canon · /words</a>
      <span>arifOS Federation · F1–F13 · forged, not given</span>
    </footer>
  );
}
