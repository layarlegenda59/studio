
import type { Product, Promotion, ShippingCost, ShippingVendor } from './types';

export const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    imageUrl: 'https://images.unsplash.com/photo-1680701572805-c204da57c901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmYXNoaW9uJTIwc2FsZSUyMGJhbm5lcnxlbnwwfHx8fDE3NTAyMTc4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Diskon Akhir Pekan!',
    description: 'Dapatkan diskon hingga 50% untuk item tertentu.',
    ctaText: 'Belanja Sekarang',
    ctaLink: '#products',
  },
  {
    id: 'promo2',
    imageUrl: 'https://images.unsplash.com/photo-1569012648158-af3b4d1a0cce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwc2FsZSUyMGJhbm5lcnxlbnwwfHx8fDE3NTAyMTc4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Koleksi Terbaru Telah Tiba',
    description: 'Jelajahi gaya terbaru musim ini.',
    ctaText: 'Lihat Koleksi',
    ctaLink: '#products',
  },
  {
    id: 'promo3',
    imageUrl: 'https://images.unsplash.com/photo-1680701572805-c204da57c901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmYXNoaW9uJTIwc2FsZSUyMGJhbm5lcnxlbnwwfHx8fDE3NTAyMTc4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Gratis Ongkir Seluruh Indonesia',
    description: 'Nikmati gratis ongkir dengan minimal pembelian Rp200.000.',
    ctaText: 'S&K Berlaku',
    ctaLink: '#',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Sneakers Klasik Pria',
    category: 'Sepatu',
    imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8c25lYWtlcnxlbnwwfHx8fDE3NTAyMTc5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 500000,
    promoPrice: 399000,
    sizes: ['39', '40', '41', '42', '43'],
    salesCount: 120,
    gender: 'Pria',
    isPromo: true,
    description: "Sneakers klasik yang nyaman untuk kegiatan sehari-hari. Dibuat dengan material berkualitas tinggi.",
  },
  {
    id: 'prod2',
    name: 'Tas Selempang Wanita Elegan',
    category: 'Tas',
    imageUrl: 'https://images.unsplash.com/photo-1554745028-65db781f9fa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx0YXMlMjB3YW5pdGF8ZW58MHx8fHwxNzUwMjE3OTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 750000,
    sizes: ['One Size'],
    salesCount: 85,
    gender: 'Wanita',
    isPromo: false,
    description: "Tas selempang elegan untuk wanita modern. Cocok untuk acara formal maupun kasual.",
  },
  {
    id: 'prod3',
    name: 'Kemeja Flanel Kotak-kotak',
    category: 'Pakaian',
    imageUrl: 'https://images.unsplash.com/photo-1613447895642-b36fc3186cb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZW1lamElMjB8ZW58MHx8fHwxNzUwMjE4MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 350000,
    sizes: ['S', 'M', 'L', 'XL'],
    salesCount: 200,
    gender: 'Unisex',
    isPromo: false,
    description: "Kemeja flanel unisex dengan motif kotak-kotak yang trendi. Nyaman dipakai sepanjang hari.",
  },
  {
    id: 'prod4',
    name: 'Sepatu Lari Ringan Wanita',
    category: 'Sepatu',
    imageUrl: 'https://images.unsplash.com/photo-1610894980089-9d87aff3b9d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8d29tZW4lMjBydW5uaW5nJTIwc2hvZXN8ZW58MHx8fHwxNzUwMjE4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    originalPrice: 600000,
    promoPrice: 450000,
    sizes: ['36', '37', '38', '39'],
    salesCount: 95,
    gender: 'Wanita',
    isPromo: true,
    description: "Sepatu lari ringan yang dirancang khusus untuk wanita. Memberikan kenyamanan maksimal saat berolahraga.",
  },
  {
    id: 'prod5',
    name: 'Ransel Laptop Adventure',
    category: 'Tas',
    imageUrl: 'https://placehold.co/400x400.png',
    originalPrice: 800000,
    sizes: ['One Size'],
    salesCount: 60,
    gender: 'Unisex',
    isPromo: false,
    description: "Ransel laptop tahan air dengan banyak kompartemen. Ideal untuk petualangan dan kegiatan outdoor.",
  },
  {
    id: 'prod6',
    name: 'Jaket Bomber Pria Keren',
    category: 'Pakaian',
    imageUrl: 'https://placehold.co/400x400.png',
    originalPrice: 900000,
    promoPrice: 750000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    salesCount: 110,
    gender: 'Pria',
    isPromo: true,
    description: "Jaket bomber pria dengan desain modern dan bahan berkualitas. Menambah gaya penampilan Anda.",
  },
];

export const mockShippingVendors: ShippingVendor[] = ['JNE', 'JNT', 'SiCepat', 'Lion Parcel'];

export const mockShippingCosts: ShippingCost[] = [
    { vendor: 'JNE', service: 'REG', cost: 18000, estimatedDelivery: '2-3 hari' },
    { vendor: 'JNE', service: 'YES', cost: 30000, estimatedDelivery: '1 hari' },
    { vendor: 'JNT', service: 'Express', cost: 16000, estimatedDelivery: '2-4 hari' },
    { vendor: 'SiCepat', service: 'REG', cost: 15000, estimatedDelivery: '2-3 hari' },
    { vendor: 'SiCepat', service: 'BEST', cost: 25000, estimatedDelivery: '1-2 hari' },
    { vendor: 'Lion Parcel', service: 'REGPACK', cost: 17000, estimatedDelivery: '3-5 hari' },
];

