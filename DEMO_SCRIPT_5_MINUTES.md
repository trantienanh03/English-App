# KỊCH BẢN QUAY VIDEO DEMO VOCAM (5 PHÚT)
**Đề tài:** Ứng dụng học từ vựng tiếng Anh ngữ cảnh qua thị giác máy tính và thuật toán lặp lại ngắt quãng SM-2  
**Thời lượng chuẩn:** 5 phút (300 giây)  
**Thiết bị quay:** iPhone (kết nối trực tiếp hệ thống Vocam Full-stack)

---

## ⏱️ BẢNG PHÂN BỔ THỜI GIAN TỔNG QUAN

| Thời gian | Phân đoạn | Nội dung trọng tâm |
|---|---|---|
| **0:00 – 0:30** (30s) | **Phần 1: Mở đầu & Đăng nhập** | Giới thiệu đề tài, kiến trúc hệ thống & bảo mật Supabase Auth |
| **0:30 – 2:00** (90s) | **Phần 2: Quét vật thể AI & Bounding Box** | Nhận diện đa vật thể YOLO Objects365, chi tiết từ vựng & lưu Flashcard |
| **2:00 – 3:15** (75s) | **Phần 3: Thuật toán Spaced Repetition (SM-2)** | Cơ chế tính toán thẻ đến hạn, phiên ôn tập Flashcard 3 mức đánh giá |
| **3:15 – 4:15** (60s) | **Phần 4: 20 Bài học chủ đề & Quiz tương tác** | Lộ trình 5 chủ đề đời thực, làm bài trắc nghiệm & cập nhật tiến độ DB |
| **4:15 – 4:45** (30s) | **Phần 5: Tìm kiếm & Hồ sơ cá nhân** | Tìm kiếm từ vựng toàn cục, thống kê chỉ số học tập bền vững |
| **4:45 – 5:00** (15s) | **Phần 6: Kết luận & Lời cảm ơn** | Tóm tắt giá trị ứng dụng & sẵn sàng cho phần Q&A |

---

## 🛠️ BƯỚC CHUẨN BỊ TRƯỚC KHI BẮT ĐẦU (0:00)

1. Mở 3 tab Terminal trên máy tính để chạy 3 service:
   - **Tab 1 (AI Service):**
     ```bash
     cd /Users/tanhtran/HocTap/English-App/ai_service && ./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
     ```
   - **Tab 2 (Backend Spring Boot):**
     ```bash
     cd /Users/tanhtran/HocTap/English-App/backend && ./mvnw spring-boot:run
     ```
   - **Tab 3 (Frontend Expo Metro):**
     ```bash
     cd /Users/tanhtran/HocTap/English-App/frontend && npx expo start --host lan
     ```
2. Đảm bảo iPhone và máy Mac cùng kết nối chung một mạng Wi-Fi (hoặc cắm cáp USB).
3. Chuẩn bị sẵn một góc bàn có các đồ vật quen thuộc: **laptop, chuột, bàn phím, cốc nước, điện thoại, sách, ghế...** (hoặc ảnh chụp sắc nét sẵn trong thư viện ảnh).

---

## 🎬 CHI TIẾT KỊCH BẢN THEO TỪNG GIÂY

### 📍 PHẦN 1: MỞ ĐẦU & ĐĂNG NHẬP (0:00 – 0:30 | 30 giây)

* **Hành động trên màn hình:**
  1. Mở app **Vocam** $\rightarrow$ Splash Screen hiện logo và chuyển sang màn hình Đăng nhập.
  2. Bấm nhẹ vào nút **"Quên mật khẩu?"** để mở popup Khôi phục mật khẩu (chứng minh luồng Deep Link `vocam://reset-password`), sau đó đóng lại.
  3. Nhập Email và Mật khẩu tài khoản Học viên $\rightarrow$ Bấm **"Đăng nhập"**.
  4. Ứng dụng chuyển vào **Trang chủ** với lời chào cá nhân hóa.

