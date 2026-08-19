import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, Cpu, Zap, ArrowRight } from 'lucide-react';

interface HeroProps {
  onAnalyzeChoice: (mode: 'signature' | 'typing' | 'handwriting') => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeChoice }) => {
  const [selectedMode, setSelectedMode] = useState<'signature' | 'typing' | 'handwriting'>('signature');
  const [queryText, setQueryText] = useState('');

  const handleAnalyzeClick = () => {
    onAnalyzeChoice(selectedMode);
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-indigo-600/15 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Animated Stagger 1: Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-medium mb-6 shadow-inner backdrop-blur-md animate-fade-in-up [animation-delay:0ms]">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
          <span>Next-Gen Multi-Biometric Cognitive Profiler</span>
        </div>

        {/* Animated Stagger 2: Headline with Gradient Shimmer on 'Really Saying' */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.12] mb-6 animate-fade-in-up [animation-delay:100ms]">
          Discover What Your Mind Is{' '}
          <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-text-shimmer">
            Really Saying
          </span>
        </h1>

        {/* Animated Stagger 3: Sub-headline */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300/90 font-normal leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
          One platform. Three ways to analyze your mental state — through your <span className="text-teal-300 font-medium">handwriting</span>, your <span className="text-cyan-300 font-medium">typing</span>, and your <span className="text-indigo-300 font-medium">signature</span>. Get a single, science-backed report in minutes.
        </p>

        {/* Animated Stagger 4: Search-Bar Style Component */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:300ms]">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-teal-950/40 backdrop-blur-xl">
            <div className="flex items-center flex-1 w-full pl-3 pr-2 py-1.5">
              <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="What do you want to analyze today?"
                className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Dropdown mode selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as any)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="signature">Sign Analysis</option>
                <option value="typing">Typing Analysis</option>
                <option value="handwriting">Handwriting Analysis</option>
              </select>

              {/* Analyze Now Button */}
              <button
                onClick={handleAnalyzeClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Analyze Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Stagger 5: Trust Strip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 animate-fade-in-up [animation-delay:400ms]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Trusted analysis engine</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>3 input modes</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Instant AI-generated report</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% private & on-device friendly</span>
          </div>
        </div>

      </div>
    </section>
  );
};
