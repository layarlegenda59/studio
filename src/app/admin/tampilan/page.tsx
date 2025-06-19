
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode-toggle" disabled />
            <Label htmlFor="dark-mode-toggle">Mode Gelap (Segera Hadir)</Label>
          </div>
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
