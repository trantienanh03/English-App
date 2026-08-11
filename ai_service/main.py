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
FALLBACK_MODEL = "yolo11n.pt"  # Mô hình dự phòng nếu chưa có best.pt

# Nạp mô hình AI khi khởi động server
model = None

def load_ai_model():
    global model
    if os.path.exists(MODEL_PATH):
        print(f"✅ Đã nạp mô hình Fine-Tuned riêng: {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
    else:
        print(f"⚠️ Chưa tìm thấy {MODEL_PATH}, nạp mô hình Pretrained dự phòng: {FALLBACK_MODEL}")
        model = YOLO(FALLBACK_MODEL)



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
