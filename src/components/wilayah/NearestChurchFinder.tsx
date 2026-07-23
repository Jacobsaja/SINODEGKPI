"use client";

import { useState } from "react";
import { MapPin, Loader2, AlertCircle, X } from "lucide-react";
import { Jemaat } from "@/data/jemaat";
import { findNearestChurches, JemaatWithDistance } from "@/lib/haversine";

type GeoStatus = "idle" | "loading" | "denied" | "unsupported" | "done";

interface NearestChurchFinderProps {
  churches: Jemaat[];
  onResult: (results: JemaatWithDistance[], userLocation: { lat: number; lng: number }) => void;
  onReset: () => void;
  isActive: boolean;
}

export default function NearestChurchFinder({
  churches,
  onResult,
  onReset,
  isActive,
}: NearestChurchFinderProps) {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [manualCity, setManualCity] = useState("");
  const [showManual, setShowManual] = useState(false);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      setShowManual(true);
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const results = findNearestChurches(userLat, userLng, churches, 5);
        setStatus("done");
        onResult(results, { lat: userLat, lng: userLng });
      },
      () => {
        setStatus("denied");
        setShowManual(true);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleReset = () => {
    setStatus("idle");
    setShowManual(false);
    setManualCity("");
    onReset();
  };

  // Active state — show compact reset bar
  if (isActive) {
    return (
      <div className="flex items-center justify-between px-5 py-3 bg-primary/20 border-b border-primary/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-primary animate-pulse" />
          <p className="text-sm font-semibold text-primary">
            Menampilkan gereja terdekat
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg border border-border hover:border-border/80 transition-all"
        >
          <X size={12} />
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 border-b border-border bg-background/40">
      {/* Main CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-text-primary">
            Temukan Gereja GKPI Terdekat
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            Gunakan lokasi Anda untuk menemukan jemaat di sekitar Anda.
          </p>
        </div>
        <button
          onClick={handleFindNearest}
          disabled={status === "loading"}
          id="btn-find-nearest-church"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold text-sm rounded-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Mendeteksi…
            </>
          ) : (
            <>
              <MapPin size={16} />
              Temukan Terdekat
            </>
          )}
        </button>
      </div>

      {/* Status messages */}
      {status === "denied" && (
        <StatusAlert
          type="warning"
          message="Akses lokasi ditolak. Masukkan nama kota secara manual."
        />
      )}
      {status === "unsupported" && (
        <StatusAlert
          type="info"
          message="Browser Anda tidak mendukung geolokasi. Cari berdasarkan kota di bawah."
        />
      )}

      {/* Manual fallback */}
      {showManual && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan nama kota (cth: Medan)"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleManualSearch();
            }}
            className="flex-1 bg-surface border border-border text-text-primary placeholder:text-text-secondary/40 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/40 transition-all"
          />
          <button
            onClick={handleManualSearch}
            className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-colors"
          >
            Cari
          </button>
        </div>
      )}
    </div>
  );

  function handleManualSearch() {
    if (!manualCity.trim()) return;
    const cityLower = manualCity.toLowerCase();

    // Find churches in matching city — use first match's coordinates as user "location"
    const matchingCities = churches.filter(
      (j) =>
        j.kota.toLowerCase().includes(cityLower) ||
        j.provinsi.toLowerCase().includes(cityLower)
    );

    if (matchingCities.length === 0) return;

    // Use centroid of matching churches as approximate user location
    const avgLat = matchingCities.reduce((s, j) => s + j.lat, 0) / matchingCities.length;
    const avgLng = matchingCities.reduce((s, j) => s + j.lng, 0) / matchingCities.length;

    const results = findNearestChurches(avgLat, avgLng, churches, 5);
    setStatus("done");
    onResult(results, { lat: avgLat, lng: avgLng });
  }
}

// ─── Status Alert ──────────────────────────────────────────────────────────────

function StatusAlert({ type, message }: { type: "warning" | "info"; message: string }) {
  return (
    <div
      className={`mt-3 flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${
        type === "warning"
          ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
          : "bg-primary/10 border border-primary/20 text-primary"
      }`}
    >
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
