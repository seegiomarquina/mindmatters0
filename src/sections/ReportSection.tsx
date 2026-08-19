import React from 'react';
import { Download, Share2, FileText, Sparkles, QrCode, ArrowRight, ExternalLink } from 'lucide-react';
import { BiometricReport } from '@/types';

/* Mind Score gauge (0-100) */
function MindScoreGauge({ score = 78 }: { score?: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.75; // 270deg arc
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-[225deg]">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="11"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="url(#gaugeGrad)" strokeWidth="11"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="140" y2="140">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-white">{score}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200">Mind Score</span>
      </div>
    </div>
  );
}

/* Radar chart: Stress, Focus, Ambition, Stability, Executive Control */
function RadarChart({ indices }: { indices?: any }) {
  const cx = 110, cy = 100, R = 72;
  const axes = ['Ambition', 'Focus', 'Confidence', 'Stability', 'Control'];
  const values = indices
    ? [
        (indices.ambitionSlantVector || 80) / 100,
        (indices.cognitiveSpeed || 75) / 100,
        (indices.executiveControl || 85) / 100,
        (indices.emotionalStability || 78) / 100,
        (indices.neuroMotorStability || 82) / 100,
      ]
    : [0.75, 0.8, 0.72, 0.66, 0.84]; // 0-1
  const angle = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const pt = (i: number, r: number) => `${cx + r * Math.cos(angle(i))},${cy + r * Math.sin(angle(i))}`;
  const ring = (f: number) => axes.map((_, i) => pt(i, R * f)).join(' ');
  const data = values.map((v, i) => pt(i, R * v)).join(' ');

  return (
    <svg viewBox="0 0 220 200" className="h-full w-full">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(angle(i))} y2={cy + R * Math.sin(angle(i))}
          stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      ))}
      <polygon points={data} fill="rgba(45,212,191,0.25)" stroke="#2dd4bf" strokeWidth="2" />
      {values.map((v, i) => {
        const [x, y] = pt(i, R * v).split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r="3" fill="#2dd4bf" />;
      })}
      {axes.map((a, i) => {
        const x = cx + (R + 16) * Math.cos(angle(i));
        const y = cy + (R + 14) * Math.sin(angle(i));
        return (
          <text key={a} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            className="fill-indigo-200" fontSize="9" fontWeight="600">
            {a}
          </text>
        );
      })}
    </svg>
  );
}

/* Handwriting CV Tensor breakdown */
function HandwritingCVBreakdown() {
  const metrics = [
    { label: 'Slant Vector (θ)', val: '+14.5°', desc: 'Forward Momentum & Drive', color: 'text-[#00D1FF]' },
    { label: 'Baseline Horizon', val: '+4.8°', desc: 'Sustained Ambition & Stamina', color: 'text-[#00FF9D]' },
    { label: 'Zone Proportions', val: '32:48:20', desc: 'Balanced Upper/Middle Focus', color: 'text-[#FFB800]' },
    { label: 'Letter Spacing', val: 'Fluidic', desc: 'High Communicative Receptivity', color: 'text-indigo-300' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 h-full justify-center content-center">
      {metrics.map((m) => (
        <div key={m.label} className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{m.label}</span>
          <span className={`text-sm font-black ${m.color} font-mono mt-0.5`}>{m.val}</span>
          <span className="text-[9px] text-slate-400 leading-tight mt-0.5">{m.desc}</span>
        </div>
      ))}
    </div>
  );
}

/* Typing speed mini graph */
function TypingGraph() {
  const pts = [42, 55, 38, 62, 48, 70, 44, 66, 52, 74, 58, 68, 46, 60];
  const w = 220, h = 70;
  const d = pts
    .map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / 80) * h}`)
    .join(' L ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <path d={`M ${d}`} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M 0,${h} L ${d} L ${w},${h} Z`} fill="rgba(129,140,248,0.18)" />
    </svg>
  );
}

const contents = [
  'Cover page with your name, date & overall Mind Score (0–100)',
  'Radar chart: Ambition · Focus · Confidence · Stability · Executive Control',
  'Signature analysis breakdown — traits detected + confidence %',
  'Typing analysis graph — speed vs. time, pause & flight latency heatmap',
  'Handwriting computer vision breakdown — slant, spacing & letter formation tensor analysis',
  'Combined AI executive behavioral synthesis in high-precision psychological language',
  'Personalized Graphotherapy remediation blueprint & alternate signature drills',
  'QR code & shareable link for your professional portfolio',
];

