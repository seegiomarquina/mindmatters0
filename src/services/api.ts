import {
  SignatureAnalysisResponse,
  TypingAnalysisResponse,
  HandwritingAnalysisResponse,
  ReportGenerateResponse,
  KeystrokeItem
} from '../types';

const API_BASE = '';

export async function checkBackendHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function analyzeSignatureApi(fileOrBlob: Blob): Promise<SignatureAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', fileOrBlob, 'signature.png');

  const res = await fetch(`${API_BASE}/analyze/signature`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to analyze signature' }));
    throw new Error(errorData.detail || 'Failed to analyze signature');
  }

  return res.json();
}

export async function analyzeTypingApi(keystrokes: KeystrokeItem[]): Promise<TypingAnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze/typing`, {
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

export async function analyzeHandwritingApi(fileOrBlob: Blob): Promise<HandwritingAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', fileOrBlob, 'handwriting.png');

  const res = await fetch(`${API_BASE}/analyze/handwriting`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to analyze handwriting' }));
    throw new Error(errorData.detail || 'Failed to analyze handwriting');
  }

  return res.json();
}

export async function generateReportApi(payload: {
  user_name: string;
  signature_result?: SignatureAnalysisResponse | null;
  typing_result?: TypingAnalysisResponse | null;
  handwriting_result?: HandwritingAnalysisResponse | null;
}): Promise<ReportGenerateResponse> {
  const res = await fetch(`${API_BASE}/report/generate`, {
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

export function getReportDownloadUrl(reportId: string): string {
  return `${API_BASE}/report/download/${reportId}`;
}
