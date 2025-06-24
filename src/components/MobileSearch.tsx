
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Syncs the input field with the URL query parameter 'q'
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 min-w-0">
      <Input
        type="search"
        placeholder="Cari di Goodstock..."
        className="h-10 w-full rounded-full pl-4 pr-11"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Cari"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
