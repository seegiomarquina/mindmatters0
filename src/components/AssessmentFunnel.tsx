import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Brain,
  Sliders,
  Target,
} from 'lucide-react';
import { BiometricCanvas } from './BiometricCanvas';
import { KeystrokeArena } from './KeystrokeArena';
import {
  Stroke,
  StrokeMetrics,
  KeystrokeEvent,
  KeystrokeMetrics,
  PsychometricsData,
  BiometricReport,
} from '../types';

interface AssessmentFunnelProps {
  onAssessmentComplete: (report: BiometricReport, rawData: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AssessmentFunnel: React.FC<AssessmentFunnelProps> = ({
  onAssessmentComplete,
  isLoading,
  setIsLoading,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Data states
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [strokeMetrics, setStrokeMetrics] = useState<StrokeMetrics>({
    strokeCount: 0,
    slantAngleDeg: 14.5,
    baselineSlopeDeg: 4.8,
    avgPressure: 0.72,
    pressureVariance: 0.035,
    totalLengthPx: 0,
    aspectRatio: 2.3,
    penLifts: 0,
    curvatureIndex: 1.25,
    sampleType: 'signature',
  });
  const [scanDataUrl, setScanDataUrl] = useState<string | undefined>(undefined);

  const [keystrokeEvents, setKeystrokeEvents] = useState<KeystrokeEvent[]>([]);
  const [keystrokeMetrics, setKeystrokeMetrics] = useState<KeystrokeMetrics>({
    avgDwellTimeMs: 95.0,
    avgFlightTimeMs: 135.0,
    jitterVariance: 185.0,
    cadenceEntropy: 1.75,
    wpm: 74,
    hesitationCount: 1,
    backspaceRate: 0.03,
    totalKeystrokes: 0,
  });

  const [psychometrics, setPsychometrics] = useState<PsychometricsData>({
    primaryGoal: 'Executive Leadership & Unshakeable Authority',
    stressLevel: 'Moderate High-Stakes Pressure',
    decisionStyle: 'Decisive & Intuitive with Strategic Verification',
    focusChallenges: 'Subconscious cognitive drag and perfectionist friction',
  });

  const handleStrokesChange = (newStrokes: Stroke[], newMetrics: StrokeMetrics, scanUrl?: string) => {
    setStrokes(newStrokes);
    setStrokeMetrics(newMetrics);
    if (scanUrl) setScanDataUrl(scanUrl);
  };

  const handleKeystrokeChange = (newMetrics: KeystrokeMetrics, events: KeystrokeEvent[]) => {
    setKeystrokeMetrics(newMetrics);
    setKeystrokeEvents(events);
  };

  const handleRunFullSynthesis = async () => {
    setIsLoading(true);
    try {
      const payload = {
        strokeMetrics,
        keystrokeMetrics,
        psychometrics,
        imageScanBase64: scanDataUrl,
      };

      const response = await fetch('/api/analyze-biometrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.report) {
        onAssessmentComplete(data.report, {
          strokes,
          strokeMetrics,
          keystrokeEvents,
          keystrokeMetrics,
          psychometrics,
        });
      }
    } catch (err) {
      console.error('Synthesis failed:', err);
      // Fallback: notify and complete
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Funnel Progress Tracker */}
      <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              currentStep === 1
                ? 'bg-[#141418] border-[#00D1FF]/60 text-white shadow-lg shadow-[#00D1FF]/10'
                : 'bg-[#0A0A0B] border-[#1F1F24] text-slate-400 hover:text-white'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                currentStep === 1 ? 'bg-[#00D1FF] text-black' : 'bg-[#141418] text-slate-400'
              }`}
            >
              1
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Physical Stroke Vectors</div>
              <div className="text-[10px] text-slate-400 font-mono">Signature / Scan Canvas</div>
            </div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              currentStep === 2
                ? 'bg-[#141418] border-[#00D1FF]/60 text-white shadow-lg shadow-[#00D1FF]/10'
                : 'bg-[#0A0A0B] border-[#1F1F24] text-slate-400 hover:text-white'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                currentStep === 2 ? 'bg-[#00D1FF] text-black' : 'bg-[#141418] text-slate-400'
              }`}
            >
              2
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Keystroke Dynamics</div>
              <div className="text-[10px] text-slate-400 font-mono">Flight & Dwell Haptics</div>
            </div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              currentStep === 3
                ? 'bg-[#141418] border-[#00D1FF]/60 text-white shadow-lg shadow-[#00D1FF]/10'
                : 'bg-[#0A0A0B] border-[#1F1F24] text-slate-400 hover:text-white'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                currentStep === 3 ? 'bg-[#00D1FF] text-black' : 'bg-[#141418] text-slate-400'
              }`}
            >
              3
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Trait Calibration</div>
              <div className="text-[10px] text-slate-400 font-mono">Psychometric Alignment</div>
            </div>
          </button>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-4">
          <BiometricCanvas
            strokes={strokes}
            onStrokesChange={handleStrokesChange}
            initialMetrics={strokeMetrics}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-[#00D1FF] hover:bg-[#33DCFF] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00D1FF]/25 transition-all active:scale-95"
            >
              <span>Proceed to Keystroke Flight Test</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-4">
          <KeystrokeArena
            onMetricsChange={handleKeystrokeChange}
            initialMetrics={keystrokeMetrics}
          />
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl bg-[#141418] hover:bg-[#1C1C22] text-slate-300 text-xs font-semibold border border-[#1F1F24]"
            >
              Back to Canvas
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-[#00D1FF] hover:bg-[#33DCFF] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00D1FF]/25 transition-all active:scale-95"
            >
              <span>Proceed to Trait Calibration</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1F1F24]">
            <div className="p-2 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/25">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cognitive & Behavioral Trait Calibration</h3>
              <p className="text-xs text-slate-400">
                Ground the AI grapho-data science engine with your current executive goals and mental bottlenecks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Goal selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">Primary Strategic Goal</label>
              <select
                value={psychometrics.primaryGoal}
                onChange={(e) => setPsychometrics({ ...psychometrics, primaryGoal: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-3 text-xs text-white outline-none focus:border-[#00D1FF]"
              >
                <option>Executive Leadership & Unshakeable Authority</option>
                <option>Creative Breakthrough & Rapid Lateral Innovation</option>
                <option>High-Stakes Crisis Resilience & Stoic Poise</option>
                <option>Elimination of Cognitive Friction & Perfectionist Hesitation</option>
              </select>
            </div>

            {/* Stress level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">Current Environmental Stress Load</label>
              <select
                value={psychometrics.stressLevel}
                onChange={(e) => setPsychometrics({ ...psychometrics, stressLevel: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-3 text-xs text-white outline-none focus:border-[#00D1FF]"
              >
                <option>Moderate High-Stakes Pressure</option>
                <option>Intense Critical Execution Sprint</option>
                <option>Low / Rested Baseline Equilibrium</option>
                <option>Overloaded / Chronic Cognitive Strain</option>
              </select>
            </div>

            {/* Decision Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">Decision-Making Archetype</label>
              <select
                value={psychometrics.decisionStyle}
                onChange={(e) => setPsychometrics({ ...psychometrics, decisionStyle: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-3 text-xs text-white outline-none focus:border-[#00D1FF]"
              >
                <option>Decisive & Intuitive with Strategic Verification</option>
                <option>Hyper-Deliberate Analytical Precision</option>
                <option>Collaborative & Empathetic Consensus</option>
                <option>Rapid Prototyping & Dynamic Iteration</option>
              </select>
            </div>

            {/* Main Challenge */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">Subconscious Friction Area</label>
              <input
                type="text"
                value={psychometrics.focusChallenges}
                onChange={(e) => setPsychometrics({ ...psychometrics, focusChallenges: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-3 text-xs text-white outline-none focus:border-[#00D1FF]"
                placeholder="e.g. Occasional self-censorship before big moves"
              />
            </div>
          </div>

          {/* Launch Synthesis Button */}
          <div className="pt-4 border-t border-[#1F1F24] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="w-4 h-4 text-[#00D1FF]" />
              <span>Correlating {strokeMetrics.strokeCount || 3} stroke vectors + {keystrokeMetrics.totalKeystrokes || 120} flight points</span>
            </div>

            <button
              onClick={handleRunFullSynthesis}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00D1FF] via-[#0088FF] to-[#00FF9D] hover:opacity-90 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl shadow-[#00D1FF]/25 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Cognitive Tensors...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Generate Inkmind Diagnostic Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
