/**
 * ArrowFooter — Temporal Minimal human-first footer (Option A).
 * Three quiet human columns (Presence · Work · Connect) + one subordinate machine line.
 * Deep organ maps & JSON inventories live on /map and /arifos/.
 */

const presenceLinks = [
  { label: 'About', href: '/about' },
  { label: 'Writing', href: '/words/' },
  { label: 'MakcikGPT', href: '/world/makcikgpt/' },
  { label: 'Briefing', href: '/institution/' },
] as const

const workLinks = [
  { label: 'Wells & Evidence', href: '/work/' },
  { label: 'Earth', href: '/earth/' },
  { label: 'Observatory', href: '/arifos/' },
  { label: 'Economics', href: '/economics/' },
] as const

const connectLinks = [
  { label: 'Contact', href: '/contact/', external: false },
  { label: 'Telegram', href: 'https://t.me/ariffazil', external: true },
  { label: 'GitHub', href: 'https://github.com/ariffazil', external: true },
  { label: 'Privacy', href: '/privacy/', external: false },
] as const

export default function Footer() {
  return (
    <footer className="border-t border-[#EDEAE2]/10 bg-[#07080B] text-[#EDEAE2]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Column 1 — Presence */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4A853] mb-4">
              Presence
            </p>
            <ul className="space-y-2.5 font-sans text-sm text-[#9AA0A8]">
              {presenceLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[#EDEAE2] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Work */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4A853] mb-4">
              Work
            </p>
            <ul className="space-y-2.5 font-sans text-sm text-[#9AA0A8]">
              {workLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[#EDEAE2] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Connect */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4A853] mb-4">
              Connect
            </p>
            <ul className="space-y-2.5 font-sans text-sm text-[#9AA0A8]">
              {connectLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="hover:text-[#EDEAE2] transition-colors"
                    {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {l.label}
                    {l.external ? ' ↗' : ''}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Single subordinate machine & creed line */}
        <div className="mt-12 pt-6 border-t border-[#EDEAE2]/10 flex flex-col gap-3">
          <p className="font-mono text-[11px] tracking-[0.06em] text-[#9AA0A8]/75">
            For machines:{' '}
            <a href="/human/" className="hover:text-[#EDEAE2] transition-colors">
              /human
            </a>
            {' · '}
            <a href="/llms.txt" className="hover:text-[#EDEAE2] transition-colors">
              /llms.txt
            </a>
            {' · '}
            <a href="/map" className="hover:text-[#EDEAE2] transition-colors">
              /map
            </a>
            {' · '}
            <a
              href="https://mcp.arif-fazil.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#EDEAE2] transition-colors"
            >
              mcp
            </a>
            {' · '}
            <a href="/contact/" className="hover:text-[#EDEAE2] transition-colors">
              /contact
            </a>
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="font-display italic text-sm text-[#D4A853]">
              Ditempa bukan diberi — forged, not given.
            </p>
            <p className="font-mono text-[11px] tracking-[0.06em] text-[#9AA0A8]/60">
              © 2026 ARIF FAZIL
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
