
export interface Product {
  id: string;
  name: string;
  brand: string; 
  category: string;
  type?: string; // Misalnya: 'Sneakers', 'Kemeja', 'Ransel'
  imageUrl: string;
  originalPrice: number;
  promoPrice?: number;
  sizes: string[];
  salesCount: number;
  gender: 'Pria' | 'Wanita' | 'Unisex';
  isPromo: boolean;
  description?: string; 
  stock?: number; // Added for admin
}

export interface Promotion {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  objectPosition?: string; 
}

export type ShippingVendor = 'JNE' | 'JNT' | 'SiCepat' | 'Lion Parcel';

export interface ShippingCost {
  vendor: ShippingVendor;
  service: string;
  cost: number;
  estimatedDelivery: string;
}

// Admin Specific Types

export interface AdminTopBanner {
  id: string;
  text: string;
  icon: 'ShieldCheck' | 'Rocket' | 'Tag';
  link: string;
}

export interface AdminStoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AdminSettings {
  receiveNotifications: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Pelanggan';
  joinDate: string; // ISO string
}

export type AdminTransactionType = 'Pendapatan' | 'Pengeluaran';

export interface AdminTransaction {
  id: string;
  date: string; // ISO string
  description: string;
  type: AdminTransactionType;
  category: string; // e.g., "Penjualan Produk", "Biaya Operasional", "Biaya Iklan"
  amount: number;
  notes?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  productCount: number;
}

export interface AdminDiscount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Terjadwal';
  startDate: Date;
  endDate: Date;
  minPurchase?: number;
}

// Admin Dashboard Specific Types
export interface AdminOrder {
  id: string;
  customerName: string;
  productName: string;
  productDetails?: string; // e.g. size, color
  orderDate: string; // ISO string or Date object
  status: 'Belum Dikirim' | 'Sudah Dikirim' | 'Batal';
  totalAmount: number;
  waNumber?: string;
}

export interface AdminSalesDataPoint {
  name: string; // e.g., 'Sen', 'Sel', 'Week 1', 'Jan'
  sales: number;
}

export interface AdminSummaryStats {
  totalOrders: number;
  ordersShipped: number;
  ordersPending: number;
  ordersCancelled: number;
  activeCustomers?: number; // Optional
  lowStockItems?: number; // Optional
}

export interface AdminFinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export interface AdminDashboardData {
  summaryStats: AdminSummaryStats;
  financialOverview: AdminFinancialOverview;
  storeSettings: AdminStoreSettings;
  adminSettings: AdminSettings;
}

// Admin Analytics Types
export interface ProductPerformance {
  name: string;
  rankLabel?: string;
  sales: number;
  views: number;
}

export interface SearchKeyword {
  keyword: string;
  count: number;
}

export interface VisitorStats {
  total: number;
  new: number;
  returning: number;
  conversionRate: number;
}

export interface AdminAnalyticsData {
  visitorStats: VisitorStats;
  topProducts: ProductPerformance[];
  searchKeywords: SearchKeyword[];
}
