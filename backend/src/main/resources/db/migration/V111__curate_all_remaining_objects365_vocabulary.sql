-- V111: Curate authentic Vietnamese translations, phonetics, and definitions for all remaining Objects365 canonical words
-- Resolves placeholders such as 'power outlet', 'toothbrush', 'pen/pencil', 'slippers', etc.

UPDATE words
SET en_word = 'bracelet',
    phonetic = '/ˈbreɪ.slət/',
    pos = 'Noun',
    translation = 'vòng tay / lắc tay',
    definition = 'A piece of ornamental jewelry worn around the wrist.',
    example_en = 'She wore a delicate gold bracelet on her left wrist.',
    example_vn = 'Cô ấy đeo một chiếc lắc tay vàng thanh mảnh trên cổ tay trái.'
WHERE detection_label = 'bracelet';

UPDATE words
SET en_word = 'helmet',
    phonetic = '/ˈhel.mət/',
    pos = 'Noun',
    translation = 'mũ bảo hiểm',
    definition = 'A hard protective hat worn by motorcyclists, cyclists, and workers.',
    example_en = 'Wearing a helmet saves lives during accidents.',
    example_vn = 'Đội mũ bảo hiểm giúp cứu mạng trong các vụ tai nạn.'
WHERE detection_label = 'helmet';

UPDATE words
SET en_word = 'pigeon',
    phonetic = '/ˈpɪdʒ.ən/',
    pos = 'Noun',
    translation = 'chim bồ câu',
    definition = 'A stout-bodied bird with short legs, common in urban parks.',
    example_en = 'Pigeons gathered around the park bench hoping for breadcrumbs.',
    example_vn = 'Những chú chim bồ câu tụ tập quanh ghế đá công viên mong được cho mẩu bánh mì.'
WHERE detection_label = 'pigeon';

UPDATE words
SET en_word = 'gloves',
    phonetic = '/ɡlʌvz/',
    pos = 'Noun',
    translation = 'găng tay / bao tay',
    definition = 'A covering for the hand with separate sheaths for each finger.',
    example_en = 'Wear thick leather gloves when handling thorny plants.',
    example_vn = 'Hãy đeo găng tay da dày khi xử lý các cây có gai.'
WHERE detection_label = 'gloves';

UPDATE words
SET en_word = 'flag',
    phonetic = '/flæɡ/',
    pos = 'Noun',
    translation = 'lá cờ / quốc kỳ',
    definition = 'A piece of cloth with a national emblem or design.',
    example_en = 'The national flag flew proudly at the top of the pole.',
    example_vn = 'Lá quốc kỳ tung bay kiêu hãnh trên đỉnh cột cờ.'
WHERE detection_label = 'flag';

UPDATE words
SET en_word = 'microphone',
    phonetic = '/ˈmaɪ.krə.foʊn/',
    pos = 'Noun',
    translation = 'micrô / mic thu âm',
    definition = 'An acoustic-to-electric transducer that converts sound into an electrical signal.',
    example_en = 'He sang his song warmly into the studio microphone.',
    example_vn = 'Anh ấy hát bài hát của mình đầy ấm áp vào chiếc micrô trong phòng thu.'
WHERE detection_label = 'microphone';

UPDATE words
SET en_word = 'SUV',
    phonetic = '/ˌes.juːˈviː/',
    pos = 'Noun',
    translation = 'xe thể thao đa dụng / xe SUV',
    definition = 'A sport utility vehicle combining passenger car comfort with off-road capability.',
    example_en = 'A spacious SUV is an ideal family car for weekend road trips.',
    example_vn = 'Một chiếc xe SUV rộng rãi là chiếc xe gia đình lý tưởng cho những chuyến đi cuối tuần.'
WHERE detection_label = 'suv';

UPDATE words
SET en_word = 'slippers',
    phonetic = '/ˈslɪp.ɚz/',
    pos = 'Noun',
    translation = 'dép đi trong nhà',
    definition = 'Soft, light indoor footwear that is easy to put on and take off.',
    example_en = 'Slip into these cozy fleece slippers to keep your toes warm.',
    example_vn = 'Hãy xỏ vào đôi dép đi trong nhà ấm áp này để giữ ấm các ngón chân.'
WHERE detection_label = 'slippers';

UPDATE words
SET en_word = 'stool',
    phonetic = '/stuːl/',
    pos = 'Noun',
    translation = 'ghế đẩu',
    definition = 'A simple seat without back or armrests.',
    example_en = 'He sat on a tall wooden stool beside the kitchen breakfast bar.',
    example_vn = 'Anh ấy ngồi trên một chiếc ghế đẩu gỗ cao bên cạnh quầy bar ăn sáng.'
WHERE detection_label = 'stool';

UPDATE words
SET en_word = 'van',
    phonetic = '/væn/',
    pos = 'Noun',
    translation = 'xe tải nhỏ / xe van',
    definition = 'A medium-sized road vehicle used for transporting goods or passengers.',
    example_en = 'The delivery van dropped off several parcels at our doorstep.',
    example_vn = 'Chiếc xe tải nhỏ giao hàng đã giao vài bưu kiện ngay trước cửa nhà chúng tôi.'
WHERE detection_label = 'van';

UPDATE words
SET en_word = 'sandals',
    phonetic = '/ˈsæn.dəlz/',
    pos = 'Noun',
    translation = 'dép quai hậu / xăng-đan',
    definition = 'Open-toed footwear secured to the foot by straps.',
    example_en = 'She wore lightweight leather sandals on her walking tour.',
    example_vn = 'Cô ấy đi một đôi dép quai hậu bằng da nhẹ nhàng trong chuyến đi bộ.'
WHERE detection_label = 'sandals';

UPDATE words
SET en_word = 'basket',
    phonetic = '/ˈbæs.kət/',
    pos = 'Noun',
    translation = 'cái giỏ / cái rổ',
    definition = 'A container made of interwoven cane, wood, or plastic.',
    example_en = 'She carried a wicker basket filled with fresh fruit.',
    example_vn = 'Cô ấy xách một chiếc giỏ mây chứa đầy trái cây tươi.'
WHERE detection_label = 'basket';

UPDATE words
SET en_word = 'drum',
    phonetic = '/drʌm/',
    pos = 'Noun',
    translation = 'cái trống',
    definition = 'A percussion instrument played with drumsticks or hands.',
    example_en = 'He played a steady rhythm on the snare drum.',
    example_vn = 'Anh ấy đánh một nhịp điệu đều đặn trên chiếc trống.'
WHERE detection_label = 'drum';

UPDATE words
SET en_word = 'pen / pencil',
    phonetic = '/pen / ˈpen.səl/',
    pos = 'Noun',
    translation = 'bút mực / bút chì',
    definition = 'Writing implements used for recording text or drawing sketches.',
    example_en = 'Always keep a working pen and pencil in your pencil case.',
    example_vn = 'Luôn mang theo bút mực và bút chì trong hộp bút của bạn.'
WHERE detection_label = 'pen/pencil';

UPDATE words
SET en_word = 'wild bird',
    phonetic = '/waɪld bɝːd/',
    pos = 'Noun',
    translation = 'chim hoang dã',
    definition = 'A bird living in natural unconfined habitats.',
    example_en = 'We heard the melodious song of a colorful wild bird in the tree.',
    example_vn = 'Chúng tôi nghe thấy tiếng hót du dương của một chú chim hoang dã trên cây.'
WHERE detection_label = 'wild bird';

UPDATE words
SET en_word = 'high heels',
    phonetic = '/ˌhaɪ ˈhiːlz/',
    pos = 'Noun',
    translation = 'giày cao gót',
    definition = 'Women''s footwear with elevated heels for formal occasions.',
    example_en = 'She wore elegant black high heels with her evening dress.',
    example_vn = 'Cô ấy đi một đôi giày cao gót màu đen thanh lịch cùng bộ váy dạ hội.'
WHERE detection_label = 'high heels';

UPDATE words
SET en_word = 'carpet',
    phonetic = '/ˈkɑːr.pət/',
    pos = 'Noun',
    translation = 'thảm trải sàn',
    definition = 'A thick woven floor covering made of wool or synthetic fibers.',
    example_en = 'A warm wool carpet covered the entire living room floor.',
    example_vn = 'Một tấm thảm len ấm áp trải kín toàn bộ sàn phòng khách.'
WHERE detection_label = 'carpet';

UPDATE words
SET en_word = 'canned food',
    phonetic = '/kænd fuːd/',
    pos = 'Noun',
    translation = 'đồ hộp / thực phẩm đóng hộp',
    definition = 'Food preserved and sealed in an airtight metal container.',
    example_en = 'They bought canned beans and soup for emergency food.',
    example_vn = 'Họ đã mua đậu đóng hộp và súp làm đồ ăn dự phòng.'
WHERE detection_label = 'canned';

UPDATE words
SET en_word = 'traffic cone',
    phonetic = '/ˈtræf.ɪk koʊn/',
    pos = 'Noun',
    translation = 'chóp nón giao thông',
    definition = 'A bright orange cone-shaped marker used to redirect vehicular traffic.',
    example_en = 'Workers lined bright orange traffic cones along the construction lane.',
    example_vn = 'Các công nhân xếp những chiếc chóp nón giao thông màu cam dọc theo làn đường thi công.'
WHERE detection_label = 'traffic cone';

UPDATE words
SET en_word = 'cymbal',
    phonetic = '/ˈsɪm.bəl/',
    pos = 'Noun',
    translation = 'chũm chọe / xập xõa',
    definition = 'A round brass percussion instrument struck with a drumstick.',
    example_en = 'The drummer hit the brass cymbal with great force.',
    example_vn = 'Tay trống đã đánh vào chiếc chũm chọe đồng với lực rất mạnh.'
WHERE detection_label = 'cymbal';

UPDATE words
SET en_word = 'lifebuoy / lifesaver',
    phonetic = '/ˈlaɪfˌseɪ.vɚ/',
    pos = 'Noun',
    translation = 'phao cứu sinh',
    definition = 'A buoyant ring or vest thrown to support someone in deep water.',
    example_en = 'The lifeguard threw a bright orange lifebuoy to the struggling swimmer.',
    example_vn = 'Nhân viên cứu hộ đã ném một chiếc phao cứu sinh màu cam sáng cho người bơi đang gặp nạn.'
WHERE detection_label = 'lifesaver';

UPDATE words
SET en_word = 'candle',
    phonetic = '/ˈkæn.dəl/',
    pos = 'Noun',
    translation = 'cây nến / ngọn nến',
    definition = 'A cylinder of wax with a central wick that burns to produce light.',
    example_en = 'She lit a scented candle to make the room smell sweet.',
    example_vn = 'Cô ấy thắp một ngọn nến thơm để căn phòng có hương thơm ngọt ngào.'
WHERE detection_label = 'candle';

UPDATE words
SET en_word = 'sailboat',
    phonetic = '/ˈseɪl.boʊt/',
    pos = 'Noun',
    translation = 'thuyền buồm',
    definition = 'A boat propelled primarily by sails caught by the wind.',
    example_en = 'The white sailboat glided peacefully across the blue bay.',
    example_vn = 'Chiếc thuyền buồm màu trắng lướt đi êm ả trên mặt vịnh xanh.'
WHERE detection_label = 'sailboat';

UPDATE words
SET en_word = 'awning',
    phonetic = '/ˈɑː.nɪŋ/',
    pos = 'Noun',
    translation = 'mái che / bạt che nắng',
    definition = 'A canvas sheet on a frame extended to protect from sun or rain.',
    example_en = 'We sat under the cafe awning during the rain.',
    example_vn = 'Chúng tôi ngồi dưới mái che của quán cà phê trong lúc trời mưa.'
WHERE detection_label = 'awning';

UPDATE words
SET en_word = 'camping tent',
    phonetic = '/tent/',
    pos = 'Noun',
    translation = 'lều cắm trại',
    definition = 'A portable fabric shelter supported by poles and pinned by guy ropes.',
    example_en = 'We pitched our waterproof camping tent under the pine trees.',
    example_vn = 'Chúng tôi dựng chiếc lều cắm trại chống nước dưới những tán cây thông.'
WHERE detection_label = 'tent';

UPDATE words
SET en_word = 'hockey stick',
    phonetic = '/ˈhɑː.ki stɪk/',
    pos = 'Noun',
    translation = 'gậy khúc côn cầu',
    definition = 'A long wooden or composite stick curved at the end used in hockey.',
    example_en = 'He used his hockey stick to pass the puck to his teammate.',
    example_vn = 'Anh ấy dùng gậy khúc côn cầu để chuyền bóng cho đồng đội.'
WHERE detection_label = 'hockey stick';

UPDATE words
SET en_word = 'paddle / oar',
    phonetic = '/ˈpæd.əl/',
    pos = 'Noun',
    translation = 'mái chèo',
    definition = 'A short pole with a broad flat blade used to propel a canoe or kayak.',
    example_en = 'He dipped his wooden paddle into the water to steer the canoe.',
    example_vn = 'Anh ấy nhúng mái chèo gỗ xuống nước để điều khiển chiếc ca-nô.'
WHERE detection_label = 'paddle';

UPDATE words
SET en_word = 'pickup truck',
    phonetic = '/ˈpɪk.ʌp ˌtrʌk/',
    pos = 'Noun',
    translation = 'xe bán tải',
    definition = 'A light truck with an open-top cargo bed at the back.',
    example_en = 'The contractor loaded bags of cement into his pickup truck.',
    example_vn = 'Người thầu xây dựng đã chất những bao xi măng lên chiếc xe bán tải của mình.'
WHERE detection_label = 'pickup truck';

UPDATE words
SET en_word = 'traffic sign',
    phonetic = '/ˈtræf.ɪk saɪn/',
    pos = 'Noun',
    translation = 'biển báo giao thông',
    definition = 'A roadside display instructing drivers on road rules and warnings.',
    example_en = 'Obeying every traffic sign ensures safety for all road users.',
    example_vn = 'Tuân thủ mọi biển báo giao thông đảm bảo an toàn cho tất cả người tham gia giao thông.'
WHERE detection_label = 'traffic sign';

UPDATE words
SET en_word = 'balloon',
    phonetic = '/bəˈluːn/',
    pos = 'Noun',
    translation = 'bóng bay',
    definition = 'A small rubber bag inflated with air or gas for decoration or toys.',
    example_en = 'Children love playing with colorful balloons.',
    example_vn = 'Trẻ em thích chơi với những quả bóng bay sặc sỡ.'
