
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ProductTable from "@/components/admin/ProductTable";
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, orderBy("name", "asc"));
      const productsSnapshot = await getDocs(q);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
      toast({
        title: "Gagal Memuat Produk",
        description: "Terjadi kesalahan saat mengambil data dari database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola semua produk di toko Anda.</p>
        </div>
        <Button asChild>
          <Link href="/admin/produk/form">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Produk Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua produk yang tersedia di toko Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <ProductTable products={products} onDataChange={fetchProducts} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
