import { useState, useEffect, useRef } from 'react';

// ── Epigenetic & Chrono Configuration ──
// DunedinPACE Pace of Aging (ρ): 0.82 (Ages 0.82 biological years per chronological calendar year)
const DUNEDIN_PACE_RHO = 0.82; 
const MYT_OFFSET = 8; // UTC+8

// Baseline Anchor: Arif Fazil (34y baseline at calibration)
const BASELINE_CHRONO_AGE_YEARS = 34.92;
const BASELINE_BIO_AGE_YEARS = BASELINE_CHRONO_AGE_YEARS * DUNEDIN_PACE_RHO; // ~28.63y

interface EpigeneticState {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  subSec: string;
  paceScore: number;
  eaaYears: number; // Epigenetic Age Acceleration deviation (-years)
}

function calculateBioAge(sessionElapsedSeconds: number): EpigeneticState {
  // Bio age increases at rate: sessionElapsedSeconds * DUNEDIN_PACE_RHO
  const totalBioYears = BASELINE_BIO_AGE_YEARS + (sessionElapsedSeconds * DUNEDIN_PACE_RHO) / (365.25 * 86400);
  const years = Math.floor(totalBioYears);
  const remainderYears = totalBioYears - years;
  
  const totalDays = remainderYears * 365.25;
  const days = Math.floor(totalDays);
  const remainderDays = totalDays - days;
  
  const totalHours = remainderDays * 24;
  const hours = Math.floor(totalHours);
  const remainderHours = totalHours - hours;
  
  const totalMinutes = remainderHours * 60;
  const minutes = Math.floor(totalMinutes);
  const remainderMinutes = totalMinutes - minutes;
  
  const totalSeconds = remainderMinutes * 60;
  const seconds = Math.floor(totalSeconds);
  const subSec = String(Math.floor((totalSeconds - seconds) * 100)).padStart(2, '0');

  const eaa = totalBioYears - (BASELINE_CHRONO_AGE_YEARS + sessionElapsedSeconds / (365.25 * 86400));

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    subSec,
    paceScore: DUNEDIN_PACE_RHO,
    eaaYears: Number(eaa.toFixed(2))
  };
}

function getCircadianPhase(hour: number) {
  if (hour >= 23 || hour < 7) {
    return { phase: 'DEEP REST / SLEEP', energy: 15, color: '#6366F1', label: 'Cellular Autophagy & Repair' };
  }
  if (hour >= 7 && hour < 9) {
    return { phase: 'CORTISOL AWAKENING', energy: 65, color: '#F59E0B', label: 'Metabolic & Hydration Kick' };
  }
  if (hour >= 9 && hour < 12) {
    return { phase: 'PEAK COGNITIVE FOCUS', energy: 95, color: '#10B981', label: 'Maximum Synaptic Velocity' };
  }
  if (hour >= 12 && hour < 14) {
    return { phase: 'METABOLIC NOON DIP', energy: 55, color: '#D97706', label: 'Thermodynamic Ingestion Reset' };
  }
  if (hour >= 14 && hour < 18) {
    return { phase: 'AFTERNOON ENDURANCE', energy: 85, color: '#059669', label: 'High Physical & Execution Bandwidth' };
  }
  if (hour >= 18 && hour < 21) {
    return { phase: 'DUSK WIND-DOWN', energy: 45, color: '#E4572E', label: 'Melatonin Inception Window' };
  }
  return { phase: 'PRE-SLEEP DETOX', energy: 25, color: '#818CF8', label: 'Blue-Light Void & Somatic Stillness' };
}

