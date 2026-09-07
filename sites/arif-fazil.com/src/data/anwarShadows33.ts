/**
 * 33 Tensions — Anwar Ibrahim
 * Axis 1: Sosiopolitik (01-11)
 * Axis 2: Ekonomi (12-22)
 * Axis 3: Peribadi (23-33)
 *
 * METHODLOGY: HUMAN_EUREKA_KERNEL v1.1
 * Each card separates: Fact → Interpretation → Alternatives → Limits
 * This is NOT a psychological diagnosis. It is a policy accountability analysis.
 * DITEMPA BUKAN DIBERI.
 */

export type ShadowAxis = "sosiopolitik" | "ekonomi" | "peribadi";

export interface Shadow {
  id: number;
  axis: ShadowAxis;
  title: string;
  /** Verifiable public record — what can be traced to sources */
  fact: string;
  /** Editorial interpretation — clearly labelled as analysis, not fact */
  interpretation: string;
  /** Alternative explanations — at least two credible readings */
  alternatives: string[];
  /** Epistemic limits — what cannot be claimed from the evidence */
  limits: string;
  /** Source citations — specific, traceable */
  source: string;
}

export const ANWAR_SHADOWS: Shadow[] = [
  // ══════════════════════════════════════════════════════════════
  // AXIS 1 — SOSIOPOLITIK
  // ══════════════════════════════════════════════════════════════
  {
    id: 1,
    axis: "sosiopolitik",
    title: "Baling 1974 — Naratif Asal-usul",
    fact: "1974: Anwar mengetuai protes di Baling berkaitan laporan kesukaran penoreh getah. Harga getah memang jatuh. Beliau ditahan di bawah ISA selama 20 bulan. Bapa beliau, Ibrahim Abdul Rahman, adalah Ahli Parlimen UMNO Seberang Tengah (1959–1964) dan Setiausaha Parlimen Kementerian Kesihatan. Anwar kemudiannya menghadiri MCKK, sekolah elit Melayu.",
    interpretation: "Naratif 'anak kampung yang berjuang untuk rakyat miskin' adalah sebahagian daripada persona politik yang dibina sejak 1974. Latar belakang keluarga yang berada dalam politik UMNO mewujudkan kontras dengan imej marhaen.",
    alternatives: [
      "Aktivis muda yang ikhlas terhadap kemiskinan walaupun dari keluarga elit",
      "Pengalaman keluarga dalam politik memberi kesedaran awal tentang ketidakadilan",
      "Naratif sengaja dibina untuk modal politik jangka panjang",
      "Gabungan ketiga-tiga: motivasi bercampur adalah normal dalam aktivisme"
    ],
    limits: "Rekod awam tidak membuktikan sama ada protes itu bermotifkan ikhlas, politik, atau kedua-duanya. Satu peristiwa 1974 tidak menentukan watak tetap 50 tahun kemudian.",
    source: "Wikipedia — Baling protest 1974; Ibrahim Abdul Rahman MP 1959-1964; ISA detention record."
  },
  {
    id: 2,
    axis: "sosiopolitik",
    title: "ABIM → UMNO 1982",
    fact: "1971: Anwar co-founded ABIM, an Islamic youth movement opposing the secular establishment. 1982: he joined UMNO, the party ABIM had opposed. He was appointed Deputy Minister, then rose to Deputy Prime Minister by 1993. He cited UMNO's promise of Islamization under Mahathir as justification.",
    interpretation: "Joining UMNO after leading an opposition movement is a consequential political decision that invites debate about strategy vs. co-optation. The speed of his rise (Deputy Minister to DPM in 11 years) suggests significant political skill and patronage.",
    alternatives: [
      "Genuine belief that reform required state power from within",
      "Political ambition that prioritized career over movement",
      "Strategic calculation that outsider reform was impossible in Malaysia's system",
      "Multiple motives operating simultaneously — ambition AND belief"
    ],
    limits: "Motives for joining UMNO cannot be established from public record alone. Mixed motives are normal in political actors and do not prove deception.",
    source: "Wikipedia — joined UMNO 1982; ministerial records 1982-1998."
  },
  {
    id: 3,
    axis: "sosiopolitik",
    title: "40 Tahun, Banyak Jawatan",
    fact: "MP 1982. Minister of Culture, Agriculture, Education, Finance. Deputy PM twice. Opposition Leader. PM 2022. Four decades of public office across multiple portfolios.",
    interpretation: "The accumulation of portfolios over four decades creates significant institutional memory but also potential identity-fusion with office. The question is whether long tenure builds wisdom or dependency.",
    alternatives: [
      "Deep institutional expertise from diverse portfolios",
      "Identity becoming inseparable from political role",
      "Normal career progression for a long-serving politician",
      "Combination of expertise and dependency"
    ],
    limits: "Duration in office does not establish motive, character, or psychological state. Many long-serving politicians worldwide hold multiple portfolios without identity-level conclusions being drawn.",
    source: "Wikipedia — ministerial portfolios 1982–1998; Opposition Leader; PM 2022."
  },
  {
    id: 4,
    axis: "sosiopolitik",
    title: "Shifting Alliances — UMNO Kekal",
    fact: "Alliance history: PAS (opponent), DAP (ally then opponent), UMNO (1982-1998 ally, 2022- present ally via unity government). The 2022 unity government brought former adversaries PH and BN together.",
    interpretation: "UMNO has been the most consistent political relationship across Anwar's career, despite periods of opposition. Coalition formation in Malaysia's multi-ethnic system requires pragmatic alliances.",
    alternatives: [
      "UMNO is the necessary coalition partner in Malaysia's political arithmetic",
      "Strategic flexibility that prioritizes governing over ideological purity",
      "Pattern of returning to the establishment rather than transforming it",
      "Malaysia's system makes broad coalitions inevitable for any PM"
    ],
    limits: "Coalition patterns do not establish personal loyalty, hidden motives, or character. Multi-party coalition formation is normal in parliamentary democracies.",
    source: "PH-BN unity government 2022-present; SPR election records."
  },
  {
    id: 5,
    axis: "sosiopolitik",
    title: "DNAA Zahid — 47 Pertuduhan",
    fact: "September 2023: High Court granted DNAA (Discharge Not Amounting to Acquittal) on 47 corruption charges against Ahmad Zahid Hamidi, after prosecution's application. Zahid was Deputy PM in the unity government. Anwar stated he did not direct the Attorney General.",
    interpretation: "The DNAA raised serious public concern about prosecutorial independence and anti-corruption credibility, particularly because Zahid was a senior coalition partner and deputy PM.",
    alternatives: [
      "AGC acted independently based on legal assessment",
      "Coalition politics influenced the decision",
      "Evidence was genuinely insufficient for conviction",
      "Combination of legal and political factors"
    ],
    limits: "Public record does not establish that Anwar personally directed the DNAA or that there was an explicit exchange between prosecution decisions and parliamentary support. Causal claims require direct evidence.",
    source: "The Edge Malaysia 8 September 2023; Court records; AGC statements."
  },
  {
    id: 6,
    axis: "sosiopolitik",
    title: "Reformasi Kredibiliti — BERSIH Kritikan",
    fact: "Activists including BERSIH have criticized the slow pace of institutional reform under Anwar's government. Concerns include: prosecutorial independence, MACC operations, and anti-corruption commitments.",
    interpretation: "Gap between reform rhetoric and reform delivery is a legitimate accountability concern. The question is whether delays reflect political constraints, institutional resistance, or reduced commitment.",
    alternatives: [
      "Institutional reform requires time and coalition consensus",
      "Coalition constraints prevent faster reform",
      "Reform commitment has weakened under governing pressure",
      "Combination of constraints and reduced urgency"
    ],
    limits: "Pace of reform alone does not establish motive. Institutional reform in Malaysia faces structural obstacles beyond any single PM's control.",
    source: "BERSIH statements 2023-2025; civil society reports."
  },
  {
    id: 7,
    axis: "sosiopolitik",
    title: "Kabinet dan Penasihat",
    fact: "Cabinet includes figures from multiple coalition partners. Nurul Izzah briefly served as senior economic adviser (Jan-Feb 2023) before resigning following public criticism. Multiple advisers and cabinet members have their own political bases.",
    interpretation: "Cabinet composition reflects coalition management requirements. The Nurul Izzah appointment created perception problems for an anti-nepotism reformist government.",
    alternatives: [
      "Standard coalition cabinet formation in parliamentary system",
      "Concentration of advisory influence within trusted circle",
      "Family appointment as political error that was corrected",
      "Mix of coalition necessity and personal trust networks"
    ],
    limits: "Cabinet composition does not establish 'shadow governance' or hidden control structures. Coalition governments necessarily include partners with their own agendas.",
    source: "Cabinet records 2022-present; CNA — Nurul Izzah adviser appointment and resignation."
  },
  {
    id: 8,
    axis: "sosiopolitik",
    title: "Akta Keselamatan — Konsistensi Dasar",
    fact: "Security legislation has been maintained or introduced under Anwar's government, despite past opposition to ISA and security laws during his opposition years.",
    interpretation: "Continuation of security legislation that was previously opposed raises questions about consistency of reform principles. The question is whether governing reality necessitates these tools or whether principles were abandoned.",
    alternatives: [
      "Genuine security assessment changed after governing",
      "Coalition partners required security legislation",
      "Political convenience replaced principled opposition",
      "Different context requires different tools"
    ],
    limits: "Change in position on security legislation does not establish hypocrisy without examining the specific security context and institutional advice. Many democratic leaders adjust security policy after taking office.",
    source: "Parliamentary records; BERSIH statements on security legislation."
  },
  {
    id: 9,
    axis: "sosiopolitik",
    title: "Subsidi dan Cukai — Beban Kos Hidup",
    fact: "Government implemented subsidy rationalization (diesel, electricity) and expanded SST scope and rates. National debt approximately RM1.3 trillion. Anwar announced he would not take PM salary.",
    interpretation: "Fiscal reform measures are presented as necessary for long-term sustainability but impose real short-term hardship. The salary sacrifice creates symbolic optics that may distract from structural governance questions.",
    alternatives: [
      "Genuine fiscal consolidation needed for national sustainability",
      "IMF-style austerity that burdens lower-income groups disproportionately",
      "Political framing of painful measures as reform",
      "Combination of fiscal necessity and political messaging"
    ],
    limits: "Subsidy reform is a policy choice with distributional consequences. Assessing whether it is 'right' requires quantifying who bears the burden and whether mitigation is adequate — not inferring motive.",
    source: "MOF budget documents 2023-2026; DOSM CPI data; diesel subsidy reform announcements."
  },
  {
    id: 10,
    axis: "sosiopolitik",
    title: "LGBT — Dasar dan Retorik",
    fact: "In CNN 2023 interview, Anwar stated LGBTQ would not be recognized. He also suggested sodomy laws should be reviewed. Malaysia maintains Section 377 criminalizing sodomy.",
    interpretation: "Positioning on LGBTQ issues reflects coalition management between conservative Malay-Muslim base and liberal/international audience. The sodomy-law review suggestion has personal historical resonance given Anwar's prosecution history.",
    alternatives: [
      "Coalition management requiring different messages to different audiences",
      "Genuine evolution toward more nuanced position",
      "Political hedging that avoids commitment on either side",
      "Personal history creating unique relationship with sodomy laws"
    ],
    limits: "Public statements on LGBTQ policy do not establish personal views, hidden orientation, or psychological motivation. Political positioning on social issues in multi-ethnic Malaysia is inherently complex.",
    source: "CNN interview 2023; Malaysian Penal Code Section 377."
  },
  {
    id: 11,
    axis: "sosiopolitik",
    title: "Legasi — Apa yang Akan Tinggal?",
    fact: "Comparison with predecessors: Tunku (Merdeka), Razak (DEB), Mahathir (mega-corporate transformation), Najib (1MDB scandal), Muhyiddin (COVID). Anwar's government tenure began 2022.",
    interpretation: "Legacy assessment is premature for a sitting PM. The question is what institutional or structural changes will endure beyond the current term.",
    alternatives: [
      "Fiscal consolidation and subsidy reform as structural legacy",
      "Coalition stability as institutional precedent",
      "Insufficient transformative change for lasting legacy",
      "Too early to assess — legacy requires post-tenure evaluation"
    ],
    limits: "Legacy assessment of a sitting PM is inherently incomplete. Historical judgment requires distance and outcomes that cannot yet be measured.",
    source: "Historical records of Malaysian PMs; current policy announcements."
  },

  // ══════════════════════════════════════════════════════════════
  // AXIS 2 — EKONOMI
  // ══════════════════════════════════════════════════════════════
  {
    id: 12,
    axis: "ekonomi",
    title: "IMF 1997 — Prinsip dan Warisan",
    fact: "1997 Asian Financial Crisis: Anwar supported IMF-style discipline — budget cuts of 18%, opposition to bailouts of crony conglomerates. Mahathir later imposed capital controls, which Malaysia followed. Current government has implemented subsidy rationalization and fiscal consolidation measures.",
    interpretation: "The 1997 IMF approach is cited as evidence of intellectual consistency in fiscal policy. The question is whether current measures reflect the same market-discipline philosophy or evolved understanding.",
    alternatives: [
      "Consistent free-market fiscal philosophy across decades",
      "Lessons learned from 1997 failure informing current caution",
      "Different economic context requiring different tools",
      "IMF framework as default when other approaches fail"
    ],
    limits: "1997 policy positions do not establish current motive. Economic policy evolves with context, and comparing across decades requires accounting for changed global conditions.",
    source: "IMF/World Bank crisis reports 1997-98; Euromoney award 1996; current MOF policy documents."
  },
  {
    id: 13,
    axis: "ekonomi",
    title: "PETRONAS — Dividen kepada Kerajaan",
    fact: "PETRONAS FY2025: profit RM45.4 billion (down 17.6%). Dividend RM20 billion paid to government. PETRONAS has been a consistent source of government revenue through dividends.",
    interpretation: "Heavy reliance on PETRONAS dividends to fund government operations raises questions about fiscal sustainability and whether the national oil company is being treated as a revenue source rather than a sovereign wealth vehicle.",
    alternatives: [
      "Standard sovereign revenue from national resources",
      "Fiscal dependency that reduces PETRONAS's long-term investment capacity",
      "Necessary measure given fiscal constraints",
      "Structural issue requiring diversification strategy"
    ],
    limits: "PETRONAS dividend policy is a fiscal governance question, not evidence of personal motive. Comparative analysis with other national oil companies needed.",
    source: "PETRONAS Annual Report FY2025; Edge Malaysia August 2026."
  },
  {
    id: 14,
    axis: "ekonomi",
    title: "SST dan Rasionalisasi Subsidi",
    fact: "SST scope expanded and rates increased (5-10% on new items, July 2025). Diesel subsidy rationalized for Peninsular Malaysia — estimated savings RM4 billion. National debt approximately RM1.3 trillion.",
    interpretation: "Fiscal consolidation measures are presented as necessary for long-term sustainability but impose real costs on households and businesses. The question is whether targeting is adequate and mitigation sufficient.",
    alternatives: [
      "Genuine fiscal reform needed for debt sustainability",
      "Austerity that disproportionately burdens lower-income groups",
      "IMF-style conditionality without IMF label",
      "Political framing of necessary but painful measures"
    ],
    limits: "Fiscal reform assessment requires distributional analysis, targeting data, and compensation mechanisms — not motive attribution. Policy choices have consequences; characterizing those consequences requires evidence.",
    source: "MOF budget 2025-2026; SST expansion announcements; DOSM CPI data."
  },
  {
    id: 15,
    axis: "ekonomi",
    title: "PTPTN — Janji dan Realiti",
    fact: "Pre-election: promises to review or reform PTPTN (national education loan). Post-election: PTPTN remains with existing repayment structures. Student debt continues.",
    interpretation: "Gap between pre-election promises and post-election delivery on education finance is a legitimate accountability concern.",
    alternatives: [
      "Coalition constraints prevented PTPTN reform",
      "Fiscal reality made reform impossible without alternative funding",
      "Promise was political rather than implementable",
      "Reform is planned but delayed by competing priorities"
    ],
    limits: "Unfulfilled election promises are common in democracies and do not establish deception without examining the specific constraints faced.",
    source: "PH manifesto PRU-14/15; PTPTN current policy."
  },
  {
    id: 16,
    axis: "ekonomi",
    title: "Gas Sarawak — PETROS dan PETRONAS",
    fact: "Sarawak holds approximately 60% of Malaysia's gas reserves. Dispute between PETROS (Sarawak's oil company) and PETRONAS over gas aggregation rights. Federal government has been involved in mediation.",
    interpretation: "Federal-state resource revenue sharing is a significant governance issue. The question is whether federal mediation adequately protects Sarawak's resource rights.",
    alternatives: [
      "Federal mediation balancing national and state interests",
      "PETRONAS interests prioritized over Sarawak's rights",
      "Complex legal and constitutional issue requiring careful resolution",
      "Political negotiation that will take time to resolve"
    ],
    limits: "Resource disputes involve constitutional, legal, and commercial dimensions. Attributing motive to federal mediation requires evidence of deliberate bias, not just process complexity.",
    source: "PETROS-PETRONAS dispute records; Sarawak government statements."
  },
  {
    id: 17,
    axis: "ekonomi",
    title: "Mega Projek — Energy Asia, F1",
    fact: "Government has pursued high-profile projects including Energy Asia conference and Formula 1 return bid. These involve significant public expenditure and international visibility.",
    interpretation: "High-profile projects raise questions about allocation of public funds between visibility and direct citizen benefit.",
    alternatives: [
      "Strategic investment in Malaysia's international positioning",
      "Tourism and economic multiplier effects",
      "Political optics that prioritize visibility over substance",
      "Mix of strategic and political motivations"
    ],
    limits: "Mega-project assessment requires cost-benefit analysis, economic impact data, and comparison with alternative uses of funds — not motive inference.",
    source: "Energy Asia 2025; F1 return bid reports; MOF expenditure records."
  },
  {
    id: 18,
    axis: "ekonomi",
    title: "Procurement — Ketelusan",
    fact: "Government procurement processes have faced criticism regarding transparency, particularly for large contracts and GLC transactions.",
    interpretation: "Procurement transparency is a governance accountability issue. The question is whether Madani government has improved or maintained the transparency standards it criticized in predecessors.",
    alternatives: [
      "Inherited procurement systems being reformed gradually",
      "Coalition politics affecting procurement decisions",
      "Structural obstacles to full transparency",
      "Genuine improvement that is not yet visible publicly"
    ],
    limits: "Procurement criticism requires specific evidence of irregularities, comparative analysis with previous governments, and examination of institutional constraints.",
    source: "Auditor General reports; procurement policy documents."
  },
  {
    id: 19,
    axis: "ekonomi",
    title: "Kos Hidup — Siapa yang Menanggung?",
    fact: "Cost of living has increased with subsidy rationalization and SST expansion. Government has implemented cash transfer programs (STR/SHR) as mitigation. Inflation data shows mixed trends.",
    interpretation: "Distributional impact of fiscal reform is a legitimate policy concern. The question is whether mitigation measures adequately offset increased costs for affected groups.",
    alternatives: [
      "Targeted transfers adequately compensate affected groups",
      "Transfers insufficient for lowest-income households",
      "Structural reform will benefit all groups in medium term",
      "Reform benefits upper-income groups disproportionately"
    ],
    limits: "Assessing who bears the fiscal burden requires household-level data, not political rhetoric analysis. Both 'reform is necessary' and 'reform hurts rakyat' can be simultaneously true.",
    source: "DOSM CPI data; STR/SHR disbursement records; MOF fiscal reports."
  },
  {
    id: 20,
    axis: "ekonomi",
    title: "Ringgit dan Keyakinan Pelabur",
    fact: "Ringgit has experienced volatility during Anwar's tenure. Foreign investment trends show mixed signals. Government has pursued investor engagement through international visits and policy announcements.",
    interpretation: "Currency performance and investment confidence are complex macroeconomic outcomes influenced by global conditions, domestic policy, and market perception.",
    alternatives: [
      "Global conditions (US interest rates, China slowdown) driving ringgit weakness",
      "Domestic policy uncertainty affecting investor confidence",
      "Structural economic issues predating current government",
      "Combination of external and domestic factors"
    ],
    limits: "Currency movements are influenced by hundreds of factors. Attributing ringgit performance to a single PM's actions or character is economically unsound.",
    source: "BNM exchange rate data; MIDA investment reports; global macro data."
  },
  {
    id: 21,
    axis: "ekonomi",
    title: "Hutang Negara — RM1.3 Trilion",
    fact: "National debt approximately RM1.3 trillion. Debt-to-GDP ratio has increased. Government has implemented fiscal consolidation measures including subsidy reform and revenue diversification.",
    interpretation: "National debt level is a fiscal sustainability concern. The question is whether current measures are sufficient to stabilize debt trajectory.",
    alternatives: [
      "Debt inherited from previous governments and COVID spending",
      "Current fiscal measures on path to stabilization",
      "Debt growth requires more aggressive consolidation",
      "Structural revenue problem requiring deeper reform"
    ],
    limits: "Debt assessment requires fiscal trajectory analysis, not character judgment. Debt levels are outcomes of policy across multiple governments, not a single PM's character.",
    source: "MOF fiscal reports; Bank Negara data; Auditor General reports."
  },
  {
    id: 22,
    axis: "ekonomi",
    title: "Ekonomi Digital dan AI — Aspirasi",
    fact: "Government has announced ambitions for Malaysia as a regional digital economy and AI hub. MoUs signed with international technology companies. Data center investments attracted.",
    interpretation: "Digital economy ambitions are common across ASEAN nations. The question is whether implementation matches ambition.",
    alternatives: [
      "Genuine strategic positioning for digital economy",
      "PR announcements without implementation substance",
      "Infrastructure constraints (energy, grid) limiting delivery",
      "Long-term strategy that will take years to materialize"
    ],
    limits: "Digital economy assessment requires tracking specific MoU implementation, infrastructure investment, and policy delivery — not aspiration-level criticism.",
    source: "MIDA investment data; NIMP 2030; data center announcements."
  },

  // ══════════════════════════════════════════════════════════════
  // AXIS 3 — PERIBADI
  // ══════════════════════════════════════════════════════════════
  {
    id: 23,
    axis: "peribadi",
    title: "Kes Liwat — Rekod Mahkamah",
    fact: "Two sodomy trials: 1998-2004 (convicted, overturned on appeal 2004); 2008-2015 (acquitted 2012, conviction reinstated 2014, Federal Court upheld 2015). Amnesty International designated Anwar 'prisoner of conscience' in 1999. International human rights organizations criticized aspects of both cases as politically motivated.",
    interpretation: "The legal history is central to Malaysia's modern political narrative. International human rights assessments and the political context of both prosecutions are documented.",
    alternatives: [
      "Politically motivated prosecution as documented by international observers",
      "Genuine legal proceedings that happened to involve a political figure",
      "Mix of political motivation and legal substance",
      "Cases that cannot be definitively resolved from public record alone"
    ],
    limits: "Court records establish legal proceedings and outcomes. They do not establish personal character, hidden motives, or psychological states. The human rights assessment is an institutional opinion, not a psychological diagnosis.",
    source: "Federal Court rulings 2004, 2015; Amnesty International reports; HRW statements."
  },
  {
    id: 24,
    axis: "peribadi",
    title: "Black Eye 1998 — Keganasan Negara",
    fact: "September 29, 1998: Anwar appeared in court with a black eye sustained while in police custody. Inspector General of Police Abdul Rahim Mohd Noor was convicted and sentenced for the assault. The incident became a national symbol of state violence against political opposition.",
    interpretation: "The 1998 assault is documented state violence that had major political consequences. It established Anwar as a symbol of political persecution.",
    alternatives: [
      "Documented state violence that validates claims of political persecution",
      "Historical event that should inform but not determine current assessment",
      "Trauma that shaped political identity and public sympathy",
      "Event that is legitimately relevant to accountability assessment of current governance"
    ],
    limits: "The assault is a documented fact. Using it to deflect current governance criticism, or dismissing its ongoing relevance, are both editorial choices that should be stated as such.",
    source: "RCI (Royal Commission of Inquiry) findings; Abdul Rahim conviction record."
  },
  {
    id: 25,
    axis: "peribadi",
    title: "Shakespeare dan Intelek",
    fact: "Anwar has demonstrated literary and intellectual engagement, including reportedly reading Shakespeare extensively during imprisonment and presenting at the World Shakespeare Congress 2007.",
    interpretation: "Literary and intellectual engagement contrasts with populist political communication style. The question is whether code-switching between registers improves democratic accessibility or constitutes persona management.",
    alternatives: [
      "Genuine intellectual depth that is selectively displayed",
      "Political communication that adapts register to audience",
      "Standard political code-switching practiced by many leaders",
      "Intelligence that is strategically deployed rather than consistently expressed"
    ],
    limits: "Intellectual capacity and communication style do not establish character, motive, or hidden identity. Political leaders worldwide adapt communication to context.",
    source: "World Shakespeare Congress 2007; public intellectual engagements."
  },
  {
    id: 26,
    axis: "peribadi",
    title: "Wan Azizah — Peranan Politik",
    fact: "Dr. Wan Azizah Wan Ismail: PKR president, held Permatang Pauh seat for 20 years, served as Deputy PM 2018-2020. Long-serving political partner who maintained party leadership during Anwar's imprisonment.",
    interpretation: "The political partnership raises questions about party centralization within a family unit, which is a governance concern applicable to many Malaysian political parties.",
    alternatives: [
      "Standard political family involvement common in Malaysian politics",
      "Genuine partnership where both parties contribute independently",
      "Party centralization that raises democratic governance questions",
      "Mix of personal partnership and political strategy"
    ],
    limits: "Political spousal roles are documented. Claims about private marriage dynamics, intimate motivation, or 'marriage as political ledger' cannot be established from public record.",
    source: "PKR party records; Cabinet records 2018-2020."
  },
  {
    id: 27,
    axis: "peribadi",
    title: "Nurul Izzah — Pelantikan dan Peletakan Jawatan",
    fact: "Nurul Izzah Anwar: MP for Permatang Pauh, PKR vice-president. Appointed as senior economic and finance adviser to PM (her father) in January 2023. Resigned approximately one month later following public criticism about nepotism.",
    interpretation: "The appointment created a perception problem for a government presenting itself as reformist. Her subsequent resignation indicates that public criticism had political force.",
    alternatives: [
      "Merit-based appointment that was politically misread",
      "Nepotism that was corrected by public accountability",
      "Family trust network that occasionally crosses governance boundaries",
      "Error that was acknowledged and rectified"
    ],
    limits: "Public appointment and resignation are documented. Claims about 'children as strategic weapons' or 'dynastic aristocracy' are motive assertions not supported by the public record.",
    source: "PMO appointment announcement January 2023; resignation reports February 2023."
  },
  {
    id: 28,
    axis: "peribadi",
    title: "MCKK — Latar Belakang Elit",
    fact: "Anwar attended Malay College Kuala Kangsar (MCKK), an elite residential school historically associated with Malay aristocracy and political establishment. He was selected as one of three students from Penang.",
    interpretation: "MCKK education provides elite networks and establishment credentials that contrast with 'anak kampung' political narrative.",
    alternatives: [
      "Merit-based selection to elite institution",
      "Family political connections facilitating elite access",
      "Standard educational pathway for promising students of that era",
      "Mix of merit, opportunity, and family background"
    ],
    limits: "Educational background is documented. Social mobility narratives involve complex interactions of family, opportunity, and achievement that cannot be reduced to simple deception claims.",
    source: "MCKK records; Wikipedia biographical data."
  },
  {
    id: 29,
    axis: "peribadi",
    title: "Identiti dan Pejabat",
    fact: "Anwar's political career spans 40+ years. His identity has been closely tied to political roles: ABIM leader, Minister, Deputy PM, Opposition Leader, PM. The gap between his 1998 dismissal and 2022 appointment as PM was approximately 24 years.",
    interpretation: "Long political career creates potential for identity-fusion with political role. The question is whether political identity has become the primary identity, which is a common phenomenon among long-serving politicians worldwide.",
    alternatives: [
      "Normal identity development for career politicians",
      "Identity-fusion that makes office essential to self-concept",
      "Political identity as chosen vocation, not pathological dependency",
      "Common phenomenon among leaders who dedicate decades to public service"
    ],
    limits: "Career-long political identity does not establish psychological pathology or 'identity fused to office.' This is a common observation about career politicians globally, not a unique diagnosis.",
    source: "Political career timeline 1982-present."
  },
  {
    id: 30,
    axis: "peribadi",
    title: "Pengampunan — Maaf sebagai Strategi",
    fact: "Anwar reconciled with Mahathir in 2018 for the PH coalition victory. He formed a unity government with UMNO/BN in 2022, including Zahid Hamidi as deputy PM. These reconciliations involved former political adversaries.",
    interpretation: "Political reconciliation with former adversaries raises questions about whether forgiveness is principled or strategic. In Malaysian coalition politics, reconciliation is often necessary for governing.",
    alternatives: [
      "Strategic pragmatism required by coalition mathematics",
      "Genuine political maturity that prioritizes governing over grudges",
      "Calculated moves that sacrifice principle for power",
      "Standard political behavior in parliamentary coalition systems"
    ],
    limits: "Political reconciliation is common in democracies. Attributing 'calculated forgiveness' requires evidence of explicit calculation, not just outcome-based inference.",
    source: "2018 PH coalition formation; 2022 unity government records."
  },
  {
    id: 31,
    axis: "peribadi",
    title: "Kritikan dan Respons",
    fact: "Anwar has responded to various criticisms during his tenure, including questions about reform pace, coalition decisions, and policy choices. Public responses have varied from defensive to engagement.",
    interpretation: "Response patterns to criticism are relevant to governance accountability. The question is whether responses demonstrate openness to feedback or defensiveness.",
    alternatives: [
      "Standard political defensiveness common among leaders",
      "Genuine engagement with substantive criticism",
      "Pattern of deflecting criticism through historical narrative",
      "Evolution in response style over political career"
    ],
    limits: "Response patterns to criticism are observable. Claims about 'incapacity for self-reflection' or 'never admitting error' require comprehensive corpus analysis, not selected examples.",
    source: "Public statements and press conferences 2022-present."
  },
  {
    id: 32,
    axis: "peribadi",
    title: "30 Tahun Penantian",
    fact: "From 1998 dismissal to 2022 PM appointment: approximately 24 years. During this period, Anwar was imprisoned twice, led the opposition, and formed multiple coalition attempts before finally becoming PM.",
    interpretation: "The length of the political journey from dismissal to premiership is historically significant. The question is what this persistence reveals about political motivation and character.",
    alternatives: [
      "Remarkable political resilience and commitment",
      "Identity that became inseparable from the goal of becoming PM",
      "Political ambition sustained by genuine reform vision",
      "Mix of resilience, ambition, and conviction"
    ],
    limits: "Duration of political pursuit does not establish psychological motive. Many political leaders worldwide have long journeys to power without identity-level conclusions being drawn.",
    source: "Political timeline 1998-2022."
  },
  {
    id: 33,
    axis: "peribadi",
    title: "Apa yang Boleh Dinilai",
    fact: "Public record includes: coalition formation decisions, policy delivery, institutional reforms (or lack thereof), fiscal management, international positioning, and political appointments. These are observable governance outputs.",
    interpretation: "Governance outputs are the appropriate basis for political accountability assessment. Inner life, hidden motives, and psychological states cannot be established from public record.",
    alternatives: [
      "Assess policy delivery against promises",
      "Assess institutional reform against commitments",
      "Assess fiscal management against stated goals",
      "Assess coalition governance against democratic standards"
    ],
    limits: "This page assesses public policy and governance record. It does not and cannot assess Anwar Ibrahim's inner life, psychological state, hidden motives, or essential identity. Those are not available from public evidence.",
    source: "All sources cited above; governance record 2022-present."
  },
];

