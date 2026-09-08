import React, { useState, useEffect, useRef } from 'react';
import { X, Check, RotateCcw, Loader2, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B2F]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-sm bg-[#F4ECDD] border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-2xl shadow-[#1B1B2F]/40">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#1B1B2F]/15">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#1B1B2F]">
                Typing Rhythm Dynamics
              </h3>
              <p className="text-xs text-[#5B5B70] font-lora italic">
                Type the classical passage naturally to measure dwell latency and cognitive cadence
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

        <div className="my-5 p-4 rounded-sm bg-[#E8DFC9]/70 border border-[#8B5E34]/30 shadow-inner">
          <div className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8B5E34] mb-1.5 flex items-center justify-between">
            <span>Target Passage</span>
            <button
              onClick={() => setPassageIndex((prev) => (prev + 1) % PASSAGES.length)}
              className="text-[11px] text-[#A13D3D] hover:underline transition-colors cursor-pointer font-cinzel"
            >
              Switch passage ↻
            </button>
          </div>
          <p className="text-sm sm:text-base text-[#1B1B2F] font-lora leading-relaxed italic">
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
            className="w-full p-3.5 rounded-sm bg-[#F4ECDD] border-2 border-[#8B5E34]/40 text-sm text-[#1B1B2F] placeholder:text-[#7A7A8F] placeholder:italic focus:outline-none focus:border-[#1B1B2F] transition-colors resize-none font-lora shadow-inner"
          />
          <div className="flex items-center justify-between text-xs text-[#6B6B80] font-lora mt-1 px-1 italic">
            <span>Keystrokes recorded: {keystrokes.length}</span>
            <span>Chars: {typedText.length} / {targetPassage.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F] bg-[#E8DFC9] hover:bg-[#D9CEB4] border border-[#1B1B2F]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8B5E34]" />
            <span>Restart</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-xs font-cinzel font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || keystrokes.length < 5}
              className="px-5 py-2.5 rounded-sm font-cinzel text-xs font-bold tracking-wider text-[#F4ECDD] bg-[#A13D3D] hover:bg-[#832F2F] shadow-md shadow-[#A13D3D]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F4ECDD]" />
                  <span>Calibrating Rhythm...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#F4ECDD]" />
                  <span>Analyze Cadence</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
