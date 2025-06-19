
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'adminpassword') {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang, Admin!",
        });
        router.push('/admin/dashboard');
      } else {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="flex justify-center mb-4">
             <Image
                src={textLogoUrl}
                alt="ModeMatch Logo"
                width={180}
                height={42}
                priority
              />
          </Link>
          <CardTitle className="text-2xl font-headline">Masuk Akun</CardTitle>
          <CardDescription>Masukkan email dan password Anda untuk melanjutkan.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="adminpassword" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-end text-sm">
              <Link href="#" className="text-primary hover:underline">
                Lupa password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Daftar di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
