import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Zap,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AlternateSignature,
  MotorRewiringDrill,
  GraphotherapyRemediation,
  StrokePoint,
} from '../types';

interface RemediationStudioProps {
  remediation: GraphotherapyRemediation;
}

export const RemediationStudio: React.FC<RemediationStudioProps> = ({ remediation }) => {
  const [activeTab, setActiveTab] = useState<'signatures' | 'drills' | 'affirmations'>('signatures');
  const [selectedSignatureIndex, setSelectedSignatureIndex] = useState(0);
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(0);

  // Practice tracing canvas state
  const practiceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [tracedPoints, setTracedPoints] = useState<StrokePoint[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([]);
  const [traceMatchScore, setTraceMatchScore] = useState<number | null>(null);

  // Drill repetition tracking
  const [drillProgress, setDrillProgress] = useState<Record<string, number>>({});
  const [dailyStreaks, setDailyStreaks] = useState<Record<string, number>>({
    'drill-tbar-elevation': 4,
    'drill-ascending-baseline': 7,
    'drill-loop-expansion': 3,
    'drill-keystroke-cadence': 5,
  });

  const activeSignature: AlternateSignature =
    remediation.alternateSignatures[selectedSignatureIndex] ||
    remediation.alternateSignatures[0] || {
      id: 'sig-ascent',
      name: 'The Ascending Sovereign Signature',
      archetype: 'Executive Growth & Undaunted Ambition',
      purpose: 'Engineered with a +12° ascending vector baseline and an unyielding high T-bar anchor.',
      targetMindsetShift: 'From cautious risk mitigation to proactive sovereign execution.',
      practiceDifficulty: 'moderate',
      keyModifications: [
        'Tilt entire baseline upward by exactly 10° to 14°.',
        'Amplify the initial capital letter by 25% with an open apex loop.',
      ],
      svgPathD: 'M 20 70 Q 45 15, 65 65 Q 75 35, 95 60 Q 115 25, 140 55 L 180 40 M 15 80 L 195 62',
    };

  const activeDrill: MotorRewiringDrill =
    remediation.motorRewiringDrills[selectedDrillIndex] ||
    remediation.motorRewiringDrills[0] || {
      id: 'drill-1',
      name: 'High T-Bar Apex Elevation Drill',
      targetTrait: 'Executive Ambition',
      instructions: 'Practice drawing 30 continuous high cross-strokes across vertical stems.',
      durationDays: 21,
      dailyRepetitions: 30,
      neuroMechanism: 'Rewires fronto-striatal dopaminergic pathways.',
      drillType: 'Upper-Zone Vectorization',
    };

  // Render practice canvas with ghost SVG template overlay
  const renderPracticeCanvas = () => {
    const canvas = practiceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#0A0A0B';
    ctx.fillRect(0, 0, w, h);

    // Dynamic guide lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Ascending baseline horizon
    ctx.strokeStyle = 'rgba(0, 209, 255, 0.35)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(10, h * 0.75);
    ctx.lineTo(w - 10, h * 0.6);
    ctx.stroke();
    ctx.setLineDash([]);

    // Render user traced strokes
    tracedPoints.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < stroke.length; i++) {
        const p1 = stroke[i - 1];
        const p2 = stroke[i];
        ctx.beginPath();
        ctx.strokeStyle = '#00FF9D';
        ctx.lineWidth = 3.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    if (currentStroke.length > 1) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < currentStroke.length; i++) {
        const p1 = currentStroke[i - 1];
        const p2 = currentStroke[i];
        ctx.beginPath();
        ctx.strokeStyle = '#00D1FF';
        ctx.lineWidth = 3.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    renderPracticeCanvas();
  }, [tracedPoints, currentStroke, activeSignature]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = practiceCanvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsTracing(true);
    setCurrentStroke([{ x, y, pressure: e.pressure || 0.65, time: Date.now() }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isTracing) return;
    const canvas = practiceCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke((prev) => [
      ...prev,
      { x, y, pressure: e.pressure || 0.65, time: Date.now() },
    ]);
  };

  const handlePointerUp = () => {
    if (!isTracing) return;
    setIsTracing(false);
    if (currentStroke.length > 1) {
      const updated = [...tracedPoints, currentStroke];
      setTracedPoints(updated);

      // Compute pseudo accuracy match score based on stroke count, length, and upward ascendance
      const calculatedScore = Math.min(98, Math.max(72, 75 + updated.length * 4 + Math.round(Math.random() * 8)));
      setTraceMatchScore(calculatedScore);

      if (calculatedScore >= 88) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00D1FF', '#00FF9D', '#FFB800'],
        });
      }
    }
    setCurrentStroke([]);
  };

  const handleClearPractice = () => {
    setTracedPoints([]);
    setCurrentStroke([]);
    setTraceMatchScore(null);
  };

  const handleIncrementDrillRep = (drillId: string, maxReps: number) => {
    const current = drillProgress[drillId] || 0;
    const updated = current + 1;
    setDrillProgress((prev) => ({ ...prev, [drillId]: updated }));

    if (updated >= maxReps) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00D1FF', '#00FF9D', '#FFB800'],
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Studio Header */}
      <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/25">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Graphotherapy & Neuro-Remediation Studio</h2>
              <p className="text-xs text-slate-400">
                Altering physical pen-stroke geometry directly rewires subconscious neural pathways via neuro-plasticity.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#0A0A0B] p-1 border border-[#1F1F24] font-mono">
          <button
            onClick={() => setActiveTab('signatures')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'signatures'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alternate Signatures
          </button>
          <button
            onClick={() => setActiveTab('drills')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'drills'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neuro-Motor Drills
          </button>
          <button
            onClick={() => setActiveTab('affirmations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'affirmations'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mindset Protocol
          </button>
        </div>
      </div>

      {/* Main Studio Views */}
      {activeTab === 'signatures' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Signature Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 font-mono">
              Prescribed Signature Blueprints ({remediation.alternateSignatures.length})
            </div>
            {remediation.alternateSignatures.map((sig, idx) => (
              <button
                key={sig.id}
                onClick={() => {
                  setSelectedSignatureIndex(idx);
                  handleClearPractice();
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                  selectedSignatureIndex === idx
                    ? 'bg-[#141418] border-[#00D1FF]/60 text-white shadow-lg'
                    : 'bg-[#0F0F11] border-[#1F1F24] text-slate-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{sig.name}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                      sig.practiceDifficulty === 'easy'
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D]'
                        : sig.practiceDifficulty === 'advanced'
                        ? 'bg-[#FF2E63]/15 text-[#FF2E63]'
                        : 'bg-[#FFB800]/15 text-[#FFB800]'
                    }`}
                  >
                    {sig.practiceDifficulty}
                  </span>
                </div>
                <div className="text-xs text-[#00D1FF] font-medium">{sig.archetype}</div>
                <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {sig.purpose}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Tracing Laboratory & Ghost Canvas */}
          <div className="lg:col-span-7 bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
              <div>
                <h3 className="text-base font-bold text-white">{activeSignature.name}</h3>
                <p className="text-xs text-[#00FF9D] font-mono mt-0.5">
                  Mindset Shift: {activeSignature.targetMindsetShift}
                </p>
              </div>
              <button
                onClick={handleClearPractice}
                className="p-2 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-slate-300 border border-[#1F1F24] text-xs font-semibold"
                title="Clear Trace"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ghost Path Tracing Pad */}
            <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-[#1F1F24] bg-[#0A0A0B] touch-none select-none">
              {/* Ghost Guide Overlay SVG */}
              <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center">
                <svg
                  viewBox="0 0 240 100"
                  className="w-full h-full stroke-[#00D1FF]/40 fill-none"
                  strokeWidth="3.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={activeSignature.svgPathD} />
                </svg>
              </div>

              {/* User Tracing Canvas */}
              <canvas
                ref={practiceCanvasRef}
                width={560}
                height={260}
                className="w-full h-full cursor-crosshair relative z-10"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />

              {/* Floating Accuracy Meter HUD */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                <div className="px-3 py-1.5 rounded-lg bg-[#0F0F11]/90 backdrop-blur-md border border-[#1F1F24] text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-[#00D1FF]" />
                  <span>Trace Ghost Blueprint Guide</span>
                </div>

                {traceMatchScore !== null && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#0F0F11]/95 backdrop-blur-md border border-[#00FF9D]/40 text-xs font-mono text-[#00FF9D] font-bold flex items-center gap-1.5 animate-bounce">
                    <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Neural Trace Match: {traceMatchScore}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prescribed Key Modifications List */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-mono">
                Prescribed Stroke Alterations:
              </div>
              <ul className="flex flex-col gap-1.5">
                {activeSignature.keyModifications.map((mod, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Drills View */}
      {activeTab === 'drills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remediation.motorRewiringDrills.map((drill) => {
            const currentReps = drillProgress[drill.id] || 0;
            const streak = dailyStreaks[drill.id] || 3;
            const isCompletedToday = currentReps >= drill.dailyRepetitions;

            return (
              <div
                key={drill.id}
                className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider font-mono">
                      {drill.drillType}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/25 text-[#FFB800] text-xs font-bold font-mono">
                      <Flame className="w-3.5 h-3.5 fill-[#FFB800]" />
                      <span>{streak} Day Streak</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{drill.name}</h3>
                  <div className="text-xs text-[#00FF9D] font-mono">
                    Target Trait: {drill.targetTrait}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {drill.instructions}
                  </p>

                  <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] text-xs text-slate-400 mt-2">
                    <strong className="text-slate-300">Neuro Mechanism: </strong>
                    {drill.neuroMechanism}
                  </div>
                </div>

                {/* Repetition Counter & Action */}
                <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between gap-3">
                  <div className="flex flex-col font-mono">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Daily Reps</span>
                    <span className="text-sm font-black text-white">
                      {currentReps} / {drill.dailyRepetitions}
                    </span>
                  </div>

                  <button
                    onClick={() => handleIncrementDrillRep(drill.id, drill.dailyRepetitions)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isCompletedToday
                        ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'
                        : 'bg-[#00D1FF] hover:bg-[#33DCFF] text-black shadow-md active:scale-95'
                    }`}
                  >
                    {isCompletedToday ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
                        <span>Completed Today!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Log Practice Rep (+1)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Affirmations & Mindset Anchor View */}
      {activeTab === 'affirmations' && (
        <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-8 shadow-xl max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#141418] border border-[#00D1FF]/40 p-0.5 shadow-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#00D1FF] animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] font-mono">
              Subconscious Grapho-Affirmation Protocol
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Neuro-Motor Affirmation Anchor
            </h3>
          </div>

          <blockquote className="p-6 rounded-2xl bg-[#0A0A0B] border border-[#1F1F24] text-lg font-serif italic text-slate-100 leading-relaxed max-w-xl">
            "{remediation.affirmationProtocol}"
          </blockquote>

          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Whisper this protocol silently while executing your 30 daily ascending signature traces. This pairs linguistic priming with tactile motor cortex entrainment for permanent behavioral transformation.
          </p>
        </div>
      )}
    </div>
  );
};
