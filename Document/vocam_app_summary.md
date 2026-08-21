# Vocam — Tài liệu Tổng hợp Ứng dụng

> **Phiên bản tài liệu:** 2026-08-18  
> **Tác giả:** Trần Tiến Anh (MSSV: 22130016)  
> **Repository:** `trantienanh03/English-App`

---

## 1. Tổng quan Dự án

**Vocam** là ứng dụng học tiếng Anh trên thiết bị di động (Android/iOS), kết hợp:
- **AI nhận diện vật thể** (YOLOv8/YOLO11) để học từ vựng từ thế giới thực
- **Flashcard + Spaced Repetition** (thuật toán SM-2)
- **Bài tập Quiz** trắc nghiệm / điền từ
- **Bảng xếp hạng toàn cầu** (Leaderboard) theo XP
- **Word of the Day** tải từ API

---

## 2. Kiến trúc Tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                       MOBILE APP (Frontend)                     │
│              React Native + Expo SDK 57 · TypeScript            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/JSON
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
┌──────────────────┐ ┌─────────────┐ ┌────────────────────┐
│  AI Microservice │ │ Spring Boot │ │   PostgreSQL DB    │
│  FastAPI / YOLO  │ │   Backend   │ │  (Neon Serverless) │
│  Port: 8000      │ │  Port: 8080 │ │                    │
│  Python 3.x      │ │  Java 17    │ │  Tables:           │
│  Google Gemini   │ │  JPA/Flyway │ │  - words           │
└──────────────────┘ └─────────────┘ │  - user_progress   │
                                     └────────────────────┘
