"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
  availableCities: string[];
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  activeCity,
  onCityChange,
  availableCities,
}: SearchFilterBarProps) {
  // Local state for instant input feedback, synced to parent via debounce
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sync local state when searchQuery prop changes from outside (e.g. reset)
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setLocalQuery(searchQuery);
    setPrevSearchQuery(searchQuery);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  // Drag to scroll logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="px-4 pt-4 pb-3 border-b border-border bg-surface/50 space-y-3 shrink-0">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Cari gereja, kota, atau pendeta…"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full bg-background border border-border text-text-primary placeholder:text-text-secondary/40 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all shadow-sm"
        />
        {localQuery && (
          <button
            onClick={() => setLocalQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-primary p-1 rounded-full hover:bg-border/50 transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-2 overflow-x-auto no-scrollbar pb-1 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <FilterChip
          label="Semua Kota"
          isActive={activeCity === null}
          onClick={() => onCityChange(null)}
        />
        {availableCities.map((city) => (
          <FilterChip
            key={city}
            label={city}
            isActive={activeCity === city}
            onClick={() => onCityChange(city)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all
        ${
          isActive
            ? "bg-primary text-white border-primary shadow-sm"
            : "bg-surface text-text-secondary border-border hover:border-accent/40 hover:text-text-primary"
        }
      `}
    >
      {label}
    </button>
  );
}
