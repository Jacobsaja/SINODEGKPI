"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

interface ShareMenuProps {
  title?: string;
}

export default function ShareMenu({ title = "GKPI Sinode" }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getCurrentUrl = () => {
    return typeof window !== "undefined" ? window.location.href : "";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentUrl());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Baca: *${title}*\n\n${getCurrentUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Baca: "${title}" via GKPI Sinode`);
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold text-text-secondary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95"
        title="Bagikan Publikasi"
      >
        <Share2 size={16} />
        <span>Bagikan</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop for closing popover */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 z-50 w-56 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-text-secondary border-b border-border/50 mb-1">
              Bagikan via
            </div>

            <button
              onClick={() => {
                shareToWhatsApp();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <MessageCircle size={15} />
              </div>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                shareToFacebook();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span>Facebook</span>
            </button>

            <button
              onClick={() => {
                shareToTwitter();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <span>X (Twitter)</span>
            </button>

            <div className="my-1 border-t border-border/50" />

            <button
              onClick={() => {
                handleCopy();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-primary hover:bg-background/60 transition-colors cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-border text-text-secondary">
                {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </div>
              <span>{isCopied ? "Tersalin!" : "Salin Tautan"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
