
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
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Local state for wishlist and cart interactions on this page
  const [isProductWishlisted, setIsProductWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  
  // For Header props - these are minimal and don't reflect global state
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (params.id) {
      const foundProduct = mockProducts.find(p => p.id === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Note: Wishlist/cart status would ideally come from a global store or props
        // For now, it's just local to this page's interaction buttons
      } else {
        toast({ title: "Error", description: "Produk tidak ditemukan.", variant: "destructive" });
        router.push('/');
      }
    }
  }, [params.id, router, toast]);

  const handleToggleWishlist = () => {
    if (!product) return;
    setIsProductWishlisted(prev => {
      const newState = !prev;
      if (newState) {
        toast({ title: "Wishlist", description: `${product.name} ditambahkan ke wishlist.` });
      } else {
        toast({ title: "Wishlist", description: `${product.name} dihapus dari wishlist.` });
      }
      // Update header dummy state if needed (simplified)
      setHeaderWishlistItems(currentHeaderItems => 
        newState ? [...currentHeaderItems, product] : currentHeaderItems.filter(p => p.id !== product.id)
      );
      return newState;
    });
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
    setIsProductInCart(prev => {
      const newState = !prev;
      if (newState) {
        toast({ title: "Keranjang", description: `${product.name} ${selectedSize ? `(Ukuran: ${selectedSize})` : ''} ditambahkan ke keranjang.` });
      } else {
        toast({ title: "Keranjang", description: `${product.name} dihapus dari keranjang.` });
      }
       // Update header dummy state if needed (simplified)
      setHeaderCartItems(currentHeaderCart => {
        const newSet = new Set(currentHeaderCart);
        if (newState) newSet.add(product.id);
        else newSet.delete(product.id);
        return newSet;
      });
      return newState;
    });
  };
  
  // Dummy handlers for Header props
  const handleRemoveFromHeaderWishlist = (productId: string) => {
    setHeaderWishlistItems(prev => prev.filter(p => p.id !== productId));
    const removedProduct = mockProducts.find(p => p.id === productId);
    if (removedProduct) toast({ title: "Wishlist Header", description: `${removedProduct.name} dihapus.` });
  };

  const handleToggleCartFromHeaderWishlist = (productId: string) => {
    setHeaderCartItems(prev => {
      const newSet = new Set(prev);
      const targetProduct = mockProducts.find(p => p.id === productId);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        if (targetProduct) toast({ title: "Keranjang Header", description: `${targetProduct.name} dihapus.` });
      } else {
        newSet.add(productId);
        if (targetProduct) toast({ title: "Keranjang Header", description: `${targetProduct.name} ditambahkan.` });
      }
      return newSet;
    });
  };


  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
            wishlistItems={headerWishlistItems}
            onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
            itemsAddedToCartFromWishlist={headerCartItems}
            onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
        />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Memuat detail produk...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const discountPercentage = product.promoPrice ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems} // Pass dummy/local state
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist} // Dummy handler
        itemsAddedToCartFromWishlist={headerCartItems} // Dummy state
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist} // Dummy handler
      />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="mb-4 sm:mb-6 group text-xs sm:text-sm h-8 sm:h-auto px-3 sm:px-4"
        >
          <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" /> Kembali
        </Button>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg bg-secondary/10 flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600} 
              height={600}
              className="object-contain w-full h-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px]"
              data-ai-hint={`${product.category.toLowerCase()} fashion detail`}
              priority
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-foreground">{product.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">{product.category} {product.gender !== 'Unisex' ? `(${product.gender})` : ''}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Harga</h2>
              {product.promoPrice ? (
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">{formatPrice(product.promoPrice)}</p>
                  <p className="text-base sm:text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                  {discountPercentage > 0 && (
                    <Badge variant="destructive" className="text-xs sm:text-sm py-0.5 px-1.5">-{discountPercentage}%</Badge>
                  )}
                </div>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(product.originalPrice)}</p>
              )}
              {product.isPromo && !product.promoPrice && <Badge className="mt-2 text-xs sm:text-sm">Produk Promo</Badge>}
            </div>
            
            {product.description && (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Deskripsi Produk</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-2.5">Pilih Ukuran</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={cn("px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 rounded-md border-input", selectedSize === size && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {product.sizes.length > 0 && !selectedSize &&
                  <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">Silakan pilih ukuran.</p>
                }
              </div>
            )}
            
            <Separator className="my-2 sm:my-3"/>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button 
                size="lg" 
                className="flex-1 text-sm sm:text-base" // Adjusted text size
                onClick={handleToggleCart}
                disabled={product.sizes && product.sizes.length > 0 && !selectedSize && !isProductInCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isProductInCart ? 'Hapus dari Keranjang' : 'Tambah ke Keranjang'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 sm:flex-none sm:min-w-[180px] md:min-w-[200px] text-sm sm:text-base" // Adjusted text size and min-width
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("mr-2 h-4 w-4 sm:h-5 sm:w-5", isProductWishlisted && "fill-destructive text-destructive")} />
                {isProductWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Terjual: {product.salesCount} pcs</p>
          </div>
        </div>
        
        {/* You might want a related products section here in the future */}
        {/* <Separator className="my-8 sm:my-12" />
        <div>
          <h2 className="text-xl sm:text-2xl font-headline mb-4 sm:mb-6 text-center">Produk Terkait</h2>
          Placeholder for related products
        </div> */}

      </main>
      <WhatsAppButton phoneNumber="+6281234567890" />
      <Footer />
    </div>
  );
}
