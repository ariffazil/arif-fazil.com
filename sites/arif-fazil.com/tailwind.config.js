/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "#1f2733",
        input: "#11151c",
        ring: "#31c48d",
        background: "#0a0c10",
        foreground: "#e6edf3",

        // FORGE Palette (Zen Sovereign — graphite base, muted bronze accent)
        // Token NAMES unchanged; values aligned to /_shared/tokens.css canon.
        forge: {
          black: "#0a0c10",  // graphite base
          steel: "#11151c",  // surface
          iron: "#1f2733",   // hairline
          dim: "#8b98a8",    // warm-gray ink, secondary
          white: "#e6edf3",  // warm-gray ink, primary
          orange: "#b08d57", // editorial bronze (world family accent — was #FF4500)
          gold: "#c9a84c",   // muted gold (quotes / gold family)
          green: "#31c48d",  // STATUS ONLY — seal/live (was phosphor #00FF41)
          red: "#f0506e",    // STATUS ONLY — void/hazard (was #FF003C)
        },

        // Arrow-of-Time palette (Kimi 2026-08-04 — DARK basalt unified with GEOX)
        paper: "#0A0B0D",
        "paper-dark": "#111318",
        ink: "#EDEAE2",
        "ink-soft": "#9AA0A8",
        ember: "#E4572E",
        gold: "#C9A227",
        earth: "#FF9F1C",
        ledger: "#1E6F50",
        brass: "#B08D3E",
        civic: "#C8102E",
        graphite: "#5C5546",
        cold: "#7DD3FC",
        obsidian: "#06090F",
        basalt: { 950: "#0A0B0D", 900: "#111318", 800: "#1A1E24" },
        strata: { 700: "#2A2F37" },
        magma: { 500: "#E8733B", 400: "#F09A62" },
        telemetry: { 300: "#7FE0A6", 400: "#5FD68A", 500: "#3BAF66", 600: "#2F9455", 950: "#0E2B1D" },
        bone: { 100: "#EDEAE2", 400: "#9AA0A8", 600: "#5C636C" },

        // PRIMER-1 canon bridge for Stitch components (sovereign 2026-11-04: canon wins)
        // `sky` is aliased wholesale to institution blue — stitch components are its
        // only consumer (verified grep 2026-11-04); amber/slate are NOT aliased
        // (used elsewhere in app) — stitch files use human/forge tokens instead.
        sky: {
          300: "#7FA8C9", 400: "#5F8FB3", 500: "#2E5F8A", 600: "#244C6E", 700: "#1D3E59", 900: "#16324A", 950: "#0F2436",
        },
        human: {
          200: "#EFD9A0", 300: "#E8C468", 400: "#D9A62E", 500: "#B8892B", 600: "#966F22",
        },
        sovereign: {
          300: "#DA8A80", 400: "#C24A3D", 500: "#B3362B", 600: "#8E2A22", 950: "#2A0F0C",
        },
        surface: {
          DEFAULT: "#11151c",
          "container-lowest": "#0a0c10",
          "container-low": "#111318",
          container: "#151a22",
          "container-high": "#1a212b",
          "container-highest": "#1f2733",
        },
        "on-surface": {
          DEFAULT: "#e6edf3",
          variant: "#8b98a8",
        },

        primary: {
          DEFAULT: "#e6edf3",
          foreground: "#0a0c10",
        },
        secondary: {
          DEFAULT: "#11151c",
          foreground: "#e6edf3",
        },
        muted: {
          DEFAULT: "#11151c",
          foreground: "#8b98a8",
        },
        accent: {
          DEFAULT: "#b08d57",
          foreground: "#0a0c10",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        header: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Newsreader"', 'Georgia', 'serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
        technical: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      // Stitch typography scale (PRIMER-1 skinned) — used as text-label-sm etc.
      fontSize: {
        'label-sm': ['0.625rem', { letterSpacing: '0.12em', fontWeight: '600' }],
        'label-md': ['0.6875rem', { letterSpacing: '0.1em', fontWeight: '600' }],
        'label-lg': ['0.75rem', { letterSpacing: '0.08em', fontWeight: '500' }],
        'telemetry-sm': ['0.625rem', { letterSpacing: '0.12em' }],
        'telemetry-md': ['0.75rem', { letterSpacing: '0.08em' }],
        'telemetry-lg': ['0.875rem', { letterSpacing: '0.05em' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5rem' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        'headline-lg': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.015em' }],
        'display-hero': ['3.5rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        canon: "2px",
      },
      boxShadow: {
        'brutalist': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'brutalist-hover': '0 8px 24px rgba(0, 0, 0, 0.35)',
        'glow-green': '0 0 6px rgba(49, 196, 141, 0.25)',
        'glow-orange': '0 0 6px rgba(176, 141, 87, 0.25)',
        'glow-institution': '0 0 24px -4px rgba(46, 95, 138, 0.25), 0 0 0 1px rgba(46, 95, 138, 0.4)',
        'glow-human': '0 0 24px -4px rgba(217, 166, 46, 0.25), 0 0 0 1px rgba(217, 166, 46, 0.4)',
        'glow-sovereign': '0 0 24px -4px rgba(179, 54, 43, 0.3), 0 0 0 1px rgba(179, 54, 43, 0.5)',
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
      },
      boxShadow: {
        'brutalist': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'brutalist-hover': '0 8px 24px rgba(0, 0, 0, 0.35)',
        'glow-green': '0 0 6px rgba(49, 196, 141, 0.25)',
        'glow-orange': '0 0 6px rgba(176, 141, 87, 0.25)',
      },
      // scanline / flicker / glitch keyframes retired (Zen Sovereign, 2026-07-26) —
      // no component referenced them; the CRT overlay on .site-shell was removed.
    },
  },
  plugins: [require("tailwindcss-animate")],
}
