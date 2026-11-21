/**
 * arifOS WEALTH — Shared Coupling Engine (Putrajaya ⇋ KLCC)
 * SOT Baseline: Budget 2027 (RM40.0B Fuel Subsidy at $85 Brent, RM77.5B Deficit, 63.7% Debt/GDP)
 * Epistemic Policy: Anti-Hallucination, strictly synchronized across both sites.
 */

window.ArifCouplingEngine = (function() {
  const SOT = {
    gdpBase: 2348.5,            // RM B
    debtBase: 1496.0,           // RM B (63.7% of GDP)
    deficitBase: 77.5,          // RM B (3.30% of GDP)
    fuelSubsidyBase: 40.0,      // RM B at $85 Brent
    brentBase: 85.0,            // USD/bbl
    petTaxBase: 29.2,           // RM B
    dividendBaseMoF: 32.0,      // RM B (Budget 2027 demand)
    dividendFloorBrent: 67.34,  // USD/bbl floor
    sensitivityFuelPer10Usd: 5.1,
    sensitivityPetTaxPer10Usd: 3.5,
  };

  let simCourt = 'coexist';     // 'coexist' | 'federal' | 'sarawak'
  let simDivMode = 'flat';      // 'flat' | 'topup'

  function calculate(brentVal) {
    const brent = parseFloat(brentVal);
    const dBrent10 = (brent - SOT.brentBase) / 10.0;

    // Subsidy & Tax formulas
    const petTax = SOT.petTaxBase + (dBrent10 * SOT.sensitivityPetTaxPer10Usd);
    const subsidy = Math.max(15.0, SOT.fuelSubsidyBase + (dBrent10 * SOT.sensitivityFuelPer10Usd));

    // KLCC Dividend
    let dividend = SOT.dividendBaseMoF;
    let divNote = 'Matches Budget 2027 (RM32B)';
    if (brent < SOT.dividendFloorBrent) {
      dividend = Math.max(14.0, 20.0 - ((SOT.dividendFloorBrent - brent) * 0.85));
      divNote = 'Below $67.34 floor — severely compressed';
    } else if (brent < 80.0) {
      dividend = 20.0 + ((brent - SOT.dividendFloorBrent) / (80.0 - SOT.dividendFloorBrent)) * 12.0;
      divNote = 'Stepping down toward RM20B baseline';
    } else if (brent >= 90.0 && simDivMode === 'topup') {
      dividend = Math.min(42.0, 32.0 + ((brent - 85.0) * 0.6));
      divNote = 'MoF top-up to buffer fuel subsidy bloat';
    }

    // Federal Court Overhang
    const sarawakHit = (simCourt === 'sarawak') ? 6.0 : 0.0;
    const gdpAdj = brent < 70 ? 0.99 : (brent > 92 ? 1.005 : 1.0);
    const newGdp = SOT.gdpBase * gdpAdj;

    const dDeficit = (subsidy - SOT.fuelSubsidyBase) - (petTax - SOT.petTaxBase) - (dividend - SOT.dividendBaseMoF) + sarawakHit;
    const newDeficit = SOT.deficitBase + dDeficit;
    const newDefPct = (newDeficit / newGdp) * 100;

    const newDebt = SOT.debtBase + dDeficit;
    const newDebtPct = (newDebt / newGdp) * 100;
    const headroom = 65.0 - newDebtPct;

    // Corporate Gearing
    let gearing = 25.5;
    if (brent < 70) gearing += 2.2;
    if (simDivMode === 'topup' && brent >= 90) gearing += 1.4;
    if (simCourt === 'sarawak') gearing += 3.5;

    return {
      brent,
      subsidy,
      petTax,
      dividend,
      divNote,
      newDeficit,
      newDefPct,
      newDebt,
      newDebtPct,
      headroom,
      gearing,
      simCourt,
      simDivMode
    };
  }

  function setCourt(mode) {
    simCourt = mode;
  }

  function setDivMode(mode) {
    simDivMode = mode;
  }

  return {
    SOT,
    calculate,
    setCourt,
    setDivMode,
    getCourt: () => simCourt,
    getDivMode: () => simDivMode
  };
})();
