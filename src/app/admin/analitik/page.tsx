
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart, BarChart3, Users, Search } from 'lucide-react'; // Placeholder for chart icons

export default function AdminAnalitikPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Analitik Toko</h1>
        <p className="text-muted-foreground">Pahami performa toko Anda melalui data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Produk Terpopuler</CardTitle>
            <CardDescription>Top Viewed, Top Sold, Most Wishlisted</CardDescription>
          </CardHeader>
          <CardContent className="h-64 bg-muted rounded-md flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Grafik Produk akan ditampilkan di sini. (Dalam Pengembangan)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Kata Kunci Pencarian</CardTitle>
            <CardDescription>Pencarian paling populer oleh pengunjung</CardDescription>
          </CardHeader>
          <CardContent className="h-64 bg-muted rounded-md flex items-center justify-center">
            <Search className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Analisis Pencarian akan ditampilkan di sini. (Dalam Pengembangan)</p>
          </CardContent>
        </Card>
      </div>
       <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
