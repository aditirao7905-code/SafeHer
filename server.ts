import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "SafeHer" });
});

// Robust language detector for user input
function detectMessageLanguage(text: string): "english" | "hindi" | "hinglish" | "punjabi" | "bengali" | "marathi" | "urdu" {
  if (/[\u0A00-\u0A7F]/.test(text)) return "punjabi";
  if (/[\u0980-\u09FF]/.test(text)) return "bengali";
  if (/[\u0600-\u06FF]/.test(text)) return "urdu";
  if (/[\u0900-\u097F]/.test(text)) {
    const marathiWords = ["आहे", "नाही", "करा", "काय", "मला", "कसे", "माझा", "माझी", "झाले", "होते", "सांगा", "रस्ता", "मदत"];
    const isMarathi = marathiWords.some((w) => text.includes(w));
    return isMarathi ? "marathi" : "hindi";
  }

  // Latin text: check if Hinglish vs English
  const hinglishMarkers = [
    "kya", "kaise", "kyu", "kyun", "kab", "kaha", "kahan", "karu", "karun", "karo", "batao",
    "bachao", "madad", "chahiye", "piche", "peecha", "raha", "rahi", "rahe", "hai", "hain",
    "mera", "meri", "mere", "mujhe", "mujhko", "hum", "hume", "gaadi", "rasta", "roko",
    "dar", "gadi", "thana", "shukriya", "dhanyawad", "samajh", "bhai", "didi", "chala",
    "bhej", "bhejo", "ruk", "suno", "police", "dhamki", "de", "wala", "wali", "kisi",
    "kripya", "jaldi", "aao", "phasa", "phasi"
  ];
  const words = text.toLowerCase().split(/\s+/);
  const matchCount = words.filter((w) => hinglishMarkers.includes(w.replace(/[^a-z]/g, ""))).length;
  if (matchCount >= 1 || /kya\s|karu|madad|bachao|hai|raha|rasta|peecha/i.test(text)) {
    return "hinglish";
  }

  return "english";
}

