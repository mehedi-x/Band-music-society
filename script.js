const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    { ru: 'Что это?', bn: 'শতো এইতা?', bnMeaning: 'এটা কী?', en: 'What is this?' },
{ ru: 'Я хочу есть', bn: 'ইয়া খাচু ইইস্ত', bnMeaning: 'আমি খেতে চাই', en: 'I want to eat' },
{ ru: 'Где я?', bn: 'গ্দে ইয়া?', bnMeaning: 'আমি কোথায়?', en: 'Where am I?' },
{ ru: 'Как вас зовут?', bn: 'কাক ভাস জাভুত?', bnMeaning: 'আপনার নাম কী?', en: 'What’s your name?' },
{ ru: 'Мне плохо', bn: 'মনে প্লোখা', bnMeaning: 'আমার খারাপ লাগছে', en: 'I feel bad' },
{ ru: 'Я не знаю', bn: 'ইয়া নি zna-yu', bnMeaning: 'আমি জানি না', en: 'I don’t know' },
{ ru: 'Где гостиница?', bn: 'গ্দে গস্তিনিৎসা?', bnMeaning: 'হোটেল কোথায়?', en: 'Where is the hotel?' },
{ ru: 'Сколько вам лет?', bn: 'স্কলকো ভাম লিয়েত?', bnMeaning: 'আপনার বয়স কত?', en: 'How old are you?' },
{ ru: 'У меня болит голова', bn: 'উ মেনিয়া বলিত গালাভা', bnMeaning: 'আমার মাথা ব্যথা করছে', en: 'I have a headache' },
{ ru: 'Я из Бангладеш', bn: 'ইয়া ইজ বাংলাদেশ', bnMeaning: 'আমি বাংলাদেশ থেকে এসেছি', en: 'I am from Bangladesh' },
{ ru: 'Я люблю Россию', bn: 'ইয়া লিউব্লু রাসিয়ু', bnMeaning: 'আমি রাশিয়া ভালোবাসি', en: 'I love Russia' },
{ ru: 'Можно фотографировать?', bn: 'মোজনো ফোতোগ্রাফিরোভাত?', bnMeaning: 'আমি কি ছবি তুলতে পারি?', en: 'Can I take a photo?' },
{ ru: 'У вас есть Wi-Fi?', bn: 'উ ভাস ইইস্ত Wi-Fi?', bnMeaning: 'আপনার কি Wi-Fi আছে?', en: 'Do you have Wi-Fi?' },
{ ru: 'Счёт, пожалуйста', bn: 'শচёт, পাঝালুস্তা', bnMeaning: 'বিল দিন অনুগ্রহ করে', en: 'The bill, please' },
{ ru: 'Где метро?', bn: 'গ্দে মেত্রো?', bnMeaning: 'মেট্রো কোথায়?', en: 'Where is the metro?' },

