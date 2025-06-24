
"use client";

import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
}

export default function ProductGrid({ products, onToggleWishlist, wishlistItems }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Tidak ada produk yang ditemukan.</p>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onToggleWishlist={onToggleWishlist}
          wishlisted={wishlistItems.some(item => item.id === product.id)}
        />
      ))}
    </div>
  );
}
