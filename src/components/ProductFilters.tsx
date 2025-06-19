
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input"; // Ditambahkan
import { ScrollArea } from "@/components/ui/scroll-area"; // Ditambahkan
import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { mockProducts } from "@/lib/mockData"; // Ditambahkan untuk mendapatkan daftar brand

const allCategories = ["Sepatu", "Tas", "Pakaian"];
const allSizes = ["S", "M", "L", "XL", "38", "39", "40", "41", "42", "One Size"];

// Mendapatkan semua brand unik dari mockProducts
const allBrands = Array.from(new Set(mockProducts.map(p => p.brand))).sort();

export interface FilterState {
  categories: string[];
  sizes: string[];
  brands: string[]; // Ditambahkan
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands || []); // Ditambahkan
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [0, 2000000]);
  const [brandSearchTerm, setBrandSearchTerm] = useState(''); // Ditambahkan

  useImperativeHandle(ref, () => ({
    setFiltersFromParent: (newFilters: FilterState) => {
      setSelectedCategories(newFilters.categories || []);
      setSelectedSizes(newFilters.sizes || []);
      setSelectedBrands(newFilters.brands || []); // Ditambahkan
      setPriceRange(newFilters.priceRange || [0, 2000000]);
    }
  }));
  
  useEffect(() => {
    if (initialFilters) {
      setSelectedCategories(initialFilters.categories || []);
      setSelectedSizes(initialFilters.sizes || []);
      setSelectedBrands(initialFilters.brands || []); // Ditambahkan
      setPriceRange(initialFilters.priceRange || [0, 2000000]);
    }
  }, [initialFilters]);

  const filteredBrands = useMemo(() => {
    return allBrands.filter(brand => brand.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  }, [brandSearchTerm]);

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        sizes: selectedSizes,
        brands: selectedBrands, // Ditambahkan
        priceRange,
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
  
  const handleBrandChange = (brand: string) => { // Ditambahkan
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'brand', 'price', 'size']} className="w-full">
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
          <AccordionContent className="space-y-2 pt-2">
            <ScrollArea className="h-40">
              <div className="space-y-2 pr-2">
                {allSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleSizeChange(size)}
                    />
                    <Label htmlFor={`size-${size}`} className="font-normal">{size}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-headline text-base">Rentang Harga</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              defaultValue={[0, 2000000]}
              min={0}
              max={2000000}
              step={50000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Rp{priceRange[0].toLocaleString()}</span>
              <span>Rp{priceRange[1].toLocaleString()}</span>
            </div>
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

