-- ============================================================
-- V102: Mở rộng kho từ vựng — thêm ~180 mục mới
-- (Bổ sung cho 80 mục đã có từ V100, tổng ~260 mục)
-- Bao phủ toàn bộ danh sách EXPANDED_VOCABULARY trong FastAPI
-- ============================================================

INSERT INTO words (coco_class, en_word, phonetic, pos, definition, translation, example_en, example_vn) VALUES

-- ── Phụ kiện / Quần áo ────────────────────────────────────────
('glasses',       'glasses',       '/ˈɡlɑːsɪz/',    'Noun', 'Spectacles worn to correct vision',          'kính mắt',             'She wears glasses when reading.',                     'Cô ấy đeo kính khi đọc sách.'),
('sunglasses',    'sunglasses',    '/ˈsʌnɡlɑːsɪz/', 'Noun', 'Tinted glasses that protect eyes from sun',  'kính râm',             'Put on sunglasses before going to the beach.',        'Đeo kính râm trước khi ra biển.'),
('hat',           'hat',           '/hæt/',          'Noun', 'A covering worn on the head',                'cái mũ',               'He wore a straw hat to protect himself from the sun.','Anh ấy đội mũ rơm để che nắng.'),
('cap',           'cap',           '/kæp/',          'Noun', 'A soft flat hat with a visor',               'mũ lưỡi trai',         'She wore a red baseball cap.',                        'Cô ấy đội mũ lưỡi trai màu đỏ.'),
('shoes',         'shoes',         '/ʃuːz/',         'Noun', 'Coverings for the feet',                     'đôi giày',             'He polished his shoes before the interview.',         'Anh ấy đánh bóng giày trước buổi phỏng vấn.'),
('sneakers',      'sneakers',      '/ˈsniːkərz/',   'Noun', 'Casual sports shoes',                        'giày thể thao',        'She bought a new pair of white sneakers.',            'Cô ấy mua một đôi giày thể thao trắng mới.'),
('boots',         'boots',         '/buːts/',        'Noun', 'Sturdy footwear that covers the ankle',      'giày ủng',             'He wore waterproof boots in the rain.',               'Anh ấy đi giày ủng chống thấm khi trời mưa.'),
('socks',         'socks',         '/sɒks/',         'Noun', 'Garments worn on the feet',                  'đôi tất / vớ',         'He put on a pair of warm socks.',                     'Anh ấy mang một đôi tất ấm.'),
('watch',         'watch',         '/wɒtʃ/',         'Noun', 'A small timepiece worn on the wrist',        'đồng hồ đeo tay',      'His watch stopped working yesterday.',                'Đồng hồ của anh ấy bị hỏng hôm qua.'),
('ring',          'ring',          '/rɪŋ/',          'Noun', 'A circular band worn on a finger',           'nhẫn',                 'She wears a gold ring on her finger.',                'Cô ấy đeo nhẫn vàng trên ngón tay.'),
('necklace',      'necklace',      '/ˈnɛklɪs/',     'Noun', 'Jewelry worn around the neck',               'vòng cổ / dây chuyền', 'She received a pearl necklace as a gift.',            'Cô ấy nhận được vòng cổ ngọc trai làm quà.'),
('earrings',      'earrings',      '/ˈɪərɪŋz/',     'Noun', 'Jewelry worn on the ears',                   'bông tai',             'She wore small gold earrings to the party.',          'Cô ấy đeo bông tai vàng nhỏ đến bữa tiệc.'),
('wallet',        'wallet',        '/ˈwɒlɪt/',      'Noun', 'A flat folding case for money and cards',    'ví tiền',              'He left his wallet at home.',                         'Anh ấy bỏ quên ví tiền ở nhà.'),
('purse',         'purse',         '/pɜːrs/',        'Noun', 'A small bag for carrying money',             'túi ví / ví đầm',      'She found her keys at the bottom of her purse.',      'Cô ấy tìm thấy chìa khóa dưới đáy ví.'),
('belt',          'belt',          '/bɛlt/',         'Noun', 'A strip of leather worn around the waist',  'thắt lưng / dây nịt',  'He tightened his belt after losing weight.',          'Anh ấy thắt chặt thắt lưng sau khi giảm cân.'),

