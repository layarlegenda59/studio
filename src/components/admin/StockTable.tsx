
"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import type { Product } from "@/lib/types";
import { Pencil } from 'lucide-react';

interface StockTableProps {
  products: Product[];
}

export default function StockTable({ products }: StockTableProps) {
  
  const getStatusBadge = (stock: number) => {
    if (stock > 10) {
      return <Badge variant="default">Tersedia</Badge>;
    } else if (stock > 0 && stock <= 10) {
      return <Badge variant="secondary" className="bg-orange-400 text-white hover:bg-orange-500">Stok Rendah</Badge>;
    } else {
      return <Badge variant="destructive">Habis</Badge>;
    }
  };

  if (products.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Tidak ada produk yang cocok dengan filter Anda.</p>
        </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[80px] sm:table-cell">Gambar</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead className="text-center">Stok</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={product.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={product.imageUrl}
                  width="64"
                  data-ai-hint="product image"
                />
              </TableCell>
              <TableCell className="font-medium">
                {product.name}
                <div className="text-xs text-muted-foreground">{product.brand}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{product.category}</TableCell>
              <TableCell className="text-center font-semibold">{product.stock ?? 0}</TableCell>
              <TableCell className="text-center">
                {getStatusBadge(product.stock ?? 0)}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/produk/form/${product.id}`}>
                    <Pencil className="mr-2 h-3 w-3" />
                    Update
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
