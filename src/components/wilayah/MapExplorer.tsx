"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Map, List } from "lucide-react";
import { jemaatData, Jemaat } from "@/data/jemaat";
import { JemaatWithDistance } from "@/lib/haversine";
import ChurchListPanel from "./ChurchListPanel";
import ChurchDetailPanel from "./ChurchDetailPanel";
import NearestChurchFinder from "./NearestChurchFinder";

// Dynamic import — Leaflet requires browser APIs, must disable SSR
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background/80">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-text-secondary">Memuat peta…</p>
      </div>
    </div>
  ),
});

type MobileTab = "map" | "list";

export default function MapExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State ────────────────────────────────────────────────────────────────────
  const [selectedJemaat, setSelectedJemaat] = useState<Jemaat | null>(null);
  const [nearestChurches, setNearestChurches] = useState<JemaatWithDistance[]>([]);
  const [isNearestMode, setIsNearestMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeCity, setActiveCity] = useState<string | null>(searchParams.get("city"));

  // Extract unique cities for filter chips
  const availableCities = useMemo(() => {
    const cities = new Set(jemaatData.map((j) => j.kota));
    return Array.from(cities).sort();
  }, []);

  // Compute filtered list
  const filteredChurches = useMemo(() => {
    let result = jemaatData;
    
    if (activeCity) {
      result = result.filter((j) => j.kota === activeCity);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.nama.toLowerCase().includes(q) ||
          j.kota.toLowerCase().includes(q) ||
          j.pendeta.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [searchQuery, activeCity]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCity) params.set("city", activeCity);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, activeCity, router]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSelectChurch = useCallback((jemaat: Jemaat) => {
    setSelectedJemaat(jemaat);
    setFlyTo({ lat: jemaat.lat, lng: jemaat.lng, zoom: 14 });
    // On mobile, switch to map when selecting from list
    setMobileTab("map");
  }, []);

  const handleNearestResult = useCallback(
    (results: JemaatWithDistance[], location: { lat: number; lng: number }) => {
      setNearestChurches(results);
      setIsNearestMode(true);
      setUserLocation(location);
      setFlyTo({ lat: location.lat, lng: location.lng, zoom: 10 });
      // Auto-select the closest one
      if (results.length > 0) {
        setSelectedJemaat(results[0]);
      }
      setMobileTab("map");
    },
    []
  );

  const handleResetNearest = useCallback(() => {
    setIsNearestMode(false);
    setNearestChurches([]);
    setUserLocation(null);
    setSelectedJemaat(null);
    setFlyTo(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedJemaat(null);
  }, []);

  const nearestIds = nearestChurches.map((j) => j.id);
  const selectedDistance = selectedJemaat
    ? nearestChurches.find((j) => j.id === selectedJemaat.id)?.distance
    : undefined;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <section
      id="cari-jemaat"
      className="relative z-10 flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 72px)", minHeight: 600 }}
    >

      {/* Nearest Finder bar */}
      <NearestChurchFinder
        churches={jemaatData}
        onResult={handleNearestResult}
        onReset={handleResetNearest}
        isActive={isNearestMode}
      />

      {/* ── Mobile Tab Toggle ─────────────────────────────────────────────────── */}
      <div className="lg:hidden flex border-b border-border shrink-0">
        <TabButton
          icon={<Map size={15} />}
          label="Peta"
          active={mobileTab === "map"}
          onClick={() => setMobileTab("map")}
        />
        <TabButton
          icon={<List size={15} />}
          label={`Daftar (${jemaatData.length})`}
          active={mobileTab === "list"}
          onClick={() => setMobileTab("list")}
        />
      </div>

      {/* ── Main Explorer Area ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* MAP — full width mobile (hidden when list tab active), 65% desktop */}
        <div
          className={`
            relative z-0 flex-1 transition-all duration-300
            ${mobileTab === "list" ? "hidden lg:flex" : "flex"}
          `}
        >
          <MapView
            churches={isNearestMode ? nearestChurches : filteredChurches}
            selectedId={selectedJemaat?.id ?? null}
            nearestIds={nearestIds}
            userLocation={userLocation}
            flyTo={flyTo}
            onMarkerClick={handleSelectChurch}
          />

          {/* Zoom controls overlay */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1">
            <ZoomNote />
          </div>
        </div>

        {/* LIST PANEL — bottom on mobile (shown when list tab), 30% desktop */}
        <div
          className={`
            lg:flex lg:flex-col lg:w-80 xl:w-96 shrink-0
            border-t lg:border-t-0 lg:border-l border-border overflow-hidden
            ${mobileTab === "list" ? "flex flex-col flex-1" : "hidden lg:flex"}
          `}
        >
          <ChurchListPanel
            filteredChurches={filteredChurches}
            nearestChurches={nearestChurches}
            isNearestMode={isNearestMode}
            selectedId={selectedJemaat?.id ?? null}
            onSelectChurch={handleSelectChurch}
            onExitNearestMode={handleResetNearest}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCity={activeCity}
            onCityChange={setActiveCity}
            availableCities={availableCities}
          />
        </div>

        {/* DETAIL PANEL — slides in from right on desktop, bottom sheet on mobile */}
        <ChurchDetailPanel
          jemaat={selectedJemaat}
          distance={selectedDistance}
          onClose={handleCloseDetail}
        />
      </div>
    </section>
  );
}

// ─── Mobile Tab Button ─────────────────────────────────────────────────────────

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all
        ${active
          ? "border-accent text-accent bg-primary/10"
          : "border-transparent text-text-secondary hover:text-text-primary"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Zoom hint overlay ─────────────────────────────────────────────────────────

function ZoomNote() {
  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl px-3 py-2 text-xs text-text-secondary shadow-lg hidden lg:block">
      Scroll untuk zoom · Klik marker untuk detail
    </div>
  );
}
