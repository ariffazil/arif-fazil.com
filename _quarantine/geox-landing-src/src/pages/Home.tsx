import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import SeismicCanvas from '@/components/SeismicCanvas'
import TerminalWindow from '@/components/TerminalWindow'
import StatusChip from '@/components/StatusChip'
import StrataCard from '@/components/StrataCard'
import ToolBadge from '@/components/ToolBadge'
import EpistemicLadder from '@/components/EpistemicLadder'
import { STATUS, liveLabel } from '@/lib/status'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const EYEBROW = `HUBNODE // PROTOCOL_V1 · ${liveLabel().toUpperCase()} · SNAPSHOT ${STATUS.generatedAt}`
const H1 = 'Bringing Clarity to a Chaotic Earth.'
const PROFILE_LINES = [
  '$ curl geox.arif-fazil.com/profile',
  '{',
  '  "organ": "GEOX",',
  '  "role": "Earth Intelligence",',
  `  "mcp_tools": ${STATUS.canonical},  // canonical SOT; operators verify via /drift`,
  `  "runtime_commit": "${STATUS.runtimeCommit ?? 'UNKNOWN'}",`,
  '  "rasa_cap": 0.90,',
  '  "hold": "888_HOLD",',
  '  "license": "BSL-1.1 → Apache-2.0 @2029-06-29"',
  '}',
]

