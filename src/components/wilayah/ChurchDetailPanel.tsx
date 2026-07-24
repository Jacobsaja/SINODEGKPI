"use client";

import { useState } from "react";
import { X, MapPin, Phone, User, Navigation, ExternalLink, Clock } from "lucide-react";
import { Jemaat } from "@/data/jemaat";
import { formatDistance } from "@/lib/haversine";
import Image from "next/image";

interface ChurchDetailPanelProps {
  jemaat: Jemaat | null;
  distance?: number; // km, optional
  onClose: () => void;
}

export default function ChurchDetailPanel({
  jemaat,
  distance,
  onClose,
}: ChurchDetailPanelProps) {
  const isOpen = jemaat !== null;

  const googleMapsUrl = jemaat
    ? `https://www.google.com/maps/dir/?api=1&destination=${jemaat.lat},${jemaat.lng}`
    : "#";

  return (
    <>
      {/* Desktop: Slide-in from right */}
      <div
        className={`
          hidden lg:flex flex-col h-full bg-surface border-l border-border
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "w-80 opacity-100" : "w-0 opacity-0"}
        `}
        aria-hidden={!isOpen}
      >
        {jemaat && <PanelContent jemaat={jemaat} distance={distance} googleMapsUrl={googleMapsUrl} onClose={onClose} />}
      </div>

      {/* Mobile: Bottom sheet */}
      <div
        className={`
          lg:hidden fixed inset-x-0 bottom-0 z-[500]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1]"
            onClick={onClose}
          />
        )}
        <div className="relative bg-surface rounded-t-3xl border-t border-border shadow-sm max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1 rounded-full bg-border" />
          </div>
          {jemaat && <PanelContent jemaat={jemaat} distance={distance} googleMapsUrl={googleMapsUrl} onClose={onClose} mobile />}
        </div>
      </div>
    </>
  );
}

// ─── Panel Content ─────────────────────────────────────────────────────────────

function PanelContent({
  jemaat,
  distance,
  googleMapsUrl,
  onClose,
  mobile = false,
}: {
  jemaat: Jemaat;
  distance?: number;
  googleMapsUrl: string;
  onClose: () => void;
  mobile?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex flex-col ${mobile ? "" : "h-full overflow-y-auto no-scrollbar"}`}>
      {/* Church photo */}
      <div className="relative w-full aspect-video shrink-0 bg-background overflow-hidden">
        {!imgError && (
          <Image
            src={jemaat.foto}
            alt={jemaat.nama}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-background">
            <div className="text-center opacity-50">
              <MapPin size={32} className="mx-auto text-primary mb-2" />
              <p className="text-xs text-white">Foto belum tersedia</p>
            </div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Tutup panel"
        >
          <X size={16} />
        </button>

        {/* Distance badge */}
        {distance !== undefined && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow">
            📍 {formatDistance(distance)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex-1 space-y-4">
        {/* Location tag */}
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {jemaat.kota} · {jemaat.provinsi}
        </p>

        {/* Name */}
        <h2 className="text-lg font-bold text-text-primary leading-snug">
          {jemaat.nama}
        </h2>

        <div className="h-px bg-border" />

        {/* Detail rows */}
        <div className="space-y-3">
          <DetailRow icon={<User size={15} />} label="Pendeta" value={jemaat.pendeta} />
          <DetailRow
            icon={<MapPin size={15} />}
            label="Alamat"
            value={jemaat.alamat}
          />
          {jemaat.telepon && (
            <DetailRow
              icon={<Phone size={15} />}
              label="Telepon"
              value={jemaat.telepon}
              href={`tel:${jemaat.telepon.replace(/\s/g, "")}`}
            />
          )}
          {jemaat.resort_id && (
            <DetailRow icon={<Navigation size={15} />} label="Resort" value={jemaat.resort_id} />
          )}
          {jemaat.wilayah_id && (
            <DetailRow icon={<MapPin size={15} />} label="Wilayah" value={jemaat.wilayah_id} />
          )}
          {jemaat.jadwal_ibadah && jemaat.jadwal_ibadah.length > 0 && (
            <DetailRow icon={<Clock size={15} />} label="Jadwal Ibadah" value={jemaat.jadwal_ibadah.join(", ")} />
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 pt-0 space-y-3 shrink-0">
        <div className="flex gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-2xl transition-colors shadow-sm"
          >
            <Navigation size={16} />
            Petunjuk Arah
          </a>
          
          {jemaat.telepon && (
            <a
              href={`tel:${jemaat.telepon.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-surface border border-border text-text-primary hover:bg-border/50 font-bold text-sm rounded-2xl transition-colors shadow-sm lg:hidden"
            >
              <Phone size={16} />
            </a>
          )}
        </div>
        
        <a
          href={`https://maps.google.com/?q=${jemaat.lat},${jemaat.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 border border-border text-text-secondary hover:text-text-primary hover:border-border/80 text-sm rounded-2xl transition-colors"
        >
          <ExternalLink size={14} />
          Buka di Google Maps
        </a>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">
          {label}
        </p>
        {href ? (
          <a href={href} className="text-sm text-primary hover:underline underline-offset-4">
            {value}
          </a>
        ) : (
          <p className="text-sm text-text-primary leading-snug">{value}</p>
        )}
      </div>
    </div>
  );
}