* **Lời thoại thuyết minh:**
  > *"Kính chào quý Thầy Cô trong Hội đồng và các bạn. Em xin phép trình bày bản demo hoàn chỉnh của đề tài: Ứng dụng học từ vựng tiếng Anh ngữ cảnh Vocam.*  
  > *Hệ thống được xây dựng trên kiến trúc Client - Server với React Native TypeScript ở frontend, Spring Boot 3 ở backend và AI Microservice xử lý thị giác máy tính.*  
  > *Đầu tiên, người dùng đăng nhập bằng tài khoản bảo mật qua Supabase JWT. Hệ thống hỗ trợ đầy đủ cơ chế khôi phục mật khẩu qua deep link và phân quyền chặt chẽ trên máy chủ."*

---

### 📍 PHẦN 2: QUÉT ĐA VẬT THỂ AI & BÁM KHUNG BOUNDING BOX (0:30 – 2:00 | 90 giây) — *TÍNH NĂNG ĐINH!*

* **Hành động trên màn hình:**
  1. Chạm vào tab **"Quét AI"** (icon máy ảnh ở thanh điều hướng dưới).
  2. Camera mở lên tức thì. Hướng camera vào góc bàn làm việc (chứa laptop, chuột, điện thoại, cốc nước...).
  3. Bấm **Nút chụp ảnh** (vòng tròn trắng chính giữa).
  4. Hiển thị thông báo: *"AI đang phân tích đa vật thể..."*.
  5. **Khoảnh khắc ấn tượng:** Ảnh hiện ra với **các khung chữ nhật Bounding Box chuẩn xác 100% bao quanh từng đồ vật**:
     - Viền xanh lá/vàng ôm khít vật thể, nhãn tên rõ ràng: `laptop`, `mouse`, `keyboard`, `bottle`...
     - Ảnh giữ đúng hướng dọc tự nhiên (Portrait), không bị xoay lệch 90 độ nhờ bộ xử lý EXIF transpose trên server.
  6. **Tương tác trực quan:**
     - Dùng ngón tay chạm trực tiếp vào khung chữ nhật của `laptop` trên hình $\rightarrow$ Khung viền sáng lên màu vàng cam.
     - Dải chip tên vật thể bên dưới tự động cuộn và làm nổi bật chip `laptop`.
  7. Modal **Chi tiết từ vựng** mở lên với đầy đủ dữ liệu học thuật:
     - Từ vựng: **laptop**
     - Phiên âm chuẩn IPA: `/ˈlæp.tɒp/`
     - Loại từ: **Danh từ (Noun)**
     - Nghĩa tiếng Việt: **máy tính xách tay**
     - Định nghĩa tiếng Anh học thuật: *"A portable computer suitable for use while travelling."*
     - Ví dụ câu song ngữ Anh - Việt.
  8. Bấm vào nút **Loa (Audio)** để app phát âm từ bản xứ to rõ.
  9. Bấm nút **"Lưu vào Sổ từ Flashcard"** $\rightarrow$ Toast màu xanh thông báo: *"Đã lưu vào sổ từ"*.
  10. Thử bấm lại lần nữa để chứng minh tính năng **chống trùng lặp từ vựng** hoạt động chính xác.

* **Lời thoại thuyết minh:**
  > *"Điểm cốt lõi tạo nên sự đột phá của Vocam là khả năng biến bất kỳ không gian thực tế nào thành bài học từ vựng trực quan.*  
  > *Khi người học chụp ảnh không gian xung quanh, ảnh được gửi đến AI Service xử lý góc xoay EXIF và chạy qua mô hình YOLO Objects365 với 365 nhãn chuẩn hóa xác định.*  
  > *Hệ thống đồng thời phát hiện nhiều vật thể trong cùng một khung hình và vẽ chính xác bounding box theo đúng tỷ lệ màn hình điện thoại.*  
  > *Người học chỉ cần chạm trực tiếp vào vật thể muốn học để xem đầy đủ phiên âm IPA, giải nghĩa tiếng Việt, định nghĩa học thuật, nghe phát âm bản xứ và lưu vào bộ thẻ flashcard cá nhân mà không lo bị lưu trùng lặp."*

---

### 📍 PHẦN 3: ÔN TẬP THEO THUẬT TOÁN SM-2 (2:00 – 3:15 | 75 giây)

