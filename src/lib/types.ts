export interface Product {
  id: string;
  name: string;
  brand: string; // Added brand
  category: 'Sepatu' | 'Tas' | 'Pakaian';
  imageUrl: string;
  originalPrice: number;
  promoPrice?: number;
  sizes: string[];
  salesCount: number;
  gender: 'Pria' | 'Wanita' | 'Unisex';
  isPromo: boolean;
  description?: string; // Added for potential product detail page
}

export interface Promotion {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  objectPosition?: string; // Added for image positioning
}

export type ShippingVendor = 'JNE' | 'JNT' | 'SiCepat' | 'Lion Parcel';

export interface ShippingCost {
  vendor: ShippingVendor;
  service: string;
  cost: number;
  estimatedDelivery: string;
}
