import React from "react";
import { Shield, Menu, Sun, Moon, Monitor } from "lucide-react";
import { ThemeMode } from "../types";

interface HeaderProps {
  onOpenDrawer: () => void;
  theme: ThemeMode;
  onCycleTheme: () => void;
  onSosClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  theme,
  onCycleTheme,
  onSosClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-rose-100/60 dark:border-slate-800 px-4 py-2.5 shadow-xs transition-colors">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Shield Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-50 to-rose-50 dark:from-slate-800 dark:to-rose-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-xs">
            <div className="relative">
              <Shield className="w-6 h-6 text-[#4A8EC2] fill-[#78B4DC]/30 stroke-[1.8]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#E84E60] dark:text-rose-400 leading-none">
                SafeHer
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-tight leading-tight mt-0.5">
              A Smart Women Safety Assistant
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle & Hamburger Menu */}
        <div className="flex items-center gap-1.5">
          {/* Quick Theme Toggle: System -> Light -> Dark */}
          <button
            onClick={onCycleTheme}
            title={`Theme: ${theme.toUpperCase()} (Tap to switch)`}
            aria-label="Switch Theme"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Monitor className="w-4 h-4 text-blue-500" />
            )}
          </button>

          {/* Quick SOS Trigger icon button */}
          <button
            onClick={onSosClick}
            title="Silent SOS Emergency"
            aria-label="Emergency SOS"
            className="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <span>SOS</span>
          </button>

          {/* Drawer Menu Button */}
          <button
            onClick={onOpenDrawer}
            aria-label="Open Navigation Drawer"
            className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
          >
            <Menu className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
