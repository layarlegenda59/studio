
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

export default function TermsAndConditionsPage() {
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
        onToggleCartFromHeaderWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 bg-background rounded-lg my-10 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Persyaratan & Ketentuan</h1>
            <p className="mt-4 text-lg text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>
          
          <Separator className="mb-10" />

          <Section title="1. Pendahuluan">
            <p>Selamat datang di Goodstock-X. Persyaratan dan Ketentuan ini mengatur penggunaan Anda terhadap situs web kami dan layanan apa pun yang ditawarkan oleh Goodstock-X. Dengan mengakses atau menggunakan Layanan, Anda setuju untuk terikat oleh Persyaratan ini. Jika Anda tidak setuju dengan bagian mana pun dari persyaratan ini, Anda tidak diizinkan untuk menggunakan Layanan.</p>
          </Section>

          <Section title="2. Penggunaan Layanan">
            <p>Anda setuju untuk menggunakan Layanan kami hanya untuk tujuan yang sah dan sesuai dengan Persyaratan ini. Anda bertanggung jawab untuk memastikan bahwa informasi yang Anda berikan akurat dan lengkap. Anda tidak boleh menggunakan layanan kami untuk aktivitas ilegal atau tidak sah.</p>
          </Section>

          <Section title="3. Produk dan Harga">
            <p>Kami berusaha untuk menampilkan informasi produk seakurat mungkin, termasuk deskripsi, gambar, dan harga. Namun, kami tidak menjamin bahwa semua informasi tersebut bebas dari kesalahan. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Semua pesanan bergantung pada ketersediaan produk.</p>
          </Section>

          <Section title="4. Pemesanan dan Pembayaran">
            <p>Semua pemesanan dilakukan melalui platform komunikasi yang kami tentukan (misalnya, WhatsApp). Dengan melakukan pemesanan, Anda membuat penawaran untuk membeli produk dengan tunduk pada Persyaratan ini. Kami berhak menolak atau membatalkan pesanan apa pun dengan alasan apa pun. Pembayaran harus dilakukan sesuai dengan instruksi yang diberikan oleh tim kami.</p>
          </Section>
          
          <Section title="5. Kekayaan Intelektual">
            <p>Semua konten yang disertakan dalam Layanan, seperti teks, grafik, logo, gambar, serta kompilasi daripadanya, adalah milik Goodstock-X atau pemasoknya dan dilindungi oleh undang-undang hak cipta. Anda setuju untuk tidak mereproduksi, menduplikasi, menyalin, menjual, atau mengeksploitasi bagian mana pun dari Layanan tanpa izin tertulis dari kami.</p>
          </Section>

           <Section title="6. Batasan Tanggung Jawab">
            <p>Dalam keadaan apa pun, Goodstock-X, maupun direktur, karyawan, atau afiliasinya, tidak akan bertanggung jawab atas kerusakan tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk namun tidak terbatas pada, kehilangan keuntungan, data, atau kerugian tidak berwujud lainnya, yang diakibatkan oleh (i) akses Anda ke atau penggunaan atau ketidakmampuan untuk mengakses atau menggunakan Layanan; (ii) setiap konten yang diperoleh dari Layanan.</p>
          </Section>

          <Section title="7. Perubahan Persyaratan">
            <p>Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Persyaratan ini kapan saja. Jika revisi bersifat material, kami akan memberikan pemberitahuan setidaknya 30 hari sebelum persyaratan baru berlaku. Apa yang merupakan perubahan material akan ditentukan atas kebijakan kami sendiri.</p>
          </Section>

           <Section title="8. Hubungi Kami">
            <p>Jika Anda memiliki pertanyaan tentang Persyaratan ini, silakan hubungi kami melalui email di <a href="mailto:admin@goodstock-x.com" className="text-primary hover:underline">admin@goodstock-x.com</a> atau melalui WhatsApp.</p>
          </Section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
