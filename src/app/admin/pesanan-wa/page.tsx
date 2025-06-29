
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import { mockRecentOrders } from "@/lib/adminMockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import type { AdminOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan harus diisi."),
  productName: z.string().min(1, "Nama produk harus diisi."),
  productDetails: z.string().optional(),
  totalAmount: z.coerce.number().min(0, "Jumlah harus diisi."),
  waNumber: z.string().min(10, "Nomor WhatsApp tidak valid."),
  status: z.enum(['Belum Dikirim', 'Sudah Dikirim', 'Batal']),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function AdminPesananWAPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>(mockRecentOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      productName: "",
      productDetails: "",
      totalAmount: 0,
      waNumber: "",
      status: "Belum Dikirim",
    },
  });

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by tab
    if (activeTab !== 'all') {
      const statusMap = {
        pending: 'Belum Dikirim',
        shipped: 'Sudah Dikirim',
        cancelled: 'Batal'
      };
      filtered = filtered.filter(order => order.status === statusMap[activeTab as keyof typeof statusMap]);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(lowerCaseSearch) ||
        order.productName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [orders, searchTerm, activeTab]);

  const getFilteredCount = (statusKey: string): number => {
    if (statusKey === 'all') return orders.length;
    const statusMap = {
      pending: 'Belum Dikirim',
      shipped: 'Sudah Dikirim',
      cancelled: 'Batal'
    };
    return orders.filter(order => order.status === statusMap[statusKey as keyof typeof statusMap]).length;
  };

  const handleAddOrder = (data: OrderFormValues) => {
    const newOrder: AdminOrder = {
      id: `ORD${Date.now()}`,
      orderDate: new Date().toISOString(),
      ...data
    };
    
    // Mutate mock data
    mockRecentOrders.unshift(newOrder);
    setOrders([...mockRecentOrders]);
    
    toast({ title: "Sukses", description: "Pesanan baru berhasil ditambahkan." });
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  const handleUpdateOrder = (updatedOrder: AdminOrder) => {
    const orderIndex = mockRecentOrders.findIndex(o => o.id === updatedOrder.id);
    if(orderIndex !== -1) {
      mockRecentOrders[orderIndex] = updatedOrder;
    }
    setOrders([...mockRecentOrders]);
    toast({ title: "Sukses", description: `Status pesanan untuk ${updatedOrder.customerName} telah diperbarui.` });
  };

  const handleDeleteOrder = (orderId: string) => {
    const orderIndex = mockRecentOrders.findIndex(o => o.id === orderId);
     if(orderIndex !== -1) {
       mockRecentOrders.splice(orderIndex, 1);
     }
    setOrders([...mockRecentOrders]);
    toast({ title: "Sukses", description: "Pesanan telah dihapus." });
  };


  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Manajemen Pesanan WhatsApp</h1>
            <p className="text-muted-foreground">Lacak dan kelola semua pesanan yang masuk via WhatsApp.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pesanan..."
                className="pl-8 w-full md:w-[250px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pesanan
              </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="all">Semua ({getFilteredCount('all')})</TabsTrigger>
            <TabsTrigger value="pending">Belum Dikirim ({getFilteredCount('pending')})</TabsTrigger>
            <TabsTrigger value="shipped">Sudah Dikirim ({getFilteredCount('shipped')})</TabsTrigger>
            <TabsTrigger value="cancelled">Batal ({getFilteredCount('cancelled')})</TabsTrigger>
          </TabsList>
          <Card className="shadow-lg">
            <TabsContent value="all" className="m-0">
              <RecentOrdersTable orders={filteredOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrder={handleDeleteOrder} />
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <RecentOrdersTable orders={filteredOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrder={handleDeleteOrder}/>
            </TabsContent>
            <TabsContent value="shipped" className="m-0">
              <RecentOrdersTable orders={filteredOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrder={handleDeleteOrder}/>
            </TabsContent>
            <TabsContent value="cancelled" className="m-0">
              <RecentOrdersTable orders={filteredOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrder={handleDeleteOrder}/>
            </TabsContent>
            <CardFooter className="p-4 border-t">
              <p className="text-xs text-muted-foreground">Menampilkan {filteredOrders.length} dari {getFilteredCount(activeTab)} pesanan.</p>
            </CardFooter>
          </Card>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Tambah Pesanan Manual</DialogTitle>
            <DialogDescription>
              Masukkan detail pesanan yang diterima dari WhatsApp.
            </DialogDescription>
          </DialogHeader>
           <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddOrder)} className="space-y-4">
                <FormField control={form.control} name="customerName" render={({ field }) => (
                  <FormItem><FormLabel>Nama Pelanggan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="waNumber" render={({ field }) => (
                  <FormItem><FormLabel>No. WhatsApp</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="productName" render={({ field }) => (
                  <FormItem><FormLabel>Nama Produk</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="productDetails" render={({ field }) => (
                  <FormItem><FormLabel>Detail Produk (Opsional)</FormLabel><FormControl><Input placeholder="cth: Size XL, Warna Hitam" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="totalAmount" render={({ field }) => (
                  <FormItem><FormLabel>Jumlah Total (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Awal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Belum Dikirim">Belum Dikirim</SelectItem>
                        <SelectItem value="Sudah Dikirim">Sudah Dikirim</SelectItem>
                        <SelectItem value="Batal">Batal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                  <Button type="submit">Simpan Pesanan</Button>
                </DialogFooter>
              </form>
           </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

    