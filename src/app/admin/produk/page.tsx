
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ProductTable from "@/components/admin/ProductTable";
import { mockProducts } from "@/lib/mockData";
import type { Product } from '@/lib/types';

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleDataChange = useCallback(() => {
    // Force re-render with the latest data from the mutated mock array
    setProducts([...mockProducts]);
  }, []);

  useEffect(() => {
    // Load initial data and ensure it's fresh on mount
    handleDataChange();
  }, [handleDataChange]);

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
          <ProductTable products={products} onDataChange={handleDataChange} />
        </CardContent>
      </Card>
    </div>
  );
}
