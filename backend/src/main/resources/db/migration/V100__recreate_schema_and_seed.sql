-- ============================================================
-- V100: Force drop old legacy tables and recreate clean Vocam schema + seed 80 COCO words
-- ============================================================

DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;

CREATE TABLE words (
    id          BIGSERIAL    PRIMARY KEY,
    coco_class  VARCHAR(50)  NOT NULL UNIQUE,   -- YOLO class name: "cup", "cat"
    en_word     VARCHAR(100) NOT NULL,
    phonetic    VARCHAR(100),                   -- IPA: /kʌp/
    pos         VARCHAR(20),                    -- Noun, Verb, Adjective
    definition  TEXT,                           -- Short English definition
    translation VARCHAR(200) NOT NULL,          -- Vietnamese meaning
    example_en  TEXT,
    example_vn  TEXT,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE user_progress (
    id              BIGSERIAL    PRIMARY KEY,
    device_uuid     VARCHAR(36)  NOT NULL UNIQUE,   -- UUID generated on first app launch
    display_name    VARCHAR(100) NOT NULL DEFAULT 'Người dùng',
    total_xp        INTEGER      NOT NULL DEFAULT 0,
    current_streak  INTEGER      NOT NULL DEFAULT 0,
    longest_streak  INTEGER      NOT NULL DEFAULT 0,
    words_learned   INTEGER      NOT NULL DEFAULT 0,
    last_sync_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Sort leaderboard by XP efficiently
CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON user_progress (total_xp DESC);

-- Seed all 80 COCO classes with Vietnamese vocabulary
INSERT INTO words (coco_class, en_word, phonetic, pos, definition, translation, example_en, example_vn) VALUES
('person',        'person',        '/ˈpɜːrsən/',    'Noun', 'A human being',                           'người',               'There is a person standing at the door.',          'Có một người đang đứng ở cửa.'),
('bicycle',       'bicycle',       '/ˈbaɪsɪkəl/',   'Noun', 'A two-wheeled vehicle powered by pedals', 'xe đạp',              'She rides her bicycle to school every day.',       'Cô ấy đạp xe đến trường mỗi ngày.'),
('car',           'car',           '/kɑːr/',         'Noun', 'A motor vehicle with four wheels',        'xe ô tô',             'He drives his car to work.',                       'Anh ấy lái xe đi làm.'),
('motorcycle',    'motorcycle',    '/ˈmoʊtərsaɪkəl/','Noun','A two-wheeled motor vehicle',             'xe máy',              'The motorcycle is parked outside.',                'Chiếc xe máy đậu ở bên ngoài.'),
('airplane',      'airplane',      '/ˈɛrpleɪn/',     'Noun', 'A powered flying vehicle',               'máy bay',             'The airplane landed safely at the airport.',       'Máy bay hạ cánh an toàn tại sân bay.'),
('bus',           'bus',           '/bʌs/',           'Noun', 'A large road vehicle for passengers',    'xe buýt',             'I take the bus to the city center.',               'Tôi đi xe buýt đến trung tâm thành phố.'),
('train',         'train',         '/treɪn/',         'Noun', 'A vehicle that runs on rails',           'tàu hỏa',             'The train arrives at eight o clock.',              'Tàu hỏa đến lúc tám giờ.'),
('truck',         'truck',         '/trʌk/',          'Noun', 'A large vehicle for transporting goods', 'xe tải',              'The truck is carrying heavy cargo.',               'Xe tải đang chở hàng hóa nặng.'),
('boat',          'boat',          '/boʊt/',          'Noun', 'A small watercraft',                     'thuyền',              'We went fishing on a small boat.',                 'Chúng tôi đi câu cá trên một chiếc thuyền nhỏ.'),
('traffic light', 'traffic light', '/ˈtræfɪk laɪt/', 'Noun', 'A signal light that controls traffic',  'đèn giao thông',      'Stop when the traffic light turns red.',           'Dừng lại khi đèn giao thông chuyển đỏ.'),
('fire hydrant',  'fire hydrant',  '/faɪr ˈhaɪdrənt/','Noun','A pipe for firefighters to access water','họng cứu hỏa',       'The fire hydrant is painted red.',                 'Họng cứu hỏa được sơn màu đỏ.'),
('stop sign',     'stop sign',     '/stɒp saɪn/',     'Noun', 'A sign that tells drivers to stop',     'biển báo dừng',       'There is a stop sign at the intersection.',        'Có biển báo dừng ở ngã tư.'),
('parking meter', 'parking meter', '/ˈpɑːrkɪŋ miːtər/','Noun','A device for collecting parking fees', 'đồng hồ tính tiền đỗ xe','Put a coin in the parking meter.',              'Bỏ đồng xu vào đồng hồ tính tiền đỗ xe.'),
('bench',         'bench',         '/bɛntʃ/',         'Noun', 'A long seat for several people',        'ghế dài',             'She sat on the bench in the park.',                'Cô ấy ngồi trên ghế dài trong công viên.'),
('bird',          'bird',          '/bɜːrd/',         'Noun', 'A feathered animal that can usually fly','con chim',           'A colorful bird is singing in the tree.',          'Một con chim nhiều màu đang hót trên cây.'),
('cat',           'cat',           '/kæt/',           'Noun', 'A small domesticated furry animal',      'con mèo',             'The cat is sleeping on the sofa.',                 'Con mèo đang ngủ trên ghế sofa.'),
('dog',           'dog',           '/dɒɡ/',           'Noun', 'A common pet and domestic animal',       'con chó',             'The dog barks loudly at strangers.',               'Con chó sủa to khi có người lạ.'),
('horse',         'horse',         '/hɔːrs/',         'Noun', 'A large animal used for riding',         'con ngựa',            'The horse galloped across the field.',             'Con ngựa phi nước đại qua cánh đồng.'),
('sheep',         'sheep',         '/ʃiːp/',          'Noun', 'A woolly farm animal',                   'con cừu',             'The sheep graze in the green meadow.',             'Những con cừu gặm cỏ trên đồng cỏ xanh.'),
('cow',           'cow',           '/kaʊ/',           'Noun', 'A large female farm animal that gives milk','con bò',           'The cow produces fresh milk every morning.',       'Con bò cho sữa tươi mỗi buổi sáng.'),
('elephant',      'elephant',      '/ˈɛlɪfənt/',      'Noun', 'The largest land animal with a trunk',  'con voi',             'The elephant uses its trunk to drink water.',      'Con voi dùng vòi để uống nước.'),
('bear',          'bear',          '/bɛr/',           'Noun', 'A large wild animal with thick fur',     'con gấu',             'The bear hibernates in winter.',                   'Con gấu ngủ đông vào mùa đông.'),
('zebra',         'zebra',         '/ˈziːbrə/',       'Noun', 'A black and white striped wild animal',  'con ngựa vằn',        'The zebra has distinctive black and white stripes.','Con ngựa vằn có sọc đen trắng đặc trưng.'),
('giraffe',       'giraffe',       '/dʒɪˈrɑːf/',      'Noun', 'A very tall African animal with a long neck','con hươu cao cổ', 'The giraffe can reach leaves at the top of trees.','Con hươu cao cổ có thể với tới lá trên đỉnh cây.'),
('backpack',      'backpack',      '/ˈbækpæk/',       'Noun', 'A bag carried on the back',             'ba lô',               'She carries her books in a backpack.',             'Cô ấy đựng sách trong ba lô.'),
('umbrella',      'umbrella',      '/ʌmˈbrɛlə/',      'Noun', 'A device used for protection from rain', 'cái ô / dù',          'Do not forget to bring an umbrella today.',        'Đừng quên mang ô hôm nay.'),
('handbag',       'handbag',       '/ˈhændbæɡ/',      'Noun', 'A small bag carried by hand',           'túi xách tay',        'She bought a new leather handbag.',                'Cô ấy mua một chiếc túi xách da mới.'),
('tie',           'tie',           '/taɪ/',           'Noun', 'A strip of cloth worn around the neck', 'cà vạt',              'He wears a tie to the office every day.',          'Anh ấy đeo cà vạt đến văn phòng mỗi ngày.'),
('suitcase',      'suitcase',      '/ˈsuːtkeɪs/',     'Noun', 'A large bag with a handle for travel',  'vali',                'She packed her suitcase for the trip.',            'Cô ấy đóng gói vali cho chuyến đi.'),
('frisbee',       'frisbee',       '/ˈfrɪzbi/',       'Noun', 'A plastic disc thrown as a toy',        'đĩa ném frisbee',     'They played frisbee at the beach.',                'Họ chơi ném đĩa ở bãi biển.'),
('skis',          'skis',          '/skiːz/',          'Noun', 'Long flat objects attached to boots for skiing','ván trượt tuyết','He strapped on his skis at the top of the slope.','Anh ấy buộc ván trượt tuyết ở đỉnh dốc.'),
('snowboard',     'snowboard',     '/ˈsnoʊbɔːrd/',    'Noun', 'A board used for sliding down snow',   'ván trượt tuyết đơn', 'She learned to ride a snowboard last winter.',     'Cô ấy học trượt ván tuyết mùa đông năm ngoái.'),
('sports ball',   'sports ball',   '/spɔːrts bɔːl/',  'Noun', 'A ball used in sports activities',     'bóng thể thao',       'Kick the sports ball into the goal.',              'Đá bóng vào lưới.'),
('kite',          'kite',          '/kaɪt/',           'Noun', 'A toy that flies in the wind on a string','con diều',         'Children love flying kites in the park.',          'Trẻ em thích thả diều trong công viên.'),
('baseball bat',  'baseball bat',  '/ˈbeɪsbɔːl bæt/', 'Noun', 'A rounded stick used to hit a baseball','gậy bóng chày',      'He swung the baseball bat with great force.',      'Anh ấy vung gậy bóng chày với sức mạnh lớn.'),
('baseball glove','baseball glove','/ˈbeɪsbɔːl ɡlʌv/','Noun', 'A padded glove used in baseball',     'găng tay bóng chày',  'The catcher wore a large baseball glove.',         'Người bắt bóng đeo găng tay bóng chày to.'),
('skateboard',    'skateboard',    '/ˈskeɪtbɔːrd/',   'Noun', 'A board with wheels ridden as a sport','ván trượt',           'He performs tricks on his skateboard.',            'Anh ấy thực hiện các màn nhào lộn trên ván trượt.'),
('surfboard',     'surfboard',     '/ˈsɜːrfbɔːrd/',   'Noun', 'A board used for riding ocean waves',  'ván lướt sóng',       'She carried her surfboard to the beach.',          'Cô ấy mang ván lướt sóng ra bãi biển.'),
('tennis racket', 'tennis racket', '/ˈtɛnɪs ˈrækɪt/', 'Noun','A light bat used to hit tennis balls',  'vợt tennis',          'She broke her tennis racket during the match.',    'Cô ấy làm gãy vợt tennis trong trận đấu.'),
('bottle',        'bottle',        '/ˈbɒtəl/',        'Noun', 'A container for liquids',               'cái chai',            'Please fill the bottle with water.',               'Vui lòng đổ đầy nước vào chai.'),
('wine glass',    'wine glass',    '/waɪn ɡlɑːs/',    'Noun', 'A glass used for drinking wine',        'ly rượu vang',        'She raised her wine glass in a toast.',            'Cô ấy nâng ly rượu vang để chúc mừng.'),
('cup',           'cup',           '/kʌp/',           'Noun', 'A small container used for drinking',   'cái cốc / tách',      'She drank a cup of hot tea.',                      'Cô ấy uống một tách trà nóng.'),
('fork',          'fork',          '/fɔːrk/',         'Noun', 'A utensil with prongs used for eating', 'cái nĩa',             'Use a fork to eat spaghetti.',                     'Dùng nĩa để ăn mì spaghetti.'),
('knife',         'knife',         '/naɪf/',          'Noun', 'A sharp tool used for cutting',         'con dao',             'Be careful when using a sharp knife.',             'Hãy cẩn thận khi dùng dao sắc.'),
('spoon',         'spoon',         '/spuːn/',         'Noun', 'A utensil used for eating liquids',     'cái muỗng / thìa',    'Stir the coffee with a spoon.',                    'Khuấy cà phê bằng thìa.'),
('bowl',          'bowl',          '/boʊl/',          'Noun', 'A round deep dish for food',            'cái bát / tô',        'She filled the bowl with soup.',                   'Cô ấy múc đầy tô canh.'),
('banana',        'banana',        '/bəˈnɑːnə/',      'Noun', 'A long yellow tropical fruit',          'quả chuối',           'He eats a banana for breakfast every morning.',    'Anh ấy ăn chuối vào bữa sáng mỗi ngày.'),
('apple',         'apple',         '/ˈæpəl/',         'Noun', 'A round red or green fruit',            'quả táo',             'An apple a day keeps the doctor away.',            'Mỗi ngày một quả táo giúp bạn xa bác sĩ.'),
('sandwich',      'sandwich',      '/ˈsænwɪdʒ/',      'Noun', 'Two slices of bread with a filling',   'bánh sandwich',       'She made a sandwich for lunch.',                   'Cô ấy làm bánh sandwich ăn trưa.'),
('orange',        'orange',        '/ˈɒrɪndʒ/',       'Noun', 'A round orange citrus fruit',           'quả cam',             'The orange is sweet and full of vitamins.',        'Quả cam ngọt và nhiều vitamin.'),
('broccoli',      'broccoli',      '/ˈbrɒkəli/',      'Noun', 'A green vegetable with a tree-like shape','bông cải xanh',     'Broccoli is high in vitamins and minerals.',       'Bông cải xanh giàu vitamin và khoáng chất.'),
('carrot',        'carrot',        '/ˈkærət/',        'Noun', 'An orange root vegetable',              'củ cà rốt',           'Rabbits love to eat carrots.',                     'Thỏ rất thích ăn cà rốt.'),
('hot dog',       'hot dog',       '/hɒt dɒɡ/',       'Noun', 'A sausage in a long bread roll',        'bánh mì hotdog',      'He bought a hot dog at the football game.',        'Anh ấy mua bánh hotdog tại trận bóng đá.'),
('pizza',         'pizza',         '/ˈpiːtsə/',       'Noun', 'A flat bread with toppings baked in an oven','bánh pizza',      'We ordered a large pizza for the party.',          'Chúng tôi gọi một chiếc pizza lớn cho buổi tiệc.'),
('donut',         'donut',         '/ˈdoʊnʌt/',       'Noun', 'A sweet fried ring-shaped pastry',     'bánh donut',          'She ate a chocolate donut with coffee.',           'Cô ấy ăn bánh donut chocolate kèm cà phê.'),
('cake',          'cake',          '/keɪk/',          'Noun', 'A sweet baked food often for celebrations','bánh kem / bánh ngọt','They ate cake at the birthday party.',          'Họ ăn bánh kem tại bữa tiệc sinh nhật.'),
('chair',         'chair',         '/tʃɛr/',          'Noun', 'A separate seat for one person',        'cái ghế',             'Please sit on the chair.',                         'Vui lòng ngồi vào ghế.'),
('couch',         'couch',         '/kaʊtʃ/',         'Noun', 'A long upholstered seat for sitting or lying','ghế sofa',       'He fell asleep on the couch.',                     'Anh ấy ngủ thiếp đi trên ghế sofa.'),
('potted plant',  'potted plant',  '/ˈpɒtɪd plɑːnt/', 'Noun','A plant growing in a pot or container', 'cây trồng trong chậu','She waters the potted plant every morning.',       'Cô ấy tưới cây trồng trong chậu mỗi buổi sáng.'),
('bed',           'bed',           '/bɛd/',           'Noun', 'A piece of furniture for sleeping',     'cái giường',          'Make sure to make your bed every morning.',         'Hãy nhớ dọn giường mỗi buổi sáng.'),
('dining table',  'dining table',  '/ˈdaɪnɪŋ ˈteɪbəl/','Noun','A table used for eating meals',       'bàn ăn',              'The whole family sat around the dining table.',    'Cả gia đình ngồi quanh bàn ăn.'),
('toilet',        'toilet',        '/ˈtɔɪlət/',       'Noun', 'A bowl used for body waste',            'bồn cầu',             'The bathroom has a clean toilet.',                 'Phòng tắm có một bồn cầu sạch sẻ.'),
('tv',            'television',    '/ˈtɛlɪvɪʒən/',    'Noun', 'A device for watching broadcasts',     'tivi / máy thu hình', 'He watches the news on television every evening.', 'Anh ấy xem tin tức trên tivi mỗi tối.'),
('laptop',        'laptop',        '/ˈlæptɒp/',       'Noun', 'A portable personal computer',         'máy tính xách tay',   'She works on her laptop at the coffee shop.',      'Cô ấy làm việc bằng laptop tại quán cà phê.'),
('mouse',         'mouse',         '/maʊs/',          'Noun', 'A small device for controlling a computer','con chuột máy tính','He moved the mouse to click the icon.',          'Anh ấy di chuyển chuột để nhấp vào biểu tượng.'),
('remote',        'remote',        '/rɪˈmoʊt/',       'Noun', 'A device for controlling electronics from a distance','điều khiển từ xa','Use the remote to change the channel.','Dùng điều khiển từ xa để đổi kênh.'),
('keyboard',      'keyboard',      '/ˈkiːbɔːrd/',     'Noun', 'A panel of keys used to type',         'bàn phím',            'She types very fast on her keyboard.',             'Cô ấy gõ phím rất nhanh trên bàn phím.'),
('cell phone',    'phone',         '/foʊn/',          'Noun', 'A portable device for communication',  'điện thoại',          'He forgot his phone at home.',                     'Anh ấy quên điện thoại ở nhà.'),
('microwave',     'microwave',     '/ˈmaɪkrəweɪv/',   'Noun', 'An oven that heats food using microwaves','lò vi sóng',       'Heat the food in the microwave for two minutes.',  'Hâm nóng thức ăn trong lò vi sóng hai phút.'),
('oven',          'oven',          '/ˈʌvən/',         'Noun', 'A device used for baking or roasting food','lò nướng',          'Preheat the oven to 180 degrees.',                'Làm nóng lò nướng đến 180 độ.'),
('toaster',       'toaster',       '/ˈtoʊstər/',      'Noun', 'A device for toasting bread',          'máy nướng bánh mì',   'Put the bread in the toaster.',                   'Bỏ bánh mì vào máy nướng.'),
('sink',          'sink',          '/sɪŋk/',          'Noun', 'A fixed basin with taps for washing',  'bồn rửa tay / chậu rửa','Wash your hands in the sink.',                 'Rửa tay trong bồn rửa.'),
('refrigerator',  'refrigerator',  '/rɪˈfrɪdʒəreɪtər/','Noun','A device for keeping food cold',      'tủ lạnh',             'Put the leftovers in the refrigerator.',           'Bỏ thức ăn thừa vào tủ lạnh.'),
('book',          'book',          '/bʊk/',           'Noun', 'A set of written or printed pages',    'cuốn sách',           'She reads a book before going to sleep.',          'Cô ấy đọc sách trước khi đi ngủ.'),
('clock',         'clock',         '/klɒk/',          'Noun', 'A device for telling time',            'đồng hồ treo tường',  'The clock on the wall shows three o clock.',       'Đồng hồ treo tường chỉ ba giờ.'),
('vase',          'vase',          '/vɑːz/',          'Noun', 'A container for holding flowers',      'bình hoa',            'She put fresh flowers in the vase.',               'Cô ấy cắm hoa tươi vào bình.'),
('scissors',      'scissors',      '/ˈsɪzərz/',       'Noun', 'A cutting tool with two blades',       'cái kéo',             'Use scissors to cut the paper.',                   'Dùng kéo để cắt giấy.'),
('teddy bear',    'teddy bear',    '/ˈtɛdi bɛr/',     'Noun', 'A soft toy in the shape of a bear',   'gấu bông',            'The child slept with her teddy bear.',             'Đứa bé ngủ ôm gấu bông.'),
('hair drier',    'hair dryer',    '/hɛr ˈdraɪər/',   'Noun', 'A device for drying hair with hot air','máy sấy tóc',         'She dries her hair with a hair dryer.',            'Cô ấy sấy tóc bằng máy sấy tóc.'),
('toothbrush',    'toothbrush',    '/ˈtuːθbrʌʃ/',     'Noun', 'A brush used to clean teeth',         'bàn chải đánh răng',  'Brush your teeth with a toothbrush twice a day.',  'Đánh răng bằng bàn chải hai lần mỗi ngày.')
ON CONFLICT (coco_class) DO NOTHING;
