
import React, { useState, useRef } from 'react';
import { MediaFile } from '../types';

interface FileUploaderProps {
  onMediaSelect: (media: MediaFile) => void;
  loading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onMediaSelect, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage || isVideo) {
      onMediaSelect({
        file,
        previewUrl: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video'
      });
    } else {
      alert('Por favor selecciona una imagen o video válido.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      onMediaSelect({
        file: null,
        previewUrl: null,
        type: 'link',
        link: linkInput
      });
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
          dragActive ? 'border-[#00df81] bg-[#00df8105]' : 'border-white/10 bg-[#111]'
        } ${loading ? 'opacity-50 pointer-events-none' : 'hover:border-white/20'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*,video/*"
          onChange={handleChange}
        />
        
        <div className="bg-[#00df8110] p-4 rounded mb-4">
          <svg className="w-8 h-8 text-[#00df81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">Carga de Multimedia</h3>
        <p className="text-gray-500 text-xs mb-6 text-center max-w-xs font-medium">
          Arrastra JPG, PNG, MP4 o MOV para análisis forense inmediato.
        </p>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#00df81] text-black px-8 py-3 rounded font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all"
        >
          Explorar Archivos
        </button>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-grow h-px bg-white/10"></div>
        <span className="text-gray-600 text-[10px] font-black tracking-[0.2em] uppercase">Escaneo por Link</span>
        <div className="flex-grow h-px bg-white/10"></div>
      </div>

      <form onSubmit={handleLinkSubmit} className="flex gap-2">
        <input 
          type="url" 
          placeholder="https://ejemplo.com/evidencia.jpg"
          className="flex-grow bg-[#111] border border-white/10 rounded px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#00df81] focus:border-transparent outline-none transition-all placeholder:text-gray-700"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          className="bg-white text-black px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#00df81] transition-colors whitespace-nowrap"
          disabled={loading || !linkInput.trim()}
        >
          Escanear
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
