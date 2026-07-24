# 📚 English Learning App — Project Summary

> Tổng hợp toàn bộ nội dung đã bàn bạc về dự án ứng dụng học tiếng Anh  
> Sinh viên: Trần Tiến Anh — MSSV: 22130016 — Lớp: DH22DTB  
> Đề tài: *Nghiên cứu và ứng dụng mô hình YOLO trong nhận diện vật thể hỗ trợ học từ vựng tiếng Anh trên thiết bị di động*

---

## 1. Vấn đề bài toán

Người học tiếng Anh tại Việt Nam gặp khó khăn lớn trong việc ghi nhớ từ vựng chỉ các đồ vật thông dụng trong đời sống. Các ứng dụng học từ vựng hiện có chủ yếu thiết kế bài học theo lộ trình cố định, tách rời khỏi môi trường thực tế, dẫn đến ghi nhớ thụ động và nhanh quên.

**Số liệu thực tế:**
- Năm 2024, Việt Nam xếp hạng **63/116 quốc gia** về trình độ tiếng Anh theo EF EPI, tụt 5 bậc so với năm 2023 (EF Education First, 2024)
- **80.69%** sinh viên Việt Nam gặp khó khăn trong việc ghi nhớ từ vựng dài hạn (Phan et al., 2025 — Vietnam Journal of Education)
- Chỉ **14%** học sinh lớp 12 Việt Nam đạt mức từ vựng 2000 từ cơ bản (Vu & Nguyen, nghiên cứu quy mô lớn, đăng trên MDPI Education Sciences)
- Gần **70%** học sinh Việt Nam đạt điểm dưới trung bình trong kỳ thi tiếng Anh tốt nghiệp THPT năm 2019

**Bài toán cần giải quyết:** Xây dựng ứng dụng di động cho phép người dùng quét camera nhận diện vật thể xung quanh theo thời gian thực (không cần Internet), nhận ngay từ vựng tiếng Anh tương ứng, và có hệ thống ôn tập thông minh đảm bảo ghi nhớ lâu dài.

---

## 2. Tech Stack đã chốt

### Tổng quan kiến trúc

```
React Native (Expo)          ← Mobile App
        ↓
Spring Boot (Java 17+)       ← Backend chính
        ↓
PostgreSQL + Redis            ← Database & Cache
        ↓
Python + FastAPI              ← AI Service riêng
        ↓
Docker + AWS                  ← Infrastructure
```

### Chi tiết từng tầng

| Tầng | Công nghệ | Lý do chọn |
|------|-----------|------------|
| **Mobile** | React Native + Expo | iOS & Android từ 1 codebase, cộng đồng lớn nhất, job market cao |
| **Backend** | Spring Boot (Java 17+) | Chuẩn industry VN (ngân hàng, fintech, enterprise), Spring Security + JWT mạnh |
| **AI Service** | Python + FastAPI | Ngôn ngữ thống trị AI/ML, FastAPI được dùng nhiều nhất cho production |
| **Database** | PostgreSQL | Phổ biến nhất, dùng mọi quy mô, job market cao |
| **Cache** | Redis | Cache AI result, session — tiêu chuẩn industry |
| **Deploy** | Docker + AWS | Job market cao nhất, certification có giá trị |

### Lý do chọn Spring Boot thay vì Node.js

- Job market tại VN rất cao (ngân hàng, fintech, doanh nghiệp lớn)
- Performance cao hơn ở tải lớn
- Type safety mạnh với Java
- Ecosystem cực lớn, mature
- MoMo, VNG, Tiki, Shopee đều dùng Java/Spring Boot

### Chiến lược AI

- **Giai đoạn 1 (MVP):** Dùng YOLOv8n pretrained trên COCO (~80 loại đồ vật thông dụng) — detect trong ~30-80ms, không cần tự train
- **Giai đoạn 2:** Fine-tune với dataset đặc thù nếu cần
- **Cache layer:** Redis cache kết quả theo hash ảnh → lần 2 quét cùng vật thể trả về trong ~20ms

---

## 3. Bảo mật & Authentication

### Chiến lược JWT (Hướng A — Stateless)

- **Access token:** ngắn hạn (15 phút)
- **Refresh token:** dài hạn (30 ngày), lưu ở database
- Logout không cần chờ token hết hạn (revoke refresh token)

### Spring Security Stack

- Spring Security — filter chain, authentication, authorization
- JWT (jjwt library) — access token + refresh token
- BCrypt — hash password
- Spring Validation — validate request (@Valid, @NotNull...)

### Đăng nhập

- Email + Password (chính)
- Google OAuth (sẽ thêm sau)

### Phân quyền