```

### Nguyên tắc Thiết kế
- **Online-First:** Không dùng SQLite native. Mọi persistence qua Spring Boot REST API
- **In-Memory State:** Flashcards và word cache lưu trong RAM phiên làm việc (`database.ts`)
- **Mobile-only:** Chỉ hỗ trợ Android/iOS, không tối ưu cho web
- **Stateless Device Identity:** Mỗi thiết bị có `deviceUuid` (UUID ngẫu nhiên) làm khóa định danh thay vì tài khoản

---

## 3. Stack Công nghệ Chi tiết

### 3.1 Frontend
| Thành phần | Phiên bản | Mục đích |
|---|---|---|
| React Native | 0.86.2 | Framework UI mobile |
| Expo SDK | ~57.0 | Build toolchain & APIs |
| expo-router | ~57.0.13 | File-based routing |
| TypeScript | ~6.0.3 | Type safety |
| @expo/vector-icons (Feather) | ^15.0.2 | Icon library (tiêu chuẩn duy nhất, ngoại trừ Google logo) |
| react-native-reanimated | 4.5.1 | Animations |
| react-native-gesture-handler | ~2.32.0 | Gesture recognition |
| @react-native-community/netinfo | 12.0.1 | Kiểm tra kết nối mạng |
| expo-crypto | ~57.0.1 | Sinh UUID cho deviceUuid |
| Inter (Google Fonts) | — | Typography chính |

### 3.2 Backend (Spring Boot)
| Thành phần | Phiên bản | Mục đích |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 3.x | Framework REST API |
| Spring Data JPA + Hibernate | — | ORM layer |
| PostgreSQL | — | Cơ sở dữ liệu chính |
| Flyway | — | Database migration versioning |
| HikariCP | — | Connection pooling (max 5 connections) |
| Neon | — | PostgreSQL serverless provider |

### 3.3 AI Microservice (FastAPI)
| Thành phần | Mục đích |
|---|---|
| FastAPI + Uvicorn | REST API framework Python |
| Ultralytics YOLO | Object detection (YOLOv8n/world, YOLO11n) |
| Pillow + NumPy | Xử lý ảnh |
| Google Gemini 1.5 Flash | Sinh câu ví dụ ngữ cảnh từ vật thể phát hiện |

---

## 4. Design System

### Color Palette (Vocam Brand)
```
Primary   (Forest Green):  #2C6E49 — CTA buttons, nav active, avatar bg
Secondary (Sage Teal):     #2A7069 — accent phụ, icon camera
Canvas:                    #F4F6F3 — nền app chính
SurfaceWhite:              #FFFFFF — card, modal, bottom sheet
Success:                   #1E6B3A / #E8F5EC
Error:                     #B03535 / #FDF0F0
Warning (streak/XP):       #8B6314 / #FBF5E8
Info:                      #3A5A8C / #EEF2F8
Text Primary:              #1A2B1A (từ tiếng Anh, heading)
Text Secondary:            #4B5B4B (body, nghĩa tiếng Việt)
Text Muted:                #8B9B8B (placeholder, caption)
Text IPA:                  #3D7A5E (phiên âm)
```

### Typography
- **Font:** Inter (iOS: `Inter`, Android/Web: `Inter, sans-serif`)
- **Spacing System:** `half(2) → one(4) → two(8) → three(16) → four(24) → five(32) → six(64)`
- **Icons:** Feather (@expo/vector-icons) — thư viện duy nhất cho tất cả screens (ngoại trừ MCommunityIcons.google trong auth)

---

## 5. Cấu trúc Source Code

### 5.1 Frontend
```
frontend/src/
├── app/
│   └── index.tsx              # Entry point — quản lý navigation state (onboarding→signup→login→dashboard)
├── components/
│   ├── auth/
│   │   ├── drops-auth-screen.tsx   # Form đăng nhập/đăng ký (UI Duolingo-style)
│   │   ├── signup-screen.tsx       # Wrapper → DropsAuthScreen (mode=signup)
│   │   ├── login-screen.tsx        # Wrapper → DropsAuthScreen (mode=login)
│   │   └── auth-gate-screen.tsx    # Google Mock OAuth modal
│   ├── onboarding/
│   │   └── onboarding-screen.tsx   # 4 bước: chào → trình độ → mục tiêu → thời gian
│   ├── main-container.tsx          # Shell: quản lý tabs, WoTD fetch, user state, flashcard store
│   ├── dashboard/
│   │   └── dashboard-screen.tsx    # Trang chủ: XP card, WoTD, streak, quests, chart, lessons
│   ├── flashcards/
│   │   ├── flashcard-deck-screen.tsx   # Sổ từ: lật card, filter, session review
│   │   └── word-detail-screen.tsx      # Chi tiết từ: nghĩa, ví dụ, mẹo nhớ, tự đánh giá
│   ├── lessons/
│   │   ├── lesson-grid-screen.tsx      # Grid bài học (lọc theo độ khó)
│   │   └── lesson-detail-screen.tsx    # Danh sách từ trong bài, tiến độ, lưu từ
│   ├── quiz/
│   │   └── practice-quiz-screen.tsx    # Quiz trắc nghiệm + điền từ, tính điểm, XP thưởng
│   ├── scanner/
│   │   └── object-scanner-screen.tsx   # Camera AI: mô phỏng scan, gọi API, result sheet
│   ├── profile/
│   │   ├── profile-screen.tsx          # Thông tin user, thống kê, badges, leaderboard
│   │   └── settings-screen.tsx         # Cài đặt: thông báo, âm thanh, chủ đề, ngôn ngữ
│   └── ui/
│       ├── search-screen.tsx           # Tìm kiếm từ vựng + bài học
│       ├── streak-celebration-modal.tsx # Modal chúc mừng streak milestone
│       └── dots-loader.tsx             # Loading indicator
├── services/
│   ├── api.ts             # Tất cả HTTP calls: getAllWords, getWordByClass, syncProgress, getLeaderboard
│   └── sync-service.ts    # Background sync (kiểm tra mạng → tải từ điển → push progress)
├── db/
│   └── database.ts        # In-memory store: flashcards, word cache, events, deviceUuid
├── data/
│   └── mock-data.ts       # Mock lessons, userProgress ban đầu, quiz questions
├── types/
│   └── index.ts           # Interfaces: VocabularyWord, Lesson, UserProgress, Badge, QuizQuestion
├── constants/
│   ├── theme.ts           # Palette, Colors, Fonts, Spacing tokens
│   └── variables.ts       # (Auth screen colors riêng — DropsPalette)
└── utils/
    └── audio.ts           # playAudio(word): Text-to-Speech phát âm từ tiếng Anh
