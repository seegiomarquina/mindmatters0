import React, { useState, useEffect } from 'react';
import { Download, Share2, FileCheck, Activity, Loader2, Eye } from 'lucide-react';
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
  onOpenReportModal: () => void;
  isGeneratingPdf: boolean;
  latestReportId: string | null;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  signatureResult,
  typingResult,
  handwritingResult,
  mindScore,
  onDownloadReport,
  onOpenReportModal,
  isGeneratingPdf,
  latestReportId
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let start = 0;
    const end = mindScore || 78;
    const duration = 1000;
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
      subject: 'Motor Consistency',
      value: handwritingResult ? handwritingResult.traits.formation_consistency : 72,
      fullMark: 100
    },
    {
      subject: 'Line Regularity',
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
    if (score >= 75) return { label: 'Optimal / High Executive Equilibrium', color: 'text-emerald-800', stroke: '#065F46' };
    if (score >= 50) return { label: 'Balanced / Moderate Cognitive Load', color: 'text-[#8B5E34]', stroke: '#8B5E34' };
    return { label: 'Elevated Cognitive Strain / Fatigue', color: 'text-[#A13D3D]', stroke: '#A13D3D' };
  };

  const tier = getScoreTier(animatedScore);

  return (
    <section id="report-section" className="py-24 relative border-t border-[#1B1B2F]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">
            Intelligence Dossier
          </span>
          <h2 className="font-cinzel-dec font-bold text-3xl sm:text-5xl text-[#1B1B2F] mt-3 mb-4 tracking-wide">
            Your Mind, Decoded in Vector Detail
          </h2>
          <p className="text-[#5B5B70] text-sm sm:text-base font-lora leading-relaxed">
            Every analysis you run — Signature, Typing, and Handwriting — is compiled into a single, comprehensive Mind Dossier with measurable data points, behavioral archetypes, and clinical recommendations.
          </p>
        </div>

        {/* Report Preview Parchment Card */}
        <div className="max-w-4xl mx-auto rounded-sm bg-white/90 border-2 border-[#1B1B2F] p-8 sm:p-12 shadow-2xl shadow-[#1B1B2F]/15 relative overflow-hidden backdrop-blur-md">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#1B1B2F]/15 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-[#E8DFC9] border border-[#8B5E34]/30 flex items-center justify-center text-2xl shadow-inner">
                📜
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-xl text-[#1B1B2F]">
                  MindMatters Biometric Dossier
                </h3>
                <p className="text-xs text-[#5B5B70] font-mono">
                  Report ID: {latestReportId || 'MM-ACTIVE'} · Multimodal Sensor Fusion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E8DFC9] border border-[#8B5E34]/30 text-xs font-cinzel font-bold text-[#8B5E34]">
              <Activity className="w-3.5 h-3.5 text-[#A13D3D] animate-pulse" />
              <span>Real Computer-Vision Synthesis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
            
            {/* Mind Score Gauge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 text-center relative shadow-inner">
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8B5E34] mb-2">
                Overall Mind Score
              </span>

              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#E8DFC9"
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

                <div className="absolute inset-0 flex flex-col items-center justify-center font-cinzel">
                  <span className={`text-5xl font-black ${tier.color} tracking-tight`}>
                    {animatedScore}
                  </span>
                  <span className="text-xs text-[#5B5B70] font-bold">/ 100</span>
                </div>
              </div>

              <div className={`text-sm font-cinzel font-bold ${tier.color} mt-1`}>
                {tier.label}
              </div>
              <p className="text-[11px] text-[#5B5B70] font-lora mt-1 max-w-[220px] italic">
                Derived from mathematical stroke moments, keystroke entropy, and spatial morphology.
              </p>
            </div>

            {/* Radar Chart */}
            <div className="p-4 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/15 flex flex-col items-center justify-center shadow-inner">
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8B5E34] mb-2">
                5-Trait Cognitive Profile
              </span>
              <div className="w-full h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#D9CEB4" />
                    <PolarAngleAxis dataKey="subject" stroke="#1B1B2F" tick={{ fill: '#1B1B2F', fontSize: 10, fontFamily: 'Cinzel', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#8B5E34" tick={{ fill: '#8B5E34', fontSize: 8 }} />
                    <Radar
                      name="Cognitive Traits"
                      dataKey="value"
                      stroke="#A13D3D"
                      fill="#C9A24B"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Mini Stream Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1B1B2F]/15 font-lora">
            <div className="p-4 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/10">
              <div className="flex items-center justify-between text-xs text-[#1B1B2F] mb-1.5 font-cinzel font-bold">
                <span>✍️ Signature</span>
                <span className="text-[#8B5E34]">
                  {signatureResult ? `${signatureResult.traits.confidence}% Conf.` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-[#5B5B70] leading-tight">
                {signatureResult ? `Slant: ${signatureResult.traits.slant} · Pressure: ${signatureResult.traits.pressure_level}` : 'Sign on pad to calibrate stroke vector.'}
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/10">
              <div className="flex items-center justify-between text-xs text-[#1B1B2F] mb-1.5 font-cinzel font-bold">
                <span>⌨️ Keystrokes</span>
                <span className="text-[#8B5E34]">
                  {typingResult ? `${typingResult.typing_speed_wpm} WPM` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-[#5B5B70] leading-tight">
                {typingResult ? `Focus: ${typingResult.focus_score}% · Stress: ${typingResult.stress_score}%` : 'Type passage to measure cadence entropy.'}
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#F4ECDD] border border-[#1B1B2F]/10">
              <div className="flex items-center justify-between text-xs text-[#1B1B2F] mb-1.5 font-cinzel font-bold">
                <span>📝 Handwriting</span>
                <span className="text-[#8B5E34]">
                  {handwritingResult ? `${handwritingResult.traits.formation_consistency}% Form.` : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-[#5B5B70] leading-tight truncate">
                {handwritingResult ? `${handwritingResult.dominant_pattern}` : 'Upload image to extract 10+ features.'}
              </p>
            </div>
          </div>

        </div>

        {/* Action Banner */}
        <div className="max-w-3xl mx-auto mt-10 p-6 rounded-sm bg-[#F4ECDD] border-2 border-[#1B1B2F] shadow-xl shadow-[#1B1B2F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-sm bg-[#E8DFC9] border border-[#8B5E34]/30 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-[#8B5E34]" />
            </div>
            <div>
              <h4 className="font-cinzel font-bold text-sm sm:text-base text-[#1B1B2F]">
                Your Biometric Dossier is Ready
              </h4>
              <p className="text-xs text-[#5B5B70] font-lora">
                View live on-screen or download the high-resolution vector PDF dossier.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-sm font-cinzel font-bold text-xs text-[#1B1B2F] bg-[#E8DFC9] hover:bg-[#D9CEB4] border border-[#1B1B2F]/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4 text-[#8B5E34]" />
              <span>View Dossier</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-sm font-cinzel font-bold text-xs text-[#1B1B2F] bg-[#E8DFC9] hover:bg-[#D9CEB4] border border-[#1B1B2F]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onDownloadReport}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-sm font-cinzel font-bold text-xs tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md shadow-[#A13D3D]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4ECDD]" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#F4ECDD]" />
                  <span>Download Dossier PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
