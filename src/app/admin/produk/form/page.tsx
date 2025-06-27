
// src/app/admin/produk/form/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddProductPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Tambah Produk Baru</h1>
        <p className="text-muted-foreground">Isi formulir di bawah ini untuk menambahkan produk baru ke toko Anda.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Produk</CardTitle>
          <CardDescription>
            Pastikan semua informasi produk terisi dengan benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
