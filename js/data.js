/* ================================
   EUROPEAN COUNTRIES DATA
================================ */

const COUNTRIES_DATA = {
    germany: {
        name: 'জার্মানি',
        flag: '🇩🇪',
        language: 'জার্মান',
        capital: 'বার্লিন',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: true
    },
    france: {
        name: 'ফ্রান্স',
        flag: '🇫🇷',
        language: 'ফরাসি',
        capital: 'প্যারিস',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: true
    },
    spain: {
        name: 'স্পেন',
        flag: '🇪🇸',
        language: 'স্প্যানিশ',
        capital: 'মাদ্রিদ',
        difficulty: 'easy',
        isSchengen: true,
        isPopular: true
    },
    italy: {
        name: 'ইতালি',
        flag: '🇮🇹',
        language: 'ইতালীয়',
        capital: 'রোম',
        difficulty: 'easy',
        isSchengen: true,
        isPopular: true
    },
    netherlands: {
        name: 'নেদারল্যান্ডস',
        flag: '🇳🇱',
        language: 'ডাচ',
        capital: 'আমস্টারডাম',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: true
    },
    portugal: {
        name: 'পর্তুগাল',
        flag: '🇵🇹',
        language: 'পর্তুগিজ',
        capital: 'লিসবন',
        difficulty: 'easy',
        isSchengen: true,
        isPopular: false
    },
    belgium: {
        name: 'বেলজিয়াম',
        flag: '🇧🇪',
        language: 'ফরাসি/ডাচ',
        capital: 'ব্রাসেলস',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    austria: {
        name: 'অস্ট্রিয়া',
        flag: '🇦🇹',
        language: 'জার্মান',
        capital: 'ভিয়েনা',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    switzerland: {
        name: 'সুইজারল্যান্ড',
        flag: '🇨🇭',
        language: 'জার্মান/ফরাসি',
        capital: 'বার্ন',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: true
    },
    sweden: {
        name: 'সুইডেন',
        flag: '🇸🇪',
        language: 'সুইডিশ',
        capital: 'স্টকহোম',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    norway: {
        name: 'নরওয়ে',
        flag: '🇳🇴',
        language: 'নরওয়েজিয়ান',
        capital: 'অসলো',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    denmark: {
        name: 'ডেনমার্ক',
        flag: '🇩🇰',
        language: 'ডানিশ',
        capital: 'কোপেনহেগেন',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    finland: {
        name: 'ফিনল্যান্ড',
        flag: '🇫🇮',
        language: 'ফিনিশ',
        capital: 'হেলসিঙ্কি',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    greece: {
        name: 'গ্রিস',
        flag: '🇬🇷',
        language: 'গ্রিক',
        capital: 'এথেন্স',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    poland: {
        name: 'পোল্যান্ড',
        flag: '🇵🇱',
        language: 'পোলিশ',
        capital: 'ওয়ারশ',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    czechia: {
        name: 'চেক প্রজাতন্ত্র',
        flag: '🇨🇿',
        language: 'চেক',
        capital: 'প্রাগ',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    hungary: {
        name: 'হাঙ্গেরি',
        flag: '🇭🇺',
        language: 'হাঙ্গেরিয়ান',
        capital: 'বুদাপেস্ট',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    slovakia: {
        name: 'স্লোভাকিয়া',
        flag: '🇸🇰',
        language: 'স্লোভাক',
        capital: 'ব্রাতিস্লাভা',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    slovenia: {
        name: 'স্লোভেনিয়া',
        flag: '🇸🇮',
        language: 'স্লোভেনীয়',
        capital: 'লুবলিয়ানা',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    estonia: {
        name: 'এস্তোনিয়া',
        flag: '🇪🇪',
        language: 'এস্তোনীয়',
        capital: 'তাল্লিন',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    latvia: {
        name: 'লাটভিয়া',
        flag: '🇱🇻',
        language: 'লাটভীয়',
        capital: 'রিগা',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    lithuania: {
        name: 'লিথুয়ানিয়া',
        flag: '🇱🇹',
        language: 'লিথুয়ানীয়',
        capital: 'ভিলনিউস',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    luxembourg: {
        name: 'লুক্সেমবার্গ',
        flag: '🇱🇺',
        language: 'ফরাসি/জার্মান',
        capital: 'লুক্সেমবার্গ',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    malta: {
        name: 'মাল্টা',
        flag: '🇲🇹',
        language: 'মাল্টিজ/ইংরেজি',
        capital: 'ভ্যালেটা',
        difficulty: 'easy',
        isSchengen: true,
        isPopular: false
    },
    cyprus: {
        name: 'সাইপ্রাস',
        flag: '🇨🇾',
        language: 'গ্রিক',
        capital: 'নিকোসিয়া',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    iceland: {
        name: 'আইসল্যান্ড',
        flag: '🇮🇸',
        language: 'আইসল্যান্ডিক',
        capital: 'রেইকিয়াভিক',
        difficulty: 'hard',
        isSchengen: true,
        isPopular: false
    },
    liechtenstein: {
        name: 'লিশটেনস্টাইন',
        flag: '🇱🇮',
        language: 'জার্মান',
        capital: 'ভাদুজ',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    croatia: {
        name: 'ক্রোয়েশিয়া',
        flag: '🇭🇷',
        language: 'ক্রোয়েশীয়',
        capital: 'জাগরেব',
        difficulty: 'medium',
        isSchengen: true,
        isPopular: false
    },
    russia: {
        name: 'রাশিয়া',
        flag: '🇷🇺',
        language: 'রুশ',
        capital: 'মস্কো',
        difficulty: 'hard',
        isSchengen: false,
        isPopular: false
    }
};

/* ================================
   CONVERSATION CATEGORIES
================================ */

const CONVERSATION_CATEGORIES = {
    airport: {
        name: 'বিমানবন্দর',
        icon: '✈️',
        description: 'বিমানবন্দরে প্রয়োজনীয় কথোপকথন'
    },
    hotel: {
        name: 'হোটেল',
        icon: '🏨',
        description: 'হোটেল বুকিং ও থাকার ব্যবস্থা'
    },
    restaurant: {
        name: 'রেস্তোরাঁ',
        icon: '🍽️',
        description: 'খাবার অর্ডার ও রেস্তোরাঁ'
    },
    shopping: {
        name: 'কেনাকাটা',
        icon: '🛍️',
        description: 'দোকানে কেনাকাটার কথোপকথন'
    },
    transport: {
        name: 'পরিবহন',
        icon: '🚌',
        description: 'পাবলিক ট্রান্সপোর্ট ও ভ্রমণ'
    },
    medical: {
        name: 'চিকিৎসা',
        icon: '🏥',
        description: 'ডাক্তার ও হাসপাতাল'
    },
    job: {
        name: 'চাকরি',
        icon: '💼',
        description: 'চাকরির ইন্টারভিউ ও অফিস'
    },
    banking: {
        name: 'ব্যাংকিং',
        icon: '🏦',
        description: 'ব্যাংক ও আর্থিক সেবা'
    },
    emergency: {
        name: 'জরুরি',
        icon: '🚨',
        description: 'জরুরি অবস্থার কথোপকথন'
    },
    daily: {
        name: 'দৈনন্দিন',
        icon: '🏠',
        description: 'প্রতিদিনের সাধারণ কথোপকথন'
    }
};

/* ================================
   SAMPLE CONVERSATIONS
================================ */

const SAMPLE_CONVERSATIONS = {
    // German Conversations
    german: {
        airport: [
            {
                id: 1,
                scenario: 'ইমিগ্রেশন চেক',
                dialogue: [
                    { speaker: 'officer', text: 'Guten Tag. Ihren Pass, bitte.', bengali: 'শুভ দিন। আপনার পাসপোর্ট, অনুগ্রহ করে।' },
                    { speaker: 'you', text: 'Hier ist mein Pass.', bengali: 'এই আমার পাসপোর্ট।' },
                    { speaker: 'officer', text: 'Wie lange bleiben Sie in Deutschland?', bengali: 'আপনি জার্মানিতে কতদিন থাকবেন?' },
                    { speaker: 'you', text: 'Ich bleibe drei Wochen.', bengali: 'আমি তিন সপ্তাহ থাকব।' }
                ]
            },
            {
                id: 2,
                scenario: 'লাগেজ সংগ্রহ',
                dialogue: [
                    { speaker: 'you', text: 'Entschuldigung, wo ist die Gepäckausgabe?', bengali: 'দুঃখিত, লাগেজ সংগ্রহের জায়গা কোথায়?' },
                    { speaker: 'staff', text: 'Die Gepäckausgabe ist dort drüben.', bengali: 'লাগেজ সংগ্রহ ওখানে।' },
                    { speaker: 'you', text: 'Danke schön.', bengali: 'ধন্যবাদ।' },
                    { speaker: 'staff', text: 'Bitte schön.', bengali: 'স্বাগতম।' }
                ]
            }
        ],
        restaurant: [
            {
                id: 3,
                scenario: 'টেবিল বুকিং',
                dialogue: [
                    { speaker: 'you', text: 'Guten Abend. Haben Sie einen Tisch frei?', bengali: 'শুভ সন্ধ্যা। আপনার কি একটি খালি টেবিল আছে?' },
                    { speaker: 'waiter', text: 'Ja, für wie viele Personen?', bengali: 'হ্যাঁ, কতজনের জন্য?' },
                    { speaker: 'you', text: 'Für zwei Personen, bitte.', bengali: 'দুইজনের জন্য, অনুগ্রহ করে।' },
                    { speaker: 'waiter', text: 'Folgen Sie mir, bitte.', bengali: 'আমার সাথে আসুন, অনুগ্রহ করে।' }
                ]
            },
            {
                id: 4,
                scenario: 'খাবার অর্ডার',
                dialogue: [
                    { speaker: 'waiter', text: 'Was möchten Sie bestellen?', bengali: 'আপনি কি অর্ডার করতে চান?' },
                    { speaker: 'you', text: 'Ich hätte gern ein Schnitzel, bitte.', bengali: 'আমি একটি স্কনিৎজেল চাই, অনুগ্রহ করে।' },
                    { speaker: 'waiter', text: 'Und zu trinken?', bengali: 'আর পানীয়?' },
                    { speaker: 'you', text: 'Ein Wasser, bitte.', bengali: 'একটি পানি, অনুগ্রহ করে।' }
                ]
            }
        ],
        shopping: [
            {
                id: 5,
                scenario: 'দাম জিজ্ঞাসা',
                dialogue: [
                    { speaker: 'you', text: 'Entschuldigung, was kostet das?', bengali: 'দুঃখিত, এটার দাম কত?' },
                    { speaker: 'seller', text: 'Das kostet zwanzig Euro.', bengali: 'এটার দাম বিশ ইউরো।' },
                    { speaker: 'you', text: 'Das ist zu teuer.', bengali: 'এটা খুব দামি।' },
                    { speaker: 'seller', text: 'Ich kann Ihnen einen Rabatt geben.', bengali: 'আমি আপনাকে ছাড় দিতে পারি।' }
                ]
            }
        ]
    },

    // French Conversations
    french: {
        airport: [
            {
                id: 101,
                scenario: 'ইমিগ্রেশন চেক',
                dialogue: [
                    { speaker: 'officer', text: 'Bonjour. Votre passeport, s\'il vous plaît.', bengali: 'শুভ দিন। আপনার পাসপোর্ট, অনুগ্রহ করে।' },
                    { speaker: 'you', text: 'Voici mon passeport.', bengali: 'এই আমার পাসপোর্ট।' },
                    { speaker: 'officer', text: 'Combien de temps restez-vous en France?', bengali: 'আপনি ফ্রান্সে কতদিন থাকবেন?' },
                    { speaker: 'you', text: 'Je reste deux semaines.', bengali: 'আমি দুই সপ্তাহ থাকব।' }
                ]
            }
        ],
        restaurant: [
            {
                id: 102,
                scenario: 'টেবিল বুকিং',
                dialogue: [
                    { speaker: 'you', text: 'Bonsoir. Avez-vous une table libre?', bengali: 'শুভ সন্ধ্যা। আপনার কি একটি খালি টেবিল আছে?' },
                    { speaker: 'waiter', text: 'Oui, pour combien de personnes?', bengali: 'হ্যাঁ, কতজনের জন্য?' },
                    { speaker: 'you', text: 'Pour deux personnes, s\'il vous plaît.', bengali: 'দুইজনের জন্য, অনুগ্রহ করে।' },
                    { speaker: 'waiter', text: 'Suivez-moi, s\'il vous plaît.', bengali: 'আমার সাথে আসুন, অনুগ্রহ করে।' }
                ]
            }
        ]
    },

    // Spanish Conversations
    spanish: {
        airport: [
            {
                id: 201,
                scenario: 'ইমিগ্রেশন চেক',
                dialogue: [
                    { speaker: 'officer', text: 'Buenos días. Su pasaporte, por favor.', bengali: 'শুভ দিন। আপনার পাসপোর্ট, অনুগ্রহ করে।' },
                    { speaker: 'you', text: 'Aquí está mi pasaporte.', bengali: 'এই আমার পাসপোর্ট।' },
                    { speaker: 'officer', text: '¿Cuánto tiempo se queda en España?', bengali: 'আপনি স্পেনে কতদিন থাকবেন?' },
                    { speaker: 'you', text: 'Me quedo una semana.', bengali: 'আমি এক সপ্তাহ থাকব।' }
                ]
            }
        ],
        restaurant: [
            {
                id: 202,
                scenario: 'খাবার অর্ডার',
                dialogue: [
                    { speaker: 'waiter', text: '¿Qué desea ordenar?', bengali: 'আপনি কি অর্ডার করতে চান?' },
                    { speaker: 'you', text: 'Quiero una paella, por favor.', bengali: 'আমি একটি পায়েলা চাই, অনুগ্রহ করে।' },
                    { speaker: 'waiter', text: '¿Y para beber?', bengali: 'আর পানীয়?' },
                    { speaker: 'you', text: 'Una sangría, por favor.', bengali: 'একটি সানগ্রিয়া, অনুগ্রহ করে।' }
                ]
            }
        ]
    }
};

/* ================================
   AUDIO PRONUNCIATION DATA
================================ */

const AUDIO_DATA = {
    german: {
        'Guten Tag': '/audio/german/guten-tag.mp3',
        'Danke schön': '/audio/german/danke-schoen.mp3',
        'Entschuldigung': '/audio/german/entschuldigung.mp3'
    },
    french: {
        'Bonjour': '/audio/french/bonjour.mp3',
        'Merci': '/audio/french/merci.mp3',
        'Excusez-moi': '/audio/french/excusez-moi.mp3'
    },
    spanish: {
        'Buenos días': '/audio/spanish/buenos-dias.mp3',
        'Gracias': '/audio/spanish/gracias.mp3',
        'Perdón': '/audio/spanish/perdon.mp3'
    }
};

/* ================================
   UTILITY FUNCTIONS
================================ */

// Generate more conversations dynamically
function generateConversations(language, category, count = 50) {
    const conversations = [];
    const baseTemplates = {
        airport: [
            'ইমিগ্রেশন চেক', 'লাগেজ সংগ্রহ', 'কাস্টমস চেক', 'ফ্লাইট তথ্য',
            'গেট খোঁজা', 'চেক-ইন কাউন্টার', 'নিরাপত্তা চেক', 'ভিসা যাচাই'
        ],
        restaurant: [
            'টেবিল বুকিং', 'খাবার অর্ডার', 'বিল পরিশোধ', 'খাবারের অভিযোগ',
            'মেনু বোঝা', 'বিশেষ খাবার', 'পানীয় অর্ডার', 'টিপ দেওয়া'
        ],
        shopping: [
            'দাম জিজ্ঞাসা', 'মাপ জানা', 'রঙ বেছে নেওয়া', 'ছাড় চাওয়া',
            'এক্সচেঞ্জ/রিটার্ন', 'পেমেন্ট', 'ওয়ারেন্টি', 'ব্র্যান্ড খোঁজা'
        ],
        transport: [
            'বাস টিকিট', 'ট্রেন সময়সূচী', 'ট্যাক্সি ভাড়া', 'দিক নির্দেশনা',
            'পথ হারানো', 'ভাড়া দেওয়া', 'স্টেশন খোঁজা', 'দেরি হওয়া'
        ],
        hotel: [
            'রুম বুকিং', 'চেক-ইন', 'চেক-আউট', 'রুম সার্ভিস',
            'সুবিধা জানা', 'অভিযোগ', 'অতিরিক্ত তোয়ালে', 'Wi-Fi পাসওয়ার্ড'
        ],
        medical: [
            'অ্যাপয়েন্টমেন্ট', 'লক্ষণ বর্ণনা', 'ওষুধ কেনা', 'জরুরি সাহায্য',
            'ইনশিউরেন্স', 'রিপোর্ট', 'ডেন্টিস্ট', 'ফার্মেসি'
        ],
        job: [
            'ইন্টারভিউ প্রস্তুতি', 'যোগ্যতা বর্ণনা', 'বেতন আলোচনা', 'কাজের সময়',
            'ছুটির দিন', 'অফিস নিয়ম', 'সহকর্মী', 'প্রমোশন'
        ],
        banking: [
            'অ্যাকাউন্ট খোলা', 'টাকা তোলা', 'ট্রান্সফার', 'লোন',
            'কার্ড ব্লক', 'এটিএম সমস্যা', 'ব্যালেন্স চেক', 'চেক বই'
        ],
        emergency: [
            'পুলিশ ডাকা', 'অ্যাম্বুলেন্স', 'ফায়ার সার্ভিস', 'দুর্ঘটনা',
            'চুরি রিপোর্ট', 'পাসপোর্ট হারানো', 'অসুস্থতা', 'সাহায্য চাওয়া'
        ],
        daily: [
            'সকালের শুভেচ্ছা', 'আবহাওয়া', 'পরিবার', 'কাজ',
            'শখ', 'খেলাধুলা', 'সিনেমা', 'বন্ধুত্ব'
        ]
    };

    const templates = baseTemplates[category] || baseTemplates.daily;
    
    for (let i = 0; i < count; i++) {
        const scenarioIndex = i % templates.length;
        const scenario = templates[scenarioIndex];
        
        conversations.push({
            id: Date.now() + i,
            scenario: scenario,
            category: category,
            language: language,
            dialogue: generateDialogue(language, scenario),
            learned: false,
            difficulty: Math.floor(Math.random() * 3) + 1 // 1-3
        });
    }
    
    return conversations;
}

// Generate dialogue based on language and scenario
function generateDialogue(language, scenario) {
    // This would be expanded with proper translations
    const commonPhrases = {
        german: {
            greeting: 'Guten Tag',
            thanks: 'Danke schön',
            excuse: 'Entschuldigung',
            please: 'Bitte',
            yes: 'Ja',
            no: 'Nein'
        },
        french: {
            greeting: 'Bonjour',
            thanks: 'Merci',
            excuse: 'Excusez-moi',
            please: 'S\'il vous plaît',
            yes: 'Oui',
            no: 'Non'
        },
        spanish: {
            greeting: 'Buenos días',
            thanks: 'Gracias',
            excuse: 'Perdón',
            please: 'Por favor',
            yes: 'Sí',
            no: 'No'
        }
    };

    const phrases = commonPhrases[language] || commonPhrases.german;
    
    // Generate basic dialogue structure
    return [
        { speaker: 'other', text: phrases.greeting, bengali: 'শুভেচ্ছা' },
        { speaker: 'you', text: phrases.greeting, bengali: 'শুভেচ্ছা' },
        { speaker: 'other', text: 'Sample question', bengali: 'নমুনা প্রশ্ন' },
        { speaker: 'you', text: 'Sample answer', bengali: 'নমুনা উত্তর' }
    ];
}

/* ================================
   STORAGE KEYS
================================ */

const STORAGE_KEYS = {
    selectedCountry: 'euroTalk_selectedCountry',
    userProgress: 'euroTalk_userProgress',
    settings: 'euroTalk_settings',
    conversations: 'euroTalk_conversations',
    achievements: 'euroTalk_achievements',
    dailyGoal: 'euroTalk_dailyGoal',
    streak: 'euroTalk_streak'
};

/* ================================
   DEFAULT SETTINGS
================================ */

const DEFAULT_SETTINGS = {
    dailyGoal: 10,
    audioSpeed: 1,
    autoPlay: true,
    notifications: false,
    theme: 'light'
};

/* ================================
   ACHIEVEMENTS DATA
================================ */

const ACHIEVEMENTS = {
    firstConversation: {
        id: 'first_conversation',
        name: 'প্রথম কথোপকথন',
        description: 'আপনার প্রথম কথোপকথন সম্পন্ন করুন',
        icon: '🎉',
        requirement: 1
    },
    tenConversations: {
        id: 'ten_conversations',
        name: 'দশটি কথোপকথন',
        description: '১০টি কথোপকথন শিখুন',
        icon: '📚',
        requirement: 10
    },
    weeklyStreak: {
        id: 'weekly_streak',
        name: 'সাপ্তাহিক স্ট্রিক',
        description: '৭ দিন একটানা অনুশীলন করুন',
        icon: '🔥',
        requirement: 7
    },
    polyglot: {
        id: 'polyglot',
        name: 'বহুভাষিক',
        description: '৩টি ভিন্ন দেশের ভাষা শিখুন',
        icon: '🌍',
        requirement: 3
    },
    dedicated: {
        id: 'dedicated',
        name: 'নিবেদিতপ্রাণ',
        description: '১০০টি কথোপকথন সম্পন্ন করুন',
        icon: '💪',
        requirement: 100
    }
};

// Export data for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COUNTRIES_DATA,
        CONVERSATION_CATEGORIES,
        SAMPLE_CONVERSATIONS,
        AUDIO_DATA,
        STORAGE_KEYS,
        DEFAULT_SETTINGS,
        ACHIEVEMENTS,
        generateConversations,
        generateDialogue
    };
}
