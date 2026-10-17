# Reality Engineering: The Missing Discipline Between Context and Consequence

> **Type:** Public explainer · **Source:** federation doctrine synthesis · **Status:** F13-ratified conceptual definitions at end; rest is exposition
> **Canonical compression:** this article's compressed definitions feed the Reality Graph 5-Layer Doctrine upon F13 ratification
> **Cross-references:** [Reality Graph 5-Layer Doctrine](https://arif-fazil.com/arifos/) · [verify-arifos](/arifos/) · [Constitutional Floors F1–F13](/arifos/)

In the arifOS federation, we make a distinction that most agent systems do not: **context engineering and reality engineering are different disciplines, and conflating them is the root cause of most agent failure modes.**

## The core problem

An agent's internal model of the world is not the world. When the model drifts from reality without anyone noticing, the agent makes confident decisions on stale, incomplete, or fabricated representations. This is not a bug in prompting. It is an architectural gap.

**Context engineering** manages what an agent can see right now. It is the art of loading the right information into the model's window.

**Reality engineering** governs how an agent remains answerable to what is actually true, authorized, and consequential. It is the discipline of binding cognition to evidence, authority, and consequence.

Context engineering improves cognition.
Reality engineering binds cognition to what matters.

Without reality engineering, an agent with perfect context can still act on a stale claim, an unauthorized interpretation, or a consequence it never witnessed.

## What reality engineering adds beyond retrieval

Retrieval-augmented generation (RAG) retrieves potentially relevant information.

Reality engineering additionally preserves:

- **provenance** — where the information came from
- **status** — whether it is observed, inferred, proposed, disputed, or superseded
- **time** — when it was valid or witnessed
- **scope** — what entity or situation it describes
- **authority** — who may interpret, approve, mutate, or reject it
- **contradiction** — what evidence disagrees
- **consequence** — what actually happened after an action
- **falsifier** — what future observation would prove the current claim wrong

A retrieved document is not automatically truth:

```text
Retrieved information ≠ verified evidence ≠ authorized interpretation ≠ permission to act ≠ successful consequence
```

## The Reality Graph

A reality graph is the versioned structure that represents:

1. what exists,
2. what is claimed about it,
3. what evidence supports or contradicts those claims,
4. who possesses authority,
5. what actions occurred,
6. what consequences were subsequently witnessed.

It is not a knowledge graph. A knowledge graph maps semantic relationships (*Bekantan-1 → IS_A → Well*). A reality graph adds epistemic and governance relationships:

```text
Claim C17:
"Bekantan-1 encountered reservoir interval X"

C17 → SUPPORTED_BY → Log Dataset D4
C17 → INTERPRETED_BY → Geoscientist A
C17 → STATUS → PROVISIONAL
C17 → CONTRADICTED_BY → Core Observation O9
C17 → VALID_DURING → Time Range T
C17 → MAY_BE_FALSIFIED_BY → Pressure Test P3
```

A knowledge graph answers: *What is connected to what?*

A reality graph additionally answers: *How do we know? Who says so? Under what scope? What disagrees? Who may decide? What happened afterward?*

## The three planes

For clarity, we separate a reality graph into three interacting planes.

**The Reality Plane** holds what has been witnessed: observations, documents, measurements, events, system state, human statements, and execution results. It must distinguish raw observations from interpretations.

**The Authority Plane** defines who may do what: human sovereignty, roles, permissions, leases, approval boundaries, veto rights, and execution rights. Capability does not create authority.

**The Consequence Plane** records what changed after a decision or action: before-state, approved mutation, executor, after-state, verification, side effects, rollback state, and receipt.

Without the reality plane, the system hallucinates. Without the authority plane, it overreaches. Without the consequence plane, it cannot distinguish a proposal from an accomplished result.

## Memory is map, reality is territory

An agent's long-term memory — preferences, past tasks, learned procedures — is useful context. But memory can be stale, incorrect, or superseded.

Memory proposes what might be relevant.
Reality graph constrains what the system may treat as real, authorized, and consequential.

In ArifOS terms: *memory is MAP. Reality remains territory and judge.*

## Deep-agent memory and the constitutional addition

A deep-agent system (skills, subagents, long-term memory, file offloading) gives the agent what it needs to function over long horizons.

A reality graph adds the constitutional relationships around those artifacts: who produced them, what they justify, what contradictions exist, what actions they authorized, and what consequences followed.

Deep-agent memory answers: *What should be retained?*

Reality graph answers: *What does this artifact mean, what may it justify, and what happened because of it?*

## Canonical compression

The cleanest definitions we hold:

> **Reality engineering** is the construction of systems in which representations remain traceable to evidence, decisions remain bounded by authority, actions remain tied to receipts, and consequences can revise future behavior.

> **A reality graph** is the versioned structure connecting entities, claims, evidence, contradictions, authority, actions, and witnessed consequences without confusing any one of them for reality itself.

```text
Context Engineering    → gives the agent the right information.
Memory Engineering     → preserves useful information across time.
Graph Engineering      → structures distributed work and state.
Reality Engineering    → binds the whole system to evidence,
                         authority, consequence, and correction.
Reality Graph          → is the inspectable map of that binding.
```

**Boundary:** Representation remains smaller than reality. The reality graph is a governed witness structure, not reality itself.