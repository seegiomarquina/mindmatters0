import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  X,
  Eraser,
  Check,
  Upload,
  Loader2,
  Sparkles,
  AlertCircle,
  Feather,
  Undo2,
  PenTool,
  Sliders,
  CheckCircle2,
  Activity,
  Gauge
} from 'lucide-react';
import { analyzeSignatureApi } from '../services/api';
import { SignatureAnalysisResponse } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: SignatureAnalysisResponse) => void;
}

interface Point {
  x: number;
  y: number;
  time: number;
  pressure: number;
  width: number;
}

interface Stroke {
  id: string;
  points: Point[];
  color: string;
  penType: 'fountain' | 'rollerball' | 'calligraphy';
  baseWidth: number;
}

const INK_PALETTE = [
  { id: 'midnight', name: 'Midnight Blue', color: '#142850', label: 'Classic Fountain Ink' },
  { id: 'obsidian', name: 'Executive Obsidian', color: '#16161D', label: 'Archival Deep Black' },
  { id: 'burgundy', name: 'Imperial Burgundy', color: '#4E1428', label: 'Vintage Wine Ink' },
  { id: 'sepia', name: 'Vintage Sepia', color: '#3E2718', label: 'Antique Calligraphy' }
];

const NIB_SIZES = [
  { id: 'fine', name: 'Fine', value: 2.2, label: '0.5mm' },
  { id: 'medium', name: 'Medium', value: 3.4, label: '0.7mm' },
  { id: 'broad', name: 'Broad', value: 4.8, label: '1.0mm' }
];

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Pen configuration
  const [selectedPen, setSelectedPen] = useState<'fountain' | 'rollerball' | 'calligraphy'>('fountain');
  const [selectedInk, setSelectedInk] = useState<string>(INK_PALETTE[0].color);
  const [selectedNibSize, setSelectedNibSize] = useState<number>(NIB_SIZES[1].value);

  // Real-time telemetry feedback
  const [liveVelocity, setLiveVelocity] = useState<number>(0);
  const [livePressure, setLivePressure] = useState<number>(75);
  const [smoothedVelocity, setSmoothedVelocity] = useState<number>(0);

  // Dimensions
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 680,
    height: 280
  });

  // Calculate width from velocity and pen style
  const calculateStrokeWidth = useCallback(
    (
      velocity: number,
      rawPressure: number,
      baseWidth: number,
      penType: 'fountain' | 'rollerball' | 'calligraphy',
      prevWidth: number,
      angle: number
    ): number => {
      let targetWidth = baseWidth;

      if (penType === 'fountain') {
        // High speed = graceful calligraphic thinning; Slow speed = rich ink flow & pooling
        const velocityFactor = 0.45;
        const speedInfluence = 1 / (1 + velocity * velocityFactor);
        targetWidth = baseWidth * (0.55 + 0.9 * speedInfluence);

        // Hardware pressure integration if available (tablets/stylus)
        if (rawPressure > 0 && rawPressure !== 0.5) {
          targetWidth *= 0.4 + rawPressure * 1.1;
        }

        // Clamp
        targetWidth = Math.max(baseWidth * 0.4, Math.min(baseWidth * 1.6, targetWidth));
      } else if (penType === 'rollerball') {
        // Velvety consistent liquid rollerball with mild natural tapering
        const speedInfluence = 1 / (1 + velocity * 0.2);
        targetWidth = baseWidth * (0.8 + 0.35 * speedInfluence);
        targetWidth = Math.max(baseWidth * 0.65, Math.min(baseWidth * 1.25, targetWidth));
      } else if (penType === 'calligraphy') {
        // Angled italic broad-edge nib
        const angleModulation = Math.abs(Math.sin(angle - Math.PI / 4));
        targetWidth = baseWidth * (0.45 + 0.95 * angleModulation);
        targetWidth = Math.max(baseWidth * 0.4, Math.min(baseWidth * 1.5, targetWidth));
      }

      // Smooth transition to avoid sudden steps
      return prevWidth * 0.65 + targetWidth * 0.35;
    },
    []
  );

  // Draw a smooth stroke using quadratic Bézier curves with sub-segment width interpolation
  const drawSmoothStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
      const pts = stroke.points;
      if (pts.length === 0) return;

      ctx.save();
      ctx.fillStyle = stroke.color;
      ctx.strokeStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Soft ink absorption shadow
      ctx.shadowColor = `${stroke.color}25`;
      ctx.shadowBlur = 1.0;

      // Single dot
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, pts[0].width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // Two points (simple tapered line)
      if (pts.length === 2) {
        ctx.beginPath();
        ctx.lineWidth = (pts[0].width + pts[1].width) / 2;
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.stroke();
        ctx.restore();
        return;
      }

      // 3 or more points: Quadratic Bezier curves through midpoints with sub-segment width rendering
      for (let i = 1; i < pts.length - 1; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];

        // Midpoints
        const mid1X = (p0.x + p1.x) / 2;
        const mid1Y = (p0.y + p1.y) / 2;
        const mid2X = (p1.x + p2.x) / 2;
        const mid2Y = (p1.y + p2.y) / 2;

        const startX = i === 1 ? p0.x : mid1X;
        const startY = i === 1 ? p0.y : mid1Y;
        const endX = i === pts.length - 2 ? p2.x : mid2X;
        const endY = i === pts.length - 2 ? p2.y : mid2Y;

        // Subdivide quadratic curve into 5 segments to smoothly taper the stroke thickness
        const steps = 5;
        let lastX = startX;
        let lastY = startY;

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const invT = 1 - t;

          // Quadratic Bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
          const curX = invT * invT * startX + 2 * invT * t * p1.x + t * t * endX;
          const curY = invT * invT * startY + 2 * invT * t * p1.y + t * t * endY;

          // Interpolated width along this step
          const curWidth = p0.width + (p1.width - p0.width) * (i / pts.length) + (t * (p2.width - p1.width)) / steps;

          ctx.beginPath();
          ctx.lineWidth = Math.max(1.0, curWidth);
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          lastX = curX;
          lastY = curY;
        }
      }

      ctx.restore();
    },
    []
  );

  // Redraw entire canvas with guidelines and all strokes
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Archival Parchment Paper Texture Background
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Subtle fine paper fiber grain lines
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 16; y < cssHeight; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssWidth, y);
      ctx.stroke();
    }

    // 2. Classical Signature Rule & Signatory Baseline
    const baselineY = cssHeight * 0.72;

    // Elegant Sign Here '✕' Mark
    ctx.font = '600 18px "Cinzel Decorative", Georgia, serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.45)';
    ctx.fillText('✕', 28, baselineY + 5);

    // Ruled dashed guideline
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(56, baselineY);
    ctx.lineTo(cssWidth - 36, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Watermark & Subtext
    ctx.font = '500 9px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.4)';
    ctx.fillText('SIGNATORY BASELINE • ADMISSIBLE BIOMETRIC RECORD', 58, baselineY + 16);

    ctx.font = '400 8.5px "Lora", serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.28)';
    ctx.fillText('MINDMATTERS • 120Hz HIGH-PRECISION INK SENSING', cssWidth - 250, 22);

    // 3. Render Completed Strokes
    strokes.forEach((stroke) => {
      drawSmoothStroke(ctx, stroke);
    });

    // 4. Render Current Active Stroke
    if (currentStroke.length > 0) {
      const activeStroke: Stroke = {
        id: 'draft',
        points: currentStroke,
        color: selectedInk,
        penType: selectedPen,
        baseWidth: selectedNibSize
      };
      drawSmoothStroke(ctx, activeStroke);
    }

    ctx.restore();
  }, [strokes, currentStroke, selectedInk, selectedPen, selectedNibSize, drawSmoothStroke]);

  // Canvas size adjustment with High-DPI support
  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const targetWidth = Math.floor(rect.width) || 680;
    const targetHeight = 280;

    setCanvasDimensions({ width: targetWidth, height: targetHeight });

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;

    renderCanvas();
  }, [renderCanvas]);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow modal animation to mount container
      const t = setTimeout(() => {
        setupCanvasSize();
      }, 50);
      window.addEventListener('resize', setupCanvasSize);
      return () => {
        clearTimeout(t);
        window.removeEventListener('resize', setupCanvasSize);
      };
    }
  }, [isOpen, setupCanvasSize]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  if (!isOpen) return null;

  // Pointer Events for ultra-soft, low-latency, pressure-responsive inking
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rawPressure = e.pressure > 0 ? e.pressure : 0.65;
    const initialWidth = selectedNibSize * (0.8 + rawPressure * 0.4);

    const startPoint: Point = {
      x,
      y,
      time: performance.now(),
      pressure: rawPressure,
      width: initialWidth
    };

    setIsDrawing(true);
    setErrorMessage(null);
    setCurrentStroke([startPoint]);
    setLivePressure(Math.round(rawPressure * 100));
    setLiveVelocity(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentStroke.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lastPoint = currentStroke[currentStroke.length - 1];
    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const dist = Math.hypot(dx, dy);

    // Reject micro-jitters under 1.5px to keep curves butter-smooth
    if (dist < 1.4) return;

    const now = performance.now();
    const dt = Math.max(now - lastPoint.time, 1);
    const instantaneousVelocity = dist / dt;

    // Low-pass filter for smooth velocity transitions
    const newSmoothedVelocity = smoothedVelocity * 0.65 + instantaneousVelocity * 0.35;
    setSmoothedVelocity(newSmoothedVelocity);
    setLiveVelocity(Math.round(newSmoothedVelocity * 100));

    const rawPressure = e.pressure > 0 ? e.pressure : 0.65;
    setLivePressure(Math.round(rawPressure * 100));

    const angle = Math.atan2(dy, dx);
    const calculatedWidth = calculateStrokeWidth(
      newSmoothedVelocity,
      rawPressure,
      selectedNibSize,
      selectedPen,
      lastPoint.width,
      angle
    );

    const newPoint: Point = {
      x,
      y,
      time: now,
      pressure: rawPressure,
      width: calculatedWidth
    };

    setCurrentStroke((prev) => [...prev, newPoint]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (currentStroke.length > 1) {
      const finalizedStroke: Stroke = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        points: currentStroke,
        color: selectedInk,
        penType: selectedPen,
        baseWidth: selectedNibSize
      };

      setStrokes((prev) => [...prev, finalizedStroke]);
    }

    setCurrentStroke([]);
    setLiveVelocity(0);
  };

  // Undo last stroke
  const handleUndo = () => {
    if (strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  // Clear canvas
  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setUploadedFile(null);
    setErrorMessage(null);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const dpr = Math.max(window.devicePixelRatio || 1, 2);
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = '#FAF6EE';
          ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
          ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
          ctx.restore();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution Export for Computer Vision Backend
  const handleAnalyze = async () => {
    if (strokes.length === 0 && !uploadedFile) {
      setErrorMessage('Please sign on the parchment pad or upload a signed slip first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      let blobToSend: Blob;

      if (uploadedFile) {
        blobToSend = uploadedFile;
      } else {
        // Build dedicated pure clean canvas for OpenCV processing
        // Pure high contrast strokes without background watermark noise
        const exportCanvas = document.createElement('canvas');
        const exportWidth = 800;
        const exportHeight = 360;
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;

        const expCtx = exportCanvas.getContext('2d');
        if (!expCtx) throw new Error('Export canvas context creation failed');

        // Clean white/parchment background for maximum binarization accuracy
        expCtx.fillStyle = '#FAF6EE';
        expCtx.fillRect(0, 0, exportWidth, exportHeight);

        // Scale factors from interactive canvas to export dimensions
        const scaleX = exportWidth / canvasDimensions.width;
        const scaleY = exportHeight / canvasDimensions.height;

        expCtx.save();
        expCtx.scale(scaleX, scaleY);

        strokes.forEach((stroke) => {
          drawSmoothStroke(expCtx, stroke);
        });
        expCtx.restore();

        blobToSend = await new Promise<Blob>((resolve, reject) => {
          exportCanvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to generate signature blob'));
          }, 'image/png');
        });
      }

      const result = await analyzeSignatureApi(blobToSend);
      onAnalysisComplete(result);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Signature analysis engine encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasContent = strokes.length > 0 || uploadedFile !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0C0E14]/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-xl bg-[#FAF6EE] border-2 border-[#8B5E34]/35 shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8B5E34]/20 bg-[#F4ECD9]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B5E34]/15 border border-[#8B5E34]/30 flex items-center justify-center text-[#8B5E34]">
              <Feather className="w-5 h-5 text-[#8B5E34]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F] tracking-wide">
                  Signature Biometrics &amp; Graphology
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#8B5E34]/15 text-[#6D4219] font-bold border border-[#8B5E34]/25">
                  120Hz Fluid Inking
                </span>
              </div>
              <p className="text-xs text-[#5B5B70] font-lora italic">
                Sign smoothly with trackpad, mouse, or stylus on archival document parchment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#1B1B2F]/60 hover:text-[#1B1B2F] hover:bg-[#1B1B2F]/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-[#A13D3D]/10 border border-[#A13D3D]/30 text-[#A13D3D] text-xs flex items-center gap-2 font-lora">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Workspace */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Pen Customization Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-[#EFE6D2]/80 border border-[#8B5E34]/25 text-xs">
            
            {/* Pen Nib Style */}
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase mr-1 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-[#8B5E34]" /> Pen Nib:
              </span>
              <button
                type="button"
                onClick={() => setSelectedPen('fountain')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedPen === 'fountain'
                    ? 'bg-[#142850] text-[#FAF6EE] shadow-sm'
                    : 'bg-[#FAF6EE]/80 text-[#1B1B2F] hover:bg-[#FAF6EE]'
                }`}
                title="Fountain Pen with velocity-adaptive calligraphic tapering"
              >
                🖋️ Fountain Pen
              </button>
              <button
                type="button"
                onClick={() => setSelectedPen('rollerball')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedPen === 'rollerball'
                    ? 'bg-[#142850] text-[#FAF6EE] shadow-sm'
                    : 'bg-[#FAF6EE]/80 text-[#1B1B2F] hover:bg-[#FAF6EE]'
                }`}
                title="Velvety smooth liquid rollerball"
              >
                ✒️ Gel Rollerball
              </button>
              <button
                type="button"
                onClick={() => setSelectedPen('calligraphy')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedPen === 'calligraphy'
                    ? 'bg-[#142850] text-[#FAF6EE] shadow-sm'
                    : 'bg-[#FAF6EE]/80 text-[#1B1B2F] hover:bg-[#FAF6EE]'
                }`}
                title="Broad-edge calligraphic angle modulation"
              >
                🖊️ Calligraphy
              </button>
            </div>

            {/* Ink Shade Selector */}
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase">
                Ink:
              </span>
              <div className="flex items-center gap-1.5">
                {INK_PALETTE.map((ink) => (
                  <button
                    key={ink.id}
                    type="button"
                    onClick={() => setSelectedInk(ink.color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedInk === ink.color
                        ? 'scale-110 border-[#C9A24B] shadow-md'
                        : 'border-white/60 hover:scale-105 opacity-85'
                    }`}
                    style={{ backgroundColor: ink.color }}
                    title={`${ink.name} (${ink.label})`}
                  />
                ))}
              </div>
            </div>

            {/* Nib Width */}
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase">
                Weight:
              </span>
              <div className="flex items-center gap-1 bg-[#FAF6EE]/80 p-0.5 rounded border border-[#8B5E34]/20">
                {NIB_SIZES.map((nib) => (
                  <button
                    key={nib.id}
                    type="button"
                    onClick={() => setSelectedNibSize(nib.value)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedNibSize === nib.value
                        ? 'bg-[#8B5E34] text-white'
                        : 'text-[#6D4219] hover:bg-[#EFE6D2]'
                    }`}
                  >
                    {nib.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Document Parchment Canvas Pad */}
          <div
            ref={containerRef}
            className="relative w-full rounded-xl overflow-hidden border-2 border-[#8B5E34]/35 bg-[#FAF6EE] shadow-inner select-none"
            style={{
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.06), 0 4px 18px rgba(139,94,52,0.12)'
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-[280px] touch-none cursor-crosshair block"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />

            {/* Watermark & Empty Prompt Overlay */}
            {strokes.length === 0 && !uploadedFile && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#8B5E34]/10 border border-[#8B5E34]/20 flex items-center justify-center mb-2">
                  <Feather className="w-6 h-6 text-[#8B5E34] animate-pulse" />
                </div>
                <p className="font-cinzel text-sm font-bold text-[#1B1B2F]/80">
                  Sign above the ruled line with your laptop trackpad, mouse, or stylus
                </p>
                <p className="font-lora text-xs text-[#5B5B70] italic mt-1 max-w-md">
                  Natural ink physics apply: fast sweeps taper smoothly while gentle pauses deposit richer ink.
                </p>
              </div>
            )}

            {/* Real-time Telemetry HUD Strip */}
            <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none flex items-center justify-between text-[11px] font-mono text-[#6D4219]/80 bg-[#FAF6EE]/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#8B5E34]/20">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#142850]" />
                  <span>Velocity:</span>
                  <strong className="text-[#1B1B2F]">{liveVelocity} px/s</strong>
                </span>
                <span className="hidden sm:flex items-center gap-1 border-l border-[#8B5E34]/25 pl-3">
                  <Gauge className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>Fluid Pressure:</span>
                  <strong className="text-[#1B1B2F]">{livePressure}%</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>Strokes: <strong className="text-[#1B1B2F]">{strokes.length}</strong></span>
                {strokes.length > 0 && (
                  <span className="text-emerald-700 font-semibold hidden md:inline flex items-center gap-1">
                    • Fluid Spline Active
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="px-3.5 py-2 rounded-lg text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#EFE6D2] hover:bg-[#E2D6BE] border border-[#8B5E34]/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Undo last stroke (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#6D4219]" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!hasContent}
                className="px-3.5 py-2 rounded-lg text-xs font-cinzel font-bold text-[#A13D3D] bg-[#A13D3D]/10 hover:bg-[#A13D3D]/20 border border-[#A13D3D]/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Clear entire parchment"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Clear Pad</span>
              </button>

              <label className="px-3.5 py-2 rounded-lg text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#EFE6D2] hover:bg-[#E2D6BE] border border-[#8B5E34]/25 transition-all flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#6D4219]" />
                <span>Upload Signed Slip</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !hasContent}
                className="px-5 py-2.5 rounded-lg font-cinzel text-xs font-bold tracking-wider text-[#FAF6EE] bg-[#142850] hover:bg-[#0E1E3D] shadow-lg shadow-[#142850]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FAF6EE]" />
                    <span>Calibrating Grapho-Kinetics...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#C9A24B]" />
                    <span>Analyze Signature</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