-- ── Điện tử / Công nghệ ───────────────────────────────────────
('monitor',       'monitor',       '/ˈmɒnɪtər/',    'Noun', 'A screen that displays computer output',     'màn hình máy tính',    'The monitor displays sharp high-resolution images.',  'Màn hình hiển thị hình ảnh sắc nét độ phân giải cao.'),
('tablet',        'tablet',        '/ˈtæblɪt/',     'Noun', 'A portable touchscreen computing device',    'máy tính bảng',        'She reads e-books on her tablet every night.',        'Cô ấy đọc sách điện tử trên máy tính bảng mỗi tối.'),
('headphones',    'headphones',    '/ˈhɛdfəʊnz/',   'Noun', 'A pair of audio speakers worn over ears',   'tai nghe chụp tai',    'He uses headphones to listen to music while studying.','Anh ấy dùng tai nghe để nghe nhạc khi học.'),
('earphones',     'earphones',     '/ˈɪərfəʊnz/',   'Noun', 'Small earpieces that fit inside the ear',   'tai nghe nhét tai',    'She plugged in her earphones to listen to a podcast.','Cô ấy cắm tai nghe để nghe podcast.'),
('speaker',       'speaker',       '/ˈspiːkər/',    'Noun', 'A device that converts electrical signals to sound','loa',           'The Bluetooth speaker fills the room with music.',    'Chiếc loa Bluetooth làm đầy căn phòng bằng âm nhạc.'),
('camera',        'camera',        '/ˈkæmərə/',     'Noun', 'A device used to capture photographs',       'máy ảnh',              'She took a photo of the sunset with her camera.',     'Cô ấy chụp ảnh hoàng hôn bằng máy ảnh.'),
('charger',       'charger',       '/ˈtʃɑːrdʒər/',  'Noun', 'A device that recharges batteries',         'bộ sạc điện',          'I forgot to bring my phone charger.',                 'Tôi quên mang bộ sạc điện thoại.'),
('drone',         'drone',         '/droʊn/',        'Noun', 'An unmanned aerial vehicle',                'máy bay không người lái','The drone captured aerial footage of the city.',     'Máy bay không người lái quay phim thành phố từ trên cao.'),
('remote',        'remote control','/rɪˈmoʊt kənˈtroʊl/','Noun','A device for controlling from a distance','điều khiển từ xa',  'He used the remote control to change channels.',      'Anh ấy dùng điều khiển từ xa để chuyển kênh.'),
('calculator',    'calculator',    '/ˈkælkjʊleɪtər/','Noun','A device used for arithmetic',              'máy tính bỏ túi',      'She used a calculator to check the answer.',          'Cô ấy dùng máy tính bỏ túi để kiểm tra đáp án.'),

