import React from 'react';
import { Layers, Sliders, FileCheck2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'I',
      title: 'Select Modality',
      description: 'Choose one or more biometric streams: signature strokes, live keystroke timing, or handwritten notebook scans.',
      icon: <Layers className="w-5 h-5 text-[#8B5E34]" />
    },
    {
      step: 'II',
      title: 'Submit Behavioral Stream',
      description: 'Draw directly on the digital parchment, type the classical passage, or upload a photo of your notebook.',
      icon: <Sliders className="w-5 h-5 text-[#8B5E34]" />
    },
    {
      step: 'III',
      title: 'Receive Synthesized Dossier',
      description: 'Our multimodal engine fuses all signals into a composite Mind Score and downloadable clinical vector PDF.',
      icon: <FileCheck2 className="w-5 h-5 text-[#A13D3D]" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative border-t border-[#1B1B2F]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">
            Methodology
          </span>
          <h2 className="font-cinzel-dec font-bold text-3xl sm:text-4xl text-[#1B1B2F] mt-3 mb-3 tracking-wide">
            How It Works
          </h2>
          <p className="text-[#5B5B70] text-sm sm:text-base font-lora">
            From raw behavioral kinetics to multimodal synthesis in three disciplined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative rounded-sm bg-white/75 backdrop-blur-sm border border-[#1B1B2F]/15 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-sm bg-[#E8DFC9] border border-[#8B5E34]/30 flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-cinzel font-black text-[#8B5E34]/60">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B5B70] font-lora leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#F4ECDD] border border-[#1B1B2F]/20 flex items-center justify-center text-[#8B5E34] shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
