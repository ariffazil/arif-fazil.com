# From Context Engineering to Reality Engineering

Arif Fazil · 2026-10-15 · Research Note



  MUHAMMAD ARIF BIN FAZIL · 15 OCTOBER 2026 · DIRECT PUBLICATION · RESEARCH NOTE



Everyone in agents is now talking about context engineering — managing what the model sees. This note argues the next discipline is something else: reality engineering — governing what the model may treat as true, authorized, and consequential. The first improves cognition. The second binds cognition to evidence, authority, and consequence.



## 1. The question each one asks


Context engineering asks: what information should the model see right now?

Reality engineering asks:


  - What is actually known?
  - Where did it come from?
  - What remains uncertain?
  - Who has authority?
  - What actions are permitted?
  - What changed in the world?
  - Did the observed result match the intended result?


The final step matters most. Once something is executed, the resulting state must be observed again. Otherwise the system has produced an action but has not learned whether reality accepted it.

> Context engineering improves cognition. Reality engineering binds cognition to evidence, authority, and consequence.


## 2. More than retrieval


RAG retrieves potentially relevant information. A reality-engineered system must additionally preserve:


  - provenance — where the information came from
  - status — observed, inferred, proposed, disputed, or superseded
  - time — when it was valid or witnessed
  - scope — what entity or situation it describes
  - authority — who may interpret, approve, mutate, or reject it
  - contradiction — what evidence disagrees
  - consequence — what actually happened after action
  - falsifier — what future observation would prove the claim wrong


A retrieved document is not automatically truth:


```
Retrieved information
  ≠ verified evidence
  ≠ authorized interpretation
  ≠ permission to act
  ≠ successful consequence
```


That chain of ≠ signs is the missing separation in most agent architectures.


## 3. The reality graph


A reality graph is a versioned, evidence-bearing graph of what exists, what is claimed about it, what evidence supports or contradicts those claims, who possesses authority, what actions occurred, and what consequences were subsequently witnessed. Nodes are constitutional classes — intent, claim, evidence, observation, constraint, authority, decision, action, consequence, contradiction, unknown, receipt. Edges carry the epistemics: SUPPORTED_BY, CONTRADICTED_BY, AUTHORIZED_BY, EXECUTED_BY, RESULTED_IN, SUPERSEDES, FALSIFIED_BY, AWAITING_WITNESS.

A conventional knowledge graph answers what is connected to what. A reality graph additionally answers how do we know, who says so, under what scope, what disagrees, who may decide, and what happened afterward.

Example, from subsurface work — a claim that a well encountered a reservoir interval:


```
Claim C17: "encountered reservoir interval X"
  → SUPPORTED_BY      log dataset D4
  → INTERPRETED_BY    geoscientist A
  → STATUS            provisional
  → CONTRADICTED_BY   core observation O9
  → VALID_DURING      time range T
  → MAY_BE_FALSIFIED_BY pressure test P3
```



## 4. Three planes


The reality plane — what has been witnessed, with observations distinguished from interpretations. Without it, the system hallucinates.

The authority plane — who may do what. Capability does not create authority; the gate sits before execution, not in an after-the-fact diff. Without it, the system overreaches.

The consequence plane — what changed after the decision: before-state, approved mutation, after-state, verification, receipt. Without it, the system cannot distinguish a proposal from an accomplished result.

> "Code written" and "problem solved" are different reality states. The graph exists so the system never collapses one into the other.


## 5. Adjacent work, precise boundaries


Recent survey work on graph engineering in the LLM-agent era organizes how specialized agents coordinate tasks, roles, and runtime state. That paradigm optimizes control flow. Reality engineering governs epistemic truth and authority — a different layer, deliberately not confused with it.

There is also a current product called Reality Graph (realitygraph.dev), a local-first verification wrapper around coding agents that structures task context and validates runs against Git diffs. It is one concrete implementation of a related idea — with honest limits: single-operator, and strictly post-hoc. A protected-path violation is detected after the edit. In a constitutional system, the authority plane must intercept before an irreversible mutation touches the substrate, not merely audit it afterward.


ParadigmPrimary questionFailure if missing

Context engineeringWhat should the model see?Myopia or noise
Memory engineeringWhat should be retained across sessions?Amnesia; repeating mistakes
Graph engineeringHow do specialized agents coordinate work?Orchestration chaos
Knowledge graphHow are domain entities semantically linked?Semantic blindness
Reality engineeringWhat is provably true, authorized, and witnessed?Hallucination treated as truth; capability treated as permission



Memory especially deserves the distinction: memory proposes context, but memory can be stale, wrong, or superseded. Memory is the map. Reality remains the territory and the judge.


## 6. Three hardening laws


Three properties make the structure mechanically honest rather than decorative:

Closed loop. Every observed consequence generates a new witness back into the reality plane. Receipts file to the ledger; new observations update the territory. An action without a re-observation is a story, not a result.

Pre-commit interception. The edge from authorized decision to action is a hard gate before execution. Post-hoc detection tells you what broke; interception prevents the breaking.

Epistemic decay. Claims carry validity windows. When a window expires without fresh observation, status demotes from verified toward stale and unknown — so stale memory can never masquerade as present reality.


## 7. The compression


> Reality engineering is the construction of systems in which representations remain traceable to evidence, decisions remain bounded by authority, actions remain tied to receipts, and consequences can revise future behavior.

> A reality graph is the versioned structure connecting entities, claims, evidence, contradictions, authority, actions, and witnessed consequences — without confusing any one of them for reality itself.

One boundary survives every design: representation remains smaller than reality. The graph is a governed witness structure, not the world. Any architecture that forgets this eventually replaces the territory with its map — which is precisely the failure mode the whole discipline exists to prevent.




External references verified at time of writing: arXiv:2608.21156 (graph-engineering survey); realitygraph.dev (post-hoc verification wrapper, limits as documented by its authors). This note is the public companion to the internal axiom set ratified the same day.


