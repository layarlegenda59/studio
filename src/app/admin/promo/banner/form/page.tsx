import BannerForm from '@/components/admin/BannerForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddBannerPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Tambah Banner Baru</h1>
        <p className="text-muted-foreground">Isi formulir untuk menambahkan banner promo baru di homepage.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Banner</CardTitle>
          <CardDescription>
            Pastikan semua informasi terisi dengan benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm />
        </CardContent>
      </Card>
    </div>
  );
}
