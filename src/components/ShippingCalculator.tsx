
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ShippingCost, ShippingVendor } from '@/lib/types';
import { mockShippingCosts, mockShippingVendors } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

export default function ShippingCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [results, setResults] = useState<ShippingCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!origin || !destination || !weight) {
      setError("Mohon isi semua field.");
      return;
    }
    setIsLoading(true);
    setResults([]);

    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on some criteria, or just show all for now
      // For a real app, you'd call your shipping APIs here.
      const calculatedWeight = parseFloat(weight) || 1; // kg
      const mockResults = mockShippingCosts.map(cost => ({
        ...cost,
        cost: cost.cost * calculatedWeight // Simple cost adjustment by weight
      }));
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Kalkulator Ongkos Kirim</CardTitle>
        <CardDescription>Hitung estimasi biaya pengiriman untuk pesanan Anda.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Kota Asal</Label>
              <Input id="origin" placeholder="Contoh: Jakarta" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Kota Tujuan</Label>
              <Input id="destination" placeholder="Contoh: Surabaya" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Berat (kg)</Label>
            <Input id="weight" type="number" placeholder="Contoh: 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} required min="0.1" step="0.1" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hitung Ongkir
          </Button>
        </CardFooter>
      </form>

      {results.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-4 font-headline">Hasil Perhitungan:</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <Card key={index} className="bg-background/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{result.vendor} - {result.service}</p>
                      <p className="text-sm text-muted-foreground">Estimasi: {result.estimatedDelivery}</p>
                    </div>
                    <p className="font-semibold text-lg text-primary">
                      Rp{result.cost.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
