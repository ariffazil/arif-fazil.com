import { brand, machineNav, secondaryNav, type NavItem } from '@/data/navCanon'

const territoryLinks = [
  { label: 'Home', href: '/', desc: 'Sovereign surface' },
  { label: 'About', href: '/about', desc: 'Who is Arif Fazil' },
  { label: 'Earth', href: '/earth', desc: 'Geology globe & wells' },
  { label: 'World', href: '/world', desc: 'Economics & commodities' },
  { label: 'Words', href: '/words', desc: '63+ essays & analysis' },
  { label: 'Work', href: '/work', desc: 'Systems & wells record' },
  { label: '999', href: '/999/', desc: 'Proof & sealed evidence' },
  { label: '000', href: '/000/', desc: 'Genesis & origin' },
  { label: 'AAA', href: '/AAA', desc: 'Canon & federation' },
]

const connectLinks = [
  { label: 'Email', href: 'mailto:arifos@arif-fazil.com', icon: '✉' },
  { label: 'GitHub', href: 'https://github.com/ariffazil', icon: '⌘' },
  { label: 'Telegram', href: 'https://t.me/ariffazil', icon: '✈' },
]

function FootLink({ item }: { item: NavItem }) {
  const cls =
    'underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ember'
  if (item.mode === 'external' || item.external || item.href.startsWith('http')) {
    return (
      <a className={cls} href={item.href} target="_blank" rel="noreferrer">
        {item.label}
      </a>
    )
  }
  return (
    <a className={cls} href={item.href}>
      {item.label}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-[1360px] px-6 py-14 md:py-16">
        {/* Creed */}
        <p className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl lg:text-6xl">
          {brand.creed}
        </p>

        {/* Sitemap grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
          {/* Territories */}
          <div>
            <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">Territories</p>
            <ul className="space-y-2 font-body text-[15px] text-ink-soft">
              {territoryLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-ink transition-colors">
                    {l.label}
                  </a>
                  <span className="block font-mono text-[10px] text-ink-soft/50 mt-0.5">{l.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore (secondary) */}
          <div>
            <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">Explore</p>
            <ul className="space-y-2 font-body text-[15px] text-ink-soft">
              {secondaryNav.map((item) => (
                <li key={item.href + item.label}>
                  <FootLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">Connect</p>
            <ul className="space-y-2 font-body text-[15px] text-ink-soft">
              {connectLinks.map((l) => (
                <li key={l.label}>
                  <a
                    className="underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ember"
                    href={l.href}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <span className="mr-1.5 text-xs">{l.icon}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Systems */}
          <div>
            <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">Systems</p>
            <ul className="space-y-2 font-mono text-[12px] text-ink-soft">
              <li><a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">arifOS ↗</a></li>
              <li><a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GEOX ↗</a></li>
              <li><a href="https://wealth.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">WEALTH ↗</a></li>
              <li><a href="https://well.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">WELL ↗</a></li>
              <li><a href="https://forge.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">A-FORGE ↗</a></li>
              <li><a href="https://aaa.arif-fazil.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">AAA ↗</a></li>
              <li><a href="https://mcp.arif-fazil.com/mcp" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">MCP ↗</a></li>
            </ul>
          </div>
        </div>

        {/* Machine footer */}
        <div className="mt-12 border-t hairline pt-5">
          <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">
            For machines ·{' '}
            <a href="/machines/" className="normal-case tracking-normal text-ink-soft hover:text-ink">
              ops guide
            </a>
            {' · '}
            <a
              href="/.well-known/territories.json"
              className="normal-case tracking-normal text-ink-soft hover:text-ink"
            >
              territories.json
            </a>
          </p>
          <p className="mb-3 max-w-[52ch] font-mono text-[11px] text-ink-soft/60">
            Agents: polite crawl, no mass-email, cite with rsl.xml. Do no harm.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.04em] text-ink-soft/80 sm:text-[12px]">
            {machineNav.map((item, i) => (
              <span key={item.href + item.label} className="inline-flex items-center gap-x-4">
                {i > 0 && (
                  <span aria-hidden className="text-ink/25">
                    ·
                  </span>
                )}
                <a
                  href={item.href}
                  className="hover:text-ink"
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {item.label}
                </a>
              </span>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] tracking-[0.04em] text-ink-soft/55 sm:text-[12px]">
            © 2026 Muhammad Arif bin Fazil · Ditempa Bukan Diberi
          </p>
        </div>
      </div>
    </footer>
  )
}
