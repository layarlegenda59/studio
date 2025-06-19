
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';


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
    href: '/products?category=Sepatu',
    subMenu: [
      {
        title: 'Pria',
        items: [
          { label: 'Sneakers', href: '/products?category=Sepatu&gender=Pria&type=Sneakers' },
          { label: 'Sepatu Formal', href: '/products?category=Sepatu&gender=Pria&type=Formal' },
          { label: 'Boots', href: '/products?category=Sepatu&gender=Pria&type=Boots' },
          { label: 'Sepatu Olahraga', href: '/products?category=Sepatu&gender=Pria&type=Olahraga' },
          { label: 'Lihat Semua Sepatu Pria', href: '/products?category=Sepatu&gender=Pria' },
        ],
      },
      {
        title: 'Wanita',
        items: [
          { label: 'Sneakers', href: '/products?category=Sepatu&gender=Wanita&type=Sneakers' },
          { label: 'Flat Shoes', href: '/products?category=Sepatu&gender=Wanita&type=FlatShoes' },
          { label: 'Boots', href: '/products?category=Sepatu&gender=Wanita&type=Boots' },
          { label: 'Lihat Semua Sepatu Wanita', href: '/products?category=Sepatu&gender=Wanita' },
        ],
      },
      {
        title: 'Anak',
        items: [
          { label: 'Sepatu Anak Laki-laki', href: '/products?category=Sepatu&gender=Anak&type=Laki-laki' },
          { label: 'Sepatu Anak Perempuan', href: '/products?category=Sepatu&gender=Anak&type=Perempuan' },
          { label: 'Lihat Semua Sepatu Anak', href: '/products?category=Sepatu&gender=Anak' },
        ],
      }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/irene-kredenets-dwKiHoqqxk8-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9pcmVuZS1rcmVkZW5ldHMtZHdLaUhvcXF4azgtdW5zcGxhc2guanBnIiwiaWF0IjoxNzUwMzEzNzQzLCJleHAiOjE3ODE4NDk3NDN9.HExOYze3LHMJxj89desF1SQYW1IFBJa1k0wdVTVCY00',
        alt: 'Promo Sepatu Terbaru',
        href: '/promo/sepatu',
        dataAiHint: 'shoes model'
    }
  },
  {
    label: 'Tas',
    href: '/products?category=Tas',
    subMenu: [
       {
        title: 'Pria',
        items: [
          { label: 'Tas Selempang', href: '/products?category=Tas&gender=Pria&type=Selempang' },
          { label: 'Ransel', href: '/products?category=Tas&gender=Pria&type=Ransel' },
          { label: 'Tas Pinggang', href: '/products?category=Tas&gender=Pria&type=Pinggang' },
          { label: 'Dompet', href: '/products?category=Tas&gender=Pria&type=Dompet' },
          { label: 'Lihat Semua Tas Pria', href: '/products?category=Tas&gender=Pria' },
        ],
      },
      {
        title: 'Wanita',
        items: [
          { label: 'Tas Tangan', href: '/products?category=Tas&gender=Wanita&type=Tangan' },
          { label: 'Tas Selempang', href: '/products?category=Tas&gender=Wanita&type=Selempang' },
          { label: 'Dompet', href: '/products?category=Tas&gender=Wanita&type=Dompet' },
          { label: 'Ransel', href: '/products?category=Tas&gender=Wanita&type=Ransel' },
          { label: 'Lihat Semua Tas Wanita', href: '/products?category=Tas&gender=Wanita' },
        ],
      },
      {
        title: 'Anak',
        items: [
          { label: 'Tas Anak Laki-laki', href: '/products?category=Tas&gender=Anak&type=Laki-laki' },
          { label: 'Tas Anak Perempuan', href: '/products?category=Tas&gender=Anak&type=Perempuan' },
          { label: 'Lihat Semua Tas Anak', href: '/products?category=Tas&gender=Anak' },
        ],
      }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/tamara-bellis-nOnT17lKYz8-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC90YW1hcmEtYmVsbGlzLW5PblQxN2xLWXo4LXVuc3BsYXNoLmpwZyIsImlhdCI6MTc1MDMxMzg1NiwiZXhwIjoxNzgxODQ5ODU2fQ.t0opmhBQSCwKw0hU5-HwokP7B8NnKQKyQbg7RrOXDog',
        alt: 'Koleksi Tas Eksklusif',
        href: '/promo/tas',
        dataAiHint: 'bags collection'
    }
  },
  {
    label: 'Pakaian',
    href: '/products?category=Pakaian',
    subMenu: [
        {
            title: 'Pria',
            items: [
              { label: 'Kemeja', href: '/products?category=Pakaian&gender=Pria&type=Kemeja' },
              { label: 'Kaos', href: '/products?category=Pakaian&gender=Pria&type=Kaos' },
              { label: 'Hoodies', href: '/products?category=Pakaian&gender=Pria&type=Hoodies' },
              { label: 'Celana', href: '/products?category=Pakaian&gender=Pria&type=Celana' },
              { label: 'Jaket', href: '/products?category=Pakaian&gender=Pria&type=Jaket' },
              { label: 'Pakaian Olahraga', href: '/products?category=Pakaian&gender=Pria&type=Olahraga' },
              { label: 'Lihat Semua Pakaian Pria', href: '/products?category=Pakaian&gender=Pria' },
            ]
        },
        {
            title: 'Wanita',
            items: [
              { label: 'Atasan', href: '/products?category=Pakaian&gender=Wanita&type=Atasan' },
              { label: 'Hoodies', href: '/products?category=Pakaian&gender=Wanita&type=Hoodies' },
              { label: 'Bawahan', href: '/products?category=Pakaian&gender=Wanita&type=Bawahan' },
              { label: 'Outerwear', href: '/products?category=Pakaian&gender=Wanita&type=Outerwear' },
              { label: 'Lihat Semua Pakaian Wanita', href: '/products?category=Pakaian&gender=Wanita' },
            ]
        },
        {
            title: 'Anak',
            items: [
              { label: 'Pakaian Anak Laki-laki', href: '/products?category=Pakaian&gender=Anak&type=Laki-laki' },
              { label: 'Pakaian Anak Perempuan', href: '/products?category=Pakaian&gender=Anak&type=Perempuan' },
              { label: 'Lihat Semua Pakaian Anak', href: '/products?category=Pakaian&gender=Anak' },
            ]
        }
    ],
    image: {
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/christian-bolt-VW5VjskNXZ8-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9jaHJpc3RpYW4tYm9sdC1WVzVWanNrTlhaOC11bnNwbGFzaC5qcGciLCJpYXQiOjE3NTAzMTQxODEsImV4cCI6MTc4MTg1MDE4MX0.YukU4GE7kuBjt8i3A4sjr93kJer8Lrjkkbwmf_JIQ50',
        alt: 'Fashion Pakaian Terkini',
        href: '/promo/pakaian',
        dataAiHint: 'clothes fashion'
    }
  },
  {
    label: 'Promo',
    href: '#promo', 
    isPromo: true,
  },
];

