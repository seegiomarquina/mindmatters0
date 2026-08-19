const API_BASE_URL = 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(${API_BASE_URL}/health);
    return await res.json();
  } catch (err) {
    return { status: 'error' };
  }
}

export async function analyzeSignature(imageFile: File | Blob) {
  const formData = new FormData();
  formData.append('file', imageFile, 'signature.png');
  const res = await fetch(${API_BASE_URL}/analyze/signature, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(Signature analysis failed: );
  return await res.json();
}

export async function analyzeTyping(data: {
  keystrokes: any[];
  typed_text?: string;
  total_time_seconds?: number;
  backspace_count?: number;
}) {
  const res = await fetch(${API_BASE_URL}/analyze/typing, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(Typing analysis failed: );
  return await res.json();
}

export async function analyzeHandwriting(imageFile: File | Blob) {
  const formData = new FormData();
  formData.append('file', imageFile, 'handwriting.png');
  const res = await fetch(${API_BASE_URL}/analyze/handwriting, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(Handwriting analysis failed: );
  return await res.json();
}

export async function generateReport(data: {
  user_name?: string;
  signature_data?: any;
  typing_data?: any;
  handwriting_data?: any;
  psychometrics?: any;
}) {
  const res = await fetch(${API_BASE_URL}/report/generate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(Report generation failed: );
  return await res.json();
}

export function getReportDownloadUrl(reportId: string): string {
  return ${API_BASE_URL}/report/download/;
}
