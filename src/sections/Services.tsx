import React from 'react';
import { PenLine, Keyboard, ArrowRight, ScanLine } from 'lucide-react';

/* Custom Camera-Scan Frame over Handwritten Line Icon */
export function HandwritingScanIcon({ className = "h-5 w-5 text-teal-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Viewfinder corner brackets */}
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      {/* Handwritten line wave inside frame */}
      <path d="M7 11.5c1.5-2 3-2 4.5 0s3 2 4.5 0 2.5-1 4-0.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 15.5c2-1 3.5 1 5.5 0s3.5-1.5 5 0" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1 2" />
      {/* Scan beam indicator */}
      <line x1="4" y1="12" x2="20" y2="12" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );
}

/* --- Animated visuals for each card --- */

function SignatureVisual() {
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full" fill="none">
      <path
        d="M18 62 C 34 22, 52 22, 58 50 C 63 72, 78 70, 86 44 C 92 24, 106 26, 110 48 C 113 64, 126 62, 134 42 C 140 28, 152 30, 156 46 C 160 60, 176 58, 202 36"
        stroke="url(#sigGrad)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="600" strokeDashoffset="600"
        className="animate-sig"
      />
      <path d="M30 74 H 190" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8" />
      <defs>
        <linearGradient id="sigGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TypingVisual() {
  const bars = [22, 40, 18, 52, 34, 60, 26, 44, 20, 56, 30, 48, 24, 38, 58, 28, 46, 20];
  return (
    <div className="flex h-full w-full items-end justify-center gap-1.5 px-6 pb-5">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-2 rounded-full bg-gradient-to-t from-violet-500 to-teal-400 animate-pulse"
          style={{ height: `${h}px`, animationDelay: `${i * 120}ms`, animationDuration: '1.6s' }}
        />
      ))}
    </div>
  );
}

function HandwritingScanVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-2">
      {/* Paper page simulation with handwriting lines */}
      <div className="relative w-44 h-28 rounded-xl bg-white/90 shadow-md border border-slate-200/80 p-3 flex flex-col justify-between overflow-hidden">
        {/* Notebook horizontal ruled lines */}
        <div className="space-y-3.5 pt-1">
          <div className="relative h-2 w-full">
            <svg viewBox="0 0 160 12" className="w-full h-full" fill="none">
              <path d="M4 8 Q 12 1, 22 7 T 42 6 T 62 8 T 85 5 T 110 7 T 135 6 T 155 7" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 border-b border-slate-200" />
          </div>
          <div className="relative h-2 w-full">
            <svg viewBox="0 0 160 12" className="w-full h-full" fill="none">
              <path d="M4 7 Q 16 2, 28 8 T 50 5 T 75 7 T 98 4 T 120 7 T 145 6" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 border-b border-slate-200" />
          </div>
          <div className="relative h-2 w-full">
            <svg viewBox="0 0 160 12" className="w-full h-full" fill="none">
              <path d="M4 8 Q 18 3, 34 8 T 60 6 T 88 8 T 115 5 T 138 7" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 border-b border-slate-200" />
          </div>
        </div>

        {/* Camera-scan viewfinder brackets over the handwriting */}
        <span className="absolute left-2 top-2 h-5 w-5 rounded-tl-md border-l-[3px] border-t-[3px] border-teal-500" />
        <span className="absolute right-2 top-2 h-5 w-5 rounded-tr-md border-r-[3px] border-t-[3px] border-teal-500" />
        <span className="absolute bottom-2 left-2 h-5 w-5 rounded-bl-md border-b-[3px] border-l-[3px] border-teal-500" />
        <span className="absolute bottom-2 right-2 h-5 w-5 rounded-br-md border-b-[3px] border-r-[3px] border-teal-500" />

        {/* Animated laser scanning line */}
        <span className="absolute left-1 right-1 top-1/2 h-0.5 -translate-y-1/2 animate-scan bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_8px_#2dd4bf]" />
      </div>
    </div>
  );
}

export interface ServicesProps {
  onSelectMode?: (mode: 'sign' | 'typing' | 'handwriting') => void;
}

export default function Services({ onSelectMode }: ServicesProps) {
  const cards = [
    {
      id: 'sign',
      badge: 'Most Unique',
      badgeCls: 'bg-indigo-100 text-indigo-700',
      icon: PenLine,
      visual: <SignatureVisual />,
      title: 'Signature & Sign Analysis',
      desc: 'Upload or draw your signature. Our AI studies stroke pressure, slant, speed, and pattern consistency to reveal personality traits and current stress indicators — a technique rooted in graphology and behavioral science.',
      cta: 'Analyze My Signature',
      glow: 'group-hover:shadow-indigo-200',
    },
    {
      id: 'typing',
      badge: 'Real-Time',
      badgeCls: 'bg-violet-100 text-violet-700',
      icon: Keyboard,
      visual: <TypingVisual />,
      title: 'Typing Pattern Analysis',
      desc: 'Just type a short passage naturally. We track your typing rhythm, pause patterns, backspace frequency, and speed variance to detect cognitive load, focus, and stress in real time.',
      cta: 'Start Typing Test',
      glow: 'group-hover:shadow-violet-200',
    },
    {
      id: 'handwriting',
      badge: 'AI Vision',
      badgeCls: 'bg-teal-100 text-teal-700',
      icon: HandwritingScanIcon,
      visual: <HandwritingScanVisual />,
      title: 'Handwriting Image Analysis',
      desc: 'Snap a photo or upload a page of your regular handwriting. Our computer vision model analyzes letter size, spacing, slant, and formation to reveal cognitive and emotional patterns, separate from your signature.',
      cta: 'Scan My Handwriting',
      glow: 'group-hover:shadow-teal-200',
    },
  ];

  const handleCardClick = (id: string) => {
    if (onSelectMode) {
      onSelectMode(id as 'sign' | 'typing' | 'handwriting');
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Choose Your{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
            Analysis Mode
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Three intelligent ways to understand your mind — pick one or run all
          three for a complete picture.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.id}
            id={c.id}
            className={`group flex scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_10px_40px_-15px_rgba(76,29,149,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${c.glow}`}
          >
            <div className="relative h-44 bg-gradient-to-br from-slate-50 via-indigo-50/60 to-teal-50/60 p-5">
              <span className={`absolute left-5 top-5 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${c.badgeCls}`}>
                {c.badge}
              </span>
              {c.visual}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center gap-2.5">
                <c.icon className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              <button
                onClick={() => handleCardClick(c.id)}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-indigo-600 transition-colors hover:text-teal-600 cursor-pointer"
              >
                {c.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