-- ── Văn phòng phẩm ────────────────────────────────────────────
('pen',           'pen',           '/pɛn/',          'Noun', 'A writing instrument with ink',              'bút mực / bút bi',     'He signed the document with a pen.',                  'Anh ấy ký tên lên tài liệu bằng bút.'),
('pencil',        'pencil',        '/ˈpɛnsɪl/',     'Noun', 'A writing implement with graphite',          'bút chì',              'Draw the sketch lightly with a pencil.',              'Phác thảo nhẹ nhàng bằng bút chì.'),
('eraser',        'eraser',        '/ɪˈreɪzər/',    'Noun', 'A tool used to remove pencil marks',         'cục tẩy',              'She used an eraser to correct her mistake.',          'Cô ấy dùng cục tẩy để sửa lỗi.'),
('ruler',         'ruler',         '/ˈruːlər/',     'Noun', 'A flat measuring tool',                      'cái thước kẻ',         'Use a ruler to draw a straight line.',                'Dùng thước kẻ để vẽ đường thẳng.'),
('stapler',       'stapler',       '/ˈsteɪplər/',   'Noun', 'A device for fastening papers together',     'cái bấm ghim',         'She used a stapler to bind the report.',              'Cô ấy dùng bấm ghim để đóng báo cáo lại.'),
('marker',        'marker',        '/ˈmɑːrkər/',    'Noun', 'A thick-tipped writing instrument',          'bút lông',             'The teacher wrote on the board with a red marker.',   'Giáo viên viết lên bảng bằng bút lông đỏ.'),
('highlighter',   'highlighter',   '/ˈhaɪlaɪtər/',  'Noun', 'A fluorescent pen for marking text',         'bút dạ quang',         'She highlighted the key sentences in the textbook.',  'Cô ấy tô sáng những câu quan trọng trong sách giáo khoa.'),
('scissors',      'scissors',      '/ˈsɪzərz/',     'Noun', 'A cutting tool with two blades',             'cái kéo',              'Use scissors to cut along the dotted line.',          'Dùng kéo cắt theo đường nét đứt.'),
('tape',          'tape',          '/teɪp/',         'Noun', 'A sticky strip used for binding',            'băng dính',            'He used tape to seal the package.',                   'Anh ấy dùng băng dính để dán gói hàng.'),
('folder',        'folder',        '/ˈfoʊldər/',    'Noun', 'A container for holding papers',             'cặp hồ sơ',            'She organized the documents in a folder.',            'Cô ấy sắp xếp tài liệu vào cặp hồ sơ.'),
('globe',         'globe',         '/ɡloʊb/',        'Noun', 'A spherical model of the Earth',             'quả địa cầu',          'The teacher pointed to Vietnam on the globe.',        'Giáo viên chỉ vào Việt Nam trên quả địa cầu.'),
('whiteboard',    'whiteboard',    '/ˈwaɪtbɔːrd/',  'Noun', 'A board for writing with dry-erase markers', 'bảng trắng',           'The teacher drew a diagram on the whiteboard.',       'Giáo viên vẽ sơ đồ lên bảng trắng.'),
('blackboard',    'blackboard',    '/ˈblækbɔːrd/',  'Noun', 'A dark board for writing with chalk',        'bảng đen',             'The teacher wrote the formula on the blackboard.',    'Giáo viên viết công thức lên bảng đen.'),
('sticky note',   'sticky note',   '/ˈstɪki noʊt/', 'Noun', 'A small paper with a self-adhesive strip',   'giấy nhớ / giấy ghi chú','She left a sticky note on the refrigerator.',       'Cô ấy dán một tờ giấy nhớ lên tủ lạnh.'),

-- ── Nhà bếp thêm ─────────────────────────────────────────────
('plate',         'plate',         '/pleɪt/',        'Noun', 'A flat dish used for serving food',          'cái đĩa',              'She served the pasta on a white plate.',              'Cô ấy bày mì spaghetti trên đĩa trắng.'),
('tray',          'tray',          '/treɪ/',         'Noun', 'A flat container for carrying items',        'cái khay',             'The waiter brought drinks on a tray.',                'Người phục vụ mang đồ uống trên khay.'),
('pan',           'pan',           '/pæn/',          'Noun', 'A flat-bottomed cooking vessel',             'cái chảo',             'Fry the eggs in a hot pan.',                          'Chiên trứng trong chảo nóng.'),
('pot',           'pot',           '/pɒt/',          'Noun', 'A round deep cooking vessel',                'cái nồi',              'She cooked the soup in a large pot.',                 'Cô ấy nấu canh trong một cái nồi to.'),
('kettle',        'kettle',        '/ˈkɛtl/',        'Noun', 'A vessel for boiling water',                 'ấm đun nước',          'The kettle whistled when the water boiled.',          'Ấm đun nước kêu hú khi nước sôi.'),
('faucet',        'faucet',        '/ˈfɔːsɪt/',     'Noun', 'A device that controls water flow from a pipe','vòi nước',           'Turn off the faucet after washing your hands.',       'Khóa vòi nước sau khi rửa tay xong.'),
('blender',       'blender',       '/ˈblɛndər/',    'Noun', 'A machine used to mix or blend food',        'máy xay sinh tố',      'She made a smoothie using the blender.',              'Cô ấy làm sinh tố bằng máy xay.'),
('chopsticks',    'chopsticks',    '/ˈtʃɒpstɪks/',  'Noun', 'Thin sticks used to eat Asian food',         'đũa',                  'She learned to eat with chopsticks in Japan.',        'Cô ấy học cách ăn bằng đũa ở Nhật Bản.'),
('mug',           'mug',           '/mʌɡ/',          'Noun', 'A large cup with a handle',                  'ly / cốc có quai',     'He sipped coffee from his favorite mug.',             'Anh ấy nhâm nhi cà phê từ chiếc cốc yêu thích.'),
('thermos',       'thermos',       '/ˈθɜːrməs/',    'Noun', 'An insulated container for hot liquids',     'bình giữ nhiệt',       'She filled the thermos with hot tea before hiking.',  'Cô ấy đổ trà nóng vào bình giữ nhiệt trước khi leo núi.'),
('coffee maker',  'coffee maker',  '/ˈkɒfi meɪkər/','Noun', 'A machine that brews coffee',               'máy pha cà phê',       'He turns on the coffee maker first thing in the morning.','Anh ấy bật máy pha cà phê đầu tiên mỗi buổi sáng.'),

