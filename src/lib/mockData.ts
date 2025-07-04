
import type { Product, Promotion, ShippingCost, ShippingVendor } from './types';

export const PRODUCTS_KEY = 'goodstockx_products';
export const PROMOTIONS_KEY = 'goodstockx_promotions';


// The mutable array that the app will use. It starts with the default data.
export let mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Sneakers Klasik Pria',
    brand: 'Nike',
    category: 'Sepatu',
    type: 'Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8c25lYWtlcnxlbnwwfHx8fDE3NTAyMTc5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 500000,
    promoPrice: 399000,
    sizes: ['39', '40', '41', '42', '43'],
    salesCount: 120,
    gender: 'Pria',
    isPromo: true,
    description: "Sneakers klasik yang nyaman untuk kegiatan sehari-hari. Dibuat dengan material berkualitas tinggi.",
    stock: 50,
  },
  {
    id: 'prod2',
    name: 'Tas Selempang Wanita Elegan',
    brand: 'ModeElegance',
    category: 'Tas',
    type: 'Selempang',
    imageUrl: 'https://images.unsplash.com/photo-1554745028-65db781f9fa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx0YXMlMjB3YW5pdGF8ZW58MHx8fHwxNzUwMjE3OTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 750000,
    sizes: ['One Size'],
    salesCount: 85,
    gender: 'Wanita',
    isPromo: false,
    description: "Tas selempang elegan untuk wanita modern. Cocok untuk acara formal maupun kasual.",
    stock: 25,
  },
  {
    id: 'prod3',
    name: 'Kemeja Flanel Kotak-kotak',
    brand: 'PlaidPerfect',
    category: 'Pakaian',
    type: 'Kemeja',
    imageUrl: 'https://images.unsplash.com/photo-1613447895642-b36fc3186cb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZW1lamElMjB8ZW58MHx8fHwxNzUwMjE4MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 350000,
    sizes: ['S', 'M', 'L', 'XL'],
    salesCount: 200,
    gender: 'Unisex',
    isPromo: false,
    description: "Kemeja flanel unisex dengan motif kotak-kotak yang trendi. Nyaman dipakai sepanjang hari.",
    stock: 80,
  },
  {
    id: 'prod4',
    name: 'Sepatu Lari Ringan Wanita',
    brand: 'AeroStride',
    category: 'Sepatu',
    type: 'Olahraga',
    imageUrl: 'https://images.unsplash.com/photo-1610894980089-9d87aff3b9d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8d29tZW4lMjBydW5uaW5nJTIwc2hvZXN8ZW58MHx8fHwxNzUwMjE4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 600000,
    promoPrice: 450000,
    sizes: ['36', '37', '38', '39'],
    salesCount: 95,
    gender: 'Wanita',
    isPromo: true,
    description: "Sepatu lari ringan yang dirancang khusus untuk wanita. Memberikan kenyamanan maksimal saat berolahraga.",
    stock: 5,
  },
  {
    id: 'prod5',
    name: 'Ransel Laptop Adventure',
    brand: 'TechRover',
    category: 'Tas',
    type: 'Ransel',
    imageUrl: 'https://images.unsplash.com/photo-1673505705697-763b670e9afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxsYXB0b3AlMjBiYWNrcGFja3xlbnwwfHx8fDE3NTAyMTgxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 800000,
    sizes: ['One Size'],
    salesCount: 60,
    gender: 'Unisex',
    isPromo: false,
    description: "Ransel laptop tahan air dengan banyak kompartemen. Ideal untuk petualangan dan kegiatan outdoor.",
    stock: 15,
  },
  {
    id: 'prod6',
    name: 'Jaket Bomber Pria Keren',
    brand: 'StreetStyle',
    category: 'Pakaian',
    type: 'Jaket',
    imageUrl: 'https://images.unsplash.com/photo-1629353689974-af4d5c70440f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxib21iZXIlMjBqYWNrZXR8ZW58MHx8fHwxNzUwMjE4MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 900000,
    promoPrice: 750000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    salesCount: 110,
    gender: 'Pria',
    isPromo: true,
    description: "Jaket bomber pria dengan desain modern dan bahan berkualitas. Menambah gaya penampilan Anda.",
    stock: 8,
  },
  {
    id: 'prod7',
    name: 'Sepatu Formal Pria Kulit',
    brand: 'EleganteMan',
    category: 'Sepatu',
    type: 'Formal',
    imageUrl: 'https://images.unsplash.com/photo-1641893843833-a006778dc00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxmb3JtYWwlMjBzaG9lc3xlbnwwfHx8fDE3NTAzNTM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 1200000,
    sizes: ['39', '40', '41', '42', '43', '44'],
    salesCount: 70,
    gender: 'Pria',
    isPromo: false,
    description: "Sepatu formal pria dari kulit asli, cocok untuk acara resmi dan bisnis.",
    stock: 12,
  },
  {
    id: 'prod8',
    name: 'Boots Wanita Fashion',
    brand: 'TrendyStep',
    category: 'Sepatu',
    type: 'Boots',
    imageUrl: 'https://images.unsplash.com/photo-1712171079606-8129ddb8f58d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8d29tZW4lMjBib290c3xlbnwwfHx8fDE3NTAzNTM2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 850000,
    promoPrice: 700000,
    sizes: ['37', '38', '39', '40'],
    salesCount: 50,
    gender: 'Wanita',
    isPromo: true,
    description: "Boots wanita stylish untuk tampilan kasual maupun semi-formal.",
    stock: 18,
  },
  {
    id: 'prod9',
    name: 'Dompet Kulit Pria',
    brand: 'ClassicWallet',
    category: 'Tas',
    type: 'Dompet',
    imageUrl: 'https://images.unsplash.com/photo-1675582122314-cabef1d757ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtZW4lMjBsZWF0aGVyJTIwd2FsbGV0fGVufDB8fHx8MTc1MDM1MzgwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 300000,
    sizes: ['One Size'],
    salesCount: 150,
    gender: 'Pria',
    isPromo: false,
    description: "Dompet kulit pria klasik dengan banyak slot kartu.",
    stock: 0,
  },
  {
    id: 'prod10',
    name: 'Kaos Polos Unisex',
    brand: 'BasicWear',
    category: 'Pakaian',
    type: 'Kaos',
    imageUrl: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8dHNoaXJ0fGVufDB8fHx8MTc1MDM1NDAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 150000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    salesCount: 300,
    gender: 'Unisex',
    isPromo: false,
    description: "Kaos polos unisex berbahan katun combed yang nyaman.",
    stock: 150,
  },
  {
    id: 'prod11',
    name: 'Hoodie Wanita Oversized',
    brand: 'CozyComfort',
    category: 'Pakaian',
    type: 'Hoodies',
    imageUrl: 'https://images.unsplash.com/photo-1674695670808-0480f62cc7d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx3b21lbiUyMGhvb2RpZSUyMG92ZXJzaXplZHxlbnwwfHx8fDE3NTAzNTQwODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 450000,
    sizes: ['M', 'L', 'XL'],
    salesCount: 90,
    gender: 'Wanita',
    isPromo: false,
    description: "Hoodie wanita model oversized yang hangat dan stylish.",
    stock: 3,
  },
  {
    id: 'prod12',
    name: 'Jam Tangan Chronograph Pria',
    brand: 'Timely',
    category: 'Aksesoris',
    type: 'Jam Tangan',
    imageUrl: 'https://placehold.co/400x600.png',
    originalPrice: 1500000,
    promoPrice: 1250000,
    sizes: ['One Size'],
    salesCount: 45,
    gender: 'Pria',
    isPromo: true,
    description: "Jam tangan chronograph elegan dengan strap kulit asli. Tahan air hingga 50m.",
    stock: 20,
  },
  {
    id: 'prod13',
    name: 'Gaun Midi Bunga Wanita',
    brand: 'FloraFash',
    category: 'Pakaian',
    type: 'Gaun',
    imageUrl: 'https://placehold.co/400x600.png',
    originalPrice: 650000,
    sizes: ['S', 'M', 'L'],
    salesCount: 88,
    gender: 'Wanita',
    isPromo: false,
    description: "Gaun midi dengan motif bunga yang cantik, cocok untuk acara santai di musim panas.",
    stock: 30,
  },
  {
    id: 'prod14',
    name: 'Topi Baseball Anak',
    brand: 'KiddyCap',
    category: 'Aksesoris',
    type: 'Topi',
    imageUrl: 'https://placehold.co/400x600.png',
    originalPrice: 180000,
    sizes: ['One Size'],
    salesCount: 115,
    gender: 'Anak',
    isPromo: false,
    description: "Topi baseball untuk anak-anak dengan karakter lucu. Melindungi dari sinar matahari.",
    stock: 60,
  },
  {
    id: 'prod15',
    name: 'Kacamata Hitam Aviator',
    brand: 'SunShade',
    category: 'Aksesoris',
    type: 'Kacamata',
    imageUrl: 'https://placehold.co/400x600.png',
    originalPrice: 550000,
    promoPrice: 450000,
    sizes: ['One Size'],
    salesCount: 78,
    gender: 'Unisex',
    isPromo: true,
    description: "Kacamata hitam model aviator yang ikonik. Lensa polarisasi untuk perlindungan UV maksimal.",
    stock: 40,
  }
];

