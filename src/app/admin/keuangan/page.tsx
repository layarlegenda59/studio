
"use client";

import React, { useState, useMemo } from 'react';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useToast } from '@/hooks/use-toast';
import { mockTransactions } from "@/lib/adminMockData";
import type { AdminTransaction, AdminTransactionType } from "@/lib/types";
import { cn } from '@/lib/utils';
import { DollarSign, TrendingDown, TrendingUp, PlusCircle, FileText, MoreHorizontal, Edit, Trash2, CalendarIcon } from 'lucide-react';

const expenseCategories = ['Pemasaran', 'Pembelian Stok', 'Operasional', 'Logistik', 'Lainnya'];

const transactionFormSchema = z.object({
  description: z.string().min(3, "Deskripsi minimal 3 karakter."),
  category: z.string().min(1, "Kategori harus dipilih."),
  amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0."),
  date: z.date({ required_error: "Tanggal harus diisi." }),
  notes: z.string().optional(),
});
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const formatCurrencyInput = (value: string | number) => {
  if (value === null || value === undefined) return '';
  const numStr = String(value).replace(/\D/g, '');
  if (numStr === '') return '';
  return new Intl.NumberFormat('id-ID').format(Number(numStr));
};

export default function AdminKeuanganPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<AdminTransaction[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState('semua');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<AdminTransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AdminTransaction | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
  });

  const { totalRevenue, totalExpenses, netProfit } = useMemo(() => {
    const revenue = transactions
      .filter(t => t.type === 'Pendapatan')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'Pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'semua') return transactions;
    const type = activeTab === 'pendapatan' ? 'Pendapatan' : 'Pengeluaran';
    return transactions.filter(t => t.type === type);
  }, [transactions, activeTab]);

  const handleOpenForm = (transaction: AdminTransaction | null) => {
    setTransactionToEdit(transaction);
    if (transaction) {
      form.reset({
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        date: new Date(transaction.date),
        notes: transaction.notes || '',
      });
    } else {
      form.reset({
        description: '',
        category: '',
        amount: 0,
        date: new Date(),
        notes: '',
      });
    }
    setIsFormOpen(true);
  };

  const onSubmit = (data: TransactionFormValues) => {
    const newTransactionData = {
        ...data,
        date: data.date.toISOString(),
    };

    if (transactionToEdit) {
      // Edit
      const updatedTransaction: AdminTransaction = {
        ...transactionToEdit,
        ...newTransactionData,
      };
      const index = mockTransactions.findIndex(t => t.id === transactionToEdit.id);
      if (index !== -1) mockTransactions[index] = updatedTransaction;
      toast({ title: "Sukses", description: "Transaksi berhasil diperbarui." });
    } else {
      // Add
      const newTransaction: AdminTransaction = {
        id: `trx-exp-${Date.now()}`,
        type: 'Pengeluaran',
        ...newTransactionData,
      };
      mockTransactions.unshift(newTransaction);
      toast({ title: "Sukses", description: "Pengeluaran baru berhasil ditambahkan." });
    }
    
    setTransactions([...mockTransactions]);
    setIsFormOpen(false);
  };
  
  const handleDelete = () => {
    if (!transactionToDelete) return;
    const index = mockTransactions.findIndex(t => t.id === transactionToDelete.id);
    if (index > -1) {
      mockTransactions.splice(index, 1);
    }
    setTransactions([...mockTransactions]);
    toast({ title: "Sukses", description: "Transaksi telah dihapus." });
    setTransactionToDelete(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Ringkasan pendapatan, pengeluaran, dan laba.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
           <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Dari pesanan terkonfirmasi "Dikirim"</p>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
               <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">Restock, promo, operasional</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Laba Bersih</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
               <p className="text-xs text-muted-foreground">Pendapatan - Pengeluaran</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Riwayat Transaksi</CardTitle>
                    <CardDescription>Input manual untuk pengeluaran dan ekspor laporan.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                        <FileText className="mr-2 h-4 w-4" /> Ekspor (Segera Hadir)
                    </Button>
                    <Button onClick={() => handleOpenForm(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengeluaran
                    </Button>
                  </div>
              </div>
          </CardHeader>
          <CardContent>
             <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="semua">Semua</TabsTrigger>
                  <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
                  <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                </TabsList>
                <TabsContent value="semua" className="mt-4">
                  <TransactionTable transactions={filteredTransactions} onEdit={handleOpenForm} onDelete={setTransactionToDelete} />
                </TabsContent>
                 <TabsContent value="pendapatan" className="mt-4">
                  <TransactionTable transactions={filteredTransactions} onEdit={handleOpenForm} onDelete={setTransactionToDelete} />
                </TabsContent>
                 <TabsContent value="pengeluaran" className="mt-4">
                  <TransactionTable transactions={filteredTransactions} onEdit={handleOpenForm} onDelete={setTransactionToDelete} />
                </TabsContent>
              </Tabs>
          </CardContent>
        </Card>
         <div className="flex justify-center mt-8">
              <Button asChild variant="outline">
                <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
              </Button>
          </div>
      </div>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{transactionToEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori pengeluaran" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Jumlah (Rp)</FormLabel>
                <FormControl>
                    <Input type="text" value={field.value ? formatCurrencyInput(field.value) : ''}
                      onChange={(e) => field.onChange(Number(e.target.value.replace(/\D/g, '')))} />
                </FormControl>
                <FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal Transaksi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP", { locale: localeID }) : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                <FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Catatan (Opsional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!transactionToDelete} onOpenChange={open => !open && setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus transaksi secara permanen. Data tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface TransactionTableProps {
  transactions: AdminTransaction[];
  onEdit: (transaction: AdminTransaction) => void;
  onDelete: (transaction: AdminTransaction) => void;
}

function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead><span className="sr-only">Aksi</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-xs">{format(new Date(t.date), 'dd MMM yyyy')}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell className="hidden md:table-cell">{t.category}</TableCell>
              <TableCell className={cn("text-right font-medium", t.type === 'Pendapatan' ? 'text-green-600' : 'text-red-600')}>
                {t.type === 'Pendapatan' ? '+' : '-'} {formatCurrency(t.amount)}
              </TableCell>
              <TableCell className="text-right">
                {t.type === 'Pengeluaran' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(t)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(t)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Tidak ada transaksi ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
