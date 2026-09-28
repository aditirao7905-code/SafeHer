import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  StopCircle,
  X,
  Shield,
  ShieldCheck,
  Trash2,
  Phone,
  AlertTriangle,
  Settings as SettingsIcon,
  ChevronRight,
  ArrowLeft,
  Bell,
  Palette,
  Type,
  Info,
  Check,
  Globe,
  Sliders,
  Sparkles,
  Plus,
  MessageCircle,
  BookOpen,
  Lock,
  Compass,
  FileText,
} from "lucide-react";
import { LocationInfo, EmergencyContact } from "../types";
import { soundManager } from "../utils/audio";
import { getSavedContacts, saveContacts } from "../utils/helpers";
import { SettingsSubpages } from "./SettingsSubpages";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

interface AssistantTabProps {
  location: LocationInfo;
  onBack?: () => void;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  dateLabel: string;
  messages: Message[];
}

const formatSessionTime = (timestamp: number): string => {
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today, ${timeStr}`;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
};

const DEFAULT_WELCOME_TEXT = "Bilkul, main aapki help karti hoon. Aapka destination kya hai ya koi pareshani hai to batayein.";

const makeNewSession = (title?: string): ChatSession => {
  const now = Date.now();
  return {
    id: "session_" + now + "_" + Math.random().toString(36).substring(2, 6),
    title: title || "New Conversation",
    createdAt: now,
    updatedAt: now,
    dateLabel: formatSessionTime(now),
    messages: [
      {
        id: "m_welcome_" + now,
        sender: "assistant",
        text: DEFAULT_WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ],
  };
};

type SupportedLang = "auto" | "english" | "hindi" | "hinglish" | "punjabi" | "bengali" | "marathi" | "urdu";

const LANGUAGE_LABELS: { id: SupportedLang; label: string; code: string; flag: string }[] = [
  { id: "auto", label: "Auto-Detect", code: "auto", flag: "✨" },
  { id: "hindi", label: "हिन्दी", code: "hi-IN", flag: "🇮🇳" },
  { id: "hinglish", label: "Hinglish", code: "en-IN", flag: "🇮🇳" },
  { id: "english", label: "English", code: "en-IN", flag: "🇬🇧" },
  { id: "punjabi", label: "ਪੰਜਾਬੀ", code: "pa-IN", flag: "🇮🇳" },
  { id: "bengali", label: "বাংলা", code: "bn-IN", flag: "🇮🇳" },
  { id: "marathi", label: "मराठी", code: "mr-IN", flag: "🇮🇳" },
  { id: "urdu", label: "اردو", code: "ur-IN", flag: "🇵🇰" },
];

interface QuickQuestionItem {
  id: string;
  icon: string;
  bgColor: string;
  label: string;
  prompt: string;
}

export interface LocalizedUI {
  assistantName: string;
  activeStatus: string;
  oldChats: string;
  newChat: string;
  settings: string;
  heroGreeting: string;
  quickQuestionsTitle: string;
  seeMore: string;
  showLess: string;
  inputPlaceholder: string;
  thinking: string;
  listening: string;
  tapToSpeak: string;
  savedConversations: string;
  backToChat: string;
  clearAll: string;
  tapToRead: string;
  holdToDelete: string;
  deleteConversation: string;
  deleteMessage: string;
  continueChat: string;
  confirmDeleteTitle: string;
  confirmDeleteDesc: string;
  cancel: string;
  activeBadge: string;
  policeSos: string;
  womenHelpline: string;
  shareGps: string;
  soundSiren: string;
  stopSiren: string;
  emergencyControls: string;
  transcriptTitle: string;
}

const UI_DICTIONARY: Record<SupportedLang, LocalizedUI> = {
  bengali: {
    assistantName: "SafeHer AI",
    activeStatus: "সক্রিয়",
    oldChats: "চ্যাট",
    newChat: "নতুন চ্যাট",
    settings: "সেটিংস",
    heroGreeting: "নমস্কার, আমি",
    quickQuestionsTitle: "জরুরি ও দ্রুত প্রশ্ন",
    seeMore: "আরও দেখুন",
    showLess: "কম দেখুন",
    inputPlaceholder: "যেকোনো ভাষায় লিখুন বা কথা বলুন...",
    thinking: "SafeHer চিন্তা করছে...",
    listening: "শুনছি... এখন কথা বলুন",
    tapToSpeak: "কথা বলতে ট্যাপ করুন",
    savedConversations: "Chats",
    backToChat: "চ্যাটে ফিরুন",
    clearAll: "সব মুছুন",
    tapToRead: "Read & Continue",
    holdToDelete: "মুছতে চেপে ধরে রাখুন",
    deleteConversation: "কথোপকথন মুছুন",
    deleteMessage: "মেসেজ মুছুন",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "কথোপকথন মুছে ফেলবেন?",
    confirmDeleteDesc: "আপনি কি নিশ্চিত যে এই চ্যাট হিস্ট্রি চিরতরে মুছে ফেলতে চান?",
    cancel: "বাতিল",
    activeBadge: "সক্রিয়",
    policeSos: "১১২ কল (পুলিশ)",
    womenHelpline: "১০৯০ কল (নারী হেল্পলাইন)",
    shareGps: "হোয়াটসঅ্যাপে লাইভ GPS",
    soundSiren: "সাইরেন বাজান",
    stopSiren: "সাইরেন বন্ধ করুন",
    emergencyControls: "জরুরি অ্যাকশন কন্ট্রোলস",
    transcriptTitle: "চ্যাট হিস্ট্রি ও মেসেজ রিডার",
  },
  hindi: {
    assistantName: "SafeHer AI",
    activeStatus: "सक्रिय",
    oldChats: "चैट्स",
    newChat: "नई चैट",
    settings: "सेटिंग्स",
    heroGreeting: "नमस्ते, मैं",
    quickQuestionsTitle: "आपातकालीन त्वरित प्रश्न",
    seeMore: "और देखें",
    showLess: "कम देखें",
    inputPlaceholder: "किसी भी भाषा में लिखें या बोलें...",
    thinking: "SafeHer सोच रही है...",
    listening: "सुन रही हूँ... अब बोलिए",
    tapToSpeak: "बोलने के लिए टैप करें",
    savedConversations: "Chats",
    backToChat: "चैट पर वापस जाएं",
    clearAll: "सब साफ़ करें",
    tapToRead: "Read & Continue",
    holdToDelete: "डिलीट करने के लिए दबाकर रखें",
    deleteConversation: "बातचीत डिलीट करें",
    deleteMessage: "मैसेज डिलीट करें",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "बातचीत डिलीट करें?",
    confirmDeleteDesc: "क्या आप इस चैट हिस्ट्री को स्थायी रूप से हटाना चाहते हैं?",
    cancel: "रद्द करें",
    activeBadge: "सक्रिय",
    policeSos: "112 डायल (पुलिस)",
    womenHelpline: "1090 डायल (महिला)",
    shareGps: "WhatsApp पर GPS भेजें",
    soundSiren: "सायरन बजाएं",
    stopSiren: "सायरन बंद करें",
    emergencyControls: "आपातकालीन त्वरित नियंत्रण",
    transcriptTitle: "चैट विवरण एवं मैसेज डिलीट",
  },
  english: {
    assistantName: "SafeHer AI",
    activeStatus: "Active",
    oldChats: "Chats",
    newChat: "New Chat",
    settings: "Settings",
    heroGreeting: "Hi, I'm",
    quickQuestionsTitle: "Emergency Quick Questions",
    seeMore: "See More",
    showLess: "Show Less",
    inputPlaceholder: "Type or speak in any language...",
    thinking: "SafeHer is thinking...",
    listening: "Listening... speak now",
    tapToSpeak: "Tap to speak",
    savedConversations: "Chats",
    backToChat: "Back to Chat",
    clearAll: "Clear All",
    tapToRead: "Read & Continue",
    holdToDelete: "Hold press to delete",
    deleteConversation: "Delete Conversation",
    deleteMessage: "Delete Message",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "Delete Conversation?",
    confirmDeleteDesc: "Are you sure you want to permanently delete this conversation?",
    cancel: "Cancel",
    activeBadge: "ACTIVE",
    policeSos: "Call 112 (Police)",
    womenHelpline: "Call 1090 (Women)",
    shareGps: "Share GPS on WA",
    soundSiren: "Sound Siren",
    stopSiren: "Stop Siren",
    emergencyControls: "Emergency Quick Action Controls",
    transcriptTitle: "Chat Transcript & Message Reader",
  },
  hinglish: {
    assistantName: "SafeHer AI",
    activeStatus: "Active",
    oldChats: "Chats",
    newChat: "New Chat",
    settings: "Settings",
    heroGreeting: "Hi, I'm",
    quickQuestionsTitle: "Quick Questions",
    seeMore: "See More",
    showLess: "Show Less",
    inputPlaceholder: "Type or speak in any language...",
    thinking: "SafeHer soch rahi hai...",
    listening: "Sun rahi hoon... boliye",
    tapToSpeak: "Tap to speak",
    savedConversations: "Chats",
    backToChat: "Back to Chat",
    clearAll: "Clear All",
    tapToRead: "Read & Continue",
    holdToDelete: "Hold press to delete",
    deleteConversation: "Delete Conversation",
    deleteMessage: "Delete Message",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "Delete Conversation?",
    confirmDeleteDesc: "Kya aap is conversation ko delete karna chahte hain?",
    cancel: "Cancel",
    activeBadge: "ACTIVE",
    policeSos: "Call 112 (Police)",
    womenHelpline: "Call 1090 (Women)",
    shareGps: "Share GPS on WA",
    soundSiren: "Sound Siren",
    stopSiren: "Stop Siren",
    emergencyControls: "Emergency Quick Action Controls",
    transcriptTitle: "Chat Transcript & Reader",
  },
  punjabi: {
    assistantName: "SafeHer AI",
    activeStatus: "ਸਰਗਰਮ",
    oldChats: "ਚੈਟ",
    newChat: "ਨਵੀਂ ਗੱਲਬਾਤ",
    settings: "ਸੈਟਿੰਗਾਂ",
    heroGreeting: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, ਮੈਂ",
    quickQuestionsTitle: "ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸਵਾਲ",
    seeMore: "ਹੋਰ ਦੇਖੋ",
    showLess: "ਘੱਟ ਦੇਖੋ",
    inputPlaceholder: "ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੋ ਜਾਂ ਬੋਲੋ...",
    thinking: "SafeHer ਸੋਚ ਰਹੀ ਹੈ...",
    listening: "ਸੁਣ ਰਹੀ ਹਾਂ... ਬੋਲੋ",
    tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
    savedConversations: "Chats",
    backToChat: "ਚੈਟ ਤੇ ਵਾਪਸ ਜਾਓ",
    clearAll: "ਸਭ ਸਾਫ਼ ਕਰੋ",
    tapToRead: "Read & Continue",
    holdToDelete: "ਮਿਟਾਉਣ ਲਈ ਦਬਾ ਕੇ ਰੱਖੋ",
    deleteConversation: "ਗੱਲਬਾਤ ਮਿਟਾਓ",
    deleteMessage: "ਸੁਨੇਹਾ ਮਿਟਾਓ",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "ਕੀ ਗੱਲਬਾਤ ਮਿਟਾਉਣੀ ਹੈ?",
    confirmDeleteDesc: "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ ਤੇ ਇਸ ਚੈਟ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    cancel: "ਰੱਦ ਕਰੋ",
    activeBadge: "ਸਰਗਰਮ",
    policeSos: "112 ਡਾਇਲ (ਪੁਲਿਸ)",
    womenHelpline: "1090 ਡਾਇਲ (ਮਹਿਲਾ)",
    shareGps: "WhatsApp ਤੇ GPS ਸ਼ੇਅਰ ਕਰੋ",
    soundSiren: "ਸਾਇਰਨ ਵਜਾਓ",
    stopSiren: "ਸਾਇਰਨ ਬੰਦ ਕਰੋ",
    emergencyControls: "ਐਮਰਜੈਂਸੀ ਕੰਟਰੋਲ",
    transcriptTitle: "ਚੈਟ ਵੇਰਵਾ ਅਤੇ ਸੁਨੇਹਾ ਰੀਡਰ",
  },
  marathi: {
    assistantName: "SafeHer AI",
    activeStatus: "सक्रिय",
    oldChats: "चॅट्स",
    newChat: "नवीन चॅट",
    settings: "सेटिंग्ज",
    heroGreeting: "नमस्कार, मी",
    quickQuestionsTitle: "त्वरित आपत्कालीन प्रश्न",
    seeMore: "आणखी पहा",
    showLess: "कमी पहा",
    inputPlaceholder: "कोणत्याही भाषेत टाइप करा किंवा बोला...",
    thinking: "SafeHer विचार करत आहे...",
    listening: "ऐकत आहे... बोला",
    tapToSpeak: "बोलण्यासाठी टॅप करा",
    savedConversations: "Chats",
    backToChat: "चॅटवर परत जा",
    clearAll: "सर्व साफ करा",
    tapToRead: "Read & Continue",
    holdToDelete: "हटवण्यासाठी दाबून ठेवा",
    deleteConversation: "संभाषण हटवा",
    deleteMessage: "मेसेज हटवा",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "संभाषण हटवायचे का?",
    confirmDeleteDesc: "तुम्हाला ही चॅट हिस्ट्री कायमची हटवायची आहे का?",
    cancel: "रद्द करा",
    activeBadge: "सक्रिय",
    policeSos: "112 कॉल (पोलीस)",
    womenHelpline: "1090 कॉल (महिला हेल्पलाइन)",
    shareGps: "WhatsApp वर GPS शेअर करा",
    soundSiren: "सायरन वाजवा",
    stopSiren: "सायरन बंद करा",
    emergencyControls: "आपत्कालीन नियंत्रण",
    transcriptTitle: "चॅट तपशील आणि मेसेज रिडर",
  },
  urdu: {
    assistantName: "SafeHer AI",
    activeStatus: "متحرک",
    oldChats: "چیٹس",
    newChat: "نئی گفتگو",
    settings: "سیٹنگز",
    heroGreeting: "ہیلو، میں",
    quickQuestionsTitle: "فوری ہنگامی سوالات",
    seeMore: "مزید دیکھیں",
    showLess: "کم دیکھیں",
    inputPlaceholder: "کسی بھی زبان میں لکھیں یا بولیں...",
    thinking: "SafeHer سوچ رہی ہے...",
    listening: "سن رہی ہوں... اب بولیں",
    tapToSpeak: "بولنے کے لیے ٹیپ کریں",
    savedConversations: "Chats",
    backToChat: "چیٹ پر واپس جائیں",
    clearAll: "سب صاف کریں",
    tapToRead: "Read & Continue",
    holdToDelete: "حذف کرنے کے لیے دبا کر رکھیں",
    deleteConversation: "گفتگو حذف کریں",
    deleteMessage: "پیغام حذف کریں",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "گفتگو حذف کریں؟",
    confirmDeleteDesc: "کیا آپ واقعی یہ چیٹ ریکارڈ حذف کرنا چاہتے ہیں؟",
    cancel: "منسوخ کریں",
    activeBadge: "متحرک",
    policeSos: "112 ڈائل (پولیس)",
    womenHelpline: "1090 ڈائل (خواتین)",
    shareGps: "WhatsApp پر GPS شیئر کریں",
    soundSiren: "سائرن بجائیں",
    stopSiren: "سائرن بند کریں",
    emergencyControls: "ہنگامی کنٹرولز",
    transcriptTitle: "چیٹ ریکارڈ اور ریڈر",
  },
  auto: {
    assistantName: "SafeHer AI",
    activeStatus: "Active",
    oldChats: "Chats",
    newChat: "New Chat",
    settings: "Settings",
    heroGreeting: "Hi, I'm",
    quickQuestionsTitle: "Quick Questions",
    seeMore: "See More",
    showLess: "Show Less",
    inputPlaceholder: "Type or speak in any language...",
    thinking: "SafeHer soch rahi hai...",
    listening: "Listening... speak now",
    tapToSpeak: "Tap to speak",
    savedConversations: "Chats",
    backToChat: "Back to Chat",
    clearAll: "Clear All",
    tapToRead: "Read & Continue",
    holdToDelete: "Hold press to delete",
    deleteConversation: "Delete Conversation",
    deleteMessage: "Delete Message",
    continueChat: "Read & Continue",
    confirmDeleteTitle: "Delete Conversation?",
    confirmDeleteDesc: "Are you sure you want to delete this conversation?",
    cancel: "Cancel",
    activeBadge: "ACTIVE",
    policeSos: "Call 112 (Police)",
    womenHelpline: "Call 1090 (Women)",
    shareGps: "Share GPS on WA",
    soundSiren: "Sound Siren",
    stopSiren: "Stop Siren",
    emergencyControls: "Emergency Quick Action Controls",
    transcriptTitle: "Chat Transcript & Reader",
  },
};

const MULTILINGUAL_QUESTIONS: Record<SupportedLang, QuickQuestionItem[]> = {
  bengali: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "আমার খুব ভয় করছে",
      prompt: "আমার হঠাৎ খুব ভয় করছে, আমি এখন কি করব?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "কেউ পিছু নিলে কি করব?",
      prompt: "কেউ আমার পিছু নিচ্ছে, অবিলম্বে নিরাপদ হব কিভাবে?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "জরুরি সাহায্য দরকার",
      prompt: "জরুরি সাহায্য দরকার, অবিলম্বে কি করতে হবে বলুন!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "সুরক্ষা টিপস দিন",
      prompt: "আমাকে বাস্তবসম্মত নারী সুরক্ষা টিপস ও সতর্কতা বলুন।",
    },
    {
      id: "safe",
      icon: "👥",
      bgColor: "bg-pink-50 text-pink-600 border-pink-100",
      label: "নিরাপদ কিভাবে থাকব?",
      prompt: "একা বা রাতে যাতায়াত করার সময় নিরাপদ কিভাবে থাকব?",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "জরুরি হেল্পলাইন নম্বর",
      prompt: "জাতীয় জরুরি হেল্পলাইন নম্বরগুলি বলুন (১১২, ১০৯০, ১৮১)।",
    },
    {
      id: "route",
      icon: "📍",
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
      label: "নিরাপদ পথ বলুন",
      prompt: "বাড়ি ফেরার সবচেয়ে নিরাপদ রাস্তা কিভাবে নির্বাচন করব?",
    },
    {
      id: "cab",
      icon: "🚗",
      bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
      label: "ক্যাব ভুল পথে গেলে",
      prompt: "ক্যাব চালক ভুল পথে গাড়ি চালাচ্ছে, আমি এখনই কি পদক্ষেপ নেব?",
    },
    {
      id: "fir",
      icon: "⚖️",
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
      label: "জিরো এফআইআর কি?",
      prompt: "জিরো এফআইআর কি এবং থানায় আমার কি আইনি অধিকার আছে?",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "অদিতি রাও (নির্মাতা)",
      prompt: "SafeHer নির্মাতা ও সফটওয়্যার ইঞ্জিনিয়ার অদিতি রাও সম্পর্কে বলুন।",
    },
    {
      id: "aditi_thought",
      icon: "💭",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "অদিতি রাওয়ের বার্তা",
      prompt: "অদिति রাওয়ের মূল দর্শন ও নারী সুরক্ষার ভাবনা কি?",
    },
  ],
  hindi: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "मुझे डर लग रहा है",
      prompt: "मुझे अचानक बहुत डर लग रहा है, मैं अभी क्या करूँ?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "कोई पीछा करे तो क्या करूँ?",
      prompt: "कोई मेरा पीछा कर रहा है, तुरंत सुरक्षित कैसे होऊं?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "इमरजेंसी मदद चाहिए",
      prompt: "इमरजेंसी मदद चाहिए, तुरंत बताइए क्या करना है!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "सुरक्षा टिप्स दीजिए",
      prompt: "मुझे व्यावहारिक महिला सुरक्षा टिप्स और सावधानियां बताइए।",
    },
    {
      id: "safe",
      icon: "👥",
      bgColor: "bg-pink-50 text-pink-600 border-pink-100",
      label: "सुरक्षित कैसे रहूँ?",
      prompt: "अकेले या रात को यात्रा करते समय सुरक्षित कैसे रहूँ?",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "इमरजेंसी नंबर बताएं",
      prompt: "आपातकालीन हेल्पलाइन नंबर बताइए (112, 1090, 181, 108)।",
    },
    {
      id: "route",
      icon: "📍",
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
      label: "सुरक्षित रास्ता बताओ",
      prompt: "मुझे सुरक्षित रास्ता बताइए घर जाने के लिए।",
    },
    {
      id: "cab",
      icon: "🚗",
      bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
      label: "कैब गलत रास्ते पर",
      prompt: "कैब ड्राइवर ने गलत रास्ता ले लिया है, तुरंत क्या करूँ?",
    },
    {
      id: "fir",
      icon: "⚖️",
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
      label: "ज़ीरो FIR क्या है?",
      prompt: "ज़ीरो एफआईआर क्या है और पुलिस के अधिकार क्या हैं?",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "अदिति राव (संस्थापक)",
      prompt: "SafeHer की निर्माता व सॉफ्टवेयर इंजीनियर अदिति राव के बारे में बताएं।",
    },
    {
      id: "aditi_thought",
      icon: "💭",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "अदिति राव का विचार",
      prompt: "अदिति राव का प्रेरक विचार और विज़न क्या है?",
    },
  ],
  english: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "I am feeling scared",
      prompt: "I am suddenly feeling scared, what should I do right now?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "Someone is following me",
      prompt: "Someone is following me, how can I get to safety immediately?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "Need emergency help",
      prompt: "I need immediate emergency help, tell me what to do right now!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "Safety tips",
      prompt: "Give me practical women safety tips and precautions.",
    },
    {
      id: "safe",
      icon: "👥",
      bgColor: "bg-pink-50 text-pink-600 border-pink-100",
      label: "How to stay safe?",
      prompt: "How can I stay safe while traveling alone or at night?",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "Emergency numbers",
      prompt: "Tell me national emergency helpline numbers (112, 1090, 181).",
    },
    {
      id: "route",
      icon: "📍",
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
      label: "Safe route guide",
      prompt: "Tell me how to find the safest route home.",
    },
    {
      id: "cab",
      icon: "🚗",
      bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
      label: "Cab on wrong route",
      prompt: "Cab driver took the wrong route, what should I do right now?",
    },
    {
      id: "fir",
      icon: "⚖️",
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
      label: "What is Zero FIR?",
      prompt: "What is Zero FIR and what are my legal rights?",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "Aditi Rao (Creator)",
      prompt: "Tell me about Aditi Rao, the software engineer and founder of SafeHer.",
    },
    {
      id: "aditi_thought",
      icon: "💭",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "Aditi Rao's Vision",
      prompt: "What is Aditi Rao's signature quote and vision for women safety?",
    },
  ],
  hinglish: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "Mujhe darr lag raha hai",
      prompt: "Mujhe achanak bohot darr lag raha hai, main abhi kya karu?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "Kya karu agar koi follow kare?",
      prompt: "Koi mera peecha kar raha hai, turant safe kaise ho jaau?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "Emergency help chahiye",
      prompt: "Emergency help chahiye, turant batayein kya karna hai!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "Safety tips dedo",
      prompt: "Mujhe practical women safety tips aur precautions bataiye.",
    },
    {
      id: "safe",
      icon: "👥",
      bgColor: "bg-pink-50 text-pink-600 border-pink-100",
      label: "Main safe kaise rahu?",
      prompt: "Akele ya raat ko travel karte waqt main safe kaise rahu?",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "Emergency helpline numbers",
      prompt: "Emergency helpline numbers batao (112, 1090, 181, 108).",
    },
    {
      id: "route",
      icon: "📍",
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
      label: "Safe route batao",
      prompt: "Mujhe safe route batao ghar jane ke liye.",
    },
    {
      id: "cab",
      icon: "🚗",
      bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
      label: "Cab driver galat raste par",
      prompt: "Cab driver ne galat rasta le liya hai, main turant kya karu?",
    },
    {
      id: "fir",
      icon: "⚖️",
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
      label: "Zero FIR kya hai?",
      prompt: "Zero FIR kya hai aur police mana kare to kya adhikar hai?",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "Aditi Rao (Creator)",
      prompt: "Aditi Rao (Developer & Role Model) ke baare me batayein",
    },
    {
      id: "aditi_thought",
      icon: "💭",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "Aditi Rao ka Thought",
      prompt: "Aditi Rao ka signature thought aur vision kya hai?",
    },
  ],
  punjabi: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "ਮੈਨੂੰ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ",
      prompt: "ਮੈਨੂੰ ਅਚਾਨਕ ਬਹੁਤ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ, ਮੈਂ ਹੁਣ ਕੀ ਕਰਾਂ?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "ਜੇ ਕੋਈ ਪਿੱਛਾ ਕਰੇ ਤਾਂ ਕੀ ਕਰਾਂ?",
      prompt: "ਕੋਈ ਮੇਰਾ ਪਿੱਛਾ ਕਰ ਰਿਹਾ ਹੈ, ਤੁਰੰਤ ਸੁਰੱਖਿਅਤ ਕਿਵੇਂ ਹੋਵਾਂ?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "ਐਮਰਜੈਂਸੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
      prompt: "ਮੈਨੂੰ ਐਮਰਜੈਂਸੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ, ਤੁਰੰਤ ਦੱਸੋ ਕੀ ਕਰਨਾ ਹੈ!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "ਸੁਰੱਖਿਆ ਸੁਝਾਅ ਦਿਓ",
      prompt: "ਮੈਨੂੰ ਮਹਿਲਾ ਸੁਰੱਖਿਆ ਸੁਝਾਅ ਅਤੇ ਸਾਵਧਾਨੀਆਂ ਦੱਸੋ।",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "ਐਮਰਜੈਂਸੀ ਨੰਬਰ ਦੱਸੋ",
      prompt: "ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ ਨੰਬਰ ਦੱਸੋ (112, 1090, 181)।",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "ਅਦਿਤੀ ਰਾਓ (ਸੰਸਥਾਪਕ)",
      prompt: "SafeHer ਦੀ ਸੰਸਥਾਪਕ ਅਦਿਤੀ ਰਾਓ ਬਾਰੇ ਦੱਸੋ।",
    },
  ],
  marathi: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "मला भीती वाटत आहे",
      prompt: "मला अचानक खूप भीती वाटत आहे, मी आता काय करू?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "कोणी पाठलाग केल्यास काय करू?",
      prompt: "कोणीतरी माझा पाठलाग करत आहे, लगेच सुरक्षित कसे होऊ?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "आपत्कालीन मदत हवी आहे",
      prompt: "मला आपत्कालीन मदत हवी आहे, लगेच काय करावे ते सांगा!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "सुरक्षा टिप्स द्या",
      prompt: "मला महिला सुरक्षा टिपा आणि खबरदारी सांगा.",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "आपत्कालीन क्रमांक सांगा",
      prompt: "आपत्कालीन हेल्पलाइन क्रमांक सांगा (112, 1090, 181).",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "अदिती राव (संस्थापक)",
      prompt: "SafeHer च्या निर्मात्या अदिती राव यांच्याबद्दल माहिती सांगा.",
    },
  ],
  urdu: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "مجھے خوف محسوس ہو رہا ہے",
      prompt: "مجھے اچانک بہت خوف محسوس ہو رہا ہے، میں ابھی کیا کروں؟",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "کوئی پیچھا کرے تو کیا کروں؟",
      prompt: "کوئی میرا پیچھا کر رہا ہے، فوراً محفوظ کیسے ہوں؟",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "ہنگامی مدد درکار ہے",
      prompt: "مجھے ہنگامی مدد درکار ہے، فوراً بتائیں کیا کروں!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "حفاظتی تجاویز دیں",
      prompt: "مجھے خواتین کی حفاظت اور احتیاطی تدابیر بتائیں۔",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "ہنگامی نمبر بتائیں",
      prompt: "ہنگامی ہیلپ لائن نمبر بتائیں (112, 1090, 181)۔",
    },
  ],
  auto: [
    {
      id: "scared",
      icon: "🛡️",
      bgColor: "bg-red-50 text-red-500 border-red-100",
      label: "Mujhe darr lag raha hai",
      prompt: "Mujhe achanak bohot darr lag raha hai, main abhi kya karu?",
    },
    {
      id: "follow",
      icon: "🏃",
      bgColor: "bg-rose-50 text-rose-500 border-rose-100",
      label: "Kya karu agar koi follow kare?",
      prompt: "Koi mera peecha kar raha hai, turant safe kaise ho jaau?",
    },
    {
      id: "emergency",
      icon: "📞",
      bgColor: "bg-red-50 text-red-600 border-red-100",
      label: "Emergency help chahiye",
      prompt: "Emergency help chahiye, turant batayein kya karna hai!",
    },
    {
      id: "tips",
      icon: "💡",
      bgColor: "bg-amber-50 text-amber-500 border-amber-100",
      label: "Safety tips",
      prompt: "Mujhe practical women safety tips aur precautions bataiye.",
    },
    {
      id: "numbers",
      icon: "❗",
      bgColor: "bg-rose-50 text-rose-600 border-rose-100",
      label: "Emergency helpline numbers",
      prompt: "Emergency helpline numbers batao (112, 1090, 181, 108).",
    },
    {
      id: "aditi",
      icon: "🌟",
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      label: "Aditi Rao (Creator)",
      prompt: "Aditi Rao (Developer & Role Model) ke baare me batayein",
    },
  ],
};

// Cute 3D Pink Robot Avatar Component
const SafeHerRobotAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 96, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <defs>
      <linearGradient id="robotWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="robotPink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B8B" />
        <stop offset="100%" stopColor="#FF2D55" />
      </linearGradient>
      <linearGradient id="screenVisor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0B132B" />
        <stop offset="100%" stopColor="#1C2541" />
      </linearGradient>
      <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF2D55" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Headphone band */}
    <path d="M26 54C26 34 40 20 60 20C80 20 94 34 94 54" stroke="url(#robotPink)" strokeWidth="6" strokeLinecap="round" />

    {/* Left Ear Cushion */}
    <rect x="20" y="44" width="8" height="20" rx="4" fill="url(#robotPink)" />
    {/* Right Ear Cushion */}
    <rect x="92" y="44" width="8" height="20" rx="4" fill="url(#robotPink)" />

    {/* Top Antenna */}
    <path d="M60 20V12" stroke="url(#robotPink)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="10" r="4.5" fill="#FF2D55" />
    <circle cx="60" cy="10" r="2" fill="#FFFFFF" />

    {/* Robot Head */}
    <rect
      x="28"
      y="32"
      width="64"
      height="50"
      rx="20"
      fill="url(#robotWhite)"
      filter="url(#shadowFilter)"
      stroke="#F8FAFC"
      strokeWidth="1.5"
    />

    {/* Visor Screen */}
    <rect x="36" y="41" width="48" height="31" rx="12" fill="url(#screenVisor)" />

    {/* Left Eye */}
    <ellipse cx="48" cy="54" rx="4.5" ry="6" fill="#00E5FF" />
    <circle cx="46.5" cy="51.5" r="2" fill="#FFFFFF" />
    <circle cx="50" cy="57" r="1" fill="#FFFFFF" />

    {/* Right Eye */}
    <ellipse cx="72" cy="54" rx="4.5" ry="6" fill="#00E5FF" />
    <circle cx="70.5" cy="51.5" r="2" fill="#FFFFFF" />
    <circle cx="74" cy="57" r="1" fill="#FFFFFF" />

    {/* Friendly Smile */}
    <path d="M56 63C57.5 65.5 62.5 65.5 64 63" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />

    {/* Blush Cheeks */}
    <ellipse cx="42" cy="63" rx="3.2" ry="1.8" fill="#FF4081" fillOpacity="0.75" />
    <ellipse cx="78" cy="63" rx="3.2" ry="1.8" fill="#FF4081" fillOpacity="0.75" />

    {/* Body */}
    <path
      d="M42 82C42 82 46 80 60 80C74 80 78 82 78 82L82 102C82 104 80 106 78 106H42C40 106 38 104 38 102L42 82Z"
      fill="url(#robotWhite)"
      stroke="#E2E8F0"
      strokeWidth="1"
    />

    {/* Heart on chest */}
    <path
      d="M60 97C60 97 54 93.5 54 89.5C54 87.5 55.5 86 57.5 86C58.8 86 59.8 86.8 60 87.5C60.2 86.8 61.2 86 62.5 86C64.5 86 66 87.5 66 89.5C66 93.5 60 97 60 97Z"
      fill="url(#robotPink)"
    />

    {/* Waving hand */}
    <circle cx="95" cy="80" r="6" fill="url(#robotWhite)" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M93 76L97 74" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />
    <path d="M97 77L101 76" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />

    {/* Left arm */}
    <circle cx="25" cy="88" r="6" fill="url(#robotWhite)" stroke="#E2E8F0" strokeWidth="1" />
  </svg>
);

export const AssistantTab: React.FC<AssistantTabProps> = ({ location, onBack }) => {
  // Saved chat sessions state (multi-conversation history)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("safeher_assistant_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migrate older single chat history if available
      const legacyChat = localStorage.getItem("safeher_assistant_chat_history");
      if (legacyChat) {
        const parsedLegacy = JSON.parse(legacyChat);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          const firstUserMsg = parsedLegacy.find((m) => m.sender === "user");
          const title = firstUserMsg ? (firstUserMsg.text.length > 32 ? firstUserMsg.text.slice(0, 32) + "..." : firstUserMsg.text) : "Saved Chat";
          const migrated: ChatSession = {
            id: "session_migrated_" + Date.now(),
            title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            dateLabel: formatSessionTime(Date.now()),
            messages: parsedLegacy,
          };
          return [migrated];
        }
      }
    } catch (e) {
      console.warn("Failed to load saved chat sessions:", e);
    }
    return [makeNewSession("Welcome Conversation")];
  });

  // Active Session ID
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || "session_default";
  });

  // Active messages state
  const [messages, setMessages] = useState<Message[]>(() => {
    return sessions[0]?.messages || [
      {
        id: "m_welcome",
        sender: "assistant",
        text: DEFAULT_WELCOME_TEXT,
        timestamp: "5:19 PM",
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedLang, setSelectedLang] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem("safeher_assistant_selected_lang");
      if (
        saved &&
        ["auto", "english", "hindi", "hinglish", "punjabi", "bengali", "marathi", "urdu"].includes(saved)
      ) {
        return saved as SupportedLang;
      }
    } catch (e) {}
    return "hindi";
  });

  // Persist selectedLang to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("safeher_assistant_selected_lang", selectedLang);
    } catch (e) {}
  }, [selectedLang]);
  const [speechSpeed, setSpeechSpeed] = useState<1.0 | 1.2>(1.0);
  const [lengthPreference, setLengthPreference] = useState<"short" | "medium" | "detailed">("short");
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [micStatus, setMicStatus] = useState<string | null>(null);

  // Full-Page Views: Settings Page, Old Chats Page & Feature Subpages
  const [isSettingsPageOpen, setIsSettingsPageOpen] = useState(false);
  const [isOldChatsPageOpen, setIsOldChatsPageOpen] = useState(false);
  const [activeSettingsSubpage, setActiveSettingsSubpage] = useState<
    null | "language" | "voice" | "response" | "notifications" | "emergency" | "contacts" | "appearance" | "fontSize" | "privacy"
  >(null);
  const [cameFromSettings, setCameFromSettings] = useState(false);

  // Hold-Press Delete Conversation Modal State
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const holdPressTimerRef = useRef<any>(null);
  const isHoldTriggeredRef = useRef(false);

  // Mobile Keyboard & Viewport Tracking
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const updateViewport = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };
    updateViewport();
    window.visualViewport.addEventListener("resize", updateViewport);
    window.visualViewport.addEventListener("scroll", updateViewport);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
    };
  }, []);

  // Modals for each setting
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showResponseStyleModal, setShowResponseStyleModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showEmergencySettingsModal, setShowEmergencySettingsModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);

  // Font size preference state (Small / Medium / Large)
  const [fontSizePref, setFontSizePref] = useState<"Small" | "Medium" | "Large">(() => {
    try {
      const saved = localStorage.getItem("safeher_assistant_font_size");
      if (saved === "Small" || saved === "Medium" || saved === "Large") return saved;
    } catch (e) {}
    return "Medium";
  });

  // Only 2 quick questions initially, more on "See More"
  const [showMoreQuickQuestions, setShowMoreQuickQuestions] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);

  // Contacts state initialized with default trusted people if empty
  const [savedContacts, setSavedContacts] = useState<EmergencyContact[]>(() => getSavedContacts());

  // Inline form to add contact in settings
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("Family");

  // Notification toggles & toast
  const [notifySOS, setNotifySOS] = useState(true);
  const [notifyDeviation, setNotifyDeviation] = useState(true);
  const [notifyCheckIn, setNotifyCheckIn] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Persist messages to active session and localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("safeher_assistant_chat_history", JSON.stringify(messages));

      setSessions((prevSessions) => {
        const curIndex = prevSessions.findIndex((s) => s.id === activeSessionId);
        const firstUser = messages.find((m) => m.sender === "user");
        const autoTitle = firstUser
          ? firstUser.text.length > 34
            ? firstUser.text.slice(0, 34) + "..."
            : firstUser.text
          : "Safety Conversation";

        let updated: ChatSession[];
        if (curIndex >= 0) {
          const existing = prevSessions[curIndex];
          const newTitle = existing.title === "New Conversation" || existing.title === "Welcome Conversation" || !existing.title ? autoTitle : existing.title;
          const updatedSession: ChatSession = {
            ...existing,
            title: newTitle,
            messages,
            updatedAt: Date.now(),
            dateLabel: formatSessionTime(Date.now()),
          };
          updated = [...prevSessions];
          updated[curIndex] = updatedSession;
        } else {
          const freshSession: ChatSession = {
            id: activeSessionId,
            title: autoTitle,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            dateLabel: formatSessionTime(Date.now()),
            messages,
          };
          updated = [freshSession, ...prevSessions];
        }

        try {
          localStorage.setItem("safeher_assistant_sessions", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (e) {
      console.warn("Could not save chat history to localStorage:", e);
    }
  }, [messages, activeSessionId]);

  // Persist fontSizePref to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("safeher_assistant_font_size", fontSizePref);
    } catch (e) {}
  }, [fontSizePref]);

  // Dynamic font size classes for chat
  const chatBubbleTextClass = useMemo(() => {
    switch (fontSizePref) {
      case "Small":
        return "text-xs";
      case "Large":
        return "text-base font-medium";
      case "Medium":
      default:
        return "text-sm";
    }
  }, [fontSizePref]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (e) {
        console.warn("Could not retrieve speech voices:", e);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.onvoiceschanged = null;
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, []);

  // Fast & Enhanced Text-To-Speech Function
  const speakMessage = (messageId: string, textToSpeak: string) => {
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();

      if (speakingMessageId === messageId) {
        setSpeakingMessageId(null);
        return;
      }

      // Thorough cleaning of markdown, asterisks, bullet points, emojis for fast natural speech
      const cleanText = textToSpeak
        .replace(/\*\*(.*?)\*\*/g, "$1") // bold
        .replace(/\*(.*?)\*/g, "$1") // italic
        .replace(/^[•\s*\-–—]+\s*/gm, "") // bullet points
        .replace(/[*#_`>~]/g, "") // markdown symbols
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
        .replace(/https?:\/\/\S+/g, "") // URLs
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // emojis
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Fast, responsive, snappy speech rate (1.1x standard, 1.25x fast)
      utterance.rate = speechSpeed === 1.2 ? 1.25 : 1.1;
      utterance.pitch = 1.02;

      const isHindiScript = /[\u0900-\u097F]/.test(cleanText);
      const isBengaliScript = /[\u0980-\u09FF]/.test(cleanText);
      const isPunjabiScript = /[\u0A00-\u0A7F]/.test(cleanText);
      const isUrduScript = /[\u0600-\u06FF]/.test(cleanText);

      let targetLang = "hi-IN";
      if (isBengaliScript || selectedLang === "bengali") targetLang = "bn-IN";
      else if (isHindiScript || selectedLang === "hindi") targetLang = "hi-IN";
      else if (isPunjabiScript || selectedLang === "punjabi") targetLang = "pa-IN";
      else if (isUrduScript || selectedLang === "urdu") targetLang = "ur-IN";
      else if (selectedLang === "marathi") targetLang = "mr-IN";
      else if (selectedLang === "english") targetLang = "en-IN";
      else targetLang = "hi-IN";

      utterance.lang = targetLang;

      if (availableVoices.length > 0) {
        let matchedVoice: SpeechSynthesisVoice | undefined;
        if (targetLang === "bn-IN") {
          matchedVoice =
            availableVoices.find((v) => v.lang.startsWith("bn") || v.name.toLowerCase().includes("bangla") || v.name.toLowerCase().includes("bengali")) ||
            availableVoices.find((v) => v.lang.includes("IN"));
        } else if (targetLang === "hi-IN") {
          matchedVoice =
            availableVoices.find((v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")) ||
            availableVoices.find((v) => v.lang.includes("IN"));
        } else if (targetLang === "pa-IN") {
          matchedVoice =
            availableVoices.find((v) => v.lang.startsWith("pa") || v.name.toLowerCase().includes("punjabi")) ||
            availableVoices.find((v) => v.lang.includes("IN"));
        } else if (targetLang === "ur-IN") {
          matchedVoice =
            availableVoices.find((v) => v.lang.startsWith("ur") || v.name.toLowerCase().includes("urdu")) ||
            availableVoices.find((v) => v.lang.includes("IN"));
        }

        if (!matchedVoice) {
          matchedVoice =
            availableVoices.find((v) => v.lang === targetLang) ||
            availableVoices.find((v) => v.lang.startsWith(targetLang.split("-")[0])) ||
            availableVoices.find((v) => v.lang.includes("IN") || v.lang.includes("en-US"));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => setSpeakingMessageId(messageId);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Error:", e);
      setSpeakingMessageId(null);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setSpeakingMessageId(null);
  };

  // Immediate situational emergency answer fallback with Bengali & Hindi support
  const getImmediateClientFallback = (query: string, lang: string): string => {
    const isBn = lang === "bn-IN" || lang === "bengali" || /[\u0980-\u09FF]/.test(query);
    const isHi = lang === "hi-IN" || lang === "hindi" || /[\u0900-\u097F]/.test(query);
    const lower = query.toLowerCase();

    if (
      lower.includes("thought") ||
      lower.includes("vichar") ||
      lower.includes("quote") ||
      lower.includes("philosophy") ||
      lower.includes("ভাবনা") ||
      lower.includes("দর্শন")
    ) {
      if (isBn) {
        return "💡 **অদিতি রাওয়ের মূল ভাবনা ও দর্শন (Signature Vision)**:\n\n> *\"প্রযুক্তির উদ্দেশ্য কেবল জীবন সহজ করা নয়, জীবনকে আরও নিরাপদ এবং ভয়মুক্ত করে তোলাও হওয়া উচিত।\"*\n> *(English: \"Technology should not only make our lives easier, it should make our lives safer.\")*\n\nএই অনুপ্রেরণাই SafeHer-এর প্রতিটি জীবন রক্ষাকারী সুরক্ষা ফিচারের ভিত্তি।";
      }
      return isHi
        ? "💡 **अदिति राव का सिग्नेचर विचार (Thought & Vision)**:\n\n> *\"तकनीक का उद्देश्य केवल हमारे जीवन को आसान बनाना ही नहीं, बल्कि हमारे जीवन को अधिक सुरक्षित और भयमुक्त बनाना भी होना चाहिए।\"*\n> *(English: \"Technology should not only make our lives easier, it should make our lives safer.\")*\n\nयही प्रेरणा SafeHer के प्रत्येक सुरक्षा फीचर और आपातकालीन सिस्टम की नींव है।"
        : "💡 **Aditi Rao's Signature Thought & Vision**:\n\n> *\"Technology should not only make our lives easier, it should make our lives safer.\"*\n\nThis core philosophy guides every safety feature and life-saving innovation in SafeHer.";
    }

    if (
      lower.includes("develop") ||
      lower.includes("creator") ||
      lower.includes("banaya") ||
      lower.includes("aditi") ||
      lower.includes("নির্মাতা") ||
      lower.includes("তৈরি")
    ) {
      if (isBn) {
        return "🌟 **অদিতি রাও — SafeHer এর প্রতিষ্ঠাতা ও সফটওয়্যার ইঞ্জিনিয়ার**:\n\nSafeHer প্ল্যাটফর্মটি **অদিতি রাও** (লখনউ, উত্তর প্রদেশ) নারী ও তরুণীদের সুরক্ষার জন্য তৈরি করেছেন। তিনি দেশের তরুণ প্রজন্মের জন্য এক উজ্জ্বল রোল মডেল। 🇮🇳✨";
      }
      return isHi
        ? "🌟 **अदिति राव — SafeHer की संस्थापक, सॉफ्टवेयर इंजीनियर एवं यूथ रोल मॉडल**:\n\nSafeHer को **अदिति राव** (लखनऊ, उत्तर प्रदेश) ने महिलाओं और बालिकाओं की सुरक्षा के उद्देश्य से विकसित किया है।"
        : "🌟 **Aditi Rao — Founder, Lead Engineer of SafeHer & Youth Role Model**:\n\nSafeHer was engineered and developed by **Aditi Rao** (Lucknow, Uttar Pradesh, India) to protect women and students.";
    }

    if (lower.includes("zero fir") || lower.includes("fir") || lower.includes("এফআইআর")) {
      if (isBn) {
        return "⚖️ **জিরো এফআইআর আপনার আইনগত অধিকার**:\nঅপরাধ যেখানেই ঘটুক না কেন, আপনি যেকোনো নিকটস্থ থানায় সাথে সাথে জিরো এফআইআর দায়ের করতে পারেন (BNSS ধারা ১৭৩ / CrPC ১৫৪)। পুলিশ অস্বীকার করতে পারে না।";
      }
      return isHi
        ? "⚖️ **Zero FIR आपका कानूनी अधिकार है**:\nघटना चाहे कहीं भी हुई हो, आप किसी भी नजदीकी थाने में Zero FIR दर्ज करा सकती हैं (BNSS धारा 173)। पुलिस क्षेत्राधिकार का बहाना बनाकर मना नहीं कर सकती।"
        : "⚖️ **Zero FIR is Your Legal Right**:\nUnder BNSS Section 173 / CrPC 154, you can register an FIR at ANY police station irrespective of where the crime occurred.";
    }

    if (lower.includes("cab") || lower.includes("driver") || lower.includes("route") || lower.includes("ক্যাব")) {
      if (isBn) {
        return "🚨 **ক্যাব ভুল পথে গেলে (অবিলম্বে ৩টি পদক্ষেপ)**:\n১. SafeHer থেকে WhatsApp-এ লাইভ GPS লোকেশন শেয়ার করুন।\n২. ড্রাইভারকে জোরে বলুন: 'মূল রাস্তায় চলুন, ১১২ ডায়াল হচ্ছে।'\n৩. দরজা খুলে প্রস্তুত থাকুন এবং সরাসরি ১১২ ডায়াল করুন।";
      }
      return isHi
        ? "🚨 **कैब गलत रास्ते पर (तुरंत 3 कदम)**:\n1. SafeHer 'Live Location' से WhatsApp पर लोकेशन भेजें।\n2. ड्राइवर को ज़ोर से बोलें: 'मेन रोड पर गाड़ी रोकिए, 112 डायल हो रहा है।'\n3. दरवाज़ा अंदर से खोलें और तुरंत 112 मिलाएं।"
        : "🚨 **Cab Emergency (3 Quick Steps)**:\n1. Share SafeHer Live GPS on WhatsApp with family.\n2. Loudly command driver: 'Keep on main highway, pull over at nearest shop.'\n3. Dial 112 immediately.";
    }

    if (lower.includes("piche") || lower.includes("stalk") || lower.includes("follow") || lower.includes("darr") || lower.includes("ভয়") || lower.includes("পিছু")) {
      if (isBn) {
        return "⚠️ **কেউ পিছু নিলে বা ভয় পেলে অবিলম্বে**:\n১. রাস্তা পার হয়ে আলোযুক্ত দোকান, ফার্মেসি বা এটিএম-এ প্রবেশ করুন।\n২. SafeHer ফেক কল চালু করে কানে লাগিয়ে জোরে কথা বলুন।\n৩. সরাসরি ১১২ বা ১০৯০ নম্বরে কল করুন।";
      }
      return isHi
        ? "⚠️ **पीछा किए जाने या डर लगने पर तुरंत**:\n1. सड़क पार करें और किसी खुली दुकान या गार्ड वाले ATM में घुसें।\n2. SafeHer Fake Call चालू करके कान पर लगाएं।\n3. 112 / 1090 पर कॉल करें।"
        : "⚠️ **Being Followed / Stalked (Immediate Steps)**:\n1. Cross the road to a well-lit shop, chemist, or guarded ATM.\n2. Trigger SafeHer Fake Call and speak loudly.\n3. Call 112 / 1090 immediately.";
    }

    if (isBn) {
      return "আমি আপনার সুরক্ষার জন্য পাশে আছি। যেকোনো বিপদে সরাসরি ১১২ ডায়াল করুন অথবা নিচের জরুরি বাটনগুলি ব্যবহার করুন।";
    }
    return isHi
      ? "मैं आपकी सुरक्षा के लिए तैयार हूँ। आपात स्थिति में तुरंत 112 मिलाएं या नीचे दिए गए इमरजेंसी टूल्स का उपयोग करें।"
      : "I am here to protect and assist you. In an immediate threat, please dial 112 or use the SOS button below.";
  };

  // Direct Voice/Text Command Handler: Executes real hardware/app actions on speech or text!
  const executeDirectActionIfCommand = (query: string): string | null => {
    const q = query.toLowerCase().trim();

    // 1. Police 112 Command
    if (
      q.includes("112") ||
      q.includes("police") ||
      q.includes("पुलिस") ||
      q.includes("পোलीस") ||
      q.includes("ਪੁਲਿਸ") ||
      q.includes("পুলিশ") ||
      q.includes("پولیس") ||
      q.includes("call police") ||
      q.includes("police call") ||
      q.includes("police bulao") ||
      q.includes("police ko phone")
    ) {
      window.location.href = "tel:112";
      if (selectedLang === "bengali") return "🚨 অবিলম্বে ১১২ (জাতীয় পুলিশ জরুরি) ডায়াল করা হচ্ছে...";
      if (selectedLang === "hindi") return "🚨 तुरंत 112 (राष्ट्रीय पुलिस आपातकालीन) डायल किया जा रहा है...";
      if (selectedLang === "marathi") return "🚨 ताबडतोब 112 (पोलीस आपत्कालीन सेवा) डायल केले जात आहे...";
      if (selectedLang === "punjabi") return "🚨 ਤੁਰੰਤ 112 (ਪੁਲਿਸ ਐਮਰਜੈਂਸੀ) ਡਾਇਲ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...";
      if (selectedLang === "urdu") return "🚨 فوری طور پر 112 (پولیس ایمرجنسی) ڈائل کیا جا رہا ہے...";
      if (selectedLang === "hinglish") return "🚨 Turant 112 Police Emergency helpline dial kiya ja raha hai...";
      return "🚨 Dialing National Emergency Police 112 now...";
    }

    // 2. Women Helpline 1090 Command
    if (
      q.includes("1090") ||
      q.includes("women helpline") ||
      q.includes("mahila helpline") ||
      q.includes("महिला हेल्पलाइन") ||
      q.includes("महिला सहायता") ||
      q.includes("নারী হেল্পলাইন") ||
      q.includes("181")
    ) {
      window.location.href = "tel:1090";
      if (selectedLang === "bengali") return "🛡️ অবিলম্বে ১০৯০ (নারী সুরক্ষা হেল্পলাইন) ডায়াল করা হচ্ছে...";
      if (selectedLang === "hindi") return "🛡️ तुरंत 1090 (महिला शक्ति हेल्पलाइन) डायल किया जा रहा है...";
      if (selectedLang === "marathi") return "🛡️ ताबडतोब 1090 (महिला हेल्पलाइन) डायल केले जात आहे...";
      if (selectedLang === "punjabi") return "🛡️ ਤੁਰੰਤ 1090 (ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ) ਡਾਇਲ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...";
      if (selectedLang === "urdu") return "🛡️ فوری طور پر 1090 (خواتین ہیلپ لائن) ڈائل کیا جا رہا ہے...";
      if (selectedLang === "hinglish") return "🛡️ Turant 1090 Women Helpline dial kiya ja raha hai...";
      return "🛡️ Dialing Women Power Helpline 1090 now...";
    }

    // 3. Ambulance 108 Command
    if (
      q.includes("108") ||
      q.includes("102") ||
      q.includes("ambulance") ||
      q.includes("hospital") ||
      q.includes("एंबुलेंस") ||
      q.includes("অ্যাম্বুলেন্স") ||
      q.includes("रुग्णवाहिका")
    ) {
      window.location.href = "tel:108";
      if (selectedLang === "bengali") return "🚑 অবিলম্বে ১০৮ (জরুরি অ্যাম্বুলেন্স সেবা) ডায়াল করা হচ্ছে...";
      if (selectedLang === "hindi") return "🚑 तुरंत 108 (आपातकालीन एम्बुलेंस) डायल किया जा रहा है...";
      return "🚑 Dialing Emergency Ambulance Helpline 108 now...";
    }

    // 4. Siren / Alarm Stop Command
    if (
      (q.includes("siren") || q.includes("alarm") || q.includes("सायरन") || q.includes("সাইরেন")) &&
      (q.includes("stop") || q.includes("band") || q.includes("off") || q.includes("बंद") || q.includes("বন্ধ") || q.includes("روکو"))
    ) {
      soundManager.stopSiren();
      setIsSirenActive(false);
      if (selectedLang === "bengali") return "🔊 সাইরেন বন্ধ করা হয়েছে।";
      if (selectedLang === "hindi") return "🔊 सायरन बंद कर दिया गया है।";
      if (selectedLang === "marathi") return "🔊 सायरन बंद करण्यात आला आहे.";
      if (selectedLang === "punjabi") return "🔊 ਸਾਇਰਨ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
      if (selectedLang === "urdu") return "🔊 سائرن بند کر دیا گیا ہے۔";
      return "🔊 Emergency siren has been stopped.";
    }

    // 5. Siren / Alarm Start Command
    if (
      q.includes("siren") ||
      q.includes("alarm") ||
      q.includes("सायरन") ||
      q.includes("সাইরেন") ||
      q.includes("अलार्म")
    ) {
      soundManager.startSiren();
      setIsSirenActive(true);
      if (selectedLang === "bengali") return "📢 সতর্কবার্তা: উচ্চ আওয়াজের জরুরি সাইরেন চালু করা হয়েছে!";
      if (selectedLang === "hindi") return "📢 चेतावनी: तेज़ आपातकालीन सायरन चालू कर दिया गया है!";
      if (selectedLang === "marathi") return "📢 इशारा: मोठ्या आवाजाचा आपत्कालीन सायरन सुरू केला आहे!";
      if (selectedLang === "punjabi") return "📢 ਚੇਤਾਵਨੀ: ਉੱਚੀ ਆਵਾਜ਼ ਵਾਲਾ ਐਮਰਜੈਂਸੀ ਸਾਇਰਨ ਚਾਲੂ ਹੋ ਗਿਆ ਹੈ!";
      if (selectedLang === "urdu") return "📢 انتباہ: ہنگامی سائرن شروع کر دیا گیا ہے!";
      if (selectedLang === "hinglish") return "📢 Alert: Tez emergency siren start kar diya gaya hai!";
      return "📢 EMERGENCY SIREN ACTIVATED! Loud alarm is sounding to deter threat.";
    }

    // 6. Fake Call Command
    if (
      q.includes("fake call") ||
      q.includes("fakecall") ||
      q.includes("nakli call") ||
      q.includes("नकली कॉल") ||
      q.includes("ফেক কল") ||
      q.includes("mock call")
    ) {
      soundManager.startRingtone();
      setTimeout(() => soundManager.stopRingtone(), 15000);
      if (selectedLang === "bengali") return "📞 ফেক ইনকামিং কল সক্রিয় করা হয়েছে, ফোন রিং হচ্ছে!";
      if (selectedLang === "hindi") return "📞 फेक इनकमिंग कॉल शुरू की गई है, आपका फोन रिंग हो रहा है!";
      return "📞 Fake Call incoming triggered! Your phone is now ringing.";
    }

    // 7. Share GPS Location Command
    if (
      q.includes("location") ||
      q.includes("gps") ||
      q.includes("लोकेशन") ||
      q.includes("লোকেশন") ||
      q.includes("live location") ||
      q.includes("स्थान") ||
      q.includes("share location") ||
      q.includes("location bhejo")
    ) {
      handleShareLocationWhatsApp();
      if (selectedLang === "bengali") return "📍 হোয়াটসঅ্যাপে লাইভ GPS লোকেশন শেয়ার করা হচ্ছে...";
      if (selectedLang === "hindi") return "📍 WhatsApp पर आपकी लाइव GPS लोकेशन शेयर की जा रही है...";
      if (selectedLang === "marathi") return "📍 WhatsApp वर आपले थेट GPS स्थान पाठवले जात आहे...";
      if (selectedLang === "punjabi") return "📍 WhatsApp ਤੇ ਤੁਹਾਡੀ ਲਾਈਵ GPS ਲੋਕੇਸ਼ਨ ਸ਼ੇਅਰ ਹੋ ਰਹੀ ਹੈ...";
      if (selectedLang === "urdu") return "📍 واٹس ایپ پر لائیو لوکیشن شیئر کی جا رہی ہے...";
      return "📍 Opening WhatsApp to share your live GPS location...";
    }

    // 8. Emergency SOS / Bachao Command
    if (
      q === "sos" ||
      q.includes("bachao") ||
      q.includes("save me") ||
      q.includes("help me") ||
      q.includes("मदद करो") ||
      q.includes("বাঁচাও") ||
      q.includes("alert contacts") ||
      q.includes("emergency help")
    ) {
      soundManager.startSiren();
      setIsSirenActive(true);
      handleShareLocationWhatsApp();
      if (selectedLang === "bengali") return "🚨 জরুরি SOS সক্রিয়! সাইরেন বাজছে এবং লাইভ GPS পাঠানো হচ্ছে!";
      if (selectedLang === "hindi") return "🚨 इमरजेंसी SOS सक्रिय! सायरन चालू है और लाइव GPS भेजा जा रहा है!";
      return "🚨 EMERGENCY SOS TRIGGERED! Siren sounding and live GPS opening.";
    }

    return null;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (speakingMessageId) stopSpeaking();

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Direct Voice & Text Action Execution
    const directActionReply = executeDirectActionIfCommand(query);
    if (directActionReply) {
      setTimeout(() => {
        const assistantMsg: Message = {
          id: "a_" + Date.now(),
          sender: "assistant",
          text: directActionReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isEmergency: true,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        if (autoSpeak) {
          speakMessage(assistantMsg.id, directActionReply);
        }
      }, 50);
      return;
    }

    const isUrgent =
      query.toLowerCase().includes("bachao") ||
      query.toLowerCase().includes("help") ||
      query.toLowerCase().includes("emergency") ||
      query.toLowerCase().includes("danger") ||
      query.toLowerCase().includes("stalk") ||
      query.toLowerCase().includes("follow") ||
      query.toLowerCase().includes("cab") ||
      query.toLowerCase().includes("darr") ||
      query.includes("ভয়") ||
      query.includes("বিপদ") ||
      query.includes("সাহায্য");

    try {
      const historyContext = messages.slice(-4).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          location,
          language: selectedLang,
          lengthPreference,
          history: historyContext,
        }),
      });

      if (!res.ok) {
        throw new Error("Server response error: " + res.status);
      }

      const data = await res.json();
      const replyText = data.reply || data.text || getImmediateClientFallback(query, selectedLang);

      const assistantMsg: Message = {
        id: "a_" + Date.now(),
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergency: isUrgent,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (autoSpeak) {
        // Fast instant audio response with zero lag
        setTimeout(() => {
          speakMessage(assistantMsg.id, replyText);
        }, 40);
      }
    } catch (err) {
      console.warn("API request failed, using instant client fallback:", err);
      const fallbackReply = getImmediateClientFallback(query, selectedLang);

      const assistantMsg: Message = {
        id: "a_" + Date.now(),
        sender: "assistant",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergency: isUrgent,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(assistantMsg.id, fallbackReply);
        }, 40);
      }
    } finally {
      setLoading(false);
    }
  };

  // Select and switch to an old chat session directly (Click to read & continue chat)
  const handleSelectSession = (sessionId: string) => {
    stopSpeaking();
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages);
      setIsOldChatsPageOpen(false);
      setIsSettingsPageOpen(false);
      setNotificationToast(`✓ Loaded chat: "${target.title}". You can continue chatting.`);
      setTimeout(() => setNotificationToast(null), 3000);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  // Start fresh new conversation
  const handleStartNewChat = () => {
    stopSpeaking();
    const newSession = makeNewSession("New Conversation");
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages(newSession.messages);
    try {
      localStorage.setItem("safeher_assistant_sessions", JSON.stringify([newSession, ...sessions]));
      localStorage.setItem("safeher_assistant_chat_history", JSON.stringify(newSession.messages));
    } catch (e) {}
    setIsOldChatsPageOpen(false);
    setIsSettingsPageOpen(false);
    setNotificationToast("✨ Started fresh conversation.");
    setTimeout(() => setNotificationToast(null), 2500);
  };

  // Delete a specific session
  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);
    let nextActive = remaining[0];
    if (!nextActive) {
      nextActive = makeNewSession("Welcome Conversation");
      remaining.push(nextActive);
    }
    setSessions(remaining);
    try {
      localStorage.setItem("safeher_assistant_sessions", JSON.stringify(remaining));
    } catch (e) {}

    if (activeSessionId === sessionId) {
      setActiveSessionId(nextActive.id);
      setMessages(nextActive.messages);
    }

    setShowDeleteSessionModal(false);
    setSessionToDelete(null);
    setNotificationToast("✓ Conversation deleted.");
    setTimeout(() => setNotificationToast(null), 2500);
  };

  // Clear all conversations
  const handleClearAllSessions = () => {
    stopSpeaking();
    const fresh = [makeNewSession("Welcome Conversation")];
    setSessions(fresh);
    setActiveSessionId(fresh[0].id);
    setMessages(fresh[0].messages);
    try {
      localStorage.setItem("safeher_assistant_sessions", JSON.stringify(fresh));
      localStorage.setItem("safeher_assistant_chat_history", JSON.stringify(fresh[0].messages));
    } catch (e) {}
    setShowClearConfirm(false);
    setShowDeleteSessionModal(false);
    setSessionToDelete(null);
    setNotificationToast("✓ All conversations cleared.");
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Hold-Press Handlers for Conversation Delete Option
  const handleSessionTouchStart = (session: ChatSession) => {
    isHoldTriggeredRef.current = false;
    if (holdPressTimerRef.current) clearTimeout(holdPressTimerRef.current);
    holdPressTimerRef.current = setTimeout(() => {
      isHoldTriggeredRef.current = true;
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(60);
        } catch (e) {}
      }
      setSessionToDelete(session);
      setShowDeleteSessionModal(true);
    }, 480);
  };

  const handleSessionTouchEnd = () => {
    if (holdPressTimerRef.current) {
      clearTimeout(holdPressTimerRef.current);
      holdPressTimerRef.current = null;
    }
  };

  // Legacy clear conversation (resets active session messages)
  const handleClearConversation = () => {
    handleClearAllSessions();
  };

  const handleShareLocationWhatsApp = () => {
    const lat = location.latitude ? location.latitude.toFixed(6) : "";
    const lng = location.longitude ? location.longitude.toFixed(6) : "";
    const mapUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : "";
    const text = encodeURIComponent(
      `🚨 EMERGENCY ALERT FROM SAFEHER:\nI need immediate help! My live location:\n${mapUrl || "Location acquiring..."}\nPlease track me and contact 112 if I don't respond.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleToggleSiren = () => {
    if (isSirenActive) {
      soundManager.stopSiren();
      setIsSirenActive(false);
    } else {
      soundManager.startSiren();
      setIsSirenActive(true);
    }
  };

  const getRecognitionLangCode = () => {
    switch (selectedLang) {
      case "english":
        return "en-IN";
      case "hindi":
      case "hinglish":
      case "auto":
        return "hi-IN";
      case "punjabi":
        return "pa-IN";
      case "bengali":
        return "bn-IN";
      case "marathi":
        return "mr-IN";
      case "urdu":
        return "ur-IN";
      default:
        return "hi-IN";
    }
  };

  const handleToggleVoiceInput = () => {
    stopSpeaking();

    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicStatus("Speech recognition is not supported in this browser. Please type your message.");
      setTimeout(() => setMicStatus(null), 4000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRec();
      recognition.lang = getRecognitionLangCode();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;
      let capturedText = "";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript("");
        setMicStatus(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const trimmed = transcript.trim();
        if (trimmed) {
          capturedText = trimmed;
          setSpeechTranscript(trimmed);
          setInput(trimmed);
        }
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);
        if (err.error === "aborted" || err.error === "no-speech") return;

        if (err.error === "not-allowed" || err.error === "service-not-allowed") {
          setMicStatus("Microphone access blocked. Please allow mic permission in your browser.");
          setTimeout(() => setMicStatus(null), 5000);
        } else if (err.error === "audio-capture") {
          setMicStatus("Microphone is busy. Please close other audio apps and retry.");
          setTimeout(() => setMicStatus(null), 5000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (capturedText && capturedText.trim().length > 1) {
          handleSend(capturedText.trim());
        }
      };

      recognition.start();
    } catch (e: any) {
      console.warn("Recognition start exception:", e);
      setIsListening(false);
    }
  };

  // Add Contact handler in Settings modal
  const handleAddNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: "cnt_" + Date.now(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || "Family",
      isPrimary: savedContacts.length === 0,
    };

    const updated = [...savedContacts, newContact];
    setSavedContacts(updated);
    saveContacts(updated);
    setNewContactName("");
    setNewContactPhone("");
    setNotificationToast(`✓ Added ${newContact.name} to trusted contacts.`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleDeleteContact = (id: string) => {
    const updated = savedContacts.filter((c) => c.id !== id);
    setSavedContacts(updated);
    saveContacts(updated);
    setNotificationToast("Contact removed.");
    setTimeout(() => setNotificationToast(null), 2500);
  };

  // Dedicated Transcript / Full Chat Viewer state
  const [viewingTranscriptSession, setViewingTranscriptSession] = useState<ChatSession | null>(null);

  // Dynamic Localized UI strings for chosen language
  const currentUI = useMemo(() => {
    return UI_DICTIONARY[selectedLang] || UI_DICTIONARY.hindi;
  }, [selectedLang]);

  // Multilingual Quick Questions for chosen language
  const currentQuestionsList = useMemo(() => {
    return MULTILINGUAL_QUESTIONS[selectedLang] || MULTILINGUAL_QUESTIONS.hindi;
  }, [selectedLang]);

  // Only 2 options initially shown, rest on "See More"
  const displayedQuickQuestions = useMemo(() => {
    return showMoreQuickQuestions ? currentQuestionsList : currentQuestionsList.slice(0, 2);
  }, [showMoreQuickQuestions, currentQuestionsList]);

  // Delete an individual message in active chat
  const handleDeleteActiveMessage = (msgId: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== msgId);
      return updated.length > 0
        ? updated
        : [
            {
              id: "m_welcome_" + Date.now(),
              sender: "assistant",
              text: DEFAULT_WELCOME_TEXT,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ];
    });
    setNotificationToast((currentUI.deleteMessage || "Message deleted") + " ✓");
    setTimeout(() => setNotificationToast(null), 2000);
  };

  // Delete an individual message inside the full transcript page
  const handleDeleteTranscriptMessage = (msgId: string) => {
    if (!viewingTranscriptSession) return;
    const updatedMessages = viewingTranscriptSession.messages.filter((m) => m.id !== msgId);
    const updatedSession: ChatSession = {
      ...viewingTranscriptSession,
      messages:
        updatedMessages.length > 0
          ? updatedMessages
          : [
              {
                id: "m_welcome_" + Date.now(),
                sender: "assistant",
                text: DEFAULT_WELCOME_TEXT,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ],
      updatedAt: Date.now(),
    };
    setViewingTranscriptSession(updatedSession);
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    if (activeSessionId === updatedSession.id) {
      setMessages(updatedSession.messages);
    }
    setNotificationToast((currentUI.deleteMessage || "Message deleted") + " ✓");
    setTimeout(() => setNotificationToast(null), 2000);
  };

  // ==========================================
  // RENDER: SETTINGS SCREEN
  // ==========================================
  if (isSettingsPageOpen) {
    return (
      <div
        className="animate-fadeIn flex flex-col h-full bg-[#FFFDFE] dark:bg-slate-950 select-none overflow-hidden"
        style={{ height: viewportHeight ? `${viewportHeight}px` : "100%" }}
      >
        {/* Settings Header with Back Arrow */}
        <div className="shrink-0 flex items-center justify-between px-3 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsPageOpen(false)}
              className="p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
              title="Back to Assistant"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Settings & Preferences
            </h2>
          </div>
        </div>

        {/* Global Toast inside settings if any */}
        {notificationToast && (
          <div className="mx-3 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs shrink-0">
            <span>{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Scrollable Settings List - Full smooth scrolling for all features */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 pb-28">
          {/* 1. Language */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("language");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Language
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 2. Voice */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("voice");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Voice
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 3. Response */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("response");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Response
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 4. Chats */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setCameFromSettings(true);
              setIsOldChatsPageOpen(true);
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#FF2D55] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Chats
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 5. Notifications */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("notifications");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Notifications
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 6. Privacy Policy */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("privacy");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Privacy Policy
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 7. Emergency */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("emergency");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Emergency
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 8. Contacts */}
          <div
            onClick={() => {
              setSavedContacts(getSavedContacts());
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("contacts");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Contacts
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 9. Appearance */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("appearance");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Appearance
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>

          {/* 10. Font Size */}
          <div
            onClick={() => {
              setIsSettingsPageOpen(false);
              setActiveSettingsSubpage("fontSize");
            }}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-200 transition-all shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Font Size
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // RENDER: FULL PAGE FEATURE SUBPAGES
  // (Language, Voice, Response, Notifications, Emergency, Contacts, Appearance, Font Size, Privacy)
  // ==========================================
  if (activeSettingsSubpage) {
    return (
      <SettingsSubpages
        subpage={activeSettingsSubpage}
        onBack={() => {
          setActiveSettingsSubpage(null);
          setIsSettingsPageOpen(true);
        }}
        onClose={() => {
          setActiveSettingsSubpage(null);
          setIsSettingsPageOpen(false);
        }}
        viewportHeight={viewportHeight}
        selectedLang={selectedLang}
        onSelectLang={(lang) => {
          setSelectedLang(lang);
          setNotificationToast(`✓ Language set to ${LANGUAGE_LABELS.find((l) => l.id === lang)?.label || lang}`);
          setTimeout(() => setNotificationToast(null), 2500);
        }}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        speechSpeed={speechSpeed}
        setSpeechSpeed={setSpeechSpeed}
        onTestVoice={() => {
          speakMessage(
            "test_voice",
            selectedLang === "hindi"
              ? "नमस्ते, मैं सेफहर हूँ। मैं आपकी सुरक्षा के लिए हमेशा तैयार हूँ।"
              : selectedLang === "hinglish"
              ? "Hello! Main SafeHer hoon. Main aapki safety ke liye yahan hoon."
              : selectedLang === "punjabi"
              ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਸੇਫ਼ਹਰ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਲਈ ਹਾਂ।"
              : selectedLang === "bengali"
              ? "নমস্কার, আমি সেফহার। আমি আপনার সুরক্ষার জন্য আছি।"
              : selectedLang === "marathi"
              ? "नमस्कार, मी सेफहर आहे. मी तुमच्या सुरक्षेसाठी तयार आहे."
              : selectedLang === "urdu"
              ? "ہیلو، میں سیف ہر ہوں۔ میں آپ کی حفاظت के लिए मौजूद हूँ।"
              : "Hello, I am SafeHer. I am here to help you stay safe."
          );
        }}
        lengthPreference={lengthPreference}
        setLengthPreference={setLengthPreference}
        notifySOS={notifySOS}
        setNotifySOS={setNotifySOS}
        notifyDeviation={notifyDeviation}
        setNotifyDeviation={setNotifyDeviation}
        notifyCheckIn={notifyCheckIn}
        setNotifyCheckIn={setNotifyCheckIn}
        isSirenActive={isSirenActive}
        onToggleSiren={() => {
          if (isSirenActive) {
            soundManager.stopSiren();
            setIsSirenActive(false);
          } else {
            soundManager.startSiren();
            setIsSirenActive(true);
          }
        }}
        location={location}
        savedContacts={savedContacts}
        onAddContact={(contact) => {
          const updated = [...savedContacts, contact];
          setSavedContacts(updated);
          saveContacts(updated);
        }}
        onDeleteContact={handleDeleteContact}
        fontSizePref={fontSizePref}
        setFontSizePref={setFontSizePref}
        chatBubbleTextClass={chatBubbleTextClass}
        onClearAllChats={handleClearAllSessions}
      />
    );
  }

  // ==========================================
  // RENDER: FULL PAGE OLD CHATS / SAVED CONVERSATIONS
  // ==========================================
  if (isOldChatsPageOpen) {
    return (
      <div
        className="animate-fadeIn flex flex-col h-full bg-slate-50 dark:bg-slate-950 select-none overflow-hidden"
        style={{ height: viewportHeight ? `${viewportHeight}px` : "100%" }}
      >
        {/* Full-Page Header */}
        <div className="shrink-0 flex items-center justify-between px-3 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsOldChatsPageOpen(false);
                if (cameFromSettings) {
                  setIsSettingsPageOpen(true);
                  setCameFromSettings(false);
                }
              }}
              className="p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
              title={cameFromSettings ? "Back to Settings" : (currentUI.backToChat || "Back to Assistant Chat")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Chats
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {sessions.length} conversation(s)
              </p>
            </div>
          </div>

          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Global Toast if any */}
        {notificationToast && (
          <div className="mx-3 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)}>
              <X className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Instruction Info Banner */}
        <div className="mx-3 mt-2.5 p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <span className="text-lg shrink-0">💬</span>
          <div className="text-[11px] leading-snug">
            Tap <strong>Read & Continue</strong> to view all saved messages and resume chatting.
          </div>
        </div>

        {/* List of Conversations (Full Page scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
          {sessions.map((sess) => {
            const isCurrent = sess.id === activeSessionId;
            const lastMsg = sess.messages[sess.messages.length - 1];

            return (
              <div
                key={sess.id}
                onTouchStart={() => handleSessionTouchStart(sess)}
                onTouchEnd={handleSessionTouchEnd}
                onTouchMove={handleSessionTouchEnd}
                onTouchCancel={handleSessionTouchEnd}
                onMouseDown={() => handleSessionTouchStart(sess)}
                onMouseUp={handleSessionTouchEnd}
                onMouseLeave={handleSessionTouchEnd}
                onClick={() => {
                  if (isHoldTriggeredRef.current) {
                    isHoldTriggeredRef.current = false;
                    return;
                  }
                  // Opens directly to read messages and continue chatting
                  handleSelectSession(sess.id);
                }}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs select-none active:scale-[0.99] group ${
                  isCurrent
                    ? "bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-900"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${
                        isCurrent
                          ? "bg-[#FF2D55] text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {sess.title || "Safety Conversation"}
                        </h4>
                        {isCurrent && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500 text-white">
                            {currentUI.activeBadge || "ACTIVE"}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {sess.dateLabel || formatSessionTime(sess.updatedAt)} • {sess.messages.length} message(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Unified Single Action: Read & Continue */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSession(sess.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF2D55] hover:bg-rose-600 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                      title="Read & Continue Chat"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Read & Continue</span>
                    </button>

                    {/* Direct 1-tap delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSessionToDelete(sess);
                        setShowDeleteSessionModal(true);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Last message preview */}
                {lastMsg && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/80 dark:bg-slate-800/40 p-2 rounded-xl">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {lastMsg.sender === "user" ? "You: " : "SafeHer: "}
                    </span>
                    {lastMsg.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setIsOldChatsPageOpen(false);
              if (cameFromSettings) {
                setIsSettingsPageOpen(true);
                setCameFromSettings(false);
              }
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            {cameFromSettings ? "Back to Settings" : (currentUI.backToChat || "Back to Chat")}
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{currentUI.clearAll || "Clear All"}</span>
          </button>
        </div>

        {/* Hold-Press Delete Confirmation Modal */}
        {showDeleteSessionModal && sessionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-100 dark:border-slate-800 shadow-xl space-y-3.5">
              <div className="flex items-center gap-2.5 text-red-500">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {currentUI.confirmDeleteTitle || "Delete Conversation?"}
                  </h3>
                  <p className="text-[10px] text-slate-400">Triggered by hold press</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                  "{sessionToDelete.title}"
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Contains {sessionToDelete.messages.length} saved message(s)
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentUI.confirmDeleteDesc || "Kya aap is conversation ko delete karna chahte hain? Yeh chat history se permanent delete ho jayegi."}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowDeleteSessionModal(false);
                    setSessionToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50"
                >
                  {currentUI.cancel || "Cancel"}
                </button>
                <button
                  onClick={() => handleDeleteSession(sessionToDelete.id)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{currentUI.deleteConversation || "Delete Chat"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: DEDICATED FULL-PAGE ABOUT SAFHER & PRIVACY POLICY
  // Opened directly from Settings with back button
  // Contains comprehensive professional details:
  // - What is SafeHer (kya hai)
  // - Why SafeHer exists (kyu hai / purpose)
  // - Full Privacy Policy & Data Protection (zero tracking, local storage)
  // - Founder & Lead Engineer: Aditi Rao (Lucknow, UP) - Age removed!
  // - Core Safety Pillars & Missing Points covered
  // - National Emergency Helplines
  // ==========================================

  // ==========================================
  // RENDER: DEDICATED FULL-PAGE CHAT READER & MANAGER
  // Opens directly when user clicks on a chat to read & delete
  // ==========================================
  if (viewingTranscriptSession) {
    return (
      <div
        className="animate-fadeIn flex flex-col h-full bg-[#FFFDFE] dark:bg-slate-950 select-none overflow-hidden"
        style={{ height: viewportHeight ? `${viewportHeight}px` : "100%" }}
      >
        {/* Full-Page Reader Header */}
        <div className="shrink-0 flex items-center justify-between px-3 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setViewingTranscriptSession(null)}
              className="p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
              title="Back to All Chats"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                {viewingTranscriptSession.title || "Safety Conversation"}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {viewingTranscriptSession.dateLabel || formatSessionTime(viewingTranscriptSession.updatedAt)} • {viewingTranscriptSession.messages.length} message(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Continue Chat in Assistant */}
            <button
              onClick={() => {
                handleSelectSession(viewingTranscriptSession.id);
                setViewingTranscriptSession(null);
                setIsOldChatsPageOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
              title="Continue Chatting"
            >
              <Send className="w-3 h-3" />
              <span>{currentUI.continueChat || "Continue"}</span>
            </button>

            {/* Delete this entire chat */}
            <button
              onClick={() => {
                setSessionToDelete(viewingTranscriptSession);
                setShowDeleteSessionModal(true);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
              title="Delete this entire conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toast if any */}
        {notificationToast && (
          <div className="mx-3 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)}>
              <X className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Transcript Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-3 px-3 py-3">
          {viewingTranscriptSession.messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {m.sender === "user" ? (
                <div className="w-8 h-8 rounded-full bg-[#FF2D55] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 p-0.5 shrink-0 flex items-center justify-center border border-rose-100 dark:border-rose-900">
                  <SafeHerRobotAvatar size={28} />
                </div>
              )}

              {/* Message Bubble with delete and speaker controls */}
              <div
                className={`relative p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-2xs ${chatBubbleTextClass} ${
                  m.sender === "user"
                    ? "bg-[#FFE4E8] dark:bg-rose-950/60 text-slate-900 dark:text-rose-100 rounded-tr-xs border border-rose-200/60 dark:border-rose-900/60 font-medium"
                    : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                }`}
              >
                {/* Control buttons: Listen, Copy, Delete Message */}
                <div className="flex items-center justify-end gap-1 mb-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                  <button
                    onClick={() => speakMessage(m.id, m.text)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#FF2D55] transition-colors cursor-pointer"
                    title="Listen to message with fast AI voice"
                  >
                    {speakingMessageId === m.id ? (
                      <StopCircle className="w-3.5 h-3.5 text-[#FF2D55] animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.text);
                      setNotificationToast("✓ Message copied");
                      setTimeout(() => setNotificationToast(null), 2000);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors text-[10px] font-bold cursor-pointer"
                    title="Copy message text"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteTranscriptMessage(m.id)}
                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                    title={currentUI.deleteMessage || "Delete Message"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="whitespace-pre-wrap">{m.text}</p>

                <div
                  className={`flex items-center gap-1 mt-1 text-[10px] ${
                    m.sender === "user" ? "justify-end text-rose-500/80" : "text-slate-400"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.sender === "user" && <span className="font-bold">✓✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewingTranscriptSession(null)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            ← {currentUI.backToChat || "All Chats"}
          </button>
          <button
            onClick={() => {
              handleSelectSession(viewingTranscriptSession.id);
              setViewingTranscriptSession(null);
              setIsOldChatsPageOpen(false);
            }}
            className="flex-1 py-2.5 px-3 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{currentUI.continueChat || "Continue Chatting"}</span>
          </button>
          <button
            onClick={() => {
              setSessionToDelete(viewingTranscriptSession);
              setShowDeleteSessionModal(true);
            }}
            className="py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Delete this entire conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{currentUI.deleteConversation || "Delete"}</span>
          </button>
        </div>

        {/* Delete Confirmation Modal inside Transcript */}
        {showDeleteSessionModal && sessionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-100 dark:border-slate-800 shadow-xl space-y-3.5">
              <div className="flex items-center gap-2.5 text-red-500">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {currentUI.confirmDeleteTitle || "Delete Conversation?"}
                  </h3>
                  <p className="text-[10px] text-slate-400">Permanently delete this chat</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                  "{sessionToDelete.title}"
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Contains {sessionToDelete.messages.length} saved message(s)
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentUI.confirmDeleteDesc || "Kya aap is conversation ko delete karna chahte hain? Yeh chat history se permanent delete ho jayegi."}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowDeleteSessionModal(false);
                    setSessionToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50"
                >
                  {currentUI.cancel || "Cancel"}
                </button>
                <button
                  onClick={() => {
                    handleDeleteSession(sessionToDelete.id);
                    setViewingTranscriptSession(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{currentUI.deleteConversation || "Delete Chat"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Session reference
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // ==========================================
  // RENDER: MAIN ASSISTANT CHAT VIEW (FULL PAGE)
  // ==========================================
  return (
    <div
      className="animate-fadeIn flex flex-col h-full bg-[#FFFDFE] dark:bg-slate-950 select-none overflow-hidden"
      style={{ height: viewportHeight ? `${viewportHeight}px` : "100%" }}
    >
      {/* Top Header Bar with Back Button, Status, Old Chats, and Settings */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="cursor-pointer" onClick={() => speakMessage("m_welcome", "Hi, I am SafeHer. How can I help you?")}>
            <SafeHerRobotAvatar size={32} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                SafeHer AI
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block -mt-0.5 truncate max-w-[120px] sm:max-w-[200px]">
              {activeSession?.title || "Safety Assistant"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#FF2D55] border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors text-[11px] font-bold shadow-2xs"
            title={currentUI.newChat || "New Chat"}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{currentUI.newChat || "New Chat"}</span>
          </button>

          {/* Font Size Indicator */}
          <button
            onClick={() => {
              const next = fontSizePref === "Small" ? "Medium" : fontSizePref === "Medium" ? "Large" : "Small";
              setFontSizePref(next);
            }}
            className="px-2 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Toggle Font Size (Small/Medium/Large)"
          >
            {fontSizePref}
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => setIsSettingsPageOpen(true)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-[#FF2D55] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            title={currentUI.settings || "Settings"}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 px-3 py-2">
        {/* Hero Section with Cute Robot Avatar (Hidden or condensed when chatting or typing to give full room) */}
        {!isInputFocused && messages.length <= 2 && (
          <div className="relative pt-1 pb-2 px-4 flex flex-col items-center justify-center text-center shrink-0">
            {/* Audio Speaker Toggle on Top-Right of Avatar Card */}
            <div className="absolute right-2 top-1">
              <button
                onClick={() => {
                  if (speakingMessageId) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                className={`p-2 rounded-full border transition-all cursor-pointer shadow-xs ${
                  autoSpeak
                    ? "bg-white dark:bg-slate-800 text-[#FF2D55] border-rose-200 dark:border-rose-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                }`}
                title={autoSpeak ? "Voice Speech Enabled" : "Voice Speech Muted"}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Cute Mascot Avatar */}
            <div
              className="cursor-pointer active:scale-95 transition-transform"
              onClick={() => speakMessage("m_welcome", "Hi, I am SafeHer. How can I help you stay safe today?")}
            >
              <SafeHerRobotAvatar size={74} className="drop-shadow-sm" />
            </div>

            {/* Title: Localized greeting in chosen language (only single SafeHer in pink) */}
            <h1 className="mt-1 text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {(currentUI.heroGreeting || "Hi, I'm").replace(/SafeHer/gi, "").trim()}{" "}
              <span className="text-[#FF2D55]">SafeHer</span>
            </h1>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            {m.sender === "user" ? (
              <div className="w-8 h-8 rounded-full bg-[#FF2D55] text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 p-0.5 shrink-0 flex items-center justify-center border border-rose-100 dark:border-rose-900">
                <SafeHerRobotAvatar size={28} />
              </div>
            )}

            {/* Bubble with DYNAMIC FONT SIZE APPLIED */}
            <div
              className={`relative p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-2xs group ${chatBubbleTextClass} ${
                m.sender === "user"
                  ? "bg-[#FFE4E8] dark:bg-rose-950/60 text-slate-900 dark:text-rose-100 rounded-tr-xs border border-rose-200/60 dark:border-rose-900/60 font-medium"
                  : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
              }`}
            >
              {/* Message Controls (Audio speaker for assistant, and Delete Message for all) */}
              <div className="absolute right-2 top-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {m.sender === "assistant" && (
                  <button
                    onClick={() => speakMessage(m.id, m.text)}
                    className="p-1 rounded-full hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-400 hover:text-[#FF2D55] transition-colors cursor-pointer"
                    title="Speak message aloud"
                  >
                    {speakingMessageId === m.id ? (
                      <StopCircle className="w-3.5 h-3.5 text-[#FF2D55] animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
                {/* Delete message button right from active chat */}
                <button
                  onClick={() => handleDeleteActiveMessage(m.id)}
                  className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                  title={currentUI.deleteMessage || "Delete this message"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className={`whitespace-pre-wrap ${m.sender === "assistant" ? "pr-12" : "pr-6"}`}>
                {m.text}
              </p>

              {/* Large Emergency Controls if this message is flagged as an emergency */}
              {m.isEmergency && m.sender === "assistant" && (
                <div className="mt-3 pt-2.5 border-t border-rose-100 dark:border-rose-950/60 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{currentUI.emergencyControls || "Emergency Quick Action Controls"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <a
                      href="tel:112"
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] shadow-xs cursor-pointer active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{currentUI.policeSos || "Call 112 (Police)"}</span>
                    </a>
                    <a
                      href="tel:1090"
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] shadow-xs cursor-pointer active:scale-95"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{currentUI.womenHelpline || "Call 1090 (Women)"}</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={handleShareLocationWhatsApp}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>📍 {currentUI.shareGps || "Share GPS on WA"}</span>
                    </button>
                    <button
                      onClick={handleToggleSiren}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95 transition-all ${
                        isSirenActive ? "bg-amber-600 animate-pulse" : "bg-slate-800 dark:bg-slate-700"
                      }`}
                    >
                      <span>{isSirenActive ? (currentUI.stopSiren || "🔊 Stop Siren") : (currentUI.soundSiren || "📢 Sound Siren")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp & double checkmarks for user */}
              <div
                className={`flex items-center gap-1 mt-1.5 text-[10px] ${
                  m.sender === "user" ? "justify-end text-rose-500/80" : "text-slate-400"
                }`}
              >
                <span>{m.timestamp}</span>
                {m.sender === "user" && <span className="font-bold">✓✓</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs pl-10 py-1">
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-ping"></span>
            <span className="font-bold flex items-center gap-1">
              {currentUI.thinking || "SafeHer is thinking..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic status toast if any */}
      {micStatus && (
        <div className="p-2 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
          <span>{micStatus}</span>
          <button onClick={() => setMicStatus(null)} className="p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice listening active waveform */}
      {isListening && (
        <div className="mb-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 h-5">
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_100ms] h-3"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_200ms] h-5"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_300ms] h-4"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_400ms] h-6"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_200ms] h-3"></span>
            </div>
            <div>
              <div className="text-xs font-black">{currentUI.listening || "Listening... speak now"}</div>
              <p className="text-[11px] text-rose-100 truncate max-w-[200px]">
                {speechTranscript || "Speak your query now..."}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const text = speechTranscript.trim();
              setIsListening(false);
              if (text) handleSend(text);
            }}
            className="px-3 py-1 bg-white text-rose-600 rounded-xl text-xs font-bold cursor-pointer"
          >
            Send
          </button>
        </div>
      )}

      {/* ==========================================
          QUICK QUESTIONS SECTION
          Localized to chosen language
          Only 2 options shown initially, rest in See More
          Automatically hides when typing to free up full keyboard space
          ========================================== */}
      {!isInputFocused && (
        <div className="shrink-0 px-3 pt-1.5 pb-1 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight">
              {currentUI.quickQuestionsTitle || "Quick Questions"}
            </h3>
            <button
              onClick={() => setShowMoreQuickQuestions(!showMoreQuickQuestions)}
              className="text-xs font-bold text-[#FF2D55] hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showMoreQuickQuestions ? (currentUI.showLess || "Show Less") : (currentUI.seeMore || "See More")}</span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${showMoreQuickQuestions ? "-rotate-90" : ""}`}
              />
            </button>
          </div>

          {/* 2-Column Responsive Simple & Small Panic Cards */}
          <div className="grid grid-cols-2 gap-2">
            {displayedQuickQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.prompt)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900 rounded-xl flex items-center gap-2 text-left cursor-pointer transition-all active:scale-95 shadow-2xs group"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs border ${q.bgColor}`}
                >
                  {q.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight line-clamp-2 group-hover:text-[#FF2D55] transition-colors">
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar: Anchored cleanly at the bottom */}
      <div className="shrink-0 px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Circular Voice Mic Button */}
          <button
            onClick={handleToggleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs ${
              isListening
                ? "bg-[#FF2D55] text-white animate-pulse shadow-rose-300 ring-2 ring-rose-200"
                : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900 text-[#FF2D55] hover:bg-rose-100"
            }`}
            title={currentUI.tapToSpeak || "Tap to speak"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Pill Input */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 flex items-center shadow-2xs focus-within:border-rose-400 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-rose-200/50 transition-all">
            <input
              type="text"
              value={input}
              onFocus={() => {
                setIsInputFocused(true);
                setTimeout(scrollToBottom, 120);
                setTimeout(scrollToBottom, 320);
              }}
              onBlur={() => setIsInputFocused(false)}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={currentUI.inputPlaceholder || "Type or speak in any language..."}
              className={`w-full text-slate-800 dark:text-slate-100 bg-transparent outline-hidden placeholder:text-slate-400 ${chatBubbleTextClass}`}
            />
          </div>

          {/* Circular Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-[#FF2D55] hover:bg-[#E84E60] disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer transition-all shadow-md active:scale-95"
            title="Send Message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
