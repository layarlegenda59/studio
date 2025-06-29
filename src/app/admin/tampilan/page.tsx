import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/admin/ThemeToggle";


export default function AdminTampilanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Pengaturan Tampilan</h1>
        <p className="text-muted-foreground">Kustomisasi tampilan dasbor admin.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Mode Tampilan</CardTitle>
          <CardDescription>Pilih antara mode terang atau gelap untuk dasbor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeToggle />
           <p className="text-center text-muted-foreground py-8">
            Opsi kustomisasi tampilan lainnya akan ada di sini. (Dalam Pengembangan)
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
