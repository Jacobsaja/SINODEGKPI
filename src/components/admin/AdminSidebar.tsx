"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/publikasi", label: "Publikasi", icon: Newspaper, exact: false },
  { href: "/admin/toko", label: "Toko", icon: ShoppingBag, exact: false },
];

interface AdminSidebarProps {
  email?: string;
  onLogout: () => void;
}

export default function AdminSidebar({ email, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl">
      {/* Brand */}
      <div className="border-b border-border/60 p-6">
        <p
          className="text-lg font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          GKPI Sinode
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                active
                  ? "border-accent/30 bg-accent/15 text-white"
                  : "border-transparent text-text-secondary hover:border-border hover:bg-background/40 hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-accent" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: lihat situs + logout */}
      <div className="space-y-1 border-t border-border/60 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-white"
        >
          <ExternalLink size={18} />
          Lihat Situs
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Keluar
        </button>
        {email && (
          <p className="truncate px-4 pt-2 text-xs text-text-secondary/70">
            {email}
          </p>
        )}
      </div>
    </aside>
  );
}
