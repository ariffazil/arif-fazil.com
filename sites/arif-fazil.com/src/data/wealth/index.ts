import type { WealthArticleContent, WealthArticleMeta } from './types';

import exposeWsj from './expose-wsj';
import aiCapexVsNyawa from './ai-capex-vs-nyawa';

export const wealthArticleModules: WealthArticleContent[] = [
  exposeWsj,
  aiCapexVsNyawa,
];

export const wealthArticlesMeta: WealthArticleMeta[] = [
  {
    slug: 'expose-wsj',
    title: 'The RM70 Billion Question',
    subtitle: "How Malaysia's Biggest Gas Deal Was Structured — and Who Was Left Out of the Room",
    date: '2026-06-07',
    domain: 'SEARAH × PETROS',
    language: 'en',
    excerpt: 'SEARAH Limited registered in London, ENI House. USD 15 billion regional gas/LNG hub. 300-500 kboe/d production target. The independent market data converges on the size, structure, and strategic positioning.',
    tags: ['petronas', 'petros', 'searah', 'eni', 'lng', 'rm70b', 'investigative'],
    seal: '999',
  },
  {
    slug: 'ai-capex-vs-nyawa',
    title: 'AI Capex vs 697,000 Nyawa — NPV Siapa Yang Kita Kira?',
    subtitle: 'WEALTH companion piece to AI Johor rakyat 2026. Discount-rate YTL RM 18-21B AI capex against RM 158B social cost of displaced workers. NPV agregat: negatif. Siapa dapat gains, siapa tanggung losses.',
    date: '2026-07-06',
    domain: 'WEALTH × AI × JOHOR × NPV × YTL × NVIDIA × RINGGIT',
    language: 'ms',
    excerpt: 'YTL-Nvidia RM 10B persendirian + RM 5.9B insertif kerajaan + RM 3-4B kuasa = RM 18-21B capex. NPV positif +RM 18-25B untuk shareholders. Sebaliknya, 697,000 pekerjaan hilang → kos sosial RM 158B NPV negatif. NPV sosial agregat: − RM 158B. Artikel ini exercise jujur: paksa bahasa dari "investment" ke "loss."',
    tags: ['ai', 'johor', 'npv', 'ytl', 'nvidia', 'displacement', 'social-cost', 'makcikgpt-companion', 'slot4', 'wef', 'ramalan', 'ramanan', 'ringgit'],
    seal: '999',
    provenance_status: 'sealed',
    version_lineage: {
      version: '1.1',
      published: '2026-07-06',
      last_updated: '2026-09-17',
      supersedes: 'ai-capex-vs-nyawa v1.0 (6 Julai 2026)',
    },
    source_ledger: [
      {
        source_id: 'SRC-NPV-001',
        type: 'news',
        title: 'Reuters — Nvidia partners with Malaysia\'s YTL on $2.2B AI cloud deal (27 Mar 2024)',
        url: 'https://www.reuters.com/technology/nvidia-partners-with-malaysias-ytl-22-billion-ai-cloud-deal-2024-03-27/',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-002',
        type: 'news',
        title: 'Data Center Dynamics — YTL Power and Nvidia to invest $2.3bn in AI infrastructure (Jun 2024)',
        url: 'https://www.datacenterdynamics.com/',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-003',
        type: 'news',
        title: 'The Edge Malaysia — YTL Power completes first Nvidia-powered AI data centre in Johor (Okt 2025)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-004',
        type: 'official_statement',
        title: 'YTL Power International IPO Prospectus Singapore (Okt 2024)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-005',
        type: 'filing',
        title: 'YTL Corporation filings Bursa Malaysia Q4 2024 – Q2 2026',
        url: 'https://www.bursamalaysia.com/',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-006',
        type: 'official_statement',
        title: 'MITI Press Releases 2024-2025 — AI Investment Incentives (Belanjawan 2025 Annex)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-007',
        type: 'official_statement',
        title: 'Kenyataan Akhbar KSM Datuk Ramanan — 697,000 pekerjaan terancam (Julai 2026)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-008',
        type: 'analysis',
        title: 'IMF Working Paper 2024/065 — Cazzaniga et al., "Gen-AI: Artificial Intelligence and the Future of Work"',
        url: 'https://www.imf.org/en/Publications/WP/Issues/2024/01/14/gen-ai-artificial-intelligence-and-the-future-of-work',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-009',
        type: 'analysis',
        title: 'ILO World Employment Outlook 2024',
        url: 'https://www.ilo.org/global/research/global-reports/weso/2024',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-010',
        type: 'macro_indicator',
        title: 'DOSM Statistik Tenaga Buruh Q1 2026',
        url: 'https://www.dosm.gov.my/',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-011',
        type: 'analysis',
        title: 'Goldman Sachs — Generative AI Could Raise Global GDP by 7% (Mac 2023)',
        url: 'https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-012',
        type: 'analysis',
        title: 'World Bank Social Discount Rate guidance for emerging-market infrastructure (3-5%)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-013',
        type: 'analysis',
        title: 'Bank of Norway — Government Pension Fund Global (USD 1.7T 2025)',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-014',
        type: 'analysis',
        title: 'HRDCorp Annual Report 2024 — Levy 1% payroll, belanja RM 1.1B',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-015',
        type: 'analysis',
        title: 'MCMA — Malaysia Data Centre Industry benchmark RM 6-8M per MW greenfield connection',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
      {
        source_id: 'SRC-NPV-016',
        type: 'news',
        title: 'Singapore SkillsFuture SGD 1.8B / Korea AI Basic Voucher KRW 1.3T / UK LLE £2.5B — comparative',
        url: '',
        retrieved_at: '2026-09-17T00:00:00Z',
      },
    ],
    claim_register: [
      {
        claim_id: 'C-NPV-001',
        text: 'YTL-Nvidia partnership mengumumkan USD 2.3 bilion (~RM 10B) pelaburan AI di Kulai, Johor pada 27 Mac 2024. 500MW fasa pertama.',
        tag: 'OBS',
        source_id: 'SRC-NPV-001',
        confidence_basis: 'Reuters, DCD Jun 2024, The Star 28 Mar 2024 — multi-source convergence',
      },
      {
        claim_id: 'C-NPV-002',
        text: 'YTL Power IPO Singapura Oktober 2024 raising RM 3.2B; sukuk hijau RM 4B; kredit bank sindiket RM 6B (Maybank-CIMB-RHB-Public Bank).',
        tag: 'OBS',
        source_id: 'SRC-NPV-004',
        confidence_basis: 'YTL Power IPO prospectus Singapura, Oktober 2024',
      },
      {
        claim_id: 'C-NPV-003',
        text: 'Insertif kerajaan Malaysia untuk AI Johor dianggarkan RM 5.9 bilion (tax allowance 100% 10 tahun, tarif elektrik khas, pengecualian cukai tanah, geran latihan).',
        tag: 'DER',
        source_id: 'SRC-NPV-006',
        confidence_basis: 'Arif Fazil aggregation daripada MITI press releases + Belanjawan 2025 Annex — itemized breakdown pending primary verification',
      },
      {
        claim_id: 'C-NPV-004',
        text: 'RM 3-4 bilion kos sambungan kuasa untuk 500-600MW greenfield data centre connection (RM 6-8M per MW).',
        tag: 'DER',
        source_id: 'SRC-NPV-015',
        confidence_basis: 'MCMA benchmark + 500MW public spec',
      },
      {
        claim_id: 'C-NPV-005',
        text: 'KSM Datuk Ramanan umum 697,000 pekerjaan terancam dekad ini sekiranya pekerja tidak naik taraf kemahiran (Julai 2026).',
        tag: 'INT',
        source_id: 'SRC-NPV-007',
        confidence_basis: 'Kenyataan akhbar KSM; primary Hansard reference pending verification',
      },
      {
        claim_id: 'C-NPV-006',
        text: 'IMF Working Paper 2024/065 — 40% pekerjaan global terdedah kepada AI; 30% untuk emerging-market middle-income.',
        tag: 'OBS',
        source_id: 'SRC-NPV-008',
        confidence_basis: 'Cazzaniga et al. 2024, IMF official publication',
      },
      {
        claim_id: 'C-NPV-007',
        text: 'YTL AI Cloud ARR matang dianggarkan RM 15-18 bilion pada fasa 2 (~200,000 GPU, utilisasi 70%, USD 3/GPU-jam).',
        tag: 'DER',
        source_id: 'SRC-NPV-005',
        confidence_basis: 'Comparable AWS p5 / Azure ND H100 v5 rates Q4 2025; public Nvidia partner tier pricing',
      },
      {
        claim_id: 'C-NPV-008',
        text: 'WACC YTL = 8% (70% hutang @ 6% + 30% ekuiti @ 12%).',
        tag: 'DER',
        confidence_basis: 'Standard weighted-average; market-derived debt/equity cost estimates',
      },
      {
        claim_id: 'C-NPV-009',
        text: 'Social discount rate World Bank standard untuk emerging-market infrastructure = 5%.',
        tag: 'OBS',
        source_id: 'SRC-NPV-012',
        confidence_basis: 'World Bank guidance for project appraisal',
      },
      {
        claim_id: 'C-NPV-010',
        text: 'NPV Capex YTL pada WACC 8%, EBITDA RM 8-10B matang, annuity factor 10 tahun = +RM 18-25 bilion.',
        tag: 'DER',
        confidence_basis: 'Formula Σ[CF/(1+r)^t] − C₀; sensitif kepada utilisasi dan ARR assumption',
      },
      {
        claim_id: 'C-NPV-011',
        text: 'Kos sosial pengangguran = 1.4-2.0× gaji (IMF/OECD standard). Purata titik tengah 1.7×.',
        tag: 'OBS',
        source_id: 'SRC-NPV-008',
        confidence_basis: 'IMF Working Paper 2024/065; OECD How\'s Life 2024',
      },
      {
        claim_id: 'C-NPV-012',
        text: 'Gaji purata sektor terjejas (manufacturing, services, transport) = RM 2,400/bulan (DOSM 2024).',
        tag: 'OBS',
        source_id: 'SRC-NPV-010',
        confidence_basis: 'DOSM gaji median 2024; 2026 update pending',
      },
      {
        claim_id: 'C-NPV-013',
        text: 'NPV Displacement pada SDR 5%, 10 tahun, 60% pengangguran efektif = − RM 158 bilion.',
        tag: 'DER',
        confidence_basis: '697,000 × 60% × RM 49,000 × annuity factor 7.722',
      },
      {
        claim_id: 'C-NPV-014',
        text: 'NPV sosial agregat = − RM 158 bilion (negative). Untung persendirian RM 30B tidak tutup kos sosial RM 188B.',
        tag: 'DER',
        confidence_basis: 'Sum of NPV Capex (+RM 30B) + NPV Displacement (−RM 188B)',
      },
      {
        claim_id: 'C-NPV-015',
        text: 'Norway GPFG USD 1.7T (2025) vs Malaysia tiada AI Sovereign Wealth Fund.',
        tag: 'OBS',
        source_id: 'SRC-NPV-013',
        confidence_basis: 'Bank of Norway; PMX kenyataan AI Summit (INT not OBS for exact wording)',
      },
      {
        claim_id: 'C-NPV-016',
        text: 'PMX Anwar Ibrahim akui Malaysia tiada mekanisme redistributif untuk AI gains.',
        tag: 'INT',
        confidence_basis: 'KL AI Summit / ASEAN Digital Ministers Meeting 2025 coverage; exact 30 May 2025 quote tidak disahkan',
      },
      {
        claim_id: 'C-NPV-017',
        text: 'Sensitivity: pengangguran efektif 30% → NPV sosial − RM 65B; 80% (worst) → − RM 220B. Semua senario munasabah kekal negatif.',
        tag: 'DER',
        confidence_basis: 'Linear sensitivity to unemployment effectiveness ratio',
      },
    ],
    counter_evidence: [
      {
        source_id: 'SRC-NPV-002',
        summary: 'YTL secara rasmi akan jana 3,000+ pekerjaan langsung di kampus Kulai (konsesi kerajaan sebagai justifikasi insertif).',
        disposition: 'Net of displacement multiplier: 3,000 direct jobs vs 697,000 displacement = 0.4%. Konsesi ini tidak menepati kos sosial. Tambahan, "pekerjaan langsung" datacenter bersifat high-skill (tidak match tenaga kerja displaced manufacturing).',
      },
      {
        source_id: 'SRC-NPV-007',
        summary: 'KSM Ramanan kerangka "24 bulan untuk adapt" — imply pilihan perseorangan.',
        disposition: 'IMF 2024 evidence: adaptation 24 bulan tidak realistik untuk majoriti pekerja manufacturing. Tempoh lebih sesuai: 60-84 bulan (5-7 tahun) untuk majoriti. Kerangka 24 bulan adalah underspecified.',
      },
      {
        source_id: 'SRC-NPV-005',
        summary: 'YTL Corp filings — YTL keluarga Yeoh berkata konsesi ini "melawan brain drain" — lapangan pekerjaan Malaysia untuk bakat tempatan.',
        disposition: 'Dapat 3,000 high-skill jobs vs kehilangan 697,000 mid-skill manufacturing jobs. "Brain drain" prevention hanya relevan untuk bakat AI-skill — majoriti kehilangan pekerjaan bukan bakat AI.',
      },
    ],
  },
];

export function getWealthArticle(slug: string): WealthArticleContent | undefined {
  return wealthArticleModules.find(a => a.slug === slug);
}

export function getWealthMeta(slug: string): WealthArticleMeta | undefined {
  return wealthArticlesMeta.find(a => a.slug === slug);
}
