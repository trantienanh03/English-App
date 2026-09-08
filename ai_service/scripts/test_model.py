# -*- coding: utf-8 -*-
"""
Script Kiểm thử Mô hình YOLO AI — English Learning App
Cho phép chạy thử nhận diện vật thể trên 1 hình ảnh hoặc từ webcam
và in ra danh sách từ vựng tiếng Anh tìm thấy kèm độ tin cậy (Confidence %).

Tác giả: Trần Tiến Anh - MSSV: 22130016
"""

import argparse
import os
import sys
from ultralytics import YOLO

def test_yolo_model(model_path: str, image_source: str, conf_threshold: float = 0.35):
    """
    Hàm nạp mô hình YOLO và thực hiện dự đoán trên bức ảnh test.

    Args:
        model_path (str): Đường dẫn file weights (.pt hoặc .onnx)
        image_source (str): Đường dẫn file ảnh hoặc URL hoặc '0' cho webcam
        conf_threshold (float): Ngưỡng độ tin cậy (mặc định 0.35)
    """
    print("=" * 65)
    print("🤖 CHƯƠNG TRÌNH KIỂM THỬ MÔ HÌNH YOLO AI — VOCAM APP")
    print("=" * 65)

    if not os.path.exists(model_path):
        print(f"⚠️ Không tìm thấy file trọng số tại: {model_path}")
        print("💡 Tự động nạp mô hình pretrained dự phòng: yolo11n.pt (sẽ tự tải nếu chưa có)")
        model_path = "yolo11n.pt"

    print(f"📦 Đang nạp mô hình: {model_path} ...")
    model = YOLO(model_path)

    print(f"🖼️ Đang xử lý ảnh đầu vào: {image_source}")
    print(f"🎯 Ngưỡng độ tin cậy (Confidence Threshold): {conf_threshold:.0%}")
    print("-" * 65)

    # Chạy inference
    results = model(image_source, conf=conf_threshold, show=True)

    print("\n📊 KẾT QUẢ NHẬN DIỆN VẬT THỂ TIẾNG ANH:")
    print(f"{'STT':<5} | {'Từ vựng Tiếng Anh':<20} | {'Độ tin cậy (Conf)':<18} | Tọa độ Box (x1, y1, x2, y2)")
    print("-" * 65)

    detected_count = 0
    for r in results:
        for box in r.boxes:
            detected_count += 1
            cls_id = int(box.cls[0])
            label_en = model.names[cls_id]
            conf = float(box.conf[0])
            coords = [round(c, 1) for c in box.xyxy[0].tolist()]

            print(f"{detected_count:<5} | {label_en:<20} | {conf:<18.2%} | {coords}")

    print("-" * 65)
    print(f"✅ Tổng số vật thể tìm thấy: {detected_count}")
    print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kiểm thử mô hình YOLO cho Vocam App")
    parser.add_argument("--model", type=str, default="models/best.pt", help="Đường dẫn file best.pt hoặc best.onnx")
    parser.add_argument("--image", type=str, default="https://ultralytics.com/images/bus.jpg", help="Đường dẫn ảnh test hoặc URL")
    parser.add_argument("--conf", type=float, default=0.35, help="Ngưỡng độ tin cậy (0.1 - 0.95)")

    args = parser.parse_args()

    test_yolo_model(
        model_path=args.model,
        image_source=args.image,
        conf_threshold=args.conf
    )
