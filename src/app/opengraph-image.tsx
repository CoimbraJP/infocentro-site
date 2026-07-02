import { ImageResponse } from 'next/og';

// Runtime edge: o @vercel/og quebra no runtime Node em Windows durante o build,
// e no Vercel a imagem e servida por edge function de qualquer forma.
export const runtime = 'edge';

export const alt = 'INFO Centro — manutenção de notebooks e PCs de alto desempenho em São José dos Campos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Preview usado quando o link e compartilhado (WhatsApp, redes, Google).
// Gerado em build; mesma paleta neon-sobre-preto do site.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050505',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          <span style={{ color: '#F8F8F8' }}>INFO</span>
          <span style={{ color: '#E5FF00', marginLeft: 12 }}>Centro</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F8F8F8', fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            Performance
          </div>
          <div style={{ color: '#E5FF00', fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            elevada ao máximo.
          </div>
        </div>
        <div style={{ color: 'rgba(248,248,248,0.75)', fontSize: 26 }}>
          Manutenção de notebooks e PCs gamer · São José dos Campos · desde 1991
        </div>
      </div>
    ),
    { ...size }
  );
}
