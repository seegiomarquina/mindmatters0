export interface MeasurableFeatures {
  slant_angle_deg: number;
  ink_density: number;
  writing_area_ratio: number;
  component_count: number;
  avg_char_height_px: number;
  avg_char_width_px: number;
  avg_word_gap_px: number;
  avg_line_spacing_px: number;
  baseline_slope_deg: number;
  baseline_jitter: number;
  contour_complexity: number;
  pressure_proxy: number;
  regularity_score: number;
}

export interface SignatureMeasurableFeatures {
  stroke_width_px: number;
  stroke_variance: number;
  median_angle_deg: number;
  baseline_jitter: number;
  contour_count: number;
  aspect_ratio: number;
}

export interface SignatureTraits {
  confidence: number;
  consistency: number;
  pressure_level: 'low' | 'medium' | 'high';
  slant: 'left' | 'upright' | 'right';
  stress_indicator: number;
}

export interface SignatureAnalysisResponse {
  analysis_id?: string;
  sample_id?: string;
  traits: SignatureTraits;
  measurable_features?: SignatureMeasurableFeatures;
  confidence_score: number;
  disclaimer?: string;
}

export interface KeystrokeItem {
  key: string;
  keydown: number;
  keyup: number;
}

export interface TypingMeasurableFeatures {
  total_keystrokes: number;
  dwell_time_std_ms: number;
  flight_time_std_ms: number;
  cadence_entropy: number;
  hesitation_count: number;
}

export interface TypingAnalysisResponse {
  analysis_id?: string;
  avg_dwell_time_ms: number;
  avg_flight_time_ms: number;
  backspace_rate: number;
  typing_speed_wpm: number;
  stress_score: number;
  focus_score: number;
  measurable_features?: TypingMeasurableFeatures;
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
  analysis_id?: string;
  sample_id?: string;
  traits: HandwritingTraits;
  measurable_features?: MeasurableFeatures;
  dominant_pattern: string;
  confidence_score: number;
  disclaimer?: string;
}

export interface ReportGenerateResponse {
  report_id: string;
  mind_score: number;
  dominant_archetype?: string;
  executive_summary?: string;
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
