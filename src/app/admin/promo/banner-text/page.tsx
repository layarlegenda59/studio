
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';
import React, { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockTopBanners, TOP_BANNERS_KEY } from "@/lib/adminMockData";
import type { AdminTopBanner } from "@/lib/types";

const bannerTextFormSchema = z.object({
  banner1: z.string().min(1, "Teks banner 1 tidak boleh kosong."),
  banner2: z.string().min(1, "Teks banner 2 tidak boleh kosong."),
  banner3: z.string().min(1, "Teks banner 3 tidak boleh kosong."),
});

type BannerTextFormValues = z.infer<typeof bannerTextFormSchema>;

export default function AdminBannerTextPage() {
  const { toast } = useToast();

  const form = useForm<BannerTextFormValues>({
    resolver: zodResolver(bannerTextFormSchema),
    defaultValues: {
      banner1: mockTopBanners[0]?.text || '',
      banner2: mockTopBanners[1]?.text || '',
      banner3: mockTopBanners[2]?.text || '',
    },
  });

  useEffect(() => {
    try {
      const savedBannersJSON = localStorage.getItem(TOP_BANNERS_KEY);
      if (savedBannersJSON) {
        const savedBanners: AdminTopBanner[] = JSON.parse(savedBannersJSON);
        form.reset({
          banner1: savedBanners[0]?.text || '',
          banner2: savedBanners[1]?.text || '',
          banner3: savedBanners[2]?.text || '',
        });
      }
    } catch (error) {
      console.error("Gagal memuat teks banner dari localStorage", error);
    }
  }, [form]);

  function onSubmit(data: BannerTextFormValues) {
    try {
      // Create the new banner data structure, preserving IDs, icons, and links from the original mock
      const updatedBanners: AdminTopBanner[] = mockTopBanners.map((banner, index) => {
        const key = `banner${index + 1}` as keyof BannerTextFormValues;
        return {
          ...banner,
          text: data[key],
        };
      });

      localStorage.setItem(TOP_BANNERS_KEY, JSON.stringify(updatedBanners));
      
      toast({
        title: "Teks Banner Disimpan",
        description: "Teks banner di header telah berhasil diperbarui. Muat ulang halaman toko untuk melihat perubahan.",
      });
    } catch (error) {
      console.error("Gagal menyimpan teks banner ke localStorage", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan banner.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Pengaturan Teks Banner Atas</h1>
          <p className="text-muted-foreground">Ubah teks yang ditampilkan di banner promosi paling atas.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Teks Banner</CardTitle>
            <CardDescription>Masukkan teks baru untuk setiap slot banner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="banner1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Banner 1 (Paling Kiri)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banner2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Banner 2 (Tengah)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banner3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Banner 3 (Paling Kanan)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
           <CardFooter className="border-t pt-6 flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali</Link>
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
        </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
