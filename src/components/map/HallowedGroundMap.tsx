'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';

import SoldierList from './SoldierList';
import StatsBar from './StatsBar';
import RecordPanel from './RecordPanel';
import MapControls from './MapControls';
import OnThisDay from './OnThisDay';

import { getSoldiersInViewport } from '@/lib/soldiers';
import type { MapFilters, Soldier, SoldierGeoFeature, WarEra } from '@/types/soldier';

// CARTO basemaps — free, no API key, no usage limits, CC BY 3.0
const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DARK_STYLE  = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const ERA_CENTERS: Record<WarEra | 'all', [number, number]> = {
  vietnam:     [106.6, 16.5],
  wwii:        [13.4,  48.2],
  wwi:         [4.8,   50.5],
  korea:       [127.8, 37.5],
  gulf:        [47.5,  29.3],
  iraq:        [43.7,  33.3],
  afghanistan: [67.7,  33.9],
  iran:        [53.7,  32.4],
  all:         [20.0,  30.0],
};

const ERA_ZOOM: Record<WarEra | 'all', number> = {
  vietnam: 5, wwii: 4, wwi: 5, korea: 6,
  gulf: 5, iraq: 6, afghanistan: 6, iran: 6, all: 3,
};

const ERAS: { value: WarEra | 'all'; label: string; active: boolean }[] = [
  { value: 'all',         label: 'All Eras',     active: true  },
  { value: 'wwi',         label: 'WWI',          active: false },
  { value: 'wwii',        label: 'WWII',         active: false },
  { value: 'korea',       label: 'Korea',        active: false },
  { value: 'vietnam',     label: 'Vietnam',      active: true  },
  { value: 'gulf',        label: 'Gulf War',     active: false },
  { value: 'iraq',        label: 'Iraq',         active: false },
  { value: 'afghanistan', label: 'Afghanistan',  active: false },
  { value: 'iran',        label: 'Iran',         active: false },
];

const DEFAULT_FILTERS: MapFilters = {
  era:    'vietnam',
  branch: 'all',
  status: 'all',
  search: '',
};

