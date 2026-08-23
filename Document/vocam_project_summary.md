# Tổng Hợp Toàn Bộ Dự Án Vocam — Tài Liệu Hỗ Trợ Viết Luận Văn

> **Mục đích:** Tài liệu này tổng hợp chính xác 100% dựa trên mã nguồn thực tế tại `d:\HocTap\English-App`.
> Mọi thông tin đều được trích xuất trực tiếp từ code — không suy đoán, không thêm tính năng chưa có.

---

## Phần 1 — Tổng Quan Dự Án

**Tên ứng dụng:** Vocam
**Loại:** Ứng dụng di động học từ vựng tiếng Anh qua nhận diện vật thể bằng AI
**Kiến trúc:** Monorepo ba dịch vụ độc lập — Frontend (ứng dụng di động), Backend (REST API), AI Service (nhận diện ảnh)

### Cấu trúc thư mục gốc

```
English-App/
├── frontend/          # Ứng dụng di động — React Native + Expo
├── backend/           # REST API — Spring Boot + PostgreSQL (Supabase)
└── ai_service/        # Dịch vụ nhận diện — FastAPI + YOLO-World v2
```

---

## Phần 2 — Tech Stack Chính Xác

### 2.1 Frontend (Ứng dụng di động)

| Công nghệ | Phiên bản chính xác | Ghi chú |
|---|---|---|
| React Native | **0.86.2** | Xác nhận từ `package.json` |
| Expo SDK | **~57.0.13** | Ghi là "Expo SDK 57" trong luận văn |
| Expo Router | ~57.0.13 | Điều hướng theo file-based routing |
| TypeScript | **~6.0.3** | devDependency |
| React | 19.2.3 | |
| react-native-reanimated | 4.5.1 | Animation |
| react-native-gesture-handler | ~2.32.0 | |
| @react-native-community/netinfo | 12.0.1 | Kiểm tra kết nối mạng |
| expo-crypto | ~57.0.1 | Tạo UUID thiết bị |
| @expo/vector-icons | ^15.0.2 | Feather icons |

### 2.2 Backend (REST API)

| Công nghệ | Phiên bản chính xác | Ghi chú |
|---|---|---|
| Spring Boot | **3.3.4** | Ghi là "Spring Boot 3.x" trong luận văn |
| **Java** | **21** | ⚠️ KHÔNG phải Java 17 — `<java.version>21</java.version>` trong pom.xml |
| Spring Data JPA | (quản lý bởi Spring Boot parent) | ORM |
| Flyway | (quản lý bởi Spring Boot parent) | Quản lý migration DB |
| PostgreSQL JDBC Driver | (quản lý bởi Spring Boot parent) | |
| Lombok | (quản lý bởi Spring Boot parent) | |
| spring-dotenv | 4.0.0 | Load biến môi trường từ `.env` |
| H2 Database | (scope: runtime) | Chỉ dùng cho test cục bộ |

**Không có:** Spring Security, JWT, OAuth2.

### 2.3 AI Service (Dịch vụ nhận diện)

| Công nghệ | Phiên bản | Ghi chú |
|---|---|---|
| FastAPI | >=0.100.0 | Web framework Python |
| Uvicorn | >=0.22.0 | ASGI server |
| Ultralytics (YOLO) | >=8.0.0 | Thư viện chạy mô hình YOLO |
| Pillow | >=10.0.0 | Xử lý ảnh |
| OpenCV (headless) | >=4.8.0 | Xử lý ảnh |
| Pydantic | >=2.0.0 | Validation dữ liệu |
| google-generativeai | >=0.3.0 | SDK Gemini AI |
| python-multipart | >=0.0.6 | Upload file |

### 2.4 Cơ sở dữ liệu & Hạ tầng

