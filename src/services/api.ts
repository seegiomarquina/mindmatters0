import {
  SignatureAnalysisResponse,
  TypingAnalysisResponse,
  HandwritingAnalysisResponse,
  ReportGenerateResponse,
  KeystrokeItem
} from '../types';

const API_BASE = '';

/**
 * Health check endpoint verifying backend connectivity and DB state.
 */
export async function checkBackendHealth(): Promise<{ status: string; version?: string; engine?: string; database?: string }> {
  const res = await fetch(`${API_BASE}/api/v1/health`);
  if (!res.ok) {
    const fallback = await fetch(`${API_BASE}/health`);
    if (!fallback.ok) throw new Error('Backend health check failed');
    return fallback.json();
  }
  return res.json();
}

/**
 * Sends a real signature image file to the computer vision analysis engine.
 */
export async function analyzeSignatureApi(fileOrBlob: Blob): Promise<SignatureAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', fileOrBlob, 'signature.png');

  const res = await fetch(`${API_BASE}/api/v1/signature/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to analyze signature' }));
    throw new Error(errorData.detail || 'Failed to analyze signature');
  }

  return res.json();
}

/**
 * Sends keystroke dynamics telemetry to the behavioral timing analysis engine.
 */
export async function analyzeTypingApi(keystrokes: KeystrokeItem[]): Promise<TypingAnalysisResponse> {
  const res = await fetch(`${API_BASE}/api/v1/typing/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keystrokes }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to analyze typing pattern' }));
    throw new Error(errorData.detail || 'Failed to analyze typing pattern');
  }

  return res.json();
}

/**
 * Sends a real handwritten document scan or photo to the OpenCV feature extraction engine.
 */
export async function analyzeHandwritingApi(fileOrBlob: Blob): Promise<HandwritingAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', fileOrBlob, 'handwriting.png');

  const res = await fetch(`${API_BASE}/api/v1/handwriting/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to analyze handwriting' }));
    throw new Error(errorData.detail || 'Failed to analyze handwriting');
  }

  return res.json();
}

/**
 * Compiles multimodal behavioral inputs into a structured Mind Score and PDF dossier.
 */
export async function generateReportApi(payload: {
  user_name: string;
  signature_result?: SignatureAnalysisResponse | null;
  typing_result?: TypingAnalysisResponse | null;
  handwriting_result?: HandwritingAnalysisResponse | null;
}): Promise<ReportGenerateResponse> {
  const res = await fetch(`${API_BASE}/api/v1/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to generate report' }));
    throw new Error(errorData.detail || 'Failed to generate report');
  }

  return res.json();
}

/**
 * Returns the download endpoint URL for a compiled PDF report dossier.
 */
export function getReportDownloadUrl(reportId: string): string {
  return `${API_BASE}/api/v1/reports/download/${reportId}`;
}

/**
 * Retrieves historical analysis records.
 */
export async function getAnalysesHistoryApi(page = 1, pageSize = 20): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/analyses?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error('Failed to fetch analyses history');
  return res.json();
}

/**
 * Retrieves detailed analysis record with 10+ measurable biometric features.
 */
export async function getAnalysisDetailApi(analysisId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/analyses/${analysisId}`);
  if (!res.ok) throw new Error('Failed to fetch analysis detail');
  return res.json();
}

/**
 * Deletes an analysis record and associated sample files.
 */
export async function deleteAnalysisApi(analysisId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/v1/analyses/${analysisId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete analysis');
  return res.json();
}
