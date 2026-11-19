#!/usr/bin/env node
/**
 * Content contract test — enforces the canonical-source rule (2026-11-19):
 *   1. Home proof cards MUST reference valid case ids in @/data/discoveries.
 *   2. Work featured cases MUST reference valid case ids in @/data/discoveries.
 *   3. Work organ cards MUST reference subdomains declared in surfaces.json.
 *   4. Evidence links MUST be https on the arif-fazil.com family.
 *   5. No stale AAA semantics: AAA never issues HOLD/SEAL tokens — it
 *      coordinates and hands off; the verdict is arifOS, authority is F13.
 * Run: node --test tests/content-contract.test.cjs
 */
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const assert = require('node:assert/strict')

const ROOT = path.join(__dirname, '..')
const read = (p) => fs.readFileSync(p, 'utf8')

const discoveriesSrc = read(path.join(ROOT, 'src/data/discoveries.ts'))
const homeSrc = read(path.join(ROOT, 'src/pages/Home.tsx'))
const workSrc = read(path.join(ROOT, 'src/pages/Work.tsx'))
const surfaces = JSON.parse(read(path.join(ROOT, '..', '..', 'surfaces.json')))

function extractIds(src, marker) {
  const block = src.slice(src.indexOf(marker))
  const ids = []
  const re = /id:\s*'([a-z0-9-]+)'/g
  let m
  while ((m = re.exec(block)) !== null) ids.push(m[1])
  return ids
}

function extractObjectIds(src) {
  const ids = []
  const re = /id:\s*'([a-z0-9-]+)',/g
  let m
  while ((m = re.exec(src)) !== null) ids.push(m[1])
  return ids
}

const discoveryIds = extractObjectIds(discoveriesSrc)

test('discovery ids are unique', () => {
  assert.equal(new Set(discoveryIds).size, discoveryIds.length, 'duplicate discovery ids')
})

test('home proof cards reference valid case ids', () => {
  const proofIds = extractIds(homeSrc, 'PROOF_CASES')
  assert.ok(proofIds.length >= 3, 'home must project at least 3 proof cards')
  for (const id of proofIds) {
    assert.ok(discoveryIds.includes(id), `home proof id '${id}' not in discoveries.ts`)
  }
})

test('work featured cases reference valid case ids', () => {
  const featuredIds = extractIds(workSrc, 'featuredCases')
  assert.ok(featuredIds.length >= 3, 'work must feature at least 3 cases')
  for (const id of featuredIds) {
    assert.ok(discoveryIds.includes(id), `featured case '${id}' not in discoveries.ts`)
  }
})

test('work organ cards reference surfaces.json subdomains', () => {
  const domains = new Set(surfaces.federation_subdomains.map((s) => s.domain))
  const re = /href:\s*'(https:\/\/[a-z]+\.arif-fazil\.com)'/g
  let m
  const cardHrefs = []
  while ((m = re.exec(workSrc)) !== null) cardHrefs.push(m[1])
  assert.ok(cardHrefs.length >= 5, 'expected organ cards on /work')
  for (const href of cardHrefs) {
    assert.ok(domains.has(href.replace('https://', '')), `organ card ${href} missing from surfaces.json federation_subdomains`)
  }
})

test('evidence links are https on the site family', () => {
  const re = /link:\s*'([^']+)'/g
  let m
  while ((m = re.exec(discoveriesSrc)) !== null) {
    assert.match(m[1], /^https:\/\/([a-z0-9-]+\.)*arif-fazil\.com/, `evidence link ${m[1]} outside site family or not https`)
  }
})

test('no stale AAA semantics on human surfaces', () => {
  for (const src of [discoveriesSrc, homeSrc, workSrc]) {
    assert.ok(!src.includes('HOLD/SEAL token'), 'AAA never issues HOLD/SEAL tokens (stale copy)')
    assert.ok(!src.includes('A2A gateway ensuring'), 'stale AAA-as-judge copy')
  }
  const aaa = surfaces.federation_subdomains.find((s) => s.organ === 'AAA')
  assert.match(aaa.role, /[Hh]andoff/, 'surfaces.json AAA role must express A2A handoff')
})
