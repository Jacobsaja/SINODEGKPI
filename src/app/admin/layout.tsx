"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inisialisasi status auth saat mount dan ikuti perubahan auth.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
      setEmail(data.session?.user.email ?? undefined);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(!!sess);
      setEmail(sess?.user.email ?? undefined);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) setAuthError(error.message);
    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Tunggu resolusi auth agar UI tidak berkedip.
  if (session === null) {
    return <main className="min-h-screen bg-background" />;
  }

  // Render gate auth saat sesi tidak aktif.
  if (!session) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 text-text-primary">
        {/* Glow decoration */}
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px] pointer-events-none" />
        
        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-border/85 bg-surface/45 p-8 md:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-accent/20 animate-fade-in-up"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-lg shadow-primary/20">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-background">
                <img
                  src="/mitra/Logo_GKPI.png"
                  alt="Logo GKPI"
                  className="h-full w-full object-contain p-1"
                />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-accent">
                GKPI Sinode
              </p>
              <h1
                className="text-2xl font-bold text-white mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Masuk Admin Panel
              </h1>
              <p className="text-xs text-text-secondary mt-1.5">
                Kelola publikasi gereja dan produk toko jemaat
              </p>
            </div>
          </div>

          {authError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-400"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12.01" y1="16" y2="16"/><path d="M12 8v4"/></svg>
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none transition-all focus:border-accent/50 focus:bg-background/80 focus:ring-4 focus:ring-accent/10"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50 outline-none transition-all focus:border-accent/50 focus:bg-background/80 focus:ring-4 focus:ring-accent/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
          >
            {loggingIn ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memeriksa...
              </span>
            ) : (
              <>
                Masuk
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
        </form>
      </main>
    );
  }

  // Render shell admin saat sesi aktif.
  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Controlled AdminSidebar */}
      <AdminSidebar
        email={email}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top bar for mobile header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-6 backdrop-blur-md md:h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/50 text-text-secondary transition-colors hover:border-accent/40 hover:text-accent md:hidden cursor-pointer"
              aria-label="Buka Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent">GKPI Sinode</span>
              <span className="text-sm font-bold text-white hidden md:inline-block">Admin Panel Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-text-secondary hover:text-accent flex items-center gap-1.5 border border-border px-3.5 py-2 rounded-xl hover:border-accent/30 bg-surface/30 hover:bg-surface/50 transition-all"
            >
              Lihat Situs
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </a>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
