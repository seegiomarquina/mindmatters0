import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Clock,
  Zap,
  RotateCcw,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Brain,
  Gauge,
} from 'lucide-react';
import { KeystrokeEvent, KeystrokeMetrics } from '../types';
import { calculateKeystrokeMetrics, SAMPLE_PROMPT_PARAGRAPHS } from '../utils/keystrokeAnalytics';

interface KeystrokeArenaProps {
  onMetricsChange: (metrics: KeystrokeMetrics, events: KeystrokeEvent[]) => void;
  initialMetrics?: KeystrokeMetrics;
}

export const KeystrokeArena: React.FC<KeystrokeArenaProps> = ({
  onMetricsChange,
  initialMetrics,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const promptText = SAMPLE_PROMPT_PARAGRAPHS[promptIndex];

  const [typedText, setTypedText] = useState('');
  const [activeEvents, setActiveEvents] = useState<KeystrokeEvent[]>([]);
  const [keyPressDownMap, setKeyPressDownMap] = useState<Map<string, number>>(new Map());
  const [lastKeyUpTime, setLastKeyUpTime] = useState<number | null>(null);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [recentFlights, setRecentFlights] = useState<number[]>([]);

  const [metrics, setMetrics] = useState<KeystrokeMetrics>(
    initialMetrics || {
      avgDwellTimeMs: 95.0,
      avgFlightTimeMs: 135.0,
      jitterVariance: 185.0,
      cadenceEntropy: 1.75,
      wpm: 74,
      hesitationCount: 1,
      backspaceRate: 0.03,
      totalKeystrokes: 0,
    }
  );

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = performance.now();
    if (!startTime) {
      setStartTime(now);
    }

    if (e.key === 'Backspace') {
      setBackspaceCount((prev) => prev + 1);
    }

    // Save keydown timestamp
    setKeyPressDownMap((prev) => {
      const next = new Map(prev);
      next.set(e.code, now);
      return next;
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = performance.now();
    const downTime = keyPressDownMap.get(e.code) || now - 80;
    const dwellTimeMs = Math.max(now - downTime, 10);
    const flightTimeMs = lastKeyUpTime ? Math.max(downTime - lastKeyUpTime, 10) : 120;

    setLastKeyUpTime(now);

    const newEvent: KeystrokeEvent = {
      key: e.key,
      code: e.code,
      downTime,
      upTime: now,
      dwellTimeMs,
      flightTimeMs,
    };

    const updatedEvents = [...activeEvents, newEvent];
    setActiveEvents(updatedEvents);

    // Update recent flight history for live sparkline
    setRecentFlights((prev) => [...prev.slice(-24), Math.min(flightTimeMs, 500)]);

    const elapsedSec = startTime ? (now - startTime) / 1000 : 1;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const computedMetrics = calculateKeystrokeMetrics(
      updatedEvents,
      wordsTyped,
      backspaceCount,
      elapsedSec
    );

    setMetrics(computedMetrics);
    onMetricsChange(computedMetrics, updatedEvents);
  };

  const handleReset = () => {
    setTypedText('');
    setActiveEvents([]);
    setKeyPressDownMap(new Map());
    setLastKeyUpTime(null);
    setBackspaceCount(0);
    setStartTime(null);
    setRecentFlights([]);
    const resetMetrics: KeystrokeMetrics = {
      avgDwellTimeMs: 95.0,
      avgFlightTimeMs: 135.0,
      jitterVariance: 185.0,
      cadenceEntropy: 1.75,
      wpm: 74,
      hesitationCount: 1,
      backspaceRate: 0.03,
      totalKeystrokes: 0,
    };
    setMetrics(resetMetrics);
    onMetricsChange(resetMetrics, []);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % SAMPLE_PROMPT_PARAGRAPHS.length);
    handleReset();
  };

  // Sparkline generator for flight times
  const renderSparkline = () => {
    if (recentFlights.length < 2) return null;
    const maxVal = Math.max(...recentFlights, 300);
    const h = 40;
    const w = 180;
    const step = w / (recentFlights.length - 1);

    const points = recentFlights
      .map((val, idx) => {
        const x = idx * step;
        const y = h - (val / maxVal) * (h - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-[180px] h-[40px] overflow-visible">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00D1FF" />
            <stop offset="100%" stopColor="#00FF9D" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#sparkGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-4 lg:p-6 shadow-2xl flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F1F24]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/25">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white">Dynamic Keystroke Neuro-Motor Arena</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measures inter-key flight latencies, hold dwell times, and subconscious cognitive hesitation bursts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextPrompt}
            className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-slate-300 border border-[#1F1F24] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Switch Prompt</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-slate-300 border border-[#1F1F24] text-xs font-semibold"
            title="Reset Typing Arena"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Cognitive Prompt Box */}
      <div className="p-3.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] relative">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between font-mono">
          <span>Target Executive Calibration Text:</span>
          <span>
            {typedText.length} / {promptText.length} chars
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono leading-relaxed text-slate-200 select-none">
          {promptText.split('').map((char, index) => {
            let color = 'text-slate-400';
            if (index < typedText.length) {
              color = typedText[index] === char ? 'text-[#00FF9D] font-bold' : 'text-[#FF2E63] bg-[#FF2E63]/20 rounded';
            } else if (index === typedText.length) {
              color = 'text-white underline decoration-[#00D1FF] decoration-2 animate-pulse';
            }
            return (
              <span key={index} className={color}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Interactive Typing Input */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder="Start typing the text above to activate the neuro-motor telemetry stream..."
          rows={3}
          className="w-full bg-[#0A0A0B] border border-[#1F1F24] focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] rounded-xl p-3 text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 outline-none resize-none transition-all"
        />

        {/* Live Sparkline HUD in corner */}
        {recentFlights.length > 3 && (
          <div className="absolute right-3 bottom-3 hidden sm:flex items-center gap-2 bg-[#0F0F11]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#1F1F24] pointer-events-none">
            <span className="text-[10px] font-mono text-slate-400">Flight Latency:</span>
            {renderSparkline()}
          </div>
        )}
      </div>

      {/* Dynamic Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Mean Dwell Time</span>
            <Clock className="w-3.5 h-3.5 text-[#00D1FF]" />
          </div>
          <span className="text-base font-black text-white mt-1 font-mono">
            {metrics.avgDwellTimeMs.toFixed(1)} <span className="text-xs font-normal text-slate-400">ms</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {metrics.avgDwellTimeMs < 90 ? 'Swift Automaticity' : 'Analytical Deliberation'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Flight Latency</span>
            <Activity className="w-3.5 h-3.5 text-[#00D1FF]" />
          </div>
          <span className="text-base font-black text-white mt-1 font-mono">
            {metrics.avgFlightTimeMs.toFixed(1)} <span className="text-xs font-normal text-slate-400">ms</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {metrics.avgFlightTimeMs < 140 ? 'High Neuro-Flow' : 'Complex Processing'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Jitter Variance</span>
            <Gauge className="w-3.5 h-3.5 text-[#FFB800]" />
          </div>
          <span className="text-base font-black text-white mt-1 font-mono">
            {metrics.jitterVariance.toFixed(0)} <span className="text-xs font-normal text-slate-400">ms²</span>
          </span>
          <span className="text-[10px] text-[#FFB800] mt-0.5">
            {metrics.jitterVariance < 200 ? 'Uniform Harmonic Cadence' : 'High Cognitive Editing'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Speed & Cadence</span>
            <Zap className="w-3.5 h-3.5 text-[#00FF9D]" />
          </div>
          <span className="text-base font-black text-white mt-1 font-mono">
            {metrics.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </span>
          <span className="text-[10px] text-[#00FF9D] mt-0.5 font-mono">
            Entropy: {metrics.cadenceEntropy.toFixed(2)} | Pauses: {metrics.hesitationCount}
          </span>
        </div>
      </div>
    </div>
  );
};
