/**
 * Brain Tumor Classification API Client
 * 
 * Handles communication with the FastAPI backend.
 */

// API base URL - uses environment variable or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictionResult {
  predictedClass: string;
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
  description: string;
  severity: 'none' | 'low' | 'medium' | 'high';
}

export interface InferenceResult {
  predictedClass: string;
  probabilities: Record<string, number>;
  confidence: number;
  processingTime: number;
  description?: string;
  severity?: string;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_path?: string;
  labels?: string[];
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

/**
 * Upload image and get prediction
 */
export async function predictImage(file: File): Promise<InferenceResult> {
  const startTime = performance.now();
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Prediction failed' }));
    throw new Error(error.detail || 'Prediction failed');
  }
  
  const data: PredictionResult = await response.json();
  const processingTime = (performance.now() - startTime) / 1000;
  
  // Transform to match existing frontend interface
  return {
    predictedClass: data.label,
    probabilities: data.probabilities,
    confidence: data.confidence,
    processingTime: processingTime,
    description: data.description,
    severity: data.severity,
  };
}

/**
 * Check if API is available
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const health = await checkHealth();
    return health.model_loaded;
  } catch {
    return false;
  }
}
