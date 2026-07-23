"use client";

import { MapPin, Phone, User } from "lucide-react";
import { Jemaat } from "@/data/jemaat";

interface ChurchListItemProps {
  jemaat: Jemaat;
  isSelected: boolean;
  distanceLabel?: string; // e.g. "2.3 km" — shown in nearest mode
  rank?: number;          // 1, 2, 3 … — shown in nearest mode
  searchQuery?: string;   // For text highlighting
  onClick: () => void;
}

// Helper for text highlighting
function HighlightText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-primary/30 text-primary font-extrabold px-0.5 rounded-sm">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ChurchListItem({
  jemaat,
  isSelected,
  distanceLabel,
  rank,
  searchQuery,
  onClick,
}: ChurchListItemProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={`
        w-full text-left flex gap-4 p-4 rounded-2xl border transition-all duration-200 group
        ${isSelected
          ? "bg-primary/20 border-primary/60 shadow-sm shadow-primary/10"
          : "bg-surface border-border hover:bg-primary/20 hover:border-primary/60 hover:shadow-sm hover:shadow-primary/10"
        }
      `}
    >
      {/* Rank badge (nearest mode) or church icon */}
      <div className="shrink-0 mt-0.5">
        {rank ? (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow
              ${rank === 1
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text-secondary"
              }`}
          >
            {rank}
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
              ${isSelected
                ? "bg-primary text-primary"
                : "bg-primary/10 text-primary group-hover:bg-primary"
              }`}
          >
            <MapPin size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-bold text-sm leading-tight truncate
            ${isSelected ? "text-primary" : "text-text-primary group-hover:text-primary"}`}
        >
          <HighlightText text={jemaat.nama} highlight={searchQuery} />
        </p>

        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1 truncate">
          <User size={11} className="shrink-0" />
          <HighlightText text={jemaat.pendeta} highlight={searchQuery} />
        </p>

        <p className="text-xs text-text-secondary/70 mt-0.5 flex items-center gap-1 truncate">
          <MapPin size={11} className="shrink-0" />
          <HighlightText text={jemaat.kota} highlight={searchQuery} />, {jemaat.provinsi}
        </p>

        {jemaat.telepon && (
          <p className="text-xs text-text-secondary/60 mt-0.5 flex items-center gap-1 truncate">
            <Phone size={11} className="shrink-0" />
            {jemaat.telepon}
          </p>
        )}
      </div>

      {/* Distance badge */}
      {distanceLabel && (
        <div className="shrink-0 self-center">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full
              ${rank === 1
                ? "bg-primary/20 text-primary"
                : "bg-primary/10 text-primary"
              }`}
          >
            {distanceLabel}
          </span>
        </div>
      )}
    </button>
  );
}
