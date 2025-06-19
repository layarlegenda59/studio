
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminProdukPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Produk</h1>
        <p className="text-muted-foreground">Kelola semua produk di toko Anda.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Placeholder untuk tabel daftar produk dengan CRUD.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Tabel produk akan ditampilkan di sini. (Dalam Pengembangan)
          </p>
          <div className="flex justify-start">
            <Button>Tambah Produk Baru</Button>
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
