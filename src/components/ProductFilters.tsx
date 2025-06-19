
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { mockProducts } from "@/lib/mockData";

const allCategories = ["Sepatu", "Tas", "Pakaian"];
const allSizes = [
  "S", "M", "L", "XL",
  "35", "36", "37", "37.5", "38", "38.5", "39", "40", "41", "42", "43", "44", "45", "46.5", "47",
  "One Size"
].sort((a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const isANumber = !isNaN(numA);
  const isBNumber = !isNaN(numB);

  if (isANumber && isBNumber) return numA - numB;
  if (isANumber) return -1; // numbers first
  if (isBNumber) return 1;
  if (a === "One Size") return 1; // One Size last among strings
  if (b === "One Size") return -1;
  return a.localeCompare(b); // then alphabetical for S, M, L, XL
});


const providedBrandsList = [
  "adidas", "nike", "Air Jordan", "reebok", "New Balance", "puma", "asics", "Diadora", "Umbro", "Fila",
  "GAP", "Uniqlo", "onitsuka tiger", "under armour", "Salomon", "On Cloud", "Li-Ning", "yonex", "mizuno",
  "columbia", "timberland", "Dr. Martens", "Clarks", "Converse", "Vans", "Skechers", "lacoste",
  "Stone Island", "Saucony", "K-Swiss", "Kenzo", "Levis", "balenciaga", "Fendi", "Louis Vuitton",
  "Coach", "Bally", "Versace", "Ferragamo", "Tumi", "Gucci", "Dior", "prada", "Givenchy", "Hermes",
  "H&M", "The North Face", "calvin klein", "Ecco", "Burberry", "Carhartt", "Christian Louboutin", "Chanel"
];

const allBrands = Array.from(new Set(providedBrandsList.map(brand => brand.trim()))).filter(Boolean).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));


const priceOptions = [
  { label: "Rp. 0 - Rp. 100.000", value: [0, 100000] },
  { label: "Rp. 100.000 - Rp. 250.000", value: [100000, 250000] },
  { label: "Rp. 250.000 - Rp. 500.000", value: [250000, 500000] },
  { label: "Rp. 500.000 - Rp. 1.000.000", value: [500000, 1000000] },
  { label: "Diatas Rp. 1.000.000", value: [1000000, 2000000] },
];

export interface FilterState {
  categories: string[];
  sizes: string[];
  brands: string[];
  priceRange: [number, number];
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const ProductFilters = forwardRef<
  { setFiltersFromParent: (newFilters: FilterState) => void }, 
  ProductFiltersProps
>(({ onFilterChange, initialFilters }, ref) => {
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters?.sizes || []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands || []);
  const [minPrice, setMinPrice] = useState<string>(initialFilters?.priceRange[0]?.toString() || "0");
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.priceRange[1]?.toString() || "2000000");
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [activePriceRadio, setActivePriceRadio] = useState<string | undefined>(() => {
    if (initialFilters?.priceRange) {
        const matchingOption = priceOptions.find(opt => opt.value[0] === initialFilters.priceRange[0] && opt.value[1] === initialFilters.priceRange[1]);
        return matchingOption ? JSON.stringify(matchingOption.value) : undefined;
    }
    return undefined;
  });

  useImperativeHandle(ref, () => ({
    setFiltersFromParent: (newFilters: FilterState) => {
      setSelectedCategories(newFilters.categories || []);
      setSelectedSizes(newFilters.sizes || []);
      setSelectedBrands(newFilters.brands || []);
      const newMin = newFilters.priceRange?.[0]?.toString() || "0";
      const newMax = newFilters.priceRange?.[1]?.toString() || "2000000";
      setMinPrice(newMin);
      setMaxPrice(newMax);
      const matchingOption = priceOptions.find(opt => opt.value[0] === (newFilters.priceRange?.[0] ?? 0) && opt.value[1] === (newFilters.priceRange?.[1] ?? 2000000));
      setActivePriceRadio(matchingOption ? JSON.stringify(matchingOption.value) : undefined);
    }
  }));
  
