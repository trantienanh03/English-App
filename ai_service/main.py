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
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
from ultralytics import YOLO
from contextlib import asynccontextmanager
import torch

DEVICE = "mps" if torch.backends.mps.is_available() else "cpu"

# Load .env manually if present
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    # Try parent directory .env
    env_path = Path(__file__).resolve().parent.parent / ".env"

if env_path.exists():
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip('"').strip("'")
    except Exception as e:
        print(f"⚠️ Cảnh báo đọc file .env: {e}")

# Gemini AI SDK
try:
    import google.generativeai as genai
    HAS_GEMINI_SDK = True
except ImportError:
    HAS_GEMINI_SDK = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if HAS_GEMINI_SDK and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        print("✨ Đã cấu hình Google Gemini API thành công!")
    except Exception as e:
        print(f"⚠️ Không thể khởi tạo Gemini Model: {e}")
        gemini_model = None
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

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "best.pt"))
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", str(BASE_DIR / "yolov8m-worldv2.pt"))
CANONICAL_LABELS_PATH = Path(os.getenv("CANONICAL_LABELS_PATH", str(BASE_DIR / "canonical-labels.txt")))

def load_canonical_labels() -> List[str]:
    labels = [line.strip().lower() for line in CANONICAL_LABELS_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]
    if len(labels) != 365 or len(set(labels)) != 365:
        raise RuntimeError(f"Expected 365 unique canonical labels, found {len(set(labels))}")
    return labels

EXPANDED_VOCABULARY = load_canonical_labels()

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
    model_labels = [str(value).strip().lower() for value in model.names.values()]
    if model_labels != EXPANDED_VOCABULARY:
        model = None
        raise RuntimeError("The loaded detector class list does not exactly match the 365 canonical labels")
    print(f"🚀 AI Service configured to run inference on device: {DEVICE}")

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
    translation: Optional[str] = None
    phonetic: Optional[str] = None
    pos: Optional[str] = None
    definition: Optional[str] = None
    sentence_en: Optional[str] = None
    sentence_vn: Optional[str] = None

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

