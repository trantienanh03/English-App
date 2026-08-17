# So do He Thong — Vocam English Learning App

> **Sinh vien:** Tran Tien Anh — MSSV: 22130016
> **De tai:** Nghien cuu va ung dung mo hinh YOLO trong nhan dien vat the ho tro hoc tu vung tieng Anh tren thiet bi di dong
>
> Huong dan xem: Paste tung block mermaid vao https://mermaid.live de xem va tai anh PNG

---

## 1. Use Case Diagram

```mermaid
graph LR
    USER(["Nguoi dung"])

    subgraph SYSTEM["Vocam Application -- System Boundary"]
        subgraph SCAN["Nhan dien Vat the"]
            UC01["UC01\nMo man hinh quet camera"]
            UC02["UC02\nChup anh vat the"]
            UC03["UC03\nNhan dien vat the\nbang YOLO"]
            UC04["UC04\nHien thi tu vung\ntieng Anh"]
            UC05["UC05\nNghe phat am tu vung"]
        end
        subgraph VOCAB["Quan ly Tu vung"]
            UC06["UC06\nLuu tu vao so tu Flashcard"]
            UC07["UC07\nThem tu vao bai hoc Lesson"]
            UC08["UC08\nXem danh sach flashcard"]
            UC09["UC09\nTim kiem tu da hoc"]
        end
        subgraph REVIEW["On tap"]
            UC10["UC10\nOn tap flashcard theo SM-2"]
            UC11["UC11\nThuc hien bai Quiz"]
            UC12["UC12\nXem lich su on tap"]
        end
        subgraph PROGRESS["Theo doi Tien do"]
            UC13["UC13\nXem thong ke hoc tap"]
            UC14["UC14\nXem streak hoc hang ngay"]
            UC15["UC15\nXem bang xep hang"]
            UC16["UC16\nDong bo tien do len server"]
        end
        subgraph AUTH["Xac thuc"]
            UC17["UC17\nDang ky tai khoan"]
            UC18["UC18\nDang nhap JWT"]
            UC19["UC19\nDang xuat"]
            UC20["UC20\nLam moi Access Token"]
        end
    end

    USER --> UC01
    USER --> UC02
    USER --> UC04
    USER --> UC05
    USER --> UC06
    USER --> UC07
    USER --> UC08
    USER --> UC09
    USER --> UC10
    USER --> UC11
    USER --> UC12
    USER --> UC13
    USER --> UC14
    USER --> UC15
    USER --> UC16
    USER --> UC17
    USER --> UC18
    USER --> UC19

    UC02 -.->|"include"| UC03
    UC03 -.->|"include"| UC04
    UC06 -.->|"extend"| UC16
    UC10 -.->|"extend"| UC16
    UC15 -.->|"include"| UC18
    UC16 -.->|"include"| UC18

    style SYSTEM fill:#f0f7f0,stroke:#4CAF50,stroke-width:2px
    style SCAN fill:#E8F5E9,stroke:#4CAF50
    style VOCAB fill:#E3F2FD,stroke:#2196F3
    style REVIEW fill:#FFF3E0,stroke:#FF9800
    style PROGRESS fill:#F3E5F5,stroke:#9C27B0
    style AUTH fill:#FCE4EC,stroke:#E91E63
```

---


## 2. System Architecture Diagram

