import Constants from 'expo-constants';
import { VocabularyWord } from '@/types';

export interface DetectionResult {
  cocoClass: string;
  confidence: number;
  word?: VocabularyWord;
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

// Automatically resolve computer IP for Expo Go & Web
const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return '192.168.1.22';
};

const HOST_IP = getHostIp();
export const AI_SERVICE_URL = process.env.EXPO_PUBLIC_AI_URL || `http://${HOST_IP}:8000`;

/**
 * Online Single-Object Detection API Call
 */
export async function detect(fileBlobOrFormData?: any): Promise<DetectionResult | null> {
  try {
    let bodyData: any = fileBlobOrFormData;

    if (!bodyData) {
      const response = await fetch(`${AI_SERVICE_URL}/health`);
      if (response.ok) {
        console.log('⚡ Connected to FastAPI AI Microservice at', AI_SERVICE_URL);
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

          const word: VocabularyWord = {
            id: `word_${Date.now()}`,
            word: topPred.label,
            pos: 'Noun',
            phonetic: `/${cocoClass}/`,
            vn: topPred.label,
            sentence: `This is a ${cocoClass}.`,
            difficulty: 'easy',
          };
          return { cocoClass, confidence, word };
        }
      }
    }
  } catch (err) {
    console.warn('AI Microservice connection error:', err);
  }

  return null;
}

/**
 * Online Multi-Object Bounding Box & Gemini AI Context Generation
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
        const word: VocabularyWord = {
          id: `word_${Date.now()}_${Math.random()}`,
          word: pred.label,
          pos: 'Noun',
          phonetic: `/${cocoClass}/`,
          vn: pred.label,
          sentence: `This is a ${cocoClass}.`,
          difficulty: 'medium',
        };
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
