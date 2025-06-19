
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import { mockRecentOrders } from "@/lib/adminMockData"; // Using mock data for now
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminPesananWAPage() {
  const allOrders = mockRecentOrders;
  const pendingOrders = mockRecentOrders.filter(order => order.status === 'Belum Dikirim');
  const shippedOrders = mockRecentOrders.filter(order => order.status === 'Sudah Dikirim');
  const cancelledOrders = mockRecentOrders.filter(order => order.status === 'Batal');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Manajemen Pesanan WhatsApp</h1>
            <p className="text-muted-foreground">Lacak dan kelola semua pesanan yang masuk via WhatsApp.</p>
        </div>
         <div className="relative md:w-auto w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari pesanan (nama, produk)..."
              className="pl-8 w-full md:w-[300px]"
            />
          </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="all">Semua ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Belum Dikirim ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="shipped">Sudah Dikirim ({shippedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Batal ({cancelledOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Semua Pesanan</CardTitle>
              <CardDescription>Daftar semua pesanan yang tercatat.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentOrdersTable orders={allOrders} />
            </CardContent>
            <CardFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Menampilkan {allOrders.length} pesanan.</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pesanan Belum Dikirim</CardTitle>
              <CardDescription>Pesanan yang menunggu untuk diproses dan dikirim.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentOrdersTable orders={pendingOrders} />
            </CardContent>
             <CardFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Menampilkan {pendingOrders.length} pesanan belum dikirim.</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="shipped">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pesanan Sudah Dikirim</CardTitle>
              <CardDescription>Pesanan yang telah berhasil dikirim ke pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentOrdersTable orders={shippedOrders} />
            </CardContent>
             <CardFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Menampilkan {shippedOrders.length} pesanan sudah dikirim.</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Pesanan Dibatalkan</CardTitle>
              <CardDescription>Pesanan yang dibatalkan oleh pelanggan atau admin.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentOrdersTable orders={cancelledOrders} />
            </CardContent>
             <CardFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Menampilkan {cancelledOrders.length} pesanan dibatalkan.</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

       <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
