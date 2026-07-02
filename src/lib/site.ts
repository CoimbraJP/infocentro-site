// TODO: trocar pelo dominio definitivo quando ele estiver apontado
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://infocentro-site.vercel.app';

export const WHATSAPP_NUMBER = '5512982007553';

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_ORCAMENTO = whatsappUrl('Olá, gostaria de um orçamento.');
export const WHATSAPP_DUVIDA = whatsappUrl('Olá, gostaria de tirar uma dúvida.');
