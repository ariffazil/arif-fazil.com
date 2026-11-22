# Deploy Lesson — 2026-11-22 (homepage canon alignment)

> Write-back for the homepage alignment deploy. Memory surface (`arif_memory`) is
> degraded on this host (VAULT999 append blocked by F13 immutability since 2026-11-20),
> so this is recorded here instead — git-tracked and verifiable.

## The failure class no HTTP gate can see

**A client-side `<Link to="...">` whose path has no router route soft-200s.**
The server returns the SPA shell for *any* path, so `verify.pages`,
`live.soft200_guard` and `web_zen.verify` all pass — and a human lands on
`<NotFound />`. The site's soft-200 guard probes *server* paths; it does not know
the router's route table.

Four such links shipped with the 12:41/12:48 homepage upgrade:

| Dead link | Rendered as | Real route |
|---|---|---|
| `/arifos/` (SYSTEMS card) | `<Link>` → NotFound | static surface — use `<a href>` |
| `/forge/` (SYSTEMS card) | `<Link>` → NotFound | `https://a-forge.arif-fazil.com/` |
| `/world/petronas/shadow/` | `<Link>` → NotFound | `/politics/shadow` |
| `/map` | `<Link>` → NotFound | `/graph` |

Audit every client route against the router before deploy:

```bash
# every <Link to=...> on a page must appear as path="..." in App.tsx
grep -oE '<Link[^>]*to="[^"]+"' pages/Home.tsx
grep -oE 'path="[^"]+"' App.tsx
```

`<a href="/...">` is server-served and safe. Only `<Link>` is client-routed.
**A 200 on the route means nothing — a 200 is the SPA shell.**

## The alignment rule that produced the fix

The system map must equal `canon/navigation.json` → `secondary_links_organs`:
one card per system, one **distinct** destination each, all reachable.

Two authorities disagreed on the *labels*: canon called the arifOS Observatory
`arifOS` and `/arifos/` `arifFlow`, while the live page titles say the arifos host
is *"arifOS Observatory — Reality Witness"*. With a duplicate destination ruled
out, seven systems need seven distinct hosts — so `arifOS` must point at the
constitutional gateway (`mcp.arif-fazil.com`), not the Observatory.

**A duplicate destination is the same defect as a missing one.** Before, `arifOS`
and `Observatory` both pointed at the arifOS Observatory.

## Measurement artifacts that produce false readings

1. **The homepage is client-rendered.** Grepping the served HTML for a copy string
   proves nothing — `WEALTH` appeared once in the raw HTML and `WELL` zero times,
   while the rendered page had both. Use
   `chrome --headless --no-sandbox --dump-dom` (the Playwright MCP cannot launch as
   root on this host: Chromium sandbox).
2. **Two golds are live at once.** `--gold: #C9A227` (index.css) and `#D4A853`
   (hardcoded in 9 components, including the new homepage and footer). Neither
   `canon/design-tokens.json` nor `sites/shared/design-tokens.json` carries a hex —
   so a palette change **cannot** be resolved from the token registry. It is an F13
   decision about the sacred palette, not a code fix.
3. **`forge.arif-fazil.com` and `mcp.arif-fazil.com` are the same app** (97,829
   bytes, identical). They are two hosts for one gateway — do not count them as two
   distinct destinations when checking for duplicates.

## Defect closed by this loop

Four dead CTAs on the homepage's primary surfaces → zero. The system map went from
5 entries with one duplicate and two missing organs → 7 canon entries, one
destination each. The `/words` journey door exists.
