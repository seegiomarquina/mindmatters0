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
    <section className="py-20 relative border-t border-[#1B1B2F]/10" id="styles">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <div className="flex flex-wrap items-end justify-between mb-12 gap-4">
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

        {/* Stack of 2, 2, and 2: Responsive 2-column grid across 3 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRADITIONS.map((item, index) => (
            <div
              key={item.id}
              className="style-card antigravity bg-white/90 backdrop-blur-sm border border-[#1B1B2F]/12 rounded-sm p-7 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              data-depth={item.depth}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cinzel text-xs tracking-widest text-[#8B5E34] uppercase font-semibold">
                    Tradition 0{index + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4ECDD] text-[#8B5E34] border border-[#C9A24B]/30">
                    Kinetic Archetype
                  </span>
                </div>
                <div className={`text-4xl sm:text-5xl my-4 text-[#1B1B2F] group-hover:text-[#A13D3D] transition-colors ${item.fontClass}`}>
                  {item.word}
                </div>
              </div>
              <div className="pt-3 border-t border-[#1B1B2F]/8">
                <h4 className="font-cinzel font-bold text-base sm:text-lg text-[#1B1B2F] mb-1 tracking-wide">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#5B5B70] font-lora leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
