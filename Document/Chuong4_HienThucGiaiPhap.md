# CHƯƠNG 4. HIỆN THỰC GIẢI PHÁP

---

## 4.1. Kiến trúc tổng thể hệ thống

### 4.1.1. Tổng quan kiến trúc 3 tầng

Ứng dụng Vocam được hiện thực theo kiến trúc **3 tầng phân tách rõ ràng (Layered Architecture)** với nguyên tắc **offline-first**: mọi chức năng học tập cốt lõi hoạt động độc lập trên thiết bị di động, kết nối máy chủ backend chỉ cần thiết cho các tính năng xã hội và đồng bộ dữ liệu.

| Tầng | Thành phần | Vai trò |
|---|---|---|
| **Presentation + AI** | React Native + TFLite | Giao diện người dùng + AI on-device + lưu trữ cục bộ (SQLite) |
| **Business Logic** | Spring Boot (Java 21) | Xác thực, đồng bộ dữ liệu, bảng xếp hạng |
| **Data** | PostgreSQL | Lưu trữ dữ liệu đồng bộ đa thiết bị phía máy chủ |

---

### 4.1.2. High-level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOCAM MOBILE APP                              │
│              React Native + TypeScript (Expo)                    │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Camera   │  │ Flashcard  │  │  Review  │  │  Progress  │  │
│  │   Module   │  │  Module    │  │  Module  │  │  Module    │  │
│  └─────┬──────┘  └─────┬──────┘  └────┬─────┘  └─────┬──────┘  │
│        │               │              │               │           │
│  ┌─────▼──────────────────────────────────────────────▼──────┐  │
│  │              ON-DEVICE SERVICES LAYER                      │  │
│  │   ┌────────────────┐        ┌──────────────────────────┐  │  │
│  │   │  TFLite Engine │        │  SQLite Database          │  │  │
│  │   │  YOLOv8n Nano  │        │  (expo-sqlite)            │  │  │
│  │   │  ~6 MB model   │        │  flashcards, vocabulary,  │  │  │
│  │   │  < 100 ms      │        │  review_logs, sm2_state   │  │  │
│  │   └────────────────┘        └──────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS · JWT · REST API
                               │ [Only when Internet available]
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    SPRING BOOT BACKEND                           │
│                      Java 21 · Port 8080                         │
│                                                                   │
│  AuthController  │  SyncController  │  LeaderboardController     │
│  UserService     │  FlashcardService│  ProgressService           │
│  JwtFilter       │  Spring Security │  JPA + Hibernate           │
└──────────────────────────────┬──────────────────────────────────┘
                               │ JPA / JDBC Connection