```

### 5.2 Backend
```
backend/src/main/java/org/englishapp/backend/
├── BackendApplication.java               # Spring Boot main class
├── config/
│   └── WebConfig.java                    # CORS configuration (allow all origins)
├── controller/
│   ├── GlobalExceptionHandler.java       # @RestControllerAdvice — JSON error responses
│   ├── WordController.java               # GET /api/words, GET /api/words/{cocoClass}
│   ├── SyncController.java               # POST /api/sync/progress
│   └── LeaderboardController.java        # GET /api/leaderboard
├── service/
│   ├── WordService.java                  # findAll(), findByCocoClass()
│   └── LeaderboardService.java           # sync() upsert + rank, getLeaderboard()
├── repository/
│   ├── WordRepository.java               # JPA: findByCocoClass()
│   └── UserProgressRepository.java       # JPA: findByDeviceUuid(), findTopByXp(), countByTotalXpGreaterThan()
├── entity/
│   ├── Word.java                         # Table: words
│   └── UserProgress.java                 # Table: user_progress
└── dto/
    ├── WordDto.java                      # Response: id, cocoClass, enWord, phonetic, pos, translation, examples
    ├── SyncRequest.java                  # Body: deviceUuid, displayName, totalXp, streak, wordsLearned
    ├── SyncResponse.java                 # Response: status, rank
    └── LeaderboardEntryDto.java          # Response: rank, deviceUuid, displayName, totalXp, streak, wordsLearned
```

### 5.3 AI Service
```
ai_service/
├── main.py              # FastAPI app: /health, /predict-multi, /generate-context
├── models/              # Custom fine-tuned YOLO weight (best.pt)
├── yolov8m-worldv2.pt   # Fallback: YOLO-World open-vocabulary model
├── yolov8s-worldv2.pt   # Alternative YOLO-World
├── yolo11n.pt           # YOLO11 nano
└── requirements.txt     # fastapi, uvicorn, ultralytics, pillow, google-generativeai
```

---

## 6. Database Schema

### Table: `words`
| Column | Type | Ghi chú |
|---|---|---|
| id | BIGINT PK | Auto-increment |
| coco_class | VARCHAR(50) UNIQUE | YOLO class name (e.g. "cup", "laptop") |
| en_word | VARCHAR(100) | Từ tiếng Anh |
| phonetic | VARCHAR(100) | IPA pronunciation |
| pos | VARCHAR(20) | Part of speech (Noun/Verb/Adjective...) |
| definition | TEXT | Định nghĩa tiếng Anh |
| translation | VARCHAR(200) | Nghĩa tiếng Việt |
| example_en | TEXT | Câu ví dụ tiếng Anh |
| example_vn | TEXT | Câu ví dụ tiếng Việt |
| created_at | TIMESTAMP | |

### Table: `user_progress`
| Column | Type | Ghi chú |
|---|---|---|
| id | BIGINT PK | Auto-increment |
| device_uuid | VARCHAR(36) UNIQUE | UUID sinh từ `expo-crypto` |
| display_name | VARCHAR(100) | Tên hiển thị người dùng |
| total_xp | INT | Tổng XP tích lũy |
| current_streak | INT | Số ngày streak hiện tại |
| longest_streak | INT | Streak dài nhất mọi thời |
| words_learned | INT | Số flashcard đã lưu |
| last_sync_at | TIMESTAMP | Lần sync cuối |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | Auto-updated @PreUpdate |

> **Schema Migration:** Quản lý bằng Flyway, file migration trong `resources/db/migration/`

---

## 7. API Reference

### Spring Boot Backend (Port 8080)

#### `GET /api/words`
Lấy toàn bộ từ vựng (80 COCO classes).
```json
[
  {
    "id": 1,
    "cocoClass": "cup",
    "enWord": "Cup",
    "phonetic": "/kʌp/",
    "pos": "Noun",
    "definition": "A small open container...",
    "translation": "Cái cốc, ly",
    "exampleEn": "She drinks coffee from a red cup.",
    "exampleVn": "Cô ấy uống cà phê từ một chiếc cốc đỏ."
  }
]
```

#### `GET /api/words/{cocoClass}`
Tra cứu từ theo tên class YOLO (e.g. `/api/words/laptop`).
- **404** nếu không tìm thấy

#### `POST /api/sync/progress`
Đồng bộ tiến trình học lên server (tạo mới hoặc cập nhật).
```json
// Request body
{
  "deviceUuid": "uuid-string",
  "displayName": "Học Viên",
  "totalXp": 350,
  "currentStreak": 5,
  "longestStreak": 7,
  "wordsLearned": 12
}