-- ── Nội thất thêm ─────────────────────────────────────────────
('armchair',      'armchair',      '/ˈɑːrmtʃɛr/',   'Noun', 'An upholstered chair with side supports',    'ghế bành',             'He relaxed in the armchair after a long day.',        'Anh ấy thư giãn trên ghế bành sau một ngày dài.'),
('pillow',        'pillow',        '/ˈpɪloʊ/',      'Noun', 'A soft cushion for resting the head',        'cái gối',              'She hugged a pillow while watching TV.',              'Cô ấy ôm gối khi xem tivi.'),
('cushion',       'cushion',       '/ˈkʊʃən/',      'Noun', 'A soft pad used for comfort',                'đệm gối ngồi',         'She placed cushions on the sofa for comfort.',        'Cô ấy đặt đệm lên sofa cho thoải mái.'),
('blanket',       'blanket',       '/ˈblæŋkɪt/',    'Noun', 'A large piece of fabric used for warmth',    'cái chăn',             'He wrapped himself in a warm blanket.',               'Anh ấy quấn mình trong chiếc chăn ấm.'),
('curtain',       'curtain',       '/ˈkɜːrtɪn/',    'Noun', 'A piece of fabric used to cover windows',    'rèm cửa',              'She drew the curtains to block out the sunlight.',    'Cô ấy kéo rèm để chắn ánh sáng mặt trời.'),
('desk',          'desk',          '/dɛsk/',         'Noun', 'A table used for writing or working',        'bàn làm việc / bàn học','His desk is covered with books and papers.',         'Bàn làm việc của anh ấy đầy sách và giấy tờ.'),
('cabinet',       'cabinet',       '/ˈkæbɪnɪt/',    'Noun', 'A piece of furniture with doors and shelves','tủ có ngăn',           'She stored the medicine in the cabinet.',             'Cô ấy cất thuốc vào tủ.'),
('shelf',         'shelf',         '/ʃɛlf/',         'Noun', 'A flat board mounted on a wall for storage','giá đỡ / kệ',           'He put the trophy on the top shelf.',                 'Anh ấy đặt cúp lên kệ trên cùng.'),
('bookshelf',     'bookshelf',     '/ˈbʊkʃɛlf/',    'Noun', 'A piece of furniture for storing books',     'giá sách',             'The bookshelf is filled with novels and textbooks.',  'Giá sách đầy tiểu thuyết và sách giáo khoa.'),
('drawer',        'drawer',        '/drɔːr/',        'Noun', 'A sliding compartment in a piece of furniture','ngăn kéo',           'She keeps her jewelry in the top drawer.',            'Cô ấy để trang sức trong ngăn kéo trên cùng.'),
('mirror',        'mirror',        '/ˈmɪrər/',      'Noun', 'A reflective surface used to see oneself',   'gương soi',            'She checked her hair in the mirror.',                 'Cô ấy kiểm tra tóc trước gương.'),
('painting',      'painting',      '/ˈpeɪntɪŋ/',    'Noun', 'An artwork created with paint',              'bức tranh sơn dầu',    'A beautiful painting hangs on the living room wall.', 'Một bức tranh đẹp treo trên tường phòng khách.'),
('picture frame', 'picture frame', '/ˈpɪktʃər freɪm/','Noun','A border enclosing a picture',             'khung ảnh',            'She put her family photo in a picture frame.',        'Cô ấy đặt ảnh gia đình vào khung ảnh.'),
('poster',        'poster',        '/ˈpoʊstər/',    'Noun', 'A large printed picture used for decoration','tờ áp phích / poster', 'He put up a music poster in his bedroom.',            'Anh ấy dán poster âm nhạc trong phòng ngủ.'),
('flower',        'flower',        '/ˈflaʊər/',     'Noun', 'The seed-bearing part of a plant',           'bông hoa',             'She picked a bouquet of flowers from the garden.',    'Cô ấy hái một bó hoa từ khu vườn.'),
('lamp',          'lamp',          '/læmp/',         'Noun', 'A device that provides artificial light',    'đèn',                  'Turn on the lamp when it gets dark.',                 'Bật đèn khi trời tối.'),
('desk lamp',     'desk lamp',     '/dɛsk læmp/',   'Noun', 'A small lamp placed on a desk',              'đèn bàn',              'The desk lamp helps her study at night.',             'Đèn bàn giúp cô ấy học bài vào ban đêm.'),
('trash can',     'trash can',     '/træʃ kæn/',    'Noun', 'A container for disposing rubbish',          'thùng rác',            'Throw the wrapper in the trash can.',                 'Bỏ vỏ bọc vào thùng rác.'),
('fan',           'fan',           '/fæn/',          'Noun', 'A device that creates airflow for cooling',  'cái quạt điện',        'She turned on the fan because it was hot.',           'Cô ấy bật quạt vì trời nóng.'),
('air conditioner','air conditioner','/ɛr kənˈdɪʃənər/','Noun','A system that cools indoor air',         'máy lạnh / điều hòa',  'Set the air conditioner to 22 degrees.',              'Chỉnh máy lạnh về 22 độ.'),
('heater',        'heater',        '/ˈhiːtər/',     'Noun', 'A device for warming a room',                'máy sưởi ấm',          'She turned on the heater to warm the room.',          'Cô ấy bật máy sưởi để làm ấm phòng.'),
('vacuum cleaner','vacuum cleaner','/ˈvækjuːm kliːnər/','Noun','A machine that uses suction to clean floors','máy hút bụi',    'She vacuumed the living room carpet.',                'Cô ấy hút bụi tấm thảm phòng khách.'),
('iron',          'iron',          '/ˈaɪərn/',      'Noun', 'A device used to remove wrinkles from clothes','bàn ủi / bàn là',   'He ironed his shirt before the meeting.',             'Anh ấy ủi áo trước buổi họp.'),
('washing machine','washing machine','/ˈwɒʃɪŋ məˈʃiːn/','Noun','A machine for washing clothes',         'máy giặt',             'She put the laundry in the washing machine.',         'Cô ấy bỏ quần áo vào máy giặt.'),

