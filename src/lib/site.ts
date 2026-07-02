// dominio canonico (o apex infocentrosjc.com.br redireciona para www)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.infocentrosjc.com.br';

export const WHATSAPP_NUMBER = '5512982007553';

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_ORCAMENTO = whatsappUrl('Olá, gostaria de um orçamento.');
export const WHATSAPP_DUVIDA = whatsappUrl('Olá, gostaria de tirar uma dúvida.');
