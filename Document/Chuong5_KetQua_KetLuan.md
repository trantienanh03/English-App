# CHƯƠNG 5. KẾT QUẢ, KẾT LUẬN VÀ KIẾN NGHỊ

---

## 5.1. KẾT QUẢ ĐẠT ĐƯỢC

### 5.1.1. Sản phẩm phần mềm ứng dụng Vocam

Trải qua quá trình nghiên cứu, thiết kế và hiện thực, đề tài đã hoàn thiện sản phẩm phần mềm **Vocam** — Ứng dụng di động hỗ trợ học từ vựng tiếng Anh thông qua nhận diện vật thể thời gian thực và thuật toán ôn tập ngắt quãng (SM-2).

Ứng dụng đã hoàn thành các module chức năng cốt lõi theo đúng yêu cầu đặt ra:

1. **Module Nhận diện vật thể On-Device (Edge AI)**:
   - Tích hợp thành công mô hình **YOLOv8 Nano** (chuyển đổi sang định dạng TensorFlow Lite / LiteRT) chạy suy luận trực tiếp trên thiết bị di động.
   - Nhận diện thời gian thực **80 lớp đối tượng phổ biến** theo chuẩn Microsoft COCO.
   - Tốc độ suy luận đạt trung bình **< 100 ms** trên các thiết bị Android/iOS tầm trung, hoạt động **100% ngoại tuyến (offline)**.

2. **Module Ánh xạ Từ vựng & Mã hóa Kép (Dual Coding)**:
   - Tự động liên kết nhãn nhận diện với thông tin từ vựng tiếng Anh chi tiết (từ vựng, phiên âm IPA, từ loại, nghĩa tiếng Việt, câu ví dụ minh họa và âm thanh phát âm).
   - Tự động tạo thẻ ghi nhớ (Flashcard) kết hợp hình ảnh thực tế vừa chụp với thông tin ngôn ngữ.

3. **Module Ôn tập Ngắt quãng (Spaced Repetition - SM-2)**:
   - Cài đặt hoàn chỉnh thuật toán **SuperMemo-2 (SM-2)** phía ứng dụng di động.
   - Lập lịch ôn tập cá nhân hóa dựa trên đánh giá phản hồi của người học (thang điểm 0–5), tự động tính toán lại hệ số dễ (Ease Factor) và khoảng cách ôn tập (Interval).
   - Hỗ trợ bài tập trắc nghiệm củng cố kiến thức tương tác.

4. **Module Backend & Đồng bộ Dữ liệu (Spring Boot + PostgreSQL)**:
   - Xây dựng hệ thống Backend với **Spring Boot (Java 21)** và cơ sở dữ liệu **PostgreSQL**.
   - Quản lý xác thực an toàn bằng **JWT** và băm mật khẩu **BCrypt**.
   - Hỗ trợ cơ chế đồng bộ theo mô hình **offline-first**: Lưu dữ liệu cục bộ trên SQLite, tự động push/pull dữ liệu với máy chủ khi có kết nối mạng.

---

### 5.1.2. Đánh giá hiệu năng và thử nghiệm thực tế

Hệ thống đã trải qua các bài kiểm thử đơn vị (Unit Test), kiểm thử tích hợp (Integration Test) và kiểm thử thực tế trên 5 thiết bị di động khác nhau. Kết quả đạt được như sau:

| Tiêu chí đo lường | Giá trị mục tiêu | Kết quả thực nghiệm | Đánh giá |
|---|---|---|---|
| **Thời gian suy luận AI (Inference)** | < 100 ms | 82 – 95 ms (CPU tầm trung) | ✅ Đạt |
| **Kích thước mô hình AI** | ≤ 10 MB | ~6.1 MB (TFLite INT8) | ✅ Đạt |
| **Độ chính xác nhận diện (mAP@50)** | > 35% | 37.3% (COCO dataset) | ✅ Đạt |
| **Khả năng chạy ngoại tuyến** | 100% offline cho core features | Hoạt động hoàn toàn không cần Internet | ✅ Đạt |
| **Độ chính xác thuật toán SM-2** | 100% theo công thức Woźniak | Passed 6/6 test cases | ✅ Đạt |
| **Thời gian đồng bộ dữ liệu (Sync)** | < 5 giây | 1.8 – 3.2 giây (khi có mạng) | ✅ Đạt |

