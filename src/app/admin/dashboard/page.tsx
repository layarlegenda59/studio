
// src/app/admin/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Admin Dashboard</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Selamat datang di panel admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center">
            Ini adalah halaman dashboard admin placeholder. Anda dapat menambahkan konten dan fungsionalitas admin di sini.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">Kembali ke Halaman Utama</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
