# 📊 Vocam — Báo cáo Tiến độ & Phân chia Sprint

> **Sinh viên:** Trần Tiến Anh — MSSV: 22130016
> **Đề tài:** *Nghiên cứu và ứng dụng mô hình YOLO trong nhận diện vật thể hỗ trợ học từ vựng tiếng Anh trên thiết bị di động*
> **Cập nhật lần cuối:** 06/08/2026

---

## 📈 Bảng Tổng hợp Tiến độ

| Sprint | Nội dung | Trạng thái | Git |
|---|---|---|---|
| **Phase 0** | UI Design System & Giao diện | ✅ Hoàn thành | ✅ Pushed |
| **Sprint 1** | Spring Boot Backend + PostgreSQL | ✅ Hoàn thành | ✅ Pushed |
| **Sprint 2** | Frontend SQLite Offline + Sync Client | ✅ Hoàn thành | ✅ Pushed |
| **Sprint 3A** | YOLO Detector Groundwork & Scanner Refactor | ✅ Hoàn thành | ✅ Pushed |
| **Sprint 3B** | ONNX Runtime On-Device Integration | ⏳ Chờ test model | — |
| **Sprint 4** | End-to-End Testing & Demo Polish | ⏳ Chưa làm | — |

---

## 📋 Chi tiết Công việc theo Sprint

### 🔹 Phase 0: Design System & Giao diện ✅ (100%)
- [x] Đồng bộ toàn bộ palette màu với `vocam_color_palette.html` (Primary: `#2C6E49`, Secondary: `#2A7069`)
- [x] Thay thế hex hardcode trong Dashboard & Profile bằng `Palette.*` semantic tokens
- [x] Tạo component `DotsLoader` (bounce animation thay `ActivityIndicator`)
- [x] Tích hợp `DotsLoader` vào Auth, Boot Splash, Scanner, Google Modal
- [x] 5 màn hình/modal mới: Word Detail, Lesson Detail, Streak Celebration, Settings, Search

---

### 🔹 Sprint 1: Spring Boot Backend ✅ (100% · Pushed)
- [x] `pom.xml` — Spring Boot 3.3.4 + JPA + PostgreSQL + Flyway + Validation
- [x] `application.properties` — Cấu hình với env fallback cho local dev & Supabase
- [x] `V1__create_tables.sql` — Bảng `words` và `user_progress`
- [x] `V2__seed_coco_words.sql` — 80 lớp COCO + IPA + nghĩa Việt + câu ví dụ song ngữ
- [x] Entity: `Word.java`, `UserProgress.java` (explicit getters, không Lombok)
- [x] Repository: `WordRepository`, `UserProgressRepository` (custom JPQL queries)
- [x] DTO: `WordDto`, `SyncRequest`, `SyncResponse`, `LeaderboardEntryDto`
- [x] Service: `WordService`, `LeaderboardService` (upsert + tính rank)
- [x] Controller: `GET /api/words`, `GET /api/words/{class}`, `POST /api/sync/progress`, `GET /api/leaderboard`
- [x] `WebConfig.java` — CORS filter cho phép mobile dev

---

### 🔹 Sprint 2: Frontend SQLite & Sync ✅ (100% · Pushed)
- [x] Cài `expo-sqlite`, `expo-crypto`, `@react-native-community/netinfo`
- [x] `db/database.ts` — 4 bảng SQLite:
  - `flashcards` (SM-2: `ease_factor`, `interval_days`, `repetitions`, `next_review_at`)
  - `cached_words` (80 từ COCO, offline 0ms)
  - `learning_events` (hàng chờ sync khi offline)
  - `app_config` (`device_uuid` duy nhất cho thiết bị)
- [x] `services/api.ts` — Kết nối Spring Boot Backend
- [x] `services/sync-service.ts` — NetInfo check + `triggerBackgroundSync` fire-and-forget
- [x] Wire SQLite vào `main-container.tsx`:
  - Load flashcards từ SQLite khi mount
  - `wordsLearned` thật phản ánh số từ trong SQLite
  - `saveLocalFlashcard()`, `deleteLocalFlashcard()`, `updateFlashcardSM2()` đầy đủ
- [x] Global Leaderboard thời thực trong `profile-screen.tsx` (Top 10 + vị trí người dùng)

---

### 🔹 Sprint 3A: YOLO Groundwork ✅ (100% · Pushed)
- [x] Tạo `services/yolo-detector.ts`:
  - `COCO_CLASSES[80]` đúng thứ tự index YOLOv8
  - `detect()` hiện chạy **mock mode** từ SQLite cache để demo
  - `realDetect()` với ONNX Runtime đã viết sẵn, comment — chỉ cần uncomment khi có model
- [x] Refactor `object-scanner-screen.tsx`:
  - Kết nối `yolo-detector.ts`
  - **Confidence bar** hiển thị % tin cậy model
  - **Pulse animation** viewfinder khi scanning
  - Badge **"YOLOv8 nano · On-Device"**
  - Xoá toàn bộ hardcoded hex → `Palette.*`
- [x] Thêm `VocabularyWord.cocoClass` và `UserProgress.wordsLearned` vào types

---

### ⏳ Sprint 3B: ONNX Runtime On-Device (Chờ test model)

**Điều kiện bắt đầu:** Bạn test xong `best.pt` và confirm accuracy ổn.

- [ ] Test mô hình YOLO đã train (`best.pt`) — kiểm tra accuracy/mAP
- [ ] Export: `model.export(format='onnx', imgsz=640, simplify=True)` → `best.onnx`
- [ ] Cài `onnxruntime-react-native`
- [ ] Chạy `npx expo prebuild` (bắt buộc cho native module)
- [ ] Copy `best.onnx` vào `frontend/assets/models/yolov8n.onnx`
- [ ] Uncomment `realDetect()` trong `yolo-detector.ts`, thay `mockDetect()`
- [ ] Build & test trên iPhone thật: `npx expo run:ios`

---

### ⏳ Sprint 4: End-to-End Testing & Demo Polish (Chưa làm)
- [ ] Kết nối Supabase PostgreSQL (set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` trong `application.properties`)
- [ ] Kiểm thử luồng **offline**: Quét → Hiện từ → Lưu Flashcard → Quẹt SM-2
- [ ] Kiểm thử luồng **online**: Bật mạng → Auto sync XP/streak → Leaderboard cập nhật
- [ ] Kiểm thử nạp từ vựng lần đầu: `/api/words` → cache SQLite → offline lookup
- [ ] Hoàn thiện báo cáo & kịch bản demo cho Hội đồng

---

## 🎯 Next Actions

| # | Việc cần làm | Người thực hiện |
|---|---|---|
| 1 | Chạy thử `best.pt` — kiểm tra mô hình nhận diện có tốt không | Bạn |
| 2 | Export `best.onnx` | Bạn |
| 3 | Kết nối Supabase | Bạn (lấy connection string trên supabase.com) |
| 4 | Tích hợp ONNX vào app | Mình làm khi bạn có `best.onnx` |
| 5 | End-to-End test & demo | Cùng làm |
