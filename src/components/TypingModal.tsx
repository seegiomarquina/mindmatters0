import React, { useState, useEffect, useRef } from 'react';
import { X, Check, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { analyzeTypingApi } from '../services/api';
import { KeystrokeItem, TypingAnalysisResponse } from '../types';

interface TypingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: TypingAnalysisResponse) => void;
}

const PASSAGES = [
  "Clarity of thought is achieved when we maintain a steady rhythm and embrace mindful pauses throughout the day.",
  "In moments of high focus, the mind synchronizes with action, turning complex challenges into steady steps forward.",
  "Balanced awareness allows us to navigate pressure with resilience and adapt smoothly to changing circumstances."
];

export const TypingModal: React.FC<TypingModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const [passageIndex, setPassageIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [keystrokes, setKeystrokes] = useState<KeystrokeItem[]>([]);
  const [activeKeyTimes, setActiveKeyTimes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const targetPassage = PASSAGES[passageIndex];

  useEffect(() => {
    if (isOpen) {
      setTypedText('');
      setKeystrokes([]);
      setActiveKeyTimes({});
      setErrorMessage(null);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, passageIndex]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = performance.now();
    setActiveKeyTimes((prev) => ({ ...prev, [e.key]: now }));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = performance.now();
    const downTime = activeKeyTimes[e.key] || now - 60;

    const newKey: KeystrokeItem = {
      key: e.key,
      keydown: downTime,
      keyup: now
    };

    setKeystrokes((prev) => [...prev, newKey]);
  };

  const handleReset = () => {
    setTypedText('');
    setKeystrokes([]);
    setActiveKeyTimes({});
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const handleAnalyze = async () => {
    if (keystrokes.length < 5) {
      setErrorMessage('Please type at least a few words to evaluate keystroke rhythm.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeTypingApi(keystrokes);
      onAnalysisComplete(result);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Typing analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⌨️</span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Typing Pattern Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Type the passage naturally below to measure cadence and cognitive rhythm
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

        <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center justify-between">
            <span>Target Passage</span>
            <button
              onClick={() => setPassageIndex((prev) => (prev + 1) % PASSAGES.length)}
              className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Switch passage ↻
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-200 font-serif leading-relaxed italic">
            "{targetPassage}"
          </p>
        </div>

        <div className="mb-5">
          <textarea
            ref={inputRef}
            rows={3}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Start typing the passage here..."
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1 px-1">
            <span>Keystrokes recorded: {keystrokes.length}</span>
            <span>Chars: {typedText.length} / {targetPassage.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || keystrokes.length < 5}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing Cadence...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Analyze Typing</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