WHERE detection_label = 'balloon';

UPDATE words
SET en_word = 'tripod',
    phonetic = '/ˈtraɪ.pɑːd/',
    pos = 'Noun',
    translation = 'chân máy ảnh / giá ba chân',
    definition = 'A three-legged stand used for stabilizing a camera or telescope.',
    example_en = 'Mount your camera onto a sturdy tripod for clear night photography.',
    example_vn = 'Hãy gắn máy ảnh lên một chiếc chân máy ảnh vững chãi để chụp ảnh ban đêm sắc nét.'
WHERE detection_label = 'tripod';

UPDATE words
SET en_word = 'clothes hanger',
    phonetic = '/ˈhæŋ.ɚ/',
    pos = 'Noun',
    translation = 'móc treo quần áo',
    definition = 'A shaped piece of wood, plastic, or wire for hanging garments.',
    example_en = 'Hang your coat neatly on the clothes hanger.',
    example_vn = 'Hãy treo áo khoác của bạn gọn gàng lên chiếc móc quần áo.'
WHERE detection_label = 'hanger';

UPDATE words
SET en_word = 'fish',
    phonetic = '/fɪʃ/',
    pos = 'Noun',
    translation = 'con cá',
    definition = 'A limbless cold-blooded vertebrate living in water.',
    example_en = 'Colorful tropical fish darted among the coral reefs.',
    example_vn = 'Những chú cá nhiệt đới nhiều màu sắc lao nhanh giữa các rạn san hô.'
WHERE detection_label = 'other fish';

UPDATE words
SET en_word = 'baseball',
    phonetic = '/ˈbeɪs.bɑːl/',
    pos = 'Noun',
    translation = 'bóng chày / quả bóng chày',
    definition = 'A ball game played with a bat and ball between two teams.',
    example_en = 'The boy caught the flying baseball with his glove.',
    example_vn = 'Cậu bé bắt được quả bóng chày đang bay bằng găng tay của mình.'
WHERE detection_label = 'baseball';

UPDATE words
SET en_word = 'power outlet',
    phonetic = '/ˈpaʊ.ɚ ˌaʊt.let/',
    pos = 'Noun',
    translation = 'ổ cắm điện',
    definition = 'A wall socket connected to electricity into which plugs are inserted.',
    example_en = 'Plug the laptop adapter safely into the power outlet.',
    example_vn = 'Hãy cắm sạc laptop cẩn thận vào ổ cắm điện.'
WHERE detection_label = 'power outlet';

UPDATE words
SET en_word = 'napkin',
    phonetic = '/ˈnæp.kɪn/',
    pos = 'Noun',
    translation = 'khăn ăn / giấy ăn',
    definition = 'A square piece of cloth or paper used at table to wipe fingers or lips.',
    example_en = 'Dab your mouth gently with the dining napkin.',
    example_vn = 'Hãy chấm nhẹ miệng bằng chiếc khăn ăn.'
WHERE detection_label = 'napkin';

UPDATE words
SET en_word = 'stuffed toy / teddy bear',
    phonetic = '/ˌstʌft ˈtɔɪ/',
    pos = 'Noun',
    translation = 'thú nhồi bông / gấu bông',
    definition = 'A soft fabric toy filled with cotton or plush material.',
    example_en = 'The little girl cuddled her fluffy stuffed teddy bear to sleep.',
    example_vn = 'Bé gái ôm chặt chú gấu bông mềm mại của mình để đi vào giấc ngủ.'
WHERE detection_label = 'stuffed toy';

UPDATE words
SET en_word = 'orange / tangerine',
    phonetic = '/ˈɔːr.ɪndʒ / ˈtæn.dʒə.riːn/',
    pos = 'Noun',
    translation = 'quả cam / quả quýt',
    definition = 'A round sweet citrus fruit with peelable orange rind.',
    example_en = 'A freshly peeled juicy sweet orange gives you plenty of vitamin C.',
    example_vn = 'Một quả cam ngọt mọng nước vừa bóc vỏ cung cấp cho bạn nhiều vitamin C.'
WHERE detection_label = 'orange/tangerine';

UPDATE words
SET en_word = 'toiletries',
    phonetic = '/ˈtɔɪ.lə.triz/',
    pos = 'Noun',
    translation = 'đồ vệ sinh cá nhân',
    definition = 'Articles used in washing, dressing, and personal hygiene.',
    example_en = 'Pack your travel-sized toiletries in a waterproof pouch.',
    example_vn = 'Hãy xếp các đồ vệ sinh cá nhân cỡ nhỏ du lịch vào một chiếc túi chống nước.'
WHERE detection_label = 'toiletry';

UPDATE words
SET en_word = 'tomato',
    phonetic = '/təˈmeɪ.t̬oʊ/',
    pos = 'Noun',
    translation = 'quả cà chua',
    definition = 'A glossy red juicy edible fruit eaten cooked or raw in salads.',
    example_en = 'Fresh ripe red tomatoes make a healthy nutrient-dense soup base.',
    example_vn = 'Những quả cà chua đỏ chín mọng tạo nên phần nước dùng súp lành mạnh bổ dưỡng.'
WHERE detection_label = 'tomato';

UPDATE words
SET en_word = 'lantern',
    phonetic = '/ˈlæn.tɚn/',
    pos = 'Noun',
    translation = 'đèn lồng',
    definition = 'A lamp with a protective casing around a light source.',
    example_en = 'Red paper lanterns lit up the streets during the Mid-Autumn festival.',
    example_vn = 'Những chiếc đèn lồng giấy đỏ thắp sáng các con phố trong dịp lễ Trung thu.'
WHERE detection_label = 'lantern';

UPDATE words
SET en_word = 'construction vehicle',
    phonetic = '/məˈʃiː.nɚ.i ˈviː.ə.kəl/',
    pos = 'Noun',
    translation = 'xe cơ giới / máy công trình',
    definition = 'Heavy motorized machinery used for excavation and civil engineering.',
    example_en = 'The bulldozer is an essential construction vehicle on building sites.',
    example_vn = 'Xe ủi đất là một loại xe cơ giới thiết yếu trên các công trường xây dựng.'
WHERE detection_label = 'machinery vehicle';

UPDATE words
SET en_word = 'green vegetables',
    phonetic = '/ɡriːn ˈvedʒ.tə.bəlz/',
    pos = 'Noun',
    translation = 'rau xanh',
    definition = 'Leafy edible green plants rich in dietary fiber.',
    example_en = 'Eating green vegetables daily keeps your body healthy.',
    example_vn = 'Ăn rau xanh mỗi ngày giúp cơ thể bạn luôn khỏe mạnh.'
WHERE detection_label = 'green vegetables';

UPDATE words
SET en_word = 'pumpkin',
    phonetic = '/ˈpʌmp.kɪn/',
    pos = 'Noun',
    translation = 'quả bí ngô / bí đỏ',
    definition = 'A large rounded orange squash commonly associated with autumn.',
    example_en = 'Creamy pumpkin soup is a delicious autumn comfort food.',
    example_vn = 'Súp bí đỏ béo ngậy là một món ăn ấm áp tuyệt vời vào mùa thu.'
WHERE detection_label = 'pumpkin';

UPDATE words
SET en_word = 'soccer ball',
    phonetic = '/ˈsɑː.kɚ bɑːl/',
    pos = 'Noun',
    translation = 'quả bóng đá',
    definition = 'A round leather ball kicked between teams in the sport of soccer.',
    example_en = 'The goalkeeper dived courageously to catch the flying soccer ball.',
    example_vn = 'Thủ môn đã dũng cảm bay người để bắt gọn quả bóng đá đang bay tới.'
WHERE detection_label = 'soccer';

UPDATE words
SET en_word = 'snowboard / ski',
    phonetic = '/ˈskiː.bɔːrd/',
    pos = 'Noun',
    translation = 'ván trượt tuyết',
    definition = 'A board used for gliding over snow on mountains.',
    example_en = 'He carved smoothly through the powder snow on his new snowboard.',
    example_vn = 'Anh ấy lướt mượt mà qua lớp tuyết xốp trên chiếc ván trượt tuyết mới.'
WHERE detection_label = 'skiboard';

UPDATE words
SET en_word = 'luggage / suitcase',
    phonetic = '/ˈlʌɡ.ɪdʒ/',
    pos = 'Noun',
    translation = 'hành lý / vali',
    definition = 'Suitcases, bags, and baggage belonging to a traveler.',
    example_en = 'Please place your heavy luggage onto the airport scales.',
    example_vn = 'Vui lòng đặt hành lý nặng của bạn lên cân sân bay.'
WHERE detection_label = 'luggage';

UPDATE words
SET en_word = 'nightstand / bedside table',
    phonetic = '/ˈnaɪt.stænd/',
    pos = 'Noun',
    translation = 'tủ đầu giường / bàn đầu giường',
    definition = 'A small table or cabinet placed beside a bed.',
    example_en = 'He kept an alarm clock and lamp on his wooden nightstand.',
    example_vn = 'Anh ấy để một chiếc đồng hồ báo thức và đèn ngủ trên chiếc tủ đầu giường bằng gỗ.'
WHERE detection_label = 'nightstand';

UPDATE words
SET en_word = 'teapot',
    phonetic = '/ˈtiː.pɑːt/',
    pos = 'Noun',
    translation = 'ấm pha trà',
    definition = 'A ceramic or metal pot with a spout and handle used for steeping tea.',
    example_en = 'She poured fragrant green tea from an antique ceramic teapot.',
    example_vn = 'Cô ấy rót trà xanh thơm ngát từ một chiếc ấm pha trà bằng gốm cổ.'
WHERE detection_label = 'tea pot';

UPDATE words
SET en_word = 'telephone',
    phonetic = '/ˈtel.ə.foʊn/',
    pos = 'Noun',
    translation = 'điện thoại bàn',
    definition = 'A telecommunication apparatus used for voice transmission.',
    example_en = 'The landline telephone on the office reception desk rang loudly.',
    example_vn = 'Chiếc điện thoại bàn trên quầy lễ tân văn phòng reo vang.'
WHERE detection_label = 'telephone';

UPDATE words
SET en_word = 'shopping trolley / cart',
    phonetic = '/ˈtrɑː.li/',
    pos = 'Noun',
    translation = 'xe đẩy mua sắm',
    definition = 'A metal wheeled basket used by supermarket shoppers.',
    example_en = 'She filled her supermarket shopping trolley with fresh groceries.',
    example_vn = 'Cô ấy chất đầy hàng tạp hóa tươi ngon vào chiếc xe đẩy mua sắm ở siêu thị.'
WHERE detection_label = 'trolley';

UPDATE words
SET en_word = 'headphones',
    phonetic = '/ˈhed.foʊnz/',
    pos = 'Noun',
    translation = 'tai nghe chụp tai',
    definition = 'A pair of audio speakers worn over or on the ears.',
    example_en = 'Put on your noise-canceling headphones to study quietly.',
    example_vn = 'Hãy đeo tai nghe chụp tai chống ồn để học bài yên tĩnh.'
WHERE detection_label = 'head phone';

UPDATE words
SET en_word = 'sports car',
    phonetic = '/ˈspɔːrts kɑːr/',
    pos = 'Noun',
    translation = 'xe thể thao',
    definition = 'A low, aerodynamic high-performance automobile.',
    example_en = 'The red sports car accelerated smoothly down the open racetrack.',
    example_vn = 'Chiếc xe thể thao màu đỏ tăng tốc mượt mà trên đường đua rộng mở.'
WHERE detection_label = 'sports car';

UPDATE words
SET en_word = 'dessert',
    phonetic = '/dɪˈzɝːt/',
    pos = 'Noun',
    translation = 'món tráng miệng',
    definition = 'A sweet course eaten at the end of a main meal.',
    example_en = 'We enjoyed chocolate cake and ice cream for dessert.',
    example_vn = 'Chúng tôi thưởng thức bánh sô cô la và kem cho món tráng miệng.'
WHERE detection_label = 'dessert';

UPDATE words
SET en_word = 'scooter',
    phonetic = '/ˈskuː.t̬ɚ/',
    pos = 'Noun',
    translation = 'xe trượt scooter / xe tay ga',
    definition = 'A small two-wheeled vehicle steered with a handlebar.',
    example_en = 'The boy rode his kick scooter along the paved park walkway.',
    example_vn = 'Cậu bé đi chiếc xe trượt scooter dọc theo lối đi lát gạch của công viên.'
WHERE detection_label = 'scooter';

UPDATE words
SET en_word = 'baby stroller',
    phonetic = '/ˈstroʊ.lɚ/',
    pos = 'Noun',
    translation = 'xe đẩy em bé',
    definition = 'A four-wheeled chair designed for wheeling a baby around outdoors.',
    example_en = 'The mother pushed her sleeping infant in a modern baby stroller.',
    example_vn = 'Người mẹ nhẹ nhàng đẩy đứa con đang ngủ say trên chiếc xe đẩy em bé hiện đại.'
WHERE detection_label = 'stroller';

UPDATE words
SET en_word = 'crane',
    phonetic = '/kreɪn/',
    pos = 'Noun',
    translation = 'cần cẩu',
    definition = 'A tall, large machine used for lifting and moving heavy construction objects.',
    example_en = 'The tower crane lifted heavy steel beams to the top floor.',
    example_vn = 'Chiếc cần cẩu tháp đã nâng những thanh dầm thép nặng lên tầng cao nhất.'
WHERE detection_label = 'crane';

UPDATE words
SET en_word = 'lemon',
    phonetic = '/ˈlem.ən/',
    pos = 'Noun',
    translation = 'quả chanh vàng',
    definition = 'A sour, oval yellow citrus fruit with aromatic rind.',
    example_en = 'Squeeze some fresh lemon juice over the grilled seafood.',
    example_vn = 'Hãy vắt một ít nước chanh vàng tươi lên món hải sản nướng.'
WHERE detection_label = 'lemon';

UPDATE words
SET en_word = 'duck',
    phonetic = '/dʌk/',
    pos = 'Noun',
    translation = 'con vịt',
    definition = 'A waterbird with webbed feet and a broad flat beak.',
    example_en = 'The ducks swam peacefully across the village pond.',
    example_vn = 'Những chú vịt bơi lội thanh bình trên ao làng.'
WHERE detection_label = 'duck';

