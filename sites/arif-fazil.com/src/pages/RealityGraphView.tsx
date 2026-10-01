import { useState } from 'react';
import {
  REALITY_PRIMITIVES,
  REALITY_DOMAINS,
  EUREKA_NODES,
  type RealityPrimitiveId,
  type RealityDomainId,
  type EurekaNode,
} from '@/data/realityAtlas';

export function RealityGraphView() {
  const [selectedPrimitive, setSelectedPrimitive] = useState<RealityPrimitiveId | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<RealityDomainId | 'all'>('all');
  const [activeNode, setActiveNode] = useState<EurekaNode>(EUREKA_NODES[0]);

  // Filtered nodes
  const filteredNodes = EUREKA_NODES.filter((node) => {
    const matchPrim = selectedPrimitive === 'all' || node.primitive === selectedPrimitive;
    const matchDom = selectedDomain === 'all' || node.domains.includes(selectedDomain);
    return matchPrim && matchDom;
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2] pb-24">
      {/* ── HEADER / INTRO ── */}
      <div className="border-b border-[#1F2733] bg-[#0A0D14] py-12 px-6">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>Reality Atlas · Navigable Knowledge Plane</span>
            <span className="text-[#1F2733]">/</span>
            <span>The Constellation</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Reality Graph
          </h1>

          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            Eurekas are not isolated essays; they are eigenvectors that bind physical geology, institutional trust,
            computational intelligence, and human attention into one falsifiable world model.
          </p>
        </div>
      </div>

      {/* ── INTERACTIVE CANVAS / CONTROL DOCK ── */}
      <div className="mx-auto max-w-[1360px] px-6 py-8">
        {/* Layer B Filter: 5 Primitives (The Engine) */}
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-3">
            Layer B — 5 Reality Primitives (The Governing Engine)
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPrimitive('all')}
              className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                selectedPrimitive === 'all'
                  ? 'bg-[#EDEAE2] text-[#07090E] font-bold'
                  : 'bg-[#10141D] text-[#9AA0A8] border border-[#1F2733] hover:border-[#EDEAE2]/40'
              }`}
            >
              All Primitives ({EUREKA_NODES.length})
            </button>
            {Object.values(REALITY_PRIMITIVES).map((prim) => {
              const count = EUREKA_NODES.filter((n) => n.primitive === prim.id).length;
              const isSelected = selectedPrimitive === prim.id;
              return (
                <button
                  key={prim.id}
                  onClick={() => setSelectedPrimitive(prim.id)}
                  style={{
                    borderColor: isSelected ? prim.accentColor : undefined,
                    color: isSelected ? prim.accentColor : undefined,
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#10141D] font-bold shadow-[0_0_12px_rgba(0,0,0,0.5)]'
                      : 'bg-[#10141D] text-[#9AA0A8] border-[#1F2733] hover:border-[#9AA0A8]/40'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: prim.accentColor }}
                  />
                  <span>{prim.label}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layer A Filter: 8 Human Domains */}
        <div className="mb-8">
          <div className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-3">
            Layer A — Visible Reality Domains (Touchpoints)
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-2.5 py-1 rounded font-mono text-[11px] uppercase tracking-wider transition-colors ${
                selectedDomain === 'all'
                  ? 'bg-[#EDEAE2] text-[#07090E] font-bold'
                  : 'bg-[#0A0D14] text-[#9AA0A8] border border-[#1F2733] hover:border-[#EDEAE2]/40'
              }`}
            >
              All Domains
            </button>
            {Object.values(REALITY_DOMAINS).map((dom) => {
              const isSelected = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1A202C] text-[#EDEAE2] border-[#EDEAE2]'
                      : 'bg-[#0A0D14] text-[#9AA0A8] border-[#1F2733] hover:border-[#9AA0A8]/40'
                  }`}
                >
                  <span>{dom.icon}</span>
                  <span>{dom.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TWO-COLUMN GRAPH COCKPIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Node Grid (Left Column) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-2 flex justify-between items-center">
              <span>Nodes in Constellation ({filteredNodes.length})</span>
              <span className="text-[10px] text-[#9AA0A8]/60">Select node to inspect provenance</span>
            </div>

            {filteredNodes.map((node) => {
              const prim = REALITY_PRIMITIVES[node.primitive];
              const isActive = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#131722] border-[#EDEAE2] shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                      : 'bg-[#0F131D] border-[#1F2733] hover:border-[#9AA0A8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: prim.accentColor }}
                      />
                      <span className="font-display font-bold text-base text-[#EDEAE2]">
                        {node.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#1F2733] text-[#9AA0A8]">
                      {node.status}
                    </span>
                  </div>

                  <p className="font-sans text-sm text-[#9AA0A8] line-clamp-2 mb-3">
                    {node.thesis}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase text-[#9AA0A8]/70 mr-1">
                      Domains:
                    </span>
                    {node.domains.map((domId) => (
                      <span
                        key={domId}
                        className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#1A202C] text-[#EDEAE2]"
                      >
                        {REALITY_DOMAINS[domId]?.icon} {REALITY_DOMAINS[domId]?.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector & Evidence Panel (Right Column) */}
          <div className="lg:col-span-5 sticky top-20 rounded-xl border border-[#1F2733] bg-[#0E121B] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1F2733]">
              <div className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: REALITY_PRIMITIVES[activeNode.primitive].accentColor }}
                />
                <span>Primitive: {REALITY_PRIMITIVES[activeNode.primitive].label}</span>
              </div>
              <span className="font-mono text-xs text-[#9AA0A8]">
                {activeNode.status}
              </span>
            </div>

            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#EDEAE2] mb-3">
              {activeNode.title}
            </h2>

            <div className="mb-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-1">
                The Fundamental Question
              </div>
              <p className="font-sans text-sm italic text-[#EDEAE2]/90 border-l-2 border-[#E4572E] pl-3 py-0.5">
                "{activeNode.questionItAnswers}"
              </p>
            </div>

            <div className="mb-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-1">
                Causal Statement / Thesis
              </div>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">
                {activeNode.thesis}
              </p>
            </div>

            {/* Evidence Drawer */}
            <div className="mb-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-2 flex items-center gap-1.5">
                <span>Witness & Evidence Grounding</span>
                <span className="text-[10px] text-[#31C48D]">● First-Party</span>
              </div>
              <div className="space-y-2">
                {activeNode.keyEvidence.map((ev, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-[#1F2733] bg-[#141923] hover:border-[#9AA0A8]/40 transition-colors"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-mono text-xs font-semibold text-[#EDEAE2]">
                        {ev.title}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-[#9AA0A8]/70">
                        {ev.type}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#9AA0A8] mb-2">
                      {ev.summary}
                    </p>
                    <a
                      href={ev.uri}
                      className="font-mono text-[11px] text-[#E4572E] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      <span>Open Witness Surface</span>
                      <span>→</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Nodes */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] mb-2">
                Connected Nodes (Constellation Edges)
              </div>
              <div className="flex flex-wrap gap-2">
                {activeNode.relatedNodes.map((relId) => {
                  const target = EUREKA_NODES.find((n) => n.id === relId);
                  if (!target) return null;
                  return (
                    <button
                      key={relId}
                      onClick={() => setActiveNode(target)}
                      className="font-mono text-xs px-2.5 py-1 rounded border border-[#1F2733] bg-[#141923] text-[#EDEAE2] hover:border-[#38BDF8] transition-colors"
                    >
                      {target.title} ↗
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
