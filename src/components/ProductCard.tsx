
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const DiscountTagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive h-3.5 w-3.5">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

interface ProductCardProps {
  product: Product;
  onToggleWishlist: (product: Product) => void;
  wishlisted: boolean;
}

export default function ProductCard({ product, onToggleWishlist, wishlisted }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const discountPercentage = product.promoPrice
    ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)
    : 0;

  const handleSizeClick = (size: string) => {
    console.log(`Ukuran dipilih: ${size} untuk produk ${product.name}`);
  };

  return (
    <Card className="group w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${product.category.toLowerCase()} fashion`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-sm text-foreground truncate" title={product.brand}>{product.brand}</p>
            <h3 
              className="text-base font-semibold text-foreground mt-0.5 truncate group-hover:text-primary transition-colors" 
              title={product.name}
            >
              {product.name}
            </h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 shrink-0 -mr-1 -mt-1"
            onClick={() => onToggleWishlist(product)}
            aria-label={wishlisted ? `Hapus ${product.name} dari wishlist` : `Tambah ${product.name} ke wishlist`}
          >
            <Heart className={cn("h-4 w-4", wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-destructive")} />
          </Button>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1.5">Ukuran:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="h-7 px-2.5 text-xs rounded-sm"
                  onClick={() => handleSizeClick(size)}
                  aria-label={`Pilih ukuran ${size}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2">
          {product.promoPrice ? (
            <>
              <div className="inline-flex items-center gap-1 rounded-sm border border-destructive px-1.5 py-0.5 bg-destructive/5">
                <DiscountTagIcon />
                <p className="text-sm font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                {discountPercentage > 0 && (
                  <p className="text-xs text-destructive/90 font-medium">-{discountPercentage}%</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-2">
        <Button variant="outline" className="w-full h-9 text-sm">
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
