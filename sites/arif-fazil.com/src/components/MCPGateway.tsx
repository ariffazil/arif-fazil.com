/**
 * MCPGateway — Constitutional agent access portal.
 * Appears at the bottom of every 5-bucket page.
 * One door per federation organ. DITEMPA BUKAN DIBERI.
 */

const organs: Array<{ label: string; desc: string; href: string; color: string; ring: string; internal?: boolean }> = [
  { label: 'arifOS',      desc: 'Constitutional kernel · init→judge→seal',    href: 'https://arifos.arif-fazil.com/mcp',   color: '#9AA0A8', ring: 'rgba(154,160,168,0.2)' },
  { label: 'GEOX',        desc: 'Earth intelligence · 42 MCP tools',           href: 'https://geox.arif-fazil.com/mcp',     color: '#D4A853', ring: 'rgba(212,168,83,0.2)' },
  { label: 'WEALTH',      desc: 'Capital intelligence · NPV/EMV/risk',         href: 'https://wealth.arif-fazil.com/mcp',   color: '#C9A227', ring: 'rgba(201,162,39,0.2)' },
  { label: 'WELL',        desc: 'Vitality mirror · human + machine readiness', href: 'https://well.arif-fazil.com/mcp',     color: '#38BEC9', ring: 'rgba(56,190,201,0.2)' },
  { label: 'A-FORGE',     desc: 'Governed execution shell · build/deploy',     href: 'https://mcp.arif-fazil.com/mcp',      color: '#E4572E', ring: 'rgba(228,87,46,0.2)' },
  { label: '000·Genesis', desc: 'Origin archive · /000/',                       href: '/000/',                                 color: '#9AA0A8', ring: 'rgba(154,160,168,0.2)', internal: true },
  { label: '999·Verify',  desc: 'Vault proof chain · /999/verify',              href: '/999/verify',                           color: '#EDEAE2', ring: 'rgba(237,234,226,0.2)', internal: true },
] as const

export default function MCPGateway() {
  return (
    <section className="border-t border-slate-800 bg-[#08090b] text-slate-400">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-ember" aria-hidden />
          <h3 className="font-mono text-[12px] uppercase tracking-[0.14em] text-slate-300 font-bold">
            Machine Surfaces — MCP Gateway
          </h3>
        </div>
        <p className="mb-6 max-w-[54ch] font-body text-[14px] leading-[1.6] text-slate-400">
          Federation organs expose governed Model Context Protocol endpoints. Each organ computes evidence; arifOS judges; human sovereign decides. <span className="text-ember font-semibold">DITEMPA BUKAN DIBERI.</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {organs.map((o) => (
            o.internal ? (
              <a
                key={o.label}
                href={o.href}
                className="inline-flex items-center gap-2 rounded border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-slate-300 transition-all duration-200 hover:border-slate-600 hover:text-slate-100"
                title={o.desc}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
                {o.label} →
              </a>
            ) : (
              <a
                key={o.label}
                href={o.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-slate-300 transition-all duration-200 hover:border-slate-600 hover:text-slate-100"
                title={o.desc}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
                {o.label} ↗
              </a>
            )
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] text-slate-500">
          Canonical Kernel Verbs: arif_init → arif_observe → arif_think → arif_route → arif_memory → arif_judge → arif_forge → arif_seal
        </p>
      </div>
    </section>
  )
}