export interface ReportSectionProps {
  report?: BiometricReport | null;
  onOpenExportModal?: () => void;
  onViewFullReport?: () => void;
  onOpenRemediation?: () => void;
}

export default function ReportSection({
  report,
  onOpenExportModal,
  onViewFullReport,
  onOpenRemediation,
}: ReportSectionProps) {
  const mindScore = report
    ? Math.round(
        (report.cognitiveIndices.executiveControl +
          report.cognitiveIndices.emotionalStability +
          report.cognitiveIndices.ambitionSlantVector +
          (100 - report.cognitiveIndices.subconsciousStressIndex)) /
          4
      )
    : 78;

  const dominantArchetype = report?.subconsciousArchetype || 'THE STRATEGIC VISIONARY';

  return (
    <section id="report" className="relative scroll-mt-24 overflow-hidden bg-slate-950 py-24">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            THE UNIFIED MIND REPORT
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your Mind, Decoded.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-300 bg-clip-text text-transparent">
              One Report.
            </span>{' '}
            Zero Guesswork.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Every analysis you run — Signature, Typing, and Handwriting Image Scan — is combined
            into a single, beautifully designed Mind Report. Visual charts,
            trait breakdowns, stress score, cognitive timeline, and personalized
            graphotherapy remediations — all in one dossier.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Mock report preview card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-indigo-950/60 shadow-[0_40px_80px_-30px_rgba(99,102,241,0.5)]">
            {/* report header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Mind Report Dossier</p>
                  <p className="text-[11px] text-slate-400">Multimodal Grapho-Biometric Synthesis</p>
                </div>
              </div>
              <span className="rounded-full bg-teal-400/15 border border-teal-400/30 px-3 py-1 text-[11px] font-bold text-teal-300 font-mono uppercase">
                {dominantArchetype}
              </span>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
                <MindScoreGauge score={mindScore} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Cognitive Trait Radar
                </p>
                <div className="h-40">
                  <RadarChart indices={report?.cognitiveIndices} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Typing Speed & Flight Latency
                </p>
                <div className="h-20">
                  <TypingGraph />
                </div>
                <p className="mt-2 text-[11px] text-slate-400 font-mono">
                  Avg 74 WPM · Uniform flight cadence detected
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Handwriting CV Tensor Breakdown
                </p>
                <HandwritingCVBreakdown />
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02]">
              <p className="text-sm leading-relaxed text-slate-300">
                <span className="font-semibold text-teal-300">AI Executive Synthesis: </span>
                {report?.executiveSummary
                  ? report.executiveSummary.slice(0, 140) + '...'
                  : 'High upward baseline ascendance combined with swift keystroke flight cadence indicates formidable executive authority.'}
              </p>
              {onViewFullReport && (
                <button
                  onClick={onViewFullReport}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 text-xs font-bold flex items-center gap-1 border border-teal-400/30 transition-colors cursor-pointer"
                >
                  <span>View Full Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* What's inside */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">Inside every report</h3>
            <ul className="space-y-3.5">
              {contents.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-teal-400">
                    <Sparkles className="h-3 w-3 text-white" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2">
                <QrCode className="h-full w-full text-slate-900" />
              </span>
              <p className="text-xs leading-relaxed text-slate-400">
                Every report ships with a QR code & shareable link — perfect for
                sharing with leadership coaches, recruiters, or adding to your personal growth journal.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky floating CTA box */}
        <div className="sticky bottom-6 z-20 mt-14">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/90 px-6 py-5 shadow-[0_20px_60px_-15px_rgba(45,212,191,0.4)] backdrop-blur-xl sm:flex-row sm:justify-between sm:rounded-full">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
                <FileText className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-teal-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Your Mind Report is ready</p>
                <p className="text-[10px] text-slate-400 font-mono">Multimodal Synthesis Engine</p>
              </div>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:brightness-110 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </button>
              {onOpenRemediation && (
                <button
                  onClick={onOpenRemediation}
                  className="flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-2.5 text-sm font-semibold text-teal-300 transition-colors hover:bg-teal-400/20 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-teal-300" />
                  <span>Remediation Studio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
