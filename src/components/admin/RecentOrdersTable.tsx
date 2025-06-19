
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


interface RecentOrdersTableProps {
  orders: AdminOrder[];
}

const getStatusBadgeVariant = (status: AdminOrder['status']) => {
  switch (status) {
    case 'Sudah Dikirim':
      return 'default'; // bg-primary
    case 'Belum Dikirim':
      return 'secondary'; // bg-secondary
    case 'Batal':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders || orders.length === 0) {
    return <p className="p-4 text-center text-sm text-muted-foreground">Tidak ada pesanan terkini.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Pelanggan</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead className="text-right">Tanggal</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell>
                {order.productName}
                {order.productDetails && <span className="block text-xs text-muted-foreground">{order.productDetails}</span>}
              </TableCell>
              <TableCell className="text-right text-xs">{format(new Date(order.orderDate), 'dd MMM yyyy', { locale: localeID })}</TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
