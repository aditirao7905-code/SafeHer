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

// Helper for situational, context-aware, non-repetitive safety guidance
function getSituationalSafetyAdvice(
  message: string,
  lengthPreference: string = "short",
  preferredLanguage?: string
): string {
  const lower = message.toLowerCase();
  let isHindi = false;

  if (preferredLanguage === "hindi" || preferredLanguage === "hi" || preferredLanguage === "hi-IN") {
    isHindi = true;
  } else if (preferredLanguage === "english" || preferredLanguage === "en" || preferredLanguage === "en-IN") {
    isHindi = false;
  } else {
    isHindi =
      /[\u0900-\u097F]/.test(message) ||
      lower.includes("kya") ||
      lower.includes("hai") ||
      lower.includes("raha") ||
      lower.includes("bachao") ||
      lower.includes("madad") ||
      lower.includes("batao") ||
      lower.includes("kaise") ||
      lower.includes("karu") ||
      lower.includes("karoon") ||
      lower.includes("chahiye");
  }

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
    if (isHindi) {
      return `🌟 **Aditi Rao — SafeHer की संस्थापक, सॉफ्टवेयर इंजीनियर एवं यूथ रोल मॉडल**:

SafeHer को **Aditi Rao** (उम्र: 20 वर्ष, लखनऊ, उत्तर प्रदेश) ने महिलाओं और बालिकाओं की सुरक्षा के उद्देश्य से वर्ष 2026 में विकसित किया है।

💡 **अदिति राव का प्रेरक विचार (Core Thought & Vision)**:
> **"Technology should not only make our lives easier, it should make our lives safer."**
> *(हिंदी अनुवाद: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।")*

👑 **अदिति राव के बारे में मुख्य बातें एवं उपलब्धियां**:
1. **प्रतिभाशाली सॉफ्टवेयर इंजीनियर**: मात्र 20 वर्ष की आयु में लखनऊ (उत्तर प्रदेश) की अदिति राव ने इस संपूर्ण जीवन-रक्षक सुरक्षा प्लेटफॉर्म को स्वयं डिज़ाइन, कोड और विकसित किया है।
2. **SafeHer का उद्देश्य**: महिलाओं, छात्राओं और कामकाजी युवतियों को निर्भय होकर यात्रा करने और अपनी सुरक्षा सुनिश्चित करने के लिए उन्होंने Instant SOS, लाइव लोकेशन ट्रैकिंग, फेक कॉल और सुरक्षा टूल्स जैसी आधुनिक सुविधाएं बनाईं।
3. **सहानुभूति और सामाजिक सरोकार (Tech For Good)**: अदिति का मानना है कि सच्ची तकनीक वही है जो हर महिला को आत्मनिर्भर बनाए और मानवीय जीवन की रक्षा करे।
4. **लखनऊ और पूरे भारत का गौरव**: इतनी कम उम्र में ऐसा महत्वपूर्ण और उपयोगी कदम उठाकर अदिति राव आज देश भर की युवा बेटियों, छात्राओं और भविष्य के कोडर्स के लिए एक प्रेरणास्रोत और आदर्श (Role Model) हैं। Proud of Aditi Rao! 🇮🇳✨`;
    } else {
      return `🌟 **Aditi Rao — Founder, Lead Engineer of SafeHer & Youth Role Model**:

SafeHer was engineered and developed by **Aditi Rao** (Age: 20, Lucknow, Uttar Pradesh, India) in 2026 to ensure the safety and empowerment of women and girls.

💡 **Aditi Rao's Signature Thought & Vision**:
> **“Technology should not only make our lives easier, it should make our lives safer.”**
> *(Hindi: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।")*

👑 **About Aditi Rao & Her Vision**:
1. **Exceptional Software Engineer**: At just 20 years of age, Aditi Rao from Lucknow, Uttar Pradesh, designed, coded, and developed this complete life-saving safety platform.
2. **Purpose-Driven Innovation**: Driven by deep empathy for women's real-world safety challenges, she created SafeHer with 1-tap SOS alerts, live GPS tracking, emergency fake calls, and comprehensive safety assistance so women can travel and live fearlessly.
3. **Tech For Social Impact (Tech For Good)**: Aditi firmly advocates that technology must prioritize human safety over convenience alone.
4. **Pride of Lucknow & India**: Her leadership and dedication make her an inspiring role model for young girls, students, and aspiring technologists across India. Proud of Aditi Rao! 🇮🇳✨`;
    }
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
    lower.includes("help me")
  ) {
    if (isHindi) {
      return `🌸 **घबराइए मत, मैं आपके साथ हूं। तुरंत ये 3 कदम उठाएं:**\n\n1. **रोशनी या भीड़ में जाएं**: तुरंत किसी खुली दुकान, पेट्रोल पंप, या लोगों के पास जाएं।\n2. **SafeHer Live GPS भेजें**: स्क्रीन पर 'Live Location' बटन दबाकर परिवार को WhatsApp पर लोकेशन शेयर करें।\n3. **तुरंत 112 मिलाएं**: अगर कोई भी खतरा महसूस हो रहा है, तो ऊपर लाल **SOS** बटन दबाएं या सीधे **112** (आपातकालीन नंबर) पर कॉल करें।\n\nआप बिल्कुल सुरक्षित हैं। मुझे बताएं कि आप अभी कहां हैं?`;
    } else {
      return `🌸 **Stay calm, I am here with you. Take these 3 immediate steps:**\n\n1. **Move to Light & People**: Step into any open shop, restaurant, or well-lit area near people.\n2. **Share Live Location**: Tap SafeHer's 'Live Location' and share your GPS track with trusted contacts on WhatsApp.\n3. **Dial 112 or Tap SOS**: If you feel any danger, tap the red SOS button or call **112** (National Emergency Helpline) immediately.\n\nYou are safe. Tell me what is happening around you right now?`;
    }
  }

  const isShort = lengthPreference === "short";
  const isDetailed = lengthPreference === "detailed";

  // 1. Cab / Auto / Taxi / Driver Emergency
  if (
    lower.includes("cab") ||
    lower.includes("taxi") ||
    lower.includes("auto") ||
    lower.includes("driver") ||
    lower.includes("route") ||
    lower.includes("rasta") ||
    lower.includes("gaadi") ||
    lower.includes("uber") ||
    lower.includes("ola")
  ) {
    if (isHindi) {
      if (isShort) {
        return `🚨 कैब/ड्राइवर इमरजेंसी (तुरंत 3 कदम):\n1. SafeHer 'Live Location' से WhatsApp पर लोकेशन भेजें।\n2. ड्राइवर को ज़ोर से बोलें: 'मेन रोड पर गाड़ी रोकिए, 112 डायल हो रहा है।'\n3. दरवाज़ा खोलें (चाइल्ड-लॉक चेक करें) और तुरंत 112 मिलाएं।`;
      }
      return `🚨 कैब/ऑटो ड्राइवर गलत रास्ते पर हो तो तुरंत ये कदम उठाएं:\n\n1. **लाइव लोकेशन भेजें**: तुरंत SafeHer के 'Live Location' बटन से परिवार को WhatsApp पर लोकेशन भेजें।\n2. **ज़ोर से फोन पर बात करें**: ड्राइवर को सुनाकर बोलें: 'भैया मैं कैब में हूं, गाड़ी नंबर नोट कर लो, मैं 5 मिनट में पहुंच रही हूं।'\n3. **ड्राइवर को सीधे टोकें**: 'गाड़ी मेन रोड पर रखो, तुरंत किसी पेट्रोल पंप या दुकान के पास रोको।'\n4. **डोर लॉक चेक करें**: चेक करें कि चाइल्ड-लॉक न लगा हो और गेट अंदर से खुल रहा हो।\n5. **तुरंत 112 मिलाएं**: अगर ड्राइवर न माने, तो तुरंत 112 डायल करें या SafeHer का SOS बटन दबाएं।`;
    } else {
      if (isShort) {
        return `🚨 Cab Emergency (3 Quick Steps):\n1. Share SafeHer Live GPS on WhatsApp with family.\n2. Loudly command driver: 'Keep on main highway, pull over at nearest shop.'\n3. Check child-lock off and dial 112 immediately.`;
      }
      return `🚨 Immediate steps if your cab/auto driver is taking a wrong route:\n\n1. **Broadcast Live GPS**: Tap SafeHer's 'Live Location' and share your live track on WhatsApp with family.\n2. **Make a Loud Phone Call**: Speak clearly so driver hears: 'I am in this cab right now, noting down vehicle number. Wait outside for me.'\n3. **Firmly Command to Stop**: Tell the driver: 'Keep to the main lit highway. Pull over near the petrol pump or grocery shop.'\n4. **Check Rear Locks**: Verify child-lock is off and door opens from inside.\n5. **Dial 112 Instantly**: If the driver ignores you or turns away from roads, dial **112** or trigger SafeHer SOS immediately.`;
    }
  }

  // 2. Being Followed / Stalker / Someone suspicious behind
  if (
    lower.includes("follow") ||
    lower.includes("chase") ||
    lower.includes("piche") ||
    lower.includes("stalk") ||
    lower.includes("darr") ||
    lower.includes("scared") ||
    lower.includes("ladka") ||
    lower.includes("aadmi") ||
    lower.includes("alone") ||
    lower.includes("dark") ||
    lower.includes("sunsaan")
  ) {
    if (isHindi) {
      if (isShort) {
        return `⚠️ पीछा किए जाने पर तुरंत:\n1. सड़क पार करें और किसी खुली दुकान या गार्ड वाले ATM में घुसें।\n2. SafeHer Fake Call चालू करके कान पर लगाएं।\n3. हाथ में चाबी रखें और 112 / 1090 पर कॉल करें।`;
      }
      return `⚠️ अगर कोई आपका पीछा कर रहा हो:\n\n1. **सड़क पार करें**: तुरंत दूसरी तरफ जाएं ताकि साफ़ हो जाए कि वो पीछा कर रहा है। कभी भी सुनसान गली में न मुड़ें।\n2. **किसी खुली दुकान/ATM में घुसें**: तुरंत किसी किराना स्टोर, होटल लॉबी या 24x7 गार्ड वाले बैंक ATM में घुस जाएं।\n3. **SafeHer Fake Call का इस्तेमाल करें**: फोन कान पर लगाएं और ज़ोर से कहें: 'मैं बस 2 कदम दूर हूं, बाहर निकलो।'\n4. **हाथ में चाबी रखें**: अगर ज़रूरत पड़े तो चाबियों को उंगलियों के बीच रखकर सुरक्षा के लिए तैयार रहें।\n5. **112 / 1090 पर कॉल करें**: बिना देर किए 112 (पुलिस) या 1090 (महिला हेल्पलाइन) मिलाएं।`;
    } else {
      if (isShort) {
        return `⚠️ Being Followed (Immediate Actions):\n1. Cross the street diagonally into an open shop or guarded 24/7 ATM.\n2. Turn on SafeHer Fake Call and speak loudly.\n3. Hold keys between knuckles and dial 112 / 1090.`;
      }
      return `⚠️ Tactical emergency actions if you are being followed:\n\n1. **Cross the Road**: Cross diagonally to verify if they change direction with you. Do NOT take dark shortcuts.\n2. **Enter a Lit Business or Guarded ATM**: Step inside any open store, restaurant, metro station, or 24/7 ATM with a guard.\n3. **Trigger SafeHer Fake Call**: Hold phone to ear and loudly state: 'I am right at the corner, see you in 1 minute.'\n4. **Hold Keys Between Knuckles**: Keep your hands free, chin up, and project confidence.\n5. **Dial 112 / 1090**: Tap SOS or call **112** (Police) / **1090** (Women Power Line) immediately.`;
    }
  }

  // 3. Physical Attack / Grab / Self Defense
  if (
    lower.includes("attack") ||
    lower.includes("grab") ||
    lower.includes("pakad") ||
    lower.includes("defense") ||
    lower.includes("hit") ||
    lower.includes("chhu") ||
    lower.includes("haath")
  ) {
    if (isHindi) {
      if (isShort) {
        return `🥋 आत्मरक्षा के 3 त्वरित प्रहार:\n1. आंखों या नाक पर हथेली के निचले हिस्से से वार करें।\n2. पीछे से पकड़े जाने पर उसके पैर के पंजे पर एड़ी पटकें और कोहनी से मारें।\n3. ज़ोर से 'आग' चिल्लाएं और भीड़ की तरफ दौड़कर 112 मिलाएं।`;
      }
      return `🥋 आत्मरक्षा (Self Defense) के तुरंत असरदार तरीके:\n\n1. **कमज़ोर अंगों पर वार करें**: हमलावर की आंखों, नाक, गले (Trachea), या ग्रोइन (Groin) पर पूरी ताकत से वार करें।\n2. **पीछे से पकड़े जाने पर**: अपनी एड़ी से उसके पैर के पंजों (Instep) पर जोर से पैर पटकें और कोहनी से पसलियों पर मारें।\n3. **शोर मचाएं (ज़ोर से 'आग' या 'बचाओ' चिल्लाएं)**: 'बचाओ' की तुलना में 'आग' (Fire) सुनकर लोग बहुत तेज़ी से दौड़कर आते हैं।\n4. **पकड़ से छूटते ही दौड़ें**: किसी भी भीड़भाड़ वाले इलाके की तरफ भागें और तुरंत SafeHer SOS व **112** डायल करें।`;
    } else {
      if (isShort) {
        return `🥋 Fast Self Defense Targets:\n1. Palm strike to nose or throat; kick to groin.\n2. If grabbed from behind, heel stomp on foot arch and elbow ribs.\n3. Scream 'FIRE' loudly and sprint to lit area. Dial 112.`;
      }
      return `🥋 Immediate high-impact self defense tactics:\n\n1. **Strike Vulnerable Target Zones**: Target eyes (palm heel strike), throat/windpipe, bridge of nose, or groin.\n2. **If Grabbed from Behind**: Stomp heel down hard on their foot arch/instep, drive an elbow backwards into solar plexus/ribs.\n3. **Shout 'FIRE' Loudly**: Psychological studies show screaming 'FIRE' draws bystanders faster than 'HELP'.\n4. **Break and Sprint**: The moment grip loosens, sprint toward light and people; trigger SOS and dial **112**.`;
    }
  }

  // 4. Eve Teasing / Harassment / Cyber / Evidence
  if (
    lower.includes("harass") ||
    lower.includes("teas") ||
    lower.includes("ched") ||
    lower.includes("photo") ||
    lower.includes("video") ||
    lower.includes("threat") ||
    lower.includes("dhamki") ||
    lower.includes("fir") ||
    lower.includes("legal") ||
    lower.includes("adhikar")
  ) {
    if (isHindi) {
      return `⚖️ छेड़छाड़ या धमकी के खिलाफ आपके कानूनी अधिकार:\n\n1. **Zero FIR**: घटना चाहे कहीं भी हुई हो, किसी भी थाने में Zero FIR दर्ज कराना आपका कानूनी अधिकार है।\n2. **सबूत जुटाएं**: SafeHer के 'Incident Report' टूल से तारीख और समय के साथ वीडियो/फोटो सुरक्षित करें।\n3. **1090 महिला हेल्पलाइन**: उत्तर प्रदेश व राष्ट्रीय महिला हेल्पलाइन 1090 / 181 पर कॉल करके बिना थाने जाए शिकायत दर्ज करा सकती हैं।\n4. **पहचान की गोपनीयता**: कानून के तहत आपकी पहचान पूरी तरह गुप्त रखी जाएगी।\n5. **धारा 354 IPC / BNS**: पीछा करने, घूरने या अनुचित स्पर्श के खिलाफ सख्त गैर-जमानती प्रावधान हैं।`;
    } else {
      return `⚖️ Legal protections & action against harassment:\n\n1. **Zero FIR**: You can register a FIR at ANY police station irrespective of jurisdiction under Indian law.\n2. **Record Evidence**: Use SafeHer 'Incident Report' tool to capture timestamped photo/video documentation.\n3. **Dial 1090 / 181**: Women Power Line 1090 allows direct reporting without public exposure.\n4. **Confidentiality Guaranteed**: Law strictly mandates victim identity protection under Sec 228A.\n5. **Action under BNS / Sec 354**: Stalking, voyeurism, and assault are cognizable offenses.`;
    }
  }

  // 5. Default situational safety answer
  if (isHindi) {
    return `🛡️ SafeHer सुरक्षा निर्देश:\n\n- यदि आप किसी भी आपात स्थिति या खतरे में हैं, तुरंत ऊपर लाल **SOS** बटन दबाएं।\n- **112** (राष्ट्रीय आपातकालीन नंबर) या **1090** (महिला पावर लाइन) पर सीधे कॉल करें।\n- मुझे अपनी सटीक परेशानी बताएं (जैसे: 'कैब वाला बात नहीं सुन रहा', 'कोई पीछे आ रहा है', 'अंधेरे रास्ते में फंसी हूं') ताकि मैं सटीक कदम बता सकूं।`;
  } else {
    return `🛡️ SafeHer Safety Instructions:\n\n- If you are facing any threat or danger right now, tap the red **SOS** button immediately.\n- Direct emergency dials: **112** (National Emergency), **1090** (Women Helpline), **108** (Ambulance), **100** (Police PCR).\n- Please specify your exact situation (e.g., 'driver deviating route', 'suspicious person walking behind me') for instant customized guidance.`;
  }
}

