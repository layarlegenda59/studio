
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
import ProductFilters, { type FilterState as ProductFilterStateFromComponent } from '@/components/ProductFilters';
import { mockProducts, mockPromotions } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FilterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define FilterState consistent with ProductFilters.tsx
interface FilterState {
  categories: string[];
  sizes: string[];
  brands: string[];
  priceRange: [number, number];
}

const initialFilters: FilterState = {
  categories: [],
  sizes: [],
  brands: [],
  priceRange: [0, 2000000], // Default max price
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
    
    const sizesParam = params.get('sizes');
    if (sizesParam) newFiltersState.sizes = sizesParam.split(',');
    
    const brandParam = params.get('brand');
    if (brandParam) newFiltersState.brands = brandParam.split(',');
    
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    if (minPriceParam && maxPriceParam) {
      newFiltersState.priceRange = [parseInt(minPriceParam, 10), parseInt(maxPriceParam, 10)];
    } else if (minPriceParam) {
      newFiltersState.priceRange = [parseInt(minPriceParam, 10), initialFiltersRef.current.priceRange[1]];
    } else if (maxPriceParam) {
      newFiltersState.priceRange = [initialFiltersRef.current.priceRange[0], parseInt(maxPriceParam, 10)];
    }
    
    return newFiltersState;
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [itemsAddedToCartFromWishlist, setItemsAddedToCartFromWishlist] = useState<Set<string>>(new Set());
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  
  const productFiltersRef = useRef<{ setFiltersFromParent: (newFilters: FilterState) => void }>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filterKeys = ['category', 'sizes', 'brand', 'minPrice', 'maxPrice', 'q', 'type', 'gender', 'promoOnly']; // Include 'type' and 'gender' here as they are used in Header links
    let hasActiveFilters = false;
    for (const key of filterKeys) {
      if (params.has(key) && params.get(key) !== '') {
        hasActiveFilters = true;
        break;
      }
    }
    setShowFilterSidebar(hasActiveFilters);
  }, [searchParams]);

   useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFiltersState: FilterState = { 
      categories: params.get('category')?.split(',').filter(Boolean) || initialFiltersRef.current.categories,
      sizes: params.get('sizes')?.split(',').filter(Boolean) || initialFiltersRef.current.sizes,
      brands: params.get('brand')?.split(',').filter(Boolean) || initialFiltersRef.current.brands,
      priceRange: [
        params.has('minPrice') ? parseInt(params.get('minPrice')!, 10) : initialFiltersRef.current.priceRange[0],
        params.has('maxPrice') ? parseInt(params.get('maxPrice')!, 10) : initialFiltersRef.current.priceRange[1],
      ],
    };
    
    // Preserve 'type' and 'gender' from URL for filtering logic, even if not in ProductFilters.tsx UI
    const typeParam = params.get('type');
    const genderParam = params.get('gender');

    if (JSON.stringify(newFiltersState) !== JSON.stringify(filters) || 
        (typeParam && !filters.categories.includes(typeParam)) || // crude check for type/gender impacting filters
        (genderParam && !filters.categories.includes(genderParam))) { // crude check
        setFilters(newFiltersState);
        if (productFiltersRef.current) {
            productFiltersRef.current.setFiltersFromParent(newFiltersState);
        }
    }
  }, [searchParams, filters]);


  useEffect(() => {
    let productsToFilter = [...mockProducts];
    const params = new URLSearchParams(searchParams.toString());

    // Filter by categories from ProductFilters state
    if (filters.categories.length > 0) {
      productsToFilter = productsToFilter.filter(product => 
        filters.categories.some(cat => product.category === cat)
      );
    }

    // Additional filter by 'type' from URL (from Header links)
    const typeParam = params.get('type');
    if (typeParam) {
      const typesFromUrl = typeParam.split(',').filter(Boolean);
      if (typesFromUrl.length > 0) {
        productsToFilter = productsToFilter.filter(product =>
          product.type && typesFromUrl.some(type => product.type === type)
        );
      }
    }
    
    // Filter by sizes from ProductFilters state
    if (filters.sizes.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Filter by brands from ProductFilters state
    if (filters.brands.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.brand && filters.brands.some(brand => product.brand === brand)
      );
    }
    
    // Additional filter by 'gender' from URL (from Header links)
    const genderParam = params.get('gender');
    if (genderParam && genderParam !== "Unisex") { // Assuming "Unisex" means no gender filter
         productsToFilter = productsToFilter.filter(product => product.gender === genderParam || product.gender === "Unisex");
    }

    // Filter by priceRange from ProductFilters state
    productsToFilter = productsToFilter.filter(product => {
      const price = product.promoPrice ?? product.originalPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Search query from URL
    const queryParam = params.get('q');
    if (queryParam) {
      const searchTerm = queryParam.toLowerCase();
      productsToFilter = productsToFilter.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.type && product.type.toLowerCase().includes(searchTerm))
      );
    }


    setFilteredProducts(productsToFilter);
  }, [filters, searchParams]);

  const handleFilterChange = useCallback((newFiltersFromComponent: ProductFilterStateFromComponent) => {
    const updatedFilters: FilterState = {
        categories: newFiltersFromComponent.categories,
        sizes: newFiltersFromComponent.sizes,
        brands: newFiltersFromComponent.brands, 
        priceRange: newFiltersFromComponent.priceRange,
    };
    setFilters(updatedFilters);
    setIsFilterSheetOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    
    if (updatedFilters.categories.length > 0) params.set('category', updatedFilters.categories.join(',')); else params.delete('category');
    if (updatedFilters.sizes.length > 0) params.set('sizes', updatedFilters.sizes.join(',')); else params.delete('sizes');
    if (updatedFilters.brands.length > 0) params.set('brand', updatedFilters.brands.join(',')); else params.delete('brand');
    
    if (updatedFilters.priceRange[0] !== initialFiltersRef.current.priceRange[0]) params.set('minPrice', updatedFilters.priceRange[0].toString()); else params.delete('minPrice');
    if (updatedFilters.priceRange[1] !== initialFiltersRef.current.priceRange[1]) params.set('maxPrice', updatedFilters.priceRange[1].toString()); else params.delete('maxPrice');
    
    // Preserve 'type' and 'gender' from URL if they exist and were not part of ProductFilters.tsx submission
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && !params.has('type')) params.set('type', typeFromUrl);

    const genderFromUrl = searchParams.get('gender');
    if (genderFromUrl && !params.has('gender')) params.set('gender', genderFromUrl);
    
    // Preserve search query
    const qFromUrl = searchParams.get('q');
    if (qFromUrl) params.set('q', qFromUrl);


    window.history.pushState(null, '', `?${params.toString()}`);

  }, [searchParams]);

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
            <aside className={cn(
              "lg:w-1/4 xl:w-1/5 space-y-6 sticky top-20 self-start h-[calc(100vh-10rem)] overflow-y-auto pr-4",
              showFilterSidebar ? "lg:block" : "hidden"
            )}>
              <h3 className="text-xl font-headline font-semibold">Filter Produk</h3>
              <ProductFilters 
                ref={productFiltersRef}
                onFilterChange={handleFilterChange}
                initialFilters={filters} 
              />
            </aside>

            <div className={cn(
                "space-y-12",
                showFilterSidebar ? "lg:w-3/4 xl:w-4/5" : "w-full"
              )}>
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
                                    ref={productFiltersRef} // Make sure this ref is passed if ProductFilters is inside Sheet
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
