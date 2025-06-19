
"use client";

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { Promotion } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface PromoCarouselProps {
  promotions: Promotion[];
}

export default function PromoCarousel({ promotions }: PromoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8 bg-secondary/30">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {promotions.map((promo, index) => (
            <CarouselItem key={promo.id}>
              <Card className="overflow-hidden shadow-lg border-none bg-transparent">
                <CardContent className="relative flex aspect-[16/6] items-center justify-center p-0">
                  <Image
                    src={promo.imageUrl}
                    alt={promo.title}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={promo.objectPosition || '50% 50%'} // Use defined position or default
                    priority={index === 0}
                    data-ai-hint="fashion sale banner"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4 shadow-text">
                      {promo.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl shadow-text">
                      {promo.description}
                    </p>
                    <Link href={promo.ctaLink} passHref>
                      <Button size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-3 rounded-full shadow-md transition-transform hover:scale-105">
                        {promo.ctaText}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground disabled:opacity-30" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground disabled:opacity-30" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 py-2 text-center text-sm text-muted-foreground">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                current === index ? "w-6 bg-primary" : "bg-primary/30"
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
