import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, Star, Image as ImageIcon, ChevronRight, X, Share } from "lucide-react";
import { storeApps, type AppData } from "./appsData";

export default function CssDevStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  
  // Referência do Carrossel Auto-Scroll
  const carouselRef = useRef<HTMLDivElement>(null);

  // Temporizador de 10s para o Banner Principal (Pausa se estiver pesquisando)
  useEffect(() => {
    if (searchQuery.trim() !== "") return; // Não roda o timer se estiver pesquisando

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % storeApps.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [searchQuery]);

  // Lógica do Carrossel Infinito Suave corrigida
  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      // Capturamos a referência DENTRO do frame para garantir que pega o novo elemento após a transição
      const carousel = carouselRef.current;
      
      if (carousel) {
        carousel.scrollLeft += 1; // Velocidade da rolagem
        
        // Se chegou na exata metade (onde os itens duplicados começam), reseta pro começo de forma invisível
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Reseta o scroll para o inicio sempre que o index mudar e o elemento existir
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex]); // Depende apenas do índice do app agora

  const featuredApp = storeApps[currentIndex];

  const isSearching = searchQuery.trim() !== "";
  
  const filteredApps = storeApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-blue-200">
      
      {/* HEADER FIXO */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6">
            <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => setSearchQuery("")}>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl tracking-tighter">C.</span>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                CSS.DEV
              </span>
            </div>

            <div className="flex-1 max-w-xl relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar aplicativos e projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {isSearching && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="w-10 flex-shrink-0 hidden sm:block"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* BANNER DINÂMICO SUPERIOR (Some se o usuário estiver pesquisando) */}
        <AnimatePresence>
          {!isSearching && (
            <motion.section 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 64 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm min-h-[450px]"
            >
              <div className="absolute top-0 left-0 h-1 bg-blue-500 z-10 animate-[progress_10s_linear_infinite]" key={`progress-${currentIndex}`} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredApp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="p-6 sm:p-10 flex flex-col lg:flex-row gap-10 h-full"
                >
                  {/* Coluna da Esquerda: Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {featuredApp.iconUrl ? (
                          <img src={featuredApp.iconUrl} alt={`Ícone ${featuredApp.name}`} className="w-full h-full object-cover" />
                        ) : (
                          <featuredApp.iconFallback size={32} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-1">
                          {featuredApp.name}
                        </h1>
                        <h2 className="text-lg text-slate-500 font-medium">
                          {featuredApp.subtitle}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <Star size={14} className="fill-current mr-1.5" />
                        {featuredApp.rating}
                      </div>
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        {featuredApp.category}
                      </span>
                    </div>

                    <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg line-clamp-3">
                      {featuredApp.description}
                    </p>

                    <div className="mt-auto">
                      <button 
                        onClick={() => setSelectedApp(featuredApp)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-md active:scale-95 duration-200"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>

                  {/* Coluna da Direita: Screenshots com Auto-Scroll Perpétuo */}
                  <div 
                    className="lg:w-1/2 flex gap-4 overflow-x-hidden pb-4 lg:pb-0 hide-scrollbar pointer-events-none select-none"
                    ref={carouselRef}
                  >
                    {/* Imagens duplicadas para criar o looping infinito */}
                    {[...featuredApp.screenshots, ...featuredApp.screenshots].map((imgUrl, index) => (
                      <div 
                        key={index}
                        className="flex-shrink-0 w-48 sm:w-56 h-96 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden"
                      >
                        {imgUrl ? (
                          <img src={imgUrl} alt={`Tela ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium uppercase tracking-widest opacity-50">Tela {(index % featuredApp.screenshots.length) + 1}</span>
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

        {/* CATÁLOGO DE APPS / RESULTADOS DE PESQUISA */}
        <section>
          <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isSearching ? `Resultados para "${searchQuery}"` : "Todos os Projetos"}
            </h2>
            <span className="text-sm text-slate-500 font-medium">
              {filteredApps.length} {filteredApps.length === 1 ? 'encontrado' : 'encontrados'}
            </span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 mt-2">Tente pesquisar usando outros termos ou categorias.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApps.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col group"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={`Ícone ${app.name}`} className="w-full h-full object-cover" />
                      ) : (
                        <app.iconFallback size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-lg truncate leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
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

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center text-sm font-bold text-slate-700">
                      <Star size={14} className="fill-current text-yellow-400 mr-1" />
                      {app.rating}
                    </div>
                    <button className="bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold transition-colors">
                      Visualizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-10 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm font-medium text-slate-400">
          CSS.DEV Store &copy; 2026.
        </div>
      </footer>

      {/* JANELA EXCLUSIVA DO APP (MODAL) */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Cabeçalho do Modal */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 sm:px-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                     {selectedApp.iconUrl ? (
                      <img src={selectedApp.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <selectedApp.iconFallback size={20} className="text-slate-400" />
                    )}
                  </div>
                  <span className="font-bold text-slate-900">{selectedApp.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Share size={16} />
                  </button>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Corpo do Modal */}
              <div className="overflow-y-auto p-6 sm:p-10 hide-scrollbar">
                
                {/* Header Interno */}
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-10">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    {selectedApp.iconUrl ? (
                      <img src={selectedApp.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <selectedApp.iconFallback size={48} className="text-slate-300" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                      {selectedApp.name}
                    </h1>
                    <h2 className="text-xl text-slate-500 font-medium mb-6">
                      {selectedApp.subtitle}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-colors">
                        <Download size={18} />
                        Obter
                      </button>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full">
                        Detalhes do Sistema
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-8 py-4 border-y border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Avaliação</p>
                        <div className="flex items-center text-lg font-bold text-slate-700">
                          {selectedApp.rating} <Star size={16} className="fill-current text-yellow-400 ml-1 mb-0.5" />
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Categoria</p>
                        <div className="text-sm font-bold text-slate-700 mt-1">{selectedApp.category}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                      <div className="hidden sm:block">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Tamanho</p>
                        <div className="text-sm font-bold text-slate-700 mt-1">{selectedApp.size}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshots no Modal */}
                {selectedApp.screenshots.length > 0 && selectedApp.screenshots[0] !== "" && (
                  <div className="mb-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Pré-visualização</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                      {selectedApp.screenshots.map((imgUrl, index) => (
                        <div 
                          key={index}
                          className="snap-center flex-shrink-0 w-60 sm:w-72 h-[500px] bg-slate-100 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 overflow-hidden"
                        >
                          {imgUrl ? (
                            <img src={imgUrl} alt={`Tela ${index + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="opacity-50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descrição Detalhada */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Sobre o App</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                    {selectedApp.description}
                  </p>
                </div>
                
                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center text-sm text-slate-400">
                  <span>Versão {selectedApp.version}</span>
                  <span>Atualizado recentemente</span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos Globais */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}