* **Hành động trên màn hình:**
  1. Chuyển sang tab **"Sổ từ"** (icon nhiều lớp thẻ).
  2. Màn hình hiển thị tổng quan:
     - Số từ cần ôn hôm nay (Due cards) dựa trên điều kiện `nextReviewAt <= now`.
     - Danh sách toàn bộ các từ đã lưu kèm trạng thái ghi nhớ.
  3. Nhấn vào nút **"Bắt đầu ôn tập hôm nay"**:
     - Thẻ Flashcard hiện ra với thiết kế tối giản, trực quan.
     - Mặt trước: Từ vựng tiếng Anh, phiên âm IPA, nút nghe phát âm.
     - Chạm vào thẻ để **lật sang mặt sau**: Hiển thị nghĩa tiếng Việt, câu ví dụ minh họa ngữ cảnh.
  4. Phía dưới xuất hiện 3 nút đánh giá trí nhớ theo thuật toán SM-2:
     - **Chưa thuộc (Again)**: Reset khoảng cách ôn tập về 1 ngày, giảm Easiness Factor.
     - **Nhớ tốt (Good)**: Tăng khoảng thời gian ôn tập theo hệ số nhân.
     - **Rất dễ (Easy)**: Tối ưu hóa chu kỳ ôn tập xa hơn cho từ vựng đã nhớ vững.
  5. Bấm chọn mức đánh giá $\rightarrow$ Thẻ kế tiếp xuất hiện mượt mà.
  6. Sau khi hoàn thành thẻ cuối cùng:
     - Màn hình thông báo hoàn thành phiên ôn hôm nay!
     - Mục "Cần ôn hôm nay" về 0 và các chỉ số học tập được cập nhật bền vững lên server.

* **Lời thoại thuyết minh:**
  > *"Để giải quyết hiện tượng 'đường cong lãng quên', Vocam tích hợp thuật toán lặp lại ngắt quãng SM-2 (Spaced Repetition System).*  
  > *Hệ thống theo dõi các tham số gồm: số lần lặp lại, hệ số dễ nhớ Easiness Factor và mốc thời gian ôn tập tiếp theo nextReviewAt được lưu trực tiếp trong cơ sở dữ liệu PostgreSQL.*  
  > *Tùy theo phản hồi của người học là Chưa thuộc, Nhớ tốt hay Rất dễ, thuật toán sẽ tự động phân bổ lại ngày ôn tập tối ưu nhất, giúp chuyển kiến thức từ trí nhớ ngắn hạn sang trí nhớ dài hạn mà không gây quá tải."*

---

### 📍 PHẦN 4: 20 BÀI HỌC CHỦ ĐỀ & BÀI TẬP TRẮC NGHIỆM (3:15 – 4:15 | 60 giây)

* **Hành động trên màn hình:**
  1. Chuyển sang tab **"Bài học"** (icon quyển sách).
  2. Bấm lướt qua các tab chủ đề thực tế ở phía trên:
     - **Tất cả bài học** (20 bài học hiển thị trọn vẹn).
     - **Giao tiếp hàng ngày** (4 bài học: Vật dụng cá nhân, Mua sắm, Đồ ăn thức uống, Phụ kiện dạo phố).
     - **Đi làm & Công việc** (4 bài học: Thiết bị văn phòng, Phòng họp, Thiết bị liên lạc, Tài liệu).
     - **Trường học & Học tập** (4 bài học: Dụng cụ học sinh, Thể thao, Lớp học, Ngoại khóa).
     - **Đời sống & Gia đình** (4 bài học: Nấu ăn nhà bếp, Phòng khách, Bàn ăn, Đồ dùng cá nhân).
     - **Du lịch & Giao thông** (4 bài học: Phương tiện thành phố, Chuyến đi xa, Biển báo đường bộ, Hành lý du lịch).
     *(Lưu ý: Màn hình vừa vặn, không còn bất kỳ khoảng trắng thừa hay thanh lọc phụ nào).*
  3. Chọn bài học: **"Thiết bị & Công nghệ văn phòng"**:
     - Xem tóm tắt bài học và danh sách từ vựng chuẩn bị học.
  4. Bấm **"VÀO HỌC" / "Làm bài tập Quiz"**:
     - Màn hình trắc nghiệm 4 lựa chọn mở ra.
     - Trả lời nhanh 3–4 câu hỏi trắc nghiệm sinh động (nghe phát âm, chọn nghĩa đúng).
     - Bấm nộp bài $\rightarrow$ Hiển thị màn hình tổng kết điểm số `%` cùng lời khen ngợi.
  5. Đóng Quiz quay lại danh sách bài học:
     - Thanh tiến độ của bài học *"Thiết bị & Công nghệ văn phòng"* tự động nhảy lên `%` tương ứng, đồng bộ với backend `user_lesson_progress`.

