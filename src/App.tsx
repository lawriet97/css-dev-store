import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, Download, Star, Image as ImageIcon, ChevronRight, ChevronLeft, X, Share, Sparkles} from "lucide-react";
import { storeApps, type AppData } from "./appsData";
import { motion, AnimatePresence, useAnimation } from "framer-motion";


// O FILTRO SVG: Mantido super leve para a transição inicial
const GlitchFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <filter id="reality-tear">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

// COMPONENTE DE PERFORMANCE: Chuva Matrix em Canvas (Super Leve)
const PrismMatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nums = '0123456789'.split('');
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = [];
    
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // Início aleatório acima da tela
    }

    let hueOffset = 0;

    const draw = () => {
      // Fundo semi-transparente para criar o rastro (trail)
      ctx.fillStyle = 'rgba(2, 0, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = nums[Math.floor(Math.random() * nums.length)];
        
        // Cores de Prisma (Arco-íris dinâmico baseado na coluna e tempo)
        const hue = (hueOffset + i * 5) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        
        // Efeito de brilho nas pontas
        if (Math.random() > 0.95) ctx.fillStyle = '#ffffff';

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reseta a gota com uma aleatoriedade para não ficarem alinhadas
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      hueOffset += 1.5; // Velocidade da mudança de cor
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-80 mix-blend-screen" />;
};

