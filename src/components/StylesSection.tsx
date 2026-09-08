import React from 'react';

interface StyleItem {
  id: string;
  word: string;
  name: string;
  description: string;
  fontClass: string;
  depth: number;
}

const TRADITIONS: StyleItem[] = [
  {
    id: 'copperplate',
    word: 'Elegance',
    name: 'Copperplate',
    description: 'Disciplined loops and even pressure.',
    fontClass: 'font-cormorant italic',
    depth: 0.02
  },
  {
    id: 'blackletter',
    word: 'Order',
    name: 'Blackletter',
    description: 'Dense, upright, and deliberate structure.',
    fontClass: 'font-blackletter',
    depth: 0.03
  },
  {
    id: 'brush',
    word: 'Warmth',
    name: 'Modern Brush',
    description: 'Loose and expressive strokes.',
    fontClass: 'font-sacramento',
    depth: 0.02
  },
  {
    id: 'spencerian',
    word: 'Grace',
    name: 'Spencerian',
    description: 'Flowing ovals and ornamental shades.',
    fontClass: 'font-great-vibes',
    depth: 0.035
  },
  {
    id: 'print',
    word: 'Ease',
    name: "Kid's Print",
    description: 'Rounded, baseline-shifting dynamics.',
    fontClass: 'font-caveat',
    depth: 0.02
  },
  {
    id: 'forensic',
    word: 'Evidence',
    name: 'Forensic Hand',
    description: 'Measured stroke metrics for authorship.',
    fontClass: 'font-special-elite text-2xl',
    depth: 0.03
  }
];

export const StylesSection: React.FC = () => {
  return (
    <section className="py-24 relative border-t border-[#1B1B2F]/10" id="styles">
      <div className="flex flex-wrap items-end justify-between px-6 sm:px-12 mb-10 gap-4">
        <div>
          <span className="eyebrow">Traditions</span>
          <h3 className="font-cinzel-dec font-bold text-2xl sm:text-4xl text-[#1B1B2F] tracking-wide mt-2">
            Six traditions, six temperaments
          </h3>
        </div>
        <p className="text-[#5B5B70] text-sm sm:text-base max-w-md font-lora">
          Every school of handwriting carries its own psychology and kinetic footprint.
        </p>
      </div>

      <div className="flex gap-6 overflow-x-auto px-6 sm:px-12 pb-8 pt-2 no-scrollbar scroll-smooth">
        {TRADITIONS.map((item) => (
          <div
            key={item.id}
            className="style-card antigravity flex-shrink-0 w-64 bg-white/85 backdrop-blur-sm border border-[#1B1B2F]/10 rounded-sm p-7 shadow-sm hover:shadow-xl hover:-translate-y-2.5 transition-all duration-300 group"
            data-depth={item.depth}
          >
            <div className={`text-4xl mb-4 text-[#1B1B2F] group-hover:text-[#A13D3D] transition-colors ${item.fontClass}`}>
              {item.word}
            </div>
            <h4 className="font-cinzel font-bold text-base text-[#1B1B2F] mb-1">
              {item.name}
            </h4>
            <p className="text-xs text-[#5B5B70] font-lora leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
