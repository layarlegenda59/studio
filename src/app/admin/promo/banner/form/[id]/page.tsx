import BannerForm from '@/components/admin/BannerForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockPromotions } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface EditBannerPageProps {
  params: {
    id: string;
  };
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = params;
  const promotion = mockPromotions.find(p => p.id === id);

  if (!promotion) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Edit Banner</h1>
        <p className="text-muted-foreground">Perbarui detail untuk banner: <span className="font-semibold">{promotion.title}</span></p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Banner</CardTitle>
          <CardDescription>
            Ubah informasi di bawah ini dan klik simpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm promotion={promotion} />
        </CardContent>
      </Card>
    </div>
  );
}
