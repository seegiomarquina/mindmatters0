import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Loader2, AlertCircle, Camera, Sparkles } from 'lucide-react';
import { analyzeHandwritingApi } from '../services/api';
import { HandwritingAnalysisResponse } from '../types';

interface HandwritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: HandwritingAnalysisResponse) => void;
  initialFile?: File | null;
}

export const HandwritingModal: React.FC<HandwritingModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  initialFile
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialFile) {
        setSelectedFile(initialFile);
        setPreviewUrl(URL.createObjectURL(initialFile));
      }
      setErrorMessage(null);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or snap a photo of regular handwriting.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeHandwritingApi(selectedFile);
      onAnalysisComplete(result);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Handwriting morphology analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B2F]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-sm bg-[#F4ECDD] border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-2xl shadow-[#1B1B2F]/40">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1B1B2F]/15">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F]">
                Handwriting Morphology Scan
              </h3>
              <p className="text-xs text-[#5B5B70] font-lora italic">
                Upload a document scan or note page for OpenCV biometric extraction
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
          {previewUrl ? (
            <div className="relative rounded-sm overflow-hidden border-2 border-[#C9A24B] bg-[#E8DFC9] h-60 flex items-center justify-center group shadow-inner">
              <img
                src={previewUrl}
                alt="Handwriting preview"
                className="max-h-full object-contain"
              />
              <label className="absolute inset-0 bg-[#1B1B2F]/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 cursor-pointer transition-opacity text-xs font-cinzel font-bold text-[#F4ECDD]">
                <Upload className="w-4 h-4 text-[#C9A24B]" />
                <span>Replace Sample</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#8B5E34]/40 hover:border-[#8B5E34] rounded-sm p-8 flex flex-col items-center justify-center gap-3 bg-[#E8DFC9]/40 hover:bg-[#E8DFC9]/70 cursor-pointer transition-all">
              <div className="w-12 h-12 rounded-sm bg-[#8B5E34]/10 border border-[#8B5E34]/20 flex items-center justify-center text-[#8B5E34]">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-center font-lora">
                <p className="text-sm font-semibold text-[#1B1B2F]">
                  Click to snap photo or upload image
                </p>
                <p className="text-xs text-[#6B6B80] mt-1 italic">
                  Supports JPG, PNG document scans or handwritten diary pages
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#6B6B80] font-lora italic">
            * Measurable features separated from clinical interpretations
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !selectedFile}
              className="px-5 py-2.5 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md shadow-[#A13D3D]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4ECDD]" />
                  <span>Extracting 10+ Features...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                  <span>Process Handwriting</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
