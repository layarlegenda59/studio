
"use client";

import React, { useState, type FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/types';

const ADMIN_WHATSAPP_NUMBER = "+6281278262893"; 

export default function StatusOrderPage() {
  const { toast } = useToast();
  
  // Dummy state for Header props
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());
  const handleRemoveFromHeaderWishlist = (productId: string) => {};
  const handleToggleCartFromHeaderWishlist = (productId: string) => {};

  // Form state
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      toast({
        title: "Nomor Pesanan Diperlukan",
        description: "Mohon masukkan nomor pesanan atau invoice Anda.",
        variant: "destructive",
      });
      return;
    }

    const message = `Halo Admin Goodstock-X, saya ingin menanyakan status pesanan saya dengan nomor invoice: ${orderId}. Terima kasih.`;
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast({
      title: "Mengarahkan ke WhatsApp...",
      description: "Anda akan diarahkan ke WhatsApp untuk menanyakan status pesanan.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Lacak Status Pesanan</CardTitle>
              <CardDescription>Masukkan nomor pesanan atau invoice Anda untuk melanjutkan.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Nomor Pesanan / Invoice <span className="text-destructive">*</span></Label>
                  <Input 
                    id="orderId" 
                    placeholder="Contoh: INV-20240729-001" 
                    value={orderId} 
                    onChange={(e) => setOrderId(e.target.value)} 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full">
                    Cek Status via WhatsApp
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
