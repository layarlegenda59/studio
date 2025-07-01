
import type { AdminDashboardData, AdminOrder, AdminSalesDataPoint, AdminCategory, AdminDiscount, ProductPerformance, SearchKeyword, VisitorStats, AdminTransaction, AdminTransactionType, AdminUser, AdminStoreSettings, AdminSettings, AdminTopBanner } from './types';
import { mockProducts } from './mockData';

// --- LocalStorage Keys ---
export const TOP_BANNERS_KEY = 'goodstockx_top_banners';
export const STORE_SETTINGS_KEY = 'goodstockx_store_settings';
export const ADMIN_SETTINGS_KEY = 'goodstockx_admin_settings';
export const CATEGORIES_KEY = 'goodstockx_categories';
export const DISCOUNTS_KEY = 'goodstockx_discounts';
export const USERS_KEY = 'goodstockx_users';
export const ORDERS_KEY = 'goodstockx_orders';
export const TRANSACTIONS_KEY = 'goodstockx_transactions';


// --- Generic Helper Functions for LocalStorage ---
function initializeData<T>(key: string, defaultData: T, isArray: boolean = true): void {
  if (typeof window === 'undefined') return;
  try {
    const savedJSON = localStorage.getItem(key);
    if (savedJSON) {
      const savedData = JSON.parse(savedJSON);
      if (isArray && Array.isArray(savedData)) {
        (defaultData as any[]).length = 0;
        (defaultData as any[]).push(...savedData);
        return;
      }
      if (!isArray && typeof savedData === 'object' && savedData !== null) {
        Object.assign(defaultData as object, savedData);
        return;
      }
    }
    localStorage.setItem(key, JSON.stringify(defaultData));
  } catch (error) {
    console.error(`Failed to initialize ${key} from localStorage.`, error);
  }
}

