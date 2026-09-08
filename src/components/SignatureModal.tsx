import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check, Upload, Loader2, Sparkles, AlertCircle, Feather } from 'lucide-react';
import { analyzeSignatureApi } from '../services/api';
import { SignatureAnalysisResponse } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: SignatureAnalysisResponse) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#F4ECDD';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1B1B2F';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    setErrorMessage(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#F4ECDD';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setUploadedFile(null);
    setErrorMessage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setHasDrawn(true);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!hasDrawn && !uploadedFile) {
      setErrorMessage('Please draw your signature or upload an image first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      let blobToSend: Blob;
      if (uploadedFile) {
        blobToSend = uploadedFile;
      } else {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not initialized');
        blobToSend = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to export canvas blob'));
          }, 'image/png');
        });
      }

      const result = await analyzeSignatureApi(blobToSend);
      onAnalysisComplete(result);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Signature analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B2F]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-sm bg-[#F4ECDD] border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-2xl shadow-[#1B1B2F]/40">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#1B1B2F]/15">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F]">
                Signature &amp; Sign Analysis
              </h3>
              <p className="text-xs text-[#5B5B70] font-lora italic">
                Draw with pen cursor or upload a signed slip for graphological calibration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#1B1B2F]/60 hover:text-[#1B1B2F] hover:bg-[#1B1B2F]/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-sm bg-[#A13D3D]/10 border border-[#A13D3D]/30 text-[#A13D3D] text-xs flex items-center gap-2 font-lora">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="my-6">
          <div className="relative rounded-sm overflow-hidden border-2 border-[#8B5E34]/40 bg-[#F4ECDD] shadow-inner">
            <canvas
              ref={canvasRef}
              width={540}
              height={220}
              className="w-full h-[220px] touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-[#8B5E34]/60 font-lora">
                <Feather className="w-6 h-6 mb-1 text-[#C9A24B]" />
                <span className="text-xs italic">Sign directly on the parchment pad with mouse or stylus</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={clearCanvas}
              className="px-3 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#E8DFC9] hover:bg-[#D9CEB4] border border-[#1B1B2F]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <label className="px-3 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#E8DFC9] hover:bg-[#D9CEB4] border border-[#1B1B2F]/20 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md shadow-[#A13D3D]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4ECDD]" />
                  <span>Analyzing Velocity...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#F4ECDD]" />
                  <span>Analyze Signature</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
