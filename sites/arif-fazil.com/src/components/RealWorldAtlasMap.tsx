import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface HotspotLocation {
  id: string;
  name: string;
  region: string;
  category: 'Maritime' | 'Energy' | 'Capital' | 'Geopolitics';
  lat: number;
  lng: number;
  zoom?: number;
  metric: string;
  headline: string;
  analysis: string;
  status: 'SEAL' | 'SABAR' | 'HOLD';
  route?: string;
}

export const REAL_HOTSPOTS: HotspotLocation[] = [
  {
    id: 'malacca',
    name: 'Strait of Malacca & Singapore',
    region: 'Southeast Asia / Malaysia',
    category: 'Maritime',
    lat: 2.45,
    lng: 101.85,
    zoom: 7,
    metric: '90,000+ vessels / 16M bbl/d',
    headline: 'The World’s Most Critical Maritime Chokepoint',
    analysis: 'Over 25% of global traded crude and 30% of global seaborne merchandise passes through this 2.8km channel. Sovereign positioning here dictates global supply chain resilience.',
    status: 'SEAL',
    route: '/earth',
  },
  {
    id: 'sarawak',
    name: 'Central Luconia & Bintulu LNG',
    region: 'Sarawak Offshore, South China Sea',
    category: 'Energy',
    lat: 4.85,
    lng: 112.65,
    zoom: 7,
    metric: '1.2B SCF/d gas · Train 9',
    headline: 'Sarawak Sovereign Gas & SEARAH Aggregation',
    analysis: 'High CO2 gas carbonate build-ups combined with world-class MLNG Bintulu export infrastructure. The constitutional battleground for federal-state resource sovereignty.',
    status: 'SEAL',
    route: '/world/makcikgpt',
  },
  {
    id: 'malay-basin',
    name: 'Malay Basin (PM-304 & PM-3)',
    region: 'Offshore Terengganu',
    category: 'Energy',
    lat: 5.60,
    lng: 104.85,
    zoom: 7,
    metric: '13-Year Lineage · Low-Res Pay',
    headline: 'Bekantan & Mature Field Oil Rejuvenation',
    analysis: 'Low-resistivity low-contrast pay discoveries. Proving commercial hydrocarbon flow where traditional petrophysical models said the reservoir was wet.',
    status: 'SEAL',
    route: '/work',
  },
  {
    id: 'sabah-deep',
    name: 'Sabah Deepwater (Gumusut-Kakap)',
    region: 'Offshore Sabah / Borneo',
    category: 'Energy',
    lat: 5.82,
    lng: 114.35,
    zoom: 7,
    metric: '3,000m+ Water Depth Turbidites',
    headline: 'Deepwater Turbidite Channel Engineering',
    analysis: 'Complex slope-channel turbidite systems requiring high-pressure seismic inversion, continuous 4D monitoring, and automated drilling safety envelopes.',
    status: 'SEAL',
    route: '/earth',
  },
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    region: 'Persian Gulf / Middle East',
    category: 'Maritime',
    lat: 26.56,
    lng: 56.25,
    zoom: 6,
    metric: '21M bbl/day crude flow',
    headline: 'Global Energy Arterial Pressure Gauge',
    analysis: 'Primary choke point for Persian Gulf crude. Geopolitical friction here triggers instantaneous risk premia across Brent benchmark pricing and VLCC insurance.',
    status: 'HOLD',
    route: '/oil',
  },
  {
    id: 'redsea',
    name: 'Bab el-Mandeb & Red Sea',
    region: 'Horn of Africa / Yemen',
    category: 'Geopolitics',
    lat: 12.58,
    lng: 43.33,
    zoom: 6,
    metric: '12% Global Trade Diverted',
    headline: 'Asymmetric Maritime Denial Theater',
    analysis: 'Drone and anti-ship missile interdiction forcing Cape of Good Hope rerouting, adding 10-14 days transit time and massive bunker fuel burn.',
    status: 'HOLD',
    route: '/oil',
  },
  {
    id: 'london-vault',
    name: 'London Physical Gold Vaults',
    region: 'Bank of England / LBMA',
    category: 'Capital',
    lat: 51.51,
    lng: -0.09,
    zoom: 6,
    metric: '8,500 Tonnes Physical Bullion',
    headline: 'Physical Settlement vs Paper COMEX Claims',
    analysis: 'Physical sovereign bar withdrawals outstripping fractional paper derivatives. Sovereign nations repatriating unencumbered gold reserves.',
    status: 'SEAL',
    route: '/gold',
  },
  {
    id: 'zurich',
    name: 'Zurich Hard Asset Duty-Free Vaults',
    region: 'Switzerland',
    category: 'Capital',
    lat: 47.37,
    lng: 8.54,
    zoom: 6,
    metric: 'Neutral Sovereign Custody',
    headline: 'Alpine Capital Sanctuary & Settlement',
    analysis: 'Neutral jurisdictions seeing increased custodial allocation from non-Western central banks avoiding dollar weaponization.',
    status: 'SEAL',
    route: '/gold',
  },
  {
    id: 'permian',
    name: 'Permian Basin (Midland / Delaware)',
    region: 'Texas & New Mexico, USA',
    category: 'Energy',
    lat: 31.85,
    lng: -102.35,
    zoom: 6,
    metric: '6.2M bbl/d Marginal Supply',
    headline: 'Global Marginal Hydrocarbon Anchor',
    analysis: 'The primary non-OPEC swing producer. Parent-child well degradation and tier-1 acreage exhaustion setting the global oil price floor.',
    status: 'SEAL',
    route: '/oil',
  },
  {
    id: 'tokyo-hub',
    name: 'Tokyo Bay & Pacific LNG Import Hub',
    region: 'East Asia',
    category: 'Energy',
    lat: 35.50,
    lng: 139.75,
    zoom: 6,
    metric: 'World’s Largest LNG Buyer Cluster',
    headline: 'Pacific LNG Demand & Industrial Anchor',
    analysis: 'Essential sink for Malaysian (Bintulu) and Australian LNG volumes, anchoring long-term oil-indexed contracts.',
    status: 'SEAL',
    route: '/gas',
  },
];

