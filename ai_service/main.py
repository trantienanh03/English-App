# -*- coding: utf-8 -*-
"""
FastAPI Microservice cho Object Detection - English Learning App
Cung cấp REST API nhận diện vật thể từ camera di động và trả về từ vựng tiếng Anh.

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_ai_model()
    yield

app = FastAPI(
    title="English App - AI Object Detection Service",
    description="Dịch vụ AI nhận diện vật thể từ ảnh camera cho ứng dụng học từ vựng tiếng Anh",
    version="1.0.0",
    lifespan=lifespan
)

# Cấu hình CORS để cho phép Spring Boot backend hoặc di động kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đường dẫn mặc định lưu model đã fine-tune
MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
FALLBACK_MODEL = "yolov8m-worldv2.pt"  # Mô hình YOLO-World v2 Pretrained trên tập dữ liệu Objects365 (365 lớp)

# Danh sách từ vựng bổ sung phong phú 365+ lớp vật thể theo Objects365 Dataset
EXPANDED_VOCABULARY = [
    # Đồ dùng cá nhân & Trang phục
    "person", "glasses", "sunglasses", "hat", "cap", "shoes", "sneakers", "boots", "socks", 
    "watch", "ring", "necklace", "earrings", "wallet", "purse", "backpack", "handbag", "suitcase", "umbrella", "belt",
    
    # Thiết bị điện tử & Công nghệ
    "calculator", "cell phone", "mobile phone", "laptop", "computer", "display", "monitor", "mouse", "keyboard", 
    "headphone", "earphones", "speaker", "soundbar", "remote", "game controller", "tv", "camera", "tablet", "drone", "charger",
    
    # Đồ dùng học tập & Văn phòng
    "book", "notebook", "pen", "pencil", "eraser", "ruler", "scissors", "stapler", "tape", "paper", "folder", 
    "paper clip", "marker", "highlighter", "pencil case", "globe", "calculator", "sticky note", "blackboard", "whiteboard",
    
    # Dụng cụ nhà bếp & Ăn uống
    "cup", "mug", "glass", "water bottle", "thermos", "bottle", "wine glass", "plate", "bowl", "fork", "knife", "spoon", 
    "chopsticks", "tray", "pan", "pot", "kettle", "coffee maker", "blender", "microwave", "oven", "toaster", "refrigerator", "sink", "faucet",
    
    # Nội thất & Đồ dùng gia đình
    "chair", "armchair", "barstool", "couch", "sofa", "bed", "pillow", "cushion", "blanket", "curtain", "dining table", "desk", 
    "cabinet", "shelf", "bookshelf", "drawer", "mirror", "clock", "wall clock", "painting", "picture frame", "poster", "vase", 
    "potted plant", "flower", "lamp", "desk lamp", "trash can", "fan", "air conditioner", "heater", "vacuum cleaner", "iron", "washing machine",
    
    # Đồ vệ sinh cá nhân & Chăm sóc sức khỏe
    "toothbrush", "toothpaste", "soap", "shampoo", "towel", "hair dryer", "razor", "shaver", "comb", "tissue", "toilet", "bath tub",
    
    # Đồ chơi, Thể thao & Giải trí
    "toy", "teddy bear", "doll", "ball", "basketball", "football", "tennis racket", "skateboard", "guitar", "piano", "violin",
    
    # Phương tiện giao thông & Đường phố
    "bicycle", "motorcycle", "car", "bus", "truck", "train", "airplane", "boat", "traffic light", "stop sign", "street sign", "bench", "street light",
    
    # Động vật & Thực phẩm
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe",
    "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "bread", "fruit", "vegetable"
]

# Nạp mô hình AI khi khởi động server
model = None

def load_ai_model():
    global model
    if os.path.exists(MODEL_PATH):
        print(f"✅ Đã nạp mô hình Fine-Tuned riêng: {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
    else:
        print(f"🌍 Nạp mô hình YOLO-World Open-Vocabulary ({FALLBACK_MODEL}) với {len(EXPANDED_VOCABULARY)}+ từ vựng...")
        model = YOLO(FALLBACK_MODEL)
        try:
            model.set_classes(EXPANDED_VOCABULARY)
            print(f"✨ Khởi tạo thành công từ vựng mở rộng cho YOLO-World (bao gồm calculator, pen, ruler...)")
        except Exception as e:
            print(f"⚠️ Cảnh báo thiết lập custom vocabulary: {e}")



# Định nghĩa Schema dữ liệu đầu ra
class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class DetectedObject(BaseModel):
    label: str            # Từ vựng tiếng Anh (vd: "book", "cup", "laptop")
    confidence: float     # Độ tin cậy (0.0 - 1.0)
    box: BoundingBox      # Tọa độ khung nhận diện

class PredictionResponse(BaseModel):
    success: bool
    total_detected: int
    inference_time_ms: float
    predictions: List[DetectedObject]

from fastapi.responses import FileResponse

@app.get("/", summary="Giao diện Web Test AI Model")
def web_demo():
    return FileResponse("web_demo.html")

@app.get("/health", summary="Kiểm tra trạng thái AI Service")
def health_check():
    model_name = MODEL_PATH if os.path.exists(MODEL_PATH) else FALLBACK_MODEL
    return {
        "status": "UP",
        "service": "English App AI Detection Service",
        "loaded_model": model_name
    }

@app.post("/predict", response_model=PredictionResponse, summary="Nhận diện vật thể từ ảnh")
async def predict_object(
    file: UploadFile = File(...),
    confidence_threshold: float = Query(0.35, ge=0.1, le=0.95, description="Ngưỡng độ tin cậy tối thiểu")
):
    """
    Endpoint nhận diện vật thể từ file ảnh gửi lên:
    - **file**: File ảnh định dạng JPG/PNG
    - **confidence_threshold**: Ngưỡng lọc vật thể (mặc định 0.35)
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Mô hình AI chưa được nạp!")

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là hình ảnh (JPG, PNG, WebP)")

    start_time = time.time()

    try:
        # Đọc dữ liệu ảnh
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Chạy inference với YOLO
        results = model(image, conf=confidence_threshold)

        predictions: List[DetectedObject] = []

        # Xử lý kết quả trả về từ YOLO
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                label_en = model.names[cls_id]
                conf = float(box.conf[0])
                coords = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

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

        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        return PredictionResponse(
            success=True,
            total_detected=len(predictions),
            inference_time_ms=inference_time_ms,
            predictions=predictions
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi trong quá trình xử lý AI: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
