import React from "react";
import { Shield } from "lucide-react";
import { ActiveTab, LocationInfo } from "../types";

interface HomeTabProps {
  onSosClick: () => void;
  onOpenFakeCall: () => void;
  onCheckLocation: () => void;
  onCheckBattery: () => void;
  onTriggerImSafe: () => void;
  onOpenSafeRoute: () => void;
  onOpenSafetyScore: () => void;
  onQuickExit: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  isShakeEnabled: boolean;
  onToggleShake: () => void;
  isVoiceSosEnabled: boolean;
  onToggleVoiceSos: () => void;
  batteryLevel: number | null;
  isBatterySaverOn: boolean;
  location: LocationInfo;
  safeStatusText: string;
  currentLanguage?: string;
}

const HOME_TRANSLATIONS: Record<string, Record<string, string>> = {
  hindi: {
    welcome: "WELCOME",
    welcomeSub: "स्मार्ट सुरक्षा और त्वरित आपातकालीन सहायता।",
    emergencySos: "EMERGENCY SOS",
    pressForHelp: "PRESS FOR HELP",
    sosSub: "⚡ 1-Tap WhatsApp, SMS & Live GPS alert",
    quickActions: "Quick Actions",
    liveLocation: "Live Location",
    liveLocationSub: "GPS locked • Tap to view",
    fakeCall: "Fake Call",
    fakeCallSub: "Discreet escape ring",
    batterySaver: "Battery & Saver",
    batterySaverSub: "Power management",
    imSafe: "I'm Safe",
    imSafeSub: "Share safe status",
    smartTools: "Smart Safety Tools",
    shakeSos: "Shake for SOS",
    shakeSosSub: "Active • Shake phone",
    safeRoute: "Safe Route",
    safeRouteSub: "Deviation tracking",
    aiHelp: "AI Voice Help",
    aiHelpSub: "Talk or send audio",
    safetyScore: "Safety Score",
    safetyScoreSub: "Check preparedness",
    voiceSos: "Voice SOS",
    voiceSosSub: "Says 'Help' to activate",
    quickExit: "Quick Exit",
    quickExitSub: "Calculator disguise",
  },
  english: {
    welcome: "WELCOME",
    welcomeSub: "Smart safety & instant emergency response.",
    emergencySos: "EMERGENCY SOS",
    pressForHelp: "PRESS FOR HELP",
    sosSub: "⚡ 1-Tap WhatsApp, SMS & Live GPS alert",
    quickActions: "Quick Actions",
    liveLocation: "Live Location",
    liveLocationSub: "GPS locked • Tap to view",
    fakeCall: "Fake Call",
    fakeCallSub: "Discreet escape ring",
    batterySaver: "Battery & Saver",
    batterySaverSub: "Power management",
    imSafe: "I'm Safe",
    imSafeSub: "Share safe status",
    smartTools: "Smart Safety Tools",
    shakeSos: "Shake for SOS",
    shakeSosSub: "Active • Shake phone",
    safeRoute: "Safe Route",
    safeRouteSub: "Deviation tracking",
    aiHelp: "AI Voice Help",
    aiHelpSub: "Talk or send audio",
    safetyScore: "Safety Score",
    safetyScoreSub: "Check preparedness",
    voiceSos: "Voice SOS",
    voiceSosSub: "Says 'Help' to activate",
    quickExit: "Quick Exit",
    quickExitSub: "Calculator disguise",
  },
  hinglish: {
    welcome: "WELCOME",
    welcomeSub: "Smart safety & instant emergency response.",
    emergencySos: "EMERGENCY SOS",
    pressForHelp: "PRESS FOR HELP",
    sosSub: "⚡ 1-Tap WhatsApp, SMS & Live GPS alert",
    quickActions: "Quick Actions",
    liveLocation: "Live Location",
    liveLocationSub: "GPS locked • Tap to view",
    fakeCall: "Fake Call",
    fakeCallSub: "Discreet escape ring",
    batterySaver: "Battery & Saver",
    batterySaverSub: "Power management",
    imSafe: "I'm Safe",
    imSafeSub: "Share safe status",
    smartTools: "Smart Safety Tools",
    shakeSos: "Shake for SOS",
    shakeSosSub: "Active • Shake phone",
    safeRoute: "Safe Route",
    safeRouteSub: "Deviation tracking",
    aiHelp: "AI Voice Help",
    aiHelpSub: "Talk or send audio",
    safetyScore: "Safety Score",
    safetyScoreSub: "Check preparedness",
    voiceSos: "Voice SOS",
    voiceSosSub: "Says 'Help' to activate",
    quickExit: "Quick Exit",
    quickExitSub: "Calculator disguise",
  },
  bengali: {
    welcome: "স্বাগতম",
    welcomeSub: "স্মার্ট নারী সুরক্ষা এবং তাত্ক্ষণিক জরুরি সহায়তা।",
    emergencySos: "জরুরি এসওএস",
    pressForHelp: "সাহায্যের জন্য চাপুন",
    sosSub: "⚡ ১-ট্যাপ হোয়াটসঅ্যাপ, এসএমএস এবং লাইভ জিপিএস",
    quickActions: "দ্রুত সেবা",
    liveLocation: "লাইভ লোকেশন",
    liveLocationSub: "জিপিএস ম্যাপ দেখুন",
    fakeCall: "ফেক কল",
    fakeCallSub: "এস্কেপ রিং",
    batterySaver: "ব্যাটারি ও সেভার",
    batterySaverSub: "পাওয়ার ম্যানেজমেন্ট",
    imSafe: "আমি নিরাপদ",
    imSafeSub: "স্ট্যাটাস জানান",
    smartTools: "স্মার্ট নিরাপত্তা টুলস",
    shakeSos: "ঝাঁকিয়ে এসওএস",
    shakeSosSub: "ফোন ঝাঁকালে সতর্কতা",
    safeRoute: "নিরাপদ রুট",
    safeRouteSub: "রুট বিচ্যুতি ট্র্যাকিং",
    aiHelp: "এআই ভয়েস সাহায্য",
    aiHelpSub: "কথা বলুন বা শুনুন",
    safetyScore: "নিরাপত্তা স্কোর",
    safetyScoreSub: "প্রস্তুতি যাচাই",
    voiceSos: "ভয়েস এসওএস",
    voiceSosSub: "Help বলুন",
    quickExit: "দ্রুত প্রস্থান",
    quickExitSub: "ক্যালকুলেটর ছদ্মবেশ",
  },
  punjabi: {
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    welcomeSub: "ਸਮਾਰਟ ਮਹਿਲਾ ਸੁਰੱਖਿਆ ਅਤੇ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮਦਦ।",
    emergencySos: "ਐਮਰਜੈਂਸੀ ਐਸਓਐਸ",
    pressForHelp: "ਮਦਦ ਲਈ ਦਬਾਓ",
    sosSub: "⚡ 1-ਟੈਪ ਵਟਸਐਪ, ਐਸਐਮਐਸ ਅਤੇ ਲਾਈਵ ਜੀਪੀਐਸ",
    quickActions: "ਤੁਰੰਤ ਸੇਵਾਵਾਂ",
    liveLocation: "ਲਾਈਵ ਲੋਕੇਸ਼ਨ",
    liveLocationSub: "ਜੀਪੀਐਸ ਨਕਸ਼ਾ ਦੇਖੋ",
    fakeCall: "ਫੇਕ ਕਾਲ",
    fakeCallSub: "ਬਚ ਨਿਕਲਣ ਲਈ ਕਾਲ",
    batterySaver: "ਬੈਟਰੀ ਅਤੇ ਸੇਵਰ",
    batterySaverSub: "ਪਾਵਰ ਸੈਟਿੰਗਾਂ",
    imSafe: "ਮੈਂ ਸੁਰੱਖਿਅਤ ਹਾਂ",
    imSafeSub: "ਸਟੇਟਸ ਸ਼ੇਅਰ ਕਰੋ",
    smartTools: "ਸਮਾਰਟ ਸੁਰੱਖਿਆ ਟੂਲ",
    shakeSos: "ਸ਼ੇਕ ਐਸਓਐਸ",
    shakeSosSub: "ਹਿਲਾਉਣ 'ਤੇ ਅਲਰਟ",
    safeRoute: "ਸੁਰੱਖਿਅਤ ਰਸਤਾ",
    safeRouteSub: "ਰੂਟ ਟਰੈਕਿੰਗ",
    aiHelp: "ਏਆਈ ਆਵਾਜ਼ ਮਦਦ",
    aiHelpSub: "ਬੋਲੋ ਜਾਂ ਸੁਣੋ",
    safetyScore: "ਸੁਰੱਖਿਆ ਸਕੋਰ",
    safetyScoreSub: "ਤਿਆਰੀ ਪਰਖੋ",
    voiceSos: "ਆਵਾਜ਼ ਐਸਓਐਸ",
    voiceSosSub: "Help ਬੋਲੋ",
    quickExit: "ਤੁਰੰਤ ਐਗਜ਼ਿਟ",
    quickExitSub: "ਕੈਲਕੁਲੇਟਰ ਬਹਾਨਾ",
  },
  marathi: {
    welcome: "स्वागत आहे",
    welcomeSub: "स्मार्ट महिला सुरक्षा आणि तात्काळ आणीबाणी मदत.",
    emergencySos: "आणीबाणी एसओएस",
    pressForHelp: "मदतीसाठी दाबा",
    sosSub: "⚡ १-टॅप व्हॉट्सअॅप, एसएमएस व लाईव्ह जीपीएस",
    quickActions: "त्वरित कृती",
    liveLocation: "लाईव्ह लोकेशन",
    liveLocationSub: "जीपीएस नकाशा पहा",
    fakeCall: "फेक कॉल",
    fakeCallSub: "सुटकेसाठी कॉल",
    batterySaver: "बॅटरी व सेव्हर",
    batterySaverSub: "पॉवर व्यवस्थापन",
    imSafe: "मी सुरक्षित आहे",
    imSafeSub: "स्थिती सामायिक करा",
    smartTools: "स्मार्ट सुरक्षा टूल्स",
    shakeSos: "शेक एसओएस",
    shakeSosSub: "फोन हलवल्यावर अलर्ट",
    safeRoute: "सुरक्षित मार्ग",
    safeRouteSub: "मार्ग विचलन ट्रॅकिंग",
    aiHelp: "एआय व्हॉईस मदत",
    aiHelpSub: "बोला किंवा ऐका",
    safetyScore: "सुरक्षा स्कोर",
    safetyScoreSub: "तयारी तपासा",
    voiceSos: "व्हॉईस एसओएस",
    voiceSosSub: "Help किंवा वाचवा म्हणा",
    quickExit: "क्विक एक्झिट",
    quickExitSub: "कॅल्क्युलेटर छद्म",
  },
  urdu: {
    welcome: "خوش آمدید",
    welcomeSub: "خواتین کی سمارٹ حفاظت اور فوری ہنگامی مدد۔",
    emergencySos: "ہنگامی ایس او ایس",
    pressForHelp: "مدد کے لیے دبائیں",
    sosSub: "⚡ ۱-ٹیپ واٹس ایپ، ایس ایم ایس اور لائیو جی پی ایس",
    quickActions: "فوری اقدامات",
    liveLocation: "لائیو لوکیشن",
    liveLocationSub: "جی پی ایس میپ دیکھیں",
    fakeCall: "جعلی کال",
    fakeCallSub: "محفوظ نکلنے کے لیے کال",
    batterySaver: "بیٹری اور سیور",
    batterySaverSub: "پاور کنٹرول",
    imSafe: "میں محفوظ ہوں",
    imSafeSub: "خیریت سے مطلع کریں",
    smartTools: "سمارٹ حفاظتی ٹولز",
    shakeSos: "ہلانے پر ایس او ایس",
    shakeSosSub: "فون ہلانے پر الرٹ",
    safeRoute: "محفوظ راستہ",
    safeRouteSub: "روٹ مانیٹرنگ",
    aiHelp: "اے آئی وائس مدد",
    aiHelpSub: "بات کریں یا سنیں",
    safetyScore: "سیفٹی اسکور",
    safetyScoreSub: "تیاری جانچیں",
    voiceSos: "آواز سے ایس او ایس",
    voiceSosSub: "Help یا بچاؤ بولیں",
    quickExit: "فوری اخراج",
    quickExitSub: "کیلکولیٹر کا پردہ",
  },
};

