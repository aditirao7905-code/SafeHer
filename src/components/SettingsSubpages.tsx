import React, { useState } from "react";
import {
  ArrowLeft,
  X,
  Check,
  Volume2,
  Globe,
  Sliders,
  Bell,
  Phone,
  User,
  Palette,
  Type,
  ShieldCheck,
  Lock,
  Trash2,
  Plus,
  Sparkles,
  AlertTriangle,
  Compass,
  FileText,
  VolumeX,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { LocationInfo, EmergencyContact, ThemeMode } from "../types";
import { buildWhatsAppUrl, getSavedTheme, saveTheme } from "../utils/helpers";
import { soundManager } from "../utils/audio";

export type SettingsSubpageType =
  | "language"
  | "voice"
  | "response"
  | "notifications"
  | "emergency"
  | "contacts"
  | "appearance"
  | "fontSize"
  | "privacy";

export type SupportedLang =
  | "auto"
  | "english"
  | "hindi"
  | "hinglish"
  | "punjabi"
  | "bengali"
  | "marathi"
  | "urdu";

export const LANGUAGE_OPTIONS: { id: SupportedLang; label: string; nativeName: string; code: string; flag: string }[] = [
  { id: "auto", label: "Auto-Detect", nativeName: "Automatic", code: "auto", flag: "✨" },
  { id: "hindi", label: "Hindi", nativeName: "हिन्दी", code: "hi-IN", flag: "🇮🇳" },
  { id: "hinglish", label: "Hinglish", nativeName: "Hindi-English Mix", code: "en-IN", flag: "🇮🇳" },
  { id: "english", label: "English", nativeName: "Indian English", code: "en-IN", flag: "🇬🇧" },
  { id: "punjabi", label: "Punjabi", nativeName: "ਪੰਜਾਬੀ", code: "pa-IN", flag: "🇮🇳" },
  { id: "bengali", label: "Bengali", nativeName: "বাংলা", code: "bn-IN", flag: "🇮🇳" },
  { id: "marathi", label: "Marathi", nativeName: "मराठी", code: "mr-IN", flag: "🇮🇳" },
  { id: "urdu", label: "Urdu", nativeName: "اردو", code: "ur-IN", flag: "🇵🇰" },
];

interface SettingsSubpagesProps {
  subpage: SettingsSubpageType;
  onBack: () => void;
  onClose: () => void;
  viewportHeight: number | null;
  // Language
  selectedLang: SupportedLang;
  onSelectLang: (lang: SupportedLang) => void;
  // Voice
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean | ((prev: boolean) => boolean)) => void;
  speechSpeed: 1.0 | 1.2;
  setSpeechSpeed: (val: 1.0 | 1.2) => void;
  onTestVoice: () => void;
  // Response
  lengthPreference: "short" | "medium" | "detailed";
  setLengthPreference: (val: "short" | "medium" | "detailed") => void;
  // Notifications
  notifySOS: boolean;
  setNotifySOS: (val: boolean | ((prev: boolean) => boolean)) => void;
  notifyDeviation: boolean;
  setNotifyDeviation: (val: boolean | ((prev: boolean) => boolean)) => void;
  notifyCheckIn: boolean;
  setNotifyCheckIn: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Emergency
  isSirenActive: boolean;
  onToggleSiren: () => void;
  location: LocationInfo;
  // Contacts
  savedContacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  // Font Size
  fontSizePref: "Small" | "Medium" | "Large";
  setFontSizePref: (val: "Small" | "Medium" | "Large") => void;
  chatBubbleTextClass: string;
  // Data Wipe
  onClearAllChats: () => void;
}

