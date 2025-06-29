
"use client";

import React, { useState, useEffect, useCallback, type FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockCategories } from '@/lib/adminMockData';
import { mockProducts } from '@/lib/mockData';
import type { AdminCategory } from '@/lib/types';

export default function AdminKategoriProdukPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<AdminCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const updateCategories = useCallback(() => {
    // Recalculate product counts every time
    const updatedMockCategories = mockCategories.map(cat => ({
      ...cat,
      productCount: mockProducts.filter(p => p.category === cat.name).length,
    }));
    setCategories(updatedMockCategories);
  }, []);

  useEffect(() => {
    updateCategories();
  }, [updateCategories]);

  const handleOpenForm = (category: AdminCategory | null) => {
    setCategoryToEdit(category);
    setCategoryName(category ? category.name : '');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCategoryToEdit(null);
    setCategoryName('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({
        title: "Nama Kategori Kosong",
        description: "Nama kategori tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }

    if (categoryToEdit) {
      // Edit existing category
      const categoryIndex = mockCategories.findIndex(c => c.id === categoryToEdit.id);
      if (categoryIndex !== -1) {
        // Update products with the old category name to the new one
        const oldName = mockCategories[categoryIndex].name;
        mockProducts.forEach(p => {
            if (p.category === oldName) {
                p.category = categoryName;
            }
        });
        mockCategories[categoryIndex].name = categoryName;
        toast({ title: "Sukses", description: "Kategori berhasil diperbarui." });
      }
    } else {
      // Add new category
      const newCategory: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        productCount: 0,
      };
      mockCategories.push(newCategory);
      toast({ title: "Sukses", description: "Kategori baru berhasil ditambahkan." });
    }
    
    updateCategories();
    handleCloseForm();
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    if (categoryToDelete.productCount > 0) {
      toast({
        title: "Gagal Menghapus",
        description: `Tidak dapat menghapus kategori "${categoryToDelete.name}" karena masih ada produk yang terkait.`,
        variant: "destructive",
      });
      setCategoryToDelete(null);
      return;
    }

    const indexToDelete = mockCategories.findIndex(c => c.id === categoryToDelete.id);
    if (indexToDelete > -1) {
      mockCategories.splice(indexToDelete, 1);
      toast({ title: "Sukses", description: `Kategori "${categoryToDelete.name}" telah dihapus.` });
      updateCategories();
    }
    setCategoryToDelete(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">Kategori Produk</h1>
            <p className="text-muted-foreground">Kelola kategori dan subkategori produk.</p>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kategori Baru
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
            <CardDescription>Berikut adalah semua kategori yang ada di toko Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead className="text-center">Jumlah Produk</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-center">{category.productCount}</TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => handleOpenForm(category)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setCategoryToDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Hapus</span>
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Belum ada kategori. Silakan tambahkan satu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onEscapeKeyDown={handleCloseForm} onPointerDownOutside={handleCloseForm} className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{categoryToEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
              <DialogDescription>
                {categoryToEdit ? `Mengubah nama kategori "${categoryToEdit.name}".` : "Masukkan nama untuk kategori baru Anda."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
               Anda akan menghapus kategori <span className="font-semibold">{categoryToDelete?.name}</span>.
              {categoryToDelete && categoryToDelete.productCount > 0 && <span className="font-bold text-destructive block mt-2">Peringatan: Kategori ini masih memiliki {categoryToDelete.productCount} produk dan tidak dapat dihapus.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={!!(categoryToDelete && categoryToDelete.productCount > 0)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