export let mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    imageUrl: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/erik-mclean-nfoRa6NHTbU-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9lcmlrLW1jbGVhbi1uZm9SYTZOSFRiVS11bnNwbGFzaC5qcGciLCJpYXQiOjE3NTAzMTA4MTYsImV4cCI6MTc4MTg0NjgxNn0.W6d7AjWEOL7BD5PBAEA47uReC5GFBHGFbZMNx3dIG94',
    title: 'BUY 2 GET 1 FREE!',
    description: 'Plus Diskon 50% untuk item tertentu. Jangan lewatkan!',
    ctaText: 'Belanja Sekarang',
    ctaLink: '#products',
  },
  {
    id: 'promo2',
    imageUrl: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/artiom-vallat-CHKaD8uRaDU-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9hcnRpb20tdmFsbGF0LUNIS2FEOHVSYURVLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc1MDMxMTM1MCwiZXhwIjoxNzgxODQ3MzUwfQ.lgG15IkKteJzYsO_lE8n8QQ6sB1dBtTWqynqccSOIs0',
    title: 'Sale Koleksi Terbaru!',
    description: 'Jelajahi gaya terbaru musim ini dengan harga spesial.',
    ctaText: 'Lihat Koleksi',
    ctaLink: '#products',
  },
];


/**
 * Initializes products from localStorage or saves the default if not present.
 */
