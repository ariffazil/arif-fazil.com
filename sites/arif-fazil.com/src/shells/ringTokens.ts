/**
 * Ring → shell-accent map. Single source: /_shared/design-system/tokens.css
 * v2.1 --accent-* block. soul=red (SOUL/sovereign) · mind=blue (MIND/
 * institution) · body=yellow (BODY/human) · earth=green (EARTH/geox).
 * Contrast is AA-verified on carbon (#0A0B0D) — see tokens.css header.
 */
export type ShellRing = 'soul' | 'mind' | 'body' | 'earth';

interface RingAccent {
  accent: string;
  bg: string;
  label: string;
  dataRing: string;
}

export const RING_ACCENTS: Record<ShellRing, RingAccent> = {
  soul: {
    accent: 'var(--accent-red, #E05A4E)',
    bg: 'var(--accent-red-bg, rgba(224, 90, 78, 0.10))',
    label: 'Ψ SOUL',
    dataRing: 'SOUL',
  },
  mind: {
    accent: 'var(--accent-blue, #7FB3FF)',
    bg: 'var(--accent-blue-bg, rgba(127, 179, 255, 0.10))',
    label: 'Ω MIND',
    dataRing: 'MIND',
  },
  body: {
    accent: 'var(--accent-yellow, #F2C879)',
    bg: 'var(--accent-yellow-bg, rgba(242, 200, 121, 0.10))',
    label: 'Δ BODY',
    dataRing: 'BODY',
  },
  earth: {
    accent: 'var(--accent-green, #58C9A0)',
    bg: 'var(--accent-green-bg, rgba(88, 201, 160, 0.10))',
    label: '⊕ EARTH',
    dataRing: 'ORGAN',
  },
};
