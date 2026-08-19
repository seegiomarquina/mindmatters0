import React from 'react';
import {
  Brain, Keyboard, Zap, PenLine, HeartPulse, Target, MoonStar, Smile, FileText,
} from 'lucide-react';
import { HandwritingScanIcon } from './Services';
import { scrollToId } from '@/lib/scroll';

export interface CategoryStripProps {
  onSelectItem?: (target: string) => void;
}

const items = [
  { icon: Brain, label: 'Brain', target: 'home', bg: 'bg-indigo-100', fg: 'text-indigo-600' },
  { icon: Keyboard, label: 'Typing', target: 'typing', bg: 'bg-violet-100', fg: 'text-violet-600' },
  { icon: Zap, label: 'Fast World', target: 'how-it-works', bg: 'bg-amber-100', fg: 'text-amber-600' },
  { icon: PenLine, label: 'Signature', target: 'sign', bg: 'bg-teal-100', fg: 'text-teal-600' },
  { icon: HandwritingScanIcon, label: 'Handwriting', target: 'handwriting', bg: 'bg-sky-100', fg: 'text-sky-600' },
  { icon: HeartPulse, label: 'Stress', target: 'report', bg: 'bg-rose-100', fg: 'text-rose-500' },
  { icon: Target, label: 'Focus', target: 'report', bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { icon: MoonStar, label: 'Sleep Mind', target: 'report', bg: 'bg-purple-100', fg: 'text-purple-600' },
  { icon: Smile, label: 'Emotions', target: 'handwriting', bg: 'bg-cyan-100', fg: 'text-cyan-600' },
  { icon: FileText, label: 'Report', target: 'report', bg: 'bg-blue-100', fg: 'text-blue-600' },
];

export default function CategoryStrip({ onSelectItem }: CategoryStripProps) {
  const handleClick = (target: string) => {
    if (onSelectItem) {
      onSelectItem(target);
    } else {
      scrollToId(target);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-4 pt-6 lg:px-8">
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        What's on your mind today?
      </p>
      <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-start lg:justify-center">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => handleClick(it.target)}
            className="group flex w-20 shrink-0 flex-col items-center gap-2.5 cursor-pointer"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full ${it.bg} ${it.fg} shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
            >
              <it.icon className="h-7 w-7" />
            </span>
            <span className="text-xs font-semibold text-slate-600 transition-colors group-hover:text-indigo-600">
              {it.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