// Response
{ "status": "ok", "rank": 42 }
```

#### `GET /api/leaderboard`
Top 50 người dùng xếp theo XP giảm dần.
```json
[
  { "rank": 1, "deviceUuid": "...", "displayName": "...", "totalXp": 1200, "currentStreak": 15, "wordsLearned": 50 }
]
```

#### Lỗi chuẩn (GlobalExceptionHandler)
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "No vocabulary found for class: banana",
  "timestamp": "2026-08-18T12:00:00Z"
}
```

---

### AI Microservice (Port 8000)

#### `POST /predict-multi`
Upload ảnh → nhận diện đa vật thể → tùy chọn sinh câu ngữ cảnh bằng Gemini.

**Query params:** `confidence_threshold` (default 0.30), `generate_sentence` (default true)

```json
{
  "success": true,
  "total_detected": 3,
  "inference_time_ms": 124.5,
  "predictions": [
    { "label": "cup", "confidence": 0.92, "box": { "x1": 100, "y1": 80, "x2": 230, "y2": 210 } }
  ],
  "contextual_sentence": {
    "sentence_en": "A cup sits beside the laptop on the desk.",
    "sentence_vn": "Một chiếc cốc nằm cạnh laptop trên bàn làm việc.",
    "source": "gemini-ai"
  }
}
```

#### `POST /generate-context`
Sinh câu ngữ cảnh từ danh sách nhãn.
```json
// Request: { "labels": ["cup", "laptop", "keyboard"] }
// Response: { "sentence_en": "...", "sentence_vn": "...", "source": "gemini-ai" }
```

#### `GET /health`
Kiểm tra trạng thái service.

---

## 8. Luồng Code (Code Flows)

### 8.1 Khởi động Ứng dụng

```
app/index.tsx
  │
  ├─ [Splash 1.4s] DotsLoader hiển thị trên nền xanh primary
  │
  └─ isBooting=false → xác định currentScreen
       │
       ├─ 'onboarding' → OnboardingScreen (4 bước)
       │     └─ onComplete(data) → currentScreen='signup'
       │
       ├─ 'signup' → SignupScreen → DropsAuthScreen (mode=signup)
       │     └─ onAuthSuccess(name,email) → setUserName/setUserEmail → currentScreen='dashboard'
       │
       ├─ 'login' → LoginScreen → DropsAuthScreen (mode=login)
       │     └─ onAuthSuccess(name,email) → setUserName/setUserEmail → currentScreen='dashboard'
       │
       └─ 'dashboard' → MainContainer(userName, userEmail, onLogout)
```

### 8.2 MainContainer — Khởi tạo & State

```
MainContainer mount
  │
  ├─ initDatabase()              // no-op (online-first)
  ├─ getOrCreateDeviceUuid()     // sinh/đọc UUID phiên
  ├─ getLocalFlashcards()        // đọc flashcards in-memory → setSavedWords
  │
  ├─ api.getAllWords()            // GET /api/words
  │     └─ random → setWordOfTheDay
  │
  ├─ triggerBackgroundSync(mockProgress, userName)
  │     └─ NetInfo.fetch() → online?
  │           ├─ YES: api.getAllWords() → cacheWordsBulk()
  │           │        api.syncProgress(payload) → markEventsSynced()
  │           └─ NO: bỏ qua
  │
  └─ setIsLoading(false)         // hiển thị content
```

### 8.3 Object Scanner Flow

