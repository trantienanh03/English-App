# CHƯƠNG 3. PHƯƠNG PHÁP LUẬN VÀ GIẢI PHÁP THỰC HIỆN

---

## 3.1. Phát biểu bài toán

### 3.1.1. Mô tả bài toán

Bài toán được phát biểu như sau:

**Xây dựng ứng dụng di động Vocam hỗ trợ học từ vựng tiếng Anh có khả năng:**

- Nhận diện vật thể từ luồng dữ liệu camera theo thời gian thực, hoạt động hoàn toàn không cần kết nối mạng.
- Cung cấp thông tin từ vựng liên quan đến vật thể được nhận diện (bao gồm từ tiếng Anh, phiên âm IPA, nghĩa tiếng Việt và câu ví dụ minh họa).
- Lưu trữ quá trình học dưới dạng thẻ ghi nhớ (Flashcard) gắn với hình ảnh thực tế.
- Hỗ trợ người dùng ôn tập từ vựng theo lộ trình cá nhân hóa dựa trên mức độ nắm vững của từng cá nhân.
- Theo dõi quá trình học và cập nhật tiến độ của người dùng theo thời gian.

**Về bản chất**, bài toán có thể được xem là bài toán **chuyển đổi thông tin từ hình ảnh vật thể trong môi trường thực tế (đầu vào) thành kiến thức từ vựng có khả năng ghi nhớ lâu dài (đầu ra)**. Để thực hiện được điều này, hệ thống cần kết hợp giữa nhận diện thị giác máy tính (Computer Vision), xử lý dữ liệu học tập và cơ chế ôn tập cá nhân hóa.

**Phân tích đầu vào – đầu ra:**

| Thành phần | Mô tả |
|---|---|
| **Đầu vào (Input)** | Khung hình từ camera điện thoại chứa vật thể cần nhận diện; phản hồi ôn tập của người dùng (đánh giá mức độ nhớ từ 0–5) |
| **Xử lý trung gian** | Suy luận mô hình AI trực tiếp trên thiết bị; ánh xạ nhãn sang thông tin từ vựng; tính toán lịch ôn tập tối ưu theo SM-2 |
| **Đầu ra (Output)** | Thông tin từ vựng đầy đủ (từ, phiên âm, nghĩa, ví dụ); Flashcard được lưu trữ; lịch ôn tập cá nhân hóa; thống kê tiến độ |

Ứng dụng Vocam được thiết kế theo nguyên tắc **"offline-first"**: toàn bộ chức năng học tập cốt lõi — nhận diện vật thể, tra cứu từ vựng, tạo Flashcard, ôn tập theo SM-2 — hoạt động hoàn toàn không cần kết nối mạng. Kết nối Internet chỉ được yêu cầu cho các tính năng mang tính xã hội như **đồng bộ đa thiết bị, bảng xếp hạng và gamification**.

---

### 3.1.2. Yêu cầu đặt ra

#### Yêu cầu chức năng

| Mã | Yêu cầu chức năng |
|---|---|
| YC-F01 | Nhận diện được các vật thể thuộc 80 lớp đối tượng phổ biến trong bộ dữ liệu Microsoft COCO [12], hoạt động hoàn toàn ngoại tuyến. |
| YC-F02 | Hiển thị đầy đủ thông tin từ vựng sau khi nhận diện thành công: từ tiếng Anh, phiên âm IPA, nghĩa tiếng Việt, câu ví dụ minh họa. |
| YC-F03 | Cho phép người dùng lưu kết quả nhận diện thành Flashcard gắn với hình ảnh thực tế. |
| YC-F04 | Hỗ trợ ôn tập Flashcard theo lịch cá nhân hóa; thực hiện bài tập củng cố kiến thức (trắc nghiệm 4 đáp án, điền từ). |
| YC-F05 | Theo dõi và cập nhật tiến độ học tập: số từ đã học, streak học hàng ngày, lịch sử ôn tập. |
| YC-F06 | Hỗ trợ xác thực người dùng bằng tài khoản email/mật khẩu; phân quyền vai trò (USER, ADMIN). |
| YC-F07 | Đồng bộ dữ liệu Flashcard và tiến độ học tập lên máy chủ khi có kết nối mạng, đảm bảo không mất dữ liệu khi chuyển thiết bị. |
| YC-F08 | Hiển thị bảng xếp hạng và tính năng gamification (XP, streak) khi có kết nối mạng. |

#### Yêu cầu phi chức năng

