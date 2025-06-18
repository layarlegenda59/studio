"use client";

import { Button } from "@/components/ui/button";
// Using a generic message icon as there's no direct WhatsApp icon in Lucide.
// You could replace this with an SVG for the WhatsApp logo.
import { MessageCircle } from "lucide-react"; 
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

  return (
    <Button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg z-50 p-0 flex items-center justify-center"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
}
