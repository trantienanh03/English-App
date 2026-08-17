import { getAllCachedWords, getCachedWordByClass } from '@/db/database';
import { VocabularyWord } from '@/types';

export interface DetectionResult {
  cocoClass: string;
  confidence: number;
  word: VocabularyWord;
}

export interface BoundingBoxCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface MultiDetectedObject {
  label: string;
  confidence: number;
  box: BoundingBoxCoords;
  word?: VocabularyWord;
}

export interface ContextSentence {
  sentence_en: string;
  sentence_vn: string;
  source: string;
}

export interface MultiDetectionResult {
  success: boolean;
  totalDetected: number;
  inferenceTimeMs: number;
  predictions: MultiDetectedObject[];
  contextualSentence?: ContextSentence;
}

export const COCO_CLASSES: string[] = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck',
  'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
  'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
  'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
  'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
  'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
  'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
  'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
  'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
  'hair drier', 'toothbrush',
];

export async function mockDetect(): Promise<DetectionResult | null> {
  const cachedWords = getAllCachedWords();

  if (cachedWords.length === 0) {
    return null;
  }

  const randomWord = cachedWords[Math.floor(Math.random() * cachedWords.length)];
  return {
    cocoClass: randomWord.word.toLowerCase(),
    confidence: 0.75 + Math.random() * 0.2,
    word: randomWord,
  };
}

export const AI_SERVICE_URL = 'http://localhost:8000';

export async function detect(fileBlobOrFormData?: any): Promise<DetectionResult | null> {
  try {
    let bodyData: any = fileBlobOrFormData;

    if (!bodyData) {
      const response = await fetch(`${AI_SERVICE_URL}/health`);
      if (response.ok) {
        console.log('⚡ Connected to live FastAPI AI Microservice at http://localhost:8000');
      }
    }

    if (bodyData) {
      const apiRes = await fetch(`${AI_SERVICE_URL}/predict?confidence_threshold=0.30`, {
        method: 'POST',
        body: bodyData,
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.success && data.predictions.length > 0) {
          const topPred = data.predictions[0];
          const cocoClass = topPred.label.toLowerCase();
          const confidence = topPred.confidence;

          let word = getCachedWordByClass(cocoClass);
          if (!word) {
            word = {
              id: `word_${Date.now()}`,
              word: topPred.label,
              pos: 'Noun',
              phonetic: `/${cocoClass}/`,
              vn: topPred.label,
              sentence: `This is a ${cocoClass}.`,
              difficulty: 'easy',
            };
          }
          return { cocoClass, confidence, word };
        }
      }
    }
  } catch (err) {
    console.warn('AI Microservice connection error, using fallback:', err);
  }

  const fallback = await mockDetect();
  if (!fallback) return null;
  return fallback;
}

/**
 * Advanced Multi-Object Detection Entry Point
 * Calls FastAPI POST /predict-multi to get bounding boxes & Gemini AI contextual sentence
 */
export async function detectMultiObjects(fileFormData: any): Promise<MultiDetectionResult | null> {
  try {
    const apiRes = await fetch(`${AI_SERVICE_URL}/predict-multi?confidence_threshold=0.25&generate_sentence=true`, {
      method: 'POST',
      body: fileFormData,
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      const predictions: MultiDetectedObject[] = (data.predictions || []).map((pred: any) => {
        const cocoClass = pred.label.toLowerCase();
        let word = getCachedWordByClass(cocoClass);
        if (!word) {
          word = {
            id: `word_${Date.now()}_${Math.random()}`,
            word: pred.label,
            pos: 'Noun',
            phonetic: `/${cocoClass}/`,
            vn: pred.label,
            sentence: `This is a ${cocoClass}.`,
            difficulty: 'medium',
          };
        }
        return {
          label: pred.label,
          confidence: pred.confidence,
          box: pred.box,
          word,
        };
      });

      return {
        success: data.success,
        totalDetected: data.total_detected,
        inferenceTimeMs: data.inference_time_ms,
        predictions,
        contextualSentence: data.contextual_sentence ? {
          sentence_en: data.contextual_sentence.sentence_en,
          sentence_vn: data.contextual_sentence.sentence_vn,
          source: data.contextual_sentence.source,
        } : undefined,
      };
    }
  } catch (err) {
    console.warn('Multi-object detection microservice error:', err);
  }

  return null;
}

export function lookupWord(cocoClass: string): VocabularyWord | null {
  return getCachedWordByClass(cocoClass);
}
