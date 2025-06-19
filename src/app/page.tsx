
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import PromoCarousel from '@/components/PromoCarousel';
import ProductGrid from '@/components/ProductGrid';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShippingCalculator from '@/components/ShippingCalculator';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';
import Footer from '@/components/Footer';
import ProductFilters, { type FilterState as ProductFilterStateOriginal } from '@/components/ProductFilters';
import { mockProducts, mockPromotions } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FilterIcon } from 'lucide-react';

// Update FilterState to include brands and remove others
interface FilterState extends Omit<ProductFilterStateOriginal, 'types' | 'gender' | 'promoOnly'> {
  brands: string[];
  // Optionally, keep types if needed for other functionalities, but remove from ProductFilters.tsx for now
  types?: string[]; 
  gender?: string;
  promoOnly?: boolean;
}

const initialFilters: FilterState = {
  categories: [],
  sizes: [],
  brands: [],
  types: [], // Keep for potential future use or if menu navigates by type
  gender: "Unisex", // Keep for potential future use
  priceRange: [0, 2000000],
  promoOnly: false, // Keep for potential future use
};

export default function Home() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const initialFiltersRef = useRef<FilterState>({ ...initialFilters });

  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFiltersState: FilterState = { ...initialFiltersRef.current };

    const categoryParam = params.get('category');
    if (categoryParam) newFiltersState.categories = categoryParam.split(',');
    
    const typeParam = params.get('type');
    if (typeParam) newFiltersState.types = typeParam.split(',');

    const genderParam = params.get('gender');
    if (genderParam) newFiltersState.gender = genderParam;

    const brandParam = params.get('brand'); // Added for brand
    if (brandParam) newFiltersState.brands = brandParam.split(',');
    
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    if (minPriceParam && maxPriceParam) {
      newFiltersState.priceRange = [parseInt(minPriceParam, 10), parseInt(maxPriceParam, 10)];
    }
    
    return newFiltersState;
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [itemsAddedToCartFromWishlist, setItemsAddedToCartFromWishlist] = useState<Set<string>>(new Set());
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const productFiltersRef = useRef<{ setFiltersFromParent: (newFilters: FilterState) => void }>(null);

   useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFiltersState: FilterState = { 
      categories: params.get('category')?.split(',') || initialFiltersRef.current.categories,
      sizes: params.get('sizes')?.split(',') || initialFiltersRef.current.sizes,
      types: params.get('type')?.split(',') || initialFiltersRef.current.types,
      gender: params.get('gender') || initialFiltersRef.current.gender,
      brands: params.get('brand')?.split(',') || initialFiltersRef.current.brands, // Added for brand
      priceRange: [
        params.has('minPrice') ? parseInt(params.get('minPrice')!, 10) : initialFiltersRef.current.priceRange[0],
        params.has('maxPrice') ? parseInt(params.get('maxPrice')!, 10) : initialFiltersRef.current.priceRange[1],
      ],
      promoOnly: params.get('promoOnly') === 'true' || initialFiltersRef.current.promoOnly,
    };

    if (JSON.stringify(newFiltersState) !== JSON.stringify(filters)) {
        setFilters(newFiltersState);
        if (productFiltersRef.current) {
            productFiltersRef.current.setFiltersFromParent(newFiltersState);
        }
    }
  }, [searchParams, filters]);


  useEffect(() => {
    let productsToFilter = [...mockProducts];

    if (filters.categories.length > 0) {
      productsToFilter = productsToFilter.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    if (filters.types && filters.types.length > 0) { // Check if filters.types exists
      productsToFilter = productsToFilter.filter(product =>
        product.type && filters.types!.includes(product.type)
      );
    }

    if (filters.sizes.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    if (filters.brands.length > 0) { // Added brand filter logic
      productsToFilter = productsToFilter.filter(product =>
        filters.brands.includes(product.brand)
      );
    }
    
    if (filters.gender && filters.gender !== "Unisex") { // Check if filters.gender exists
         productsToFilter = productsToFilter.filter(product => product.gender === filters.gender || product.gender === "Unisex");
    }

    productsToFilter = productsToFilter.filter(product => {
      const price = product.promoPrice ?? product.originalPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.promoOnly) { // Check if filters.promoOnly exists
      productsToFilter = productsToFilter.filter(product => product.isPromo);
    }

    setFilteredProducts(productsToFilter);
  }, [filters]);

  const handleFilterChange = useCallback((newFiltersFromComponent: ProductFilterStateOriginal) => {
    // newFiltersFromComponent will now be of type ProductFilterState (from ProductFilters.tsx)
    // which includes `brands` and excludes `types`, `gender`, `promoOnly`.
    // We merge it with the existing filters, preserving other parts of FilterState in page.tsx
    setFilters(prevFilters => ({
        ...prevFilters, // Keep existing parts like types, gender, promoOnly if they are still in page.tsx's FilterState
        categories: newFiltersFromComponent.categories,
        sizes: newFiltersFromComponent.sizes,
        brands: (newFiltersFromComponent as FilterState).brands, // Cast to get brands
        priceRange: newFiltersFromComponent.priceRange,
    }));
    setIsFilterSheetOpen(false);
  }, []);

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
    if (itemsAddedToCartFromWishlist.has(productId)) {
        setItemsAddedToCartFromWishlist(prevCartItems => {
            const newCartItems = new Set(prevCartItems);
            newCartItems.delete(productId);
            return newCartItems;
        });
    }
    if (itemToRemove) {
      toast({
        title: "Wishlist Diperbarui",
        description: `${itemToRemove.name} telah dihapus dari wishlist.`,
      });
    }
  };

  const handleToggleCartFromWishlist = (product: Product) => {
    setItemsAddedToCartFromWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(product.id)) {
        newSet.delete(product.id);
        toast({
          title: "Keranjang Diperbarui",
          description: `${product.name} dihapus dari keranjang.`,
        });
      } else {
        newSet.add(product.id);
         toast({
          title: "Keranjang Diperbarui",
          description: `${product.name} ditambahkan ke keranjang.`,
        });
      }
      return newSet;
    });
  };
  
  const handleToggleCartFromWishlistById = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      handleToggleCartFromWishlist(product);
    }
  };

  const orderedItemsForWhatsAppForm = mockProducts.filter(product => itemsAddedToCartFromWishlist.has(product.id));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlistById}
        itemsAddedToCartFromWishlist={itemsAddedToCartFromWishlist}
        onToggleCartFromWishlist={handleToggleCartFromWishlistById} 
      />
      <main className="flex-grow">
        <PromoCarousel promotions={mockPromotions} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 space-y-6 sticky top-20 self-start h-[calc(100vh-10rem)] overflow-y-auto pr-4">
              <h3 className="text-xl font-headline font-semibold">Filter Produk</h3>
              <ProductFilters 
                ref={productFiltersRef}
                onFilterChange={handleFilterChange}
                initialFilters={filters} 
              />
            </aside>

            <div className="lg:w-3/4 xl:w-4/5 space-y-12">
              <section id="products" className="w-full">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-headline text-left">Kamu Mungkin Suka Produk Ini 🥰</h2>
                    <div className="lg:hidden">
                    <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                        <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <FilterIcon className="h-5 w-5" />
                            <span className="sr-only">Buka Filter</span>
                        </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>Filter Produk</SheetTitle>
                            </SheetHeader>
                            <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                                <ProductFilters 
                                    ref={productFiltersRef}
                                    onFilterChange={handleFilterChange} 
                                    initialFilters={filters}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                    </div>
                </div>
                <ProductGrid 
                  products={filteredProducts} 
                  onToggleWishlist={handleToggleWishlist}
                  wishlistItems={wishlistItems}
                  onToggleCart={handleToggleCartFromWishlist} 
                  itemsAddedToCartFromWishlist={itemsAddedToCartFromWishlist}
                />
              </section>

              <section id="shipping-calculator" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
                <h2 className="text-3xl font-headline mb-8 text-center">Hitung Ongkos Kirim</h2>
                <ShippingCalculator />
              </section>

              <section id="whatsapp-order" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
                <h2 className="text-3xl font-headline mb-8 text-center">Pesan Cepat via WhatsApp</h2>
                <WhatsAppOrderForm 
                  orderedItems={orderedItemsForWhatsAppForm} 
                  onRemoveItem={handleToggleCartFromWishlistById} 
                />
              </section>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton phoneNumber="+6281234567890" />
      <Footer />
      <style jsx global>{`
        .shadow-text {
          text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

