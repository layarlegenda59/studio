
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Package, Percent, LineChart, CreditCard, MessageCircle, Settings, LayoutDashboard, Users, Palette, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";
const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";


const mainNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { 
    label: 'Manajemen Produk', 
    icon: Package,
    subItems: [
      { href: '/admin/produk', label: 'Daftar Produk' },
      { href: '/admin/produk/kategori', label: 'Kategori Produk' },
      { href: '/admin/produk/stok', label: 'Manajemen Stok' },
    ]
  },
  { 
    label: 'Konten & Promo', 
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


export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r hidden md:flex" variant="sidebar">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Image src={iconLogoUrl} alt="Goodstock-X Icon" width={28} height={28} className="h-7 w-7" />
          <Image src={textLogoUrl} alt="Goodstock-X" width={120} height={28} />
        </Link>
         <Link href="/admin/dashboard" className="items-center gap-2 hidden group-data-[collapsible=icon]:flex">
           <Image src={iconLogoUrl} alt="Goodstock-X Icon" width={28} height={28} className="h-7 w-7" />
        </Link>
        <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent className="flex-grow p-2 space-y-1">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.subItems ? (
                <>
                  <SidebarMenuButton 
                    isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                    className="justify-between"
                    // This is a trick to make the button a non-clickable header for submenus
                    // We'll handle actual navigation with sub-items
                    asChild={false} 
                    onClick={(e) => e.preventDefault()} 
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.href || (pathname.startsWith(subItem.href) && subItem.href !== '/admin/produk')}
                        >
                          <Link href={subItem.href}>
                            {subItem.label}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton asChild isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard' && item.href.length > '/admin/dashboard'.length )}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <hr className="my-4 border-border/50 group-data-[collapsible=icon]:hidden" />

        <SidebarMenu className="group-data-[collapsible=icon]:mt-auto">
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t group-data-[collapsible=icon]:pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Kembali ke Toko</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Link href="/login"> {/* Should be a proper logout flow */}
                <LogOut className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