| Mã | Yêu cầu phi chức năng | Giá trị mục tiêu |
|---|---|---|
| YC-NF01 | **Hiệu năng nhận diện (on-device)** – Thời gian suy luận mô hình trực tiếp trên thiết bị tầm trung. | < 100 ms |
| YC-NF02 | **Hoạt động ngoại tuyến** – Các chức năng học tập cốt lõi phải hoạt động không cần Internet. | Camera, Flashcard, SM-2: 100% offline |
| YC-NF03 | **Phạm vi nhận diện** – Số lớp vật thể được hỗ trợ theo chuẩn COCO [12]. | 80 lớp |
| YC-NF04 | **Bảo mật** – Mật khẩu phải được băm; token xác thực có thời hạn và có thể thu hồi. | BCrypt + JWT (access 15 phút, refresh 30 ngày) |
| YC-NF05 | **Giao diện** – Đơn giản, trực quan, phù hợp với người dùng phổ thông. | SUS Score ≥ 70 |
| YC-NF06 | **Tài nguyên** – Mức tiêu thụ CPU, RAM, pin khi chạy camera liên tục ở mức chấp nhận được. | CPU < 60%, RAM < 300 MB |
| YC-NF07 | **Kích thước mô hình** – Mô hình AI đóng gói trong ứng dụng đủ nhỏ. | ≤ 10 MB |

---

## 3.2. Giải pháp cụ thể để giải quyết bài toán

### 3.2.1. Ý tưởng giải pháp

Để đáp ứng các yêu cầu đã phân tích ở mục 3.1, đề tài xây dựng giải pháp dựa trên việc **kết hợp công nghệ AI biên (Edge AI) trực tiếp trên thiết bị, phương pháp học theo ngữ cảnh và thuật toán ôn tập ngắt quãng**. Thay vì chỉ dừng lại ở việc nhận diện vật thể, Vocam hướng đến việc hình thành một quy trình học từ vựng hoàn chỉnh, từ ghi nhận hình ảnh thực tế đến hỗ trợ ghi nhớ lâu dài.

Cụ thể, giải pháp được triển khai theo các hướng chính sau:

1. **Triển khai mô hình AI trực tiếp trên thiết bị di động (Edge AI)**: Sử dụng YOLOv8 Nano được chuyển đổi sang định dạng TensorFlow Lite (TFLite/LiteRT) [11] để chạy suy luận hoàn toàn ngoại tuyến, đảm bảo nhận diện vật thể ngay cả khi không có Internet.
2. **Cơ chế ánh xạ từ vựng cục bộ**: Toàn bộ dữ liệu từ vựng của 80 lớp COCO được nhúng sẵn vào ứng dụng, cho phép tra cứu tức thì không cần mạng.
3. **Tự động tạo Flashcard gắn với hình ảnh thực tế**, kết hợp thông tin ngôn ngữ để tận dụng nguyên lý mã hóa kép (Dual Coding Theory) [3].
4. **Tích hợp thuật toán ôn tập ngắt quãng SM-2** [5] để lập lịch ôn tập cá nhân hóa cho từng Flashcard dựa trên mức độ nắm vững thực tế.
5. **Đồng bộ dữ liệu theo mô hình offline-first**: Dữ liệu được lưu cục bộ (SQLite) trước, đồng bộ lên PostgreSQL khi có mạng — đảm bảo không mất dữ liệu và trải nghiệm liền mạch.
6. **Backend server (Spring Boot)** chỉ đảm nhận xác thực người dùng, đồng bộ dữ liệu và các tính năng xã hội như bảng xếp hạng — không tham gia vào luồng nhận diện cốt lõi.

Các giải pháp trên được lựa chọn dựa trên ba tiêu chí chính:
- **(1) Khả năng hoạt động ngoại tuyến**: Mọi chức năng học tập đều chạy được mà không cần mạng — đáp ứng nhu cầu học từ vựng mọi lúc, mọi nơi.
- **(2) Hiệu năng và trải nghiệm người dùng**: Xử lý trực tiếp trên thiết bị loại bỏ hoàn toàn độ trễ mạng, đảm bảo phản hồi dưới 100 ms (YC-NF01).
- **(3) Khả năng mở rộng và bảo trì lâu dài**: Kiến trúc phân tầng cho phép nâng cấp từng thành phần độc lập mà không ảnh hưởng đến toàn hệ thống.

---

### 3.2.2. Quy trình hoạt động tổng thể

Quy trình giải quyết bài toán được phân tách thành hai luồng độc lập tương ứng với hai chế độ kết nối:

**Luồng 1 — Nhận diện và tạo Flashcard (hoàn toàn offline):**

