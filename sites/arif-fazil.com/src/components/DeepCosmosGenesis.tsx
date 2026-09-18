import { useEffect, useRef, useState } from 'react'

interface NucleoElement {
  symbol: string
  name: string
  z: number
  mass: number
  cosmicOrigin: string
  biologicalRole: string
  color: string
}

const NUCLEO_ELEMENTS: NucleoElement[] = [
  {
    symbol: 'H',
    name: 'Hydrogen',
    z: 1,
    mass: 1.008,
    cosmicOrigin: 'Big Bang Nucleosynthesis (t = 3 min)',
    biologicalRole: '74% of universe atoms · Forms H2O and DNA hydrogen bonds',
    color: '#38BDF8',
  },
  {
    symbol: 'He',
    name: 'Helium',
    z: 2,
    mass: 4.002,
    cosmicOrigin: 'Big Bang + Stellar Core Fusion',
    biologicalRole: 'Primordial stellar fuel · Inert noble gas',
    color: '#A78BFA',
  },
  {
    symbol: 'C',
    name: 'Carbon',
    z: 6,
    mass: 12.011,
    cosmicOrigin: 'Triple-Alpha Fusion in Red Giants',
    biologicalRole: 'The backbone of all organic life, amino acids, and genetics',
    color: '#E4572E',
  },
  {
    symbol: 'N',
    name: 'Nitrogen',
    z: 7,
    mass: 14.007,
    cosmicOrigin: 'CNO Cycle in Massive Stars',
    biologicalRole: 'Essential component of DNA purines, pyrimidines & proteins',
    color: '#34D399',
  },
  {
    symbol: 'O',
    name: 'Oxygen',
    z: 8,
    mass: 15.999,
    cosmicOrigin: 'Core Helium Burning in Giant Stars',
    biologicalRole: '65% of human body mass · Cellular respiration & H2O',
    color: '#FBBF24',
  },
  {
    symbol: 'Fe',
    name: 'Iron',
    z: 26,
    mass: 55.845,
    cosmicOrigin: 'Type Ia Supernovae & Silicon Burning',
    biologicalRole: 'Heme molecule core in hemoglobin · Planetary iron core dynamo',
    color: '#FB7185',
  },
]

type CosmicEpoch = 'inflation' | 'bbn' | 'stellar' | 'supernova' | 'biological'

