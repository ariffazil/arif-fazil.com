import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebMCP } from '@/hooks/useWebMCP';
import { PalantirTelemetryHud } from '@/components/PalantirTelemetryHud';
import { PalantirWorldIntelMap } from '@/components/PalantirWorldIntelMap';
import { PalantirTargetInspector } from '@/components/PalantirTargetInspector';
import { PalantirLiveFeed } from '@/components/PalantirLiveFeed';
import { PalantirMacroGrid } from '@/components/PalantirMacroGrid';
import { PalantirSituationBrief } from '@/components/PalantirSituationBrief';
import { WORLD_INTEL_NODES, type IntelHotspot } from '@/data/worldIntelData';

// ── WebMCP Tool Interface for Visiting AI Agents ──
const worldIntelWebMCPTools = [
  {
    name: 'get_world_intelligence_summary',
    description: 'Returns real-time global intelligence overview: active maritime chokepoints, energy basins, military posture, cyber data centers, and macro signals across 30+ domains.',
    execute() {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'LIVE_OPERATIONAL',
              version: 'PALANTIR_WORLD_INTEL_v2.6',
              sensorCount: WORLD_INTEL_NODES.length,
              nodes: WORLD_INTEL_NODES.map((n) => ({
                id: n.id,
                name: n.name,
                category: n.category,
                threatLevel: n.threatLevel,
                metric: n.metric,
                coordinates: [n.lat, n.lng],
              })),
            }),
          },
        ],
      };
    },
  },
  {
    name: 'query_intel_dossier',
    description: 'Retrieve full spatial intelligence dossier for a specific node (e.g. malacca, hormuz, sarawak-luconia, diego-garcia, johor-ai-dc, london-boe-vaults).',
    parameters: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the intelligence node' },
      },
      required: ['nodeId'],
    },
    execute(args: { nodeId?: string }) {
      const target = WORLD_INTEL_NODES.find((n) => n.id === args.nodeId);
      if (!target) {
        return {
          content: [{ type: 'text', text: `Node '${args.nodeId}' not found in global intelligence index.` }],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(target) }],
      };
    },
  },
];

// MakcikGPT Editorial Selections
const MAKCIK_PICKS = [
  {
    id: 'm1',
    series: 'Siri M6 · PETRONAS',
    date: '2026-09-09',
    title: 'Pengecut Tak Berani Confront',
    snippet: 'Kingtime offer settlement tanpa admission — dia reject, fight sampai Federal Court kalah. Surat PM9 arahkan settle — senyap. Pengecut bukan lari: dia suruh mahkamah jadi kambing hitam, dan rakyat yang bayar harga.',
    seal: 'SEAL 999',
    slug: 'taufik-pengecut-dengan-title',
  },
  {
    id: 'm2',
    series: 'Siri M2 · SEARAH & Gas Sarawak',
    date: '2026-07-18',
    title: 'Bernama Baru Sampai. Makcik Dah Lama Tanya.',
    snippet: '40 hari lepas Makcik dedah isu SEARAH, semalam Bernama copy press release. Bila agensi berita jadi mesin fotostat, siapa jaga rakyat?',
    seal: 'SEAL 999',
    slug: 'searah-bernama-lewat',
  },
  {
    id: 'm3',
    series: 'Siri M3 · YTL & Kuasa Data',
    date: '2026-06-30',
    title: 'Air Kita, Elektrik Kita, Data Centre Siapa Punya?',
    snippet: 'Johor dan Cyberjaya banjir pelaburan AI, tapi bil elektrik rakyat naik dan paip air kering. Kiraan sebenar siapa yang untung.',
    seal: 'SEAL 999',
    slug: 'ai-johor-rakyat-2026',
  },
];

