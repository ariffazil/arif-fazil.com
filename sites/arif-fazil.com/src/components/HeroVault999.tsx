import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ZkProofLeaf {
  id: string;
  claim: string;
  hash: string;
  status: 'SEALED' | 'VERIFIED';
}

const ZK_PROOFS: ZkProofLeaf[] = [
  { id: 'ZK-01', claim: 'DunedinPACE Epigenetic Calibration (ρ = 0.82)', hash: '0x8f2a9c17e4d588b3', status: 'VERIFIED' },
  { id: 'ZK-02', claim: 'Malay Basin Discovery Wells Ledger', hash: '0x3c71ea4920b61f8a', status: 'SEALED' },
  { id: 'ZK-03', claim: '13 Constitutional Floors Active Enforcement', hash: '0x999e41d80b7c25aa', status: 'SEALED' },
  { id: 'ZK-04', claim: 'F13 Sovereign Human Veto Authority', hash: '0xf1309a88c7e129dd', status: 'SEALED' },
];

export function HeroVault999() {
  const [activeProof, setActiveProof] = useState<ZkProofLeaf>(ZK_PROOFS[0]);
  const [pulseHex, setPulseHex] = useState('0x999_METERAI_SEAL');

  useEffect(() => {
    const timer = setInterval(() => {
      const randomHex = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 6);
      setPulseHex(randomHex);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <article className="group relative rounded-xl border border-[#1F2733] bg-[#090C12] p-6 hover:border-[#E0301E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] uppercase tracking-widest text-[#E0301E] bg-[#141A24]/70 rounded-bl-lg border-l border-b border-[#1F2733]">
        VAULT999 · ZKPC
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#E0301E]" />
          <span>999 MODULE · L2</span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
          The Vault & ZKPC
        </h3>
        <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
          Zero-Knowledge Private Computing: immutable Merkle-hashed provenance verifying biometric & constitutional claims.
        </p>

        {/* Cryptographic Terminal Viewport */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-[#04060A] border border-[#1F2733] p-4 flex flex-col justify-between font-mono text-xs overflow-hidden">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(224,48,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(224,48,30,0.3) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2733] text-[9px] text-[#8A8578]">
              <span className="text-[#E0301E] font-bold">MERKLE ROOT PROOF</span>
              <span>ZK-SNARK ENCLAVE</span>
            </div>

            <div className="p-2 rounded bg-[#0A0D15] border border-[#1F2733] flex items-center justify-between">
              <span className="text-[10px] text-[#8A8578]">ROOT HASH:</span>
              <span className="text-[10px] font-bold text-[#E0301E] tabular-nums truncate max-w-[170px]">{pulseHex}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {ZK_PROOFS.map((p) => {
                const isSel = activeProof.id === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setActiveProof(p)}
                    className={`p-1.5 rounded cursor-pointer transition-all flex items-center justify-between text-[9px] border ${
                      isSel 
                        ? 'bg-[#E0301E]/15 border-[#E0301E] text-white' 
                        : 'bg-[#080B10] border-[#161D2B] text-[#8A8578] hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-[#E0301E]">{p.id}</span>
                    <span className="truncate max-w-[160px]">{p.claim}</span>
                    <span className="text-[#10B981] font-semibold">PASS</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#1F2733] text-[8px] text-[#6A7382]">
            <span>NON-REPUDIATION: ABSOLUTE</span>
            <span className="text-[#E0301E]">METERAI 999 ATTESTED</span>
          </div>
        </div>

        {/* Selected Proof Inspect */}
        <div className="mt-4 pt-3 border-t border-[#1F2733]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#8A8578] mb-1.5">
            <span>Proof Verification Leaf:</span>
            <span className="text-[#10B981] font-bold">{activeProof.status}</span>
          </div>
          <div className="p-2.5 rounded bg-[#06080E] border border-[#1F2733] font-mono text-[10px] text-[#9AA0A8] leading-relaxed">
            <span className="text-white font-semibold">{activeProof.claim}</span>
            <br />
            <span className="text-[8px] text-[#6A7382] truncate block mt-0.5">Leaf Digest: {activeProof.hash} · Zero disclosure of raw genomic substrate.</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
        <Link 
          to="/999" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#E0301E] hover:underline uppercase tracking-wider font-semibold"
        >
          Inspect Proof Vault →
        </Link>
        <span className="font-mono text-[9px] text-[#6A7382]">SEALED & PROVEN</span>
      </div>
    </article>
  );
}
export default HeroVault999;
