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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)] px-3 pt-2.5 pb-3 transition-colors">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-around relative">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "home"
              ? "text-rose-600 dark:text-rose-400 font-black"
              : "text-slate-600 dark:text-slate-300 hover:text-rose-600 font-semibold"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs transition-all ${
              activeTab === "home"
                ? "scale-110 shadow-md shadow-rose-500/30 ring-2 ring-rose-400/50"
                : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
            }`}
          >
            <Home className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none">
            Home
          </span>
        </button>

        {/* 2. Contacts */}
        <button
          onClick={() => onSelectTab("contacts")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "contacts"
              ? "text-indigo-600 dark:text-indigo-400 font-black"
              : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-semibold"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-xs transition-all ${
              activeTab === "contacts"
                ? "scale-110 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/50"
                : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
            }`}
          >
            <Users className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none">
            Contacts
          </span>
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
              ? "text-sky-600 dark:text-sky-400 font-black"
              : "text-slate-600 dark:text-slate-300 hover:text-sky-600 font-semibold"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xs transition-all ${
              activeTab === "tools"
                ? "scale-110 shadow-md shadow-sky-500/30 ring-2 ring-sky-400/50"
                : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
            }`}
          >
            <Shield className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none">
            Tools
          </span>
        </button>

        {/* 5. Assistant */}
        <button
          onClick={() => onSelectTab("assistant")}
          className={`flex flex-col items-center justify-center min-w-[56px] py-0.5 cursor-pointer transition-all active:scale-95 group ${
            activeTab === "assistant"
              ? "text-violet-600 dark:text-violet-400 font-black"
              : "text-slate-600 dark:text-slate-300 hover:text-violet-600 font-semibold"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-violet-100 to-fuchsia-100 dark:bg-violet-950/70 border border-violet-200/80 dark:border-violet-800 shadow-xs transition-all ${
              activeTab === "assistant"
                ? "scale-110 shadow-md shadow-violet-500/20 ring-2 ring-violet-400/50"
                : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
            }`}
          >
            <SafeHerRobotAvatar size={24} />
          </div>
          <span className="text-[11px] tracking-tight mt-1 leading-none">
            Assistant
          </span>
        </button>
      </div>
    </nav>
  );
};
