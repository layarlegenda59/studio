
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromoCarousel from '@/components/PromoCarousel';
import ProductGrid from '@/components/ProductGrid';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShippingCalculator from '@/components/ShippingCalculator';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';
import Footer from '@/components/Footer';
import { mockProducts, mockPromotions } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface FilterState {
  categories: string[];
  sizes: string[];
  gender: string;
  priceRange: [number, number];
  promoOnly: boolean;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    gender: "Unisex",
    priceRange: [0, 2000000],
    promoOnly: false,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();

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

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const isWishlisted = prevItems.find(item => item.id === product.id);
      if (isWishlisted) {
        toast({
          title: "Wishlist Diperbarui",
          description: `${product.name} telah dihapus dari wishlist.`,
        });
        return prevItems.filter(item => item.id !== product.id);
      } else {
        toast({
          title: "Wishlist Diperbarui",
          description: `${product.name} telah ditambahkan ke wishlist.`,
        });
        return [...prevItems, product];
      }
    });
  };

  const handleRemoveFromWishlistById = (productId: string) => {
    const itemToRemove = wishlistItems.find(item => item.id === productId);
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (itemToRemove) {
      toast({
        title: "Wishlist Diperbarui",
        description: `${itemToRemove.name} telah dihapus dari wishlist.`,
      });
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlistById}
      />
      <main className="flex-grow">
        <PromoCarousel promotions={mockPromotions} />
        
        <div className="container mx-auto px-4 py-8">
          <section id="products" className="w-full mb-12">
            <h2 className="text-3xl font-headline mb-6 text-center">Kamu Mungkin Suka Produk Ini 🥰</h2>
            <ProductGrid 
              products={filteredProducts} 
              onToggleWishlist={handleToggleWishlist}
              wishlistItems={wishlistItems}
            />
          </section>

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
      <Footer />
      <style jsx global>{`
        .shadow-text {
          text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
