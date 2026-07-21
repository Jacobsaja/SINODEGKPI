"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function CopyLinkButton() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold text-text-secondary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      title="Salin Tautan"
    >
      {isCopied ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
      {isCopied ? "Tersalin!" : "Bagikan"}
    </button>
  );
}
