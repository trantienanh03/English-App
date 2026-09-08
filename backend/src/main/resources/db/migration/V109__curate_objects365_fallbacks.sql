-- Revamp general placeholder values to read as natural, educational templates instead of database entries
UPDATE words
SET definition = 'A vocabulary word representing ' || LOWER(REPLACE(detection_label, '/', ' or ')),
    example_en = 'Can you see the ' || LOWER(REPLACE(detection_label, '/', ' or ')) || ' in this area?',
    example_vn = 'Bạn có nhìn thấy ' || LOWER(REPLACE(detection_label, '/', ' hoặc ')) || ' ở khu vực này không?',
    translation = REPLACE(detection_label, '/', ' / '),
    en_word = REPLACE(detection_label, '/', ' / ')
WHERE example_en LIKE 'The image contains%';

-- picture/frame
UPDATE words
SET en_word = 'picture frame',
    phonetic = '/ˈpɪk.tʃɚ freɪm/',
    translation = 'khung ảnh / bức tranh',
    definition = 'A decorative border or case for holding a picture or painting.',
    example_en = 'She hung a beautiful picture frame on the living room wall.',
    example_vn = 'Cô ấy đã treo một chiếc khung ảnh đẹp trên bức tường phòng khách.'
WHERE detection_label = 'picture/frame';

-- cabinet/shelf
UPDATE words
SET en_word = 'cabinet / shelf',
    phonetic = '/ˈkæb.ən.ət / ʃelf/',
    translation = 'tủ / kệ sách',
    definition = 'A piece of furniture with shelves or drawers, used for storing or displaying items.',
    example_en = 'Please place the books back on the shelf when you are finished.',
    example_vn = 'Vui lòng đặt những cuốn sách trở lại kệ sau khi bạn đọc xong.'
WHERE detection_label = 'cabinet/shelf';

-- handbag/satchel
UPDATE words
SET en_word = 'handbag',
    phonetic = '/ˈhænd.bæɡ/',
    translation = 'túi xách',
    definition = 'A small bag used by women to carry everyday personal items.',
    example_en = 'She left her leather handbag on the chair.',
    example_vn = 'Cô ấy đã để quên chiếc túi xách da của mình trên ghế.'
WHERE detection_label = 'handbag/satchel';

-- bowl/basin
UPDATE words
SET en_word = 'bowl',
    phonetic = '/boʊl/',
    translation = 'cái bát / cái tô',
    definition = 'A round, open container used for holding food or liquids.',
    example_en = 'He poured some hot soup into a large ceramic bowl.',
    example_vn = 'Anh ấy đã múc một ít súp nóng vào chiếc tô gốm lớn.'
WHERE detection_label = 'bowl/basin';

-- other shoes
UPDATE words
SET en_word = 'shoes',
    phonetic = '/ʃuːz/',
    translation = 'giày',
    definition = 'Outer coverings for the feet, typically made of leather or plastic.',
    example_en = 'Make sure to clean your shoes before entering the house.',
    example_vn = 'Hãy chắc chắn rằng bạn đã làm sạch giày trước khi vào nhà.'
WHERE detection_label = 'other shoes';

-- street lights
UPDATE words
SET en_word = 'street light',
    phonetic = '/ˈstriːt laɪt/',
    translation = 'đèn đường',
    definition = 'A light, usually on a tall pole, illuminating a street or road.',
    example_en = 'The street lights turn on automatically when it gets dark.',
    example_vn = 'Đèn đường sẽ tự động bật khi trời tối.'
WHERE detection_label = 'street lights';

-- storage box
UPDATE words
SET en_word = 'storage box',
    phonetic = '/ˈstɔːr.ɪdʒ bɑːks/',
    translation = 'hộp lưu trữ / thùng chứa đồ',
    definition = 'A sturdy container designed for keeping and organizing items.',
    example_en = 'We packed all the old toys into a plastic storage box.',
    example_vn = 'Chúng tôi đã đóng gói tất cả đồ chơi cũ vào một chiếc hộp lưu trữ bằng nhựa.'
WHERE detection_label = 'storage box';

-- leather shoes
UPDATE words
SET en_word = 'leather shoes',
    phonetic = '/ˈleð.ɚ ʃuːz/',
    translation = 'giày da',
    definition = 'Shoes made of processed animal skins, often worn for formal occasions.',
    example_en = 'He wore polished black leather shoes to the job interview.',
    example_vn = 'Anh ấy đã đi giày da đen bóng đến buổi phỏng vấn xin việc.'
WHERE detection_label = 'leather shoes';

-- potted plant
UPDATE words
SET en_word = 'potted plant',
    phonetic = '/ˈpɑː.t̬ɪd plænt/',
    translation = 'chậu cây cảnh',
    definition = 'A plant grown in a container or pot, usually kept indoors.',
    example_en = 'There is a green potted plant sitting on the window sill.',
    example_vn = 'Có một chậu cây xanh đặt trên bậu cửa sổ.'
WHERE detection_label = 'potted plant';

-- wine glass
UPDATE words
SET en_word = 'wine glass',
    phonetic = '/ˈwaɪn ˌɡlæs/',
    translation = 'ly uống rượu vang',
    definition = 'A glass with a stem and a bowl, designed specifically for drinking wine.',
    example_en = 'She filled the elegant wine glass with red wine.',
    example_vn = 'Cô ấy rót đầy rượu vang đỏ vào chiếc ly uống rượu sang trọng.'
WHERE detection_label = 'wine glass';

-- traffic light
UPDATE words
SET en_word = 'traffic light',
    phonetic = '/ˈtræf.ɪk laɪt/',
    translation = 'đèn giao thông',
    definition = 'A set of colored lights that control the flow of vehicles at road intersections.',
    example_en = 'The traffic light turned red just as we reached the intersection.',
    example_vn = 'Đèn giao thông chuyển sang màu đỏ ngay khi chúng tôi đến ngã tư.'
WHERE detection_label = 'traffic light';

-- trash bin can
UPDATE words
SET en_word = 'trash can',
    phonetic = '/træʃ kæn/',
    translation = 'thùng rác',
    definition = 'A container used for holding garbage or waste materials.',
    example_en = 'Please throw the empty plastic bottle into the trash can.',
    example_vn = 'Vui lòng vứt chai nhựa rỗng vào thùng rác.'
WHERE detection_label = 'trash bin can';

-- barrel/bucket
UPDATE words
SET en_word = 'bucket',
    phonetic = '/ˈbʌk.ɪt/',
    translation = 'cái xô / cái thùng',
    definition = 'A cylindrical container with a handle, used for carrying liquids.',
    example_en = 'We filled the bucket with warm soapy water to clean the floor.',
    example_vn = 'Chúng tôi đã đổ nước xà phòng ấm đầy xô để lau sàn.'
WHERE detection_label = 'barrel/bucket';

-- monitor/tv
UPDATE words
SET en_word = 'monitor / TV',
    phonetic = '/ˈmɑː.nə.t̬ɚ/',
    translation = 'màn hình máy tính / tivi',
    definition = 'An electronic screen used to display images, video, or computer information.',
    example_en = 'He adjusted the brightness of his computer monitor.',
    example_vn = 'Anh ấy đã điều chỉnh độ sáng của màn hình máy tính.'
WHERE detection_label = 'monitor/tv';