* **Lời thoại thuyết minh:**
  > *"Ngoài việc quét ảnh tự do, Vocam cung cấp một hệ thống học tập có cấu trúc gồm 20 bài học được thiết kế sát với đời sống qua 5 nhóm chủ đề: Giao tiếp, Đi làm, Trường học, Gia đình và Du lịch.*  
  > *Mỗi bài học đều được tích hợp bài tập Quiz trắc nghiệm tương tác giúp củng cố phản xạ nhận diện từ. Điểm số và tiến độ học tập được lưu trữ bền vững, cho phép người học theo dõi sát sao lộ trình tiến bộ của bản thân."*

---

### 📍 PHẦN 5: TÌM KIẾM TOÀN CỤC & TRANG CÁ NHÂN (4:15 – 4:45 | 30 giây)

* **Hành động trên màn hình:**
  1. Về Trang chủ hoặc thanh tìm kiếm: Gõ thử từ *"camera"* hoặc *"laptop"* $\rightarrow$ Kết quả hiện ra tức thì với phát âm và bài học chứa từ đó.
  2. Chuyển sang tab **"Cá nhân"**:
     - Xem các thống kê thời gian thực: **Số từ đã lưu**, **Số từ đã thuộc**, **Thẻ cần ôn**.
     - Giới thiệu nhanh các thiết lập cài đặt.
  3. Bấm **"Đăng xuất"** $\rightarrow$ Trở về màn hình Đăng nhập an toàn.

* **Lời thoại thuyết minh:**
  > *"Ứng dụng còn hỗ trợ tìm kiếm tức thời trong kho 365 từ vựng chuẩn hóa. Tab cá nhân tổng hợp trực quan mọi chỉ số tiến độ: từ số lượng flashcard đã lưu đến số từ đã thành thạo, tạo động lực duy trì thói quen học tập mỗi ngày."*

---

### 📍 PHẦN 6: KẾT LUẬN & HOÀN TẤT (4:45 – 5:00 | 15 giây)

* **Hành động trên màn hình:**
  - Để app ở màn hình Đăng nhập hoặc Trang chủ gọn gàng.
  - Hướng camera quay toàn cảnh ứng dụng hoạt động ổn định trên iPhone.

* **Lời thoại thuyết minh:**
  > *"Tóm lại, Vocam đã kết hợp thành công công nghệ AI thị giác máy tính và phương pháp ghi nhớ khoa học SM-2 để tạo ra một giải pháp học từ vựng tiếng Anh hiện đại, tương tác cao và thiết thực.*  
  > *Em xin chân thành cảm ơn quý Thầy Cô trong Hội đồng đã lắng nghe. Em rất mong nhận được những nhận xét và góp ý từ Thầy Cô!"*

---

## 💡 MẸO ĐỂ CÓ VIDEO DEMO HOÀN HẢO

1. **Âm thanh:** Quay ở phòng yên tĩnh, bật âm lượng iPhone vừa đủ nghe để khi bấm icon loa thì mic thu âm thu được giọng phát âm tiếng Anh chuẩn.
2. **Ánh sáng:** Đặt bàn làm việc đủ sáng để khi lia camera chụp ảnh vật thể, AI nhận diện nhanh và bounding box hiện lên sắc nét nhất.
3. **Tốc độ thao tác:** Chạm dứt khoát, sau mỗi thao tác (như lật thẻ hoặc bấm nút AI) dừng lại 1-2 giây cho người xem kịp nhìn thấy kết quả trước khi chuyển sang bước tiếp theo.
4. **Không cần tua nhanh:** Với kịch bản 5 phút trên, bạn có thể nói với tốc độ vừa phải, tự tin và giải thích cặn kẽ từng tính năng mà không bị hụt hơi.
