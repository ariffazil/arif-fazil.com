#!/usr/bin/env python3
import re

MALAYSIA_FILE = '/root/arif-fazil.com/sites/arif-fazil.com/public/wealth/malaysia/index.html'
PETRONAS_FILE = '/root/arif-fazil.com/sites/arif-fazil.com/public/wealth/petronas/index.html'

def fix_mojibake(content):
    replacements = [
        ('Â·', '·'),
        ('â‡„', '⇄'),
        ('â€”', '—'),
        ('â€“', '–'),
        ('â€™', "'"),
        ('â€œ', '"'),
        ('â€', '"'),
        ('Î”S â‰¤ 0', 'ΔS ≤ 0'),
        ('â‰¤', '≤'),
        ('â‰¥', '≥'),
    ]
    for old, new in replacements:
        content = content.replace(old, new)
    return content

# 1. Update Malaysia (Putrajaya)
with open(MALAYSIA_FILE, 'r', encoding='utf-8') as f:
    m_content = f.read()

m_content = fix_mojibake(m_content)

# Update navigation in header to include global links
old_m_nav_target = '<nav class="flex items-center gap-1 sm:gap-2 text-xs font-mono">'
new_m_nav = '''<nav class="flex items-center gap-1 sm:gap-2 text-xs font-mono">
        <a href="/" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Home</a>
        <a href="/earth" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Earth</a>
        <a href="/wealth/" class="px-2.5 py-1.5 rounded-lg text-gold font-semibold transition">Wealth</a>
        <a href="/world/petronas/shadow/" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Shadow</a>
        <a href="/map/" class="px-2.5 py-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 transition">Map</a>
        <a href="/llms.txt" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">llms.txt</a>
        <span class="text-slate-700">|</span>'''

if old_m_nav_target in m_content:
    m_content = m_content.replace(old_m_nav_target, new_m_nav, 1)

# Ensure breadcrumb in hero section
breadcrumb_malaysia = '''      <!-- Breadcrumb L0 > L1 > L2 -->
      <nav class="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-3" aria-label="Breadcrumb">
        <a href="/" class="hover:text-gold">L0 Home</a>
        <span class="text-slate-600">›</span>
        <a href="/wealth/" class="hover:text-gold">L1 Wealth Hub</a>
        <span class="text-slate-600">›</span>
        <span class="text-white font-semibold">L2 Putrajaya Sovereign Ledger</span>
      </nav>
'''
if '<!-- Breadcrumb L0 > L1 > L2 -->' not in m_content:
    m_content = m_content.replace('<div class="max-w-3xl mb-8">', '<div class="max-w-3xl mb-8">\n' + breadcrumb_malaysia, 1)

# Closed-loop footer for Malaysia
old_footer_malaysia_target = '<footer class="border-t border-slate-800/80 bg-panel/40 mt-12 py-8">'
new_footer_malaysia = '''<footer class="border-t border-slate-800/80 bg-panel/40 mt-12 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <!-- Closed Loop Navigation Bar -->
      <nav class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-slate-400" aria-label="Closed-Loop Navigation">
        <div class="flex flex-wrap items-center gap-4">
          <a href="/wealth/" class="hover:text-gold flex items-center gap-1">← Hub Wealth (/wealth/)</a>
          <a href="/petronas/" class="hover:text-gold flex items-center gap-1">⇄ Kembar Korporat: KLCC (/petronas/)</a>
          <a href="/map/" class="text-cyan-400 hover:underline flex items-center gap-1">🗺 Peta Sistem /map/</a>
          <a href="/world/petronas/shadow/" class="hover:text-rose-400 flex items-center gap-1">⇄ Kerusi Bayang (/shadow/)</a>
        </div>
        <a href="/llms.txt" class="hover:text-white">🤖 /llms.txt</a>
      </nav>'''

if old_footer_malaysia_target in m_content:
    m_content = m_content.replace(old_footer_malaysia_target, new_footer_malaysia, 1)

with open(MALAYSIA_FILE, 'w', encoding='utf-8') as f:
    f.write(m_content)

print(f"Updated Malaysia: {len(m_content)} bytes")

# 2. Update Petronas (KLCC)
with open(PETRONAS_FILE, 'r', encoding='utf-8') as f:
    p_content = f.read()

p_content = fix_mojibake(p_content)

old_p_nav_target = '<nav class="flex items-center gap-1 sm:gap-2 text-xs font-mono">'
new_p_nav = '''<nav class="flex items-center gap-1 sm:gap-2 text-xs font-mono">
        <a href="/" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Home</a>
        <a href="/earth" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Earth</a>
        <a href="/wealth/" class="px-2.5 py-1.5 rounded-lg text-gold font-semibold transition">Wealth</a>
        <a href="/world/petronas/shadow/" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">Shadow</a>
        <a href="/map/" class="px-2.5 py-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 transition">Map</a>
        <a href="/llms.txt" class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition">llms.txt</a>
        <span class="text-slate-700">|</span>'''

if old_p_nav_target in p_content:
    p_content = p_content.replace(old_p_nav_target, new_p_nav, 1)

# Ensure breadcrumb in hero section
breadcrumb_petronas = '''      <!-- Breadcrumb L0 > L1 > L2 -->
      <nav class="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-3" aria-label="Breadcrumb">
        <a href="/" class="hover:text-gold">L0 Home</a>
        <span class="text-slate-600">›</span>
        <a href="/wealth/" class="hover:text-gold">L1 Wealth Hub</a>
        <span class="text-slate-600">›</span>
        <span class="text-white font-semibold">L2 KLCC Hydrocarbon Engine</span>
      </nav>
'''
if '<!-- Breadcrumb L0 > L1 > L2 -->' not in p_content:
    p_content = p_content.replace('<div class="max-w-3xl mb-8">', '<div class="max-w-3xl mb-8">\n' + breadcrumb_petronas, 1)

# Closed-loop footer for Petronas
old_footer_petronas_target = '<footer class="border-t border-slate-800/80 bg-panel/40 mt-12 py-8">'
new_footer_petronas = '''<footer class="border-t border-slate-800/80 bg-panel/40 mt-12 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <!-- Closed Loop Navigation Bar -->
      <nav class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-slate-400" aria-label="Closed-Loop Navigation">
        <div class="flex flex-wrap items-center gap-4">
          <a href="/wealth/" class="hover:text-gold flex items-center gap-1">← Hub Wealth (/wealth/)</a>
          <a href="/wealth/malaysia/" class="hover:text-gold flex items-center gap-1">⇄ Kembar Fiskal: Putrajaya (/wealth/malaysia/)</a>
          <a href="/map/" class="text-cyan-400 hover:underline flex items-center gap-1">🗺 Peta Sistem /map/</a>
          <a href="/world/petronas/shadow/tengku-muhammad-taufik/" class="hover:text-rose-400 flex items-center gap-1">⇄ 33 Bayang TMT (/shadow/tengku-muhammad-taufik/)</a>
        </div>
        <a href="/llms.txt" class="hover:text-white">🤖 /llms.txt</a>
      </nav>'''

if old_footer_petronas_target in p_content:
    p_content = p_content.replace(old_footer_petronas_target, new_footer_petronas, 1)

with open(PETRONAS_FILE, 'w', encoding='utf-8') as f:
    f.write(p_content)

print(f"Updated Petronas: {len(p_content)} bytes")
