# Kiến trúc Hệ thống Vocam — Tất cả Sơ đồ Mermaid

> Tài liệu chứa toàn bộ các sơ đồ kiến trúc hệ thống cho ứng dụng **Vocam**.
> Bạn có thể render trực tiếp trong VS Code (với extension "Markdown Preview Mermaid Support") hoặc paste vào **https://mermaid.live** để xem/tải ảnh.

---

## 1. High-level Architecture Diagram

```mermaid
graph TB
    subgraph MOBILE["📱 Vocam Mobile App (React Native + TypeScript)"]
        CAM[Camera Screen]
        FC[Flashcard Screen]
        REV[Review Screen]
        PROG[Progress Screen]
        
        subgraph LOCAL["On-Device Layer (Offline ✅)"]
            TFLITE["🤖 YOLOv8n TFLite\n~6MB | <100ms"]
            SQLITE[("🗄 SQLite Local\nflashcards · vocabulary\nreview_logs · sm2_state")]
            SM2["⚙️ SM-2 Engine\n(pure computation)"]
        end
    end

    subgraph BACKEND["☁️ Spring Boot Backend (Java 21)"]
        AUTH[AuthController]
        SYNC[SyncController]
        LB[LeaderboardController]
        SEC[Spring Security + JWT]
    end

    subgraph DB["🗃 PostgreSQL Database"]
        PG[("users · refresh_tokens\nflashcards · decks · words\nreview_logs · user_progress")]
    end

    CAM -->|frames| TFLITE
    TFLITE -->|detections| CAM
    CAM -->|save| SQLITE
    FC <-->|CRUD| SQLITE
    REV <-->|SM-2 calc| SM2
    REV <-->|read/write| SQLITE
    PROG <-->|read| SQLITE

    MOBILE <-->|"HTTPS · JWT · REST API\n[Sync when Online 🌐]"| BACKEND
    BACKEND <-->|JPA / JDBC Connection| DB
```

---

## 2. Module Architecture Diagram

```mermaid
graph TD
    subgraph APP["Vocam App"]
        AUTH_MOD["🔐 AuthModule\nRegister · Login · JWT"]
        CAM_MOD["📷 CameraModule\nPreview · Capture"]
        DET_MOD["🔍 ObjectDetectionModule\nTFLite Inference · NMS"]
        VOC_MOD["📖 VocabularyMapper\nclass_id → VocabInfo"]
        FC_MOD["🗃 FlashcardModule\nCRUD · Duplicate check"]
        REV_MOD["🔄 ReviewModule\nSM-2 · Quiz Engine"]
        PROG_MOD["📊 ProgressModule\nStreak · XP · Stats"]
        SYNC_MOD["🔁 SyncModule\nNetwork monitor · Push to server"]
    end

    CAM_MOD --> DET_MOD
    DET_MOD --> VOC_MOD
    VOC_MOD --> FC_MOD
    FC_MOD --> REV_MOD
    REV_MOD --> PROG_MOD
    FC_MOD --> SYNC_MOD
    REV_MOD --> SYNC_MOD
    PROG_MOD --> SYNC_MOD
    AUTH_MOD --> SYNC_MOD
```

---

## 3. Use Case Diagram

```mermaid
graph LR
    USER(("👤\nUser"))
    SYS(("⚙️\nSystem"))

    USER --> UC01["UC01\nĐăng ký tài khoản"]
    USER --> UC02["UC02\nĐăng nhập"]
    USER --> UC03["UC03\nQuét camera\nnhận diện vật thể"]
    USER --> UC04["UC04\nLưu Flashcard"]
    USER --> UC05["UC05\nXem danh sách Flashcard"]
    USER --> UC06["UC06\nÔn tập Flashcard\n(SM-2)"]
    USER --> UC07["UC07\nThực hiện Quiz"]
    USER --> UC08["UC08\nXem tiến độ học tập"]
    USER --> UC09["UC09\nĐồng bộ dữ liệu"]
    USER --> UC10["UC10\nXem bảng xếp hạng"]
    SYS  --> UC11["UC11\nGửi thông báo\nnhắc nhở ôn tập"]

    UC03 -.->|"include"| UC04
    UC06 -.->|"include"| UC07
    UC09 -.->|"requires online"| UC10

    style UC03 fill:#4CAF50,color:#fff
    style UC06 fill:#4CAF50,color:#fff
    style UC09 fill:#2196F3,color:#fff
    style UC10 fill:#2196F3,color:#fff
    style UC11 fill:#FF9800,color:#fff
```

---

## 4. Activity Diagram 1: Quét và nhận diện vật thể

