
import type { AdminDashboardData, AdminOrder, AdminSalesDataPoint, AdminCategory } from './types';
import { mockProducts } from './mockData';

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