```
User nhấn "QUÉT VẬT THỂ MẪU"
  │
  ├─ isScanning=true → pulseAnim bắt đầu
  ├─ Mô phỏng delay (1.5-2.5s)
  │
  ├─ [Option A] Kiểm tra wordCacheStore (từ đã tải về)
  │     └─ getCachedWordByClass(mockClass) → trả về từ từ cache
  │
  ├─ [Option B] api.getWordByClass(cocoClass)
  │     └─ GET /api/words/{cocoClass} → map DTO → VocabularyWord
  │
  └─ setScannedResult(word) + setShowResultSheet(true)
       │
       ├─ User nhấn "LƯU VÀO SỔ TỪ"
       │     ├─ saveLocalFlashcard(word)   // thêm vào in-memory store
       │     ├─ setSavedWords(prev + word)
       │     ├─ onAddXp(15)               // +15 XP
       │     └─ addedToast = "✅ Đã lưu [word] vào sổ từ!"
       │
       └─ User nhấn folder-plus → chọn lesson → handleAddWordToLesson(lessonId, word)
```

### 8.4 Flashcard SM-2 Spaced Repetition

```
FlashcardDeckScreen
  │
  ├─ filteredWords = savedWords.filter(difficulty filter)
  ├─ Hiển thị card (front: word + phonetic, back: vn + sentence)
  │
  └─ User chọn Easy / Medium / Hard
       │
       └─ updateFlashcardSM2(id, rating) — thuật toán SM-2:
             Hard:   reps=0, interval=1,    ease_factor -= 0.2  (min 1.3)
             Medium: reps++, interval *= 1.5
             Easy:   reps++, ease_factor += 0.15
                     interval: 1 → 6 → interval * ease_factor
             next_review_at = now + interval * 86400000ms
```

### 8.5 Quiz Flow

```
PracticeQuizScreen
  │
  ├─ mockQuizzes: mảng QuizQuestion (multiple-choice + fill-blank)
  ├─ currentIndex = 0, score = 0
  │
  ├─ User chọn/nhập đáp án → handleSelectOption(opt)
  │     ├─ isAnswered=true
  │     ├─ isCorrect = (opt === answer)
  │     │     ├─ Correct: score++, playSoundEffect('correct')
  │     │     └─ Wrong: playSoundEffect('wrong')
  │     │
  │     └─ Hiển thị feedback (smile/frown icon + đáp án đúng nếu sai)
  │
  ├─ User nhấn "CÂU TIẾP THEO" → currentIndex++
  │
  └─ currentIndex >= mockQuizzes.length → quizFinished=true
       └─ Hiển thị celebration card: score/total + XP = score*15 + 10
            └─ onAddXp(score * 15 + 10)
```

### 8.6 XP & Leaderboard Sync

```
handleAddXp(amount)
  │
  ├─ setUserProgress(prev):
  │     xp += amount
  │     if xp >= nextLevelXp: level++, nextLevelXp += 300
  │
  └─ triggerBackgroundSync(updatedProgress, userName)
       │ (fire-and-forget)
       └─ POST /api/sync/progress
             {deviceUuid, displayName, totalXp, streak, wordsLearned}
             → Response: {status: "ok", rank: N}

Backend: LeaderboardService.sync()
  ├─ findByDeviceUuid(deviceUuid) → upsert UserProgress
  ├─ save(progress)
  └─ calculateRank(deviceUuid, xp)
       └─ countByTotalXpGreaterThan(xp) → COUNT(*) WHERE totalXp > :xp
            → rank = ahead + 1
```

### 8.7 Profile Screen Load

```
ProfileScreen mount
  │
  ├─ getOrCreateDeviceUuid() → setCurrentUuid
  ├─ api.getLeaderboard()    → GET /api/leaderboard
  │     ├─ Success: setLeaderboard(entries)
  │     └─ Error: leaderboard stays empty → hiển thị "Chưa có kết nối server"
  │
  ├─ setIsLoadingLeaderboard(false)
  │
  └─ Render:
       ├─ Avatar = initials circle (màu primary[500])
       │     initials = userName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()
       ├─ Stats grid: XP, Level, Từ đã học, Badges
       ├─ Badges grid (unlocked = full opacity, locked = 40% opacity)
       ├─ Leaderboard: top 10, medal 🥇🥈🥉 cho rank 1-3
       └─ Daily Goal picker
```

