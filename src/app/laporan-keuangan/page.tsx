"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { FinancialReport, FinancialReportHistoryLog } from "@/lib/types";
import {
  getAllFinancialReports,
  getFinancialReportHistoryPublic,
  getMonthNameID,
  formatRupiah,
  getAvailableYears,
  getMonthlyTrend,
  filterFinancialReports,
} from "@/lib/laporan-keuangan";
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  Download,
  History,
  TrendingUp,
  TrendingDown,
  Scale,
} from "lucide-react";

/**
 * Grafik tren bulanan sederhana: batang biru (pemasukan) di atas garis nol,
 * batang merah (pengeluaran) di bawah garis nol — biar sekali lihat ketahuan
 * bulan mana surplus/defisit. SVG manual, tanpa library chart tambahan.
 */
function MonthlyTrendChart({
  data,
}: {
  data: { monthName: string; income: number; expense: number }[];
}) {
  const width = 700;
  const height = 160;
  const midY = height / 2;
  const barMaxHeight = height / 2 - 22;
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);
  const groupWidth = width / data.length;
  const barWidth = groupWidth * 0.32;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <line x1={0} y1={midY} x2={width} y2={midY} stroke="var(--color-border)" strokeWidth={1} />
      {data.map((d, i) => {
        const cx = i * groupWidth + groupWidth / 2;
        const incomeH = (d.income / maxVal) * barMaxHeight;
        const expenseH = (d.expense / maxVal) * barMaxHeight;
        return (
          <g key={i}>
            <rect
              x={cx - barWidth - 2}
              y={midY - incomeH}
              width={barWidth}
              height={incomeH}
              rx={2}
              fill="var(--color-primary)"
              opacity={0.85}
            />
            <rect
              x={cx + 2}
              y={midY}
              width={barWidth}
              height={expenseH}
              rx={2}
              fill="var(--color-accent)"
              opacity={0.85}
            />
            <text
              x={cx}
              y={height - 4}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted)"
              fontWeight={600}
            >
              {d.monthName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LaporanKeuanganPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "Semua">("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [historyCache, setHistoryCache] = useState<Record<number, FinancialReportHistoryLog[]>>({});
  const [loadingHistoryId, setLoadingHistoryId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAllFinancialReports().then((data) => {
      if (isMounted) {
        setReports(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const availableYears = useMemo(() => getAvailableYears(reports), [reports]);
  // reports sudah terurut year desc, month desc dari lib -> reports[0] = laporan terbaru
  const latestReport = reports[0];
  const heroYear = latestReport?.year;
  const monthlyTrend = useMemo(
    () => (heroYear ? getMonthlyTrend(reports, heroYear) : []),
    [reports, heroYear]
  );

  const yearGroups = useMemo(() => {
    const filtered = filterFinancialReports(reports, selectedYear, searchQuery);
    const groups = new Map<number, FinancialReport[]>();
    filtered.forEach((r) => {
      if (!groups.has(r.year)) groups.set(r.year, []);
      groups.get(r.year)!.push(r);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [reports, selectedYear, searchQuery]);

  async function toggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!historyCache[id]) {
      setLoadingHistoryId(id);
      const logs = await getFinancialReportHistoryPublic(id);
      setHistoryCache((prev) => ({ ...prev, [id]: logs }));
      setLoadingHistoryId(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      {/* Hero: saldo berjalan + tren, konsep "buku kas terbuka" */}
      <section className="relative overflow-hidden bg-background pb-14 pt-32 md:pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-accent"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-accent">Laporan Keuangan</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Transparansi Pelayanan
            </p>
            <h1 className="mb-3 max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
              Laporan Keuangan Sinode
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary md:text-base mb-10">
              Rincian pemasukan dan pengeluaran GKPI Sinode tiap bulan, terbuka untuk jemaat —
              lengkap dengan riwayat setiap perubahannya.
            </p>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex items-center gap-3 text-text-secondary text-sm">
              <div className="h-5 w-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
              Memuat data keuangan...
            </div>
          ) : !latestReport ? (
            <div className="rounded-3xl border border-border/60 bg-surface/40 p-8 text-center">
              <Scale size={32} className="mx-auto text-text-secondary/50 mb-3" />
              <p className="text-sm text-text-secondary">Belum ada laporan keuangan yang dipublikasikan.</p>
            </div>
          ) : (
            <ScrollReveal>
              <div className="rounded-3xl border border-border/60 bg-surface/40 p-6 backdrop-blur-xl md:p-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="shrink-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                      Saldo Kas &middot; {getMonthNameID(latestReport.month)} {latestReport.year}
                    </p>
                    <p
                      className={`mt-1 text-4xl font-bold tracking-tight sm:text-5xl ${
                        latestReport.ending_balance >= 0 ? "text-primary" : "text-accent"
                      }`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {formatRupiah(latestReport.ending_balance)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <TrendingUp size={14} className="text-primary" />
                        Pemasukan {formatRupiah(latestReport.total_income)}
                      </span>
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <TrendingDown size={14} className="text-accent" />
                        Pengeluaran {formatRupiah(latestReport.total_expense)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <MonthlyTrendChart data={monthlyTrend} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Toolbar + daftar laporan per tahun */}
      <section className="relative mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bulan atau tahun..."
                className="w-full rounded-xl border border-border bg-surface/40 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary/60 outline-none transition-all focus:border-accent/40 focus:bg-surface"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "Semua" ? "Semua" : Number(e.target.value))}
              className="rounded-xl border border-border bg-surface/40 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 cursor-pointer"
            >
              <option value="Semua">Semua Tahun</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </ScrollReveal>

        {!isLoading && yearGroups.length === 0 && (
          <ScrollReveal>
            <div className="my-16 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-border/40 bg-surface/20">
              <FileText size={40} className="text-text-secondary mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-text-primary">Tidak ada laporan ditemukan</h3>
              <p className="text-sm text-text-secondary mt-1">Coba kata kunci atau tahun lain.</p>
            </div>
          </ScrollReveal>
        )}

        <div className="space-y-10">
          {yearGroups.map(([year, yearReports]) => {
            const yearIncome = yearReports.reduce((s, r) => s + r.total_income, 0);
            const yearExpense = yearReports.reduce((s, r) => s + r.total_expense, 0);
            return (
              <ScrollReveal key={year}>
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                    <h2
                      className="text-lg font-bold text-text-primary"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Tahun {year}
                    </h2>
                    <div className="flex gap-4 text-xs">
                      <span className="text-primary font-semibold">Masuk {formatRupiah(yearIncome)}</span>
                      <span className="text-accent font-semibold">Keluar {formatRupiah(yearExpense)}</span>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-border/60 divide-y divide-border/50">
                    {yearReports.map((report) => {
                      const isOpen = expandedId === report.id;
                      const income = report.entries.filter((e) => e.type === "income");
                      const expense = report.entries.filter((e) => e.type === "expense");
                      const history = historyCache[report.id] ?? [];

                      return (
                        <div key={report.id} className="bg-surface/20">
                          <button
                            onClick={() => toggleExpand(report.id)}
                            className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface/40 cursor-pointer"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <ChevronDown
                                size={16}
                                className={`shrink-0 text-text-secondary transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-text-primary truncate">
                                  {getMonthNameID(report.month)} {report.year}
                                </p>
                                <p className="text-xs text-text-secondary truncate mt-0.5">{report.title}</p>
                              </div>
                            </div>
                            <p
                              className={`shrink-0 text-sm font-bold ${
                                report.ending_balance >= 0 ? "text-primary" : "text-accent"
                              }`}
                            >
                              {formatRupiah(report.ending_balance)}
                            </p>
                          </button>

                          {isOpen && (
                            <div className="border-t border-border/50 bg-background/40 p-5 space-y-6">
                              {report.summary && (
                                <p className="text-sm text-text-secondary italic border-l-2 border-primary/20 pl-4">
                                  {report.summary}
                                </p>
                              )}

                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
                                    Pemasukan
                                  </p>
                                  <ul className="space-y-1.5">
                                    {income.map((e, i) => (
                                      <li key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-text-secondary">
                                          {e.category} &middot; {e.label}
                                        </span>
                                        <span className="font-semibold text-text-primary shrink-0 ml-2">
                                          {formatRupiah(e.amount)}
                                        </span>
                                      </li>
                                    ))}
                                    {income.length === 0 && (
                                      <li className="text-xs text-text-secondary/60 italic">Tidak ada rincian.</li>
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-2">
                                    Pengeluaran
                                  </p>
                                  <ul className="space-y-1.5">
                                    {expense.map((e, i) => (
                                      <li key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-text-secondary">
                                          {e.category} &middot; {e.label}
                                        </span>
                                        <span className="font-semibold text-text-primary shrink-0 ml-2">
                                          {formatRupiah(e.amount)}
                                        </span>
                                      </li>
                                    ))}
                                    {expense.length === 0 && (
                                      <li className="text-xs text-text-secondary/60 italic">Tidak ada rincian.</li>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              {report.file_url && (
                                <a
                                  href={report.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-2 text-xs font-bold text-accent hover:bg-accent/10 transition-all"
                                >
                                  <Download size={14} /> Unduh Dokumen Laporan
                                </a>
                              )}

                              <div className="pt-4 border-t border-border/40">
                                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-3">
                                  <History size={12} /> Riwayat Perubahan
                                </p>
                                {loadingHistoryId === report.id ? (
                                  <p className="text-xs text-text-secondary">Memuat riwayat...</p>
                                ) : history.length === 0 ? (
                                  <p className="text-xs text-text-secondary/70 italic">Belum ada riwayat.</p>
                                ) : (
                                  <ol className="space-y-2.5">
                                    {history.map((log) => (
                                      <li key={log.id} className="flex items-start gap-2.5 text-xs">
                                        <span
                                          className={`mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 font-bold uppercase tracking-wide text-[9px] ${
                                            log.action === "created"
                                              ? "border-success/20 bg-success/10 text-success"
                                              : "border-primary/20 bg-primary/10 text-primary"
                                          }`}
                                        >
                                          {log.action === "created" ? "Dibuat" : "Diubah"}
                                        </span>
                                        <span className="text-text-secondary">
                                          <span className="font-semibold text-text-primary">
                                            {log.changed_by_name ?? "Admin"}
                                          </span>{" "}
                                          &mdash;{" "}
                                          {new Date(log.changed_at).toLocaleString("id-ID", {
                                            dateStyle: "long",
                                            timeStyle: "short",
                                          })}
                                        </span>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}