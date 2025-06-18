"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
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
        {product.isPromo && (
          <Badge variant="destructive" className="absolute top-3 right-3 text-xs">
            PROMO
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-headline font-semibold mb-1 truncate group-hover:text-primary transition-colors" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{product.category} - {product.gender}</p>
        <div className="mb-2">
          {product.promoPrice ? (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
              <p className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
        <div className="mb-3">
          <span className="text-xs font-medium text-muted-foreground">Ukuran: </span>
          {product.sizes.slice(0, 3).map(size => (
            <Badge key={size} variant="secondary" className="mr-1 mb-1 text-xs">{size}</Badge>
          ))}
          {product.sizes.length > 3 && <Badge variant="secondary" className="text-xs">+{product.sizes.length - 3}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">Terjual: {product.salesCount}+</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          <ShoppingBag className="mr-2 h-4 w-4" /> Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
