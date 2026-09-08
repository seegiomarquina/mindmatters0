import React from 'react';
import { Feather, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenSignature: () => void;
  onOpenTyping: () => void;
  onOpenHandwriting: () => void;
  onOpenReports: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSignature,
  onOpenTyping,
  onOpenHandwriting,
  onOpenReports
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 bg-[#F4ECDD]/90 backdrop-blur-md border-b border-[#1B1B2F]/10 transition-all duration-300">
      <a href="#" className="flex items-center gap-3 font-cinzel-dec font-bold text-xl sm:text-2xl text-[#1B1B2F] tracking-wide group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[#8B5E34] group-hover:rotate-12 transition-transform">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
        <span>MindMatters</span>
      </a>

      <div className="flex items-center gap-6 sm:gap-10">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-cinzel text-xs sm:text-sm font-bold tracking-wider text-[#1B1B2F]">
            <li>
              <a href="#styles" className="relative pb-1 hover:text-[#A13D3D] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A13D3D] hover:after:w-full after:transition-all">
                Traditions
              </a>
            </li>
            <li>
              <button onClick={onOpenHandwriting} className="relative pb-1 hover:text-[#A13D3D] transition-colors cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A13D3D] hover:after:w-full after:transition-all">
                Handwriting Scan
              </button>
            </li>
            <li>
              <button onClick={onOpenSignature} className="relative pb-1 hover:text-[#A13D3D] transition-colors cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A13D3D] hover:after:w-full after:transition-all">
                Live Ink Pad
              </button>
            </li>
            <li>
              <button onClick={onOpenTyping} className="relative pb-1 hover:text-[#A13D3D] transition-colors cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A13D3D] hover:after:w-full after:transition-all">
                Keystroke Rhythm
              </button>
            </li>
            <li>
              <button onClick={onOpenReports} className="relative pb-1 hover:text-[#A13D3D] transition-colors flex items-center gap-1.5 cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#A13D3D] hover:after:w-full after:transition-all">
                <FileText className="w-3.5 h-3.5 text-[#8B5E34]" />
                Dossier
              </button>
            </li>
          </ul>
        </nav>

        <button
          onClick={onOpenHandwriting}
          className="bg-[#1B1B2F] text-[#F4ECDD] px-5 py-2.5 rounded-sm font-cinzel text-xs font-bold tracking-widest uppercase border border-[#1B1B2F] hover:bg-transparent hover:text-[#1B1B2F] transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Feather className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span>Analyze Sample</span>
        </button>
      </div>
    </header>
  );
};
