
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PromoCarousel from '@/components/PromoCarousel';
import ProductGrid from '@/components/ProductGrid';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShippingCalculator from '@/components/ShippingCalculator';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';
import Footer from '@/components/Footer';
import ProductFilters, { type FilterState as ProductFilterStateFromComponent } from '@/components/ProductFilters';
import type { Product, Promotion } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ListFilter, ArrowUpDown, Ruler, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import MobileSearch from '@/components/MobileSearch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted';

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
  priceRange: [0, 2000000],
};

const allSizes = [
  "S", "M", "L", "XL",
  "35", "36", "37", "37.5", "38", "38.5", "39", "40", "41", "42", "43", "44", "45", "46.5", "47",
  "One Size"
].sort((a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  if (!isNaN(numA)) return -1;
  if (!isNaN(numB)) return 1;
  if (a === "One Size") return 1;
  if (b === "One Size") return -1;
  return a.localeCompare(b);
});

const mobileNavLinks = [
  { label: 'Semua', param: 'gender', value: '' },
  { label: 'Pria', param: 'gender', value: 'Pria' },
  { label: 'Wanita', param: 'gender', value: 'Wanita' },
  { label: 'Anak', param: 'gender', value: 'Anak' },
  { label: 'Sports', param: 'type', value: 'Olahraga' },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isMounted = useMounted();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFiltersState: FilterState = { ...initialFilters };
    if (params.get('category')) newFiltersState.categories = params.get('category')!.split(',');
    if (params.get('sizes')) newFiltersState.sizes = params.get('sizes')!.split(',');
    if (params.get('brand')) newFiltersState.brands = params.get('brand')!.split(',');
    if (params.get('minPrice')) newFiltersState.priceRange[0] = parseInt(params.get('minPrice')!, 10);
    if (params.get('maxPrice')) newFiltersState.priceRange[1] = parseInt(params.get('maxPrice')!, 10);
    return newFiltersState;
  });

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [itemsAddedToCartFromWishlist, setItemsAddedToCartFromWishlist] = useState<Set<string>>(new Set());
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [isSizeSheetOpen, setIsSizeSheetOpen] = useState(false);
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([]);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  
  const productFiltersRef = useRef<{ setFiltersFromParent: (newFilters: FilterState) => void }>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filterKeys = ['category', 'sizes', 'brand', 'minPrice', 'maxPrice', 'q', 'type', 'gender', 'promo', 'sort'];
    setShowFilterSidebar(filterKeys.some(key => params.has(key) && params.get(key) !== ''));
  }, [searchParams]);

  const fetchAndFilterProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      let constraints = [];
      
      const categoryParam = params.get('category');
      if (categoryParam) constraints.push(where('category', 'in', categoryParam.split(',')));
      
      const sizesParam = params.get('sizes');
      if (sizesParam) constraints.push(where('sizes', 'array-contains-any', sizesParam.split(',')));
      
      const brandParam = params.get('brand');
      if (brandParam) constraints.push(where('brand', 'in', brandParam.split(',')));
      
      const typeParam = params.get('type');
      if (typeParam) constraints.push(where('type', '==', typeParam));
      
      const genderParam = params.get('gender');
      if (genderParam && genderParam !== "Unisex") constraints.push(where('gender', 'in', [genderParam, 'Unisex']));
      
      const promoParam = params.get('promo');
      if (promoParam === 'true') constraints.push(where('isPromo', '==', true));
      
      const minPrice = params.get('minPrice');
      if (minPrice) constraints.push(where('originalPrice', '>=', parseInt(minPrice, 10)));
      
      const maxPrice = params.get('maxPrice');
      if (maxPrice) constraints.push(where('originalPrice', '<=', parseInt(maxPrice, 10)));
      
      let productQuery = query(collection(db, "products"), ...constraints);

      const queryParam = params.get('q');
      if (queryParam) {
          // Firestore doesn't support full-text search natively client-side.
          // We will fetch all and filter locally for search, or use a more complex query.
          // For simplicity, we filter after fetching if 'q' is present.
      }
      
      const sortOrder = params.get('sort') || 'popular';
      if (sortOrder === 'price-asc') productQuery = query(productQuery, orderBy('originalPrice', 'asc'));
      else if (sortOrder === 'price-desc') productQuery = query(productQuery, orderBy('originalPrice', 'desc'));
      else if (sortOrder === 'alpha-asc') productQuery = query(productQuery, orderBy('name', 'asc'));
      else if (sortOrder === 'alpha-desc') productQuery = query(productQuery, orderBy('name', 'desc'));
      else if (sortOrder === 'popular') productQuery = query(productQuery, orderBy('salesCount', 'desc'));

      const snapshot = await getDocs(productQuery);
      let productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

      if (queryParam) {
        const searchTerm = queryParam.toLowerCase();
        productsList = productsList.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm)) || 
          product.category.toLowerCase().includes(searchTerm)
        );
      }
      
      setProducts(productsList);

    } catch (error) {
      console.error("Error fetching products: ", error);
      toast({ title: "Gagal memuat produk", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (isMounted) {
      fetchAndFilterProducts();
    }
  }, [fetchAndFilterProducts, isMounted]);

  useEffect(() => {
    const fetchPromotions = async () => {
        try {
            const promoSnapshot = await getDocs(collection(db, 'promotions'));
            setPromotions(promoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Promotion[]);
        } catch (error) {
            console.error("Error fetching promotions: ", error);
        }
    };
    if (isMounted) {
      fetchPromotions();
    }
  }, [isMounted]);

  const handleFilterChange = useCallback((newFiltersFromComponent: ProductFilterStateFromComponent | FilterState) => {
    const updatedFilters: FilterState = { ...newFiltersFromComponent };
    setFilters(updatedFilters);
    setIsFilterSheetOpen(false); 

    const params = new URLSearchParams(searchParams.toString());
    
    if (updatedFilters.categories.length > 0) params.set('category', updatedFilters.categories.join(',')); else params.delete('category');
    if (updatedFilters.sizes.length > 0) params.set('sizes', updatedFilters.sizes.join(',')); else params.delete('sizes');
    if (updatedFilters.brands.length > 0) params.set('brand', updatedFilters.brands.join(',')); else params.delete('brand');
    
    if (updatedFilters.priceRange[0] > 0) params.set('minPrice', updatedFilters.priceRange[0].toString()); else params.delete('minPrice');
    if (updatedFilters.priceRange[1] < 2000000) params.set('maxPrice', updatedFilters.priceRange[1].toString()); else params.delete('maxPrice');
    
    router.replace(`?${params.toString()}`, { scroll: false });

  }, [searchParams, router]);

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    router.replace(`?${params.toString()}`, { scroll: false });
    setIsSortSheetOpen(false);
  };
  
  // ... other handlers like handleMobileNavClick, handleTogglePromo remain largely the same
  const handleMobileNavClick = (param: 'gender' | 'type', value: string) => {
    const params = new URLSearchParams(); // Start fresh
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    if (value) params.set(param, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const handleTogglePromo = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('promo')) params.delete('promo');
    else params.set('promo', 'true');
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const handleApplySizeFilter = () => {
    handleFilterChange({ ...filters, sizes: tempSelectedSizes });
    setIsSizeSheetOpen(false);
  };
  const handleTempSizeChange = (size: string) => {
    setTempSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const isWishlisted = prevItems.find(item => item.id === product.id);
      if (isWishlisted) {
        toast({ title: "Wishlist Diperbarui", description: `${product.name} telah dihapus dari wishlist.` });
        return prevItems.filter(item => item.id !== product.id);
      } else {
        toast({ title: "Wishlist Diperbarui", description: `${product.name} telah ditambahkan ke wishlist.` });
        return [...prevItems, product];
      }
    });
  };

  const handleRemoveFromWishlistById = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleToggleCartFromWishlistById = (productId: string) => {
    setItemsAddedToCartFromWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  const orderedItemsForWhatsAppForm = products.filter(product => itemsAddedToCartFromWishlist.has(product.id));

  const sortOptions = [
    { value: 'popular', label: 'Paling Populer' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'alpha-asc', label: 'Nama (A-Z)' },
    { value: 'alpha-desc', label: 'Nama (Z-A)' },
    { value: 'price-asc', label: 'Harga Terendah' },
    { value: 'price-desc', label: 'Harga Tertinggi' },
  ];
  
  const currentSortOrder = searchParams.get('sort') || 'popular';
  const isPromoActive = searchParams.get('promo') === 'true';
  const activeGender = searchParams.get('gender');
  const activeType = searchParams.get('type');

  if (!isMounted) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
         <Header 
            wishlistItems={[]}
            onRemoveFromWishlist={() => {}}
            itemsAddedToCartFromWishlist={new Set()}
            onToggleCartFromWishlist={() => {}}
          />
         <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </div>
         </main>
         <Footer />
       </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlistById}
        itemsAddedToCartFromWishlist={itemsAddedToCartFromWishlist}
        onToggleCartFromWishlist={handleToggleCartFromWishlistById} 
      />
      <main className="flex-grow">
        <div className="hidden md:block">
          <PromoCarousel promotions={promotions} />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={cn("hidden", showFilterSidebar && "lg:block lg:w-1/4 xl:w-1/5 space-y-6 sticky top-20 self-start h-[calc(100vh-10rem)] overflow-y-auto pr-4")}>
              <h3 className="text-xl font-headline font-semibold">Filter Produk</h3>
              <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} />
            </aside>

            <div className={cn("w-full space-y-12", (showFilterSidebar && typeof window !== 'undefined' && window.innerWidth >= 1024) && "lg:w-3/4 xl:w-4/5")}>
              <section id="products" className="w-full">
                 <div className="mb-6">
                    {/* ... UI for mobile/desktop headers remains the same ... */}
                     <div className="hidden md:flex justify-center items-center">
                        <h2 className="text-2xl md:text-3xl font-headline text-center">
                            Kamu Mungkin Suka Produk Ini 🥰
                        </h2>
                    </div>

                    <div className="md:hidden space-y-4">
                      <div className="flex gap-2 items-center"><MobileSearch /></div>
                      <div className="grid grid-cols-5 items-center">
                        {mobileNavLinks.map((link) => {
                          const isActive = (link.label === 'Semua' && !activeGender && !activeType) || (link.param === 'gender' && link.value === activeGender) || (link.param === 'type' && link.value === activeType);
                          return <button key={link.label} onClick={() => handleMobileNavClick(link.param as 'gender' | 'type', link.value)} className={cn("relative group py-2 text-sm font-medium text-center", isActive ? "text-primary" : "text-muted-foreground hover:text-primary")}>{link.label}<span className={cn("absolute bottom-0 left-0 block h-0.5 w-full origin-left bg-primary transition-transform ease-out", isActive ? "scale-x-100 duration-200" : "scale-x-0 duration-75", !isActive && "group-hover:scale-x-100 group-hover:duration-200")} /></button>;
                        })}
                      </div>
                       <div className="grid grid-cols-4 items-center gap-2">
                        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                          <SheetTrigger asChild><Button variant="outline" className="rounded-full text-xs h-9 px-4 justify-center"><ListFilter className="mr-1 h-4 w-4" />Filter</Button></SheetTrigger>
                          <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                            <SheetHeader className="p-4 border-b flex-shrink-0"><SheetTitle>Filter Produk</SheetTitle></SheetHeader>
                            <ScrollArea className="flex-grow"><div className="p-4"><ProductFilters onFilterChange={handleFilterChange} initialFilters={filters}/></div></ScrollArea>
                          </SheetContent>
                        </Sheet>
                        <Sheet open={isSortSheetOpen} onOpenChange={setIsSortSheetOpen}>
                           <SheetTrigger asChild><Button variant="outline" className="rounded-full text-xs h-9 px-4 justify-center"><ArrowUpDown className="mr-1 h-4 w-4" />Urutkan</Button></SheetTrigger>
                           <SheetContent side="bottom" className="rounded-t-lg">
                                <SheetHeader className="text-left mb-4"><SheetTitle>Urutkan Berdasarkan</SheetTitle><SheetDescription>Pilih urutan produk yang ingin ditampilkan.</SheetDescription></SheetHeader>
                                <RadioGroup defaultValue={currentSortOrder} onValueChange={handleSortChange}><div className="space-y-2">{sortOptions.map(option => <Label key={option.value} htmlFor={option.value} className="flex items-center justify-between p-3 rounded-md border has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors">{option.label}<RadioGroupItem value={option.value} id={option.value} /></Label>)}</div></RadioGroup>
                           </SheetContent>
                        </Sheet>
                        <Sheet open={isSizeSheetOpen} onOpenChange={(isOpen) => { if (isOpen) { setTempSelectedSizes(filters.sizes); } setIsSizeSheetOpen(isOpen); }}>
                           <SheetTrigger asChild><Button variant="outline" className="rounded-full text-xs h-9 px-4 justify-center"><Ruler className="mr-1 h-4 w-4" />Ukuran</Button></SheetTrigger>
                           <SheetContent side="bottom" className="rounded-t-lg flex flex-col h-[60vh]">
                                <SheetHeader className="text-left mb-2 flex-shrink-0"><SheetTitle>Pilih Ukuran</SheetTitle><SheetDescription>Pilih satu atau lebih ukuran untuk memfilter produk.</SheetDescription></SheetHeader>
                                <div className="flex-grow overflow-y-auto pr-2">
                                    <Tabs defaultValue="eu" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 mb-3 sticky top-0 bg-background z-10"><TabsTrigger value="aus">AUS</TabsTrigger><TabsTrigger value="eu">EU</TabsTrigger><TabsTrigger value="uk">UK</TabsTrigger><TabsTrigger value="us">US</TabsTrigger></TabsList>
                                        <TabsContent value="aus"><p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran AUS akan tampil di sini.</p></TabsContent>
                                        <TabsContent value="eu"><div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{allSizes.map((size) => <Button key={size} variant={tempSelectedSizes.includes(size) ? "default" : "outline"} onClick={() => handleTempSizeChange(size)} className="h-9 text-xs">{size}</Button>)}</div></TabsContent>
                                        <TabsContent value="uk"><p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran UK akan tampil di sini.</p></TabsContent>
                                        <TabsContent value="us"><p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran US akan tampil di sini.</p></TabsContent>
                                    </Tabs>
                                </div>
                                <SheetFooter className="flex-shrink-0 border-t pt-4 mt-4"><Button onClick={handleApplySizeFilter} className="w-full">Terapkan Filter</Button></SheetFooter>
                           </SheetContent>
                        </Sheet>
                        <Button variant={isPromoActive ? "default" : "outline"} className="rounded-full text-xs h-9 px-4 justify-center" onClick={handleTogglePromo}><Tag className="mr-1 h-4 w-4" />Promo</Button>
                      </div>
                    </div>
                </div>
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <div key={index} className="space-y-2">
                            <Skeleton className="aspect-[2/3] w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        ))}
                    </div>
                ) : (
                    <ProductGrid 
                      products={products} 
                      onToggleWishlist={handleToggleWishlist}
                      wishlistItems={wishlistItems}
                    />
                )}
              </section>

              <section id="shipping-calculator" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
                <h2 className="text-3xl font-headline mb-8 text-center">Hitung Ongkos Kirim</h2>
                <ShippingCalculator />
              </section>

              <section id="whatsapp-order" className="my-16 p-6 bg-secondary/20 rounded-xl shadow-lg">
                <h2 className="text-3xl font-headline mb-8 text-center">Pesan Cepat via WhatsApp</h2>
                <WhatsAppOrderForm orderedItems={orderedItemsForWhatsAppForm} onRemoveItem={handleToggleCartFromWishlistById} />
              </section>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton phoneNumber="+6281278262893" />
      <Footer />
    </div>
  );
}