- Role: `USER`, `ADMIN` (chỉ 2 role)
- Subscription: `FREE`, `PREMIUM` (tách bảng riêng với `expired_at`)
- **Lý do tách subscription khỏi role:** Khi user hết hạn premium chỉ cần check `expired_at < now()`, không phải đổi role — tránh bug và dễ mở rộng (PREMIUM_YEARLY, TRIAL...)

---

## 4. Database Schema

**Database:** PostgreSQL (host trên Supabase tạm, sau migrate sang local hoặc cloud)

### Các bảng chính

| Bảng | Mô tả |
|------|-------|
| `users` | Thông tin cơ bản: id, email, password_hash, display_name, avatar_url, is_active, is_email_verified |
| `roles` | USER, ADMIN |
| `user_roles` | Many-to-many: user ↔ role |
| `oauth_accounts` | Google OAuth: provider, provider_user_id, access_token |
| `refresh_tokens` | JWT refresh token: token_hash, device_info, is_revoked, expires_at |
| `subscriptions` | FREE/PREMIUM: plan, status, started_at, **expired_at** |
| `decks` | Deck từ vựng: user_id, name, description, is_public |
| `words` | Từ vựng: deck_id, term, phonetic, definition, example_sentence, translation_vi, image_url, audio_url |
| `flashcards` | SM-2 fields: word_id, user_id, **ease_factor, interval_days, repetitions, next_review_at** |
| `review_logs` | Lịch sử ôn: flashcard_id, rating (0-5), reviewed_at |
| `user_progress` | Thống kê: total_words_learned, current_streak, longest_streak, total_xp, last_study_date |

### Quan hệ chính

```
users ──< user_roles >── roles
users ──< oauth_accounts
users ──< refresh_tokens
users ──o subscriptions
users ──< decks ──< words ──< flashcards ──< review_logs
users ──| user_progress
```

### SM-2 Fields (quan trọng — phải có từ đầu)

Flashcard cần 4 trường để implement thuật toán Spaced Repetition:
- `ease_factor` — hệ số dễ/khó (float)
- `interval_days` — khoảng cách ôn tiếp theo (int)
- `repetitions` — số lần đã ôn (int)
- `next_review_at` — thời điểm ôn tiếp theo (timestamp)

---

## 5. Core Features (làm trước)

### 5.1 Flashcard + Swipe (Ưu tiên #1)

**Tính năng:**
- Quẹt phải = đã biết, quẹt trái = chưa biết
- Mỗi card hiển thị: ảnh + từ tiếng Anh + phiên âm + nghĩa tiếng Việt + câu ví dụ
- Thuật toán **SM-2** tự động lên lịch ôn lại: từ quẹt trái xuất hiện sau 1 ngày → 3 ngày → 7 ngày → 30 ngày

**Tại sao quan trọng:** Đây là điểm biến app từ "flashcard thường" thành "công cụ học thật sự hiệu quả". SM-2 phải implement đúng từ đầu.

### 5.2 Object Scanner — Camera → Word → Flashcard (Tính năng cốt lõi)

**Luồng xử lý:**
1. User mở camera, quét vật thể
2. Chụp ảnh → gửi lên Spring Boot
3. Spring Boot check Redis cache (hash ảnh)
4. **Cache hit** (<50ms): trả kết quả ngay
5. **Cache miss**: gọi Python FastAPI → YOLOv8 detect → lấy tên object → Dictionary API (phonetic, pos, sentence) → Translation API (Vietnamese) → trả về
6. Hiển thị bottom sheet với: từ tiếng Anh, phiên âm 🔊, nghĩa Việt, câu ví dụ
7. User chọn: **Thêm vào Flashcard** hoặc **Thêm vào bài học**

**Latency mục tiêu:**
- Cache hit: ~20-50ms
- Cache miss: ~150-300ms (YOLOv8n nano)

### 5.3 Deck Management

- Tạo, sửa, xoá deck từ vựng
- Tìm kiếm từ đã học
- Xem trạng thái: đang ôn / đã thuộc / cần ôn lại

### 5.4 Quiz cơ bản

- Trắc nghiệm 4 đáp án
- Điền từ vào chỗ trống
- Nghe và chọn nghĩa đúng
- Mỗi phiên ngắn 5-10 câu

### 5.5 Context Lens

- Dán đoạn văn tiếng Anh bất kỳ vào app
- AI highlight từ khó + giải nghĩa theo ngữ cảnh câu đó
- Thêm vào deck 1 chạm
- **Chỉ cần 1 API call** — implement nhanh nhưng wow effect cao

### 5.6 Progress & Streak

- Streak học hàng ngày (flame icon 🔥)
- Số từ đã học / đang ôn / đã thuộc
- Lịch sử học theo ngày

---

## 6. Thứ tự Build

| Sprint | Nội dung |
|--------|----------|
| **Sprint 1** | Auth + user, DB schema, Flashcard CRUD |
| **Sprint 2** | Swipe UI, thuật toán SM-2, Deck management |
| **Sprint 3** | FastAPI + YOLOv8, Camera flow, Redis cache |
| **Sprint 4** | Quiz engine, Context lens, Progress & Streak UI |

