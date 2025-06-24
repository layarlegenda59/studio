
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

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

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <Card className="group w-full overflow-hidden rounded-none shadow-none border-0 flex flex-col h-full bg-transparent">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full cursor-pointer">
            <div className="relative">
                <div className="aspect-[2/3] w-full overflow-hidden bg-secondary/20">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={600}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={`${product.category.toLowerCase()} fashion`}
                    />
                </div>
                {discountPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-0.5">
                        {discountPercentage}% OFF
                    </div>
                )}
                 {product.isPromo && !discountPercentage && (
                    <div className="absolute top-2 right-2 bg-yellow-300 text-black text-[9px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm">
                        ⚡️ Terbaru
                    </div>
                )}
            </div>
            <CardContent className="p-2 flex-grow flex flex-col bg-background">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold uppercase truncate">{product.brand}</p>
                        <h3 className="text-xs text-muted-foreground truncate mt-0.5" title={product.name}>
                            {product.name}
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 -mr-2 text-muted-foreground hover:text-destructive"
                        onClick={handleWishlistClick}
                        aria-label={wishlisted ? `Hapus ${product.name} dari wishlist` : `Tambah ${product.name} ke wishlist`}
                    >
                        <Heart className={cn("h-5 w-5", wishlisted && "fill-destructive text-destructive")} />
                    </Button>
                </div>
                <div className="mt-auto pt-1">
                    {product.promoPrice ? (
                        <div className="flex items-baseline gap-1.5">
                             <p className="text-sm font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
                             <p className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                        </div>
                    ) : (
                        <p className="text-sm font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
                    )}
                </div>
            </CardContent>
        </Link>
    </Card>
  );
}
