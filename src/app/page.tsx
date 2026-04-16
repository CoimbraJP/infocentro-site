'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import NavBar from '@/components/ui/NavBar';
import FrameSequence from '@/components/ui/FrameSequence';
import { LucideWrench, LucideShieldCheck, LucideServer, LucideCpu, LucideHeartHandshake, LucideArrowRight, LucideCheckCircle2, LucideMessageCircle, LucideCircuitBoard, LucideMonitorSmartphone, LucideChevronDown } from 'lucide-react';

export default function InfoCentroPage() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // Force a sync of canvas size on initial load to avoid black bars
    window.dispatchEvent(new Event('resize'));
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Padronizado para 120 frames conforme solicitado
  const TOTAL_FRAMES = 120; 
  const TOTAL_FRAMES_SOBRE = 120;
  
  return (
    <main className="grain min-h-screen relative selection:bg-primary selection:text-black">
      <NavBar />

      <FrameSequence
        framesPath="/frames/loop"
        totalFrames={TOTAL_FRAMES}
        height={isMobile ? "100vh" : "200vh"} // Altura normal no mobile (sem scroll extra)
        id="hero"
        // Ajuste agressivo de centralização para o mobile estático
        offsetXPercent={isMobile ? -35 : 0} 
        offsetYPercent={0}
        scale={isMobile ? 0.8 : 1}
        step={isMobile ? 12 : 1} 
        removeWhiteBg={false}
        disabled={isMobile}
      >
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 pt-20 md:pt-32 h-screen flex flex-col justify-center pointer-events-none">
          <div className="md:w-3/5 pb-20 hero-text-animate pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 display-font">
              Performance <br />
              <span className="text-primary text-neon transition-all animate-neon-pulse">Elevada ao Máximo.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8 font-light">
              Manutenção especializada, montagem de PCs de alto desempenho e suporte técnico que respeita a sua máquina.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/5512982007553?text=Ol%C3%A1,%20gostaria%20de%20um%20or%C3%A7amento." target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-primary text-black font-bold rounded shadow-lg glow-neon hover:bg-[#cce600] transition-colors flex items-center justify-center gap-2">
                FAZER ORÇAMENTO GRÁTIS
                <LucideArrowRight size={20} />
              </a>
              <a href="#sobre" className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded hover:bg-white/5 transition-colors flex items-center justify-center">
                Conheça a INFO Centro
              </a>
            </div>
          </div>
        </div>
        
      </FrameSequence>

      <section id="sobre" className="py-32 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-secondary tracking-widest text-sm font-semibold uppercase mb-4 text-primary">Quem Somos</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 display-font leading-tight">Autoridade em hardware. <br/> Excelência em serviço.</h3>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Desde 1991, a INFO Centro é referência em manutenção de notebooks, entregando diagnósticos precisos e soluções eficientes para cada cliente.
            </p>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Nosso processo é baseado em diagnóstico preciso: identificamos o problema corretamente e resolvemos sem enrolação. 
              Também montamos PCs sob medida — do uso diário ao alto desempenho gamer.
            </p>
            <ul className="space-y-4">
              {['Tradição desde 1991', 'Especialistas em notebooks', 'Atendimento direto e confiável', 'Transparencia total no diagnostico'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90">
                  <LucideCheckCircle2 className="text-primary" size={24} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden glow-neon border border-white/10 parallax-drop bg-surface">
            <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-90">
              <FrameSequence
                framesPath="/frames/sobre"
                totalFrames={TOTAL_FRAMES_SOBRE}
                mode="inline"
                scale={0.8}
                step={isMobile ? 12 : 1}
                offsetXPercent={isMobile ? -25 : 0}
                removeWhiteBg={false}
                disabled={isMobile}
              />
            </div>
            {/* Overlay amarelo técnico */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-32 bg-[#0a0a0a] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-secondary tracking-widest text-sm font-semibold uppercase mb-4 text-primary">Nossos Serviços</h2>
            <h3 className="text-3xl md:text-5xl font-bold display-font">Soluções completas</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: LucideServer, title: "Upgrades Inteligentes", desc: "Instalação de SSD, mais RAM ou nova GPU com análise de gargalo." },
              { icon: LucideShieldCheck, title: "Formatação & Backup", desc: "Sistema limpo, otimizado e drivers atualizados sem perder seus arquivos." },
              { icon: LucideWrench, title: "Manutenção Preventiva", desc: "Limpeza profunda, troca de pasta térmica de alta condutividade e checkup geral." },
              { icon: LucideCpu, title: "Montagem de PCs", desc: "Do office ao Extreme Gamer. Organização de cabos (cable management) premium." },
              { icon: LucideCircuitBoard, title: "Reparo de Placa Mãe", desc: "Identificação de curtos e reparo avançado eletrônico em nível de componente." },
              { icon: LucideMonitorSmartphone, title: "Troca de Tela e Teclado", desc: "Substituição rápida e segura de displays e teclados originais para notebooks." }
            ].map((srv, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group">
                <srv.icon size={40} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-3 display-font">{srv.title}</h4>
                <p className="text-white/60 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="qualidade" className="py-32 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <LucideHeartHandshake size={60} className="text-primary mx-auto mb-8" />
            <h3 className="text-3xl md:text-5xl font-bold mb-8 display-font">Sua máquina em boas mãos.</h3>
            <p className="text-xl text-white/70 leading-relaxed mb-12">
              Nós sabemos que seu computador é sua ferramenta de trabalho ou lazer principal. 
              Por isso, levamos a segurança e o cuidado muito a sério. Testes de stress após 
              cada montagem/manutenção garantem que você não terá dores de cabeça.
            </p>
        </div>
      </section>

      <section id="videos" className="py-24 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-secondary tracking-widest text-sm font-semibold uppercase mb-4 text-primary">Acompanhe nosso trabalho</h2>
            <h3 className="text-3xl md:text-5xl font-bold display-font">Shorts e Dicas Rápidas</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory flex-nowrap scrollbar-hide" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {[
              "tMxOPk8aCRU",
              "MeUtYY-eEl4",
              "GOQ0Yren4V0",
              "0cO183D6AZM"
            ].map((videoId, item) => (
              <div key={item} className="snap-center shrink-0 w-72 aspect-[9/16] bg-surface rounded-2xl border border-white/10 glow-neon overflow-hidden relative group">
                <iframe 
                  src={`https://www.youtube.com/embed/${videoId}?controls=0&rel=0`} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  title="YouTube video player" 
                  allowFullScreen>
                </iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="avaliacoes" className="py-24 bg-[#0a0a0a] relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-3xl md:text-5xl font-bold display-font mb-4 text-center">O que dizem nossos clientes</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-5xl font-bold">4.9</span>
              <div className="flex flex-col">
                <div className="flex text-yellow-500 text-xl">★★★★★</div>
                <span className="text-white/60 text-sm">Baseado no Google Meu Negócio</span>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden mb-12 w-full group">
            <div className="animate-infinite-scroll flex flex-row flex-nowrap w-max gap-6 py-4">
              {[
                {nome: "Carlos Eduardo", review: "Atendimento impecável! Meu notebook gamer estava esquentando muito. Fizeram a preventiva e agora parece novo. Recomendo demais!", time: "Há 1 semana"},
                {nome: "Mariana Silva", review: "Levei meu PC que não ligava por nada. Descobriram que era um curto na placa mãe e resolveram rápido e com preço justo.", time: "Há 2 meses"},
                {nome: "João Pedro", review: "Formataram minha máquina no mesmo dia. Transparência total e ainda fizeram o backup de todos os meus arquivos de trabalho sem perder nada.", time: "Há 3 meses"},
                {nome: "Lucas Mendes", review: "Montaram meu PC Gamer e o cable management ficou absurdo de tão limpo. Pessoal muito técnico e caprichoso.", time: "Há 4 meses"},
                {nome: "Aline Costa", review: "Meu notebook derramou café, achei que tinha perdido. A INFO Centro salvou a placa mãe! Super recomendo.", time: "Há 5 meses"},
                {nome: "Felipe Borges", review: "Troca de tela e teclado. Peças originais de ótima qualidade. Serviço muito rápido e pontual.", time: "Há 6 meses"},
                {nome: "Roberto Nunes", review: "A loja passa muita confiança! O diagnóstico foi preciso e não tentaram empurrar serviços desnecessários.", time: "Há 8 meses"},
                {nome: "Juliana Castro", review: "Fiz um upgrade de SSD na minha máquina antiga e deu vida nova pra ela. Não trava e liga em segundos!", time: "Há 1 ano"},
                // Duplicated for seamless infinite loop
                {nome: "Carlos Eduardo", review: "Atendimento impecável! Meu notebook gamer estava esquentando muito. Fizeram a preventiva e agora parece novo. Recomendo demais!", time: "Há 1 semana"},
                {nome: "Mariana Silva", review: "Levei meu PC que não ligava por nada. Descobriram que era um curto na placa mãe e resolveram rápido e com preço justo.", time: "Há 2 meses"},
                {nome: "João Pedro", review: "Formataram minha máquina no mesmo dia. Transparência total e ainda fizeram o backup de todos os meus arquivos de trabalho sem perder nada.", time: "Há 3 meses"},
                {nome: "Lucas Mendes", review: "Montaram meu PC Gamer e o cable management ficou absurdo de tão limpo. Pessoal muito técnico e caprichoso.", time: "Há 4 meses"},
                {nome: "Aline Costa", review: "Meu notebook derramou café, achei que tinha perdido. A INFO Centro salvou a placa mãe! Super recomendo.", time: "Há 5 meses"},
                {nome: "Felipe Borges", review: "Troca de tela e teclado. Peças originais de ótima qualidade. Serviço muito rápido e pontual.", time: "Há 6 meses"},
                {nome: "Roberto Nunes", review: "A loja passa muita confiança! O diagnóstico foi preciso e não tentaram empurrar serviços desnecessários.", time: "Há 8 meses"},
                {nome: "Juliana Castro", review: "Fiz um upgrade de SSD na minha máquina antiga e deu vida nova pra ela. Não trava e liga em segundos!", time: "Há 1 ano"}
              ].map((dep, i) => (
                <div key={i} className="bg-surface p-8 rounded-2xl border border-white/5 relative flex flex-col justify-between w-[380px] shrink-0">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">{dep.nome.charAt(0)}</div>
                      <div>
                        <h4 className="font-bold text-white/90">{dep.nome}</h4>
                        <span className="text-sm text-white/40">{dep.time}</span>
                      </div>
                      <div className="absolute top-8 right-8 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm tracking-tighter" style={{fontFamily: 'serif'}}>G</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-500 mb-4 text-sm">★★★★★</div>
                    <p className="text-white/70 leading-relaxed italic">"{dep.review}"</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Gradientes laterais para esconder o corte */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none"></div>
          </div>

          <div className="text-center">
            <a href="https://share.google/P1kiRCLXFjDPFm1um" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded shadow-lg hover:bg-neutral-200 transition-colors">
              VER TODAS AS AVALIAÇÕES NO GOOGLE
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-black relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center display-font">Dúvidas Frequentes</h3>
          <div className="space-y-4">
            {[
              { q: "Meu notebook está muito lento. Vale a pena arrumar?", a: "Na maioria dos casos, sim. Com upgrades simples como SSD e memória, é possível recuperar e ate superar performance de modelos novos." },
              { q: "Qual o prazo médio para formatar um PC?", a: "Em média, devolvemos a máquina formatada no mesmo dia!!" },
              { q: "Vocês fazem limpeza interna do notebook?", a: "Sim. Realizamos limpeza completa e troca de pasta térmica, ajudando a reduzir temperatura e melhorar o desempenho." },
              { q: "Meu notebook desligou e não liga mais. Tem conserto?", a: "Sim, muitos casos têm solução. Fazemos diagnóstico para identificar a causa e informar a melhor opção de reparo." },
              { q: "Vocês dão garantia nos serviços?", a: "Sim. Todos os serviços possuem garantia, que varia de acordo com o tipo de manutenção realizada." },
              { q: "Vocês trabalham com peças novas?", a: "Sim. Trabalhamos com peças novas e de qualidade, garantindo melhor desempenho e durabilidade." },
              { q: "Quais formas de pagamento vocês aceitam?", a: "Aceitamos diversas formas de pagamento. Entre em contato para verificar as opções disponíveis no momento." },
              { q: "Vocês fazem upgrade em notebook antigo?", a: "Sim. Avaliamos o equipamento e indicamos melhorias que realmente fazem diferença no uso." }
            ].map((faq, i) => (
              <details key={i} className="group bg-surface rounded-lg border border-white/5 cursor-pointer transition-all hover:border-primary/30">
                <summary className="flex justify-between items-center p-6 font-bold text-lg list-none outline-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <LucideChevronDown className="transition-transform duration-300 group-open:rotate-180 text-primary flex-shrink-0 ml-4" size={24} />
                </summary>
                <div className="px-6 pb-6 text-white/60 leading-relaxed overflow-hidden">
                  <p className="animate-dropdown">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="py-32 bg-primary relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-6xl font-bold text-black mb-6 display-font tracking-tight">Precisa de um up na sua máquina?</h3>
          <p className="text-[#222222] text-xl font-medium mb-10 max-w-2xl mx-auto">
            Fale diretamente com nossa equipe técnica pelo WhatsApp. Resposta rápida e orçamento transparente.
          </p>
          <a href="https://wa.me/5512982007553?text=Ol%C3%A1,%20gostaria%20de%20um%20or%C3%A7amento." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-primary text-lg font-bold rounded shadow-2xl hover:bg-neutral-900 transition-all animate-scale-pulse">
            <LucideMessageCircle size={24} />
            CHAMAR NO WHATSAPP
          </a>
        </div>
      </section>

      <section id="localizacao" className="py-24 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3">
              <h3 className="text-3xl font-bold mb-6 display-font text-primary">Nossa Loja</h3>
              <p className="text-white/70 text-lg mb-4 leading-relaxed">
                Estamos localizados no coração de São José dos Campos, prontos para atender você e sua máquina.
              </p>
              <div className="space-y-2 text-white/90">
                <p className="font-bold">Endereço:</p>
                <p>R. Rubião Júnior, 33 - Centro</p>
                <p>São José dos Campos - SP</p>
                <p>CEP: 12210-180</p>
              </div>
              <a 
                href="https://www.google.com/maps/dir//R.+Rubi%C3%A3o+J%C3%BAnior,+33+-+Centro,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP,+12210-180" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-primary hover:underline font-bold"
              >
                VER NO GOOGLE MAPS
                <LucideArrowRight size={18} />
              </a>
            </div>
            <div className="w-full md:w-2/3 h-[400px] rounded-2xl overflow-hidden border border-white/10 glow-neon">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.433433618642!2d-45.8893798!3d-23.1903698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4bb40381667d%3A0x6a0904000305897c!2sR.%20Rubi%C3%A3o%20J%C3%BAnior%2C%2033%20-%20Centro%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012210-180!5e0!3m2!1spt-BR!2sbr!4v1713192000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-12 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-xl font-bold tracking-tighter text-primary">
            <span className="text-white">INFO</span> Centro
          </div>
          <div className="text-white/50 text-sm text-center">
            <p className="mb-1">Rua Rubiao Junior, 33 - Centro</p>
            <p className="mb-1">Seg a Sex: 09h às 18h | Sáb: 09h às 13h</p>
            <p className="font-bold text-primary">WhatsApp: (12) 98200-7553</p>
          </div>
          <div className="text-white/40 text-sm md:text-right">
            &copy; {new Date().getFullYear()} INFO Centro. <br className="hidden md:block" /> Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
