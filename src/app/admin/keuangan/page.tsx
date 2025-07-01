
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { mockTransactions, saveTransactions } from "@/lib/adminMockData";
import type { AdminTransaction, AdminTransactionType } from "@/lib/types";
import { cn } from '@/lib/utils';
import { DollarSign, TrendingDown, TrendingUp, PlusCircle, FileText, MoreHorizontal, Edit, Trash2, CalendarIcon, ChevronDown } from 'lucide-react';

const transactionCategories = {
  Pendapatan: ['Penjualan Produk', 'Pendapatan Lainnya'],
  Pengeluaran: ['Pemasaran', 'Pembelian Stok', 'Operasional', 'Logistik', 'Lainnya']
};

const transactionFormSchema = z.object({
  type: z.enum(['Pendapatan', 'Pengeluaran'], { required_error: "Jenis transaksi harus dipilih." }),
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

  // Re-sync state with the (potentially updated) mock data from localStorage
  useEffect(() => {
    setTransactions([...mockTransactions]);
  }, []);

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
        type: transaction.type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        date: new Date(transaction.date),
        notes: transaction.notes || '',
      });
    } else {
      form.reset({
        type: 'Pengeluaran',
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
      const index = mockTransactions.findIndex(t => t.id === transactionToEdit.id);
      if (index !== -1) mockTransactions[index] = { ...transactionToEdit, ...newTransactionData };
      toast({ title: "Sukses", description: "Transaksi berhasil diperbarui." });
    } else {
      const newTransaction: AdminTransaction = { id: `trx-manual-${Date.now()}`, ...newTransactionData };
      mockTransactions.unshift(newTransaction);
      toast({ title: "Sukses", description: "Transaksi baru berhasil ditambahkan." });
    }
    
    saveTransactions();
    setTransactions([...mockTransactions]);
    setIsFormOpen(false);
  };
  
  const handleDelete = () => {
    if (!transactionToDelete) return;
    const index = mockTransactions.findIndex(t => t.id === transactionToDelete.id);
    if (index > -1) {
      mockTransactions.splice(index, 1);
    }
    saveTransactions();
    setTransactions([...mockTransactions]);
    toast({ title: "Sukses", description: "Transaksi telah dihapus." });
    setTransactionToDelete(null);
  };

  const handleExportPDF = (reportType: 'monthly' | 'yearly' | 'all') => {
    const doc = new jsPDF();
    const logoUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/Logo%20goodstock-x%20(transparan)%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9Mb2dvIGdvb2RzdG9jay14ICh0cmFuc3BhcmFuKSAoMSkucG5nIiwiaWF0IjoxNzUwMzIwODEwLCJleHAiOjE3ODE4NTY4MTB9.14Cw5nlZ5gYYOmWPUIWZU_bJwyvi1ipFzvuZF72y24A";
    
    const now = new Date();
    let transactionsToExport: AdminTransaction[];
    let reportPeriodTitle: string;
    let pdfFileName: string;

    switch (reportType) {
      case 'monthly':
        transactionsToExport = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        });
        reportPeriodTitle = `Laporan Bulan ${format(now, 'MMMM yyyy', { locale: localeID })}`;
        pdfFileName = `Laporan_Keuangan_Bulanan_${format(now, 'yyyy-MM')}.pdf`;
        break;
      case 'yearly':
        transactionsToExport = transactions.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        reportPeriodTitle = `Laporan Tahun ${now.getFullYear()}`;
        pdfFileName = `Laporan_Keuangan_Tahunan_${now.getFullYear()}.pdf`;
        break;
      case 'all':
      default:
        transactionsToExport = [...transactions];
        reportPeriodTitle = 'Laporan Semua Transaksi';
        pdfFileName = `Laporan_Keuangan_Semua_${format(new Date(), 'yyyyMMdd')}.pdf`;
        break;
    }

    if (transactionsToExport.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: `Tidak ada transaksi untuk periode yang dipilih.`,
        variant: "destructive",
      });
      return;
    }

    const generatePdfWithContent = (logoImgData: HTMLImageElement | null) => {
        const hasLogo = !!logoImgData;
        const titleX = hasLogo ? 30 : 14;
        const titleY = 22;

        if (hasLogo) {
            doc.addImage(logoImgData!, 'PNG', 14, 16, 12, 12);
        }
        doc.setFontSize(hasLogo ? 16 : 18);
        doc.text('Laporan Keuangan - Goodstock-X', titleX, titleY);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Diekspor pada: ${format(new Date(), 'dd MMMM yyyy', { locale: localeID })}`, titleX, titleY + 7);

        autoTable(doc, {
            startY: titleY + 20,
            head: [['Ringkasan Keuangan (Keseluruhan)', '']],
            body: [
                ['Total Pendapatan', formatCurrency(totalRevenue)],
                ['Total Pengeluaran', formatCurrency(totalExpenses)],
                ['Laba Bersih', formatCurrency(netProfit)],
            ],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [226, 232, 240], textColor: [45, 55, 72] },
            columnStyles: { 1: { halign: 'right' } }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 60;

        autoTable(doc, {
          startY: finalY + 15,
          head: [
            [{ content: reportPeriodTitle, colSpan: 4, styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255], textColor: [0,0,0] } }],
            ['Tanggal', 'Deskripsi', 'Kategori', 'Jumlah (Rp)']
          ],
          body: transactionsToExport.map(t => [
            format(new Date(t.date), 'dd/MM/yy'),
            t.description,
            t.category,
            { content: `${t.type === 'Pendapatan' ? '+' : '-'} ${t.amount.toLocaleString('id-ID')}`, styles: { halign: 'right' } }
          ]),
          headStyles: { fillColor: [31, 41, 55] },
          didParseCell: function (data) {
            if (data.section === 'body' && data.column.index === 3) {
                 const transaction = transactionsToExport[data.row.index];
                 if (transaction.type === 'Pendapatan') {
                     data.cell.styles.textColor = [22, 163, 74];
                 } else {
                     data.cell.styles.textColor = [220, 38, 38];
                 }
                 data.cell.styles.fontStyle = 'bold';
            }
          }
        });

        doc.save(pdfFileName);
    };

    try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = logoUrl;
        img.onload = () => generatePdfWithContent(img);
        img.onerror = () => {
            console.error("Gagal memuat gambar logo untuk PDF.");
            generatePdfWithContent(null);
        };
    } catch (error) {
        console.error("Error saat memproses logo:", error);
        generatePdfWithContent(null);
    }
  };


  const selectedTransactionType = form.watch('type');

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
                    <CardDescription>Input manual untuk transaksi dan ekspor laporan.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" /> Ekspor PDF <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleExportPDF('monthly')}>Laporan Bulan Ini</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleExportPDF('yearly')}>Laporan Tahun Ini</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleExportPDF('all')}>Semua Transaksi</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => handleOpenForm(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Transaksi
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
            <DialogTitle>{transactionToEdit ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                        <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {transactionCategories[selectedTransactionType || 'Pengeluaran'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                { !t.id.startsWith('trx-rev-') && (
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
