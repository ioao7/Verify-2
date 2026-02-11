
import React from 'react';
import { AnalysisResult, MediaFile } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  media: MediaFile;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, media, onReset }) => {
  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'AUTÉNTICO': return { color: '#00df81', bg: 'rgba(0, 223, 129, 0.1)', shadow: '0 0 40px rgba(0, 223, 129, 0.2)', label: 'Pieza Orgánica' };
      case 'SOSPECHOSO': return { color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', shadow: '0 0 40px rgba(250, 204, 21, 0.2)', label: 'Inconsistencias Detectadas' };
      case 'MANIPULADO': return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', shadow: '0 0 40px rgba(249, 115, 22, 0.2)', label: 'Edición Detectada' };
      case 'IA_GENERADO': return { color: '#ff3333', bg: 'rgba(255, 51, 51, 0.1)', shadow: '0 0 40px rgba(255, 51, 51, 0.4)', label: 'IA GENERATIVA DETECTADA' };
      default: return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', shadow: 'none', label: 'Análisis Finalizado' };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <div className="flex flex-col gap-6">
          <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video flex items-center justify-center">
             <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: styles.color }}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: styles.color }}>Muestra #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
            </div>

            <div className="w-full h-full">
              {media.type === 'link' ? (
                <div className="w-full h-full flex items-center justify-center p-10 text-center">
                  <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest break-all italic">{media.link}</p>
                </div>
              ) : media.type === 'video' ? (
                <video src={media.previewUrl!} controls className="w-full h-full object-contain" />
              ) : (
                <img src={media.previewUrl!} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 font-black text-xl italic shrink-0">!</div>
            <p className="text-[11px] text-gray-500 font-bold leading-relaxed uppercase tracking-tight">
              Análisis profundo realizado por el motor Gemini 3 Pro. Se han evaluado leyes físicas, persistencia de frames y micro-texturas cutáneas.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] mb-4">Veredicto Forense</h2>
            <div 
              className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter transition-all duration-700 leading-[0.8]"
              style={{ color: styles.color, textShadow: styles.shadow }}
            >
              {result.verdict.replace('_', ' ')}
            </div>
            <div className="inline-block mt-4 text-sm font-black uppercase tracking-[0.3em] px-4 py-1 rounded" style={{ backgroundColor: styles.bg, color: styles.color }}>
              {styles.label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12">
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors group">
                <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 group-hover:text-[#00df81]">Nivel de Certeza</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">{result.confidence}</span>
                  <span className="text-[#00df81] font-black text-2xl">%</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors group">
                <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 group-hover:text-[#00df81]">Integridad</span>
                <span className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  {result.isFake ? 'Sintético' : 'Verificado'}
                </span>
                <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00df81]" style={{ width: result.isFake ? '10%' : '100%' }}></div>
                </div>
             </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full mt-10 py-6 rounded-2xl bg-[#00df81] text-black font-black text-xs uppercase tracking-[0.4em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_30px_60px_-15px_rgba(0,223,129,0.3)]"
          >
            Nueva Investigación Forense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#080808] border border-white/5 rounded-[40px] p-10 space-y-10">
          <h3 className="text-xs font-black text-[#00df81] uppercase tracking-[0.5em] flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00df81] rounded-full shadow-[0_0_10px_#00df81]"></span>
            Hallazgos de la Investigación
          </h3>
          <div className="space-y-6">
            {result.reasoning.map((reason, i) => (
              <div key={i} className="flex gap-6 group p-6 rounded-3xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
                <span className="text-[#00df81] font-black text-xs font-mono opacity-40">ITEM_{i+1}</span>
                <p className="text-gray-300 text-sm font-semibold leading-relaxed group-hover:text-white transition-colors">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#080808] border border-white/5 rounded-[40px] p-10 space-y-8">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.5em]">Detalles Técnicos Profundos</h3>
            <div className="space-y-8">
               <div className="group">
                 <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] block mb-2 group-hover:text-[#00df81] transition-colors">Micro-Artefactos</span>
                 <p className="text-sm font-bold text-gray-200 uppercase tracking-tight leading-snug">{result.forensicDetails.artifactDetection}</p>
               </div>
               <div className="group">
                 <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] block mb-2 group-hover:text-[#00df81] transition-colors">Física Dinámica</span>
                 <p className="text-sm font-bold text-gray-200 uppercase tracking-tight leading-snug">{result.forensicDetails.lightingInconsistency}</p>
               </div>
               <div className="group">
                 <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] block mb-2 group-hover:text-[#00df81] transition-colors">Firma de Modelo</span>
                 <p className="text-sm font-bold text-gray-200 uppercase tracking-tight leading-snug">{result.forensicDetails.aiSignature}</p>
               </div>
            </div>
          </div>

          {result.searchSources.length > 0 && (
            <div className="bg-[#00df81]/5 border border-[#00df81]/10 rounded-[40px] p-10">
              <h3 className="text-xs font-black text-[#00df81] uppercase tracking-[0.5em] mb-6">Contraste de Información Web</h3>
              <div className="grid grid-cols-1 gap-3">
                {result.searchSources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#00df81/30] transition-all group"
                  >
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white truncate pr-4">{source.title}</span>
                    <span className="text-[10px] font-black text-[#00df81] shrink-0">OPEN</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
