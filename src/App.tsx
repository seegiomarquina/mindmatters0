import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryStrip } from './components/CategoryStrip';
import { CoreServices } from './components/CoreServices';
import { HowItWorks } from './components/HowItWorks';
import { ReportSection } from './components/ReportSection';
import { Footer } from './components/Footer';

import { SignatureModal } from './components/SignatureModal';
import { TypingModal } from './components/TypingModal';
import { HandwritingModal } from './components/HandwritingModal';
import { ReportViewerModal } from './components/ReportViewerModal';

import {
  SignatureAnalysisResponse,
  TypingAnalysisResponse,
  HandwritingAnalysisResponse,
  GlobalAssessmentState
} from './types';
import { generateReportApi, getReportDownloadUrl } from './services/api';

export const App: React.FC = () => {
  const [assessmentState, setAssessmentState] = useState<GlobalAssessmentState>({
    signatureResult: null,
    typingResult: null,
    handwritingResult: null,
    userName: 'Subject Alpha',
    mindScore: 78,
    latestReportId: null,
  });

  const [activeModal, setActiveModal] = useState<'signature' | 'typing' | 'handwriting' | 'reports' | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignatureComplete = (result: SignatureAnalysisResponse) => {
    setAssessmentState((prev) => {
      const newScore = Math.min(98, Math.max(30, Math.round((prev.mindScore + result.traits.confidence) / 2)));
      return {
        ...prev,
        signatureResult: result,
        mindScore: newScore
      };
    });
    showToast('✨ Signature analyzed successfully!');
  };

  const handleTypingComplete = (result: TypingAnalysisResponse) => {
    setAssessmentState((prev) => {
      const newScore = Math.min(98, Math.max(30, Math.round((prev.mindScore + result.focus_score) / 2)));
      return {
        ...prev,
        typingResult: result,
        mindScore: newScore
      };
    });
    showToast('⚡ Typing rhythm patterns calibrated!');
  };

  const handleHandwritingComplete = (result: HandwritingAnalysisResponse) => {
    setAssessmentState((prev) => {
      const newScore = Math.min(98, Math.max(30, Math.round((prev.mindScore + result.traits.formation_consistency) / 2)));
      return {
        ...prev,
        handwritingResult: result,
        mindScore: newScore
      };
    });
    showToast('📝 Handwriting morphology processed!');
  };

  const handleDownloadReport = async () => {
    setIsGeneratingPdf(true);
    try {
      const res = await generateReportApi({
        user_name: assessmentState.userName,
        signature_result: assessmentState.signatureResult,
        typing_result: assessmentState.typingResult,
        handwriting_result: assessmentState.handwritingResult,
      });

      setAssessmentState((prev) => ({
        ...prev,
        mindScore: res.mind_score,
        latestReportId: res.report_id
      }));

      const downloadLink = document.createElement('a');
      downloadLink.href = getReportDownloadUrl(res.report_id);
      downloadLink.setAttribute('download', `MindMatters_Report_${res.report_id}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      showToast(`📄 Report ${res.report_id} downloaded!`);
    } catch (err: any) {
      showToast(`❌ Failed to compile report: ${err.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCategorySelect = (id: string) => {
    if (id === 'signature') setActiveModal('signature');
    else if (id === 'typing') setActiveModal('typing');
    else if (id === 'handwriting') setActiveModal('handwriting');
    else if (id === 'report') setActiveModal('reports');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100 relative selection:bg-teal-500/30 selection:text-teal-200">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-teal-500/50 shadow-xl shadow-teal-950/60 text-xs sm:text-sm font-semibold text-teal-300 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 1. STICKY NAVBAR */}
      <Navbar
        onOpenSignature={() => setActiveModal('signature')}
        onOpenTyping={() => setActiveModal('typing')}
        onOpenHandwriting={() => setActiveModal('handwriting')}
        onOpenReports={() => setActiveModal('reports')}
      />

      {/* 2. HERO SECTION */}
      <Hero
        onAnalyzeChoice={(mode) => setActiveModal(mode)}
      />

      {/* 3. CATEGORY ICON STRIP */}
      <CategoryStrip
        onSelectCategory={handleCategorySelect}
      />

      {/* 4. CORE SERVICES (3 Large Feature Cards) */}
      <CoreServices
        onOpenSignature={() => setActiveModal('signature')}
        onOpenTyping={() => setActiveModal('typing')}
        onOpenHandwriting={() => setActiveModal('handwriting')}
        signatureResult={assessmentState.signatureResult}
        typingResult={assessmentState.typingResult}
        handwritingResult={assessmentState.handwritingResult}
      />

      {/* 5. HOW IT WORKS */}
      <HowItWorks />

      {/* 6. REPORT DOWNLOAD SECTION */}
      <ReportSection
        signatureResult={assessmentState.signatureResult}
        typingResult={assessmentState.typingResult}
        handwritingResult={assessmentState.handwritingResult}
        mindScore={assessmentState.mindScore}
        onDownloadReport={handleDownloadReport}
        isGeneratingPdf={isGeneratingPdf}
        latestReportId={assessmentState.latestReportId}
      />

      {/* 7. FOOTER */}
      <Footer />

      {/* Modals */}
      <SignatureModal
        isOpen={activeModal === 'signature'}
        onClose={() => setActiveModal(null)}
        onAnalysisComplete={handleSignatureComplete}
      />

      <TypingModal
        isOpen={activeModal === 'typing'}
        onClose={() => setActiveModal(null)}
        onAnalysisComplete={handleTypingComplete}
      />

      <HandwritingModal
        isOpen={activeModal === 'handwriting'}
        onClose={() => setActiveModal(null)}
        onAnalysisComplete={handleHandwritingComplete}
      />

      <ReportViewerModal
        isOpen={activeModal === 'reports'}
        onClose={() => setActiveModal(null)}
        state={assessmentState}
        onDownloadPdf={handleDownloadReport}
        isGeneratingPdf={isGeneratingPdf}
      />

    </div>
  );
};

export default App;