1. Người dùng mở camera trên Vocam và hướng vào vật thể cần học.
2. Ứng dụng lấy khung hình và thực hiện **tiền xử lý ảnh** (resize, chuẩn hóa) ngay trên thiết bị.
3. Khung hình được đưa qua **mô hình YOLOv8n TFLite** đang chạy trên thiết bị để dự đoán vật thể.
4. Áp dụng **Non-Maximum Suppression (NMS)** và lọc theo ngưỡng tin cậy.
5. **Ánh xạ nhãn lớp** sang thông tin từ vựng từ dữ liệu nhúng sẵn trong ứng dụng.
6. Hiển thị thông tin từ vựng; người dùng xác nhận **lưu thành Flashcard**.
7. Flashcard được khởi tạo với tham số SM-2 mặc định, lưu vào SQLite cục bộ và đưa vào **lịch ôn tập**.

**Luồng 2 — Ôn tập Flashcard (hoàn toàn offline):**

8. Khi đến hạn, hệ thống hiển thị Flashcard từ SQLite cục bộ.
9. Người dùng thực hiện ôn tập và đánh giá mức độ nhớ (thang điểm 0–5).
10. Thuật toán **SM-2** tính lại lịch ôn và cập nhật ngay vào SQLite.

**Luồng 3 — Đồng bộ và tính năng xã hội (cần kết nối mạng):**

11. Khi phát hiện có mạng, Vocam tự động **đồng bộ** dữ liệu lên Spring Boot Backend → PostgreSQL.
12. Bảng xếp hạng và tính năng gamification được **tải từ server** và cập nhật.

> *(Gợi ý chèn Hình 3.1: Sơ đồ quy trình hoạt động tổng thể với 3 luồng: Offline Detection, Offline Review, Online Sync)*

---

### 3.2.3. Mô hình Visual-Memory Loop

Trong phạm vi đề tài, nhóm tác giả đề xuất mô hình khái niệm **Visual-Memory Loop** nhằm mô tả quy trình chuyển đổi hoạt động nhận diện vật thể thành hoạt động học từ vựng và ghi nhớ lâu dài. Đây là mô hình được xây dựng dựa trên việc kết hợp giữa **nhận diện vật thể thời gian thực trên thiết bị**, **nguyên lý mã hóa kép (Dual Coding Theory)** [3] và **thuật toán ôn tập ngắt quãng SM-2** [5].

Mô hình gồm **6 giai đoạn khép kín**:

```
Quét (Capture) → Nhận diện (Detect) → Liên kết từ vựng (Vocabulary Association)
    → Mã hóa (Encode) → Ôn tập (Review) → Củng cố trí nhớ (Memory Reinforcement)
                                                        ↓
                                              ← quay lại Quét ←
```

| Giai đoạn | Mô tả | Thành phần kỹ thuật | Chế độ |
|---|---|---|---|
| **1. Quét** | Người dùng hướng camera vào vật thể thực tế | Camera module – React Native | 📴 Offline |
| **2. Nhận diện** | Mô hình AI on-device phát hiện vật thể | YOLOv8n TFLite – On-device | 📴 Offline |
| **3. Liên kết từ vựng** | Ánh xạ nhãn → dữ liệu từ vựng nhúng sẵn | Vocabulary DB – SQLite local | 📴 Offline |
| **4. Mã hóa** | Tạo Flashcard kết hợp ảnh thực tế + ngôn ngữ | Flashcard CRUD – SQLite | 📴 Offline |
| **5. Ôn tập** | SM-2 xác định thời điểm tối ưu; bài tập tương tác | SM-2 engine – on-device | 📴 Offline |
| **6. Củng cố** | Cập nhật tham số SM-2; đồng bộ khi có mạng | Review log – Sync to PostgreSQL | 🌐 Online khi có mạng |

> *(Gợi ý chèn Hình 3.2: Mô hình Visual-Memory Loop – sơ đồ vòng khép kín 6 giai đoạn, phân biệt màu offline/online)*

---

### 3.2.4. Tổng hợp các thành phần giải pháp

