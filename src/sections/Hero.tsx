import React, { useState } from 'react';
import { Brain, ChevronDown, ShieldCheck, Zap, Layers, Lock, ArrowRight } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';

const modes = [
  { label: 'Sign', id: 'sign' },
  { label: 'Typing', id: 'typing' },
  { label: 'Handwriting', id: 'handwriting' },
];

const trust = [
  { icon: ShieldCheck, text: 'Trusted analysis engine' },
  { icon: Layers, text: '3 input modes' },
  { icon: Zap, text: 'Instant AI-generated report' },
  { icon: Lock, text: '100% private & on-device friendly' },
];

export interface HeroProps {
  onStartAnalysis?: (mode: 'sign' | 'typing' | 'handwriting') => void;
}

export default function Hero({ onStartAnalysis }: HeroProps) {
  const [mode, setMode] = useState(modes[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAnalyze = () => {
    if (onStartAnalysis) {
      onStartAnalysis(mode.id as 'sign' | 'typing' | 'handwriting');
    } else {
      scrollToId(mode.id);
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* soft gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-10 -right-24 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">
          <Brain className="h-3.5 w-3.5" />
          MULTIMODAL MENTAL-STATE ANALYSIS
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Discover What Your Mind Is{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
            Really Saying
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          One platform. Three ways to analyze your mental state — through your
          signature, your typing, and your handwriting. Get a single, science-backed
          report in minutes.
        </p>

        {/* Search-bar style CTA */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-[0_20px_60px_-20px_rgba(76,29,149,0.35)] backdrop-blur sm:flex-row sm:items-center sm:rounded-full sm:gap-0 sm:p-2">
          <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
            <Brain className="h-5 w-5 shrink-0 text-indigo-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to analyze today? (e.g., Focus, Stress, Leadership)"
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none sm:text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze();
              }}
            />
          </div>

          <div className="relative sm:border-l sm:border-slate-200">
            <select
              value={mode.label}
              onChange={(e) => setMode(modes.find((m) => m.label === e.target.value)!)}
              className="w-full appearance-none bg-transparent px-4 py-2.5 pr-9 text-sm font-semibold text-slate-700 outline-none sm:w-auto cursor-pointer"
            >
              {modes.map((m) => (
                <option key={m.label} value={m.label}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            onClick={handleAnalyze}
            className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition-all hover:shadow-xl hover:shadow-indigo-400/50 hover:brightness-110 cursor-pointer"
          >
            Analyze Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trust.map((t) => (
            <span key={t.text} className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <t.icon className="h-4 w-4 text-teal-500" />
              {t.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
