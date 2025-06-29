
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Youtube, ShoppingCart, Send, MessageSquare, Search, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Footer() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  return (
    <>
      <footer className="bg-foreground text-primary-foreground py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Column 1: About Goodstock-X & Contact */}
            <div>
              <h5 className="text-xl font-headline font-semibold mb-4">Goodstock-X</h5>
              <p className="text-sm text-gray-400 mb-3">
                Sebagai Pusat Fashion Online di Indonesia, kami menciptakan kemungkinan-kemungkinan gaya tanpa batas dengan cara memperluas jangkauan produk, mulai dari produk internasional hingga produk lokal dambaan. Kami menjadikan Anda sebagai pusatnya.
              </p>
              <p className="text-sm text-gray-400 mb-3">Bersama Goodstock-X, <span className="font-semibold text-white">You Own Now.</span></p>
              
              <p className="text-sm text-gray-300 mt-4 mb-1">Layanan Pengaduan Konsumen</p>
              <p className="text-sm text-gray-400">E-mail: <a href="mailto:customer@goodstockx.com" className="hover:text-white hover:underline">customer@goodstockx.com</a></p>
              <p className="text-sm text-gray-400">WhatsApp: <a href="https://wa.me/6281278262893" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">+62 812 7826 2893</a></p>
              
              <h6 className="text-lg font-headline font-semibold mt-6 mb-3">Temukan Kami</h6>
              <div className="flex space-x-3">
                <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
                <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
                <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
                <Link href="#" aria-label="YouTube" className="text-gray-400 hover:text-white"><Youtube size={20} /></Link>
              </div>
            </div>

            {/* Column 2: Layanan */}
            <div>
              <h5 className="text-xl font-headline font-semibold mb-4">Layanan</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
                    <DialogTrigger asChild>
                      <button className="text-gray-400 hover:text-white hover:underline text-left w-full">Cara Memesan</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg bg-background text-foreground">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Cara Memesan di Goodstock-X</DialogTitle>
                        <DialogDescription>
                          Ikuti langkah-langkah mudah berikut untuk mendapatkan produk impian Anda.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2 pr-2 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-start space-x-4 p-2 rounded-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full mt-1">
                            <Search className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">1. Jelajahi & Pilih Produk</h4>
                            <p className="text-muted-foreground">Temukan produk yang Anda inginkan. Gunakan fitur filter, pencarian, atau navigasi menu untuk mempermudah.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 p-2 rounded-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full mt-1">
                            <ShoppingCart className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">2. Tambahkan ke Keranjang</h4>
                            <p className="text-muted-foreground">Pada halaman detail produk, pilih ukuran (jika ada), lalu klik tombol "Tambah ke Keranjang". Ulangi untuk semua barang yang Anda inginkan.</p>
                          </div>
                        </div>
                         <div className="flex items-start space-x-4 p-2 rounded-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full mt-1">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">3. Buka Form WhatsApp</h4>
                            <p className="text-muted-foreground">Gulir ke bagian bawah halaman dan temukan bagian "Pesan Cepat via WhatsApp". Keranjang belanja Anda akan otomatis muncul di sana.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 p-2 rounded-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full mt-1">
                            <Send className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">4. Isi Form & Kirim</h4>
                            <p className="text-muted-foreground">Lengkapi data diri Anda pada formulir, lalu klik tombol "Kirim Pesanan". Anda akan diarahkan ke aplikasi WhatsApp dengan pesan yang sudah siap kirim.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 p-2 rounded-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full mt-1">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">5. Konfirmasi & Pembayaran</h4>
                            <p className="text-muted-foreground">Tim admin kami akan segera membalas untuk konfirmasi stok, total biaya, dan instruksi pembayaran. Selamat berbelanja!</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Product Index</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Konfirmasi Transfer</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Hubungi Kami</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Status Order</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Brand di Goodstock-X</Link></li>
              </ul>
            </div>

            {/* Column 3: Tentang Kami */}
            <div>
              <h5 className="text-xl font-headline font-semibold mb-4">Tentang Kami</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Promosikan Brand Anda</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Persyaratan & Ketentuan</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Influencer Program</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white hover:underline">Goodstock-X THREAD</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h5 className="text-xl font-headline font-semibold mb-4">Anda Baru di Goodstock-X</h5>
              <p className="text-sm text-gray-400 mb-3">
                Dapatkan berita mode terbaru dan peluncuran produk hanya dengan subscribe newsletter kami.
              </p>
              <form className="space-y-3 mb-6">
                <Input 
                  type="email" 
                  placeholder="Alamat email Kamu" 
                  className="bg-background text-foreground placeholder:text-muted-foreground border-gray-600 focus:border-primary"
                />
                <div className="flex space-x-2">
                  <Button type="submit" variant="outline" className="w-full border-gray-500 text-gray-300 hover:bg-primary hover:text-primary-foreground hover:border-primary">WANITA</Button>
                  <Button type="submit" variant="outline" className="w-full border-gray-500 text-gray-300 hover:bg-primary hover:text-primary-foreground hover:border-primary">PRIA</Button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mb-6">
                Dengan mendaftar, Anda menyetujui persyaratan dalam Kebijakan Privasi kami.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p className="mb-4 md:mb-0 text-center md:text-left">Anda punya pertanyaan? Kami siap membantu. <Link href="#" className="hover:text-white hover:underline">Kontak</Link> | <Link href="#" className="hover:text-white hover:underline">Bantuan</Link></p>
              <div className="flex flex-col items-center md:flex-row md:space-x-4">
                <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0 mb-3 md:mb-0">
                  <Link href="#" className="hover:text-white hover:underline">Tentang Goodstock-X</Link>
                  <Link href="#" className="hover:text-white hover:underline">Kebijakan Privasi</Link>
                  <Link href="#" className="hover:text-white hover:underline">Persyaratan dan Ketentuan</Link>
                </div>
                <p className="text-center md:text-right">&copy; {new Date().getFullYear()} Goodstock-X. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
