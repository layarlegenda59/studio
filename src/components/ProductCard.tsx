
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Heart, Tag } from 'lucide-react';
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
    <Card className="group w-full overflow-hidden rounded-lg shadow-sm border flex flex-col h-full bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
                {/* Discount badges remain as they were, per user request. */}
                {discountPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 bg-black text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{discountPercentage}% OFF</span>
                    </div>
                )}
                 {product.isPromo && !discountPercentage && (
                    <div className="absolute top-2 right-2 bg-yellow-300 text-black text-[9px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm">
                        ⚡️ Terbaru
                    </div>
                )}
                 <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 text-foreground/80 backdrop-blur-sm transition-opacity duration-300 md:opacity-0 group-hover:opacity-100 hover:bg-background"
                    onClick={handleWishlistClick}
                    aria-label={wishlisted ? `Hapus ${product.name} dari wishlist` : `Tambah ${product.name} ke wishlist`}
                >
                    <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
                </Button>
            </div>
            <CardContent className="p-3 flex-grow flex flex-col bg-background">
                <div className="flex-grow mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
                    <h3 className="text-sm font-medium text-foreground truncate mt-0.5" title={product.name}>
                        {product.name}
                    </h3>
                  <div className="mt-2">
                      {product.promoPrice ? (
                          <div className="flex items-baseline gap-1.5">
                              <p className="text-base font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
                              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                          </div>
                      ) : (
                          <p className="text-base font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
                      )}
                  </div>
                </div>
                <div className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground pointer-events-none">
                        Lihat Detail
                    </Button>
                </div>
            </CardContent>
        </Link>
    </Card>
  );
}
