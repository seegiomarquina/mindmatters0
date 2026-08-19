import React from 'react';
import { Layers, Sliders, FileCheck2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose a mode',
      description: 'Select one or more biometric streams: your signature stroke, live keyboard cadence, or regular handwritten notes.',
      icon: <Layers className="w-6 h-6 text-teal-400" />,
      accent: 'from-teal-500/20 to-teal-500/5',
      border: 'border-teal-500/30'
    },
    {
      step: '02',
      title: 'Give your input',
      description: 'Draw on the digital canvas, type a short passage naturally, or upload a photo of your notebook page.',
      icon: <Sliders className="w-6 h-6 text-cyan-400" />,
      accent: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/30'
    },
    {
      step: '03',
      title: 'Get your report',
      description: 'Our multi-modal neural and graphological engine aggregates all signals into a unified, downloadable Mind Report with actionable insights.',
      icon: <FileCheck2 className="w-6 h-6 text-indigo-400" />,
      accent: 'from-indigo-500/20 to-indigo-500/5',
      border: 'border-indigo-500/30'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950/60 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/50 px-3 py-1 rounded-full">
            Streamlined Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 mb-3">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From initial behavioral input to comprehensive neural synthesis in three frictionless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className={`relative rounded-2xl bg-gradient-to-b ${item.accent} border ${item.border} p-8 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-600">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
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
