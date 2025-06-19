
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart } from 'lucide-react'; // Placeholder for chart icon

export default function AdminStokPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Stok</h1>
        <p className="text-muted-foreground">Lacak alur masuk dan keluar stok produk.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pelacak Alur Stok</CardTitle>
          <CardDescription>Visualisasi perbandingan barang masuk vs. barang keluar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-64 bg-muted rounded-md flex items-center justify-center">
            <LineChart className="h-16 w-16 text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Grafik Stok akan ditampilkan di sini. (Dalam Pengembangan)</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Update Stok Manual:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button>Catat Barang Masuk</Button>
                <Button variant="outline">Catat Barang Keluar (Order)</Button>
            </div>
          </div>
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
