import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "nav": {
        "dashboard": "Dashboard",
        "my_trips": "My Trips",
        "new_trip": "New Trip",
        "community": "Community",
        "packing": "Packing",
        "notes": "Journal",
        "budget": "Budget",
        "profile": "Profile",
        "logout": "Logout",
        "ai_planner": "AI Planner ✨",
        "administration": "Admin Console",
        "analytics": "Stats"
      },
      "common": {
        "welcome": "Welcome back",
        "search": "Search adventures, cities...",
        "save": "Save Changes",
        "cancel": "Cancel",
        "delete": "Delete",
        "loading": "Loading...",
        "error": "Something went wrong",
        "success": "Success!",
        "settings": "Settings",
        "security": "Security",
        "account": "Account",
        "gender": "Gender",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "prefer_not_to_say": "Prefer not to say",
        "language": "Language",
        "currency": "Currency",
        "good_morning": "Good morning",
        "good_afternoon": "Good afternoon",
        "good_evening": "Good evening",
        "view_all": "View All",
        "explorer": "Explorer",
        "searching": "Searching Adventures...",
        "no_results": "No results found for",
        "recent_searches": "Recent Searches",
        "back": "Back",
        "overview": "Overview"
      },
      "dashboard": {
        "active_trips": "Active Adventures",
        "visited": "Countries Visited",
        "upcoming": "Upcoming Stops",
        "no_trips": "No trips found. Start your journey today!",
        "create_first": "Start Your First Trip",
        "trending": "Trending Now",
        "hero_subtitle": "Let's make it extraordinary.",
        "recent_trips_subtitle": "Your ongoing and upcoming adventures",
        "trending_subtitle": "Curated escapes for your next exploration",
        "trending_destinations": "Trending Destinations"
      },
      "trip_details": {
        "itinerary": "Itinerary",
        "packing": "Packing List",
        "budget": "Budget Tracker",
        "notes": "Trip Notes",
        "not_found": "Trip Not Found",
        "return": "Return to Dashboard",
        "delete_confirm": "Are you sure you want to delete this trip?",
        "overview": "Overview",
        "stats": "Voyage Statistics",
        "planned_days": "Planned Days",
        "saved_activities": "Saved Activities",
        "checklist_progress": "Checklist Progress",
        "error_delete": "Failed to delete trip. Please try again."
      },
      "edit_trip": {
        "title": "Edit Journey",
        "subtitle": "Refining your exploration of",
        "basic_info": "Basic Information",
        "trip_details": "Trip Details",
        "trip_title": "Trip Title",
        "destination": "Destination",
        "start_date": "Start Date",
        "end_date": "End Date",
        "budget": "Budget",
        "travelers": "Travelers",
        "cover_image": "Cover Image URL",
        "public": "Public Visibility",
        "public_desc": "Show this trip in the community feed.",
        "description": "Trip Description",
        "save": "Update Journey",
        "saving": "Saving Changes...",
        "error_update": "Failed to update trip details."
      },
      "notes": {
        "title": "Journal",
        "search": "Search thoughts...",
        "all": "All",
        "pinned": "Pinned",
        "starred": "Starred",
        "trips": "Trips",
        "empty": "No notes found",
        "new": "New Note",
        "created": "Created by you",
        "synced": "Synced",
        "saving": "Saving",
        "delete_confirm": "Permanently delete this thought?",
        "placeholder_title": "Note Title",
        "placeholder_content": "Write your adventure story here... Markdown supported.",
        "linked": "Linked to",
        "tags": "Tags",
        "hero_title": "Your Journal Awaits",
        "hero_subtitle": "Capture fleeting thoughts, secret travel spots, or detailed itineraries. Your notes are synced across all your devices.",
        "create_first": "Create First Entry"
      },
      "packing": {
        "title": "Packing Checklists",
        "subtitle": "Manage essentials for all your upcoming adventures",
        "empty": "Plan a trip to start your packing checklist!",
        "progress": "items packed"
      },
      "budget": {
        "title": "Financial Hub",
        "subtitle": "Track spending across all your planned journeys",
        "total_planned": "Total Planned Spend",
        "actual_spent": "Actual Spent",
        "used": "Used",
        "manage": "Click to manage expenses"
      },
      "profile": {
        "personal_info": "Personal Information",
        "update": "Update Profile",
        "banner": "Banner",
        "bio": "Biography",
        "preferences": "System Preferences",
        "error_update": "Failed to update profile settings."
      },
      "ai": {
        "title": "AI Travel Architect",
        "subtitle": "Generate professional itineraries in seconds using advanced neural planning.",
        "generating": "AI is architecting your journey...",
        "generate": "Generate Masterpiece",
        "save_to_trips": "Save to My Trips",
        "weather": "Weather Outlook",
        "cost": "Estimated Cost",
        "food": "Local Delicacies",
        "itinerary": "Day-by-Day Journey",
        "packing": "AI Packing List",
        "tips": "Pro Travel Tips",
        "label_destination": "Destination",
        "placeholder_destination": "Paris, Tokyo, Mars...",
        "label_style": "Travel Style",
        "label_duration": "Duration (Days)",
        "label_budget": "Budget Mode",
        "label_interests": "Your Interests (Optional)",
        "placeholder_interests": "e.g. Anime, Art Galleries, Hidden Cafes, Hiking...",
        "insights_title": "AI Generated Masterpiece",
        "start_over": "Start Over",
        "free_tier": "Free for Elite users",
        "powered_by": "Powered by Gemini Pro",
        "analyzing": "Analyzing millions of data points to find your hidden gems...",
        "error_planner": "Failed to generate itinerary. Please try again.",
        "error_no_destination": "Please enter a destination",
        "error_api_missing": "AI service is currently unavailable. Please contact support.",
        "error_limit": "AI is currently resting due to high demand. Please wait about 60 seconds."
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "dashboard": "डैशबोर्ड",
        "my_trips": "मेरी यात्राएं",
        "new_trip": "नई यात्रा",
        "community": "समुदाय",
        "packing": "पैकिंग",
        "notes": "जर्नल",
        "budget": "बजट",
        "profile": "प्रोफ़ाइल",
        "logout": "लॉगआउट",
        "ai_planner": "AI प्लानर ✨",
        "administration": "व्यवस्थापक",
        "analytics": "आंकड़े"
      },
      "common": {
        "welcome": "वापसी पर स्वागत है",
        "search": "साहसिक कार्य, शहर खोजें...",
        "save": "बदलाव सहेजें",
        "cancel": "रद्द करें",
        "delete": "हटाएं",
        "loading": "लोड हो रहा है...",
        "error": "कुछ गलत हो गया",
        "success": "सफल!",
        "settings": "सेटिंग्स",
        "security": "सुरक्षा",
        "account": "खाता",
        "gender": "लिंग",
        "male": "पुरुष",
        "female": "महिला",
        "other": "अन्य",
        "prefer_not_to_say": "बताने से बचें",
        "language": "भाषा",
        "currency": "मुद्रा",
        "good_morning": "सुप्रभात",
        "good_afternoon": "शुभ दोपहर",
        "good_evening": "शुभ संध्या",
        "view_all": "सभी देखें",
        "explorer": "अन्वेषक",
        "searching": "साहसिक कार्य खोज रहे हैं...",
        "no_results": "कोई परिणाम नहीं मिला",
        "recent_searches": "हाल की खोजें",
        "back": "पीछे",
        "overview": "अवलोकन"
      },
      "dashboard": {
        "active_trips": "सक्रिय रोमांच",
        "visited": "घूमे हुए देश",
        "upcoming": "आने वाले पड़ाव",
        "no_trips": "कोई यात्रा नहीं मिली। आज ही अपनी यात्रा शुरू करें!",
        "create_first": "अपनी पहली यात्रा शुरू करें",
        "trending": "अभी ट्रेंडिंग में",
        "hero_subtitle": "आइए इसे असाधारण बनाएं।",
        "recent_trips_subtitle": "आपके चल रहे और आगामी रोमांच",
        "trending_subtitle": "आपके अगले अन्वेषण के लिए क्यूरेटेड पलायन",
        "trending_destinations": "लोकप्रिय गंतव्य"
      },
      "trip_details": {
        "itinerary": "यात्रा कार्यक्रम",
        "packing": "पैकिंग सूची",
        "budget": "बजट ट्रैकर",
        "notes": "यात्रा नोट्स",
        "not_found": "यात्रा नहीं मिली",
        "return": "डैशबोर्ड पर लौटें",
        "delete_confirm": "क्या आप वाकई इस यात्रा को हटाना चाहते हैं?",
        "overview": "अवलोकन",
        "stats": "यात्रा के आंकड़े",
        "planned_days": "नियोजित दिन",
        "saved_activities": "सहेजी गई गतिविधियाँ",
        "checklist_progress": "चेकलिस्ट प्रगति",
        "error_delete": "यात्रा हटाने में विफल। कृपया पुन: प्रयास करें।"
      },
      "edit_trip": {
        "title": "यात्रा संपादित करें",
        "subtitle": "अपनी खोज को परिष्कृत करना",
        "basic_info": "मूल जानकारी",
        "trip_details": "यात्रा विवरण",
        "trip_title": "यात्रा शीर्षक",
        "destination": "गंतव्य",
        "start_date": "प्रारंभ तिथि",
        "end_date": "अंतिम तिथि",
        "budget": "बजट",
        "travelers": "यात्री",
        "cover_image": "कवर इमेज URL",
        "public": "सार्वजनिक दृश्यता",
        "public_desc": "इस यात्रा को सामुदायिक फ़ीड में दिखाएं।",
        "description": "यात्रा विवरण",
        "save": "यात्रा अपडेट करें",
        "saving": "बदलाव सहेजे जा रहे हैं...",
        "error_update": "यात्रा विवरण अपडेट करने में विफल।"
      },
      "notes": {
        "title": "जर्नल",
        "search": "विचार खोजें...",
        "all": "सभी",
        "pinned": "पिन किया गया",
        "starred": "तारांकित",
        "trips": "यात्राएं",
        "empty": "कोई नोट नहीं मिला",
        "new": "नया नोट",
        "created": "आपके द्वारा बनाया गया",
        "synced": "सिंक किया गया",
        "saving": "सहेजा जा रहा है",
        "delete_confirm": "क्या आप इस विचार को स्थायी रूप से हटाना चाहते हैं?",
        "placeholder_title": "नोट का शीर्षक",
        "placeholder_content": "अपनी साहसिक कहानी यहाँ लिखें... मार्कडाउन समर्थित है।",
        "linked": "से जुड़ा हुआ",
        "tags": "टैग",
        "hero_title": "आपका जर्नल आपका इंतज़ार कर रहा है",
        "hero_subtitle": "क्षणिक विचारों, गुप्त यात्रा स्थलों, या विस्तृत यात्रा कार्यक्रमों को कैद करें। आपके नोट आपके सभी उपकरणों पर सिंक किए जाते हैं।",
        "create_first": "पहली प्रविष्टि बनाएं"
      },
      "packing": {
        "title": "पैकिंग चेकलिस्ट",
        "subtitle": "अपने सभी आगामी रोमांचों के लिए आवश्यक चीजों का प्रबंधन करें",
        "empty": "अपनी पैकिंग चेकलिस्ट शुरू करने के लिए एक यात्रा की योजना बनाएं!",
        "progress": "वस्तुएं पैक की गईं"
      },
      "budget": {
        "title": "वित्तीय केंद्र",
        "subtitle": "अपनी सभी नियोजित यात्राओं में खर्च को ट्रैक करें",
        "total_planned": "कुल नियोजित खर्च",
        "actual_spent": "वास्तविक खर्च",
        "used": "इस्तेमाल किया गया",
        "manage": "खर्चों का प्रबंधन करने के लिए क्लिक करें"
      },
      "profile": {
        "personal_info": "व्यक्तिगत जानकारी",
        "update": "प्रोफ़ाइल अपडेट करें",
        "banner": "बैनर",
        "bio": "जीवनी",
        "preferences": "सिस्टम प्राथमिकताएं",
        "error_update": "प्रोफ़ाइल सेटिंग्स अपडेट करने में विफल।"
      },
      "ai": {
        "title": "AI यात्रा आर्किटेक्ट",
        "subtitle": "उन्नत तंत्रिका योजना का उपयोग करके सेकंड में पेशेवर यात्रा कार्यक्रम तैयार करें।",
        "generating": "AI आपकी यात्रा की रूपरेखा तैयार कर रहा है...",
        "generate": "मास्टरपीस तैयार करें",
        "save_to_trips": "मेरी यात्राओं में सहेजें",
        "weather": "मौसम का पूर्वानुमान",
        "cost": "अनुमानित लागत",
        "food": "स्थानीय व्यंजन",
        "itinerary": "दिन-ब-दिन यात्रा",
        "packing": "AI पैकिंग सूची",
        "tips": "प्रो यात्रा युक्तियाँ",
        "label_destination": "गंतव्य",
        "placeholder_destination": "पेरिस, टोक्यो, मंगल...",
        "label_style": "यात्रा शैली",
        "label_duration": "अवधि (दिन)",
        "label_budget": "बजट मोड",
        "label_interests": "आपकी रुचियां (वैकल्पिक)",
        "placeholder_interests": "जैसे: एनीमे, आर्ट गैलरी, हिडन कैफे, हाइकिंग...",
        "insights_title": "AI द्वारा निर्मित मास्टरपीस",
        "start_over": "फिर से शुरू करें",
        "free_tier": "एलीट उपयोगकर्ताओं के लिए निःशुल्क",
        "powered_by": "Gemini Pro द्वारा संचालित",
        "analyzing": "आपके लिए छिपे हुए रत्नों को खोजने के लिए लाखों डेटा बिंदुओं का विश्लेषण कर रहे हैं...",
        "error_planner": "यात्रा कार्यक्रम बनाने में विफल। कृपया पुन: प्रयास करें।",
        "error_no_destination": "कृपया गंतव्य दर्ज करें",
        "error_api_missing": "AI सेवा वर्तमान में अनुपलब्ध है। कृपया सहायता से संपर्क करें।",
        "error_limit": "अधिक मांग के कारण AI वर्तमान में विश्राम कर रहा है। कृपया लगभग 60 सेकंड प्रतीक्षा करें।"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "dashboard": "لوحة القيادة",
        "my_trips": "رحلاتي",
        "new_trip": "رحلة جديدة",
        "community": "المجتمع",
        "packing": "التعبئة",
        "notes": "المجلة",
        "budget": "الميزانية",
        "profile": "الملف الشخصي",
        "logout": "تسجيل الخروج",
        "ai_planner": "مخطط الذكاء الاصطناعي ✨",
        "administration": "لوحة المسؤول",
        "analytics": "الإحصائيات"
      },
      "common": {
        "welcome": "مرحباً بعودتك",
        "search": "ابحث عن المغامرات، المدن...",
        "save": "حفظ التغييرات",
        "cancel": "إلغاء",
        "delete": "حذف",
        "loading": "جارٍ التحميل...",
        "error": "حدث خطأ ما",
        "success": "نجاح!",
        "settings": "الإعدادات",
        "security": "الأمان",
        "account": "الحساب",
        "gender": "الجنس",
        "male": "ذكر",
        "female": "أنثى",
        "other": "أخرى",
        "prefer_not_to_say": "أفضل عدم البيوح",
        "language": "اللغة",
        "currency": "العملة",
        "good_morning": "صباح الخير",
        "good_afternoon": "طاب مساؤك",
        "good_evening": "مساء الخير",
        "view_all": "عرض الكل",
        "explorer": "مستكشف",
        "searching": "البحث عن المغامرات...",
        "no_results": "لم يتم العثور على نتائج لـ",
        "recent_searches": "عمليات البحث الأخيرة",
        "back": "رجوع",
        "overview": "نظرة عامة"
      },
      "dashboard": {
        "active_trips": "المغامرات النشطة",
        "visited": "الدول التي زرتها",
        "upcoming": "المحطات القادمة",
        "no_trips": "لم يتم العثور على رحلات. ابدأ رحلتك اليوم!",
        "create_first": "ابدأ رحلتك الأولى",
        "trending": "رائج الآن",
        "hero_subtitle": "لنجعلها غير عادية.",
        "recent_trips_subtitle": "مغامراتك الحالية والقادمة",
        "trending_subtitle": "مهارب مختارة لاستكشافك القادم",
        "trending_destinations": "وجهات رائجة"
      },
      "trip_details": {
        "itinerary": "مسار الرحلة",
        "packing": "قائمة التعبئة",
        "budget": "تعقب الميزانية",
        "notes": "ملاحظات الرحلة",
        "not_found": "الرحلة غير موجودة",
        "return": "العودة إلى لوحة القيادة",
        "delete_confirm": "هل أنت متأكد أنك تريد حذف هذه الرحلة؟",
        "overview": "نظرة عامة",
        "stats": "إحصائيات الرحلة",
        "planned_days": "الأيام المخطط لها",
        "saved_activities": "الأنشطة المحفوظة",
        "checklist_progress": "تقدم قائمة المراجعة",
        "error_delete": "فشل في حذف الرحلة. يرجى المحاولة مرة أخرى."
      },
      "edit_trip": {
        "title": "تعديل الرحلة",
        "subtitle": "تحسين استكشافك لـ",
        "basic_info": "المعلومات الأساسية",
        "trip_details": "تفاصيل الرحلة",
        "trip_title": "عنوان الرحلة",
        "destination": "الوجهة",
        "start_date": "تاريخ البدء",
        "end_date": "تاريخ الانتهاء",
        "budget": "الميزانية",
        "travelers": "المسافرون",
        "cover_image": "رابط صورة الغلاف",
        "public": "الظهور العام",
        "public_desc": "إظهار هذه الرحلة في خلاصة المجتمع.",
        "description": "وصف الرحلة",
        "save": "تحديث الرحلة",
        "saving": "جاري حفظ التغييرات...",
        "error_update": "فشل في تحديث تفاصيل الرحلة."
      },
      "notes": {
        "title": "المجلة",
        "search": "ابحث في الأفكار...",
        "all": "الكل",
        "pinned": "المثبتة",
        "starred": "المميزة بنجمة",
        "trips": "الرحلات",
        "empty": "لم يتم العثور على ملاحظات",
        "new": "ملاحظة جديدة",
        "created": "تم إنشاؤها بواسطتك",
        "synced": "تمت المزامنة",
        "saving": "جاري الحفظ",
        "delete_confirm": "هل تريد حذف هذه الفكرة نهائيًا؟",
        "placeholder_title": "عنوان الملاحظة",
        "placeholder_content": "اكتب قصة مغامرتك هنا... مارك داون مدعوم.",
        "linked": "مرتبط بـ",
        "tags": "الوسوم",
        "hero_title": "مجنتك في انتظارك",
        "hero_subtitle": "سجل الأفكار العابرة، أو أماكن السفر السرية، أو مسارات الرحلات المفصلة. تتم مزامنة ملاحظاتك عبر جميع أجهزتك.",
        "create_first": "إنشاء الإدخال الأول"
      },
      "packing": {
        "title": "قوائم التعبئة",
        "subtitle": "إدارة الأساسيات لجميع مغامراتك القادمة",
        "empty": "خطط لرحلة لبدء قائمة التعبئة الخاصة بك!",
        "progress": "تمت تعبئة العناصر"
      },
      "budget": {
        "title": "المركز المالي",
        "subtitle": "تتبع الإنفاق عبر جميع رحلاتك المخطط لها",
        "total_planned": "إجمالي الإنفاق المخطط له",
        "actual_spent": "الإنفاق الفعلي",
        "used": "مستخدم",
        "manage": "انقر لإدارة النفقات"
      },
      "profile": {
        "personal_info": "المعلومات الشخصية",
        "update": "تحديث الملف الشخصي",
        "banner": "بانر",
        "bio": "السيرة الذاتية",
        "preferences": "تفضيلات النظام",
        "error_update": "فشل في تحديث إعدادات الملف الشخصي."
      },
      "ai": {
        "title": "مهندس السفر بالذكاء الاصطناعي",
        "subtitle": "أنشئ مسارات رحلات احترافية في ثوانٍ باستخدام التخطيط العصبي المتقدم.",
        "generating": "الذكاء الاصطناعي يقوم بهندسة رحلتك...",
        "generate": "إنشاء تحفة فنية",
        "save_to_trips": "حفظ في رحلاتي",
        "weather": "توقعات الطقس",
        "cost": "التكلفة التقديرية",
        "food": "المأكولات المحلية",
        "itinerary": "رحلة يومية",
        "packing": "قائمة التعبئة بالذكاء الاصطناعي",
        "tips": "نصائح سفر احترافية",
        "label_destination": "الوجهة",
        "placeholder_destination": "باريس، طوكيو، المريخ...",
        "label_style": "أسلوب السفر",
        "label_duration": "المدة (أيام)",
        "label_budget": "وضع الميزانية",
        "label_interests": "اهتماماتك (اختياري)",
        "placeholder_interests": "مثلاً: الأنمي، المعارض الفنية، المقاهي الخفية، التنزه...",
        "insights_title": "تحفة فنية من إنتاج الذكاء الاصطناعي",
        "start_over": "البدء من جديد",
        "free_tier": "مجاني لمستخدمي النخبة",
        "powered_by": "مدعوم بواسطة Gemini Pro",
        "analyzing": "تحليل ملايين نقاط البيانات للعثور على جواهرك الخفية...",
        "error_planner": "فشل في إنشاء مسار الرحلة. يرجى المحاولة مرة أخرى.",
        "error_no_destination": "يرجى إدخال وجهة",
        "error_api_missing": "خدمة الذكاء الاصطناعي غير متوفرة حالياً. يرجى الاتصال بالدعم.",
        "error_limit": "الذكاء الاصطناعي يستريح حالياً بسبب الطلب المرتفع. يرجى الانتظار حوالي 60 ثانية."
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

// Handle RTL and persistent layout
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
  localStorage.setItem('traveloop_lang', lng)
  
  if (lng === 'ar') {
    document.body.classList.add('rtl-active')
  } else {
    document.body.classList.remove('rtl-active')
  }
})

// Initialize direction
const initialLng = i18n.language || 'en'
document.documentElement.dir = initialLng === 'ar' ? 'rtl' : 'ltr'

export default i18n
