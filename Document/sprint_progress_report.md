# 📊 Vocam — Báo cáo Tiến độ & Phân chia Sprint

> **Sinh viên:** Trần Tiến Anh — MSSV: 22130016  
> **Đề tài:** *Nghiên cứu và ứng dụng mô hình YOLO trong nhận diện vật thể hỗ trợ học từ vựng tiếng Anh trên thiết bị di động*  
> **Cập nhật lần cuối:** 05/08/2026  

---

## 🏗️ Tổng quan Kiến trúc Đã Thống nhất

- **UI / Design System:** Đồng bộ 100% với hệ màu chuẩn `vocam_color_palette.html` (Primary: Forest Green `#2C6E49`, Secondary: Sage Teal `#2A7069`).
- **Frontend (Mobile):** React Native (Expo) theo kiến trúc **Offline-First** với `expo-sqlite`.
- **Backend:** Spring Boot 3.3.4 (Java 21) kết nối PostgreSQL (Supabase / Local) và Flyway Migration.
- **AI Model:** YOLOv8 (On-Device Inference với ONNX Runtime).

---

## 📈 Bảng Tổng hợp Tiến độ Các Sprint

| Sprint | Tên Sprint | Trạng thái | Tỷ lệ |
|---|---|---|---|
| **Phase 0** | UI Design System & Chỉnh sửa Giao diện | ✅ **Hoàn thành** | 100% |
| **Sprint 1** | Monolith Spring Boot Backend & Database | ✅ **Hoàn thành** | 100% |
| **Sprint 2** | Frontend SQLite (Offline Storage) & Sync Engine | ✅ **Hoàn thành** | 100% |
| **Sprint 3** | ONNX Runtime & Tích hợp YOLOv8 On-Device | ⏳ **Chưa làm (Chờ test model)** | 0% |
| **Sprint 4** | Kiểm thử End-to-End & Hoàn thiện Demo | ⏳ **Chưa làm** | 0% |

---

## 📋 Chi tiết Danh mục Công việc theo Sprint

### 🔹 Phase 0: Design System & Giao diện ứng dụng (✅ 100% Hoàn thành)
- [x] Audit & Đồng bộ toàn bộ palette màu giữa `vocam_color_palette.html`, `global.css`, `variables.ts` và `theme.ts`.
- [x] Thay thế tất cả các hex code hardcode trong `Dashboard` và `Profile` bằng semantic tokens (`Palette.*`).
- [x] Tạo component `DotsLoader` (hiệu ứng 2 chấm nảy bounce mịn màng bằng Animated API).
- [x] Tích hợp `DotsLoader` thay thế `ActivityIndicator` mặc định ở tất cả các màn hình (Auth, Google Modal, Object Scanner) & Boot Splash Screen.
- [x] Thêm 5 màn hình mới hoàn chỉnh:
  1. **Word Detail Screen:** Chi tiết từ vựng, phiên âm IPA, câu ví dụ, mẹo ghi nhớ, self-rating độ khó.
  2. **Lesson Detail Screen:** Chi tiết bài học, tiến độ %, danh sách từ vựng.
  3. **Streak Celebration Modal:** Hiệu ứng ăn mừng chuỗi học tập với hiệu ứng nảy tim/lửa & thưởng XP.
  4. **Settings Screen:** Màn hình Cài đặt phân nhóm (Học tập, Thông báo, Âm thanh, Tài khoản).
  5. **Search Screen:** Tìm kiếm thời thực từ vựng & bài học, bộ lọc danh mục và highlight từ khóa.

---

### 🔹 Sprint 1: Spring Boot Backend & Database Migration (✅ 100% Hoàn thành)
- [x] Cấu hình project Spring Boot 3.3.4 (Java 21) với Maven `pom.xml` (JPA, PostgreSQL, Flyway, Validation).
- [x] Cấu hình `application.properties` hỗ trợ fallback environment variables cho local dev & Supabase Cloud.
- [x] Tạo Flyway Migration `V1__create_tables.sql`: Bảng `words` (80 lớp từ vựng COCO) và `user_progress` (tiến độ theo UUID thiết bị).
- [x] Tạo Flyway Migration `V2__seed_coco_words.sql`: Nạp sẵn 80 lớp từ vựng COCO kèm nghĩa tiếng Việt, IPA, định nghĩa và câu ví dụ song ngữ.
- [x] Xây dựng Entities (`Word`, `UserProgress`) và Repositories (`WordRepository`, `UserProgressRepository`).
- [x] Xây dựng các REST API Controllers:
  - `GET /api/words`: Tải toàn bộ 80 từ vựng để app cache offline.
  - `GET /api/words/{cocoClass}`: Tra từ vựng theo tên nhận diện của YOLO.
  - `POST /api/sync/progress`: Gửi tiến độ học tập tích lũy từ thiết bị lên server.
  - `GET /api/leaderboard`: Lấy danh sách Top 50 người dùng trên Bảng xếp hạng toàn cầu.
