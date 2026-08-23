# -*- coding: utf-8 -*-
"""
FastAPI Microservice cho Object Detection - English Learning App
Cung cấp REST API nhận diện vật thể từ camera di động và trả về từ vựng tiếng Anh.

Bổ sung tính năng nâng cao:
1. Multi-Object Bounding Box Detection (/predict-multi)
2. Contextual Sentence Generation với Google Gemini API (/generate-context)

Tác giả: Trần Tiến Anh - MSSV: 22130016
"""

import io
import os
import time
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
from ultralytics import YOLO
from contextlib import asynccontextmanager

# Gemini AI SDK
try:
    import google.generativeai as genai
    HAS_GEMINI_SDK = True
except ImportError:
    HAS_GEMINI_SDK = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if HAS_GEMINI_SDK and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    print("✨ Đã cấu hình Google Gemini API thành công!")
else:
    gemini_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_ai_model()
    yield

app = FastAPI(
    title="English App - AI Object Detection & Context Service",
    description="Dịch vụ AI nhận diện đa vật thể & sinh câu ngữ cảnh thông minh bằng Gemini AI",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
FALLBACK_MODEL = "yolov8m-worldv2.pt"

EXPANDED_VOCABULARY = [
    "person", "glasses", "sunglasses", "hat", "cap", "shoes", "sneakers", "boots", "socks", 
    "watch", "ring", "necklace", "earrings", "wallet", "purse", "backpack", "handbag", "suitcase", "umbrella", "belt",
    "calculator", "cell phone", "mobile phone", "laptop", "computer", "display", "monitor", "mouse", "keyboard", 
    "headphone", "earphones", "speaker", "soundbar", "remote", "game controller", "tv", "camera", "tablet", "drone", "charger",
    "book", "notebook", "pen", "pencil", "eraser", "ruler", "scissors", "stapler", "tape", "paper", "folder", 
    "paper clip", "marker", "highlighter", "pencil case", "globe", "sticky note", "blackboard", "whiteboard",
    "cup", "mug", "glass", "water bottle", "thermos", "bottle", "wine glass", "plate", "bowl", "fork", "knife", "spoon", 
    "chopsticks", "tray", "pan", "pot", "kettle", "coffee maker", "blender", "microwave", "oven", "toaster", "refrigerator", "sink", "faucet",
    "chair", "armchair", "barstool", "couch", "sofa", "bed", "pillow", "cushion", "blanket", "curtain", "dining table", "desk", 
    "cabinet", "shelf", "bookshelf", "drawer", "mirror", "clock", "wall clock", "painting", "picture frame", "poster", "vase", 
    "potted plant", "flower", "lamp", "desk lamp", "trash can", "fan", "air conditioner", "heater", "vacuum cleaner", "iron", "washing machine",
    "toothbrush", "toothpaste", "soap", "shampoo", "towel", "hair dryer", "razor", "shaver", "comb", "tissue", "toilet", "bath tub",
    "toy", "teddy bear", "doll", "ball", "basketball", "football", "tennis racket", "skateboard", "guitar", "piano", "violin",
    "bicycle", "motorcycle", "car", "bus", "truck", "train", "airplane", "boat", "traffic light", "stop sign", "street sign", "bench", "street light",
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe",
    "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "bread", "fruit", "vegetable"
]

model = None

def load_ai_model():
    global model
    if os.path.exists(MODEL_PATH):
        print(f"✅ Đã nạp mô hình Fine-Tuned riêng: {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
    else:
        print(f"🌍 Nạp mô hình YOLO-World Open-Vocabulary ({FALLBACK_MODEL})...")
        model = YOLO(FALLBACK_MODEL)
        try:
            model.set_classes(EXPANDED_VOCABULARY)
            print(f"✨ Khởi tạo thành công từ vựng mở rộng cho YOLO-World")
        except Exception as e:
            print(f"⚠️ Cảnh báo thiết lập custom vocabulary: {e}")

# Schemas
class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class DetectedObject(BaseModel):
    label: str
    confidence: float
    box: BoundingBox

class ContextSentenceRequest(BaseModel):
    labels: List[str]

class ContextSentenceResponse(BaseModel):
    sentence_en: str
    sentence_vn: str
    source: str

class MultiPredictionResponse(BaseModel):
    success: bool
    total_detected: int
    image_width: int
    image_height: int
    inference_time_ms: float
    predictions: List[DetectedObject]
    contextual_sentence: Optional[ContextSentenceResponse] = None

from fastapi.responses import FileResponse

@app.get("/")
def web_demo():
    return FileResponse("web_demo.html")

@app.get("/health")
def health_check():
    model_name = MODEL_PATH if os.path.exists(MODEL_PATH) else FALLBACK_MODEL
    return {
        "status": "UP",
        "service": "English App AI Multi-Object & Gemini Service",
        "gemini_active": bool(gemini_model),
        "loaded_model": model_name
    }

def generate_fallback_context(labels: List[str]) -> ContextSentenceResponse:
    unique_labels = list(dict.fromkeys(labels))
    if not unique_labels:
        return ContextSentenceResponse(
            sentence_en="No objects detected in the scene.",
            sentence_vn="Không phát hiện vật thể nào trong khung hình.",
            source="template-fallback"
        )
    
    if len(unique_labels) == 1:
        obj = unique_labels[0]
        return ContextSentenceResponse(
            sentence_en=f"I can see a {obj} in this image.",
            sentence_vn=f"Tôi nhìn thấy một {obj} trong bức hình này.",
            source="template-fallback"
        )
    
    items_str = ", ".join(unique_labels[:-1]) + f" and {unique_labels[-1]}"
    return ContextSentenceResponse(
        sentence_en=f"There are several items in this scene including {items_str}.",
        sentence_vn=f"Có một số vật thể trong khung hình này bao gồm {items_str}.",
        source="template-fallback"
    )

@app.post("/generate-context", response_model=ContextSentenceResponse, summary="Sinh câu ngữ cảnh từ danh sách nhãn vật thể")
def generate_context_sentence(req: ContextSentenceRequest):
    """
    Sinh câu ví dụ ngữ cảnh thông minh bằng Google Gemini API (hoặc Template Fallback):
    """
    if not req.labels:
        return generate_fallback_context([])

    unique_labels = list(dict.fromkeys(req.labels))

    if gemini_model:
        try:
            prompt = (
                f"You are an English language tutor for an AI English learning app. "
                f"The following objects were detected in a photo taken by a student: {', '.join(unique_labels)}. "
                f"Generate a natural, descriptive 1-sentence English example sentence combining these objects. "
                f"Provide the exact output in JSON format with keys 'sentence_en' and 'sentence_vn' (Vietnamese translation). "
                f"Do not include markdown codeblocks or extra commentary."
            )
            response = gemini_model.generate_content(prompt)
            text = response.text.strip()
            # Clean JSON string if formatted in markdown
            if text.startswith("```json"):
                text = text.replace("```json", "").replace("```", "").strip()
            
            import json
            data = json.loads(text)
            return ContextSentenceResponse(
                sentence_en=data.get("sentence_en", ""),
                sentence_vn=data.get("sentence_vn", ""),
                source="gemini-ai"
            )
        except Exception as e:
            print(f"⚠️ Gemini API Call Exception: {e}, fallback to template.")

    return generate_fallback_context(unique_labels)

@app.post("/predict-multi", response_model=MultiPredictionResponse, summary="Nhận diện Đa vật thể & Tương tác Bounding Box")
async def predict_multi_objects(
    file: UploadFile = File(...),
    confidence_threshold: float = Query(0.30, ge=0.1, le=0.95),
    generate_sentence: bool = Query(True, description="Tự động gọi Gemini AI sinh câu ngữ cảnh")
):
    """
    Endpoint nhận diện ĐA VẬT THỂ cùng lúc từ camera:
    - Trả về danh sách Bounding Boxes (x1, y1, x2, y2)
    - Tự động sinh câu ngữ cảnh thông minh kết hợp các vật thể nhận diện được
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Mô hình AI chưa được nạp!")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là hình ảnh")

    start_time = time.time()

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_width, img_height = image.size

        results = model(image, conf=confidence_threshold)
        predictions: List[DetectedObject] = []
        labels_list: List[str] = []

        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                label_en = model.names[cls_id]
                conf = float(box.conf[0])
                coords = box.xyxy[0].tolist()

                predictions.append(
                    DetectedObject(
                        label=label_en,
                        confidence=round(conf, 4),
                        box=BoundingBox(
                            x1=round(coords[0], 2),
                            y1=round(coords[1], 2),
                            x2=round(coords[2], 2),
                            y2=round(coords[3], 2)
                        )
                    )
                )
                labels_list.append(label_en)

        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        context_res = None
        if generate_sentence and labels_list:
            context_res = generate_context_sentence(ContextSentenceRequest(labels=labels_list))

        return MultiPredictionResponse(
            success=True,
            total_detected=len(predictions),
            image_width=img_width,
            image_height=img_height,
            inference_time_ms=inference_time_ms,
            predictions=predictions,
            contextual_sentence=context_res
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý AI Multi-Object: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