| Thành phần | Giải pháp lựa chọn | Lý do lựa chọn | Mục đích |
|---|---|---|---|
| **Ứng dụng di động** | React Native + TypeScript | Một codebase iOS + Android; TypeScript type-safe | Giao diện người dùng đa nền tảng |
| **Nhận diện vật thể** | YOLOv8n + TFLite (LiteRT) [4][11] | Nhẹ (~6 MB TFLite), nhanh (<100 ms CPU), offline | Nhận diện thời gian thực on-device |
| **Mô hình học tập** | Visual-Memory Loop | Kết hợp Dual Coding + Spaced Repetition [3][5][6] | Quy trình học khép kín |
| **Mã hóa kép** | Dual Coding Theory [3] | Kết hợp kênh hình ảnh và ngôn ngữ | Tăng hiệu quả ghi nhớ |
| **Ôn tập cá nhân hóa** | Thuật toán SM-2 [5] | Kiểm chứng thực tiễn; chỉ 3 tham số đơn giản | Lịch ôn tập tối ưu tránh quên lãng |
| **Lưu trữ cục bộ** | SQLite (expo-sqlite) | Nhẹ, không cần server, hỗ trợ tốt trên React Native | Lưu Flashcard, SM-2 state, từ vựng offline |
| **Backend nghiệp vụ** | Spring Boot (Java 21) | Enterprise-grade; Spring Security mạnh | Auth, sync dữ liệu, BXH, gamification |
| **Cơ sở dữ liệu** | PostgreSQL | Tin cậy, phổ biến, hiệu năng cao | Lưu trữ đồng bộ đa thiết bị |
| **Xác thực** | JWT + BCrypt | Stateless; industry standard | Bảo vệ dữ liệu người dùng |

---

## 3.3. Phương pháp nhận diện vật thể thời gian thực

### 3.3.1. Lựa chọn mô hình YOLOv8 Nano

Bài toán nhận diện vật thể thời gian thực **trực tiếp trên thiết bị di động** đặt ra các ràng buộc nghiêm ngặt về tốc độ xử lý, kích thước mô hình và khả năng chạy không cần GPU rời. Đề tài so sánh một số mô hình phổ biến:

| Mô hình | Kích thước (TFLite) | mAP@50 (COCO) | Tốc độ (CPU di động) | Ghi chú |
|---|---|---|---|---|
| **YOLOv8n** | ~6 MB | 37.3% | ~80–120 ms | ✅ Lựa chọn của đề tài |
| YOLOv8s | ~22 MB | 44.9% | ~300–500 ms | Nặng hơn 3.5× |
| MobileNet SSD v2 | ~14 MB | 22.1% | ~60 ms | Kém chính xác hơn đáng kể |
| EfficientDet-D0 | ~15 MB | 34.6% | ~150–200 ms | Chậm và lớn hơn |
| YOLOv5n | ~4 MB | 28.0% | ~100 ms | Kém YOLOv8n về mAP |

---

### 3.3.2. Tối ưu hóa mô hình cho thiết bị di động (TFLite/LiteRT)

Mô hình YOLOv8n huấn luyện ở định dạng PyTorch (`.pt`) được chuyển đổi sang **TensorFlow Lite (TFLite)** — runtime nhẹ của Google được tối ưu cho phần cứng di động.

---

### 3.3.3. Ánh xạ kết quả nhận diện sang thông tin từ vựng

Sau khi YOLOv8n TFLite trả về nhãn lớp (ví dụ: `"cup"`, `"laptop"`), ứng dụng tra cứu tức thì trong **bảng từ vựng SQLite cục bộ** để lấy thông tin đầy đủ.

---

### 3.3.4. Pipeline xử lý ảnh và nhận diện

```
[Camera Frame] ──► [Preprocessing (320x320)] ──► [YOLOv8n TFLite Inference]
               ──► [NMS (conf=0.35, iou=0.45)] ──► [Vocabulary Mapping] ──► [UI Display]
```

---

## 3.4. Phương pháp ôn tập ngắt quãng (SM-2)

### 3.4.1. Nguyên lý
Dựa trên đường cong quên lãng của Ebbinghaus [2] và thuật toán SM-2 của Woźniak [5].

### 3.4.2. Công thức
- $EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$ (ràng buộc $EF' \ge 1.3$)
- Nếu $q < 3$: reset $n = 0, I = 1$
- Nếu $q \ge 3$: $n=1 \to I=1$; $n=2 \to I=6$; $n>2 \to I(n) = I(n-1) \times EF$

### 3.4.3. Tích hợp vào ứng dụng
Lưu các trường `ease_factor`, `interval_days`, `repetitions`, `next_review_at` trên SQLite cục bộ và tính toán hoàn toàn phía client.

---

## 3.5. Kiến trúc giải pháp đề xuất

Mô hình 3 tầng phân tách:
1. **Tầng Presentation (Client)**: React Native + Expo + TypeScript
2. **Tầng Business Logic & AI Engine (On-Device)**: YOLOv8n TFLite + SM-2 Engine
3. **Tầng Data**: SQLite (Local Offline) & Spring Boot + PostgreSQL (Remote Server Sync)

---

## 3.6. Kết luận chương

Chương 3 đã trình bày phương pháp luận giải quyết bài toán với mô hình Visual-Memory Loop, Edge AI on-device và Spaced Repetition (SM-2).

---
*[Hết Chương 3]*
