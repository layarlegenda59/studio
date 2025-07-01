
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, Heart, X, ShoppingCart, ShieldCheck, Rocket, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import React, { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, AdminTopBanner } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SubCategoryItem {
  label: string;
  href: string;
}

interface SubCategoryGroup {
  title?: string;
  items: SubCategoryItem[];
}

interface NavItem {
  label: string;
  href: string;
  subMenu?: SubCategoryGroup[];
  isPromo?: boolean;
  image?: {
    src: string;
    alt: string;
    href: string;
    dataAiHint?: string;
  };
}

const navItems: NavItem[] = [
  {
    label: 'Sepatu',
    href: '/?category=Sepatu',
    subMenu: [
      {
        title: 'Pria',
        items: [
          { label: 'Sneakers', href: '/?category=Sepatu&gender=Pria&type=Sneakers' },
          { label: 'Sepatu Formal', href: '/?category=Sepatu&gender=Pria&type=Formal' },
          { label: 'Boots', href: '/?category=Sepatu&gender=Pria&type=Boots' },
          { label: 'Sepatu Olahraga', href: '/?category=Sepatu&gender=Pria&type=Olahraga' },
        ],
      },
      {
        title: 'Wanita',
        items: [
          { label: 'Sneakers', href: '/?category=Sepatu&gender=Wanita&type=Sneakers' },
          { label: 'Flat Shoes', href: '/?category=Sepatu&gender=Wanita&type=FlatShoes' },
          { label: 'Boots', href: '/?category=Sepatu&gender=Wanita&type=Boots' },
        ],
      },
      {
        title: 'Anak',
        items: [
          { label: 'Sepatu Anak Laki-laki', href: '/?category=Sepatu&gender=Anak&type=Laki-laki' },
          { label: 'Sepatu Anak Perempuan', href: '/?category=Sepatu&gender=Anak&type=Perempuan' },
        ],
      }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/hemesh-patil-Kv1GtuqBVIY-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9oZW1lc2gtcGF0aWwtS3YxR3R1cUJWSVktdW5zcGxhc2guanBnIiwiaWF0IjoxNzUwMzI2MjU4LCJleHAiOjE3ODE4NjIyNTh9.9WDexcgQMltvcVcfzX-wVqIzr7zjRNymOmJ5_lg7N9k',
        alt: 'Promo Sepatu Terbaru',
        href: '/?promo=sepatu',
        dataAiHint: 'shoes model'
    }
  },
  {
    label: 'Tas',
    href: '/?category=Tas',
    subMenu: [
       {
        title: 'Pria',
        items: [
          { label: 'Tas Selempang', href: '/?category=Tas&gender=Pria&type=Selempang' },
          { label: 'Ransel', href: '/?category=Tas&gender=Pria&type=Ransel' },
          { label: 'Tas Pinggang', href: '/?category=Tas&gender=Pria&type=Pinggang' },
          { label: 'Dompet', href: '/?category=Tas&gender=Pria&type=Dompet' },
        ],
      },
      {
        title: 'Wanita',
        items: [
          { label: 'Tas Tangan', href: '/?category=Tas&gender=Wanita&type=Tangan' },
          { label: 'Tas Selempang', href: '/?category=Tas&gender=Wanita&type=Selempang' },
          { label: 'Dompet', href: '/?category=Tas&gender=Wanita&type=Dompet' },
          { label: 'Ransel', href: '/?category=Tas&gender=Wanita&type=Ransel' },
        ],
      },
      {
        title: 'Anak',
        items: [
          { label: 'Tas Anak Laki-laki', href: '/?category=Tas&gender=Anak&type=Laki-laki' },
          { label: 'Tas Anak Perempuan', href: '/?category=Tas&gender=Anak&type=Perempuan' },
        ],
      }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/laura-chouette-irG6YMkrrcQ-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9sYXVyYS1jaG91ZXR0ZS1pckc2WU1rcnJjUS11bnNwbGFzaC5qcGciLCJpYXQiOjE3NTAzNzQ3MzEsImV4cCI6MTc4MTkxMDczMX0.7N5Vy-ntAEBXoFF4GjZJC34Lclrgk8OhC7ap4o6_1f8',
        alt: 'Koleksi Tas Eksklusif',
        href: '/?promo=tas',
        dataAiHint: 'bags collection'
    }
  },
  {
    label: 'Pakaian',
    href: '/?category=Pakaian',
    subMenu: [
        {
            title: 'Pria',
            items: [
              { label: 'Kemeja', href: '/?category=Pakaian&gender=Pria&type=Kemeja' },
              { label: 'Kaos', href: '/?category=Pakaian&gender=Pria&type=Kaos' },
              { label: 'Hoodies', href: '/?category=Pakaian&gender=Pria&type=Hoodies' },
              { label: 'Celana', href: '/?category=Pakaian&gender=Pria&type=Celana' },
              { label: 'Jaket', href: '/?category=Pakaian&gender=Pria&type=Jaket' },
              { label: 'Pakaian Olahraga', href: '/?category=Pakaian&gender=Pria&type=Olahraga' },
            ]
        },
        {
            title: 'Wanita',
            items: [
              { label: 'Atasan', href: '/?category=Pakaian&gender=Wanita&type=Atasan' },
              { label: 'Hoodies', href: '/?category=Pakaian&gender=Wanita&type=Hoodies' },
              { label: 'Bawahan', href: '/?category=Pakaian&gender=Wanita&type=Bawahan' },
              { label: 'Outerwear', href: '/?category=Pakaian&gender=Wanita&type=Outerwear' },
            ]
        },
        {
            title: 'Anak',
            items: [
              { label: 'Pakaian Anak Laki-laki', href: '/?category=Pakaian&gender=Anak&type=Laki-laki' },
              { label: 'Pakaian Anak Perempuan', href: '/?category=Pakaian&gender=Anak&type=Perempuan' },
            ]
        }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/christian-bolt-VW5VjskNXZ8-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9jaHJpc3RpYW4tYm9sdC1WVzVWanNrTlhaOC11bnNwbGFzaC5qcGciLCJpYXQiOjE3NTAzMTQxODEsImV4cCI6MTc4MTg1MDE4MX0.YukU4GE7kuBjt8i3A4sjr93kJer8Lrjkkbwmf_JIQ50',
        alt: 'Fashion Pakaian Terkini',
        href: '/?promo=pakaian',
        dataAiHint: 'clothes fashion'
    }
  },
  {
    label: 'Promo',
    href: '/#promo', 
    isPromo: true,
  },
];

