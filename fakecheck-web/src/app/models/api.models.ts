// ============================================
// Authentication Models
// ============================================

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string | null;
  phone?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  email: string;
  name?: string | null;
}

export interface UserInfo {
  email: string;
  name?: string | null;
  role: string;
}

// ============================================
// Verification Models
// ============================================

export interface VerifyUrlRequest {
  url: string;
}

export interface VerifyTextRequest {
  text: string;
  url?: string | null;
}

export type Verdict = 'credible' | 'questionable' | 'fake' | 'insufficient';

export interface VerifyResponse {
  newsId: string;
  verdict: Verdict;
  score: number;              // 0.0 - 1.0
  siteRepScore?: number | null;  // 0.0 - 1.0
  reusedFrom?: string | null;    // newsId если переиспользован
  evidence: string[];
  checkedAt: string;  // ISO 8601 DateTime
}

// ============================================
// Health Models
// ============================================

export interface HealthResponse {
  ok: boolean;
  service: string;
  timestamp: string;
}

// ============================================
// Error Models
// ============================================

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId?: string;
}

// ============================================
// Local Storage Models (для истории)
// ============================================

export interface VerificationHistoryItem extends VerifyResponse {
  requestType: 'url' | 'text';
  requestContent: string;
  timestamp: string;
}
