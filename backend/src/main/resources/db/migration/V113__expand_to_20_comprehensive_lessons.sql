-- ============================================================
-- V113: Expand to 20 comprehensive educational lessons (4 per category)
-- Eliminates empty whitespace and gives rich, balanced content across all tabs
-- ============================================================

DELETE FROM lesson_words;
DELETE FROM user_lesson_progress;
DELETE FROM lessons;

INSERT INTO lessons (id, name, description, difficulty, category, icon) VALUES
-- 1. Giao tiếp hàng ngày (4 bài)
('daily-essentials', 'Vật dụng cá nhân hàng ngày', 'Các đồ dùng thiết yếu luôn mang theo bên mình khi ra ngoài.', 'Sơ cấp', 'Giao tiếp hàng ngày', 'coffee'),
('daily-shopping', 'Mua sắm & Đi chợ', 'Từ vựng thông dụng khi đi siêu thị, mua thực phẩm và thanh toán.', 'Sơ cấp', 'Giao tiếp hàng ngày', 'shopping-cart'),
('daily-food', 'Đồ ăn & Đồ uống thông dụng', 'Các món ăn nhẹ, trái cây và đồ uống quen thuộc trong ngày.', 'Sơ cấp', 'Giao tiếp hàng ngày', 'coffee'),
('daily-accessories', 'Trang phục & Phụ kiện dạo phố', 'Quần áo, phụ kiện và giày dép thường ngày khi ra ngoài.', 'Trung cấp', 'Giao tiếp hàng ngày', 'shopping-bag'),

-- 2. Đi làm & Công việc (4 bài)
('office-tech', 'Thiết bị & Công nghệ văn phòng', 'Các thiết bị công nghệ quen thuộc trên bàn làm việc của dân văn phòng.', 'Trung cấp', 'Đi làm & Công việc', 'monitor'),
('office-workspace', 'Phòng họp & Đồ dùng công sở', 'Vật dụng nội thất và thiết bị trong phòng họp, nơi làm việc.', 'Sơ cấp', 'Đi làm & Công việc', 'briefcase'),
('office-devices', 'Thiết bị liên lạc & Âm thanh', 'Các thiết bị hỗ trợ họp từ xa, gọi điện và thuyết trình.', 'Trung cấp', 'Đi làm & Công việc', 'phone'),
('office-materials', 'Giấy tờ & Tài liệu văn phòng', 'Hồ sơ, tài liệu và văn phòng phẩm không thể thiếu khi làm việc.', 'Sơ cấp', 'Đi làm & Công việc', 'file-text'),

-- 3. Trường học & Học tập (4 bài)
('school-supplies', 'Đồ dùng học tập của học sinh', 'Các dụng cụ không thể thiếu trong cặp sách đến trường.', 'Sơ cấp', 'Trường học & Học tập', 'book-open'),
('school-sports', 'Thể thao & Hoạt động thể chất', 'Các môn thể thao và dụng cụ rèn luyện sức khỏe ở trường học.', 'Trung cấp', 'Trường học & Học tập', 'activity'),
('school-classroom', 'Lớp học & Giảng đường', 'Bàn ghế, bảng viết và cơ sở vật chất lớp học tiêu chuẩn.', 'Sơ cấp', 'Trường học & Học tập', 'home'),
('school-activities', 'Ngoại khóa & Thể thao đường phố', 'Dụng cụ vận động ngoài trời và hoạt động vui chơi giải trí.', 'Trung cấp', 'Trường học & Học tập', 'award'),

-- 4. Đời sống & Gia đình (4 bài)
('kitchen-cooking', 'Nấu ăn & Đồ dùng nhà bếp', 'Vật dụng nấu nướng và thiết bị gia dụng quen thuộc trong căn bếp.', 'Sơ cấp', 'Đời sống & Gia đình', 'pie-chart'),
('living-room', 'Phòng khách & Thư giãn tại nhà', 'Nội thất và đồ dùng tạo không gian ấm cúng cho gia đình.', 'Sơ cấp', 'Đời sống & Gia đình', 'home'),
('home-dining', 'Bàn ăn & Bữa cơm gia đình', 'Bát đĩa, ly tách và không gian dùng bữa đầm ấm bên người thân.', 'Sơ cấp', 'Đời sống & Gia đình', 'coffee'),
('home-care', 'Đồ dùng cá nhân & Chăm sóc gia đình', 'Vật dụng phòng ngủ, phòng tắm và đồ trang trí trong nhà.', 'Trung cấp', 'Đời sống & Gia đình', 'heart'),

-- 5. Du lịch & Giao thông (4 bài)
('city-transport', 'Phương tiện trong thành phố', 'Các phương tiện giao thông đường phố hàng ngày.', 'Sơ cấp', 'Du lịch & Giao thông', 'navigation'),
('travel-journey', 'Du lịch & Chuyến đi xa', 'Từ vựng cho những chuyến hành trình du lịch, công tác.', 'Trung cấp', 'Du lịch & Giao thông', 'map-pin'),
('travel-street', 'Biển báo & Giao thông đường bộ', 'Hệ thống đèn đường, biển báo và quy tắc giao thông an toàn.', 'Sơ cấp', 'Du lịch & Giao thông', 'alert-circle'),
('travel-accessories', 'Hành lý & Vật dụng đi du lịch', 'Các món đồ cần chuẩn bị trước khi lên đường khám phá.', 'Trung cấp', 'Du lịch & Giao thông', 'briefcase');

