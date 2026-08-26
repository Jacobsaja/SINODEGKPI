"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { PublicationDepartment } from "@/lib/types";
import {
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  Users,
  Church,
  FolderLock,
  Mail,
  Wallet,
  LogOut,
  ExternalLink,
  Globe,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, external: false },
  { href: "/admin/publikasi", label: "Publikasi", icon: Newspaper, exact: false, external: false },
  { href: "/admin/toko", label: "Toko", icon: ShoppingBag, exact: false, external: false },
  { href: "/admin/pengurus", label: "Pengurus", icon: Users, exact: false, external: false },
  { href: "/admin/jemaat", label: "Jemaat & Resort", icon: Church, exact: false, external: false },
  { href: "/admin/kontak", label: "Pesan Masuk", icon: Mail, exact: false, external: false },
  { href: "/admin/laporan-keuangan", label: "Laporan Keuangan", icon: Wallet, exact: false, external: false },
  { href: "/admin/sharefiles", label: "Share Files", icon: FolderLock, exact: false, external: false },
  {
    href: "https://script.google.com/macros/s/AKfycby2uE9OQ4nsFWJn7CVapu5zImdQNEGH3g3BFqnA6Axspe4t6Xf94OyhhlHY0xaquZrbUA/exec",
    label: "GKPI Digital Hub",
    icon: Globe,
    exact: false,
    external: true,
  },
];

interface AdminSidebarProps {
  email?: string;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  adminDepartment?: PublicationDepartment | null;
}

export default function AdminSidebar({
  email,
  onLogout,
  isOpen,
  onClose,
  adminDepartment = null,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");
      setUnreadCount(count ?? 0);
    };
    fetchUnreadCount();
  }, [pathname]);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Ambil inisial dari email untuk avatar
  const getInitials = (emailStr?: string) => {
    if (!emailStr) return "AD";
    return emailStr.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border/80 bg-surface/85 backdrop-blur-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-border/60 p-6">
        <div>
          <p
            className="text-xl font-bold text-text-primary tracking-tight"
          >
            GKPI Sinode
          </p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary mt-0.5">
            Admin Workspace
          </p>
        </div>
        {/* Tombol Close Mobile */}
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-text-secondary hover:text-primary hover:border-primary/40 md:hidden cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = !item.external && isActive(item.href, item.exact);
          const Icon = item.icon;
          const isDisabled =
            adminDepartment !== null && item.label !== "Publikasi";

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                aria-disabled={isDisabled}
                className={`group relative flex items-center gap-3.5 rounded-xl border border-transparent px-4 py-3.5 text-sm font-semibold text-text-secondary transition-all hover:border-border/60 hover:bg-background/40 hover:text-primary ${
                  isDisabled ? "opacity-40 pointer-events-none cursor-not-allowed" : ""
                }`}
              >
                <Icon size={18} className="text-text-secondary transition-colors group-hover:text-primary" />
                <span>{item.label}</span>
                <ExternalLink size={14} className="ml-auto text-text-secondary/60 group-hover:text-primary" />
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-disabled={isDisabled}
              className={`group relative flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                active
                  ? "border-primary/20 bg-primary/10 text-text-primary shadow-inner"
                  : "border-transparent text-text-secondary hover:border-border/60 hover:bg-background/40 hover:text-primary"
              } ${isDisabled ? "opacity-40 pointer-events-none cursor-not-allowed" : ""}`}
            >
              {/* Active Indicator Bar */}
              {active && (
                <span className="absolute left-0 top-1/4 h-1/2 w-1.5 rounded-r-full bg-primary" />
              )}
              <Icon
                size={18}
                className={`transition-colors ${
                  active ? "text-primary" : "text-text-secondary group-hover:text-primary"
                }`}
              />
              <span>{item.label}</span>
              {item.href === "/admin/kontak" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-primary px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: profil + lihat situs + logout */}
      <div className="space-y-1.5 border-t border-border/60 p-4 bg-background/25">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-primary hover:bg-background/20"
        >
          <ExternalLink size={18} />
          <span>Lihat Situs</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-700"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>

        {email && (
          <div className="mt-2 flex items-center gap-3 border-t border-border/40 px-4 pt-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary font-bold text-xs text-white uppercase shadow-md shadow-primary/10">
              {getInitials(email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{email.split("@")[0]}</p>
              <p className="truncate text-[10px] text-text-secondary/80 mt-0.5">{email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}