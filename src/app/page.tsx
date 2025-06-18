
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromoCarousel from '@/components/PromoCarousel';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters, { type FilterState } from '@/components/ProductFilters';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShippingCalculator from '@/components/ShippingCalculator';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';
import Footer from '@/components/Footer'; // Import the new Footer
import { mockProducts, mockPromotions } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    gender: "Unisex",
    priceRange: [0, 2000000],
    promoOnly: false,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    let productsToFilter = [...mockProducts];

    if (filters.categories.length > 0) {
      productsToFilter = productsToFilter.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    if (filters.sizes.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }
    
    if (filters.gender !== "Unisex") {
         productsToFilter = productsToFilter.filter(product => product.gender === filters.gender || product.gender === "Unisex");
    }


    productsToFilter = productsToFilter.filter(product => {
      const price = product.promoPrice ?? product.originalPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.promoOnly) {
      productsToFilter = productsToFilter.filter(product => product.isPromo);
    }

    setFilteredProducts(productsToFilter);
  }, [filters]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PromoCarousel promotions={mockPromotions} />
        
        <div className="container mx-auto px-4 py-8">
          <div id="products" className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center py-3">
                  <SlidersHorizontal className="mr-2 h-5 w-5" /> 
                  <span className="text-base">Filter Produk</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="font-headline text-lg">Filter Produk</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <ProductFilters onFilterChange={handleFilterChange} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col lg:flex-row gap-x-8">
            <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 space-y-6 sticky top-[calc(4rem+1px)] h-[calc(100vh-4rem-2px-48px)] overflow-y-auto pr-4 pb-6 custom-scrollbar">
              {/* Sticky top calculation: header height (4rem = 64px) + 1px border + some padding */}
              <h2 className="text-2xl font-headline mb-4 pt-1">Filter Produk</h2>
              <ProductFilters onFilterChange={handleFilterChange} />
            </aside>
            
            <section className="lg:w-3/4 xl:w-4/5">
              <h2 className="text-3xl font-headline mb-6">Produk Pilihan</h2>
              <ProductGrid products={filteredProducts} />
            </section>
          </div>

          <section id="shipping-calculator" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
            <h2 className="text-3xl font-headline mb-8 text-center">Hitung Ongkos Kirim</h2>
            <ShippingCalculator />
          </section>

          <section id="whatsapp-order" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
            <h2 className="text-3xl font-headline mb-8 text-center">Pesan Cepat via WhatsApp</h2>
            <WhatsAppOrderForm />
          </section>
        </div>
      </main>
      <WhatsAppButton phoneNumber="+6281234567890" /> {/* Replace with actual number */}
      <Footer /> {/* Use the new Footer component */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--secondary) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--secondary));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
        .shadow-text {
          text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