function useTypewriter(text: string, speed: number, startDelay = 0) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const t = setTimeout(() => {
      interval = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), speed)
    }, startDelay)
    return () => {
      clearTimeout(t)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])
  return text.slice(0, n)
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const termY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const canvasOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])

  const eyebrow = useTypewriter(EYEBROW, 18, 200)
  const [termStarted, setTermStarted] = useState(false)
  const [termLines, setTermLines] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setTermStarted(true), 800)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!termStarted) return
    const iv = setInterval(
      () => setTermLines((v) => (v < PROFILE_LINES.length ? v + 1 : (clearInterval(iv), v))),
      60,
    )
    return () => clearInterval(iv)
  }, [termStarted])

  return (
    <section ref={ref} className="relative -mt-16 flex min-h-[100dvh] flex-col overflow-hidden">
      <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0">
        <img
          src="/hero-seismic.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <SeismicCanvas />
        <div className="absolute inset-0 bg-gradient-to-r from-basalt-950 via-basalt-950/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-12 px-8 pt-16 max-md:px-5 lg:grid-cols-12">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <p className="eyebrow min-h-[18px] text-telemetry-400">{eyebrow}</p>
          <h1 className="mt-6 font-display text-[72px] font-extrabold leading-[1.02] tracking-[-0.02em] text-bone-100 max-md:text-[42px]">
            {H1.split(' ').map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="mr-[0.28em] inline-block"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.9, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-[17px] leading-[1.65] text-bone-400 max-md:text-[15px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            GEOX is the Earth Intelligence organ of the arifOS Federation — an evidence-first
            subsurface coprocessor that turns raw geoscientific observation into governed
            decision support. It computes geological evidence. It never adjudicates — and it
            never books resources.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.6, ease: EASE }}
          >
            <Link
              to="/platform"
              data-cursor="OPEN"
              className="flex items-center gap-2 bg-magma-500 px-6 py-3 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-basalt-950 transition-shadow hover:shadow-[0_0_24px_#E8733B55]"
            >
              Open the Platform <ArrowRight size={15} />
            </Link>
            <Link
              to="/webmcp"
              data-cursor="OPEN"
              className="flex items-center gap-2 border border-strata-700 px-6 py-3 font-mono text-[13px] uppercase tracking-[0.14em] text-bone-100 transition-colors hover:border-telemetry-400/60 hover:text-telemetry-400"
            >
              Connect as an Agent ⌁
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: termY }} className="lg:col-span-5">
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalWindow title="geox — /profile" showCursor={termLines >= PROFILE_LINES.length}>
              {PROFILE_LINES.slice(0, termLines).map((l, i) => (
                <div key={i} className={i === 0 ? 'text-telemetry-400' : 'text-bone-100/90'}>
                  {l}
                </div>
              ))}
            </TerminalWindow>
          </motion.div>
        </motion.div>
      </div>

      {/* status marquee */}
      <div className="marquee-paused relative z-10 overflow-hidden border-t border-strata-700 bg-basalt-950/80 py-3">
        <div className="animate-marquee flex w-max gap-4">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-4 pr-4">
              <StatusChip variant="live" label={`SURFACE ${STATUS.live ?? '?'} / ${STATUS.canonical} TOOLS ●`} />
              <StatusChip variant="live" label={`RUNTIME ${STATUS.runtimeCommit ?? 'UNKNOWN'}`} />
              <StatusChip variant="hold" label="COMPUTES · NEVER ADJUDICATES" />
              <StatusChip variant="hold" label={`BUILD-TIME SNAPSHOT ${STATUS.generatedAt}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const COCKPITS = [
  {
    name: 'Prospect Forge',
    desc: 'Advisory DER/SPEC volumetric ranges — STOIIP/GIIP, POS. Kill Matrix K001–K007 fires before optimism does. Ranges are handed to WEALTH under 888_HOLD; GEOX never books resources.',
    tool: 'geox.evaluate_prospect()',
  },
  {
    name: 'Well Witness',
    desc: '1D log witness stand. Every curve tagged OBS/DER/INT/SPEC before it may testify.',
    tool: 'geox.witness_well()',
  },
  {
    name: 'Capital Judge',
    desc: 'EMV bridge to WEALTH. Evidence in, expected monetary value out — under 888_HOLD sovereign human review.',
    tool: 'arifos.bridge_contract()',
  },
]

function Cockpits() {
  return (
    <section className="mx-auto max-w-[1280px] px-8 py-[120px] max-md:px-5 max-md:py-[72px]">
      <p className="eyebrow text-magma-500">Cockpits</p>
      <h2 className="mt-4 font-display text-5xl font-bold text-bone-100 max-md:text-3xl">
        Sovereign Decision Cockpits
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {COCKPITS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-25%' }}
            transition={{ delay: i * 0.12, duration: 0.8, ease: EASE }}
            whileHover={{ rotate: 2 }}
          >
            <StrataCard className="h-full">
              <h3 className="font-display text-2xl font-bold text-bone-100">{c.name}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-bone-400">{c.desc}</p>
              <ToolBadge tool={c.tool} className="mt-5" />
            </StrataCard>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="mt-10 font-mono text-[13px] text-bone-600"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-40%' }}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="text-telemetry-400">geox.evaluate_prospect()</span> →{' '}
        <span className="text-amber-450">arifos.bridge_contract()</span> →{' '}
        <span className="text-magma-500">wealth.npv_reward()</span>
      </motion.p>
    </section>
  )
}

const KINABALU_BULLETS = [
  '8-stage tectonostratigraphic column',
  'PSCS subduction model',
  '6-point structural stress battery',
  'K-DIP / K-THROW analysis',
  'Built on Marmousi (synthetic), validated on Volve (public open data)',
]

function Kinabalu() {
  return (
    <section className="border-y border-strata-700 bg-basalt-900/40">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-8 py-[120px] max-md:px-5 max-md:py-[72px] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-magma-500">Case Study LC-001 · Public Benchmarks</p>
          <h3 className="mt-4 font-display text-4xl font-bold text-bone-100 max-md:text-2xl">
            Deep-Water Collision Margin Synthesis
          </h3>
          <p className="mt-4 font-mono text-[12px] leading-[1.7] text-bone-500">
            Provenance: synthetic + public data only (Marmousi, Volve). Schematic — no
            proprietary, internal, or operator-confidential material.
          </p>
          <ul className="mt-8 space-y-3">
            {KINABALU_BULLETS.map((b, i) => (
              <motion.li
                key={b}
                className="flex items-center gap-3 font-mono text-[14px] text-bone-400"
                initial={{ x: -24, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
              >
                <Check size={15} className="shrink-0 text-telemetry-400" />
                {b}
              </motion.li>
            ))}
          </ul>
          <div className="mt-12">
            <p className="eyebrow text-bone-600">The Sovereign Bridge</p>
            <div className="mt-4 flex items-center gap-3">
              {['SEDIMENT', 'GOVERNANCE', 'SOVEREIGNTY'].map((w, i) => (
                <motion.div key={w} className="flex items-center gap-3">
                  <motion.span
                    className="font-display text-lg font-bold tracking-wide text-amber-450 max-md:text-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-40%' }}
                    transition={{ delay: i * 0.2, duration: 0.5, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                  {i < 2 && (
                    <motion.span
                      className="h-px w-8 bg-strata-700"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-40%' }}
                      transition={{ delay: i * 0.2 + 0.15, duration: 0.4 }}
                      style={{ originX: 0 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <motion.img
            src="/basin-kinabalu.png"
            alt="Schematic deep-water collision margin tectonostratigraphic column (synthetic)"
            className="w-full rounded-lg border border-strata-700"
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: EASE }}
          />
        </div>
      </div>
    </section>
  )
}

const SURFACES = [
  { num: '01', name: 'SITE', audience: 'humans · this page', status: 'LIVE', variant: 'live' as const, to: '/' },
  {
    num: '02',
    name: 'WebMCP',
    audience: 'agentic browsers & LLM clients · manifest at /.well-known/mcp.json',
    status: 'LIVE',
    variant: 'live' as const,
    to: '/webmcp',
  },
  {
    num: '03',
    name: 'MCP',
    audience: `ChatGPT, Claude, VS Code Copilot · ${liveLabel()} (snapshot ${STATUS.generatedAt})`,
    status: 'LIVE',
    variant: 'live' as const,
    to: '/mcp-apps',
  },
  {
    num: '04',
    name: 'A2A',
    audience: 'AAA control plane · organ-to-organ contracts',
    status: 'PARTIAL',
    variant: 'sealed' as const,
    to: '/federation',
  },
]

function Surfaces() {
  return (
    <section className="mx-auto max-w-[1280px] px-8 py-[120px] max-md:px-5 max-md:py-[72px]">
      <h2 className="font-display text-5xl font-bold text-bone-100 max-md:text-3xl">
        One Earth. Four surfaces.
      </h2>
      <div className="mt-12 border-t border-strata-700">
        {SURFACES.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: EASE }}
          >
            <Link
              to={s.to}
              data-cursor="OPEN"
              className="group flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-strata-700 px-4 py-7 transition-colors hover:bg-basalt-800"
            >
              <span className="font-mono text-[13px] text-bone-600">{s.num}</span>
              <span className="font-display text-2xl font-bold text-bone-100">{s.name}</span>
              <span className="flex-1 font-mono text-[13px] text-bone-400">{s.audience}</span>
              <StatusChip variant={s.variant} label={s.status} />
              <ArrowRight
                size={18}
                className="-translate-x-2 text-magma-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const CANNOT_KNOW = [
  ['Non-uniqueness', 'Many earth models fit the same data. GEOX returns candidates with falsifiers — never "the" answer.'],
  ['Tuning / resolution', 'Seismic resolution is tens of metres at best. Beds below tuning thickness are invisible, not absent.'],
  ['Time ≠ depth', 'TWT sections are not geometry until velocity-calibrated. Unconverted depth claims are refused.'],
  ['Fluid ambiguity', 'Fizz gas and commercial gas look nearly identical on amplitude. Amplitude ≠ hydrocarbon — enforced in code.'],
  ['Equifinality', 'Different processes produce identical geology. GEOX names the competing processes, not just the prettiest one.'],
  ['Sparse wells', 'One well is a point, not a field. Properties between wells are DER/SPEC, never OBS.'],
]

function Limits() {
  return (
    <section className="border-y border-strata-700 bg-basalt-950">
      <div className="mx-auto max-w-[1280px] px-8 py-[120px] max-md:px-5 max-md:py-[72px]">
        <p className="eyebrow text-magma-500">What GEOX cannot know</p>
        <h2 className="mt-4 font-display text-5xl font-bold text-bone-100 max-md:text-3xl">
          The physics does not negotiate its way to certainty.
        </h2>
        <p className="mt-6 max-w-3xl text-[15px] leading-[1.7] text-bone-400">
          Any reply that claims to overcome one of these has failed the constitution. Naming the
          limit — and the next measurement that would shrink it — is the product.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CANNOT_KNOW.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
            >
              <StrataCard className="h-full">
                <h3 className="font-display text-lg font-bold text-bone-100">{title}</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-bone-400">{body}</p>
              </StrataCard>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 border border-strata-700 p-6">
          <p className="eyebrow text-bone-600">Images & multimodal — current vs roadmap</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-bone-400">
            <span className="text-telemetry-400">LIVE:</span> geox_observe — any rock / core /
            fossil / seismic-display image → a governed EarthObservationPacket under the law{' '}
            <em>Image ≠ Specimen ≠ Measurement ≠ Earth</em>; geox_extract_display_proxy —
            display-derived proxies only, barred from AVO / phase / well-tie decisions.{' '}
            <span className="text-amber-450">ROADMAP · NOT LIVE:</span> a public /observe chat
            (multimodal field UI). Erased time at unconformities and no-data both return{' '}
            <span className="text-bone-100">UNKNOWN</span> — refusal is an output, not a failure.
          </p>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-strata-700">
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-telemetry-400/60"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{ originX: 0 }}
      />
      <div className="mx-auto max-w-[1280px] px-8 py-[120px] text-center max-md:px-5 max-md:py-[72px]">
        <h2 className="mx-auto max-w-3xl font-display text-5xl font-bold leading-[1.08] text-bone-100 max-md:text-3xl">
          {'Deployment-ready for humans, institutions, and agentic intelligence.'
            .split(' ')
            .map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="mr-[0.28em] inline-block"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ delay: i * 0.06, duration: 0.7, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
        </h2>
        <motion.p
          className="mt-6 font-body text-[15px] italic text-bone-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          DITEMPA BUKAN DIBERI — truth must cool before it rules.
        </motion.p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            { label: 'Deploy GEOX', to: '/deploy', solid: true },
            { label: 'Read the Manifest', to: '/webmcp', solid: false },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: EASE }}
            >
              <Link
                to={b.to}
                data-cursor="OPEN"
                className={
                  b.solid
                    ? 'inline-block bg-magma-500 px-8 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-basalt-950 transition-shadow hover:shadow-[0_0_24px_#E8733B55]'
                    : 'inline-block border border-strata-700 px-8 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-bone-100 transition-colors hover:border-amber-450/60 hover:text-amber-450'
                }
              >
                {b.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <EpistemicLadder />
      <Cockpits />
      <Kinabalu />
      <Surfaces />
      <Limits />
      <FinalCta />
    </>
  )
}
