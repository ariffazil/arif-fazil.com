# Deploy lesson — 2026-11-22 · temporal-minimal housekeeping

**Lane:** kimi-code/FI-008/housekeeping-temporal-minimal · **Merged:** `ed784b2c` (main)
**Envelope:** `20261122T062942Z-temporal-minimal-housekeeping`

## What the live tree actually is (the thing nobody wrote down)

`/var/www/html/` is not one tree. Two of them serve this site, and **different paths are
served from different trees**:

| Path | Served from | How it was found |
|---|---|---|
| `/` `/assets/**` `/petronas/` `/world/**` | `/var/www/html/arif/` (apex-spa) | diff live vs both trees |
| `/wealth/malaysia/` | `/var/www/html/wealth/malaysia/` (top-level) | live body matched the top-level file byte-for-byte, not the apex-spa copy |
| `/oil/` `/gas/` | `/var/www/html/oil/` (top-level; the apex-spa tree has only `oil/api/`) | same diff |

The two trees had **different content for the same path** (`/wealth/malaysia/`): the
top-level copy carried a richer JSON-LD graph (author + BreadcrumbList) with a malformed
`.../malaysia//` URL, while the tracked source carried a flat WebPage block with a correct
URL but double-encoded mojibake in the body. A naive "deploy the build" would have silently
reverted the live copy.

**Lesson 1 — measure which file serves a path before you replace it.** The cheapest probe is
still: `curl -s <url> | sha256sum` against each candidate on disk, ignoring the Cloudflare
challenge script that is injected into every response.

**Lesson 2 — the tracked source is not always the live truth, and the live truth is not
always the better truth.** The right move was to merge the two: keep the source's correct
UTF-8 body and breadcrumb, adopt the live copy's richer JSON-LD, fix the malformed URL.
That is a truth fix in the SOURCE (so the next build reproduces it), not a patch on the
generated file.

## The AAA organ is write-protected, and that is the point

The task asked for the AAA cockpit's first block to carry "AAA points; it does not judge,
execute, or seal". The sentence was **already there**, inside the same hero block
(`MUTATION: NOT AUTHORISED · AAA points; it does not judge, execute, or seal.`) plus the
footer and the meta description. What remained was one wording nit: the sub-line called AAA
a "live witness", which is the Observatory's word.

The one-line fix was refused by the federation one-writer gate, and the sanctioned lane
worktree could not be created (`git dir not writable (chattr +i?)`). The AAA primary tree
also carries 169 unrelated dirty files and 10 stashes. **Forcing it would have been the
wrong move** — the correct output was: verify what is required, report the residual with
the exact file and line, and leave the organ's tree to its owner.

## Removing photographs without touching the record

34 human photographs were replaced by typographic plates on five archive surfaces. The
rule that kept this safe: **the face is the only thing that changed**. Names, seats,
tenures, verdicts, sources and order all stayed; the plate carries the initials and the
label "Potret tidak dipaparkan". The PETRONAS archive had already set the precedent — its
own banner reads *"Tiada gambar rekaan atau tidak berselesen"*.

Files removed from the repo (23) are recoverable from git; the live copies were archived
under `previous/` before deletion, and the Cloudflare edge copies expire on their own
within the `max-age=14400` window.

## What I would do differently

1. **Probe the serving tree first, not last.** I spent a long time assuming `/var/www/html/arif/`
   served everything under it. Two hours of the session went into discovering the split.
   The probe is one `curl | sha256sum` per candidate.
2. **The commodity boards (`/oil/`, `/gas/`) have no tracked source.** They are gitignored
   because an hourly cron reseals their JSON-LD in place. That is fine for the price data
   and terrible for anything durable: the institutional-context line added to them lives
   only in the working tree and the live file. A tracked template plus a generated overlay
   would fix the class, not just this instance.
