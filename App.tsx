
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
      setError("Ocurrió un error en la red neuronal. Verifica tu conexión e intenta de nuevo.");
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
    <div className="min-h-screen flex flex-col font-sans bg-[#0a0a0a] text-white">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-20 w-full">
        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-20 space-y-6">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Detección <span className="text-[#00df81]">Forense</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium tracking-wide">
              Análisis avanzado de integridad multimedia mediante inteligencia artificial de Google. 
              Verifica la veracidad de imágenes y videos en segundos.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-12">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-2 border-[#00df8120] rounded-full"></div>
              <div className="absolute inset-0 border-2 border-t-[#00df81] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#00df81] rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black uppercase tracking-widest italic">Escaneando Red Neuronal</h2>
              <div className="flex flex-col gap-1 text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                <span className="animate-pulse">Desglosando canales RGB...</span>
                <span className="animate-pulse delay-150">Verificando coherencia espacial...</span>
                <span className="animate-pulse delay-300">Cruzando metadatos web...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded mb-12 flex items-center gap-4 text-red-500">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            <button onClick={resetAnalysis} className="ml-auto text-[10px] font-black underline uppercase tracking-widest">Cerrar</button>
          </div>
        )}

        {/* Interaction Area */}
        {!loading && !result && (
          <div className="max-w-3xl mx-auto">
            <FileUploader onMediaSelect={handleMediaSelect} loading={loading} />
          </div>
        )}

        {/* Results Area */}
        {!loading && result && media && (
          <AnalysisDashboard result={result} media={media} onReset={resetAnalysis} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-[#00df81] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-lg font-black text-white italic uppercase tracking-tighter">Verif<span className="text-[#00df81]">AI</span></span>
          </div>
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">© 2025 Laboratorio de Verificación. Partner of 316ADS.</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold text-gray-600 hover:text-[#00df81] uppercase tracking-widest transition-colors">Data</a>
            <a href="#" className="text-[10px] font-bold text-gray-600 hover:text-[#00df81] uppercase tracking-widest transition-colors">Legal</a>
            <a href="#" className="text-[10px] font-bold text-gray-600 hover:text-[#00df81] uppercase tracking-widest transition-colors">Labs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
