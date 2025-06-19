
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// Badge removed as it's not used for image overlay anymore
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';

// Specific tag icon from the image (simplified)
const DiscountTagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive h-3.5 w-3.5">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const discountPercentage = product.promoPrice
    ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)
    : 0;

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
        {/* Promo badge on image removed to match the target image style */}
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs text-foreground truncate" title={product.brand}>{product.brand}</p>
            <h3 
              className="text-sm font-semibold text-foreground mt-0.5 truncate group-hover:text-primary transition-colors" 
              title={product.name}
            >
              {product.name}
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1 -mt-1 text-muted-foreground hover:text-destructive">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
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
      {/* CardFooter and its content (like "Lihat Detail" button) are removed to match the new style */}
    </Card>
  );
}