```mermaid
graph TB
    subgraph MOBILE["Mobile App React Native Expo TypeScript"]
        subgraph SCREENS["UI Screens"]
            SC_SCAN["Scanner Screen Object Detection"]
            SC_FLASH["Flashcard Screen"]
            SC_REVIEW["Review Screen SM-2"]
            SC_PROGRESS["Progress Screen"]
            SC_AUTH["Auth Screen Login Register"]
            SC_LEADER["Leaderboard Screen"]
        end
        subgraph ON_DEVICE["On-Device Layer Offline"]
            YOLO["YOLOv8n Model ONNX Runtime 6MB duoi 100ms"]
            SQLITE[("SQLite Local DB words flashcards review_logs")]
            SM2["SM-2 Algorithm Spaced Repetition"]
            AUDIO["TTS Audio phat am"]
        end
        subgraph SVC["Service Layer"]
            SVC_YOLO["YoloDetectorService"]
            SVC_API["ApiService HTTP client"]
            SVC_SYNC["SyncService background sync"]
        end
    end

    subgraph BACKEND["Backend Services"]
        subgraph SPRING["Spring Boot Java 17 Port 8080"]
            CTRL_WORD["WordController GET /api/words"]
            CTRL_AUTH["AuthController POST /api/auth"]
            CTRL_SYNC["SyncController POST /api/sync/progress"]
            CTRL_LEAD["LeaderboardController GET /api/leaderboard"]
            SEC["Spring Security JWT Filter"]
        end
        subgraph AI_SVC["FastAPI AI Service Python Port 8000"]
            FASTAPI["FastAPI App"]
            YOLO_SERVER["YOLOv8-World v2 365 classes"]
        end
    end

    subgraph DATA["Data Layer"]
        PG[("PostgreSQL users words user_progress refresh_tokens")]
    end

    SC_SCAN --> SVC_YOLO
    SC_FLASH --> SQLITE
    SC_REVIEW --> SM2
    SC_REVIEW --> SQLITE
    SC_AUTH --> SVC_API
    SC_LEADER --> SVC_API

    SVC_YOLO -->|"1. On-device ONNX PRIMARY"| YOLO
    YOLO -->|"class_id + confidence"| SVC_YOLO
    SVC_YOLO -->|"lookup vocabulary"| SQLITE
    SVC_YOLO -.->|"2. Fallback khi ONNX loi"| AI_SVC
    AI_SVC -->|"predictions JSON"| SVC_YOLO

    SVC_API -->|"HTTPS + JWT"| SPRING
    SVC_SYNC -->|"POST sync background"| CTRL_SYNC
    SPRING -->|"JPA Hibernate"| PG

    style ON_DEVICE fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style SPRING fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style AI_SVC fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style DATA fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
```

---

## 3. Sequence Diagram 1 — Quet va Nhan dien Vat the On-Device

```mermaid
sequenceDiagram
    actor User as Nguoi dung
    participant SS as ObjectScannerScreen
    participant YD as YoloDetectorService
    participant ONNX as YOLOv8n ONNX Runtime
    participant SQ as SQLite Local DB
    participant API as Spring Boot API
    participant AUDIO as AudioService

    User->>SS: Nhan QUET VAT THE
    SS->>SS: setIsScanning true, startPulse
    SS->>YD: detect(imageFormData)

    YD->>ONNX: run inputTensor 1x3x640x640
    ONNX->>ONNX: preprocess resize normalize
    ONNX->>ONNX: inference
    ONNX->>ONNX: postprocess + NMS conf 0.35
    ONNX-->>YD: DetectionResult cocoClass confidence

    YD->>SQ: getCachedWordByClass cocoClass

    alt Tu co trong SQLite cache
        SQ-->>YD: VocabularyWord offline OK
    else Tu chua duoc cache
        YD->>API: GET /api/words/cocoClass
        API-->>YD: BackendWordDto JSON
        YD->>SQ: saveToCache word
    end

    YD-->>SS: DetectionResult cocoClass confidence word
    SS->>SS: setScannedResult word, setShowResultSheet true
    SS->>AUDIO: playAudio word
    SS->>User: Hien thi Bottom Sheet word phonetic meaning example
```

---

## 4. Sequence Diagram 2 — Dang nhap va Xac thuc JWT

```mermaid
sequenceDiagram
    actor User as Nguoi dung
    participant APP as Mobile App
    participant STORE as AsyncStorage local
    participant API as Spring Boot API
    participant DB as PostgreSQL

    User->>APP: Nhap email va password
    APP->>API: POST /api/auth/login email password
    API->>DB: SELECT user WHERE email
    DB-->>API: User entity
    API->>API: BCrypt.verify password hash

    alt Xac thuc thanh cong
        API->>API: JWT.sign userId role accessToken 15 phut
        API->>API: JWT.sign userId refreshToken 30 ngay
        API->>DB: INSERT refresh_tokens token_hash device_info
        API-->>APP: 200 OK accessToken refreshToken user
        APP->>STORE: luu accessToken va refreshToken
        APP->>User: Chuyen den man hinh chinh
    else Xac thuc that bai
        API-->>APP: 401 Unauthorized
        APP->>User: Email hoac mat khau khong dung
    end

    Note over APP,API: Khi accessToken het han sau 15 phut
    APP->>API: POST /api/auth/refresh refreshToken
    API->>DB: SELECT refresh_token WHERE hash AND is_revoked=false
    API->>API: Verify chua het han
    API->>API: Tao accessToken moi
    API-->>APP: 200 OK newAccessToken
    APP->>STORE: Cap nhat accessToken moi
```

