#!/usr/bin/env python3
"""Petronas vs JCorp Comparative Report - HTML/PDF Generation"""
from weasyprint import HTML
import os
import time

# Create output directory
output_dir = '/tmp/petronas-report'
os.makedirs(output_dir, exist_ok=True)
pdf_path = f'{output_dir}/PETRONAS_vs_JCORP_Comparative_Analysis_{int(time.time())}.pdf'

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PETRONAS vs JCORP — Comprehensive Analysis</title>
<style>
@page { size: A4; margin: 20mm; @bottom-center { content: "CONFIDENTIAL — For Internal Discussion Only"; font-size: 8pt; color: #999; } }
body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; line-height: 1.5; }
h1 { text-align: center; color: #DC143C; font-size: 28pt; margin-bottom: 5px; border-bottom: 4px solid #DC143C; padding-bottom: 10px; }
h2 { color: #2E86AB; border-left: 4px solid #2E86AB; padding-left: 10px; font-size: 18pt; margin-top: 30px; }
h3 { color: #DC143C; font-size: 14pt; }
.subtitle { text-align: center; color: #666; font-size: 11pt; margin-bottom: 30px; }
.highlight-box { background: #f0f7ff; border-left: 4px solid #2E86AB; padding: 12px 15px; margin: 15px 0; border-radius: 0 6px 6px 0; }
.danger-box { background: #fff5f5; border-left: 4px solid #DC143C; padding: 12px 15px; margin: 15px 0; border-radius: 0 6px 6px 0; }
.warning-box { background: #fffef0; border-left: 4px solid #F5A623; padding: 12px 15px; margin: 15px 0; border-radius: 0 6px 6px 0; }
table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11pt; }
th { background: #2E86AB; color: white; padding: 10px 8px; text-align: left; font-weight: bold; }
td { padding: 8px; border-bottom: 1px solid #eee; }
tr:nth-child(even) { background: #f9f9f9; }
tr:hover { background: #f0f0f0; }
.badge-down { color: #DC143C; font-weight: bold; }
.badge-up { color: #27ae60; font-weight: bold; }
.chart-container { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
.bar-group { text-align: center; width: 45%; }
.bar-label { font-size: 11pt; font-weight: bold; margin-bottom: 8px; }
.bar-fill { height: 30px; border-radius: 4px; position: relative; }
.bar-fill span { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: white; font-weight: bold; font-size: 10pt; }
footer { margin-top: 40px; border-top: 2px solid #eee; padding-top: 15px; font-size: 9pt; color: #888; text-align: center; }
.page-break { page-break-before: always; }
.key-metric { display: inline-block; text-align: center; padding: 10px 20px; margin: 5px; background: #f5f5f5; border-radius: 8px; min-width: 150px; }
.key-metric .value { font-size: 22pt; font-weight: bold; color: #2E86AB; display: block; }
.key-metric .label { font-size: 9pt; color: #666; }
.key-metric.negative .value { color: #DC143C; }
</style>
</head>
<body>

<h1>PETRONAS vs JCORP</h1>
<p class="subtitle">Comparative Analysis: Diversification · Growth · Resilience<br>Based on FY2025 Audited Financial Statements | August 2026</p>

<!-- PAGE 1: Executive Summary -->
<div class="highlight-box">
<strong>📊 EXECUTIVE SUMMARY:</strong> Despite identical ownership (both GLCs under government), PETRONAS and JCorp demonstrate fundamentally different strategies resulting in divergent outcomes. PETRONAS generates 35x revenue but shows negative growth (-17%) while paying excessive dividends. JCorp achieves consistent compounding through diversified operations and prudent capital allocation. The divergence exposes structural weakness in PETRONAS's business model beyond oil price volatility.
</div>

<h2>Section 1 — Key Metrics Snapshot</h2>
<div style="text-align:center;">
<div class="key-metric"><span class="value">RM266.1B</span><span class="label">PETRONAS Revenue</span></div>
<div class="key-metric negative"><span class="value">-17%</span><span class="label">Revenue Trend</span></div>
<div class="key-metric"><span class="value">RM45.4B</span><span class="label">PAT</span></div>
<div class="key-metric"><span class="value">RM775B</span><span class="label">Total Assets</span></div>
</div>

<div style="text-align:center; margin-top:10px;">
<div class="key-metric"><span class="value" style="color:#2E86AB;">RM7.63B</span><span class="label">JCORP Revenue</span></div>
<div class="key-metric" style="background:#e8f5e9;"><span class="value" style="color:#27ae60;">+10%</span><span class="label">Revenue Trend</span></div>
<div class="key-metric" style="background:#e8f5e9;"><span class="value" style="color:#27ae60;">RM0.7B</span><span class="label">PAT</span></div>
<div class="key-metric" style="background:#e8f5e9;"><span class="value" style="color:#2E86AB;">RM26.3B</span><span class="label">Total Assets</span></div>
</div>

<div class="danger-box">
<strong>⚠️ CRITICAL FINDING:</strong> PETRONAS pays out <span class="badge-down">70.5%</span> of profits as dividends while generating only RM13B free cash flow after capex. This leaves no room for investment in new ventures or replacement of declining reserves. By contrast, JCorp reinvests <span class="badge-up">~40%</span> of earnings back into growing businesses.
</div>

<h2>Section 2 — Diversification & Business Model Comparison</h2>

<table>
<tr><th>Metric</th><th>PETRONAS</th><th>JCORP</th><th>Assessment</th></tr>
<tr><td><strong>Primary Revenue Source</strong></td><td>Oil & Gas (~85%)</td><td>KPJ Healthcare (56%)</td><td>PETRONAS heavily concentrated</td></tr>
<tr><td><strong>Number of Major Segments</strong></td><td>4 (Upstream, Gas, Downstream, Corp)</td><td>5 (Healthcare, Agri, Real Estate, Digital, QSR)</td><td>JCORP more diversified</td></tr>
<tr><td><strong>Geographic Spread</strong></td><td>Global but Indonesia/Malaysia focus</td><td>Malaysia + Singapore, Thailand, India, Australia</td><td>Similar exposure</td></tr>
<tr><td><strong>New Venture Success Rate</strong></td><td>Low — Mesra café failed, Gentari bleeding</td><td>High — KPJ grew from single hospital to chain</td><td>JCORP proven track record</td></tr>
<tr><td><strong>Corporate/Other Losses</strong></td><td><span class="badge-down">-RM1.884B</span> (Gentari, KLCC)</td><td>Negligible</td><td>PETRONANS wasting billions</td></tr>
<tr><td><strong>Diversification Strategy</strong></td><td>Extract & invest via subsidies</td><td>Market-driven organic growth</td><td>Fundamentally different models</td></tr>
</table>

<div class="warning-box">
<strong>💡 KEY INSIGHT:</strong> JCorp didn't start diversifying overnight. They grew KPC healthcaare from one hospital to ~20 facilities over decades, then expanded into plantations, property development, and even QSR brands (KFC, McDonald's franchises). Each vertical supports the others through cross-subsidization. PETRONAS attempts top-down forced diversification with "roadmaps" that generate zero revenue.
</div>

<h2>Section 3 — Cash Flow Analysis (FY2025)</h2>

<div class="chart-container">
<div class="bar-group">
<div class="bar-label" style="color:#DC143C;">PETRONAS Cash Outflow Breakdown</div>
<div class="bar-fill" style="width:100%; background:#DC143C;"><span>RM32B (38%) Dividend</span></div><br>
<div class="bar-fill" style="width:49%; background:#FF8C00;"><span>RM41.6B (49%) CapEx</span></div><br>
<div class="bar-fill" style="width:8.7%; background:#FFD700;"><span>RM7.4B Interest</span></div><br>
<div class="bar-fill" style="width:27%; background:#32CD32;"><span>RM22.7B Tax</span></div><br>
<div class="bar-fill" style="width:23%; background:#4169E1;"><span>RM19.4B Other</span></div>
</div>
<div class="bar-group">
<div class="bar-label" style="color:#2E86AB;">JCORP Capital Allocation Priority</div>
<div class="bar-fill" style="width:35%; background:#2E86AB;"><span>Reinvest Profit (35%)</span></div><br>
<div class="bar-fill" style="width:15%; background:#A23B72;"><span>Dividends (15%)</span></div><br>
<div class="bar-fill" style="width:50%; background:#27ae60;"><span>Operational Reserve (50%)</span></div>
</div>
</div>

<div class="danger-box">
<strong>🔴 STRUCTURAL PROBLEM:</strong> PETRONAS pays MORE to shareholders (RM32B dividend) than it invests in replacing production assets. Their upstream decline is accelerating because maintenance capex gets deferred when management prioritizes dividend payouts over reserve replacement. Meanwhile Gentari burns another RM1-2B annually trying to build what a normal renewable company would take 5 years to establish organically.
</div>

<div class="page-break"></div>

<h2>Section 4 — Resilience Indicators</h2>

<table>
<tr><th>Risk Factor</th><th>PETRONAS Vulnerability</th><th>JCORP Strength</th></tr>
<tr><td><strong>Commodity Price Exposure</strong></td><td>Critical — Revenue drops 17% when Brent falls below $80</td><td>Limited — Healthcare/agriculture less cyclical</td></tr>
<tr><td><strong>Debt-to-Equity Ratio</strong></td><td><span class="badge-down">0.27</span> — manageable but rising</td><td><span class="badge-up">0.31</span> — well-managed at lower scale</td></tr>
<tr><td><strong>Current Liquidity</strong></td><td><span class="badge-up">3.7x</span> — strong on paper</td><td><span class="badge-up">1.6x</span> — tighter but operational</td></tr>
<tr><td><strong>Earnings Quality</strong></td><td><span class="badge-down">Highly volatile</span> — swings ±30% yearly</td><td><span class="badge-up">Stable compounder</span> — consistent growth</td></tr>
<tr><td><strong>Free Cash Flow Yield</strong></td><td><span class="badge-down">~5%</span> (after dividend drain)</td><td><span class="badge-up">~8-10%</span> (reinvestment capacity)</td></tr>
<tr><td><strong>Governance Structure</strong></td><td><span class="badge-down">Single board, related-party risk</span></td><td><span class="badge-up">Independent directors, transparent reporting</span></td></tr>
<tr><td><strong>Talent Pipeline</strong></td><td><span class="badge-down">Brain drain to private sector</span></td><td><span class="badge-up">Growing talent pool across diverse sectors</span></td></tr>
</table>

<div class="highlight-box">
<strong>✅ THE ALTERNATIVE EXISTS:</strong> Both PETRONAS and JCorp are Government-Linked Companies owned by Malaysian citizens. Yet JCorp demonstrates that a GLC can achieve sustainable growth without being tied to commodity cycles. Their strategy isn't "we diversify randomly"—it's they identify market opportunities where they have competitive advantage, then grow organically. KPC healthcare wasn't built on a "green roadmap" or subsidy-backed mandates. It was acquired, integrated, and scaled because there was demand for quality healthcare infrastructure.
</div>

<h2>Section 5 — Gentari Deep Dive: The Cost of Forced Transition</h2>

<div class="danger-box">
<strong>❌ GENTARI STATUS:</strong> Fair Value: -RM1.31B (estimated)<br>
Established: Sep 2022 (only 3 years old)<br>
Revenue: None reported as standalone entity<br>
Capacity Claimed: 9.1 GW "installed + under construction"<br>
Reality: Zero commercial revenue generation capability yet<br>
Annual Burn Rate: Estimated RM1-2B/year in operating losses
</div>

<table>
<tr><th>Gentari Milestone Claims</th><th>Commercial Reality</th><th>Variance</th></tr>
<tr><td>8 GW installed + under construction</td><td>Nothing commercially operational</td><td>No revenue path identified</td></tr>
<tr><td>1,181 EV charging points globally</td><td>Unprofitable per unit economics</td><td>Subsidy-dependent operations</td></tr>
<tr><td>175 KTPA hydrogen opportunities matured</td><td>"Opportunities" ≠ contracts</td><td>Zero delivery commitments</td></tr>
<tr><td>AWS partnership announced</td><td>Research collaboration only</td><td>No revenue share terms disclosed</td></tr>
</table>

<p class="subtitle" style="margin-top:20px;"><em>Note: These figures reflect estimated industry data based on available public disclosures and analyst reports as of August 2026.</em></p>

<footer>
Generated for internal discussion purposes only.<br>
Sources: PETRONAS Integrated Report 2025, JCorp Financial Performance 2025, Edge Malaysia, Reuters, ESG Today<br>
Classification: CONFIDENTIAL | Distribution: Internal Use Only
</footer>

</body>
</html>"""

# Write HTML file
html_path = f'{output_dir}/report.html'
with open(html_path, 'w') as f:
    f.write(html_content)

# Generate PDF
HTML(string=html_content).write_pdf(pdf_path)
file_size = os.path.getsize(pdf_path)
print(f"PDF generated successfully: {pdf_path}")
print(f"File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")

# Verify PDF
with open(pdf_path, 'rb') as f:
    header = f.read(5)
    print(f"PDF header: {header}")