| Thành phần | Chi tiết |
|---|---|
| Cơ sở dữ liệu | PostgreSQL |
| Nhà cung cấp | **Supabase** (chỉ dùng PostgreSQL, không dùng Auth/Storage/Realtime) |
| Kết nối | JDBC: `db.zxvbmgxvvxqtvukjdbbr.supabase.co:5432/postgres` |
| Schema quản lý | Flyway migration — file `V100__recreate_schema_and_seed.sql` |

---

## Phần 3 — Kiến Trúc Hệ Thống

```
┌──────────────────────────────────────────────────────────┐
│               Ứng dụng di động (React Native)            │
│                    chạy trên Android / iOS               │
└────────┬──────────────────────┬───────────────────────────┘
         │                      │
         │ HTTP REST             │ HTTP REST + multipart/form-data
         ▼                      ▼
┌─────────────────┐    ┌─────────────────────────┐
│  Spring Boot    │    │      FastAPI             │
│  :8080          │    │      :8000               │
│                 │    │                          │
│  /api/words     │    │  /predict-multi          │
│  /api/sync/...  │    │  /generate-context       │
│  /api/leaderboard│   │  /health                 │
└────────┬────────┘    └──────────┬───────────────┘
         │                        │
         │ JDBC                   │ Ultralytics (local)
         ▼                        ▼
┌─────────────────┐    ┌─────────────────────────┐
│  PostgreSQL     │    │  YOLO-World v2 model     │
│  (Supabase)     │    │  yolov8m-worldv2.pt      │
│                 │    │  hoặc yolov8s-worldv2.pt │
│  - words        │    │                          │
│  - user_progress│    │  Google Gemini AI        │
└─────────────────┘    │  (gemini-1.5-flash)      │
                       └──────────────────────────┘
```

---

## Phần 4 — Schema Cơ Sở Dữ Liệu

Chỉ có **hai bảng** trong Supabase PostgreSQL, được tạo bởi Flyway:

### Bảng `words`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGSERIAL PK | Khóa chính tự tăng |
| coco_class | VARCHAR(50) UNIQUE | Tên nhãn YOLO (ví dụ: "cup", "laptop") |
| en_word | VARCHAR(100) | Từ tiếng Anh hiển thị |
| phonetic | VARCHAR(100) | Phiên âm IPA |
| pos | VARCHAR(20) | Từ loại (Noun, Verb, ...) |
| definition | TEXT | Định nghĩa tiếng Anh |
| translation | VARCHAR(200) | Nghĩa tiếng Việt |
| example_en | TEXT | Câu ví dụ tiếng Anh |
| example_vn | TEXT | Câu ví dụ tiếng Việt |
| created_at | TIMESTAMPTZ | Thời gian tạo |

### Bảng `user_progress`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGSERIAL PK | Khóa chính tự tăng |
| device_uuid | VARCHAR(36) UNIQUE | UUID tạo khi ứng dụng khởi chạy lần đầu |
| display_name | VARCHAR(100) | Tên hiển thị người dùng |
| total_xp | INTEGER | Tổng điểm kinh nghiệm tích lũy |
| current_streak | INTEGER | Chuỗi ngày học hiện tại |
| longest_streak | INTEGER | Chuỗi ngày học dài nhất |
| words_learned | INTEGER | Số từ đã học (= số flashcard đã lưu) |
| last_sync_at | TIMESTAMPTZ | Lần đồng bộ gần nhất |

> **Lưu ý:** Không có bảng tài khoản người dùng thật (không có email, mật khẩu, token). Người dùng được nhận diện bằng `device_uuid` sinh trên thiết bị.

---

## Phần 5 — API Endpoints

### Spring Boot (`http://[host]:8080`)

| Method | Endpoint | Chức năng | Dữ liệu trả về |
|---|---|---|---|
| GET | `/api/words` | Lấy toàn bộ 80 từ vựng | `List<WordDto>` |
| GET | `/api/words/{cocoClass}` | Tra cứu từ theo nhãn nhận diện | `WordDto` |
| POST | `/api/sync/progress` | Đồng bộ tiến độ học lên server | `{status, rank}` |
| GET | `/api/leaderboard` | Top 50 người dùng theo XP | `List<LeaderboardEntryDto>` |

