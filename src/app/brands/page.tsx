
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const capitalizeBrandName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const allBrands = [
  "Adidas", "Air Jordan", "Asics", "Bally", "Balenciaga", "Burberry", "Calvin Klein", "Carhartt", "Chanel", 
  "Christian Louboutin", "Clarks", "Coach", "Columbia", "Converse", "Diadora", "Dior", "Dr. Martens", "Ecco", 
  "Fendi", "Ferragamo", "Fila", "Gap", "Givenchy", "Gucci", "H&m", "Hermes", "K-swiss", "Kenzo", "Lacoste", 
  "Levis", "Li-ning", "Louis Vuitton", "Mizuno", "New Balance", "Nike", "On Cloud", "Onitsuka Tiger", "Prada", 
  "Puma", "Reebok", "Salomon", "Saucony", "Skechers", "Stone Island", "The North Face", "Timberland", "Tumi", 
  "Umbro", "Under Armour", "Uniqlo", "Vans", "Versace", "Yonex"
].sort((a,b) => a.localeCompare(b));


export default function BrandsIndexPage() {
  // Dummy state for Header props
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

  const groupedBrands = allBrands.reduce((acc, brand) => {
    const firstLetter = brand[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, string[]>);

  const alphabet = Object.keys(groupedBrands).sort();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Indeks Merek</h1>
        <p className="text-muted-foreground mb-8">Temukan semua merek yang tersedia di Goodstock-X.</p>
        
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
              <ul className="space-y-3 columns-2 md:columns-3 lg:columns-4">
                {groupedBrands[letter].map(brand => (
                  <li key={brand} className="break-inside-avoid">
                    <Link href={`/?brand=${encodeURIComponent(brand)}#products`} className="text-base text-foreground hover:text-primary hover:underline transition-colors">
                      {brand}
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