LOCAL_DICTIONARY_FALLBACKS = {
    "jug": {
        "translation": "cái ca / cái bình",
        "phonetic": "/dʒʌɡ/",
        "pos": "Noun",
        "definition": "A large container with a handle and a lip, used for holding and pouring liquids.",
        "sentence_en": "She poured fresh water from the jug.",
        "sentence_vn": "Cô ấy rót nước mát từ chiếc bình."
    },
    "glasses": {
        "translation": "kính mắt",
        "phonetic": "/ˈɡlæs·əz/",
        "pos": "Noun",
        "definition": "A pair of lenses in a frame that help someone to see better.",
        "sentence_en": "He wears glasses to read books.",
        "sentence_vn": "Anh ấy đeo kính để đọc sách."
    },
    "lamp": {
        "translation": "cái đèn",
        "phonetic": "/læmp/",
        "pos": "Noun",
        "definition": "A device that produces light, especially an electric light.",
        "sentence_en": "She turned on the desk lamp.",
        "sentence_vn": "Cô ấy đã bật đèn bàn."
    },
    "necklace": {
        "translation": "vòng cổ",
        "phonetic": "/ˈnek.ləs/",
        "pos": "Noun",
        "definition": "A piece of jewelry worn around the neck.",
        "sentence_en": "She wore a beautiful gold necklace.",
        "sentence_vn": "Cô ấy đã đeo một chiếc vòng cổ bằng vàng tuyệt đẹp."
    },
    "person": {
        "translation": "người",
        "phonetic": "/ˈpɜː.sən/",
        "pos": "Noun",
        "definition": "A human being regarded as an individual.",
        "sentence_en": "A friendly person greeted us at the door.",
        "sentence_vn": "Một người thân thiện đã chào đón chúng tôi ở cửa."
    },
    "picture/frame": {
        "translation": "khung tranh / khung ảnh",
        "phonetic": "/ˈpɪk.tʃər freɪm/",
        "pos": "Noun",
        "definition": "A border for enclosing a picture or photograph.",
        "sentence_en": "She placed the family photo in a wooden frame.",
        "sentence_vn": "Cô ấy đặt bức ảnh gia đình vào một khung gỗ."
    },
    "cell phone": {
        "translation": "điện thoại di động",
        "phonetic": "/ˈsel.foʊn/",
        "pos": "Noun",
        "definition": "A portable telephone that can make and receive calls over a radio link.",
        "sentence_en": "He answered a call on his cell phone.",
        "sentence_vn": "Anh ấy trả lời cuộc gọi trên điện thoại di động."
    },
    "chair": {
        "translation": "cái ghế",
        "phonetic": "/tʃeər/",
        "pos": "Noun",
        "definition": "A separate seat for one person, typically with four legs and a back.",
        "sentence_en": "Please sit down on the comfortable chair.",
        "sentence_vn": "Vui lòng ngồi xuống chiếc ghế êm ái."
    },
    "table": {
        "translation": "cái bàn",
        "phonetic": "/ˈteɪ.bəl/",
        "pos": "Noun",
        "definition": "A piece of furniture with a flat top and one or more legs.",
        "sentence_en": "The food is served on the table.",
        "sentence_vn": "Thức ăn được dọn sẵn trên bàn."
    },
    "book": {
        "translation": "cuốn sách",
        "phonetic": "/bʊk/",
        "pos": "Noun",
        "definition": "A written or printed work consisting of pages glued or sewn together.",
        "sentence_en": "I am reading an interesting book.",
        "sentence_vn": "Tôi đang đọc một cuốn sách thú vị."
    },
    "cup": {
        "translation": "cái cốc / cái tách",
        "phonetic": "/kʌp/",
        "pos": "Noun",
        "definition": "A small bowl-shaped container for drinking from, typically having a handle.",
        "sentence_en": "He drank a hot cup of tea.",
        "sentence_vn": "Anh ấy đã uống một tách trà nóng."
    },
    "bottle": {
        "translation": "chai nước",
        "phonetic": "/ˈbɒt.əl/",
        "pos": "Noun",
        "definition": "A container, typically made of glass or plastic, with a narrow neck.",
        "sentence_en": "This bottle is filled with mineral water.",
        "sentence_vn": "Chai này đựng đầy nước khoáng."
    },
    "mouse": {
        "translation": "con chuột máy tính",
        "phonetic": "/maʊs/",
        "pos": "Noun",
        "definition": "A small handheld device that controls the cursor on a computer screen.",
        "sentence_en": "Move the computer mouse to select items.",
        "sentence_vn": "Di chuyển chuột máy tính để chọn các mục."
    }
}

