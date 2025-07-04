
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isProductWishlisted, setIsProductWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const productRef = doc(db, 'products', params.id as string);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
          } else {
            toast({ title: "Error", description: "Produk tidak ditemukan.", variant: "destructive" });
            router.push('/');
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
          toast({ title: "Error", description: "Gagal memuat detail produk.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [params.id, router, toast]);

  const handleToggleWishlist = () => {
    if (!product) return;
    setIsProductWishlisted(prev => !prev);
    // Logic to add/remove from global wishlist state would go here
  };

  const handleToggleCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Pilih Ukuran",
        description: "Silakan pilih ukuran terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setIsProductInCart(prev => !prev);
    // Logic to add/remove from global cart state would go here
  };
  
  // Dummy handlers for Header props
  const handleRemoveFromHeaderWishlist = (productId: string) => {};
  const handleToggleCartFromHeaderWishlist = (productId: string) => {};

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
            wishlistItems={headerWishlistItems}
            onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
            itemsAddedToCartFromWishlist={headerCartItems}
            onToggleCartFromHeaderWishlist={handleToggleCartFromHeaderWishlist}
        />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Skeleton className="h-9 w-24 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <Separator />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const discountPercentage = product.promoPrice ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems} 
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist} 
        itemsAddedToCartFromWishlist={headerCartItems} 
        onToggleCartFromHeaderWishlist={handleToggleCartFromHeaderWishlist} 
      />
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="mb-3 sm:mb-4 group text-xs h-8 px-3 sm:text-sm sm:h-auto sm:px-4"
        >
          <ChevronLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" /> Kembali
        </Button>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg bg-secondary/10 flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600} 
              height={600}
              className="object-contain w-full h-full max-h-[320px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px]"
              data-ai-hint={`${product.category.toLowerCase()} fashion detail`}
              priority
            />
          </div>

          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{product.brand}</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-headline font-bold text-foreground">{product.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{product.category} {product.gender !== 'Unisex' ? `(${product.gender})` : ''}</p>
            </div>

            <Separator className="my-1.5 sm:my-2"/>

            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1 sm:text-base sm:mb-1.5">Harga</h2>
              {product.promoPrice ? (
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
                  <p className="text-sm sm:text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                  {discountPercentage > 0 && (
                    <Badge variant="destructive" className="text-[10px] sm:text-xs py-0.5 px-1.5">-{discountPercentage}%</Badge>
                  )}
                </div>
              ) : (
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
              )}
              {product.isPromo && !product.promoPrice && <Badge className="mt-1.5 text-[10px] sm:text-xs">Produk Promo</Badge>}
            </div>
            
            {product.description && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1 sm:text-base sm:mb-1.5">Deskripsi Produk</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1.5 sm:text-base sm:mb-2">Pilih Ukuran</h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={cn("h-9 px-3 text-xs sm:h-9 sm:px-3 rounded-md border-input", selectedSize === size && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {product.sizes.length > 0 && !selectedSize &&
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5">Silakan pilih ukuran.</p>
                }
              </div>
            )}
            
            <Separator className="my-1.5 sm:my-2"/>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-0.5 sm:pt-1">
              <Button 
                size="default" 
                className="flex-1 text-sm"
                onClick={handleToggleCart}
                disabled={product.sizes && product.sizes.length > 0 && !selectedSize && !isProductInCart}
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                {isProductInCart ? 'Hapus dari Keranjang' : 'Tambah ke Keranjang'}
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                className="flex-1 sm:flex-none text-sm"
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4", isProductWishlisted && "fill-destructive text-destructive")} />
                {isProductWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-0.5">Terjual: {product.salesCount} pcs</p>
          </div>
        </div>
        
      </main>
      <WhatsAppButton phoneNumber="+6281278262893" />
      <Footer />
    </div>
  );
}
