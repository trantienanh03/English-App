# Hướng Dẫn Khởi Chạy Hệ Thống Vocam & Build Xcode Cho Điện Thoại Thật (Physical iOS Device)

Tài liệu này chi tiết toàn bộ các bước để khởi chạy 3 tầng dịch vụ (**AI Service**, **Spring Boot Backend**, **React Native Frontend Metro**) và nạp dự án vào **Xcode** để cài đặt, chạy ứng dụng trên iPhone thật.

---

## 📋 Danh Sách Cổng & Địa Chỉ Dịch Vụ

| Tầng Dịch Vụ | Thư Mục | Lệnh Khởi Chạy | Địa Chỉ URL |
| :--- | :--- | :--- | :--- |
| **AI Model Service** (FastAPI) | `ai_service/` | `./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000` | `http://0.0.0.0:8000` |
| **Backend Service** (Spring Boot) | `backend/` | `./mvnw spring-boot:run` | `http://0.0.0.0:8080` |
| **Frontend Metro** (Expo React Native) | `frontend/` | `npx expo start --host lan` | `http://<IP_MAC>:8081` |
| **iOS Native Workspace** (Xcode) | `frontend/ios/` | `open Vocam.xcworkspace` | File dự án Xcode |

---

## 🛠️ Bước 1: Cấu Hình Địa Chỉ IP Mạng LAN

Để điện thoại thật kết nối được tới Backend chạy trên máy Mac qua Wi-Fi, địa chỉ IP trong file `.env` của frontend phải trùng với IP mạng Wi-Fi hiện tại của máy Mac.

1. **Lấy địa chỉ IP của máy Mac**:
   Mở Terminal và chạy:
   ```bash
   ipconfig getifaddr en0
   ```
   *(Ví dụ kết quả trả về là `192.168.1.60`)*

