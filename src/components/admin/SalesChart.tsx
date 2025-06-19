
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { AdminSalesDataPoint } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface SalesChartProps {
  data: AdminSalesDataPoint[];
}

const chartConfig = {
  sales: {
    label: "Penjualan",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`}
          />
          <Tooltip
              content={<ChartTooltipContent labelClassName="font-semibold" />}
              cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
          />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
