
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';
import React, { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { mockStoreSettings, mockAdminSettings } from "@/lib/adminMockData";

const settingsFormSchema = z.object({
  storeName: z.string().min(1, "Nama toko tidak boleh kosong."),
  storeEmail: z.string().email("Format email tidak valid."),
  storePhone: z.string().min(10, "Nomor telepon tidak valid."),
  storeAddress: z.string().min(10, "Alamat tidak boleh kosong."),
  receiveNotifications: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Define keys for localStorage to avoid typos
const STORE_SETTINGS_KEY = 'goodstockx_store_settings';
const ADMIN_SETTINGS_KEY = 'goodstockx_admin_settings';


export default function AdminPengaturanPage() {
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    // Set initial default values from mock, which will be overridden by localStorage on mount
    defaultValues: {
      storeName: mockStoreSettings.name,
      storeEmail: mockStoreSettings.email,
      storePhone: mockStoreSettings.phone,
      storeAddress: mockStoreSettings.address,
      receiveNotifications: mockAdminSettings.receiveNotifications,
    },
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedStoreSettings = localStorage.getItem(STORE_SETTINGS_KEY);
      const savedAdminSettings = localStorage.getItem(ADMIN_SETTINGS_KEY);
      
      const currentValues = { ...form.getValues() };

      if (savedStoreSettings) {
        const parsedStoreSettings = JSON.parse(savedStoreSettings);
        currentValues.storeName = parsedStoreSettings.name || currentValues.storeName;
        currentValues.storeEmail = parsedStoreSettings.email || currentValues.storeEmail;
        currentValues.storePhone = parsedStoreSettings.phone || currentValues.storePhone;
        currentValues.storeAddress = parsedStoreSettings.address || currentValues.storeAddress;
      }
      
      if (savedAdminSettings) {
         const parsedAdminSettings = JSON.parse(savedAdminSettings);
         // Use `??` to handle the case where receiveNotifications is `false` (which is a valid value)
         currentValues.receiveNotifications = parsedAdminSettings.receiveNotifications ?? currentValues.receiveNotifications;
      }

      // `form.reset` updates the form fields with the loaded values
      form.reset(currentValues);

    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      toast({
        title: "Gagal Memuat Pengaturan",
        description: "Tidak dapat memuat pengaturan yang tersimpan.",
        variant: "destructive",
      });
    }
  }, [form, toast]);


  function onSubmit(data: SettingsFormValues) {
    try {
        // Prepare data for localStorage by splitting it into logical groups
        const storeSettingsToSave = {
            name: data.storeName,
            email: data.storeEmail,
            phone: data.storePhone,
            address: data.storeAddress,
        };
        const adminSettingsToSave = {
            receiveNotifications: data.receiveNotifications,
        };

        // Save to localStorage
        localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(storeSettingsToSave));
        localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(adminSettingsToSave));

        // Also update the in-memory mock data for the current session for consistency
        Object.assign(mockStoreSettings, storeSettingsToSave);
        Object.assign(mockAdminSettings, adminSettingsToSave);
        
        toast({
          title: "Pengaturan Disimpan",
          description: "Pengaturan umum toko telah berhasil diperbarui.",
        });
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
        toast({
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan saat menyimpan pengaturan.",
          variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Pengaturan Umum</h1>
          <p className="text-muted-foreground">Konfigurasi umum untuk aplikasi dan dasbor admin.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pengaturan Toko</CardTitle>
            <CardDescription>Informasi dasar yang ditampilkan kepada pelanggan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko</FormLabel>
                  <FormControl><Input placeholder="Goodstock-X" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Kontak</FormLabel>
                  <FormControl><Input placeholder="customer@goodstockx.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="storePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon/WhatsApp</FormLabel>
                  <FormControl><Input placeholder="+62 812 3456 7890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="storeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Toko</FormLabel>
                  <FormControl><Textarea placeholder="Alamat lengkap toko atau gudang Anda." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pengaturan Admin</CardTitle>
            <CardDescription>Pengaturan spesifik untuk dasbor admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="receiveNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Notifikasi Email</FormLabel>
                    <FormDescription>
                      Terima notifikasi email untuk pesanan baru.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-start gap-2">
            <Button type="submit">Simpan Perubahan</Button>
             <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
        </div>
      </form>
    </Form>
  );
}