### 8.8 Onboarding Flow

```
OnboardingScreen (4 bước)
  │
  Step 0 (Landing):
    Avatar circle (user icon) + "Hi! Ready to learn English?" + "GET STARTED"
  │
  Step 1 (Trình độ):
    Chọn: Beginner / Elementary / Intermediate / Upper-Intermediate / Advanced
    → setSelectedLevel
  │
  Step 2 (Mục tiêu):
    Multi-select: Giao tiếp / Công việc / Du học / Giải trí / Thi cử
    → setSelectedGoals[]
  │
  Step 3 (Thời gian):
    Chọn: 5 mins / 10 mins / 15 mins or more
    → setSelectedTime
  │
  Step 4 (Summary):
    "Your English Plan is Ready!" + hiển thị lại lựa chọn
    → onComplete({ level, goals, dailyTime }) → app/index.tsx → signup screen
```

---

## 9. Chức năng Hoàn chỉnh

### 9.1 Màn hình & Tính năng

| Màn hình | File | Tính năng chính |
|---|---|---|
| **Onboarding** | `onboarding-screen.tsx` | 4 bước survey, cá nhân hóa lộ trình |
| **Đăng ký/Đăng nhập** | `drops-auth-screen.tsx` | Form email/password, Google Mock OAuth |
| **Dashboard (Trang chủ)** | `dashboard-screen.tsx` | XP card, WoTD từ API, streak badge, bar chart XP 7 ngày, daily quests, lesson shortcuts |
| **Sổ từ (Flashcards)** | `flashcard-deck-screen.tsx` | Lật card, filter easy/medium/hard, session progress, SM-2 rating, tìm kiếm |
| **Chi tiết từ** | `word-detail-screen.tsx` | Nghĩa VN, câu ví dụ, mẹo nhớ, phát âm TTS, tự đánh giá |
| **Bài học (Learn)** | `lesson-grid-screen.tsx` | Grid 6 bài học, filter sơ/trung/cao cấp |
| **Chi tiết bài học** | `lesson-detail-screen.tsx` | Danh sách từ, tiến độ, lưu vào sổ từ |
| **Quét AI (Scanner)** | `object-scanner-screen.tsx` | Mô phỏng camera YOLO, confidence bar, lưu từ, chọn lesson, toast |
| **Quiz** | `practice-quiz-screen.tsx` | Trắc nghiệm + điền từ, feedback ngay lập tức, tính XP |
| **Hồ sơ (Profile)** | `profile-screen.tsx` | Avatar initials, email, stats, badges, leaderboard top 10, mục tiêu ngày |
| **Cài đặt** | `settings-screen.tsx` | Thông báo, âm thanh, haptics, chủ đề, ngôn ngữ, data, về app |
| **Tìm kiếm** | `search-screen.tsx` | Tìm từ vựng + bài học realtime |
| **Streak Modal** | `streak-celebration-modal.tsx` | Popup milestone 3/7/14/30 ngày |

### 9.2 Navigation Structure

```
MainContainer (FloatingTabBar)
├── Tab: home    → DashboardScreen
├── Tab: learn   → LessonGridScreen
│                    └── Modal: LessonDetailScreen
├── Tab: scan    → ObjectScannerScreen (Camera AI)
├── Tab: cards   → FlashcardDeckScreen
│                    └── Slide: WordDetailScreen
└── Tab: profile → ProfileScreen
                      └── Overlay: SettingsScreen

Modals toàn cục (từ MainContainer):
├── SearchModal (search pill button)
├── QuizModal   (từ Dashboard / Flashcards)
├── StreakCelebrationModal
└── LessonDetailModal
```

### 9.3 Gamification System

| Cơ chế | Mô tả |
|---|---|
| **XP** | Tích lũy từ: quiz (score×15+10), scan+lưu từ (+15 XP), hoàn thành quest |
| **Level** | Mỗi level cần thêm 300 XP (nextLevelXp += 300 khi level up) |
| **Streak** | Số ngày học liên tiếp, không mất nếu đã sync trong ngày |
| **Badges** | Mở khóa khi đạt mốc (dữ liệu từ mock-data.ts) |
| **Leaderboard** | Top 50 toàn cầu theo totalXp, cập nhật mỗi sync |
| **Daily Quests** | 3 nhiệm vụ ngày: Quét 1 vật (+15XP), Ôn 3 flashcard, Quiz đạt max |

