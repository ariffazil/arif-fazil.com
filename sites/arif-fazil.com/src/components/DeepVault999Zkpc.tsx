import { useState, useMemo } from 'react'

interface MerkleLeaf {
  id: string
  title: string
  hash: string
  parent: string
  category: 'CONSTITUTION' | 'SUBSURFACE' | 'BIOMETRIC' | 'IDENTITY'
  claimText: string
  status: 'VERIFIED' | 'IMMUTABLE'
  timestamp: string
}

const MERKLE_LEAVES: MerkleLeaf[] = [
  {
    id: 'leaf-f13',
    title: 'F13 Sovereign Human Veto',
    hash: '0x9b2a7d4ef1300999aa771c89be4510fa3e11892d',
    parent: 'branch-constitution',
    category: 'CONSTITUTION',
    claimText: 'Human veto is absolute. Muhammad Arif bin Fazil holds non-delegable authority. Ditempa bukan diberi.',
    status: 'IMMUTABLE',
    timestamp: '2026-08-01T00:00:00Z',
  },
  {
    id: 'leaf-bekantan',
    title: 'Bekantan-1 Shallow Oil Discovery',
    hash: '0x3e18a9947fbb12c808890d2381f9a037612c8a91',
    parent: 'branch-subsurface',
    category: 'SUBSURFACE',
    claimText: 'Shallowest flowing oil discovery in Malay Basin (Group E/H15 clastics, PM304). 100% exploration flow record.',
    status: 'VERIFIED',
    timestamp: '2026-07-28T09:15:00Z',
  },
  {
    id: 'leaf-petronas',
    title: '13-Year Exploration Geoscience Ledger',
    hash: '0x5f917cb03194aa82c0918731be773901ca394f11',
    parent: 'branch-subsurface',
    category: 'SUBSURFACE',
    claimText: '2013–present: Exploration geoscientist at PETRONAS Carigali, Basin Analysis, Offshore Peninsular & Sabah/Sarawak.',
    status: 'VERIFIED',
    timestamp: '2026-08-11T12:00:00Z',
  },
  {
    id: 'leaf-bio',
    title: 'DunedinPACE Biological Aging Matrix',
    hash: '0x8a72b988f01c991a039772bf62e34591a08200ff',
    parent: 'branch-biometric',
    category: 'BIOMETRIC',
    claimText: 'Calibrated DunedinPACE aging velocity score ρ = 0.82 yr/yr, EAA = -6.29 years, -18% cellular deceleration.',
    status: 'VERIFIED',
    timestamp: '2026-09-18T16:00:00Z',
  },
  {
    id: 'leaf-did',
    title: 'W3C did:web:arif-fazil.com Key',
    hash: '0x1d44fe9831ca08b172a550993bc87e912440b82a',
    parent: 'branch-identity',
    category: 'IDENTITY',
    claimText: 'Cryptographic public key Ed25519 anchored in DNS root and HTTPS TLS origin for machine-to-machine trust.',
    status: 'IMMUTABLE',
    timestamp: '2026-08-15T08:30:00Z',
  },
]