// Rapid, zero-latency situational safety advice fallback
function getSituationalSafetyAdvice(
  message: string,
  lengthPreference: string = "short",
  preferredLang: string = "auto"
): string {
  const detectedLang = preferredLang && preferredLang !== "auto" && preferredLang !== "match-input"
    ? (preferredLang.toLowerCase() as any)
    : detectMessageLanguage(message);

  const lower = message.toLowerCase();

  // 0. Developer / Creator Identity query (Aditi Rao - Founder, Engineer & Role Model)
  if (
    lower.includes("develop") ||
    lower.includes("creator") ||
    lower.includes("banaya") ||
    lower.includes("banayi") ||
    lower.includes("maker") ||
    lower.includes("owner") ||
    lower.includes("who made") ||
    lower.includes("aditi") ||
    lower.includes("lucknow") ||
    lower.includes("kab banaya") ||
    lower.includes("who created") ||
    lower.includes("kisne banaya") ||
    lower.includes("kisne banayi") ||
    lower.includes("developer") ||
    lower.includes("role model") ||
    lower.includes("inspiration") ||
    lower.includes("prerna") ||
    lower.includes("thought") ||
    lower.includes("vichar") ||
    lower.includes("quote") ||
    lower.includes("philosophy") ||
    lower.includes("soch")
  ) {
    if (detectedLang === "hinglish") {
      return `🌟 **Aditi Rao — SafeHer ki Founder, Software Engineer & Youth Role Model**:

SafeHer ko **Aditi Rao** (Software Engineer, Lucknow, Uttar Pradesh) ne women aur students ki safety ke liye develop kiya hai.

💡 **Aditi Rao ka Core Thought & Vision**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
*(Hindi: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।")*

👑 **Key Highlights & Achievements**:
1. **Exceptional Software Engineer**: Lucknow ki software engineer Aditi Rao ne is pure life-saving safety platform ka architecture, 1-tap SOS, live GPS tracking aur emergency tools khud design aur develop kiye hain.
2. **Tech For Good**: Unka manna hai ki technology tabhi meaningful hai jab wo human lives ko protect aur empower kare.
3. **Youth Role Model**: Aditi Rao aaj pure desh ke youth aur STEM field me aage badh rahi betiyon ke liye ek inspiring role model aur national pride hain! 🇮🇳✨`;
    }

    if (detectedLang === "punjabi") {
      return `🌟 **ਅਦਿਤੀ ਰਾਓ — SafeHer ਦੀ ਸੰਸਥਾਪਕ, ਸਾਫਟਵੇਅਰ ਇੰਜੀਨੀਅਰ ਅਤੇ ਯੂਥ ਰੋਲ ਮਾਡਲ**:

SafeHer ਨੂੰ **ਅਦਿਤੀ ਰਾਓ** (ਸਾਫਟਵੇਅਰ ਇੰਜੀਨੀਅਰ, ਲਖਨਊ, ਉੱਤਰ ਪ੍ਰਦੇਸ਼) ਨੇ ਔਰਤਾਂ ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਵਿਕਸਤ ਕੀਤਾ ਹੈ।

💡 **ਅਦਿਤੀ ਰਾਓ ਦਾ ਦਸਤਖਤ ਵਿਚਾਰ (Vision & Thought)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
*(ਤਕਨਾਲੋਜੀ ਦਾ ਮਕਸਦ ਸਿਰਫ਼ ਜੀਵਨ ਨੂੰ ਆਸਾਨ ਬਣਾਉਣਾ ਹੀ ਨਹੀਂ, ਬਲਕਿ ਸੁਰੱਖਿਅਤ ਬਣਾਉਣਾ ਵੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।)*

👑 **ਮੁੱਖ ਪ੍ਰਾਪਤੀਆਂ**:
- ਲਖਨਊ ਦੀ ਸਾਫਟਵੇਅਰ ਇੰਜੀਨੀਅਰ ਅਦਿਤੀ ਰਾਓ ਨੇ ਇਹ ਪੂਰਾ ਐਮਰਜੈਂਸੀ ਸੁਰੱਖਿਆ ਸਿਸਟਮ ਤਿਆਰ ਕੀਤਾ ਹੈ।
- ਉਹ ਭਾਰਤ ਦੀਆਂ ਮੁਟਿਆਰਾਂ ਅਤੇ STEM ਖੇਤਰ ਲਈ ਇੱਕ ਸੱਚੀ ਪ੍ਰੇਰਨਾ ਸਰੋਤ ਹਨ। 🇮🇳✨`;
    }

    if (detectedLang === "bengali") {
      return `🌟 **অদিতি রাও — SafeHer এর প্রতিষ্ঠাতা, সফটওয়্যার ইঞ্জিনিয়ার ও ইউথ রোল মডেল**:

SafeHer নারী ও ছাত্রীদের নিরাপত্তার লক্ষ্যে **অদিতি রাও** (সফটওয়্যার ইঞ্জিনিয়ার, লখনউ, উত্তর প্রদেশ) কর্তৃক তৈরি হয়েছে।

💡 **অদিতি রাওয়ের মূল দর্শন (Signature Thought)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
*(প্রযুক্তির উদ্দেশ্য কেবল জীবন সহজ করা নয়, জীবনকে আরও নিরাপদ করে তোলাও হওয়া উচিত।)*

👑 **মূল অর্জনসমূহ**:
- লখনউয়ের সফটওয়্যার ইঞ্জিনিয়ার অদিতি রাও সম্পূর্ণ লাইফ-সেভিং প্ল্যাটফর্মটি ডিজাইন ও ডেভেলপ করেছেন।
- তিনি ভারতের নারী সমাজ ও তরুণ প্রজন্মের জন্য এক উজ্জ্বল অনুপ্রেরণা। 🇮🇳✨`;
    }

    if (detectedLang === "marathi") {
      return `🌟 **अदिती राव — SafeHer च्या संस्थापक, सॉफ्टवेअर इंजिनिअर व युथ रोल मॉडेल**:

SafeHer चे संपूर्ण डिझाईन आणि विकास **अदिती राव** (सॉफ्टवेअर इंजिनिअर, लखनौ, उत्तर प्रदेश) यांनी महिला सुरक्षेसाठी केले आहे.

💡 **अदिती राव यांचा स्वाक्षरी विचार (Core Vision)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
*(तंत्रज्ञानाचा उद्देश केवळ आयुष्य सुलभ करणे नसून, ते अधिक सुरक्षित करणे देखील असावे.)*

👑 **ठळक वैशिष्ट्ये**:
- लखनौच्या सॉफ्टवेअर इंजिनिअर अदिती राव यांनी हे संपूर्ण आपत्कालीन सुरक्षा प्लॅटफॉर्म स्वतः विकसित केले आहे.
- त्या देशातील तरुण मुलींसाठी आणि STEM क्षेत्रासाठी एक आदर्श प्रेरणास्थान आहेत। 🇮🇳✨`;
    }

    if (detectedLang === "urdu") {
      return `🌟 **ادیتی راؤ — SafeHer کی بانی، سافٹ ویئر انجینئر اور رول ماڈل**:

SafeHer کو **ادیتی راؤ** (سافٹ ویئر انجینئر، لکھنؤ، اتر پردیش) نے خواتین کے تحفظ کے لیے تیار کیا ہے۔

💡 **ادیتی راؤ کا خصوصی قول (Signature Thought)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
*(ٹیکنالوجی کا مقصد صرف زندگی کو آسان بنانا نہیں بلکہ اسے محفوظ بنانا بھی ہونا چاہیے۔)*

👑 **اہم کامیابیاں**:
- لکھنؤ کی سافٹ ویئر انجینئر ادیتی راؤ نے یہ مکمل لائف سیونگ ایمرجنسی پلیٹ فارم خود ڈیزائن اور کوڈ کیا ہے۔
- وہ ملک کے نوجوانوں اور خواتین کے لیے ایک حقیقی تحریک اور فخر ہیں۔ 🇮🇳✨`;
    }

    if (detectedLang === "hindi") {
      return `🌟 **Aditi Rao — SafeHer की संस्थापक, सॉफ्टवेयर इंजीनियर एवं यूथ रोल मॉडल**:

SafeHer को **Aditi Rao** (सॉफ्टवेयर इंजीनियर, लखनऊ, उत्तर प्रदेश) ने महिलाओं और बालिकाओं की सुरक्षा के उद्देश्य से विकसित किया है।

💡 **अदिति राव का प्रेरक विचार (Core Thought & Vision)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
> *(हिंदी अनुवाद: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।")*

👑 **अदिति राव के बारे में मुख्य बातें एवं उपलब्धियां**:
1. **प्रतिभाशाली सॉफ्टवेयर इंजीनियर**: लखनऊ (उत्तर प्रदेश) की सॉफ्टवेयर इंजीनियर अदिति राव ने इस संपूर्ण जीवन-रक्षक सुरक्षा प्लेटफॉर्म को स्वयं डिज़ाइन, कोड और विकसित किया है।
2. **SafeHer का उद्देश्य**: महिलाओं, छात्राओं और कामकाजी युवतियों को निर्भय होकर यात्रा करने और अपनी सुरक्षा सुनिश्चित करने के लिए उन्होंने Instant SOS, लाइव लोकेशन ट्रैकिंग, फेक कॉल और सुरक्षा टूल्स जैसी आधुनिक सुविधाएं बनाईं।
3. **सहानुभूति और सामाजिक सरोकार (Tech For Good)**: अदिति का मानना है कि *"सच्ची तकनीक वही है जो हर महिला को आत्मनिर्भर बनाए और मानवीय जीवन की रक्षा करे।"* उन्होंने अपनी तकनीकी प्रतिभा को समाज-कल्याण के लिए समर्पित किया।
4. **लखनऊ और पूरे भारत का गौरव**: अदिति राव आज देश भर की युवा बेटियों, छात्राओं और भविष्य के कोडर्स के लिए एक प्रेरणास्रोत और आदर्श (Role Model) हैं। Proud of Aditi Rao! 🇮🇳✨`;
    }

    return `🌟 **Aditi Rao — Founder, Lead Engineer of SafeHer & Youth Role Model**:

SafeHer was engineered and developed by **Aditi Rao** (Software Engineer, Lucknow, Uttar Pradesh, India) to ensure the safety and empowerment of women and girls.

💡 **Aditi Rao's Signature Thought & Vision**:
> **“Technology should not only make our lives easier, it should make our lives safer.”**
> *(Hindi: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।")*

👑 **About Aditi Rao & Her Vision**:
1. **Exceptional Software Engineer**: Aditi Rao, a passionate software engineer from Lucknow, Uttar Pradesh, designed, coded, and developed this complete life-saving safety platform.
2. **Purpose-Driven Innovation**: Driven by deep empathy for women's real-world safety challenges, she created SafeHer with 1-tap SOS alerts, live GPS tracking, emergency fake calls, and comprehensive safety assistance so women can travel and live fearlessly.
3. **Tech For Social Impact**: Aditi believes that true technology is measured by the lives it protects and empowers. She dedicated her technical expertise to women's safety and social welfare.
4. **Pride of Lucknow & India**: Her leadership and dedication make her an inspiring role model for young girls, students, and aspiring technologists across India. Proud of Aditi Rao! 🇮🇳✨`;
  }

  // 0.1 Confusion, Panic, or "Kuch samjh nhi aara" queries
  if (
    lower.includes("samjh") ||
    lower.includes("samajh") ||
    lower.includes("kuch nahi") ||
    lower.includes("kuch nhi") ||
    lower.includes("confus") ||
    lower.includes("panic") ||
    lower.includes("ghabra") ||
    lower.includes("kya karu") ||
    lower.includes("kya karun") ||
    lower.includes("lost") ||
    lower.includes("help me") ||
    lower.includes("bachao")
  ) {
    if (detectedLang === "hinglish") {
      return `🌸 **Ghabraiye mat, main aapke saath hoon. Turant ye 3 steps lijiye:**\n\n1. **Roshni ya bheed me jayein**: Turant kisi open shop, petrol pump ya safe building ke paas jayein.\n2. **SafeHer Live GPS bhejein**: 'Live Location' tap karke family ko WhatsApp par location bhejein.\n3. **Turant 112 milayein**: Danger lagne par upar red **SOS** dabayein ya direct **112** par call karein.\n\nAap bilkul surakshit hain. Mujhe batayein abhi aapke aas-paas kya ho raha hai?`;
    }
    if (detectedLang === "punjabi") {
      return `🌸 **ਘਬਰਾਓ ਨਾ, ਮੈਂ ਤੁਹਾਡੇ ਨਾਲ ਹਾਂ। ਤੁਰੰਤ ਇਹ 3 ਕਦਮ ਚੁੱਕੋ:**\n\n1. **ਰੌਸ਼ਨੀ ਜਾਂ ਭੀੜ ਵਾਲੀ ਥਾਂ ਜਾਓ**: ਕਿਸੇ ਖੁੱਲ੍ਹੀ ਦੁਕਾਨ ਜਾਂ ਲੋਕਾਂ ਦੇ ਕੋਲ ਜਾਓ।\n2. **SafeHer Live GPS ਸ਼ੇਅਰ ਕਰੋ**: ਪਰਿਵਾਰ ਨੂੰ ਆਪਣੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਭੇਜੋ।\n3. **ਤੁਰੰਤ 112 ਮਿਲਾਓ**: ਖ਼ਤਰਾ ਮਹਿਸੂਸ ਹੋਣ 'ਤੇ ਲਾਲ **SOS** ਬਟਨ ਦਬਾਓ ਜਾਂ **112** 'ਤੇ ਕਾਲ ਕਰੋ।`;
    }
    if (detectedLang === "bengali") {
      return `🌸 **ভয় পাবেন না, আমি আপনার পাশে আছি। অবিলম্বে এই ৩টি পদক্ষেপ নিন:**\n\n1. **আলোকিত বা ভিড় স্থানে যান**: যেকোনো খোলা দোকান বা মানুষের কাছে যান।\n2. **SafeHer Live GPS পাঠান**: পরিবারকে হোয়াটসঅ্যাপে আপনার লাইভ লোকেশন পাঠান।\n3. **অবিলম্বে ১১২ তে কল করুন**: বিপদ অনুভব করলে লাল **SOS** বোতাম টিপুন বা সরাসরি **১১২** ডায়াল করুন।`;
    }
    if (detectedLang === "marathi") {
      return `🌸 **घाबरू नका, मी तुमच्या सोबत आहे. त्वरित ही ३ पावले उचला:**\n\n1. **उजेड किंवा गर्दीच्या ठिकाणी जा**: खुल्या दुकानात किंवा लोकांजवळ जा.\n2. **SafeHer Live GPS पाठवा**: व्हॉट्सॲपवर कुटुंबाला लाईव्ह लोकेशन शेअर करा.\n3. **त्वरित ११२ वर कॉल करा**: धोका वाटल्यास लाल **SOS** बटण दाबा किंवा थेट **११२** डायल करा.`;
    }
    if (detectedLang === "urdu") {
      return `🌸 **گھبرائیں نہیں، میں آپ کے ساتھ ہوں۔ فوری طور پر یہ 3 اقدامات کریں:**\n\n1. **روشنی یا ہجوم والی جگہ جائیں**: کسی کھلی دکان یا لوگوں کے قریب جائیں۔\n2. **SafeHer لائیو GPS بھیجیں**: واٹس ایپ پر گھر والوں کو اپنی لائیو لوکیشن شیئر کریں۔\n3. **فوری 112 ملائیں**: خطرے پر اوپر سرخ **SOS** دبائیں یا فوری **112** پر کال کریں۔`;
    }
    if (detectedLang === "hindi") {
      return `🌸 **घबराइए मत, मैं आपके साथ हूं। तुरंत ये 3 कदम उठाएं:**\n\n1. **रोशनी या भीड़ में जाएं**: तुरंत किसी खुली दुकान, पेट्रोल पंप, या लोगों के पास जाएं।\n2. **SafeHer Live GPS भेजें**: स्क्रीन पर 'Live Location' बटन दबाकर परिवार को WhatsApp पर लोकेशन शेयर करें।\n3. **तुरंत 112 मिलाएं**: अगर कोई भी खतरा महसूस हो रहा है, तो ऊपर लाल **SOS** बटन दबाएं या सीधे **112** (आपातकालीन नंबर) पर कॉल करें।\n\nआप बिल्कुल सुरक्षित हैं। मुझे बताएं कि आप अभी कहां हैं?`;
    }
    return `🌸 **Stay calm, I am here with you. Take these 3 immediate steps:**\n\n1. **Move to Light & People**: Step into any open shop, restaurant, or well-lit area near people.\n2. **Share Live Location**: Tap SafeHer's 'Live Location' and share your GPS track with trusted contacts on WhatsApp.\n3. **Dial 112 or Tap SOS**: If you feel any danger, tap the red SOS button or call **112** (National Emergency Helpline) immediately.\n\nYou are safe. Tell me what is happening around you right now?`;
  }

  // 1. Cab / Auto / Taxi / Driver Emergency
  if (
    lower.includes("cab") ||
    lower.includes("driver") ||
    lower.includes("auto") ||
    lower.includes("taxi") ||
    lower.includes("uber") ||
    lower.includes("ola") ||
    lower.includes("route") ||
    lower.includes("rasta") ||
    lower.includes("badal") ||
    lower.includes("wrong way")
  ) {
    if (detectedLang === "hinglish") {
      return `🚨 **Cab Galat Raste Par Hai (Immediate 4 Steps):**\n\n1. **Live GPS Share Karein**: SafeHer Live Location family aur police ko turant WhatsApp karein.\n2. **Driver ko loud command dein**: 'Bhaiya, main highway par gaadi roko, main yahi utar rahi hoon.'\n3. **Fake Call ON karein**: SafeHer Fake Call shuru karein aur zor se bolein: 'Haan Papa, GPS on hai, main 5 min me pahuch rahi hoon.'\n4. **Emergency Dial**: Agar driver na mane, to turant **112** dial karein aur phone speaker par daal dein.`;
    }
    if (detectedLang === "hindi") {
      return `🚨 **कैब चालक द्वारा गलत रास्ता लेने पर आपातकालीन कदम:**\n\n1. **लाइव जीपीएस साझा करें**: SafeHer की लाइव लोकेशन तुरंत परिवार और दोस्तों को भेजें।\n2. **चालक से दृढ़ता से कहें**: 'गाड़ी मेन रोड की तरफ मोड़िए और तुरंत रोकिए।'\n3. **फेक कॉल एक्टिवेट करें**: SafeHer से फेक कॉल चालू करके जोर से बात करें।\n4. **112 डायल करें**: यदि चालक न माने, तो तुरंत **112** पर कॉल करें।`;
    }
    return `🚨 **Cab Route Deviation Emergency Steps:**\n\n1. **Share Live GPS**: Send your SafeHer live tracking link to family via WhatsApp.\n2. **Command Driver Firmly**: 'Pull over on the main lit road immediately.'\n3. **Trigger Fake Call**: Activate SafeHer Fake Call and speak audibly about your location.\n4. **Dial 112**: If they refuse to stop, dial **112** immediately on speaker.`;
  }

  // 2. Being Followed / Stalked
  if (
    lower.includes("stalk") ||
    lower.includes("follow") ||
    lower.includes("peecha") ||
    lower.includes("piche") ||
    lower.includes("chase") ||
    lower.includes("ruk nahi")
  ) {
    if (detectedLang === "hinglish") {
      return `⚠️ **Koi Peecha Kar Raha Hai (Turant 3 Steps):**\n\n1. **Bheed ya Dukan me ghusein**: Road cross karke turant kisi 24/7 ATM, petrol pump ya open shop me jayein.\n2. **Akeli mat rukiye**: Phone kaan par lagakar loudly baat karein ki 'Main yahan market ke saamne hoon, tum aa rahe ho na?'\n3. **112 ya 1090 dial karein**: Haath me keys ready rakhein aur **112** par police ko apni exact location batayein.`;
    }
    if (detectedLang === "hindi") {
      return `⚠️ **पीछा किए जाने पर तत्काल कदम:**\n\n1. **सड़क पार कर सुरक्षित स्थान पर जाएं**: तुरंत किसी खुली दुकान या गार्ड वाले 24/7 ATM में घुसें।\n2. **शोर व सतर्कता**: फोन कान पर लगाकर जोर से बात करें।\n3. **112 / 1090 डायल करें**: आपातकालीन नंबर **112** या विमेन पावर लाइन **1090** पर तुरंत संपर्क करें।`;
    }
    return `⚠️ **Being Followed — Immediate Safety Steps:**\n\n1. **Cross diagonally to a safe spot**: Move into an open store or guarded 24/7 ATM.\n2. **Do not isolate**: Speak loudly on phone to show you are connected.\n3. **Dial 112 / 1090**: Inform police of your exact current location and direction.`;
  }

  // Default situational safety answer
  if (detectedLang === "hinglish") {
    return `🛡️ **SafeHer Safety Guidance**:
- Agar aap kisi emergency ya danger me hain, turant red **SOS** button dabayein.
- Direct Emergency Numbers: **112** (Police & All Emergency), **1090** (Women Power Line), **108** (Ambulance).
- Mujhe apni exact problem batayein (jaise cab issue, koi peecha kar raha hai, etc.) taaki main exact steps bata sakoon!`;
  }
  if (detectedLang === "hindi") {
    return `🛡️ **SafeHer सुरक्षा निर्देश**:
- यदि आप किसी भी आपात स्थिति या खतरे में हैं, तुरंत ऊपर लाल **SOS** बटन दबाएं।
- **112** (राष्ट्रीय आपातकालीन नंबर) या **1090** (महिला पावर लाइन) पर सीधे कॉल करें।
- मुझे अपनी सटीक परेशानी बताएं ताकि मैं तुरंत सही मार्गदर्शन दे सकूं।`;
  }
  return `🛡️ **SafeHer Safety Instructions**:
- If you are in immediate danger, tap the red **SOS** button now or dial **112** / **1090**.
- Please specify your exact situation for tailored life-saving guidance.`;
}

