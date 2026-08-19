import React, { useState, useRef } from 'react';
import {
  X,
  PenLine,
  Keyboard,
  UploadCloud,
  FileImage,
  Camera,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Eye,
  Zap,
} from 'lucide-react';
import { BiometricCanvas } from './BiometricCanvas';
import { KeystrokeArena } from './KeystrokeArena';
import { HandwritingScanIcon } from '../sections/Services';
import { Stroke, StrokeMetrics, KeystrokeEvent, KeystrokeMetrics, PsychometricsData, BiometricReport } from '../types';
import { processHandwritingImageScan } from '../utils/strokeAnalytics';
import { calculateDeterministicBiometricReport } from '@/utils/heuristics';

// Sample handwriting pages that users can test immediately
const SAMPLE_HANDWRITING_PAGES = [
  {
    id: 'sample-exec',
    name: 'Executive Strategy Journal',
    desc: 'Firm pressure, ascending baseline, rightward slant (+16°)',
    slant: 16.2,
    baseline: 5.4,
    pressure: 0.82,
    zone: { upper: 38, middle: 44, lower: 18 },
    svgPreview: (
      <svg viewBox="0 0 200 80" className="w-full h-full" fill="none">
        <path d="M10 25 Q 35 15, 60 22 T 110 18 T 160 20 T 190 15" stroke="#00D1FF" strokeWidth="2" />
        <path d="M10 45 Q 40 38, 80 42 T 130 36 T 175 40 T 190 35" stroke="#00D1FF" strokeWidth="1.8" />
        <path d="M10 65 Q 45 58, 90 62 T 140 56 T 180 60" stroke="#00D1FF" strokeWidth="1.8" />
        <line x1="5" y1="75" x2="195" y2="70" stroke="#00FF9D" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    id: 'sample-creative',
    name: 'Creative Lateral Ideation',
    desc: 'Expansive loops, fluid connectors, light buoyant pressure',
    slant: 11.5,
    baseline: 3.1,
    pressure: 0.58,
    zone: { upper: 28, middle: 52, lower: 20 },
    svgPreview: (
      <svg viewBox="0 0 200 80" className="w-full h-full" fill="none">
        <path d="M10 28 C 25 10, 50 40, 75 25 C 100 10, 125 40, 150 25 C 170 12, 185 30, 195 22" stroke="#A78BFA" strokeWidth="2" />
        <path d="M10 50 C 30 35, 60 60, 85 45 C 115 30, 145 60, 170 45 T 195 42" stroke="#A78BFA" strokeWidth="1.8" />
        <line x1="5" y1="75" x2="195" y2="75" stroke="#00FF9D" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    id: 'sample-deliberate',
    name: 'Analytical Precision Notes',
    desc: 'Vertical stance (90°), tight consistency, high focus',
    slant: 1.8,
    baseline: 0.5,
    pressure: 0.76,
    zone: { upper: 30, middle: 48, lower: 22 },
    svgPreview: (
      <svg viewBox="0 0 200 80" className="w-full h-full" fill="none">
        <path d="M10 25 L 25 15 L 40 25 L 60 18 L 80 25 L 105 16 L 130 25 L 155 18 L 180 25" stroke="#38BDF8" strokeWidth="2" />
        <path d="M10 48 L 30 40 L 55 48 L 80 40 L 110 48 L 140 40 L 170 48 T 190 44" stroke="#38BDF8" strokeWidth="1.8" />
        <line x1="5" y1="75" x2="195" y2="75" stroke="#00FF9D" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
];

export interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'sign' | 'typing' | 'handwriting' | 'funnel';
  onReportGenerated: (report: BiometricReport, rawData: any) => void;
}

export function AssessmentModal({
  isOpen,
  onClose,
  initialTab = 'handwriting',
  onReportGenerated,
}: AssessmentModalProps) {
  const [activeTab, setActiveTab] = useState<'sign' | 'typing' | 'handwriting' | 'funnel'>(initialTab);

  // States for live data
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [strokeMetrics, setStrokeMetrics] = useState<StrokeMetrics>({
    strokeCount: 4,
    slantAngleDeg: 14.5,
    baselineSlopeDeg: 4.8,
    avgPressure: 0.74,
    pressureVariance: 0.035,
    totalLengthPx: 450,
    aspectRatio: 2.4,
    penLifts: 3,
    curvatureIndex: 1.25,
    sampleType: 'handwriting',
    zoneDistribution: { upper: 32, middle: 48, lower: 20 },
  });

  const [keystrokeMetrics, setKeystrokeMetrics] = useState<KeystrokeMetrics>({
    avgDwellTimeMs: 92.0,
    avgFlightTimeMs: 130.0,
    jitterVariance: 175.0,
    cadenceEntropy: 1.68,
    wpm: 76,
    hesitationCount: 1,
    backspaceRate: 0.02,
    totalKeystrokes: 140,
  });

  const [psychometrics, setPsychometrics] = useState<PsychometricsData>({
    primaryGoal: 'Executive Leadership & Unshakeable Authority',
    stressLevel: 'Moderate High-Stakes Pressure',
    decisionStyle: 'Decisive & Intuitive with Strategic Verification',
    focusChallenges: 'Subconscious cognitive drag and perfectionist friction',
  });

  // Handwriting image scan states
  const [scanImageBase64, setScanImageBase64] = useState<string | null>(null);
  const [edgeMapUrl, setEdgeMapUrl] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedSamplePage, setSelectedSamplePage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState(false);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  // Handle handwriting image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setScanImageBase64(base64);
      try {
        const result = await processHandwritingImageScan(base64);
        setEdgeMapUrl(result.edgeMapDataUrl);
        setStrokeMetrics(result.metrics);
      } catch (err) {
        console.error('CV analysis error:', err);
      } finally {
        setIsProcessingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Start webcam for handwriting photo snapshot
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setScanImageBase64(dataUrl);

      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);

      setIsProcessingImage(true);
      try {
        const result = await processHandwritingImageScan(dataUrl);
        setEdgeMapUrl(result.edgeMapDataUrl);
        setStrokeMetrics(result.metrics);
      } catch (err) {
        console.error('CV photo error:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSelectSamplePage = (sample: typeof SAMPLE_HANDWRITING_PAGES[0]) => {
    setSelectedSamplePage(sample.id);
    setStrokeMetrics({
      strokeCount: 12,
      slantAngleDeg: sample.slant,
      baselineSlopeDeg: sample.baseline,
      avgPressure: sample.pressure,
      pressureVariance: 0.038,
      totalLengthPx: 1250,
      aspectRatio: 2.6,
      penLifts: 8,
      curvatureIndex: 1.35,
      sampleType: 'handwriting',
      zoneDistribution: sample.zone,
    });
  };

  // Run backend synthesis
  const handleGenerateReport = async () => {
    setIsLoadingSynthesis(true);
    try {
      const payload = {
        strokeMetrics,
        keystrokeMetrics,
        psychometrics,
        imageScanBase64: scanImageBase64 || undefined,
      };

      const res = await fetch('/api/analyze-biometrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          onReportGenerated(data.report, {
            strokes,
            strokeMetrics,
            keystrokeMetrics,
            psychometrics,
          });
          onClose();
          const reportEl = document.getElementById('report');
          if (reportEl) reportEl.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // Fallback deterministic
      const fallback = calculateDeterministicBiometricReport(payload) as BiometricReport;
      onReportGenerated(fallback, { strokes, strokeMetrics, keystrokeMetrics, psychometrics });
      onClose();
      const reportEl = document.getElementById('report');
      if (reportEl) reportEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.warn('Synthesis failed, using local tensor engine:', err);
      const fallback = calculateDeterministicBiometricReport({
        strokeMetrics,
        keystrokeMetrics,
        psychometrics,
      }) as BiometricReport;
      onReportGenerated(fallback, { strokes, strokeMetrics, keystrokeMetrics, psychometrics });
      onClose();
    } finally {
      setIsLoadingSynthesis(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0F0F11] border border-[#1F1F24] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 my-auto">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F1F24] bg-[#141418]/60">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 text-white shadow-md">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                MindMatters Diagnostic Laboratory
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Multimodal Computer Vision & Neuro-Motor Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Strip */}
        <div className="grid grid-cols-4 border-b border-[#1F1F24] bg-[#0A0A0B]">
          <button
            onClick={() => setActiveTab('handwriting')}
            className={`py-3 px-2 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'handwriting'
                ? 'border-[#00D1FF] text-[#00D1FF] bg-[#00D1FF]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HandwritingScanIcon className="w-4 h-4 text-inherit" />
            <span className="hidden sm:inline">Handwriting Image Scan</span>
            <span className="sm:hidden">Handwriting</span>
          </button>

          <button
            onClick={() => setActiveTab('sign')}
            className={`py-3 px-2 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sign'
                ? 'border-[#00D1FF] text-[#00D1FF] bg-[#00D1FF]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenLine className="w-4 h-4 text-inherit" />
            <span className="hidden sm:inline">Signature Canvas</span>
            <span className="sm:hidden">Signature</span>
          </button>

          <button
            onClick={() => setActiveTab('typing')}
            className={`py-3 px-2 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'typing'
                ? 'border-[#00D1FF] text-[#00D1FF] bg-[#00D1FF]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4 text-inherit" />
            <span className="hidden sm:inline">Typing Arena</span>
            <span className="sm:hidden">Typing</span>
          </button>

          <button
            onClick={() => setActiveTab('funnel')}
            className={`py-3 px-2 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'funnel'
                ? 'border-[#00D1FF] text-[#00D1FF] bg-[#00D1FF]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-inherit" />
            <span className="hidden sm:inline">Calibration & Goals</span>
            <span className="sm:hidden">Goals</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-5 lg:p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* TAB 1: HANDWRITING IMAGE ANALYSIS */}
          {activeTab === 'handwriting' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HandwritingScanIcon className="w-4 h-4 text-teal-400" />
                    Handwriting Image Analysis (Computer Vision)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Snap a photo or upload a page of your regular handwriting (not a signature, not a face). Our CV tensor model analyzes letter size, spacing, slant, and baseline formation.
                  </p>
                </div>
              </div>

              {/* Upload or Camera Snapshot Viewfinder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Box */}
                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1F1F24] bg-[#0A0A0B] p-6 text-center overflow-hidden min-h-[240px]">
                  {scanImageBase64 ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <img
                        src={scanImageBase64}
                        alt="Uploaded handwriting"
                        className="max-h-40 rounded-xl border border-[#1F1F24] object-contain shadow-lg"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1C1C22] text-xs font-semibold text-slate-300 border border-[#1F1F24] cursor-pointer">
                          <span>Change Photo</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button
                          onClick={() => {
                            setScanImageBase64(null);
                            setEdgeMapUrl(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : isCameraActive ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-44 rounded-xl object-cover" />
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={captureCameraPhoto}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/30"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Capture Page</span>
                        </button>
                        <button
                          onClick={() => setIsCameraActive(false)}
                          className="px-3 py-2 rounded-xl bg-[#141418] text-slate-400 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center mb-3 text-teal-400">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-white">Upload Handwriting Photo or Scan</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Supports notebook pages, notepad paragraphs, and written drafts (JPG, PNG).
                      </p>
                      <div className="mt-4 flex items-center gap-2.5 flex-wrap justify-center">
                        <label className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold cursor-pointer shadow-lg shadow-teal-500/25 transition-transform active:scale-95 flex items-center gap-1.5">
                          <FileImage className="w-4 h-4" />
                          <span>Select Image File</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1C1C22] text-slate-200 border border-[#1F1F24] text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Camera className="w-4 h-4 text-teal-400" />
                          <span>Snap Photo</span>
                        </button>
                      </div>
                    </>
                  )}

                  {isProcessingImage && (
                    <div className="absolute inset-0 bg-[#0A0A0B]/85 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs font-bold text-teal-300 font-mono">
                        Extracting Handwriting Tensors...
                      </p>
                    </div>
                  )}
                </div>

                {/* CV Tensor Edge Map Output */}
                <div className="rounded-2xl border border-[#1F1F24] bg-[#0A0A0B] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F1F24]">
                    <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                      CV Tensor Vector Histogram
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">
                      Otsu + Sobel 2.8
                    </span>
                  </div>

                  <div className="my-3 flex items-center justify-center min-h-[120px] bg-[#141418]/60 rounded-xl border border-[#1F1F24] p-3">
                    {edgeMapUrl ? (
                      <img src={edgeMapUrl} alt="Edge map" className="max-h-32 object-contain" />
                    ) : (
                      <div className="text-center p-3">
                        <Zap className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                        <p className="text-xs text-slate-400">
                          {selectedSamplePage
                            ? 'Sample Page Telemetry Loaded'
                            : 'Upload image or select a sample page below to view CV tensors'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-[#141418] border border-[#1F1F24] text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Slant θ</span>
                      <p className="text-xs font-black text-white font-mono mt-0.5">
                        +{strokeMetrics.slantAngleDeg.toFixed(1)}°
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#141418] border border-[#1F1F24] text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Baseline</span>
                      <p className="text-xs font-black text-teal-400 font-mono mt-0.5">
                        +{strokeMetrics.baselineSlopeDeg.toFixed(1)}°
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#141418] border border-[#1F1F24] text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Pressure</span>
                      <p className="text-xs font-black text-amber-400 font-mono mt-0.5">
                        {(strokeMetrics.avgPressure * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Handwriting Pages to try instantly */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">
                  Or Test with Sample Handwriting Pages:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_HANDWRITING_PAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSamplePage(sample)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        selectedSamplePage === sample.id
                          ? 'border-teal-400 bg-teal-400/10 shadow-lg shadow-teal-500/10'
                          : 'border-[#1F1F24] bg-[#141418] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{sample.name}</span>
                        {selectedSamplePage === sample.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        )}
                      </div>
                      <div className="h-12 w-full bg-[#0A0A0B] rounded-lg p-1 border border-[#1F1F24]">
                        {sample.svgPreview}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{sample.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGNATURE CANVAS */}
          {activeTab === 'sign' && (
            <div className="flex flex-col gap-4">
              <BiometricCanvas
                strokes={strokes}
                onStrokesChange={(s, m) => {
                  setStrokes(s);
                  setStrokeMetrics(m);
                }}
                initialMetrics={strokeMetrics}
              />
            </div>
          )}

          {/* TAB 3: KEYSTROKE ARENA */}
          {activeTab === 'typing' && (
            <div className="flex flex-col gap-4">
              <KeystrokeArena
                onMetricsChange={(km) => {
                  setKeystrokeMetrics(km);
                }}
                initialMetrics={keystrokeMetrics}
              />
            </div>
          )}

          {/* TAB 4: CALIBRATION & GOALS */}
          {activeTab === 'funnel' && (
            <div className="p-4 rounded-2xl bg-[#141418] border border-[#1F1F24] flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Cognitive & Behavioral Trait Calibration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ground the AI grapho-data science engine with your current executive goals and mental bottlenecks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300 font-mono">Primary Strategic Goal</label>
                  <select
                    value={psychometrics.primaryGoal}
                    onChange={(e) => setPsychometrics({ ...psychometrics, primaryGoal: e.target.value })}
                    className="bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#00D1FF]"
                  >
                    <option>Executive Leadership & Unshakeable Authority</option>
                    <option>Creative Breakthrough & Rapid Lateral Innovation</option>
                    <option>High-Stakes Crisis Resilience & Stoic Poise</option>
                    <option>Elimination of Cognitive Friction & Perfectionist Hesitation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300 font-mono">Environmental Stress Load</label>
                  <select
                    value={psychometrics.stressLevel}
                    onChange={(e) => setPsychometrics({ ...psychometrics, stressLevel: e.target.value })}
                    className="bg-[#0A0A0B] border border-[#1F1F24] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#00D1FF]"
                  >
                    <option>Moderate High-Stakes Pressure</option>
                    <option>Intense Critical Execution Sprint</option>
                    <option>Low / Rested Baseline Equilibrium</option>
                    <option>Overloaded / Chronic Cognitive Strain</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#1F1F24] bg-[#141418]">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>
              Telemetry: {strokeMetrics.strokeCount} stroke lines · {keystrokeMetrics.wpm} WPM · Slant +{strokeMetrics.slantAngleDeg.toFixed(1)}°
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0A0A0B] hover:bg-[#1F1F24] text-slate-300 text-xs font-semibold border border-[#1F1F24] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isLoadingSynthesis}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isLoadingSynthesis ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Multimodal Report...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Generate Unified Mind Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