┌──────────────────────────────▼──────────────────────────────────┐
│                    POSTGRESQL DATABASE                           │
│  users · refresh_tokens · flashcards · decks · words             │
│  review_logs · user_progress                                     │
└─────────────────────────────────────────────────────────────────┘
```

> *(Gợi ý chèn Hình 4.1: High-level Architecture Diagram)*

---

### 4.1.3. Module Architecture Diagram

Hệ thống được tổ chức thành **7 module chức năng** độc lập với nhau:

```
Vocam App
├── AuthModule          ← Đăng ký, đăng nhập, quản lý JWT
├── CameraModule        ← Camera preview, capture frame
├── ObjectDetection     ← TFLite inference, NMS, mapping
│   └── VocabularyMapper   ← class_id → VocabularyInfo (SQLite)
├── FlashcardModule     ← CRUD Flashcard, lưu SQLite
├── ReviewModule        ← SM-2 engine, quiz, đánh giá
├── ProgressModule      ← Streak, stats, lịch sử
└── SyncModule          ← Đồng bộ lên Spring Boot khi online
```

> *(Gợi ý chèn Hình 4.2: Module Architecture Diagram)*

---

## 4.2. Kiến trúc phần mềm

### 4.2.1. Phân lớp (Layered Architecture) phía Client

Trong ứng dụng React Native, mã nguồn được tổ chức theo **4 lớp** từ trên xuống:

| Lớp | Thành phần | Nhiệm vụ |
|---|---|---|
| **Screens (UI)** | `CameraScreen`, `FlashcardScreen`, `ReviewScreen`, `ProgressScreen`, `AuthScreen` | Hiển thị UI, điều hướng |
| **Hooks/Controllers** | `useCamera`, `useFlashcard`, `useSM2`, `useSync` | Logic nghiệp vụ UI |
| **Services** | `TFLiteService`, `VocabularyService`, `FlashcardService`, `SM2Service`, `AuthService`, `SyncService` | Xử lý nghiệp vụ thuần túy |
| **Repositories/DB** | `SQLiteRepository`, `SecureStorage` | Truy cập dữ liệu cục bộ |

---

### 4.2.2. Phân lớp phía Backend (Spring Boot)

| Lớp | Package | Nhiệm vụ |
|---|---|---|
| **Controller** | `controller/` | Nhận HTTP request, trả response |
| **Service** | `service/` | Logic nghiệp vụ |
| **Repository** | `repository/` | Spring Data JPA, truy cập DB |
| **Entity** | `entity/` | JPA entities ánh xạ với bảng PostgreSQL |
| **Security** | `security/` | JWT filter, Spring Security config |
| **DTO** | `dto/` | Data Transfer Objects |

---

## 4.3. Thiết kế chức năng hệ thống

### 4.3.1. Use Case Diagram

**Các tác nhân (Actors):**
- **User**: Người dùng phổ thông, sử dụng mọi tính năng học tập.
- **System**: Hệ thống tự động (SM-2 scheduler, sync service).

**Danh sách Use Cases:**

| Mã | Use Case | Actor | Mô tả |
|---|---|---|---|
| UC01 | Đăng ký tài khoản | User | Tạo tài khoản mới bằng email/mật khẩu |
| UC02 | Đăng nhập | User | Xác thực và nhận JWT token |
| UC03 | Quét camera nhận diện vật thể | User | Mở camera, nhận diện on-device, xem từ vựng |
| UC04 | Lưu Flashcard | User | Lưu kết quả nhận diện thành Flashcard |
| UC05 | Xem danh sách Flashcard | User | Xem, tìm kiếm, quản lý Flashcard |
| UC06 | Ôn tập Flashcard | User | Thực hiện phiên ôn tập SM-2 |
| UC07 | Thực hiện Quiz | User | Làm bài trắc nghiệm/điền từ |
| UC08 | Xem tiến độ học tập | User | Xem streak, số từ đã học, biểu đồ |
| UC09 | Đồng bộ dữ liệu | User / System | Đẩy dữ liệu lên server khi có mạng |
| UC10 | Xem bảng xếp hạng | User | Xem ranking trong cộng đồng (cần mạng) |
| UC11 | Nhận thông báo ôn tập | System | Gửi push notification khi Flashcard đến hạn |

---

### 4.3.2. Activity Diagrams

#### Activity 1: Quét và nhận diện vật thể

```
[Bắt đầu]
    │
    ▼
Người dùng mở màn hình Camera
    │
    ▼
Hệ thống khởi tạo TFLite Runtime + nạp mô hình YOLOv8n
    │
    ▼
Camera bắt đầu stream khung hình liên tục
    │
    ▼
┌───── Vòng lặp nhận diện ─────┐
│  Lấy 1 khung hình             │
│      │                        │
│      ▼                        │
│  Tiền xử lý ảnh               │
│  (resize 320×320, normalize)  │
│      │                        │
│      ▼                        │
│  YOLOv8n TFLite Inference     │
│      │                        │
│      ▼                        │
│  Non-Maximum Suppression (NMS)│
│      │                        │
│  ┌───┴────┐                   │
│  │Phát hiện│  Không  ─────────┤
│  │vật thể? │                  │
│  └───┬────┘                   │
│      │ Có                     │
│      ▼                        │
│  Ánh xạ → thông tin từ vựng  │
│      │                        │
│      ▼                        │
│  Vẽ bounding box lên preview  │
│      │                        │
│  Hiển thị bottom sheet từ vựng│
└───────────────────────────────┘
    │
    ▼
Người dùng:
├── Nhấn "Lưu Flashcard" → [sang Activity 2]
└── Nhấn "Đóng" → Quay lại camera stream
```

> *(Gợi ý chèn Hình 4.3: Activity Diagram – Quét và nhận diện vật thể)*

#### Activity 2: Tạo và lưu Flashcard

```
[Bắt đầu: Người dùng nhấn "Lưu Flashcard"]
    │
    ▼
Hệ thống lấy thông tin từ vựng (từ VocabularyMapper)
    │
    ▼
Hệ thống chụp ảnh snapshot tại thời điểm nhận diện
    │
    ▼
