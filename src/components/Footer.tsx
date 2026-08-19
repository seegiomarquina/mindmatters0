import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🧠</span>
          <span className="font-bold text-lg text-slate-100">
            MindMatters AI
          </span>
        </div>
        
        <p className="text-sm text-slate-400 max-w-md mb-6">
          MindMatters AI — Decoding minds, one pattern at a time.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-300 mb-8">
          <a href="#home" className="hover:text-teal-400 transition-colors">About</a>
          <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How it Works</a>
          <a href="#report-section" className="hover:text-teal-400 transition-colors">Privacy</a>
          <a href="#core-services" className="hover:text-teal-400 transition-colors">Contact</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition-colors flex items-center gap-1">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-400">
          Final Year Data Science Project — for academic/research purposes
        </div>

        <p className="text-[11px] text-slate-600 mt-6">
          © {new Date().getFullYear()} MindMatters AI. Built with precision and care.
        </p>
      </div>
    </footer>
  );
};