function saveData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage.`, error);
  }
}

// --- TOP BANNERS ---
export let mockTopBanners: AdminTopBanner[] = [
  { id: 'banner1', text: 'Gratis Pengembalian | S&K Berlaku', icon: 'ShieldCheck', link: '#' },
  { id: 'banner2', text: 'Pengiriman Cepat & Gratis Ongkir', icon: 'Rocket', link: '#' },
  { id: 'banner3', text: 'Dapatkan Diskon 25% | S&K Berlaku', icon: 'Tag', link: '#' },
];
export const initializeTopBanners = () => initializeData(TOP_BANNERS_KEY, mockTopBanners);
// Note: Saving for top banners is handled directly in its component.

// --- STORE & ADMIN SETTINGS ---
export let mockStoreSettings: AdminStoreSettings = {
  name: 'Goodstock-X',
  email: 'admin@goodstock-x.com',
  phone: '+6281278262893',
  address: 'Jl. Jend. Sudirman No. 1, Jakarta Pusat, DKI Jakarta, 10220',
};
export let mockAdminSettings: AdminSettings = {
  receiveNotifications: true,
};
export const initializeStoreSettings = () => initializeData(STORE_SETTINGS_KEY, mockStoreSettings, false);
export const initializeAdminSettings = () => initializeData(ADMIN_SETTINGS_KEY, mockAdminSettings, false);
// Note: Saving for settings is handled directly in its component.

// --- ORDERS ---
export let mockRecentOrders: AdminOrder[] = [
  { id: 'ORD001', customerName: 'Ahmad Dahlan', productName: 'Sneakers Klasik Pria', productDetails: 'Size 42', orderDate: '2024-07-28', status: 'Sudah Dikirim', totalAmount: 399000, waNumber: '6281234567890' },
  { id: 'ORD002', customerName: 'Bunga Citra', productName: 'Tas Selempang Wanita Elegan', orderDate: '2024-07-28', status: 'Belum Dikirim', totalAmount: 750000, waNumber: '6281234567891' },
  { id: 'ORD003', customerName: 'Charlie Van Houten', productName: 'Kemeja Flanel Kotak-kotak', productDetails: 'Size L', orderDate: '2024-07-27', status: 'Sudah Dikirim', totalAmount: 350000, waNumber: '6281234567892' },
  { id: 'ORD004', customerName: 'Diana Ross', productName: 'Jaket Bomber Pria Keren', productDetails: 'Size XL', orderDate: '2024-07-27', status: 'Batal', totalAmount: 750000, waNumber: '6281234567893' },
  { id: 'ORD005', customerName: 'Eko Patrio', productName: 'Sepatu Lari Ringan Wanita', productDetails: 'Size 38', orderDate: '2024-07-26', status: 'Belum Dikirim', totalAmount: 450000, waNumber: '6281234567894' },
  { id: 'ORD006', customerName: 'Farida Pasha', productName: 'Ransel Laptop Adventure', orderDate: '2024-07-25', status: 'Sudah Dikirim', totalAmount: 800000, waNumber: '6281234567895' },
];
export const initializeRecentOrders = () => initializeData(ORDERS_KEY, mockRecentOrders);
export const saveRecentOrders = () => saveData(ORDERS_KEY, mockRecentOrders);


// --- TRANSACTIONS ---
export let mockTransactions: AdminTransaction[] = [
  // This initial data will be replaced by localStorage if available
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
  { id: 'trx-exp-1', date: '2024-07-25', description: 'Biaya Iklan Facebook', type: 'Pengeluaran', category: 'Pemasaran', amount: 1500000 },
  { id: 'trx-exp-2', date: '2024-07-20', description: 'Restock Kemeja Flanel', type: 'Pengeluaran', category: 'Pembelian Stok', amount: 5000000 },
];
export const initializeTransactions = () => initializeData(TRANSACTIONS_KEY, mockTransactions);
export const saveTransactions = () => saveData(TRANSACTIONS_KEY, mockTransactions);

// --- CATEGORIES ---
const defaultCategoryNames = Array.from(new Set(mockProducts.map(p => p.category)));
export let mockCategories: AdminCategory[] = defaultCategoryNames.map((name, index) => ({
  id: `cat-${index + 1}`,
  name: name,
  productCount: mockProducts.filter(p => p.category === name).length,
}));
export const initializeCategories = () => initializeData(CATEGORIES_KEY, mockCategories);
export const saveCategories = () => saveData(CATEGORIES_KEY, mockCategories);

// --- DISCOUNTS ---
export let mockDiscounts: AdminDiscount[] = [
  { id: 'disc-1', code: 'LEBARAN25', description: 'Diskon spesial Idul Fitri', type: 'percentage', value: 25, status: 'Aktif', startDate: new Date('2024-07-01'), endDate: new Date('2024-08-01'), minPurchase: 200000 },
  { id: 'disc-2', code: 'ONGKIRGRATIS', description: 'Potongan ongkir Rp 15.000', type: 'fixed', value: 15000, status: 'Aktif', startDate: new Date('2024-07-15'), endDate: new Date('2024-07-31') },
];
export const initializeDiscounts = () => {
  if (typeof window === 'undefined') return;
  try {
      const savedJSON = localStorage.getItem(DISCOUNTS_KEY);
      if (savedJSON) {
          const savedData = JSON.parse(savedJSON, (key, value) => {
            // Reviver to convert date strings back to Date objects
            if (key === 'startDate' || key === 'endDate') {
              return new Date(value);
            }
            return value;
          });
          if (Array.isArray(savedData)) {
              mockDiscounts.length = 0;
              mockDiscounts.push(...savedData);
              return;
          }
      }
      localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(mockDiscounts));
  } catch (error) {
      console.error(`Failed to initialize ${DISCOUNTS_KEY} from localStorage.`, error);
  }
};
export const saveDiscounts = () => saveData(DISCOUNTS_KEY, mockDiscounts);


// --- USERS ---
export let mockUsers: AdminUser[] = [
  { id: 'user-1', name: 'Admin Utama', email: 'admin@example.com', role: 'Admin', joinDate: '2024-01-15' },
  { id: 'user-2', name: 'Ahmad Dahlan', email: 'ahmad.d@example.com', role: 'Pelanggan', joinDate: '2024-07-28' },
];
export const initializeUsers = () => initializeData(USERS_KEY, mockUsers);
export const saveUsers = () => saveData(USERS_KEY, mockUsers);


// --- DATA FOR STATIC COMPONENTS (NO NEED TO SAVE/LOAD FROM LOCALSTORAGE) ---
export const mockAdminDashboardData: AdminDashboardData = {
  summaryStats: { totalOrders: 152, ordersShipped: 98, ordersPending: 45, ordersCancelled: 9, activeCustomers: 75, lowStockItems: 3, },
  financialOverview: { totalRevenue: 0, totalExpenses: 0, netProfit: 0, },
  storeSettings: mockStoreSettings,
  adminSettings: mockAdminSettings,
};
export const mockSalesData: AdminSalesDataPoint[] = [
  { name: 'Minggu 1', sales: 4000000 }, { name: 'Minggu 2', sales: 3000000 }, { name: 'Minggu 3', sales: 5000000 }, { name: 'Minggu 4', sales: 4500000 }, { name: 'Minggu 5', sales: 6000000 }, { name: 'Minggu 6', sales: 3500000 }, { name: 'Minggu 7', sales: 7000000 },
];
export const mockTopProducts: ProductPerformance[] = [...mockProducts]
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 4)
  .map((p, index) => ({ name: p.name, rankLabel: `#${index + 1}`, sales: p.salesCount, views: p.salesCount * (Math.floor(Math.random() * 5) + 3) }));
export const mockSearchKeywords: SearchKeyword[] = [
  { keyword: 'sneakers pria', count: 542 }, { keyword: 'tas wanita', count: 480 }, { keyword: 'nike', count: 350 }, { keyword: 'kemeja flanel', count: 210 }, { keyword: 'sepatu lari', count: 188 }, { keyword: 'hoodie', count: 154 }, { keyword: 'promo', count: 120 },
];
export const mockVisitorStats: VisitorStats = {
  total: 12450, new: 3120, returning: 9330, conversionRate: 2.5,
};
