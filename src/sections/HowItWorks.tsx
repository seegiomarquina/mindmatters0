import React from 'react';
import { MousePointerClick, PenTool, FileCheck2 } from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    step: 'Step 1',
    title: 'Choose a mode',
    desc: 'Signature, Typing, or Handwriting (or all three)',
  },
  {
    icon: PenTool,
    step: 'Step 2',
    title: 'Give your input',
    desc: 'Draw, type, or snap a photo of handwriting in under 2 minutes',
  },
  {
    icon: FileCheck2,
    step: 'Step 3',
    title: 'Get your report',
    desc: 'AI processes patterns instantly and generates your Unified Mind Report',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-gradient-to-b from-white via-indigo-50/50 to-white py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How MindMatters AI Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
            From physical stroke vectors to neuro-motor typing haptics and handwriting CV tensors.
          </p>
        </div>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connector line */}
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-indigo-200 md:block" />

          {steps.map((s, i) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 text-white shadow-lg shadow-indigo-200">
                <s.icon className="h-8 w-8" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold text-indigo-600 shadow-md">
                  {i + 1}
                </span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-teal-600">{s.step}</p>
              <h3 className="mt-1.5 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