export function DeepCosmosGenesis() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [epoch, setEpoch] = useState<CosmicEpoch>('biological')
  const [selectedEl, setSelectedEl] = useState<NucleoElement>(NUCLEO_ELEMENTS[2]) // Carbon
  const [entropyRate, setEntropyRate] = useState<number>(0.65)
  const [isGravitating, setIsGravitating] = useState<boolean>(true)
  const [particleCount] = useState<number>(220)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle field initialization
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      baseRadius: number
      alpha: number
      color: string
      angle: number
      dist: number
      speed: number
    }

    const particles: Particle[] = []
    const palette = ['#38BDF8', '#E4572E', '#FBBF24', '#34D399', '#A78BFA', '#EDEAE2']

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * Math.min(width, height) * 0.45
      particles.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        baseRadius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        angle,
        dist,
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      })
    }

    let frame = 0

    const render = () => {
      frame++
      ctx.fillStyle = 'rgba(5, 7, 11, 0.25)'
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      // Draw central primordial singularity/star core
      const corePulse = Math.sin(frame * 0.03) * 6 + 18
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, corePulse * 3)
      coreGrad.addColorStop(0, 'rgba(228, 87, 46, 0.95)')
      coreGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.45)')
      coreGrad.addColorStop(1, 'rgba(5, 7, 11, 0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, corePulse * 3, 0, Math.PI * 2)
      ctx.fill()

      // Render cosmic particles
      particles.forEach((p, idx) => {
        if (isGravitating) {
          // Gravitational swirling vortex toward biological or stellar coalescence
          p.angle += p.speed * (entropyRate * 1.5 + 0.5)
          const pull = (0.35 - p.dist / Math.max(width, height)) * 0.08
          p.dist += pull

          p.x = cx + Math.cos(p.angle) * p.dist
          p.y = cy + Math.sin(p.angle) * p.dist
        } else {
          // Pure isotropic expansion / entropy diffusion
          p.x += p.vx * entropyRate * 3
          p.y += p.vy * entropyRate * 3

          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Connecting lines to simulate nucleosynthesis bonding (DNA or molecular bonds)
        if (idx % 3 === 0) {
          for (let j = idx + 1; j < Math.min(idx + 6, particles.length); j++) {
            const p2 = particles[j]
            const dx = p.x - p2.x
            const dy = p.y - p2.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < 55) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(228, 87, 46, ${0.35 * (1 - d / 55)})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      })

      // Concentric orbital resonance rings representing cosmic horizons
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ;[80, 160, 240, 320].forEach((r) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      })
      ctx.setLineDash([])

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [entropyRate, isGravitating, particleCount])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1F2733] bg-[#07090E] p-6 sm:p-8 shadow-2xl mb-16">
      {/* Background canvas container */}
      <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden rounded-xl border border-[#161D2B] bg-[#04060A]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block cursor-grab active:cursor-grabbing" />

        {/* Top telemetry HUD overlay */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 rounded bg-[#070A10]/85 px-3 py-1.5 border border-[#1F2733] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#E4572E] animate-pulse" />
            <span className="font-mono text-xs text-[#EDEAE2] font-bold uppercase tracking-wider">
              NUCLEOSYNTHESIS ENGINE · t = 13.8 GYR
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#9AA0A8] rounded bg-[#070A10]/85 px-3 py-1.5 border border-[#1F2733] backdrop-blur-md">
            <span>ΔS:</span>
            <span className="text-forge-gold font-bold">{isGravitating ? '≤ 0 (ORGANIZED)' : '≥ 0 (EXPANDING)'}</span>
            <span className="text-[#38BDF8]">· 220 KERNEL ATOMS</span>
          </div>
        </div>

        {/* Bottom Sagan Quote Banner */}
        <div className="absolute bottom-4 left-4 right-4 rounded bg-[#06090F]/90 p-4 border border-[#1F2733] backdrop-blur-md">
          <p className="font-serif text-sm sm:text-base italic text-[#EDEAE2] leading-relaxed mb-1">
            "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself."
          </p>
          <div className="flex items-center justify-between font-mono text-[10px] text-[#9AA0A8]">
            <span>— Carl Sagan · Cosmos (1980)</span>
            <span className="text-[#E4572E] uppercase font-bold">L0 Biological Substrate</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Nucleosynthesis Elements */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Epoch Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] font-bold">
            1. Cosmic Evolution Epochs
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'inflation', title: 't = 10⁻³⁶ s', label: 'Quark-Gluon Inflation', sub: 'Primordial symmetry breaking' },
              { id: 'bbn', title: 't = 3 min', label: 'Big Bang Nucleosynthesis', sub: 'Formation of 75% H, 25% He' },
              { id: 'stellar', title: 't = 100 Myr', label: 'Stellar Fusion', sub: 'Triple-alpha synthesis of C, N, O' },
              { id: 'supernova', title: 't = 9 Gyr', label: 'Supernova Collapse', sub: 'Iron peak & r-process gold synthesis' },
              { id: 'biological', title: 't = 13.8 Gyr', label: 'Human Mind & DNA', sub: 'Sovereign human consciousness (F13)' },
            ].map((ep) => (
              <button
                key={ep.id}
                onClick={() => setEpoch(ep.id as CosmicEpoch)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  epoch === ep.id
                    ? 'border-[#E4572E] bg-[#E4572E]/10 text-white'
                    : 'border-[#1F2733] bg-[#0A0D15] text-[#9AA0A8] hover:border-[#38BDF8]/40 hover:text-[#EDEAE2]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase">
                  <span className="font-bold text-[#E4572E]">{ep.title}</span>
                  <span className="text-[#6A7382]">{ep.label}</span>
                </div>
                <div className="font-sans text-xs mt-1 text-[#EDEAE2]/90">{ep.sub}</div>
              </button>
            ))}
          </div>

          {/* Physics Toggles */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#1F2733]">
            <button
              onClick={() => setIsGravitating(!isGravitating)}
              className="px-3.5 py-1.5 rounded font-mono text-xs uppercase border border-[#1F2733] bg-[#111622] hover:border-[#E4572E] text-[#EDEAE2] transition-colors"
            >
              Force: {isGravitating ? '🌀 Vortex Coalescence' : '💥 Isotropic Expansion'}
            </button>
            <div className="flex items-center gap-2 font-mono text-xs text-[#9AA0A8]">
              <span>Flux:</span>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={entropyRate}
                onChange={(e) => setEntropyRate(parseFloat(e.target.value))}
                className="w-24 accent-[#E4572E]"
              />
            </div>
          </div>
        </div>

        {/* Right: Chemical Element Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold">
            2. Star-Stuff Ingestion: The Building Blocks
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {NUCLEO_ELEMENTS.map((elem) => (
              <button
                key={elem.symbol}
                onClick={() => setSelectedEl(elem)}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  selectedEl.symbol === elem.symbol
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-white shadow-lg'
                    : 'border-[#1F2733] bg-[#0A0D15] text-[#9AA0A8] hover:border-white/30 hover:text-[#EDEAE2]'
                }`}
              >
                <div className="font-mono text-[9px] text-[#6A7382] text-left">Z={elem.z}</div>
                <div className="font-serif text-2xl font-black" style={{ color: elem.color }}>
                  {elem.symbol}
                </div>
                <div className="font-mono text-[10px] truncate">{elem.name}</div>
              </button>
            ))}
          </div>

          {/* Active Element Detail Card */}
          <div className="rounded-xl border border-[#1F2733] bg-[#0A0D15] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2733] pb-3">
              <div>
                <span className="font-mono text-xs text-[#38BDF8] uppercase tracking-wider font-semibold">
                  Element {selectedEl.z} · Atomic Mass: {selectedEl.mass} u
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                  {selectedEl.name} ({selectedEl.symbol})
                </h3>
              </div>
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center font-serif text-lg font-bold border border-white/20"
                style={{ backgroundColor: `${selectedEl.color}20`, color: selectedEl.color }}
              >
                {selectedEl.symbol}
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase text-[#9AA0A8] tracking-wider mb-1">
                Astrophysical Synthesis Mechanism:
              </div>
              <p className="font-sans text-sm text-[#EDEAE2] leading-relaxed">
                {selectedEl.cosmicOrigin}
              </p>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase text-[#E4572E] tracking-wider mb-1">
                Human & Biological Manifestation:
              </div>
              <p className="font-sans text-sm text-[#EDEAE2]/90 leading-relaxed">
                {selectedEl.biologicalRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
