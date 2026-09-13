"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";

const BOOKMARKS_STORAGE_KEY = "gkpi_bookmarked_ids";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", callback);
  };
}

export function getBookmarkedIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkId(id: number): boolean {
  const current = getBookmarkedIds();
  const exists = current.includes(id);
  const updated = exists
    ? current.filter((item) => item !== id)
    : [...current, id];
  
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  } catch {
    // Ignore storage errors
  }
  return !exists;
}

export default function BookmarkButton({ id }: { id: number }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isBookmarked = useSyncExternalStore(
    subscribe,
    () => getBookmarkedIds().includes(id),
    () => false
  );

  const handleToggle = () => {
    toggleBookmarkId(id);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className={`flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all duration-300 ${
        isBookmarked
          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
          : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      }`}
      title={isBookmarked ? "Hapus dari Renungan Tersimpan" : "Simpan Renungan"}
    >
      <Bookmark
        size={16}
        className={isBookmarked ? "fill-amber-500 text-amber-500" : ""}
      />
      {isBookmarked ? "Tersimpan" : "Simpan Renungan"}
    </button>
  );
}
