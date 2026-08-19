import { Brain, Github } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';

const links = [
  { label: 'About', id: 'about' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Privacy', id: 'about' },
  { label: 'Contact', id: 'about' },
];

export default function Footer() {
  return (
    <footer id="about" className="scroll-mt-24 border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <button onClick={() => scrollToId('home')} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 text-white">
              <Brain className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-white">
              MindMatters <span className="text-teal-400">AI</span>
            </span>
          </button>

          <p className="text-sm text-slate-400">
            Decoding minds, one pattern at a time.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollToId(l.id)}
                className="text-sm text-slate-400 transition-colors hover:text-teal-400"
              >
                {l.label}
              </button>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-teal-400"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>

          <p className="max-w-md text-xs leading-relaxed text-slate-600">
            Final Year Data Science Project — for academic/research purposes.
            Not a medical or diagnostic tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