export const HomeTab: React.FC<HomeTabProps> = ({
  onSosClick,
  onOpenFakeCall,
  onCheckLocation,
  onCheckBattery,
  onTriggerImSafe,
  onOpenSafeRoute,
  onOpenSafetyScore,
  onQuickExit,
  onNavigateTab,
  isShakeEnabled,
  onToggleShake,
  isVoiceSosEnabled,
  onToggleVoiceSos,
  batteryLevel,
  isBatterySaverOn,
  location,
  safeStatusText,
  currentLanguage = "english",
}) => {
  const t =
    HOME_TRANSLATIONS[currentLanguage] || HOME_TRANSLATIONS["english"];

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* 1. WELCOME BANNER (Exact Original Design) */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-rose-500/10 via-orange-500/5 to-pink-500/10 dark:from-rose-950/40 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/40 p-5 shadow-xs">
        <div className="relative z-10 flex items-start justify-between">
          <div className="max-w-[75%]">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
              <span>{t.welcome}</span>
              <span>👋</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#E84E60] dark:text-rose-400 tracking-tight leading-tight mb-1">
              SafeHer Protection
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {t.welcomeSub}
            </p>
          </div>

          <div className="w-13 h-13 rounded-2xl bg-white/90 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0">
            <Shield className="w-8 h-8 text-[#4A8EC2] fill-[#78B4DC]/30 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* 2. EMERGENCY SOS SECTION */}
      <div className="flex flex-col items-center justify-center text-center pt-1">
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest mb-3">
          <span>🚨</span>
          <span>{t.emergencySos}</span>
        </div>

        {/* Big Pulsing SOS Button */}
        <button
          onClick={onSosClick}
          aria-label="Emergency SOS Press for Help"
          className="relative w-44 h-44 rounded-full bg-linear-to-tr from-[#E63950] via-[#F43F5E] to-[#FB7185] flex flex-col items-center justify-center text-white shadow-xl shadow-rose-500/30 animate-sos-pulse cursor-pointer active:scale-95 transition-transform group"
        >
          {/* Inner ring */}
          <div className="w-38 h-38 rounded-full border-2 border-white/40 flex flex-col items-center justify-center p-4">
            <span className="text-4xl font-black tracking-wider text-white drop-shadow-md my-0.5 font-sans">
              SOS
            </span>
            <span className="text-[11px] font-black tracking-widest uppercase text-white/95 mt-1">
              {t.pressForHelp}
            </span>
          </div>
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-3 max-w-xs leading-tight px-4 text-center">
          {t.sosSub}
        </p>
      </div>

      {/* 3. QUICK ACTIONS (Exact Original 4-card layout) */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {t.quickActions}
          </h3>
          <span className="text-amber-500 text-sm">⚡</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Live Location */}
          <button
            onClick={onCheckLocation}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-100 dark:hover:border-rose-900/40 transition-all text-left flex flex-col justify-between min-h-[96px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">📍</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.liveLocation}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {location.latitude ? t.liveLocationSub : "Share GPS map"}
              </p>
            </div>
          </button>

          {/* Fake Call */}
          <button
            onClick={onOpenFakeCall}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-100 dark:hover:border-rose-900/40 transition-all text-left flex flex-col justify-between min-h-[96px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">📱</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.fakeCall}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.fakeCallSub}
              </p>
            </div>
          </button>

          {/* Battery Check */}
          <button
            onClick={onCheckBattery}
            className={`p-3.5 rounded-3xl border shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[96px] cursor-pointer active:scale-98 ${
              isBatterySaverOn
                ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                : (batteryLevel ?? 84) <= 20
                ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 animate-pulse"
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🔋</span>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  isBatterySaverOn
                    ? "bg-emerald-500 text-white"
                    : (batteryLevel ?? 84) <= 20
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {isBatterySaverOn ? "SAVER ON" : `${batteryLevel ?? 84}%`}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.batterySaver}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {(batteryLevel ?? 84) <= 20
                  ? "Low Warning (≤20%)"
                  : isBatterySaverOn
                  ? "Power Saver Active"
                  : t.batterySaverSub}
              </p>
            </div>
          </button>

          {/* I'm Safe */}
          <button
            onClick={onTriggerImSafe}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left flex flex-col justify-between min-h-[96px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">✅</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.imSafe}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.imSafeSub}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. SMART SAFETY TOOLS (Exact original 6-card layout without any 'Full Page' text) */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {t.smartTools}
          </h3>
          <span className="text-amber-500 text-sm">✨</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Shake-to-SOS */}
          <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-[105px]">
            <div className="flex items-center justify-between">
              <span className="text-xl">😲</span>
              <button
                onClick={onToggleShake}
                className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                  isShakeEnabled
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {isShakeEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <div onClick={onToggleShake} className="cursor-pointer">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.shakeSos}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isShakeEnabled ? t.shakeSosSub : "Tap to activate"}
              </p>
            </div>
          </div>

          {/* Safe Route */}
          <button
            onClick={onOpenSafeRoute}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">🗺️</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.safeRoute}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.safeRouteSub}
              </p>
            </div>
          </button>

          {/* Smart Assistant */}
          <button
            onClick={() => onNavigateTab("assistant")}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">🤖</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.aiHelp}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.aiHelpSub}
              </p>
            </div>
          </button>

          {/* Safety Score */}
          <button
            onClick={onOpenSafetyScore}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">📊</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.safetyScore}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.safetyScoreSub}
              </p>
            </div>
          </button>

          {/* Voice SOS */}
          <button
            onClick={onToggleVoiceSos}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🎤</span>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  isVoiceSosEnabled
                    ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {isVoiceSosEnabled ? "ON" : "OFF"}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.voiceSos}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.voiceSosSub}
              </p>
            </div>
          </button>

          {/* Quick Exit */}
          <button
            onClick={onQuickExit}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-xl">🚪</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {t.quickExit}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.quickExitSub}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. ACTIVE GUARD STATUS CARD */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Active Guard
          </h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
            {safeStatusText || "Protection active • Sensors ready."}
          </p>
        </div>
      </div>

      {/* 6. DEVELOPER & COPYRIGHT FOOTER */}
      <div className="pt-2 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/70 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
          <span>👩‍💻 Developed by</span>
          <span className="text-[#E84E60] dark:text-rose-400 font-extrabold">Aditi Rao</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          SafeHer © 2026 Aditi Rao • All Rights Reserved
        </p>
      </div>
    </div>
  );
};
