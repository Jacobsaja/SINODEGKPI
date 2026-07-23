"use client";

import { useEffect, useRef } from "react";
import { MapPin, List } from "lucide-react";
import { Jemaat } from "@/data/jemaat";
import { JemaatWithDistance, formatDistance } from "@/lib/haversine";
import ChurchListItem from "./ChurchListItem";
import SearchFilterBar from "./SearchFilterBar";

interface ChurchListPanelProps {
  filteredChurches: Jemaat[];
  nearestChurches: JemaatWithDistance[];
  isNearestMode: boolean;
  selectedId: string | null;
  onSelectChurch: (jemaat: Jemaat) => void;
  onExitNearestMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
  availableCities: string[];
}

export default function ChurchListPanel({
  filteredChurches,
  nearestChurches,
  isNearestMode,
  selectedId,
  onSelectChurch,
  onExitNearestMode,
  searchQuery,
  onSearchChange,
  activeCity,
  onCityChange,
  availableCities,
}: ChurchListPanelProps) {
  const displayList = isNearestMode ? nearestChurches : filteredChurches;
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedId && listContainerRef.current) {
      const selectedEl = listContainerRef.current.querySelector(
        `[data-jemaat-id="${selectedId}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedId, displayList]);

  return (
    <div className="flex flex-col h-full bg-background/60 overflow-hidden">
      {/* Header */}
      {isNearestMode ? (
        <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Gereja Terdekat
              </p>
              <p className="text-sm font-bold text-text-primary mt-0.5">
                {nearestChurches.length} gereja ditemukan
              </p>
            </div>
            <button
              onClick={onExitNearestMode}
              className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:border-border/80 transition-all"
            >
              <List size={12} />
              Semua
            </button>
          </div>
        </div>
      ) : (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          activeCity={activeCity}
          onCityChange={onCityChange}
          availableCities={availableCities}
        />
      )}

      {/* Count bar */}
      {!isNearestMode && (
        <div className="px-4 py-2 shrink-0 border-b border-border/30">
          <p className="text-xs text-text-secondary/60">
            {filteredChurches.length} jemaat ditemukan
          </p>
        </div>
      )}

      {/* List */}
      <div 
        ref={listContainerRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2 no-scrollbar"
      >
        {displayList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin size={32} className="text-text-secondary/30 mb-3" />
            <p className="text-sm text-text-secondary">
              {searchQuery || activeCity
                ? "Tidak ada gereja yang cocok"
                : "Belum ada data jemaat"}
            </p>
            {(searchQuery || activeCity) && (
              <button
                onClick={() => {
                  onSearchChange("");
                  onCityChange(null);
                }}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          displayList.map((jemaat, idx) => {
            const withDist = jemaat as JemaatWithDistance;
            return (
              <div key={jemaat.id} data-jemaat-id={jemaat.id}>
                <ChurchListItem
                  jemaat={jemaat}
                  isSelected={selectedId === jemaat.id}
                  distanceLabel={
                    isNearestMode && withDist.distance !== undefined
                      ? formatDistance(withDist.distance)
                      : undefined
                  }
                  rank={isNearestMode ? idx + 1 : undefined}
                  onClick={() => onSelectChurch(jemaat)}
                  searchQuery={searchQuery}
                />
              </div>
            );
          })
        )}

        {/* Phase 2 hint */}
        {!isNearestMode && !searchQuery && !activeCity && (
          <div className="mt-4 p-4 rounded-2xl border border-dashed border-border/50 text-center">
            <p className="text-xs text-text-secondary/50">
              Pengelompokan per Wilayah & Resort akan hadir di pembaruan berikutnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