  useEffect(() => {
    if (initialFilters) {
      setSelectedCategories(initialFilters.categories || []);
      setSelectedSizes(initialFilters.sizes || []);
      setSelectedBrands(initialFilters.brands || []);
      const initMin = initialFilters.priceRange?.[0]?.toString() || "0";
      const initMax = initialFilters.priceRange?.[1]?.toString() || "2000000";
      setMinPrice(initMin);
      setMaxPrice(initMax);
      const matchingOption = priceOptions.find(opt => opt.value[0] === (initialFilters.priceRange?.[0] ?? 0) && opt.value[1] === (initialFilters.priceRange?.[1] ?? 2000000));
      setActivePriceRadio(matchingOption ? JSON.stringify(matchingOption.value) : undefined);
    }
  }, [initialFilters]);

  const filteredBrands = useMemo(() => {
    return allBrands.filter(brand => brand.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  }, [brandSearchTerm]);

  const handleApplyFilters = () => {
    if (onFilterChange) {
      const numMinPrice = parseInt(minPrice, 10);
      const numMaxPrice = parseInt(maxPrice, 10);

      const validMinPrice = isNaN(numMinPrice) ? 0 : numMinPrice;
      const validMaxPrice = (isNaN(numMaxPrice) || numMaxPrice < validMinPrice) ? 2000000 : numMaxPrice;
      
      onFilterChange({
        categories: selectedCategories,
        sizes: selectedSizes,
        brands: selectedBrands,
        priceRange: [validMinPrice, validMaxPrice],
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };
  
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceRadioChange = (valueStr: string) => {
    setActivePriceRadio(valueStr);
    const [radioMin, radioMax] = JSON.parse(valueStr);
    setMinPrice(radioMin.toString());
    setMaxPrice(radioMax.toString());
  };

  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setActivePriceRadio(undefined); 
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setActivePriceRadio(undefined);
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'brand', 'size', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-headline text-base">Kategori</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {allCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${category}`} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand"> 
          <AccordionTrigger className="font-headline text-base">Merk</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <Input 
              type="search"
              placeholder="Cari merk..."
              value={brandSearchTerm}
              onChange={(e) => setBrandSearchTerm(e.target.value)}
              className="h-9 text-sm"
            />
            <ScrollArea className="h-40">
              <div className="space-y-2 pr-2">
                {filteredBrands.length > 0 ? filteredBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
                  </div>
                )) : <p className="text-xs text-muted-foreground">Merk tidak ditemukan.</p>}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="font-headline text-base">Ukuran</AccordionTrigger>
          <AccordionContent className="pt-2">
            <Tabs defaultValue="eu" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-3">
                <TabsTrigger value="aus">AUS</TabsTrigger>
                <TabsTrigger value="eu">EU</TabsTrigger>
                <TabsTrigger value="uk">UK</TabsTrigger>
                <TabsTrigger value="us">US</TabsTrigger>
              </TabsList>
              <TabsContent value="aus">
                 <p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran AUS akan tampil di sini.</p>
              </TabsContent>
              <TabsContent value="eu">
                <ScrollArea className="h-40">
                  <div className="grid grid-cols-3 gap-2 pr-2">
                    {allSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        onClick={() => handleSizeChange(size)}
                        className="h-9 text-xs"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
               <TabsContent value="uk">
                 <p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran UK akan tampil di sini.</p>
              </TabsContent>
               <TabsContent value="us">
                <p className="text-xs text-center text-muted-foreground py-2">Pilihan ukuran US akan tampil di sini.</p>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-headline text-base">Harga</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Harga Min." 
                value={minPrice}
                onChange={handleMinPriceInputChange}
                className="h-9 text-sm"
                aria-label="Harga Minimum"
                min="0"
              />
              <span className="text-muted-foreground">-</span>
              <Input 
                type="number" 
                placeholder="Harga Max." 
                value={maxPrice}
                onChange={handleMaxPriceInputChange}
                className="h-9 text-sm"
                aria-label="Harga Maksimum"
                min="0"
              />
            </div>
            <RadioGroup value={activePriceRadio} onValueChange={handlePriceRadioChange} className="space-y-2">
              {priceOptions.map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <RadioGroupItem value={JSON.stringify(option.value)} id={option.label} />
                  <Label htmlFor={option.label} className="font-normal text-sm">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={handleApplyFilters} className="w-full">
        Terapkan Filter
      </Button>
    </div>
  );
});

ProductFilters.displayName = "ProductFilters";
export default ProductFilters;

    
