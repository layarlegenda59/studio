"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { mockPromotions } from '@/lib/mockData';
import type { Promotion } from '@/lib/types';

export default function AdminPromoBannerPage() {
  const { toast } = useToast();
  // Initialize state from the mutable mock data source. This ensures it's fresh on mount/navigation.
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [bannerToDelete, setBannerToDelete] = useState<Promotion | null>(null);

  useEffect(() => {
    setPromotions([...mockPromotions]);
  }, []);


  const handleDelete = () => {
    if (!bannerToDelete) return;

    // Find the index and remove from the original mock data array
    const indexToDelete = mockPromotions.findIndex(p => p.id === bannerToDelete.id);
    if (indexToDelete > -1) {
      mockPromotions.splice(indexToDelete, 1);
    }

    // Update the local state to trigger a re-render, ensuring UI consistency
    setPromotions(currentPromotions => currentPromotions.filter(p => p.id !== bannerToDelete.id));
    
    toast({
      title: "Banner Dihapus",
      description: `Banner "${bannerToDelete.title}" telah berhasil dihapus.`,
    });

    setBannerToDelete(null); // Close the dialog
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">Manajemen Banner Homepage</h1>
            <p className="text-muted-foreground">Atur konten promo slider di halaman utama.</p>
          </div>
          <Button asChild>
            <Link href="/admin/promo/banner/form">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Banner Baru
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <Card key={promo.id} className="shadow-lg flex flex-col bg-card">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full overflow-hidden rounded-t-lg">
                   <Image
                      src={promo.imageUrl}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint="fashion sale"
                    />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-headline leading-tight">{promo.title}</CardTitle>
                <CardDescription className="mt-2 text-sm line-clamp-3">{promo.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t p-3">
                 <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/promo/banner/form/${promo.id}`}>
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setBannerToDelete(promo)}>
                    <Trash2 className="mr-2 h-3 w-3" />
                    Hapus
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {promotions.length === 0 && (
            <Card className="shadow-lg">
                <CardContent>
                    <p className="text-center text-muted-foreground py-16">
                        Tidak ada banner yang ditampilkan. Silakan tambahkan banner baru.
                    </p>
                </CardContent>
            </Card>
        )}

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!bannerToDelete} onOpenChange={(open) => !open && setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
               Tindakan ini tidak dapat dibatalkan. Anda akan menghapus banner
               <span className="font-semibold"> "{bannerToDelete?.title}"</span> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