### FastAPI (`http://[host]:8000`)

| Method | Endpoint | Chức năng | Dữ liệu trả về |
|---|---|---|---|
| GET | `/health` | Kiểm tra trạng thái service | `{status, gemini_active, loaded_model}` |
| POST | `/predict-multi` | Nhận diện đa vật thể từ ảnh upload | `MultiPredictionResponse` |
| POST | `/generate-context` | Sinh câu ngữ cảnh từ danh sách nhãn | `ContextSentenceResponse` |
| GET | `/` | Trang web demo | HTML |

---

## Phần 6 — Code Flow Chính

### 6.1 Khởi chạy ứng dụng

```
App khởi động
    → Hiện splash (DotsLoader 1.4 giây)
    → Chuyển sang OnboardingScreen
    → Người dùng nhấn "Đăng nhập" / "Tạo tài khoản"
    → DropsAuthScreen (giao diện mô phỏng)
    → setTimeout 1200ms → gọi onAuthSuccess(name, email)
    → Chuyển sang MainContainer (dashboard)
    → useEffect: initDatabase() + getOrCreateDeviceUuid()
    → api.getAllWords() lấy từ Spring Boot → cache vào bộ nhớ
    → triggerBackgroundSync() gửi tiến độ lên server (nếu có mạng)
```

### 6.2 Luồng nhận diện vật thể (Scanner)

```
Người học nhấn tab "Quét AI"
    → ObjectScannerScreen hiển thị khung ngắm
    
[Trên web:] Nhấn nút "CHỤP / CHỌN ẢNH TỪ ĐIỆN THOẠI"
    → HTML input[type=file, capture=environment]
    → Chọn ảnh → tạo FormData
    → handleScan(formData)
    
[Trên native:] Nhấn nút "QUÉT VẬT THỂ MẪU"
    → handleScan() không có formData
    → detect() gọi /health để ping FastAPI (không gửi ảnh thật)
    
handleScan(formData):
    → detect(formData) POST multipart → FastAPI /predict-multi
    → FastAPI: YOLO-World v2 chạy inference
    → Trả về List[DetectedObject] + ContextSentenceResponse (Gemini)
    → Ứng dụng nhận kết quả:
        - Tra cứu từ vựng: getCachedWordByClass() → (nếu không có) api.getWordByClass()
        - setScannedResult(vocabulary)
        - Hiện ResultBottomSheet
    → Người học nhấn "Thêm vào sổ từ" → saveLocalFlashcard() + onAddXp(15)
    → triggerBackgroundSync() (background, fire-and-forget)
```

### 6.3 Luồng ôn tập Flashcard + SM-2

```
Tab "Sổ từ" → FlashcardDeckScreen
    → Hiển thị savedWords (từ bộ nhớ in-memory flashcardsStore)
    → Người học lật thẻ → đánh giá: easy / medium / hard
    
updateFlashcardSM2(id, rating):
    hard  → reps=0, interval=1 ngày, easeFactor -= 0.2 (min 1.3)
    medium → reps+1, interval = interval × 1.5
    easy  → reps+1, easeFactor += 0.15
              reps=1 → interval=1, reps=2 → interval=6
              reps>2 → interval = round(interval × easeFactor)
    
    next_review_at = Date.now() + interval × 86_400_000
```

> **Ba mức đánh giá SM-2 điều chỉnh:** hard / medium / easy (thay vì 6 mức chuẩn gốc)

### 6.4 Luồng đồng bộ tiến độ

