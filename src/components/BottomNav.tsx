import React from "react";
import { ActiveTab } from "../types";

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-rose-100/70 dark:border-slate-800 shadow-lg px-2 py-1.5 transition-colors">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-5 items-center justify-items-center">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center justify-center w-full py-1 cursor-pointer transition-all ${
            activeTab === "home" ? "text-[#E84E60] dark:text-rose-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">
            Home
          </span>
        </button>

        {/* 2. Contacts */}
        <button
          onClick={() => onSelectTab("contacts")}
          className={`flex flex-col items-center justify-center w-full py-1 cursor-pointer transition-all ${
            activeTab === "contacts" ? "text-[#E84E60] dark:text-rose-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="text-xl">👥</span>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">
            Contacts
          </span>
        </button>

        {/* 3. Central SOS Button */}
        <button
          onClick={() => {
            onSelectTab("sos");
            onSosTrigger();
          }}
          className="relative -top-2 flex flex-col items-center justify-center group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-12 h-11 bg-gradient-to-br from-[#FF4D61] to-[#E84E60] rounded-xl flex items-center justify-center shadow-md shadow-rose-300 dark:shadow-rose-950 text-white font-extrabold text-sm tracking-wider border-2 border-white dark:border-slate-800 animate-pulse">
            <span className="font-sans font-black tracking-widest text-[13px]">SOS</span>
          </div>
          <span className="text-[11px] font-bold text-[#E84E60] dark:text-rose-400 mt-0.5 leading-tight">
            SOS
          </span>
        </button>

        {/* 4. Tools */}
        <button
          onClick={() => onSelectTab("tools")}
          className={`flex flex-col items-center justify-center w-full py-1 cursor-pointer transition-all ${
            activeTab === "tools" ? "text-[#E84E60] dark:text-rose-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="text-xl">🛡️</span>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">
            Tools
          </span>
        </button>

        {/* 5. Assistant */}
        <button
          onClick={() => onSelectTab("assistant")}
          className={`flex flex-col items-center justify-center w-full py-1 cursor-pointer transition-all ${
            activeTab === "assistant" ? "text-[#E84E60] dark:text-rose-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="text-xl">🤖</span>
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">
            Assistant
          </span>
        </button>
      </div>
    </nav>
  );
};