- [x] Cấu hình `WebConfig` (CORS Filter cho phép mobile app kết nối từ mọi IP dev).
- [x] Đã commit & push code backend lên Git (`origin/main`).

---

### 🔹 Sprint 2: Frontend SQLite (Offline Local Storage) & Sync Client (✅ 100% Hoàn thành)
- [x] Cài đặt `expo-sqlite` và `expo-crypto` cho Expo React Native app.
- [x] Xây dựng module SQLite [`database.ts`](file:///d:/HocTap/English-App/frontend/src/db/database.ts):
  - Bảng `flashcards`: Lưu từ vựng kèm chỉ số thuật toán Spaced Repetition (SM-2: `ease_factor`, `interval_days`, `repetitions`, `next_review_at`).
  - Bảng `cached_words`: Cache 80 từ COCO để tra cứu 0ms khi không có mạng.
  - Bảng `learning_events`: Lưu hàng chờ sự kiện học khi offline.
  - Bảng `app_config`: Sinh và lưu `device_uuid` cố định cho thiết bị.
- [x] Xây dựng API Client Service [`api.ts`](file:///d:/HocTap/English-App/frontend/src/services/api.ts) kết nối Spring Boot Backend.
- [x] Xây dựng Sync Manager [`sync-service.ts`](file:///d:/HocTap/English-App/frontend/src/services/sync-service.ts) tự động nạp từ vựng và đẩy điểm XP/streak khi có mạng.
- [x] Tích hợp dữ liệu SQLite & Backend Sync vào [`main-container.tsx`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx).
- [x] Thêm UI **Bảng xếp hạng toàn cầu (Global Leaderboard)** thời thực vào [`profile-screen.tsx`](file:///d:/HocTap/English-App/frontend/src/components/profile/profile-screen.tsx) với huy hiệu Top 1/2/3 và vị trí người dùng.
- [x] Đã commit code Sprint 2 vào Git local.

---

### ⏳ Sprint 3: ONNX Runtime & Tích hợp YOLOv8 On-Device (⏳ Chưa làm - Đang tạm dừng)
- [ ] Test & Kiểm tra độ chính xác của mô hình YOLO đã train (`.pt`).
- [ ] Export mô hình YOLOv8 sang định dạng `.onnx` (`model.export(format='onnx')`).
- [ ] Cài đặt `onnxruntime-react-native` vào frontend.
- [ ] Tạo `frontend/src/services/yolo-detector.ts` (Preprocess frame, ONNX inference, Postprocess NMS).
- [ ] Kết nối camera thật trong `object-scanner-screen.tsx` với mô hình YOLO.

---

### ⏳ Sprint 4: Kiểm thử End-to-End & Perfect Demo (⏳ Chưa làm)
- [ ] Kiểm thử luồng offline: Quét vật thể → Hiện từ → Lưu Flashcard → Ôn tập quẹt thẻ SM-2.
- [ ] Kiểm thử luồng online: Bật mạng → Tự động Sync XP/Streak → Cập nhật Leaderboard.
- [ ] Kiểm thử nạp dữ liệu từ Spring Boot / Supabase PostgreSQL.
- [ ] Hoàn thiện báo cáo & chuẩn bị kịch bản demo cho Hội đồng.

---

## 🎯 Các bước tiếp theo (Next Actions)

1. **Người dùng (Sinh viên):** 
   - Tiến hành chạy thử mô hình YOLO đã train trên máy tính hoặc Colab.
   - Kiểm tra xem mô hình nhận diện tốt những lớp vật thể nào.
   - Export file trọng số sang định dạng `best.onnx`.

2. **Khi sẵn sàng sang Sprint 3:**
   - Đưa file `best.onnx` vào app và bắt đầu tích hợp ONNX Runtime cho camera quét thời gian thực offline!
