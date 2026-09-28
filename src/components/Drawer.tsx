import React, { useState } from "react";
import {
  Shield,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  User,
  LogOut,
  LogIn,
  Info,
  Check,
  ChevronRight,
  ArrowLeft,
  Palette,
  Home,
  Users,
  Video,
} from "lucide-react";
import { ActiveTab, ThemeMode } from "../types";
import { SafeHerRobotAvatar } from "./SafeHerRobotAvatar";

export interface DrawerUser {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenIncidentModal: () => void;
  onOpenAboutModal: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
  currentUser: DrawerUser;
  onLogout: () => void;
  onLogin: () => void;
}

const LANGUAGES = [
  { id: "english", label: "English", native: "English", flag: "🇬🇧" },
  { id: "hindi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { id: "hinglish", label: "Hinglish", native: "Hinglish", flag: "✨" },
  { id: "bengali", label: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { id: "punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { id: "marathi", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { id: "urdu", label: "Urdu", native: "اردو", flag: "🇵🇰" },
];

const THEMES: { id: ThemeMode; label: string; desc: string; icon: typeof Monitor }[] = [
  {
    id: "system",
    label: "System Default",
    desc: "Match your device display settings",
    icon: Monitor,
  },
  {
    id: "light",
    label: "Light Mode",
    desc: "Clean bright display",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark Mode",
    desc: "Reduced glare and battery saver",
    icon: Moon,
  },
];

const DRAWER_STRINGS: Record<string, Record<string, string>> = {
  english: {
    home: "Home Dashboard",
    tools: "Safety Tools",
    contacts: "Emergency Contacts",
    assistant: "AI Voice Assistant",
    incident: "Incident Report",
    sos: "Emergency SOS",
    about: "About SafeHer",
    settings: "Settings & Account",
    language: "Language",
    theme: "Theme",
    system: "System Default",
    light: "Light Mode",
    dark: "Dark Mode",
    logOut: "Log Out Account",
    logIn: "Log In to Account",
    active: "Active",
    offline: "Offline",
    statusText: "Protection Active • v2.4",
    selectLanguage: "Select Language",
    selectTheme: "Select Theme",
    back: "Back",
  },
  hindi: {
    home: "होम डैशबोर्ड",
    tools: "सुरक्षा टूल्स",
    contacts: "आपातकालीन संपर्क",
    assistant: "एआई वॉइस असिस्टेंट",
    incident: "इंसीडेंट रिपोर्ट",
    sos: "इमरजेंसी एसओएस",
    about: "About SafeHer",
    settings: "सेटिंग्स और अकाउंट",
    language: "भाषा",
    theme: "थीम",
    system: "सिस्टम डिफॉल्ट",
    light: "लाइट मोड",
    dark: "डार्क मोड",
    logOut: "अकाउंट लॉग आउट करें",
    logIn: "अकाउंट लॉग इन करें",
    active: "सक्रिय",
    offline: "लॉग आउट",
    statusText: "सुरक्षा सिस्टम सक्रिय • v2.4",
    selectLanguage: "भाषा चुनें",
    selectTheme: "थीम चुनें",
    back: "वापस",
  },
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenIncidentModal,
  onOpenAboutModal,
  theme,
  onSetTheme,
  currentLanguage,
  onSelectLanguage,
  currentUser,
  onLogout,
  onLogin,
}) => {
  const [subPage, setSubPage] = useState<"menu" | "language" | "theme">("menu");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Reset to menu view whenever drawer is reopened
  React.useEffect(() => {
    if (isOpen) {
      setSubPage("menu");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLangObj =
    LANGUAGES.find((l) => l.id === currentLanguage) || LANGUAGES[0];
  const currentThemeObj =
    THEMES.find((t) => t.id === theme) || THEMES[0];

  const t =
    currentLanguage === "hindi"
      ? DRAWER_STRINGS.hindi
      : DRAWER_STRINGS.english;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-[320px] sm:max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between p-4 sm:p-5 border-l border-slate-100 dark:border-slate-800 transform transition-all duration-300 ease-in-out">
          {/* ============================================================ */}
          {/* VIEW 1: MAIN MENU (Home Dashboard is first & at the top!)     */}
          {/* ============================================================ */}
          {subPage === "menu" && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#4A8EC2] fill-[#78B4DC]/30" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-[#E84E60] dark:text-rose-400 tracking-tight leading-none block">
                      SafeHer
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Women Safety Assistant
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. PRIMARY NAVIGATION (Home Dashboard is first & at the top!) */}
              <nav className="space-y-1.5">
                {/* 1. Home Dashboard */}
                <button
                  onClick={() => {
                    onSelectTab("home");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "home"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <span>{t.home}</span>
                </button>

                {/* 2. Safety Tools */}
                <button
                  onClick={() => {
                    onSelectTab("tools");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "tools"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Shield className="w-4 h-4 fill-white/20" />
                  </div>
                  <span>{t.tools}</span>
                </button>

                {/* 3. Emergency Contacts */}
                <button
                  onClick={() => {
                    onSelectTab("contacts");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "contacts"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>{t.contacts}</span>
                </button>

                {/* 4. AI Voice Assistant */}
                <button
                  onClick={() => {
                    onSelectTab("assistant");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "assistant"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-100 to-fuchsia-100 dark:from-violet-950/60 dark:to-fuchsia-950/60 border border-violet-200/50 dark:border-violet-800/50 flex items-center justify-center shadow-xs shrink-0">
                    <SafeHerRobotAvatar size={22} />
                  </div>
                  <span>{t.assistant}</span>
                </button>

                {/* 5. Incident Report */}
                <button
                  onClick={() => {
                    onOpenIncidentModal();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <span>{t.incident}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* 6. Emergency SOS */}
                <button
                  onClick={() => {
                    onSelectTab("sos");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "sos"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/50 flex items-center justify-center text-lg shadow-xs shrink-0">
                    <span className="animate-pulse">🚨</span>
                  </div>
                  <span>{t.sos}</span>
                </button>

                {/* 7. About SafeHer - Professional branded icon with developed by Aditi Rao */}
                <button
                  onClick={() => {
                    onOpenAboutModal();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left hover:bg-rose-50/70 dark:hover:bg-slate-800/80 border border-transparent hover:border-rose-200/60 dark:hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-[#E63950] to-[#FB7185] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      <Shield className="w-5 h-5 fill-white/20 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block">
                        About SafeHer
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block mt-0.5">
                        Developed by Aditi Rao
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              </nav>

              {/* 2. SETTINGS & PREFERENCES SECTION */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block">
                  {t.settings}
                </span>

                {/* LANGUAGE ITEM (Opens dedicated selection page on click) */}
                <button
                  onClick={() => setSubPage("language")}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>
                      {currentLangObj.flag} {currentLangObj.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* THEME ITEM (Opens dedicated selection page on click) */}
                <button
                  onClick={() => setSubPage("theme")}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.theme}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{currentThemeObj.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* USER ACCOUNT & LOG OUT */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xs">
                        {currentUser.isLoggedIn ? (
                          currentUser.name.charAt(0)
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate">
                          {currentUser.isLoggedIn ? currentUser.name : "Guest Profile"}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5 truncate max-w-[140px]">
                          {currentUser.isLoggedIn
                            ? currentUser.email
                            : "Not logged in"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        currentUser.isLoggedIn
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {currentUser.isLoggedIn ? t.active : t.offline}
                    </span>
                  </div>

                  {currentUser.isLoggedIn ? (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logOut}</span>
                    </button>
                  ) : (
                    <button
                      onClick={onLogin}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{t.logIn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: DEDICATED LANGUAGE SELECTION PAGE                    */}
          {/* ============================================================ */}
          {subPage === "language" && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 animate-fadeIn">
              {/* Header with Back button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSubPage("menu")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.back}</span>
                </button>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t.selectLanguage}
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Language List */}
              <div className="space-y-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = currentLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        onSelectLanguage(lang.id);
                        setSubPage("menu");
                      }}
                      className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-2xs"
                          : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <span className="block text-sm font-bold leading-tight">
                            {lang.label}
                          </span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {lang.native}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: DEDICATED THEME SELECTION PAGE                        */}
          {/* ============================================================ */}
          {subPage === "theme" && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 animate-fadeIn">
              {/* Header with Back button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSubPage("menu")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.back}</span>
                </button>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t.selectTheme}
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Theme List */}
              <div className="space-y-2">
                {THEMES.map((th) => {
                  const Icon = th.icon;
                  const isSelected = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        onSetTheme(th.id);
                        setSubPage("menu");
                      }}
                      className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-2xs"
                          : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-rose-500 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold leading-tight">
                            {th.label}
                          </span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {th.desc}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Status */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.statusText}</span>
            </div>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              SafeHer © 2026 Aditi Rao
            </p>
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3.5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2.5 text-rose-600">
              <LogOut className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Log Out Account?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to log out of <strong>{currentUser.email}</strong>? Your local emergency contacts and offline safety tools will remain active.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
