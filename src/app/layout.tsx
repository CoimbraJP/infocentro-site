import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import FloatingWhatsAppButton from "@/components/ui/FloatingWhatsAppButton";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

const SITE_TITLE = "INFO Centro | Excelência em TI e Hardware";
const SITE_DESCRIPTION =
  "Desde 1991, a INFO Centro é referência em manutenção de notebooks e montagem de PCs de alto desempenho em São José dos Campos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "INFO Centro",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

// Dados estruturados para o Google entender a loja fisica (busca local / Maps).
// Sem aggregateRating: o schema exige ratingCount real, que nao temos aqui.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ComputerStore",
  name: "INFO Centro",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: `+${WHATSAPP_NUMBER}`,
  foundingDate: "1991",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Rubião Júnior, 33 - Centro",
    addressLocality: "São José dos Campos",
    addressRegion: "SP",
    postalCode: "12210-180",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -23.1903698,
    longitude: -45.8893798,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-black text-white antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
