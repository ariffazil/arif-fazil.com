import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import BucketStrip from '@/components/BucketStrip'
import { useNow } from '@/hooks/useNow'

/* ------------------------------------------------------------------ */
/* Ambient Live Clock — small, right-aligned, not co-hero             */
/* ------------------------------------------------------------------ */

function AmbientClock() {
  const now = useNow()
  const kl = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))
  const hrs = String(kl.getHours()).padStart(2, '0')
  const mins = String(kl.getMinutes()).padStart(2, '0')
  const secs = String(kl.getSeconds()).padStart(2, '0')

  return (
    <span className="font-mono text-[13px] tabular-nums text-slate-400 tracking-[0.04em]">
      <span className="text-ember">{hrs}</span>
      <span className="text-slate-600 animate-pulse">:</span>
      <span>{mins}</span>
      <span className="text-slate-600 animate-pulse">:</span>
      <span>{secs}</span>
      <span className="ml-1.5 text-slate-500 text-[11px]">MYT</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero: Identity first, proof second, machines in footer  */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between py-10 md:py-16 border-b border-slate-800 bg-[#0a0b0d]">
      {/* High contrast radial backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(228,87,46,0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 my-auto">
        {/* 1. Eyebrow: location + ambient live clock */}
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-ember font-bold mb-3 flex items-center justify-between gap-4 max-w-[46ch]">
          <span>KUALA LUMPUR · UTC+8</span>
          <AmbientClock />
        </div>

        {/* 2. Main Headline */}
        <h1 className="font-display text-[clamp(56px,12vw,120px)] font-black leading-[0.85] tracking-[-0.04em] text-slate-50">
          ARIF FAZIL.
        </h1>

        {/* 3. Short Mission Line */}
        <p className="mt-4 max-w-[46ch] font-body text-[22px] sm:text-[28px] leading-[1.3] text-slate-200 font-light">
          Builds constitutionally-governed AI systems. Same discipline that makes oil wells flow, applied to making AI trustworthy.
        </p>

        {/* 4. Proof strip — strongest credibility signals, first viewport */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[32px] font-bold text-slate-100 leading-none">13</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">yrs exploration geoscience · PETRONAS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[32px] font-bold text-ember leading-none">4/4</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">wells led have flowed</span>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/words"
            className="px-6 py-3.5 rounded bg-ember text-black font-mono text-[13px] font-bold uppercase tracking-[0.1em] hover:bg-amber-400 transition-colors shadow-lg shadow-ember/20"
          >
            Read Writing →
          </Link>
          <a
            href="#person"
            className="px-6 py-3.5 rounded border border-slate-700 bg-slate-900/60 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-200 hover:bg-slate-800 hover:border-ember/50 transition-colors"
          >
            The Person ↓
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — The Person (Clean layout without AF card duplication)   */
/* ------------------------------------------------------------------ */

function Person() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const roles = [
    'Builder of arifOS — constitutional kernel for tools and agents',
    'Exploration geoscientist — basin risk, wells, uncertainty',
    'Architect of public MCP / WebMCP surfaces under arif-fazil.com',
  ]

  return (
    <section id="person" ref={ref} className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-16 md:py-24">
      <SectionHeader number="01" title="THE PERSON" />
      <div className="mt-10 max-w-[68ch]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-[36px] leading-none tracking-[-0.02em] md:text-5xl text-slate-100 font-extrabold"
        >
          Forged, not given.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ember font-semibold"
        >
          Current mission — constitutional AI kernels for earth, markets, and civic systems.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 font-body text-[19px] leading-[1.65] text-slate-200"
        >
          Muhammad Arif bin Fazil. Born in Penang on 22 May 1990. PETRONAS scholar. Double major in
          Geology &amp; Geophysics and Economics (University of Wisconsin–Madison). Corporate
          record: ~13 years exploration geoscience at PETRONAS. Sovereign work (parallel): author of
          arifOS — a constitution for machines.
        </motion.p>

        <ul className="mt-6 space-y-2 font-body text-[17px] text-slate-300">
          {roles.map((r) => (
            <li key={r} className="flex gap-2.5 items-start">
              <span className="text-ember mt-1" aria-hidden>▸</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative mt-8 font-body text-[20px] italic leading-[1.6] text-slate-300"
        >
          <span className="relative inline-block">
            Ditempa bukan diberi — forged, not given. Heat, pressure, time. It is how oil forms, and
            how people do.
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-ember"
            />
          </span>
        </motion.p>

        <p className="mt-8 font-mono text-[12px] leading-relaxed text-slate-400">
          Personal site — not an official PETRONAS publication.{' '}
          <a href="/machines/" className="underline decoration-slate-600 underline-offset-4 hover:text-slate-100">
            Legal / agent ops
          </a>
          .
        </p>

        {/* Structured identity for machines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Muhammad Arif bin Fazil',
              alternateName: 'Arif Fazil',
              birthDate: '1990-05-22',
              birthPlace: 'Penang, Malaysia',
              jobTitle: 'Exploration Geoscientist',
              worksFor: {
                '@type': 'Organization',
                name: 'PETRONAS Carigali',
                url: 'https://www.petronas.com'
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'University of Wisconsin–Madison'
              },
              knowsAbout: [
                'Geoscience',
                'Seismic Interpretation',
                'Basin Analysis',
                'AI Governance',
                'Constitutional AI',
                'MCP Protocol'
              ],
              url: 'https://arif-fazil.com/',
              sameAs: [
                'https://github.com/ariffazil',
                'https://t.me/ariffazil'
              ],
            }),
          }}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Five Doors Navigation                                  */
/* ------------------------------------------------------------------ */

function BucketsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <section ref={ref} className="border-y border-slate-800 bg-[#0a0b0d]">
      <div className="mx-auto max-w-[1280px] px-6 py-14 md:py-18">
        <SectionHeader number="02" title="NAVIGATE" className="mb-6" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-8 max-w-[48ch] font-body text-[17px] leading-[1.6] text-slate-300"
        >
          Five doors. Every artifact on this site belongs to exactly one bucket. 
          Click any door to enter — from anywhere on the site.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <BucketStrip current="Home" />
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — The Record                                              */
/* ------------------------------------------------------------------ */

const RECORD_STATS = [
  { n: 13, label: 'YEARS AT PETRONAS', href: '/earth', note: 'Corporate exploration record' },
  { n: 4, label: 'EXPLORATION WELLS LED', href: '/earth', note: '4/4 flowed — success band OBS' },
  { n: 13, label: 'CONSTITUTIONAL FLOORS', href: '/doctrine', note: 'F1–F13 public floors' },
  { n: 8, label: 'CANONICAL MCP TOOLS', href: '/work', note: 'Kernel Canonical 8' },
] as const

function StatCell({
  n,
  label,
  href,
  note,
}: {
  n: number
  label: string
  href: string
  note: string
}) {
  return (
    <Link
      to={href}
      className="block border-l border-slate-800 px-5 py-8 transition-colors first:border-l-0 hover:bg-slate-800/40 md:px-6"
      title={note}
      data-record-stat={label}
      data-record-value={n}
    >
      <div
        className="font-mono text-5xl tabular-nums tracking-[-0.02em] md:text-6xl text-slate-100 font-bold"
        aria-label={`${n} ${label}`}
      >
        {n}
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.04em] text-slate-400 md:text-[12px]">
        {label}
      </div>
      <span
        title="Observed — directly verified fact (not interactive)"
        className="mt-3 inline-block rounded-sm border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.04em] text-slate-400"
      >
        [OBS · source]
      </span>
    </Link>
  )
}

function Record() {
  return (
    <section
      id="record"
      className="mx-auto max-w-[1280px] px-6 py-20 md:py-24"
      data-section="the-record"
      aria-label="The Record — source-backed career and constitutional facts"
    >
      <SectionHeader number="03" title="THE RECORD" />
      <div className="mt-12 grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
        {RECORD_STATS.map((s) => (
          <StatCell key={s.label} n={s.n} label={s.label} href={s.href} note={s.note} />
        ))}
      </div>
      <p className="mt-6 max-w-[56ch] font-body text-[16px] leading-[1.6] text-slate-300">
        Exploration success band: <strong className="text-slate-100">4/4 wells flowed</strong> under team
        risk process — not a solo miracle; the record still needs context.
      </p>
      <p className="mt-4 max-w-[56ch] font-body text-[18px] italic leading-[1.65] text-slate-400">
        &quot;Every exploration well he has led has flowed. The record speaks plainly; it doesn&apos;t
        need adjectives.&quot;
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — Latest Words                                            */
/* ------------------------------------------------------------------ */

const posts = [
  {
    title: 'What a well teaches you about waiting',
    date: '2026-01-14',
    tag: 'WRITING',
    lang: 'EN',
    band: 'OBS',
    excerpt:
      'Fourteen months of planning, three weeks of drilling, and one moment when the mud logger goes quiet. Patience is not passive — it is pressure, held.',
    to: '/words',
  },
  {
    title: 'Harga minyak, harga nasi: satu ekonomi, dua meja',
    date: '2026-01-06',
    tag: 'MAKCIKGPT',
    lang: 'BM',
    band: 'OBS',
    excerpt:
      'Makcik explains fuel subsidies at the pasar table: who pays, who saves, and why the ringgit in your purse is an energy question.',
    to: '/world',
  },
  {
    title: 'Truth must cool before it rules',
    date: '2025-12-20',
    tag: 'DOCTRINE',
    lang: 'EN',
    band: 'OBS',
    excerpt:
      'Why arifOS holds its verdicts until the evidence settles — F2 TRUTH is not a feature flag; it is a cooling tower for hot claims.',
    to: '/words/doctrine',
  },
]

function LatestWords() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 py-20 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader number="04" title="LATEST WORDS" className="flex-1" />
        <div className="flex flex-wrap gap-4 font-mono text-[12px] uppercase tracking-[0.04em] text-slate-400">
          <a href="/writing/index.json" className="hover:text-slate-100">
            For agents · index.json
          </a>
          <Link to="/words" className="hover:text-slate-100">
            All writing →
          </Link>
        </div>
      </div>
      <div className="mt-12">
        {posts.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              to={p.to}
              className="group block border-t border-slate-800 px-4 py-8 transition-colors last:border-b hover:bg-slate-900/60"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-[26px] tracking-[-0.02em] md:text-[32px] text-slate-100">
                  <span className="mr-2 inline-block text-ember opacity-0 transition-opacity group-hover:opacity-100">
                    ▸
                  </span>
                  {p.title}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-slate-400 md:text-[12px]">
                  {p.date} · {p.tag} · {p.lang} · {p.band}
                </div>
              </div>
              <p className="mt-3 line-clamp-2 max-w-[65ch] font-body text-[17px] leading-[1.65] text-slate-300">
                {p.excerpt}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — Closing statement                                       */
/* ------------------------------------------------------------------ */

function Closing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const tracking = useTransform(scrollYProgress, [0, 1], ['0em', '0.06em'])
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 pb-28 pt-8 text-center">
      <motion.p
        style={{ letterSpacing: tracking }}
        className="mx-auto max-w-[26ch] font-display text-[30px] leading-[1.15] tracking-[-0.02em] md:text-[40px] text-slate-200"
      >
        This site is written for people. Machines are welcome too — politely, and in the footer.
      </motion.p>
    </section>
  )
}

export function Home() {
  return (
    <div className="grain bg-[#0a0b0d] text-slate-100 min-h-screen">
      <Hero />
      <Person />
      <BucketsSection />
      <Record />
      <LatestWords />
      <Closing />
    </div>
  )
}

export default Home;
