
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeMedia } from './services/geminiService';
import { AnalysisResult, MediaFile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediaSelect = useCallback(async (selectedMedia: MediaFile) => {
    setMedia(selectedMedia);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMedia(selectedMedia);
      setResult(analysis);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("Error en la conexión con el nodo forense. Verifica tu API KEY y reintenta.");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetAnalysis = () => {
    setMedia(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#000000] text-white selection:bg-[#00df81] selection:text-black">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full relative">
        {/* Decorative Grid background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00df81 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-16 space-y-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00df81/20] bg-[#00df8108]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df81] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00df81]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00df81]">Nodos Activos: Google Gemini 2.5</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Análisis <br />
              <span className="text-[#00df81] drop-shadow-[0_0_15px_rgba(0,223,129,0.3)]">Forense IA</span>
            </h1>
            
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed tracking-tight">
              Herramienta de grado militar para la verificación de integridad multimedia. 
              Detecta manipulaciones, deepfakes y desinformación mediante escaneo neuronal profundo.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-12 relative z-10">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-[3px] border-[#00df8110] rounded-full"></div>
              <div className="absolute inset-0 border-[3px] border-t-[#00df81] rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-[1px] border-[#00df8130] rounded-full animate-[reverse_spin_2s_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[10px] font-black text-[#00df81] animate-pulse">316ADS</div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-[#00df81]">Procesando Evidencia</h2>
              <div className="flex flex-col gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-[0.4em]">
                <span className="animate-pulse">Cálculo de entropía de píxeles...</span>
                <span className="animate-pulse delay-75">Escaneo de metadatos térmicos...</span>
                <span className="animate-pulse delay-150">Sincronización con archivos mundiales...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl mb-12 flex items-center gap-6 text-red-500 animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest mb-1">Fallo de Sistema</p>
              <p className="text-sm font-medium opacity-80">{error}</p>
            </div>
            <button onClick={resetAnalysis} className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">Reiniciar</button>
          </div>
        )}

        {/* Interaction Area */}
        {!loading && !result && (
          <div className="max-w-4xl mx-auto relative z-10">
            <FileUploader onMediaSelect={handleMediaSelect} loading={loading} />
          </div>
        )}

        {/* Results Area */}
        {!loading && result && media && (
          <div className="relative z-10">
            <AnalysisDashboard result={result} media={media} onReset={resetAnalysis} />
          </div>
        )}
      </main>

      {/* Footer */}
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
              <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Intelligence Division</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">© 2025 316ADS Labs</p>
            <p className="text-[9px] font-medium text-gray-700 mt-2 uppercase">Tecnología de Verificación Multimodal</p>
          </div>

          <div className="flex justify-end gap-10">
            <a href="https://316ads.com" target="_blank" className="text-[10px] font-black text-gray-500 hover:text-[#00df81] uppercase tracking-[0.2em] transition-colors">316ads.com</a>
            <a href="#" className="text-[10px] font-black text-gray-500 hover:text-[#00df81] uppercase tracking-[0.2em] transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
