-- ============================================================
-- V112: Expand educational lessons with natural, beginner-friendly topics and full vocabulary mapping
-- Topics: Giao tiếp hàng ngày, Đi làm & Công việc, Trường học & Học tập, Đời sống & Gia đình, Du lịch & Giao thông
-- ============================================================

DELETE FROM lesson_words;
DELETE FROM user_lesson_progress;
DELETE FROM lessons;

INSERT INTO lessons (id, name, description, difficulty, category, icon) VALUES
('daily-essentials', 'Vật dụng cá nhân hàng ngày', 'Các đồ dùng thiết yếu luôn mang theo bên mình khi ra ngoài.', 'Sơ cấp', 'Giao tiếp hàng ngày', 'coffee'),
('daily-shopping', 'Mua sắm & Đi chợ', 'Từ vựng thông dụng khi đi siêu thị, mua thực phẩm và thanh toán.', 'Sơ cấp', 'Giao tiếp hàng ngày', 'shopping-cart'),
('office-tech', 'Thiết bị & Công nghệ văn phòng', 'Các thiết bị công nghệ quen thuộc trên bàn làm việc của dân văn phòng.', 'Trung cấp', 'Đi làm & Công việc', 'monitor'),
('office-workspace', 'Phòng họp & Đồ dùng công sở', 'Vật dụng nội thất và thiết bị trong phòng họp, nơi làm việc.', 'Sơ cấp', 'Đi làm & Công việc', 'briefcase'),
('school-supplies', 'Đồ dùng học tập của học sinh', 'Các dụng cụ không thể thiếu trong cặp sách đến trường.', 'Sơ cấp', 'Trường học & Học tập', 'book-open'),
('school-sports', 'Thể thao & Hoạt động thể chất', 'Các môn thể thao và dụng cụ rèn luyện sức khỏe ở trường học.', 'Trung cấp', 'Trường học & Học tập', 'activity'),
('kitchen-cooking', 'Nấu ăn & Đồ dùng nhà bếp', 'Vật dụng nấu nướng và thiết bị gia dụng quen thuộc trong căn bếp.', 'Sơ cấp', 'Đời sống & Gia đình', 'pie-chart'),
('living-room', 'Phòng khách & Thư giãn tại nhà', 'Nội thất và đồ dùng tạo không gian ấm cúng cho gia đình.', 'Sơ cấp', 'Đời sống & Gia đình', 'home'),
('city-transport', 'Phương tiện trong thành phố', 'Các phương tiện giao thông đường phố hàng ngày.', 'Sơ cấp', 'Du lịch & Giao thông', 'navigation'),
('travel-journey', 'Du lịch & Chuyến đi xa', 'Từ vựng cho những chuyến hành trình du lịch, công tác.', 'Trung cấp', 'Du lịch & Giao thông', 'map-pin');

INSERT INTO lesson_words (lesson_id, word_id, position)
SELECT mapping.lesson_id, w.id, mapping.position
FROM (VALUES
    ('daily-essentials', 'cell phone', 0),
    ('daily-essentials', 'key', 1),
    ('daily-essentials', 'umbrella', 2),
    ('daily-essentials', 'watch', 3),
    ('daily-essentials', 'bottle', 4),

    ('daily-shopping', 'trolley', 0),
    ('daily-shopping', 'wallet/purse', 1),
    ('daily-shopping', 'basket', 2),
    ('daily-shopping', 'apple', 3),
    ('daily-shopping', 'bread', 4),

    ('office-tech', 'laptop', 0),
    ('office-tech', 'mouse', 1),
    ('office-tech', 'keyboard', 2),
    ('office-tech', 'printer', 3),
    ('office-tech', 'projector', 4),
    ('office-tech', 'power outlet', 5),

    ('office-workspace', 'chair', 0),
    ('office-workspace', 'dining table', 1),
    ('office-workspace', 'briefcase', 2),
    ('office-workspace', 'notepaper', 3),
    ('office-workspace', 'blackboard/whiteboard', 4),

    ('school-supplies', 'backpack', 0),
    ('school-supplies', 'pen/pencil', 1),
    ('school-supplies', 'book', 2),
    ('school-supplies', 'scissors', 3),
    ('school-supplies', 'tape measure/ruler', 4),
    ('school-supplies', 'board eraser', 5),

    ('school-sports', 'other balls', 0),
    ('school-sports', 'soccer', 1),
    ('school-sports', 'baseball', 2),
    ('school-sports', 'tennis', 3),
    ('school-sports', 'table tennis', 4),

    ('kitchen-cooking', 'gas stove', 0),
    ('kitchen-cooking', 'cutting/chopping board', 1),
    ('kitchen-cooking', 'bowl/basin', 2),
    ('kitchen-cooking', 'refrigerator', 3),
    ('kitchen-cooking', 'microwave', 4),

    ('living-room', 'couch', 0),
    ('living-room', 'monitor/tv', 1),
    ('living-room', 'clock', 2),
    ('living-room', 'coffee table', 3),
    ('living-room', 'picture/frame', 4),

    ('city-transport', 'bus', 0),
    ('city-transport', 'car', 1),
    ('city-transport', 'motorcycle', 2),
    ('city-transport', 'bicycle', 3),
    ('city-transport', 'traffic light', 4),

    ('travel-journey', 'airplane', 0),
    ('travel-journey', 'train', 1),
    ('travel-journey', 'boat', 2),
    ('travel-journey', 'luggage', 3),
    ('travel-journey', 'helmet', 4)
) AS mapping(lesson_id, detection_label, position)
JOIN words w ON w.detection_label = mapping.detection_label;