---

## 5. Sequence Diagram 3 — On tap Flashcard SM-2

```mermaid
sequenceDiagram
    actor User as Nguoi dung
    participant RS as ReviewScreen
    participant SM as SM2Algorithm
    participant SQ as SQLite Local DB
    participant SS as SyncService
    participant API as Spring Boot API

    User->>RS: Mo man hinh on tap
    RS->>SQ: SELECT flashcards WHERE next_review_at qua han
    SQ-->>RS: List Flashcard den han

    alt Khong co tu can on
        RS->>User: Hom nay khong co tu can on
    else Co tu can on
        loop Voi moi Flashcard
            RS->>User: Hien thi mat truoc tu tieng Anh hinh anh
            User->>RS: Nhan Lat the
            RS->>User: Hien thi mat sau phien am nghia vi du
            User->>RS: Chon muc do nho 0 Quen 3 Nho tot 5 Rat thuoc

            RS->>SM: calculate quality easeFactor interval repetitions
            SM->>SM: tinh newEF newInterval theo SM-2
            SM-->>RS: SM2Result newEF newInterval nextReviewAt

            RS->>SQ: UPDATE flashcards ease_factor interval_days next_review_at
            RS->>SQ: INSERT review_logs flashcard_id quality reviewed_at
        end

        RS->>SQ: UPDATE user_progress streak xp last_study_date
        RS->>User: Hien thi ket qua phien tu da on XP streak
        RS->>SS: triggerSync
        SS->>API: POST /api/sync/progress xp streak wordsLearned
        API-->>SS: 200 OK rank
    end
```

---

## 6. Sequence Diagram 4 — FastAPI Fallback khi ONNX loi

```mermaid
sequenceDiagram
    actor User as Nguoi dung
    participant SS as ObjectScannerScreen
    participant YD as YoloDetectorService
    participant FAST as FastAPI AI Service port 8000
    participant YW as YOLOv8-World Model 365 classes
    participant SQ as SQLite Local DB

    User->>SS: Nhan QUET VAT THE
    SS->>YD: detect imageFormData

    YD->>YD: Thu ONNX on-device primary
    Note over YD: On-device ONNX khong kha dung

    YD->>FAST: POST /predict multipart image confidence 0.30
    FAST->>FAST: PIL.Image.open bytes
    FAST->>YW: model image conf 0.30
    YW->>YW: YOLO-World inference open-vocabulary
    YW-->>FAST: Raw detections
    FAST->>FAST: Loc theo confidence sap xep
    FAST-->>YD: PredictionResponse predictions label confidence box

    YD->>SQ: getCachedWordByClass topLabel

    alt Co trong cache
        SQ-->>YD: VocabularyWord
    else Khong co cache
        YD->>YD: Tao VocabularyWord co ban word=label pos=Noun
    end

    YD-->>SS: DetectionResult
    SS->>User: Hien thi ket qua nhan dien
```

---

## 7. Activity Diagram 1 — Luong Quet va Luu Tu vung

```mermaid
flowchart TD
    START([Bat dau]) --> OPEN[Mo Object Scanner Screen]
    OPEN --> INIT[Khoi tao YOLO ONNX Runtime nap model on-device]
    INIT --> READY{Model kha dung?}

    READY -->|Khong| FALLBACK[Chuyen sang FastAPI AI Microservice mode]
    READY -->|Co| WAIT[Hien thi viewfinder cho nguoi dung]
    FALLBACK --> WAIT

    WAIT --> TAP[Nguoi dung nhan QUET VAT THE]
    TAP --> SCAN[Chup anh tu camera startPulse animation]
    SCAN --> INFER[Chay YOLO inference on-device hoac FastAPI]
    INFER --> DETECT{Phat hien vat the?}

    DETECT -->|Khong| RETRY[Khong nhan dien duoc Thu lai]
    RETRY --> WAIT

    DETECT -->|Co| LOOKUP[Tra cuu tu vung tu SQLite local cache]
    LOOKUP --> CACHED{Co trong cache?}

    CACHED -->|Co| SHOW[Hien thi Bottom Sheet word phonetic meaning example]
    CACHED -->|Khong| FETCH[Goi Spring Boot API GET /api/words/{class}]
    FETCH --> SHOW

    SHOW --> AUDIO[Tu dong phat am TTS Audio]
    AUDIO --> CHOOSE{Nguoi dung chon}

    CHOOSE -->|"Luu vao so tu +15 XP"| SAVE_FLASH[Luu Flashcard vao SQLite\nease=2.5 interval=1 reps=0]
    CHOOSE -->|"Them vao bai hoc"| SAVE_LESSON[Chon Lesson Luu tu vao Lesson]
    CHOOSE -->|Dong| WAIT

    SAVE_FLASH --> XP[Cong 15 XP Hien thi toast]
    SAVE_LESSON --> TOAST[Hien thi Da them vao bai hoc]

    XP --> SYNC_CHECK{Co ket noi Internet?}
    SYNC_CHECK -->|Co| SYNC[SyncService POST /api/sync/progress dong bo ngam]
    SYNC_CHECK -->|Khong| MARK[Danh dau pending_sync Sync lan sau]

    SYNC --> WAIT
    MARK --> WAIT
    TOAST --> WAIT
```

