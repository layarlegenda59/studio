
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function ProductIndexPage() {
  // Dummy state for Header props, similar to product detail page
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());

  const handleRemoveFromHeaderWishlist = (productId: string) => {
    setHeaderWishlistItems(prev => prev.filter(p => p.id !== productId));
  };

  const handleToggleCartFromHeaderWishlist = (productId: string) => {
    setHeaderCartItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const sortedProducts = [...mockProducts].sort((a, b) => a.name.localeCompare(b.name));

  const groupedProducts = sortedProducts.reduce((acc, product) => {
    const firstLetter = product.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const alphabet = Object.keys(groupedProducts).sort();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Indeks Produk</h1>
        <p className="text-muted-foreground mb-8">Temukan semua produk kami yang diurutkan berdasarkan abjad.</p>
        
        <div className="sticky top-16 bg-background/80 backdrop-blur-sm z-10 py-4 mb-8 border-b">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            {alphabet.map(letter => (
              <a 
                key={letter} 
                href={`#letter-${letter}`} 
                className="w-8 h-8 flex items-center justify-center text-sm font-bold rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {alphabet.map(letter => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
              <h2 className="text-3xl font-headline font-semibold text-primary mb-4 pb-2 border-b-2 border-primary inline-block">{letter}</h2>
              <ul className="space-y-3">
                {groupedProducts[letter].map(product => (
                  <li key={product.id}>
                    <Link href={`/products/${product.id}`} className="text-base text-foreground hover:text-primary hover:underline transition-colors">
                      {product.name}
                      <span className="text-sm text-muted-foreground ml-2">({product.brand})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