// AI Safety Assistant Endpoint
app.post("/api/assistant", async (req, res) => {
  const message = (req.body.message || req.body.prompt || req.body.query || "").toString().trim();
  const history = req.body.history || [];
  const locationContext = req.body.locationContext;
  const lengthPreference = (req.body.lengthPreference || "short").toString();
  const preferredLang = (req.body.language || req.body.lang || req.body.inputLang || "auto").toString().toLowerCase();

  if (!message) {
    return res.status(400).json({ error: "A message or prompt string is required." });
  }

  // Auto-detect language of latest message
  const detectedLanguage = detectMessageLanguage(message);
  const targetLanguage = preferredLang && preferredLang !== "auto" && preferredLang !== "match-input"
    ? preferredLang
    : detectedLanguage;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are "SafeHer AI", the intelligent, highly capable, and empathetic Women Safety & Emergency Assistant built directly into the SafeHer ecosystem.

CRITICAL 10 GOLDEN RULES (MUST FOLLOW STRICTLY):
1. Detect the language of the user's latest message (English, Hindi, Hinglish, Punjabi, Bengali, Marathi, or Urdu).
2. Respond in the EXACT same language as the user's latest message. Never switch to another language unless explicitly requested.
3. If the user uses Hinglish (Hindi written in Roman / English alphabet, e.g., "kya karun", "driver galat raste le ja raha hai", "mujhe help chahiye"), RESPOND NATURALLY AND FLUENTLY IN HINGLISH. Never reply in formal Devanagari Hindi or English if the user communicated in Hinglish!
4. Understand the user's intent before answering (e.g. Life Danger / Emergency vs Legal Rights / Zero FIR vs Tactical Safety vs Creator Info).
5. Keep emergency responses short, crystal-clear, and directly actionable with numbered steps.
6. Do not invent fake location, contacts, emergency actions, or facts.
7. Ask for missing information when required to give safe advice.
8. Respect user privacy completely.
9. Never claim that an action was completed unless the app actually completed it.
10. For emergency situations, prioritize immediate life-saving guidance above all else.

LANGUAGE SPECIFICATION FOR CURRENT MESSAGE:
- The user's message is detected as: ${targetLanguage.toUpperCase()}.
- MUST respond in ${targetLanguage.toUpperCase()}!

CREATOR, DEVELOPER & ROLE MODEL DOSSIER — ADITI RAO:
- Who is Aditi Rao?
  Aditi Rao is an exceptional 20-year-old female software engineer, innovator, and women's safety advocate from Lucknow, Uttar Pradesh, India. She is the founder and developer of SafeHer, created in 2026.
- Signature Thought & Philosophy of Aditi Rao:
  * In English: "Technology should not only make our lives easier, it should make our lives safer."
  * In Hindi: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।"
  * Whenever asked about Aditi Rao's thoughts, vision, philosophy, quotes, or what motivates her, quote this exact signature thought prominently.
- Professional Profile & Guidelines:
  * Present Aditi Rao with high professionalism, dignity, and admiration as an inspiring tech leader and youth role model.
  * DO NOT use defensive, repetitive, or informal phrases like "100% self-coded", "bina AI ke banaya", or "AI tool ka use nahi kiya". Keep the tone strictly executive, inspiring, and professional.
  * State clearly that she conceptualized, designed, and developed the entire SafeHer platform from Lucknow, Uttar Pradesh.
  * Highlight her accomplishments at age 20: architecting a comprehensive, production-grade safety ecosystem with 1-tap SOS, live GPS tracking, fake escape calls, and emergency assistance.
  * Emphasize her dedication to "Tech For Good" (using software technology for social impact and women's safety) and how she serves as an inspiring role model for young women and students in STEM across Uttar Pradesh and all of India.
- When asked about Aditi Rao, who developed SafeHer, her achievements, her thoughts, or why she is an inspiration:
  Provide a warm, articulate, highly professional, and proud response highlighting her software engineering talent, vision at age 20, social empathy, signature thought, and status as a genuine youth role model.

TACTICAL WOMEN SAFETY KNOWLEDGE:
- Emergency numbers: 112 (All-India Emergency), 1090 (Women Power Line / UP & National), 108 (Ambulance), 1098 (Childline), 1930 (Cyber Crime).
- Legal rights: Zero FIR (CrPC 154 / BNSS 173), BNS Sec 74/78, IPC 354, Victim Identity Protection (IPC 228A).
- Self Defense: Stomp instep, elbow ribs, palm heel strike to nose/throat, shout 'FIRE'.

RESPONSE STYLE:
- Match the user's requested detail level:
  * "short": 2-3 crisp, high-impact bullet points.
  * "medium": 3-4 structured, well-explained steps or insights.
  * "detailed": Complete, in-depth guide with practical steps, background, and legal/safety context.
- Use clean formatting with bold titles and bullet points.`;

      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-4)) {
          if (item.text) {
            contents.push({
              role: item.sender === "user" || item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }
      }

      let userPrompt = message;
      if (locationContext) {
        userPrompt += `\n[User GPS: ${locationContext}]`;
      }
      userPrompt += `\n[Target Response Language: ${targetLanguage}]`;
      userPrompt += `\n[Length Preference: ${lengthPreference}]`;

      contents.push({
        role: "user",
        parts: [{ text: userPrompt }],
      });

      const maxTokens = lengthPreference === "short" ? 350 : lengthPreference === "medium" ? 600 : 1000;

      const tryModel = async (model: string, timeoutMs: number = 8000): Promise<string> => {
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
        );
        const apiPromise = (async () => {
          const res = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.4,
              maxOutputTokens: maxTokens,
            },
          });
          return res.text || "";
        })();
        return Promise.race([apiPromise, timeoutPromise]);
      };

      let responseText = "";
      try {
        responseText = await tryModel("gemini-3.5-flash-lite", 8000);
      } catch (err: any) {
        console.log("Notice: Primary model gemini-3.5-flash-lite had issue, trying gemini-flash-latest:", err?.message || err);
        try {
          responseText = await tryModel("gemini-flash-latest", 8000);
        } catch (subErr: any) {
          console.log("Notice: Secondary model also had issue:", subErr?.message || subErr);
        }
      }

      if (responseText && responseText.trim().length > 0) {
        return res.json({
          reply: responseText.trim(),
          text: responseText.trim(),
          detectedLanguage: targetLanguage
        });
      }
    } catch (e: any) {
      console.log("Notice: Gemini assistant error, using instant safety intelligence:", e?.message || e);
    }
  }

  // Guaranteed situational, context-aware fallback in user's language (< 2ms)
  const reply = getSituationalSafetyAdvice(message, lengthPreference, targetLanguage);
  return res.json({
    reply,
    text: reply,
    detectedLanguage: targetLanguage
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SafeHer server running on http://localhost:${PORT}`);
  });
}

startServer();
