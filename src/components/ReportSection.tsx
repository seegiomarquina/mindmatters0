import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  FileCheck,
  Activity,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  SignatureAnalysisResponse,
  TypingAnalysisResponse,
  HandwritingAnalysisResponse
} from '../types';

interface ReportSectionProps {
  signatureResult: SignatureAnalysisResponse | null;
  typingResult: TypingAnalysisResponse | null;
  handwritingResult: HandwritingAnalysisResponse | null;
  mindScore: number;
  onDownloadReport: () => Promise<void>;
  isGeneratingPdf: boolean;
  latestReportId: string | null;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  signatureResult,
  typingResult,
  handwritingResult,
  mindScore,
  onDownloadReport,
  isGeneratingPdf,
  latestReportId
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let start = 0;
    const end = mindScore || 74;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(Math.round(end));
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [mindScore]);

  const radarData = [
    {
      subject: 'Stress Control',
      value: typingResult ? 100 - typingResult.stress_score : (signatureResult ? 100 - signatureResult.traits.stress_indicator : 65),
      fullMark: 100
    },
    {
      subject: 'Focus Cadence',
      value: typingResult ? typingResult.focus_score : 78,
      fullMark: 100
    },
    {
      subject: 'Confidence',
      value: signatureResult ? signatureResult.traits.confidence : 80,
      fullMark: 100
    },
    {
      subject: 'Emotional Stability',
      value: handwritingResult ? handwritingResult.traits.formation_consistency : 72,
      fullMark: 100
    },
    {
      subject: 'Consistency',
      value: signatureResult ? signatureResult.traits.consistency : 68,
      fullMark: 100
    }
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreTier = (score: number) => {
    if (score >= 75) return { label: 'Optimal / High Clarity', color: 'text-emerald-400', stroke: '#10b981' };
    if (score >= 50) return { label: 'Balanced / Moderate Load', color: 'text-amber-400', stroke: '#f59e0b' };
    return { label: 'Elevated Cognitive Strain', color: 'text-rose-400', stroke: '#ef4444' };
  };

  const tier = getScoreTier(animatedScore);

  return (
    <section id="report-section" className="py-24 bg-gradient-to-b from-[#0b1120] via-slate-950 to-[#0b1120] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 border border-teal-800/60 px-3.5 py-1.5 rounded-full">
            Multi-Modal Intelligence Dossier
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 mt-4 mb-4 tracking-tight">
            Your Mind, Decoded. One Report. Zero Guesswork.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every analysis you run — Signature, Typing, and Handwriting — is combined into a single, beautifully designed Mind Report. Visual charts, trait breakdowns, stress score, and personalized recommendations — all in one PDF.
          </p>
        </div>

        {/* Report Preview Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl shadow-teal-950/40 relative overflow-hidden backdrop-blur-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                🧠
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  MindMatters Biometric Dossier
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Report ID: {latestReportId || 'mm_ACTIVE'} · Multi-Signal Synthesis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-teal-400">
              <Activity className="w-3.5 h-3.5 animate-pulse text-teal-400" />
              <span>Real-Time Biometric Calibration</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
            
            {/* Mind Score Gauge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center relative">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Overall Mind Score
              </span>

              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke={tier.stroke}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * (animatedScore / 100))}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-extrabold ${tier.color} tracking-tight`}>
                    {animatedScore}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ 100</span>
                </div>
              </div>

              <div className={`text-sm font-bold ${tier.color} mt-1`}>
                {tier.label}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                Weighted combination of graphology, keystroke dynamics, and spatial morphology.
              </p>
            </div>

            {/* Radar Chart */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                5-Trait Cognitive Profile
              </span>
              <div className="w-full h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 8 }} />
                    <Radar
                      name="Cognitive Traits"
                      dataKey="value"
                      stroke="#14b8a6"
                      fill="#0ea5e9"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Mini Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-200">✍️ Signature</span>
                <span className="text-teal-400 font-mono font-bold">
                  {signatureResult ? `${signatureResult.traits.confidence}% Conf.` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {signatureResult ? `Slant: ${signatureResult.traits.slant} · Pressure: ${signatureResult.traits.pressure_level}` : 'Take test to calibrate baseline stroke metrics.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-200">⌨️ Typing Graph</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {typingResult ? `${typingResult.typing_speed_wpm} WPM` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {typingResult ? `Focus: ${typingResult.focus_score}% · Stress: ${typingResult.stress_score}%` : 'Take test to evaluate keystroke cadence.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-200">📝 Handwriting</span>
                <span className="text-purple-400 font-mono font-bold">
                  {handwritingResult ? `${handwritingResult.traits.formation_consistency}% Form.` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {handwritingResult ? `${handwritingResult.dominant_pattern}` : 'Scan document to classify writing morphology.'}
              </p>
            </div>
          </div>

        </div>

        {/* Sticky / Floating Box at Bottom */}
        <div className="max-w-3xl mx-auto mt-10 p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-teal-500/40 shadow-2xl shadow-teal-950/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-100">
                📄 Your Mind Report is ready
              </h4>
              <p className="text-xs text-slate-400">
                Generate the high-resolution vector PDF with clinical breakdowns & tailored recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
            </button>

            <button
              onClick={onDownloadReport}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
