
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { TooltipProps } from 'recharts';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Percent } from 'lucide-react';
import OverviewCard from "@/components/admin/OverviewCard";
import { mockTopProducts, mockSearchKeywords, mockVisitorStats } from "@/lib/adminMockData";
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


const topProductsChartConfig = {
  sales: {
    label: "Penjualan (unit)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Custom Tooltip Component to show full product name
const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm min-w-[200px]">
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-foreground leading-tight">
            {payload[0].payload.name}
          </span>
          <span className="text-sm text-muted-foreground">
            Penjualan: {payload[0].value?.toLocaleString('id-ID')} unit
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Label for inside the bar
const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    
    // Don't show label if bar is too narrow for any text
    if (width < 50) {
        return null;
    }

    // A rough approximation of character width to decide on truncation.
    const charWidth = 6.5; // for a 12px font
    const maxChars = Math.floor((width - 16) / charWidth); // leave 8px padding on each side

    if (maxChars < 4) { // if can't even fit a few chars, don't show
        return null;
    }

    const label = value.length > maxChars 
        ? value.substring(0, maxChars - 3) + '...' 
        : value;

    return (
        <text 
            x={x + width / 2} 
            y={y + height / 2} 
            fill="#fff" 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize="12px"
            fontWeight="500"
        >
            {label}
        </text>
    );
};


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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>4 Produk Terlaris</CardTitle>
            <CardDescription>Berdasarkan jumlah unit terjual sepanjang waktu.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ChartContainer config={topProductsChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTopProducts} layout="vertical" margin={{ left: 10, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <YAxis 
                            dataKey="rankLabel"
                            type="category" 
                            tickLine={false}
                            axisLine={false}
                            width={30}
                            tick={{ fontSize: 14, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={[0, 4, 4, 0]} barSize={60}>
                            <LabelList dataKey="name" content={renderCustomizedLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
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