function getChronoData() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const myt = new Date(utc + (3600000 * MYT_OFFSET));
  
  const startOfYear = new Date(myt.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((myt.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  
  const unixSec = Math.floor(now.getTime() / 1000);
  const unixMs = String(now.getMilliseconds()).padStart(3, '0');

  const hours = String(myt.getHours()).padStart(2, '0');
  const minutes = String(myt.getMinutes()).padStart(2, '0');
  const seconds = String(myt.getSeconds()).padStart(2, '0');

  const utcHours = String(now.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');

  const weekday = myt.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
  const day = String(myt.getDate()).padStart(2, '0');
  const month = myt.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  const year = myt.getFullYear();

  return {
    rawDate: myt,
    hourNum: myt.getHours(),
    hours,
    minutes,
    seconds,
    utcHours,
    utcMinutes,
    utcSeconds,
    weekday,
    day,
    month,
    year,
    dayOfYear,
    unixSec,
    unixMs,
  };
}

export function LiveChronoBioClock() {
  const [chrono, setChrono] = useState(getChronoData);
  const [activeTab, setActiveTab] = useState<'dual' | 'chrono' | 'epigenetic'>('dual');
  const [tick, setTick] = useState(false);
  const sessionStartTimeRef = useRef(Date.now());
  const [bioAge, setBioAge] = useState<EpigeneticState>(() => calculateBioAge(0));

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedSec = (Date.now() - sessionStartTimeRef.current) / 1000;
      setChrono(getChronoData());
      setBioAge(calculateBioAge(elapsedSec));
      setTick(t => !t);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const circadian = getCircadianPhase(chrono.hourNum);

  return (
    <div className="relative overflow-hidden rounded-xl border border-forge-gold/40 bg-gradient-to-b from-[#0F131D] via-[#090C12] to-[#040508] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md">
      {/* Tactical scanline backdrop */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,162,39,0.3) 1px, transparent 1px)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2733] pb-3 mb-5 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#9AA0A8]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-bold text-[#EDEAE2]">CHRONO-EPIGENETIC NODE</span>
          <span className="text-forge-gold font-semibold">· L0 SUBSTRATE</span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded bg-[#111622] p-1 border border-[#1F2733]">
          <button
            onClick={() => setActiveTab('dual')}
            className={`px-2 py-0.5 rounded text-[9px] uppercase transition-colors ${
              activeTab === 'dual' ? 'bg-forge-gold text-black font-bold' : 'text-[#8A8578] hover:text-white'
            }`}
          >
            Dual Mirror
          </button>
          <button
            onClick={() => setActiveTab('chrono')}
            className={`px-2 py-0.5 rounded text-[9px] uppercase transition-colors ${
              activeTab === 'chrono' ? 'bg-forge-gold text-black font-bold' : 'text-[#8A8578] hover:text-white'
            }`}
          >
            Atomic
          </button>
          <button
            onClick={() => setActiveTab('epigenetic')}
            className={`px-2 py-0.5 rounded text-[9px] uppercase transition-colors ${
              activeTab === 'epigenetic' ? 'bg-forge-gold text-black font-bold' : 'text-[#8A8578] hover:text-white'
            }`}
          >
            DunedinPACE
          </button>
        </div>
      </div>

      {/* Main Dual Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* LEFT: Universal Chronological Atomic Time */}
        {(activeTab === 'dual' || activeTab === 'chrono') && (
          <div className="rounded-lg border border-[#1F2733] bg-[#07090E]/90 p-4 relative">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8A8578] mb-2">
              <span className="text-[#38BDF8] font-bold">1. CHRONOLOGICAL (ATOMIC)</span>
              <span>MYT (UTC+8)</span>
            </div>

            <div className="flex items-baseline justify-center gap-1 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              <span>{chrono.hours}</span>
              <span className={`text-[#38BDF8] transition-opacity duration-200 ${tick ? 'opacity-100' : 'opacity-30'}`}>:</span>
              <span>{chrono.minutes}</span>
              <span className={`text-[#38BDF8] transition-opacity duration-200 ${tick ? 'opacity-100' : 'opacity-30'}`}>:</span>
              <span className="text-[#38BDF8]">{chrono.seconds}</span>
              <span className="text-xs text-[#8A8578] font-normal">.{chrono.unixMs.slice(0, 2)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#161D2B] font-mono text-[10px] text-[#9AA0A8]">
              <span>{chrono.weekday} {chrono.day} {chrono.month} {chrono.year}</span>
              <span className="text-[#38BDF8] truncate max-w-[120px]">EP: {chrono.unixSec}</span>
            </div>
          </div>
        )}

        {/* RIGHT: Epigenetic Biological Age & DunedinPACE */}
        {(activeTab === 'dual' || activeTab === 'epigenetic') && (
          <div className="rounded-lg border border-forge-gold/30 bg-[#07090E]/90 p-4 relative">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8A8578] mb-2">
              <span className="text-forge-gold font-bold">2. BIOLOGICAL (DUNEDINPACE)</span>
              <span className="text-[#10B981] font-semibold">ρ = {bioAge.paceScore} yr/yr</span>
            </div>

            {/* Epigenetic Age Display */}
            <div className="flex items-baseline justify-center gap-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-forge-gold tabular-nums">
              <span>{bioAge.years}y</span>
              <span className="text-xs text-[#8A8578] font-normal px-0.5">{String(bioAge.days).padStart(3, '0')}d</span>
              <span>{String(bioAge.hours).padStart(2, '0')}h</span>
              <span className={`text-forge-gold transition-opacity duration-200 ${tick ? 'opacity-100' : 'opacity-30'}`}>:</span>
              <span>{String(bioAge.minutes).padStart(2, '0')}m</span>
              <span className={`text-forge-gold transition-opacity duration-200 ${tick ? 'opacity-100' : 'opacity-30'}`}>:</span>
              <span className="text-white">{String(bioAge.seconds).padStart(2, '0')}s</span>
              <span className="text-xs text-forge-gold/60 font-normal">.{bioAge.subSec}</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#161D2B] font-mono text-[10px]">
              <span className="text-[#10B981] font-bold">EAA: {bioAge.eaaYears} YEARS</span>
              <span className="text-[#9AA0A8]">Rate: -18% Deceleration</span>
            </div>
          </div>
        )}
      </div>

      {/* Circadian & Telemetry Substrate Bar */}
      <div className="mt-4 pt-3 border-t border-[#1F2733] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: circadian.color }}></span>
            <span className="text-[#EDEAE2] font-semibold">{circadian.phase}</span>
            <span className="text-[#8A8578]">({circadian.label})</span>
          </div>
          <div className="text-[#8A8578]">
            Vitality Flux: <span className="font-bold text-[#10B981]">{circadian.energy}%</span>
          </div>
        </div>

        {/* Energy bar */}
        <div className="w-full h-1.5 rounded-full bg-[#161D2B] overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${circadian.energy}%`, backgroundColor: circadian.color }}
          />
        </div>

        {/* Micro Telemetry Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[9px] text-[#6A7382]">
          <span>WELL SUBSTRATE: 0.89 PEACE²</span>
          <span>ENTROPY: ΔS ≤ 0 (STEADY)</span>
          <span>HUMAN PRINCIPAL: ARIF FAZIL (F13)</span>
          <span className="text-[#10B981]">MARUAH FLOOR: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

// Export as LiveClockHero for seamless drop-in compatibility
export { LiveChronoBioClock as LiveClockHero };
export default LiveChronoBioClock;