```
Mỗi khi XP thay đổi:
    handleAddXp(amount)
    → setUserProgress(updated)
    → triggerBackgroundSync(updated, userName) [fire-and-forget]
        → isOnline() kiểm tra NetInfo
        → nếu offline: return null (bỏ qua)
        → nếu online:
            api.getAllWords() → cacheWordsBulk() (cập nhật cache từ vựng)
            api.syncProgress({deviceUuid, displayName, totalXp, currentStreak, wordsLearned})
            → POST /api/sync/progress → Spring Boot → Upsert user_progress
            → Trả về {status: "ok", rank: N}
```

### 6.5 Luồng Gemini AI

```
FastAPI nhận ảnh → YOLO inference → labels_list = ["cup", "laptop", ...]
    → generate_sentence=true → gọi generate_context_sentence(labels_list)
    
Nếu GEMINI_API_KEY có:
    → gemini-1.5-flash.generate_content(prompt)
    → Prompt: "Generate a 1-sentence English example combining: cup, laptop..."
    → Parse JSON: {sentence_en, sentence_vn}
    → source = "gemini-ai"
    
Nếu GEMINI_API_KEY không có / Gemini lỗi:
    → generate_fallback_context(labels)
    → Template: "There are several items including cup and laptop."
    → source = "template-fallback"
    
Kết quả trả về kèm theo MultiPredictionResponse
→ Ứng dụng hiển thị contextualSentence.sentence_en và sentence_vn
```

---

## Phần 7 — Các Màn Hình Ứng Dụng

| Tab / Màn hình | Component | Mô tả |
|---|---|---|
| Khởi động | `index.tsx` | Splash → Onboarding → Auth → Dashboard |
| Onboarding | `OnboardingScreen` | Chọn trình độ, mục tiêu, thời gian học |
| Đăng ký / Đăng nhập | `DropsAuthScreen` | **Giao diện mô phỏng** — không gọi API xác thực |
| Trang chủ (Home) | `DashboardScreen` | XP, streak, từ trong ngày, tiến độ, bảng xếp hạng |
| Bài học (Learn) | `LessonGridScreen` + `LessonDetailScreen` | Lưới bài học, xem chi tiết, lưu từ |
| Quét AI (Scan) | `ObjectScannerScreen` | Nhận diện vật thể, hiện kết quả, thêm flashcard |
| Sổ từ (Cards) | `FlashcardDeckScreen` + `WordDetailScreen` | Ôn tập SM-2, xem chi tiết từ |
| Cá nhân (Profile) | `ProfileScreen` + `SettingsScreen` | Thống kê, huy hiệu, cài đặt, đăng xuất |
| Tìm kiếm | `SearchScreen` | Tìm từ và bài học trong bộ nhớ |
| Quiz | `PracticeQuizScreen` | Bài tập trắc nghiệm / điền từ |

---

## Phần 8 — Trả Lời 10 Câu Hỏi Xác Nhận

---

### Câu hỏi 1: Cách sử dụng Supabase

**➜ Spring Boot kết nối trực tiếp PostgreSQL Supabase.**

Ứng dụng di động **không** kết nối trực tiếp Supabase. Toàn bộ truy cập dữ liệu đi qua Spring Boot.

| Dịch vụ Supabase | Trạng thái |
|---|---|
| Supabase Auth | **Không** |
| Supabase Storage | **Không** |
| Supabase Realtime | **Không** |

Chỉ sử dụng **PostgreSQL của Supabase** như một cơ sở dữ liệu quan hệ thông thường, kết nối qua JDBC.

---

### Câu hỏi 2: Đăng ký, đăng nhập và phân quyền

| Hạng mục | Trạng thái |
|---|---|
| Đăng ký Email/Mật khẩu | **Giao diện mô phỏng** |
| Đăng nhập Email/Mật khẩu | **Giao diện mô phỏng** |
| Đăng nhập Google | **Giao diện mô phỏng** (modal cứng với 2 tài khoản mẫu) |
| Quên mật khẩu | **Chưa có** |
| JWT | **Không** |
| Spring Security | **Không** |
| Người học có tài khoản lưu trong cơ sở dữ liệu | **Không** — chỉ có `device_uuid` |

