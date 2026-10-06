// AUTO-GENERATED from /root/web-canon/canon/navigation.json (generate-nav-canon.cjs)
// DERIVED — never hand-edit. Edit canon, regenerate.
// F2: this file must match canon exactly. Drift = entropy.
// canon version: 7.3.0 · as_of: 2026-10-03 · trinity: DRAFT_FUTURE

export interface NavItem {
  label: string;
  href: string;
  mode?: 'spa' | 'static' | 'external';
  external?: boolean;
  /** Optional note — render-only, not navigation */
  note?: string;
}

export const brand = {
  "label": "ARIF FAZIL",
  "href": "/",
  "creed": "Forged, not given."
} as const;

export const primaryNav: NavItem[] = [
  {
    "label": "Explore",
    "href": "/earth/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Read",
    "href": "/words/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Build",
    "href": "/work/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Evidence",
    "href": "/999/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "About",
    "href": "/institution/",
    "mode": "spa",
    "external": false
  }
];

export const secondaryNav: NavItem[] = [
  {
    "label": "Pilot",
    "href": "/pilot/",
    "mode": "static",
    "external": false,
    "note": "Commercial offer surface — 4-week design-partner pilot."
  },
  {
    "label": "Origin",
    "href": "/000/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Map",
    "href": "/map/",
    "mode": "static",
    "external": false
  },
  {
    "label": "World",
    "href": "/world/",
    "mode": "spa",
    "external": false,
    "note": "Frontier AI, geopolitics & civic intelligence (parent of /world/makcikgpt, /world/politics). F13 binary 2026-10-06: surface World parent in footer nav, not in primary 5-slot journey (preserves Explore·Read·Build·Evidence·About)."
  },
  {
    "label": "PETRONAS",
    "href": "/propa/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Malaysia",
    "href": "/malaysia/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Politics",
    "href": "/politics/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Signal",
    "href": "/connect/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Organs",
    "href": "/organs/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Institution",
    "href": "/institution/",
    "mode": "static",
    "external": false,
    "note": "Briefing — live human engagement door"
  },
  {
    "label": "Vitals",
    "href": "/vitals/",
    "mode": "static",
    "external": false,
    "note": "PETRONAS in public numbers"
  },
  {
    "label": "Proof",
    "href": "/999/",
    "mode": "static",
    "external": false,
    "note": "Evidence snapshots — /999 proof"
  }
];

export const secondaryOrgansNav: NavItem[] = [
  {
    "label": "arifOS",
    "href": "/canon/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "A-FORGE",
    "href": "/forge/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "AAA",
    "href": "/machines/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "GEOX",
    "href": "https://geox.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WEALTH",
    "href": "https://wealth.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WELL",
    "href": "https://well.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "arifFlow",
    "href": "",
    "mode": "spa",
    "external": false,
    "note": "arifFlow is the metabolism/telemetry organ; the 7th strip entry. /pulse/ is intentionally 410 (F13 audit 2026-10-05). System status: see Evidence → /999/."
  }
];

export const machineNav: NavItem[] = [
  {
    "label": "llms.txt",
    "href": "/llms.txt",
    "mode": "spa",
    "external": false
  },
  {
    "label": "missions.json",
    "href": "/missions.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "surfaces.json",
    "href": "/surfaces.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "webmcp",
    "href": "/.well-known/webmcp.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "mcp",
    "href": "https://mcp.arif-fazil.com/mcp",
    "mode": "external",
    "external": true
  },
  {
    "label": "did",
    "href": "/.well-known/did.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "arifOS",
    "href": "/canon/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "GEOX",
    "href": "https://geox.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WEALTH",
    "href": "https://wealth.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WELL",
    "href": "https://well.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "Agent contract",
    "href": "/human",
    "mode": "static",
    "external": false,
    "note": "Start here for agents"
  }
];

/** Trinity is DRAFT — do not render on public shell until status === LIVE */
export const trinityStatus = "DRAFT_FUTURE" as const;