---

## 5.2. KẾT LUẬN

### 5.2.1. Tóm tắt đóng góp của tiểu luận

Đề tài *"Nghiên cứu và ứng dụng mô hình YOLO trong nhận diện vật thể hỗ trợ học từ vựng tiếng Anh trên thiết bị di động"* đã giải quyết thành công các bài toán đặt ra, đóng góp cả về mặt lý luận lẫn thực tiễn:

1. **Về mặt phương pháp luận**:
   - Đề xuất và xây dựng thành công mô hình **Visual-Memory Loop** — quy trình học tập khép kín kết hợp giữa nhận diện thị giác máy tính, Nguyên lý Mã hóa kép (Dual Coding Theory) và Phương pháp Ôn tập ngắt quãng (Spaced Repetition).
   - Giải quyết triệt để hạn chế "tra cứu xong là quên" của các công cụ nhận diện thuần túy (như Google Lens) và hạn chế "học từ vựng thụ động, thiếu ngữ cảnh" của các ứng dụng học tiếng Anh truyền thống.

2. **Về mặt kỹ thuật và hiện thực**:
   - Chứng minh tính khả thi của việc triển khai mô hình Deep Learning (YOLOv8 Nano) dưới dạng **Edge AI** trực tiếp trên điện thoại di động, loại bỏ sự phụ thuộc vào mạng Internet và giảm độ trễ phản hồi xuống mức tối thiểu.
   - Thiết kế và cài đặt kiến trúc phần mềm phân tầng hiện đại, đảm bảo tính bảo trì, khả năng mở rộng và an toàn dữ liệu.

---

### 5.2.2. Hạn chế của đề tài

Bên cạnh những kết quả đạt được, đề tài vẫn còn một số hạn chế nhất định:

1. **Phạm vi nhận diện vật thể**: Hiện tại mô hình mới hỗ trợ 80 lớp đối tượng theo tập dữ liệu COCO, chưa bao phủ hết các đồ vật chuyên biệt hoặc đa dạng trong môi trường sống đặc thù tại Việt Nam.
2. **Ảnh hưởng môi trường chụp**: Độ chính xác nhận diện giảm khi camera quay trong điều kiện thiếu sáng, ánh sáng ngược hoặc góc chụp bị che khuất một phần.
3. **Phần cứng thiết bị cũ**: Trên các thiết bị di động đời cũ (RAM < 3GB, CPU yếu), quá trình suy luận camera realtime có thể gây hiện tượng ấm máy và tốn pin hơn bình thường.

---

## 5.3. KIẾN NGHỊ VÀ HƯỚNG PHÁT TRIỂN TIẾP THEO

Để phát triển ứng dụng Vocam hoàn thiện hơn trong tương lai, nhóm nghiên cứu đề xuất các hướng phát triển tiếp theo bao gồm:

1. **Mở rộng tập dữ liệu và Fine-tune mô hình AI**:
   - Thu thập thêm bộ dữ liệu từ vựng và vật thể thực tế tại Việt Nam (đồ dùng học tập, món ăn Việt Nam, phương tiện giao thông đặc thù...).
   - Thực hiện Fine-tune lại mô hình YOLOv8 trên tập dữ liệu mới để nâng cao độ chính xác và mở rộng vốn từ vựng lên 300–500 từ thông dụng.

2. **Nâng cấp tính năng AI & Xử lý ngôn ngữ**:
   - Tích hợp thêm mô hình **AI đánh giá phát âm (Pronunciation Scoring)** thông qua micro để người học kiểm tra chính xác khả năng đọc phiên âm IPA của mình.
   - Áp dụng các mô hình LLM nhỏ (Small LLM / SLM) để tự động sinh câu ví dụ ngữ cảnh linh hoạt theo từng đồ vật được quét.

3. **Phát triển tính năng Xã hội và Gamification**:
   - Mở rộng các tính năng đấu trí từ vựng (Word Battle 1v1), bảng xếp hạng tuần (XP League) và vệt học tập (Streak Map) nhằm kích thích động lực tự học liên tục.
   - Hỗ trợ chia sẻ bộ thẻ Flashcard cá nhân giữa các người dùng trong cộng đồng.

---
*[Hết Chương 5]*
