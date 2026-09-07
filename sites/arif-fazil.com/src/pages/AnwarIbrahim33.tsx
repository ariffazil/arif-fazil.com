import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ANWAR_SHADOWS, ANWAR_SUMMARY, type ShadowAxis } from '@/data/anwarShadows33';

const AXIS_META: Record<ShadowAxis, { label: string; emoji: string; color: string; border: string; bg: string }> = {
  sosiopolitik: { label: 'Sosiopolitik', emoji: '🏛️', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-900/20' },
  ekonomi: { label: 'Ekonomi', emoji: '💸', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-900/20' },
  peribadi: { label: 'Peribadi', emoji: '🗝️', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-900/20' },
};

export function AnwarIbrahim33() {
  const [filter, setFilter] = useState<ShadowAxis | 'ALL'>('ALL');
  const shadows = filter === 'ALL' ? ANWAR_SHADOWS : ANWAR_SHADOWS.filter(s => s.axis === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-16 md:py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">POLICY ACCOUNTABILITY · HUMAN EUREKA KERNEL · 33 TENSIONS</div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.85] tracking-tighter mb-4 text-forge-white">
            33 Tensions<br />Anwar Ibrahim
          </h1>
          <p className="font-body text-lg text-forge-dim max-w-3xl leading-relaxed mb-4">
            {ANWAR_SUMMARY.methodologyNote}
          </p>
          <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest mb-6">
            3 AXIS · 11 TENSIONS SETIAP SATU · DARI REKOD AWAM · BUKAN DIAGNOSIS PSIKOLOGI
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/politics/shadow"
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-orange/40 text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors">
              ← Semua PM Bayang
            </Link>
          </div>
        </div>
      </section>

      {/* METHODOLOGY DISCLAIMER */}
      <section className="py-8 border-b border-forge-iron bg-forge-steel/50">
        <div className="site-frame">
          <div className="p-5 rounded-lg border border-forge-orange/30 bg-forge-orange/5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-forge-orange mb-3">Nota Metodologi</h3>
            <p className="font-body text-sm text-forge-dim leading-relaxed">
              Artikel ini menilai rekod awam, keputusan dasar, kenyataan politik, dan perubahan koalisi.
              Ia <strong className="text-forge-white">tidak</strong> membuat diagnosis psikologi, tidak mendakwa mengetahui motif peribadi,
              dan tidak menganggap percanggahan politik sebagai bukti watak tetap.
              Setiap isu dipisahkan antara: (1) fakta yang boleh diverifikasi, (2) tafsiran editorial,
              (3) penjelasan alternatif, (4) bukti yang diperlukan untuk menguatkan atau melemahkan tafsiran tersebut.
            </p>
          </div>
        </div>
      </section>

      {/* KERNEL VERDICT */}
      <section className="py-10 border-b border-forge-iron">
        <div className="site-frame">
          <div className="p-6 rounded-lg border-2 bg-emerald-900/20 border-emerald-500/30">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded text-emerald-400 border border-emerald-500/40">
                KERNEL VERDICT · ADAPTIVE REGULATOR
              </span>
              <span className="font-mono text-xs text-forge-dim uppercase tracking-wider">
                {ANWAR_SUMMARY.tenure} · PM ke-10 Malaysia
              </span>
            </div>
            <p className="font-serif text-lg md:text-xl text-forge-white leading-relaxed mb-4">
              {ANWAR_SUMMARY.coreInsight}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded border border-forge-iron bg-forge-black/40">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-orange block mb-2">Paksi Tegangan</span>
                <p className="font-body text-sm text-forge-dim">{ANWAR_SUMMARY.paradoxAxis}</p>
              </div>
              <div className="p-4 rounded border border-forge-iron bg-forge-black/40">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-orange block mb-2">Fungsi Pemilih</span>
                <p className="font-body text-sm text-forge-dim">{ANWAR_SUMMARY.selectorFunction}</p>
              </div>
              <div className="p-4 rounded border border-forge-iron bg-forge-black/40">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-orange block mb-2">Wilayah Bayang</span>
                <p className="font-body text-sm text-forge-dim">{ANWAR_SUMMARY.shadowTerritory}</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded border border-forge-iron/40 bg-forge-black/20">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-dim block mb-2">Metafora</span>
              <p className="font-serif text-sm text-forge-dim italic">{ANWAR_SUMMARY.metaphor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="py-6 border-b border-forge-iron sticky top-0 bg-forge-black/95 backdrop-blur-sm z-10">
        <div className="site-frame flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${filter === 'ALL' ? 'border-forge-orange bg-forge-orange text-forge-black' : 'border-forge-iron text-forge-dim hover:border-forge-orange/40'}`}>
            Semua 33
          </button>
          {(Object.keys(AXIS_META) as ShadowAxis[]).map(axis => (
            <button key={axis}
              onClick={() => setFilter(axis)}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${filter === axis ? `${AXIS_META[axis].border} ${AXIS_META[axis].bg} ${AXIS_META[axis].color}` : 'border-forge-iron text-forge-dim hover:border-forge-orange/40'}`}>
              {AXIS_META[axis].emoji} {AXIS_META[axis].label} (11)
            </button>
          ))}
        </div>
      </section>

      {/* TENSION CARDS — Four-Column Discipline */}
      <section className="py-12">
        <div className="site-frame">
          <div className="grid grid-cols-1 gap-8">
            {shadows.map((shadow, idx) => {
              const meta = AXIS_META[shadow.axis];
              return (
                <motion.article
                  key={shadow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.8) }}
                  className={`border-2 ${meta.border} bg-forge-steel overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex items-center justify-between border-b border-forge-iron/40">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[0.6rem] tracking-widest ${meta.color}`}>
                        {meta.emoji} TENSION {String(shadow.id).padStart(2, '0')}
                      </span>
                      <span className={`font-mono text-[0.5rem] uppercase tracking-wider px-2 py-0.5 rounded border ${meta.border} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Card Title */}
                  <div className="px-6 pt-4 pb-2">
                    <h3 className="font-serif text-xl font-bold text-forge-white leading-tight">
                      {shadow.title}
                    </h3>
                  </div>

                  {/* Four-Column Grid */}
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FACT */}
                    <div className="p-4 rounded border border-forge-iron/40 bg-forge-black/30">
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-emerald-400 block mb-2">
                        ● Fakta (Rekod Awam)
                      </span>
                      <p className="font-body text-sm text-forge-dim leading-relaxed">
                        {shadow.fact}
                      </p>
                    </div>

                    {/* INTERPRETATION */}
                    <div className="p-4 rounded border border-forge-iron/40 bg-forge-black/30">
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-amber-400 block mb-2">
                        ◆ Tafsiran (Editorial)
                      </span>
                      <p className="font-body text-sm text-forge-dim leading-relaxed">
                        {shadow.interpretation}
                      </p>
                    </div>

                    {/* ALTERNATIVES */}
                    <div className="p-4 rounded border border-forge-iron/40 bg-forge-black/30">
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-blue-400 block mb-2">
                        ◈ Alternatif
                      </span>
                      <ul className="space-y-1">
                        {shadow.alternatives.map((alt, i) => (
                          <li key={i} className="font-body text-sm text-forge-dim leading-relaxed flex items-start gap-2">
                            <span className="text-blue-400/60 mt-0.5">—</span>
                            <span>{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* LIMITS */}
                    <div className="p-4 rounded border border-forge-iron/40 bg-forge-black/30">
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-red-400 block mb-2">
                        ✕ Had Inferens
                      </span>
                      <p className="font-body text-sm text-forge-dim leading-relaxed">
                        {shadow.limits}
                      </p>
                    </div>
                  </div>

                  {/* Source */}
                  <div className="px-6 py-3 border-t border-forge-iron/40 bg-forge-black/20">
                    <span className="font-mono text-[0.55rem] text-forge-dim/60 uppercase tracking-wider">Sumber: </span>
                    <span className="font-body text-xs text-forge-dim/70 italic">{shadow.source}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="py-12 border-t-2 border-forge-iron">
        <div className="site-frame">
          <h3 className="font-mono text-xs uppercase tracking-widest text-forge-orange mb-4">Sumber Penuh</h3>
          <div className="flex flex-wrap gap-2">
            {ANWAR_SUMMARY.sources.map(src => (
              <span key={src} className="font-mono text-[0.6rem] text-forge-dim border border-forge-iron px-3 py-1 rounded">
                {src}
              </span>
            ))}
          </div>

          {/* Kernel Attribution */}
          <div className="mt-8 p-4 rounded border border-forge-orange/20 bg-forge-orange/5">
            <p className="font-mono text-[0.6rem] text-forge-dim leading-relaxed">
              <strong className="text-forge-orange">HUMAN_EUREKA_KERNEL v1.1</strong> — Analisis ini menggunakan lapisan tadbir urus anti-reduksionis manusia.
              Setiap kad dipisahkan antara fakta, tafsiran, alternatif, dan had inferens.
              Ia bukan diagnosis psikologi. Ia bukan dakwaan identiti.
              Ia analisis akauntabiliti polisi terhadap rekod awam.
            </p>
          </div>

          <p className="mt-8 font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest text-center">
            DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi. ΔS ≤ 0
          </p>
        </div>
      </section>
    </motion.div>
  );
}
