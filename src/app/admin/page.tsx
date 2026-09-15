import { getAllPublications } from "@/lib/publications";
import { getAllProducts } from "@/lib/products";
import { getAllJemaat } from "@/data/jemaat";
import { getAllFinancialReportsAdmin } from "@/lib/laporan-keuangan";
import AdminAnalyticsView from "@/components/admin/AdminAnalyticsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pusat Analitik & Statistik Eksekutif | Admin Sinode GKPI",
  description: "Panel kendali statistik terpadu jangkauan pembaca, audio renungan, kinerja departemen, sebaran gereja, dan inventori toko Sinode GKPI.",
};

export default async function AdminDashboardPage() {
  const [publications, products, churches, financialReports] = await Promise.all([
    getAllPublications(),
    getAllProducts(),
    getAllJemaat(),
    getAllFinancialReportsAdmin(),
  ]);

  return (
    <AdminAnalyticsView
      publications={publications}
      products={products}
      churches={churches}
      financialReports={financialReports}
    />
  );
}
