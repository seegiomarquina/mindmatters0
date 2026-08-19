import React from 'react';

interface CategoryStripProps {
  onSelectCategory: (category: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  targetSection?: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'brain', name: 'Brain', icon: '🧠', targetSection: 'core-services' },
  { id: 'typing', name: 'Typing', icon: '⌨️', targetSection: 'core-services' },
  { id: 'fast_world', name: 'Fast World', icon: '⚡', targetSection: 'how-it-works' },
  { id: 'signature', name: 'Signature', icon: '✍️', targetSection: 'core-services' },
  { id: 'handwriting', name: 'Handwriting', icon: '📝', targetSection: 'core-services' },
  { id: 'stress', name: 'Stress', icon: '🧘', targetSection: 'report-section' },
  { id: 'focus', name: 'Focus', icon: '🎯', targetSection: 'core-services' },
  { id: 'sleep_mind', name: 'Sleep Mind', icon: '🌙', targetSection: 'report-section' },
  { id: 'emotions', name: 'Emotions', icon: '💭', targetSection: 'report-section' },
  { id: 'report', name: 'Report', icon: '📊', targetSection: 'report-section' },
];

export const CategoryStrip: React.FC<CategoryStripProps> = ({ onSelectCategory }) => {
  const handleClick = (item: CategoryItem) => {
    onSelectCategory(item.id);
    if (item.targetSection) {
      const el = document.getElementById(item.targetSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-8 bg-slate-950/50 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400/90">
            Explore Biometric Pillars
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100">
            What's on your mind today?
          </h3>
        </div>

        {/* Horizontally scrollable row with hover:scale-110 */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="flex flex-col items-center gap-2 min-w-[76px] sm:min-w-[88px] group cursor-pointer text-center focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/90 border border-slate-800 group-hover:border-teal-500/60 group-hover:bg-slate-850 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/20 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 ease-out transform">
                <span>{item.icon}</span>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-teal-300 transition-colors whitespace-nowrap">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