INSERT INTO lesson_words (lesson_id, word_id, position)
SELECT mapping.lesson_id, w.id, mapping.position
FROM (VALUES
    -- 1. daily-essentials
    ('daily-essentials', 'cell phone', 0),
    ('daily-essentials', 'key', 1),
    ('daily-essentials', 'umbrella', 2),
    ('daily-essentials', 'watch', 3),
    ('daily-essentials', 'bottle', 4),

    -- 2. daily-shopping
    ('daily-shopping', 'trolley', 0),
    ('daily-shopping', 'wallet/purse', 1),
    ('daily-shopping', 'basket', 2),
    ('daily-shopping', 'apple', 3),
    ('daily-shopping', 'bread', 4),

    -- 3. daily-food
    ('daily-food', 'cup', 0),
    ('daily-food', 'cake', 1),
    ('daily-food', 'banana', 2),
    ('daily-food', 'orange/tangerine', 3),
    ('daily-food', 'wine glass', 4),

    -- 4. daily-accessories
    ('daily-accessories', 'glasses', 0),
    ('daily-accessories', 'hat', 1),
    ('daily-accessories', 'tie', 2),
    ('daily-accessories', 'leather shoes', 3),
    ('daily-accessories', 'gloves', 4),

    -- 5. office-tech
    ('office-tech', 'laptop', 0),
    ('office-tech', 'mouse', 1),
    ('office-tech', 'keyboard', 2),
    ('office-tech', 'printer', 3),
    ('office-tech', 'projector', 4),
    ('office-tech', 'power outlet', 5),

    -- 6. office-workspace
    ('office-workspace', 'chair', 0),
    ('office-workspace', 'dining table', 1),
    ('office-workspace', 'briefcase', 2),
    ('office-workspace', 'notepaper', 3),
    ('office-workspace', 'blackboard/whiteboard', 4),

    -- 7. office-devices
    ('office-devices', 'telephone', 0),
    ('office-devices', 'microphone', 1),
    ('office-devices', 'speaker', 2),
    ('office-devices', 'monitor/tv', 3),

    -- 8. office-materials
    ('office-materials', 'book', 0),
    ('office-materials', 'pen/pencil', 1),
    ('office-materials', 'scissors', 2),
    ('office-materials', 'notepaper', 3),
    ('office-materials', 'briefcase', 4),

    -- 9. school-supplies
    ('school-supplies', 'backpack', 0),
    ('school-supplies', 'pen/pencil', 1),
    ('school-supplies', 'book', 2),
    ('school-supplies', 'scissors', 3),
    ('school-supplies', 'tape measure/ruler', 4),
    ('school-supplies', 'board eraser', 5),

    -- 10. school-sports
    ('school-sports', 'other balls', 0),
    ('school-sports', 'soccer', 1),
    ('school-sports', 'baseball', 2),
    ('school-sports', 'tennis', 3),
    ('school-sports', 'table tennis', 4),

    -- 11. school-classroom
    ('school-classroom', 'blackboard/whiteboard', 0),
    ('school-classroom', 'board eraser', 1),
    ('school-classroom', 'chair', 2),
    ('school-classroom', 'clock', 3),
    ('school-classroom', 'desk', 4),

    -- 12. school-activities
    ('school-activities', 'skateboard', 0),
    ('school-activities', 'baseball glove', 1),
    ('school-activities', 'helmet', 2),
    ('school-activities', 'bicycle', 3),
    ('school-activities', 'other balls', 4),

    -- 13. kitchen-cooking
    ('kitchen-cooking', 'gas stove', 0),
    ('kitchen-cooking', 'cutting/chopping board', 1),
    ('kitchen-cooking', 'bowl/basin', 2),
    ('kitchen-cooking', 'refrigerator', 3),
    ('kitchen-cooking', 'microwave', 4),

    -- 14. living-room
    ('living-room', 'couch', 0),
    ('living-room', 'monitor/tv', 1),
    ('living-room', 'clock', 2),
    ('living-room', 'coffee table', 3),
    ('living-room', 'picture/frame', 4),

    -- 15. home-dining
    ('home-dining', 'plate', 0),
    ('home-dining', 'cup', 1),
    ('home-dining', 'bowl/basin', 2),
    ('home-dining', 'wine glass', 3),
    ('home-dining', 'dining table', 4),

    -- 16. home-care
    ('home-care', 'pillow', 0),
    ('home-care', 'mirror', 1),
    ('home-care', 'toothbrush', 2),
    ('home-care', 'hair dryer', 3),
    ('home-care', 'vase', 4),

    -- 17. city-transport
    ('city-transport', 'bus', 0),
    ('city-transport', 'car', 1),
    ('city-transport', 'motorcycle', 2),
    ('city-transport', 'bicycle', 3),
    ('city-transport', 'traffic light', 4),

    -- 18. travel-journey
    ('travel-journey', 'airplane', 0),
    ('travel-journey', 'train', 1),
    ('travel-journey', 'boat', 2),
    ('travel-journey', 'luggage', 3),
    ('travel-journey', 'helmet', 4),

    -- 19. travel-street
    ('travel-street', 'traffic light', 0),
    ('travel-street', 'stop sign', 1),
    ('travel-street', 'street lights', 2),
    ('travel-street', 'bicycle', 3),
    ('travel-street', 'car', 4),

    -- 20. travel-accessories
    ('travel-accessories', 'luggage', 0),
    ('travel-accessories', 'umbrella', 1),
    ('travel-accessories', 'glasses', 2),
    ('travel-accessories', 'hat', 3),
    ('travel-accessories', 'watch', 4)
) AS mapping(lesson_id, detection_label, position)
JOIN words w ON w.detection_label = mapping.detection_label;