UPDATE words
SET en_word = 'security camera / CCTV',
    phonetic = '/sɚˈveɪ.ləns ˈkæm.rə/',
    pos = 'Noun',
    translation = 'camera an ninh / camera giám sát',
    definition = 'A video camera used for monitoring premises to deter crime.',
    example_en = 'The 24-hour surveillance camera oversees the main entrance gate.',
    example_vn = 'Chiếc camera giám sát 24/7 quản lý khu vực cổng ra vào chính.'
WHERE detection_label = 'surveillance camera';

UPDATE words
SET en_word = 'gun',
    phonetic = '/ɡʌn/',
    pos = 'Noun',
    translation = 'khẩu súng',
    definition = 'A weapon that fires bullets or projectiles through a metal barrel.',
    example_en = 'The security officer carried a licensed handgun.',
    example_vn = 'Nhân viên an ninh mang theo một khẩu súng ngắn có giấy phép.'
WHERE detection_label = 'gun';

UPDATE words
SET en_word = 'blackboard / whiteboard',
    phonetic = '/ˈblæk.bɔːrd / ˈwaɪt.bɔːrd/',
    pos = 'Noun',
    translation = 'bảng đen / bảng trắng',
    definition = 'A large board in a classroom for writing notes with chalk or markers.',
    example_en = 'The teacher wrote the math problem on the whiteboard.',
    example_vn = 'Giáo viên đã viết bài toán lên bảng trắng.'
WHERE detection_label = 'blackboard/whiteboard';

UPDATE words
SET en_word = 'ice skates / ski boots',
    phonetic = '/ˈskeɪ.tɪŋ ʃuːz/',
    pos = 'Noun',
    translation = 'giày trượt băng / giày trượt tuyết',
    definition = 'Stiff boots equipped with blades or bindings for snow and ice.',
    example_en = 'Lace up your ski boots securely before heading onto the slopes.',
    example_vn = 'Hãy buộc chặt dây giày trượt tuyết trước khi bước ra các sườn dốc.'
WHERE detection_label = 'skating and skiing shoes';

UPDATE words
SET en_word = 'gas stove',
    phonetic = '/ˈɡæs ˌstoʊv/',
    pos = 'Noun',
    translation = 'bếp gas',
    definition = 'A stove that uses natural gas as fuel for cooking.',
    example_en = 'She turned on the gas stove to heat the soup.',
    example_vn = 'Cô ấy bật bếp gas để đun nóng món súp.'
WHERE detection_label = 'gas stove';

UPDATE words
SET en_word = 'bow tie',
    phonetic = '/ˈboʊ ˌtaɪ/',
    pos = 'Noun',
    translation = 'nơ đeo cổ',
    definition = 'A man''s necktie tied in a bow around the collar.',
    example_en = 'He wore a stylish black bow tie with his tuxedo.',
    example_vn = 'Anh ấy đeo một chiếc nơ đen lịch lãm cùng bộ tuxedo.'
WHERE detection_label = 'bow tie';

UPDATE words
SET en_word = 'strawberry',
    phonetic = '/ˈstrɑːˌber.i/',
    pos = 'Noun',
    translation = 'quả dâu tây',
    definition = 'A sweet soft red fruit with small seed-like achenes on the surface.',
    example_en = 'Fresh ripe red strawberries are wonderful when paired with whipped cream.',
    example_vn = 'Những quả dâu tây đỏ chín mọng ăn cùng kem tươi đánh bông thì thật tuyệt vời.'
WHERE detection_label = 'strawberry';

UPDATE words
SET en_word = 'sports ball',
    phonetic = '/spɔːrts bɑːl/',
    pos = 'Noun',
    translation = 'quả bóng thể thao',
    definition = 'A spherical or oval ball used in various recreational games.',
    example_en = 'Children were playing with different colorful sports balls in the yard.',
    example_vn = 'Trẻ em đang chơi đùa với những quả bóng thể thao nhiều màu sắc trong sân.'
WHERE detection_label = 'other balls';

UPDATE words
SET en_word = 'shovel',
    phonetic = '/ˈʃʌv.əl/',
    pos = 'Noun',
    translation = 'cái xẻng',
    definition = 'A tool with a broad scoop and long handle for digging or moving earth.',
    example_en = 'He used a shovel to dig a hole for planting the tree.',
    example_vn = 'Anh ấy dùng xẻng để đào một cái hố trồng cây.'
WHERE detection_label = 'shovel';

UPDATE words
SET en_word = 'bell pepper / black pepper',
    phonetic = '/ˈpep.ɚ/',
    pos = 'Noun',
    translation = 'quả ớt chuông / hạt tiêu',
    definition = 'A pungent spice or sweet bell-shaped vegetable.',
    example_en = 'Colorful sweet bell peppers brighten up the stir-fry.',
    example_vn = 'Những quả ớt chuông ngọt nhiều màu làm món xào thêm phần bắt mắt.'
WHERE detection_label = 'pepper';

UPDATE words
SET en_word = 'computer case / PC tower',
    phonetic = '/kəmˈpjuː.t̬ɚ keɪs/',
    pos = 'Noun',
    translation = 'thùng máy tính / case PC',
    definition = 'The enclosure that contains the internal components of a desktop computer.',
    example_en = 'He built a powerful gaming PC inside an aluminum computer case.',
    example_vn = 'Anh ấy lắp ráp một chiếc PC chơi game mạnh mẽ bên trong thùng máy tính bằng nhôm.'
WHERE detection_label = 'computer box';

UPDATE words
SET en_word = 'toilet paper',
    phonetic = '/ˈtɔɪ.lət ˌpeɪ.pɚ/',
    pos = 'Noun',
    translation = 'giấy vệ sinh',
    definition = 'Soft paper tissue sold on rolls used for personal cleanliness.',
    example_en = 'Always make sure there is a spare roll of toilet paper in the restroom.',
    example_vn = 'Luôn đảm bảo có một cuộn giấy vệ sinh dự phòng trong phòng vệ sinh.'
WHERE detection_label = 'toilet paper';

UPDATE words
SET en_word = 'cleaning products',
    phonetic = '/ˈkliː.nɪŋ ˈprɑː.dʌkts/',
    pos = 'Noun',
    translation = 'chất tẩy rửa / đồ vệ sinh',
    definition = 'Chemicals and tools used for washing, scrubbing, and sanitizing.',
    example_en = 'Store cleaning products safely away from young children.',
    example_vn = 'Hãy cất các chất tẩy rửa cẩn thận tránh xa tầm tay trẻ nhỏ.'
WHERE detection_label = 'cleaning products';

UPDATE words
SET en_word = 'cutting board',
    phonetic = '/ˈkʌt̬.ɪŋ bɔːrd/',
    pos = 'Noun',
    translation = 'thớt nấu ăn',
    definition = 'A wooden or plastic board on which food is chopped or sliced.',
    example_en = 'Always clean the cutting board thoroughly after preparing meat.',
    example_vn = 'Luôn vệ sinh thớt thật sạch sau khi sơ chế thịt.'
WHERE detection_label = 'cutting/chopping board';

UPDATE words
SET en_word = 'coffee table',
    phonetic = '/ˈkɑː.fi ˌteɪ.bəl/',
    pos = 'Noun',
    translation = 'bàn trà / bàn sofa',
    definition = 'A low table situated in front of a sofa in a living room.',
    example_en = 'Magazines and a cup of tea were placed on the coffee table.',
    example_vn = 'Tạp chí và một tách trà được đặt trên bàn trà.'
WHERE detection_label = 'coffee table';

UPDATE words
SET en_word = 'side table / end table',
    phonetic = '/ˈsaɪd ˌteɪ.bəl/',
    pos = 'Noun',
    translation = 'bàn góc / bàn kê bên ghế',
    definition = 'A small low table placed beside an armchair or sofa.',
    example_en = 'He placed his reading glasses and book on the wooden side table.',
    example_vn = 'Anh ấy đặt kính đọc sách và quyển sách lên chiếc bàn góc bằng gỗ.'
WHERE detection_label = 'side table';

UPDATE words
SET en_word = 'pie',
    phonetic = '/paɪ/',
    pos = 'Noun',
    translation = 'bánh nướng / bánh pie',
    definition = 'A baked dish of fruit or meat with a top and base of pastry.',
    example_en = 'A slice of warm apple pie with cinnamon is a classic treat.',
    example_vn = 'Một lát bánh pie táo ấm nóng rắc quế là món ăn kinh điển.'
WHERE detection_label = 'pie';

UPDATE words
SET en_word = 'ladder',
    phonetic = '/ˈlæd.ɚ/',
    pos = 'Noun',
    translation = 'cái thang',
    definition = 'A structure consisting of rungs between two uprights, used for climbing.',
    example_en = 'He climbed the aluminum ladder to paint the high ceiling.',
    example_vn = 'Anh ấy trèo lên chiếc thang nhôm để sơn trần nhà cao.'
WHERE detection_label = 'ladder';

UPDATE words
SET en_word = 'cookies',
    phonetic = '/ˈkʊk.iz/',
    pos = 'Noun',
    translation = 'bánh quy',
    definition = 'Small sweet baked flat cakes, often with chocolate chips.',
    example_en = 'Grandma baked a batch of warm chocolate chip cookies.',
    example_vn = 'Bà đã nướng một mẻ bánh quy sô cô la thơm ngon.'
WHERE detection_label = 'cookies';

UPDATE words
SET en_word = 'radiator / heater',
    phonetic = '/ˈreɪ.di.eɪ.t̬ɚ/',
    pos = 'Noun',
    translation = 'lò sưởi / bộ tản nhiệt',
    definition = 'A heating device consisting of pipes through which hot water passes.',
    example_en = 'The radiator kept the bedroom warm on freezing winter nights.',
    example_vn = 'Lò sưởi giữ cho phòng ngủ luôn ấm áp trong những đêm mùa đông giá rét.'
WHERE detection_label = 'radiator';

UPDATE words
SET en_word = 'grape',
    phonetic = '/ɡreɪp/',
    pos = 'Noun',
    translation = 'quả nho',
    definition = 'A small sweet purple or green berry growing in clusters.',
    example_en = 'She picked a sweet, juicy green grape from the bunch.',
    example_vn = 'Cô ấy hái một quả nho xanh ngọt mọng nước từ chùm nho.'
WHERE detection_label = 'grape';

UPDATE words
SET en_word = 'potato',
    phonetic = '/pəˈteɪ.t̬oʊ/',
    pos = 'Noun',
    translation = 'củ khoai tây',
    definition = 'A starchy edible tuber cultivated worldwide as a staple vegetable.',
    example_en = 'Mashed potatoes with butter and garlic is a comforting side dish.',
    example_vn = 'Khoai tây nghiền với bơ và tỏi là một món ăn kèm rất dễ chịu.'
WHERE detection_label = 'potato';

UPDATE words
SET en_word = 'sausage',
    phonetic = '/ˈsɑː.sɪdʒ/',
    pos = 'Noun',
    translation = 'xúc xích',
    definition = 'Minced meat seasoned and encased in a cylindrical skin.',
    example_en = 'Grilled sausages are popular at weekend family barbecues.',
    example_vn = 'Xúc xích nướng rất được ưa chuộng trong các bữa tiệc nướng cuối tuần của gia đình.'
WHERE detection_label = 'sausage';

UPDATE words
SET en_word = 'tricycle',
    phonetic = '/ˈtraɪ.sə.kəl/',
    pos = 'Noun',
    translation = 'xe đạp ba bánh',
    definition = 'A three-wheeled pedal vehicle for toddlers and young children.',
    example_en = 'The toddler pedaled his colorful tricycle proudly around the patio.',
    example_vn = 'Đứa trẻ mới biết đi tự hào đạp chiếc xe đạp ba bánh quanh sân.'
WHERE detection_label = 'tricycle';

UPDATE words
SET en_word = 'egg',
    phonetic = '/eɡ/',
    pos = 'Noun',
    translation = 'quả trứng',
    definition = 'An oval body produced by a hen, used widely as a staple food.',
    example_en = 'She fried two fresh eggs for a quick breakfast.',
    example_vn = 'Cô ấy rán hai quả trứng tươi cho một bữa sáng nhanh gọn.'
WHERE detection_label = 'egg';

UPDATE words
SET en_word = 'fire extinguisher',
    phonetic = '/ˈfaɪr ɪkˌstɪŋ.ɡwɪ.ʃɚ/',
    pos = 'Noun',
    translation = 'bình chữa cháy',
    definition = 'A metal cylinder containing chemicals discharged to put out small fires.',
    example_en = 'Every office floor must be equipped with a fire extinguisher.',
    example_vn = 'Mỗi tầng văn phòng đều phải được trang bị một bình chữa cháy.'
WHERE detection_label = 'fire extinguisher';

UPDATE words
SET en_word = 'candy',
    phonetic = '/ˈkæn.di/',
    pos = 'Noun',
    translation = 'kẹo',
    definition = 'A sweet food made primarily from sugar, chocolate, and flavorings.',
    example_en = 'The store sells many varieties of colorful candy.',
    example_vn = 'Cửa hàng bán nhiều loại kẹo nhiều màu sắc.'
WHERE detection_label = 'candy';

UPDATE words
SET en_word = 'fire truck',
    phonetic = '/ˈfaɪr ˌtrʌk/',
    pos = 'Noun',
    translation = 'xe cứu hỏa',
    definition = 'A specialized vehicle carrying firefighters and equipment to fires.',
    example_en = 'The red fire truck rushed down the avenue with sirens blaring.',
    example_vn = 'Chiếc xe cứu hỏa màu đỏ lao nhanh xuống đại lộ với còi hú inh ỏi.'
WHERE detection_label = 'fire truck';

UPDATE words
SET en_word = 'billiards',
    phonetic = '/ˈbɪl.jɚdz/',
    pos = 'Noun',
    translation = 'bi-a',
    definition = 'A game played on a cloth-covered table with cue balls and cues.',
    example_en = 'They played a friendly game of billiards.',
    example_vn = 'Họ đã chơi một ván bi-a giao hữu.'
WHERE detection_label = 'billiards';

UPDATE words
SET en_word = 'converter / adapter',
    phonetic = '/kənˈvɝː.t̬ɚ/',
    pos = 'Noun',
    translation = 'bộ chuyển đổi điện / cáp chuyển',
    definition = 'A device for altering the form of an electric current or signal.',
    example_en = 'You need a travel converter to plug your charger into foreign sockets.',
    example_vn = 'Bạn cần một bộ chuyển đổi du lịch để cắm sạc vào ổ điện nước ngoài.'
WHERE detection_label = 'converter';