// Major Maritime Trade Lines
const TRADE_ROUTES: [number, number][][] = [
  // Hormuz to Malacca (Energy Artery)
  [
    [26.56, 56.25], // Hormuz
    [20.0, 65.0],
    [10.0, 75.0],
    [5.9, 80.5],   // South Sri Lanka
    [5.5, 95.0],   // North Sumatra
    [2.45, 101.85] // Malacca
  ],
  // Malacca to East Asia
  [
    [2.45, 101.85], // Malacca
    [1.3, 104.0],   // Singapore
    [4.85, 112.65], // Sarawak
    [12.0, 115.0],  // South China Sea
    [22.0, 120.0],  // Luzon Strait
    [35.50, 139.75] // Tokyo
  ],
  // Bab el-Mandeb to Hormuz / India
  [
    [12.58, 43.33], // Bab el-Mandeb
    [14.5, 52.0],   // Gulf of Aden
    [20.0, 65.0]
  ]
];

interface RealWorldAtlasMapProps {
  selectedHotspot: HotspotLocation;
  onSelectHotspot: (hotspot: HotspotLocation) => void;
}

export function RealWorldAtlasMap({ selectedHotspot, onSelectHotspot }: RealWorldAtlasMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite' | 'street'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [18.0, 85.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    // Custom Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer: Esri World Dark Gray Base
    const tileLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add Trade Route Polylines
    TRADE_ROUTES.forEach((route) => {
      L.polyline(route, {
        color: '#E27D60',
        weight: 2,
        dashArray: '6, 6',
        opacity: 0.75,
      }).addTo(map);
    });

    // Create custom Pulse Markers for each Hotspot
    REAL_HOTSPOTS.forEach((spot) => {
      const pulseColor = spot.category === 'Maritime' ? '#38BDF8' : spot.category === 'Energy' ? '#E27D60' : '#F59E0B';

      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${pulseColor}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${pulseColor}; border: 2px solid #FFFFFF; box-shadow: 0 0 10px ${pulseColor};"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

      // Popup on Marker
      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 12px; color: #111; padding: 4px;">
          <strong style="font-size: 13px; color: #000;">${spot.name}</strong><br/>
          <span style="color: #666;">${spot.region}</span><br/>
          <span style="color: #D97706; font-weight: bold;">${spot.metric}</span>
        </div>
      `);

      marker.on('click', () => {
        onSelectHotspot(spot);
      });

      markersRef.current[spot.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when layer switch changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let attribution = '';

    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapLayer === 'street') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    const newTile = L.tileLayer(url, { maxNativeZoom: mapLayer === 'satellite' ? 18 : 16, maxZoom: 19, attribution }).addTo(map);
    tileLayerRef.current = newTile;
  }, [mapLayer]);

  // Pan to selected hotspot when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([selectedHotspot.lat, selectedHotspot.lng], selectedHotspot.zoom || 6, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    const marker = markersRef.current[selectedHotspot.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedHotspot]);

  return (
    <div className="relative w-full rounded-2xl border border-[#222733] bg-[#0A0B0D] overflow-hidden shadow-2xl">
      {/* Top Map HUD Control Header */}
      <div className="p-4 border-b border-[#222733] bg-[#0E1117]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ECCA3] opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ECCA3]"></span>
          </span>
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              REAL GIS CARTOGRAPHY · arifOS SPATIAL ATLAS
            </h3>
            <p className="font-mono text-[10px] text-[#8E95A5]">
              Leaflet CartoDB & Esri Satellite · Geodesic Hydrocarbon & Maritime Chokepoint Engine
            </p>
          </div>
        </div>

        {/* Map Layer Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[#2B3242] bg-[#141822] p-1 font-mono text-[11px]">
          <button
            onClick={() => setMapLayer('dark')}
            className={`rounded px-2.5 py-1 uppercase tracking-wider transition-all ${
              mapLayer === 'dark'
                ? 'bg-[#E27D60] text-[#0A0B0D] font-bold shadow'
                : 'text-[#8E95A5] hover:text-white'
            }`}
          >
            🌑 Dark GIS
          </button>
          <button
            onClick={() => setMapLayer('satellite')}
            className={`rounded px-2.5 py-1 uppercase tracking-wider transition-all ${
              mapLayer === 'satellite'
                ? 'bg-[#E27D60] text-[#0A0B0D] font-bold shadow'
                : 'text-[#8E95A5] hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapLayer('street')}
            className={`rounded px-2.5 py-1 uppercase tracking-wider transition-all ${
              mapLayer === 'street'
                ? 'bg-[#E27D60] text-[#0A0B0D] font-bold shadow'
                : 'text-[#8E95A5] hover:text-white'
            }`}
          >
            🗺️ OpenStreet
          </button>
        </div>
      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[520px] lg:h-[600px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Bottom Map Legend */}
      <div className="p-3 bg-[#0E1117] border-t border-[#222733] flex flex-wrap items-center justify-between text-xs font-mono text-[#8E95A5] gap-4">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] inline-block shadow-[0_0_6px_#38BDF8]"></span>
            <span>Maritime Chokepoints</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E27D60] inline-block shadow-[0_0_6px_#E27D60]"></span>
            <span>Gas & Oil Basins</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block shadow-[0_0_6px_#F59E0B]"></span>
            <span>Physical Gold & Sovereign Vaults</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#E27D60]">
            <span className="w-4 border-b border-dashed border-[#E27D60] inline-block"></span>
            <span>Global Energy Route</span>
          </span>
        </div>

        <div className="text-[11px] text-[#556075]">
          Leaflet GIS Engine · WGS84 Geodesic Coordinates · F1 Truth
        </div>
      </div>
    </div>
  );
}