**Chi tiết kỹ thuật:** Hàm `handleSubmit()` trong `DropsAuthScreen` thực hiện validate form cục bộ, sau đó `setTimeout(1200ms)` rồi gọi `onAuthSuccess(name, email)` — không gửi request HTTP nào đến server.

**Hệ quả cho luận văn:** Chương 3 (phân tích chức năng) và Chương 4 (cài đặt) cần mô tả đăng nhập/đăng ký là **"giao diện mô phỏng luồng xác thực"**, không phải chức năng hoàn chỉnh.

---

### Câu hỏi 3: Vai trò quản trị viên

| Hạng mục | Trạng thái |
|---|---|
| Web Admin Dashboard có mã nguồn và chạy được | **Không** |
| Admin đăng nhập thật | **Không** |
| Admin quản lý người dùng | **Không** |
| Admin quản lý từ vựng | **Không** |
| Admin quản lý bài học | **Không** |
| Admin xem thống kê | **Không** |

**Kết luận:** Biểu đồ ca sử dụng chỉ có **một tác nhân: Người học**. Vai trò Quản trị viên đưa vào **hướng phát triển tại mục 5.3**.

---

### Câu hỏi 4: Chức năng nhận diện trên ứng dụng di động

| Hạng mục | Trạng thái |
|---|---|
| Người học chụp ảnh bằng camera thật | **Có** (trên nền web: input[capture=environment]) |
| Người học chọn ảnh từ thư viện | **Có** (cùng input[type=file] trên web) |
| Ảnh được gửi thật đến FastAPI | **Có** (khi dùng nút "CHỤP / CHỌN ẢNH") |
| Ứng dụng nhận kết quả thật từ YOLO-World v2 | **Có** (khi FastAPI đang chạy và nhận được ảnh) |
| Hiển thị khung bao trên ảnh | **Có** (component `BoundingBoxOverlay`) |
| Phát hiện nhiều vật thể trong một ảnh | **Có** (endpoint `/predict-multi`) |
| Người học chọn một vật thể trong danh sách | **Có** (trong ResultBottomSheet) |
| Màn hình quét chính còn dùng kết quả mô phỏng | **Có** — nút chính "QUÉT VẬT THỂ MẪU" gọi `handleScan()` không kèm ảnh → chỉ ping `/health` |

**Cách viết trong luận văn:** Dịch vụ FastAPI nhận diện thật. Luồng web-upload (chụp/chọn ảnh) gửi ảnh thật và nhận kết quả thật. Tuy nhiên, nút scan chính trên giao diện native **chưa tích hợp camera native** của thiết bị.

---

### Câu hỏi 5: Dữ liệu 365 vật thể

| Hạng mục | Thực tế |
|---|---|
| Số bản ghi từ vựng trong Supabase | **80 bản ghi** (file migration dòng 38–118) |
| Đủ dữ liệu cho toàn bộ 365 nhãn | **Không** |
| Mỗi từ có phiên âm IPA | **Có** |
| Có nghĩa tiếng Việt | **Có** |
| Có định nghĩa tiếng Anh | **Có** |
| Có câu ví dụ Anh–Việt | **Có** |
| Có hình ảnh minh họa (lưu trong DB) | **Không** — URL ảnh Unsplash được nhúng cứng trong code frontend |

**Cách viết trong luận văn:** "Phạm vi nhận diện của mô hình gồm 365 nhóm vật thể theo danh sách tham chiếu. Kho dữ liệu từ vựng trong cơ sở dữ liệu hiện đã biên soạn đầy đủ cho 80 mục."

---

### Câu hỏi 6: Lưu thẻ và hoạt động ngoại tuyến

**Dữ liệu lưu ở đâu:** Chỉ trong **bộ nhớ RAM khi ứng dụng đang mở** (biến `flashcardsStore[]` và `wordCacheStore{}` trong `database.ts`).