2. **Cập nhật file `frontend/.env`**:
   Mở file [`frontend/.env`](file:///Users/tanhtran/HocTap/English-App/frontend/.env) và cập nhật dòng `EXPO_PUBLIC_API_URL`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://zxvbmgxvvxqtvukjdbbr.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EXPO_PUBLIC_API_URL=http://192.168.1.60:8080
   ```
   *(Thay `192.168.1.60` bằng IP thực tế của máy Mac nếu IP bị đổi khi sang mạng Wi-Fi khác)*

---

## 🚀 Bước 2: Khởi Chạy AI Model Service (FastAPI)

Dịch vụ AI xử lý nhận diện vật thể bằng mô hình YOLOv8 và Gemini API fallback.

1. **Chạy dịch vụ**:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/ai_service
   ./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Kiểm tra trạng thái**:
   Mở tab terminal mới hoặc trình duyệt truy cập:
   ```bash
   curl http://localhost:8000/health
   ```
   *Kết quả mong đợi*: `{"status":"healthy","loaded_model":"yolov8m-worldv2.pt"}`

---

## 🍃 Bước 3: Khởi Chạy Backend Service (Spring Boot)

Dịch vụ backend xử lý nghiệp vụ từ vựng, flashcard, SM-2, kết nối Supabase PostgreSQL và gọi AI service.

1. **Chạy dịch vụ**:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/backend
   ./mvnw spring-boot:run
   ```

2. **Kiểm tra trạng thái**:
   ```bash
   curl -v http://localhost:8080/
   ```
   *Kết quả mong đợi*: Trả về `HTTP/1.1 403` (Do Spring Security bảo vệ trang chủ, chứng tỏ server đã sẵn sàng nhận kết nối).

---

## 📱 Bước 4: Khởi Chạy Frontend Metro Bundler & Cập Nhật CocoaPods

1. **Cập nhật CocoaPods (Native iOS Dependencies)**:
   Nếu có thay đổi thư viện native hoặc mở dự án lần đầu:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/frontend/ios
   LANG=en_US.UTF-8 pod install
   ```

2. **Khởi chạy Metro Bundler ở chế độ LAN**:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/frontend
   npx expo start --host lan
   ```
   *Giữ terminal này chạy để Metro nạp code JavaScript sang điện thoại khi chạy app.*

---

## 🛠️ Bước 5: Mở Xcode & Build Ứng Dụng Lên iPhone Thật

1. **Mở dự án trong Xcode**:
   Chạy lệnh sau hoặc mở Finder vào thư mục `frontend/ios` bấm đúp file **`Vocam.xcworkspace`**:
   ```bash
   open /Users/tanhtran/HocTap/English-App/frontend/ios/Vocam.xcworkspace
   ```
   ⚠️ *Lưu ý*: Luôn mở file **`.xcworkspace`**, KHÔNG mở file `.xcodeproj`.

2. **Kết nối và chọn thiết bị target**:
   - Cắm cáp USB nối iPhone vào máy Mac (Chọn **Trust This Computer** trên iPhone nếu được hỏi).
   - Ở phía trên bên trái Xcode (nơi chọn máy ảo/thiết bị), chọn tên **iPhone thật** của bạn (ví dụ: *Tien Anh's iPhone*).

3. **Cấu hình Chứng chỉ (Signing & Capabilities)**:
   - Ở cột cây thư mục bên trái Xcode, click vào dòng trên cùng **Vocam** (Project Root).
   - Ở cột giữa, chọn Target **Vocam**.
   - Chuyển sang tab **Signing & Capabilities**.
   - Tích chọn **Automatically manage signing**.
   - Tại mục **Team**, chọn **Personal Team (Apple ID)** của bạn.
   - Kiểm tra **Bundle Identifier** (ví dụ: `com.tanhtran.vocam`).

4. **Build và Chạy Ứng Dụng**:
   - Đảm bảo iPhone và Mac đang bắt **cùng 1 mạng Wi-Fi**.
   - Bấm nút **Play ▶ (Run)** ở góc trên Xcode (hoặc nhấn tổ hợp phím **`Cmd + R`**).
   - Xcode sẽ biên dịch code native C++/Swift/Obj-C và nạp ứng dụng trực tiếp lên iPhone của bạn.

---

## 💡 Xử Lý Lỗi Thường Gặp (Troubleshooting)

- **Lỗi không kết nối được Backend trên điện thoại**:
  - Kiểm tra xem iPhone và Mac có đang chung Wi-Fi không.
  - Kiểm tra lại địa chỉ IP trong `frontend/.env` đã đúng với `ipconfig getifaddr en0` chưa.
- **Lỗi Xcode báo `Untrusted Developer` trên iPhone**:
  - Trên iPhone, vào **Cài đặt (Settings)** -> **Cài đặt chung (General)** -> **Quản lý thiết bị & VPN (VPN & Device Management)** -> Chọn Apple ID của bạn -> Bấm **Tin cậy (Trust)**.
- **Lỗi Metro bundler không tải được code JS**:
  - Đảm bảo lệnh `npx expo start --host lan` đang chạy ở tab Terminal của máy Mac.

---

## 🔄 Bước 6: Rebuild Lại Native iOS Project (`Vocam.xcworkspace`) Khi Cập Nhật Đồ Án

Khi dự án đồ án có cập nhật, việc rebuild lại tùy thuộc vào loại thay đổi:

### Trường hợp A: Chỉ sửa code React Native (UI, Component, logic JS/TSX, sửa file `.env`)
👉 **KHÔNG CẦN rebuild lại Xcode!**
- Chỉ cần lưu file code trên máy Mac.
- Metro bundler (`npx expo start --host lan`) sẽ tự động đẩy code mới sang iPhone (Hot Reload).
- Nếu không thấy đổi, lắc điện thoại chọn **Reload** hoặc bấm phím `r` tại cửa sổ Terminal chạy Metro.

### Trường hợp B: Cài đặt thêm thư viện NPM Native mới, sửa `app.json`, đổi App Icon/Splash Screen
👉 **CẦN Rebuild lại mã nguồn Native iOS (`Vocam.xcworkspace`)**:

1. **Xóa và tái tạo thư mục `ios/` hoàn toàn mới bằng Expo Prebuild**:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/frontend
   npx expo prebuild --platform ios --clean
   ```
   *Lệnh này sẽ xóa thư mục `ios/` cũ, tự động sinh lại native code iOS và **đã tự động chạy CocoaPods** (`✔ Installed CocoaPods`).*

2. **Cập nhật lại CocoaPods Dependencies (Tùy chọn - chỉ khi cần chạy pod thủ công)**:
   ⚠️ *Lưu ý: Phải `cd ios` trước khi chạy `pod install`*:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/frontend/ios
   LANG=en_US.UTF-8 pod install
   ```

3. **Mở lại Xcode & Chọn lại Team Signing**:
   ```bash
   open /Users/tanhtran/HocTap/English-App/frontend/ios/Vocam.xcworkspace
   ```
   - Chọn lại **Personal Team Apple ID** của bạn trong **Signing & Capabilities**.
   - Bấm **Cmd + R** để Xcode biên dịch lại dự án và cài lên điện thoại.

### Trường hợp C: Xcode bị lỗi Cache cũ không nhận code mới
1. Trong Xcode: Chọn menu **Product** -> **Clean Build Folder** (Tổ hợp phím `Cmd + Shift + K`).
2. Khởi chạy lại Metro với tùy chọn xóa cache:
   ```bash
   cd /Users/tanhtran/HocTap/English-App/frontend
   npx expo start -c --host lan
   ```

---

## 🔔 Bước 7: Thử Nghiệm Tính Năng Thông Báo (Push Notifications) Trên iPhone Thật

Ứng dụng Vocam đã được tích hợp sẵn tính năng thông báo nhắc ôn tập từ vựng bằng `expo-notifications`.

### Cách 1: Test Thông Báo Thử Nghiệm Trực Tiếp Trên App (Khuyên dùng - Nhanh nhất)

1. **Khởi chạy ứng dụng** trên iPhone từ Xcode (Cmd + R).
2. Trong app, truy cập vào màn hình **Cá nhân (Profile)** -> Tìm mục **Cài đặt & Nhắc nhở**.
3. Gạt bật công tắc **"Thông báo Nhắc ôn tập"**.
4. Ứng dụng sẽ tự động xin quyền thông báo trên iOS (Bấm **Cho phép / Allow**).
5. Khi xuất hiện hộp thoại thử nghiệm: Bấm **"Có, gửi thử"**.
6. **Quan trọng**: Ngay lập tức bấm nút **Power (Khóa màn hình)** hoặc đưa app về **Màn hình chính (Chạy ngầm)**.
7. Sau **5 giây**, một thông báo đẩy sẽ xuất hiện trên màn hình iPhone:
   > 🔔 **Thông báo thử nghiệm Vocam**
   > *Hệ thống thông báo hoạt động bình thường!*

### Cách 2: Kiểm Tra Cấu Hình Capability Trong Xcode (Nếu tự cấu hình thủ công)

1. Trong Xcode, chọn **Vocam Project** -> Target **Vocam** -> tab **Signing & Capabilities**.
2. Bấm nút **`+ Capability`** -> Tìm và thêm **Push Notifications**.
3. Xcode sẽ tự động tạo file `Vocam.entitlements` với `aps-environment: development`.
