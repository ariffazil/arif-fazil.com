import type { EssayContent } from './types';

const content: EssayContent = {
  title: "Reality Engineering for Governed Agent Systems: A Constitutional Runtime Architecture and Falsifiable Research Agenda",
  date: '2026-10-19',
  slug: 'reality-engineering-governed-agent-systems',
  tags: ['ai-governance', 'arifos', 'reality-engineering', 'agents', 'evidence', 'falsifiability'],
  excerpt: 'A position paper that turns the vocabulary of a running constitutional kernel into falsifiable claims — and states plainly what the current evidence can and cannot support.',
  mediumUrl: '',
  isDirectPublication: true,
  html: `<article>
<h2>Abstract</h2>
<p>Agent systems can improve their prompts, tools, memory, and control code while remaining unable to determine whether their claims correspond to the external world or whether they are authorized to act. This position paper defines Reality Engineering as the design of interfaces that force machine claims and actions into auditable contact with evidence, authority, and observed consequences.</p>
<p>It presents arifOS as a running case: a classical, model-agnostic constitutional runtime that places non-compensatory policy gates around agent execution. The architecture separates proposer, judge, executor, and witness roles; assigns every task an evidence floor; records predictions before outcomes; and retains falsifications rather than overwriting them.</p>
<p>The paper does not claim artificial general intelligence (AGI), artificial superintelligence (ASI), quantum computation, or a physical law. Its defensible classification is an agentic governance operating layer: potentially useful for governing future AGI/ASI systems, but neither the intelligence substrate nor evidence that such systems have been achieved.</p>
<p>Four falsifiable hypotheses and a preregisterable evaluation protocol are specified. A 19 October 2026 internal audit snapshot is disclosed as engineering telemetry, not efficacy evidence: 131 prediction records, 44 marked verified, 2 marked unverifiable, and 85 lacking either status in the exported aggregate.</p>
<p>The central proposition is that increasingly self-modifying agents require a correctness and authority layer that they cannot silently rewrite.</p>
<p><a href="/words/writing/reality-engineering-governed-agent-systems/reality-engineering-paper.pdf">Download the full paper (PDF, 9 pages)</a></p>
<h2>What the paper claims</h2>
<ul>
<li>A typed architecture for claims, evidence, authority, execution, outcomes, and falsification.</li>
<li>Non-compensatory gates: hard vetoes run before any soft aggregation.</li>
<li>Four separated powers — proposer, judge, executor, witness — with the limits of that separation stated.</li>
<li>A preregisterable protocol for silent-drift reduction, recovery latency, authority containment, and Goodhart displacement.</li>
</ul>
<h2>What it does not claim</h2>
<ul>
<li>No claim of AGI, ASI, quantum computation, or a physical law.</li>
<li>No controlled efficacy result and no independent replication.</li>
<li>The disclosed CHRON aggregate is telemetry, not accuracy evidence.</li>
</ul>
<h2>Citation</h2>
<p>Fazil, M. A. bin (2026). <em>Reality Engineering for Governed Agent Systems: A Constitutional Runtime Architecture and Falsifiable Research Agenda</em>. arifOS Constitutional Kernel Project, Kuala Lumpur.</p>
</article>`,
};

export default content;