Comment trong code: *"Online-First In-Memory State (No SQLite native dependency)"*

| Khi đóng hoàn toàn và mở lại | Kết quả |
|---|---|
| Thẻ đã lưu | **Mất** |
| XP | **Mất** (không khôi phục từ server khi mở lại) |
| Streak | **Mất** |
| Lịch ôn SM-2 | **Mất** |

| Khi không có mạng | Khả dụng |
|---|---|
| Xem thẻ trong phiên hiện tại | Có |
| Nhận diện vật thể | **Không** (cần FastAPI) |
| Đồng bộ tiến độ | **Không** |
| Bảng xếp hạng | **Không** |
| Bài học và quiz | Có (dữ liệu định nghĩa trước trong ứng dụng) |

**Hệ quả cho luận văn:** Đây là **hạn chế chính** của hệ thống về yêu cầu phi chức năng. Mục 5.2 (hạn chế) cần đề cập dữ liệu học tập mất khi đóng ứng dụng vì chưa có SQLite hoặc AsyncStorage bền vững.

---

### Câu hỏi 7: Bài học, bài tập và huy hiệu

| Hạng mục | Nguồn dữ liệu |
|---|---|
| Bài học | **Định nghĩa trước trong ứng dụng** (`mockLessons` trong `mock-data.ts`) |
| Câu hỏi quiz | **Định nghĩa trước trong ứng dụng** (`mockQuizzes` trong `mock-data.ts`) |
| Huy hiệu | **Định nghĩa trước** với trạng thái `unlocked: true/false` cứng trong `mockUserProgress` — không tính tự động theo điều kiện thực tế |
| Tiến độ bài học lưu lâu dài | **Không** — mất khi đóng ứng dụng |
| XP sau quiz gửi lên Spring Boot | **Có** — `triggerBackgroundSync()` được gọi sau `handleAddXpWithStreakCheck()` |

**Cách viết trong luận văn:** "Dữ liệu bài học và câu hỏi luyện tập được định nghĩa trước trong ứng dụng, hoạt động đầy đủ và phản hồi đúng theo luồng người dùng."

---

### Câu hỏi 8: Gemini

| Hạng mục | Trạng thái |
|---|---|
| Gemini đã được tích hợp và gọi thật | **Có** — SDK `google-generativeai` được cài đặt và cấu hình trong `main.py` |
| Mô hình sử dụng | **gemini-1.5-flash** |
| Gemini sinh câu tiếng Anh và bản dịch tiếng Việt | **Có** — trả về JSON `{sentence_en, sentence_vn}` |
| Câu do Gemini tạo hiển thị trên ứng dụng | **Có** — trường `contextualSentence` trong `MultiDetectionResult` được render trong scanner |
| Khi Gemini lỗi | Dùng câu **template cứng** (ví dụ: "There are several items including cup and laptop."), **không** lấy từ cơ sở dữ liệu |

**Điều kiện hoạt động:** Gemini chỉ hoạt động khi FastAPI được khởi chạy với biến môi trường `GEMINI_API_KEY` hợp lệ.

---

### Câu hỏi 9: Máy chủ và bảng xếp hạng

| Hạng mục | Trạng thái |
|---|---|
| Spring Boot kết nối thành công Supabase | **Có** — cấu hình JDBC + Flyway đầy đủ |
| Tải danh sách từ vựng từ Spring Boot | **Có** — `GET /api/words` |
| Tra cứu từ theo nhãn nhận diện | **Có** — `GET /api/words/{cocoClass}` |
| Đồng bộ XP | **Có** |
| Đồng bộ streak | **Có** |
| Đồng bộ số từ đã học | **Có** |
| Bảng xếp hạng lấy dữ liệu thật từ Supabase | **Có** |
| Số vị trí server trả về | **Top 50** (hằng số `TOP_LIMIT = 50` trong `LeaderboardService`) |

