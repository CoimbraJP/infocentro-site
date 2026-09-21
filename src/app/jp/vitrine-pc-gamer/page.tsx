import type { Metadata } from 'next';
import VitrinePcGamerDisplay from '@/components/jp/pc-gamer/VitrinePcGamerDisplay';

// Fica fora do grupo (protected) de propósito: essa rota não usa o PanelShell
// (sem sidebar/header), pois é feita pra ocupar a tela inteira de um
// tablet/celular fixado na loja, não pra navegação do painel. Ainda assim
// passa pelo middleware normalmente (matcher cobre /jp/:path*).
export const metadata: Metadata = { title: 'Vitrine Digital PC Gamer | Info Centro' };

export default function VitrinePcGamerDisplayPage() {
  return <VitrinePcGamerDisplay />;
}