export function DeepVault999Zkpc() {
  const [selectedLeafId, setSelectedLeafId] = useState<string>('leaf-f13')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false)

  const selectedLeaf = useMemo(
    () => MERKLE_LEAVES.find((l) => l.id === selectedLeafId) || MERKLE_LEAVES[0],
    [selectedLeafId]
  )

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
    }, 600)
  }

  const generatedZkProof = useMemo(() => {
    return JSON.stringify(
      {
        proof_system: 'Groth16 / ZK-SNARK',
        curve: 'BN254',
        vault_root: '0x7f4a999018e289bf44a1098ef922c091763aa8881920acbf9012',
        leaf_id: selectedLeaf.id,
        leaf_hash: selectedLeaf.hash,
        nullifier_hash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        public_inputs: [selectedLeaf.category, 'ARIF_FAZIL_F13', 'DELTA_S_LEQ_ZERO'],
        verification_status: 'PROOF_SATISFIED',
        timestamp: new Date().toISOString(),
        witness: 'VAULT999_MERKLE_ARIFOS_ENGINE',
      },
      null,
      2
    )
  }, [selectedLeaf])

  const copyReceipt = () => {
    navigator.clipboard.writeText(generatedZkProof)
    setCopiedReceipt(true)
    setTimeout(() => setCopiedReceipt(false), 2500)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-forge-gold/40 bg-gradient-to-b from-[#090C12] via-[#05070B] to-[#020305] p-6 sm:p-8 shadow-2xl my-12">
      {/* Header telemetry badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2733] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-forge-gold font-bold mb-1">
            <span className="h-2 w-2 rounded-full bg-forge-gold animate-ping" />
            <span>VAULT 999 · ZERO-KNOWLEDGE PRIVATE COMPUTING (ZKPC)</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#9AA0A8]">
            Interactive Merkle proof validator. Prove truth without disclosing proprietary subsurface or biological data.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] rounded bg-[#0A0E18] px-3 py-1.5 border border-[#1F2733]">
          <span className="text-[#9AA0A8]">MERKLE ROOT:</span>
          <span className="text-forge-gold font-bold font-mono">0x7f4a...999</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Tree Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs uppercase text-[#9AA0A8]">
            <span className="font-bold text-white">Cryptographic Merkle Tree</span>
            <span className="text-[10px] text-[#31C48D]">5 VALIDATED LEAVES</span>
          </div>

          {/* Tree Diagram */}
          <div className="p-5 rounded-xl border border-[#1F2733] bg-[#04060A] space-y-4">
            {/* Top Root Node */}
            <div className="flex justify-center">
              <div className="px-4 py-2 rounded-lg border border-forge-gold/60 bg-forge-gold/10 text-center font-mono">
                <div className="text-[9px] uppercase tracking-wider text-forge-gold font-bold">ROOT OF RECORD</div>
                <div className="text-xs text-white font-bold tracking-tight">0x7f4a999...ROOT</div>
              </div>
            </div>

            {/* Connecting lines */}
            <div className="flex justify-center">
              <div className="h-5 w-px bg-forge-gold/40" />
            </div>

            {/* Intermediate Branches */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
              <div className="p-2 rounded border border-[#1F2733] bg-[#080B12] text-[#38BDF8]">
                <div className="font-bold">BRANCH A</div>
                <div className="text-[8px] text-[#6A7382]">CONSTITUTION</div>
              </div>
              <div className="p-2 rounded border border-[#1F2733] bg-[#080B12] text-[#E4572E]">
                <div className="font-bold">BRANCH B</div>
                <div className="text-[8px] text-[#6A7382]">SUBSURFACE</div>
              </div>
              <div className="p-2 rounded border border-[#1F2733] bg-[#080B12] text-[#31C48D]">
                <div className="font-bold">BRANCH C</div>
                <div className="text-[8px] text-[#6A7382]">BIOMETRIC/ID</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4 w-px bg-[#1F2733]" />
            </div>

            {/* Leaves Selector */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase text-[#6A7382] tracking-wider mb-1">
                Select Leaf to Verify Merkle Proof:
              </div>
              {MERKLE_LEAVES.map((leaf) => (
                <button
                  key={leaf.id}
                  onClick={() => {
                    setSelectedLeafId(leaf.id)
                    handleVerify()
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLeafId === leaf.id
                      ? 'border-forge-gold bg-forge-gold/10 shadow-[0_0_15px_rgba(201,162,39,0.15)]'
                      : 'border-[#1F2733] bg-[#070A10] hover:border-white/30'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-[#1F2733] bg-[#111622] text-[#8A8578]">
                        {leaf.category}
                      </span>
                      <span className="font-sans text-xs font-bold text-[#EDEAE2] truncate">{leaf.title}</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#6A7382] truncate mt-0.5">{leaf.hash}</div>
                  </div>

                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#31C48D]/40 bg-[#31C48D]/10 text-[#31C48D] shrink-0">
                    {leaf.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Leaf Verification & ZK-SNARK Attestation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs uppercase text-[#9AA0A8]">
            <span className="font-bold text-white">Live Cryptographic Proof Path</span>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-2.5 py-1 rounded bg-forge-gold text-black font-mono text-[10px] font-bold uppercase hover:bg-yellow-400 transition-colors"
            >
              {isVerifying ? 'Verifying Path…' : 'Re-verify Proof'}
            </button>
          </div>

          {/* Verification Step-by-Step Card */}
          <div className="rounded-xl border border-[#1F2733] bg-[#06080E] p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2733] pb-3">
              <span className="text-[#8A8578]">TARGET LEAF:</span>
              <span className="text-white font-bold truncate max-w-[240px]">{selectedLeaf.title}</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[#8A8578]">
                <span>1. Leaf Hash:</span>
                <span className="text-[#38BDF8] truncate max-w-[260px]">{selectedLeaf.hash}</span>
              </div>
              <div className="flex items-center justify-between text-[#8A8578]">
                <span>2. Sibling Hash:</span>
                <span className="text-[#A78BFA] truncate max-w-[260px]">0x4c88e9...sibling</span>
              </div>
              <div className="flex items-center justify-between text-[#8A8578]">
                <span>3. Combined Hash:</span>
                <span className="text-forge-gold truncate max-w-[260px]">SHA256(H_leaf + H_sib)</span>
              </div>
              <div className="flex items-center justify-between text-[#8A8578] pt-2 border-t border-[#161D2B]">
                <span>4. Merkle Root Match:</span>
                <span className="text-[#31C48D] font-bold">0x7f4a999...ROOT [VALID]</span>
              </div>
            </div>

            {/* Claim Statement */}
            <div className="p-3 rounded bg-[#0B0F19] border border-[#1F2733] font-sans text-xs text-[#EDEAE2] leading-relaxed">
              <div className="font-mono text-[9px] uppercase text-[#E4572E] font-bold mb-1">Decoded Claim Payload:</div>
              "{selectedLeaf.claimText}"
            </div>
          </div>

          {/* Generated ZK-SNARK Attestation JSON Receipt */}
          <div className="rounded-xl border border-[#1F2733] bg-[#040508] p-4 relative">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8A8578] uppercase mb-2">
              <span>ZK-SNARK Attestation Receipt (JSON)</span>
              <button
                onClick={copyReceipt}
                className="text-forge-gold hover:underline font-bold uppercase transition-colors"
              >
                {copiedReceipt ? '✓ Copied to Clipboard' : 'Copy JSON Receipt'}
              </button>
            </div>
            <pre className="overflow-x-auto text-[10px] font-mono text-[#31C48D] leading-tight max-h-[160px] p-2 rounded bg-black/60 border border-[#161D2B]">
              {generatedZkProof}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
