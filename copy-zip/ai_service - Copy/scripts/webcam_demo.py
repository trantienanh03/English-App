# -*- coding: utf-8 -*-
"""
Script Quét Webcam Laptop Real-time — English Learning App
Mở webcam laptop và thực hiện nhận diện từ vựng Tiếng Anh theo thời gian thực (Real-time Video Stream)

Tác giả: Trần Tiến Anh - MSSV: 22130016
"""

import os
import sys
import time
import cv2
from ultralytics import YOLO

# Danh sách từ vựng Objects365
EXPANDED_VOCABULARY = [
    "person", "glasses", "sunglasses", "hat", "cap", "shoes", "sneakers",
    "watch", "wallet", "backpack", "handbag", "suitcase", "umbrella",
    "calculator", "cell phone", "mobile phone", "laptop", "computer", "display", "mouse", "keyboard",
    "headphone", "speaker", "remote", "tv", "camera", "tablet",
    "book", "notebook", "pen", "pencil", "eraser", "ruler", "scissors", "stapler", "paper",
    "cup", "mug", "glass", "water bottle", "thermos", "bottle", "plate", "bowl", "fork", "knife", "spoon",
    "chair", "couch", "bed", "dining table", "desk", "mirror", "clock", "picture frame", "vase",
    "potted plant", "flower", "lamp", "trash can", "fan",
    "toothbrush", "toothpaste", "soap", "towel", "hair dryer", "razor",
    "toy", "teddy bear", "ball", "car", "motorcycle", "bicycle"
]

def run_webcam_realtime(model_path="models/best.pt", conf_threshold=0.35):
    print("=" * 65)
    print("🎥 ĐANG KHỞI ĐỘNG WEBCAM LAPTOP QUÉT TỪ VỰNG REAL-TIME")
    print("   Nhấn phím 'Q' trên bàn phím để THOÁT chương trình")
    print("=" * 65)

    # 1. Load model
    if os.path.exists(model_path):
        print(f"📦 Đang nạp mô hình: {model_path}")
        model = YOLO(model_path)
    else:
        print("🌍 Đang nạp mô hình YOLO-World v2 Pretrained (Objects365)...")
        model = YOLO("yolov8m-worldv2.pt")
        try:
            model.set_classes(EXPANDED_VOCABULARY)
            print("✨ Đã nạp thành công từ vựng Objects365 cho Webcam!")
        except Exception as e:
            print(f"⚠️ Warning set_classes: {e}")

    # 2. Mở Webcam Laptop (Camera 0)
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Lỗi: Không thể mở Webcam laptop. Vui lòng kiểm tra quyền camera!")
        return

    # Thiết lập độ phân giải Webcam
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    fps_start_time = time.time()
    fps_counter = 0
    fps_display = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Không nhận được tín hiệu từ webcam.")
            break

        fps_counter += 1
        if time.time() - fps_start_time >= 1.0:
            fps_display = fps_counter
            fps_counter = 0
            fps_start_time = time.time()

        # Thực hiện AI Inference
        results = model(frame, conf=conf_threshold, verbose=False)

        # Trích xuất khung vẽ kết quả
        annotated_frame = results[0].plot()

        # Hiển thị thông số FPS lên góc màn hình
        cv2.putText(
            annotated_frame,
            f"Vocam AI | Live FPS: {fps_display} | Conf: {conf_threshold:.0%}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        # Hiển thị cửa sổ Video Real-time
        cv2.imshow("Vocam AI — Laptop Webcam Real-time Object Detection", annotated_frame)

        # Nhấn phím 'q' hoặc 'ESC' để thoát
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            break

    cap.release()
    cv2.destroyAllWindows()
    print("✅ Đã đóng webcam.")

if __name__ == "__main__":
    run_webcam_realtime()
