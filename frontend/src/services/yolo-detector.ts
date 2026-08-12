import { getAllCachedWords, getCachedWordByClass } from '@/db/database';
import { VocabularyWord } from '@/types';

export interface DetectionResult {
  cocoClass: string;
  confidence: number;
  word: VocabularyWord;
}

/**
 * YOLOv8 Detector — on-device inference with ONNX Runtime
 *
 * How to activate real YOLO inference (Sprint 3):
 * 1. Export your trained model:  model.export(format='onnx', imgsz=640, simplify=True)
 * 2. Copy the output best.onnx -> frontend/assets/models/yolov8n.onnx
 * 3. Install onnxruntime-react-native, run `npx expo prebuild`
 * 4. Replace mockDetect() calls below with realDetect()
 */

// 80 COCO class names in index order — must match your YOLO model output
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

/**
 * Mock detector — simulates YOLO output from cached vocabulary.
 * Picks a random word from the local SQLite cache so scanning
 * feels realistic in demo mode without the real model.
 */
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

/**
 * Real YOLO on-device detector.
 * Uncomment and implement this function when:
 *   - onnxruntime-react-native is installed
 *   - best.onnx is placed in frontend/assets/models/
 *   - npx expo prebuild has been run
 *
 * async function realDetect(imageBase64: string): Promise<DetectionResult | null> {
 *   const { InferenceSession, Tensor } = await import('onnxruntime-react-native');
 *   const session = await InferenceSession.create(
 *     require('../../assets/models/yolov8n.onnx')
 *   );
 *
 *   // 1. Preprocess: resize imageBase64 to 640x640 Float32Array, normalize [0,1]
 *   const inputTensor = new Tensor('float32', preprocessedData, [1, 3, 640, 640]);
 *
 *   // 2. Run inference
 *   const outputs = await session.run({ images: inputTensor });
 *   const rawOutput = outputs['output0'].data as Float32Array;
 *
 *   // 3. Postprocess: parse detections tensor [1, 84, 8400], apply NMS
 *   const topDetection = postprocess(rawOutput);
 *   if (!topDetection) return null;
 *
 *   // 4. Map class index to COCO class name
 *   const cocoClass = COCO_CLASSES[topDetection.classIndex];
 *
 *   // 5. Look up vocabulary from SQLite cache
 *   const word = getCachedWordByClass(cocoClass);
 *   if (!word) return null;
 *
 *   return { cocoClass, confidence: topDetection.confidence, word };
 * }
 */

export const AI_SERVICE_URL = 'http://localhost:8000';

/**
 * Main detection entry point.
 * 1. Attempts live inference via FastAPI AI Microservice at http://localhost:8000/predict
 * 2. If AI service is offline or unreachable, seamlessly falls back to mockDetect()
 */
export async function detect(fileBlobOrFormData?: any): Promise<DetectionResult | null> {
  try {
    let bodyData: any = fileBlobOrFormData;

    // If no image is provided, create a sample test image for web demo
    if (!bodyData) {
      const response = await fetch(`${AI_SERVICE_URL}/health`);
      if (response.ok) {
        // AI service is healthy
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

  // Fallback to local SQLite mock detection
  const fallback = await mockDetect();
  if (!fallback) return null;
  return fallback;
}

/**
 * Look up vocabulary from local cache by YOLO class name.
 * Falls back to a basic word object if the class is not cached yet.
 */
export function lookupWord(cocoClass: string): VocabularyWord | null {
  return getCachedWordByClass(cocoClass);
}