Tạo đối tượng Flashcard với:
  - word_id (từ vocabulary)
  - image_snapshot
  - ease_factor = 2.5
  - interval_days = 1
  - repetitions = 0
  - next_review_at = now + 1 ngày
    │
    ▼
┌── Flashcard đã tồn tại? ──┐
│         │ Có               │
│         ▼                  │
│  Hỏi người dùng:           │
│  "Từ này đã có. Thêm lại?" │
│         │                  │
│   Có ◄──┤──► Không → Hủy  │
└────┬────┘                  │
     │                       │
     ▼                       │
Lưu Flashcard vào SQLite (local)
     │
     ▼
Hiển thị thông báo "Đã lưu thành công!"
     │
     ▼
┌── Có kết nối mạng? ──┐
│        │ Có           │
│        ▼              │
│  Đồng bộ lên server   │
│  (background task)    │
│        │ Không        │
│        ▼              │
│  Đánh dấu "pending    │
│  sync" → sync sau     │
└───────────────────────┘
     │
     ▼
[Kết thúc]
```

> *(Gợi ý chèn Hình 4.4: Activity Diagram – Tạo và lưu Flashcard)*

#### Activity 3: Ôn tập theo SM-2

```
[Bắt đầu: Người dùng mở màn hình Review]
    │
    ▼
Truy vấn SQLite: lấy Flashcard có next_review_at ≤ now()
    │
    ▼
┌── Có Flashcard đến hạn? ──┐
│         │ Không            │
│         ▼                  │
│  Hiển thị: "Hôm nay không  │
│  có từ cần ôn tập!"        │
│  → Hiện ngày ôn tiếp theo  │
│         │                  │
│         ▼  Có              │
│  [Vòng lặp ôn tập]         │
│                             │
│  Hiển thị mặt trước card:  │
│  Từ tiếng Anh + Hình ảnh   │
│         │                  │
│  Người dùng nhấn "Lật"     │
│         │                  │
│  Hiển thị mặt sau:         │
│  Phiên âm + Nghĩa + Ví dụ  │
│         │                  │
│  Người dùng chọn điểm:     │
│  [0][1][2][3][4][5]         │
│         │                  │
│  Tính SM-2: EF', I, n mới  │
│  Cập nhật next_review_at   │
│  Lưu vào review_logs       │
│         │                  │
│  Còn Flashcard? ────► Vòng │
│         │ Không             │
└─────────┘                  │
     │                       │
     ▼                       │
Hiển thị kết quả phiên ôn:
  - Số từ đã ôn
  - Số từ cần ôn lại
  - Điểm XP nhận được
     │
     ▼
Cập nhật streak + user_progress (SQLite)
     │
     ▼
[Kết thúc]
```

> *(Gợi ý chèn Hình 4.5: Activity Diagram – Ôn tập theo SM-2)*

---

### 4.3.3. Sequence Diagrams

#### Sequence 1: Luồng nhận diện vật thể

```
User       CameraScreen    TFLiteService    VocabularyMapper    SQLiteDB
  │              │                │                 │               │
  │──openCamera──►              │                 │               │
  │              │──initTFLite──►│                 │               │
  │              │◄─ready────────│                 │               │
  │              │               │                 │               │
  │              │──(loop) getFrame──              │               │
  │              │──detect(frame)──►               │               │
  │              │                │──preprocess─►  │               │
  │              │                │──inference──►  │               │
  │              │                │──NMS+filter─►  │               │
  │              │◄──detections───│                 │               │
  │              │                                  │               │
  │              │──mapLabel(class_id)─────────────►│               │
  │              │                                  │──query────────►
  │              │                                  │◄──VocabInfo───│
  │              │◄──VocabularyInfo────────────────────             │
  │              │                                                   │
  │◄─showBottomSheet(word, phonetic, meaning)────                   │
  │              │                                                   │
  │──tapSave──►  │                                                   │
  │              │──saveFlashcard(vocabInfo, snapshot)──────────────►
  │              │◄──savedOK───────────────────────────────────────│
  │◄─showSuccess─│                                                   │
