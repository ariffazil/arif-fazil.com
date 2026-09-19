import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNow, formatKL } from '@/hooks/useNow'
import { brand, primaryNav, type NavItem } from '@/data/navCanon'

export const agenticMirrors = [
  { label: 'mcp', name: 'MCP Gateway', href: 'https://mcp.arif-fazil.com/mcp', icon: '🔌', desc: 'WebMCP & Tool Discovery' },
  { label: 'hermes', name: 'HERMES', href: 'https://hermes.arif-fazil.com', icon: '🪽', desc: 'Meaning Integrity & Civic Voice' },
  { label: 'geox', name: 'GEOX', href: 'https://geox.arif-fazil.com', icon: '🌍', desc: 'Subsurface Earth Engine' },
  { label: 'well', name: 'WELL', href: 'https://well.arif-fazil.com', icon: '🫀', desc: 'Vitality & Homeostasis' },
  { label: 'wealth', name: 'WEALTH', href: 'https://wealth.arif-fazil.com', icon: '💰', desc: 'Capital & Claims Registry' },
  { label: 'aaa', name: 'AAA', href: 'https://aaa.arif-fazil.com', icon: '🏛️', desc: 'Sovereign Agent Cards & Skills' },
  { label: 'arifos', name: 'arifOS', href: 'https://arifos.arif-fazil.com', icon: '⚖️', desc: 'F1-F13 Governance Kernel' },
  { label: 'forge', name: 'A-FORGE', href: 'https://forge.arif-fazil.com', icon: '👐', desc: 'Execution & Mutation Shell' },
]

// Human-first glosses for canonical nav tokens (annotation only — the nav list itself stays canon-derived).
// Purpose: a first-time visitor gets a plain-language hint for 999/000/AAA/words/work without diluting identity.
const navHints: Record<string, string> = {
  '/': 'Home — sovereign surface',
  '/about': 'About — who is Arif Fazil',
  '/earth': 'Earth — live geology globe, wells & basins',
  '/world': 'World — economics & situational atlas',
  '/makcikgpt': 'MakcikGPT — HERMES civic intelligence in Bahasa Makcik',
  '/words': 'Words — essays & analysis',
  '/work': 'Work — projects, systems & the substrate',
  '/999': '999 — proof, audit & verification',
  '/000': '000 — machine context (for agents)',
  '/AAA': 'AAA — canon & agent federation',
  '/aaa': 'AAA — canon & agent federation',
}

