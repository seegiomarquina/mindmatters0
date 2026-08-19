import React, { useState, useEffect } from 'react';
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import CategoryStrip from '@/sections/CategoryStrip';
import Services from '@/sections/Services';
import HowItWorks from '@/sections/HowItWorks';
import ReportSection from '@/sections/ReportSection';
import Footer from '@/sections/Footer';
import { AssessmentModal } from '@/components/AssessmentModal';
import { DossierExportModal } from '@/components/DossierExportModal';
import { RemediationStudio } from '@/components/RemediationStudio';
import { ReportDashboard } from '@/components/ReportDashboard';
import { TensorInspector } from '@/components/TensorInspector';
import { KnowledgeMatrix } from '@/components/KnowledgeMatrix';
import { BiometricReport, StrokeMetrics, KeystrokeMetrics } from '@/types';
import { calculateDeterministicBiometricReport } from '@/utils/heuristics';
import { SAMPLE_PROFILES } from '@/data/presets';
import { CheckCircle2, Sparkles, LayoutDashboard, Compass, Layers, Zap, X } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';

export default function Home() {
  const defaultProfile = SAMPLE_PROFILES[0];

  // Global Report State
  const [report, setReport] = useState<BiometricReport>(() => {
    return calculateDeterministicBiometricReport({
      strokeMetrics: defaultProfile.strokeMetrics,
      keystrokeMetrics: defaultProfile.keystrokeMetrics,
      psychometrics: {
        primaryGoal: 'Executive Leadership & Unshakeable Authority',
        stressLevel: 'Moderate High-Stakes Pressure',
        decisionStyle: 'Decisive & Intuitive with Strategic Verification',
        focusChallenges: 'Subconscious cognitive drag and perfectionist friction',
      },
    }) as BiometricReport;
  });

  const [strokeMetrics, setStrokeMetrics] = useState<StrokeMetrics>(defaultProfile.strokeMetrics);
  const [keystrokeMetrics, setKeystrokeMetrics] = useState<KeystrokeMetrics>(defaultProfile.keystrokeMetrics);

  // Modal states
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentInitialTab, setAssessmentInitialTab] = useState<'sign' | 'typing' | 'handwriting' | 'funnel'>('handwriting');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiConnected, setIsAiConnected] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Full studio overlay view (for deep remediation or full dossier inspection)
  const [studioView, setStudioView] = useState<'none' | 'dossier' | 'remediation' | 'tensor' | 'knowledge'>('none');

  // Check health on mount
  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => res.json())
      .then((data) => {
        setIsAiConnected(data.geminiConnected ?? true);
      })
      .catch(() => {
        setIsAiConnected(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAssessment = (mode: 'sign' | 'typing' | 'handwriting' | 'funnel' = 'handwriting') => {
    setAssessmentInitialTab(mode);
    setIsAssessmentModalOpen(true);
  };

  const handleNavSelect = (id: string) => {
    if (id === 'handwriting') {
      handleOpenAssessment('handwriting');
    } else if (id === 'sign') {
      handleOpenAssessment('sign');
    } else if (id === 'typing') {
      handleOpenAssessment('typing');
    } else if (id === 'remediation') {
      setStudioView('remediation');
    } else {
      setStudioView('none');
      scrollToId(id);
    }
  };

  const handleCategorySelect = (target: string) => {
    if (target === 'handwriting') {
      handleOpenAssessment('handwriting');
    } else if (target === 'sign') {
      handleOpenAssessment('sign');
    } else if (target === 'typing') {
      handleOpenAssessment('typing');
    } else {
      setStudioView('none');
      scrollToId(target);
    }
  };

  const handleReportGenerated = (newReport: BiometricReport, rawData: any) => {
    setReport(newReport);
    if (rawData?.strokeMetrics) setStrokeMetrics(rawData.strokeMetrics);
    if (rawData?.keystrokeMetrics) setKeystrokeMetrics(rawData.keystrokeMetrics);
    showToast('✨ Multimodal synthesis complete! Your Mind Report has been updated.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-white font-sans antialiased text-slate-900 selection:bg-teal-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onSelectLink={handleNavSelect}
        onStartAnalysis={() => handleOpenAssessment('handwriting')}
        isAiConnected={isAiConnected}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-2xl bg-slate-950/95 border border-teal-400/40 text-teal-300 text-xs font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Studio View Overlay (Remediation / Deep Dossier / Tensor Inspector / Knowledge) */}
      {studioView !== 'none' ? (
        <div className="pt-24 pb-16 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 text-white border border-white/10 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-teal-400/10 text-teal-300 border border-teal-400/25">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold capitalize">
                  {studioView === 'remediation' && 'Graphotherapy Remediation Studio'}
                  {studioView === 'dossier' && 'Comprehensive Behavioral Dossier'}
                  {studioView === 'tensor' && 'CV Tensor & Keystroke Inspector'}
                  {studioView === 'knowledge' && 'Grapho-Neuroscience Knowledge Matrix'}
                </h2>
                <p className="text-xs text-slate-400">
                  Interactive behavioral rewiring protocols and deep psychometric tensor metrics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 cursor-pointer"
              >
                Export PDF
              </button>
              <button
                onClick={() => setStudioView('none')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Return to Overview</span>
              </button>
            </div>
          </div>

          {studioView === 'remediation' && (
            <RemediationStudio remediation={report.graphotherapyRemediation} />
          )}

          {studioView === 'dossier' && (
            <ReportDashboard
              report={report}
              onNavigateToRemediation={() => setStudioView('remediation')}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {studioView === 'tensor' && (
            <TensorInspector
              strokeMetrics={strokeMetrics}
              keystrokeMetrics={keystrokeMetrics}
              report={report}
              rawStrokesCount={strokeMetrics.strokeCount}
            />
          )}

          {studioView === 'knowledge' && <KnowledgeMatrix />}
        </div>
      ) : (
        <main>
          {/* Main Landing Sections */}
          <Hero onStartAnalysis={(m) => handleOpenAssessment(m)} />
          <CategoryStrip onSelectItem={handleCategorySelect} />
          <Services onSelectMode={(m) => handleOpenAssessment(m)} />
          <HowItWorks />
          <ReportSection
            report={report}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onViewFullReport={() => setStudioView('dossier')}
            onOpenRemediation={() => setStudioView('remediation')}
          />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Interactive Assessment Modal for Live Handwriting / Signature / Typing Analysis */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        initialTab={assessmentInitialTab}
        onReportGenerated={handleReportGenerated}
      />

      {/* Dossier PDF Export Modal */}
      <DossierExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        report={report}
        strokeMetrics={strokeMetrics}
        keystrokeMetrics={keystrokeMetrics}
      />
    </div>
  );
}
