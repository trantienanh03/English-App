import { VocabularyWord, Lesson, UserProgress, QuizQuestion } from '../types';

export const mockWords: VocabularyWord[] = [
  {
    id: 'w1',
    word: 'cup',
    phonetic: '/kʌp/',
    vn: 'cái cốc / tách',
    pos: 'Noun',
    sentence: 'She wrapped her hands around her cup to stay warm.',
    sentenceVn: 'Cô ấy ôm lấy cái cốc để giữ ấm.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w2',
    word: 'laptop',
    phonetic: '/ˈlæptɒp/',
    vn: 'máy tính xách tay',
    pos: 'Noun',
    sentence: 'She opened her laptop to check her emails.',
    sentenceVn: 'Cô ấy mở máy tính xách tay để kiểm tra email.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w3',
    word: 'bottle',
    phonetic: '/ˈbɒtl/',
    vn: 'chai / bình nước',
    pos: 'Noun',
    sentence: 'Always carry a water bottle when you exercise.',
    sentenceVn: 'Hãy luôn mang theo chai nước khi bạn tập thể dục.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w4',
    word: 'headphones',
    phonetic: '/ˈhɛdfəʊnz/',
    vn: 'tai nghe chụp tai',
    pos: 'Noun',
    sentence: 'He put on his headphones to listen to music.',
    sentenceVn: 'Anh ấy đeo tai nghe để nghe nhạc.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w5',
    word: 'notebook',
    phonetic: '/ˈnəʊtbʊk/',
    vn: 'quyển sổ ghi chép',
    pos: 'Noun',
    sentence: 'She wrote her notes in a small notebook.',
    sentenceVn: 'Cô ấy ghi chép những ghi chú vào một cuốn sổ nhỏ.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&auto=format&fit=crop&q=60'
  }
];

