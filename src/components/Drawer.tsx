import React from "react";
import { Shield, X, Sun, Moon, Monitor, AlertCircle } from "lucide-react";
import { ActiveTab, ThemeMode } from "../types";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenIncidentModal: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenIncidentModal,
  theme,
  onSetTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-[300px] sm:max-w-xs bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between p-5 border-l border-slate-100 dark:border-slate-800 transform transition-all duration-300 ease-in-out">
          <div className="space-y-6 overflow-y-auto">
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
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

            {/* THEME SELECTION: Default (System), Light, Dark */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Theme / डिस्प्ले थीम
                </span>
                <span className="text-[10px] text-slate-400 font-semibold capitalize">
                  {theme}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {/* System (Default) */}
                <button
                  onClick={() => onSetTheme("system")}
                  className={`py-2 px-2 rounded-xl text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    theme === "system"
                      ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold shadow-xs border border-rose-200 dark:border-rose-900"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-[10px]">Default</span>
                </button>

                {/* Light */}
                <button
                  onClick={() => onSetTheme("light")}
                  className={`py-2 px-2 rounded-xl text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    theme === "light"
                      ? "bg-white dark:bg-slate-700 text-amber-600 font-bold shadow-xs border border-amber-200 dark:border-amber-900"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-[10px]">Light</span>
                </button>

                {/* Dark */}
                <button
                  onClick={() => onSetTheme("dark")}
                  className={`py-2 px-2 rounded-xl text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    theme === "dark"
                      ? "bg-white dark:bg-slate-700 text-indigo-400 font-bold shadow-xs border border-indigo-200 dark:border-indigo-900"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-[10px]">Dark</span>
                </button>
              </div>
            </div>

            {/* Menu Navigation Items */}
            <nav className="space-y-1.5">
              <button
                onClick={() => {
                  onSelectTab("home");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "home"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-xl">🏠</span>
                <span>Home Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab("tools");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "tools"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-xl">🛡️</span>
                <span>Safety Tools</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab("contacts");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "contacts"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-xl">👥</span>
                <span>Emergency Contacts</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab("assistant");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "assistant"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-xl">🤖</span>
                <span>AI Voice Assistant</span>
              </button>

              <button
                onClick={() => {
                  onOpenIncidentModal();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <span className="text-xl">📹</span>
                <span>Incident Log & Video Capture</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab("sos");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "sos"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-[#E84E60] dark:text-rose-400 shadow-2xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-xl">🚨</span>
                <span>Emergency Help & Helplines</span>
              </button>
            </nav>
          </div>

          {/* Footer Status */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Protection System Active • v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