def generate_context_and_individual_sentences(labels: List[str]):
    unique_labels = list(dict.fromkeys(labels))
    individual = {}
    for label in unique_labels:
        if label in LOCAL_DICTIONARY_FALLBACKS:
            individual[label] = LOCAL_DICTIONARY_FALLBACKS[label].copy()
        else:
            individual[label] = {
                "translation": label,
                "phonetic": "",
                "pos": "Noun",
                "definition": f"A vocabulary word representing {label}",
                "sentence_en": f"I can see a {label} here.",
                "sentence_vn": f"Tôi có thể nhìn thấy {label} ở đây."
            }
    
    contextual_en = "No items detected."
    contextual_vn = "Không phát hiện vật thể."
    if unique_labels:
        if len(unique_labels) == 1:
            contextual_en = f"I can see a {unique_labels[0]} in this image."
            contextual_vn = f"Tôi nhìn thấy một {unique_labels[0]} trong bức hình này."
        else:
            items_str = ", ".join(unique_labels[:-1]) + f" and {unique_labels[-1]}"
            contextual_en = f"There are several items in this scene including {items_str}."
            contextual_vn = f"Có một số vật thể trong khung hình này bao gồm {items_str}."

    if gemini_model:
        try:
            prompt = (
                f"You are an English language tutor for an AI English learning app. "
                f"A student took a photo containing these objects: {', '.join(unique_labels)}. "
                f"Please generate:\n"
                f"1. A natural, descriptive 1-sentence English example sentence combining these objects (under keys 'contextual_en' and 'contextual_vn').\n"
                f"2. For each unique object, generate its real-world dictionary details:\n"
                f"   - 'translation': the real Vietnamese translation (e.g. 'cái bình' or 'ca đựng nước' for 'jug', do not repeat the English label).\n"
                f"   - 'phonetic': the English phonetic transcription (e.g. /dʒʌɡ/ for 'jug').\n"
                f"   - 'pos': the part of speech in English (e.g. 'Noun', 'Verb').\n"
                f"   - 'definition': a simple, beginner-friendly English definition (max 12 words).\n"
                f"   - 'sentence_en': a simple English example sentence (max 8 words, using easy words).\n"
                f"   - 'sentence_vn': the Vietnamese translation of that example sentence.\n"
                f"Format the exact response in JSON with this structure:\n"
                f"{{\n"
                f"  \"contextual_en\": \"...\",\n"
                f"  \"contextual_vn\": \"...\",\n"
                f"  \"individual_details\": {{\n"
                f"    \"object_name\": {{\n"
                f"      \"translation\": \"...\",\n"
                f"      \"phonetic\": \"...\",\n"
                f"      \"pos\": \"...\",\n"
                f"      \"definition\": \"...\",\n"
                f"      \"sentence_en\": \"...\",\n"
                f"      \"sentence_vn\": \"...\"\n"
                f"    }}\n"
                f"  }}\n"
                f"}}\n"
                f"Do not include markdown codeblocks or extra commentary."
            )
            try:
                response = gemini_model.generate_content(prompt)
            except Exception as inner_e:
                if "gemini-1.5-flash" in str(inner_e):
                    print("⚠️ gemini-1.5-flash not supported or not found, trying gemini-pro...")
                    alt_model = genai.GenerativeModel('gemini-pro')
                    response = alt_model.generate_content(prompt)
                else:
                    raise inner_e
            text = response.text.strip()
            if text.startswith("```json"):
                text = text.replace("```json", "").replace("```", "").strip()
            elif text.startswith("```"):
                text = text.replace("```", "").strip()
            
            import json
            data = json.loads(text)
            c_en = data.get("contextual_en", contextual_en)
            c_vn = data.get("contextual_vn", contextual_vn)
            ind_data = data.get("individual_details", {})
            for label in unique_labels:
                if label in ind_data:
                    individual[label] = {
                        "translation": ind_data[label].get("translation", individual[label]["translation"]),
                        "phonetic": ind_data[label].get("phonetic", individual[label]["phonetic"]),
                        "pos": ind_data[label].get("pos", individual[label]["pos"]),
                        "definition": ind_data[label].get("definition", individual[label]["definition"]),
                        "sentence_en": ind_data[label].get("sentence_en", individual[label]["sentence_en"]),
                        "sentence_vn": ind_data[label].get("sentence_vn", individual[label]["sentence_vn"])
                    }
            return {
                "contextual_en": c_en,
                "contextual_vn": c_vn,
                "individual": individual
            }
        except Exception as e:
            print(f"⚠️ Gemini API Call Exception: {e}, fallback to template.")

    return {
        "contextual_en": contextual_en,
        "contextual_vn": contextual_vn,
        "individual": individual
    }

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

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là hình ảnh")

    start_time = time.time()

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_width, img_height = image.size

        results = model(image, conf=confidence_threshold, device=DEVICE)
        predictions: List[DetectedObject] = []
        labels_list: List[str] = []

        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                label_en = str(model.names[cls_id]).strip().lower()
                if label_en not in EXPANDED_VOCABULARY:
                    continue
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
        result_sentences = None
        if generate_sentence and labels_list:
            result_sentences = generate_context_and_individual_sentences(labels_list)
            context_res = ContextSentenceResponse(
                sentence_en=result_sentences["contextual_en"],
                sentence_vn=result_sentences["contextual_vn"],
                source="gemini-ai" if gemini_model else "template-fallback"
            )

        # Update predictions with individual details
        for pred in predictions:
            if result_sentences and pred.label in result_sentences["individual"]:
                details = result_sentences["individual"][pred.label]
                pred.translation = details.get("translation")
                pred.phonetic = details.get("phonetic")
                pred.pos = details.get("pos")
                pred.definition = details.get("definition")
                pred.sentence_en = details.get("sentence_en")
                pred.sentence_vn = details.get("sentence_vn")

        return MultiPredictionResponse(
            success=True,
            total_detected=len(predictions),
            image_width=img_width,
            image_height=img_height,
            inference_time_ms=inference_time_ms,
            predictions=predictions,
            contextual_sentence=context_res
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="Dịch vụ nhận diện tạm thời không khả dụng")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
