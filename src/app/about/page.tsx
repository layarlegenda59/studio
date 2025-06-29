
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import { Users, Target, Rocket, ShieldCheck } from 'lucide-react';

const values = [
    {
        icon: Rocket,
        title: "Inovasi",
        description: "Kami terus mencari cara baru untuk meningkatkan pengalaman berbelanja Anda, dari teknologi hingga kurasi produk."
    },
    {
        icon: Users,
        title: "Berpusat pada Pelanggan",
        description: "Anda adalah pusat dari semua yang kami lakukan. Kepuasan Anda adalah prioritas utama kami."
    },
    {
        icon: ShieldCheck,
        title: "Integritas & Kepercayaan",
        description: "Kami berkomitmen pada keaslian produk dan transparansi dalam setiap transaksi."
    }
];

export default function AboutUsPage() {
  // Dummy state for Header props
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());

  const handleRemoveFromHeaderWishlist = (productId: string) => {};
  const handleToggleCartFromHeaderWishlist = (productId: string) => {};

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjbG90aGluZyUyMHN0b3JlfGVufDB8fHx8MTc1MDQxMDk1MHww&ixlib=rb-4.1.0&q=80&w=1080')" }} data-ai-hint="clothing store">
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold">Tentang Goodstock-X</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Membawa Fashion Terbaik Dunia ke Depan Pintu Anda.</p>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-20 bg-background rounded-t-xl -mt-10 relative z-10 shadow-xl">
          {/* Our Story Section */}
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-headline font-semibold text-primary">Kisah Kami</h2>
            <Separator className="w-24 h-1 mx-auto my-4 bg-primary"/>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Goodstock-X lahir dari hasrat mendalam terhadap fashion dan keyakinan bahwa setiap orang berhak memiliki akses ke produk-produk berkualitas dari seluruh dunia. Kami memulai perjalanan ini untuk menjembatani kesenjangan antara merek internasional ternama dan para pecinta fashion di Indonesia. Kami bukan sekadar toko; kami adalah kurator gaya hidup, yang dengan cermat memilih setiap item untuk memastikan Anda mendapatkan yang terbaik.
            </p>
          </section>

          {/* Our Values Section */}
          <section className="mt-16 md:mt-24">
             <h2 className="text-3xl font-headline font-semibold text-primary text-center">Nilai-Nilai Kami</h2>
             <Separator className="w-24 h-1 mx-auto my-4 bg-primary"/>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <value.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-2xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
