
import React from 'react';
import { AnalysisResult, MediaFile } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  media: MediaFile;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, media, onReset }) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'AUTÉNTICO': return '#00df81';
      case 'SOSPECHOSO': return '#facc15';
      case 'MANIPULADO': return '#f97316';
      case 'IA_GENERADO': return '#ef4444';
      default: return '#ffffff';
    }
  };

  const verdictColor = getVerdictColor(result.verdict);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sección Superior: Impacto Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00df81] to-transparent opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-black/80 backdrop-blur-md text-[#00df81] text-[10px] font-black px-3 py-1 rounded-full border border-[#00df81/30] uppercase tracking-widest">
                Evidencia ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
            </div>
            
            <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
              {media.type === 'link' ? (
                <div className="text-center p-10 space-y-4">
                  <div className="w-16 h-16 bg-[#00df8110] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[#00df81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 font-mono break-all px-4">{media.link}</p>
                </div>
              ) : media.type === 'video' ? (
                <video src={media.previewUrl!} controls className="w-full h-full object-contain" />
              ) : (
                <img src={media.previewUrl!} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            {/* Primero el título general como solicitó el usuario */}
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic uppercase">
              Resultado del <span className="text-[#00df81]">Análisis</span>
            </h2>

            {/* Veredicto más grande y llamativo */}
            <div 
              className="inline-block px-10 py-5 rounded-2xl border text-4xl font-black tracking-tighter uppercase transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.3)] animate-pulse"
              style={{ 
                color: verdictColor, 
                borderColor: `${verdictColor}40`, 
                backgroundColor: `${verdictColor}05`,
                boxShadow: `0 0 40px -10px ${verdictColor}30`
              }}
            >
              {result.verdict.replace('_', ' ')}
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg font-medium">
              Nuestro motor forense ha procesado los vectores visuales y comparado las huellas digitales en la red global para determinar la integridad de la pieza.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-1">
                <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest">Índice de Confianza</span>
                <div className="group/info relative cursor-help">
                  <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-black border border-white/10 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-tight leading-normal opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none">
                    Grado de certeza estadística basado en ruido digital, coherencia de metadatos y patrones biométricos.
                  </div>
                </div>
              </div>
              <span className="text-5xl font-black text-white tracking-tighter">{result.confidence}<span className="text-[#00df81] text-2xl">%</span></span>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
              <span className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Fuentes Web</span>
              <span className="text-xl font-bold text-white uppercase tracking-tight">
                {result.searchFound ? 'Encontradas' : 'Contenido Único'}
              </span>
              <p className="text-[9px] text-gray-600 mt-2 font-mono uppercase tracking-tighter">
                {result.searchSources.length} Referencias cruzadas
              </p>
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full py-4 rounded-xl border border-[#00df81/20] text-[#00df81] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00df81] hover:text-black transition-all duration-500 shadow-lg shadow-[#00df8105]"
          >
            Realizar Nuevo Escaneo Forense
          </button>
        </div>
      </div>

      {/* Grid de Detalles Técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-10 space-y-8">
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#00df81] rounded-full animate-pulse"></span>
              Hallazgos de la Investigación
            </h3>
            <div className="space-y-6">
              {result.reasoning.map((reason, i) => (
                <div key={i} className="flex gap-6 group">
                  <span className="text-[10px] font-black text-gray-700 group-hover:text-[#00df81] transition-colors pt-1">0{i+1}</span>
                  <p className="text-gray-300 text-sm leading-relaxed border-b border-white/5 pb-4 w-full group-hover:text-white transition-colors font-medium">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#00df81] text-black rounded-2xl p-10 flex flex-col justify-between shadow-[0_0_50px_-12px_rgba(0,223,129,0.3)]">
          <div className="space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] border-b border-black/10 pb-4">Reporte Forense</h3>
            
            <div className="space-y-6">
              <div className="group">
                <span className="block text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Artefactos</span>
                <p className="text-xs font-black leading-tight uppercase tracking-tight">{result.forensicDetails.artifactDetection}</p>
              </div>
              <div className="group">
                <span className="block text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Iluminación</span>
                <p className="text-xs font-black leading-tight uppercase tracking-tight">{result.forensicDetails.lightingInconsistency}</p>
              </div>
              <div className="group">
                <span className="block text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Firma de IA</span>
                <p className="text-xs font-black leading-tight uppercase tracking-tight">{result.forensicDetails.aiSignature}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-10 flex justify-between items-end">
             <div className="text-[40px] font-black leading-none opacity-20 italic select-none">316ADS</div>
             <div className="text-[9px] font-bold uppercase tracking-tighter opacity-60">Verified Lab</div>
          </div>
        </div>
      </div>

      {/* Web Sources */}
      {result.searchSources.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
           <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 px-2">Huella Digital en Internet</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.searchSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#111] border border-white/5 p-5 rounded-xl hover:border-[#00df81/40] hover:bg-[#151515] transition-all group"
              >
                <p className="text-[11px] font-bold text-gray-200 line-clamp-2 group-hover:text-[#00df81] transition-colors">
                  {source.title}
                </p>
                <p className="text-[9px] text-gray-600 truncate mt-3 font-mono">{new URL(source.uri).hostname}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
