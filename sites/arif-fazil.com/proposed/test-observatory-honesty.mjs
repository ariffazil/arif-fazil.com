import fs from 'node:fs';
import vm from 'node:vm';

const srcPath = new URL('./observatory-20261112.js', import.meta.url);
const src = fs.readFileSync(srcPath, 'utf8');

function grab(name) {
  const token = `function ${name}(`;
  const start = src.indexOf(token);
  if (start < 0) throw new Error(`missing ${name}`);
  const brace = src.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`unclosed ${name}`);
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const unwrap = (input) => {
  let value = input;
  let depth = 0;
  while (isRecord(value) && hasOwn(value, 'value') && depth < 8) {
    value = value.value;
    depth += 1;
  }
  return value;
};
const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null);
const normalizeKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const context = { hasOwn, isRecord, unwrap, firstPresent, normalizeKey };
vm.createContext(context);
for (const name of ['honestFloorFace', 'frameBlocksHealthy', 'frameWitnessStatus']) {
  vm.runInContext(grab(name), context);
}

const f5 = context.honestFloorFace(
  { id: 'F5' },
  { measurement: 'policy constant · not measured', status: 'constant (structural · falsifier: none by construction)', state: 'unknown' },
  'presence_only',
  'POLICY_CONSTANT',
);
if (f5.measurement !== 'policy constant · not measured') {
  console.error('F5 measurement changed', f5);
  process.exit(1);
}
if (f5.state !== 'unknown') {
  console.error('F5 state changed', f5);
  process.exit(1);
}

const f13 = context.honestFloorFace(
  { id: 'F13' },
  { measurement: 'measured', status: 'pass', state: 'healthy' },
  'presence_only',
  'floor_producer:PASS:seal_chain_sovereign',
);
const f13text = `${f13.measurement} ${f13.status} ${f13.state}`;
if (f13.measurement !== 'presence only · not measured' || f13.status !== 'presence only · verdict withheld' || f13.state !== 'unknown') {
  console.error('F13 face', f13);
  process.exit(1);
}
if (/\bmeasured\b/.test(f13.measurement) === false || /not measured/.test(f13.measurement) === false) {
  console.error('F13 measurement wording', f13.measurement);
  process.exit(1);
}
if (/\bpass\b/i.test(f13text)) {
  console.error('F13 face still contains pass', f13text);
  process.exit(1);
}

const blocked = context.frameBlocksHealthy('degraded', 'healthy');
const open = context.frameBlocksHealthy('healthy', 'healthy');
if (blocked !== 'degraded' || open !== 'healthy') {
  console.error('frameBlocksHealthy', blocked, open);
  process.exit(1);
}

const fromFrame = context.frameWitnessStatus(
  { frame: { organ_status: { arifos: { status: 'degraded' }, wealth: { status: 'healthy' } } } },
  'arifos',
  { health_status: 'HEALTHY' },
);
const fromRow = context.frameWitnessStatus(
  { organs: { arifos: { health_status: 'DEGRADED' } } },
  'arifos',
  { health_status: 'DEGRADED' },
);
if (fromFrame !== 'degraded' || fromRow !== 'DEGRADED') {
  console.error('frameWitnessStatus', fromFrame, fromRow);
  process.exit(1);
}

if (!src.includes('POLICY_CONSTANT') || !src.includes('policy constant · not measured')) {
  console.error('F5 contract strings missing');
  process.exit(1);
}

console.log('F5 measurement:', f5.measurement);
console.log('F13 measurement:', f13.measurement);
console.log('F13 status:', f13.status);
console.log('F13 state:', f13.state);
console.log('frame degraded blocks healthy:', blocked);
console.log('frame healthy leaves healthy:', open);
console.log('frame organ_status wins:', fromFrame);
console.log('health_status used when frame absent:', fromRow);
console.log('exit:0');
