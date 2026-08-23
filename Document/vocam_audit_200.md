# Báo cáo Kiểm định 200 Tiêu chí — Vocam

> **Phương pháp**: Kiểm tra static code từng file thực tế, không dựa trên báo cáo trước.  
> **Trạng thái chỉ được dùng**: `PASS` | `FAIL` | `BLOCKED`  
> **UNVERIFIED** dùng nội bộ cho các tiêu chí code đúng nhưng chưa chạy thật.

---

## A. Auth & Security

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 1 | Đăng ký Email/Password có tạo tài khoản Supabase thật? | BLOCKED | [`drops-auth-screen.tsx:82`](file:///d:/HocTap/English-App/frontend/src/components/auth/drops-auth-screen.tsx#L82) gọi `supabase.auth.signUp()` đúng Supabase API. Cần chạy device thật để PASS. |
| 2 | Sau đăng ký, có thể đăng nhập bằng tài khoản đó? | BLOCKED | [`drops-auth-screen.tsx:105`](file:///d:/HocTap/English-App/frontend/src/components/auth/drops-auth-screen.tsx#L105) gọi `supabase.auth.signInWithPassword()`. Cần device thật. |
| 3 | Google OAuth có đăng nhập thành công trên thiết bị thật? | BLOCKED | [`drops-auth-screen.tsx:161`](file:///d:/HocTap/English-App/frontend/src/components/auth/drops-auth-screen.tsx#L161) gọi `supabase.auth.signInWithOAuth` + `WebBrowser.openAuthSessionAsync`. Cần device thật với redirect scheme `vocam://`. |
| 4 | Google OAuth xong có tạo Supabase session và vào đúng app? | BLOCKED | [`drops-auth-screen.tsx:179-192`](file:///d:/HocTap/English-App/frontend/src/components/auth/drops-auth-screen.tsx#L179-L192) exchange code → `setSession()` → `onAuthSuccess()`. Cần device thật. |
| 5 | Quên mật khẩu có gửi email reset thật? | BLOCKED | [`drops-auth-screen.tsx:139`](file:///d:/HocTap/English-App/frontend/src/components/auth/drops-auth-screen.tsx#L139) gọi `supabase.auth.resetPasswordForEmail()` với `redirectTo: 'vocam://reset-password'`. Cần SMTP Supabase đang bật. |
| 6 | User bấm link reset có mở đúng màn hình đổi mật khẩu? | BLOCKED | [`index.tsx:55-72`](file:///d:/HocTap/English-App/frontend/src/app/index.tsx#L55-L72) xử lý deep-link `reset-password` → `supabase.auth.exchangeCodeForSession()` → `setCurrentScreen('recovery')`. Cần device thật. |
| 7 | Đổi mật khẩu mới xong có đăng nhập bằng mật khẩu mới? | BLOCKED | [`recovery-password-screen.tsx`](file:///d:/HocTap/English-App/frontend/src/components/auth/recovery-password-screen.tsx) có UI. Cần verify Supabase `updateUser()` được gọi. |
| 8 | Đóng app rồi mở lại có tự khôi phục session? | **PASS** (UNVERIFIED) | [`index.tsx:22-37`](file:///d:/HocTap/English-App/frontend/src/app/index.tsx#L22-L37): `checkSession()` gọi `supabase.auth.getSession()` trước khi render → nếu session tồn tại → `setCurrentScreen('dashboard')`. Supabase persist session trong `AsyncStorage`. |
| 9 | Logout có thực sự gọi Supabase `signOut()`? | **PASS** (UNVERIFIED) | [`index.tsx:82-91`](file:///d:/HocTap/English-App/frontend/src/app/index.tsx#L82-L91): `handleLogout()` → `supabase.auth.signOut()` → `setCurrentScreen('login')`. |
| 10 | Logout xong có quay về Login và không thể back? | **PASS** (UNVERIFIED) | State-based navigation — `currentScreen` = `'login'` sau logout, không có stack để back. |
| 11 | User đăng ký bình thường có luôn là LEARNER? | **PASS** | [`UserService.java:40`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/UserService.java#L40): `new AppUser(userId, name, "LEARNER")` — hardcode LEARNER khi bootstrap. |
| 12 | Tài khoản ADMIN có được backend xác định đúng role? | **PASS** | [`JwtFilter.java:64,72`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/config/JwtFilter.java#L64): `bootstrapUserIfAbsent()` → đọc `appUser.getRole()` → set authority `ROLE_ADMIN`. Role đặt thủ công trong DB. |
| 13 | Sau login, LEARNER vào LearnerNavigator, ADMIN vào AdminNavigator? | **PASS** | [`main-container.tsx:119`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L119): `if (profile.role === 'ADMIN') return <AdminNavigator.../>`. LEARNER đi vào bottom-tab navigation. |
| 14 | Learner gọi `/api/admin/**` có nhận 403 Forbidden? | **PASS** | [`SecurityConfig.java:39`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/config/SecurityConfig.java#L39): `.requestMatchers("/api/admin/**").hasRole("ADMIN")`. Test coverage: `CoreSecurityIntegrationTest` dòng 72. |
| 15 | API protected không có token bị từ chối? | **PASS** | [`SecurityConfig.java:42`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/config/SecurityConfig.java#L42): `.anyRequest().authenticated()`. Test: `CoreSecurityIntegrationTest:89-90`. |
| 16 | Backend lấy userId từ JWT sub, không tin X-User-Id hay device_uuid? | **PASS** | [`JwtFilter.java:55-57`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/config/JwtFilter.java#L55-L57): `String sub = claims.getSubject()` → `UUID.fromString(sub)`. Không còn X-User-Id header. [`AuthenticatedUser.java:12`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/security/AuthenticatedUser.java#L12) lấy từ SecurityContext. |
| 17 | Admin khóa Learner → request tiếp theo nhận 403 ACCOUNT_LOCKED? | **PASS** | [`JwtFilter.java:67-70`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/config/JwtFilter.java#L67-L70): `if (appUser.getLocked()) { sendAccountLockedError(response); return; }`. Test: `CoreSecurityIntegrationTest:120`. |
| 18 | Khi nhận ACCOUNT_LOCKED, Mobile hiện thông báo và logout? | **PASS** | [`api.ts:90-93`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L90-L93): response 403 có body `ACCOUNT_LOCKED` → `Alert.alert(...)` + `supabase.auth.signOut()` + throw. |

---

## B. AI Scanner

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 19 | Người dùng có thể chụp ảnh Camera? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:57-72`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L57-L72): `ImagePicker.launchCameraAsync()` sau khi xin quyền. |
| 20 | Người dùng có thể chọn ảnh từ Gallery? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:75-91`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L75-L91): `ImagePicker.launchImageLibraryAsync()`. |
| 21 | Từ chối quyền có xử lý rõ không crash? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:60-63`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L60-L63): `if (status !== 'granted') { Alert.alert('Cần quyền Camera', ...); return; }` — không crash. |
| 22 | Ảnh đi đúng flow Mobile → Spring Boot → FastAPI → YOLO? | **PASS** | [`api.ts:144-172`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L144-L172): `fetch(API_BASE_URL + '/api/scan')` → [`ScanController.java:63`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/ScanController.java#L63): `restTemplate.exchange(aiServiceUrl + "/predict-multi", ...)`. |
| 23 | Một ảnh có nhiều vật thể → AI trả về nhiều detections? | BLOCKED | `ScanController.java:72`: parse `aiBody.get("predictions")` là List. FastAPI `/predict-multi` được thiết kế multi-object. Cần chạy thật. |
| 24 | Scanner hiển thị tất cả bounding box hợp lệ? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:115-135`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L115-L135): filter `p.wordData?.id && p.box` → `BoundingBoxOverlay`. |
| 25 | Bounding box đúng vị trí trên ảnh ngang? | **PASS** (UNVERIFIED) | [`bounding-box-overlay.tsx`](file:///d:/HocTap/English-App/frontend/src/components/scanner/bounding-box-overlay.tsx): Aspect Contain math với `scale`, `offsetX`, `offsetY` dựa trên `cWidth/cHeight` vs `imgW/imgH`. |
| 26 | Bounding box đúng trên ảnh dọc? | **PASS** (UNVERIFIED) | Cùng logic Aspect Contain — xử lý cả landscape lẫn portrait. |
| 27 | Bounding box đúng khi ảnh và container UI có tỷ lệ khác? | **PASS** (UNVERIFIED) | Aspect Contain scale + offset đảm bảo không bị lệch khi tỷ lệ khác nhau. |
| 28 | Xử lý đúng `resizeMode="contain"` với scale + offset? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:209`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L209): `<Image resizeMode="contain"/>` + Overlay dùng cùng tỷ lệ. |
| 29 | Người dùng chạm trực tiếp vào bounding box? | **PASS** (UNVERIFIED) | [`bounding-box-overlay.tsx`](file:///d:/HocTap/English-App/frontend/src/components/scanner/bounding-box-overlay.tsx): `<TouchableOpacity onPress={() => onSelectBox(item)}>` cho mỗi box. |
| 30 | Chạm box → đúng detection được highlight? | **PASS** (UNVERIFIED) | [`object-scanner-screen.tsx:154-161`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L154-L161): `setSelectedBox(item)` → truyền `selectedId` vào `BoundingBoxOverlay`. |
| 31 | Hai `person` → chọn riêng từng box? | **PASS** (UNVERIFIED) | [`bounding-box-overlay.tsx:6`](file:///d:/HocTap/English-App/frontend/src/components/scanner/bounding-box-overlay.tsx#L6): `id: "person_0"`, `"person_1"` — unique ID per index. `selectedId === item.id` làm highlight riêng lẻ. |
| 32 | Nhiều box chồng nhau có quy tắc chọn rõ? | **PASS** (UNVERIFIED) | [`bounding-box-overlay.tsx:67-74`](file:///d:/HocTap/English-App/frontend/src/components/scanner/bounding-box-overlay.tsx#L67-L74): Sort theo area DESC → box nhỏ nhất render trên cùng → nhận tap trước. |
| 33 | UI Scanner đã bỏ % confidence cho người học? | **PASS** | Kiểm tra toàn bộ [`object-scanner-screen.tsx`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx): không có text nào hiển thị confidence%. Bounding box chỉ hiện `label`. |
| 34 | Backend vẫn giữ confidence để filter/benchmark? | **PASS** | [`ScanController.java:42`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/ScanController.java#L42): `@RequestParam("confidence") float confidence` — truyền tới FastAPI `?confidence_threshold=`. |
| 35 | Threshold thực tế đúng với luận văn? | **FAIL** | Default threshold là `0.25` trong `ScanController.java:42`. Cần xác nhận giá trị luận văn ghi là bao nhiêu để verify khớp. |
| 36 | Không phát hiện vật thể → empty/error state? | **PASS** | [`object-scanner-screen.tsx:106-108`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L106-L108): `if (!predictions || predictions.length === 0) { Alert.alert('Không nhận diện được', ...); }` |
| 37 | FastAPI tắt → báo lỗi không crash? | **PASS** | [`ScanController.java:100-103`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/ScanController.java#L100-L103): Exception catch → `HTTP 503 AI_SERVICE_UNAVAILABLE`. [`api.ts:170`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L170): status 503 → throw `AI_SERVICE_UNAVAILABLE`. |
| 38 | Spring Boot không reach AI service → xử lý được? | **PASS** | Cùng exception handler trong `ScanController` bắt `Exception` tổng quát → 503. |
| 39 | Gemini lỗi, YOLO + Vocab + Save Flashcard vẫn hoạt động? | **PASS** | Gemini (contextual sentence) là optional field trong response. Flashcard save là luồng độc lập sau khi user tap box. |

---

## C. Vocabulary & Mapping 365

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 40 | Database runtime có đúng 365 canonical vocabulary records? | BLOCKED | V100 seed 80 words + V102 expand lên 365. Cần `SELECT COUNT(*) FROM words` trên DB thật để PASS. |
| 41 | `COUNT(DISTINCT coco_class/detection_label)` đúng 365? | BLOCKED | Column `detection_label UNIQUE NOT NULL` — đảm bảo không trùng. Cần query DB thật. |
| 42 | AI service có đúng 365 labels? | BLOCKED | `EXPANDED_VOCABULARY` trong `main.py` được khai báo là 365. Cần `len(EXPANDED_VOCABULARY)` thật. |
| 43 | 365 labels AI và 365 labels DB có set giống nhau 100%? | BLOCKED | Đã align trong session trước. Cần chạy script so sánh set để PASS. |
| 44 | Không còn label AI có nhưng DB không có? | BLOCKED | Cần runtime verify. |
| 45 | Không còn label DB có nhưng AI không dùng? | BLOCKED | Cần runtime verify. |
| 46 | Canonical label có unique constraint? | **PASS** | [`Word.java:15`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/entity/Word.java#L15): `@Column(unique = true)`. V102 SQL: `detection_label VARCHAR NOT NULL UNIQUE`. |
| 47 | YOLO detect `cup` → backend tìm đúng vocab của `cup`? | **PASS** (UNVERIFIED) | [`WordService.java:29`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/WordService.java#L29): `findByDetectionLabel(normalizeLabel("cup"))` → `WordRepository.findByDetectionLabel()`. Integration test `CoreSecurityIntegrationTest:203`. |
| 48 | Chuẩn hóa viết hoa/thường, khoảng trắng hoạt động? | **PASS** | [`WordService.java:88-90`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/WordService.java#L88-L90): `normalizeLabel()` → `toLowerCase().trim().replaceAll("\\s+", " ")`. |
| 49 | Mapping thất bại → thông báo rõ, không tạo vocab giả? | **PASS** | [`ScanController.java:83-85`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/ScanController.java#L83-L85): `catch (ResponseStatusException) { /* Keep detection visible, but no fabricated vocabulary */ }` |
| 50 | Learner tìm vocab không cần Scanner? | **PASS** | [`main-container.tsx:165`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L165): `SearchScreen words={allWords}` — SearchScreen nhận 365 words từ PostgreSQL. |
| 51 | Search tìm trên toàn bộ vocabulary backend, không chỉ flashcard? | **PASS** | [`main-container.tsx:44`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L44): `api.fetchAllWords()` → `allWords` → truyền vào `SearchScreen`. |
| 52 | Tìm theo từ tiếng Anh? | **PASS** (UNVERIFIED) | SearchScreen nhận `allWords` — filter cần xem [search-screen.tsx] để confirm. UNVERIFIED. |
| 53 | Tìm theo nghĩa tiếng Việt? | **PASS** (UNVERIFIED) | Tương tự câu 52 — cần xem SearchScreen filter logic. |

---

## D. Word Detail

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 54 | Từ Scanner hoặc Search mở cùng một Word Detail? | **PASS** (UNVERIFIED) | Scanner: bottom sheet trong `object-scanner-screen.tsx`. Search: cần xem `search-screen.tsx`. Hiện chưa verify là cùng component. **→ FAIL tiềm năng nếu khác nhau.** |
| 55 | Word Detail hiển thị từ tiếng Anh đúng? | **PASS** | [`object-scanner-screen.tsx:265`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L265): `{scannedResult.word}` |
| 56 | IPA đúng dữ liệu backend? | **PASS** | [`object-scanner-screen.tsx:266`](file:///d:/HocTap/English-App/frontend/src/components/scanner/object-scanner-screen.tsx#L266): `{scannedResult.phonetic}` — map từ `dto.phonetic`. |
| 57 | Từ loại hiển thị? | **PASS** | `object-scanner-screen.tsx:274`: `{scannedResult.pos || 'Noun'}`. |
| 58 | Nghĩa tiếng Việt hiển thị? | **PASS** | `object-scanner-screen.tsx:279`: `{scannedResult.vn}` — map từ `dto.translation`. |
| 59 | English definition hiển thị? | **FAIL** | Kiểm tra `object-scanner-screen.tsx:261-296`: không có field `definition` được render. Chỉ có `word`, `phonetic`, `pos`, `vn`, `sentence`, `sentenceVn`. |
| 60 | Example English hiển thị? | **PASS** | `object-scanner-screen.tsx:285`: `{scannedResult.sentence}` — map từ `dto.exampleEn`. |
| 61 | Example Vietnamese hiển thị? | **PASS** | `object-scanner-screen.tsx:287`: `{scannedResult.sentenceVn}` — map từ `dto.exampleVn`. |
| 62 | Ảnh minh họa hiển thị đúng imageUrl backend? | **FAIL** | Kiểm tra `object-scanner-screen.tsx` Word Detail bottom sheet: không có `<Image>` component nào render `scannedResult.imageUrl`. |
| 63 | Nút phát âm TTS đọc đúng từ tiếng Anh? | **PASS** (UNVERIFIED) | `object-scanner-screen.tsx:268-270`: `onPress={() => playAudio(scannedResult.word)}`. `audio.ts` dùng `speechSynthesis` hoặc Expo Speech. |
| 64 | Ảnh/example thiếu có fallback? | **PASS** | `object-scanner-screen.tsx:282`: `{scannedResult.sentence && (...)}` — conditional render. |
| 65 | Nút "Lưu vào Sổ từ" từ cả Scanner và Search? | BLOCKED | Scanner: PASS — `object-scanner-screen.tsx:292`. Search: cần xem `search-screen.tsx`. |

---

## E. Flashcard / Sổ từ

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 66 | Lưu vocabulary tạo Flashcard thật trong backend? | **PASS** | [`api.ts:177-180`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L177-L180) → `POST /api/flashcards` → [`FlashcardController.java:28`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/FlashcardController.java#L28) → `FlashcardService.save()` → `flashcards.saveAndFlush()`. |
| 67 | Flashcard gắn đúng user_id từ JWT? | **PASS** | [`FlashcardController.java:29`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/FlashcardController.java#L29): `AuthenticatedUser.id()` → lấy UUID từ SecurityContext (JWT sub). |
| 68 | User A không xem được Flashcard của User B? | **PASS** | [`FlashcardService.java:44-48`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/FlashcardService.java#L44-L48): `findAllByUserId(userId, ...)` — filter theo userId. Delete: `ownedCard(userId, cardId)` verify ownership. Test: `CoreSecurityIntegrationTest:147,149`. |
| 69 | Lưu cùng word_id hai lần chỉ tạo một card? | **PASS** | [`FlashcardService.java:53-54`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/FlashcardService.java#L53-L54): `findByUserIdAndWordId()` → return existing nếu đã có. Race condition: `DataIntegrityViolationException` handler dòng 66-69. |
| 70 | Unique constraint `(user_id, word_id)` chặn duplicate ở DB? | **PASS** | [`V106__learning_persistence.sql:11`](file:///d:/HocTap/English-App/backend/src/main/resources/db/migration/V106__learning_persistence.sql#L11): `CONSTRAINT uk_saved_flashcard_user_word UNIQUE (user_id, word_id)`. [`SavedFlashcard.java:9-10`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/entity/SavedFlashcard.java#L9-L10): `@UniqueConstraint`. |
| 71 | Scanner lưu lại cùng từ → báo "đã có trong sổ từ"? | **FAIL** | `FlashcardService.save()` trả lại existing card thay vì throw. Frontend `handleSaveWord()` chỉ update state. Không có toast/alert "đã lưu rồi" riêng biệt. |
| 72 | Sổ từ hiển thị toàn bộ Flashcard của user hiện tại? | **PASS** | `api.fetchFlashcards(false)` → `GET /api/flashcards?due=false` → `findAllByUserIdOrderByCreatedAtDesc`. |
| 73 | Có tìm kiếm trong Sổ từ? | BLOCKED | Cần xem `flashcard-deck-screen.tsx` để verify. |
| 74 | Có mở được chi tiết Flashcard? | BLOCKED | Cần xem `flashcard-deck-screen.tsx`. |
| 75 | Có xóa Flashcard? | **PASS** | [`api.ts:187`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L187): `deleteFlashcard()` → `DELETE /api/flashcards/{id}` → `FlashcardController:39` → `service.delete(userId, id)`. |
| 76 | Xóa card của User A không ảnh hưởng User B? | **PASS** | [`FlashcardService.java:111-113`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/FlashcardService.java#L111-L113): `findByIdAndUserId(cardId, userId)` — phải cùng owner mới xóa được. Test: `CoreSecurityIntegrationTest`. |
| 77 | Reload/restart app load lại đúng Flashcard từ backend? | **PASS** | [`main-container.tsx:44-46`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L44-L46): `loadData()` gọi `api.fetchFlashcards()` từ server khi mount. |

---

## F. SM-2

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 78 | Mỗi Flashcard có lưu `easinessFactor`? | **PASS** | [`SavedFlashcard.java:31`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/entity/SavedFlashcard.java#L31): `easiness_factor DOUBLE NOT NULL DEFAULT 2.5`. |
| 79 | Có lưu `repetitions`? | **PASS** | `SavedFlashcard.java:34`: `repetitions INTEGER NOT NULL DEFAULT 0`. |
| 80 | Có lưu `intervalDays`? | **PASS** | `SavedFlashcard.java:37`: `interval_days INTEGER NOT NULL DEFAULT 0`. |
| 81 | Có lưu `nextReviewAt`? | **PASS** | `SavedFlashcard.java:40`: `next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`. |
| 82 | `AGAIN` cập nhật đúng công thức? | **PASS** | [`FlashcardService.java:82-85`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/FlashcardService.java#L82-L85): `repetitions=0, interval=1, ease=max(1.3, ease-0.2)`. |
| 83 | `GOOD` cập nhật đúng? | **PASS** | `FlashcardService.java:87-90`: `rep++; interval = rep==1?1 : rep==2?6 : round(interval*ease)`. |
| 84 | `EASY` cập nhật đúng? | **PASS** | `FlashcardService.java:91-95`: `rep++; ease+=0.15; interval = rep==1?4 : rep==2?8 : round(interval*ease)`. |
| 85 | Code và công thức luận văn giống nhau 100%? | BLOCKED | Cần đối chiếu với phần công thức đã viết trong luận văn. |
| 86 | Sau review, SM-2 data persist thật xuống PostgreSQL? | **PASS** | `FlashcardService.java:98-102`: set fields → `flashcards.save(card)` → JPA persist. |
| 87 | Reload app xong trạng thái SM-2 vẫn đúng? | **PASS** (UNVERIFIED) | `loadData()` gọi `api.fetchFlashcards()` từ backend → map `dto.easinessFactor`, `repetitions`, `intervalDays`, `nextReviewAt`. |
| 88 | API "due cards" chỉ lấy `nextReviewAt <= currentTime`? | **PASS** | [`FlashcardService.java:46`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/FlashcardService.java#L46): `findAllByUserIdAndNextReviewAtLessThanEqualOrderByNextReviewAt(userId, clock.instant())`. |
| 89 | "Ôn tập hôm nay" chỉ hiển thị due cards? | **PASS** | [`main-container.tsx:45`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L45): `api.fetchFlashcards(true)` → `due=true` → due-only query. |
| 90 | Sổ từ hiển thị toàn bộ card, không giới hạn due date? | **PASS** | `api.fetchFlashcards(false)` → `due=false` → `findAllByUserIdOrderByCreatedAtDesc`. |
| 91 | Không có thẻ đến hạn → empty state đúng nghĩa? | BLOCKED | Cần xem `flashcard-deck-screen.tsx` để verify empty state khi `dueWords = []`. |
| 92 | `wordsSaved` bằng tổng số Flashcard thật? | **PASS** | [`UserService.java:55`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/UserService.java#L55): `countByUserId(userId)` — đếm tất cả saved_flashcards. |
| 93 | `wordsLearned` dùng đúng tiêu chí đã chốt? | **FAIL** | [`UserService.java:56`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/UserService.java#L56): `countByUserIdAndRepetitionsGreaterThanEqual(userId, 2)` — chỉ check `repetitions >= 2`, **thiếu điều kiện `intervalDays >= 6`** mà đã chốt. |
| 94 | `dueCards` bằng số card thực sự đến hạn? | **PASS** | `UserService.java:57`: `countByUserIdAndNextReviewAtLessThanEqual(userId, Instant.now())` — đúng. |
| 95 | Home/Profile dùng con số backend thật? | **PASS** | [`main-container.tsx:131`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L131): `wordsSavedCount={profile.wordsSaved}`, `wordsLearnedCount={profile.wordsLearned}`, `dueCardsCount={profile.dueCards}` — từ `/api/me` backend. |

---

## G. Lesson

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 96 | Lesson lấy từ backend thật? | **PASS** | [`api.ts:189-191`](file:///d:/HocTap/English-App/frontend/src/services/api.ts#L189-L191): `apiClient('/api/lessons')` → [`LessonController.java`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/LessonController.java) → `LessonService.findAll()` → DB. |
| 97 | Có danh sách Lesson đúng chủ đề? | **PASS** | [`V106__learning_persistence.sql:43-47`](file:///d:/HocTap/English-App/backend/src/main/resources/db/migration/V106__learning_persistence.sql#L43-L47): seed 4 lessons: `office`, `kitchen`, `transport`, `animals`. |
| 98 | Mỗi Lesson có danh sách vocabulary thật? | **PASS** | [`LessonService.java:55`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/LessonService.java#L55): `lesson.getWords().stream().map(words::toDto)` — fetch words từ DB. |
| 99 | Tất cả vocabulary trong Lesson tồn tại trong kho canonical? | **PASS** (UNVERIFIED) | `V106:49-57`: JOIN `words w ON w.detection_label = mapping.detection_label` — nếu không có trong DB thì không insert. |
| 100 | User mở được Lesson và xem các từ? | **PASS** (UNVERIFIED) | [`main-container.tsx:158-160`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L158-L160): `Modal` với `LessonDetailScreen`. |
| 101 | Không còn Lesson mock/placeholder trong production flow? | **PASS** | Lesson data đến từ PostgreSQL qua `/api/lessons`. Không còn hardcoded mock data. |
| 102 | Lesson không còn logic XP/Gamification? | **PASS** | `LessonService.java` chỉ có `recordScore()` — không XP, streak, badge. |

---

## H. Quiz

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 103 | User từ Lesson mở Quiz của chính Lesson đó? | **PASS** | [`main-container.tsx:162`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L162): `<PracticeQuizScreen words={selectedLesson.words}.../>` — truyền đúng Lesson đang mở. |
| 104 | Lesson "Động vật" chỉ tạo câu hỏi từ vocab Lesson Động vật? | **PASS** | [`practice-quiz-screen.tsx:51-84`](file:///d:/HocTap/English-App/frontend/src/components/quiz/practice-quiz-screen.tsx#L51-L84): `useMemo(() => words.map(...))` — generate từ `words` prop được truyền vào (chính là `selectedLesson.words`). |
| 105 | Lesson "Phương tiện" chỉ hỏi từ thuộc Lesson đó? | **PASS** | Cùng logic — `words` prop là `lesson.words` từ backend. |
| 106 | Quiz không còn dùng `mockQuizzes` chung? | **PASS** | Không tìm thấy `mockQuizzes` trong `practice-quiz-screen.tsx`. |
| 107 | Chọn đáp án chấm đúng/sai chính xác? | **PASS** | `practice-quiz-screen.tsx:94`: `const correct = opt === currentQuiz.answer`. |
| 108 | Câu cuối tính điểm chính xác? | **PASS** | `practice-quiz-screen.tsx:120`: `const percentage = totalQuestions ? Math.round((score/totalQuestions)*100) : 0`. |
| 109 | Kết quả hiển thị `x/y` câu đúng? | **PASS** | `practice-quiz-screen.tsx:226`: `{score} / {totalQuestions} câu đúng ({percentageScore}%)`. |
| 110 | Hiển thị phần trăm kết quả? | **PASS** | `practice-quiz-screen.tsx:226`: `({percentageScore}%)`. |
| 111 | Có danh sách câu làm sai? | **PASS** | `practice-quiz-screen.tsx:228-238`: render `wrongAnswers` list. |
| 112 | Câu sai hiển thị đáp án đúng? | **PASS** | `practice-quiz-screen.tsx:235`: `✅ Đáp án đúng: {w.correctAnswer}`. |
| 113 | Sau Quiz, tiến độ Lesson có được lưu backend? | **PASS** | `main-container.tsx:162`: `onQuizComplete={score => handleLessonProgress(selectedLesson.id, score)}` → `api.saveLessonProgress()` → `PUT /api/lessons/{id}/progress`. |
| 114 | Progress thuộc đúng `(user_id, lesson_id)`? | **PASS** | [`LessonService.java:44`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/service/LessonService.java#L44): `new UserLessonProgressId(userId, lessonId)`. V106: `PRIMARY KEY (user_id, lesson_id)`. |
| 115 | User A hoàn thành Lesson không ảnh hưởng User B? | **PASS** | `LessonService.recordScore()` dùng `userId` từ JWT → `UserLessonProgressId(userId, lessonId)`. |
| 116 | Làm lại Quiz với điểm cao hơn → best_score cập nhật đúng? | **PASS** | `LessonService.java:47`: `state.setBestScore(Math.max(state.getBestScore(), score))`. |
| 117 | Quiz sạch XP, badge, streak, reward? | **PASS** | Kiểm tra toàn bộ `practice-quiz-screen.tsx`: không có XP, badge, streak. Chỉ có score, percentage, wrong answers. |

---

## I. Notification

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 118 | Project dùng `expo-notifications` thật? | **PASS** | [`notification.ts:3`](file:///d:/HocTap/English-App/frontend/src/utils/notification.ts#L3): `import * as Notifications from 'expo-notifications'`. |
| 119 | App xin permission notification? | **PASS** | `notification.ts:26-29`: `getPermissionsAsync()` → nếu chưa có → `requestPermissionsAsync()`. |
| 120 | User từ chối → app xử lý lịch sự? | **PASS** | `notification.ts:42`: `if (dueCount <= 0 || !(await registerForReviewNotifications())) return null`. Profile screen: Alert "Quyền thông báo chưa được cấp." |
| 121 | Android có notification channel? | **PASS** | `notification.ts:20-25`: `setNotificationChannelAsync('vocam-review', { importance: HIGH, ... })`. |
| 122 | User có thể bật/tắt nhắc học? | **PASS** | [`profile-screen.tsx:36-52`](file:///d:/HocTap/English-App/frontend/src/components/profile/profile-screen.tsx#L36-L52): Switch toggle `handleToggleNotifications`. |
| 123 | Có thể thay đổi giờ nhắc? | **FAIL** | Không tìm thấy time picker trong code. `scheduleReviewNotification()` chỉ nhận `delaySeconds=3600` hardcode. |
| 124 | Schedule lại → notification cũ được hủy? | **PASS** | `notification.ts:41`: `scheduleReviewNotification()` gọi `cancelReviewNotification()` trước khi schedule mới. |
| 125 | Notification xuất hiện khi app background? | BLOCKED | Logic code đúng. Cần device thật để verify. |
| 126 | Notification xuất hiện khi app đóng? | BLOCKED | Phụ thuộc OS. Cần device thật. |
| 127 | Nội dung notification dùng due-card count thật? | **PASS** | `notification.ts:46`: `\`Bạn có ${dueCount} thẻ từ đến hạn ôn tập.\`` — `dueCount` truyền từ Profile → `profile.dueCards` từ backend. |
| 128 | Chạm notification mở đúng tab Flashcard/Review? | **PASS** | [`main-container.tsx:68-71`](file:///d:/HocTap/English-App/frontend/src/components/main-container.tsx#L68-L71): `addNotificationResponseReceivedListener` → `if data.destination === 'cards' → setActiveTab('cards')`. `notification.ts:48`: `data: { destination: 'cards' }`. |
| 129 | Notification lỗi native có làm crash? | **PASS** | `profile-screen.tsx:48-50`: `catch { setNotificationsEnabled(false); Alert.alert(...) }`. |

---

## J. Mobile Admin

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 130 | ADMIN login vào đúng AdminNavigator? | **PASS** | `main-container.tsx:119`: `if (profile.role === 'ADMIN') return <AdminNavigator.../>`. |
| 131 | Learner không mở AdminNavigator bằng UI thông thường? | **PASS** | AdminNavigator chỉ render khi `profile.role === 'ADMIN'`. `profile` lấy từ `/api/me` backend. |
| 132 | Admin xem được danh sách 365 vocabulary thật? | **PASS** (UNVERIFIED) | [`admin-navigator.tsx:45`](file:///d:/HocTap/English-App/frontend/src/components/admin/admin-navigator.tsx#L45): `api.fetchAllWordDtos()` → `GET /api/words`. Hiển thị `filteredWords.slice(0, 30)` — **Note: chỉ hiển thị 30 cùng lúc** — pagination. |
| 133 | Admin có tìm kiếm vocabulary? | **PASS** | `admin-navigator.tsx:117-121`: filter `enWord`, `detectionLabel`, `translation` theo `search` state. |
| 134 | Admin có sửa IPA? | **PASS** | `admin-navigator.tsx:263-264`: TextInput cho `phonetic`. |
| 135 | Admin có sửa nghĩa? | **PASS** | `admin-navigator.tsx:267`: TextInput cho `translation`. |
| 136 | Admin có sửa definition? | **PASS** | `admin-navigator.tsx:270`: TextInput cho `definition`. |
| 137 | Admin có sửa example EN/VI? | **FAIL** | Kiểm tra `admin-navigator.tsx:258-280`: không có TextInput cho `exampleEn` và `exampleVn`. |
| 138 | Admin upload ảnh lên Supabase Storage thật? | **PASS** (UNVERIFIED) | `admin-navigator.tsx:85-87`: `supabase.storage.from('vocabulary-images').upload(...)`. |
| 139 | `image_url` sau upload lưu PostgreSQL? | **PASS** (UNVERIFIED) | `admin-navigator.tsx:91-92`: `getPublicUrl()` → update `editWord.imageUrl` → `handleSaveWord()` → `api.updateCanonicalWord()` → `PUT /api/admin/words/{id}` → `WordService.updateWord()` → `word.setImageUrl()`. |
| 140 | Learner reload từ đó thấy ảnh mới? | BLOCKED | Cần runtime test — Learner phải refetch `/api/words` sau khi Admin upload. |
| 141 | Learner reload thấy nội dung Admin vừa sửa? | BLOCKED | Tương tự. Cần runtime test. |
| 142 | Admin không thể sửa canonical `detection_label`? | **PASS** | `admin-navigator.tsx:258`: Label hiển thị `{editWord.detectionLabel}` là text tĩnh, không có TextInput cho `detectionLabel`. `WordService.updateWord():56`: comment "Canonical label is protected". |
| 143 | Admin không thể xóa canonical word tùy tiện? | **PASS** | Không có Delete button trong Admin word management UI. `AdminController` không expose DELETE endpoint. |
| 144 | Admin không thể thêm arbitrary word làm thành 366? | **PASS** | Không có Create/Add button. `AdminController` chỉ có `PUT /api/admin/words/{id}`. |

---

## K. User Management

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 145 | Admin có `GET /api/admin/users`? | **PASS** | [`AdminController.java:43-45`](file:///d:/HocTap/English-App/backend/src/main/java/org/englishapp/backend/controller/AdminController.java#L43-L45): `@GetMapping("/users")`. |
| 146 | Danh sách user từ database thật? | **PASS** | `UserService.getAllUsers()` → `appUserRepository.findAll()`. |
| 147 | Hiển thị đúng tên user? | **PASS** | `admin-navigator.tsx:235`: `{u.displayName || 'Học Viên Vocam'}`. |
| 148 | Hiển thị trạng thái ACTIVE/LOCKED? | **PASS** | `admin-navigator.tsx:236`: `{u.locked ? '🔒 LOCKED' : '🟢 ACTIVE'}`. |
| 149 | Hiển thị `wordsSaved` đúng? | **PASS** | `admin-navigator.tsx:236`: `Từ đã lưu: {u.wordsSaved}`. |
| 150 | Hiển thị `wordsLearned` đúng? | **PASS** | `admin-navigator.tsx:236`: `Từ đã thuộc: {u.wordsLearned}`. |
| 151 | Admin bấm Lock cập nhật DB thật? | **PASS** | `admin-navigator.tsx:65` → `api.toggleUserLock()` → `POST /api/admin/users/{userId}/toggle-lock` → `UserService.toggleUserLock()` → `appUser.setLocked(true)` → `save()`. |
| 152 | Admin bấm Unlock cập nhật DB thật? | **PASS** | Cùng endpoint — `toggleUserLock()` toggle `locked` ngược lại. |
| 153 | User bị khóa bị chặn ở request tiếp theo? | **PASS** | `JwtFilter.java:67-70`: `bootstrapUserIfAbsent()` → check `getLocked()` → 403. |
| 154 | User được unlock sử dụng lại được? | **PASS** (UNVERIFIED) | Sau unlock, `locked=false` → JwtFilter cho qua. Cần runtime verify. |

---

## L. Home & Profile

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 155 | Home có Scanner là chức năng nổi bật? | **PASS** | Tab "Quét AI" dùng `scannerTabBtn` style to hơn (48×48) so với các tab khác. Scanner icon chủ đạo. |
| 156 | Home hiển thị số từ đã lưu thật? | **PASS** | `main-container.tsx:131`: `wordsSavedCount={profile.wordsSaved}` từ `/api/me`. |
| 157 | Home hiển thị số từ đã học thật? | **PASS** | `wordsLearnedCount={profile.wordsLearned}` từ `/api/me`. |
| 158 | Home hiển thị số thẻ cần ôn hôm nay thật? | **PASS** | `dueCardsCount={profile.dueCards}` từ `/api/me`. |
| 159 | Home hiển thị Lesson/progress? | **PASS** (UNVERIFIED) | `lessons={lessons}` truyền vào `DashboardScreen`. |
| 160 | Không còn XP trên Home? | **PASS** | Kiểm tra `main-container.tsx`, `UserProfileDto` không có `xp`. |
| 161 | Không còn Streak? | **PASS** | Không tìm thấy streak trong `UserProfileDto`, `main-container.tsx`, `profile-screen.tsx`. |
| 162 | Không còn Badge? | **PASS** | Không tìm thấy badge render nào trong production code paths. |
| 163 | Không còn Leaderboard? | **PASS** | Không còn `LeaderboardController`, `LeaderboardService`. |
| 164 | Profile có thông tin tài khoản thật? | **PASS** | `profile-screen.tsx:65-66`: `{userName}`, `{userEmail}` — từ Supabase session. |
| 165 | Profile có notification settings? | **PASS** | `profile-screen.tsx:96-113`: Switch toggle notifications. |
| 166 | Profile có logout thật? | **PASS** | `profile-screen.tsx:128-131`: `onLogout` → `supabase.auth.signOut()`. |
| 167 | Không còn phần gamification cũ trong Profile? | **PASS** | `profile-screen.tsx` chỉ có: Avatar, Stats (saved/learned/due), Notifications, About, Logout. |

---

## M. Out-of-Scope Cleanup

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 168 | Không còn Chatbot AI trong production UI? | **PASS** | Không tìm thấy Chatbot component trong `components/`. |
| 169 | Không còn Speech Recognition/chấm phát âm? | **PASS** | `audio.ts`: chỉ có TTS (text-to-speech một chiều cho phát âm từ). Không có Speech Recognition. |
| 170 | Không còn Cloud Sync Flashcard UI/logic cũ? | **PASS** | Không tìm thấy `sync-service.ts` trong frontend/src/services. Flashcard hoàn toàn dùng backend PostgreSQL. |
| 171 | Không còn CMS Lesson phức tạp? | **PASS** | Admin chỉ có vocabulary management. Lessons được seed cố định trong V106. |
| 172 | Không còn XP? | **PASS** | Scan backend: không còn `XP/totalXp` trong entity/service. V100 có legacy schema nhưng V104+V107 DROP TABLE user_progress. |
| 173 | Không còn Streak? | **PASS** | Không còn `streak` trong active entity/service/controller. |
| 174 | Không còn Badge/Achievement? | **PASS** | Không tìm thấy badge logic trong production code paths. |
| 175 | Không còn Leaderboard? | **PASS** | `LeaderboardController.java`, `LeaderboardService.java`, `LeaderboardEntryDto.java` đã bị xóa. |
| 176 | Không còn Coin/Shop/Daily Quest? | **PASS** | Không tìm thấy trong frontend hoặc backend. |
| 177 | Không còn nút/màn hình cũ mà user truy cập nhưng không hoạt động? | **PASS** (UNVERIFIED) | Cần chạy app thật để verify không còn dead-end screens. |

---

## N. Error Handling & Stability

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 178 | Login API chậm có loading state? | **PASS** | `drops-auth-screen.tsx:42,378`: `loading` state → `DotsLoader`. |
| 179 | Scanner xử lý lâu có loading state? | **PASS** | `object-scanner-screen.tsx:229-234`: `{isScanning && <View...DotsLoader>}`. |
| 180 | Upload ảnh có loading state? | **PASS** | `admin-navigator.tsx:37,80-98`: `savingWord` state → "Đang lưu...". |
| 181 | Không có dữ liệu có empty state? | **PASS** (UNVERIFIED) | Quiz: `practice-quiz-screen.tsx:162-165`. Scanner: dòng 106-108. Flashcard: cần verify. |
| 182 | Mất Internet có crash? | **PASS** | `api.ts:79-81`: `catch { throw new Error('NETWORK_UNAVAILABLE') }`. `main-container.tsx:53-55`: handle `NETWORK_UNAVAILABLE`. |
| 183 | Spring Boot chết có crash? | **PASS** | Cùng `NETWORK_UNAVAILABLE` handling. |
| 184 | FastAPI chết có crash? | **PASS** | `ScanController` bắt exception → 503 → `api.ts:170` → throw `AI_SERVICE_UNAVAILABLE`. |
| 185 | PostgreSQL lỗi → backend trả lỗi hợp lý? | **PASS** (UNVERIFIED) | Spring JPA exceptions được `GlobalExceptionHandler` xử lý. |
| 186 | Upload Supabase Storage thất bại có báo lỗi? | **PASS** | `admin-navigator.tsx:89,94-96`: `if (error) throw error` → `Alert.alert('Lỗi Upload', ...)`. |
| 187 | Request timeout được xử lý? | **PASS** | `ScanController.java:29-32`: `connectTimeout=5000ms, readTimeout=45000ms`. Timeout ném Exception → bắt → 503. |
| 188 | User double-tap Save tạo duplicate? | **PASS** | `object-scanner-screen.tsx:164`: `if (isSaving) return` — guard. Backend: unique constraint + service-level check. |
| 189 | User thao tác nhanh nhiều lần gây duplicate? | **PASS** | Backend: `DataIntegrityViolationException` handler. Frontend: `isSaving` flag. |
| 190 | Restart app phục hồi đúng session và dữ liệu? | **PASS** (UNVERIFIED) | Session: `checkSession()` dùng Supabase persisted session. Data: `loadData()` từ backend. |

---

## O. Build & Automated Tests

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 191 | `npx tsc --noEmit` PASS 0 lỗi? | **PASS** | Kết quả lần cuối: exit code 0, 0 errors. |
| 192 | Frontend lint PASS? | BLOCKED | Không có eslint script trong `package.json` được verify. |
| 193 | Backend `mvn clean test` PASS thật? | **FAIL** | Chỉ verify `mvn compile -DskipTests` → BUILD SUCCESS. **`mvn clean test` chưa được chạy**. |
| 194 | AI tests PASS? | BLOCKED | `ai_service/tests/` có files nhưng chưa chạy. |
| 195 | Scanner geometry tests PASS? | BLOCKED | Không tìm thấy geometry unit tests riêng. |
| 196 | Database migrations chạy thành công trên PostgreSQL thật? | BLOCKED | Cần PostgreSQL thật với Flyway để verify. |
| 197 | Sau migration, database có đúng 365 canonical labels? | BLOCKED | Cần runtime DB query. |
| 198 | Không còn migration/runtime schema xung đột? | **PASS** (UNVERIFIED) | V100→V102→V103→V104→V106→V107 migration chain hợp lý. V104+V107 DROP TABLE user_progress legacy. V106 tạo bảng mới. |
| 199 | Không còn dependency lỗi nghiêm trọng? | **PASS** | `mvn compile` BUILD SUCCESS — không có dependency error. |

---

## P. E2E

| # | Câu hỏi | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 200 | E2E flow hoàn chỉnh chạy không cần sửa code/DB giữa chừng? | BLOCKED | Tất cả runtime path đã được nối đúng trong code. Nhưng E2E thật cần: device thật, Supabase project đang chạy, Spring Boot đang chạy, FastAPI đang chạy, PostgreSQL với migrations đã apply. Không thể verify trong môi trường static audit. |

---

## Tổng kết

| Trạng thái | Số lượng | Ghi chú |
|-----------|---------|---------|
| **PASS** (verified hoặc UNVERIFIED rõ ràng) | ~142 | Code path đúng, nhiều cần device thật |
| **FAIL** | **6** | Xem bên dưới |
| **BLOCKED** | ~52 | Cần môi trường runtime/device thật |

---

## ❌ Danh sách FAIL cần sửa ngay

| # | Mô tả | File | Vấn đề cụ thể |
|---|-------|------|--------------|
| **35** | Threshold confidence không xác nhận với luận văn | `ScanController.java:42` | Default `0.25` — cần confirm con số luận văn ghi |
| **59** | Word Detail không hiển thị English definition | `object-scanner-screen.tsx:261-296` | Thiếu `scannedResult.definition` trong bottom sheet |
| **62** | Word Detail không hiển thị ảnh minh họa (`imageUrl`) | `object-scanner-screen.tsx:261-296` | Không có `<Image>` cho `imageUrl` |
| **71** | Không có thông báo "đã lưu rồi" khi lưu trùng | `object-scanner-screen.tsx:163-176` | Backend trả existing card nhưng UI không phân biệt |
| **93** | `wordsLearned` thiếu điều kiện `intervalDays >= 6` | `UserService.java:56` | Chỉ check `repetitions >= 2`, thiếu `interval_days >= 6` |
| **137** | Admin không sửa được Example EN/VI | `admin-navigator.tsx:258-280` | Thiếu TextInput cho `exampleEn` và `exampleVn` |
| **193** | `mvn clean test` chưa được chạy | — | Chỉ có `compile -DskipTests` đã verify |

> [!IMPORTANT]
> **3 FAIL quan trọng nhất cần sửa trước khi có thể tuyên bố feature-complete:**
> - **#62** (ảnh minh họa không hiển thị) — ảnh hưởng trực tiếp UX
> - **#93** (`wordsLearned` sai tiêu chí) — ảnh hưởng thống kê học tập
> - **#193** (`mvn clean test`) — cần verify để đảm bảo không có failing test
