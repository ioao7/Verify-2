
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
      case 'AUTÉNTICO': return 'text-[#00df81] border-[#00df8130] bg-[#00df8105]';
      case 'SOSPECHOSO': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/05';
      case 'MANIPULADO': return 'text-orange-500 border-orange-500/30 bg-orange-500/05';
      case 'IA_GENERADO': return 'text-red-500 border-red-500/30 bg-red-500/05';
      default: return 'text-white border-white/20 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-[#111] p-2 rounded-xl border border-white/10 shadow-2xl">
          <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center relative group">
            <div className="absolute top-4 left-4 z-10 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-[#00df81] uppercase tracking-widest border border-[#00df8120]">
              Evidencia Analizada
            </div>
            {result.highPrecision && (
              <div className="absolute bottom-4 right-4 z-10 bg-[#00df81] text-black px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DeepScan Pro Activo
              </div>
            )}
            {media.type === 'link' ? (
              <div className="text-center p-8">
                <svg className="w-12 h-12 text-gray-800 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className="text-xs text-gray-600 break-all font-mono">{media.link}</p>
              </div>
            ) : media.type === 'video' ? (
              <video src={media.previewUrl!} controls className="w-full h-full object-contain" />
            ) : (
              <img src={media.previewUrl!} alt="Preview" className="w-full h-full object-contain" />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center px-3 py-1.5 rounded border text-[10px] font-black tracking-[0.2em] ${getVerdictStyles(result.verdict)}`}>
              VEREDICTO: {result.verdict}
            </div>
            
            <h2 className="text-4xl font-black text-white leading-none uppercase tracking-tighter italic">
              {result.isFake ? 'Contenido Comprometido' : 'Autenticidad Verificada'}
            </h2>
            
            <p className="text-gray-500 text-sm font-medium">
              El motor VerifAI ha concluido el escaneo utilizando {result.highPrecision ? 'redes de alta densidad' : 'redes neuronales rápidas'}.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#111] border border-white/10 p-6 rounded-xl">
             <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Confianza</span>
              <span className="text-5xl font-black text-[#00df81] tracking-tighter">{result.confidence}%</span>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
             <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Búsqueda Web</span>
              <span className="text-lg font-bold text-white uppercase">{result.searchFound ? 'Coincidencias' : 'Único'}</span>
            </div>
          </div>

          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-[#00df81] hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Nuevo Escaneo
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reasons */}
        <div className="md:col-span-2 bg-[#111] p-8 rounded-xl border border-white/10">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Hallazgos Críticos</h4>
          <ul className="space-y-4">
            {result.reasoning.map((reason, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="flex-shrink-0 w-6 h-6 bg-white/5 border border-white/10 text-[#00df81] rounded flex items-center justify-center text-[10px] font-black">{i+1}</span>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">{reason}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Forensic Report */}
        <div className="bg-[#00df81] text-black p-8 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h4 className="text-[10px] font-black mb-8 uppercase tracking-[0.3em]">Módulo Forense 0x1</h4>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-[9px] font-black uppercase opacity-60 mb-1">Artefactos</p>
              <p className="text-xs font-bold leading-snug">{result.forensicDetails.artifactDetection}</p>
            </div>
            <div className="h-px bg-black/10"></div>
            <div>
              <p className="text-[9px] font-black uppercase opacity-60 mb-1">Iluminación</p>
              <p className="text-xs font-bold leading-snug">{result.forensicDetails.lightingInconsistency}</p>
            </div>
            <div className="h-px bg-black/10"></div>
            <div>
              <p className="text-[9px] font-black uppercase opacity-60 mb-1">Firma IA</p>
              <p className="text-xs font-bold leading-snug">{result.forensicDetails.aiSignature}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Web Search Grounding */}
      {result.searchSources.length > 0 && (
        <div className="bg-[#111] p-8 rounded-xl border border-white/10">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Rastros Digitales (Web Grounding)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.searchSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/40 p-4 rounded border border-white/5 hover:border-[#00df81] transition-all group"
              >
                <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#00df81]">{source.title}</p>
                <p className="text-[9px] text-gray-600 truncate mt-2 font-mono">{source.uri}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
