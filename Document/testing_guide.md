# 🧪 Vocam — Hướng dẫn Kiểm thử Toàn diện (Testing Guide)

> **Dành cho:** Kiểm thử giao diện Mobile, Spring Boot Backend API, SQLite Offline Data và Mô hình YOLO.

---

## 📌 Tổng quan Kịch bản Kiểm thử

| Phần | Nội dung | Công cụ | Mục tiêu |
|---|---|---|---|
| **Phần 1** | Kiểm thử Backend REST API | PowerShell / `curl` / Browser | Đảm bảo Spring Boot phục vụ đúng 4 endpoint cốt lõi |
| **Phần 2** | Kiểm thử Giao diện Mobile App | Expo Web / iOS / Android | Đảm bảo mượt mà, lưu SQLite local, quẹt thẻ SM-2 |
| **Phần 3** | Kiểm thử Luồng Offline & Sync | Tắt/Bật Mạng | Kiểm tra tích lũy offline & tự động sync khi có mạng |
| **Phần 4** | Kiểm thử Mô hình YOLO AI | Python / Ultralytics | Test file weights `best.pt` / `best.onnx` trên ảnh thực tế |

---

## ☕ PHẦN 1: Kiểm thử Backend Spring Boot (REST API)

### 1.1 Khởi chạy Backend Server
Mở terminal tại thư mục `backend` và chạy lệnh:

```powershell
cd d:\HocTap\English-App\backend
$env:JAVA_HOME = "D:\IntelliJ IDEA 2026.2.0.1\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

.\mvnw.cmd spring-boot:run
```

> Server sẽ khởi chạy tại port `8080`. Flyway sẽ tự động tạo bảng PostgreSQL/H2 và nạp sẵn 80 từ COCO.

---

### 1.2 Test 4 Endpoints REST API bằng PowerShell / Terminal

#### Test 1: Lấy danh sách 80 từ vựng COCO (dùng để nạp offline)
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/words" | Select-Object -First 3
```
- **Kết quả mong đợi:** Trả về danh sách JSON có các từ `person`, `bicycle`, `car`... kèm phiên âm IPA & nghĩa tiếng Việt.

#### Test 2: Tra từ vựng theo tên lớp YOLO (ví dụ class "cup")
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/words/cup"
```
- **Kết quả mong đợi:** 
  ```json
  {
    "id": 42,
    "cocoClass": "cup",
    "enWord": "cup",
    "phonetic": "/kʌp/",
    "pos": "Noun",
    "definition": "A small container used for drinking",
    "translation": "cái cốc / tách",
    "exampleEn": "She drank a cup of hot tea.",
    "exampleVn": "Cô ấy uống một tách trà nóng."
  }
  ```

#### Test 3: Gửi tiến độ học từ di động lên server (Sync Progress)
```powershell
$body = @{
    deviceUuid = "test-device-uuid-1234"
    displayName = "Trần Tiến Anh"
    totalXp = 350
    currentStreak = 5
    longestStreak = 7
    wordsLearned = 12
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/sync/progress" -Method Post -Body $body -ContentType "application/json"
```
- **Kết quả mong đợi:** `{"status": "ok", "rank": 1}`

#### Test 4: Lấy Bảng xếp hạng Toàn cầu (Global Leaderboard)
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard"
```
- **Kết quả mong đợi:** Trả về danh sách Top người dùng xếp theo `totalXp` giảm dần, có vị trí `rank`.

---

## 📱 PHẦN 2: Kiểm thử Giao diện & Chức năng Mobile (Frontend Expo)

### 2.1 Khởi chạy Expo Server
Mở terminal tại thư mục `frontend` và chạy:

```powershell
cd d:\HocTap\English-App\frontend
npx expo start --web
```
> Trình duyệt sẽ tự động mở ứng dụng Vocam ở địa chỉ `http://localhost:8081`.

---

### 2.2 Các bước Test Giao diện & Luồng học tập (Checklist)

#### 🧪 Kịch bản 1: Trải nghiệm Màn hình Chính (Dashboard)
1. Kiểm tra thanh **Level Progress Bar** (XP hiện tại / XP cấp tiếp theo).
2. Kiểm tra badge **Streak 🔥** (chuỗi ngày học).
3. Kiểm tra danh sách **Nhiệm vụ hàng ngày (Daily Quests)**.

