
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const allCategories = ["Sepatu", "Tas", "Pakaian"];
const allSizes = ["S", "M", "L", "XL", "38", "39", "40", "41", "42", "One Size"];
const allGenders = ["Pria", "Wanita", "Unisex"];
// Tipe produk bisa dinamis, untuk sekarang kita hardcode beberapa contoh
const allTypes = ["Sneakers", "Formal", "Boots", "Olahraga", "Selempang", "Ransel", "Dompet", "Kemeja", "Kaos", "Hoodies", "Jaket", "Atasan", "Bawahan", "Outerwear"];


export interface FilterState {
  categories: string[];
  sizes: string[];
  types: string[];
  gender: string;
  priceRange: [number, number];
  promoOnly: boolean;
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters?.types || []);
  const [selectedGender, setSelectedGender] = useState<string>(initialFilters?.gender || "Unisex");
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [0, 2000000]);
  const [promoOnly, setPromoOnly] = useState<boolean>(initialFilters?.promoOnly || false);

  useImperativeHandle(ref, () => ({
    setFiltersFromParent: (newFilters: FilterState) => {
      setSelectedCategories(newFilters.categories || []);
      setSelectedSizes(newFilters.sizes || []);
      setSelectedTypes(newFilters.types || []);
      setSelectedGender(newFilters.gender || "Unisex");
      setPriceRange(newFilters.priceRange || [0, 2000000]);
      setPromoOnly(newFilters.promoOnly || false);
    }
  }));
  
  useEffect(() => {
    if (initialFilters) {
      setSelectedCategories(initialFilters.categories || []);
      setSelectedSizes(initialFilters.sizes || []);
      setSelectedTypes(initialFilters.types || []);
      setSelectedGender(initialFilters.gender || "Unisex");
      setPriceRange(initialFilters.priceRange || [0, 2000000]);
      setPromoOnly(initialFilters.promoOnly || false);
    }
  }, [initialFilters]);


  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        sizes: selectedSizes,
        types: selectedTypes,
        gender: selectedGender,
        priceRange,
        promoOnly,
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
  
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };


  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'type', 'price', 'gender']} className="w-full">
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

        <AccordionItem value="type">
          <AccordionTrigger className="font-headline text-base">Tipe Produk</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2 max-h-48 overflow-y-auto">
            {allTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeChange(type)}
                />
                <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="font-headline text-base">Ukuran</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2 max-h-48 overflow-y-auto">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger className="font-headline text-base">Gender</AccordionTrigger>
          <AccordionContent className="pt-2">
            <RadioGroup value={selectedGender} onValueChange={setSelectedGender}>
              {allGenders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`} className="font-normal">{gender}</Label>
                </div>
              ))}
            </RadioGroup>
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

        <AccordionItem value="promo">
          <AccordionTrigger className="font-headline text-base">Status Promo</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex items-center space-x-2">
              <Switch id="promo-status" checked={promoOnly} onCheckedChange={setPromoOnly} />
              <Label htmlFor="promo-status" className="font-normal">Hanya Produk Promo</Label>
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
