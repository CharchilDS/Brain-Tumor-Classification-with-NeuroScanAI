export const TUMOR_CLASSES = ["Glioma", "Meningioma", "Pituitary", "No Tumor"] as const;
export type TumorClass = (typeof TUMOR_CLASSES)[number];

export interface InferenceResult {
  predictedClass: TumorClass;
  probabilities: Record<TumorClass, number>;
  confidence: number;
  processingTime: number;
}

export function generateMockInference(): InferenceResult {
  // Generate plausible probability distribution
  const raw = TUMOR_CLASSES.map(() => Math.random() ** 2);
  // Pick a dominant class
  const dominantIdx = Math.floor(Math.random() * TUMOR_CLASSES.length);
  raw[dominantIdx] += 2 + Math.random() * 3;

  const sum = raw.reduce((a, b) => a + b, 0);
  const normalized = raw.map((v) => Math.round((v / sum) * 1000) / 10);
  // Adjust rounding to total 100
  const diff = 100 - normalized.reduce((a, b) => a + b, 0);
  normalized[dominantIdx] = Math.round((normalized[dominantIdx] + diff) * 10) / 10;

  const probabilities = Object.fromEntries(
    TUMOR_CLASSES.map((c, i) => [c, normalized[i]])
  ) as Record<TumorClass, number>;

  const predictedClass = TUMOR_CLASSES[dominantIdx];

  return {
    predictedClass,
    probabilities,
    confidence: normalized[dominantIdx],
    processingTime: 1.2 + Math.random() * 2.5,
  };
}

export const MOCK_METRICS = {
  accuracy: 96.8,
  precision: { Glioma: 95.2, Meningioma: 97.1, Pituitary: 98.0, "No Tumor": 96.9 },
  recall: { Glioma: 94.8, Meningioma: 96.5, Pituitary: 97.6, "No Tumor": 98.2 },
  f1: { Glioma: 95.0, Meningioma: 96.8, Pituitary: 97.8, "No Tumor": 97.5 },
  rocAuc: { Glioma: 0.987, Meningioma: 0.993, Pituitary: 0.996, "No Tumor": 0.991 },
  confusionMatrix: [
    [285, 8, 3, 4],
    [6, 290, 2, 2],
    [2, 1, 293, 4],
    [3, 2, 3, 292],
  ],
};
