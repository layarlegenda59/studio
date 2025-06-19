
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPromoBannerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Banner Homepage</h1>
        <p className="text-muted-foreground">Atur konten promo slider di halaman utama.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Banner</CardTitle>
          <CardDescription>Placeholder untuk CRUD banner.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Manajemen banner akan ditampilkan di sini. (Dalam Pengembangan)
          </p>
           <div className="flex justify-start">
            <Button>Tambah Banner Baru</Button>
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
