import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🧠</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-100 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                MindMatters AI
              </span>
              <span className="text-[10px] text-teal-400/80 font-medium tracking-widest uppercase -mt-1">
                Biometric Intelligence
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#home"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors"
            >
              Home
            </a>
            <button
              onClick={onOpenSignature}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Sign Analysis
            </button>
            <button
              onClick={onOpenTyping}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Typing Analysis
            </button>
            <button
              onClick={onOpenHandwriting}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Handwriting Analysis
            </button>
            <button
              onClick={onOpenReports}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              My Reports
            </button>
            <a
              href="#how-it-works"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/60 rounded-lg transition-colors"
            >
              About
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSignature}
              className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
