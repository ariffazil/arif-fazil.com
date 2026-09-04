import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  type IntelHotspot,
  type LiveQuake,
  WORLD_INTEL_NODES,
  TACTICAL_VECTORS,
  fetchLiveUSGSQuakes,
} from '@/data/worldIntelData';

interface PalantirWorldIntelMapProps {
  selectedNode: IntelHotspot;
  onSelectNode: (node: IntelHotspot) => void;
}

export function PalantirWorldIntelMap({
  selectedNode,
  onSelectNode,
}: PalantirWorldIntelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vectorsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const quakesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite'>('dark');
  const [liveQuakes, setLiveQuakes] = useState<LiveQuake[]>([]);
  const [showVectors, setShowVectors] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Fetch live USGS earthquakes on mount
  useEffect(() => {
    let mounted = true;
    fetchLiveUSGSQuakes().then((data) => {
      if (mounted) setLiveQuakes(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedNode.lat || 18.0, selectedNode.lng || 85.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    // Custom bottom-right zoom controls
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Default Esri World Dark Gray Base (clean, unwatermarked tactical basemap)
    const tileLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 19,
        attribution: '&copy; Esri',
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups for clean toggling
    const vectorsGroup = L.layerGroup().addTo(map);
    const quakesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    vectorsLayerGroupRef.current = vectorsGroup;
    quakesLayerGroupRef.current = quakesGroup;
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when user toggles dark vs satellite
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let subdomains: string | string[] = 'abc';

    if (mapLayer === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
    }

    const newTileLayer = L.tileLayer(newUrl, {
      subdomains,
      maxNativeZoom: mapLayer === 'satellite' ? 18 : 16,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Keep tiles beneath markers
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // Render Tactical Vector Lines (Trade Routes & Subsea Cables)
  useEffect(() => {
    if (!vectorsLayerGroupRef.current) return;
    vectorsLayerGroupRef.current.clearLayers();

    if (!showVectors) return;

    TACTICAL_VECTORS.forEach((vec) => {
      const poly = L.polyline(vec.coords, {
        color: vec.color,
        weight: vec.category === 'SubseaCable' ? 2.5 : 2,
        dashArray: vec.dashArray || (vec.category === 'Energy' ? undefined : '6, 6'),
        opacity: 0.75,
      });

      poly.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; padding: 2px 4px; color: ${vec.color}; background: #0A0C10; border: 1px solid #1F2733; border-radius: 4px;">
          ${vec.name}
        </div>`,
        { sticky: true, className: 'palantir-map-tooltip' }
      );

      poly.addTo(vectorsLayerGroupRef.current!);
    });
  }, [showVectors]);

  // Render Live USGS Earthquakes
  useEffect(() => {
    if (!quakesLayerGroupRef.current) return;
    quakesLayerGroupRef.current.clearLayers();

    if (!showQuakes || liveQuakes.length === 0) return;

    liveQuakes.forEach((q) => {
      const radius = Math.max(6, (q.mag - 2) * 5);
      const circle = L.circleMarker([q.lat, q.lng], {
        radius,
        color: q.mag >= 5.0 ? '#FF3B3B' : '#FF9F1C',
        fillColor: q.mag >= 5.0 ? '#FF3B3B' : '#FF9F1C',
        fillOpacity: 0.35,
        weight: 1.5,
      });

      circle.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; padding: 4px; color: #EDEAE2; background: #0A0C10; border: 1px solid #FF9F1C; border-radius: 4px;">
          <strong style="color: #FF9F1C;">M${q.mag.toFixed(1)} EARTHQUAKE</strong><br/>
          <span>${q.place}</span><br/>
          <span style="color: #8E95A5; font-size: 10px;">Depth: ${q.depthKm} km · USGS Live</span>
        </div>`,
        { sticky: true, className: 'palantir-map-tooltip' }
      );

      circle.addTo(quakesLayerGroupRef.current!);
    });
  }, [showQuakes, liveQuakes]);

  // Render Palantir Intelligence Markers
  useEffect(() => {
    if (!markersLayerGroupRef.current) return;
    markersLayerGroupRef.current.clearLayers();

    const filteredNodes = WORLD_INTEL_NODES.filter((node) => {
      if (selectedCategory !== 'ALL' && node.category !== selectedCategory) return false;
      return true;
    });

    filteredNodes.forEach((node) => {
      const isSelected = selectedNode.id === node.id;

      let color = '#00E5FF'; // Cyan for Maritime
      let glyph = '⚓';
      if (node.category === 'Energy') {
        color = '#FF9F1C'; // Amber
        glyph = '⚡';
      } else if (node.category === 'Military') {
        color = '#FF3B3B'; // Red
        glyph = '🛡️';
      } else if (node.category === 'Cyber') {
        color = '#2DD4BF'; // Teal
        glyph = '🌐';
      } else if (node.category === 'Capital') {
        color = '#F0B840'; // Gold
        glyph = '🏛️';
      } else if (node.category === 'Strategic') {
        color = '#A78BFA'; // Purple
        glyph = '🛰️';
      }

      const iconHtml = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: ${isSelected ? '36px' : '26px'}; height: ${isSelected ? '36px' : '26px'}; border-radius: 50%; background: ${color}; opacity: ${isSelected ? '0.45' : '0.2'}; animation: ${isSelected ? 'pulse 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};"></div>
          <div style="position: absolute; width: ${isSelected ? '24px' : '18px'}; height: ${isSelected ? '24px' : '18px'}; border-radius: 50%; border: 1.5px solid ${color}; background: #0A0C10; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color};">
            <span style="font-size: ${isSelected ? '11px' : '9px'}; line-height: 1;">${glyph}</span>
          </div>
          ${isSelected ? `<div style="position: absolute; bottom: -14px; white-space: nowrap; font-family: monospace; font-size: 9px; font-weight: 700; color: #FFF; background: #11151C; padding: 1px 5px; border-radius: 3px; border: 1px solid ${color};">${node.name.slice(0, 16)}...</div>` : ''}
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'palantir-intel-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([node.lat, node.lng], { icon: markerIcon });

      marker.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; padding: 4px 6px; color: #EDEAE2; background: #0A0C10; border: 1px solid ${color}; border-radius: 4px;">
          <span style="color: ${color}; font-weight: 700;">[${node.category.toUpperCase()}]</span> ${node.name}<br/>
          <span style="color: #8E95A5; font-size: 10px;">${node.metric}</span>
        </div>`,
        { sticky: true, className: 'palantir-map-tooltip' }
      );

      marker.on('click', () => {
        onSelectNode(node);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([node.lat, node.lng], node.zoom || 6, {
            duration: 1.2,
          });
        }
      });

      marker.addTo(markersLayerGroupRef.current!);
    });
  }, [selectedCategory, selectedNode, onSelectNode]);

  const handleResetWorldView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([18.0, 85.0], 3, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] rounded-2xl overflow-hidden border border-[#1F2733] bg-[#0A0C10] shadow-2xl">
      {/* ── MAP CONTAINER ── */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* ── TOP HUD GLASS BAR OVER MAP ── */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Category Filters (Pointer Events Enabled) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-[#00E5FF]/20 bg-[#0A0C10]/85 backdrop-blur-md pointer-events-auto">
          {[
            { id: 'ALL', label: 'All Sensors', count: WORLD_INTEL_NODES.length },
            { id: 'Maritime', label: '⚓ Maritime', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Maritime').length },
            { id: 'Energy', label: '⚡ Energy', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Energy').length },
            { id: 'Military', label: '🛡️ Military', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Military').length },
            { id: 'Cyber', label: '🌐 Cyber/Compute', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Cyber').length },
            { id: 'Capital', label: '🏛️ Gold/Vaults', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Capital').length },
            { id: 'Strategic', label: '🛰️ Strategic', count: WORLD_INTEL_NODES.filter((n) => n.category === 'Strategic').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 font-bold'
                  : 'text-[#8E95A5] hover:text-white hover:bg-[#1A2230]'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Tactical Layer & Tile Switchers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Subsea & Trade Corridors Toggle */}
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`font-mono text-[10px] px-2.5 py-1.5 rounded border transition-all ${
              showVectors
                ? 'border-[#2DD4BF]/40 bg-[#0A0C10]/85 text-[#2DD4BF] font-semibold'
                : 'border-[#1F2733] bg-[#0A0C10]/70 text-[#8E95A5]'
            }`}
          >
            {showVectors ? '✓ Corridors ON' : 'Corridors OFF'}
          </button>

          {/* Earthquakes Toggle */}
          <button
            onClick={() => setShowQuakes(!showQuakes)}
            className={`font-mono text-[10px] px-2.5 py-1.5 rounded border transition-all ${
              showQuakes
                ? 'border-[#FF9F1C]/40 bg-[#0A0C10]/85 text-[#FF9F1C] font-semibold'
                : 'border-[#1F2733] bg-[#0A0C10]/70 text-[#8E95A5]'
            }`}
          >
            {showQuakes ? `🌋 USGS (${liveQuakes.length})` : '🌋 USGS OFF'}
          </button>

          {/* Tile Layer: Dark vs Satellite */}
          <div className="flex rounded border border-[#1F2733] bg-[#0A0C10]/85 p-0.5 font-mono text-[10px]">
            <button
              onClick={() => setMapLayer('dark')}
              className={`px-2 py-1 rounded transition-colors ${
                mapLayer === 'dark' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'text-[#8E95A5]'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2 py-1 rounded transition-colors ${
                mapLayer === 'satellite' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'text-[#8E95A5]'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Reset Global Extent */}
          <button
            onClick={handleResetWorldView}
            title="Reset to global view"
            className="p-1.5 rounded border border-[#1F2733] bg-[#0A0C10]/85 text-[#8E95A5] hover:text-white transition-colors"
          >
            🌍
          </button>
        </div>
      </div>

      {/* ── BOTTOM TACTICAL STATUS STRIP ── */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 p-2 rounded-lg border border-[#1F2733] bg-[#0A0C10]/90 backdrop-blur-md font-mono text-[10px] text-[#8E95A5] pointer-events-auto">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
          <span>PALANTIR GIS CORE</span>
        </span>
        <span>·</span>
        <span className="text-white font-semibold">
          TARGET: {selectedNode.name}
        </span>
        <span>·</span>
        <span className="text-[#00E5FF]">
          [{selectedNode.lat.toFixed(2)}°N, {selectedNode.lng.toFixed(2)}°E]
        </span>
      </div>
    </div>
  );
}
