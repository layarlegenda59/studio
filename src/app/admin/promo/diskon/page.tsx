
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [formData, setFormData] = useState<Partial<AdminDiscount>>(initialDiscountState);

  useEffect(() => {
    setDiscounts(mockDiscounts);
  }, []);

  const handleOpenForm = (discount: AdminDiscount | null) => {
    setDiscountToEdit(discount);
    setFormData(discount ? { ...discount } : initialDiscountState);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setDiscountToEdit(null);
    setFormData(initialDiscountState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'value' || id === 'minPurchase' ? Number(value) : value }));
  };

  const handleSelectChange = (id: keyof AdminDiscount, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleDateChange = (id: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [id]: date }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) {
      toast({ title: "Error", description: "Kode diskon tidak boleh kosong.", variant: "destructive" });
      return;
    }

    if (discountToEdit) {
      const index = mockDiscounts.findIndex(d => d.id === discountToEdit.id);
      if (index !== -1) {
        mockDiscounts[index] = formData as AdminDiscount;
      }
    } else {
      const newDiscount: AdminDiscount = { id: `disc-${Date.now()}`, ...formData } as AdminDiscount;
      mockDiscounts.push(newDiscount);
    }

    setDiscounts([...mockDiscounts]);
    toast({ title: "Sukses", description: `Diskon "${formData.code}" berhasil disimpan.` });
    handleCloseForm();
  };

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
                        {format(discount.startDate, 'dd MMM yyyy', { locale: localeID })} - {format(discount.endDate, 'dd MMM yyyy', { locale: localeID })}
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
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{discountToEdit ? 'Edit Diskon' : 'Buat Diskon Baru'}</DialogTitle>
              <DialogDescription>
                Isi detail diskon di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
               <div className="space-y-2">
                  <Label htmlFor="code">Kode Diskon</Label>
                  <Input id="code" value={formData.code || ''} onChange={handleInputChange} />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" value={formData.description || ''} onChange={handleInputChange} />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="type">Tipe Diskon</Label>
                   <Select onValueChange={(val) => handleSelectChange('type', val)} value={formData.type}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase</SelectItem>
                        <SelectItem value="fixed">Potongan Tetap</SelectItem>
                      </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="value">Nilai</Label>
                  <Input id="value" type="number" value={formData.value || 0} onChange={handleInputChange} />
               </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "dd MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.startDate} onSelect={(date) => handleDateChange('startDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Berakhir</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "dd MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.endDate} onSelect={(date) => handleDateChange('endDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                   <Select onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                        <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                      </SelectContent>
                  </Select>
               </div>
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Min. Pembelian (Opsional)</Label>
                  <Input id="minPurchase" type="number" value={formData.minPurchase || 0} onChange={handleInputChange} />
               </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
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
