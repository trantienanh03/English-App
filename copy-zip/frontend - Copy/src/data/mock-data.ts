import { VocabularyWord, Lesson, UserProgress, QuizQuestion } from '../types';

export const mockWords: VocabularyWord[] = [
  {
    id: 'w1',
    word: 'Coffee Mug',
    phonetic: '/ˈkɒfi mʌɡ/',
    vn: 'Cái cốc cà phê',
    pos: 'Noun',
    sentence: 'She wrapped her hands around her coffee mug to stay warm.',
    sentenceVn: 'Cô ấy ôm chặt chiếc cốc cà phê để giữ ấm.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w2',
    word: 'Laptop',
    phonetic: '/ˈlæptɒp/',
    vn: 'Máy tính xách tay',
    pos: 'Noun',
    sentence: 'She opened her laptop to check her emails.',
    sentenceVn: 'Cô ấy mở máy tính xách tay để kiểm tra email.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w3',
    word: 'Water Bottle',
    phonetic: '/ˈwɔːtər ˈbɒtl/',
    vn: 'Bình nước cá nhân',
    pos: 'Noun',
    sentence: 'Always carry a water bottle when you exercise.',
    sentenceVn: 'Hãy luôn mang theo bình nước khi bạn tập thể dục.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w4',
    word: 'Headphones',
    phonetic: '/ˈhɛdfəʊnz/',
    vn: 'Tai nghe chụp tai',
    pos: 'Noun',
    sentence: 'He put on his headphones to block out the noise.',
    sentenceVn: 'Anh ấy đeo tai nghe để cách ly với tiếng ồn xung quanh.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w5',
    word: 'Notebook',
    phonetic: '/ˈnəʊtbʊk/',
    vn: 'Quyển sổ ghi chép',
    pos: 'Noun',
    sentence: 'She wrote her ideas in a small notebook.',
    sentenceVn: 'Cô ấy ghi chép những ý tưởng vào một cuốn sổ nhỏ.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w6',
    word: 'Croissant',
    phonetic: '/ˈkrwæsɒ̃/',
    vn: 'Bánh sừng bò',
    pos: 'Noun',
    sentence: 'He ordered a hot coffee and a fresh croissant for breakfast.',
    sentenceVn: 'Anh ấy gọi cà phê nóng và bánh sừng bò tươi cho bữa sáng.',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w7',
    word: 'Cappuccino',
    phonetic: '/ˌkæpʊˈtʃiːnəʊ/',
    vn: 'Cà phê cappuccino',
    pos: 'Noun',
    sentence: 'The barista dusted cocoa powder on top of the cappuccino.',
    sentenceVn: 'Nhân viên pha chế rắc bột ca cao lên lớp bọt cappuccino.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a720eb9?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w8',
    word: 'Punctual',
    phonetic: '/ˈpʌŋktʃuəl/',
    vn: 'Đúng giờ, không trễ hẹn',
    pos: 'Adjective',
    sentence: 'Please be punctual for the meeting tomorrow morning.',
    sentenceVn: 'Xin vui lòng có mặt đúng giờ cho cuộc họp sáng mai.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'w9',
    word: 'Procrastinate',
    phonetic: '/prəʊˈkræstɪneɪt/',
    vn: 'Trì hoãn, chần chừ',
    pos: 'Verb',
    sentence: 'Stop procrastinating and finish your work now!',
    sentenceVn: 'Đừng chần chừ nữa, hãy hoàn thành công việc ngay!',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&auto=format&fit=crop&q=60'
  }
];

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    name: 'At the Coffee Shop',
    description: 'Học từ vựng phổ biến khi đi cà phê và gọi món tại nước ngoài.',
    difficulty: 'Sơ cấp',
    category: 'Giao tiếp hàng ngày',
    icon: '☕',
    wordCount: 4,
    progress: 75,
    words: [
      mockWords[0],
      mockWords[5],
      mockWords[6],
      {
        id: 'w10',
        word: 'Espresso',
        phonetic: '/eˈspresəʊ/',
        vn: 'Cà phê đậm đặc',
        pos: 'Noun',
        sentence: 'He drank a quick shot of espresso before going to work.',
        sentenceVn: 'Anh ấy uống nhanh một ly espresso trước khi đi làm.',
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1510707577719-ee7c21b15981?w=400&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'l2',
    name: 'Workplace & Productivity',
    description: 'Từ vựng chuyên dùng trong môi trường văn phòng, thảo luận công việc.',
    difficulty: 'Trung cấp',
    category: 'Công sở & Sự nghiệp',
    icon: '💻',
    wordCount: 4,
    progress: 25,
    words: [
      mockWords[1],
      mockWords[7],
      mockWords[8],
      {
        id: 'w11',
        word: 'Collaboration',
        phonetic: '/kəˌlæbəˈreɪʃn/',
        vn: 'Sự hợp tác, cộng tác',
        pos: 'Noun',
        sentence: 'This project is a successful collaboration between two teams.',
        sentenceVn: 'Dự án này là một sự hợp tác thành công giữa hai nhóm.',
        difficulty: 'hard',
        imageUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=400&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'l3',
    name: 'Study Essentials',
    description: 'Các vật dụng và thói quen cần thiết cho học sinh, sinh viên.',
    difficulty: 'Sơ cấp',
    category: 'Học tập & Giáo dục',
    icon: '📚',
    wordCount: 3,
    progress: 0,
    words: [
      mockWords[3],
      mockWords[4],
      mockWords[2],
    ]
  },
  {
    id: 'l4',
    name: 'Expressing Emotions',
    description: 'Diễn tả cảm xúc từ cơ bản đến nâng cao một cách tự nhiên.',
    difficulty: 'Trung cấp',
    category: 'Tâm lý & Đời sống',
    icon: '🎭',
    wordCount: 3,
    progress: 0,
    words: [
      {
        id: 'w12',
        word: 'Ecstatic',
        phonetic: '/ɪkˈstætɪk/',
        vn: 'Vô cùng hạnh phúc, ngây ngất',
        pos: 'Adjective',
        sentence: 'Sally was ecstatic when she passed her English exam.',
        sentenceVn: 'Sally đã vô cùng hạnh phúc khi đỗ kỳ thi tiếng Anh.',
        difficulty: 'hard',
        imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&auto=format&fit=crop&q=60'
      },
      {
        id: 'w13',
        word: 'Apprehensive',
        phonetic: '/ˌæprɪˈhensɪv/',
        vn: 'Lo lắng nhẹ, e sợ',
        pos: 'Adjective',
        sentence: 'He felt apprehensive about starting his new job tomorrow.',
        sentenceVn: 'Anh ấy cảm thấy lo lắng nhẹ khi bắt đầu công việc mới vào ngày mai.',
        difficulty: 'hard',
        imageUrl: 'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=400&auto=format&fit=crop&q=60'
      },
      {
        id: 'w14',
        word: 'Nostalgic',
        phonetic: '/nɒˈstældʒɪk/',
        vn: 'Hoài niệm, nhớ về quá khứ',
        pos: 'Adjective',
        sentence: 'Hearing that old song made her feel very nostalgic.',
        sentenceVn: 'Nghe lại bản nhạc cũ khiến cô ấy vô cùng hoài niệm.',
        difficulty: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=60'
      }
    ]
  }
];

export const mockUserProgress: UserProgress = {
  streak: 0,
  xp: 0,
  level: 1,
  nextLevelXp: 300,
  wordsLearned: 0,
  scanCount: 0,
  weeklyXp: [
    { day: 'T2', xp: 0, active: false },
    { day: 'T3', xp: 0, active: false },
    { day: 'T4', xp: 0, active: false },
    { day: 'T5', xp: 0, active: false },
    { day: 'T6', xp: 0, active: false },
    { day: 'T7', xp: 0, active: false },
    { day: 'CN', xp: 0, active: false }
  ],
  badges: [
    {
      id: 'b1',
      name: 'Chăm Chỉ 🔥',
      description: 'Đạt chuỗi 3 ngày học liên tiếp',
      icon: 'fire',
      unlocked: false,
    },
    {
      id: 'b2',
      name: 'Thợ Săn Ảnh 📷',
      description: 'Quét thành công 3 vật thể bằng AI',
      icon: 'camera',
      unlocked: false,
    },
    {
      id: 'b3',
      name: 'Vua Từ Vựng 👑',
      description: 'Lưu trữ hơn 15 thẻ flashcard',
      icon: 'crown',
      unlocked: false
    },
    {
      id: 'b4',
      name: 'Vượt Ải Quiz 🎯',
      description: 'Đạt điểm tối đa trong một bài kiểm tra',
      icon: 'target',
      unlocked: false
    }
  ]
};

export const mockQuizzes: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'Chọn nghĩa đúng nhất của từ: "Procrastinate"',
    options: [
      'Làm việc chăm chỉ không ngừng nghỉ',
      'Trì hoãn, chần chừ thực hiện công việc',
      'Ủng hộ nhiệt tình một ý tưởng mới',
      'Xây dựng kế hoạch chi tiết cho tương lai'
    ],
    answer: 'Trì hoãn, chần chừ thực hiện công việc',
    vnHint: 'Gợi ý: Stop procrastinating and finish your work now!'
  },
  {
    id: 'q2',
    type: 'fill-blank',
    question: 'Điền từ còn thiếu: "Always carry a _____ bottle when you exercise to stay hydrated."',
    options: ['water', 'glass', 'coffee', 'coke'],
    answer: 'water',
    vnHint: 'Gợi ý: Hãy luôn mang theo bình NƯỚC khi bạn tập thể dục.'
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: 'Trong tiếng Anh, "Cái cốc cà phê" là gì?',
    options: ['Water Bottle', 'Coffee Mug', 'Croissant', 'Headphones'],
    answer: 'Coffee Mug',
    vnHint: 'Gợi ý: Vật dụng thường dùng để đựng đồ uống nóng như cà phê.'
  },
  {
    id: 'q4',
    type: 'fill-blank',
    question: 'Điền từ thích hợp: "He put on his _____ to block out the noisy environment."',
    options: ['headphones', 'laptop', 'notebook', 'glasses'],
    answer: 'headphones',
    vnHint: 'Gợi ý: Anh ấy đeo TAI NGHE để giảm thiểu tiếng ồn xung quanh.'
  }
];

