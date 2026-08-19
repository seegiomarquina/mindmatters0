import React, { useEffect, useState } from 'react';
import { Brain, Menu, X, Sparkles, Activity } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';

const links = [
  { label: 'Home', id: 'home' },
  { label: 'Sign Analysis', id: 'sign' },
  { label: 'Typing Analysis', id: 'typing' },
  { label: 'Handwriting Analysis', id: 'handwriting' },
  { label: 'My Reports', id: 'report' },
  { label: 'Remediation', id: 'remediation' },
  { label: 'About', id: 'about' },
];

export interface NavbarProps {
  onSelectLink?: (id: string) => void;
  onStartAnalysis?: () => void;
  isAiConnected?: boolean;
}

export default function Navbar({ onSelectLink, onStartAnalysis, isAiConnected = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    if (onSelectLink) {
      onSelectLink(id);
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-lg shadow-[0_4px_24px_-8px_rgba(76,29,149,0.18)]'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 text-white shadow-md shadow-indigo-200">
            <Brain className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              MindMatters <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
              {isAiConnected ? '● AI Engine Online' : '● Tensor Heuristics Active'}
            </span>
          </div>
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNav(l.id)}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 cursor-pointer"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onStartAnalysis) onStartAnalysis();
              else handleNav('sign');
            }}
            className="hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition-all hover:shadow-xl hover:shadow-indigo-400/50 hover:brightness-110 sm:flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Start Free Analysis</span>
          </button>
          <button
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  handleNav(l.id);
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                if (onStartAnalysis) onStartAnalysis();
                else handleNav('sign');
                setOpen(false);
              }}
              className="mt-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Free Analysis</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