{ ru: 'Привет', bn: 'প্রিভিয়েত', bnMeaning: 'হ্যালো', en: 'Hello' },
{ ru: 'Спасибо', bn: 'স্পাসিবো', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
{ ru: 'Как дела?', bn: 'কাক দেলা?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
{ ru: 'Здравствуйте', bn: 'জদরাভস্তভুইত্যে', bnMeaning: 'শুভ দিন', en: 'Hello (formal)' },
{ ru: 'Пожалуйста', bn: 'পাঝালুস্তা', bnMeaning: 'দয়া করে / স্বাগতম', en: "Please / You're welcome" },
{ ru: 'Извините', bn: 'ইজভিনিতিয়ে', bnMeaning: 'মাফ করবেন', en: 'Excuse me / Sorry' },
{ ru: 'Рад вас видеть', bn: 'রাত ভাস ভিদিত', bnMeaning: 'আপনাকে দেখে ভালো লাগলো', en: 'Nice to see you' },
{ ru: 'До свидания', bn: 'দা সভিদানিয়া', bnMeaning: 'বিদায়', en: 'Goodbye' },
{ ru: 'Добро пожаловать', bn: 'দাব্রো পাঝালাভাত', bnMeaning: 'স্বাগতম', en: 'Welcome' },
{ ru: 'Хорошо', bn: 'হারাশো', bnMeaning: 'ভালো', en: 'Good' },
{ ru: 'Плохо', bn: 'পলোখা', bnMeaning: 'খারাপ', en: 'Bad' },
{ ru: 'Где туалет?', bn: 'গ্দে তুয়ালেত?', bnMeaning: 'টয়লেট কোথায়?', en: 'Where is the toilet?' },
{ ru: 'Мне это нравится', bn: 'মনে এইতা ন্রাভিতসা', bnMeaning: 'আমার এটা পছন্দ', en: 'I like it' },
{ ru: 'Я не говорю по-русски', bn: 'ইয়া নি গাভারু পা রুস্কি', bnMeaning: 'আমি রাশিয়ান বলতে পারি না', en: "I don't speak Russian" },
{ ru: 'Повторите, пожалуйста', bn: 'পাফতারিতে পাঝালুস্তা', bnMeaning: 'অনুগ্রহ করে আবার বলুন', en: 'Please repeat' },
{ ru: 'Один билет, пожалуйста', bn: 'আদিন বিলিয়েত, পাঝালুস্তা', bnMeaning: 'একটি টিকিট দিন অনুগ্রহ করে', en: 'One ticket, please' },
{ ru: 'Где аптека?', bn: 'গ্দে আপত্যেকা?', bnMeaning: 'ফার্মেসি কোথায়?', en: 'Where is the pharmacy?' },
{ ru: 'Помогите мне!', bn: 'পামাগিতে ম্নে!', bnMeaning: 'আমাকে সাহায্য করুন!', en: 'Help me!' },
{ ru: 'Я потерялся', bn: 'ইয়া পাতেরিয়ালসা', bnMeaning: 'আমি পথ হারিয়েছি', en: 'I am lost' },
{ ru: 'Сколько это?', bn: 'স্কলকো এইতা?', bnMeaning: 'এটার দাম কত?', en: 'How much is this?' },
{ ru: 'Я устал', bn: 'ইয়া উস্তাল', bnMeaning: 'আমি ক্লান্ত', en: 'I am tired' },
{ ru: 'Я работаю здесь', bn: 'ইয়া রাবোতাইু জ্দেস', bnMeaning: 'আমি এখানে কাজ করি', en: 'I work here' },
{ ru: 'У меня есть работа', bn: 'উ মেনিয়া ইয়েস্ত রাবোতা', bnMeaning: 'আমার চাকরি আছে', en: 'I have a job' },
{ ru: 'Я ищу работу', bn: 'ইয়া ইশু রাবোতু', bnMeaning: 'আমি চাকরি খুঁজছি', en: 'I am looking for a job' },
{ ru: 'Где офис?', bn: 'গ্দে অফিস?', bnMeaning: 'অফিস কোথায়?', en: 'Where is the office?' },
{ ru: 'Когда начинается работа?', bn: 'কাগদা নাচিনায়েৎসা রাবোতা?', bnMeaning: 'কাজ কখন শুরু?', en: 'When does work start?' },
{ ru: 'У меня нет денег', bn: 'উ মেনিয়া নিৎ দেনেক', bnMeaning: 'আমার টাকা নেই', en: 'I have no money' },
{ ru: 'Сколько я получу?', bn: 'স্কলকো ইয়া পালুচু?', bnMeaning: 'আমি কত পাব?', en: 'How much will I get?' },
{ ru: 'Я живу в общежитии', bn: 'ইয়া জিভু ফ আফশিজিতিই', bnMeaning: 'আমি হোস্টেলে থাকি', en: 'I live in a hostel' },
{ ru: 'Где находится университет?', bn: 'গ্দে নাখোডিতসা ইউনিভার্সিতেত?', bnMeaning: 'বিশ্ববিদ্যালয় কোথায়?', en: 'Where is the university?' },
{ ru: 'Я студент медицинского факультета', bn: 'ইয়া স্টুডেন্ট মেদিত্সিনস্কাভা ফাকুল্তেতা', bnMeaning: 'আমি মেডিকেল ছাত্র', en: 'I am a medical student' },
{ ru: 'Когда у нас экзамен?', bn: 'কাগদা উ নাস একজামেন?', bnMeaning: 'আমাদের পরীক্ষা কখন?', en: 'When is our exam?' },
{ ru: 'У меня есть домашнее задание', bn: 'উ মেনিয়া ইয়েস্ত দামাশনিয়ে জাদানিয়ে', bnMeaning: 'আমার হোমওয়ার্ক আছে', en: 'I have homework' },
{ ru: 'Я изучаю русский язык', bn: 'ইয়া ইজুচায়ু রুস্কি ইয়াজিক', bnMeaning: 'আমি রাশিয়ান ভাষা শিখছি', en: 'I am learning Russian' },
{ ru: 'Можно войти?', bn: 'মোজনো ভাইটি?', bnMeaning: 'আমি কি ভিতরে আসতে পারি?', en: 'May I come in?' },
{ ru: 'У меня нет интернета', bn: 'উ মেনিয়া নিৎ ইন্টারনেতা', bnMeaning: 'আমার ইন্টারনেট নেই', en: 'I have no internet' },
{ ru: 'Это очень трудно', bn: 'এইতা ওচিন ত্রুদনা', bnMeaning: 'এটা খুব কঠিন', en: 'It is very difficult' },
{ ru: 'Повторите, пожалуйста, медленно', bn: 'পাফতারিতে, পাঝালুস্তা, মেদলেন্নো', bnMeaning: 'অনুগ্রহ করে ধীরে আবার বলুন', en: 'Please repeat slowly' },
{ ru: 'Я не понимаю задание', bn: 'ইয়া নি পনিমায়ু জাদানিয়ে', bnMeaning: 'আমি প্রশ্নটা বুঝতে পারছি না', en: 'I don’t understand the assignment' },
{ ru: 'Могу я задать вопрос?', bn: 'মাগু ইয়া জাদাত ভাপরোস?', bnMeaning: 'আমি কি প্রশ্ন করতে পারি?', en: 'Can I ask a question?' },
{ ru: 'Спасибо за помощь', bn: 'স্পাসিবো যা পোমোশ', bnMeaning: 'সাহায্যের জন্য ধন্যবাদ', en: 'Thank you for the help' },
{ ru: 'Мне нужна помощь', bn: 'মনে নুঝনা পোমোশ', bnMeaning: 'আমার সাহায্য দরকার', en: 'I need help' },
{ ru: 'Вы говорите по-английски?', bn: 'ভি গাভারিতে পা-আংলিস্কি?', bnMeaning: 'আপনি কি ইংরেজি বলেন?', en: 'Do you speak English?' },
{ ru: 'Где больница?', bn: 'গ্দে বালনিৎসা?', bnMeaning: 'হাসপাতাল কোথায়?', en: 'Where is the hospital?' },
{ ru: 'Мне нужно лекарство', bn: 'মনে নুঝনা লেকারস্তভো', bnMeaning: 'আমার ওষুধ দরকার', en: 'I need medicine' },
{ ru: 'Где ближайшая аптека?', bn: 'গ্দে ব্লিজাইশ্যায়া আপতেকা?', bnMeaning: 'নিকটতম ফার্মেসি কোথায়?', en: 'Where is the nearest pharmacy?' },
{ ru: 'Я потерял паспорт', bn: 'ইয়া পতেরিয়াল পাস্পর্ট', bnMeaning: 'আমি পাসপোর্ট হারিয়ে ফেলেছি', en: 'I lost my passport' },
{ ru: 'Позвоните в полицию', bn: 'পাজভানিতে ফ পলিতসিউ', bnMeaning: 'পুলিশে ফোন করুন', en: 'Call the police' },
{ ru: 'Где общественный транспорт?', bn: 'গ্দে আফশেস্তভেনি ট্রান্সপোর্ট?', bnMeaning: 'সার্বজনীন পরিবহন কোথায়?', en: 'Where is the public transport?' },
{ ru: 'Сколько стоит билет?', bn: 'স্কলকো স্তোইত বিলিয়েত?', bnMeaning: 'টিকিটের দাম কত?', en: 'How much is the ticket?' },
{ ru: 'Где ближайший банкомат?', bn: 'গ্দে ব্লিজাইশ্যি ব্যাংকোমাত?', bnMeaning: 'নিকটতম এটিএম কোথায়?', en: 'Where is the nearest ATM?' },
{ ru: 'Как снять деньги?', bn: 'কাক স্ন্যাৎ দেনগি?', bnMeaning: 'কিভাবে টাকা তুলবো?', en: 'How to withdraw money?' },
{ ru: 'Я иностранец', bn: 'ইয়া ইনাস্ত্রানিয়েত্স', bnMeaning: 'আমি বিদেশি', en: 'I am a foreigner' },
{ ru: 'Я здесь по учебе', bn: 'ইয়া জ্দেস পা উচোবে', bnMeaning: 'আমি পড়াশোনার জন্য এখানে', en: 'I am here for study' },
{ ru: 'Мне нужна виза', bn: 'মনে নুঝনা ভিজা', bnMeaning: 'আমার ভিসা দরকার', en: 'I need a visa' },
{ ru: 'У меня аллергия', bn: 'উ মেনিয়া অ্যালেরগিয়া', bnMeaning: 'আমার অ্যালার্জি আছে', en: 'I have an allergy' },
{ ru: 'Мне плохо', bn: 'মনে প্লোখা', bnMeaning: 'আমার খারাপ লাগছে', en: 'I feel sick' },
{ ru: 'Где я могу зарядить телефон?', bn: 'গ্দে ইয়া মাগু জরিয়াদিত তেলেফোন?', bnMeaning: 'আমি কোথায় ফোন চার্জ করতে পারি?', en: 'Where can I charge my phone?' },
{ ru: 'Как подключиться к Wi-Fi?', bn: 'কাক পদক্লুচিৎসা ক ওয়াইফাই?', bnMeaning: 'Wi-Fi-তে কিভাবে কানেক্ট করব?', en: 'How to connect to Wi-Fi?' },
{ ru: 'Моя квартира рядом', bn: 'মায়া কোয়ারতিরা রিয়াদম', bnMeaning: 'আমার অ্যাপার্টমেন্ট কাছেই', en: 'My apartment is nearby' },
{ ru: 'Сколько стоит аренда?', bn: 'স্কলকো স্তোইত অ্যারেনদা?', bnMeaning: 'ভাড়াটা কত?', en: 'How much is the rent?' },
{ ru: 'Я хочу купить это', bn: 'ইয়া খাচু কুপিত এটা', bnMeaning: 'আমি এটা কিনতে চাই', en: 'I want to buy this' },
{ ru: 'Сколько это стоит?', bn: 'স্কলকো এটা স্তোইত?', bnMeaning: 'এটার দাম কত?', en: 'How much does it cost?' },
{ ru: 'Можно дешевле?', bn: 'মোঝনা দিশেভ্লে?', bnMeaning: 'আরও সস্তা হবে?', en: 'Can it be cheaper?' },
{ ru: 'Где касса?', bn: 'গ্দে কাস্সা?', bnMeaning: 'ক্যাশ কাউন্টার কোথায়?', en: 'Where is the cashier?' },
{ ru: 'У вас есть сдача?', bn: 'উ ভাস ইয়েস্ত স্দাচা?', bnMeaning: 'আপনার কাছে খুচরা টাকা আছে?', en: 'Do you have change?' },
{ ru: 'Я плачу картой', bn: 'ইয়া প্লাছু কারতই', bnMeaning: 'আমি কার্ড দিয়ে দিচ্ছি', en: 'I’m paying by card' },
{ ru: 'Я плачу наличными', bn: 'ইয়া প্লাছু নালিচনিমি', bnMeaning: 'আমি নগদে দিচ্ছি', en: 'I’m paying in cash' },
{ ru: 'Мне нужна вода', bn: 'মনে নুঝনা ভাদা', bnMeaning: 'আমার পানি দরকার', en: 'I need water' },
{ ru: 'Я хочу поесть', bn: 'ইয়া খাচু পায়েস্ট', bnMeaning: 'আমি খেতে চাই', en: 'I want to eat' },
{ ru: 'Где ближайшее кафе?', bn: 'গ্দে ব্লিজাইশ্যায়া কাফে?', bnMeaning: 'নিকটতম ক্যাফে কোথায়?', en: 'Where is the nearest café?' },
{ ru: 'Принесите меню, пожалуйста', bn: 'প্রিনেসিতে মেন্যু, পাঝালুস্তা', bnMeaning: 'মেনু দিন, অনুগ্রহ করে', en: 'Please bring the menu' },
{ ru: 'Что вы порекомендуете?', bn: 'শতো ভি পারেকামেন্দুয়েতি?', bnMeaning: 'আপনি কী সুপারিশ করবেন?', en: 'What do you recommend?' },
{ ru: 'Я не ем мясо', bn: 'ইয়া নে ইম মিয়াসো', bnMeaning: 'আমি মাংস খাই না', en: 'I don’t eat meat' },
{ ru: 'Можно без лука?', bn: 'মোঝনা বেজ লুকা?', bnMeaning: 'পেঁয়াজ ছাড়া হবে?', en: 'Can it be without onion?' },
{ ru: 'Счёт, пожалуйста', bn: 'শ্চ্যত, পাঝালুস্তা', bnMeaning: 'বিল দিন, অনুগ্রহ করে', en: 'The bill, please' },
{ ru: 'Где остановка?', bn: 'গ্দে অস্তানভকা?', bnMeaning: 'স্টপেজ কোথায়?', en: 'Where is the stop?' },
{ ru: 'Этот автобус идёт в центр?', bn: 'এতত আফতোবুস ইদিয়ত ফ কেন্দ্র?', bnMeaning: 'এই বাস কি শহরে যায়?', en: 'Does this bus go to the center?' },
{ ru: 'Сколько стоит проезд?', bn: 'স্কলকো স্তোইত প্রায়েজদ?', bnMeaning: 'ভাড়া কত?', en: 'How much is the fare?' },
{ ru: 'У меня нет билета', bn: 'উ মেনিয়া নেট বিলিয়েতা', bnMeaning: 'আমার কাছে টিকিট নেই', en: 'I don’t have a ticket' },
{ ru: 'Когда следующий поезд?', bn: 'কগদা স্লেজুয়ুশ্চি পোয়েজদ?', bnMeaning: 'পরবর্তী ট্রেন কখন?', en: 'When is the next train?' },
{ ru: 'Я ищу квартиру', bn: 'ইয়া ইশু কভারতিরু', bnMeaning: 'আমি একটি ফ্ল্যাট খুঁজছি', en: 'I’m looking for an apartment' },
{ ru: 'Сколько стоит аренда?', bn: 'স্কলকো স্তোইত আরেন্দা?', bnMeaning: 'ভাড়া কত?', en: 'How much is the rent?' },
{ ru: 'Есть ли депозит?', bn: 'ইয়েস্ত লি দিপোজিত?', bnMeaning: 'ডিপোজিট লাগবে?', en: 'Is there a deposit?' },
{ ru: 'У меня есть документы', bn: 'উ মেনিয়া ইয়েস্ত দাকুমেনতি', bnMeaning: 'আমার কাগজপত্র আছে', en: 'I have the documents' },
{ ru: 'Где университет?', bn: 'গ্দে উনিভেরসিতেত?', bnMeaning: 'বিশ্ববিদ্যালয় কোথায়?', en: 'Where is the university?' },
{ ru: 'Я студент', bn: 'ইয়া স্তুদেন্ট', bnMeaning: 'আমি একজন ছাত্র', en: 'I am a student' },
{ ru: 'Мне нужно подать заявление', bn: 'মনে নুঝনা পাদাত জায়াভলেনিয়ে', bnMeaning: 'আমাকে আবেদন জমা দিতে হবে', en: 'I need to submit an application' },
{ ru: 'Где приёмная комиссия?', bn: 'গ্দে প্রিয়মনায়া কামিসসিয়া?', bnMeaning: 'ভর্তি অফিস কোথায়?', en: 'Where is the admissions office?' },
{ ru: 'Я хочу работать здесь', bn: 'ইয়া খাচু রাবোতাত জ্দেস', bnMeaning: 'আমি এখানে কাজ করতে চাই', en: 'I want to work here' },
{ ru: 'У меня встреча', bn: 'উ মেনিয়া স্তরেচা', bnMeaning: 'আমার একটি মিটিং আছে', en: 'I have a meeting' },
{ ru: 'Где больница?', bn: 'গ্দে বালনিৎসা?', bnMeaning: 'হাসপাতাল কোথায়?', en: 'Where is the hospital?' },
{ ru: 'Мне плохо', bn: 'মনে প্লাখা', bnMeaning: 'আমি অসুস্থ বোধ করছি', en: 'I feel sick' },
{ ru: 'Вызовите врача', bn: 'ভিজাভিতে ভ্রাচা', bnMeaning: 'ডাক্তার ডাকুন', en: 'Call the doctor' },
{ ru: 'У меня температура', bn: 'উ মেনিয়া তেম্পেরাতুরা', bnMeaning: 'আমার জ্বর হয়েছে', en: 'I have a fever' },
{ ru: 'Где аптека?', bn: 'গ্দে আপতেকা?', bnMeaning: 'ফার্মেসি কোথায়?', en: 'Where is the pharmacy?' },
{ ru: 'Мне нужны лекарства', bn: 'মনে নুঝনি লেকার্স্তভা', bnMeaning: 'আমার ওষুধ লাগবে', en: 'I need medicine' },
{ ru: 'Позовите полицию!', bn: 'পাজাভিতে পলিৎসিইউ!', bnMeaning: 'পুলিশ ডাকুন!', en: 'Call the police!' },
{ ru: 'Меня ограбили', bn: 'মেনিয়া আগরাবিলি', bnMeaning: 'আমাকে লুট করেছে', en: 'I was robbed' },
{ ru: 'Я потерял паспорт', bn: 'ইয়া পতেরিয়াল পাস্পর্ৎ', bnMeaning: 'আমার পাসপোর্ট হারিয়ে গেছে', en: 'I lost my passport' },
{ ru: 'Где находится посольство?', bn: 'গ্দে নাখোডিতসা পাসলস্তভা?', bnMeaning: 'দূতাবাস কোথায়?', en: 'Where is the embassy?' },
{ ru: 'Это мой друг', bn: 'এতা মই দ্রুক', bnMeaning: 'এটা আমার বন্ধু', en: 'This is my friend' },
{ ru: 'Как тебя зовут?', bn: 'কাক তিব্যা জাভুত?', bnMeaning: 'তোমার নাম কী?', en: 'What is your name?' },
{ ru: 'Рад тебя видеть', bn: 'রাত তিব্যা ভিডিচ', bnMeaning: 'তোমাকে দেখে ভালো লাগছে', en: 'Nice to see you' },
{ ru: 'Я скучаю по тебе', bn: 'ইয়া স্কুচায়ু পা তিব্যে', bnMeaning: 'আমি তোমাকে মিস করছি', en: 'I miss you' },
{ ru: 'Ты свободен сегодня?', bn: 'তি স্বাবোদেন সিভোদিন্যা?', bnMeaning: 'তুমি কি আজ ফ্রি?', en: 'Are you free today?' },
{ ru: 'Давай встретимся', bn: 'দাভাই স্ত্রেতিমসা', bnMeaning: 'চলো দেখা করি', en: 'Let’s meet' },
{ ru: 'Где ты живёшь?', bn: 'গ্দে তি ঝিভিওশ?', bnMeaning: 'তুমি কোথায় থাকো?', en: 'Where do you live?' },
{ ru: 'Это моя семья', bn: 'এতা মায়া সিমইয়া', bnMeaning: 'এটা আমার পরিবার', en: 'This is my family' },
{ ru: 'У тебя есть дети?', bn: 'উ তিব্যা ইয়েস্ত দেতি?', bnMeaning: 'তোমার কি সন্তান আছে?', en: 'Do you have children?' },
{ ru: 'Я женат / Я замужем', bn: 'ইয়া ঝেনাত / ইয়া জামুঝেম', bnMeaning: 'আমি বিবাহিত (পুরুষ / নারী)', en: 'I am married' },
{ ru: 'Ты женат?', bn: 'তি ঝেনাত?', bnMeaning: 'তুমি কি বিবাহিত?', en: 'Are you married?' },
{ ru: 'Я люблю тебя', bn: 'ইয়া লিউব্লু তিব্যা', bnMeaning: 'আমি তোমাকে ভালোবাসি', en: 'I love you' },
{ ru: 'Ты мне нравишься', bn: 'তি মনে ন্রাভিশ্স্যা', bnMeaning: 'তোমাকে আমার ভালো লাগে', en: 'I like you' },
{ ru: 'Давай поженимся', bn: 'দাভাই পাঝেনিমসিয়া', bnMeaning: 'চলো বিয়ে করি', en: 'Let’s get married' },
{ ru: 'Ты очень красивая', bn: 'তি ওচিন ক্রাসিভায়া', bnMeaning: 'তুমি অনেক সুন্দর (নারী)', en: 'You are very beautiful' },
{ ru: 'Ты очень красивый', bn: 'তি ওচিন ক্রাসিভি', bnMeaning: 'তুমি অনেক সুদর্শন (পুরুষ)', en: 'You are very handsome' },
{ ru: 'Можно твой номер?', bn: 'মোঝনা ত্ভোই নোমের?', bnMeaning: 'তোমার নাম্বার দিতে পারো?', en: 'Can I have your number?' },
{ ru: 'Напиши мне', bn: 'নাপিশি ম্নে', bnMeaning: 'আমাকে লিখো / মেসেজ করো', en: 'Text me' },
{ ru: 'Позвони мне', bn: 'পাজভানি ম্নে', bnMeaning: 'আমাকে ফোন করো', en: 'Call me' },
{ ru: 'До встречи!', bn: 'দা স্ত্রেচি!', bnMeaning: 'পরে দেখা হবে!', en: 'See you soon!' },
{ ru: 'Где аэропорт?', bn: 'গ্দে আয়ারাপোর্ত?', bnMeaning: 'বিমানবন্দর কোথায়?', en: 'Where is the airport?' },
{ ru: 'Когда вылет?', bn: 'কাগদা ভিলেত?', bnMeaning: 'ফ্লাইট কখন?', en: 'When is the flight?' },
{ ru: 'Мне нужно в аэропорт', bn: 'মনে নুঝনা ফ আয়ারাপোর্ত', bnMeaning: 'আমাকে বিমানবন্দরে যেতে হবে', en: 'I need to go to the airport' },
{ ru: 'У меня есть билет', bn: 'উ মেনিয়া ইয়েস্ত বিলিয়েত', bnMeaning: 'আমার টিকিট আছে', en: 'I have a ticket' },
{ ru: 'Где мой багаж?', bn: 'গ্দে মই বাগাঝ?', bnMeaning: 'আমার লাগেজ কোথায়?', en: 'Where is my luggage?' },
{ ru: 'Мне нужно такси в отель', bn: 'মনে নুঝনা তাকসি ফ আতেল', bnMeaning: 'আমার হোটেলে যাওয়ার জন্য ট্যাক্সি দরকার', en: 'I need a taxi to the hotel' },
{ ru: 'Забронируйте номер, пожалуйста', bn: 'জাব্রনিরুইতিয়ে নোমের, পাঝালুস্তা', bnMeaning: 'একটা রুম বুক করুন দয়া করে', en: 'Please book a room' },
{ ru: 'Сколько стоит номер?', bn: 'স্কলকো স্তোয়িত নোমের?', bnMeaning: 'রুমের দাম কত?', en: 'How much is the room?' },
{ ru: 'У вас есть свободные номера?', bn: 'উ ভাস ইয়েস্ত স্বাবোদনিয়ে নোমেরা?', bnMeaning: 'আপনারা কি ফাঁকা রুম আছে?', en: 'Do you have available rooms?' },
{ ru: 'Мне нужен одноместный номер', bn: 'মনে নুঝেন আদনামেস্তনি নোমের', bnMeaning: 'আমার একটা সিঙ্গেল রুম দরকার', en: 'I need a single room' },
{ ru: 'Сколько ночей вы будете?', bn: 'স্কলকো নচেই ভি বুদিতে?', bnMeaning: 'আপনি কয় রাত থাকবেন?', en: 'How many nights will you stay?' },
{ ru: 'Я останусь на три дня', bn: 'ইয়া অস্তানুস না ত্রি дня', bnMeaning: 'আমি তিন দিন থাকবো', en: 'I will stay for three days' },
{ ru: 'Можно паспорт, пожалуйста', bn: 'মোজনো পাশপোর্ত, পাঝালুস্তা', bnMeaning: 'পাসপোর্ট দিতে পারবেন দয়া করে?', en: 'May I have your passport, please?' },
{ ru: 'Где находится мой отель?', bn: 'গ্দে নাখোডিতসা মই আতেল?', bnMeaning: 'আমার হোটেল কোথায়?', en: 'Where is my hotel?' },
{ ru: 'Вы говорите по-английски?', bn: 'ভি গাভারিতিয়ে পা আঙ্গলিস্কি?', bnMeaning: 'আপনি কি ইংরেজি বলতে পারেন?', en: 'Do you speak English?' },
{ ru: 'Я не понимаю русский', bn: 'ইয়া নি পনিমায়ু রুসকি', bnMeaning: 'আমি রুশ ভাষা বুঝি না', en: 'I don’t understand Russian' },
{ ru: 'Где находится туристическое бюро?', bn: 'গ্দে নাখোডিতসা তুরিস্তিচেস্কায়া বিউরো?', bnMeaning: 'ট্যুরিস্ট অফিস কোথায়?', en: 'Where is the tourist office?' },
{ ru: 'Можно взять карту города?', bn: 'মোজনো ভজ্যাত কার্তু গোরাদা?', bnMeaning: 'শহরের মানচিত্র নিতে পারি?', en: 'Can I take a city map?' },
{ ru: 'Где находится вокзал?', bn: 'গ্দে নাখোডিতসা ভাকজাল?', bnMeaning: 'রেলস্টেশন কোথায়?', en: 'Where is the train station?' },
{ ru: 'Это далеко?', bn: 'এতা দালেকো?', bnMeaning: 'এটা কি দূরে?', en: 'Is it far?' },
{ ru: 'Сколько это стоит?', bn: 'স্কলকো এতা স্তোয়িত?', bnMeaning: 'এটার দাম কত?', en: 'How much does it cost?' },
{ ru: 'Это слишком дорого', bn: 'এতা স্লিশকম দোরগো', bnMeaning: 'এটা অনেক দামি', en: 'This is too expensive' },
{ ru: 'Можно подешевле?', bn: 'মোজনো পাদেশেভলে?', bnMeaning: 'আরও সস্তা হবে?', en: 'Can it be cheaper?' },
{ ru: 'Я покупаю это', bn: 'ইয়া পকুপায়ু এতা', bnMeaning: 'আমি এটা কিনছি', en: 'I am buying this' },
{ ru: 'Дайте, пожалуйста, чек', bn: 'দাইতে, পাঝালুস্তা, চেক', bnMeaning: 'দয়া করে রশিদ দিন', en: 'Please give me a receipt' },
{ ru: 'Где ближайший супермаркет?', bn: 'গ্দে ব্লিজাইশি সূপারমার্কেত?', bnMeaning: 'নিকটতম সুপারমার্কেট কোথায়?', en: 'Where is the nearest supermarket?' },
{ ru: 'У вас есть свежие овощи?', bn: 'উ ভাস ইয়েস্ত স্বেজিয়ে অভশি?', bnMeaning: 'আপনার কাছে তাজা সবজি আছে?', en: 'Do you have fresh vegetables?' },
{ ru: 'Я хочу купить фрукты', bn: 'ইয়া খাচু কুপিত ফ্রুকতি', bnMeaning: 'আমি ফল কিনতে চাই', en: 'I want to buy fruits' },
{ ru: 'У вас есть аптека рядом?', bn: 'উ ভাস ইয়েস্ত আপতেকা রিয়াদম?', bnMeaning: 'কাছাকাছি ফার্মেসি আছে?', en: 'Is there a pharmacy nearby?' },
{ ru: 'Мне нужно лекарство', bn: 'মনে নুঝনা লেকার্স্তভো', bnMeaning: 'আমার ওষুধ দরকার', en: 'I need medicine' },
{ ru: 'У меня болит голова', bn: 'উ মেনিয়া বলিত গোলোভা', bnMeaning: 'আমার মাথা ব্যথা করছে', en: 'I have a headache' },
{ ru: 'Позовите врача, пожалуйста', bn: 'পাজাভিতে ভ্রাচা, পাঝালুস্তা', bnMeaning: 'ডাক্তারকে ডাকুন দয়া করে', en: 'Please call a doctor' },
{ ru: 'Где ближайшая больница?', bn: 'গ্দে ব্লিজাইশায়া বলনিত্সা?', bnMeaning: 'নিকটতম হাসপাতাল কোথায়?', en: 'Where is the nearest hospital?' },
{ ru: 'У меня температура', bn: 'উ মেনিয়া তেমপেরাতুরা', bnMeaning: 'আমার জ্বর আছে', en: 'I have a fever' },
{ ru: 'Мне нужно в аптеку', bn: 'মনে নুঝনা ফ আপতেকু', bnMeaning: 'আমাকে ফার্মেসিতে যেতে হবে', en: 'I need to go to the pharmacy' },
{ ru: 'Где можно обменять деньги?', bn: 'গ্দে মোজনো আবমিন্যাত দেনগি?', bnMeaning: 'টাকা বিনিময় করা যাবে কোথায়?', en: 'Where can I exchange money?' },
{ ru: 'Я хочу обменять доллары на рубли', bn: 'ইয়া খাচু আবমিন্যাত দোলারি না রুবলি', bnMeaning: 'আমি ডলার রুবলে পরিবর্তন করতে চাই', en: 'I want to exchange dollars to rubles' },
{ ru: 'Где банкомат?', bn: 'গ্দে ব্যাংকমাত?', bnMeaning: 'এটিএম কোথায়?', en: 'Where is the ATM?' },
{ ru: 'Я потерял кошелек', bn: 'ইয়া পতেরিয়াল কাশেলিওক', bnMeaning: 'আমি আমার মানিব্যাগ হারিয়েছি', en: 'I lost my wallet' },
{ ru: 'Помогите, пожалуйста', bn: 'পামাগিতে, পাঝালুস্তা', bnMeaning: 'দয়া করে সাহায্য করুন', en: 'Please help me' },










  // আমার উপরে ডাটা লোড করুন...  
  ],
  german: [
    { ru: 'Hallo', bn: 'হালো', bnMeaning: 'হ্যালো', en: 'Hello' },
    { ru: 'Danke', bn: 'ডাঙ্কে', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
    { ru: 'Wie geht\'s?', bn: 'ভি গেটস?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
  ]
};

function renderVocabulary(lang) {
  const data = vocabulary[lang] || [];
  conversationArea.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('conversation-item');
    div.innerHTML = `
      <p><strong>🇷🇺 ${item.ru}</strong></p>
      <p>🔊 উচ্চারণ: ${item.bn}</p>
      <p>📝 বাংলা অর্থ: ${item.bnMeaning}</p>
      <p>🔤 English: ${item.en}</p>
    `;
    conversationArea.appendChild(div);
  });
}

// Load saved language
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang && vocabulary[savedLang]) {
  languageSelect.value = savedLang;
  renderVocabulary(savedLang);
} else {
  const defaultLang = languageSelect.value;
  localStorage.setItem('selectedLanguage', defaultLang);
  renderVocabulary(defaultLang);
}

// Save on change
languageSelect.addEventListener('change', () => {
  const selected = languageSelect.value;
  localStorage.setItem('selectedLanguage', selected);
  renderVocabulary(selected);
});

// Dark mode memory
const isDark = localStorage.getItem('darkMode') === 'true';
if (isDark) {
  document.body.classList.add('dark-mode');
  modeToggle.textContent = '☀️';
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkNow = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkNow);
  modeToggle.textContent = isDarkNow ? '☀️' : '🌙';
});
