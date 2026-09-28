import React from "react";
import { Home, Users, Shield } from "lucide-react";
import { ActiveTab } from "../types";
import { SafeHerRobotAvatar } from "./SafeHerRobotAvatar";

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onSosTrigger: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onSosTrigger,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)] px-3 pt-2 pb-3 transition-colors">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-around relative">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "home"
              ? "text-rose-600 dark:text-rose-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`w-9 h-8 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === "home"
                ? "bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25 scale-105"
                : "bg-rose-50/70 dark:bg-rose-950/40 text-rose-500/90 dark:text-rose-400/90 group-hover:scale-105 group-hover:bg-rose-100/70"
            }`}
          >
            <Home
              className={`w-4.5 h-4.5 transition-transform ${
                activeTab === "home" ? "stroke-[2.5]" : "stroke-[2.1]"
              }`}
            />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none font-semibold">
            Home
          </span>
          {activeTab === "home" ? (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
          )}
        </button>

        {/* 2. Contacts */}
        <button
          onClick={() => onSelectTab("contacts")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "contacts"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`w-9 h-8 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === "contacts"
                ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-105"
                : "bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-500/90 dark:text-indigo-400/90 group-hover:scale-105 group-hover:bg-indigo-100/70"
            }`}
          >
            <Users
              className={`w-4.5 h-4.5 transition-transform ${
                activeTab === "contacts" ? "stroke-[2.5]" : "stroke-[2.1]"
              }`}
            />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none font-semibold">
            Contacts
          </span>
          {activeTab === "contacts" ? (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
          )}
        </button>

        {/* 3. Central SOS Beacon */}
        <div className="relative -top-4 flex flex-col items-center justify-center">
          <button
            onClick={() => {
              onSelectTab("sos");
              onSosTrigger();
            }}
            className="relative group cursor-pointer active:scale-90 transition-transform"
            title="Trigger Emergency SOS"
          >
            {/* Outer subtle glow ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 opacity-30 blur-sm group-hover:opacity-50 transition-opacity animate-pulse" />

            {/* Glowing SOS Beacon Circle */}
            <div className="relative w-13 h-13 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-600 p-0.5 shadow-[0_8px_20px_-3px_rgba(225,29,72,0.5)] ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-white">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-600 flex flex-col items-center justify-center">
                <span className="text-white font-black text-[13px] tracking-wider leading-none font-sans drop-shadow-xs">
                  SOS
                </span>
                <span className="text-[9px] leading-none mt-0.5 animate-bounce">
                  🚨
                </span>
              </div>
            </div>
          </button>
          <span className="text-[10px] font-black tracking-wider uppercase text-red-600 dark:text-red-400 mt-1 leading-none">
            Emergency
          </span>
        </div>

        {/* 4. Tools */}
        <button
          onClick={() => onSelectTab("tools")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "tools"
              ? "text-sky-600 dark:text-sky-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`w-9 h-8 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === "tools"
                ? "bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-105"
                : "bg-sky-50/70 dark:bg-sky-950/40 text-sky-500/90 dark:text-sky-400/90 group-hover:scale-105 group-hover:bg-sky-100/70"
            }`}
          >
            <Shield
              className={`w-4.5 h-4.5 transition-transform ${
                activeTab === "tools" ? "stroke-[2.5]" : "stroke-[2.1]"
              }`}
            />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none font-semibold">
            Tools
          </span>
          {activeTab === "tools" ? (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
          )}
        </button>

        {/* 5. Assistant */}
        <button
          onClick={() => onSelectTab("assistant")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "assistant"
              ? "text-violet-600 dark:text-violet-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <div
            className={`w-9 h-8 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === "assistant"
                ? "bg-violet-100 dark:bg-violet-950/70 scale-110 shadow-xs border border-violet-300 dark:border-violet-700"
                : "bg-violet-50/60 dark:bg-violet-950/30 group-hover:scale-105 group-hover:bg-violet-100/70"
            }`}
          >
            <SafeHerRobotAvatar size={24} />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none font-semibold">
            Assistant
          </span>
          {activeTab === "assistant" ? (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
