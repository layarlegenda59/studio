"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Percent } from 'lucide-react';
import OverviewCard from "@/components/admin/OverviewCard";
import { mockTopProducts, mockSearchKeywords, mockVisitorStats } from "@/lib/adminMockData";

const topProductsChartConfig = {
  sales: {
    label: "Penjualan (unit)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminAnalitikPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Analitik Toko</h1>
        <p className="text-muted-foreground">Pahami performa toko Anda melalui data.</p>
      </div>
      
      <section>
        <h2 className="text-xl font-semibold mb-4 font-headline">Ringkasan Pengunjung</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Pengunjung"
            value={mockVisitorStats.total.toLocaleString('id-ID')}
            icon={Users}
            description="30 hari terakhir"
          />
          <OverviewCard
            title="Pengunjung Baru"
            value={mockVisitorStats.new.toLocaleString('id-ID')}
            icon={Users}
            description="30 hari terakhir"
          />
           <OverviewCard
            title="Pengunjung Kembali"
            value={mockVisitorStats.returning.toLocaleString('id-ID')}
            icon={Users}
            description="30 hari terakhir"
          />
          <OverviewCard
            title="Tingkat Konversi"
            value={`${mockVisitorStats.conversionRate}%`}
            icon={Percent}
            description="Dari pengunjung menjadi pembeli"
            trendColor="text-green-600"
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="shadow-lg lg:col-span-3">
          <CardHeader>
            <CardTitle>4 Produk Terlaris</CardTitle>
            <CardDescription>Berdasarkan jumlah unit terjual sepanjang waktu.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-0">
            <ChartContainer config={topProductsChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTopProducts} layout="vertical" margin={{ left: 140, right: 40, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            interval={0}
                        />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle>Kata Kunci Pencarian</CardTitle>
            <CardDescription>Pencarian paling populer oleh pengunjung.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kata Kunci</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockSearchKeywords.map((item) => (
                        <TableRow key={item.keyword}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell className="text-right">{item.count.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
