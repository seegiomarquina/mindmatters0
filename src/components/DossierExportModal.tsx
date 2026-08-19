import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { BiometricReport, StrokeMetrics, KeystrokeMetrics } from '../types';

interface DossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: BiometricReport;
  strokeMetrics: StrokeMetrics;
  keystrokeMetrics: KeystrokeMetrics;
}

export const DossierExportModal: React.FC<DossierExportModalProps> = ({
  isOpen,
  onClose,
  report,
  strokeMetrics,
  keystrokeMetrics,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `MM-${Math.floor(100000 + Math.random() * 900000)}-BIO`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0A0B] border border-[#1F1F24] rounded-3xl p-6 lg:p-8 shadow-2xl my-8 flex flex-col gap-6 text-white">
        {/* Top bar controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F24] print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/25">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Executive Behavioral & Graphotherapy Dossier</h2>
              <p className="text-xs text-slate-400">Clinical-Grade Biometric Certification Dossier</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#00D1FF] hover:bg-[#33DCFF] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all font-mono"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#141418] hover:bg-[#1C1C22] text-slate-400 hover:text-white border border-[#1F1F24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          ref={printRef}
          className="bg-[#0F0F11] border border-[#00D1FF]/30 rounded-2xl p-6 lg:p-8 shadow-inner flex flex-col gap-6 text-slate-200"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F1F24] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#141418] border border-[#00D1FF]/40 flex items-center justify-center text-[#00D1FF] font-black text-2xl shadow-lg">
                I
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight font-mono">
                  INKMIND <span className="text-[#00D1FF]">AI</span>
                </div>
                <div className="text-[11px] text-[#00FF9D] font-mono uppercase tracking-wider">
                  Behavioral Intelligence & Graphotherapy Institute
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <div>Dossier ID: <span className="text-white font-bold">{certificateId}</span></div>
              <div>Issued: <span className="text-white">{new Date().toLocaleDateString()}</span></div>
              <div>Status: <span className="text-[#00FF9D] font-bold">VERIFIED AUTHENTIC</span></div>
            </div>
          </div>

          {/* Subject & Subconscious Archetype */}
          <div className="p-5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] flex flex-col gap-2">
            <div className="text-xs uppercase font-bold text-[#00D1FF] tracking-wider font-mono">
              Diagnosed Behavioral Archetype:
            </div>
            <div className="text-2xl font-black text-white">
              {report.subconsciousArchetype}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.archetypeDescription}
            </p>
          </div>

          {/* Cognitive Indices Scorecard */}
          <div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 font-mono">
              Multimodal Cognitive Vector Scorecard:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
                <div className="text-[10px] text-slate-400">Executive Control</div>
                <div className="text-xl font-black text-white">{report.cognitiveIndices.executiveControl}/100</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
                <div className="text-[10px] text-slate-400">Ambition Vector (Slant)</div>
                <div className="text-xl font-black text-[#00FF9D]">{report.cognitiveIndices.ambitionSlantVector}/100</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
                <div className="text-[10px] text-slate-400">Cognitive Flight Speed</div>
                <div className="text-xl font-black text-[#FFB800]">{report.cognitiveIndices.cognitiveSpeed}/100</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
                <div className="text-[10px] text-slate-400">Subconscious Friction</div>
                <div className="text-xl font-black text-[#FF2E63]">{report.cognitiveIndices.subconsciousStressIndex}/100</div>
              </div>
            </div>
          </div>

          {/* Telemetry Vectors Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
              <div className="text-xs font-bold text-white mb-2 font-mono">Physical Stroke Vectors:</div>
              <div className="text-xs font-mono text-slate-300 flex flex-col gap-1">
                <div>Slant Angle θ: <span className="text-white font-bold">{strokeMetrics.slantAngleDeg}°</span></div>
                <div>Baseline Gradient: <span className="text-white font-bold">{strokeMetrics.baselineSlopeDeg}°</span></div>
                <div>Kinetic Density: <span className="text-white font-bold">{strokeMetrics.avgPressure.toFixed(2)}</span></div>
                <div>Curvature Ratio: <span className="text-white font-bold">{strokeMetrics.curvatureIndex.toFixed(2)}x</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
              <div className="text-xs font-bold text-white mb-2 font-mono">Neuro-Motor Typing Telemetry:</div>
              <div className="text-xs font-mono text-slate-300 flex flex-col gap-1">
                <div>Mean Dwell Time: <span className="text-white font-bold">{keystrokeMetrics.avgDwellTimeMs} ms</span></div>
                <div>Flight Latency: <span className="text-white font-bold">{keystrokeMetrics.avgFlightTimeMs} ms</span></div>
                <div>Jitter Variance: <span className="text-white font-bold">{keystrokeMetrics.jitterVariance} ms²</span></div>
                <div>Cadence Entropy: <span className="text-white font-bold">{keystrokeMetrics.cadenceEntropy} bits</span></div>
              </div>
            </div>
          </div>

          {/* Graphotherapy Prescription */}
          <div className="p-4 rounded-xl bg-[#141418] border border-[#00D1FF]/30 flex flex-col gap-2">
            <div className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider font-mono">
              Prescribed Graphotherapy Remediation:
            </div>
            <div className="text-xs text-slate-200 leading-relaxed font-mono">
              {report.graphotherapyRemediation.coreObjective}
            </div>
          </div>

          {/* Footer Signature & Seal */}
          <div className="pt-6 border-t border-[#1F1F24] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div>Verified by Inkmind AI Biometric Engine v2.8</div>
            <div className="flex items-center gap-1 text-[#00FF9D] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cryptographically Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
