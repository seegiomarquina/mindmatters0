import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  SignatureAnalysisResponse,
  TypingAnalysisResponse,
  HandwritingAnalysisResponse
} from '../types';

interface CoreServicesProps {
  onOpenSignature: () => void;
  onOpenTyping: () => void;
  onOpenHandwriting: () => void;
  signatureResult: SignatureAnalysisResponse | null;
  typingResult: TypingAnalysisResponse | null;
  handwritingResult: HandwritingAnalysisResponse | null;
}

export const CoreServices: React.FC<CoreServicesProps> = ({
  onOpenSignature,
  onOpenTyping,
  onOpenHandwriting,
  signatureResult,
  typingResult,
  handwritingResult,
}) => {
  return (
    <section id="core-services" className="py-20 bg-[#0b1120] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
            Core Behavioral Engines
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 mb-4">
            Three Powerful Lenses into Cognitive State
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Each modality extracts non-invasive behavioral markers calibrated by advanced computer vision and machine learning models.
          </p>
        </div>

        {/* 3 Large Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CARD 1 — Signature & Sign Analysis */}
          <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-teal-500/50 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-950/50">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Most Unique
                </span>
                {signatureResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analyzed
                  </span>
                )}
              </div>

              {/* Distinct Animation 1: Signature Stroke Drawing Loop */}
              <div className="w-full h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-4 mb-6 overflow-hidden relative group-hover:border-teal-500/30 transition-colors">
                <svg className="w-full h-full" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 70 C 60 10, 80 90, 110 35 C 130 5, 140 85, 170 45 C 190 20, 210 60, 240 30 C 260 10, 280 80, 290 50"
                    stroke="#14b8a6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-signature-loop"
                  />
                  <path
                    d="M40 85 L 260 82"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                </svg>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-teal-400/70">
                  stroke-vector telemetry
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-teal-300 transition-colors">
                Signature & Sign Analysis
              </h3>

              <p className="text-sm text-slate-300/80 leading-relaxed mb-6">
                Upload or draw your signature. Our AI studies stroke pressure, slant, speed, and pattern consistency to reveal personality traits and current stress indicators — a technique rooted in graphology and behavioral science.
              </p>
            </div>

            <div>
              {signatureResult && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-teal-500/30 mb-4">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Confidence Index:</span>
                    <span className="font-bold text-teal-300">{signatureResult.traits.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Pressure Level:</span>
                    <span className="font-bold text-cyan-300 capitalize">{signatureResult.traits.pressure_level}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Slant Orientation:</span>
                    <span className="font-bold text-indigo-300 capitalize">{signatureResult.traits.slant}</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenSignature}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{signatureResult ? 'Re-Analyze Signature' : 'Analyze My Signature'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2 — Typing Pattern Analysis */}
          <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-950/50">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Real-Time
                </span>
                {typingResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analyzed
                  </span>
                )}
              </div>

              {/* Distinct Animation 2: Live Keystroke Waveform Bars */}
              <div className="w-full h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2.5 p-4 mb-6 overflow-hidden relative group-hover:border-cyan-500/30 transition-colors">
                <div className="w-2.5 h-16 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full wave-bar-1 origin-bottom" />
                <div className="w-2.5 h-20 bg-gradient-to-t from-cyan-500 to-sky-400 rounded-full wave-bar-2 origin-bottom" />
                <div className="w-2.5 h-14 bg-gradient-to-t from-sky-500 to-indigo-400 rounded-full wave-bar-3 origin-bottom" />
                <div className="w-2.5 h-22 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full wave-bar-4 origin-bottom" />
                <div className="w-2.5 h-12 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full wave-bar-5 origin-bottom" />
                <div className="w-2.5 h-18 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full wave-bar-6 origin-bottom" />
                <div className="w-2.5 h-16 bg-gradient-to-t from-teal-400 to-emerald-400 rounded-full wave-bar-7 origin-bottom" />
                
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-cyan-400/70">
                  dwell-flight audio visualizer
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-300 transition-colors">
                Typing Pattern Analysis
              </h3>

              <p className="text-sm text-slate-300/80 leading-relaxed mb-6">
                Just type a short passage naturally. We track your typing rhythm, pause patterns, backspace frequency, and speed variance to detect cognitive load, focus, and stress in real time.
              </p>
            </div>

            <div>
              {typingResult && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 mb-4">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Typing Speed:</span>
                    <span className="font-bold text-cyan-300">{typingResult.typing_speed_wpm} WPM</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Focus Score:</span>
                    <span className="font-bold text-teal-300">{typingResult.focus_score}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Stress Level:</span>
                    <span className="font-bold text-indigo-300">{typingResult.stress_score}%</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenTyping}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-md shadow-cyan-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{typingResult ? 'Retake Typing Test' : 'Start Typing Test'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3 — Handwriting Image Analysis (NOT A FACE!) */}
          <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-purple-500/50 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-950/50">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Vision
                </span>
                {handwritingResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analyzed
                  </span>
                )}
              </div>

              {/* Distinct Animation 3: Camera-scan frame over handwritten lines with sweeping scan line */}
              <div className="w-full h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-4 mb-6 overflow-hidden relative group-hover:border-purple-500/30 transition-colors">
                <div className="w-3/4 space-y-2 opacity-50">
                  <div className="h-1.5 bg-slate-600 rounded-full w-full" />
                  <div className="h-1.5 bg-slate-600 rounded-full w-4/5" />
                  <div className="h-1.5 bg-slate-600 rounded-full w-11/12" />
                  <div className="h-1.5 bg-slate-600 rounded-full w-3/4" />
                </div>

                <div className="absolute inset-4 border border-purple-500/30 pointer-events-none rounded">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-purple-400 animate-corner-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-purple-400 animate-corner-pulse" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400 animate-corner-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-purple-400 animate-corner-pulse" />
                </div>

                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_8px_#c084fc] animate-scan-sweep" />

                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-purple-400/70">
                  document-cv scan
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-300 transition-colors">
                Handwriting Image Analysis
              </h3>

              <p className="text-sm text-slate-300/80 leading-relaxed mb-6">
                Snap a photo or upload a page of your regular handwriting — a diary entry, notes, anything. Our computer vision model analyzes letter size, spacing, slant, and formation to reveal cognitive and emotional patterns, separate from your signature.
              </p>
            </div>

            <div>
              {handwritingResult && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30 mb-4">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Letter Size:</span>
                    <span className="font-bold text-purple-300 capitalize">{handwritingResult.traits.letter_size}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Line Spacing:</span>
                    <span className="font-bold text-cyan-300 capitalize">{handwritingResult.traits.line_spacing}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Dominant Pattern:</span>
                    <span className="font-bold text-teal-300 capitalize truncate max-w-[140px]">{handwritingResult.dominant_pattern}</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenHandwriting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-300 hover:to-indigo-300 shadow-md shadow-purple-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{handwritingResult ? 'Re-Scan Handwriting' : 'Scan My Handwriting'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
