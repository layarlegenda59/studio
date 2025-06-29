
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function RegisterPage() {
    const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
         <CardHeader className="space-y-1 text-center">
           <Link href="/" className="flex justify-center mb-4">
             <Image
                src={textLogoUrl}
                alt="Goodstock-X Logo"
                width={180}
                height={42}
                priority
              />
          </Link>
          <CardTitle className="text-2xl font-headline">Buat Akun Baru</CardTitle>
          <CardDescription>Isi form di bawah ini untuk mendaftar.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" placeholder="Nama Lengkap Anda" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Buat password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Ulangi password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Daftar</Button>
           <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
