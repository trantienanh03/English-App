# Vocam — AI-Powered English Vocabulary Learning App

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/YOLO--World-v2-FF6F00?logo=ultralytics&logoColor=white" alt="YOLO-World" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python 3.11" />
</p>

> **Vocam** là nền tảng học từ vựng tiếng Anh thông minh kết hợp thị giác máy tính (**Computer Vision**), mô hình phát hiện vật thể đa nhãn (**YOLO-World v2**), trí tuệ nhân tạo tạo sinh (**Google Gemini AI**) và thuật toán lặp lại ngắt quãng (**SM-2 Spaced Repetition**). Ứng dụng giúp người học nhận diện đồ vật xung quanh đời sống thực, tra cứu từ vựng ngữ cảnh, lưu thẻ ghi nhớ và ôn tập khoa học.

---

## Video Demo Thực Tế

Xem video trình diễn toàn bộ chức năng ứng dụng trên YouTube:  
**[Xem Video Demo Vocam trên YouTube](https://youtu.be/3741H7ud4rA)**

---

## Tính Năng Nổi Bật

### 1. AI Object Scanner (Nhận Diện Vật Thể Đời Thực)
- **Mô hình YOLO-World v2**: Nhận diện đồng thời nhiều vật thể trong một khung hình với tập từ vựng chuẩn **Objects365** (365 nhãn canonical 1-1 với cơ sở dữ liệu).
- **Bounding Box Math**: Thuật toán tính toán bounding box chính xác theo tỉ lệ ảnh (`aspectFit` / `contain`), chống lệch hộp nhận diện trên mọi độ phân giải màn hình điện thoại.
- **Gemini AI Context Generation**: Tự động tạo câu ví dụ tự nhiên kèm phiên âm IPA và dịch nghĩa song ngữ Anh - Việt.

### 2. Thẻ Ghi Nhớ & Ôn Tập SM-2 (Spaced Repetition)
- **Lưu Flashcard tức thì**: Lưu từ vựng đã quét vào kho thẻ cá nhân, tự động phòng ngừa lưu trùng lặp theo `(user_id, word_id)`.
- **Thuật toán SM-2 chuẩn**: Phân loại mức độ ghi nhớ (**Again**, **Good**, **Easy**) để tính toán hệ số dễ dàng (*Easiness Factor*), số lần lặp lại (*Repetitions*), khoảng thời gian giãn cách (*Interval*) và lịch ôn tập kế tiếp (*nextReviewAt*).
- **Bộ lọc thẻ tới hạn (Due Today)**: Chỉ hiển thị các thẻ cần ôn tập trong ngày theo đúng điều kiện thời gian thực.

### 3. Bài Học Theo Chủ Đề & Quiz Tương Tác
- 20 bài học từ vựng chia theo các chủ đề thiết thực (Văn phòng, Nhà bếp, Đồ dùng học tập, Giao thông, v.v.).
- **Dynamic Quiz Generator**: Tạo câu hỏi trắc nghiệm tự động từ kho từ vựng của chính bài học đó.
- Theo dõi tiến độ hoàn thành (*Progress %*) bền vững trên cơ sở dữ liệu.

### 4. Thông Báo Đẩy Nhắc Ôn Tập (Push Notifications)
- Lập lịch thông báo nhắc học từ vựng hằng ngày bằng `expo-notifications` trên thiết bị iOS và Android vật lý.
- Tích hợp nút thử nghiệm thông báo nhanh ngay trong màn hình Cài đặt cá nhân.

### 5. Bảo Mật & Phân Quyền Đa Tầng
- **Xác thực Supabase JWT**: Đăng nhập bằng Email/Password hoặc Google OAuth; cấp token JWT mang định danh chuẩn UUID (`sub`).
- **Spring Security Resource Server**: Giải mã và xác thực chữ ký JWT tại máy chủ; phân quyền nghiêm ngặt giữa vai trò Học viên (**LEARNER**) và Quản trị viên (**ADMIN**).
- Dữ liệu người học được cô lập hoàn toàn theo `user_id`.

### 6. Quản Trị Hệ Thống (Admin Portal)
- Hỗ trợ cả **Mobile Admin** tích hợp sẵn trong ứng dụng di động và **Web Admin Dashboard** (React Vite) dành cho máy tính.
- Quản lý kho từ vựng: Thêm/Sửa từ, cập nhật nghĩa, tải ảnh minh họa lên Cloud Storage.
- Quản lý người dùng: Khóa/Mở khóa tài khoản người học vi phạm.

---

## Kiến Trúc Hệ Thống (System Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Mobile & Web)                 │
│  • React Native (Expo SDK 52) Mobile App [iOS & Android]    │
│  • React (Vite + TypeScript) Web Admin Dashboard            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST / Bearer JWT
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Service (Backend)               │
│               Spring Boot 3.3.4 (Java 17)                   │
│  • Spring Security / JWT Filter (Resource Server)           │
│  • Scan Gateway & Multipart Image Forwarding                │
│  • SM-2 Spaced Repetition Service                           │
│  • Lesson & Quiz Evaluation Engine                          │
│  • Flyway Database Migrations                               │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               │ JDBC Pool                    │ Internal HTTP
               ▼                              ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│      Database Layer          │ │      AI Model Service       │
│   PostgreSQL 15 (Supabase)   │ │      FastAPI (Python 3.11)  │
│  • app_users                 │ │  • YOLO-World v2 Inference  │
│  • words (365 canonical)     │ │  • Objects365 365 Classes   │
│  • saved_flashcards          │ │  • Google Gemini AI SDK     │
│  • user_lesson_progress      │ │  • Bounding Box Normalizer  │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## Cấu Trúc Thư Mục (Repository Structure)

```text
English-App/
├── ai_service/             # Dịch vụ AI nhận diện vật thể (FastAPI + YOLO-World)
│   ├── scripts/            # Script kiểm thử và webcam demo
│   ├── tests/              # Unit tests kiểm tra 365 nhãn canonical
│   ├── canonical-labels.txt# 365 nhãn từ vựng chuẩn
│   ├── main.py             # FastAPI entry point & API endpoints
│   └── requirements.txt    # Python dependencies
│
├── backend/                # Dịch vụ máy chủ nghiệp vụ (Spring Boot 3 + Java 17)
│   ├── src/main/java/      # Controllers, Services, Repositories, Security
│   ├── src/main/resources/ # application.properties, Flyway migrations (V100-V114)
│   └── pom.xml             # Maven dependencies & build configuration
│
├── frontend/               # Ứng dụng di động (React Native + Expo SDK 52)
│   ├── src/app/            # Navigation layout & screen routing
│   ├── src/components/     # Scanner, Flashcards, Lessons, Quiz, Admin screens
│   ├── src/constants/      # Vocam design tokens & color palette
│   ├── src/lib/            # Supabase client setup
│   └── src/services/       # API client & SM-2 local helpers
│
├── admin/                  # Bảng điều khiển quản trị web (React + Vite + TypeScript)
│   ├── src/                # UI components, API client, Admin dashboard
│   └── package.json        # Dependencies & scripts
│
├── RUN_GUIDE.md            # Hướng dẫn chi tiết cấu hình và chạy dự án
├── LICENSE                 # Giấy phép mã nguồn mở MIT
└── README.md               # Tài liệu giới thiệu tổng quan dự án
```

---

## Hướng Dẫn Khởi Chạy Nhanh (Quick Start)

### 1. Điều kiện tiên quyết (Prerequisites)
- **Node.js**: `>= 20.x` & `npm`
- **Java**: `OpenJDK 17`
- **Python**: `3.11.x`
- **PostgreSQL Database** (hoặc tài khoản [Supabase](https://supabase.com))

---

### 2. Khởi chạy AI Service (FastAPI)
```bash
cd ai_service

# 1. Khởi tạo môi trường ảo Python
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 2. Cài đặt thư viện
pip install -r requirements.txt

# 3. Khởi chạy server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Kiểm tra trạng thái:* Mở trình duyệt truy cập `http://localhost:8000/health`.

---

### 3. Khởi chạy Backend Service (Spring Boot)
```bash
cd backend

# 1. Cấu hình file .env từ file mẫu
cp .env.example .env
# Chỉnh sửa DB_URL, DB_USERNAME, DB_PASSWORD trong .env

# 2. Biên dịch và chạy server
# Windows:
.\mvnw.cmd spring-boot:run
# macOS/Linux:
./mvnw spring-boot:run
```
*Backend sẽ tự động chạy Flyway migration để tạo 6 bảng dữ liệu và nạp sẵn 365 từ vựng.*

---

### 4. Khởi chạy Ứng dụng Di động (React Native Expo)
```bash
cd frontend

# 1. Cấu hình file .env từ file mẫu
cp .env.example .env
# Cập nhật EXPO_PUBLIC_API_URL trỏ tới IP backend của bạn

# 2. Cài đặt dependencies
npm install

# 3. Khởi chạy Metro Bundler
npx expo start
```
- Nhấn `i` để mở trên iOS Simulator.
- Nhấn `a` để mở trên Android Emulator.
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại thật (hoặc build bản native qua `npx expo run:ios` / `npx expo run:android`).

---

### 5. Khởi chạy Admin Web Dashboard (Tùy chọn)
```bash
cd admin

# 1. Cấu hình .env
cp .env.example .env

# 2. Cài đặt và khởi chạy
npm install
npm run dev
```
*Truy cập bảng quản trị tại:* `http://localhost:5173`.

---

## Tác Giả & Liên Hệ

- **Tác giả:** Trần Tiến Anh
- **Đề tài:** Ứng dụng học từ vựng tiếng Anh nhận diện vật thể thông qua mô hình YOLO (Vocam)
- **GitHub:** [@trantienanh03](https://github.com/trantienanh03)
- **Video Trình Chiếu:** [YouTube Demo](https://youtu.be/3741H7ud4rA)

---

## Bản Quyền (License)

Dự án này được phát hành dưới giấy phép mã nguồn mở [MIT License](LICENSE).