export default function HallowedGroundMap() {
  const mapContainer    = useRef<HTMLDivElement>(null);
  const map             = useRef<maplibregl.Map | null>(null);
  const markerObjs      = useRef<maplibregl.Marker[]>([]);
  const markerElements  = useRef<Map<string, HTMLElement>>(new Map());
  // Ref so map event listeners always call the latest loadMarkers (avoids stale closure)
  const loadMarkersRef  = useRef<() => void>(() => {});

  const [filters,         setFilters]        = useState<MapFilters>(DEFAULT_FILTERS);
  const [soldiers,        setSoldiers]        = useState<Soldier[]>([]);
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [selectedIndex,   setSelectedIndex]   = useState<number>(-1);
  const [loading,         setLoading]         = useState(false);
  const [isDark,          setIsDark]          = useState(false);

  // ── Map init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container:          mapContainer.current,
      style:              LIGHT_STYLE,
      center:             ERA_CENTERS[DEFAULT_FILTERS.era],
      zoom:               ERA_ZOOM[DEFAULT_FILTERS.era],
      minZoom:            2,
      maxZoom:            16,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.current.on('load',    () => loadMarkersRef.current());
    map.current.on('moveend', () => loadMarkersRef.current());

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ── Fly to region + reload on era/filter change ───────────────────────────
  useEffect(() => {
    if (!map.current?.loaded()) return;
    map.current.flyTo({
      center:   ERA_CENTERS[filters.era],
      zoom:     ERA_ZOOM[filters.era],
      duration: 1200,
    });
    loadMarkers();
  }, [filters]);

  // ── Co-primary sync: when selectedSoldier changes from ANY source ─────────
  useEffect(() => {
    if (!selectedSoldier) {
      markerElements.current.forEach((el) =>
        el.classList.remove('hallowed-marker--selected')
      );
      return;
    }

    // Highlight marker on map
    markerElements.current.forEach((el, id) => {
      el.classList.toggle('hallowed-marker--selected', id === selectedSoldier.id);
    });

    // Pan map to this soldier
    if (map.current) {
      map.current.easeTo({
        center:   [selectedSoldier.battle_lng, selectedSoldier.battle_lat],
        zoom:     Math.max(map.current.getZoom(), 9),
        duration: 600,
      });
    }

    // Scroll the list sidebar to the selected row
    document
      .getElementById(`soldier-row-${selectedSoldier.id}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // Sync index
    setSelectedIndex((prev) => {
      const idx = soldiers.findIndex((s) => s.id === selectedSoldier.id);
      return idx >= 0 ? idx : prev;
    });
  }, [selectedSoldier, soldiers]);

  // ── Clear markers ─────────────────────────────────────────────────────────
  const clearMarkers = () => {
    markerObjs.current.forEach((m) => m.remove());
    markerObjs.current = [];
    markerElements.current.clear();
  };

  // ── Load + render markers ──────────────────────────────────────────────────
  const loadMarkers = useCallback(async () => {
    if (!map.current) return;
    const bounds = map.current.getBounds();
    setLoading(true);

    try {
      const data = await getSoldiersInViewport(
        {
          minLng: bounds.getWest(),
          minLat: bounds.getSouth(),
          maxLng: bounds.getEast(),
          maxLat: bounds.getNorth(),
        },
        filters
      );

      setSoldiers(data);
      clearMarkers();

      const features: SoldierGeoFeature[] = data.map((s) => ({
        type:       'Feature',
        geometry:   { type: 'Point', coordinates: [s.battle_lng, s.battle_lat] },
        properties: s,
      }));

      const zoom = Math.floor(map.current.getZoom());
      const sc   = new Supercluster({ radius: 40, maxZoom: 14 });
      sc.load(features);

      const clustered = sc.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        zoom
      );

      clustered.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const el         = document.createElement('div');

        if (feature.properties.cluster) {
          const count  = feature.properties.point_count as number;
          el.className = 'hallowed-cluster';
          el.innerHTML = `<span>${count > 999 ? '999+' : count}</span>`;
          el.addEventListener('click', () => {
            map.current?.easeTo({ center: [lng, lat], zoom: zoom + 2 });
          });
        } else {
          const s      = feature.properties as Soldier;
          el.className = `hallowed-marker hallowed-marker--${s.status}`;
          // Restore selected visual if reloading after pan
          if (selectedSoldier?.id === s.id) {
            el.classList.add('hallowed-marker--selected');
          }
          el.addEventListener('click', () => setSelectedSoldier(s));
          markerElements.current.set(s.id, el);
        }

        const mk = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map.current!);
        markerObjs.current.push(mk);
      });
    } catch (err) {
      console.error('Failed to load markers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedSoldier]);

  // Keep ref in sync so map event listeners always call the latest version
  useEffect(() => { loadMarkersRef.current = loadMarkers; }, [loadMarkers]);

  // ── Record panel navigation ───────────────────────────────────────────────
  const handleNavigate = (dir: 1 | -1) => {
    if (!soldiers.length) return;
    const next = (selectedIndex + dir + soldiers.length) % soldiers.length;
    setSelectedSoldier(soldiers[next]);
    setSelectedIndex(next);
  };

  // ── Dark/light toggle ─────────────────────────────────────────────────────
  const handleToggleDark = () => {
    map.current?.setStyle(isDark ? LIGHT_STYLE : DARK_STYLE);
    setIsDark((d) => !d);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-paper">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-rule">

        {/* Masthead row */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-rule">
          <div className="flex items-center gap-4">
            <a href="/" className="font-headline font-black text-xl tracking-wide text-ink">
              Library of War
            </a>
            <div className="pl-4 border-l border-rule flex flex-col leading-none gap-0.5">
              <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-mist">
                Section
              </span>
              <span className="font-headline font-bold text-sm text-accent tracking-wide">
                The Fallen
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5">
            {['Articles', 'Series', 'Browse', 'Resources'].map((l) => (
              <a
                key={l}
                href={`/${l.toLowerCase()}`}
                className="text-[10px] tracking-[0.15em] uppercase font-mono text-mist hover:text-ink transition-colors"
              >
                {l}
              </a>
            ))}
            <span className="text-[10px] tracking-[0.15em] uppercase font-mono text-accent border-b border-accent pb-px">
              The Fallen
            </span>
            <a
              href="/contributor"
              className="text-[10px] tracking-[0.15em] uppercase font-mono text-ink border border-rule px-3 py-1 hover:border-ink transition-colors"
            >
              Contribute
            </a>
          </nav>
        </div>

        {/* Era pills + controls row */}
        <div className="flex items-center gap-1.5 px-6 py-1.5">
          {ERAS.map((e) => (
            <button
              key={e.value}
              onClick={() => e.active && setFilters((f) => ({ ...f, era: e.value }))}
              title={e.active ? undefined : 'Coming soon — no data yet'}
              className={`text-[9px] tracking-[0.12em] uppercase font-mono px-2.5 py-0.5 border transition-colors ${
                !e.active
                  ? 'border-rule/40 text-mist/30 cursor-not-allowed'
                  : filters.era === e.value
                  ? 'border-accent text-accent bg-ghost'
                  : 'border-rule text-mist hover:text-ink hover:border-ink'
              }`}
            >
              {e.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            {loading && (
              <span className="text-[9px] font-mono tracking-widest uppercase text-mist animate-pulse">
                Loading…
              </span>
            )}
            <span className="text-[9px] font-mono text-mist">
              {soldiers.length.toLocaleString()} records in view
            </span>
            <button
              onClick={handleToggleDark}
              className="text-[9px] font-mono text-mist border border-rule px-2 py-0.5 hover:border-ink hover:text-ink transition-colors"
            >
              {isDark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* ── 3-column body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Left — filters + list */}
        <SoldierList
          soldiers={soldiers}
          selectedSoldier={selectedSoldier}
          filters={filters}
          onFilterChange={setFilters}
          onSelect={setSelectedSoldier}
        />

        {/* Center — map + stats bar */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="relative flex-1 min-h-0">
            <div ref={mapContainer} className="absolute inset-0" />
            <MapControls map={map} isDark={isDark} onToggleDark={handleToggleDark} />
            <OnThisDay />
          </div>
          <StatsBar soldiers={soldiers} era={filters.era} />
        </div>

        {/* Right — service record */}
        <RecordPanel
          soldier={selectedSoldier}
          soldiers={soldiers}
          selectedIndex={selectedIndex}
          onNavigate={handleNavigate}
          onClose={() => setSelectedSoldier(null)}
        />

      </div>
    </div>
  );
}
