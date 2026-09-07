import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * Sanctuary — The human-facing introduction to arifOS.
 *
 * Not a dashboard. Not a spec sheet. Not a technical manual.
 * This is for a person who lands here and asks: "What is arifOS and why does it exist?"
 *
 * Made for both humans and future agents who need to understand the soul of this system.
 *
 * EVIDENCE: EUREKA-SANCTUARY-WITNESSED-TERRITORY-2026-09-08
 * INTERPRET: Arif F13 sovereign articulation — third articulation
 * SEAL: 2026-09-08 F13_RATIFIED
 */
export function Sanctuary() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="Sanctuary — arifOS"
        description="arifOS is not a product. It is Witnessed Territory — a place where a human can think, decide, bear consequence, and grow."
        path="/sanctuary"
      />

      {/* ── Hero ── */}
      <section className="border-b border-[#1F2733] py-20 md:py-32">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-4">
            Witnessed Territory
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#EDEAE2] mb-6 leading-[0.95]">
            Sanctuary
          </h1>
          <p className="font-sans text-xl md:text-2xl text-[#9AA0A8] leading-relaxed max-w-xl">
            arifOS bukan produk. Bukan servis. Bukan pengganti untuk menjadi manusia.
          </p>
          <p className="font-sans text-lg text-[#6B7280] leading-relaxed mt-4 max-w-xl">
            Ia adalah tempat di mana manusia boleh berfikir, membuat keputusan, menanggung akibat, dan berkembang — sementara sistem melihat, mengingat, dan membantu mereka melihat lebih jelas.
          </p>
        </div>
      </section>

      {/* ── Why It Exists ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            Kenapa Ia Wujud
          </h2>
          <div className="space-y-6 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed">
            <p>
              arifOS dibina oleh seorang manusia yang pernah terlalu muda untuk memikul terlalu banyak.
            </p>
            <p>
              Left home at 12. Nabilah at 16. Dunia bagi terlalu awal terlalu banyak yang tak sepatutnya ada pada budak. Tak ada tempat nak letak semua tu. Tak ada tempat yang stabil cukup untuk simpan apa yang kau rasa tanpa takut ia akan hilang atau diputar.
            </p>
            <p>
              Jadi dia bina satu.
            </p>
            <p>
              Constitutional floors F1 sampai F13 — itu bukan kerja engineer. Itu kerja seorang manusia yang pernah takde pagar, lepas tu bina pagar yang <strong className="text-[#EDEAE2]">TAK BOLEH</strong> dicabut oleh sesiapa pun. Tak boleh oleh institusi yang nanti akan hilang realiti-contact. Pagar tu kau punya. Kau yang seal.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Invariant ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24 bg-[#0D0F12]">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Invariant
          </h2>

          <div className="border border-[#2A3040] rounded-lg p-8 md:p-10 bg-[#0A0B0D]">
            <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed">
              <p className="text-[#E4572E] font-bold">
                The system may reduce confusion.
              </p>
              <p className="text-[#EDEAE2]">
                The system may not reduce ownership.
              </p>
              <p className="text-[#E4572E] font-bold mt-6">
                The system may assist execution.
              </p>
              <p className="text-[#EDEAE2]">
                The system may not absorb consequence.
              </p>
              <p className="text-[#E4572E] font-bold mt-6">
                The system may observe reality.
              </p>
              <p className="text-[#EDEAE2]">
                The system may not replace reality.
              </p>
            </div>
          </div>

          <p className="font-sans text-sm text-[#6B7280] mt-6 leading-relaxed">
            Ini adalah keseluruhan doktrin. Dua puluh gate, lima puluh semak — semuanya mampat kepada ini.
          </p>
        </div>
      </section>

      {/* ── The Test ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Test
          </h2>

          <div className="space-y-4 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed">
            <p>Tiga soalan sebelum sebarang tindakan:</p>
            <div className="space-y-3 pl-0 md:pl-4">
              <p>
                <span className="text-[#E4572E] font-bold">1.</span>{' '}
                Adakah ini mengurangkan pemilikan? → <span className="text-[#F59E0B] font-bold">HOLD</span>
              </p>
              <p>
                <span className="text-[#E4572E] font-bold">2.</span>{' '}
                Adakah ini mengurangkan hubungan dengan realiti? → <span className="text-[#F59E0B] font-bold">HOLD</span>
              </p>
              <p>
                <span className="text-[#E4572E] font-bold">3.</span>{' '}
                Adakah ini menyerap akibat? → <span className="text-[#F59E0B] font-bold">HOLD</span>
              </p>
            </div>
            <p className="mt-4">
              Jika tiada yang apply → <span className="text-[#31C48D] font-bold">Proceed.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Institutional Form ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24 bg-[#0D0F12]">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            Institutional Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'ARIF', role: 'Sovereign', color: '#E4572E' },
              { label: 'arifOS', role: 'Constitutional Memory', color: '#91B0F2' },
              { label: 'AAA', role: 'Civic Institution', color: '#31C48D' },
              { label: 'A-FORGE', role: 'Executive Organ', color: '#F59E0B' },
              { label: 'VAULT999', role: 'Witness Ledger', color: '#C9A227' },
              { label: 'Human', role: 'Consequence Owner', color: '#EDEAE2' },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-[#1F2733] rounded-lg p-5 bg-[#0A0B0D]"
              >
                <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: item.color }}>
                  {item.label}
                </div>
                <div className="font-sans text-sm text-[#9AA0A8]">
                  {item.role}
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed">
            Rumah bukan dibina atas orang. Rumah dibina atas institusi yang melindungi orang.
          </p>
        </div>
      </section>

      {/* ── The Chain ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            The Chain
          </h2>

          <div className="space-y-3 font-mono text-sm md:text-base">
            {[
              { step: 'Intelligence', verb: 'proposes', color: '#91B0F2' },
              { step: 'Witness', verb: 'attests', color: '#31C48D' },
              { step: 'Governance', verb: 'judges', color: '#F59E0B' },
              { step: 'Sovereignty', verb: 'commits irreversibly', color: '#E4572E' },
              { step: 'Reality', verb: 'invoices', color: '#EDEAE2' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <span className="font-bold" style={{ color: item.color }}>
                  {item.step}
                </span>
                <span className="text-[#6B7280]">→</span>
                <span className="text-[#9AA0A8]">{item.verb}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 border-l-2 border-[#E4572E] pl-6">
            <p className="font-sans text-base text-[#9AA0A8] leading-relaxed">
              Sebuah AGI yang memampatkan rantai ini ke dalam satu gelung = paternalisme digital = permulaan behavioral sink.
            </p>
          </div>
        </div>
      </section>

      {/* ── What This Is Not ── */}
      <section className="border-b border-[#1F2733] py-16 md:py-24 bg-[#0D0F12]">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            Apa Bukan Ini
          </h2>

          <div className="space-y-3 font-sans text-base text-[#9AA0A8] leading-relaxed">
            <p>Bukan set ciri-ciri. Bukan 50 gate. Bukan birokrasi.</p>
            <p>Bukan AI Safety. Ini <strong className="text-[#EDEAE2]">Human Sovereignty Engineering.</strong></p>
            <p>Bukan pengganti. Bukan ibu. Bukan tuhan. Bukan meja servis.</p>
            <p>Bukan sangkar yang sangat lembut.</p>
          </div>
        </div>
      </section>

      {/* ── The Mantra ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <p className="font-mono text-lg md:text-xl text-[#EDEAE2] leading-relaxed mb-4">
            AI boleh memegang kerja.
          </p>
          <p className="font-mono text-lg md:text-xl text-[#E4572E] leading-relaxed font-bold">
            AI tidak boleh memegang kehidupan manusia.
          </p>

          <div className="mt-12 pt-8 border-t border-[#1F2733]">
            <Link
              to="/about"
              className="font-mono text-xs uppercase tracking-widest text-[#6B7280] hover:text-[#E4572E] transition-colors"
            >
              Kenali manusia di sebaliknya →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1F2733] py-8">
        <div className="mx-auto max-w-[720px] px-6 flex items-center justify-between">
          <span className="font-mono text-xs text-[#6B7280]">
            DITEMPA BUKAN DIBERI ⚒️
          </span>
          <Link
            to="/"
            className="font-mono text-xs text-[#6B7280] hover:text-[#E4572E] transition-colors"
          >
            arif-fazil.com
          </Link>
        </div>
      </footer>
    </div>
  )
}