---

## 8. Activity Diagram 2 — Luong On tap SM-2

```mermaid
flowchart TD
    START([Bat dau]) --> QUERY[Query SQLite SELECT flashcards WHERE next_review_at qua han]
    QUERY --> HAS{Co tu can on?}

    HAS -->|Khong| EMPTY[Hom nay khong co tu can on\nOn tiep next_date]
    EMPTY --> END([Ket thuc])

    HAS -->|Co| SHOW_FRONT[Hien thi mat truoc\nTu tieng Anh + Hinh anh]
    SHOW_FRONT --> TAP_FLIP[Nguoi dung nhan Lat the]
    TAP_FLIP --> SHOW_BACK[Hien thi mat sau\nPhien am + Nghia + Vi du]
    SHOW_BACK --> RATE[Nguoi dung chon muc do nho\n0=Quen 3=Nho tot 5=Rat thuoc]

    RATE --> SM2[SM-2 tinh toan newEF newInterval nextReviewAt]
    SM2 --> UPDATE_DB[UPDATE flashcards\nease_factor interval_days next_review_at]
    UPDATE_DB --> INSERT_LOG[INSERT review_logs\nflashcard_id quality reviewed_at]
    INSERT_LOG --> MORE{Con tu can on?}

    MORE -->|Co| SHOW_FRONT
    MORE -->|Khong| SUMMARY[Hien thi ket qua phien\nTu da on - XP nhan - Streak]
    SUMMARY --> UPDATE_PROG[UPDATE user_progress\nstreak xp last_study_date]
    UPDATE_PROG --> SYNC_BG[SyncService dong bo tien do len server ngam]
    SYNC_BG --> END
```

---

## 9. Class Diagram

```mermaid
classDiagram
    class VocabularyWord {
        +String id
        +String word
        +String phonetic
        +String vn
        +String pos
        +String sentence
        +String sentenceVn
        +String difficulty
        +String imageUrl
    }

    class Flashcard {
        +String id
        +String wordId
        +Float easeFactor
        +Int intervalDays
        +Int repetitions
        +Date nextReviewAt
        +Boolean isSynced
        +Date createdAt
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
        +String deviceUuid
        +String displayName
        +Int totalXp
        +Int currentStreak
        +Int longestStreak
        +Int wordsLearned
    }

    class DetectionResult {
        +String cocoClass
        +Float confidence
        +VocabularyWord word
    }

    class SM2Result {
        +Float newEaseFactor
        +Int newInterval
        +Int newRepetitions
        +Date nextReviewAt
    }

    class YoloDetectorService {
        +String AI_SERVICE_URL
        +detect(formData) DetectionResult
        +mockDetect() DetectionResult
        +lookupWord(cocoClass) VocabularyWord
    }

    class ApiService {
        +String API_BASE_URL
        +getAllWords() VocabularyWord~List~
        +getWordByClass(cocoClass) VocabularyWord
        +syncProgress(payload) SyncResponseDto
        +getLeaderboard() LeaderboardEntry~List~
    }

    class SyncService {
        +syncNow() void
        +scheduleSyncOnConnect() void
    }

    class SM2Algorithm {
        +calculate(quality, ef, interval, reps) SM2Result
        -computeNewEF(quality, ef) Float
        -computeNextInterval(reps, interval, ef) Int
    }

    class Word {
        +Long id
        +String cocoClass
        +String enWord
        +String phonetic
        +String pos
        +String definition
        +String translation
        +String exampleEn
        +String exampleVn
    }

    class UserProgressEntity {
        +Long id
        +String deviceUuid
        +String displayName
        +Integer totalXp
        +Integer currentStreak
        +Integer longestStreak
        +Integer wordsLearned
        +LocalDateTime lastSyncAt
    }

    Flashcard "*" --> "1" VocabularyWord : references
    Flashcard "1" --> "*" ReviewLog : has
    UserProgress "1" --> "*" Flashcard : owns
    DetectionResult --> VocabularyWord : contains
    YoloDetectorService ..> DetectionResult : produces
    YoloDetectorService ..> ApiService : uses fallback
    SM2Algorithm ..> SM2Result : returns
    SyncService ..> ApiService : uses
```

