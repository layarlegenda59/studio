"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

// Replace with your admin's WhatsApp number
const ADMIN_WHATSAPP_NUMBER = "+6281234567890"; 

export default function WhatsAppOrderForm() {
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
      "Halo Admin ModeMatch, saya ingin memesan:",
      `Nama: ${name}`,
    ];
    if (email) messageParts.push(`Email: ${email}`);
    messageParts.push(`No. WhatsApp: ${whatsapp}`);
    messageParts.push(`Alamat: ${address}`);
    if (notes) messageParts.push(`Catatan: ${notes}`);
    
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
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
            <Textarea id="notes" placeholder="Contoh: Ukuran XL, warna hitam" value={notes} onChange={(e) => setNotes(e.target.value)} />
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
