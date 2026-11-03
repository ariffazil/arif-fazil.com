type ZenPulseProps = {
  whereAmI: string;
  whyCare: string;
  whatNext: string;
};

// Zen-pulse orientation bar — answers three questions in three seconds:
// Where am I? · Why care? · What next? Quiet by design: small, dim, calm.
export function ZenPulse({ whereAmI, whyCare, whatNext }: ZenPulseProps) {
  return (
    <div className="border-b border-forge-iron bg-forge-black">
      <div className="site-frame grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 py-2 font-technical text-[0.65rem] uppercase tracking-widest">
        <div className="flex gap-2 min-w-0 items-baseline">
          <span className="text-forge-dim/60 flex-shrink-0">Where am I?</span>
          <span className="text-forge-dim min-w-0">{whereAmI}</span>
        </div>
        <div className="flex gap-2 min-w-0 items-baseline">
          <span className="text-forge-dim/60 flex-shrink-0">Why care?</span>
          <span className="text-forge-orange min-w-0">{whyCare}</span>
        </div>
        <div className="flex gap-2 min-w-0 items-baseline">
          <span className="text-forge-dim/60 flex-shrink-0">What next?</span>
          <span className="text-forge-dim min-w-0">{whatNext}</span>
        </div>
      </div>
    </div>
  );
}

export default ZenPulse;