```mermaid
flowchart TD
    A([Bắt đầu]) --> B[Người dùng mở Camera Screen]
    B --> C[Khởi tạo TFLite Runtime\nnạp YOLOv8n model]
    C --> D[Bắt đầu camera stream]
    D --> E[Lấy 1 khung hình]
    E --> F[Tiền xử lý: resize 320×320\nnormalize pixel values]
    F --> G[YOLOv8n Inference]
    G --> H[Non-Maximum Suppression\nConf threshold=0.35]
    H --> I{Phát hiện\nvật thể?}
    I -->|Không| E
    I -->|Có| J[Ánh xạ class_id → VocabularyInfo]
    J --> K[Vẽ bounding box\nlên camera preview]
    K --> L[Hiển thị bottom sheet\nthông tin từ vựng]
    L --> M{Người dùng\nchọn}
    M -->|Lưu Flashcard| N([→ Activity 2])
    M -->|Đóng| E

    style A fill:#4CAF50,color:#fff
    style N fill:#2196F3,color:#fff
```

---

## 5. Activity Diagram 2: Tạo và lưu Flashcard

```mermaid
flowchart TD
    A([Bắt đầu:\nnhấn Lưu Flashcard]) --> B[Lấy VocabularyInfo\ntừ VocabularyMapper]
    B --> C[Chụp snapshot ảnh\ntại thời điểm nhận diện]
    C --> D{Flashcard từ này\nđã tồn tại?}
    D -->|Không| F[Tạo Flashcard mới\nease=2.5, interval=1\nrepetitions=0]
    D -->|Có| E[Hỏi xác nhận\n'Từ đã có. Thêm lại?']
    E -->|Không| Z([Hủy])
    E -->|Có| F
    F --> G[Lưu vào SQLite\nis_synced=false]
    G --> H[Hiển thị\n'Đã lưu thành công!']
    H --> I{Có kết nối\nInternet?}
    I -->|Có| J[Đồng bộ lên server\nbackground task]
    I -->|Không| K[Đánh dấu pending_sync\nSync lần sau]
    J --> L([Kết thúc])
    K --> L

    style A fill:#4CAF50,color:#fff
    style Z fill:#f44336,color:#fff
    style L fill:#2196F3,color:#fff
```

---

## 6. Activity Diagram 3: Ôn tập theo SM-2

```mermaid
flowchart TD
    A([Bắt đầu:\nmở Review Screen]) --> B[Query SQLite:\nnext_review_at ≤ now]
    B --> C{Có Flashcard\nđến hạn?}
    C -->|Không| D[Hiển thị:\n'Hôm nay không có từ cần ôn'\nNgày ôn tiếp theo: ...]
    D --> Z([Kết thúc])
    C -->|Có| E[Hiển thị mặt trước:\nTừ tiếng Anh + Hình ảnh]
    E --> F[Người dùng nhấn Lật]
    F --> G[Hiển thị mặt sau:\nPhiên âm + Nghĩa + Ví dụ]
    G --> H[Người dùng chọn điểm\n0 · 1 · 2 · 3 · 4 · 5]
    H --> I[SM2Service.calculate\nq, EF, interval, reps]
    I --> J[Cập nhật Flashcard\nnext_review_at, EF, interval]
    J --> K[Ghi review_logs\nvào SQLite]
    K --> L{Còn Flashcard\nkhác?}
    L -->|Có| E
    L -->|Không| M[Hiển thị kết quả phiên:\nSố từ ôn · Từ cần ôn lại · XP]
    M --> N[Cập nhật streak\nvà user_progress]
    N --> Z

    style A fill:#4CAF50,color:#fff
    style Z fill:#2196F3,color:#fff
```

---

## 7. Sequence Diagram 1: Luồng nhận diện vật thể

```mermaid
sequenceDiagram
    actor User
    participant CS as CameraScreen
    participant TF as TFLiteService
    participant VM as VocabularyMapper
    participant DB as SQLite

    User->>CS: openCamera()
    CS->>TF: initialize(yolov8n.tflite)
    TF-->>CS: ready

    loop Camera streaming
        CS->>TF: detect(frame)
        TF->>TF: preprocess(resize, normalize)
        TF->>TF: inference()
        TF->>TF: applyNMS(conf=0.35, iou=0.45)
        TF-->>CS: List<Detection>
    end

    CS->>VM: getVocabulary(classId)
    VM->>DB: SELECT * FROM vocabulary WHERE class_id=?
    DB-->>VM: VocabularyInfo
    VM-->>CS: VocabularyInfo

    CS->>User: showBottomSheet(word, phonetic, meaning, example)
    User->>CS: tapSave()
    CS->>DB: INSERT INTO flashcards (...)
    DB-->>CS: OK
    CS->>User: showSuccess("Đã lưu Flashcard!")
```

---

## 8. Sequence Diagram 2: Luồng ôn tập Flashcard