-- ── Đồ dùng phòng tắm ─────────────────────────────────────────
('toothpaste',    'toothpaste',    '/ˈtuːθpeɪst/',  'Noun', 'A paste used for cleaning teeth',            'kem đánh răng',        'Apply toothpaste to your toothbrush.',                'Phết kem đánh răng lên bàn chải.'),
('soap',          'soap',          '/soʊp/',         'Noun', 'A cleansing substance used with water',      'xà phòng',             'Wash your hands with soap and water.',                'Rửa tay bằng xà phòng và nước.'),
('shampoo',       'shampoo',       '/ʃæmˈpuː/',     'Noun', 'A liquid used for washing hair',             'dầu gội đầu',          'She massaged shampoo into her scalp.',                'Cô ấy massage dầu gội lên da đầu.'),
('towel',         'towel',         '/ˈtaʊəl/',      'Noun', 'An absorbent cloth for drying',              'khăn tắm / khăn lau',  'Dry yourself with a clean towel.',                    'Lau người bằng khăn sạch.'),
('hair dryer',    'hair dryer',    '/hɛr ˈdraɪər/', 'Noun', 'A device that blows hot air to dry hair',    'máy sấy tóc',          'She dries her hair with a hair dryer after showering.','Cô ấy sấy tóc bằng máy sấy sau khi tắm.'),
('razor',         'razor',         '/ˈreɪzər/',     'Noun', 'A tool used for shaving',                    'dao cạo râu',          'He shaved his beard with a razor.',                   'Anh ấy cạo râu bằng dao cạo.'),
('comb',          'comb',          '/koʊm/',         'Noun', 'A toothed tool used for styling hair',       'cái lược',             'He combed his hair before the interview.',            'Anh ấy chải tóc trước khi đi phỏng vấn.'),
('tissue',        'tissue',        '/ˈtɪʃuː/',      'Noun', 'Soft paper used for wiping',                 'khăn giấy',            'She used a tissue to wipe her nose.',                 'Cô ấy dùng khăn giấy lau mũi.'),
('bath tub',      'bathtub',       '/ˈbæθtʌb/',     'Noun', 'A large container for bathing',              'bồn tắm',              'She soaked in the bathtub for thirty minutes.',       'Cô ấy ngâm mình trong bồn tắm ba mươi phút.'),

