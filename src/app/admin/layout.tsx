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

  // Cek status login sekali saat admin dibuka, lalu dengarkan perubahannya
  // (login/logout) supaya semua halaman /admin/* langsung ikut ter-update.
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

  // Masih memeriksa status login: hindari kedipan form login/dashboard.
  if (session === null) {
    return <main className="min-h-screen bg-background" />;
  }

  // Belum login: tampilkan gerbang login tunggal untuk seluruh area admin.
  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-text-primary">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-3xl border border-border bg-surface/50 p-8 backdrop-blur-xl"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              GKPI Sinode
            </p>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Masuk ke Admin Panel
            </h1>
          </div>
          {authError && <p className="text-sm text-red-400">{authError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-accent/40"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-accent/40"
            required
          />
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
          >
            {loggingIn ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </main>
    );
  }

  // Sudah login: tampilkan chrome admin (sidebar) + konten halaman.
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <AdminSidebar email={email} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</div>
      </div>
    </div>
  );
}
