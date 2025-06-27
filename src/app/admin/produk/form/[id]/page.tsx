
// src/app/admin/produk/form/[id]/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockProducts } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Edit Produk</h1>
        <p className="text-muted-foreground">Perbarui detail untuk produk: <span className="font-semibold">{product.name}</span></p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Produk</CardTitle>
          <CardDescription>
            Ubah informasi produk di bawah ini dan klik simpan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
    </div>
  );
}