---

## 10. ERD — Entity Relationship Diagram

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

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar device_info
        boolean is_revoked
        timestamptz expires_at
        timestamptz created_at
    }

    WORDS {
        bigint id PK
        varchar coco_class UK
        varchar en_word
        varchar phonetic
        varchar pos
        text definition
        text translation
        text example_en
        text example_vn
    }

    USER_PROGRESS {
        uuid id PK
        varchar device_uuid UK
        varchar display_name
        integer total_xp
        integer current_streak
        integer longest_streak
        integer words_learned
        timestamptz last_sync_at
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

    FLASHCARDS {
        uuid id PK
        uuid user_id FK
        bigint word_id FK
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

    USERS ||--o{ REFRESH_TOKENS : "has"
    USERS ||--o{ DECKS : "creates"
    USERS ||--o{ FLASHCARDS : "owns"
    WORDS ||--o{ FLASHCARDS : "referenced by"
    FLASHCARDS ||--o{ REVIEW_LOGS : "has"
```

---

## 11. Deployment Diagram

```mermaid
graph TB
    subgraph USER_DEVICE["Thiet bi nguoi dung iOS Android"]
        subgraph EXPO_APP["Expo React Native App"]
            RN_BUNDLE["JS Bundle React Native"]
            ONNX_RT["ONNX Runtime YOLOv8n 6MB"]
            SQLITE_FILE[("SQLite Database vocabulary.db")]
            ASYNC_STORE["AsyncStorage JWT tokens"]
        end
    end

    subgraph CLOUD["Cloud Infrastructure AWS VPS"]
        subgraph SERVER_1["Application Server EC2"]
            subgraph DOCKER["Docker Compose"]
                SPRING_C["Container spring-boot Port 8080"]
                AI_C["Container ai-service Port 8000 FastAPI"]
                NGINX["Container nginx Port 80 443 Reverse Proxy SSL"]
            end
        end
        subgraph DB_SERVER["Database Server"]
            PG_C["Container postgres Port 5432 PostgreSQL 15"]
        end
    end

    subgraph EXTERNAL["External Services"]
        TTS_SVC["Google TTS API"]
        EXPO_UP["Expo OTA Updates"]
    end

    USER_DEVICE -->|"HTTPS 443 REST API JWT"| NGINX
    NGINX -->|"Proxy 8080"| SPRING_C
    NGINX -->|"Proxy 8000 fallback"| AI_C
    SPRING_C -->|"JDBC 5432"| PG_C

    USER_DEVICE -->|"HTTPS"| TTS_SVC
    USER_DEVICE -->|"OTA Pull"| EXPO_UP

    ONNX_RT -.->|"On-device no network needed"| SQLITE_FILE

    style USER_DEVICE fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style CLOUD fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style EXTERNAL fill:#FFF3E0,stroke:#FF9800
```

---

## Tom tat cac so do

| # | Ten so do | Loai | Mo ta |
|---|-----------|------|-------|
| 1 | Use Case Diagram | Use Case | 20 use case, 3 tac nhan |
| 2 | System Architecture | Graph | Kien truc 3-tier offline-first |
| 3 | Sequence: Quet vat the | Sequence | YOLO on-device SQLite Bottom Sheet |
| 4 | Sequence: Dang nhap JWT | Sequence | Login + auto refresh token |
| 5 | Sequence: On tap SM-2 | Sequence | Review loop + SM-2 + sync |
| 6 | Sequence: FastAPI Fallback | Sequence | YOLO-World server-side |
| 7 | Activity: Scan va Save | Activity | Luong quet luu flashcard |
| 8 | Activity: SM-2 Review | Activity | Luong on tap day du |
| 9 | Class Diagram | Class | Frontend TypeScript + Backend Java |
| 10 | ERD | ER | Schema PostgreSQL |
| 11 | Deployment Diagram | Deployment | Docker + AWS topology |