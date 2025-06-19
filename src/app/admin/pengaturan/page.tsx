
// src/app/admin/pengaturan/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPengaturanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Pengaturan Umum</h1>
        <p className="text-muted-foreground">Konfigurasi umum untuk aplikasi dan dasbor admin.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pengaturan Toko</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Form pengaturan toko (nama toko, kontak, dll) akan ada di sini. (Dalam Pengembangan)
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pengaturan Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Pengaturan spesifik admin (notifikasi, dll) akan ada di sini. (Dalam Pengembangan)
          </p>
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
