import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { LucideMessageCircle } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "INFO Centro | Excelência em TI e Hardware",
  description: "Desde 1991, a INFO Centro é referência em manutenção de notebooks e montagem de PCs de alto desempenho em São José dos Campos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-black text-white antialiased`}>
        {children}
        <a 
          href="https://wa.me/5512982007553?text=Ol%C3%A1,%20gostaria%20de%20dúvidas." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-6 right-6 p-4 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 animate-pulse border border-white/20"
        >
          <LucideMessageCircle size={32} />
        </a>
      </body>
    </html>
  );
}