export const mockScannerPresets: VocabularyWord[] = [
  {
    id: 's1',
    word: 'Coffee Mug',
    phonetic: '/ˈkɒfi mʌɡ/',
    vn: 'Cái cốc cà phê',
    pos: 'Noun',
    sentence: 'She wrapped her hands around her coffee mug to stay warm.',
    sentenceVn: 'Cô ấy ôm chiếc cốc cà phê để giữ ấm.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's2',
    word: 'Laptop',
    phonetic: '/ˈlæptɒp/',
    vn: 'Máy tính xách tay',
    pos: 'Noun',
    sentence: 'She opened her laptop to check her emails.',
    sentenceVn: 'Cô ấy mở máy tính xách tay để xem email.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's3',
    word: 'Water Bottle',
    phonetic: '/ˈwɔːtər ˈbɒtl/',
    vn: 'Bình nước',
    pos: 'Noun',
    sentence: 'Always carry a water bottle when you exercise.',
    sentenceVn: 'Luôn mang theo bình nước khi tập thể thao.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's4',
    word: 'Headphones',
    phonetic: '/ˈhɛdfəʊnz/',
    vn: 'Tai nghe',
    pos: 'Noun',
    sentence: 'He put on his headphones to block out the noise.',
    sentenceVn: 'Anh ấy đeo tai nghe để giảm tiếng ồn.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's5',
    word: 'Notebook',
    phonetic: '/ˈnəʊtbʊk/',
    vn: 'Quyển sổ tay',
    pos: 'Noun',
    sentence: 'She wrote her ideas in a small notebook.',
    sentenceVn: 'Cô ấy ghi lại ý tưởng vào cuốn sổ nhỏ.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's6',
    word: 'Desk Lamp',
    phonetic: '/desk læmp/',
    vn: 'Đèn học bàn làm việc',
    pos: 'Noun',
    sentence: 'The desk lamp cast a warm glow over his workspace.',
    sentenceVn: 'Đèn bàn chiếu ánh sáng ấm áp lên góc làm việc.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's7',
    word: 'Potted Plant',
    phonetic: '/ˈpɒtɪd plɑːnt/',
    vn: 'Chậu cây cảnh nhỏ',
    pos: 'Noun',
    sentence: 'She added a small potted plant to her office desk.',
    sentenceVn: 'Cô ấy đặt một chậu cây cảnh nhỏ lên bàn làm việc.',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 's8',
    word: 'Wristwatch',
    phonetic: '/ˈrɪstwɒtʃ/',
    vn: 'Đồng hồ đeo tay',
    pos: 'Noun',
    sentence: 'He checked his wristwatch and realized he was late.',
    sentenceVn: 'Anh ấy xem đồng hồ đeo tay và nhận ra mình đã trễ.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&auto=format&fit=crop&q=60'
  }
];