-- ── Âm nhạc / Vui chơi ───────────────────────────────────────
('guitar',        'guitar',        '/ɡɪˈtɑːr/',     'Noun', 'A stringed musical instrument',              'đàn ghi-ta',           'He plays the guitar every evening.',                  'Anh ấy chơi đàn ghi-ta mỗi buổi tối.'),
('piano',         'piano',         '/piˈænoʊ/',     'Noun', 'A large keyboard musical instrument',        'đàn piano',            'She has been learning to play the piano for years.',  'Cô ấy đã học chơi đàn piano nhiều năm.'),
('violin',        'violin',        '/ˌvaɪəˈlɪn/',   'Noun', 'A bowed stringed musical instrument',        'đàn vĩ cầm',           'The violin solo moved the entire audience.',          'Tiếng đàn vĩ cầm độc tấu xúc động toàn bộ khán giả.'),
('doll',          'doll',          '/dɒl/',          'Noun', 'A toy figure representing a person',         'búp bê',               'The girl hugged her favorite doll.',                  'Bé gái ôm con búp bê yêu thích.'),
('basketball',    'basketball',    '/ˈbɑːskɪtbɔːl/','Noun', 'A ball used in the sport of basketball',     'bóng rổ',              'They played basketball after school.',                'Họ chơi bóng rổ sau giờ học.'),
('football',      'football',      '/ˈfʊtbɔːl/',    'Noun', 'A ball used in football or soccer',          'bóng đá',              'He kicked the football into the net.',                'Anh ấy sút bóng đá vào lưới.'),
('toy',           'toy',           '/tɔɪ/',          'Noun', 'An object designed for children to play with','đồ chơi',             'The child plays with colorful toys.',                 'Đứa trẻ chơi với những đồ chơi sặc sỡ.'),
('ball',          'ball',          '/bɔːl/',         'Noun', 'A round object used in sports and games',    'quả bóng',             'The dog chased the ball in the park.',                'Con chó đuổi theo quả bóng trong công viên.'),

-- ── Thực phẩm thêm ────────────────────────────────────────────
('bread',         'bread',         '/brɛd/',         'Noun', 'A baked food made from flour',               'bánh mì',              'She bought a loaf of fresh bread from the bakery.',   'Cô ấy mua một ổ bánh mì tươi từ tiệm bánh.'),
('wine glass',    'wine glass',    '/waɪn ɡlɑːs/',  'Noun', 'A glass designed for drinking wine',         'ly rượu vang',         'She raised her wine glass in a toast.',               'Cô ấy nâng ly rượu vang để chúc mừng.'),

-- ── Giao thông thêm ───────────────────────────────────────────
('street light',  'street light',  '/striːt laɪt/',  'Noun', 'A lamp mounted on a post to light streets', 'đèn đường',            'The street lights automatically turn on at dusk.',    'Đèn đường tự động bật khi trời nhá nhem tối.'),
('fire hydrant',  'fire hydrant',  '/faɪr ˈhaɪdrənt/','Noun','A pipe for firefighters to access water',   'họng cứu hỏa',         'The fire hydrant is painted bright red.',             'Họng cứu hỏa được sơn màu đỏ tươi.'),
('parking meter', 'parking meter', '/ˈpɑːrkɪŋ miːtər/','Noun','A device for collecting parking fees',    'đồng hồ tính tiền đỗ xe','Put a coin in the parking meter before parking.',   'Bỏ đồng xu vào đồng hồ trước khi đỗ xe.'),
('street sign',   'street sign',   '/striːt saɪn/',  'Noun', 'A sign that provides road information',      'biển chỉ đường',       'Follow the street sign to find the hospital.',        'Theo dõi biển chỉ đường để tìm bệnh viện.'),

