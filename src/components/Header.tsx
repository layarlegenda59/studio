
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, ChevronDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from 'react';

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
        src: 'https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/irene-kredenets-dwKiHoqqxk8-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9pcmVuZS1rcmVkZW5ldHMtZHdLaUhvcXF4azgtdW5zcGxhc2guanBnIiwiaWF0IjoxNzUwMzEzMzU3LCJleHAiOjE3ODE4NDkzNTd9.wRAQgI3il0tNJy91AZ0KFI2zBnecHNXo4-N8TTS4n4E',
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<string, boolean>>({});
  let hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";
  const iconLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvLmpwZyIsImlhdCI6MTc1MDIyNjU1MiwiZXhwIjoxNzgxNzYyNTUyfQ.ZYeRMgaRp_lrdX1yfxoLrAMM1jUGf9tTzJZsaNrhYm4";


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


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={iconLogoUrl}
            alt="Goodstock-X Logo Icon"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
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
                    <span className="relative z-10 flex items-center">
                      {item.label}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${popoverOpenStates[item.label] ? 'rotate-180' : ''}`} />
                    </span>
                    <span className={`absolute bottom-0 left-0 h-0.5 ${item.isPromo ? 'bg-destructive' : 'bg-primary'} transition-all duration-300 ${popoverOpenStates[item.label] ? 'w-full' : 'w-0'}`}></span>
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

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">
            Register
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
                <Button variant="outline" className="w-full" onClick={() => setIsSheetOpen(false)}>
                  Login
                </Button>
                <Button className="w-full" onClick={() => setIsSheetOpen(false)}>
                  Register
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
    
