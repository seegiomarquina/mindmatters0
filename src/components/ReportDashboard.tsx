import React, { useState } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  Flame,
  Gauge,
  Layers,
  Lightbulb,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { BiometricReport } from '../types';

interface ReportDashboardProps {
  report: BiometricReport;
  onNavigateToRemediation: () => void;
  onOpenExportModal: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onNavigateToRemediation,
  onOpenExportModal,
}) => {
  const [selectedTraitIndex, setSelectedTraitIndex] = useState<number>(0);
  const { cognitiveIndices } = report;

  // Radar chart mathematical points for the 8 cognitive dimensions
  const dimensions = [
    { label: 'Executive Control', value: cognitiveIndices.executiveControl, color: '#00D1FF' },
    { label: 'Emotional Poise', value: cognitiveIndices.emotionalStability, color: '#00FF9D' },
    { label: 'Ambition Slant', value: cognitiveIndices.ambitionSlantVector, color: '#FFB800' },
    { label: 'Cognitive Speed', value: cognitiveIndices.cognitiveSpeed, color: '#00D1FF' },
    { label: 'Risk Appetite', value: cognitiveIndices.riskAppetite, color: '#A78BFA' },
    { label: 'Neuro Stability', value: cognitiveIndices.neuroMotorStability, color: '#00FF9D' },
    { label: 'Expansiveness', value: cognitiveIndices.creativeExpansiveness, color: '#38BDF8' },
    { label: 'Stress Index', value: 100 - cognitiveIndices.subconsciousStressIndex, color: '#FF2E63' },
  ];

  const radarCenter = 140;
  const radarRadius = 100;
  const totalAxes = dimensions.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (value / 100) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return { x, y };
  };

  const radarPolygonPoints = dimensions
    .map((dim, i) => {
      const { x, y } = getCoordinates(i, dim.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Banner: Subconscious Archetype & Executive Synthesis */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F0F11] border border-[#1F1F24] p-6 lg:p-8 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D1FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00FF9D]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="px-3 py-1 rounded-md bg-[#00D1FF]/10 border border-[#00D1FF]/25 text-[#00D1FF] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Validated Archetype
              </span>
              <span className="px-3 py-1 rounded-md bg-[#00FF9D]/10 border border-[#00FF9D]/20 text-[#00FF9D] text-xs font-semibold">
                Confidence Rating: 98.4%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {report.subconsciousArchetype}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {report.archetypeDescription}
            </p>

            <div className="p-3.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-white">Executive Synthesis: </strong>
              {report.executiveSummary}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={onNavigateToRemediation}
              className="px-6 py-3.5 rounded-xl bg-[#00D1FF] hover:bg-[#33DCFF] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#00D1FF]/25 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4 text-black" />
              <span>Launch Graphotherapy Studio</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="px-6 py-3 rounded-xl bg-[#141418] hover:bg-[#1C1C22] text-slate-200 border border-[#1F1F24] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#00FF9D]" />
              <span>Download Executive Clinical Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 8 Cognitive Dimensions + Multi-Axis Radar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Radar Chart */}
        <div className="lg:col-span-5 bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00D1FF]" />
              <h3 className="text-sm font-bold text-white">Multidimensional Cognitive Radar</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">8-Axis Vector</span>
          </div>

          <div className="relative my-4">
            <svg width={280} height={280} className="overflow-visible">
              {/* Concentric Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => {
                const ringPoints = dimensions
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, level * 100);
                    return `${x},${y}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={level}
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radial Axis Lines */}
              {dimensions.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={x}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Shape Area */}
              <polygon
                points={radarPolygonPoints}
                fill="rgba(0, 209, 255, 0.2)"
                stroke="#00D1FF"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Vertices Points */}
              {dimensions.map((dim, i) => {
                const { x, y } = getCoordinates(i, dim.value);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={dim.color}
                    stroke="#0A0A0B"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* Quick Legend Tags */}
          <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-[#1F1F24] text-[11px] font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0A0B] border border-[#1F1F24]">
              <span className="text-slate-400">Executive Control:</span>
              <span className="font-bold text-[#00D1FF]">{cognitiveIndices.executiveControl}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0A0B] border border-[#1F1F24]">
              <span className="text-slate-400">Stress Load:</span>
              <span className="font-bold text-[#FF2E63]">{cognitiveIndices.subconsciousStressIndex}%</span>
            </div>
          </div>
        </div>

        {/* Right: Dimension Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#0F0F11] border border-[#1F1F24] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Executive Authority</span>
              <Shield className="w-4 h-4 text-[#00D1FF]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white font-mono">{cognitiveIndices.executiveControl}/100</div>
              <div className="w-full bg-[#141418] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#00D1FF] h-full rounded-full"
                  style={{ width: `${cognitiveIndices.executiveControl}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Firm first-stroke anchor & command posture</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F11] border border-[#1F1F24] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Ambition Vector (Slant)</span>
              <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white font-mono">{cognitiveIndices.ambitionSlantVector}/100</div>
              <div className="w-full bg-[#141418] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#00FF9D] h-full rounded-full"
                  style={{ width: `${cognitiveIndices.ambitionSlantVector}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Ascending baseline trajectory & forward drive</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F11] border border-[#1F1F24] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Subconscious Friction</span>
              <ShieldAlert className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white font-mono">{cognitiveIndices.subconsciousStressIndex}/100</div>
              <div className="w-full bg-[#141418] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#FFB800] h-full rounded-full"
                  style={{ width: `${cognitiveIndices.subconsciousStressIndex}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Micro-hesitation intervals & internal editing</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F11] border border-[#1F1F24] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Lateral Innovation</span>
              <Lightbulb className="w-4 h-4 text-[#00D1FF]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white font-mono">{cognitiveIndices.creativeExpansiveness}/100</div>
              <div className="w-full bg-[#141418] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#00D1FF] h-full rounded-full"
                  style={{ width: `${cognitiveIndices.creativeExpansiveness}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Fluidic loop curvature & flexible cognition</span>
          </div>
        </div>
      </div>

      {/* Deep Graphological Trait Deconstruction Section */}
      <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
          <div>
            <h3 className="text-base font-bold text-white">Deep Grapho-Trait Deconstruction</h3>
            <p className="text-xs text-slate-400">
              Clinical correlation between physical stroke geometry and underlying subconscious drivers.
            </p>
          </div>
          <span className="text-xs font-bold text-[#00D1FF] px-3 py-1 rounded-full bg-[#00D1FF]/10 border border-[#00D1FF]/25 font-mono">
            {report.deepGraphoTraits.length} Primary Markers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List of traits */}
          <div className="flex flex-col gap-2">
            {report.deepGraphoTraits.map((trait, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTraitIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedTraitIndex === idx
                    ? 'bg-[#141418] border-[#00D1FF]/60 text-white shadow-md'
                    : 'bg-[#0A0A0B] border-[#1F1F24] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{trait.trait}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 font-mono">{trait.indicator}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                    trait.severity === 'optimal'
                      ? 'bg-[#00FF9D]/15 text-[#00FF9D]'
                      : trait.severity === 'critical'
                      ? 'bg-[#FF2E63]/15 text-[#FF2E63]'
                      : 'bg-[#FFB800]/15 text-[#FFB800]'
                  }`}
                >
                  {trait.severity}
                </span>
              </button>
            ))}
          </div>

          {/* Active Trait Detailed Card */}
          {report.deepGraphoTraits[selectedTraitIndex] && (
            <div className="md:col-span-2 p-5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">
                    {report.deepGraphoTraits[selectedTraitIndex].trait}
                  </h4>
                  <span className="text-sm font-black text-[#00D1FF] font-mono">
                    Score: {report.deepGraphoTraits[selectedTraitIndex].score}/100
                  </span>
                </div>
                <div className="text-xs text-[#00FF9D] font-mono mt-1">
                  Indicator: {report.deepGraphoTraits[selectedTraitIndex].indicator}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#0F0F11] border border-[#1F1F24]">
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1 font-mono">
                    Psychological & Subconscious Translation:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {report.deepGraphoTraits[selectedTraitIndex].psychologicalMeaning}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#00D1FF]/5 border border-[#00D1FF]/20 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#00D1FF]">Target Graphotherapy Correction:</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {report.deepGraphoTraits[selectedTraitIndex].remediationHint}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature & Keystroke Double Insight Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signature Persona Breakdown */}
        <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1F1F24]">
            <Shield className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-sm font-bold text-white">Signature Persona vs. Subconscious Core</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {report.signatureAnalysis.publicPersonaVsInnerSelf}
          </p>

          <div className="mt-2">
            <div className="text-[11px] font-bold uppercase text-[#00FF9D] tracking-wider mb-1.5 font-mono">
              Identified Core Strengths:
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.signatureAnalysis.strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <div className="text-[11px] font-bold uppercase text-[#FF2E63] tracking-wider mb-1.5 font-mono">
              Subconscious Vulnerabilities:
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.signatureAnalysis.vulnerabilities.map((vuln, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FF2E63] shrink-0 mt-0.5" />
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Keystroke Insights */}
        <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1F1F24]">
            <Activity className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-sm font-bold text-white">Neuro-Motor Typing Telemetry Analysis</h3>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
            <span className="text-[10px] font-bold uppercase text-[#00D1FF] tracking-wider font-mono">Cognitive Load Assessment</span>
            <p className="text-xs text-slate-300 mt-1">
              {report.keystrokeDynamicsInsight.cognitiveLoadAssessment}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
            <span className="text-[10px] font-bold uppercase text-[#FFB800] tracking-wider font-mono">Hesitation Phenomenon</span>
            <p className="text-xs text-slate-300 mt-1">
              {report.keystrokeDynamicsInsight.hesitationPhenomenon}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24]">
            <span className="text-[10px] font-bold uppercase text-[#00FF9D] tracking-wider font-mono">Neuro-Cadence State</span>
            <p className="text-xs text-slate-300 mt-1">
              {report.keystrokeDynamicsInsight.neuroCadenceState}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