const mobileNavLinks = navItems.map(item => ({ label: item.label, href: item.href }));

interface HeaderProps {
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  itemsAddedToCartFromWishlist: Set<string>;
  onToggleCartFromWishlist: (productId: string) => void;
}

const iconMap = {
  ShieldCheck,
  Rocket,
  Tag,
};


export default function Header({ 
  wishlistItems, 
  onRemoveFromWishlist,
  itemsAddedToCartFromWishlist,
  onToggleCartFromWishlist
}: HeaderProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<string, boolean>>({});
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  let hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [isWishlistPopoverOpen, setIsWishlistPopoverOpen] = useState(false);
  const [topBanners, setTopBanners] = useState<AdminTopBanner[]>([]);

  const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";
  const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";

  useEffect(() => {
    const fetchTopBanners = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'topBanners');
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists() && docSnap.data().banners) {
          setTopBanners(docSnap.data().banners);
        }
      } catch (error) {
        console.error("Failed to load top banners from Firestore", error);
      }
    };
    fetchTopBanners();
  }, []);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setPopoverOpenStates({ ...Object.fromEntries(Object.keys(popoverOpenStates).map(k => [k, false])), [label]: true });
  };

  const handleMouseLeave = (label: string) => {
    hoverTimeoutRef.current = setTimeout(() => setPopoverOpenStates(prev => ({ ...prev, [label]: false })), 200);
  };

  const closePopover = (label: string) => setPopoverOpenStates(prev => ({ ...prev, [label]: false }));

  const handleMainSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mainSearchQuery.trim()) router.push(`/?q=${encodeURIComponent(mainSearchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="bg-muted text-muted-foreground py-2 px-4 text-xs border-b border-border/40">
        <div className="container mx-auto flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-1">
          {topBanners.map((banner) => {
            const IconComponent = iconMap[banner.icon];
            const desktopClasses = banner.id === 'banner2' ? 'hidden md:flex' : 'flex';
            return (
              <Link key={banner.id} href={banner.link} className={cn(desktopClasses, "items-center gap-1.5 hover:text-primary transition-colors")}>
                {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                <span>{banner.text}</span>
              </Link>
            )
          })}
        </div>
      </div>
      
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={iconLogoUrl} alt="Goodstock-X Logo Icon" width={28} height={28} priority className="h-7 w-7" data-ai-hint="logo monogram" />
          <div className="w-[100px] sm:w-[120px] h-auto"><Image src={textLogoUrl} alt="Goodstock-X" width={120} height={28} priority className="h-auto w-full" /></div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            item.subMenu ? (
              <Popover key={item.label} open={popoverOpenStates[item.label]} onOpenChange={(isOpen) => setPopoverOpenStates(prev => ({ ...prev, [item.label]: isOpen }))}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={`text-sm font-medium px-3 py-2 rounded-md ${item.isPromo ? 'text-destructive hover:text-destructive/80 font-semibold' : 'text-foreground/70 hover:text-accent-foreground'} transition-colors relative group outline-none focus-visible:ring-0 focus-visible:ring-offset-0`} onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={() => handleMouseLeave(item.label)}>
                    <span className="relative z-10">{item.label}</span>
                    <span className={`absolute bottom-0 left-0 h-0.5 ${item.isPromo ? 'bg-destructive' : 'bg-primary'} transition-all duration-300 ${popoverOpenStates[item.label] ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen max-w-4xl mt-1 p-6 shadow-xl rounded-lg border bg-background" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={() => handleMouseLeave(item.label)} align="start" sideOffset={5}>
                  <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-9 grid grid-cols-3 gap-x-6 gap-y-6">
                      {item.subMenu.map((group) => (
                        <div key={group.title || group.items[0].label}>
                          {group.title && <h4 className="font-headline text-base font-semibold mb-3 text-foreground">{group.title}</h4>}
                          <ul className="space-y-1.5">
                            {group.items.map((subItem) => <li key={subItem.label}><Link href={subItem.href} className="block text-sm text-foreground/80 hover:text-primary hover:underline py-0.5" onClick={() => closePopover(item.label)}>{subItem.label}</Link></li>)}
                            {group.title && item.href && item.label !== "Promo" && (<li key={`view-all-${item.label}-${group.title}`} className="mt-2 pt-2 border-t border-border/50"><Link href={`${item.href}&gender=${group.title}`} className="block text-sm text-primary font-semibold hover:underline py-0.5" onClick={() => closePopover(item.label)}>Lihat Semua {item.label} {group.title}</Link></li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {item.image && (
                      <div className="col-span-3">
                        <Link href={item.image.href} onClick={() => closePopover(item.label)}>
                           <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
                            <Image src={item.image.src} alt={item.image.alt} width={200} height={300} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" data-ai-hint={item.image.dataAiHint} />
                           </div>
                        </Link>
                         <p className="text-xs text-muted-foreground mt-2 text-center">{item.image.alt}</p>
                      </div>
                    )}
                  </div>
                  {item.href && item.label !== "Promo" && (<div className="col-span-full mt-4 pt-4 border-t border-border/50"><Link href={item.href} className="block text-sm text-primary font-semibold hover:underline py-0.5 text-center" onClick={() => closePopover(item.label)}>Lihat Semua {item.label}</Link></div>)}
                </PopoverContent>
              </Popover>
            ) : (
              <Link key={item.label} href={item.href} className={`text-sm font-medium px-3 py-2 rounded-md ${item.isPromo ? 'text-destructive hover:text-destructive/80 font-semibold' : 'text-foreground/70 hover:text-accent-foreground'} transition-colors relative group outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}>
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 ${item.isPromo ? 'bg-destructive' : 'bg-primary'} transition-all duration-300 group-hover:w-full w-0`}></span>
              </Link>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <form onSubmit={handleMainSearchSubmit} className="relative flex-grow max-w-xs">
            <Input type="search" placeholder="Cari produk..." value={mainSearchQuery} onChange={(e) => setMainSearchQuery(e.target.value)} className="h-9 w-full pl-3 pr-10 text-sm border-border focus:border-primary rounded-md focus-visible:ring-0 focus-visible:ring-offset-0" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>
          <Button asChild variant="ghost" size="icon" aria-label="Shopping Cart" className="h-9 w-9 text-foreground/80 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-accent hover:text-accent-foreground"><Link href="/#whatsapp-order"><ShoppingCart className="h-4 w-4" /></Link></Button>
          <Popover open={isWishlistPopoverOpen} onOpenChange={setIsWishlistPopoverOpen}>
            <PopoverTrigger asChild><Button variant="ghost" size="icon" aria-label="Wishlist" className="h-9 w-9 text-foreground/80 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-accent hover:text-accent-foreground"><Heart className="h-4 w-4" /></Button></PopoverTrigger>
            <PopoverContent align="end" sideOffset={5} className="w-96 p-4">
              <div className="space-y-4">
                <h4 className="font-medium leading-none text-foreground">Wishlist Saya</h4>
                <ScrollArea className="h-[300px] w-full">
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-3 pr-3">
                      {wishlistItems.map((item) => {
                        const isItemInCart = itemsAddedToCartFromWishlist.has(item.id);
                        return (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded"><Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" /></div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.promoPrice ? `Rp${item.promoPrice.toLocaleString()}` : `Rp${item.originalPrice.toLocaleString()}`}</p>
                            </div>
                            <Button variant="ghost" size="icon" className={cn("h-7 w-7 shrink-0", isItemInCart ? "text-primary" : "text-muted-foreground hover:text-primary")} onClick={() => onToggleCartFromWishlist(item.id)} aria-label={isItemInCart ? `Hapus ${item.name} dari keranjang` : `Tambah ${item.name} ke keranjang`}><ShoppingCart className={cn("h-4 w-4", isItemInCart && "fill-current text-primary")} /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => onRemoveFromWishlist(item.id)} aria-label={`Hapus ${item.name} dari wishlist`}><X className="h-4 w-4" /></Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (<p className="text-sm text-muted-foreground text-center py-4">Wishlist Anda kosong.</p>)}
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
          <Button asChild variant="ghost" size="sm" className="h-9 px-3 text-foreground/80 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-accent hover:text-accent-foreground"><Link href="/login"><User className="h-4 w-4" />Masuk / Daftar</Link></Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="h-6 w-6" /></Button></SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader className="mb-6"><SheetTitle><Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}><Image src={iconLogoUrl} alt="Goodstock-X Logo Icon" width={24} height={24} className="h-6 w-6" data-ai-hint="logo monogram" /><div className="w-[100px] h-auto"><Image src={textLogoUrl} alt="Goodstock-X" width={100} height={24} className="h-auto w-full" /></div></Link></SheetTitle></SheetHeader>
              <nav className="flex flex-col space-y-1">{mobileNavLinks.map((link) => <Link key={link.href} href={link.href} className="block py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setIsSheetOpen(false)}>{link.label}</Link>)}</nav>
              <div className="mt-8 flex flex-col space-y-3">
                <Button variant="outline" className="w-full"><Search className="mr-2 h-4 w-4" /> Search</Button>
                <Button variant="ghost" className="w-full justify-start pl-2 space-x-2" onClick={() => { setIsWishlistPopoverOpen(true); setIsSheetOpen(false); }}><Heart className="h-4 w-4" /><span>Wishlist</span></Button>
                 <Button asChild variant="ghost" className="w-full justify-start pl-2 space-x-2" onClick={() => setIsSheetOpen(false)}><Link href="/#whatsapp-order"><ShoppingCart className="h-4 w-4" /><span>Tas Belanja</span></Link></Button>
                <Button asChild variant="ghost" className="w-full justify-start pl-2 space-x-2" onClick={() => setIsSheetOpen(false)}><Link href="/login"><User className="h-4 w-4" /><span>Masuk / Daftar</span></Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
