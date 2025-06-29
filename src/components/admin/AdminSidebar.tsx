'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, LogOut, Package, Percent, LineChart, CreditCard, MessageCircle, Settings, LayoutDashboard, Users, Palette, ShoppingBag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useMounted } from '@/hooks/use-mounted';

const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";

const mainNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { 
    label: 'Manajemen Produk',
    basePath: '/admin/produk', 
    icon: Package,
    subItems: [
      { href: '/admin/produk', label: 'Daftar Produk' },
      { href: '/admin/produk/kategori', label: 'Kategori Produk' },
      { href: '/admin/produk/stok', label: 'Manajemen Stok' },
    ]
  },
  { 
    label: 'Konten & Promo',
    basePath: '/admin/promo',
    icon: Percent,
    subItems: [
      { href: '/admin/promo/banner', label: 'Banner Homepage' },
      { href: '/admin/promo/diskon', label: 'Kelola Diskon' },
    ]
  },
  { href: '/admin/pesanan-wa', label: 'Pesanan WhatsApp', icon: MessageCircle },
  { href: '/admin/analitik', label: 'Analitik', icon: LineChart },
  { href: '/admin/keuangan', label: 'Keuangan', icon: CreditCard },
];

const secondaryNavItems = [
  { href: '/admin/pengguna', label: 'Manajemen Pengguna', icon: Users },
  { href: '/admin/tampilan', label: 'Pengaturan Tampilan', icon: Palette },
  { href: '/admin/pengaturan', label: 'Pengaturan Umum', icon: Settings },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarNavigation = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    const pathname = usePathname();
    const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
    const isMounted = useMounted();
    
    useEffect(() => {
        if (isMounted) {
            const activeSubMenu = mainNavItems.find(item => item.basePath && pathname.startsWith(item.basePath));
            setOpenSubMenus(activeSubMenu ? [activeSubMenu.basePath!] : []);
        }
    }, [pathname, isMounted]);

    const NavLink = ({ item }: { item: { href?: string; label: string; icon: React.ElementType } }) => {
        const isActive = item.href ? pathname === item.href : false;
        return (
            <Button
                asChild
                variant="ghost"
                className={cn(
                    "w-full justify-start",
                    isActive && "bg-accent text-accent-foreground"
                )}
                onClick={onLinkClick}
            >
                <Link href={item.href!}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                </Link>
            </Button>
        );
    };
    
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow px-2 py-4">
                <nav className="grid items-start gap-1">
                    <Accordion type="multiple" value={isMounted ? openSubMenus : []} onValueChange={setOpenSubMenus} className="w-full">
                    {mainNavItems.map((item) => (
                        item.subItems ? (
                            <AccordionItem value={item.basePath!} key={item.label} className="border-b-0">
                                <AccordionTrigger className={cn("hover:no-underline rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", pathname.startsWith(item.basePath!) && "bg-accent text-accent-foreground")}>
                                    <div className="flex items-center">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-8 pt-1 pb-0">
                                    <div className="flex flex-col gap-1">
                                        {item.subItems.map((subItem) => (
                                            <Button
                                                key={subItem.href}
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "w-full justify-start text-muted-foreground",
                                                    pathname === subItem.href && "text-primary font-semibold"
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                <Link href={subItem.href}>{subItem.label}</Link>
                                            </Button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ) : (
                            <NavLink item={item} key={item.href} />
                        )
                    ))}
                    </Accordion>
                    <hr className="my-4" />
                    <div className="grid gap-1">
                        {secondaryNavItems.map((item) => (
                            <NavLink item={item} key={item.href} />
                        ))}
                    </div>
                </nav>
            </ScrollArea>
            <div className="mt-auto p-4 border-t">
                <Button variant="ghost" className="w-full justify-start" asChild onClick={onLinkClick}>
                     <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Kembali ke Toko
                     </Link>
                </Button>
                 <Button variant="outline" className="w-full justify-start mt-2" asChild onClick={onLinkClick}>
                     <Link href="/login">
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                     </Link>
                </Button>
            </div>
        </div>
    )
};


export default function AdminSidebar({ isMobileOpen, setMobileOpen }: AdminSidebarProps) {
  const DesktopSidebar = () => (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src={iconLogoUrl} alt="Logo" width={24} height={24} />
          <span>Goodstock-X</span>
        </Link>
      </div>
      <SidebarNavigation />
    </aside>
  );

  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="flex h-14 flex-row items-center border-b px-6 text-left">
          <SheetTitle asChild>
              <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
                <Image src={iconLogoUrl} alt="Logo" width={24} height={24} />
                <span>Goodstock-X</span>
              </Link>
          </SheetTitle>
        </SheetHeader>
        <SidebarNavigation onLinkClick={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