**Nguyên tắc:** Làm database schema trước → Spring Boot API → React Native UI → Python AI Service. Không đụng vào UI khi chưa có data thật từ backend.

---

## 7. Tính năng tương lai (khi core ổn định)

### 🎙️ Luyện nói & nghe

| Tính năng | Mô tả |
|-----------|-------|
| **Pronunciation Mirror** | Dùng mic → AI so sánh sóng âm với người bản xứ, chỉ đúng âm tiết sai. Hiển thị waveform trực quan |
| **Shadow Mode** | Nghe câu → nhái lại → AI chấm tốc độ, ngữ điệu, phát âm. Bài từ podcast/phim thật |
| **Dictation Karaoke** | Bài hát/podcast phát lên, điền từ còn thiếu đúng nhịp |
| **AI Roleplay Chat** | AI đóng vai nhân vật thực tế (sân bay, phỏng vấn, bác sĩ) — luyện hội thoại có ngữ cảnh |

### 🎮 Gamification

| Tính năng | Mô tả |
|-----------|-------|
| **Word Battle 1v1** | Đấu từ vựng realtime với bạn bè. Ai điền nghĩa nhanh hơn thắng. Countdown 10 giây |
| **Boss Battle** | Cuối tuần là 1 boss gồm toàn từ khó nhất. Đánh boss bằng cách trả lời đúng liên tiếp |
| **Word Pet** | Nuôi thú ảo lớn lên khi học từ mới. Bỏ học vài ngày nó "đói" — Tamagotchi phiên bản học tiếng Anh |
| **XP League** | Bảng xếp hạng XP reset mỗi tuần giữa nhóm bạn bè. Tạo áp lực học vui |
| **Streak Heat Map** | Bản đồ học kiểu GitHub contributions — vệt xanh càng dài càng nghiện |

### 🤖 AI thông minh hơn

| Tính năng | Mô tả |
|-----------|-------|
| **Smart Review** | AI phân tích pattern quên → nhắc ôn đúng từ, đúng lúc (trước khi quên 20%). SM-2 nâng cao |
| **Daily Story** | Cuối ngày AI sinh 1 câu chuyện ngắn thú vị dùng toàn bộ từ bạn học hôm đó |
| **Word Chain** | Nối từ bằng chữ cái cuối — "apple → elephant → train..." — chơi solo hoặc thi đấu |
| **Emoji → Word** | Đoán từ từ chuỗi emoji gợi ý: 🌊+🏄 = "surfing" |

### 🔤 Học từ vựng nâng cao

| Tính năng | Mô tả |
|-----------|-------|
| **Sentence Builder** | Kéo thả các từ rời vào đúng vị trí để tạo câu hoàn chỉnh. Animation "snap" khi đặt đúng |

---

## 8. Lộ trình phát triển tổng thể

```
[Giai đoạn 1 — MVP]
Flashcard + Swipe  →  Quản lý deck  →  Object Scanner  →  Quiz cơ bản  →  Context Lens  →  Streak

[Giai đoạn 2 — AI nâng cao]
Pronunciation Mirror  →  Shadow Mode  →  Daily Story  →  Dictation Karaoke

[Giai đoạn 3 — Social & Gamification]
Word Battle 1v1  →  XP League  →  Boss Battle  →  Word Pet  →  Streak Heat Map
```

---

## 9. Tài liệu tham khảo (cho báo cáo)

1. Phan, T. T. T., Nguyen, V. T., Nguyen, N. T., & Tran, T. T. T. (2025). *English Vocabulary Learning among First Year Non-English Major Students.* Vietnam Journal of Education, 9(3), 351–362. https://vje.vn/index.php/journal/article/view/693

2. EF Education First. (2024). *EF English Proficiency Index 2024.* https://vietnamnet.vn/en/vietnam-drops-in-english-proficiency-index-now-63rd-out-of-116-countries-2341528.html

3. Vu, D. V., & Nguyen, T. M. H. (2021). *Vocabulary in English Language Learning, Teaching, and Testing in Vietnam: A Review.* MDPI Education Sciences, 11(9), 563. https://www.mdpi.com/2227-7102/11/9/563

4. Redmon, J., & Farhadi, A. (2018). *YOLOv3: An Incremental Improvement.* arXiv:1804.02767.

5. Ebbinghaus, H. (1885). *Über das Gedächtnis* (Memory: A Contribution to Experimental Psychology). — Cơ sở lý thuyết của thuật toán SM-2 / Spaced Repetition.

6. Wozniak, P. A. (1990). *Optimization of Learning.* — Thuật toán SM-2 gốc.

---

*File này được tạo tự động từ toàn bộ nội dung trao đổi trong session làm việc.*
