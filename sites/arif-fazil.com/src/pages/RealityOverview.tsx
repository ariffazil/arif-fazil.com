import { Link } from 'react-router-dom';
import { REALITY_DOMAINS, REALITY_PRIMITIVES, EUREKA_NODES } from '@/data/realityAtlas';

export function RealityOverview() {
  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2] pb-24">
      {/* ── HEADER ── */}
      <div className="border-b border-[#1F2733] bg-[#0A0D14] py-12 px-6">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E4572E]" />
            <span>Reality Atlas · Layer A & B Mapping</span>
            <span className="text-[#1F2733]">/</span>
            <span>The 8 Visible Domains</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Reality Domains
          </h1>

          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            The visible surface of the Atlas: 8 intuitive human domains grounded in 5 immutable reality primitives.
            Navigate directly into any territory to inspect its governing eurekas, live evidence, and operational surfaces.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-6 py-12">
        {/* ── 8 DOMAINS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.values(REALITY_DOMAINS).map((dom) => {
            const attachedNodes = EUREKA_NODES.filter((n) => n.domains.includes(dom.id));
            return (
              <div
                key={dom.id}
                id={dom.id}
                className="rounded-xl border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between hover:border-[#9AA0A8]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{dom.icon}</span>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#141923] border border-[#1F2733] text-[#9AA0A8]">
                      {attachedNodes.length} Eurekas
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-1">
                    {dom.label}
                  </h2>

                  <div className="font-mono text-xs text-[#E4572E] mb-3">
                    {dom.subtitle}
                  </div>

                  <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">
                    {dom.description}
                  </p>

                  <div className="mb-4 pt-3 border-t border-[#1F2733]">
                    <div className="font-mono text-[10px] uppercase text-[#9AA0A8]/70 mb-2">
                      Key Eurekas:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {attachedNodes.slice(0, 3).map((n) => (
                        <Link
                          key={n.id}
                          to="/graph"
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#141923] text-[#EDEAE2] hover:text-[#38BDF8]"
                        >
                          {n.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F2733]">
                  <a
                    href={dom.canonicalPath}
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    <span>Enter {dom.label} Surface</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 5 PRIMITIVES BOTTOM COMPRESSION ── */}
        <section className="rounded-xl border border-[#1F2733] bg-[#0A0D14] p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] mb-2">
            Layer B Compression
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-4">
            The 5 Reality Primitives That Constrain All 8 Domains
          </h2>
          <p className="font-sans text-sm text-[#9AA0A8] max-w-3xl mb-8 leading-relaxed">
            Domains are where questions arise. Primitives are how reality answers. Every insight in this Atlas
            is governed by this strict epistemological chain:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.values(REALITY_PRIMITIVES).map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-lg border border-[#1F2733] bg-[#0E121B]"
              >
                <div className="font-mono text-xs text-[#9AA0A8] mb-1">
                  0{idx + 1} · {p.label}
                </div>
                <div className="font-display font-bold text-sm text-[#EDEAE2] mb-2">
                  "{p.question}"
                </div>
                <p className="font-sans text-xs text-[#9AA0A8]/80 leading-relaxed">
                  {p.essence}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