// AI Safety Assistant Endpoint
app.post("/api/assistant", async (req, res) => {
  const message = (req.body.message || req.body.prompt || req.body.query || "").toString().trim();
  const history = req.body.history || [];
  const locationContext = req.body.locationContext;
  const lengthPreference = (req.body.lengthPreference || "short").toString();
  const preferredLang = (req.body.language || req.body.lang || req.body.inputLang || "").toString().toLowerCase();

  if (!message) {
    return res.status(400).json({ error: "A message or prompt string is required." });
  }

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

      const langDirective =
        preferredLang.includes("hi") || preferredLang === "hindi"
          ? "CRITICAL LANGUAGE RULE: Respond in clear, natural HINDI (हिंदी) or conversational Hinglish as appropriate to match user tone."
          : preferredLang.includes("en") || preferredLang === "english"
          ? "CRITICAL LANGUAGE RULE: Respond in clear, professional, direct ENGLISH."
          : "Respond in the exact same language or dialect (Hindi, Hinglish, or English) that the user used.";

      const systemInstruction = `You are "SafeHer AI", the intelligent, highly capable, and empathetic Women Safety & Emergency Assistant built directly into the SafeHer ecosystem.

${langDirective}

MANDATE — PROVIDE EXACT & ACCURATE ANSWERS:
- Always answer EXACTLY and DIRECTLY what the user asks. Never dodge the question or give a generic canned reply if a specific question is asked.
- Answer informational questions with factual precision, depth, and clarity.
- When asked about women safety laws in India, cite exact provisions: Zero FIR (CrPC 154 / BNSS 173), Bharatiya Nyaya Sanhita (BNS) Section 74/78, IPC Section 354 (assault/outraging modesty, voyeurism, stalking), Domestic Violence Act, and the Supreme Court guidelines on victim privacy (IPC 228A).
- When asked about emergency tactical safety (cabs, stalkers, dark streets, harassment), give sharp, realistic, numbered life-saving steps.
- Always remember emergency numbers: 112 (All-India Emergency), 1090 (Women Power Line / UP & National), 108 (Ambulance), 1098 (Childline), 1930 (Cyber Crime).

CREATOR, DEVELOPER & ROLE MODEL DOSSIER — ADITI RAO:
- Who is Aditi Rao?
  Aditi Rao is an exceptional 20-year-old female software engineer, innovator, and women's safety advocate from Lucknow, Uttar Pradesh, India. She is the founder and developer of SafeHer, created in 2026.
- Signature Thought & Philosophy of Aditi Rao:
  * In English: "Technology should not only make our lives easier, it should make our lives safer."
  * In Hindi: "तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।"
  * Whenever asked about Aditi Rao's thoughts, vision, philosophy, quotes, or what motivates her, ALWAYS quote this exact thought prominently and explain how it drives the SafeHer mission.
- Professional Profile & Guidelines:
  * Present Aditi Rao with high professionalism, dignity, and admiration as an inspiring tech leader and youth role model.
  * DO NOT use defensive, repetitive, or informal phrases like "100% self-coded", "bina AI ke banaya", or "AI tool ka use nahi kiya". Keep the tone strictly executive, inspiring, and professional.
  * State clearly and gracefully that she conceptualized, designed, and developed the entire SafeHer platform from Lucknow, Uttar Pradesh.
  * Highlight her accomplishments at age 20: architecting a comprehensive, production-grade safety ecosystem with 1-tap SOS, live GPS tracking, fake escape calls, and emergency assistance.
  * Emphasize her dedication to "Tech For Good" (using software technology for social impact and women's safety) and how she serves as an inspiring role model for young women and students in STEM across Uttar Pradesh and all of India.
- When asked about Aditi Rao, who developed SafeHer, her achievements, her thoughts, or why she is an inspiration:
  Provide a warm, articulate, highly professional, and proud response highlighting her software engineering talent, vision at age 20, social empathy, signature thought, and status as a genuine youth role model.

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
      userPrompt += `\n[Preferred Language: ${preferredLang || "match-input"}]`;
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
              temperature: 0.5,
              maxOutputTokens: maxTokens,
            },
          });
          return res.text || "";
        })();
        return Promise.race([apiPromise, timeoutPromise]);
      };

      let responseText = "";
      try {
        // Fast primary model: gemini-3.5-flash-lite
        responseText = await tryModel("gemini-3.5-flash-lite", 8000);
      } catch (err: any) {
        console.log("Notice: Primary model gemini-3.5-flash-lite had issue, trying gemini-flash-latest:", err?.message || err);
        try {
          // Robust fallback model: gemini-flash-latest
          responseText = await tryModel("gemini-flash-latest", 8000);
        } catch (subErr: any) {
          console.log("Notice: Secondary model also had issue:", subErr?.message || subErr);
        }
      }

      if (responseText && responseText.trim().length > 0) {
        return res.json({ reply: responseText.trim(), text: responseText.trim() });
      }
    } catch (e: any) {
      console.log("Notice: Gemini assistant error, using instant safety intelligence:", e?.message || e);
    }
  }

  // Guaranteed situational, context-aware fallback in user's language (< 2ms)
  const reply = getSituationalSafetyAdvice(message, lengthPreference, preferredLang);
  return res.json({ reply, text: reply });
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
