import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-teal-950/50 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                My Mind Reports
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated Multi-Modal Biometric Portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Current Composite Mind Score
              </span>
              <div className="text-3xl font-extrabold text-teal-300 mt-1">
                {state.mindScore}/100
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">
                Report ID: {state.latestReportId || 'mm_ACTIVE'}
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted & Verified</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Active Input Streams
            </h4>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">✍️</span>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Signature Graphology</h5>
                  <p className="text-xs text-slate-400">
                    {state.signatureResult ? `Confidence: ${state.signatureResult.traits.confidence}% · Slant: ${state.signatureResult.traits.slant}` : 'Not analyzed yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${state.signatureResult ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800 text-slate-400'}`}>
                {state.signatureResult ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⌨️</span>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Typing Rhythm Dynamics</h5>
                  <p className="text-xs text-slate-400">
                    {state.typingResult ? `Speed: ${state.typingResult.typing_speed_wpm} WPM · Focus: ${state.typingResult.focus_score}%` : 'Not analyzed yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${state.typingResult ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800 text-slate-400'}`}>
                {state.typingResult ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Handwriting Morphology</h5>
                  <p className="text-xs text-slate-400">
                    {state.handwritingResult ? `${state.handwritingResult.dominant_pattern} (${state.handwritingResult.traits.formation_consistency}%)` : 'Not analyzed yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${state.handwritingResult ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800 text-slate-400'}`}>
                {state.handwritingResult ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Full PDF Dossier'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
