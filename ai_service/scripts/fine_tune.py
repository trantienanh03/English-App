# -*- coding: utf-8 -*-
"""
Fine-tune YOLO Model for English Learning App
Mã nguồn huấn luyện tinh chỉnh (Fine-tuning) mô hình YOLO nhận diện vật thể
phục vụ ứng dụng học từ vựng tiếng Anh.

Tác giả: Trần Tiến Anh - MSSV: 22130016
Đề tài: Nghiên cứu và ứng dụng mô hình YOLO trong nhận diện vật thể hỗ trợ học từ vựng tiếng Anh
"""

import argparse
import os
from pathlib import Path
from ultralytics import YOLO

def fine_tune_yolo(
    data_yaml: str,
    base_model: str = "yolo11s.pt",
    epochs: int = 50,
    imgsz: int = 640,
    batch_size: int = 16,
    project_dir: str = "runs/detect",
    name: str = "english_app_finetune"
):
    """
    Hàm thực hiện fine-tuning mô hình YOLO dựa trên trọng số pretrained (Transfer Learning).

    Args:
        data_yaml (str): Đường dẫn tới file cấu hình dataset data.yaml
        base_model (str): Tên mô hình pretrained gốc (yolo11s.pt, yolov8s.pt...)
        epochs (int): Số lượt huấn luyện (mặc định 50)
        imgsz (int): Kích thước ảnh đầu vào (mặc định 640)
        batch_size (int): Kích thước lô ảnh (mặc định 16)
        project_dir (str): Thư mục lưu kết quả huấn luyện
        name (str): Tên đợt huấn luyện (experiment name)
    """
    print("=" * 60)
    print(f"🚀 Bắt đầu quá trình Fine-Tuning mô hình YOLO ({base_model})")
    print(f"📁 Dataset Config: {data_yaml}")
    print(f"⏱️ Epochs: {epochs} | Image Size: {imgsz} | Batch Size: {batch_size}")
    print("=" * 60)

    # 1. Khởi tạo mô hình với trọng số đã huấn luyện sẵn (Pretrained Weights)
    model = YOLO(base_model)

    # 2. Thực hiện Fine-Tuning (Transfer Learning)
    # YOLO tự động đóng đóng băng các lớp đặc trưng cấp thấp nếu cần và tinh chỉnh các lớp phân loại
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        project=project_dir,
        name=name,
        exist_ok=True,
        pretrained=True,  # Bật Transfer Learning
        plots=True,       # Vẽ biểu đồ loss, mAP, confusion matrix
        save=True,        # Lưu weights best.pt và last.pt
        verbose=True
    )

    print("\n" + "=" * 60)
    print("✅ ĐÃ HOÀN THÀNH HUẤN LUYỆN FINE-TUNING!")
    best_weight_path = os.path.join(project_dir, name, "weights", "best.pt")
    print(f"🎯 File trọng số tốt nhất (Best Weights): {best_weight_path}")
    print("=" * 60)

    # 3. Đánh giá mô hình trên tập Validation (Val Metrics)
    metrics = model.val()
    print(f"📊 Chỉ số mAP50-95: {metrics.box.map:.4f}")
    print(f"📊 Chỉ số mAP50: {metrics.box.map50:.4f}")
    print(f"📊 Chỉ số Precision: {metrics.box.mp:.4f}")
    print(f"📊 Chỉ số Recall: {metrics.box.mr:.4f}")

    return model, results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script Fine-tune YOLO cho English App")
    parser.add_argument("--data", type=str, required=True, help="Đường dẫn file data.yaml")
    parser.add_argument("--model", type=str, default="yolo11s.pt", help="Model nền tảng (yolo11s.pt, yolov8s.pt)")
    parser.add_argument("--epochs", type=int, default=50, help="Số epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Kích thước ảnh")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--project", type=str, default="runs/detect", help="Thư mục lưu kết quả")
    parser.add_argument("--name", type=str, default="english_app_finetune", help="Tên đợt train")

    args = parser.parse_args()

    fine_tune_yolo(
        data_yaml=args.data,
        base_model=args.model,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch_size=args.batch,
        project_dir=args.project,
        name=args.name
    )
