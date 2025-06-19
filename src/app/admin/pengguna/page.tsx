
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPenggunaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">Lihat daftar pelanggan dan admin.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Placeholder untuk daftar pengguna (pelanggan dan admin).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Tabel pengguna akan ditampilkan di sini. (Dalam Pengembangan)
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
