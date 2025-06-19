
import type { AdminDashboardData, AdminOrder, AdminSalesDataPoint, Product } from './types';

export const mockAdminDashboardData: AdminDashboardData = {
  summaryStats: {
    totalOrders: 152,
    ordersShipped: 98,
    ordersPending: 45,
    ordersCancelled: 9,
    activeCustomers: 75,
    lowStockItems: 3,
  },
  financialOverview: {
    totalRevenue: 75500000,
    totalExpenses: 22000000,
    netProfit: 53500000,
  },
};

export const mockRecentOrders: AdminOrder[] = [
  { id: 'ORD001', customerName: 'Ahmad Dahlan', productName: 'Sneakers Klasik Pria', productDetails: 'Size 42', orderDate: '2024-07-28', status: 'Sudah Dikirim', totalAmount: 399000, waNumber: '081234567890' },
  { id: 'ORD002', customerName: 'Bunga Citra', productName: 'Tas Selempang Wanita Elegan', orderDate: '2024-07-28', status: 'Belum Dikirim', totalAmount: 750000, waNumber: '081234567891' },
  { id: 'ORD003', customerName: 'Charlie Van Houten', productName: 'Kemeja Flanel Kotak-kotak', productDetails: 'Size L', orderDate: '2024-07-27', status: 'Sudah Dikirim', totalAmount: 350000, waNumber: '081234567892' },
  { id: 'ORD004', customerName: 'Diana Ross', productName: 'Jaket Bomber Pria Keren', productDetails: 'Size XL', orderDate: '2024-07-27', status: 'Batal', totalAmount: 750000, waNumber: '081234567893' },
  { id: 'ORD005', customerName: 'Eko Patrio', productName: 'Sepatu Lari Ringan Wanita', productDetails: 'Size 38', orderDate: '2024-07-26', status: 'Belum Dikirim', totalAmount: 450000, waNumber: '081234567894' },
  { id: 'ORD006', customerName: 'Farida Pasha', productName: 'Ransel Laptop Adventure', orderDate: '2024-07-25', status: 'Sudah Dikirim', totalAmount: 800000, waNumber: '081234567895' },
];

export const mockSalesData: AdminSalesDataPoint[] = [
  { name: 'Minggu 1', sales: 4000000 },
  { name: 'Minggu 2', sales: 3000000 },
  { name: 'Minggu 3', sales: 5000000 },
  { name: 'Minggu 4', sales: 4500000 },
  { name: 'Minggu 5', sales: 6000000 },
  { name: 'Minggu 6', sales: 3500000 },
  { name: 'Minggu 7', sales: 7000000 },
];

export const mockAdminProducts: Product[] = [
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
    stock: 30,
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
    stock: 75,
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
    stock: 5, 
  },
];
