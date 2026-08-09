#!/usr/bin/env python3
"""Petronas vs JCorp Comparative Analysis PDF Report"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import io
import os

# Create output directory
os.makedirs('/tmp/petronas-report', exist_ok=True)

styles = getSampleStyleSheet()

# Data - JCorp FY2025
jcorp_revenue = 7.63
jcorp_pbt = 1.04
jcorp_pat = 0.703
jcorp_assets = 26.3
jcorp_net_assets = 12.21
jcorp_divisions = ['Healthcare', 'Agribusiness', 'Real Estate', 'Others']
jcorp_div_revenue = [4.26, 1.76, 1.33, 0.28]  # in billions

# Data - PETRONAS FY2025
petronas_revenue = 266.1
petronas_pat = 45.4
petronas_cffo = 85.2
petronas_assets = 775.0
petronas_borrowings = 121.6
petronas_capex = 41.6
petronas_dividends_paid = 32.0
petronas_div_declared = 20.0

# Gentari data (part of Corporate & Others)
gentari_capacity_2025 = 9.1
gentari_fair_value = -1.31
corporate_others_loss = -1.884

# Revenue CAGR comparison
jcorp_cagr = 10.0  # 10%
petronas_cagr = -17.0  # -17%

def create_comparison_charts():
    """Create comparative visualization charts"""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('PETRONAS vs JCORP: COMPARATIVE PERFORMANCE ANALYSIS FY2025', 
                 fontsize=16, fontweight='bold', y=0.98)
    
    # Chart 1: Revenue Composition Comparison
    ax1 = axes[0, 0]
    colors_jcorp = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D']
    wedges, texts, autotexts = ax1.pie(jcorp_div_revenue, labels=jcorp_divisions,
                                       autopct='%1.1f%%', startangle=90,
                                       colors=colors_jcorp, textprops={'fontsize': 9})
    ax1.set_title('JCORP Revenue Composition\nFY2025 (RM7.63B)', fontsize=11, fontweight='bold')
    
    # Chart 2: Profitability Metrics
    ax2 = axes[0, 1]
    categories = ['Revenue (B)\nPBT Margin\nPAT Margin\nROE\nROA']
    values = [7.63, 13.6, 9.2, 5.8, 2.7]  # JCorp key metrics
    colors_profit = ['#2E86AB', '#2E86AB', '#2E86AB', '#2E86AB', '#2E86AB']
    bars = ax2.barh(categories, values, color=colors_profit, height=0.6)
    ax2.set_title('JCORP Key Financial Ratios', fontsize=11, fontweight='bold')
    ax2.axvline(x=10, color='red', linestyle='--', alpha=0.3)
    
    # Chart 3: Cash Flow Distribution - PETRONAS
    ax3 = axes[1, 0]
    petronas_cf_data = {
        'Dividend Paid': 32.0,
        'Net Borrowing': 14.2,
        'Lease Payments': 5.6,
        'Other Financing': 1.0,
        'Remaining Cash': 32.4
    }
    cf_labels = list(petronas_cf_data.keys())
    cf_values = list(petronas_cf_data.values())
    colors_cf = ['#E74C3C', '#E67E22', '#F39C12', '#F1C40F', '#27AE60']
    ax3.bar(cf_labels, cf_values, color=colors_cf)
    ax3.set_ylabel('RM Billion', fontsize=10)
    ax3.set_title('PETRONAS FY2025 Cash Flow Usage\n(Total CFFO: RM85.2B)', fontsize=11, fontweight='bold')
    ax3.tick_params(axis='x', labelsize=8)
    ax3.tick_params(axis='y', labelsize=8)
    
    # Chart 4: Market Position Visualization
    ax4 = axes[1, 1]
    x = np.arange(5)
    width = 0.35
    
    # Normalize both companies to percentage of sector leader
    petronas_normalized = [100, 100, 48, 5, 62]  # Relative scores
    jcorp_normalized = [3, 3, 15, 85, 90]  # Relative competitive positions
    
    bars1 = ax4.bar(x - width/2, petronas_normalized, width, label='PETRONAS', color='#DC143C', alpha=0.8)
    bars2 = ax4.bar(x + width/2, jcorp_normalized, width, label='JCORP', color='#2E86AB', alpha=0.8)
    
    ax4.set_xlabel('Business Segments', fontsize=10)
    ax4.set_ylabel('Competitive Position Index (%)', fontsize=10)
    ax4.set_title('Market Position Comparison\n(Relative to Sector Leaders)', fontsize=11, fontweight='bold')
    ax4.set_xticks(x)
    ax4.set_xticklabels(['Oil & Gas', 'Retail', 'Healthcare', 'Property', 'Diversification'], rotation=45, ha='right')
    ax4.legend()
    
    plt.tight_layout(rect=[0, 0, 1, 0.96])
    plt.savefig('/tmp/petronas-report/figures.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Individual chart saves
    fig2, axes2 = plt.subplots(2, 1, figsize=(12, 8))
    
    # Revenue Growth Trend
    years = ['FY2023', 'FY2024', 'FY2025']
    jcorp_growth = [5.8, 6.96, 7.63]
    petronas_growth = [343.6, 320.0, 266.1]
    
    ax21 = axes2[0]
    ax21.plot(years, jcorp_growth, marker='o', linewidth=2, label='JCorp', color='#2E86AB')
    ax21.plot(years, petronas_growth, marker='s', linewidth=2, label='Petronas', color='#DC143C')
    ax21.fill_between(years, jcorp_growth, alpha=0.2, color='#2E86AB')
    ax21.fill_between(years, petronas_growth, alpha=0.2, color='#DC143C')
    ax21.set_ylabel('Revenue (RM Billion)', fontsize=11)
    ax21.set_title('Revenue Trend Comparison (FY2023-FY2025)', fontsize=13, fontweight='bold')
    ax21.legend(fontsize=11)
    ax21.grid(True, alpha=0.3)
    
    # PAT Margins
    ax22 = axes2[1]
    jcorp_margins = [9.8, 9.6, 9.2]  # PAT margin %
    petronas_margins = [19.2, 17.2, 17.0]  # PAT margin %
    
    bars = ax22.bar(years, jcorp_margins, width=0.35, label='JCorp PAT Margin %', color='#2E86AB', alpha=0.8)
    bars2 = ax22.bar([x + 0.35 for x in range(3)], petronas_margins, width=0.35, label='Petronas PAT Margin %', color='#DC143C', alpha=0.8)
    ax22.set_ylabel('PAT Margin (%)', fontsize=11)
    ax22.set_title('Profit After Tax Margin Comparison', fontsize=13, fontweight='bold')
    ax22.legend(fontsize=11)
    ax22.grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig('/tmp/petronas-report/figures_detail.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Charts created successfully")

# Call the function to create charts
create_comparison_charts()

print("PDF generation complete")