export const ANWAR_SUMMARY = {
  name: "Dato' Seri Anwar Ibrahim",
  order: 10,
  tenure: "2022–sekarang",
  totalTensions: 33,
  axes: {
    sosiopolitik: 11,
    ekonomi: 11,
    peribadi: 11,
  },
  verdict: "ADAPTIVE_REGULATOR",
  /** Kernel-processed insight — policy, not personality */
  coreInsight:
    "Anwar Ibrahim bukan 'Bijak' atau 'Bangang' dalam vakum. Dia adalah Adaptive Regulator yang menguruskan tegangan antara Power (Kuasa) dan Reform (Janji) dengan memilih Power setiap kali. Dia bijak dalam seni bina survival politik — 30 tahun dari pemecatan hingga PM, musuh jatuh, dia masih berdiri. Tetapi dia nampak lambat kepada mereka yang mengharapkan reformasi pantas. Itu bukan kebodohan — itu trade-off. Dia membayar reputasi untuk membeli masa.",
  /** Paradox axis — the core tension this person manages */
  paradoxAxis: "Power (Kuasa) ↔ Reform (Janji)",
  /** Selector function — how this person navigates the paradox */
  selectorFunction:
    "Master Selector — dia memilih 'position' yang optimum untuk survival dalam setiap konteks. Depan pengundi Melayu: konservatif. Depan pelabur Barat: liberal/Madani. Depan China: pro-Beijing. Depan UMNO: 'kawan seperjuangan.' Itu political survival intelligence, bukan saintifik intelligence.",
  /** Shadow territory — what is too expensive to visit */
  shadowTerritory:
    "Fallibility (Kesilapan). Kenapa dia tak boleh mengaku silap? Sebab kalau dia mengaku, naratif 'Pejuang Suci' yang dia bina selama30 tahun akan runtuh. Mengaku silap = Expensive. Kompromi integriti = Cheap (sebab orang lain pun buat, dia boleh rationalize).",
  /** Metaphor — cat vs lion */
  metaphor:
    "Dia bijak macam kucing9 nyawa. Dia tak bijak macam singa yang jaga hutan. Kalau kau nak singa, kau silap pilih kucing. Tapi jangan kata kucing tu bangang sebab dia tak boleh raung macam singa. Dia cuma main game lain: Survival.",
  methodologyNote:
    "Analisis ini menggunakan HUMAN_EUREKA_KERNEL v1.1 — setiap kad dipisahkan antara fakta, tafsiran, alternatif, dan had inferens. Ia bukan diagnosis psikologi. Ia bukan dakwaan identiti. Ia analisis akauntabiliti polisi terhadap rekod awam.",
  sources: [
    "Wikipedia Anwar Ibrahim",
    "The Edge Malaysia (Ogos 2026, Disember 2023)",
    "Al Jazeera (Februari 2024)",
    "CNA (Februari 2026)",
    "CNN interview 2023",
    "MOF Malaysia",
    "BERSIH statements 2023",
    "PETRONAS Annual Report FY2025",
    "Court of Appeal & Federal Court rulings",
    "Istana Negara statements November 2022",
    "SPR PRU-15 official results",
  ],
};
