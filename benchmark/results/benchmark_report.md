# Báo cáo Kiểm chứng Thực nghiệm — Chương 4 Luận văn Vocam

> **Ngày thực hiện**: 24/08/2026  
> **Nguyên tắc**: Dữ liệu đo thực tế trên máy thực nghiệm, không giả định, không tự điền số đẹp.

---

## A. Môi trường Thực nghiệm Phần cứng & Hệ điều hành

- **Hãng & Model máy**: ASUS System Product Name
- **Hệ điều hành**: Microsoft Windows 10 Pro (10.0.19045, 64-bit)
- **CPU**: 12th Gen Intel(R) Core(TM) i5-12400F (6 Cores, 12 Logical Processors)
- **RAM**: 16.0 GB (16,983,969,792 bytes)
- **GPU**: NVIDIA GeForce RTX 2060 SUPER (VRAM ~8,192 MB)
- **CUDA Runtime / PyTorch CUDA**: Chưa bật trong gói PyTorch (`PyTorch 2.13.0+cpu`) → `CUDA Available: False`
- **Môi trường thực thi YOLO**: **CPU Execution**

---

## B. Thiết bị Di động & Môi trường Phần mềm

### 1. Thiết bị di động
- **Trạng thái ADB**: BLOCKED (Không tìm thấy lệnh `adb` hoặc thiết bị Android thật kết nối).
- **Ghi chú**: Không tự đoán model điện thoại hoặc thời gian hiển thị trên di động khi chưa đo thực tế.

### 2. Phiên bản Phần mềm & Thư viện
- **Java**: `Not installed on PATH` (Target Java 17 trong `backend/pom.xml:19`)
- **Maven**: `Spring Boot 3.3.4` (Sử dụng `mvnw.cmd` trong `backend/`)
- **Node.js**: `v20.20.2`
- **npm**: `10.8.2`
- **Python**: `3.11.9` (`d:\HocTap\English-App\ai_service\venv\Scripts\python.exe`)
- **FastAPI**: `0.141.1`
- **Ultralytics**: `8.4.117`
- **PyTorch**: `2.13.0+cpu`
- **React Native**: `0.86.2` (`frontend/package.json:27`)
- **Expo**: `~57.0.13` (`frontend/package.json:10`)
- **TypeScript**: `~6.0.3` (`frontend/package.json:41`)
- **PostgreSQL**: Supabase Managed PostgreSQL (`backend/.env:2`) — Trực tiếp query DB từ máy thực nghiệm hiện bị BLOCKED do lỗi phân giải DNS local (`db.zxvbmgxvvxqtvukjdbbr.supabase.co`).

---

## C. Bằng chứng 365 Nhãn Từ vựng Canonical

- **Tệp nhãn AI (`ai_service/canonical-labels.txt`)**: Đúng 365 nhãn duy nhất (Line count: 365, Distinct count: 365).
- **Tệp nhãn Backend (`backend/src/main/resources/canonical-labels.txt`)**: Đúng 365 nhãn duy nhất (Line count: 365, Distinct count: 365).
- **Kiểm tra khớp nhãn giữa AI và Backend**: `set(ai_labels) == set(backend_labels)` → **True (Khớp 100%)**.
- **Mô hình YOLO-World v2 Runtime**: Nạp 365 nhãn canonical thông qua `model.set_classes(labels)` → Nạp thành công 365 lớp.
- **Truy vấn PostgreSQL trực tiếp**: BLOCKED (Do kết nối mạng local không phân giải được tên miền Supabase pooler).

---

## D. Tập dữ liệu Benchmark & Ground Truth

- **Tập ảnh Benchmark có Ground Truth**: Chưa có sẵn trong repository.
- **Kết luận**: **Không thể tính Precision/Recall/F1 một cách khoa học vì chưa có ground truth.**
- **Cấu trúc thư mục benchmark đã tạo**:
  ```text
  benchmark/
    images/
    labels/
    results/
      latency_raw.csv
      benchmark_report.md
    classes.txt (Chứa 365 nhãn canonical)
    measure_latency.py
  ```

---

## E. Thời gian Suy luận Đã đo Thực tế (Inference Latency)

- **Ảnh đo**: `ai_service/bus.jpg`
- **Số lần Warm-up**: 5 lần (không tính)
- **Số lần đo chính thức**: 10 lần
- **File dữ liệu thô**: `benchmark/results/latency_raw.csv`

| Model Weights | Kích thước | CPU Inference Mean | CPU Inference Median | CPU Inference P95 |
|---|---|---|---|---|
| `yolov8s-worldv2.pt` | 25.9 MB | **102.84 ms** | **103.37 ms** | **105.16 ms** |
| `yolov8m-worldv2.pt` | 57.2 MB | **210.55 ms** | **210.67 ms** | **212.68 ms** |

---

## F. Danh sách Lệnh đã Thực hiện

```powershell
# 1. Kiểm tra phần cứng
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors
Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM

# 2. Kiểm tra Python, PyTorch, YOLO, FastAPI
& "d:\HocTap\English-App\ai_service\venv\Scripts\python.exe" -c "import torch, ultralytics, fastapi; print(torch.__version__, ultralytics.__version__, fastapi.__version__)"

# 3. So sánh 365 nhãn AI ↔ Backend
& "d:\HocTap\English-App\ai_service\venv\Scripts\python.exe" -c "from pathlib import Path; a=Path('ai_service/canonical-labels.txt').read_text().splitlines(); b=Path('backend/src/main/resources/canonical-labels.txt').read_text().splitlines(); print(set(a)==set(b))"

# 4. Đo thời gian suy luận CPU
& "d:\HocTap\English-App\ai_service\venv\Scripts\python.exe" "d:\HocTap\English-App\benchmark\measure_latency.py"
```
