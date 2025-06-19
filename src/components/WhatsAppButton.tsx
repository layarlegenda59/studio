
"use client";

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string; // E.g., "+12345678900"
  message?: string; // Optional pre-filled message
}

export default function WhatsAppButton({ phoneNumber, message = "Halo Admin ModeMatch, saya ingin bertanya..." }: WhatsAppButtonProps) {
  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const imageUrl = "https://ggbivmpazczpgtmnfwfs.supabase.co/storage/v1/object/sign/material/WhatsApp%203D.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYjkzYjM4Zi1kOGJhLTRmYTEtYmM0ZC00MWUzOGU4YTZhNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9XaGF0c0FwcCAzRC5wbmciLCJpYXQiOjE3NTAzMzM2NTYsImV4cCI6MTc4MTg2OTY1Nn0.l3Fek_DT65pzeNOhvWdtIpeiOHodGnhW8ae1_5XrVrc";

  return (
    <Button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 h-24 w-24 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg z-50 p-0 flex items-center justify-center"
      aria-label="Chat via WhatsApp"
    >
      <Image
        src={imageUrl}
        alt="WhatsApp Icon"
        width={72}
        height={72}
        data-ai-hint="logo social"
      />
    </Button>
  );
}