export const SettingsSubpages: React.FC<SettingsSubpagesProps> = ({
  subpage,
  onBack,
  onClose,
  viewportHeight,
  selectedLang,
  onSelectLang,
  autoSpeak,
  setAutoSpeak,
  speechSpeed,
  setSpeechSpeed,
  onTestVoice,
  lengthPreference,
  setLengthPreference,
  notifySOS,
  setNotifySOS,
  notifyDeviation,
  setNotifyDeviation,
  notifyCheckIn,
  setNotifyCheckIn,
  isSirenActive,
  onToggleSiren,
  location,
  savedContacts,
  onAddContact,
  onDeleteContact,
  fontSizePref,
  setFontSizePref,
  chatBubbleTextClass,
  onClearAllChats,
}) => {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => getSavedTheme());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Contact Form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("Family");

  // Clear data confirm modal
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
    const applyDark = (dark: boolean) => {
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };
    if (newTheme === "dark") {
      applyDark(true);
    } else if (newTheme === "light") {
      applyDark(false);
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyDark(mq.matches);
    }
    showToast(`✓ Theme set to ${newTheme.toUpperCase()}`);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast("Please enter a name and phone number.");
      return;
    }
    const contact: EmergencyContact = {
      id: "cnt_" + Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRelation.trim() || "Family",
      isPrimary: savedContacts.length === 0,
    };
    onAddContact(contact);
    setNewName("");
    setNewPhone("");
    showToast(`✓ Added ${contact.name} to contacts.`);
  };

  const getSubpageMeta = () => {
    switch (subpage) {
      case "language":
        return {
          title: "Language",
          subtitle: "Preferred Speech & Translation Language",
          icon: <Globe className="w-5 h-5 text-rose-500" />,
        };
      case "voice":
        return {
          title: "Voice",
          subtitle: "Speech Synthesis, Speed & Auto-Readout",
          icon: <Volume2 className="w-5 h-5 text-rose-500" />,
        };
      case "response":
        return {
          title: "Response",
          subtitle: "Assistant Detail Level & Guidance Style",
          icon: <Sliders className="w-5 h-5 text-rose-500" />,
        };
      case "notifications":
        return {
          title: "Notifications",
          subtitle: "SOS Alerts, Route Tracking & Safety Pings",
          icon: <Bell className="w-5 h-5 text-rose-500" />,
        };
      case "emergency":
        return {
          title: "Emergency",
          subtitle: "Acoustic Siren, Instant Helplines & Live GPS",
          icon: <Phone className="w-5 h-5 text-rose-500" />,
        };
      case "contacts":
        return {
          title: "Contacts",
          subtitle: "Trusted People & Emergency Dispatch List",
          icon: <User className="w-5 h-5 text-rose-500" />,
        };
      case "appearance":
        return {
          title: "Appearance",
          subtitle: "Light, Dark & OLED Night Transit Themes",
          icon: <Palette className="w-5 h-5 text-rose-500" />,
        };
      case "fontSize":
        return {
          title: "Font Size",
          subtitle: "Chat Text Scaling & Readability Preview",
          icon: <Type className="w-5 h-5 text-rose-500" />,
        };
      case "privacy":
        return {
          title: "Privacy Policy",
          subtitle: "Zero-Tracking Architecture • Local Storage Only",
          icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
        };
    }
  };

  const meta = getSubpageMeta();

  return (
    <div
      className="animate-fadeIn flex flex-col h-full bg-[#FFFDFE] dark:bg-slate-950 select-none overflow-hidden"
      style={{ height: viewportHeight ? `${viewportHeight}px` : "100%" }}
    >
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-3.5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
            title="Back to Settings"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight truncate">
              {meta.title}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          title="Close to Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="mx-3 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>
            <X className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Main Subpage Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 text-slate-800 dark:text-slate-200">
        {/* ================= 1. LANGUAGE ================= */}
        {subpage === "language" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4" />
                <span>Multilingual Emergency Engine</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                SafeHer speaks and understands Indian native languages. Choosing a language configures both voice recognition and AI response dialect.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                Select Language
              </div>
              <div className="grid grid-cols-1 gap-2">
                {LANGUAGE_OPTIONS.map((item) => {
                  const isSelected = selectedLang === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectLang(item.id);
                        showToast(`✓ Language changed to ${item.nativeName}`);
                      }}
                      className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-rose-50/80 dark:bg-rose-950/60 border-rose-500 shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.flag}</span>
                        <div className="text-left">
                          <div className={`font-black text-sm ${isSelected ? "text-[#FF2D55]" : "text-slate-900 dark:text-white"}`}>
                            {item.nativeName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.label} ({item.code})
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#FF2D55] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Voice Pronunciation */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Voice Output Demo
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Test audio synthesis for the currently selected language.
              </p>
              <button
                onClick={onTestVoice}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Volume2 className="w-4 h-4 text-rose-500" />
                <span>Play Voice Sample</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. VOICE ================= */}
        {subpage === "voice" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    Auto-Readout Responses
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatically speak safety instructions when assistant answers
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAutoSpeak(!autoSpeak);
                    showToast(!autoSpeak ? "Auto-readout turned ON" : "Auto-readout turned OFF");
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    autoSpeak ? "bg-[#FF2D55]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoSpeak ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="font-black text-sm text-slate-900 dark:text-white mb-2">
                  Speech Speed
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSpeechSpeed(1.0);
                      showToast("Speech speed set to Normal (1.0x)");
                    }}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      speechSpeed === 1.0
                        ? "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-[#FF2D55] font-black"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-sm">1.0x</div>
                    <div className="text-[10px] opacity-75">Normal & Clear</div>
                  </button>
                  <button
                    onClick={() => {
                      setSpeechSpeed(1.2);
                      showToast("Speech speed set to Fast (1.2x)");
                    }}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      speechSpeed === 1.2
                        ? "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-[#FF2D55] font-black"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-sm">1.2x</div>
                    <div className="text-[10px] opacity-75">Urgent & Fast</div>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={onTestVoice}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FF2D55] hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-[0.98]"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Voice Output Now</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Hands-Free Speech Capabilities</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                You can say <strong>"Police बुलाओ"</strong>, <strong>"Fake Call"</strong>, or <strong>"Siren बजाओ"</strong> in your chosen language, and SafeHer executes real hardware actions immediately.
              </p>
            </div>
          </div>
        )}

        {/* ================= 3. RESPONSE ================= */}
        {subpage === "response" && (
          <div className="space-y-4">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
              Response Guidance Style
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: "short" as const,
                  title: "Concise & Fast (Recommended)",
                  desc: "Immediate 2-3 step actionable bullets. Ideal during transit or when you need answers in seconds.",
                  badge: "Emergency Optimized",
                },
                {
                  id: "medium" as const,
                  title: "Balanced & Reassuring",
                  desc: "Comforting tone with practical safety measures and calm instructions.",
                  badge: "Standard",
                },
                {
                  id: "detailed" as const,
                  title: "Comprehensive & Educational",
                  desc: "Full legal statutory rights, BNSS sections, and thorough preventive strategies.",
                  badge: "Awareness",
                },
              ].map((item) => {
                const isSelected = lengthPreference === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLengthPreference(item.id);
                      showToast(`✓ Response style set to ${item.title}`);
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-50/80 dark:bg-rose-950/60 border-rose-500 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`font-black text-sm ${isSelected ? "text-[#FF2D55]" : "text-slate-900 dark:text-white"}`}>
                        {item.title}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. NOTIFICATIONS ================= */}
        {subpage === "notifications" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
              {/* Toggle 1: SOS alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Emergency SOS Audible Confirmation
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Plays tactical confirmation chimes when SOS is dispatched
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNotifySOS(!notifySOS);
                    showToast(!notifySOS ? "SOS audio alert enabled" : "SOS audio alert disabled");
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    notifySOS ? "bg-[#FF2D55]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifySOS ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Route Deviation */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Cab Detour & Route Deviation Warning
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Vibrates phone if vehicle deviates significantly from expected path
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNotifyDeviation(!notifyDeviation);
                    showToast(!notifyDeviation ? "Detour warnings enabled" : "Detour warnings disabled");
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    notifyDeviation ? "bg-[#FF2D55]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifyDeviation ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Safe Arrival Check-In */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Safe Arrival Check-In Prompts
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Reminds you to notify guardians upon reaching destination
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNotifyCheckIn(!notifyCheckIn);
                    showToast(!notifyCheckIn ? "Check-in prompts enabled" : "Check-in prompts disabled");
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    notifyCheckIn ? "bg-[#FF2D55]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifyCheckIn ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Test Safety Alert */}
            <button
              onClick={() => {
                soundManager.playBeep();
                showToast("🔔 Test Safety Ping Sent Successfully");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              <span>Trigger Test Notification & Chime</span>
            </button>
          </div>
        )}

        {/* ================= 5. EMERGENCY ================= */}
        {subpage === "emergency" && (
          <div className="space-y-4">
            {/* Siren Control */}
            <div className="p-4 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🚨 130dB Acoustic Alarm Siren</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    High-decibel deterrence sound to startle attackers
                  </div>
                </div>
                <button
                  onClick={onToggleSiren}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-xs transition-all ${
                    isSirenActive
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-[#FF2D55] text-white hover:bg-rose-600"
                  }`}
                >
                  {isSirenActive ? "Stop Siren" : "Test Siren"}
                </button>
              </div>
            </div>

            {/* Emergency Helplines Direct Dial */}
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                Emergency Helplines (1-Tap Dial)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { number: "112", name: "Police Emergency", icon: "👮" },
                  { number: "1090", name: "Women Power Line", icon: "🛡️" },
                  { number: "181", name: "Women Support", icon: "🤝" },
                  { number: "108", name: "Ambulance", icon: "🚑" },
                ].map((item) => (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-rose-200 shadow-2xs flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all"
                  >
                    <div>
                      <div className="font-black text-base text-[#FF2D55]">
                        {item.number}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
                        {item.name}
                      </div>
                    </div>
                    <span className="text-xl">{item.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* GPS Diagnostic Card */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Live GPS Coordinates
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Latitude / Longitude:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                  {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Accuracy Radius:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ±{location.accuracy.toFixed(0)} meters
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. CONTACTS ================= */}
        {subpage === "contacts" && (
          <div className="space-y-4">
            {/* Contact List */}
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                Saved Trusted People ({savedContacts.length})
              </div>

              {savedContacts.length === 0 ? (
                <div className="p-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                  <User className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No contacts saved yet. Add your trusted family and friends below.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedContacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#FF2D55] font-black text-sm flex items-center justify-center shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span>{c.phone}</span>
                            <span>•</span>
                            <span className="text-rose-500 font-medium">{c.relationship}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`tel:${c.phone}`}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Call Contact"
                        >
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </a>
                        <button
                          onClick={() => {
                            onDeleteContact(c.id);
                            showToast(`Contact removed`);
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Contact Form */}
            <form
              onSubmit={handleCreateContact}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3"
            >
              <div className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-500" />
                <span>Add Trusted Contact</span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Name (e.g., Mom, Sister)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Phone (+91...)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-rose-500"
                />
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-white focus:outline-rose-500"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF2D55] hover:bg-rose-600 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-[0.98] transition-all"
              >
                Save Trusted Contact
              </button>
            </form>
          </div>
        )}

        {/* ================= 7. APPEARANCE ================= */}
        {subpage === "appearance" && (
          <div className="space-y-4">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
              Select Display Theme
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "light" as const, title: "Light", icon: <Sun className="w-5 h-5 text-amber-500" />, desc: "Crisp daylight" },
                { id: "dark" as const, title: "Dark", icon: <Moon className="w-5 h-5 text-indigo-400" />, desc: "OLED night" },
                { id: "system" as const, title: "System", icon: <Monitor className="w-5 h-5 text-slate-500" />, desc: "Auto OS sync" },
              ].map((item) => {
                const isSelected = currentTheme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleThemeChange(item.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-50/80 dark:bg-rose-950/60 border-rose-500 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {item.icon}
                    </div>
                    <div className={`font-black text-xs ${isSelected ? "text-[#FF2D55]" : "text-slate-900 dark:text-white"}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">
                Night Transit & Battery Optimization
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Dark theme provides high-contrast low-glare visibility when traveling in cabs or dark alleys, helping conceal your phone screen from bystanders while saving battery.
              </p>
            </div>
          </div>
        )}

        {/* ================= 8. FONT SIZE ================= */}
        {subpage === "fontSize" && (
          <div className="space-y-4">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
              Chat Font Size
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(["Small", "Medium", "Large"] as const).map((size) => {
                const isSelected = fontSizePref === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSizePref(size);
                      showToast(`✓ Font size set to ${size}`);
                    }}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-50/80 dark:bg-rose-950/60 border-rose-500 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="font-black text-lg">Aa</span>
                    <span className={`text-xs font-bold ${isSelected ? "text-[#FF2D55]" : "text-slate-800 dark:text-slate-100"}`}>
                      {size}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Chat Bubble Preview */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Live Chat Bubble Preview
              </div>
              <div className={`p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-slate-800 dark:text-slate-100 ${chatBubbleTextClass}`}>
                "Bilkul, main aapki help karti hoon. Aap surakshit hain."
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. PRIVACY POLICY ================= */}
        {subpage === "privacy" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Tracking Guarantee</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                SafeHer is strictly local-first. We do NOT harvest, monetize, or transmit your conversations or contacts to surveillance servers.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                1. Local Sandboxed Storage
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your emergency contacts, conversation history, and user settings reside strictly in your device's browser sandbox (<code className="font-mono text-rose-500">localStorage</code>). No cloud accounts or passwords required.
              </p>

              <div className="font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800">
                2. Ephemeral Audio & GPS
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Speech recognition operates directly in-memory during active voice sessions. Geolocation permissions are requested on-demand only when you trigger SOS or request safe routes.
              </p>

              <div className="font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800">
                3. Statutory Zero FIR Legal Rights
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Under BNSS Section 173 / CrPC 154, any police station in India is legally obligated to file a Zero FIR for crimes against women, regardless of location or territorial jurisdiction.
              </p>
            </div>

            {/* Data Sovereignty Action */}
            <div className="p-4 rounded-3xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-3">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Wipe Chat & Storage History</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Permanently purge all saved conversations and local cache from this device.
              </p>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-[0.98] transition-all"
              >
                Clear All Conversations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="shrink-0 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
        >
          ← Return to Settings
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl bg-[#FF2D55] hover:bg-rose-600 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
        >
          Go to Assistant Chat
        </button>
      </div>

      {/* Confirmation Modal for Clearing All Chats */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-black text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Data Wipe</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete all saved conversations? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllChats();
                  setShowClearConfirm(false);
                  showToast("All conversations permanently cleared.");
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Wipe All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
