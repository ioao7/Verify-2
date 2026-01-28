
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00df81] rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight italic">Verif<span className="text-[#00df81]">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
             <a 
              href="https://316ads.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#00df81] border border-[#00df81] px-4 py-2 rounded uppercase tracking-widest hover:bg-[#00df81] hover:text-black transition-all duration-300"
            >
              Empresa
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
