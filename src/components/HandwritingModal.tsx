import React, { useState } from 'react';
import { X, Upload, Check, Loader2, AlertCircle, Camera } from 'lucide-react';
import { analyzeHandwritingApi } from '../services/api';
import { HandwritingAnalysisResponse } from '../types';

interface HandwritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: HandwritingAnalysisResponse) => void;
}

export const HandwritingModal: React.FC<HandwritingModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-purple-950/50">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Handwriting Image Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Upload a photo/scan of regular handwritten notes (not a signature)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="my-6">
          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-slate-950 h-56 flex items-center justify-center group">
              <img
                src={previewUrl}
                alt="Handwriting preview"
                className="max-h-full object-contain"
              />
              <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 cursor-pointer transition-opacity text-xs font-semibold text-purple-300">
                <Upload className="w-4 h-4" />
                <span>Replace Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-200">
                  Click to snap photo or upload image
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG document scans or notebook photos
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

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !selectedFile}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-300 hover:to-indigo-300 shadow-md shadow-purple-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Segmenting Page...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Scan Handwriting</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
