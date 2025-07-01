
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { mockProducts, saveProducts } from "@/lib/mockData";
import { mockCategories } from "@/lib/adminMockData";
import Link from 'next/link';
import React from "react";

const allSizes = [
  "S", "M", "L", "XL", "XXL", "XXXL",
  "35", "36", "37", "37.5", "38", "38.5", "39", "40", "41", "42", "43", "44", "45", "46.5", "47",
  "One Size"
].sort((a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const isANumber = !isNaN(numA);
  const isBNumber = !isNaN(numB);

  if (isANumber && isBNumber) return numA - numB;
  if (isANumber) return -1; 
  if (isBNumber) return 1;
  if (a === "One Size") return 1; 
  if (b === "One Size") return -1;
  return a.localeCompare(b); 
});
const allCategories = mockCategories.map(c => c.name);
const allGenders = Array.from(new Set(mockProducts.map(p => p.gender)));

const productFormSchema = z.object({
  name: z.string().min(3, { message: "Nama produk harus minimal 3 karakter." }),
  brand: z.string().min(2, { message: "Merek harus diisi." }),
  category: z.string({ required_error: "Pilih kategori." }),
  gender: z.string({ required_error: "Pilih gender." }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
  originalPrice: z.coerce.number().min(1, { message: "Harga harus diisi." }),
  promoPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, { message: "Stok tidak boleh negatif." }),
  sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Anda harus memilih setidaknya satu ukuran.",
  }),
  isPromo: z.boolean().default(false),
}).refine(data => {
    if (data.promoPrice !== undefined && data.promoPrice > 0 && data.promoPrice >= data.originalPrice) {
        return false;
    }
    return true;
}, {
    message: "Harga promo harus lebih rendah dari harga asli.",
    path: ["promoPrice"],
});


type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
}

// Helper function to format number with dots
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return "";
  return new Intl.NumberFormat('id-ID').format(value);
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: Partial<ProductFormValues> = product ? {
      ...product,
      promoPrice: product.promoPrice ?? undefined,
      stock: product.stock ?? 0,
    } : {
      name: "",
      brand: "",
      description: "",
      imageUrl: "",
      originalPrice: 0,
      stock: 0,
      sizes: [],
      isPromo: false,
    };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [formattedOriginalPrice, setFormattedOriginalPrice] = React.useState(formatCurrency(defaultValues.originalPrice));
  const [formattedPromoPrice, setFormattedPromoPrice] = React.useState(formatCurrency(defaultValues.promoPrice));

  function onSubmit(data: ProductFormValues) {
     const finalData = {
        ...data,
        promoPrice: (data.promoPrice === 0 || data.promoPrice === undefined) ? undefined : data.promoPrice,
    };

    if (product) {
      // Editing an existing product
      const productIndex = mockProducts.findIndex(p => p.id === product.id);
      if (productIndex !== -1) {
        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          ...finalData,
        };
      }
    } else {
      // Adding a new product
      const newProduct: Product = {
        id: `prod${Date.now()}`,
        salesCount: 0,
        ...finalData,
      };
      mockProducts.unshift(newProduct);
    }
    
    saveProducts();

    toast({
      title: `Produk ${product ? 'Diperbarui' : 'Ditambahkan'}`,
      description: `Produk "${data.name}" telah berhasil disimpan.`,
    });

    // Redirect back to the product list and refresh data
    router.push('/admin/produk');
    router.refresh();
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'originalPrice' | 'promoPrice') => {
      const value = e.target.value;
      const cleanedValue = value.replace(/\D/g, '');
      const numValue = cleanedValue === '' ? 0 : Number(cleanedValue);
      
      if (fieldName === 'originalPrice') {
        setFormattedOriginalPrice(formatCurrency(numValue));
        form.setValue('originalPrice', numValue, { shouldValidate: true });
      } else {
        setFormattedPromoPrice(formatCurrency(numValue));
        form.setValue('promoPrice', numValue, { shouldValidate: true });
      }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nama Produk</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: Sneakers Pria Keren" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Merek</FormLabel>
                        <FormControl>
                            <Input placeholder="cth: Nike" {...field} />
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
                        <FormLabel>URL Gambar</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
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
                            placeholder="Jelaskan detail produk di sini..."
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Kategori</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih gender" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {allGenders.map(gen => (
                                    <SelectItem key={gen} value={gen}>{gen}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="originalPrice"
                        render={() => (
                            <FormItem>
                            <FormLabel>Harga Asli</FormLabel>
                            <FormControl>
                                <Input 
                                  type="text"
                                  placeholder="500.000"
                                  value={formattedOriginalPrice}
                                  onChange={(e) => handlePriceChange(e, 'originalPrice')}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="promoPrice"
                        render={() => (
                            <FormItem>
                            <FormLabel>Harga Promo (Opsional)</FormLabel>
                            <FormControl>
                                <Input 
                                  type="text"
                                  placeholder="399.000"
                                  value={formattedPromoPrice}
                                  onChange={(e) => handlePriceChange(e, 'promoPrice')}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Jumlah Stok</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="sizes"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Ukuran</FormLabel>
                            <FormDescription>
                            Pilih semua ukuran yang tersedia untuk produk ini.
                            </FormDescription>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                        {allSizes.map((item) => (
                            <FormField
                            key={item}
                            control={form.control}
                            name="sizes"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item
                                                )
                                            );
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item}
                                    </FormLabel>
                                </FormItem>
                                );
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="isPromo"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                        <div className="space-y-0.5">
                            <FormLabel>Produk Promo</FormLabel>
                            <FormDescription>
                            Aktifkan jika produk ini sedang dalam masa promo.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" asChild>
                <Link href="/admin/produk">Batal</Link>
            </Button>
            <Button type="submit">{product ? 'Simpan Perubahan' : 'Tambah Produk'}</Button>
        </div>
      </form>
    </Form>
  );
}
