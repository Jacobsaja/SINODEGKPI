"use client";

import Image from "next/image";
import { Mail, Phone, User, X } from "lucide-react";
import type { PengurusAnggota } from "@/lib/pengurus";

export default function PengurusModal({
  person,
  onClose,
}: {
  person: PengurusAnggota | null;
  onClose: () => void;
}) {
  if (!person) return null;

  const hasContact = !!(person.email || person.phone);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border/85 bg-surface/95 p-8 md:p-10 shadow-sm backdrop-blur-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/50 text-text-secondary hover:text-white hover:border-primary/40 transition-all cursor-pointer"
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-border bg-background/50 flex items-center justify-center">
            {person.photo_url ? (
              <Image src={person.photo_url} alt={person.name} fill sizes="112px" className="object-cover" />
            ) : (
              <User size={44} className="text-text-secondary/30" strokeWidth={1.5} />
            )}
          </div>

          <div className="mt-5 space-y-1">
            {person.role && (
              <p className="text-xs font-bold text-primary uppercase tracking-wider">{person.role}</p>
            )}
            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {person.name}
            </h3>
          </div>

          {person.bio ? (
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">{person.bio}</p>
          ) : (
            <p className="mt-4 text-sm text-text-secondary/60 italic">Belum ada informasi tambahan.</p>
          )}

          {hasContact && (
            <div className="mt-6 w-full space-y-2.5 border-t border-border/50 pt-5">
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <Mail size={15} className="text-primary shrink-0" />
                  {person.email}
                </a>
              )}
              {person.phone && (
                <a
                  href={`tel:${person.phone}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <Phone size={15} className="text-primary shrink-0" />
                  {person.phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
