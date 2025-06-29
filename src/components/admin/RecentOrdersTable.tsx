
"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AdminOrder } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { MoreHorizontal, MessageSquare, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '../ui/label';

interface RecentOrdersTableProps {
  orders: AdminOrder[];
  onUpdateOrder: (order: AdminOrder) => void;
  onDeleteOrder: (orderId: string) => void;
}

type OrderStatus = 'Belum Dikirim' | 'Sudah Dikirim' | 'Batal';

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case 'Sudah Dikirim': return 'default';
    case 'Belum Dikirim': return 'secondary';
    case 'Batal': return 'destructive';
    default: return 'outline';
  }
};

export default function RecentOrdersTable({ orders, onUpdateOrder, onDeleteOrder }: RecentOrdersTableProps) {
  const [orderToDelete, setOrderToDelete] = useState<AdminOrder | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
  
  if (!orders || orders.length === 0) {
    return <p className="p-4 text-center text-sm text-muted-foreground">Tidak ada pesanan yang cocok dengan filter Anda.</p>;
  }

  const handleUpdateStatus = () => {
    if (orderToUpdate && newStatus) {
      onUpdateOrder({ ...orderToUpdate, status: newStatus });
    }
    setOrderToUpdate(null);
    setNewStatus(null);
  };
  
  const handleDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete.id);
    }
    setOrderToDelete(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 md:px-4">Pelanggan</TableHead>
              <TableHead className="px-2 md:px-4">Produk</TableHead>
              <TableHead className="hidden md:table-cell md:px-4 text-right">Total</TableHead>
              <TableHead className="hidden md:table-cell md:px-4 text-right">Tanggal</TableHead>
              <TableHead className="px-2 md:px-4 text-center">Status</TableHead>
              <TableHead className="px-2 md:px-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="p-2 md:p-4 font-medium align-top">
                  <div className="break-words min-w-[100px]">
                    {order.customerName}
                    <a href={`https://wa.me/${order.waNumber}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-primary hover:underline break-all">
                      {order.waNumber}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="p-2 md:p-4 align-top">
                  <div className="break-words min-w-[120px]">
                    {order.productName}
                    {order.productDetails && <span className="block text-xs text-muted-foreground">{order.productDetails}</span>}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell md:p-4 text-right font-mono align-top">
                  Rp{order.totalAmount.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="hidden md:table-cell md:p-4 text-right text-xs align-top">{format(new Date(order.orderDate), 'dd MMM yyyy', { locale: localeID })}</TableCell>
                <TableCell className="p-2 md:p-4 text-center align-top">
                  <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs whitespace-nowrap">
                    {order.status}
                  </Badge>
                </TableCell>
                 <TableCell className="p-2 md:p-4 text-right align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => setOrderToUpdate(order)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Ubah Status
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`https://wa.me/${order.waNumber}`} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Hubungi via WA
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setOrderToDelete(order)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Pesanan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for updating status */}
       <Dialog open={!!orderToUpdate} onOpenChange={(open) => !open && setOrderToUpdate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ubah Status Pesanan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Ubah status untuk pesanan atas nama <span className="font-semibold text-foreground">{orderToUpdate?.customerName}</span>.
            </p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status-select" className="text-right">
                Status
              </Label>
               <Select onValueChange={(value: OrderStatus) => setNewStatus(value)} defaultValue={orderToUpdate?.status}>
                  <SelectTrigger id="status-select" className="col-span-3">
                    <SelectValue placeholder="Pilih status baru" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Dikirim">Belum Dikirim</SelectItem>
                    <SelectItem value="Sudah Dikirim">Sudah Dikirim</SelectItem>
                    <SelectItem value="Batal">Batal</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="button" onClick={handleUpdateStatus}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alert for deleting order */}
       <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Anda akan menghapus pesanan untuk 
              <span className="font-semibold"> {orderToDelete?.customerName}</span> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
