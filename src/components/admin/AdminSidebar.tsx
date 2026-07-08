"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  Users,
  Church,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/publikasi", label: "Publikasi", icon: Newspaper, exact: false },
  { href: "/admin/toko", label: "Toko", icon: ShoppingBag, exact: false },
  { href: "/admin/pengurus", label: "Pengurus", icon: Users, exact: false },
  { href: "/admin/jemaat", label: "Jemaat & Resort", icon: Church, exact: false },
];

interface AdminSidebarProps {
  email?: string;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ email, onLogout, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

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
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent mt-0.5">
            Admin Workspace
          </p>
        </div>
        {/* Tombol Close Mobile */}
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-text-secondary hover:text-primary md:hidden cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                active
                  ? "border-accent/20 bg-accent/10 text-white shadow-inner"
                  : "border-transparent text-text-secondary hover:border-border/60 hover:bg-background/40 hover:text-primary"
              }`}
            >
              {/* Active Indicator Bar */}
              {active && (
                <span className="absolute left-0 top-1/4 h-1/2 w-1.5 rounded-r-full bg-accent" />
              )}
              <Icon
                size={18}
                className={`transition-colors ${
                  active ? "text-accent" : "text-text-secondary group-hover:text-primary"
                }`}
              />
              <span>{item.label}</span>
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
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400/90 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>

        {email && (
          <div className="mt-2 flex items-center gap-3 border-t border-border/40 px-4 pt-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent font-bold text-xs text-white uppercase shadow-md shadow-primary/10">
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