import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  X,
  Eraser,
  Upload,
  Loader2,
  Feather,
  Undo2,
  PenTool,
  CheckCircle2,
  Activity,
  Gauge,
  Sparkles,
  AlertCircle,
  Wand2
} from 'lucide-react';
import { analyzeSignatureApi } from '../services/api';
import { SignatureAnalysisResponse } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: SignatureAnalysisResponse) => void;
}

interface RawPoint {
  x: number;
  y: number;
  time: number;
  pressure: number;
}

interface RenderPoint {
  x: number;
  y: number;
  width: number;
  time: number;
}

interface SmoothStroke {
  id: string;
  points: RenderPoint[];
  color: string;
  penType: 'fountain' | 'rollerball' | 'calligraphy';
  baseWidth: number;
}

const INK_PALETTE = [
  { id: 'royal-navy', name: 'Royal Navy', color: '#132A54', label: 'Diplomatic Fountain Ink' },
  { id: 'carbon-black', name: 'Archival Carbon', color: '#15151C', label: 'Deep Executive Black' },
  { id: 'vintage-wine', name: 'Imperial Bordeaux', color: '#4A1527', label: 'Royal Wine Ink' },
  { id: 'antique-sepia', name: 'Vintage Sepia', color: '#3A2314', label: 'Antique Calligraphy' }
];

const NIB_SIZES = [
  { id: 'fine', name: 'Fine', value: 2.2, label: '0.5mm' },
  { id: 'medium', name: 'Medium', value: 3.4, label: '0.7mm' },
  { id: 'broad', name: 'Broad', value: 4.8, label: '1.0mm' }
];