export const mockLessons: Lesson[] = [
  {
    id: 'les1',
    name: 'Đồ dùng học tập & Văn phòng',
    description: 'Từ vựng các vật thể quen thuộc trong lớp học và văn phòng làm việc',
    difficulty: 'Sơ cấp',
    category: 'Văn phòng',
    icon: 'book-open',
    wordCount: 5,
    progress: 0,
    words: [
      { id: 'l1_1', word: 'laptop', phonetic: '/ˈlæptɒp/', vn: 'máy tính xách tay', pos: 'Noun', sentence: 'I work on my laptop every day.', sentenceVn: 'Tôi làm việc trên máy tính xách tay mỗi ngày.', difficulty: 'easy' },
      { id: 'l1_2', word: 'notebook', phonetic: '/ˈnəʊtbʊk/', vn: 'sổ ghi chép', pos: 'Noun', sentence: 'Write the notes in your notebook.', sentenceVn: 'Ghi chép vào sổ tay của bạn.', difficulty: 'easy' },
      { id: 'l1_3', word: 'pen', phonetic: '/pɛn/', vn: 'bút bi / bút mực', pos: 'Noun', sentence: 'He signed the contract with a black pen.', sentenceVn: 'Anh ấy ký hợp đồng bằng bút mực đen.', difficulty: 'easy' },
      { id: 'l1_4', word: 'pencil', phonetic: '/ˈpɛnsɪl/', vn: 'bút chì', pos: 'Noun', sentence: 'Draw a sketch with a pencil.', sentenceVn: 'Vẽ phác thảo bằng bút chì.', difficulty: 'easy' },
      { id: 'l1_5', word: 'chair', phonetic: '/tʃɛər/', vn: 'cái ghế', pos: 'Noun', sentence: 'Sit comfortably on the chair.', sentenceVn: 'Ngồi thoải mái trên ghế.', difficulty: 'easy' },
    ]
  },
  {
    id: 'les2',
    name: 'Thực phẩm & Đồ dùng Nhà bếp',
    description: 'Các vật thể và thực phẩm phổ biến trong gian bếp gia đình',
    difficulty: 'Sơ cấp',
    category: 'Nhà bếp',
    icon: 'coffee',
    wordCount: 5,
    progress: 0,
    words: [
      { id: 'l2_1', word: 'cup', phonetic: '/kʌp/', vn: 'cái cốc / tách', pos: 'Noun', sentence: 'A cup of hot tea in the morning.', sentenceVn: 'Một cốc trà nóng vào buổi sáng.', difficulty: 'easy' },
      { id: 'l2_2', word: 'bottle', phonetic: '/ˈbɒtl/', vn: 'chai / bình nước', pos: 'Noun', sentence: 'Keep a water bottle on your desk.', sentenceVn: 'Giữ chai nước trên bàn làm việc.', difficulty: 'easy' },
      { id: 'l2_3', word: 'plate', phonetic: '/pleɪt/', vn: 'cái đĩa', pos: 'Noun', sentence: 'Put the sandwich on the plate.', sentenceVn: 'Đặt bánh mì kẹp lên đĩa.', difficulty: 'easy' },
      { id: 'l2_4', word: 'apple', phonetic: '/ˈæpl/', vn: 'quả táo', pos: 'Noun', sentence: 'An apple a day keeps the doctor away.', sentenceVn: 'Mỗi ngày một quả táo giúp cơ thể khỏe mạnh.', difficulty: 'easy' },
      { id: 'l2_5', word: 'banana', phonetic: '/bəˈnɑːnə/', vn: 'quả chuối', pos: 'Noun', sentence: 'Bananas are rich in potassium.', sentenceVn: 'Chuối rất giàu kali.', difficulty: 'easy' },
    ]
  },
  {
    id: 'les3',
    name: 'Phương tiện Giao thông',
    description: 'Tên gọi các phương tiện di chuyển phổ biến trên đường phố',
    difficulty: 'Trung cấp',
    category: 'Giao thông',
    icon: 'truck',
    wordCount: 5,
    progress: 0,
    words: [
      { id: 'l3_1', word: 'car', phonetic: '/kɑːr/', vn: 'xe ô tô', pos: 'Noun', sentence: 'He drives a blue car to work.', sentenceVn: 'Anh ấy lái ô tô màu xanh đi làm.', difficulty: 'easy' },
      { id: 'l3_2', word: 'bicycle', phonetic: '/ˈbaɪsɪkl/', vn: 'xe đạp', pos: 'Noun', sentence: 'Riding a bicycle is good exercise.', sentenceVn: 'Đi xe đạp là hình thức tập thể dục tốt.', difficulty: 'easy' },
      { id: 'l3_3', word: 'bus', phonetic: '/bʌs/', vn: 'xe buýt', pos: 'Noun', sentence: 'Take the bus to the city center.', sentenceVn: 'Bắt xe buýt đến trung tâm thành phố.', difficulty: 'easy' },
      { id: 'l3_4', word: 'motorcycle', phonetic: '/ˈmoʊtərsaɪkl/', vn: 'xe máy', pos: 'Noun', sentence: 'Wear a helmet when riding a motorcycle.', sentenceVn: 'Đội mũ bảo hiểm khi đi xe máy.', difficulty: 'easy' },
      { id: 'l3_5', word: 'airplane', phonetic: '/ˈɛərpleɪn/', vn: 'máy bay', pos: 'Noun', sentence: 'The airplane landed safely at the airport.', sentenceVn: 'Máy bay đã hạ cánh an toàn xuống sân bay.', difficulty: 'easy' },
    ]
  },
  {
    id: 'les4',
    name: 'Thế giới Động vật',
    description: 'Từ vựng tiếng Anh về các loài động vật xung quanh chúng ta',
    difficulty: 'Sơ cấp',
    category: 'Động vật',
    icon: 'heart',
    wordCount: 5,
    progress: 0,
    words: [
      { id: 'l4_1', word: 'cat', phonetic: '/kæt/', vn: 'con mèo', pos: 'Noun', sentence: 'The cat is sleeping on the sofa.', sentenceVn: 'Con mèo đang ngủ trên ghế sofa.', difficulty: 'easy' },
      { id: 'l4_2', word: 'dog', phonetic: '/dɒɡ/', vn: 'con chó', pos: 'Noun', sentence: 'The dog barked happily at the door.', sentenceVn: 'Con chó sủa vui vẻ ngoài cửa.', difficulty: 'easy' },
      { id: 'l4_3', word: 'bird', phonetic: '/bɜːrd/', vn: 'con chim', pos: 'Noun', sentence: 'A bird is singing in the tree.', sentenceVn: 'Một chú chim đang hót trên cây.', difficulty: 'easy' },
      { id: 'l4_4', word: 'horse', phonetic: '/hɔːrs/', vn: 'con ngựa', pos: 'Noun', sentence: 'He rode a white horse across the field.', sentenceVn: 'Anh ấy cưỡi con ngựa trắng qua cánh đồng.', difficulty: 'easy' },
      { id: 'l4_5', word: 'bear', phonetic: '/bɛər/', vn: 'con gấu', pos: 'Noun', sentence: 'The brown bear lives in the forest.', sentenceVn: 'Con gấu nâu sống trong rừng sâu.', difficulty: 'easy' },
    ]
  }
];

export const mockQuizzes: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'Từ "laptop" trong tiếng Anh có nghĩa là gì?',
    options: ['Máy tính xách tay', 'Màn hình TV', 'Điện thoại di động', 'Máy tính bỏ túi'],
    answer: 'Máy tính xách tay',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: 'Từ nào sau đây mang nghĩa "cái cốc / tách"?',
    options: ['cup', 'plate', 'bottle', 'fork'],
    answer: 'cup',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: 'Nghĩa tiếng Việt của từ "bicycle" là gì?',
    options: ['Xe đạp', 'Xe máy', 'Xe ô tô', 'Xe buýt'],
    answer: 'Xe đạp',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: 'Từ nào sau đây mô tả con vật "con mèo"?',
    options: ['cat', 'dog', 'bird', 'horse'],
    answer: 'cat',
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    question: 'Điền từ còn thiếu vào câu: "She wrote notes in her _____."',
    options: ['notebook', 'glasses', 'umbrella', 'shoe'],
    answer: 'notebook',
  }
];

export const mockUserProgress: UserProgress = {
  streak: 0,
  xp: 0,
  level: 1,
  nextLevelXp: 300,
  wordsLearned: 0,
  scanCount: 0,
  weeklyXp: [],
  badges: [],
};
