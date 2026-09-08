import React, { useState } from 'react';
import { PenCursor } from './components/PenCursor';
import { AntigravityController } from './components/AntigravityController';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StylesSection } from './components/StylesSection';
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
  const [initialHandwritingFile, setInitialHandwritingFile] = useState<File | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleHeroAnalyzeChoice = (mode: 'signature' | 'typing' | 'handwriting', file?: File) => {
    if (file) {
      setInitialHandwritingFile(file);
    }
    setActiveModal(mode);
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
    showToast('✨ Signature graphology calibrated successfully!');
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
    showToast('⚡ Keystroke dynamics & cadence calibrated!');
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
    showToast('📝 10+ measurable handwriting features extracted!');
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
      downloadLink.setAttribute('download', `MindMatters_Dossier_${res.report_id}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      showToast(`📄 Dossier ${res.report_id} downloaded successfully!`);
    } catch (err: any) {
      showToast(`❌ Failed to compile dossier: ${err.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4ECDD] text-[#1B1B2F] relative selection:bg-[#C9A24B]/40 selection:text-[#1B1B2F]">
      {/* 1. Custom Inking Pen Cursor & Trail */}
      <PenCursor />

      {/* 2. Antigravity Controller (Parallax Physics) */}
      <AntigravityController />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-sm bg-[#1B1B2F] border-2 border-[#C9A24B] shadow-2xl text-xs sm:text-sm font-cinzel font-bold text-[#F4ECDD] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 3. Sticky Classical Navbar */}
      <Navbar
        onOpenSignature={() => setActiveModal('signature')}
        onOpenTyping={() => setActiveModal('typing')}
        onOpenHandwriting={() => {
          setInitialHandwritingFile(null);
          setActiveModal('handwriting');
        }}
        onOpenReports={() => setActiveModal('reports')}
      />

      {/* 4. Classical Calligraphy Hero */}
      <Hero
        onAnalyzeChoice={handleHeroAnalyzeChoice}
      />

      {/* 5. Six Traditions, Six Temperaments Scroller */}
      <StylesSection />

      {/* 6. Core Behavioral Engines */}
      <CoreServices
        onOpenSignature={() => setActiveModal('signature')}
        onOpenTyping={() => setActiveModal('typing')}
        onOpenHandwriting={() => {
          setInitialHandwritingFile(null);
          setActiveModal('handwriting');
        }}
        signatureResult={assessmentState.signatureResult}
        typingResult={assessmentState.typingResult}
        handwritingResult={assessmentState.handwritingResult}
      />

      {/* 7. Methodology / How It Works */}
      <HowItWorks />

      {/* 8. Synthesized Intelligence Dossier */}
      <ReportSection
        signatureResult={assessmentState.signatureResult}
        typingResult={assessmentState.typingResult}
        handwritingResult={assessmentState.handwritingResult}
        mindScore={assessmentState.mindScore}
        onDownloadReport={handleDownloadReport}
        onOpenReportModal={() => setActiveModal('reports')}
        isGeneratingPdf={isGeneratingPdf}
        latestReportId={assessmentState.latestReportId}
      />

      {/* 9. Footer */}
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
        onClose={() => {
          setActiveModal(null);
          setInitialHandwritingFile(null);
        }}
        onAnalysisComplete={handleHandwritingComplete}
        initialFile={initialHandwritingFile}
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