**Logic bảng xếp hạng:** Sắp xếp theo `total_xp DESC`. Rank được tính bằng cách đếm số người dùng có XP cao hơn (`countByTotalXpGreaterThan(xp) + 1`).

---

### Câu hỏi 10: Thông tin cho Chương 4

Thông tin có thể xác nhận từ mã nguồn:

| Hạng mục | Giá trị từ code |
|---|---|
| Ngưỡng tin cậy (confidence threshold) `/predict-multi` | **0.25** |
| Ngưỡng tin cậy `/predict` (single) | **0.30** |
| Ngưỡng IoU | Mặc định của Ultralytics (không cấu hình tùy chỉnh) |
| Mô hình YOLO đang dùng | `yolov8m-worldv2.pt` (fallback) hoặc `models/best.pt` (nếu có) |

Thông tin cần bạn tự cung cấp: hệ điều hành, CPU, RAM, GPU, điện thoại kiểm thử, phiên bản Android/iOS, phiên bản Node.js, phiên bản Python, số ảnh thử nghiệm, số lần chạy, thời gian nhận diện trung bình.

---

## Phần 9 — Những Hạn Chế Cần Nêu Trong Luận Văn

| STT | Hạn chế | Nguyên nhân kỹ thuật |
|---|---|---|
| 1 | **Java 21**, không phải Java 17 | `<java.version>21</java.version>` trong pom.xml |
| 2 | Xác thực người dùng là giao diện mô phỏng | `setTimeout` thay vì gọi API thật; không có Spring Security / JWT |
| 3 | Không có Web Admin Dashboard | Không tồn tại trong mã nguồn |
| 4 | Dữ liệu học tập mất khi đóng ứng dụng | In-memory only, không có SQLite/AsyncStorage |
| 5 | Kho từ vựng chỉ có 80 mục | Flyway seed 80 bản ghi, mô hình nhận diện hỗ trợ 365 nhãn |
| 6 | Nút scan chính chưa dùng camera native | `handleScan()` không có formData → chỉ ping `/health` |
| 7 | Huy hiệu không tính tự động | Hardcoded `unlocked: true/false` trong mock data |
| 8 | Tiến độ bài học không lưu bền vững | Lesson state chỉ trong React state |

---

## Phần 10 — Những Điểm Đã Hoàn Chỉnh (Có thể trình bày là chức năng thật)

| Chức năng | Bằng chứng trong code |
|---|---|
| YOLO-World v2 nhận diện đa vật thể thật | `/predict-multi` endpoint, `ultralytics`, model `.pt` trong repo |
| Gemini sinh câu ngữ cảnh thật | `genai.GenerativeModel('gemini-1.5-flash')`, cơ chế fallback đầy đủ |
| Spring Boot kết nối Supabase thật | JDBC config, Flyway migration, 80 bản ghi seed |
| REST API đầy đủ 4 endpoint | WordController, SyncController, LeaderboardController |
| Thuật toán SM-2 điều chỉnh 3 mức | `updateFlashcardSM2()` trong `database.ts` |
| Đồng bộ tiến độ + bảng xếp hạng top 50 | `LeaderboardService`, `SyncController`, `UserProgressRepository` |
| Tra cứu từ vựng theo nhãn YOLO | `GET /api/words/{cocoClass}` |
| Bounding box overlay trên ảnh | Component `BoundingBoxOverlay` tồn tại |
| Phát hiện mạng và bỏ qua sync khi offline | `NetInfo.fetch()` trong `sync-service.ts` |
| Tính level/XP theo ngưỡng | `handleAddXp()` trong `main-container.tsx` |

---

*Tài liệu được tổng hợp ngày 23/08/2026 từ mã nguồn thực tế tại `d:\HocTap\English-App`.*
*Tác giả: Trần Tiến Anh — MSSV: 22130016*
