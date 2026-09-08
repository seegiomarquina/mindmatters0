import React from 'react';
import { X, Download, ShieldCheck, FileText } from 'lucide-react';
import { GlobalAssessmentState } from '../types';

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GlobalAssessmentState;
  onDownloadPdf: () => Promise<void>;
  isGeneratingPdf: boolean;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  isOpen,
  onClose,
  state,
  onDownloadPdf,
  isGeneratingPdf
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B2F]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-sm bg-[#F4ECDD] border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-2xl shadow-[#1B1B2F]/40 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#1B1B2F]/15">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F]">
                Multimodal Behavioral Portfolio
              </h3>
              <p className="text-xs text-[#5B5B70] font-lora italic">
                Aggregated Multi-Modal Biometric Dossier Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#1B1B2F]/60 hover:text-[#1B1B2F] hover:bg-[#1B1B2F]/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-6">
          <div className="p-5 rounded-sm bg-[#E8DFC9] border border-[#8B5E34]/30 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8B5E34]">
                Current Composite Mind Score
              </span>
              <div className="text-4xl font-cinzel font-black text-[#1B1B2F] mt-1">
                {state.mindScore}/100
              </div>
            </div>
            <div className="text-right font-lora">
              <span className="text-xs text-[#5B5B70] font-mono">
                Dossier ID: {state.latestReportId || 'MM-ACTIVE'}
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Validated & Encrypted</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 font-lora">
            <h4 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#8B5E34]">
              Active Input Streams
            </h4>

            <div className="p-4 rounded-sm bg-white/70 border border-[#1B1B2F]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">✍️</span>
                <div>
                  <h5 className="font-cinzel font-bold text-sm text-[#1B1B2F]">Signature Graphology</h5>
                  <p className="text-xs text-[#5B5B70]">
                    {state.signatureResult ? `Confidence: ${state.signatureResult.traits.confidence}% · Slant: ${state.signatureResult.traits.slant}` : 'Not calibrated yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-cinzel font-bold px-2.5 py-1 rounded-sm ${state.signatureResult ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#E8DFC9] text-[#5B5B70]'}`}>
                {state.signatureResult ? 'Calibrated' : 'Pending'}
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/70 border border-[#1B1B2F]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⌨️</span>
                <div>
                  <h5 className="font-cinzel font-bold text-sm text-[#1B1B2F]">Typing Rhythm Dynamics</h5>
                  <p className="text-xs text-[#5B5B70]">
                    {state.typingResult ? `Speed: ${state.typingResult.typing_speed_wpm} WPM · Focus: ${state.typingResult.focus_score}%` : 'Not calibrated yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-cinzel font-bold px-2.5 py-1 rounded-sm ${state.typingResult ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#E8DFC9] text-[#5B5B70]'}`}>
                {state.typingResult ? 'Calibrated' : 'Pending'}
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/70 border border-[#1B1B2F]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <h5 className="font-cinzel font-bold text-sm text-[#1B1B2F]">Handwriting Morphology</h5>
                  <p className="text-xs text-[#5B5B70]">
                    {state.handwritingResult ? `${state.handwritingResult.dominant_pattern} (${state.handwritingResult.traits.formation_consistency}%)` : 'Not calibrated yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-cinzel font-bold px-2.5 py-1 rounded-sm ${state.handwritingResult ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#E8DFC9] text-[#5B5B70]'}`}>
                {state.handwritingResult ? 'Calibrated' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1B1B2F]/15">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 rounded-sm font-cinzel font-bold text-xs tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md shadow-[#A13D3D]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#F4ECDD]" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Full PDF Dossier'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