UPDATE words
SET en_word = 'bathtub',
    phonetic = '/ˈbæθ.tʌb/',
    pos = 'Noun',
    translation = 'bồn tắm',
    definition = 'A large tub in a bathroom used for bathing.',
    example_en = 'He relaxed in a warm bathtub after work.',
    example_vn = 'Anh ấy thư giãn trong bồn tắm nước ấm sau giờ làm.'
WHERE detection_label = 'bathtub';

UPDATE words
SET en_word = 'wheelchair',
    phonetic = '/ˈwiːl.tʃer/',
    pos = 'Noun',
    translation = 'xe lăn',
    definition = 'A chair mounted on wheels used by individuals unable to walk.',
    example_en = 'The hospital provides accessible ramps for visitors using a wheelchair.',
    example_vn = 'Bệnh viện cung cấp các đường dốc tiếp cận cho du khách sử dụng xe lăn.'
WHERE detection_label = 'wheelchair';

UPDATE words
SET en_word = 'golf club',
    phonetic = '/ˈɡɑːlf klʌb/',
    pos = 'Noun',
    translation = 'gậy đánh gôn',
    definition = 'A club used to hit the ball in golf.',
    example_en = 'He selected a titanium golf club for his opening shot.',
    example_vn = 'Anh ấy chọn một cây gậy đánh gôn bằng titan cho cú đánh mở màn.'
WHERE detection_label = 'golf club';

UPDATE words
SET en_word = 'briefcase',
    phonetic = '/ˈbriːf.keɪs/',
    pos = 'Noun',
    translation = 'cặp tài liệu / cặp da',
    definition = 'A flat, rectangular case used especially for carrying documents.',
    example_en = 'The lawyer opened his leather briefcase to find the contract.',
    example_vn = 'Luật sư mở chiếc cặp da để tìm bản hợp đồng.'
WHERE detection_label = 'briefcase';

UPDATE words
SET en_word = 'cucumber',
    phonetic = '/ˈkjuː.kʌm.bɚ/',
    pos = 'Noun',
    translation = 'dưa chuột / dưa leo',
    definition = 'A long, green-skinned fruit with watery, refreshing flesh.',
    example_en = 'Add sliced cucumber to the fresh green salad.',
    example_vn = 'Hãy thêm dưa chuột thái lát vào món salad tươi.'
WHERE detection_label = 'cucumber';

UPDATE words
SET en_word = 'cigar / cigarette',
    phonetic = '/sɪˈɡɑːr / ˌsɪɡ.əˈret/',
    pos = 'Noun',
    translation = 'xì gà / thuốc lá',
    definition = 'A cylinder of tobacco rolled for smoking.',
    example_en = 'Smoking cigarettes is harmful to your health.',
    example_vn = 'Hút thuốc lá rất có hại cho sức khỏe của bạn.'
WHERE detection_label = 'cigar/cigarette';

UPDATE words
SET en_word = 'paint brush',
    phonetic = '/ˈpeɪnt brʌʃ/',
    pos = 'Noun',
    translation = 'cọ vẽ / chổi quét sơn',
    definition = 'A brush used by artists or painters for applying paint.',
    example_en = 'The artist dipped her paint brush into vibrant blue watercolor.',
    example_vn = 'Người họa sĩ nhúng cây cọ vẽ vào màu nước xanh lam rực rỡ.'
WHERE detection_label = 'paint brush';

UPDATE words
SET en_word = 'pear',
    phonetic = '/per/',
    pos = 'Noun',
    translation = 'quả lê',
    definition = 'A sweet, juicy fruit that is narrow near the stem and wider at the base.',
    example_en = 'The crisp Asian pear is refreshingly sweet and juicy.',
    example_vn = 'Quả lê châu Á giòn tan có vị ngọt mát và mọng nước.'
WHERE detection_label = 'pear';

UPDATE words
SET en_word = 'thermos / flask',
    phonetic = '/flæsk/',
    pos = 'Noun',
    translation = 'bình giữ nhiệt',
    definition = 'A container that keeps liquids hot or cold for long periods.',
    example_en = 'He carried hot coffee in a stainless steel flask.',
    example_vn = 'Anh ấy đựng cà phê nóng trong một chiếc bình giữ nhiệt bằng thép không gỉ.'
WHERE detection_label = 'flask';

UPDATE words
SET en_word = 'heavy truck',
    phonetic = '/ˈhev.i trʌk/',
    pos = 'Noun',
    translation = 'xe tải hạng nặng',
    definition = 'A large commercial freight vehicle designed to carry heavy cargo.',
    example_en = 'The heavy truck transported building materials across the country.',
    example_vn = 'Chiếc xe tải hạng nặng đã vận chuyển vật liệu xây dựng đi khắp đất nước.'
WHERE detection_label = 'heavy truck';

UPDATE words
SET en_word = 'hamburger',
    phonetic = '/ˈhæmˌbɝː.ɡɚ/',
    pos = 'Noun',
    translation = 'bánh mì kẹp thịt / bánh burger',
    definition = 'A sandwich consisting of a cooked patty of ground meat inside a bun.',
    example_en = 'He ordered a juicy beef hamburger with melted cheese.',
    example_vn = 'Anh ấy gọi một chiếc hamburger thịt bò mọng nước phủ phô mai tan chảy.'
WHERE detection_label = 'hamburger';

UPDATE words
SET en_word = 'range hood / extractor fan',
    phonetic = '/ˈreɪndʒ ˌhʊd/',
    pos = 'Noun',
    translation = 'máy hút mùi nhà bếp',
    definition = 'A kitchen appliance that filters smoke and cooking odors.',
    example_en = 'Turn on the kitchen extractor when frying fish.',
    example_vn = 'Hãy bật máy hút mùi nhà bếp khi chiên cá.'
WHERE detection_label = 'extractor';

UPDATE words
SET en_word = 'extension cord',
    phonetic = '/ɪkˈsten.ʃən kɔːrd/',
    pos = 'Noun',
    translation = 'dây cắm nối dài / ổ cắm kéo dài',
    definition = 'A flexible power cable with a plug and socket on either end.',
    example_en = 'Plug the lamp into the extension cord near the desk.',
    example_vn = 'Hãy cắm chiếc đèn vào ổ cắm kéo dài gần bàn làm việc.'
WHERE detection_label = 'extension cord';

UPDATE words
SET en_word = 'kitchen tongs',
    phonetic = '/tɑːŋz/',
    pos = 'Noun',
    translation = 'kẹp gắp thức ăn',
    definition = 'A gripping utensil consisting of two arms pivoted or sprung together.',
    example_en = 'Use stainless steel tongs to turn the grilling steaks safely.',
    example_vn = 'Hãy dùng kẹp gắp thức ăn bằng inox để lật những miếng bít tết nướng an toàn.'
WHERE detection_label = 'tong';

UPDATE words
SET en_word = 'American football',
    phonetic = '/əˌmer.ɪ.kən ˈfʊt.bɑːl/',
    pos = 'Noun',
    translation = 'bóng bầu dục Mỹ',
    definition = 'A game played by two teams of eleven players with an oval ball.',
    example_en = 'He plays American football at his university.',
    example_vn = 'Anh ấy chơi bóng bầu dục Mỹ ở trường đại học.'
WHERE detection_label = 'american football';

UPDATE words
SET en_word = 'earphone',
    phonetic = '/ˈɪr.foʊn/',
    pos = 'Noun',
    translation = 'tai nghe nhét tai',
    definition = 'A small audio speaker that fits directly into the outer ear.',
    example_en = 'He plugged his wireless earphones into his ears.',
    example_vn = 'Anh ấy nhét chiếc tai nghe không dây vào tai.'
WHERE detection_label = 'earphone';

UPDATE words
SET en_word = 'protective mask',
    phonetic = '/mæsk/',
    pos = 'Noun',
    translation = 'khẩu trang / mặt nạ',
    definition = 'A covering worn over the mouth and nose to filter dust and germs.',
    example_en = 'Wear a protective medical mask in crowded places.',
    example_vn = 'Hãy đeo khẩu trang y tế bảo vệ ở những nơi đông người.'
WHERE detection_label = 'mask';

UPDATE words
SET en_word = 'tennis ball',
    phonetic = '/ˈten.ɪs bɑːl/',
    pos = 'Noun',
    translation = 'quả bóng quần vợt',
    definition = 'A felt-covered hollow rubber ball used in the game of tennis.',
    example_en = 'He smashed the bright yellow tennis ball across the court net.',
    example_vn = 'Anh ấy đập mạnh quả bóng quần vợt màu vàng tươi qua lưới sân.'
WHERE detection_label = 'tennis';

UPDATE words
SET en_word = 'ship',
    phonetic = '/ʃɪp/',
    pos = 'Noun',
    translation = 'con tàu / tàu thủy',
    definition = 'A large ocean-going watercraft for carrying cargo or passengers.',
    example_en = 'The massive cargo ship sailed out of the busy deep-water harbor.',
    example_vn = 'Con tàu chở hàng khổng lồ đã rời bến cảng nước sâu nhộn nhịp.'
WHERE detection_label = 'ship';

UPDATE words
SET en_word = 'playground swing',
    phonetic = '/swɪŋ/',
    pos = 'Noun',
    translation = 'xích đu',
    definition = 'A seat suspended by ropes or chains for swinging back and forth.',
    example_en = 'The children took turns riding high on the playground swing.',
    example_vn = 'Bọn trẻ thay phiên nhau chơi xích đu thật cao trong khu vui chơi.'
WHERE detection_label = 'swing';

UPDATE words
SET en_word = 'coffee machine',
    phonetic = '/ˈkɑː.fi məˌʃiːn/',
    pos = 'Noun',
    translation = 'máy pha cà phê',
    definition = 'An electric appliance used for brewing coffee automatically.',
    example_en = 'She brews a fresh cup of espresso using the coffee machine.',
    example_vn = 'Cô ấy pha một tách espresso tươi bằng máy pha cà phê.'
WHERE detection_label = 'coffee machine';

UPDATE words
SET en_word = 'playground slide',
    phonetic = '/slaɪd/',
    pos = 'Noun',
    translation = 'cầu trượt',
    definition = 'A smooth sloped surface for children to slide down.',
    example_en = 'Children laughed joyfully as they slipped down the playground slide.',
    example_vn = 'Bọn trẻ cười giòn tan khi trượt xuống chiếc cầu trượt trong sân chơi.'
WHERE detection_label = 'slide';

UPDATE words
SET en_word = 'carriage',
    phonetic = '/ˈker.ɪdʒ/',
    pos = 'Noun',
    translation = 'xe ngựa kéo',
    definition = 'A four-wheeled passenger vehicle pulled by horses.',
    example_en = 'The royal couple rode in an ornate horse carriage.',
    example_vn = 'Cặp đôi hoàng gia ngồi trên một chiếc xe ngựa kéo lộng lẫy.'
WHERE detection_label = 'carriage';

UPDATE words
SET en_word = 'onion',
    phonetic = '/ˈʌn.jən/',
    pos = 'Noun',
    translation = 'củ hành tây',
    definition = 'A pungent bulb vegetable used widely as a culinary base.',
    example_en = 'Chopping onions can make your eyes water.',
    example_vn = 'Thái hành tây có thể làm cho mắt bạn bị cay.'
WHERE detection_label = 'onion';

UPDATE words
SET en_word = 'green beans',
    phonetic = '/ˌɡriːn ˈbiːnz/',
    pos = 'Noun',
    translation = 'đậu que / đậu cô ve',
    definition = 'Long, slender green edible pods of various beans.',
    example_en = 'Steam the fresh green beans for five minutes.',
    example_vn = 'Hấp đậu que tươi trong năm phút.'
WHERE detection_label = 'green beans';

UPDATE words
SET en_word = 'projector',
    phonetic = '/prəˈdʒek.tɚ/',
    pos = 'Noun',
    translation = 'máy chiếu',
    definition = 'An optical device that casts digital presentations onto a screen.',
    example_en = 'The speaker displayed his slides using the ceiling projector.',
    example_vn = 'Diễn giả đã trình chiếu các slide của mình bằng máy chiếu gắn trần.'
WHERE detection_label = 'projector';

UPDATE words
SET en_word = 'washing machine',
    phonetic = '/ˈwɑː.ʃɪŋ məˌʃiːn/',
    pos = 'Noun',
    translation = 'máy giặt / máy sấy quần áo',
    definition = 'A home appliance used for washing and spinning clothes clean.',
    example_en = 'Put the dirty laundry into the front-loading washing machine.',
    example_vn = 'Hãy cho quần áo bẩn vào chiếc máy giặt cửa trước.'
WHERE detection_label = 'washing machine/drying machine';

UPDATE words
SET en_word = 'chicken',
    phonetic = '/ˈtʃɪk.ɪn/',
    pos = 'Noun',
    translation = 'con gà / thịt gà',
    definition = 'A common domestic fowl raised for its eggs and meat.',
    example_en = 'We ordered grilled chicken with steamed rice for lunch.',
    example_vn = 'Chúng tôi gọi món gà nướng cùng cơm trắng cho bữa trưa.'
WHERE detection_label = 'chicken';

UPDATE words
SET en_word = 'printer',
    phonetic = '/ˈprɪn.t̬ɚ/',
    pos = 'Noun',
    translation = 'máy in',
    definition = 'An output peripheral that produces hard copies of digital documents.',
    example_en = 'The laser printer prints twenty pages per minute.',
    example_vn = 'Chiếc máy in laser in được hai mươi trang mỗi phút.'
WHERE detection_label = 'printer';

UPDATE words
SET en_word = 'watermelon',
    phonetic = '/ˈwɑː.t̬ɚˌmel.ən/',
    pos = 'Noun',
    translation = 'quả dưa hấu',
    definition = 'A huge round fruit with a green striped rind and sweet red juicy pulp.',
    example_en = 'A chilled slice of sweet red watermelon is heaven on a scorching day.',
    example_vn = 'Một lát dưa hấu đỏ ngọt mát lạnh là món ăn tuyệt vời trong một ngày oi bức.'
WHERE detection_label = 'watermelon';

UPDATE words
SET en_word = 'saxophone',
    phonetic = '/ˈsæk.sə.foʊn/',
    pos = 'Noun',
    translation = 'kèn saxophone',
    definition = 'A brass wind instrument with a reed mouthpiece used in jazz music.',
    example_en = 'The musician played a sultry jazz solo on his golden saxophone.',
    example_vn = 'Nhạc công đã chơi một khúc độc tấu jazz đầy cuốn hút trên chiếc kèn saxophone màu vàng.'
