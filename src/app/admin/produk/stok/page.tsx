
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import StockTable from '@/components/admin/StockTable';

type StockStatusFilter = 'all' | 'inStock' | 'lowStock' | 'outOfStock';

export default function AdminStokPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter(product => {
        // Filter by search term
        if (searchTerm) {
          const lowerCaseSearch = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(lowerCaseSearch) ||
            product.brand.toLowerCase().includes(lowerCaseSearch) ||
            product.category.toLowerCase().includes(lowerCaseSearch)
          );
        }
        return true;
      })
      .filter(product => {
        // Filter by stock status
        if (statusFilter === 'all') {
          return true;
        }
        const stock = product.stock ?? 0;
        if (statusFilter === 'inStock') {
          return stock > 10;
        }
        if (statusFilter === 'lowStock') {
          return stock > 0 && stock <= 10;
        }
        if (statusFilter === 'outOfStock') {
          return stock === 0;
        }
        return true;
      });
  }, [searchTerm, statusFilter]);

  const getFilteredCount = (filter: StockStatusFilter): number => {
     if (filter === 'all') return mockProducts.length;
     return mockProducts.filter(p => {
        const stock = p.stock ?? 0;
        if (filter === 'inStock') return stock > 10;
        if (filter === 'lowStock') return stock > 0 && stock <= 10;
        if (filter === 'outOfStock') return stock === 0;
        return false;
     }).length;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manajemen Stok</h1>
        <p className="text-muted-foreground">Lacak dan kelola inventaris produk Anda.</p>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Daftar Stok Produk</CardTitle>
                <CardDescription>Pencarian, filter, dan perbarui stok produk Anda di sini.</CardDescription>
              </div>
              <div className="relative md:w-auto w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari produk..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>
        </CardHeader>
        <CardContent>
           <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StockStatusFilter)}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="all">Semua ({getFilteredCount('all')})</TabsTrigger>
              <TabsTrigger value="inStock">Tersedia ({getFilteredCount('inStock')})</TabsTrigger>
              <TabsTrigger value="lowStock">Stok Rendah ({getFilteredCount('lowStock')})</TabsTrigger>
              <TabsTrigger value="outOfStock">Habis ({getFilteredCount('outOfStock')})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <StockTable products={filteredProducts} />
            </TabsContent>
            <TabsContent value="inStock">
              <StockTable products={filteredProducts} />
            </TabsContent>
            <TabsContent value="lowStock">
              <StockTable products={filteredProducts} />
            </TabsContent>
            <TabsContent value="outOfStock">
              <StockTable products={filteredProducts} />
            </TabsContent>
          </Tabs>
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
