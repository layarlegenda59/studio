
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

// Use a specific type for the form data, omitting the 'id'
type FormDataType = Omit<AdminDiscount, 'id'>;

const initialDiscountState: FormDataType = {
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
  
  // A single state object to hold all form data
  const [formData, setFormData] = useState<FormDataType>({ ...initialDiscountState });

  useEffect(() => {
    // Load initial table data from mock source
    setDiscounts([...mockDiscounts]);
  }, []);

  const handleOpenForm = (discount: AdminDiscount | null) => {
    setDiscountToEdit(discount);
    // When opening the form, set the formData state from the selected discount or reset to initial values
    setFormData(discount ? { ...discount } : { ...initialDiscountState });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setDiscountToEdit(null);
    // Reset form data on close to avoid stale data
    setFormData({ ...initialDiscountState });
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast({ title: "Error", description: "Kode diskon tidak boleh kosong.", variant: "destructive" });
      return;
    }

    if (discountToEdit) {
      // Find the discount in the mock data source and update it
      const index = mockDiscounts.findIndex(d => d.id === discountToEdit.id);
      if (index !== -1) {
        // Replace the old data with the new data from the form
        mockDiscounts[index] = { id: discountToEdit.id, ...formData };
      }
    } else {
      // Create a new discount and add it to the mock data source
      const newDiscount: AdminDiscount = { id: `disc-${Date.now()}`, ...formData };
      mockDiscounts.unshift(newDiscount);
    }

    // Update the local state to re-render the table
    setDiscounts([...mockDiscounts]);
    toast({ title: "Sukses", description: `Diskon "${formData.code}" berhasil disimpan.` });
    handleCloseForm();
  };

  const handleDelete = () => {
    if (!discountToDelete) return;
    const indexToDelete = mockDiscounts.findIndex(d => d.id === discountToDelete.id);
    if (indexToDelete > -1) {
      // Remove the discount from the mock data source
      mockDiscounts.splice(indexToDelete, 1);
    }
    // Update local state to re-render the table
    setDiscounts([...mockDiscounts]);
    toast({ title: "Sukses", description: `Diskon "${discountToDelete.code}" telah dihapus.` });
    setDiscountToDelete(null);
  };
  
  // Helper functions for display formatting
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
      
      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onEscapeKeyDown={handleCloseForm} onPointerDownOutside={handleCloseForm} className="sm:max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{discountToEdit ? 'Edit Diskon' : 'Buat Diskon Baru'}</DialogTitle>
              <DialogDescription>
                Isi detail diskon di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
               <div className="space-y-2">
                  <Label htmlFor="code">Kode Diskon</Label>
                  <Input id="code" value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))} />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="type">Tipe Diskon</Label>
                   <Select 
                      onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))} 
                      value={formData.type}
                    >
                      <SelectTrigger><SelectValue placeholder="Pilih tipe diskon" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase</SelectItem>
                        <SelectItem value="fixed">Potongan Tetap</SelectItem>
                      </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="value">Nilai</Label>
                  <Input id="value" type="number" value={formData.value} onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) || 0 }))} />
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
                        <Calendar mode="single" selected={formData.startDate} onSelect={(date) => date && setFormData(prev => ({...prev, startDate: date}))} initialFocus />
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
                        <Calendar mode="single" selected={formData.endDate} onSelect={(date) => date && setFormData(prev => ({...prev, endDate: date}))} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                   <Select 
                      onValueChange={(value: "Aktif" | "Tidak Aktif" | "Terjadwal") => setFormData(prev => ({...prev, status: value}))}
                      value={formData.status}
                    >
                      <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                        <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                      </SelectContent>
                  </Select>
               </div>
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Min. Pembelian (Opsional)</Label>
                  <Input id="minPurchase" type="number" value={formData.minPurchase || 0} onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: Number(e.target.value) || 0 }))} />
               </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
       {/* Delete Confirmation Dialog */}
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