export function World() {
  useWebMCP(worldIntelWebMCPTools);

  useEffect(() => {
    document.title = 'World Intelligence Operations Center — Palantir-Grade Global Intel | Arif Fazil';
  }, []);

  const [activeTab, setActiveTab] = useState<'ops' | 'livefeed' | 'macro' | 'makcikgpt' | 'institutions'>('ops');
  const [selectedHotspot, setSelectedHotspot] = useState<IntelHotspot>(WORLD_INTEL_NODES[0]);

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2] font-sans antialiased selection:bg-[#00E5FF] selection:text-[#07090E]">
      {/* ── 01 PALANTIR HUD STATUS & TELEMETRY BAR ── */}
      <PalantirTelemetryHud />

      {/* ── 02 MAIN HERO SECTION ── */}
      <section className="relative border-b border-[#1F2733] px-4 sm:px-6 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {/* Top Title & Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#0E1524] px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                <span>World Intel Operations Center · Palantir Mode</span>
              </div>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
                GLOBAL SITUATION ROOM
              </h1>
              <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-[#A0A7B8] font-light leading-relaxed">
                Multi-domain intelligence monitoring across 30+ domains: maritime chokepoints, offshore energy basins, military force posture, subsea fiber corridors, live seismology, and sovereign capital reserves under real uncertainty.
              </p>
            </div>

            {/* Tactical Navigation Tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl border border-[#1F2733] bg-[#0C1017] p-1.5 font-mono text-xs">
              {[
                { key: 'ops', label: '🗺️ Ops Center' },
                { key: 'livefeed', label: '📡 Intel Wire' },
                { key: 'macro', label: '📊 Macro Matrix' },
                { key: 'makcikgpt', label: '📰 MakcikGPT Civic' },
                { key: 'institutions', label: '🏛️ Forensics' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`rounded-lg px-3.5 py-2 uppercase tracking-wider transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#00E5FF] text-[#0A0C10] font-bold shadow-lg shadow-[#00E5FF]/20'
                      : 'text-[#8E95A5] hover:text-white hover:bg-[#151C28]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB 1: PALANTIR OPS CENTER (INTERACTIVE MAP + DOSSIER INSPECTOR) ── */}
          {activeTab === 'ops' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Tactical Leaflet Map (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <PalantirWorldIntelMap
                    selectedNode={selectedHotspot}
                    onSelectNode={setSelectedHotspot}
                  />

                  {/* Hotspots Quick Access Bar */}
                  <div className="rounded-xl border border-[#1F2733] bg-[#0E121A]/80 p-3">
                    <div className="text-[10px] font-mono text-[#8E95A5] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>QUICK TACTICAL TARGET FOCUS</span>
                      <span className="text-[#00E5FF]">CLICK TO ZOOM & LOCK</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {WORLD_INTEL_NODES.map((spot) => (
                        <button
                          key={spot.id}
                          onClick={() => setSelectedHotspot(spot)}
                          className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all ${
                            selectedHotspot.id === spot.id
                              ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF] font-bold shadow-sm'
                              : 'border-[#1F2733] bg-[#111622] text-[#8E95A5] hover:border-[#384661] hover:text-white'
                          }`}
                        >
                          {spot.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Palantir Dossier Inspector (4 cols) */}
                <div className="lg:col-span-4">
                  <PalantirTargetInspector node={selectedHotspot} />
                </div>
              </div>

              {/* Strategic Situation Briefing below map */}
              <PalantirSituationBrief />
            </div>
          )}

          {/* ── TAB 2: LIVE SITUATION INTEL WIRE ── */}
          {activeTab === 'livefeed' && <PalantirLiveFeed />}

          {/* ── TAB 3: SOVEREIGN MACRO MATRIX ── */}
          {activeTab === 'macro' && <PalantirMacroGrid />}

          {/* ── TAB 4: MAKCIKGPT CIVIC INVESTIGATIONS ── */}
          {activeTab === 'makcikgpt' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2733] pb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
                    CIVIC INVESTIGATIVE JOURNALISM · BAHASA MAKCIK
                  </span>
                  <h2 className="mt-1 font-serif text-3xl text-white">
                    MakcikGPT: Siasatan Sivik & Hak Kedaulatan
                  </h2>
                  <p className="text-xs text-[#8E95A5] mt-1 font-mono">
                    Ketika berbilion ringgit bergerak tanpa soalan di media arus perdana, MakcikGPT menyiasat berasaskan data dan meterai 999.
                  </p>
                </div>
                <Link
                  to="/world/makcikgpt"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-2.5 font-mono text-xs font-bold text-[#0A0C10] uppercase tracking-wider hover:bg-[#38BDF8] transition-colors shadow-lg shadow-[#00E5FF]/10"
                >
                  <span>Buka Semua 27 Siri Broadsheet</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MAKCIK_PICKS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#1F2733] bg-[#0E121A]/95 p-6 flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#8E95A5] mb-3">
                        <span className="text-[#00E5FF] font-semibold">{item.series}</span>
                        <span>{item.date}</span>
                      </div>
                      <h3 className="font-serif text-xl text-white font-normal leading-snug group-hover:text-[#00E5FF] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs text-[#A0A7B8] font-light leading-relaxed italic">
                        "{item.snippet}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#F0B840] border border-[#2B3852] bg-[#141A26] px-2 py-0.5 rounded font-semibold">
                        {item.seal}
                      </span>
                      <Link
                        to={`/world/makcikgpt/${item.slug}`}
                        className="font-mono text-xs text-[#00E5FF] hover:text-white transition-colors"
                      >
                        Baca Artikel →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: INSTITUTIONAL FORENSICS & SHADOW CABINET ── */}
          {activeTab === 'institutions' && (
            <div className="rounded-2xl border border-[#1F2733] bg-[#0E121A]/95 p-8 shadow-xl">
              <div className="max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
                  GOVERNANCE & INSTITUTIONAL FORENSICS
                </span>
                <h2 className="mt-2 font-serif text-3xl text-white font-normal">
                  Shadow Cabinet & Structural Power Dynamics
                </h2>
                <p className="mt-3 text-sm text-[#A0A7B8] font-light leading-relaxed">
                  Analyzing institutions not by PR press releases, but by audited balance sheets, sovereign debt obligations, regulatory appointments, and real physical capital flows.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="rounded-xl border border-[#1F2733] bg-[#121622] p-4">
                    <div className="text-[#8E95A5] uppercase text-[10px]">PETRONAS & Fiscal Integrity</div>
                    <div className="mt-1 text-sm font-bold text-white">70.5% Dividends vs Reinvestment</div>
                    <p className="mt-2 text-[#A0A7B8] font-sans text-xs">
                      Simulated capital stress thresholds under prolonged sub-$75/bbl crude pricing.
                    </p>
                    <Link to="/wealth/vitals/" className="mt-3 inline-block text-[#00E5FF] text-[11px] hover:underline">
                      View Vitals Dashboard →
                    </Link>
                  </div>

                  <div className="rounded-xl border border-[#1F2733] bg-[#121622] p-4">
                    <div className="text-[#8E95A5] uppercase text-[10px]">Sarawak Energy Sovereignty</div>
                    <div className="mt-1 text-sm font-bold text-white">SEARAH & DGO Aggregation</div>
                    <p className="mt-2 text-[#A0A7B8] font-sans text-xs">
                      Gas distribution ordinance mechanics and commercial balancing between Kuching and Putrajaya.
                    </p>
                    <Link to="/world/makcikgpt" className="mt-3 inline-block text-[#00E5FF] text-[11px] hover:underline">
                      Read Investigation Series →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 03 PALANTIR SOVEREIGN FOOTNOTE ── */}
      <footer className="py-8 px-6 border-t border-[#1F2733] bg-[#07090E]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8E95A5]">
          <div>
            <span>PALANTIR WORLD INTEL · ARBITER OF REALITY</span>
            <span className="mx-2">·</span>
            <span>NO PAID API KEYS REQUIRED</span>
          </div>
          <div>
            <span>EPISTEMIC GRADE: SEAL 999 · DITEMPA BUKAN DIBERI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
