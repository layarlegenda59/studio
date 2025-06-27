
"use client";

import React, { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Product } from "@/lib/types";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDelete = () => {
    if (!productToDelete) return;

    // In a real app, you would make an API call to delete the product
    console.log(`Deleting product: ${productToDelete.name}`);
    
    toast({
      title: "Produk Dihapus",
      description: `Produk "${productToDelete.name}" telah berhasil dihapus.`,
    });

    setProductToDelete(null); // Close dialog
  };
  
  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Gambar</span>
              </TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Harga</TableHead>
              <TableHead className="hidden md:table-cell">Stok</TableHead>
              <TableHead>
                <span className="sr-only">Aksi</span>
              </TableHead>
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
                  <div className="text-xs text-muted-foreground">{product.brand} - {product.category}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock && product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock && product.stock > 0 ? 'Tersedia' : 'Habis'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {product.promoPrice ? (
                        <div className='flex flex-col'>
                            <span className='font-semibold'>{formatPrice(product.promoPrice)}</span>
                            <span className='text-xs line-through text-muted-foreground'>{formatPrice(product.originalPrice)}</span>
                        </div>
                    ) : (
                        formatPrice(product.originalPrice)
                    )}
                </TableCell>
                <TableCell className="hidden md:table-cell">{product.stock ?? 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                         <Link href={`/admin/produk/form/${product.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setProductToDelete(product)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk
              <span className="font-semibold"> {productToDelete?.name} </span>
              secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
