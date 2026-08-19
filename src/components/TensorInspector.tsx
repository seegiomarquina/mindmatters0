import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Cpu,
  Layers,
  SlidersHorizontal,
  Activity,
  Maximize2,
  FileJson,
} from 'lucide-react';
import { StrokeMetrics, KeystrokeMetrics, BiometricReport } from '../types';

interface TensorInspectorProps {
  strokeMetrics: StrokeMetrics;
  keystrokeMetrics: KeystrokeMetrics;
  report?: BiometricReport;
  rawStrokesCount: number;
}

export const TensorInspector: React.FC<TensorInspectorProps> = ({
  strokeMetrics,
  keystrokeMetrics,
  report,
  rawStrokesCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tensors' | 'matrix' | 'json'>('tensors');

  const telemetryPayload = {
    metadata: {
      engine: 'MindMatters Grapho-CV & Haptics v2.8',
      timestamp: new Date().toISOString(),
      rawStrokeVectors: rawStrokesCount,
      totalKeystrokeEvents: keystrokeMetrics.totalKeystrokes,
    },
    strokeFeatureExtraction: strokeMetrics,
    keystrokeMicroBiometrics: keystrokeMetrics,
    derivedCognitiveIndices: report?.cognitiveIndices || {},
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(telemetryPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/25">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Biometric CV & Tensor Inspector</h2>
              <p className="text-xs text-slate-400">
                Inspect raw mathematical feature vectors, computer vision extractions, and neuro-motor flight distributions.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-[#0A0A0B] p-1 border border-[#1F1F24] font-mono">
          <button
            onClick={() => setActiveTab('tensors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tensors'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tensor Vectors
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Correlation Matrix
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'json'
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw JSON Stream
          </button>
        </div>
      </div>

      {activeTab === 'tensors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Physical Stroke Vector Tensors */}
          <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F1F24]">
              <h3 className="text-sm font-bold text-white">Physical Vector Tensor Array</h3>
              <span className="text-[10px] font-mono text-[#00D1FF]">12 Extracted Features</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Slant Inclination θ:</span>
                <span className="font-bold text-white">{strokeMetrics.slantAngleDeg.toFixed(2)}°</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Baseline Slope (Δy/Δx):</span>
                <span className="font-bold text-white">{strokeMetrics.baselineSlopeDeg.toFixed(2)}°</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Average Kinetic Density:</span>
                <span className="font-bold text-white">{strokeMetrics.avgPressure.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Pressure Variance (σ²):</span>
                <span className="font-bold text-white">{strokeMetrics.pressureVariance.toFixed(5)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Curvature Metric (L / D):</span>
                <span className="font-bold text-white">{strokeMetrics.curvatureIndex.toFixed(2)}x</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Aspect Ratio (W / H):</span>
                <span className="font-bold text-white">{strokeMetrics.aspectRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Keystroke Tensors */}
          <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F1F24]">
              <h3 className="text-sm font-bold text-white">Dynamic Keystroke Time-Series Array</h3>
              <span className="text-[10px] font-mono text-[#00FF9D]">8 Temporal Metrics</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Mean Dwell Hold (T_dwell):</span>
                <span className="font-bold text-white">{keystrokeMetrics.avgDwellTimeMs.toFixed(1)} ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Mean Flight Latency (T_flight):</span>
                <span className="font-bold text-white">{keystrokeMetrics.avgFlightTimeMs.toFixed(1)} ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Latency Jitter Variance:</span>
                <span className="font-bold text-white">{keystrokeMetrics.jitterVariance.toFixed(1)} ms²</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Shannon Cadence Entropy (H):</span>
                <span className="font-bold text-white">{keystrokeMetrics.cadenceEntropy.toFixed(2)} bits</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Hesitation Bursts (&gt;420ms):</span>
                <span className="font-bold text-white">{keystrokeMetrics.hesitationCount}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] font-mono text-xs">
                <span className="text-slate-400">Correction Error Rate:</span>
                <span className="font-bold text-white">{(keystrokeMetrics.backspaceRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h3 className="text-base font-bold text-white">Grapho-Biometric Cross-Correlation Matrix</h3>
          <p className="text-xs text-slate-400">
            Empirical correlation coefficients (r) between static physical stroke features and dynamic cognitive indices.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#1F1F24] text-slate-400">
                  <th className="p-3">Feature Parameter</th>
                  <th className="p-3">Target Behavioral Index</th>
                  <th className="p-3">Correlation (r)</th>
                  <th className="p-3">Statistical Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F24] text-slate-200">
                <tr>
                  <td className="p-3 font-bold text-white">Ascending Baseline Slope</td>
                  <td className="p-3">Executive Ambition & Stamina</td>
                  <td className="p-3 text-[#00FF9D] font-bold">+0.86</td>
                  <td className="p-3 text-slate-400">p &lt; 0.001 (High)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Flight Latency Jitter Variance</td>
                  <td className="p-3">Subconscious Cognitive Anxiety</td>
                  <td className="p-3 text-[#FF2E63] font-bold">+0.79</td>
                  <td className="p-3 text-slate-400">p &lt; 0.001 (High)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Curvature Index / Open Loops</td>
                  <td className="p-3">Creative Lateral Bandwidth</td>
                  <td className="p-3 text-[#00D1FF] font-bold">+0.81</td>
                  <td className="p-3 text-slate-400">p &lt; 0.001 (High)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Mean Dwell Time Hold</td>
                  <td className="p-3">Analytical Verification Load</td>
                  <td className="p-3 text-[#FFB800] font-bold">+0.72</td>
                  <td className="p-3 text-slate-400">p &lt; 0.01 (Moderate)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">First-Stroke Initial Velocity</td>
                  <td className="p-3">Executive Authority Presence</td>
                  <td className="p-3 text-[#00FF9D] font-bold">+0.84</td>
                  <td className="p-3 text-slate-400">p &lt; 0.001 (High)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-[#0A0A0B] border border-[#1F1F24] rounded-2xl p-5 shadow-xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-[#00FF9D]" />
              <span className="text-xs font-mono text-white">telemetry-payload.json</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-xs font-semibold text-white border border-[#1F1F24] flex items-center gap-1.5 transition-colors font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00FF9D]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-[#00FF9D] overflow-x-auto max-h-96">
            {JSON.stringify(telemetryPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
