import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const WIKI_TOPICS = [
  {
    category: 'Identity & Biography',
    items: [
      { title: 'Arif Fazil — Sovereign Dossier', desc: '13 years petroleum geoscientist, architect of arifOS, founder of GEOX.' },
      { title: 'Ontology & Human Sovereign Anchor', desc: 'Why AI systems require an explicit human sovereign veto at F13.' },
      { title: 'Philosophy of Ditempa Bukan Diberi', desc: 'Systems forged through reality contact, not granted by assumption.' },
    ]
  },
  {
    category: 'Subsurface & Earth Methodology',
    items: [
      { title: 'AVO Fluid Factor & Attention Residuals', desc: 'Physics-constrained attention mechanism derived from Zoeppritz equations.' },
      { title: 'Malay & Sabah Deepwater Basin Models', desc: 'Structural geology, shallow-flow discoveries, and fault seal calibration.' },
    ]
  },
  {
    category: 'Agents & Federation Architecture',
    items: [
      { title: 'The Seven-Contract Agent Model', desc: 'Definition of an authentic agent: boundary, context, tool veto, accountability.' },
      { title: 'The Holy 8 Verbs of arifOS', desc: 'init → observe → think → route → memory → judge → forge → seal.' },
    ]
  },
  {
    category: 'Civilizational Order & Geopolitics',
    items: [
      { title: 'The Seven Civilizational Languages of AI', desc: 'Mapping Kissinger’s World Order, Isaacson’s humanist lens, and Nusantara statecraft into the autonomous agentic era.' },
      { title: 'Musyawarah vs. Unilateral Algorithmic Diktat', desc: 'How archipelagic consensus (333 Architect + 555 Auditor) prevents institutional epistemic collapse.' },
      { title: 'Batu & Enjin: Reality Constraints at Depth', desc: 'Why rock formations at 3,000m constrain corporate and artificial narratives alike.' },
    ]
  }
]

export function WordsWiki() {
  useEffect(() => {
    document.title = 'Wiki & Knowledge — Words | arif-fazil.com'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', 'Canonical documentation: identity, subsurface methodology, agents & federation, civilizational order. Each entry links to its primary source.')
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Breadcrumb */}
        <nav className="font-mono text-xs uppercase tracking-widest text-[#9AA0A8] mb-6 flex flex-wrap gap-2">
          <Link to="/words/" className="hover:text-[#C9A227] transition-colors">Words</Link>
          <span>›</span>
          <span className="text-[#C9A227]">Wiki</span>
        </nav>

        {/* Header */}
        <div className="mb-12 border-b border-[#1F2733] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#E4572E] uppercase tracking-widest mb-3">
            <span>🏛️ WIKI & KNOWLEDGE</span>
            <span>·</span>
            <span>CANONICAL DOCUMENTATION</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EDEAE2] mb-4">
            Words — Wiki
          </h1>
          <p className="font-sans text-lg text-[#9AA0A8] max-w-3xl leading-relaxed">
            The canonical documentation for concepts, biographical evidence, geological derivations, and agent guides.
            Every entry links back to its primary source.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WIKI_TOPICS.map((group) => (
            <div key={group.category} className="rounded-lg border border-[#1F2733] bg-[#11151C] p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-4 pb-2 border-b border-[#1F2733]">
                  {group.category}
                </h3>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.title} className="group">
                      <h4 className="font-sans text-sm font-bold text-[#EDEAE2] group-hover:text-[#E4572E] transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-sans text-xs text-[#9AA0A8] mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sister surfaces */}
        <div className="mt-16 pt-8 border-t border-[#1F2733] flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
          <Link to="/words/essays/" className="text-[#E4572E] hover:text-white transition-colors">📖 Essays →</Link>
          <Link to="/words/makcikgpt/" className="text-[#D9A62E] hover:text-white transition-colors">🌍 MakcikGPT (Column) →</Link>
          <Link to="/words/" className="text-[#9AA0A8] hover:text-white transition-colors">← Back to Words hub</Link>
        </div>
      </div>
    </div>
  )
}

export default WordsWiki