const mobileNavLinks = navItems.map(item => ({ label: item.label, href: item.href }));


export default function Header() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<string, boolean>>({});
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  let hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";
  const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";


  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setPopoverOpenStates(prev => ({ ...Object.fromEntries(Object.keys(prev).map(k => [k, false])), [label]: true }));
  };

  const handleMouseLeave = (label: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
        setPopoverOpenStates(prev => ({ ...prev, [label]: false }));
    }, 200);
  };
  
  const closePopover = (label: string) => {
    setPopoverOpenStates(prev => ({ ...prev, [label]: false }));
  };

  const handleMainSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mainSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mainSearchQuery.trim())}`);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Main navigation bar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={iconLogoUrl}
            alt="Goodstock-X Logo Icon"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
            data-ai-hint="logo monogram"
          />
          <Image
            src={textLogoUrl}
            alt="Goodstock-X"
            width={120} 
            height={28} 
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            item.subMenu ? (
              <Popover key={item.label} open={popoverOpenStates[item.label]} onOpenChange={(isOpen) => setPopoverOpenStates(prev => ({ ...prev, [item.label]: isOpen }))}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium px-3 py-2 rounded-md ${item.isPromo ? 'text-destructive hover:text-destructive/80 font-semibold' : 'text-foreground/70 hover:text-primary-foreground'} transition-colors relative group outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={() => handleMouseLeave(item.label)} 
                  >
                    <span className="relative z-10">
                      {item.label}
                    </span>
                    <span className={`absolute bottom-0 left-0 h-0.5 ${item.isPromo ? 'bg-destructive' : 'bg-primary'} transition-all duration-300 ${popoverOpenStates[item.label] ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-screen max-w-4xl mt-1 p-6 shadow-xl rounded-lg border bg-background"
                  onMouseEnter={() => handleMouseEnter(item.label)} 
                  onMouseLeave={() => handleMouseLeave(item.label)}
                  align="start"
                  sideOffset={5}
                >
                  <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-9 grid grid-cols-3 gap-x-6 gap-y-6">
                      {item.subMenu.map((group) => (
                        <div key={group.title || group.items[0].label}>
                          {group.title && <h4 className="font-headline text-base font-semibold mb-3 text-foreground">{group.title}</h4>}
                          <ul className="space-y-1.5">
                            {group.items.map((subItem) => (
                              <li key={subItem.label}>
                                <Link
                                  href={subItem.href}
                                  className="block text-sm text-foreground/80 hover:text-primary hover:underline py-0.5"
                                  onClick={() => closePopover(item.label)}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {item.image && (
                      <div className="col-span-3">
                        <Link href={item.image.href} onClick={() => closePopover(item.label)}>
                           <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
                            <Image
                                src={item.image.src}
                                alt={item.image.alt}
                                width={200}
                                height={300}
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                data-ai-hint={item.image.dataAiHint}
                            />
                           </div>
                        </Link>
                         <p className="text-xs text-muted-foreground mt-2 text-center">{item.image.alt}</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 rounded-md ${item.isPromo ? 'text-destructive hover:text-destructive/80 font-semibold' : 'text-foreground/70 hover:text-primary-foreground'} transition-colors relative group outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
              >
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 ${item.isPromo ? 'bg-destructive' : 'bg-primary'} transition-all duration-300 group-hover:w-full w-0`}></span>
              </Link>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          {/* Main Search Input */}
          <form onSubmit={handleMainSearchSubmit} className="relative flex-grow max-w-xs">
            <Input
              type="search"
              placeholder="Cari produk..."
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
              className="h-9 w-full pl-3 pr-10 text-sm border-border focus:border-primary rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>

          {/* User Actions - Ordered as: Tas, Wishlist, Masuk/Daftar */}
          <Button variant="ghost" size="icon" aria-label="Shopping Bag" className="h-9 w-9 text-foreground/80 hover:text-primary">
            <ShoppingBag className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist" className="h-9 w-9 text-foreground/80 hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 text-foreground/80 hover:text-primary">
            <User className="h-4 w-4" />
            Masuk / Daftar
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader className="mb-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                     <Image
                        src={iconLogoUrl}
                        alt="Goodstock-X Logo Icon"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                        data-ai-hint="logo monogram"
                      />
                    <Image
                      src={textLogoUrl}
                      alt="Goodstock-X"
                      width={100}
                      height={24}
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                {mobileNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col space-y-3">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
                <Button variant="ghost" className="w-full justify-start pl-2 space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Button>
                 <Button variant="ghost" className="w-full justify-start pl-2 space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Tas Belanja</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start pl-2 space-x-2" onClick={() => setIsSheetOpen(false)}>
                  <User className="h-4 w-4" />
                  <span>Masuk / Daftar</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
    
    
    
    

    

    

    