-- ── Đồ nội thất thêm / Môi trường ─────────────────────────────
('barstool',      'barstool',      '/ˈbɑːrstuːl/',  'Noun', 'A tall seat used at a bar or counter',       'ghế cao quầy bar',     'She sat on a barstool at the coffee counter.',        'Cô ấy ngồi trên ghế cao quầy cà phê.'),
('wall clock',    'wall clock',    '/wɔːl klɒk/',   'Noun', 'A clock mounted on a wall',                  'đồng hồ treo tường',   'The wall clock struck twelve at noon.',               'Đồng hồ treo tường điểm mười hai giờ trưa.'),
('paper clip',    'paper clip',    '/ˈpeɪpər klɪp/','Noun', 'A bent wire used to hold papers together',   'kẹp giấy',             'He attached the papers with a paper clip.',           'Anh ấy kẹp các tờ giấy lại bằng kẹp giấy.'),
('pencil case',   'pencil case',   '/ˈpɛnsɪl keɪs/','Noun', 'A container for holding pens and pencils',  'hộp bút',              'She keeps her markers in a pencil case.',             'Cô ấy để bút lông trong hộp bút.'),
('soundbar',      'soundbar',      '/ˈsaʊndbɑːr/',  'Noun', 'An elongated speaker for enhanced audio',    'loa thanh',            'He connected the soundbar to his TV.',                'Anh ấy kết nối loa thanh với tivi.'),
('game controller','game controller','/ɡeɪm kənˈtroʊlər/','Noun','A handheld device for playing video games','tay cầm chơi game', 'She used the game controller to play her favorite game.','Cô ấy dùng tay cầm để chơi trò chơi yêu thích.'),
('display',       'display',       '/dɪˈspleɪ/',    'Noun', 'A screen that shows information',            'màn hình hiển thị',    'The store display showed the new products.',          'Màn hình trưng bày của cửa hàng hiện sản phẩm mới.'),
('computer',      'computer',      '/kəmˈpjuːtər/', 'Noun', 'An electronic device for processing data',   'máy tính',             'She works on her computer all day.',                  'Cô ấy làm việc trên máy tính cả ngày.'),

-- ── Đồ ngoài trời / Phương tiện ────────────────────────────────
('baseball bat',  'baseball bat',  '/ˈbeɪsbɔːl bæt/','Noun','A rounded stick used to hit a baseball',    'gậy bóng chày',        'He swung the baseball bat with great force.',         'Anh ấy vung gậy bóng chày với sức mạnh lớn.'),
('baseball glove','baseball glove','/ˈbeɪsbɔːl ɡlʌv/','Noun','A padded glove used in baseball',         'găng tay bóng chày',   'The catcher wore a large baseball glove.',            'Người bắt bóng đeo găng tay bóng chày to.'),
('kite',          'kite',          '/kaɪt/',         'Noun', 'A toy that flies in the wind on a string',  'con diều',             'Children fly kites in the park on weekends.',         'Trẻ em thả diều trong công viên vào cuối tuần.'),
('frisbee',       'frisbee',       '/ˈfrɪzbi/',      'Noun', 'A plastic disc thrown as a toy',            'đĩa ném frisbee',      'They threw the frisbee on the beach.',                'Họ ném đĩa frisbee trên bãi biển.'),
('skis',          'skis',          '/skiːz/',         'Noun', 'Long flat boards used for sliding on snow', 'ván trượt tuyết',       'He strapped on his skis at the top of the slope.',   'Anh ấy buộc ván trượt tuyết ở đỉnh dốc.'),
('snowboard',     'snowboard',     '/ˈsnoʊbɔːrd/',  'Noun', 'A board for sliding down snowy slopes',     'ván trượt tuyết đơn',  'She learned to snowboard last winter.',               'Cô ấy học trượt ván tuyết mùa đông năm ngoái.'),
('surfboard',     'surfboard',     '/ˈsɜːrfbɔːrd/', 'Noun', 'A board for riding ocean waves',            'ván lướt sóng',        'He carried his surfboard to the beach.',              'Anh ấy mang ván lướt sóng ra bãi biển.'),
('skateboard',    'skateboard',    '/ˈskeɪtbɔːrd/', 'Noun', 'A board with wheels for skating',           'ván trượt',            'He performs tricks on his skateboard.',               'Anh ấy thực hiện các màn nhào lộn trên ván trượt.'),
('sports ball',   'sports ball',   '/spɔːrts bɔːl/', 'Noun', 'A ball used in sports',                    'bóng thể thao',        'The referee kicked the sports ball onto the field.',  'Trọng tài đá bóng ra sân.'),

-- ── Ẩm thực nâng cao ──────────────────────────────────────────
('bottle',        'bottle',        '/ˈbɒtl/',        'Noun', 'A container with a narrow neck for liquids', 'cái chai',             'Please fill the bottle with water.',                  'Vui lòng đổ đầy nước vào chai.'),
('water bottle',  'water bottle',  '/ˈwɔːtər ˈbɒtl/','Noun','A portable container for drinking water',   'bình nước cá nhân',    'Always carry a water bottle when you exercise.',      'Hãy luôn mang theo bình nước khi tập thể dục.'),

