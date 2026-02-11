
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeMedia } from './services/geminiService';
import { AnalysisResult, MediaFile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Inicializando...");
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const forensicStages = [
    { threshold: 10, msg: "Inyectando protocolos de nivel militar..." },
    { threshold: 25, msg: "Escaneando inconsistencias en leyes físicas..." },
    { threshold: 40, msg: "Analizando persistencia temporal de frames..." },
    { threshold: 55, msg: "Verificando biometría y reflejos oculares..." },
    { threshold: 70, msg: "Buscando firmas de modelos Sora/Kling/Runway..." },
    { threshold: 85, msg: "Cruzando evidencia con la red global..." },
    { threshold: 99, msg: "Generando veredicto de alta precisión..." }
  ];

  useEffect(() => {
    const stage = forensicStages.find(s => progress <= s.threshold);
    if (stage) setStatusMessage(stage.msg);
  }, [progress]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) return prev;
          let step = prev < 30 ? 2 : prev < 70 ? 0.5 : 0.02;
          return Math.min(prev + step, 99);
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleMediaSelect = useCallback(async (selectedMedia: MediaFile) => {
    setResult(null);
    setError(null);
    setProgress(0);
    setMedia(selectedMedia);
    setLoading(true);

    try {
      const analysis = await analyzeMedia(selectedMedia);
      setProgress(100);
      setStatusMessage("Escaneo Finalizado");
      
      setTimeout(() => {
        setResult(analysis);
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setError(err.message || "Error crítico en el motor de detección.");
      setLoading(false);
    }
  }, []);

  const resetAnalysis = () => {
    setMedia(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#000000] text-white selection:bg-[#00df81] selection:text-black">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full relative">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00df81 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        {!result && !loading && (
          <div className="text-center mb-16 space-y-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00df81/20] bg-[#00df8108]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df81] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00df81]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00df81]">Motor Pro V3.16 Ultra</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Detección <br />
              <span className="text-[#00df81] drop-shadow-[0_0_15px_rgba(0,223,129,0.3)]">Forense</span>
            </h1>
            
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed tracking-tight">
              Análisis forense de máxima profundidad. Diseñado para detectar los fallos más sutiles en la física de los modelos de IA generativa actuales.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-12 relative z-10 animate-in fade-in duration-500">
            <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 z-0">
                {media?.type === 'video' ? (
                  <video src={media.previewUrl!} className="w-full h-full object-cover opacity-40 grayscale" autoPlay muted loop />
                ) : media?.type === 'image' ? (
                  <img src={media.previewUrl!} className="w-full h-full object-cover opacity-40 grayscale" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#111] text-gray-800 font-mono text-[10px] uppercase tracking-[0.5em]">Iniciando Escaneo...</div>
                )}
              </div>

              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00df81] shadow-[0_0_25px_3px_#00df81] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-[6px]">
                <div className="relative flex items-center justify-center">
                  <svg className="w-64 h-64 transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="72" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={452.39} 
                      strokeDashoffset={452.39 - (452.39 * progress) / 100} 
                      className="text-[#00df81] transition-all duration-300 ease-linear shadow-[0_0_20px_#00df81]" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-white tracking-tighter">{Math.round(progress)}%</span>
                    <span className="text-[10px] font-black text-[#00df81] tracking-[0.4em] uppercase mt-2">Profundidad Total</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] italic text-[#00df81] animate-pulse">{statusMessage}</h2>
              <div className="flex flex-col items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
                <div className="h-1.5 w-80 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00df81] transition-all duration-300 shadow-[0_0_15px_#00df81]" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="opacity-40 font-mono mt-2 tracking-[0.1em]">GEMINI_PRO_ENGINE_V3.16_SECURE</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl mb-12 flex items-center gap-8 text-red-500 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest mb-1">Fallo Crítico de Detección</p>
              <p className="text-base font-medium opacity-80">{error}</p>
            </div>
            <button onClick={resetAnalysis} className="ml-auto bg-red-500 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors">Reintentar</button>
          </div>
        )}

        {!loading && !result && (
          <div className="max-w-4xl mx-auto relative z-10">
            <FileUploader onMediaSelect={handleMediaSelect} loading={loading} />
          </div>
        )}

        {!loading && result && media && (
          <div className="relative z-10">
            <AnalysisDashboard result={result} media={media} onReset={resetAnalysis} />
          </div>
        )}
      </main>

      <footer className="bg-black border-t border-white/5 py-20 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00df81] to-transparent opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#00df81] rounded-xl flex items-center justify-center shadow-lg shadow-[#00df8120]">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-white italic uppercase tracking-tighter block leading-none">Verif<span className="text-[#00df81]">AI</span></span>
              <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Tecnología de 316ADS</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">© 2026 316ADS Labs</p>
          </div>
          <div className="flex justify-end gap-10">
            <a href="https://316ads.com" target="_blank" className="text-[10px] font-black text-gray-500 hover:text-[#00df81] uppercase tracking-[0.2em] transition-colors">316ads.com</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
