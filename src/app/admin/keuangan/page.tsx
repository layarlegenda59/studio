
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export default function AdminKeuanganPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Laporan Keuangan</h1>
        <p className="text-muted-foreground">Ringkasan pendapatan, pengeluaran, dan laba.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 75.500.000</div>
            <p className="text-xs text-muted-foreground">Dari pesanan terkonfirmasi "Dikirim"</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
             <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 22.000.000</div>
            <p className="text-xs text-muted-foreground">Restock, promo, operasional</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Laba Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 53.500.000</div>
             <p className="text-xs text-muted-foreground">Total Pendapatan - Total Pengeluaran</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Detail Laporan</CardTitle>
            <CardDescription>Input manual untuk pengeluaran dan ekspor laporan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground py-8">
                Form input pengeluaran & tabel detail transaksi akan ada di sini. (Dalam Pengembangan)
            </p>
            <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Ekspor Laporan ke PDF (Segera Hadir)
            </Button>
        </CardContent>
      </Card>
       <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
