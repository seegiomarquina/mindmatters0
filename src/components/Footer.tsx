import React from 'react';
import { Github, Feather } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E8DFC9] border-t border-[#1B1B2F]/15 py-16 text-[#5B5B70] font-lora">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-3">
          <Feather className="w-6 h-6 text-[#8B5E34]" />
          <span className="font-cinzel-dec font-bold text-2xl text-[#1B1B2F] tracking-wide">
            MindMatters
          </span>
        </div>
        
        <p className="text-sm text-[#5B5B70] max-w-md mb-8 italic">
          Decoding behavioral kinetics &amp; graphological morphology — one stroke at a time.
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-cinzel font-bold text-[#1B1B2F] mb-8 uppercase tracking-widest">
          <a href="#" className="hover:text-[#A13D3D] transition-colors">Home</a>
          <a href="#styles" className="hover:text-[#A13D3D] transition-colors">Traditions</a>
          <a href="#core-services" className="hover:text-[#A13D3D] transition-colors">Engines</a>
          <a href="#how-it-works" className="hover:text-[#A13D3D] transition-colors">Methodology</a>
          <a href="#report-section" className="hover:text-[#A13D3D] transition-colors">Dossier</a>
        </div>

        <div className="px-5 py-2.5 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 text-xs text-[#8B5E34] font-cinzel font-semibold shadow-inner">
          Computer-Vision &amp; Multi-Biometric Cognitive Engine · Real Science &amp; Research Platform
        </div>

        <p className="text-xs text-[#7A7A8F] mt-8">
          © {new Date().getFullYear()} MindMatters AI. Built with precision and care.
        </p>
      </div>
    </footer>
  );
};
