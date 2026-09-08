import React from 'react';
import { ArrowRight, CheckCircle2, Feather, Keyboard, ScanLine } from 'lucide-react';
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
    <section id="core-services" className="py-24 relative border-t border-[#1B1B2F]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">
            Core Behavioral Engines
          </span>
          <h2 className="font-cinzel-dec font-bold text-3xl sm:text-5xl text-[#1B1B2F] mt-3 mb-4 tracking-wide">
            Three Lenses into Cognitive State
          </h2>
          <p className="text-[#5B5B70] text-sm sm:text-base font-lora">
            Each modality extracts non-invasive behavioral markers calibrated by advanced computer vision and machine learning models.
          </p>
        </div>

        {/* 3 Large Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CARD 1 — Signature & Sign Analysis */}
          <div className="group relative rounded-sm bg-white/80 backdrop-blur-sm border border-[#1B1B2F]/15 hover:border-[#8B5E34] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-sm text-xs font-cinzel font-bold bg-[#E8DFC9] text-[#8B5E34] border border-[#8B5E34]/30">
                  Graphological
                </span>
                {signatureResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Calibrated
                  </span>
                )}
              </div>

              {/* Distinct Animation 1: Signature Stroke Drawing Loop */}
              <div className="w-full h-36 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 flex items-center justify-center p-4 mb-6 overflow-hidden relative shadow-inner">
                <svg className="w-full h-full" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 70 C 60 10, 80 90, 110 35 C 130 5, 140 85, 170 45 C 190 20, 210 60, 240 30 C 260 10, 280 80, 290 50"
                    stroke="#1B1B2F"
                    strokeWidth="3.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-signature-loop"
                  />
                  <path
                    d="M40 85 L 260 82"
                    stroke="#C9A24B"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                </svg>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#8B5E34]">
                  stroke-vector telemetry
                </div>
              </div>

              <h3 className="font-cinzel font-bold text-xl text-[#1B1B2F] mb-3 group-hover:text-[#A13D3D] transition-colors">
                Signature Graphology
              </h3>

              <p className="text-sm text-[#5B5B70] font-lora leading-relaxed mb-6">
                Draw or upload your signature. Our engine analyzes stroke pressure, slant moment, and pattern consistency to reveal behavioral equilibrium and stress indicators.
              </p>
            </div>

            <div>
              {signatureResult && (
                <div className="p-3.5 rounded-sm bg-[#E8DFC9]/70 border border-[#8B5E34]/30 mb-4 font-lora">
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Confidence Index:</span>
                    <span className="font-bold text-[#8B5E34]">{signatureResult.traits.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Pressure Level:</span>
                    <span className="font-bold capitalize">{signatureResult.traits.pressure_level}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F]">
                    <span>Slant Moment:</span>
                    <span className="font-bold capitalize">{signatureResult.traits.slant}</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenSignature}
                className="w-full py-3 px-4 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#1B1B2F] hover:bg-[#8B5E34] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{signatureResult ? 'Re-Analyze Signature' : 'Analyze Signature'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2 — Typing Pattern Analysis */}
          <div className="group relative rounded-sm bg-white/80 backdrop-blur-sm border border-[#1B1B2F]/15 hover:border-[#8B5E34] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-sm text-xs font-cinzel font-bold bg-[#E8DFC9] text-[#8B5E34] border border-[#8B5E34]/30">
                  Cadence Dynamics
                </span>
                {typingResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Calibrated
                  </span>
                )}
              </div>

              {/* Distinct Animation 2: Live Keystroke Waveform Bars */}
              <div className="w-full h-36 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 flex items-center justify-center gap-2.5 p-4 mb-6 overflow-hidden relative shadow-inner">
                <div className="w-2.5 h-16 bg-[#8B5E34] rounded-full wave-bar-1 origin-bottom" />
                <div className="w-2.5 h-20 bg-[#C9A24B] rounded-full wave-bar-2 origin-bottom" />
                <div className="w-2.5 h-14 bg-[#1B1B2F] rounded-full wave-bar-3 origin-bottom" />
                <div className="w-2.5 h-22 bg-[#A13D3D] rounded-full wave-bar-4 origin-bottom" />
                <div className="w-2.5 h-12 bg-[#8B5E34] rounded-full wave-bar-5 origin-bottom" />
                <div className="w-2.5 h-18 bg-[#C9A24B] rounded-full wave-bar-6 origin-bottom" />
                <div className="w-2.5 h-16 bg-[#1B1B2F] rounded-full wave-bar-7 origin-bottom" />
                
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#8B5E34]">
                  dwell-flight audio visualizer
                </div>
              </div>

              <h3 className="font-cinzel font-bold text-xl text-[#1B1B2F] mb-3 group-hover:text-[#A13D3D] transition-colors">
                Typing Rhythm Dynamics
              </h3>

              <p className="text-sm text-[#5B5B70] font-lora leading-relaxed mb-6">
                Type a short passage naturally. We track your dwell latency, flight interval entropy, and cadence stability to assess real-time cognitive focus.
              </p>
            </div>

            <div>
              {typingResult && (
                <div className="p-3.5 rounded-sm bg-[#E8DFC9]/70 border border-[#8B5E34]/30 mb-4 font-lora">
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Typing Speed:</span>
                    <span className="font-bold text-[#8B5E34]">{typingResult.typing_speed_wpm} WPM</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Focus Score:</span>
                    <span className="font-bold">{typingResult.focus_score}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F]">
                    <span>Stress Level:</span>
                    <span className="font-bold text-[#A13D3D]">{typingResult.stress_score}%</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenTyping}
                className="w-full py-3 px-4 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#1B1B2F] hover:bg-[#8B5E34] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{typingResult ? 'Retake Typing Test' : 'Calibrate Keystrokes'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3 — Handwriting Image Analysis */}
          <div className="group relative rounded-sm bg-white/80 backdrop-blur-sm border border-[#1B1B2F]/15 hover:border-[#8B5E34] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-sm text-xs font-cinzel font-bold bg-[#E8DFC9] text-[#8B5E34] border border-[#8B5E34]/30">
                  OpenCV Vision
                </span>
                {handwritingResult && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Calibrated
                  </span>
                )}
              </div>

              {/* Distinct Animation 3: Camera-scan frame over handwritten lines with sweeping scan line */}
              <div className="w-full h-36 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 flex items-center justify-center p-4 mb-6 overflow-hidden relative shadow-inner">
                <div className="w-3/4 space-y-2.5 opacity-40">
                  <div className="h-1.5 bg-[#1B1B2F] rounded-full w-full" />
                  <div className="h-1.5 bg-[#1B1B2F] rounded-full w-4/5" />
                  <div className="h-1.5 bg-[#1B1B2F] rounded-full w-11/12" />
                  <div className="h-1.5 bg-[#1B1B2F] rounded-full w-3/4" />
                </div>

                <div className="absolute inset-4 border border-[#8B5E34]/30 pointer-events-none rounded-sm">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#A13D3D]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#A13D3D]" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#A13D3D]" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#A13D3D]" />
                </div>

                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#A13D3D] to-transparent shadow-[0_0_8px_#A13D3D] animate-scan-sweep" />

                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#8B5E34]">
                  document-cv scan
                </div>
              </div>

              <h3 className="font-cinzel font-bold text-xl text-[#1B1B2F] mb-3 group-hover:text-[#A13D3D] transition-colors">
                Handwriting Morphology
              </h3>

              <p className="text-sm text-[#5B5B70] font-lora leading-relaxed mb-6">
                Upload a handwritten photo or notes page. Our computer vision pipeline extracts 10+ measurable metrics (slant, line spacing, density, pressure proxy) with persistent record storage.
              </p>
            </div>

            <div>
              {handwritingResult && (
                <div className="p-3.5 rounded-sm bg-[#E8DFC9]/70 border border-[#8B5E34]/30 mb-4 font-lora">
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Letter Size:</span>
                    <span className="font-bold capitalize">{handwritingResult.traits.letter_size}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F] mb-1">
                    <span>Line Spacing:</span>
                    <span className="font-bold capitalize">{handwritingResult.traits.line_spacing}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B2F]">
                    <span>Dominant Pattern:</span>
                    <span className="font-bold text-[#8B5E34] capitalize truncate max-w-[140px]">{handwritingResult.dominant_pattern}</span>
                  </div>
                </div>
              )}

              <button
                onClick={onOpenHandwriting}
                className="w-full py-3 px-4 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{handwritingResult ? 'Re-Scan Document' : 'Scan Handwriting'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