WHERE detection_label = 'saxophone';

UPDATE words
SET en_word = 'ice cream',
    phonetic = '/ˌaɪs ˈkriːm/',
    pos = 'Noun',
    translation = 'kem',
    definition = 'A sweet, creamy frozen dessert made with dairy and flavorings.',
    example_en = 'Children love eating chocolate and vanilla ice cream in the summer.',
    example_vn = 'Trẻ em thích ăn kem sô cô la và vani vào mùa hè.'
WHERE detection_label = 'ice cream';

UPDATE words
SET en_word = 'hot-air balloon',
    phonetic = '/ˌhɑːt ˈer bəˌluːn/',
    pos = 'Noun',
    translation = 'khinh khí cầu',
    definition = 'A large balloon filled with heated air that carries passengers aloft.',
    example_en = 'They watched colorful hot-air balloons float over the valley at dawn.',
    example_vn = 'Họ ngắm nhìn những chiếc khinh khí cầu rực rỡ lơ lửng trên thung lũng lúc bình minh.'
WHERE detection_label = 'hot-air balloon';

UPDATE words
SET en_word = 'cello',
    phonetic = '/ˈtʃel.oʊ/',
    pos = 'Noun',
    translation = 'đàn trung hồ cầm / đàn cello',
    definition = 'A large bass instrument of the violin family, played between the knees.',
    example_en = 'She played a moving melody on her classical cello.',
    example_vn = 'Cô ấy đã chơi một giai điệu xúc động trên cây đàn cello cổ điển.'
WHERE detection_label = 'cello';

UPDATE words
SET en_word = 'French fries',
    phonetic = '/ˌfrentʃ ˈfraɪz/',
    pos = 'Noun',
    translation = 'khoai tây chiên',
    definition = 'Thin strips of potato fried until crisp and golden.',
    example_en = 'A burger served with hot French fries is a classic meal.',
    example_vn = 'Một chiếc burger ăn kèm khoai tây chiên nóng hổi là một bữa ăn kinh điển.'
WHERE detection_label = 'french fries';

UPDATE words
SET en_word = 'weighing scale',
    phonetic = '/skeɪl/',
    pos = 'Noun',
    translation = 'cái cân',
    definition = 'An instrument for weighing persons or commodities.',
    example_en = 'Step onto the digital scale to check your body weight.',
    example_vn = 'Hãy bước lên chiếc cân điện tử để kiểm tra cân nặng của bạn.'
WHERE detection_label = 'scale';

UPDATE words
SET en_word = 'trophy',
    phonetic = '/ˈtroʊ.fi/',
    pos = 'Noun',
    translation = 'cúp vô địch / cúp lưu niệm',
    definition = 'An ornamental cup or award given as a token of victory in a contest.',
    example_en = 'The championship team hoisted the gleaming golden trophy high in celebration.',
    example_vn = 'Đội vô địch đã nâng cao chiếc cúp vàng lấp lánh trong niềm vui chiến thắng.'
WHERE detection_label = 'trophy';

UPDATE words
SET en_word = 'cabbage',
    phonetic = '/ˈkæb.ɪdʒ/',
    pos = 'Noun',
    translation = 'bắp cải',
    definition = 'A leafy green or purple vegetable grown for its dense head.',
    example_en = 'Cabbage is a healthy vegetable rich in vitamins.',
    example_vn = 'Bắp cải là một loại rau củ lành mạnh giàu vitamin.'
WHERE detection_label = 'cabbage';

UPDATE words
SET en_word = 'peach',
    phonetic = '/piːtʃ/',
    pos = 'Noun',
    translation = 'quả đào',
    definition = 'A round stone fruit with juicy sweet yellow-pink flesh and fuzzy skin.',
    example_en = 'A ripe fragrant peach picked fresh from the orchard tastes wonderful.',
    example_vn = 'Một quả đào chín thơm hái tươi từ vườn có hương vị thật tuyệt vời.'
WHERE detection_label = 'peach';

UPDATE words
SET en_word = 'rice',
    phonetic = '/raɪs/',
    pos = 'Noun',
    translation = 'gạo / cơm',
    definition = 'The staple starchy grain cultivated as the world''s primary food crop.',
    example_en = 'A bowl of warm steamed jasmine rice is served with every meal.',
    example_vn = 'Một bát cơm gạo lài nóng hổi được phục vụ trong mỗi bữa ăn.'
WHERE detection_label = 'rice';

UPDATE words
SET en_word = 'wallet / purse',
    phonetic = '/ˈwɑː.lɪt / pɝːs/',
    pos = 'Noun',
    translation = 'ví tiền / bóp cầm tay',
    definition = 'A small flat pocket-sized folding case for holding paper currency and cards.',
    example_en = 'He pulled a credit card from his leather wallet to pay the bill.',
    example_vn = 'Anh ấy rút một chiếc thẻ tín dụng ra khỏi ví da để thanh toán hóa đơn.'
WHERE detection_label = 'wallet/purse';

UPDATE words
SET en_word = 'volleyball',
    phonetic = '/ˈvɑː.li.bɑːl/',
    pos = 'Noun',
    translation = 'quả bóng chuyền',
    definition = 'An inflated leather ball spiked and volleyed over a high net.',
    example_en = 'The player spiked the white volleyball fiercely over the net.',
    example_vn = 'Cầu thủ đã đập mạnh quả bóng chuyền qua lưới.'
WHERE detection_label = 'volleyball';

UPDATE words
SET en_word = 'deer',
    phonetic = '/dɪr/',
    pos = 'Noun',
    translation = 'con hươu / con nai',
    definition = 'A graceful hoofed animal with antlers on the males.',
    example_en = 'A wild deer stepped quietly out of the forest.',
    example_vn = 'Một con hươu rừng bước nhẹ nhàng ra khỏi khu rừng.'
WHERE detection_label = 'deer';

UPDATE words
SET en_word = 'goose',
    phonetic = '/ɡuːs/',
    pos = 'Noun',
    translation = 'con ngỗng',
    definition = 'A large waterbird with a long neck and webbed feet.',
    example_en = 'A white goose waddled along the riverbank.',
    example_vn = 'Một con ngỗng trắng lạch bạch đi dọc theo bờ sông.'
WHERE detection_label = 'goose';

UPDATE words
SET en_word = 'cosmetics',
    phonetic = '/kɑːzˈmet̬.ɪks/',
    pos = 'Noun',
    translation = 'mỹ phẩm',
    definition = 'Substances applied to the body to enhance skin appearance.',
    example_en = 'She organized her cosmetics neatly on the vanity table.',
    example_vn = 'Cô ấy sắp xếp mỹ phẩm của mình gọn gàng trên bàn trang điểm.'
WHERE detection_label = 'cosmetics';

UPDATE words
SET en_word = 'trumpet',
    phonetic = '/ˈtrʌm.pɪt/',
    pos = 'Noun',
    translation = 'kèn trumpet',
    definition = 'A brass wind instrument with three valves producing a bright piercing tone.',
    example_en = 'He blew a brilliant fanfare on his polished brass trumpet.',
    example_vn = 'Anh ấy đã thổi một khúc nhạc chào mừng rực rỡ trên chiếc kèn trumpet sáng bóng.'
WHERE detection_label = 'trumpet';

UPDATE words
SET en_word = 'pineapple',
    phonetic = '/ˈpaɪnˌæp.əl/',
    pos = 'Noun',
    translation = 'quả dứa / quả thơm',
    definition = 'A large tropical fruit with sweet yellow flesh and a spiky skin.',
    example_en = 'Fresh pineapple juice has a wonderful sweet-and-sour taste.',
    example_vn = 'Nước dứa tươi có vị chua ngọt thật tuyệt vời.'
WHERE detection_label = 'pineapple';

UPDATE words
SET en_word = 'golf ball',
    phonetic = '/ˈɡɑːlf bɑːl/',
    pos = 'Noun',
    translation = 'quả bóng gôn',
    definition = 'A small dimpled hard ball designed for the game of golf.',
    example_en = 'He drove the white golf ball straight down the fairway.',
    example_vn = 'Anh ấy đánh quả bóng gôn màu trắng thẳng tắp xuống đường băng.'
WHERE detection_label = 'golf ball';

UPDATE words
SET en_word = 'ambulance',
    phonetic = '/ˈæm.bjə.ləns/',
    pos = 'Noun',
    translation = 'xe cứu thương',
    definition = 'A special vehicle equipped for taking sick or injured people to hospital.',
    example_en = 'The ambulance arrived quickly at the scene.',
    example_vn = 'Xe cứu thương đã nhanh chóng đến hiện trường.'
WHERE detection_label = 'ambulance';

UPDATE words
SET en_word = 'mango',
    phonetic = '/ˈmæŋ.ɡoʊ/',
    pos = 'Noun',
    translation = 'quả xoài',
    definition = 'A fleshy, sweet oval tropical fruit with yellow-red skin.',
    example_en = 'Ripe sweet mangoes are abundant during the tropical summer.',
    example_vn = 'Những quả xoài chín ngọt có rất nhiều vào mùa hè nhiệt đới.'
WHERE detection_label = 'mango';

UPDATE words
SET en_word = 'key',
    phonetic = '/kiː/',
    pos = 'Noun',
    translation = 'chìa khóa',
    definition = 'A small piece of shaped metal used to open and lock doors.',
    example_en = 'He took the car key out of his coat pocket.',
    example_vn = 'Anh ấy lấy chiếc chìa khóa xe ra khỏi túi áo khoác.'
WHERE detection_label = 'key';

UPDATE words
SET en_word = 'hurdle',
    phonetic = '/ˈhɝː.dəl/',
    pos = 'Noun',
    translation = 'rào chắn chạy vượt rào',
    definition = 'An upright frame over which athletes jump in hurdle racing.',
    example_en = 'The athlete cleared each track hurdle with exceptional agility.',
    example_vn = 'Vận động viên đã nhảy qua từng rào chắn với sự nhanh nhẹn tuyệt vời.'
WHERE detection_label = 'hurdle';

UPDATE words
SET en_word = 'fishing rod',
    phonetic = '/ˈfɪʃ.ɪŋ rɑːd/',
    pos = 'Noun',
    translation = 'cần câu cá',
    definition = 'A long flexible rod used with a line and hook to catch fish.',
    example_en = 'He cast his fishing rod into the calm lake water.',
    example_vn = 'Anh ấy quăng cần câu xuống mặt hồ nước phẳng lặng.'
WHERE detection_label = 'fishing rod';

UPDATE words
SET en_word = 'medal',
    phonetic = '/ˈmed.əl/',
    pos = 'Noun',
    translation = 'huy chương',
    definition = 'A metal disc awarded as an honor for sporting or academic achievements.',
    example_en = 'The runner won a shiny gold medal in the marathon race.',
    example_vn = 'Vận động viên chạy bộ đã giành được một tấm huy chương vàng sáng chói ở cự ly marathon.'
WHERE detection_label = 'medal';

UPDATE words
SET en_word = 'flute',
    phonetic = '/fluːt/',
    pos = 'Noun',
    translation = 'cây sáo',
    definition = 'A woodwind musical instrument played by blowing across a side hole.',
    example_en = 'The musician played a sweet, gentle melody on her silver flute.',
    example_vn = 'Nhạc công đã chơi một giai điệu du dương êm ái trên cây sáo bạc.'
WHERE detection_label = 'flute';

UPDATE words
SET en_word = 'brush',
    phonetic = '/brʌʃ/',
    pos = 'Noun',
    translation = 'bàn chải / cây cọ',
    definition = 'An implement with bristles or hair used for cleaning, painting, or grooming.',
    example_en = 'She brushed her hair with a wooden hair brush.',
    example_vn = 'Cô ấy chải tóc bằng một chiếc lược bàn chải gỗ.'
WHERE detection_label = 'brush';

UPDATE words
SET en_word = 'penguin',
    phonetic = '/ˈpeŋ.ɡwɪn/',
    pos = 'Noun',
    translation = 'chim cánh cụt',
    definition = 'A flightless black-and-white seabird of the southern hemisphere.',
    example_en = 'A colony of penguins marched across the icy Antarctic shore.',
    example_vn = 'Một đàn chim cánh cụt sải bước qua bờ biển băng giá ở Nam Cực.'
WHERE detection_label = 'penguin';

UPDATE words
SET en_word = 'megaphone',
    phonetic = '/ˈmeɡ.ə.foʊn/',
    pos = 'Noun',
    translation = 'loa cầm tay',
    definition = 'A portable cone-shaped acoustic horn used to amplify voice.',
    example_en = 'The tour guide gave instructions through a loud megaphone.',
    example_vn = 'Hướng dẫn viên du lịch đưa ra hướng dẫn qua một chiếc loa cầm tay lớn.'
WHERE detection_label = 'megaphone';

UPDATE words
SET en_word = 'corn',
    phonetic = '/kɔːrn/',
    pos = 'Noun',
    translation = 'bắp ngô',
    definition = 'A cereal plant yielding large ears with yellow kernels.',
    example_en = 'Sweet boiled corn is a popular street food snack.',
    example_vn = 'Bắp ngô ngọt luộc là một món ăn vặt đường phố phổ biến.'
WHERE detection_label = 'corn';

UPDATE words
SET en_word = 'lettuce',
    phonetic = '/ˈlet̬.ɪs/',
    pos = 'Noun',
    translation = 'rau xà lách',
    definition = 'A crisp leafy green plant cultivated especially for fresh salads.',
    example_en = 'Crisp lettuce adds freshness and crunch to any sandwich.',
    example_vn = 'Rau xà lách giòn làm tăng độ tươi mát và giòn rụm cho bất kỳ chiếc sandwich nào.'
WHERE detection_label = 'lettuce';

UPDATE words
SET en_word = 'garlic',
    phonetic = '/ˈɡɑːr.lɪk/',
    pos = 'Noun',
    translation = 'củ tỏi',
    definition = 'A strong-smelling pungent bulb used in cooking.',
    example_en = 'Sauteed minced garlic gives the dish an appetizing aroma.',
    example_vn = 'Tỏi băm phi thơm mang lại cho món ăn một hương vị hấp dẫn.'
WHERE detection_label = 'garlic';

UPDATE words
SET en_word = 'swan',
    phonetic = '/swɑːn/',
    pos = 'Noun',
    translation = 'chim thiên nga',
    definition = 'A large graceful waterbird with a long flexible neck and pure white plumage.',
    example_en = 'Two majestic white swans glided elegantly across the glassy lake.',
    example_vn = 'Hai chú chim thiên nga trắng muốt uy nghi lướt đi thanh thoát trên mặt hồ phẳng lặng.'
