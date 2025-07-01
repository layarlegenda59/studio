
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, saveUsers } from '@/lib/adminMockData';
import type { AdminUser } from '@/lib/types';

const userFormSchema = z.object({
  name: z.string().min(1, "Nama harus diisi."),
  email: z.string().email("Format email tidak valid."),
  role: z.enum(['Admin', 'Pelanggan']),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminPenggunaPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  // Re-sync state with the (potentially updated) mock data from localStorage
  useEffect(() => {
    setUsers([...mockUsers]);
  }, []);

  const handleOpenForm = (user: AdminUser | null) => {
    setUserToEdit(user);
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '', // Password is not shown for editing
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'Pelanggan',
        password: '',
      });
    }
    setIsFormOpen(true);
  };

  const onSubmit = (data: UserFormValues) => {
    if (userToEdit) {
      // Edit
      const index = mockUsers.findIndex(u => u.id === userToEdit.id);
      if (index !== -1) mockUsers[index] = { ...userToEdit, ...data };
      toast({ title: "Sukses", description: "Data pengguna berhasil diperbarui." });
    } else {
      // Add
      if (!data.password || data.password.length < 6) {
        form.setError("password", { message: "Password minimal 6 karakter untuk pengguna baru." });
        return;
      }
      const newUser: AdminUser = { id: `user-${Date.now()}`, joinDate: new Date().toISOString(), ...data };
      mockUsers.unshift(newUser);
      toast({ title: "Sukses", description: "Pengguna baru berhasil ditambahkan." });
    }
    
    saveUsers();
    setUsers([...mockUsers]);
    setIsFormOpen(false);
  };
  
  const handleDelete = () => {
    if (!userToDelete) return;
    const index = mockUsers.findIndex(u => u.id === userToDelete.id);
    if (index > -1) {
      mockUsers.splice(index, 1);
    }
    saveUsers();
    setUsers([...mockUsers]);
    toast({ title: "Sukses", description: "Pengguna telah dihapus." });
    setUserToDelete(null);
  };

  const getRoleBadgeVariant = (role: 'Admin' | 'Pelanggan') => {
    return role === 'Admin' ? 'default' : 'secondary';
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">Lihat, tambah, edit, atau hapus pengguna.</p>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>
              Total {users.length} pengguna terdaftar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-center">Peran</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Tanggal Bergabung</TableHead>
                  <TableHead><span className="sr-only">Aksi</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      {format(new Date(user.joinDate), 'dd MMMM yyyy', { locale: localeID })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenForm(user)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setUserToDelete(user)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada pengguna ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{userToEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" {...field} placeholder={userToEdit ? "Kosongkan jika tidak ingin mengubah" : ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem><FormLabel>Peran</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Pelanggan">Pelanggan</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
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
      <AlertDialog open={!!userToDelete} onOpenChange={open => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus pengguna <span className="font-semibold">{userToDelete?.name}</span> secara permanen.
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