export const RealityAnomaly = ({ isAvailable }: { isAvailable: boolean }) => {
  const [isTorn, setIsTorn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  // Rastreador ocular
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      if (isTorn) setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMove);
    return () => window.removeEventListener("mousemove", handleGlobalMove);
  }, [isTorn]);

  // Timer de Auto-Fechamento (15 Segundos)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isTorn) {
      timeout = setTimeout(() => {
        setIsTorn(false);
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [isTorn]);

  const triggerTear = async () => {
    if (isTorn) return;
    setIsTorn(true);
    await controls.start({
      x: [-10, 10, -5, 5, 0],
      filter: ["url(#reality-tear)", "blur(0px)"],
      transition: { duration: 0.8, ease: "easeInOut" }
    });
  };

  const mendReality = () => setIsTorn(false);

  // Cálculos para o movimento da Íris
  const windowCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const windowCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const eyeMoveX = (mousePos.x - windowCenterX) * 0.04;
  const eyeMoveY = (mousePos.y - windowCenterY) * 0.04;

  return (
    <>
      <GlitchFilter />
      
      {/* O GATILHO */}
      <AnimatePresence>
        {isAvailable && !isTorn && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.4}
            onClick={triggerTear}
            whileHover={{ scale: 1.2, rotate: 90, filter: "brightness(2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))" }}
            whileTap={{ scale: 0.8 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center cursor-pointer z-50 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <Sparkles size={20} className="text-white/80" />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[2px] border-dotted border-white/30 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* A FENDA */}
      <AnimatePresence>
        {isTorn && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "url(#reality-tear)", scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#020005] overflow-hidden flex items-center justify-center"
          >
            {/* O Fundo Matrix Prismático */}
            <PrismMatrixRain />

            {/* O Olho Celestial */}
            <div className="relative z-20 flex items-center justify-center pointer-events-none">
              
              {/* Halos Divinos Rotativos */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] rounded-full border border-white/10 border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[300px] h-[300px] rounded-full border-t-2 border-r-2 border-transparent border-l-cyan-300/40 border-b-fuchsia-300/40 mix-blend-screen blur-[2px]"
              />

              {/* Pálpebra (Animação de Piscar) */}
              <motion.div
                animate={{ 
                  scaleY: [1, 1, 1, 0, 1, 1], // Pisca indo a 0 no eixo Y
                  scaleX: [1, 1, 1, 1.1, 1, 1] // Achata levemente nas laterais ao piscar
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  times: [0, 0.45, 0.48, 0.5, 0.52, 1], // Timing exato do piscar rápido
                  ease: "easeInOut" 
                }}
                className="relative flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 bg-black/40 backdrop-blur-sm border-2 border-white/30 shadow-[0_0_80px_rgba(255,255,255,0.2)] overflow-hidden"
                style={{ borderRadius: '80% 0 80% 0', transform: 'rotate(45deg)' }}
              >
                {/* Íris que segue o mouse */}
                <motion.div 
                  animate={{ 
                    x: eyeMoveX, 
                    y: eyeMoveY 
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="absolute flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-cyan-200/50 shadow-[0_0_40px_rgba(34,211,238,0.6)]"
                  style={{ transform: 'rotate(-45deg)' }} // Desfaz a rotação da pálpebra para a íris não ficar torta
                >
                  {/* Fundo da Íris Prismático */}
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#e879f9,#fff,#22d3ee)] opacity-40 animate-[spin_4s_linear_infinite]" />
                  
                  {/* Pupila */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full shadow-[0_0_20px_#fff]"
                  >
                    {/* Brilho do olho (Lens Flare interno) */}
                    <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full blur-[1px]" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* O BOTÃO DE FECHAR (Minimalista e Opcional, caso não queira esperar os 15s) */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.8 }}
              onClick={mendReality}
              className="absolute top-8 right-8 sm:top-12 sm:right-12 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/40 rounded-full backdrop-blur-md transition-all duration-300 z-[9999]"
            >
              <X strokeWidth={1.5} size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const FugitiveLogo = ({ onExplosionComplete }: { onExplosionComplete?: () => void }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [isPanicking, setIsPanicking] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("🤬");

  const rageEmojis = ["🤬", "😡", "💣", "🖕", "💥", "💀"];

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, 
      size: Math.random() * 1.5 + 0.5, 
      duration: Math.random() * 2.5 + 1.5, 
      delay: 1.45 + Math.random() * 0.5, 
      rotation: Math.random() * 360, 
      isBug: Math.random() > 0.85 
    }));
  }, [isPanicking]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!logoRef.current || isPanicking) return;
    
    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = centerX - e.clientX;
    const distY = centerY - e.clientY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 250) {
      setDodge({ x: distX * 0.5, y: distY * .5 });
    } else {
      setDodge({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    if (!isPanicking) setDodge({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (isPanicking) return;
    
    const randomEmoji = rageEmojis[Math.floor(Math.random() * rageEmojis.length)];
    setCurrentEmoji(randomEmoji);
    
    setIsPanicking(true);
    setDodge({ x: 0, y: 0 }); 
    
    setTimeout(() => {
      setIsPanicking(false);
      if (onExplosionComplete) onExplosionComplete(); // 🚨 AVISA O APP QUE EXPLODIU
    }, 4500);
  };

  // 🚀 O PORTAL: Efeitos globais que escapam do Header e vão para a tela inteira!
  const globalEffects = typeof document !== "undefined" ? createPortal(
    <AnimatePresence>
      {isPanicking && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {/* 1. O APAGÃO GIGANTE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
          />

          {/* 2. O REBOOT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.8, 0.2, 0.8, 0] }}
            transition={{ duration: 4.5, times: [0, 0.3, 0.4, 0.5, 0.8, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-emerald-500/30 font-mono text-xl sm:text-4xl tracking-[0.5em] blur-[1px]">
              REBOOTING_SYS...
            </span>
          </motion.div>

          {/* 3. A CHUVA E OS BUGS */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ top: "-10%", left: `${p.x}%`, scale: p.size, rotate: p.rotation, opacity: 0 }}
              animate={{ 
                top: "120%", 
                rotate: p.rotation + (p.isBug ? 0 : 720), 
                opacity: [0, 1, 1, 0] 
              }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                ease: p.isBug ? "easeIn" : "linear" 
              }}
              className="absolute font-black whitespace-nowrap drop-shadow-2xl"
              style={{ color: p.isBug ? "transparent" : "#cbd5e1" }}
            >
              {p.isBug ? <span className="text-3xl drop-shadow-[0_0_15px_rgba(255,0,0,1)]">🐛</span> : "({.DEV"}
            </motion.div>
          ))}

          {/* 4. O FLASHBANG: Explosão Branca que cobre tudo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, delay: 1.4 }}
            className="absolute inset-0 bg-white mix-blend-screen"
          />
        </div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <div 
      className={`relative p-24 -m-24 flex items-center justify-center ${isPanicking ? 'z-[100]' : 'z-50'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rendenrizamos o portal na raiz para ele cobrir a tela */}
      {globalEffects}

      {/* 5. A ONDA DE CHOQUE VERMELHA */}
      <AnimatePresence>
        {isPanicking && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0, 25], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, times: [0, 0.93, 1], ease: "easeOut" }}
            className="absolute w-16 h-16 bg-red-600 rounded-full pointer-events-none mix-blend-screen filter blur-xl z-0"
          />
        )}
      </AnimatePresence>

      {/* A LOGO FUGITIVA */}
      <motion.div
        ref={logoRef}
        onClick={handleClick}
        animate={
          isPanicking
            ? {
                x: [0, -10, 10, -15, 15, -25, 25, -35, 35, 0], 
                y: [0, 6, -6, 9, -9, 14, -14, 18, -18, 0],
                rotate: [0, -5, 5, -8, 8, -12, 12, -18, 18, 0],
                scale: [1, 1.1, 1.2, 1.3, 1.4, 1.6, 3, 0], 
                opacity: [1, 1, 1, 1, 1, 1, 1, 0],
                backgroundColor: ["#0f172a", "#ef4444", "#dc2626", "#991b1b", "#7f1d1d", "#ff0000", "transparent"]
              }
            : { 
                x: dodge.x, 
                y: dodge.y, 
                rotate: dodge.x * 0.15,
                scale: 1,
                opacity: 1,
                backgroundColor: "#0f172a" 
              }
        }
        transition={
          isPanicking
            ? { duration: 1.5, ease: "easeIn" } 
            : { type: "spring", stiffness: 150, damping: 10, mass: 0.5 } 
        }
        className="relative h-10 px-4 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-slate-900/20 border border-slate-700/50 z-[65]"
      >
        {isPanicking ? (
          <motion.span
            key={currentEmoji}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white font-black tracking-widest text-3xl z-10 whitespace-nowrap drop-shadow-2xl"
          >
            {currentEmoji}
          </motion.span>
        ) : (
          <div className="flex items-center text-sm font-black z-10 pointer-events-none">
            <span className="text-violet-400/80 inline-block">(</span>
            <span className="text-indigo-400/90 inline-block">{`{`}</span>
            <span className="text-blue-500 inline-block mx-[1px]">.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-200 to-white tracking-widest ml-1">
              DEV
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function CssDevStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  // NOVO ESTADO: Controla se o botão da Anomalia está disponível na tela
  const [isPortalAvailable, setIsPortalAvailable] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const featuredApp = storeApps[currentIndex];
  
  // CÁLCULO DE TEMPO DINÂMICO: Mínimo de 10s, ou 3s por imagem
  const currentAppDuration = Math.max(10000, featuredApp.screenshots.length * 3000);

  // Gatilho que a Logo chama quando a explosão termina
  const handleExplosionComplete = () => {
    setIsPortalAvailable(true);
    
    // O botão da anomalia desaparece após 50 segundos se não for clicado
    setTimeout(() => {
      setIsPortalAvailable(false);
    }, 50000);
  };

  // Temporizador Inteligente
  useEffect(() => {
    if (searchQuery.trim() !== "") return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % storeApps.length);
    }, currentAppDuration);
    
    return () => clearInterval(timer);
  }, [searchQuery, currentAppDuration, storeApps.length]);

  // Carrossel Infinito Suave
  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      const carousel = carouselRef.current;
      if (carousel) {
        carousel.scrollLeft += 1; 
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex]); 

  // Função para rolar as screenshots no Modal
  const scrollModal = (direction: 'left' | 'right') => {
    if (modalScrollRef.current) {
      const scrollAmount = 350; // Quantidade de pixels por clique
      modalScrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const isSearching = searchQuery.trim() !== "";
  const filteredApps = storeApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Fundo Gradiente Sutil e Sofisticado
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50 to-slate-100 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* HEADER GLASSMORPHISM */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6">
            
            {/* 🚀 AQUI ENTRA A LOGO FUGITIVA 🚀 */}
            <FugitiveLogo onExplosionComplete={handleExplosionComplete} />

            {/* 🚨 A BARRA DE PESQUISA QUE HAVIA SIDO APAGADA SEM QUERER 🚨 */}
            <div className="flex-1 max-w-xl relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar aplicativos e projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all shadow-sm"
              />
              <AnimatePresence>
                {isSearching && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-10 flex-shrink-0 hidden sm:block"></div>
          </div>
        </div>
      </header>

      {/* Rendeiza a anomalia (botão flutuante + portal), passando a liberação dela */}
      <RealityAnomaly isAvailable={isPortalAvailable} />

      {/* O CORPO DO SITE AGORA ESTÁ NO LUGAR CERTO, FORA DO HEADER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* BANNER DINÂMICO SUPERIOR */}
        <AnimatePresence>
          {!isSearching && (
            <motion.section 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 min-h-[450px]"
            >
              {/* BARRA DE PROGRESSO SINCRONIZADA COM O TEMPO DINÂMICO */}
              <motion.div 
                key={`progress-${currentIndex}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: currentAppDuration / 1000, ease: "linear" }}
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 z-10" 
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredApp.id}
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", x: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="p-6 sm:p-10 flex flex-col lg:flex-row gap-10 h-full"
                >
                  {/* Coluna da Esquerda: Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-5 mb-6">
                      <motion.div 
                        whileHover={{ rotate: -5, scale: 1.05 }}
                        className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg shadow-slate-200/50"
                      >
                        {featuredApp.iconUrl ? (
                          <img src={featuredApp.iconUrl} alt={`Ícone ${featuredApp.name}`} className="w-full h-full object-cover" />
                        ) : (
                          <featuredApp.iconFallback size={32} className="text-slate-400" />
                        )}
                      </motion.div>
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-1 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
                          {featuredApp.name}
                        </h1>
                        <h2 className="text-lg text-slate-500 font-medium">
                          {featuredApp.subtitle}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center bg-blue-50/80 backdrop-blur text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        <Star size={14} className="fill-current mr-1.5" />
                        {featuredApp.rating}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100/50 px-3 py-1.5 rounded-full">
                        {featuredApp.category}
                      </span>
                    </div>

                    <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg line-clamp-3">
                      {featuredApp.description}
                    </p>

                    <div className="mt-auto">
                      <motion.button 
                        whileHover={{ scale: 1.03, backgroundColor: "#0f172a" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedApp(featuredApp)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-colors shadow-xl shadow-slate-900/20"
                      >
                        Ver Detalhes
                      </motion.button>
                    </div>
                  </div>

                  {/* Coluna da Direita: Screenshots (Desfoque Suavizado) */}
                  <div 
                    className="lg:w-1/2 flex gap-4 overflow-x-hidden pb-4 lg:pb-0 hide-scrollbar pointer-events-none select-none"
                    ref={carouselRef}
                  >
                    {[...featuredApp.screenshots, ...featuredApp.screenshots].map((imgUrl, index) => (
                      <div 
                        key={index}
                        className="flex-shrink-0 w-48 sm:w-56 h-96 bg-slate-100/50 border border-white rounded-3xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden shadow-lg shadow-slate-200/40"
                      >
                        {imgUrl ? (
                          <>
                            <img src={imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover blur-lg opacity-40 scale-110 pointer-events-none mix-blend-multiply" />
                            <img src={imgUrl} alt={`Tela ${index + 1}`} className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-xl" />
                          </>
                        ) : (
                          <>
                            <ImageIcon size={32} className="mb-2 opacity-50 relative z-10" />
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50 relative z-10">Tela {(index % featuredApp.screenshots.length) + 1}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CATÁLOGO DE APPS */}
        <section>
          <div className="mb-8 border-b border-slate-200/50 pb-4 flex justify-between items-end">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isSearching ? `Resultados para "${searchQuery}"` : "Todos os Projetos"}
            </h2>
            <span className="text-sm text-slate-500 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
            </span>
          </div>

          {filteredApps.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 mx-auto flex items-center justify-center mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 mt-2">Tente pesquisar usando outros termos ou categorias.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApps.map((app, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-5 rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-lg shadow-slate-200/30 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex flex-col group"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={`Ícone ${app.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <app.iconFallback size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-lg truncate leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 truncate">
                        {app.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1 mb-5">
                    {app.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                    <div className="flex items-center text-sm font-bold text-slate-700">
                      <Star size={14} className="fill-current text-yellow-400 mr-1" />
                      {app.rating}
                    </div>
                    <span className="bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-600 px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                      Visualizar
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* JANELA EXCLUSIVA DO APP (MODAL DE DETALHES) */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-xl w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white"
            >
              {/* Cabeçalho do Modal */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-100/50 p-4 sm:px-8 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                     {selectedApp.iconUrl ? (
                      <img src={selectedApp.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <selectedApp.iconFallback size={20} className="text-slate-400" />
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900">{selectedApp.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Share size={16} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedApp(null)}
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Corpo do Modal */}
              <div className="overflow-y-auto p-6 sm:p-10 hide-scrollbar scroll-smooth">
                
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-10">
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xl shadow-slate-200/50"
                  >
                    {selectedApp.iconUrl ? (
                      <img src={selectedApp.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <selectedApp.iconFallback size={48} className="text-slate-300" />
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-2">
                      {selectedApp.name}
                    </h1>
                    <h2 className="text-xl text-slate-500 font-medium mb-6">
                      {selectedApp.subtitle}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <motion.button 
  whileHover={{ scale: 1.05 }} 
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    // Abre o link de download direto em uma aba oculta/invisível para iniciar o download
    window.location.href = selectedApp.downloadUrl;
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-colors"
>
  <Download size={18} />
  Obter
</motion.button>
                    </div>

                    <div className="flex items-center gap-8 py-4 border-y border-slate-100/50">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Avaliação</p>
                        <div className="flex items-center text-lg font-black text-slate-700">
                          {selectedApp.rating} <Star size={16} className="fill-current text-yellow-400 ml-1 mb-0.5" />
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200/50"></div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Categoria</p>
                        <div className="text-sm font-black text-slate-700 mt-1">{selectedApp.category}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200/50 hidden sm:block"></div>
                      <div className="hidden sm:block">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Tamanho</p>
                        <div className="text-sm font-black text-slate-700 mt-1">{selectedApp.size}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshots no Modal com Setas e Auto-Scroll */}
                {selectedApp.screenshots.length > 0 && selectedApp.screenshots[0] !== "" && (
                  <div className="mb-10 relative group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-extrabold text-slate-900">Pré-visualização</h3>
                    </div>
                    
                    {/* Botões de Navegação Direcionais (Aparecem no Hover) */}
                    <button 
                      onClick={() => scrollModal('left')}
                      className="absolute left-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur shadow-xl text-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-slate-100"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <button 
                      onClick={() => scrollModal('right')}
                      className="absolute right-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur shadow-xl text-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-slate-100"
                    >
                      <ChevronRight size={24} />
                    </button>

                    <div 
                      ref={modalScrollRef}
                      className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x scroll-smooth relative"
                    >
                      {selectedApp.screenshots.map((imgUrl, index) => (
                        <motion.div 
                          whileHover={{ scale: 1.02, y: -5 }}
                          key={index}
                          className="snap-center flex-shrink-0 w-[280px] sm:w-[320px] h-[500px] bg-slate-100/50 border border-slate-200/50 rounded-3xl flex flex-col items-center justify-center text-slate-400 overflow-hidden relative cursor-pointer shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                          onClick={() => setExpandedImage(imgUrl)}
                        >
                          {imgUrl ? (
                            <>
                              <img src={imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover blur-lg opacity-40 scale-110 mix-blend-multiply" />
                              <img src={imgUrl} alt={`Tela ${index + 1}`} className="relative z-10 w-full h-full object-contain drop-shadow-2xl" />
                            </>
                          ) : (
                            <ImageIcon size={32} className="opacity-50 relative z-10" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Sobre o App</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                    {selectedApp.description}
                  </p>
                </div>
                
                <div className="mt-10 pt-6 border-t border-slate-100/50 flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Versão {selectedApp.version}</span>
                  <span>Atualizado recentemente</span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX DE IMAGEM AMPLIADA (POPUP) */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-4 sm:p-8"
            onClick={() => setExpandedImage(null)}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpandedImage(null)}
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all shadow-2xl z-[70] border border-white/10"
            >
              <X size={28} />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={expandedImage}
              alt="Screenshot Ampliada"
              className="max-w-full max-h-[90vh] object-contain drop-shadow-2xl rounded-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}