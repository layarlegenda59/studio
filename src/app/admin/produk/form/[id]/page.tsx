
"use client";

import ProductForm from '@/components/admin/ProductForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound, useParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productDocRef = doc(db, 'products', id);
          const productSnap = await getDoc(productDocRef);

          if (productSnap.exists()) {
            setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
          } else {
            toast({
              title: "Produk Tidak Ditemukan",
              variant: "destructive",
            });
            notFound();
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Gagal Memuat Produk",
            description: "Terjadi kesalahan saat mengambil data dari database.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, toast]);

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
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    // This case will be handled by notFound(), but as a fallback.
    return <div>Produk tidak ditemukan.</div>;
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
