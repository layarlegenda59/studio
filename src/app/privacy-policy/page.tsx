
"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import Link from 'next/link';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-headline font-semibold text-primary mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-4">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicyPage() {
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
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 bg-background rounded-lg my-10 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Kebijakan Privasi</h1>
            <p className="mt-4 text-lg text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>
          
          <Separator className="mb-10" />

          <Section title="1. Informasi yang Kami Kumpulkan">
            <p>Kami mengumpulkan informasi yang Anda berikan langsung kepada kami saat Anda melakukan pemesanan atau berkomunikasi dengan kami. Ini mungkin termasuk nama, alamat email, nomor telepon, dan alamat pengiriman Anda.</p>
            <p>Kami juga dapat mengumpulkan informasi tertentu secara otomatis saat Anda mengunjungi situs kami, seperti alamat IP Anda, jenis browser, dan informasi tentang interaksi Anda dengan situs kami.</p>
          </Section>

          <Section title="2. Bagaimana Kami Menggunakan Informasi Anda">
            <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
            <ul className="list-disc list-inside space-y-2">
                <li>Memproses pesanan Anda dan berkomunikasi dengan Anda tentang pesanan tersebut.</li>
                <li>Menanggapi pertanyaan dan permintaan layanan pelanggan Anda.</li>
                <li>Meningkatkan dan mempersonalisasi pengalaman Anda di situs kami.</li>
                <li>Mengirimkan informasi promosi dan pembaruan, jika Anda memilih untuk menerimanya.</li>
            </ul>
          </Section>

          <Section title="3. Pembagian Informasi">
            <p>Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi Anda dengan penyedia layanan pihak ketiga yang membantu kami dalam mengoperasikan bisnis kami (misalnya, layanan kurir untuk pengiriman), asalkan mereka setuju untuk menjaga kerahasiaan informasi ini.</p>
          </Section>

          <Section title="4. Keamanan Data">
            <p>Kami mengambil langkah-langkah yang wajar untuk melindungi informasi pribadi Anda dari kehilangan, pencurian, penyalahgunaan, serta akses, pengungkapan, perubahan, dan perusakan yang tidak sah. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman.</p>
          </Section>
          
          <Section title="5. Cookie">
            <p>Situs kami dapat menggunakan "cookie" untuk meningkatkan pengalaman pengguna. Cookie adalah file kecil yang ditempatkan di hard drive komputer Anda untuk tujuan pencatatan dan terkadang untuk melacak informasi tentang Anda. Anda dapat memilih untuk mengatur browser web Anda untuk menolak cookie, atau untuk memberi tahu Anda saat cookie dikirim.</p>
          </Section>

           <Section title="6. Hak Anda">
            <p>Anda berhak untuk mengakses, memperbaiki, atau menghapus informasi pribadi Anda yang kami miliki. Untuk melakukannya, silakan hubungi kami menggunakan informasi kontak yang disediakan di bawah ini.</p>
          </Section>

          <Section title="7. Perubahan pada Kebijakan Ini">
            <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi yang baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan.</p>
          </Section>

           <Section title="8. Hubungi Kami">
            <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui email di <a href="mailto:customer@goodstockx.com" className="text-primary hover:underline">customer@goodstockx.com</a>.</p>
          </Section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