-- ── Các mục còn thiếu trong Objects365 ─────────────────────────
('laptop bag',    'laptop bag',    '/ˈlæptɒp bæɡ/', 'Noun', 'A bag designed to carry a laptop',          'túi đựng laptop',      'He put his laptop in the laptop bag.',                'Anh ấy bỏ laptop vào túi đựng laptop.'),
('phone case',    'phone case',    '/foʊn keɪs/',   'Noun', 'A protective cover for a mobile phone',      'ốp lưng điện thoại',   'She bought a new phone case for her device.',         'Cô ấy mua ốp lưng mới cho điện thoại.'),
('headband',      'headband',      '/ˈhɛdbænd/',    'Noun', 'A band worn around the head',                'băng đầu',             'She wore a headband to keep her hair back.',          'Cô ấy đeo băng đầu để buộc tóc ra sau.'),
('umbrella',      'umbrella',      '/ʌmˈbrɛlə/',    'Noun', 'A device used for protection from rain',     'cái ô / dù',           'Do not forget to bring an umbrella today.',           'Đừng quên mang ô hôm nay.'),
('suitcase',      'suitcase',      '/ˈsuːtkeɪs/',   'Noun', 'A large bag with a handle for travel',       'vali',                 'She packed her suitcase for the business trip.',      'Cô ấy đóng gói vali cho chuyến công tác.'),
('handbag',       'handbag',       '/ˈhændbæɡ/',    'Noun', 'A small bag carried in the hand or on the shoulder','túi xách tay','She bought a leather handbag at the store.',         'Cô ấy mua một chiếc túi da tại cửa hàng.'),
('backpack',      'backpack',      '/ˈbækpæk/',     'Noun', 'A bag carried on the back',                  'ba lô',                'He carries his school books in a backpack.',          'Anh ấy đựng sách vở trong ba lô.'),
('tie',           'tie',           '/taɪ/',          'Noun', 'A strip of cloth worn around the neck',      'cà vạt',               'He wears a tie to every formal occasion.',            'Anh ấy đeo cà vạt ở mọi dịp trang trọng.'),
('mobile phone',  'mobile phone',  '/ˈmoʊbaɪl foʊn/','Noun','A wireless handheld telephone',             'điện thoại di động',   'She calls her mother every day on her mobile phone.', 'Cô ấy gọi điện cho mẹ mỗi ngày bằng điện thoại di động.'),
('notebook',      'notebook',      '/ˈnoʊtbʊk/',    'Noun', 'A book with blank or lined pages for writing','sổ ghi chép',         'She wrote her ideas in a small notebook.',            'Cô ấy ghi lại ý tưởng vào cuốn sổ nhỏ.'),
('paper',         'paper',         '/ˈpeɪpər/',     'Noun', 'A thin material used for writing',           'tờ giấy',              'He printed the report on white paper.',               'Anh ấy in báo cáo ra giấy trắng.'),
('book',          'book',          '/bʊk/',          'Noun', 'A set of written or printed pages',          'cuốn sách',            'She reads a book before going to sleep.',             'Cô ấy đọc sách trước khi đi ngủ.'),
('clock',         'clock',         '/klɒk/',         'Noun', 'A device for telling time',                  'đồng hồ',              'The clock shows it is time for lunch.',               'Đồng hồ cho thấy đã đến giờ ăn trưa.'),
('vase',          'vase',          '/vɑːz/',         'Noun', 'A container for displaying flowers',         'bình hoa',             'She put fresh flowers in the vase.',                  'Cô ấy cắm hoa tươi vào bình.'),
('teddy bear',    'teddy bear',    '/ˈtɛdi bɛr/',   'Noun', 'A soft toy in the shape of a bear',         'gấu bông',             'The child slept with her teddy bear.',                'Đứa bé ngủ ôm gấu bông.'),
('potted plant',  'potted plant',  '/ˈpɒtɪd plɑːnt/','Noun','A plant growing in a container',            'cây trồng trong chậu', 'She placed a potted plant on the windowsill.',        'Cô ấy đặt cây trồng trong chậu trên bậu cửa sổ.')

ON CONFLICT (coco_class) DO NOTHING;