WHERE detection_label = 'swan';

UPDATE words
SET en_word = 'helicopter',
    phonetic = '/ˈhel.əˌkɑːp.tɚ/',
    pos = 'Noun',
    translation = 'máy bay trực thăng',
    definition = 'An aircraft without wings that is lifted and propelled by overhead rotors.',
    example_en = 'The rescue helicopter landed safely on the hospital helipad.',
    example_vn = 'Chiếc máy bay trực thăng cứu hộ đã hạ cánh an toàn xuống bãi đỗ bệnh viện.'
WHERE detection_label = 'helicopter';

UPDATE words
SET en_word = 'green onion / scallion',
    phonetic = '/ˌɡriːn ˈʌn.jən/',
    pos = 'Noun',
    translation = 'hành lá',
    definition = 'A young onion with long green leaves and an underdeveloped bulb.',
    example_en = 'Garnish the hot noodle soup with chopped green onions.',
    example_vn = 'Trang trí tô phở nóng bằng hành lá thái nhỏ.'
WHERE detection_label = 'green onion';

UPDATE words
SET en_word = 'nuts',
    phonetic = '/nʌts/',
    pos = 'Noun',
    translation = 'hạt dinh dưỡng / quả hạch',
    definition = 'Hard-shelled edible seeds such as almonds, walnuts, or cashews.',
    example_en = 'A handful of mixed roasted nuts is a wholesome snack.',
    example_vn = 'Một nắm hạt dinh dưỡng rang thập cẩm là món ăn vặt lành mạnh.'
WHERE detection_label = 'nuts';

UPDATE words
SET en_word = 'speed limit sign',
    phonetic = '/ˈspiːd ˌlɪm.ɪt saɪn/',
    pos = 'Noun',
    translation = 'biển báo giới hạn tốc độ',
    definition = 'A traffic sign indicating the maximum legal driving speed on a road.',
    example_en = 'The highway speed limit sign clearly indicated 60 miles per hour.',
    example_vn = 'Biển báo giới hạn tốc độ trên đường cao tốc chỉ rõ 60 dặm một giờ.'
WHERE detection_label = 'speed limit sign';

UPDATE words
SET en_word = 'induction cooker',
    phonetic = '/ɪnˈdʌk.ʃən ˈkʊk.ɚ/',
    pos = 'Noun',
    translation = 'bếp từ',
    definition = 'A cooking stove that heats cookware directly through magnetic induction.',
    example_en = 'The modern induction cooker boils water much faster than gas.',
    example_vn = 'Bếp từ hiện đại đun sôi nước nhanh hơn nhiều so với bếp gas.'
WHERE detection_label = 'induction cooker';

UPDATE words
SET en_word = 'broom',
    phonetic = '/bruːm/',
    pos = 'Noun',
    translation = 'cái chổi',
    definition = 'A long-handled brush used for sweeping floors.',
    example_en = 'She used a broom to sweep the leaves off the porch.',
    example_vn = 'Cô ấy dùng chổi để quét lá rụng khỏi hiên nhà.'
WHERE detection_label = 'broom';

UPDATE words
SET en_word = 'trombone',
    phonetic = '/trɑːmˈboʊn/',
    pos = 'Noun',
    translation = 'kèn trombone',
    definition = 'A large brass musical instrument played using a sliding tube.',
    example_en = 'The brass musician slid the trombone smoothly to hit the low note.',
    example_vn = 'Nhạc công kèn đồng trượt nhẹ ống kèn trombone để tạo ra nốt trầm.'
WHERE detection_label = 'trombone';

UPDATE words
SET en_word = 'plum',
    phonetic = '/plʌm/',
    pos = 'Noun',
    translation = 'quả mận',
    definition = 'An oval sweet fruit with smooth dark purple skin and a stone inside.',
    example_en = 'Fresh ripe purple plums are sweet and slightly tart.',
    example_vn = 'Những quả mận tím chín tươi có vị ngọt đậm và hơi chua thanh.'
WHERE detection_label = 'plum';

UPDATE words
SET en_word = 'rickshaw / cyclo',
    phonetic = '/ˈrɪk.ʃɑː/',
    pos = 'Noun',
    translation = 'xe xích lô / xe kéo',
    definition = 'A light two-wheeled or three-wheeled passenger cart.',
    example_en = 'Tourists love touring the ancient town in a traditional cyclo rickshaw.',
    example_vn = 'Khách du lịch thích đi dạo quanh phố cổ trên chiếc xe xích lô truyền thống.'
WHERE detection_label = 'rickshaw';

UPDATE words
SET en_word = 'goldfish',
    phonetic = '/ˈɡoʊld.fɪʃ/',
    pos = 'Noun',
    translation = 'cá vàng',
    definition = 'A small golden-orange freshwater fish kept in aquariums.',
    example_en = 'A bright goldfish swam lazily in the glass bowl.',
    example_vn = 'Một chú cá vàng óng ả bơi lội lững lờ trong chiếc bể thủy tinh.'
WHERE detection_label = 'goldfish';

UPDATE words
SET en_word = 'kiwi fruit',
    phonetic = '/ˈkiː.wiː fruːt/',
    pos = 'Noun',
    translation = 'quả kiwi',
    definition = 'A small, brown, fuzzy fruit with bright green edible flesh.',
    example_en = 'Slice a sweet kiwi fruit and add it to the fruit bowl.',
    example_vn = 'Hãy cắt lát một quả kiwi ngọt ngào và thêm vào bát hoa quả.'
WHERE detection_label = 'kiwi fruit';

UPDATE words
SET en_word = 'Wi-Fi router / modem',
    phonetic = '/ˈruː.t̬ɚ / ˈmoʊ.dem/',
    pos = 'Noun',
    translation = 'bộ phát Wi-Fi / modem',
    definition = 'A networking device that forwards internet data packets to local devices.',
    example_en = 'Restart the Wi-Fi router if your internet connection feels slow.',
    example_vn = 'Hãy khởi động lại bộ phát Wi-Fi nếu đường truyền internet của bạn bị chậm.'
WHERE detection_label = 'router/modem';

UPDATE words
SET en_word = 'playing card',
    phonetic = '/ˈpleɪ.ɪŋ kɑːrd/',
    pos = 'Noun',
    translation = 'lá bài / quân bài tây',
    definition = 'A rectangular card used in card games like poker or bridge.',
    example_en = 'He shuffled the deck of playing cards before dealing.',
    example_vn = 'Anh ấy xáo bộ bài tây trước khi chia bài.'
WHERE detection_label = 'poker card';

UPDATE words
SET en_word = 'shrimp',
    phonetic = '/ʃrɪmp/',
    pos = 'Noun',
    translation = 'con tôm',
    definition = 'A small edible marine decapod with slender legs and a curved shell.',
    example_en = 'Stir-fried sweet and sour shrimp is a mouthwatering dinner course.',
    example_vn = 'Tôm xào chua ngọt là một món ăn tối vô cùng thơm ngon.'
WHERE detection_label = 'shrimp';

UPDATE words
SET en_word = 'sushi',
    phonetic = '/ˈsuː.ʃi/',
    pos = 'Noun',
    translation = 'món sushi',
    definition = 'A Japanese dish of prepared vinegared rice with fresh raw seafood.',
    example_en = 'Fresh salmon sushi dipped in soy sauce and wasabi is irresistible.',
    example_vn = 'Món sushi cá hồi tươi chấm nước tương và mù tạt thật khó cưỡng.'
WHERE detection_label = 'sushi';

UPDATE words
SET en_word = 'cheese',
    phonetic = '/tʃiːz/',
    pos = 'Noun',
    translation = 'phô mai',
    definition = 'A food made from milk curd, produced in a wide range of flavors and textures.',
    example_en = 'Melted cheese makes the pizza taste delicious.',
    example_vn = 'Phô mai tan chảy làm cho chiếc bánh pizza có vị rất ngon.'
WHERE detection_label = 'cheese';

UPDATE words
SET en_word = 'sticky note / notepaper',
    phonetic = '/ˈnoʊtˌpeɪ.pɚ/',
    pos = 'Noun',
    translation = 'giấy ghi chú',
    definition = 'Small sheets of paper used for jotting brief reminders.',
    example_en = 'She wrote a phone number down on a square of notepaper.',
    example_vn = 'Cô ấy viết lại số điện thoại lên một tờ giấy ghi chú.'
WHERE detection_label = 'notepaper';

UPDATE words
SET en_word = 'cherry',
    phonetic = '/ˈtʃer.i/',
    pos = 'Noun',
    translation = 'quả anh đào / quả cherry',
    definition = 'A small, round, bright red or dark red stone fruit.',
    example_en = 'She placed a sweet red cherry on top of the cake.',
    example_vn = 'Cô ấy đặt một quả cherry đỏ mọng lên đỉnh chiếc bánh.'
WHERE detection_label = 'cherry';

UPDATE words
SET en_word = 'pliers',
    phonetic = '/ˈplaɪ.ɚz/',
    pos = 'Noun',
    translation = 'cái kìm',
    definition = 'Pincers with parallel, flat, and generally serrated surfaces for gripping.',
    example_en = 'The electrician gripped the copper wire firmly with his pliers.',
    example_vn = 'Người thợ điện kẹp chặt sợi dây đồng bằng chiếc kìm của mình.'
WHERE detection_label = 'pliers';

UPDATE words
SET en_word = 'CD',
    phonetic = '/ˌsiːˈdiː/',
    pos = 'Noun',
    translation = 'đĩa CD / đĩa quang',
    definition = 'A compact disc used for storing digital audio or data.',
    example_en = 'He played an old music CD on his stereo.',
    example_vn = 'Anh ấy bật một chiếc đĩa CD nhạc xưa trên dàn âm thanh.'
WHERE detection_label = 'cd';

UPDATE words
SET en_word = 'pasta',
    phonetic = '/ˈpɑː.stə/',
    pos = 'Noun',
    translation = 'mì Ý / mì ống',
    definition = 'An Italian dough made from durum wheat, molded into various shapes.',
    example_en = 'She cooked authentic Italian pasta with homemade tomato sauce.',
    example_vn = 'Cô ấy nấu món mì Ý đích thực với sốt cà chua tự làm.'
WHERE detection_label = 'pasta';

UPDATE words
SET en_word = 'hammer',
    phonetic = '/ˈhæm.ɚ/',
    pos = 'Noun',
    translation = 'cái búa',
    definition = 'A heavy hand tool used for pounding nails or breaking objects.',
    example_en = 'He tapped the nail gently with the steel hammer.',
    example_vn = 'Anh ấy gõ nhẹ chiếc đinh bằng chiếc búa thép.'
WHERE detection_label = 'hammer';

UPDATE words
SET en_word = 'cue stick',
    phonetic = '/kjuː stɪk/',
    pos = 'Noun',
    translation = 'gậy đánh bi-a',
    definition = 'A long tapering wooden rod used to strike the ball in billiards.',
    example_en = 'He held the cue stick firmly and aimed at the eight ball.',
    example_vn = 'Anh ấy cầm chắc cây gậy đánh bi-a và nhắm vào quả bóng số tám.'
WHERE detection_label = 'cue';

UPDATE words
SET en_word = 'avocado',
    phonetic = '/ˌæv.əˈkɑː.doʊ/',
    pos = 'Noun',
    translation = 'quả bơ',
    definition = 'A tropical fruit with thick green skin and soft creamy flesh.',
    example_en = 'She made fresh guacamole from ripe avocados.',
    example_vn = 'Cô ấy làm sốt guacamole từ những quả bơ chín.'
WHERE detection_label = 'avocado';

UPDATE words
SET en_word = 'Hami melon',
    phonetic = '/ˈhɑː.mi ˌmel.ən/',
    pos = 'Noun',
    translation = 'dưa lưới Hami',
    definition = 'A sweet, crunchy variety of cantaloupe melon.',
    example_en = 'Chilled slices of sweet Hami melon are very refreshing.',
    example_vn = 'Những lát dưa lưới Hami ngọt mát lạnh ăn rất sảng khoái.'
WHERE detection_label = 'hami melon';

UPDATE words
SET en_word = 'mushroom',
    phonetic = '/ˈmʌʃ.ruːm/',
    pos = 'Noun',
    translation = 'cây nấm',
    definition = 'An umbrella-shaped fungal growth, many varieties of which are edible.',
    example_en = 'Sauteed button mushrooms add deep savory flavor to the dish.',
    example_vn = 'Nấm mỡ xào mang lại hương vị đậm đà thơm ngon cho món ăn.'
WHERE detection_label = 'mushroom';

UPDATE words
SET en_word = 'screwdriver',
    phonetic = '/ˈskruːˌdraɪ.vɚ/',
    pos = 'Noun',
    translation = 'tua vít',
    definition = 'A manual or electric tool for turning screws into materials.',
    example_en = 'Use a flathead screwdriver to loosen the small battery cover.',
    example_vn = 'Hãy dùng tua vít đầu dẹp để mở nắp pin nhỏ ra.'
WHERE detection_label = 'screwdriver';

UPDATE words
SET en_word = 'recorder / voice recorder',
    phonetic = '/rɪˈkɔːr.dɚ/',
    pos = 'Noun',
    translation = 'máy ghi âm / sáo recorder',
    definition = 'An electronic audio recording apparatus or simple musical pipe.',
    example_en = 'The reporter used a digital voice recorder during the interview.',
    example_vn = 'Phóng viên đã sử dụng một chiếc máy ghi âm kỹ thuật số trong buổi phỏng vấn.'
WHERE detection_label = 'recorder';

UPDATE words
SET en_word = 'eggplant',
    phonetic = '/ˈeɡ.plænt/',
    pos = 'Noun',
    translation = 'cà tím',
    definition = 'A glossy dark purple vegetable with tender flesh.',
    example_en = 'Grilled eggplant with scallion oil is a popular dish.',
    example_vn = 'Cà tím nướng mỡ hành là một món ăn được nhiều người ưa chuộng.'
WHERE detection_label = 'eggplant';

UPDATE words
SET en_word = 'board eraser',
    phonetic = '/bɔːrd ɪˈreɪ.sɚ/',
    pos = 'Noun',
    translation = 'đồ lau bảng',
    definition = 'An eraser used to wipe chalk or marker ink off a board.',
    example_en = 'Please use the board eraser to clean the board.',
    example_vn = 'Làm ơn dùng đồ lau bảng để lau sạch bảng.'