```mermaid
sequenceDiagram
    actor User
    participant RS as ReviewScreen
    participant SM as SM2Service
    participant DB as SQLite
    participant SS as SyncService
    participant API as SpringBootAPI

    User->>RS: openReview()
    RS->>DB: SELECT * FROM flashcards WHERE next_review_at <= now()
    DB-->>RS: List<Flashcard>

    loop For each Flashcard
        RS->>User: showFrontCard(word, image)
        User->>RS: flip()
        RS->>User: showBackCard(phonetic, meaning, example)
        User->>RS: rate(quality=4)
        RS->>SM: calculate(q=4, ef, interval, reps)
        SM-->>RS: SM2Result {newEF, newInterval, nextReviewAt}
        RS->>DB: UPDATE flashcards SET ...
        RS->>DB: INSERT INTO review_logs (...)
        DB-->>RS: OK
    end

    RS->>DB: UPDATE user_progress (streak, xp)
    RS->>User: showSessionSummary(wordsReviewed, XP)

    RS->>SS: triggerSync()
    SS->>API: POST /api/sync {flashcards[], reviewLogs[]}
    API-->>SS: 200 OK
    SS->>DB: UPDATE flashcards SET is_synced=true
```

---

## 9. Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String displayName
        +String avatarUrl
        +Boolean isActive
        +Date createdAt
    }

    class Flashcard {
        +String id
        +String userId
        +String wordId
        +String imagePath
        +Float easeFactor
        +Int intervalDays
        +Int repetitions
        +Date nextReviewAt
        +Boolean isSynced
        +Date createdAt
    }

    class VocabularyWord {
        +String id
        +String labelEn
        +String phoneticIPA
        +String wordType
        +String definitionVi
        +String exampleSentence
        +String audioFilename
    }

    class ReviewLog {
        +String id
        +String flashcardId
        +Int quality
        +Date reviewedAt
        +Int newInterval
        +Float newEaseFactor
    }

    class UserProgress {
        +String userId
        +Int totalWordsLearned
        +Int currentStreak
        +Int longestStreak
        +Int totalXP
        +Date lastStudyDate
    }

    class Deck {
        +String id
        +String userId
        +String name
        +String description
        +Boolean isPublic
    }

    class TFLiteService {
        -TFLiteModel model
        -Boolean isReady
        +init() void
        +detect(frame) List~Detection~
        +preprocess(image) Tensor
        +applyNMS(detections) List~Detection~
    }

    class SM2Service {
        +calculate(quality, ef, interval, reps) SM2Result
        -computeNewEF(quality, ef) Float
        -computeNewInterval(reps, interval, ef) Int
    }

    class SM2Result {
        +Float newEaseFactor
        +Int newInterval
        +Int newRepetitions
        +Date nextReviewAt
    }

    class VocabularyMapper {
        -VocabularyRepository repo
        +getByClassId(classId) VocabularyWord
        +getByLabel(label) VocabularyWord
    }

    class Detection {
        +Int classId
        +String label
        +Float confidence
        +BoundingBox box
    }

    User "1" --> "*" Flashcard : owns
    User "1" --> "1" UserProgress : has
    User "1" --> "*" Deck : creates
    Flashcard "*" --> "1" VocabularyWord : references
    Flashcard "1" --> "*" ReviewLog : has
    Deck "1" --> "*" VocabularyWord : contains
    TFLiteService ..> Detection : produces
    VocabularyMapper ..> VocabularyWord : returns
    SM2Service ..> SM2Result : returns
```

---

## 10. ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar display_name
        text avatar_url
        boolean is_active
        boolean is_email_verified
        varchar role
        timestamptz created_at
    }

    DECKS {
        uuid id PK
        uuid user_id FK
        varchar name
        text description
        boolean is_public
        timestamptz created_at
    }

    WORDS {
        uuid id PK
        uuid deck_id FK
        varchar label_en
        varchar phonetic_ipa
        varchar word_type
        text definition_vi
        text example_sentence
        varchar audio_filename
    }

    FLASHCARDS {
        uuid id PK
        uuid user_id FK
        uuid word_id FK
        text image_path
        decimal ease_factor
        integer interval_days
        integer repetitions
        timestamptz next_review_at
        boolean is_synced
        timestamptz created_at
    }

    REVIEW_LOGS {
        uuid id PK
        uuid flashcard_id FK
        smallint quality
        timestamptz reviewed_at
        integer new_interval
        decimal new_ease_factor
    }

    USER_PROGRESS {
        uuid user_id PK_FK
        integer total_words_learned
        integer current_streak
        integer longest_streak
        integer total_xp
        date last_study_date
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar device_info
        boolean is_revoked
        timestamptz expires_at
    }

    USERS ||--o{ DECKS : "creates"
    DECKS ||--o{ WORDS : "contains"
    USERS ||--o{ FLASHCARDS : "owns"
    WORDS ||--o{ FLASHCARDS : "referenced by"
    FLASHCARDS ||--o{ REVIEW_LOGS : "has"
    USERS ||--|| USER_PROGRESS : "has"
    USERS ||--o{ REFRESH_TOKENS : "has"
```
