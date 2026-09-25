import React from "react";
import { Shield, Sparkles, Phone, MessageSquare, AlertTriangle } from "lucide-react";
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
  isBatterySaverOn?: boolean;
  location: LocationInfo;
  safeStatusText: string;
}

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
}) => {
  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/10 via-orange-500/5 to-pink-500/10 dark:from-rose-950/40 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/40 p-5 shadow-xs">
        <div className="relative z-10 flex items-start justify-between">
          <div className="max-w-[75%]">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
              <span>WELCOME</span>
              <span>👋</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#E84E60] dark:text-rose-400 tracking-tight leading-tight mb-1">
              SafeHer Protection
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Smart safety & instant emergency response.
            </p>
          </div>

          <div className="w-13 h-13 rounded-2xl bg-white/90 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0">
            <Shield className="w-8 h-8 text-[#4A8EC2] fill-[#78B4DC]/30 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* 2. EMERGENCY SOS SECTION (Silent by default for privacy) */}
      <div className="flex flex-col items-center justify-center text-center pt-1">
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest mb-3">
          <span>🚨</span>
          <span>EMERGENCY SOS</span>
        </div>

        {/* Big Pulsing SOS Button */}
        <button
          onClick={onSosClick}
          aria-label="Emergency SOS Press for Help"
          className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#E63950] via-[#F43F5E] to-[#FB7185] flex flex-col items-center justify-center text-white shadow-xl shadow-rose-500/30 animate-sos-pulse cursor-pointer active:scale-95 transition-transform group"
        >
          {/* Inner ring */}
          <div className="w-38 h-38 rounded-full border-2 border-white/40 flex flex-col items-center justify-center p-4">
            <span className="text-4xl font-black tracking-wider text-white drop-shadow-md my-0.5 font-sans">
              SOS
            </span>
            <span className="text-[11px] font-black tracking-widest uppercase text-white/95 mt-1">
              PRESS FOR HELP
            </span>
          </div>
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-3 max-w-xs leading-tight px-4 text-center">
          ⚡ 1-Tap WhatsApp, SMS & Live GPS alert
        </p>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Quick Actions</h3>
          <span className="text-amber-500 text-sm">⚡</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* My Location */}
          <button
            onClick={onCheckLocation}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-100 dark:hover:border-rose-900/40 transition-all text-left flex flex-col justify-between min-h-[90px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">📍</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Live Location
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {location.latitude ? "GPS locked • Tap to view" : "Share GPS map"}
              </p>
            </div>
          </button>

          {/* Fake Call */}
          <button
            onClick={onOpenFakeCall}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-100 dark:hover:border-rose-900/40 transition-all text-left flex flex-col justify-between min-h-[90px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">📱</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Fake Call
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Discreet escape ring</p>
            </div>
          </button>

          {/* Battery Check */}
          <button
            onClick={onCheckBattery}
            className={`p-3.5 rounded-3xl border shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[90px] cursor-pointer active:scale-98 ${
              isBatterySaverOn
                ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                : (batteryLevel ?? 84) <= 20
                ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 animate-pulse"
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🔋</span>
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
                Battery & Saver
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {(batteryLevel ?? 84) <= 20 ? "Low Warning (≤20%)" : isBatterySaverOn ? "Power Saver Active" : "Tap for settings"}
              </p>
            </div>
          </button>

          {/* I'm Safe */}
          <button
            onClick={onTriggerImSafe}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all text-left flex flex-col justify-between min-h-[90px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">✅</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                I'm Safe
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Share safe status</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. SMART SAFETY TOOLS */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Smart Safety Tools</h3>
          <span className="text-amber-500 text-sm">✨</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Shake-to-SOS */}
          <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-[105px]">
            <div className="flex items-center justify-between">
              <span className="text-lg">😲</span>
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
                Shake for SOS
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isShakeEnabled ? "Active • Shake phone" : "Tap to activate"}
              </p>
            </div>
          </div>

          {/* Safe Route */}
          <button
            onClick={onOpenSafeRoute}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">🗺️</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Safe Route
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Deviation tracking</p>
            </div>
          </button>

          {/* Smart Assistant */}
          <button
            onClick={() => onNavigateTab("assistant")}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">🤖</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                AI Voice Help
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Talk or send audio</p>
            </div>
          </button>

          {/* Safety Score */}
          <button
            onClick={onOpenSafetyScore}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">📊</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Safety Score
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Check preparedness</p>
            </div>
          </button>

          {/* Voice SOS */}
          <button
            onClick={onToggleVoiceSos}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🎤</span>
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
                Voice Keyword SOS
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Says "Help" or "Bachao"</p>
            </div>
          </button>

          {/* Quick Exit */}
          <button
            onClick={onQuickExit}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[105px] cursor-pointer active:scale-98"
          >
            <span className="text-lg">🚪</span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Quick Exit
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Calculator disguise</p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. YOU'RE SAFE STATUS CARD */}
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
      <div className="pt-3 pb-6 text-center space-y-2">
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