WHERE detection_label = 'board eraser';

UPDATE words
SET en_word = 'coconut',
    phonetic = '/ˈkoʊ.kə.nʌt/',
    pos = 'Noun',
    translation = 'quả dừa',
    definition = 'A large brown seed of a tropical palm containing edible flesh and liquid.',
    example_en = 'Fresh coconut water is refreshing on a hot summer day.',
    example_vn = 'Nước dừa tươi thật sảng khoái trong một ngày hè nóng bức.'
WHERE detection_label = 'coconut';

UPDATE words
SET en_word = 'tape measure / ruler',
    phonetic = '/ˈteɪp ˌmeʒ.ɚ/',
    pos = 'Noun',
    translation = 'thước dây / thước cuộn',
    definition = 'A flexible ribbon of metal or cloth calibrated for measuring lengths.',
    example_en = 'The carpenter pulled out his retractable tape measure to size the door.',
    example_vn = 'Người thợ mộc rút chiếc thước dây ra để đo kích thước cánh cửa.'
WHERE detection_label = 'tape measure/ruler';

UPDATE words
SET en_word = 'pig',
    phonetic = '/pɪɡ/',
    pos = 'Noun',
    translation = 'con heo / con lợn',
    definition = 'A domesticated cloven-hoofed mammal with a snout.',
    example_en = 'The piglets played cheerfully in the clean straw barn.',
    example_vn = 'Những chú lợn con chơi đùa vui vẻ trong chuồng rơm sạch sẽ.'
WHERE detection_label = 'pig';

UPDATE words
SET en_word = 'showerhead',
    phonetic = '/ˈʃaʊ.ɚ.hed/',
    pos = 'Noun',
    translation = 'vòi hoa sen',
    definition = 'A perforated fitting in a bathroom through which water sprays.',
    example_en = 'The rain showerhead produces a gentle, soothing cascade of warm water.',
    example_vn = 'Vòi hoa sen dạng mưa phun ra một dòng nước ấm dịu nhẹ thư thái.'
WHERE detection_label = 'showerhead';

UPDATE words
SET en_word = 'chips',
    phonetic = '/tʃɪps/',
    pos = 'Noun',
    translation = 'khoai tây chiên giòn',
    definition = 'Thin slices of potato fried or baked until crisp.',
    example_en = 'He enjoyed a bowl of crunchy potato chips while watching TV.',
    example_vn = 'Anh ấy thưởng thức một bát khoai tây chiên giòn rụm trong khi xem TV.'
WHERE detection_label = 'chips';

UPDATE words
SET en_word = 'steak',
    phonetic = '/steɪk/',
    pos = 'Noun',
    translation = 'thịt bít tết',
    definition = 'A high-quality slice of beef grilled or pan-seared.',
    example_en = 'He ordered a medium-rare tenderloin steak with black pepper sauce.',
    example_vn = 'Anh ấy gọi một phần thịt bít tết thăn bò tái vừa với sốt tiêu đen.'
WHERE detection_label = 'steak';

UPDATE words
SET en_word = 'crosswalk sign',
    phonetic = '/ˈkrɑːs.wɑːk saɪn/',
    pos = 'Noun',
    translation = 'biển báo đường dành cho người đi bộ',
    definition = 'A road traffic sign indicating a pedestrian zebra crossing ahead.',
    example_en = 'Drivers must slow down when approaching a crosswalk sign.',
    example_vn = 'Tài xế phải giảm tốc độ khi đến gần biển báo đường dành cho người đi bộ.'
WHERE detection_label = 'crosswalk sign';

UPDATE words
SET en_word = 'camel',
    phonetic = '/ˈkæm.əl/',
    pos = 'Noun',
    translation = 'con lạc đà',
    definition = 'A large desert mammal with one or two humps on its back.',
    example_en = 'Camels can travel long distances in the desert without water.',
    example_vn = 'Lạc đà có thể di chuyển những quãng đường dài trên sa mạc mà không cần nước.'
WHERE detection_label = 'camel';

UPDATE words
SET en_word = 'Formula 1 car',
    phonetic = '/ˌfɔːr.mjə.lə ˈwʌn/',
    pos = 'Noun',
    translation = 'xe đua Công thức 1',
    definition = 'A single-seat, open-cockpit racing car capable of extreme speeds.',
    example_en = 'The Formula 1 car zoomed past the grandstand at high speed.',
    example_vn = 'Chiếc xe đua Công thức 1 lao vút qua khán đài với tốc độ cực cao.'
WHERE detection_label = 'formula 1';

UPDATE words
SET en_word = 'pomegranate',
    phonetic = '/ˈpɑː.məˌɡræn.ɪt/',
    pos = 'Noun',
    translation = 'quả lựu',
    definition = 'A round fruit with a tough reddish rind and many red juicy seeds.',
    example_en = 'Pomegranate seeds are full of natural antioxidants.',
    example_vn = 'Hạt lựu chứa rất nhiều chất chống oxy hóa tự nhiên.'
WHERE detection_label = 'pomegranate';

UPDATE words
SET en_word = 'dishwasher',
    phonetic = '/ˈdɪʃˌwɑː.ʃɚ/',
    pos = 'Noun',
    translation = 'máy rửa bát',
    definition = 'An electric machine used for washing dishes automatically.',
    example_en = 'Put the dirty plates into the dishwasher after dinner.',
    example_vn = 'Hãy xếp bát đĩa bẩn vào máy rửa bát sau bữa tối.'
WHERE detection_label = 'dishwasher';

UPDATE words
SET en_word = 'crab',
    phonetic = '/kræb/',
    pos = 'Noun',
    translation = 'con cua',
    definition = 'A sea creature with a hard round shell, ten legs, and large claws.',
    example_en = 'Steamed king crab is a delicacy in coastal restaurants.',
    example_vn = 'Cua hoàng đế hấp là một món đặc sản ở các nhà hàng ven biển.'
WHERE detection_label = 'crab';

UPDATE words
SET en_word = 'hoverboard',
    phonetic = '/ˈhɑː.vɚ.bɔːrd/',
    pos = 'Noun',
    translation = 'ván trượt điện tự cân bằng',
    definition = 'A self-balancing two-wheeled electric personal transporter.',
    example_en = 'The teenager glided down the sidewalk on his new hoverboard.',
    example_vn = 'Cậu thiếu niên lướt nhẹ trên vỉa hè bằng chiếc ván trượt điện mới.'
WHERE detection_label = 'hoverboard';

UPDATE words
SET en_word = 'meatball',
    phonetic = '/ˈmiːt.bɑːl/',
    pos = 'Noun',
    translation = 'thịt viên / bò viên',
    definition = 'A small ball of ground meat seasoned and cooked in sauce.',
    example_en = 'Spaghetti served with savory Italian meatballs is a family favorite.',
    example_vn = 'Mì spaghetti dùng kèm thịt viên Ý thơm ngon là món ăn yêu thích của cả gia đình.'
WHERE detection_label = 'meatball';

UPDATE words
SET en_word = 'rice cooker',
    phonetic = '/ˈraɪs ˌkʊk.ɚ/',
    pos = 'Noun',
    translation = 'nồi cơm điện',
    definition = 'An automated electric appliance designed to boil and steam rice.',
    example_en = 'The automatic rice cooker keeps the rice warm all day.',
    example_vn = 'Nồi cơm điện tự động giữ cho cơm luôn ấm nóng suốt cả ngày.'
WHERE detection_label = 'rice cooker';

UPDATE words
SET en_word = 'tuba',
    phonetic = '/ˈtuː.bə/',
    pos = 'Noun',
    translation = 'kèn tuba',
    definition = 'The largest and lowest-pitched brass instrument in an orchestra.',
    example_en = 'The orchestra tuba provides a deep, booming bass foundation.',
    example_vn = 'Chiếc kèn tuba trong dàn nhạc mang lại nền âm trầm sâu lắng và vang dội.'
WHERE detection_label = 'tuba';

UPDATE words
SET en_word = 'papaya',
    phonetic = '/pəˈpaɪ.ə/',
    pos = 'Noun',
    translation = 'quả đu đủ',
    definition = 'A tropical fruit with orange-yellow sweet flesh and black seeds.',
    example_en = 'Ripe sweet papaya is a healthy digestion-friendly dessert.',
    example_vn = 'Đu đủ chín ngọt là món tráng miệng lành mạnh rất tốt cho tiêu hóa.'
WHERE detection_label = 'papaya';

UPDATE words
SET en_word = 'antelope',
    phonetic = '/ˈæn.t̬əl.oʊp/',
    pos = 'Noun',
    translation = 'linh dương',
    definition = 'A fast-running deer-like animal with long horns found in Africa and Asia.',
    example_en = 'A herd of antelopes ran across the open plain.',
    example_vn = 'Một đàn linh dương chạy băng qua đồng cỏ rộng lớn.'
WHERE detection_label = 'antelope';

UPDATE words
SET en_word = 'parrot',
    phonetic = '/ˈper.ət/',
    pos = 'Noun',
    translation = 'con vẹt',
    definition = 'A tropical bird with brilliant plumage and a hooked bill.',
    example_en = 'The colorful parrot repeated every phrase the pirate spoke.',
    example_vn = 'Chú vẹt sặc sỡ lặp lại từng câu mà tên cướp biển nói.'
WHERE detection_label = 'parrot';

UPDATE words
SET en_word = 'seal',
    phonetic = '/siːl/',
    pos = 'Noun',
    translation = 'hải cẩu / chó biển',
    definition = 'A semi-aquatic marine mammal with sleek fur and flippers.',
    example_en = 'The playful seal clapped its flippers and basked on the rocks.',
    example_vn = 'Chú hải cẩu tinh nghịch vỗ vây và sưởi nắng trên những tảng đá.'
WHERE detection_label = 'seal';

UPDATE words
SET en_word = 'butterfly',
    phonetic = '/ˈbʌt̬.ɚ.flaɪ/',
    pos = 'Noun',
    translation = 'con bướm',
    definition = 'An insect with four large, often brightly colored wings.',
    example_en = 'A colorful butterfly fluttered among the spring flowers.',
    example_vn = 'Một chú bướm sặc sỡ bay rập rờn giữa những bông hoa mùa xuân.'
WHERE detection_label = 'butterfly';

UPDATE words
SET en_word = 'dumbbell',
    phonetic = '/ˈdʌm.bel/',
    pos = 'Noun',
    translation = 'quả tạ tay',
    definition = 'A short bar with a weight at each end, used for arm exercises.',
    example_en = 'He exercises his arms by lifting pairs of dumbbells.',
    example_vn = 'Anh ấy tập luyện cơ tay bằng cách nâng các quả tạ tay.'
WHERE detection_label = 'dumbbell';

UPDATE words
SET en_word = 'donkey',
    phonetic = '/ˈdɑːŋ.ki/',
    pos = 'Noun',
    translation = 'con lừa',
    definition = 'A domesticated mammal of the horse family with long ears.',
    example_en = 'The farmer loaded sacks of grain onto the strong donkey.',
    example_vn = 'Người nông dân chất các bao ngũ cốc lên lưng chú lừa khỏe mạnh.'
WHERE detection_label = 'donkey';

UPDATE words
SET en_word = 'lion',
    phonetic = '/ˈlaɪ.ən/',
    pos = 'Noun',
    translation = 'con sư tử',
    definition = 'A large tawny-colored cat with a flowing mane in males, native to Africa.',
    example_en = 'The majestic male lion rested beneath the shady acacia tree.',
    example_vn = 'Con sư tử đực uy nghi nằm nghỉ dưới bóng cây keo.'
WHERE detection_label = 'lion';

UPDATE words
SET en_word = 'urinal',
    phonetic = '/ˈjʊr.ə.nəl/',
    pos = 'Noun',
    translation = 'bồn tiểu nam',
    definition = 'A porcelain plumbing fixture in men''s public restrooms.',
    example_en = 'The modern commercial restroom is fitted with automated sensor urinals.',
    example_vn = 'Phòng vệ sinh thương mại hiện đại được lắp đặt các bồn tiểu nam cảm ứng tự động.'
WHERE detection_label = 'urinal';

UPDATE words
SET en_word = 'dolphin',
    phonetic = '/ˈdɑːl.fɪn/',
    pos = 'Noun',
    translation = 'cá heo',
    definition = 'An intelligent sea mammal with a curved dorsal fin and snout.',
    example_en = 'A pod of dolphins leaped gracefully through the ocean waves.',
    example_vn = 'Một đàn cá heo nhảy múa duyên dáng qua những con sóng đại dương.'
WHERE detection_label = 'dolphin';

UPDATE words
SET en_word = 'electric drill',
    phonetic = '/iˌlek.trɪk ˈdrɪl/',
    pos = 'Noun',
    translation = 'máy khoan điện',
    definition = 'A power tool used for making round holes or driving fasteners.',
    example_en = 'He used an electric drill to mount the shelf to the wall.',
    example_vn = 'Anh ấy dùng máy khoan điện để gắn chiếc kệ lên tường.'
WHERE detection_label = 'electric drill';

UPDATE words
SET en_word = 'egg tart',
    phonetic = '/eɡ tɑːrt/',
    pos = 'Noun',
    translation = 'bánh trứng nướng',
    definition = 'A pastry tart filled with sweet egg custard.',
    example_en = 'Warm egg tarts have a flaky crust and creamy filling.',
    example_vn = 'Bánh trứng nướng ấm nóng có lớp vỏ giòn xốp và nhân kem béo ngậy.'
WHERE detection_label = 'egg tart';

UPDATE words
SET en_word = 'jellyfish',
    phonetic = '/ˈdʒel.i.fɪʃ/',
    pos = 'Noun',
    translation = 'con sứa',
    definition = 'A free-swimming marine animal with a gelatinous bell and tentacles.',
    example_en = 'Be careful of stinging jellyfish when swimming in the ocean.',
    example_vn = 'Hãy cẩn thận với sứa biển đốt khi bơi ở đại dương.'
WHERE detection_label = 'jellyfish';

UPDATE words
SET en_word = 'treadmill',
    phonetic = '/ˈtred.mɪl/',
    pos = 'Noun',
    translation = 'máy chạy bộ',
    definition = 'An indoor stationary exercise machine with a running belt.',
    example_en = 'She runs three miles on the gym treadmill every morning.',
    example_vn = 'Cô ấy chạy ba dặm trên chiếc máy chạy bộ ở phòng tập mỗi sáng.'
