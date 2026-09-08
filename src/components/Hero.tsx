import React, { useState, useRef } from 'react';
import { Upload, Feather, Keyboard, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onAnalyzeChoice: (mode: 'signature' | 'typing' | 'handwriting', file?: File) => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeChoice }) => {
  const [activeTab, setActiveTab] = useState<'handwriting' | 'signature' | 'typing'>('handwriting');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTabClick = (mode: 'handwriting' | 'signature' | 'typing') => {
    setActiveTab(mode);
  };

  const handleBarClick = () => {
    if (activeTab === 'handwriting') {
      fileInputRef.current?.click();
    } else {
      onAnalyzeChoice(activeTab);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAnalyzeChoice('handwriting', file);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-12 pt-36 pb-20 overflow-hidden bg-radial from-[#C9A24B]/10 via-transparent to-transparent">
      {/* Floating Antigravity Glyphs */}
      <div
        className="floating-glyph antigravity"
        data-depth="0.04"
        style={{ top: '20%', left: '8%', fontSize: '4.5rem' }}
      >
        ॐ
      </div>
      <div
        className="floating-glyph antigravity font-delafield"
        data-depth="-0.03"
        style={{ bottom: '18%', right: '9%', fontSize: '5.5rem', opacity: 0.18 }}
      >
        Yours truly
      </div>
      <div
        className="floating-glyph antigravity font-cinzel-dec"
        data-depth="0.05"
        style={{ top: '30%', right: '14%', fontSize: '3rem', opacity: 0.12 }}
      >
        Ψ
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Eyebrow */}
      <span className="eyebrow antigravity mb-4" data-depth="0.015">
        Graphology &amp; Keystroke Dynamics
      </span>

      {/* Hero Headline */}
      <div className="relative inline-block max-w-4xl antigravity mb-4" data-depth="0.035">
        <h1 className="font-cinzel-dec font-black text-4xl sm:text-6xl lg:text-7xl tracking-wide uppercase text-[#1B1B2F] drop-shadow-sm leading-[1.12]">
          Every Stroke Tells A Story
        </h1>
      </div>

      {/* Hero Subtitle */}
      <h2 className="font-cormorant italic font-medium text-lg sm:text-2xl text-[#3B4B6B] max-w-2xl mx-auto mb-6 leading-relaxed antigravity" data-depth="0.02">
        Upload a sample and MindMatters reads the pressure, slant, and rhythm behind your handwriting — the parts you never meant to say out loud.
      </h2>

      {/* Gold Flourish Ornament */}
      <svg
        className="flourish antigravity mb-7"
        data-depth="0.025"
        width="160"
        height="24"
        viewBox="0 0 160 24"
        fill="none"
      >
        <path
          d="M2 12c20-14 28 14 48 0s28-14 48 0 28 14 48 0"
          stroke="#C9A24B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Interactive Mode Tabs */}
      <div className="tab-group antigravity inline-flex gap-1.5 bg-[#1B1B2F]/[0.07] p-1.5 rounded-sm mb-6 z-10" data-depth="0.02">
        <button
          onClick={() => handleTabClick('handwriting')}
          className={`tab-btn px-5 py-2.5 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'handwriting'
              ? 'bg-[#1B1B2F] text-[#F4ECDD] shadow-md shadow-[#1B1B2F]/20'
              : 'text-[#1B1B2F] hover:bg-[#1B1B2F]/10'
          }`}
        >
          <Upload className="w-4 h-4 text-[#C9A24B]" />
          <span>Upload File</span>
        </button>

        <button
          onClick={() => handleTabClick('signature')}
          className={`tab-btn px-5 py-2.5 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'signature'
              ? 'bg-[#1B1B2F] text-[#F4ECDD] shadow-md shadow-[#1B1B2F]/20'
              : 'text-[#1B1B2F] hover:bg-[#1B1B2F]/10'
          }`}
        >
          <Feather className="w-4 h-4 text-[#C9A24B]" />
          <span>Live Ink Pad</span>
        </button>

        <button
          onClick={() => handleTabClick('typing')}
          className={`tab-btn px-5 py-2.5 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'typing'
              ? 'bg-[#1B1B2F] text-[#F4ECDD] shadow-md shadow-[#1B1B2F]/20'
              : 'text-[#1B1B2F] hover:bg-[#1B1B2F]/10'
          }`}
        >
          <Keyboard className="w-4 h-4 text-[#C9A24B]" />
          <span>Keystroke Test</span>
        </button>
      </div>

      {/* Interactive Upload Input Bar */}
      <div
        onClick={handleBarClick}
        className="upload-bar antigravity flex items-center bg-[#F4ECDD] border-2 border-[#1B1B2F] rounded-sm p-2 pl-6 max-w-xl w-full shadow-2xl shadow-[#1B1B2F]/15 z-10 cursor-pointer hover:border-[#8B5E34] hover:shadow-2xl transition-all"
        data-depth="0.045"
        id="upload"
      >
        <span className="flex-1 text-left font-lora text-sm sm:text-base text-[#1B1B2F] select-none italic text-[#5B5B70]">
          {activeTab === 'handwriting'
            ? 'Drop a photo of your handwriting, or click to browse…'
            : activeTab === 'signature'
            ? 'Click to open the live signature & inking pad…'
            : 'Click to start real-time typing dynamics calibration…'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBarClick();
          }}
          className="upload-btn bg-[#A13D3D] text-[#F4ECDD] border-none px-6 py-3 rounded-sm font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#832F2F] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <span>{activeTab === 'handwriting' ? 'Analyze File' : activeTab === 'signature' ? 'Sign Now' : 'Type Now'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hint */}
      <span className="hero-hint antigravity mt-4 text-xs text-[#6B6B80] font-lora italic tracking-wide z-10" data-depth="0.02">
        JPG, PNG, live ink or keystroke stream · evaluated against 50,000+ benchmark profiles
      </span>
    </section>
  );
};
