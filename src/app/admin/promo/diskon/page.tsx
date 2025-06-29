
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockDiscounts } from '@/lib/adminMockData';
import type { AdminDiscount } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from '@/components/ui/scroll-area';

const discountFormSchema = z.object({
  code: z.string().min(1, "Kode diskon tidak boleh kosong."),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0, "Nilai tidak boleh negatif."),
  status: z.enum(['Aktif', 'Tidak Aktif', 'Terjadwal']),
  startDate: z.date({ required_error: "Tanggal mulai harus diisi." }),
  endDate: z.date({ required_error: "Tanggal berakhir harus diisi." }),
  minPurchase: z.coerce.number().optional(),
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

const initialDiscountState: Omit<AdminDiscount, 'id'> = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  status: 'Tidak Aktif',
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  minPurchase: 0,
};

export default function AdminPromoDiskonPage() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<AdminDiscount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [discountToEdit, setDiscountToEdit] = useState<AdminDiscount | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<AdminDiscount | null>(null);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      ...initialDiscountState,
      minPurchase: 0,
    },
  });

  useEffect(() => {
    setDiscounts([...mockDiscounts]);
  }, []);

  const handleOpenForm = (discount: AdminDiscount | null) => {
    setDiscountToEdit(discount);
    if (discount) {
      form.reset({
        ...discount,
        minPurchase: discount.minPurchase || undefined,
      });
    } else {
      form.reset({
        ...initialDiscountState,
        minPurchase: undefined,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setDiscountToEdit(null);
    form.reset();
  };

  function onSubmit(data: DiscountFormValues) {
    if (discountToEdit) {
      const index = mockDiscounts.findIndex(d => d.id === discountToEdit.id);
      if (index !== -1) {
        mockDiscounts[index] = { ...discountToEdit, ...data, minPurchase: data.minPurchase || 0 };
      }
    } else {
      const newDiscount: AdminDiscount = { id: `disc-${Date.now()}`, ...data, minPurchase: data.minPurchase || 0 };
      mockDiscounts.unshift(newDiscount);
    }

    setDiscounts([...mockDiscounts]);
    toast({ title: "Sukses", description: `Diskon "${data.code}" berhasil disimpan.` });
    handleCloseForm();
  }

  const handleDelete = () => {
    if (!discountToDelete) return;
    const indexToDelete = mockDiscounts.findIndex(d => d.id === discountToDelete.id);
    if (indexToDelete > -1) {
      mockDiscounts.splice(indexToDelete, 1);
    }
    setDiscounts([...mockDiscounts]);
    toast({ title: "Sukses", description: `Diskon "${discountToDelete.code}" telah dihapus.` });
    setDiscountToDelete(null);
  };

  const getStatusBadgeVariant = (status: AdminDiscount['status']) => {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Tidak Aktif': return 'secondary';
      case 'Terjadwal': return 'outline';
      default: return 'outline';
    }
  };

  const formatValue = (type: 'percentage' | 'fixed', value: number) => {
    return type === 'percentage' ? `${value}%` : `Rp${value.toLocaleString('id-ID')}`;
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">Kelola Diskon Produk</h1>
            <p className="text-muted-foreground">Atur harga promo dan periode diskon.</p>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Diskon Baru
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Diskon</CardTitle>
            <CardDescription>Semua diskon yang pernah dibuat.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Periode</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.code}</TableCell>
                    <TableCell>{discount.description}</TableCell>
                    <TableCell className="text-center">{formatValue(discount.type, discount.value)}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(discount.status)}>{discount.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs">
                        {discount.startDate ? format(discount.startDate, 'dd MMM yyyy', { locale: localeID }) : ''} - {discount.endDate ? format(discount.endDate, 'dd MMM yyyy', { locale: localeID }) : ''}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleOpenForm(discount)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDiscountToDelete(discount)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onEscapeKeyDown={handleCloseForm} className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{discountToEdit ? 'Edit Diskon' : 'Buat Diskon Baru'}</DialogTitle>
            <DialogDescription>Isi detail diskon di bawah ini.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="max-h-[70vh] pr-6">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Diskon</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
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
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipe Diskon</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih tipe diskon" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Persentase</SelectItem>
                              <SelectItem value="fixed">Potongan Tetap</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nilai</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Mulai</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "dd MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Berakhir</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "dd MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aktif">Aktif</SelectItem>
                              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                              <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minPurchase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min. Pembelian (Opsional)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseForm}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={!!discountToDelete} onOpenChange={(open) => !open && setDiscountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
               Anda akan menghapus diskon dengan kode <span className="font-semibold">{discountToDelete?.code}</span>. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
