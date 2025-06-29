
"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/types';
import { Newspaper, Construction } from 'lucide-react';

export default function ThreadPage() {
  // Dummy state for Header props
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());

  const handleRemoveFromHeaderWishlist = (productId: string) => {};
  const handleToggleCartFromHeaderWishlist = (productId: string) => {};

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-primary/10 rounded-full text-primary">
              <Newspaper className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Goodstock-X THREAD</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tempat kami berbagi cerita, tren terbaru, panduan gaya, dan semua hal menarik seputar dunia fashion.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 bg-muted border border-dashed rounded-lg p-4">
            <Construction className="h-6 w-6 text-muted-foreground" />
            <p className="font-semibold text-muted-foreground">Fitur ini sedang dalam pengembangan dan akan segera hadir!</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
