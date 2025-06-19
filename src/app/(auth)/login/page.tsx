
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function LoginPage() {
  const textLogoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Tulisan%20goodstock-x.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9UdWxpc2FuIGdvb2RzdG9jay14LnBuZyIsImlhdCI6MTc1MDIyMDkwMSwiZXhwIjoxNzgxNzU2OTAxfQ.8YG6sCtxclkFeZuwzQqCFaWzjhQtOYbnJRWt-leGlCE";

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
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
           <div className="flex items-center justify-end text-sm">
            <Link href="#" className="text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Masuk</Button>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
