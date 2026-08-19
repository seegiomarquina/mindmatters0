import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Trash2,
  Play,
  Pause,
  Grid,
  UploadCloud,
  FileImage,
  Sparkles,
  Info,
  Check,
  Compass,
  TrendingUp,
  Gauge,
  Maximize2,
} from 'lucide-react';
import { Stroke, StrokeMetrics, StrokePoint } from '../types';
import { calculateStrokeMetrics, processHandwritingImageScan } from '../utils/strokeAnalytics';

interface BiometricCanvasProps {
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[], metrics: StrokeMetrics, scanDataUrl?: string) => void;
  initialMetrics?: StrokeMetrics;
}

export const BiometricCanvas: React.FC<BiometricCanvasProps> = ({
  strokes,
  onStrokesChange,
  initialMetrics,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([]);
  const [activeMode, setActiveMode] = useState<'draw' | 'scan'>('draw');
  const [showZonalGrid, setShowZonalGrid] = useState(true);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [metrics, setMetrics] = useState<StrokeMetrics>(
    initialMetrics || {
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
    }
  );

  // Scan state
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [scanEdgeMapUrl, setScanEdgeMapUrl] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  // Redraw canvas whenever strokes, grid, or replay changes
  const renderCanvas = useCallback(
    (strokesToRender: Stroke[], currentDraftPoints: StrokePoint[] = []) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear & Background
      ctx.fillStyle = '#0A0A0B';
      ctx.fillRect(0, 0, w, h);

      // 1. Zonal Guidelines & Dynamic Grids
      if (showZonalGrid) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;

        // Subtle graph grid
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Tri-zonal Graphology Guides
        const upperH = h * 0.3;
        const baselineY = h * 0.7;

        // Baseline (Emerald guide)
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.35)';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, baselineY);
        ctx.lineTo(w, baselineY);
        ctx.stroke();

        // Upper Zone boundary (Cyan guide)
        ctx.strokeStyle = 'rgba(0, 209, 255, 0.35)';
        ctx.beginPath();
        ctx.moveTo(0, upperH);
        ctx.lineTo(w, upperH);
        ctx.stroke();

        // Labels
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(0, 209, 255, 0.6)';
        ctx.fillText('UPPER ZONE (Ideation/Aspiration)', 14, upperH - 6);
        ctx.fillStyle = 'rgba(0, 255, 157, 0.6)';
        ctx.fillText('BASELINE HORIZON (Emotional Stamina)', 14, baselineY - 6);
        ctx.restore();
      }

      // 2. Render Completed Strokes
      strokesToRender.forEach((stroke) => {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < pts.length; i++) {
          const p1 = pts[i - 1];
          const p2 = pts[i];

          const pressure = (p1.pressure + p2.pressure) / 2;
          const strokeWidth = Math.max(1.8, Math.min(6.5, pressure * 5.2));

          ctx.beginPath();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = strokeWidth;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Subtle cyan neon core glow for biometric feel
          ctx.strokeStyle = 'rgba(0, 209, 255, 0.35)';
          ctx.lineWidth = strokeWidth + 2;
          ctx.stroke();
        }
      });

      // 3. Render Draft Points currently being drawn
      if (currentDraftPoints.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < currentDraftPoints.length; i++) {
          const p1 = currentDraftPoints[i - 1];
          const p2 = currentDraftPoints[i];
          const strokeWidth = Math.max(2, Math.min(6, (p1.pressure + p2.pressure) * 2.8));

          ctx.beginPath();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = strokeWidth;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    },
    [showZonalGrid]
  );

  useEffect(() => {
    renderCanvas(strokes, currentStroke);
  }, [strokes, currentStroke, renderCanvas]);

  // Pointer event handlers for drawing with pressure tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeMode !== 'draw' || isPlayingReplay) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Use native pointer pressure if supported, fallback to velocity estimation
    const rawPressure = e.pressure > 0 ? e.pressure : 0.65;
    const startPoint: StrokePoint = {
      x,
      y,
      pressure: rawPressure,
      time: Date.now(),
    };

    setIsDrawing(true);
    setCurrentStroke([startPoint]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeMode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const lastPoint = currentStroke[currentStroke.length - 1];
    const dt = Math.max(now - (lastPoint?.time || now), 1);
    const dist = Math.hypot(x - (lastPoint?.x || x), y - (lastPoint?.y || y));
    const velocity = dist / dt;

    // Calculate dynamic synthetic pressure if e.pressure is standard
    let calculatedPressure = e.pressure > 0 ? e.pressure : Math.max(0.3, Math.min(0.95, 0.8 - velocity * 0.15));

    const newPoint: StrokePoint = {
      x,
      y,
      pressure: calculatedPressure,
      time: now,
      velocity,
    };

    const updatedDraft = [...currentStroke, newPoint];
    setCurrentStroke(updatedDraft);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeMode !== 'draw') return;
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        id: `stroke-${Date.now()}`,
        points: currentStroke,
      };

      const updatedStrokes = [...strokes, newStroke];
      const newMetrics = calculateStrokeMetrics(updatedStrokes);
      setMetrics(newMetrics);
      onStrokesChange(updatedStrokes, newMetrics);
    }

    setCurrentStroke([]);
  };

  const handleClear = () => {
    setScanPreviewUrl(null);
    setScanEdgeMapUrl(null);
    setCurrentStroke([]);
    onStrokesChange([], {
      strokeCount: 0,
      slantAngleDeg: 12,
      baselineSlopeDeg: 3,
      avgPressure: 0.5,
      pressureVariance: 0.03,
      totalLengthPx: 0,
      aspectRatio: 2.2,
      penLifts: 0,
      curvatureIndex: 1.1,
      sampleType: 'signature',
    });
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const updated = strokes.slice(0, -1);
    const newMetrics = calculateStrokeMetrics(updated);
    setMetrics(newMetrics);
    onStrokesChange(updated, newMetrics);
  };

  // Replay animation
  const handlePlayReplay = () => {
    if (strokes.length === 0 || isPlayingReplay) return;
    setIsPlayingReplay(true);
    setReplayIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current > strokes.length) {
        clearInterval(interval);
        setIsPlayingReplay(false);
      } else {
        renderCanvas(strokes.slice(0, current));
      }
    }, 320);
  };

  // Image Scan Upload Handler
  const handleScanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingScan(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const result = await processHandwritingImageScan(base64Data);
        setScanPreviewUrl(result.enhancedScanDataUrl);
        setScanEdgeMapUrl(result.edgeMapDataUrl);
        setMetrics(result.metrics);
        onStrokesChange(strokes, result.metrics, base64Data);
      } catch (err) {
        console.error('Scan processing failure:', err);
      } finally {
        setIsProcessingScan(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Load sample signature template
  const handleLoadSampleTemplate = (type: 'executive' | 'creative' | 'balanced') => {
    let sampleStrokes: Stroke[] = [];
    if (type === 'executive') {
      sampleStrokes = [
        {
          id: 's1',
          points: [
            { x: 50, y: 190, pressure: 0.85, time: 0 },
            { x: 90, y: 70, pressure: 0.95, time: 100 },
            { x: 130, y: 180, pressure: 0.8, time: 200 },
            { x: 170, y: 90, pressure: 0.9, time: 300 },
            { x: 210, y: 170, pressure: 0.75, time: 400 },
          ],
        },
        {
          id: 's2',
          points: [
            { x: 230, y: 160, pressure: 0.75, time: 450 },
            { x: 280, y: 145, pressure: 0.7, time: 530 },
            { x: 330, y: 135, pressure: 0.8, time: 610 },
            { x: 380, y: 115, pressure: 0.88, time: 700 },
            { x: 420, y: 90, pressure: 0.92, time: 780 },
          ],
        },
        {
          id: 's3',
          points: [
            { x: 40, y: 215, pressure: 0.9, time: 820 },
            { x: 240, y: 200, pressure: 0.92, time: 920 },
            { x: 450, y: 175, pressure: 0.96, time: 1050 },
            { x: 470, y: 160, pressure: 0.9, time: 1100 },
          ],
        },
      ];
    } else if (type === 'creative') {
      sampleStrokes = [
        {
          id: 'c1',
          points: [
            { x: 60, y: 170, pressure: 0.6, time: 0 },
            { x: 100, y: 95, pressure: 0.65, time: 120 },
            { x: 140, y: 75, pressure: 0.7, time: 220 },
            { x: 180, y: 135, pressure: 0.6, time: 310 },
            { x: 220, y: 165, pressure: 0.55, time: 400 },
          ],
        },
        {
          id: 'c2',
          points: [
            { x: 240, y: 155, pressure: 0.6, time: 450 },
            { x: 290, y: 105, pressure: 0.68, time: 540 },
            { x: 340, y: 150, pressure: 0.62, time: 630 },
            { x: 390, y: 90, pressure: 0.7, time: 720 },
            { x: 430, y: 130, pressure: 0.58, time: 810 },
          ],
        },
      ];
    } else {
      sampleStrokes = [
        {
          id: 'b1',
          points: [
            { x: 70, y: 175, pressure: 0.75, time: 0 },
            { x: 110, y: 80, pressure: 0.8, time: 110 },
            { x: 150, y: 175, pressure: 0.78, time: 210 },
          ],
        },
        {
          id: 'b2',
          points: [
            { x: 170, y: 170, pressure: 0.7, time: 260 },
            { x: 220, y: 130, pressure: 0.72, time: 340 },
            { x: 270, y: 170, pressure: 0.74, time: 420 },
            { x: 340, y: 140, pressure: 0.8, time: 520 },
          ],
        },
        {
          id: 'b3',
          points: [
            { x: 60, y: 195, pressure: 0.85, time: 580 },
            { x: 360, y: 195, pressure: 0.85, time: 720 },
          ],
        },
      ];
    }

    const calculated = calculateStrokeMetrics(sampleStrokes);
    setMetrics(calculated);
    onStrokesChange(sampleStrokes, calculated);
  };

  return (
    <div className="w-full bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-4 lg:p-6 shadow-2xl flex flex-col gap-4">
      {/* Top Bar: Mode switcher & quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F1F24]">
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#141418] p-1 border border-[#1F1F24]">
            <button
              onClick={() => setActiveMode('draw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'draw'
                  ? 'bg-[#00D1FF] text-black shadow-md shadow-[#00D1FF]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✍️ Digital Ink Vector Canvas
            </button>
            <button
              onClick={() => setActiveMode('scan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'scan'
                  ? 'bg-[#00D1FF] text-black shadow-md shadow-[#00D1FF]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📷 Scan / Upload Handwriting
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeMode === 'draw' && (
            <>
              <button
                onClick={() => setShowZonalGrid(!showZonalGrid)}
                className={`p-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  showZonalGrid
                    ? 'bg-[#00D1FF]/15 text-[#00D1FF] border-[#00D1FF]/30'
                    : 'bg-[#141418] text-slate-400 border-[#1F1F24] hover:text-white'
                }`}
                title="Toggle Graphology Tri-Zone Grid"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden md:inline">Zonal Guides</span>
              </button>

              <button
                onClick={handlePlayReplay}
                disabled={strokes.length === 0 || isPlayingReplay}
                className="px-2.5 py-2 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-slate-300 border border-[#1F1F24] text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
              >
                {isPlayingReplay ? <Pause className="w-4 h-4 animate-spin text-[#FFB800]" /> : <Play className="w-4 h-4 text-[#00FF9D]" />}
                <span className="hidden md:inline">Replay</span>
              </button>

              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-2 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-slate-300 border border-[#1F1F24] text-xs font-semibold disabled:opacity-40"
                title="Undo Stroke"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleClear}
                className="p-2 rounded-lg bg-[#FF2E63]/10 hover:bg-[#FF2E63]/20 text-[#FF2E63] border border-[#FF2E63]/30 text-xs font-semibold"
                title="Clear Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Quick template drawer */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#1F1F24]">
            <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">Templates:</span>
            <button
              onClick={() => handleLoadSampleTemplate('executive')}
              className="px-2 py-1 rounded-md bg-[#141418] hover:bg-[#1C1C22] text-[11px] font-semibold text-slate-300 border border-[#1F1F24]"
            >
              Apex Leader
            </button>
            <button
              onClick={() => handleLoadSampleTemplate('creative')}
              className="px-2 py-1 rounded-md bg-[#141418] hover:bg-[#1C1C22] text-[11px] font-semibold text-slate-300 border border-[#1F1F24]"
            >
              Lateral Visionary
            </button>
            <button
              onClick={() => handleLoadSampleTemplate('balanced')}
              className="px-2 py-1 rounded-md bg-[#141418] hover:bg-[#1C1C22] text-[11px] font-semibold text-slate-300 border border-[#1F1F24]"
            >
              Stoic Shield
            </button>
          </div>
        </div>
      </div>

      {/* Main Vector Canvas OR Scan Upload Area */}
      {activeMode === 'draw' ? (
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-[#1F1F24] bg-[#0A0A0B] touch-none select-none shadow-inner group">
          <canvas
            ref={canvasRef}
            width={640}
            height={320}
            className="w-full h-full cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Canvas Placeholder hint if empty */}
          {strokes.length === 0 && !isDrawing && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-[#0A0A0B]/90 to-transparent">
              <div className="w-12 h-12 rounded-2xl bg-[#00D1FF]/10 border border-[#00D1FF]/20 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-[#00D1FF] animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-white">
                Sign or write with your mouse, trackpad, or stylus
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                MindMatters captures real-time pen velocity, stroke curvature, baseline ascendance (θ), and kinetic pressure variance.
              </p>
            </div>
          )}

          {/* Real-time floating telemetry HUD */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-2.5 py-1 rounded-lg bg-[#0F0F11]/90 backdrop-blur-md border border-[#1F1F24] text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#00D1FF]" />
                <span>Slant θ:</span>
                <span className="font-bold text-white">{metrics.slantAngleDeg.toFixed(1)}°</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-[#0F0F11]/90 backdrop-blur-md border border-[#1F1F24] text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#00FF9D]" />
                <span>Baseline:</span>
                <span className="font-bold text-white">{metrics.baselineSlopeDeg.toFixed(1)}°</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-[#0F0F11]/90 backdrop-blur-md border border-[#1F1F24] text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Pressure:</span>
                <span className="font-bold text-white">{(metrics.avgPressure * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-[#0F0F11]/90 backdrop-blur-md border border-[#1F1F24] text-[11px] font-mono text-slate-400 hidden sm:block">
              Strokes: <span className="text-white font-bold">{metrics.strokeCount}</span> | Lifts: <span className="text-white font-bold">{metrics.penLifts}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Image Scan Upload Arena */
        <div className="w-full min-h-[320px] rounded-xl border-2 border-dashed border-[#1F1F24] bg-[#0A0A0B] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {scanPreviewUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-center">
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Original Handwriting Scan</div>
                <img
                  src={scanPreviewUrl}
                  alt="Original scan"
                  className="max-h-56 rounded-lg border border-[#1F1F24] object-contain shadow-lg"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider mb-2 font-mono">CV Edge & Slant Vector Tensor Map</div>
                {scanEdgeMapUrl ? (
                  <img
                    src={scanEdgeMapUrl}
                    alt="CV Tensor Edge Map"
                    className="max-h-56 rounded-lg border border-[#00FF9D]/30 object-contain shadow-lg"
                  />
                ) : (
                  <div className="w-full h-48 rounded-lg bg-[#0F0F11] flex items-center justify-center text-xs text-slate-500 font-mono">
                    Extracting tensors...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#00D1FF]/10 border border-[#00D1FF]/25 flex items-center justify-center mb-4 text-[#00D1FF]">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Upload Handwriting Scan or Signature Image</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Our computer vision tensor pipeline extracts Otsu grayscale thresholding, Sobel edge slants, and baseline curvature directly from your photo.
              </p>
              <label className="mt-5 px-5 py-2.5 rounded-xl bg-[#00D1FF] hover:bg-[#33DCFF] text-black font-bold text-xs cursor-pointer shadow-lg shadow-[#00D1FF]/25 transition-transform active:scale-95 flex items-center gap-2">
                <FileImage className="w-4 h-4" />
                <span>Select JPG / PNG Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScanUpload}
                  className="hidden"
                />
              </label>
            </>
          )}

          {isProcessingScan && (
            <div className="absolute inset-0 bg-[#0A0A0B]/85 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-white font-mono">Computing Grapho-CV Tensors & Edge Histogram...</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Mathematical Dimension Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Slant Angle (θ)</span>
          <span className="text-base font-black text-white mt-1">
            {metrics.slantAngleDeg > 0 ? `+${metrics.slantAngleDeg}°` : `${metrics.slantAngleDeg}°`}
          </span>
          <span className="text-[10px] text-[#00D1FF] mt-0.5">
            {metrics.slantAngleDeg > 18
              ? 'Expressive & Proactive'
              : metrics.slantAngleDeg < -5
              ? 'Guarded & Self-Reliant'
              : 'Objective Poise'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Baseline Gradient</span>
          <span className="text-base font-black text-white mt-1">
            {metrics.baselineSlopeDeg > 0 ? `+${metrics.baselineSlopeDeg}°` : `${metrics.baselineSlopeDeg}°`}
          </span>
          <span className="text-[10px] text-[#00FF9D] mt-0.5">
            {metrics.baselineSlopeDeg > 3 ? 'High Ambition & Stamina' : metrics.baselineSlopeDeg < -2 ? 'Energy Deficit' : 'Grounded Horizon'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Kinetic Pressure</span>
          <span className="text-base font-black text-white mt-1">
            {metrics.avgPressure.toFixed(2)} <span className="text-xs font-normal text-slate-400">g/px</span>
          </span>
          <span className="text-[10px] text-[#FFB800] mt-0.5">
            {metrics.avgPressure > 0.75 ? 'Deep Sensory Conviction' : 'Agile Light Fluidity'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Curvature Index</span>
          <span className="text-base font-black text-white mt-1">{metrics.curvatureIndex.toFixed(2)}x</span>
          <span className="text-[10px] text-[#00D1FF] mt-0.5">
            {metrics.curvatureIndex > 1.4 ? 'Expansive Lateral Loops' : 'Direct Angular Precision'}
          </span>
        </div>
      </div>
    </div>
  );
};
