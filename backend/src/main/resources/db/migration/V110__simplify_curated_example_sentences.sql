-- Simplify complex/literary example sentences for better learning usability

-- mouse
UPDATE words
SET example_en = 'I use a computer mouse every day.',
    example_vn = 'Tôi sử dụng chuột máy tính mỗi ngày.'
WHERE detection_label = 'mouse';

-- sheep
UPDATE words
SET example_en = 'The sheep has soft white wool.',
    example_vn = 'Con cừu có bộ lông len trắng mềm mại.'
WHERE detection_label = 'sheep';

-- horse
UPDATE words
SET example_en = 'She loves to ride a horse.',
    example_vn = 'Cô ấy rất thích cưỡi ngựa.'
WHERE detection_label = 'horse';

-- cow
UPDATE words
SET example_en = 'The cow gives fresh milk every day.',
    example_vn = 'Con bò cho sữa tươi mỗi ngày.'
WHERE detection_label = 'cow';

-- elephant
UPDATE words
SET example_en = 'The elephant is a very large animal.',
    example_vn = 'Con voi là một loài động vật rất lớn.'
WHERE detection_label = 'elephant';

-- zebra
UPDATE words
SET example_en = 'The zebra has black and white stripes.',
    example_vn = 'Con ngựa vằn có sọc đen và trắng.'
WHERE detection_label = 'zebra';

-- giraffe
UPDATE words
SET example_en = 'The giraffe has a very long neck.',
    example_vn = 'Con hươu cao cổ có một chiếc cổ rất dài.'
WHERE detection_label = 'giraffe';

-- stop sign
UPDATE words
SET example_en = 'Stop your car when you see the stop sign.',
    example_vn = 'Hãy dừng xe lại khi bạn thấy biển báo dừng.'
WHERE detection_label = 'stop sign';

-- skis
UPDATE words
SET example_en = 'We use skis to slide on the snow.',
    example_vn = 'Chúng tôi dùng ván trượt để trượt trên tuyết.'
WHERE detection_label = 'skis';

-- baseball bat
UPDATE words
SET example_en = 'I play baseball with a wooden bat.',
    example_vn = 'Tôi chơi bóng chày bằng một cây gậy gỗ.'
WHERE detection_label = 'baseball bat';

-- baseball glove
UPDATE words
SET example_en = 'Wear a glove to catch the baseball.',
    example_vn = 'Đeo găng tay để bắt quả bóng chày.'
WHERE detection_label = 'baseball glove';

-- skateboard
UPDATE words
SET example_en = 'He rides his skateboard in the park.',
    example_vn = 'Cậu ấy trượt ván trong công viên.'
WHERE detection_label = 'skateboard';

-- microwave
UPDATE words
SET example_en = 'I warm my lunch in the microwave.',
    example_vn = 'Tôi hâm nóng bữa trưa bằng lò vi sóng.'
WHERE detection_label = 'microwave';

-- refrigerator
UPDATE words
SET example_en = 'Keep the milk inside the refrigerator.',
    example_vn = 'Hãy cất sữa ở bên trong tủ lạnh.'
WHERE detection_label = 'refrigerator';

-- toothbrush
UPDATE words
SET example_en = 'I clean my teeth with a toothbrush.',
    example_vn = 'Tôi làm sạch răng bằng bàn chải đánh răng.'
WHERE detection_label = 'toothbrush';

-- clock
UPDATE words
SET example_en = 'The clock on the wall shows the correct time.',
    example_vn = 'Chiếc đồng hồ trên tường chỉ giờ chính xác.'
WHERE detection_label = 'clock';

-- toilet
UPDATE words
SET example_en = 'Remember to flush the toilet after use.',
    example_vn = 'Hãy nhớ xả nước bồn cầu sau khi sử dụng.'
WHERE detection_label = 'toilet';