export function initializeProducts() {
    if (typeof window === 'undefined') return;
    try {
        const savedJSON = localStorage.getItem(PRODUCTS_KEY);
        if (savedJSON) {
            const savedData = JSON.parse(savedJSON);
            if (Array.isArray(savedData)) {
                mockProducts.length = 0;
                mockProducts.push(...savedData);
                return;
            }
        }
        // If nothing is saved or data is malformed, save the default
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
    } catch (error) {
        console.error("Failed to initialize products from localStorage.", error);
    }
}

/**
 * Saves the current products array to localStorage.
 */
export function saveProducts() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
    } catch (error) {
        console.error("Failed to save products to localStorage.", error);
    }
}


/**
 * Initializes promotions from localStorage or saves the default if not present.
 */
export function initializePromotions() {
    if (typeof window === 'undefined') return;
    try {
        const savedJSON = localStorage.getItem(PROMOTIONS_KEY);
        if (savedJSON) {
            const savedData = JSON.parse(savedJSON);
            if (Array.isArray(savedData)) {
                mockPromotions.length = 0;
                mockPromotions.push(...savedData);
                return;
            }
        }
        localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(mockPromotions));
    } catch (error) {
        console.error("Failed to initialize promotions from localStorage.", error);
    }
}

/**
 * Saves the current promotions array to localStorage.
 */
export function savePromotions() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(mockPromotions));
    } catch (error) {
        console.error("Failed to save promotions to localStorage.", error);
    }
}


export const mockShippingVendors: ShippingVendor[] = ['JNE', 'JNT', 'SiCepat', 'Lion Parcel'];

export const mockShippingCosts: ShippingCost[] = [
    { vendor: 'JNE', service: 'REG', cost: 18000, estimatedDelivery: '2-3 hari' },
    { vendor: 'JNE', service: 'YES', cost: 30000, estimatedDelivery: '1 hari' },
    { vendor: 'JNT', service: 'Express', cost: 16000, estimatedDelivery: '2-4 hari' },
    { vendor: 'SiCepat', service: 'REG', cost: 15000, estimatedDelivery: '2-3 hari' },
    { vendor: 'SiCepat', service: 'BEST', cost: 25000, estimatedDelivery: '1-2 hari' },
    { vendor: 'Lion Parcel', service: 'REGPACK', cost: 17000, estimatedDelivery: '3-5 hari' },
];
