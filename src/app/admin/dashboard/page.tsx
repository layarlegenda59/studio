
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ShoppingCart, Package, Users, LineChart, MessageCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import OverviewCard from "@/components/admin/OverviewCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import SalesChart from "@/components/admin/SalesChart";
import { mockAdminDashboardData, mockRecentOrders, mockSalesData } from "@/lib/adminMockData";

export default function AdminDashboardPage() {
  const { summaryStats, financialOverview } = mockAdminDashboardData;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Selamat Datang, Admin!</h1>
        <p className="text-muted-foreground">Berikut adalah ringkasan aktivitas toko Anda.</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">Ringkasan Umum</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Pesanan Masuk (WA)"
            value={summaryStats.totalOrders.toString()}
            icon={MessageCircle}
            description="Sejak awal"
            trend="+5.2% dari bulan lalu" 
          />
          <OverviewCard
            title="Pesanan Dikirim"
            value={summaryStats.ordersShipped.toString()}
            icon={CheckCircle2}
            description="Bulan ini"
            trend="+10 pesanan dari minggu lalu"
            trendColor="text-green-600"
          />
          <OverviewCard
            title="Pesanan Belum Dikirim"
            value={summaryStats.ordersPending.toString()}
            icon={Clock}
            description="Perlu tindakan segera"
            trend={`${summaryStats.ordersPending > 10 ? '⚠️ Tinggi' : 'Normal'}`}
            trendColor={summaryStats.ordersPending > 10 ? "text-orange-600" : "text-muted-foreground"}
          />
          <OverviewCard
            title="Pesanan Dibatalkan"
            value={summaryStats.ordersCancelled.toString()}
            icon={AlertTriangle}
            description="Bulan ini"
            trendColor="text-red-600"
            trend="-2 dari bulan lalu"
          />
        </div>
      </section>

      <section>
         <h2 className="text-xl font-semibold mb-4 font-headline">Ringkasan Keuangan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Total Pendapatan"
            value={`Rp ${financialOverview.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Dari pesanan terkirim"
            trend="+12% dari bulan lalu"
            trendColor="text-green-600"
          />
          <OverviewCard
            title="Total Biaya"
            value={`Rp ${financialOverview.totalExpenses.toLocaleString()}`}
            icon={ShoppingCart}
            iconClassName="text-red-500"
            description="Restock & operasional"
            trend="+5% dari bulan lalu"
            trendColor="text-red-600"
          />
           <OverviewCard
            title="Laba Bersih"
            value={`Rp ${financialOverview.netProfit.toLocaleString()}`}
            icon={LineChart}
            description="Pendapatan - Biaya"
            trend={financialOverview.netProfit > 0 ? "Positif" : "Negatif"}
            trendColor={financialOverview.netProfit > 0 ? "text-green-600" : "text-red-600"}
          />
        </div>
      </section>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 font-headline">Grafik Penjualan Mingguan</h2>
          <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
              <SalesChart data={mockSalesData} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 font-headline">Aktivitas Pesanan Terkini (WA)</h2>
          <Card className="shadow-lg">
             <CardHeader>
              <CardDescription>5 pesanan terakhir yang masuk via WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentOrdersTable orders={mockRecentOrders.slice(0, 5)} />
            </CardContent>
            <CardFooter className="p-4 border-t">
                <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/admin/pesanan-wa">Lihat Semua Pesanan</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

       <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">Produk Populer</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Produk Terlaris"
            value="Sneakers Klasik Pria"
            icon={Package}
            description="Bulan ini"
            trend="120 terjual"
          />
          <OverviewCard
            title="Paling Banyak Dilihat"
            value="Tas Selempang Elegan"
            icon={Users}
            description="Minggu ini"
            trend="500+ views"
          />
           <OverviewCard
            title="Stok Rendah"
            value="Jaket Bomber Keren"
            icon={AlertTriangle}
            iconClassName="text-orange-500"
            description="Segera restock!"
            trend="Sisa 5 pcs"
            trendColor="text-orange-600"
          />
        </div>
      </section>

    </div>
  );
}