function NavItemLink({
  item,
  className,
  activeClassName,
  onClick,
  mobile,
}: {
  item: NavItem
  className?: string
  activeClassName?: string
  onClick?: () => void
  mobile?: boolean
}) {
  const territoryAccent: Record<string, string> = {
    '/earth': 'decoration-[#E4572E]',
    '/world': 'decoration-[#EDEAE2]',
    '/words': 'decoration-[#C9A227]',
    '/work': 'decoration-[#31C48D]',
    '/999': 'decoration-[#E0301E]',
    '/000': 'decoration-[#D9A62E]',
    '/AAA': 'decoration-[#91B0F2]',
  }
  const hrefNorm = item.href.replace(/\/$/, '') || '/'
  const accent = territoryAccent[hrefNorm] || 'decoration-ember'
  const hint = navHints[hrefNorm]
  const base =
    className ??
    'font-mono text-[11px] lg:text-[12px] uppercase tracking-[0.06em] transition-colors text-ink-soft hover:text-ink'
  const active =
    activeClassName ??
    `text-ink font-semibold underline ${accent} decoration-2 underline-offset-8`

  const forceStatic =
    item.mode === 'static' ||
    item.mode === 'external' ||
    item.external

  if (forceStatic) {
    return (
      <a
        href={item.href}
        title={hint}
        aria-label={hint}
        onClick={onClick}
        className={base}
        {...(item.external || item.mode === 'external'
          ? { target: '_blank', rel: 'noreferrer' }
          : {})}
      >
        {item.label}
      </a>
    )
  }

  return (
    <NavLink
      to={item.href}
      title={hint}
      aria-label={hint}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} ${isActive ? active : ''} ${mobile ? 'font-display text-3xl tracking-[-0.02em] normal-case no-underline' : ''}`
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Navbar() {
  const now = useNow()
  const [open, setOpen] = useState(false)
  const [mirrorOpen, setMirrorOpen] = useState(false)
  const mirrorRef = useRef<HTMLDivElement>(null)

  // Close mirror dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mirrorRef.current && !mirrorRef.current.contains(e.target as Node)) {
        setMirrorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-md hairline">
      <div className="mx-auto flex h-14 max-w-[1360px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to={brand.href}
            className="flex items-center gap-1.5 font-display text-[16px] font-bold tracking-[-0.02em] text-ink hover:text-ember transition-colors"
          >
            <span className="font-mono text-xs px-1.5 py-0.5 rounded border border-ink-soft/30 text-ink-soft">Ψ</span>
            <span>{brand.label}</span>
          </Link>
        </div>

        {/* Desktop Primary Nav (8 canonical items) */}
        <nav className="hidden items-center gap-3.5 lg:gap-5 md:flex" aria-label="Primary">
          {primaryNav.map((l) => (
            <NavItemLink key={l.href + l.label} item={l} />
          ))}
        </nav>

        {/* Right side: Agentic Mirror Switcher + Live Clock */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Agentic Mirror Dropdown */}
          <div className="relative" ref={mirrorRef}>
            <button
              onClick={() => setMirrorOpen(!mirrorOpen)}
              className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
                mirrorOpen
                  ? 'border-ember text-ember bg-ember/10'
                  : 'border-ink-soft/20 text-ink-soft hover:text-ink hover:border-ink-soft/40 bg-ink-soft/5'
              }`}
              title="Mirror to Agentic Web Organs"
            >
              <span>🪞 Agentic</span>
              <span className="text-[9px] opacity-70">▾</span>
            </button>

            <AnimatePresence>
              {mirrorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-lg border border-ink-soft/20 bg-[#111318] p-2 shadow-2xl z-50"
                >
                  <div className="px-2.5 py-1.5 border-b border-ink-soft/10 mb-1">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/60">
                      Federation Organs · Agentic Web
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {agenticMirrors.map((m) => (
                      <a
                        key={m.label}
                        href={m.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-2.5 px-2 py-1.5 rounded hover:bg-ink-soft/10 transition-colors group"
                      >
                        <span className="text-sm mt-0.5">{m.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold uppercase text-ink group-hover:text-ember transition-colors">
                              {m.label}
                            </span>
                            <span className="font-mono text-[10px] text-ink-soft/50 group-hover:text-ink-soft">
                              ↗
                            </span>
                          </div>
                          <div className="text-[11px] text-ink-soft/70 leading-tight">
                            {m.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Clock with Green Pulse */}
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-ink-soft pl-2 border-l border-ink-soft/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#31C48D] animate-pulse" />
            <span className="text-ink font-medium tabular-nums">{formatKL(now)}</span>
            <span className="text-ink-soft/60">MYT</span>
          </div>
        </div>

        {/* Mobile toggle button */}
        <button
          className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-soft hover:text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {/* Thin rail accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/30 to-transparent" aria-hidden />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#0A0B0D] px-6 py-5 md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[17px] font-semibold text-ink">{brand.label}</span>
              <button
                className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-soft"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                Close ✕
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-4" aria-label="Primary mobile">
              {primaryNav.map((l, i) => (
                <motion.div
                  key={l.href + l.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <NavItemLink
                    item={l}
                    mobile
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl tracking-[-0.02em] text-ink"
                  />
                </motion.div>
              ))}
            </nav>

            {/* Agentic Mirrors on Mobile */}
            <div className="mt-8 border-t border-ink-soft/20 pt-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/70 mb-3">
                🪞 Agentic Web Organs
              </p>
              <div className="grid grid-cols-2 gap-2">
                {agenticMirrors.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded bg-ink-soft/5 border border-ink-soft/10 text-xs font-mono text-ink uppercase"
                  >
                    <span>{m.icon}</span>
                    <span>{m.label} ↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 flex items-center gap-2 font-mono text-[11px] tabular-nums text-ink-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31C48D] animate-pulse" />
              <span>KUALA LUMPUR · {formatKL(now)} MYT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
