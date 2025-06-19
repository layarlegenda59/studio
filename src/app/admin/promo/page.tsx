
// This page can serve as a redirect or an overview for promo sub-sections
// For now, let's make it a simple placeholder redirecting mentally to sub-pages.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPromoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Konten & Promo</h1>
        <p className="text-muted-foreground">Pilih sub-menu untuk mengelola banner atau diskon.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <CardTitle>Manajemen Banner Homepage</CardTitle>
                <CardDescription>Atur gambar dan teks promo yang tampil di slider halaman utama.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/admin/promo/banner">Kelola Banner</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <CardTitle>Kelola Diskon Produk</CardTitle>
                <CardDescription>Buat dan atur promo diskon untuk produk tertentu atau kategori.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/admin/promo/diskon">Kelola Diskon</Link>
                </Button>
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
