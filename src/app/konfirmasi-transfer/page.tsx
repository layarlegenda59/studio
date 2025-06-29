
"use client";

import React, { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/types';
import { UploadCloud, X } from 'lucide-react';

const ADMIN_WHATSAPP_NUMBER = "+6281278262893"; 

export default function KonfirmasiTransferPage() {
  const { toast } = useToast();

  // Dummy state for Header props
  const [headerWishlistItems, setHeaderWishlistItems] = useState<Product[]>([]);
  const [headerCartItems, setHeaderCartItems] = useState<Set<string>>(new Set());

  const handleRemoveFromHeaderWishlist = (productId: string) => {};
  const handleToggleCartFromHeaderWishlist = (productId: string) => {};

  // Form state
  const [orderId, setOrderId] = useState('');
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Ukuran Gambar Terlalu Besar",
          description: "Maksimal ukuran gambar adalah 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!orderId || !name || !bankName || !accountName || !amount || !transferDate || !imagePreview) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon isi semua field dan unggah bukti transfer.",
        variant: "destructive",
      });
      return;
    }
    
    const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount.replace(/\D/g, '')));

    const messageParts = [
      "**Konfirmasi Transfer**\n",
      "Halo Admin Goodstock-X, saya ingin mengonfirmasi pembayaran untuk pesanan saya.\n",
      `*No. Pesanan/Invoice:* ${orderId}`,
      `*Nama Lengkap:* ${name}`,
      `*Bank Pengirim:* ${bankName}`,
      `*Atas Nama:* ${accountName}`,
      `*Jumlah Transfer:* ${formattedAmount}`,
      `*Tanggal Transfer:* ${transferDate}\n`,
      "Terima kasih.",
      "*(Saya akan segera melampirkan bukti transfer di chat ini)*"
    ];

    const message = messageParts.join("\n");
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast({
      title: "Form Terkirim!",
      description: "Anda akan diarahkan ke WhatsApp. Jangan lupa lampirkan bukti transfer.",
    });
  };
  
  const formatCurrency = (value: string) => {
    const numStr = value.replace(/\D/g, '');
    if (numStr === '') return '';
    return new Intl.NumberFormat('id-ID').format(Number(numStr));
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        wishlistItems={headerWishlistItems}
        onRemoveFromWishlist={handleRemoveFromHeaderWishlist}
        itemsAddedToCartFromWishlist={headerCartItems}
        onToggleCartFromWishlist={handleToggleCartFromHeaderWishlist}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Konfirmasi Transfer</CardTitle>
              <CardDescription>Isi form di bawah ini untuk mengonfirmasi pembayaran Anda.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Nomor Pesanan / Invoice <span className="text-destructive">*</span></Label>
                  <Input id="orderId" placeholder="Contoh: INV-20240729-001" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap Sesuai Pesanan <span className="text-destructive">*</span></Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Nama Bank Anda <span className="text-destructive">*</span></Label>
                        <Input id="bankName" placeholder="Contoh: BCA" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="accountName">Nama Pemilik Rekening <span className="text-destructive">*</span></Label>
                        <Input id="accountName" placeholder="John Doe" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Jumlah Transfer <span className="text-destructive">*</span></Label>
                        <Input id="amount" placeholder="500.000" value={formatCurrency(amount)} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="transferDate">Tanggal Transfer <span className="text-destructive">*</span></Label>
                        <Input id="transferDate" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="receipt">Unggah Bukti Transfer <span className="text-destructive">*</span></Label>
                    {imagePreview ? (
                        <div className="relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                            <Image src={imagePreview} alt="Preview Bukti Transfer" fill className="object-contain rounded-md p-2" />
                             <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                onClick={() => {
                                    setImagePreview(null);
                                    const fileInput = document.getElementById('receipt') as HTMLInputElement;
                                    if(fileInput) fileInput.value = "";
                                }}
                             >
                                <X className="h-4 w-4" />
                             </Button>
                        </div>
                    ) : (
                        <label htmlFor="receipt" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk unggah</span> atau seret file</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, atau JPEG (Maks. 2MB)</p>
                            </div>
                            <Input id="receipt" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" />
                        </label>
                    )}
                 </div>

              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full">
                    Kirim Konfirmasi via WhatsApp
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