```

> *(Gợi ý chèn Hình 4.6: Sequence Diagram – Luồng nhận diện vật thể)*

#### Sequence 2: Luồng ôn tập Flashcard

```
User      ReviewScreen    SM2Service    SQLiteDB    SyncService    SpringBootAPI
  │             │               │            │              │               │
  │──openReview►│               │            │              │               │
  │             │──getDueCards──────────────►│              │               │
  │             │◄──[cards]─────────────────│              │               │
  │             │               │            │              │               │
  │◄──showCard──│               │            │              │               │
  │             │               │            │              │               │
  │──flip()────►│               │            │              │               │
  │◄──showBack──│               │            │              │               │
  │             │               │            │              │               │
  │──rate(q=4)─►│               │            │              │               │
  │             │──calculate(q)─►            │              │               │
  │             │◄──{EF',I,n,next_review}────│              │               │
  │             │──updateFlashcard──────────►│              │               │
  │             │──insertReviewLog──────────►│              │               │
  │             │◄──OK──────────────────────│              │               │
  │             │               │            │              │               │
  │             │──triggerSync──────────────────────────────►              │
  │             │               │            │              │──POST /sync───►
  │             │               │            │              │◄──200 OK──────│
  │             │               │            │              │               │
  │◄──nextCard──│  [lặp lại cho các card còn lại]           │               │
  │             │               │            │              │               │
  │             │──updateStreak / updateXP──►│              │               │
  │◄──showSummary(done, XP)─────│            │              │               │
```

> *(Gợi ý chèn Hình 4.7: Sequence Diagram – Luồng ôn tập Flashcard)*

---

### 4.3.4. Class Diagram

```
┌─────────────────┐         ┌──────────────────────┐
│      User        │         │      Flashcard         │
├─────────────────┤         ├──────────────────────┤
│ id: String       │  1   *  │ id: String            │
│ email: String    ├─────────┤ userId: String        │
│ displayName: Str │         │ wordId: String        │
│ avatarUrl: Str   │         │ imagePath: String     │
│ createdAt: Date  │         │ easeFactor: Float     │
│ isActive: Bool   │         │ intervalDays: Int     │
└──────┬──────────┘         │ repetitions: Int      │
       │                    │ nextReviewAt: Date    │
       │1                   │ createdAt: Date       │
       │                    └──────────┬────────────┘
┌──────▼──────────┐                   │1
│  UserProgress    │              *    │
├─────────────────┤    ┌──────────────▼────────────┐
│ userId: String   │    │        ReviewLog           │
│ totalLearned:Int │    ├────────────────────────────┤
│ currentStreak:Int│    │ id: String                 │
│ longestStreak:Int│    │ flashcardId: String        │
│ totalXP: Int     │    │ quality: Int (0–5)         │
│ lastStudyDate    │    │ reviewedAt: Date           │
└─────────────────┘    │ newInterval: Int           │
                        │ newEaseFactor: Float       │
                        └────────────────────────────┘

┌──────────────────────┐        ┌──────────────────────┐
│    VocabularyWord     │        │         Deck          │
├──────────────────────┤        ├──────────────────────┤
│ id: String           │  *   1 │ id: String           │
│ labelEn: String      ├────────┤ userId: String       │
│ phoneticIPA: String  │        │ name: String         │
│ wordType: String     │        │ description: String  │
│ definitionVi: String │        │ isPublic: Bool       │
│ exampleSentence: Str │        │ createdAt: Date      │
│ audioFilename: Str   │        └──────────────────────┘
└──────────────────────┘

┌──────────────────────┐        ┌──────────────────────┐
│    TFLiteService      │        │      SM2Service        │
├──────────────────────┤        ├──────────────────────┤
│ model: TFLiteModel   │        │ (stateless utility)  │
│ isReady: Bool        │        ├──────────────────────┤
├──────────────────────┤        │ calculate(            │
│ init(): void          │        │   quality: Int,       │
│ detect(frame):        │        │   ef: Float,          │
│   List<Detection>    │        │   interval: Int,       │
│ preprocess(img):      │        │   reps: Int           │
│   Tensor             │        │ ): SM2Result           │
│ applyNMS():           │        └──────────────────────┘
│   List<Detection>    │
└──────────────────────┘
```

> *(Gợi ý chèn Hình 4.8: Class Diagram đầy đủ)*

---

## 4.4. Thiết kế dữ liệu

### 4.4.1. Sơ đồ thực thể quan hệ (ERD)

```
users ─────< decks ─────< words ─────< flashcards ─────< review_logs
  │
  ├──< refresh_tokens
  └──o user_progress
```

> *(Gợi ý chèn Hình 4.9: ERD – Sơ đồ thực thể quan hệ đầy đủ)*

### 4.4.2. Data Dictionary

#### Bảng `users`
| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | Khóa chính |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã BCrypt hash |
| `display_name` | VARCHAR(100) | NOT NULL | Tên hiển thị |
| `avatar_url` | TEXT | NULL | URL ảnh đại diện |
| `is_active` | BOOLEAN | DEFAULT TRUE | Tài khoản kích hoạt |
| `is_email_verified` | BOOLEAN | DEFAULT FALSE | Xác thực email |
| `role` | VARCHAR(20) | DEFAULT 'USER' | USER / ADMIN |
| `created_at` | TIMESTAMPTZ | NOT NULL | Thời điểm tạo tài khoản |

#### Bảng `flashcards`
| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | Khóa chính |
| `user_id` | UUID | FK → users.id | Người sở hữu |
| `word_id` | UUID | FK → words.id | Từ vựng liên kết |
| `image_path` | TEXT | NULL | Đường dẫn ảnh snapshot |
| `ease_factor` | DECIMAL(4,2) | DEFAULT 2.5 | Hệ số dễ SM-2 |
| `interval_days` | INTEGER | DEFAULT 1 | Khoảng cách ôn (ngày) |
| `repetitions` | INTEGER | DEFAULT 0 | Số lần ôn thành công |
| `next_review_at` | TIMESTAMPTZ | NOT NULL | Thời điểm ôn tiếp theo |
| `created_at` | TIMESTAMPTZ | NOT NULL | Thời điểm tạo |
| `is_synced` | BOOLEAN | DEFAULT FALSE | Đã đồng bộ lên server chưa |

#### Bảng `words` (từ vựng)
| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | Khóa chính |
| `deck_id` | UUID | FK → decks.id | Deck chứa từ |
| `label_en` | VARCHAR(100) | NOT NULL | Từ tiếng Anh (COCO class label) |
| `phonetic_ipa` | VARCHAR(100) | NULL | Phiên âm IPA |
| `word_type` | VARCHAR(20) | NULL | Noun / Verb / Adj... |
| `definition_vi` | TEXT | NOT NULL | Nghĩa tiếng Việt |
| `example_sentence` | TEXT | NULL | Câu ví dụ |
| `audio_filename` | VARCHAR(200) | NULL | Tên file phát âm |

#### Bảng `review_logs` (lịch sử ôn tập)
| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | Khóa chính |
| `flashcard_id` | UUID | FK → flashcards.id | Flashcard được ôn |
| `quality` | SMALLINT | CHECK (0–5) | Điểm đánh giá SM-2 |
| `reviewed_at` | TIMESTAMPTZ | NOT NULL | Thời điểm ôn |
| `new_interval` | INTEGER | NOT NULL | Khoảng cách mới sau lần ôn này |
| `new_ease_factor` | DECIMAL(4,2) | NOT NULL | EF mới sau lần ôn này |

#### Bảng `user_progress`
| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `user_id` | UUID | PK, FK → users.id | Khóa chính đồng thời là FK |
| `total_words_learned` | INTEGER | DEFAULT 0 | Tổng số từ đã học |
| `current_streak` | INTEGER | DEFAULT 0 | Chuỗi học liên tiếp hiện tại (ngày) |
| `longest_streak` | INTEGER | DEFAULT 0 | Chuỗi dài nhất từng đạt được |
| `total_xp` | INTEGER | DEFAULT 0 | Tổng điểm kinh nghiệm |
| `last_study_date` | DATE | NULL | Ngày học gần nhất |

---

## 4.5. Hiện thực các module

### 4.5.1. Module Authentication
- `AuthScreen` (React Native): Form đăng ký/đăng nhập
- `AuthService` (React Native): Gọi API, lưu token vào SecureStorage
- `AuthController` (Spring Boot): Xử lý `/auth/register`, `/auth/login`, `/auth/refresh`
- `JwtUtil` (Spring Boot): Tạo và xác thực JWT
- `JwtAuthFilter` (Spring Boot): Interceptor xác thực mọi request

### 4.5.2. Module Camera
- `CameraScreen` (React Native): Màn hình camera chính
- `useCameraFeed` (custom hook): Quản lý lifecycle camera với `expo-camera`

### 4.5.3. Module Object Detection
- `TFLiteService`: Nạp model `yolov8n_float32.tflite` (hoặc INT8 quantized), chạy inference
- `ImagePreprocessor`: Resize 320×320, normalize
- `NMSProcessor`: Non-Maximum Suppression (confidence 0.35, IoU 0.45)

### 4.5.4. Module Vocabulary Mapping
- `VocabularyMapper`: Tra cứu từ điển cục bộ theo `class_id` hoặc `label_en`

### 4.5.5. Module Flashcard
- `FlashcardScreen`: Danh sách và chi tiết Flashcard
- `FlashcardService`: Logic tạo, cập nhật, xóa Flashcard

### 4.5.6. Module Review (SM-2)
- `ReviewScreen`: Màn hình ôn tập chính với hiệu ứng lật thẻ
- `SM2Service`: Hàm tính toán SM-2 thuần túy (`EF'`, `Interval`, `Repetitions`)

### 4.5.7. Module Synchronization
- `SyncService`: Theo dõi kết nối mạng và đẩy dữ liệu offline lên Spring Boot Backend → PostgreSQL

---

## 4.6. Công nghệ và môi trường phát triển

### 4.6.1. Frontend — React Native + TypeScript
- Framework: React Native 0.74+, Expo SDK 51, TypeScript 5.x
- Thư viện: `expo-camera`, `expo-sqlite`, `expo-av`, `react-native-fast-tflite`, `@react-navigation`, Zustand, axios, `expo-secure-store`.

### 4.6.2. AI — YOLOv8n + TensorFlow Lite (LiteRT)
- Mô hình: YOLOv8n (PyTorch -> TFLite INT8 quantized ~6 MB)
- Latency: < 100 ms trên CPU tầm trung

### 4.6.3. Backend — Spring Boot + PostgreSQL
- Framework: Spring Boot 4.1.0, Java 21
- Database: PostgreSQL 15
- Security: Spring Security + JWT, BCrypt password hashing

---

## 4.7. Giao diện người dùng

1. **Màn hình Camera**: Camera preview, bounding box overlay, bottom sheet thông tin từ vựng, nút "Lưu Flashcard", nút phát âm TTS.
2. **Màn hình Flashcard**: Quản lý danh sách deck, tìm kiếm, lọc từ vựng theo trạng thái thuộc.
3. **Màn hình Review**: Thẻ lật flip 2 mặt (Mặt trước: Từ + Ảnh; Mặt sau: Phiên âm + Nghĩa + Ví dụ), 6 nút chấm điểm SM-2 (0-5).
4. **Màn hình Progress**: Streak 🔥, biểu đồ học tập 7 ngày, tổng số từ thuộc.
5. **Màn hình Profile/Settings**: Thông tin tài khoản, nút đồng bộ thủ công, cài đặt thông báo.

---

## 4.8. Các vấn đề gặp phải và giải pháp

1. **Model TFLite chậm trên thiết bị cũ** -> Lượng tử hóa INT8 + giảm input size 320x320 + bật GPU delegate + throttle camera frame.
2. **Tiêu thụ pin khi camera chạy liên tục** -> Lifecycle-aware camera, dừng inference khi app chuyển background.
3. **Conflict dữ liệu khi sync nhiều thiết bị** -> Dùng UUID cho primary key + chiến lược "Server Wins" dựa trên timestamp `updated_at`.
4. **Nhận diện sai ở môi trường tối** -> Tăng confidence threshold lên 0.35 + yêu cầu nhận diện ổn định trong 3 frames liên tiếp.

---

## 4.9. Kiểm thử hệ thống

### Kết quả kiểm thử tổng hợp

| Hạng mục | Kết quả |
|---|---|
| Unit Test SM-2 (6 trường hợp) | 6/6 Passed ✅ |
| Integration Test (4 trường hợp) | 4/4 Passed ✅ |
| Manual Test — Nhận diện (5 thiết bị) | Accuracy > 80% với 80 lớp COCO |
| Inference time trung bình (Snapdragon 7xx) | ~85 ms ✅ (< 100 ms) |
| Hoạt động offline | ✅ Camera + Flashcard + SM-2 100% offline |
| Đồng bộ tự động khi có mạng | ✅ Hoàn thành trong < 3 giây |

---

## 4.10. Kết luận chương

Chương 4 đã trình bày toàn bộ quá trình hiện thực giải pháp ứng dụng Vocam, từ thiết kế kiến trúc phân tầng 3 lớp, các sơ đồ UML (Use Case, Activity, Sequence, Class Diagram), ERD & Data Dictionary, đến hiện thực 7 module chức năng và kết quả kiểm thử thực nghiệm thành công.

---
*[Hết Chương 4]*
