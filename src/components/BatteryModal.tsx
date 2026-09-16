import React from "react";
import {
  Battery,
  BatteryCharging,
  BatteryWarning,
  Zap,
  ShieldCheck,
  Power,
  X,
  AlertTriangle,
  Radio,
  Sliders,
} from "lucide-react";

interface BatteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  batteryLevel: number | null;
  setBatteryLevel: (level: number) => void;
  isBatterySaverOn: boolean;
  onToggleBatterySaver: () => void;
}

export const BatteryModal: React.FC<BatteryModalProps> = ({
  isOpen,
  onClose,
  batteryLevel,
  setBatteryLevel,
  isBatterySaverOn,
  onToggleBatterySaver,
}) => {
  if (!isOpen) return null;

  const currentLevel = batteryLevel ?? 84;
  const isCritical = currentLevel <= 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              isCritical
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
            }`}>
              {isCritical ? <BatteryWarning className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                Battery Monitor & Saver
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Emergency Power Optimization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Battery Level Visual Gauge */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isCritical
            ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
            : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Charge Status
            </span>
            <span className={`text-sm font-black ${
              currentLevel <= 20
                ? "text-rose-600 dark:text-rose-400 animate-pulse"
                : currentLevel <= 40
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}>
              {currentLevel}%
            </span>
          </div>

          {/* Gauge Bar */}
          <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                currentLevel <= 20
                  ? "bg-rose-500 animate-pulse"
                  : currentLevel <= 40
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.max(5, currentLevel)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>0% Empty</span>
            <span>20% Auto-Saver Threshold</span>
            <span>100% Full</span>
          </div>
        </div>

        {/* Low Battery Warning Banner (Shows when <= 20%) */}
        {isCritical && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-800 dark:text-rose-200 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-[11px] leading-snug">
              <span className="font-black block">Warning: Low Battery (≤ 20%)</span>
              Battery is critically low at {currentLevel}%. Battery Saver is active to guarantee emergency SOS and GPS availability.
            </div>
          </div>
        )}

        {/* Battery Saver Mode Toggle Card */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isBatterySaverOn
            ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isBatterySaverOn
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}>
                <Power className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Battery Saver Mode
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isBatterySaverOn ? "Active • Conserving power" : "Turn on to save 40%+ battery"}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleBatterySaver}
              className={`px-3 py-1.5 rounded-full text-xs font-black cursor-pointer transition-all ${
                isBatterySaverOn
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {isBatterySaverOn ? "SAVER ON" : "SAVER OFF"}
            </button>
          </div>

          {/* Saver Feature Checklist */}
          <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 space-y-1.5 text-[10px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto-activates when battery is at or below 20%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Optimizes background GPS polling to preserve distress standby</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Reduces UI visual transitions and screen load</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Testing Controls (Requested for proper verification) */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3 h-3 text-slate-400" />
              Battery Testing Controls
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setBatteryLevel(11)}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[10px] font-bold hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer text-center"
            >
              Test 11% (Critical)
            </button>
            <button
              onClick={() => setBatteryLevel(20)}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 text-[10px] font-bold hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer text-center"
            >
              Test 20% (Threshold)
            </button>
            <button
              onClick={() => setBatteryLevel(85)}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer text-center"
            >
              Reset 85% (Good)
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