// Curated high-prestige autograph templates for instant live demonstration
const SAMPLE_AUTOGRAPHS: Record<string, { name: string; strokes: { points: [number, number, number][] }[] }> = {
  executive: {
    name: 'Apex Executive Cursive',
    strokes: [
      {
        // Capital flourishing sweep
        points: [
          [55, 175, 0.4], [62, 140, 0.8], [75, 95, 1.2], [90, 72, 1.4], [108, 62, 1.2],
          [125, 75, 0.9], [135, 105, 0.7], [138, 145, 0.8], [132, 178, 1.1], [118, 195, 1.3],
          [100, 198, 1.2], [82, 182, 0.8], [72, 155, 0.7], [70, 128, 0.8], [78, 102, 1.0],
          [92, 85, 1.2], [115, 80, 1.3], [145, 90, 1.0], [178, 115, 0.8], [210, 142, 0.9]
        ]
      },
      {
        // Fluent body loops
        points: [
          [210, 142, 0.8], [225, 130, 0.9], [240, 125, 1.0], [252, 138, 0.8], [260, 155, 0.7],
          [272, 135, 0.9], [285, 128, 1.0], [298, 142, 0.8], [308, 160, 0.7], [320, 132, 1.0],
          [335, 125, 1.1], [350, 145, 0.8], [365, 162, 0.7], [382, 138, 0.9], [405, 122, 1.2],
          [430, 110, 1.3], [460, 98, 1.1], [490, 88, 0.6]
        ]
      },
      {
        // Confident dynamic paraph (underline baseline flourish)
        points: [
          [80, 208, 0.6], [120, 206, 0.9], [180, 204, 1.2], [260, 202, 1.4], [340, 198, 1.5],
          [420, 194, 1.3], [480, 188, 1.0], [525, 180, 0.7], [550, 172, 0.3]
        ]
      }
    ]
  },
  creative: {
    name: 'Dynamic Fluid Flow',
    strokes: [
      {
        points: [
          [70, 160, 0.5], [85, 110, 1.0], [105, 75, 1.3], [130, 68, 1.2], [155, 82, 0.9],
          [170, 118, 0.7], [175, 158, 0.9], [165, 185, 1.2], [140, 192, 1.1], [115, 175, 0.8],
          [100, 140, 0.9], [105, 105, 1.1], [128, 85, 1.2], [165, 80, 1.0], [215, 95, 0.8],
          [260, 125, 0.9], [295, 155, 0.7], [315, 170, 0.8], [335, 150, 1.0], [355, 125, 1.1]
        ]
      },
      {
        points: [
          [355, 125, 0.9], [375, 145, 0.8], [395, 165, 0.7], [415, 135, 1.0], [435, 115, 1.2],
          [465, 95, 1.4], [500, 82, 1.1], [530, 75, 0.4]
        ]
      },
      {
        points: [
          [130, 215, 0.5], [210, 210, 1.0], [310, 202, 1.3], [410, 192, 1.4], [490, 182, 1.1],
          [540, 172, 0.5]
        ]
      }
    ]
  }
};

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core drawing state
  const [strokes, setStrokes] = useState<SmoothStroke[]>([]);
  const [currentRawPoints, setCurrentRawPoints] = useState<RawPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Pen configuration
  const [selectedPen, setSelectedPen] = useState<'fountain' | 'rollerball' | 'calligraphy'>('fountain');
  const [selectedInk, setSelectedInk] = useState<string>(INK_PALETTE[0].color);
  const [selectedNibSize, setSelectedNibSize] = useState<number>(NIB_SIZES[1].value);

  // Live telemetry HUD
  const [liveVelocity, setLiveVelocity] = useState<number>(0);
  const [livePressure, setLivePressure] = useState<number>(78);
  const [smoothedVelocity, setSmoothedVelocity] = useState<number>(0);

  // Canvas dimensions in CSS pixels
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 720,
    height: 300
  });

  // Calculate dynamic width based on velocity & pen dynamics
  const computePointWidth = useCallback(
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
        // Natural ink physics: Fast movement thins out gracefully into calligraphic feathers,
        // while slow pauses cause ink to settle and pool softly
        const velocityFactor = 0.42;
        const velocityDamping = 1 / (1 + velocity * velocityFactor);
        targetWidth = baseWidth * (0.52 + 0.95 * velocityDamping);

        // Stylus hardware pressure modulation
        if (rawPressure > 0 && rawPressure !== 0.5) {
          targetWidth *= 0.35 + rawPressure * 1.15;
        }

        targetWidth = Math.max(baseWidth * 0.38, Math.min(baseWidth * 1.65, targetWidth));
      } else if (penType === 'rollerball') {
        // Continuous, silky-consistent liquid roller with gentle natural taper
        const speedInfluence = 1 / (1 + velocity * 0.18);
        targetWidth = baseWidth * (0.82 + 0.32 * speedInfluence);
        targetWidth = Math.max(baseWidth * 0.65, Math.min(baseWidth * 1.25, targetWidth));
      } else if (penType === 'calligraphy') {
        // Broad italic nib angle dynamics
        const angleModulation = Math.abs(Math.sin(angle - Math.PI / 4));
        targetWidth = baseWidth * (0.4 + 1.05 * angleModulation);
        targetWidth = Math.max(baseWidth * 0.35, Math.min(baseWidth * 1.6, targetWidth));
      }

      // Smooth step transition to prevent bead / sausage artifacts
      return prevWidth * 0.68 + targetWidth * 0.32;
    },
    []
  );

  // Convert raw stream of trackpad/mouse points into a smoothed, low-pass filtered stroke
  const smoothRawPoints = useCallback(
    (rawPts: RawPoint[], penType: 'fountain' | 'rollerball' | 'calligraphy', baseWidth: number): RenderPoint[] => {
      if (rawPts.length === 0) return [];

      // 1. Position smoothing filter (Streamline spring filter to eradicate trackpad jitter)
      const smoothedCoords: { x: number; y: number; time: number; pressure: number }[] = [];
      let curX = rawPts[0].x;
      let curY = rawPts[0].y;
      smoothedCoords.push({ x: curX, y: curY, time: rawPts[0].time, pressure: rawPts[0].pressure });

      for (let i = 1; i < rawPts.length; i++) {
        const raw = rawPts[i];
        // 70% target, 30% history smoothing removes micro-stutters while remaining ultra-responsive
        curX = curX * 0.28 + raw.x * 0.72;
        curY = curY * 0.28 + raw.y * 0.72;
        smoothedCoords.push({ x: curX, y: curY, time: raw.time, pressure: raw.pressure });
      }

      // 2. Velocity and width calculation with touchdown & liftoff tapering
      const renderPts: RenderPoint[] = [];
      let runningVelocity = 0;
      let prevWidth = baseWidth * 0.5; // Starts with delicate pen touchdown

      for (let i = 0; i < smoothedCoords.length; i++) {
        const p = smoothedCoords[i];

        if (i === 0) {
          renderPts.push({
            x: p.x,
            y: p.y,
            width: baseWidth * 0.45,
            time: p.time
          });
          continue;
        }

        const prev = smoothedCoords[i - 1];
        const dx = p.x - prev.x;
        const dy = p.y - prev.y;
        const dist = Math.hypot(dx, dy);
        const dt = Math.max(p.time - prev.time, 1);
        const instVelocity = dist / dt;

        runningVelocity = runningVelocity * 0.62 + instVelocity * 0.38;
        const angle = Math.atan2(dy, dx);

        let w = computePointWidth(runningVelocity, p.pressure, baseWidth, penType, prevWidth, angle);

        // Touchdown taper: gently ramp up over first 4 points
        if (i < 4) {
          const ramp = 0.4 + (i / 4) * 0.6;
          w *= ramp;
        }

        prevWidth = w;
        renderPts.push({
          x: p.x,
          y: p.y,
          width: w,
          time: p.time
        });
      }

      // Liftoff taper: taper the final 3 points softly
      const n = renderPts.length;
      if (n >= 4) {
        renderPts[n - 1].width *= 0.35;
        renderPts[n - 2].width *= 0.65;
        renderPts[n - 3].width *= 0.85;
      }

      return renderPts;
    },
    [computePointWidth]
  );

  // Render a velvety smooth ink ribbon using continuous Catmull-Rom / Bézier polygon ribbons
  const drawFluidStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: SmoothStroke) => {
      const pts = stroke.points;
      if (pts.length === 0) return;

      ctx.save();
      ctx.fillStyle = stroke.color;
      ctx.strokeStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Soft microscopic ink spread into parchment fibers
      ctx.shadowColor = `${stroke.color}28`;
      ctx.shadowBlur = 1.0;

      // 1. Single Dot (Dotting an 'i' or period)
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, Math.max(1.2, pts[0].width / 2), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // 2. Continuous Quadratic Bezier Midpoint Spline with Variable Width
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i + 2 < pts.length ? pts[i + 2] : p2;

        const startX = (p0.x + p1.x) / 2;
        const startY = (p0.y + p1.y) / 2;
        const endX = (p1.x + p2.x) / 2;
        const endY = (p1.y + p2.y) / 2;

        // Subdivide into 4 interpolated micro-segments to vary line thickness seamlessly
        const subdivisions = 4;
        let lastX = startX;
        let lastY = startY;

        for (let s = 1; s <= subdivisions; s++) {
          const t = s / subdivisions;
          const invT = 1 - t;

          // Quadratic Bézier curve through midpoints
          const curX = invT * invT * startX + 2 * invT * t * p1.x + t * t * endX;
          const curY = invT * invT * startY + 2 * invT * t * p1.y + t * t * endY;

          // Interpolated stroke width
          const curWidth = p1.width + (p2.width - p1.width) * t;

          ctx.beginPath();
          ctx.lineWidth = Math.max(0.8, curWidth);
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          // Connective round cap
          ctx.beginPath();
          ctx.arc(curX, curY, Math.max(0.4, curWidth / 2), 0, Math.PI * 2);
          ctx.fill();

          lastX = curX;
          lastY = curY;
        }
      }

      ctx.restore();
    },
    []
  );

  // Redraw the complete canvas (Parchment Paper + Signatory Guidelines + Strokes)
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

    // 1. Archival Document Parchment Background
    ctx.fillStyle = '#FAF5EB';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Delicate parchment fiber grain lines
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.035)';
    ctx.lineWidth = 1;
    for (let y = 18; y < cssHeight; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssWidth, y);
      ctx.stroke();
    }

    // 2. Classical Legal Signatory Baseline
    const baselineY = cssHeight * 0.72;

    // Calligraphic Sign Here '✕'
    ctx.font = '700 20px "Cinzel Decorative", Georgia, serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.5)';
    ctx.fillText('✕', 30, baselineY + 6);

    // Ruled dashed guideline
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.4)';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.moveTo(60, baselineY);
    ctx.lineTo(cssWidth - 36, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Document Subscript
    ctx.font = '600 9.5px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.55)';
    ctx.fillText('AUTHORISED SIGNATORY • CONFIDENTIAL INK RECORD', 62, baselineY + 18);

    // Archival Document Watermark (Top Right)
    ctx.font = '600 8.5px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(139, 94, 52, 0.35)';
    ctx.fillText('MINDMATTERS BIOMETRIC CALIBRATION PAD • 120Hz', cssWidth - 280, 24);

    // 3. Render Finalized Strokes
    strokes.forEach((stroke) => {
      drawFluidStroke(ctx, stroke);
    });

    // 4. Render Current Live Active Stroke
    if (currentRawPoints.length > 0) {
      const activeRenderPoints = smoothRawPoints(currentRawPoints, selectedPen, selectedNibSize);
      const activeStroke: SmoothStroke = {
        id: 'active',
        points: activeRenderPoints,
        color: selectedInk,
        penType: selectedPen,
        baseWidth: selectedNibSize
      };
      drawFluidStroke(ctx, activeStroke);
    }

    ctx.restore();
  }, [strokes, currentRawPoints, selectedPen, selectedNibSize, selectedInk, drawFluidStroke, smoothRawPoints]);

  // Adjust canvas for High-DPI screens without blurring or scaling distortion
  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const targetWidth = Math.floor(rect.width) || 720;
    const targetHeight = 300;

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
      const timer = setTimeout(() => {
        setupCanvasSize();
      }, 50);
      window.addEventListener('resize', setupCanvasSize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', setupCanvasSize);
      };
    }
  }, [isOpen, setupCanvasSize]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  if (!isOpen) return null;

  // Pointer Down (Touch, Stylus, Trackpad, Mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rawPressure = e.pressure > 0 ? e.pressure : 0.65;
    const startPt: RawPoint = {
      x,
      y,
      time: performance.now(),
      pressure: rawPressure
    };

    setIsDrawing(true);
    setErrorMessage(null);
    setCurrentRawPoints([startPt]);
    setLivePressure(Math.round(rawPressure * 100));
    setLiveVelocity(0);
  };

  // Pointer Move (Smooth velocity calculation with low-pass filtering)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentRawPoints.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lastPt = currentRawPoints[currentRawPoints.length - 1];
    const dist = Math.hypot(x - lastPt.x, y - lastPt.y);

    // Reject sub-pixel jitter under 1.2px
    if (dist < 1.2) return;

    const now = performance.now();
    const dt = Math.max(now - lastPt.time, 1);
    const instVelocity = dist / dt;

    const newSmoothedVelocity = smoothedVelocity * 0.65 + instVelocity * 0.35;
    setSmoothedVelocity(newSmoothedVelocity);
    setLiveVelocity(Math.round(newSmoothedVelocity * 100));

    const rawPressure = e.pressure > 0 ? e.pressure : 0.65;
    setLivePressure(Math.round(rawPressure * 100));

    const newRawPt: RawPoint = {
      x,
      y,
      time: now,
      pressure: rawPressure
    };

    setCurrentRawPoints((prev) => [...prev, newRawPt]);
  };

  // Pointer Up (Finalize smooth stroke)
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (currentRawPoints.length > 0) {
      const smoothed = smoothRawPoints(currentRawPoints, selectedPen, selectedNibSize);
      if (smoothed.length > 0) {
        const finalizedStroke: SmoothStroke = {
          id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          points: smoothed,
          color: selectedInk,
          penType: selectedPen,
          baseWidth: selectedNibSize
        };
        setStrokes((prev) => [...prev, finalizedStroke]);
      }
    }

    setCurrentRawPoints([]);
    setLiveVelocity(0);
  };

  // Undo Last Stroke
  const handleUndo = () => {
    if (strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  // Clear Canvas
  const handleClear = () => {
    setStrokes([]);
    setCurrentRawPoints([]);
    setUploadedFile(null);
    setErrorMessage(null);
  };

  // Load sample signature template for demonstration
  const handleLoadSampleTemplate = (templateKey: 'executive' | 'creative') => {
    const template = SAMPLE_AUTOGRAPHS[templateKey];
    if (!template) return;

    const sampleStrokes: SmoothStroke[] = template.strokes.map((s, idx) => {
      const pts: RenderPoint[] = s.points.map(([x, y, wFactor]) => ({
        x: (x / 600) * canvasDimensions.width,
        y: (y / 240) * (canvasDimensions.height * 0.85),
        width: selectedNibSize * wFactor,
        time: idx * 100
      }));

      return {
        id: `sample-${idx}`,
        points: pts,
        color: selectedInk,
        penType: selectedPen,
        baseWidth: selectedNibSize
      };
    });

    setStrokes(sampleStrokes);
    setCurrentRawPoints([]);
    setErrorMessage(null);
  };

  // Upload custom signed slip
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
          ctx.fillStyle = '#FAF5EB';
          ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
          ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
          ctx.restore();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Export clean, high-contrast image for OpenCV analysis
  const handleAnalyze = async () => {
    if (strokes.length === 0 && !uploadedFile) {
      setErrorMessage('Please sign on the parchment pad or load an autograph demo first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      let blobToSend: Blob;

      if (uploadedFile) {
        blobToSend = uploadedFile;
      } else {
        // High-resolution clean canvas for computer-vision analysis
        const exportCanvas = document.createElement('canvas');
        const exportWidth = 840;
        const exportHeight = 380;
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;

        const expCtx = exportCanvas.getContext('2d');
        if (!expCtx) throw new Error('Export canvas context creation failed');

        // Pure clean parchment background without watermarks or baseline lines
        expCtx.fillStyle = '#FAF5EB';
        expCtx.fillRect(0, 0, exportWidth, exportHeight);

        const scaleX = exportWidth / canvasDimensions.width;
        const scaleY = exportHeight / canvasDimensions.height;

        expCtx.save();
        expCtx.scale(scaleX, scaleY);

        strokes.forEach((stroke) => {
          drawFluidStroke(expCtx, stroke);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0C0E14]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#FAF5EB] border-2 border-[#8B5E34]/35 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        
        {/* Ornate Document Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8B5E34]/20 bg-[#F4EBD7]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#8B5E34]/15 border border-[#8B5E34]/30 flex items-center justify-center text-[#8B5E34] shadow-sm">
              <Feather className="w-6 h-6 text-[#8B5E34]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#1B1B2F] tracking-wide">
                  Signature Biometrics &amp; Graphology
                </h3>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#132A54]/10 text-[#132A54] font-bold border border-[#132A54]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Liquid Ink Physics
                </span>
              </div>
              <p className="text-xs text-[#5B5B70] font-lora italic mt-0.5">
                Sign smoothly on archival cotton paper • Calibrated with high-DPI Bézier splines
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

        {/* Workspace Body */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Executive Instrument Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#EFE4CF]/90 border border-[#8B5E34]/25 text-xs shadow-sm">
            
            {/* Pen Nib Selection */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase mr-1 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-[#8B5E34]" /> Pen Nib:
              </span>
              <button
                type="button"
                onClick={() => setSelectedPen('fountain')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPen === 'fountain'
                    ? 'bg-[#132A54] text-[#FAF5EB] shadow-md shadow-[#132A54]/30'
                    : 'bg-[#FAF5EB]/90 text-[#1B1B2F] hover:bg-[#FAF5EB]'
                }`}
                title="Montblanc-style velocity-adaptive calligraphic ink flow"
              >
                🖋️ Fountain Pen
              </button>
              <button
                type="button"
                onClick={() => setSelectedPen('rollerball')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPen === 'rollerball'
                    ? 'bg-[#132A54] text-[#FAF5EB] shadow-md shadow-[#132A54]/30'
                    : 'bg-[#FAF5EB]/90 text-[#1B1B2F] hover:bg-[#FAF5EB]'
                }`}
                title="Velvety liquid rollerball glide"
              >
                ✒️ Liquid Rollerball
              </button>
              <button
                type="button"
                onClick={() => setSelectedPen('calligraphy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPen === 'calligraphy'
                    ? 'bg-[#132A54] text-[#FAF5EB] shadow-md shadow-[#132A54]/30'
                    : 'bg-[#FAF5EB]/90 text-[#1B1B2F] hover:bg-[#FAF5EB]'
                }`}
                title="Broad-edge italic calligraphy angle modulation"
              >
                🖊️ Italic Calligraphy
              </button>
            </div>

            {/* Ink Shade Selector */}
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase">
                Ink Shade:
              </span>
              <div className="flex items-center gap-1.5">
                {INK_PALETTE.map((ink) => (
                  <button
                    key={ink.id}
                    type="button"
                    onClick={() => setSelectedInk(ink.color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedInk === ink.color
                        ? 'scale-115 border-[#C9A24B] shadow-md ring-2 ring-[#C9A24B]/30'
                        : 'border-white/70 hover:scale-105 opacity-80'
                    }`}
                    style={{ backgroundColor: ink.color }}
                    title={`${ink.name} (${ink.label})`}
                  />
                ))}
              </div>
            </div>

            {/* Nib Weight (Fine / Medium / Broad) */}
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-bold text-[#6D4219] text-[11px] uppercase">
                Weight:
              </span>
              <div className="flex items-center gap-1 bg-[#FAF5EB]/90 p-0.5 rounded-lg border border-[#8B5E34]/20">
                {NIB_SIZES.map((nib) => (
                  <button
                    key={nib.id}
                    type="button"
                    onClick={() => setSelectedNibSize(nib.value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                      selectedNibSize === nib.value
                        ? 'bg-[#8B5E34] text-white shadow-sm'
                        : 'text-[#6D4219] hover:bg-[#EFE4CF]'
                    }`}
                  >
                    {nib.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Templates Button for Presentation */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#8B5E34]/20">
              <span className="text-[11px] font-cinzel font-bold text-[#8B5E34] uppercase hidden lg:inline">
                Autograph Presets:
              </span>
              <button
                type="button"
                onClick={() => handleLoadSampleTemplate('executive')}
                className="px-2.5 py-1 rounded-md bg-[#FAF5EB]/90 hover:bg-[#FAF5EB] text-[#1B1B2F] border border-[#8B5E34]/25 text-[11px] font-bold flex items-center gap-1 transition-all"
                title="Load executive cursive signature"
              >
                <Wand2 className="w-3 h-3 text-[#C9A24B]" />
                <span>Apex Executive</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleTemplate('creative')}
                className="px-2.5 py-1 rounded-md bg-[#FAF5EB]/90 hover:bg-[#FAF5EB] text-[#1B1B2F] border border-[#8B5E34]/25 text-[11px] font-bold flex items-center gap-1 transition-all"
                title="Load dynamic fluid signature"
              >
                <Sparkles className="w-3 h-3 text-[#132A54]" />
                <span>Fluid Flow</span>
              </button>
            </div>

          </div>

          {/* Luxury Archival Cotton Paper Canvas Pad */}
          <div
            ref={containerRef}
            className="relative w-full rounded-2xl overflow-hidden border-2 border-[#8B5E34]/35 bg-[#FAF5EB] select-none"
            style={{
              boxShadow: 'inset 0 3px 14px rgba(139,94,52,0.1), 0 8px 24px rgba(139,94,52,0.15)'
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-[300px] touch-none cursor-crosshair block"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />

            {/* Empty Pad Guidance Watermark */}
            {strokes.length === 0 && !uploadedFile && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#8B5E34]/10 border border-[#8B5E34]/25 flex items-center justify-center mb-2.5 shadow-sm">
                  <Feather className="w-7 h-7 text-[#8B5E34] animate-pulse" />
                </div>
                <p className="font-cinzel text-base font-bold text-[#1B1B2F]/90">
                  Sign your name above the dashed baseline
                </p>
                <p className="font-lora text-xs text-[#5B5B70] italic mt-1 max-w-md">
                  Experience natural fluid resistance: quick cursive strokes taper into calligraphic hairlines while slow pauses deposit richer ink.
                </p>
              </div>
            )}

            {/* Real-time Dynamic Telemetry HUD */}
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between text-[11px] font-mono text-[#6D4219]/90 bg-[#FAF5EB]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#8B5E34]/25 shadow-sm">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#132A54]" />
                  <span>Velocity:</span>
                  <strong className="text-[#1B1B2F] font-bold">{liveVelocity} px/s</strong>
                </span>
                <span className="hidden sm:flex items-center gap-1.5 border-l border-[#8B5E34]/25 pl-3.5">
                  <Gauge className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>Fluid Flow:</span>
                  <strong className="text-[#1B1B2F] font-bold">{livePressure}%</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span>Strokes: <strong className="text-[#1B1B2F] font-bold">{strokes.length}</strong></span>
                <span className="text-emerald-700 font-semibold hidden md:inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Streamline Spline Active
                </span>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#EFE4CF] hover:bg-[#E4D7BF] border border-[#8B5E34]/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                title="Undo last stroke"
              >
                <Undo2 className="w-4 h-4 text-[#6D4219]" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!hasContent}
                className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#A13D3D] bg-[#A13D3D]/10 hover:bg-[#A13D3D]/20 border border-[#A13D3D]/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                title="Clear parchment canvas"
              >
                <Eraser className="w-4 h-4" />
                <span>Clear Pad</span>
              </button>

              <label className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#EFE4CF] hover:bg-[#E4D7BF] border border-[#8B5E34]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                <Upload className="w-4 h-4 text-[#6D4219]" />
                <span>Upload Signed Slip</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !hasContent}
                className="px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider text-[#FAF5EB] bg-[#132A54] hover:bg-[#0D1D3B] shadow-lg shadow-[#132A54]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FAF5EB]" />
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
