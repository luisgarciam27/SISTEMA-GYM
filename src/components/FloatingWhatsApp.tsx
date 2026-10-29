import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  gymName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber = '51987654321',
  gymName = 'Titán Fitness',
}) => {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola ${gymName}! Quisiera consultar sobre las promociones y agendar una visita.`
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      aria-label="Contactar por WhatsApp"
      title="Escríbenos por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
};
