
"use client";

import ProductForm from '@/components/admin/ProductForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockProducts } from '@/lib/mockData';
import { notFound, useParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only process when the `id` is available from `useParams`.
    if (id) {
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // This might happen if the user navigates to a non-existent product ID
        // or if the data from localStorage hasn't loaded yet.
        // A robust solution would wait for data to be confirmed loaded.
        console.warn(`Product with id "${id}" not found in mockProducts.`);
        // To avoid flashing a not found, we can wait a bit, but for now, we'll assume it's a real 404.
        notFound();
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
        <Card className="shadow-lg">
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                         <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    // This case will likely lead to notFound(), but as a fallback.
    return <div>Produk tidak ditemukan. Mungkin Anda perlu memuat ulang.</div>;
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
