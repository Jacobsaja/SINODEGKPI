"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  Inbox,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ContactMessage {
  id: string;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

export default function AdminKontakPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data as ContactMessage[]);
    }
    setLoading(false);
  };

  const toggleExpand = async (msg: ContactMessage) => {
    const isOpening = expandedId !== msg.id;
    setExpandedId(isOpening ? msg.id : null);

    // Tandai otomatis sebagai "read" saat pertama kali dibuka
    if (isOpening && msg.status === "unread") {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: "read" })
        .eq("id", msg.id);

      if (!error) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
        );
      }
    }
  };

  const markAsReplied = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "replied" })
      .eq("id", id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "replied" } : m))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini? Tindakan ini tidak bisa dibatalkan.")) return;

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const filteredMessages =
    filter === "unread" ? messages.filter((m) => m.status === "unread") : messages;

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const statusBadge = (status: ContactMessage["status"]) => {
    const map = {
      unread: { label: "Belum Dibaca", cls: "bg-accent/10 text-accent border-accent/30" },
      read: { label: "Sudah Dibaca", cls: "bg-primary/10 text-primary border-primary/30" },
      replied: { label: "Sudah Dibalas", cls: "bg-success/10 text-success border-success/30" },
    };
    const s = map[status];
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.cls}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pesan Masuk</h1>
          <p className="text-sm text-text-secondary mt-1">
            Pesan yang dikirim melalui form kontak di halaman publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-primary text-white border-primary"
                : "bg-surface text-text-secondary border-border hover:border-primary/40"
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
              filter === "unread"
                ? "bg-accent text-white border-accent"
                : "bg-surface text-text-secondary border-border hover:border-accent/40"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-text-secondary gap-2">
          <Loader2 size={20} className="animate-spin" />
          Memuat pesan...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-secondary gap-3 border border-dashed border-border rounded-2xl">
          <Inbox size={32} className="opacity-50" />
          <p className="text-sm">Tidak ada pesan untuk ditampilkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isOpen = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  msg.status === "unread"
                    ? "border-accent/30 bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                <button
                  onClick={() => toggleExpand(msg)}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {msg.status === "unread" ? (
                      <Mail size={16} className="text-accent" />
                    ) : (
                      <MailOpen size={16} className="text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {msg.nama}
                      </p>
                      {statusBadge(msg.status)}
                    </div>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {msg.subjek} · {msg.email}
                    </p>
                  </div>

                  <div className="hidden sm:block text-xs text-text-secondary shrink-0">
                    {new Date(msg.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {isOpen ? (
                    <ChevronUp size={18} className="text-text-secondary shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-text-secondary shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-border/60 space-y-4">
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                      {msg.pesan}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={`mailto:${msg.email}?subject=RE: ${msg.subjek}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Balas via Email
                      </a>

                      {msg.status !== "replied" && (
                        <button
                          onClick={() => markAsReplied(msg.id)}
                          className="text-xs font-bold text-success hover:underline cursor-pointer"
                        >
                          Tandai Sudah Dibalas
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="ml-auto flex items-center gap-1.5 text-xs font-bold text-accent hover:underline cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
