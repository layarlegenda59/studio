
import type { AdminDashboardData, AdminOrder, AdminSalesDataPoint, AdminCategory, AdminDiscount, ProductPerformance, SearchKeyword, VisitorStats, AdminTransaction, AdminTransactionType, AdminUser, AdminStoreSettings, AdminSettings } from './types';
import { mockProducts } from './mockData';

export let mockStoreSettings: AdminStoreSettings = {
  name: 'Goodstock-X',
  email: 'customer@goodstockx.com',
  phone: '+6281278262893',
  address: 'Jl. Jend. Sudirman No. 1, Jakarta Pusat, DKI Jakarta, 10220',
};

export let mockAdminSettings: AdminSettings = {
  receiveNotifications: true,
};

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
    totalRevenue: 0, // Will be calculated below
    totalExpenses: 0,
    netProfit: 0,
  },
  storeSettings: mockStoreSettings,
  adminSettings: mockAdminSettings,
};

export let mockRecentOrders: AdminOrder[] = [
  { id: 'ORD001', customerName: 'Ahmad Dahlan', productName: 'Sneakers Klasik Pria', productDetails: 'Size 42', orderDate: '2024-07-28', status: 'Sudah Dikirim', totalAmount: 399000, waNumber: '6281234567890' },
  { id: 'ORD002', customerName: 'Bunga Citra', productName: 'Tas Selempang Wanita Elegan', orderDate: '2024-07-28', status: 'Belum Dikirim', totalAmount: 750000, waNumber: '6281234567891' },
  { id: 'ORD003', customerName: 'Charlie Van Houten', productName: 'Kemeja Flanel Kotak-kotak', productDetails: 'Size L', orderDate: '2024-07-27', status: 'Sudah Dikirim', totalAmount: 350000, waNumber: '6281234567892' },
  { id: 'ORD004', customerName: 'Diana Ross', productName: 'Jaket Bomber Pria Keren', productDetails: 'Size XL', orderDate: '2024-07-27', status: 'Batal', totalAmount: 750000, waNumber: '6281234567893' },
  { id: 'ORD005', customerName: 'Eko Patrio', productName: 'Sepatu Lari Ringan Wanita', productDetails: 'Size 38', orderDate: '2024-07-26', status: 'Belum Dikirim', totalAmount: 450000, waNumber: '6281234567894' },
  { id: 'ORD006', customerName: 'Farida Pasha', productName: 'Ransel Laptop Adventure', orderDate: '2024-07-25', status: 'Sudah Dikirim', totalAmount: 800000, waNumber: '6281234567895' },
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

// Create a set of unique category names from products
const categoryNames = Array.from(new Set(mockProducts.map(p => p.category)));

// Function to calculate product count for a category
const getProductCount = (categoryName: string) => {
  return mockProducts.filter(p => p.category === categoryName).length;
};

// Generate mock categories. Use 'let' to make it mutable.
export let mockCategories: AdminCategory[] = categoryNames.map((name, index) => ({
  id: `cat-${index + 1}`,
  name: name,
  productCount: getProductCount(name),
}));

export let mockDiscounts: AdminDiscount[] = [
  {
    id: 'disc-1',
    code: 'LEBARAN25',
    description: 'Diskon spesial Idul Fitri',
    type: 'percentage',
    value: 25,
    status: 'Aktif',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-01'),
    minPurchase: 200000,
  },
  {
    id: 'disc-2',
    code: 'ONGKIRGRATIS',
    description: 'Potongan ongkir Rp 15.000',
    type: 'fixed',
    value: 15000,
    status: 'Aktif',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-07-31'),
  },
  {
    id: 'disc-3',
    code: 'NEWUSER10',
    description: 'Diskon 10% untuk pengguna baru',
    type: 'percentage',
    value: 10,
    status: 'Tidak Aktif',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
  },
   {
    id: 'disc-4',
    code: 'AGUSTUSAN',
    description: 'Promo Kemerdekaan',
    type: 'percentage',
    value: 17,
    status: 'Terjadwal',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-08-20'),
  },
];


// --- NEW FINANCIAL DATA ---
export let mockTransactions: AdminTransaction[] = [
  // Automatically generate revenue from shipped orders
  ...mockRecentOrders
    .filter(o => o.status === 'Sudah Dikirim')
    .map((o, index) => ({
      id: `trx-rev-${index + 1}`,
      date: o.orderDate,
      description: `Penjualan: ${o.productName}`,
      type: 'Pendapatan' as AdminTransactionType,
      category: 'Penjualan Produk',
      amount: o.totalAmount,
    })),
  // Manual expense entries
  { id: 'trx-exp-1', date: '2024-07-25', description: 'Biaya Iklan Facebook', type: 'Pengeluaran', category: 'Pemasaran', amount: 1500000 },
  { id: 'trx-exp-2', date: '2024-07-20', description: 'Restock Kemeja Flanel', type: 'Pengeluaran', category: 'Pembelian Stok', amount: 5000000 },
  { id: 'trx-exp-3', date: '2024-07-18', description: 'Gaji Karyawan', type: 'Pengeluaran', category: 'Operasional', amount: 10000000 },
  { id: 'trx-exp-4', date: '2024-07-15', description: 'Sewa Gudang', type: 'Pengeluaran', category: 'Operasional', amount: 3000000 },
  { id: 'trx-exp-5', date: '2024-07-10', description: 'Biaya Kemasan & Pengiriman', type: 'Pengeluaran', category: 'Logistik', amount: 2500000 },
];

const calculateFinancials = () => {
    const totalRevenue = mockTransactions
        .filter(t => t.type === 'Pendapatan')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpenses = mockTransactions
        .filter(t => t.type === 'Pengeluaran')
        .reduce((acc, curr) => acc + curr.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, netProfit };
};

mockAdminDashboardData.financialOverview = calculateFinancials();


// Mock data for Analytics Page
export const mockTopProducts: ProductPerformance[] = [...mockProducts]
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 4)
  .map(p => ({ name: p.name, sales: p.salesCount, views: p.salesCount * (Math.floor(Math.random() * 5) + 3) }));

export const mockSearchKeywords: SearchKeyword[] = [
  { keyword: 'sneakers pria', count: 542 },
  { keyword: 'tas wanita', count: 480 },
  { keyword: 'nike', count: 350 },
  { keyword: 'kemeja flanel', count: 210 },
  { keyword: 'sepatu lari', count: 188 },
  { keyword: 'hoodie', count: 154 },
  { keyword: 'promo', count: 120 },
];

export const mockVisitorStats: VisitorStats = {
  total: 12450,
  new: 3120,
  returning: 9330,
  conversionRate: 2.5,
};

// --- NEW USER DATA ---
export let mockUsers: AdminUser[] = [
  { id: 'user-1', name: 'Admin Utama', email: 'admin@example.com', role: 'Admin', joinDate: '2024-01-15' },
  { id: 'user-2', name: 'Ahmad Dahlan', email: 'ahmad.d@example.com', role: 'Pelanggan', joinDate: '2024-07-28' },
  { id: 'user-3', name: 'Bunga Citra', email: 'bunga.c@example.com', role: 'Pelanggan', joinDate: '2024-07-28' },
  { id: 'user-4', name: 'Charlie Van Houten', email: 'charlie.vh@example.com', role: 'Pelanggan', joinDate: '2024-07-27' },
  { id: 'user-5', name: 'Diana Ross', email: 'diana.r@example.com', role: 'Pelanggan', joinDate: '2024-07-27' },
  { id: 'user-6', name: 'Eko Patrio', email: 'eko.p@example.com', role: 'Pelanggan', joinDate: '2024-07-26' },
];