---

## 10. In-Memory State (database.ts)

> Ứng dụng không dùng SQLite. Tất cả lưu trong RAM phiên — reset khi đóng app.

```typescript
// 4 store trong memory:
let wordCacheStore: Record<string, VocabularyWord> = {};  // từ điển tải từ API
let flashcardsStore: LocalFlashcard[] = [];                // sổ từ người dùng đã lưu
let eventsStore: LearningEvent[] = [];                     // sự kiện học (WORD_LEARNED, QUIZ_DONE, ...)
let cachedDeviceUuid: string = '';                         // UUID phiên thiết bị
```

**Flashcard Schema (LocalFlashcard):**
```typescript
{
  id, coco_class, en_word, phonetic, pos,
  translation, example_en, example_vn,
  ease_factor,     // SM-2: khởi đầu 2.5
  interval_days,   // ngày đến lần ôn tiếp
  repetitions,     // số lần ôn thành công
  next_review_at,  // timestamp ms
  added_at
}
```

---

## 11. Error Handling

### Frontend
- API calls trong `api.ts` bọc bằng `try/catch`, trả về `[]` hoặc `null` nếu lỗi
- `triggerBackgroundSync` là fire-and-forget (`.catch(() => {})`)
- ProfileScreen: hiển thị "Chưa có kết nối server" nếu leaderboard trống
- Dashboard: hiển thị placeholder loading nếu WoTD chưa tải

### Backend
```
GlobalExceptionHandler (@RestControllerAdvice)
├── ResponseStatusException  → 404/4xx + JSON body
├── MethodArgumentNotValidException → 400 + field errors
└── Exception (catch-all)    → 500 "An unexpected error occurred."

Response format:
{ "status": N, "error": "...", "message": "...", "timestamp": "..." }
```

---

## 12. Environment Variables

### Backend (.env)
```
DB_URL=jdbc:postgresql://host/dbname
DB_USERNAME=...
DB_PASSWORD=...
PORT=8080
```

### AI Service
```
GEMINI_API_KEY=...         # Google Gemini API key (tùy chọn)
MODEL_PATH=models/best.pt  # Path đến model fine-tuned (tùy chọn)
```

### Frontend
```
EXPO_PUBLIC_API_URL=http://<server-ip>:8080  # override auto-detect
```
> Nếu không set, app tự detect IP từ `expo-constants` (hostUri trong Expo dev server)

---

## 13. Deployment & Build

### Frontend
```bash
cd frontend
npm install
npm run android    # Android (cần Android Studio / device)
npm run ios        # iOS (cần Xcode / macOS)
npm start          # Expo Go dev server
```

### Backend
```bash
cd backend
./mvnw spring-boot:run   # Development
./mvnw package           # Build JAR
java -jar target/*.jar   # Production (cần .env)
```

### AI Service
```bash
cd ai_service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 14. Luồng Dữ liệu Tổng thể

```
[User đăng nhập]
    ↓ (name, email)
[app/index.tsx] → [MainContainer]
    ↓
[initDatabase() + getOrCreateDeviceUuid()] → deviceUuid in memory
    ↓
[GET /api/words] → wordCacheStore + wordOfTheDay (random)
    ↓
[Background Sync] → POST /api/sync/progress → rank update
    ↓
[Dashboard render]:
  - Avatar = initials(userName)
  - XP / Level từ userProgress state
  - WoTD = wordOfTheDay prop
  - Streak badge
  - Daily quests
    ↓
[Scan vật thể] → wordCacheStore lookup / GET /api/words/{class}
    → saveLocalFlashcard() → setSavedWords() → +15 XP → sync
    ↓
[Profile] → GET /api/leaderboard → top 10 + rank
    ↓
[Logout] → clear userName/email → back to onboarding
```

---

*Tài liệu này được tổng hợp từ toàn bộ source code của repository. Cập nhật cuối: 2026-08-18.*
