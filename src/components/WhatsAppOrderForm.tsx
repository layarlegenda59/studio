
"use client";

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/types';
import { X } from 'lucide-react';

// Replace with your admin's WhatsApp number
const ADMIN_WHATSAPP_NUMBER = "+6281278262893"; 

interface WhatsAppOrderFormProps {
  orderedItems?: Product[];
  onRemoveItem?: (productId: string) => void;
}

export default function WhatsAppOrderForm({ orderedItems = [], onRemoveItem }: WhatsAppOrderFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !whatsapp || !address) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Mohon isi nama, nomor WhatsApp, dan alamat.",
        variant: "destructive",
      });
      return;
    }

    const messageParts = [
      "Halo Admin Goodstock-X, saya ingin memesan:",
      `Nama: ${name}`,
    ];
    if (email) messageParts.push(`Email: ${email}`);
    messageParts.push(`No. WhatsApp: ${whatsapp}`);
    messageParts.push(`Alamat: ${address}`);
    
    if (orderedItems.length > 0) {
      messageParts.push("\nBarang yang dipesan:");
      orderedItems.forEach(item => {
        messageParts.push(`- ${item.name}`);
      });
    }

    if (notes) messageParts.push(`\nCatatan: ${notes}`);
    
    messageParts.push("\nMohon informasi lanjutannya. Terima kasih!");

    const message = messageParts.join("\n");
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Optionally clear form or show success message
    setName('');
    setEmail('');
    setWhatsapp('');
    setAddress('');
    setNotes('');
    toast({
        title: "Form Terkirim!",
        description: "Anda akan diarahkan ke WhatsApp untuk mengirim pesanan.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Form Pemesanan via WhatsApp</CardTitle>
        <CardDescription>Isi detail pesanan Anda di bawah ini.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp <span className="text-destructive">*</span></Label>
            <Input id="whatsapp" type="tel" placeholder="081234567890" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap Pengiriman <span className="text-destructive">*</span></Label>
            <Textarea id="address" placeholder="Jl. Merdeka No. 1, Kota, Provinsi, Kode Pos" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          
          {orderedItems.length > 0 && (
            <div className="space-y-2">
              <Label>Barang yang dipesan:</Label>
              <div className="space-y-2 rounded-md border p-3 max-h-48 overflow-y-auto bg-background/50">
                {orderedItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          sizes="40px" 
                          className="object-cover" 
                        />
                      </div>
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    {onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Hapus ${item.name} dari pesanan`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
            <Textarea id="notes" placeholder="Contoh: Ukuran XL, warna hitam, atau detail produk yang diinginkan" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Kirim Pesanan via WhatsApp
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
