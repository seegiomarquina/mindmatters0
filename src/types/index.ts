export interface SignatureTraits {
  confidence: number;
  consistency: number;
  pressure_level: 'low' | 'medium' | 'high';
  slant: 'left' | 'upright' | 'right';
  stress_indicator: number;
}

export interface SignatureAnalysisResponse {
  traits: SignatureTraits;
  confidence_score: number;
}

export interface KeystrokeItem {
  key: string;
  keydown: number;
  keyup: number;
}

export interface TypingAnalysisResponse {
  avg_dwell_time_ms: number;
  avg_flight_time_ms: number;
  backspace_rate: number;
  typing_speed_wpm: number;
  stress_score: number;
  focus_score: number;
}

export interface HandwritingTraits {
  letter_size: 'small' | 'medium' | 'large';
  line_spacing: 'tight' | 'medium' | 'wide';
  word_spacing: 'narrow' | 'medium' | 'wide';
  slant: 'left' | 'upright' | 'right';
  formation_consistency: number;
  pressure_estimate: 'light' | 'medium' | 'firm';
}

export interface HandwritingAnalysisResponse {
  traits: HandwritingTraits;
  dominant_pattern: string;
  confidence_score: number;
}

export interface ReportGenerateResponse {
  report_id: string;
  mind_score: number;
  download_url: string;
}

export interface GlobalAssessmentState {
  signatureResult: SignatureAnalysisResponse | null;
  typingResult: TypingAnalysisResponse | null;
  handwritingResult: HandwritingAnalysisResponse | null;
  userName: string;
  mindScore: number;
  latestReportId: string | null;
}