WHERE detection_label = 'treadmill';

UPDATE words
SET en_word = 'lighter',
    phonetic = '/ˈlaɪ.t̬ɚ/',
    pos = 'Noun',
    translation = 'cái bật lửa / hột quẹt',
    definition = 'A small portable device used for igniting a flame.',
    example_en = 'He used a cigarette lighter to light the birthday candles.',
    example_vn = 'Anh ấy dùng bật lửa để thắp những ngọn nến sinh nhật.'
WHERE detection_label = 'lighter';

UPDATE words
SET en_word = 'grapefruit',
    phonetic = '/ˈɡreɪp.fruːt/',
    pos = 'Noun',
    translation = 'quả bưởi',
    definition = 'A large round citrus fruit with sour, mildly bitter pulp.',
    example_en = 'A glass of freshly squeezed grapefruit juice is rich in vitamin C.',
    example_vn = 'Một ly nước ép bưởi tươi rất giàu vitamin C.'
WHERE detection_label = 'grapefruit';

UPDATE words
SET en_word = 'game board',
    phonetic = '/ˈɡeɪm bɔːrd/',
    pos = 'Noun',
    translation = 'bàn cờ trò chơi',
    definition = 'A specially designed board on which board games are played.',
    example_en = 'The family gathered around the chess game board.',
    example_vn = 'Cả gia đình quây quần quanh bàn cờ vua.'
WHERE detection_label = 'game board';

UPDATE words
SET en_word = 'mop',
    phonetic = '/mɑːp/',
    pos = 'Noun',
    translation = 'cây lau nhà',
    definition = 'A bundle of coarse yarn attached to a long handle for cleaning floors.',
    example_en = 'Use a damp floor mop to clean up the spilled juice.',
    example_vn = 'Hãy dùng cây lau nhà ẩm để lau sạch chỗ nước trái cây bị đổ.'
WHERE detection_label = 'mop';

UPDATE words
SET en_word = 'radish',
    phonetic = '/ˈræd.ɪʃ/',
    pos = 'Noun',
    translation = 'củ cải',
    definition = 'A small pungent crisp root vegetable eaten raw or pickled.',
    example_en = 'Crunchy red radishes add peppery zest to fresh salads.',
    example_vn = 'Những củ cải đỏ giòn giòn tạo thêm vị cay nhẹ hấp dẫn cho món salad.'
WHERE detection_label = 'radish';

UPDATE words
SET en_word = 'baozi',
    phonetic = '/ˈbaʊ.zi/',
    pos = 'Noun',
    translation = 'bánh bao',
    definition = 'A type of steamed filled bun popular in Chinese cuisine.',
    example_en = 'He ate two warm baozi buns for breakfast.',
    example_vn = 'Anh ấy ăn hai chiếc bánh bao nóng cho bữa sáng.'
WHERE detection_label = 'baozi';

UPDATE words
SET en_word = 'shooting target / bullseye',
    phonetic = '/ˈtɑːr.ɡɪt/',
    pos = 'Noun',
    translation = 'bia bắn / hồng tâm',
    definition = 'A marked disc or board aimed at in archery or shooting sports.',
    example_en = 'The archer hit the exact center of the circular target.',
    example_vn = 'Cung thủ đã bắn trúng ngay tâm hồng tâm của tấm bia tròn.'
WHERE detection_label = 'target';

UPDATE words
SET en_word = 'French bread / baguette',
    phonetic = '/fræns/',
    pos = 'Noun',
    translation = 'bánh mì Pháp / bánh mì baguette',
    definition = 'A long, thin loaf of French bread with a crisp crust.',
    example_en = 'He bought a warm French baguette from the local bakery.',
    example_vn = 'Anh ấy đã mua một ổ bánh mì Pháp nóng giòn từ tiệm bánh địa phương.'
WHERE detection_label = 'french';

UPDATE words
SET en_word = 'spring rolls',
    phonetic = '/ˈsprɪŋ roʊlz/',
    pos = 'Noun',
    translation = 'chả giò / nem rán',
    definition = 'Crispy rolled appetizers filled with savory meat, shrimp, and vegetables.',
    example_en = 'Crispy golden spring rolls are served with sweet and sour fish sauce.',
    example_vn = 'Những chiếc chả giò vàng giòn rụm được dùng kèm với nước mắm chua ngọt.'
WHERE detection_label = 'spring rolls';

UPDATE words
SET en_word = 'monkey',
    phonetic = '/ˈmʌŋ.ki/',
    pos = 'Noun',
    translation = 'con khỉ',
    definition = 'A playful agile primate with a long tail, living mostly in trees.',
    example_en = 'The playful monkey swung effortlessly through the jungle branches.',
    example_vn = 'Chú khỉ nghịch ngợm đu người một cách nhẹ nhàng qua các cành cây rừng.'
WHERE detection_label = 'monkey';

UPDATE words
SET en_word = 'rabbit',
    phonetic = '/ˈræb.ɪt/',
    pos = 'Noun',
    translation = 'con thỏ',
    definition = 'A burrowing, gregarious mammal with long ears and soft fur.',
    example_en = 'The fluffy white rabbit nibbled on a fresh green lettuce leaf.',
    example_vn = 'Chú thỏ trắng mịn màng gặm một chiếc lá xà lách xanh tươi.'
WHERE detection_label = 'rabbit';

UPDATE words
SET en_word = 'yak',
    phonetic = '/jæk/',
    pos = 'Noun',
    translation = 'bò Tây Tạng',
    definition = 'A large domesticated ox with shaggy hair and humped shoulders native to Tibet.',
    example_en = 'The hardy Himalayan yak thrives in cold, high-altitude mountainous terrains.',
    example_vn = 'Loài bò Tây Tạng kiên cường phát triển mạnh mẽ ở những vùng núi cao lạnh giá của dãy Himalaya.'
WHERE detection_label = 'yak';

UPDATE words
SET en_word = 'red cabbage',
    phonetic = '/ˌred ˈkæb.ɪdʒ/',
    pos = 'Noun',
    translation = 'bắp cải tím',
    definition = 'A variety of cabbage with dark reddish-purple leaves.',
    example_en = 'Shredded red cabbage adds vibrant color to coleslaw.',
    example_vn = 'Bắp cải tím bào sợi tạo thêm màu sắc rực rỡ cho món salad bắp cải.'
WHERE detection_label = 'red cabbage';

UPDATE words
SET en_word = 'binoculars',
    phonetic = '/bəˈnɑː.kjə.lɚz/',
    pos = 'Noun',
    translation = 'ống nhòm',
    definition = 'An optical instrument with two lenses for viewing distant objects.',
    example_en = 'He used binoculars to watch the birds in the trees.',
    example_vn = 'Anh ấy dùng ống nhòm để ngắm những chú chim trên cây.'
WHERE detection_label = 'binoculars';

UPDATE words
SET en_word = 'asparagus',
    phonetic = '/əˈsper.ə.ɡəs/',
    pos = 'Noun',
    translation = 'măng tây',
    definition = 'A green vegetable with long slender spears that are cooked and eaten.',
    example_en = 'Grilled asparagus is delicious with olive oil.',
    example_vn = 'Măng tây nướng rất ngon khi dùng kèm dầu ô liu.'
WHERE detection_label = 'asparagus';

UPDATE words
SET en_word = 'barbell',
    phonetic = '/ˈbɑːr.bel/',
    pos = 'Noun',
    translation = 'tạ đòn',
    definition = 'A long metal bar with weights attached at each end used for weightlifting.',
    example_en = 'He lifted the heavy barbell over his head.',
    example_vn = 'Anh ấy nâng thanh tạ đòn nặng qua đầu.'
WHERE detection_label = 'barbell';

UPDATE words
SET en_word = 'scallop',
    phonetic = '/ˈskɑː.ləp/',
    pos = 'Noun',
    translation = 'sò điệp',
    definition = 'An edible bivalve mollusc with a fluted fan-shaped shell.',
    example_en = 'Pan-seared scallops with garlic butter are a gourmet starter.',
    example_vn = 'Sò điệp áp chảo bơ tỏi là một món khai vị hảo hạng.'
WHERE detection_label = 'scallop';

UPDATE words
SET en_word = 'noodles',
    phonetic = '/ˈnuː.dəlz/',
    pos = 'Noun',
    translation = 'mì sợi / bún phở',
    definition = 'Strips or ribbons of unleavened dough cooked in boiling broth.',
    example_en = 'A steaming bowl of beef noodle soup warms you up.',
    example_vn = 'Một tô mì bò nóng hổi bốc khói sẽ làm bạn ấm lòng.'
WHERE detection_label = 'noddles';

UPDATE words
SET en_word = 'dumpling',
    phonetic = '/ˈdʌm.plɪŋ/',
    pos = 'Noun',
    translation = 'bánh sủi cảo / há cảo',
    definition = 'A small piece of dough wrapped around a savoury meat or vegetable filling.',
    example_en = 'Steamed pork dumplings are served with soy dipping sauce.',
    example_vn = 'Sủi cảo thịt lợn hấp được dùng kèm với nước tương chấm.'
WHERE detection_label = 'dumpling';

UPDATE words
SET en_word = 'oyster',
    phonetic = '/ˈɔɪ.stɚ/',
    pos = 'Noun',
    translation = 'con hàu',
    definition = 'A shellfish with a rough irregular shell, prized as edible seafood.',
    example_en = 'Fresh raw oysters are served with lemon wedges.',
    example_vn = 'Hàu tươi sống được phục vụ cùng các lát chanh.'
WHERE detection_label = 'oyster';

UPDATE words
SET en_word = 'table tennis racket',
    phonetic = '/ˈteɪ.bəl ˌten.ɪs ˈpæd.əl/',
    pos = 'Noun',
    translation = 'vợt bóng bàn',
    definition = 'A small wooden bat with rubber surfaces used in table tennis.',
    example_en = 'He held his table tennis paddle using a firm shakehand grip.',
    example_vn = 'Anh ấy cầm cây vợt bóng bàn bằng cách cầm vợt dọc chắc chắn.'
WHERE detection_label = 'table tennis paddle';

UPDATE words
SET en_word = 'makeup brush / eyeliner',
    phonetic = '/ˈmeɪk.ʌp brʌʃ/',
    pos = 'Noun',
    translation = 'cọ trang điểm / bút kẻ mắt',
    definition = 'Tools used for applying foundation, powder, or eyeliner to the face.',
    example_en = 'She used an eyeliner pencil to outline her eyes.',
    example_vn = 'Cô ấy dùng bút kẻ mắt để viền quanh đôi mắt.'
WHERE detection_label = 'cosmetics brush/eyeliner pencil';

UPDATE words
SET en_word = 'chainsaw',
    phonetic = '/ˈtʃeɪn.sɑː/',
    pos = 'Noun',
    translation = 'máy cưa xích',
    definition = 'A portable motorized saw with teeth linked in a continuous chain.',
    example_en = 'The lumberjack used a chainsaw to cut down the fallen tree.',
    example_vn = 'Người tiều phu dùng máy cưa xích để cắt cây đổ.'
WHERE detection_label = 'chainsaw';

UPDATE words
SET en_word = 'lobster',
    phonetic = '/ˈlɑːb.stɚ/',
    pos = 'Noun',
    translation = 'tôm hùm',
    definition = 'A large marine crustacean with ten legs and prominent pincers.',
    example_en = 'Steamed buttered lobster was the highlight of the banquet.',
    example_vn = 'Tôm hùm hấp bơ là điểm nhấn của bữa tiệc lớn.'
WHERE detection_label = 'lobster';

UPDATE words
SET en_word = 'durian',
    phonetic = '/ˈdʊr.i.ən/',
    pos = 'Noun',
    translation = 'quả sầu riêng',
    definition = 'A large spiky tropical fruit known for its strong pungent aroma.',
    example_en = 'Durian is famous as the king of fruits in Southeast Asia.',
    example_vn = 'Sầu riêng nổi tiếng là vua của các loại trái cây ở Đông Nam Á.'
WHERE detection_label = 'durian';

UPDATE words
SET en_word = 'okra',
    phonetic = '/ˈoʊ.krə/',
    pos = 'Noun',
    translation = 'đậu bắp',
    definition = 'A green pod vegetable with ridged skin, popular in soups and stews.',
    example_en = 'Boiled fresh okra is delicious dipped in spicy soy sauce.',
    example_vn = 'Đậu bắp tươi luộc chấm nước tương cay ăn rất ngon.'
WHERE detection_label = 'okra';

UPDATE words
SET en_word = 'lipstick',
    phonetic = '/ˈlɪp.stɪk/',
    pos = 'Noun',
    translation = 'thỏi son môi',
    definition = 'A cosmetic applied in a stick to color and moisturize lips.',
    example_en = 'She selected a radiant red lipstick for the party.',
    example_vn = 'Cô ấy chọn một thỏi son môi đỏ rạng rỡ cho bữa tiệc.'
WHERE detection_label = 'lipstick';

UPDATE words
SET en_word = 'vanity mirror',
    phonetic = '/ˈvæn.ə.t̬i ˌmɪr.ɚ/',
    pos = 'Noun',
    translation = 'gương trang điểm',
    definition = 'A small illuminated or magnifying mirror used when applying makeup.',
    example_en = 'She checked her makeup in the cosmetics mirror.',
    example_vn = 'Cô ấy kiểm tra lại lớp trang điểm trong chiếc gương trang điểm.'
WHERE detection_label = 'cosmetics mirror';

UPDATE words
SET en_word = 'curling stone',
    phonetic = '/ˈkɝː.lɪŋ stoʊn/',
    pos = 'Noun',
    translation = 'đá uốn dẻo / môn bi đá trên băng',
    definition = 'A winter sport where players slide heavy polished stones on ice.',
    example_en = 'Curling is an exciting winter Olympic team sport.',
    example_vn = 'Bi đá trên băng là một môn thể thao đồng đội mùa đông hấp dẫn tại Thế vận hội.'
WHERE detection_label = 'curling';

UPDATE words
SET en_word = 'table tennis / ping pong',
    phonetic = '/ˈteɪ.bəl ˌten.ɪs/',
    pos = 'Noun',
    translation = 'bóng bàn',
    definition = 'An indoor racket sport played across a divided table with lightweight balls.',
    example_en = 'They enjoy a fast-paced game of table tennis after school.',
    example_vn = 'Họ thích chơi một trận bóng bàn tốc độ cao sau giờ học.'
WHERE detection_label = 'table tennis';
