
import type { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  brand: string; 
  category: string;
  type?: string;
  imageUrl: string;
  originalPrice: number;
  promoPrice?: number;
  sizes: string[];
  salesCount: number;
  gender: 'Pria' | 'Wanita' | 'Unisex';
  isPromo: boolean;
  description?: string; 
  stock?: number;
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
  joinDate: string | Date | Timestamp;
}

export type AdminTransactionType = 'Pendapatan' | 'Pengeluaran';

export interface AdminTransaction {
  id: string;
  date: string | Date | Timestamp;
  description: string;
  type: AdminTransactionType;
  category: string;
  amount: number;
  notes?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  productCount: number; // This will now be calculated on the fly or stored differently
}

export interface AdminDiscount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Terjadwal';
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  minPurchase?: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  productName: string;
  productDetails?: string;
  orderDate: string | Date | Timestamp;
  status: 'Belum Dikirim' | 'Sudah Dikirim' | 'Batal';
  totalAmount: number;
  waNumber?: string;
}

export interface AdminSalesDataPoint {
  name: string;
  sales: number;
}

export interface AdminSummaryStats {
  totalOrders: number;
  ordersShipped: number;
  ordersPending: number;
  ordersCancelled: number;
  activeCustomers?: number;
  lowStockItems?: number;
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