#### 🧪 Kịch bản 2: AI Object Scanner (Quét Vật thể)
1. Chuyển sang Tab **Camera Quét** (icon camera trên thanh điều hướng).
2. Kiểm tra khung Viewfinder có nhấp nháy hiệu ứng **Pulse Animation** và badge **"YOLOv8 nano · On-Device"**.
3. Bấm thử các chip vật thể mô phỏng (`📷 cup`, `📷 cat`, `📷 laptop`...).
4. Quan sát Bottom Sheet kết quả:
   - Thanh độ tin cậy AI **Confidence Bar (%)**
   - Từ tiếng Anh, từ loại, phiên âm IPA màu ngọc bích, nghĩa tiếng Việt
   - Nút phát âm âm thanh 🔊
5. Bấm nút **"LƯU VÀO SỔ TỪ (+15 XP)"**:
   - Kiểm tra âm thanh thành công vang lên 🎵
   - Toast thông báo hiện lên 🟢
   - Điểm XP trên thanh Dashboard tăng thêm +15 XP.

#### 🧪 Kịch bản 3: Thẻ Flashcards & Ôn tập Thuật toán SM-2
1. Chuyển sang Tab **Sổ từ (Flashcards)**.
2. Kiểm tra từ vựng vừa quét ở Kịch bản 2 đã xuất hiện trong danh sách.
3. Chạm vào thẻ để xem hiệu ứng **Lật thẻ (Flip Card)** mặt trước / mặt sau.
4. Bấm các nút đánh giá độ khó: **"Chưa thuộc"** (Đỏ), **"Bình thường"** (Vàng), **"Rất dễ"** (Xanh):
   - SQLite sẽ tự động tính toán khoảng cách ngày ôn tập tiếp theo (`interval_days` & `ease_factor`).

#### 🧪 Kịch bản 4: Trang Cá nhân & Bảng xếp hạng toàn cầu
1. Chuyển sang Tab **Cá nhân (Profile)**.
2. Kiểm tra các ô thống kê: Streak, Tổng XP, Cấp độ, Số từ đã thuộc.
3. Cuộn xuống phần **"Bảng xếp hạng toàn cầu 🏆"**:
   - Xem thứ hạng của bạn (được đánh dấu viền xanh ngọc kèm chữ `(Tôi)`).
   - Huy hiệu Vương miện Vàng/Bạc/Đồng cho Top 1, 2, 3.

#### 🧪 Kịch bản 5: Tìm kiếm & Cài đặt
1. Bấm icon 🔍 trên góc Dashboard -> Tìm thử từ "Coffee" hoặc "Laptop".
2. Bấm icon ⚙️ trên góc Profile -> Màn hình Cài đặt phân nhóm học tập, âm thanh, tài khoản.

---

## 🤖 PHẦN 3: Kiểm thử Mô hình YOLO AI (Trọng số `best.pt` / `best.onnx`)

### 3.1 Script Python Test Mô hình YOLO trên Máy tính

Mở terminal Python tại thư mục `ai_service` để test file `best.pt`:

```python
from ultralytics import YOLO

# 1. Nạp mô hình (nếu chưa có best.pt thì dùng yolo11n.pt mặc định)
model = YOLO('yolo11n.pt') 

# 2. Chạy dự đoán trên 1 bức ảnh bất kỳ
results = model('https://ultralytics.com/images/bus.jpg', show=True)

# 3. In danh sách vật thể tìm thấy kèm độ tin cậy confidence
for r in results:
    for box in r.boxes:
        cls_name = model.names[int(box.cls[0])]
        conf = float(box.conf[0])
        print(f"Detected: {cls_name} | Confidence: {conf:.2%}")
```

### 3.2 Export mô hình sang ONNX (Chuẩn bị cho Sprint 3B Mobile)

```python
from ultralytics import YOLO

model = YOLO('best.pt')
# Export nhẹ 640x640 cho mobile
model.export(format='onnx', imgsz=640, simplify=True)
print(" Export ONNX thành công!")
```

---

## 🎯 Danh sách Kiểm tra Hoàn tất (Testing Scorecard)

- [ ] Backend API `/api/words` trả đủ 80 từ COCO.
- [ ] Backend API `/api/words/cup` tra đúng thông tin tiếng Việt + IPA.
- [ ] Backend API `/api/sync/progress` nhận XP và trả về Rank.
- [ ] Mobile App mở mượt mà trên trình duyệt/điện thoại.
- [ ] Quét vật thể AI hiện đúng thanh Confidence Bar % và âm thanh.
- [ ] Lưu từ vựng lưu thành công vào SQLite local.
- [ ] Thẻ Flashcard quẹt lật mặt trước/sau trơn tru.
- [ ] Bảng xếp hạng toàn cầu hiển thị vị trí của bạn (Tôi).
