
'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { initializeProducts, initializePromotions } from '@/lib/mockData';
import { 
  initializeCategories,
  initializeDiscounts,
  initializeRecentOrders,
  initializeTransactions,
  initializeUsers,
  initializeStoreSettings,
  initializeAdminSettings,
  initializeTopBanners
} from '@/lib/adminMockData';
import { useMounted } from '@/hooks/use-mounted';

const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const isMounted = useMounted();

  useEffect(() => {
    if (isMounted) {
      // Initialize all mutable mock data arrays from localStorage
      initializeProducts();
      initializePromotions();
      initializeCategories();
      initializeDiscounts();
      initializeRecentOrders();
      initializeTransactions();
      initializeUsers();
      
      // Initialize settings objects (these functions are defined in their respective components)
      // For simplicity, we assume they are also handled via localStorage within their components
      // or we can centralize them like this. The setting pages already handle this, so these calls ensure consistency.
      initializeStoreSettings();
      initializeAdminSettings();
      initializeTopBanners();
    }
  }, [isMounted]);

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        setMobileOpen={setIsMobileSidebarOpen}
      />
      <div className="flex flex-col flex-1 w-full">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka Menu</span>
          </Button>
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Image src={iconLogoUrl} alt="Logo" width={24} height={24} />
            <span className="text-lg">Goodstock-X</span>
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
