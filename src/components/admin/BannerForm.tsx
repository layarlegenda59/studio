"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Promotion } from "@/lib/types";
import { mockPromotions } from "@/lib/mockData";
import Link from 'next/link';

const bannerFormSchema = z.object({
  title: z.string().min(3, { message: "Judul harus minimal 3 karakter." }),
  description: z.string().min(10, { message: "Deskripsi harus minimal 10 karakter." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
  ctaText: z.string().min(1, { message: "Teks tombol tidak boleh kosong." }),
  ctaLink: z.string().min(1, { message: "Link tombol tidak boleh kosong." }),
  objectPosition: z.string().optional(),
});

type BannerFormValues = z.infer<typeof bannerFormSchema>;

interface BannerFormProps {
  promotion?: Promotion;
}

export default function BannerForm({ promotion }: BannerFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: Partial<BannerFormValues> = promotion ? { ...promotion } : {
    title: "",
    description: "",
    imageUrl: "",
    ctaText: "Belanja Sekarang",
    ctaLink: "/#products",
    objectPosition: "50% 50%",
  };

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: BannerFormValues) {
    if (promotion) {
      // Editing an existing promotion
      const promoIndex = mockPromotions.findIndex(p => p.id === promotion.id);
      if (promoIndex !== -1) {
        mockPromotions[promoIndex] = { ...promotion, ...data };
      }
    } else {
      // Adding a new promotion
      const newPromotion: Promotion = {
        id: `promo${Date.now()}`,
        ...data,
      };
      mockPromotions.unshift(newPromotion);
    }
    
    toast({
      title: `Banner ${promotion ? 'Diperbarui' : 'Ditambahkan'}`,
      description: `Banner "${data.title}" telah berhasil disimpan.`,
    });

    router.push('/admin/promo/banner');
    router.refresh(); // Invalidate the cache to show new data on the list page
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Judul Banner</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: Sale Akhir Tahun" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Jelaskan detail promo di sini..."
                                className="resize-none h-24"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Gambar Banner</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/banner.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="ctaText"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Teks Tombol (CTA)</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: Belanja Sekarang" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ctaLink"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Link Tombol (CTA)</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: /#products atau https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Link tujuan saat tombol di-klik. Bisa internal (cth: /#products) atau eksternal.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="objectPosition"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fokus Gambar (Opsional)</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: 50% 25%" {...field} />
                        </FormControl>
                         <FormDescription>
                          Format CSS `object-position` (e.g., "center top", "50% 25%").
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" asChild>
                <Link href="/admin/promo/banner">Batal</Link>
            </Button>
            <Button type="submit">{promotion ? 'Simpan Perubahan' : 'Tambah Banner'}</Button>
        </div>
      </form>
    </Form>
  );
}
