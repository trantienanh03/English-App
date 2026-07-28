# 🤖 AI Object Detection Service — English Learning App

> Dịch vụ AI microservice nhận diện vật thể từ ảnh camera di động cho ứng dụng học từ vựng tiếng Anh.  
> Tác giả: Trần Tiến Anh - MSSV: 22130016 — Đề tài Tiểu luận tốt nghiệp KCNTT NLU.

---

## 📁 Cấu trúc Thư mục

```text
ai_service/
├── models/             ← Chứa file trọng số mô hình đã fine-tune (best.pt)
│   └── .gitkeep
├── scripts/            ← Các kịch bản huấn luyện & xuất mô hình
│   └── fine_tune.py    ← Script Fine-Tuning YOLO trên Google Colab / GPU
├── main.py             ← Server FastAPI cung cấp REST API (/predict, /health)
├── requirements.txt    ← Danh sách thư viện Python cần thiết
└── README.md           ← Tài liệu hướng dẫn sử dụng (File này)
```

---

## 🚀 1. Hướng dẫn Chạy AI Service Cục bộ (Local FastAPI Server)

### Bước 1: Cài đặt môi trường Python
Yêu cầu Python version `>= 3.9`. Nên tạo môi trường ảo (venv hoặc conda):

```bash
cd ai_service

# Tạo và kích hoạt môi trường ảo (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

### Bước 2: Khởi chạy FastAPI Server

```bash
python main.py
# Hoặc dùng uvicorn trực tiếp:
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server sẽ lắng nghe tại `http://localhost:8000`.
- 📖 Tài liệu API tương tác (Swagger UI): `http://localhost:8000/docs`
- 🟢 Endpoint kiểm tra health check: `GET http://localhost:8000/health`
- 🎯 Endpoint dự đoán ảnh: `POST http://localhost:8000/predict`

---

## 🎯 2. Hướng dẫn Fine-Tuning Mô hình YOLO trên Google Colab

Để tự tay fine-tune mô hình YOLO riêng phục vụ bài báo cáo tiểu luận:

### Bước 1: Chuẩn bị Dataset (Bộ dữ liệu từ vựng)
1. Chuẩn bị tập dữ liệu ảnh và nhãn theo chuẩn **YOLO Format**:
   - Thư mục `images/train`, `images/val`
   - Thư mục `labels/train`, `labels/val`
   - File cấu hình `data.yaml` định nghĩa tên các lớp từ vựng (ví dụ: `book`, `pen`, `cup`, `laptop`, `phone`...)
2. Nén tất cả thành file `data.zip`.

### Bước 2: Tải file lên Google Colab
1. Mở [Google Colab](https://colab.research.google.com/) và chọn GPU (Runtime -> Change runtime type -> T4 GPU).
2. Tải file `data.zip` và file script [scripts/fine_tune.py](file:///d:/HocTap/English-App/ai_service/scripts/fine_tune.py) lên session lưu trữ Colab.

### Bước 3: Giải nén & Thực hiện Fine-Tuning
Chạy các ô lệnh trong Colab:

```python
# 1. Cài đặt Ultralytics
!pip install ultralytics

# 2. Giải nén dataset
!unzip -q data.zip -d custom_data

# 3. Chạy script Fine-Tune với Transfer Learning
!python fine_tune.py --data custom_data/data.yaml --model yolo11s.pt --epochs 50 --imgsz 640
```

### Bước 4: Tải file weights `best.pt` về dự án
1. Sau khi train hoàn tất, file mô hình tốt nhất nằm tại `runs/detect/english_app_finetune/weights/best.pt`.
2. Tải file `best.pt` này về máy cá nhân và chép vào thư mục:
   `d:\HocTap\English-App\ai_service\models\best.pt`
3. Khởi động lại FastAPI server (`python main.py`), server sẽ tự động chuyển sang dùng mô hình `best.pt` vừa mới fine-tune của bạn!

---

## 📡 3. Cấu trúc Trả về của API `/predict`

Khi gửi ảnh dạng `multipart/form-data` tới `POST /predict`, server trả về định dạng JSON:

```json
{
  "success": true,
  "total_detected": 2,
  "inference_time_ms": 42.15,
  "predictions": [
    {
      "label": "book",
      "confidence": 0.9325,
      "box": {
        "x1": 120.5,
        "y1": 85.0,
        "x2": 450.2,
        "y2": 380.0
      }
    },
    {
      "label": "cup",
      "confidence": 0.8841,
      "box": {
        "x1": 480.0,
        "y1": 210.0,
        "x2": 610.5,
        "y2": 395.2
      }
    }
  ]
}
```
