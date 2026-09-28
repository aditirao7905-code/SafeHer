import React from "react";
import { CheckCircle2, AlertCircle, X, Shield, ArrowRight, ArrowLeft, BarChart3 } from "lucide-react";
import { EmergencyContact } from "../types";

interface SafetyScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  hasLocation: boolean;
  isShakeEnabled: boolean;
  isVoiceSosEnabled: boolean;
  batteryLevel: number | null;
  onNavigateTab: (tab: any) => void;
}

export const SafetyScoreModal: React.FC<SafetyScoreModalProps> = ({
  isOpen,
  onClose,
  contacts,
  hasLocation,
  isShakeEnabled,
  isVoiceSosEnabled,
  batteryLevel,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  // Calculate score items
  const checks = [
    {
      title: "Emergency Contacts",
      desc: contacts.length >= 2 ? `${contacts.length} contacts saved` : "Add 2+ emergency contacts",
      passed: contacts.length >= 2,
      points: 25,
      action: () => {
        onClose();
        onNavigateTab("contacts");
      },
      actionText: "Manage Contacts",
    },
    {
      title: "Live GPS Location",
      desc: hasLocation ? "Location active & ready" : "Enable GPS access",
      passed: hasLocation,
      points: 20,
    },
    {
      title: "Shake for SOS",
      desc: isShakeEnabled ? "Motion trigger active" : "Enable shake in Tools",
      passed: isShakeEnabled,
      points: 15,
      action: () => {
        onClose();
        onNavigateTab("tools");
      },
      actionText: "Enable Shake",
    },
    {
      title: "Voice SOS",
      desc: isVoiceSosEnabled ? "Listening for Help / Bachao" : "Enable voice in Tools",
      passed: isVoiceSosEnabled,
      points: 15,
      action: () => {
        onClose();
        onNavigateTab("tools");
      },
      actionText: "Enable Voice",
    },
    {
      title: "Battery Level",
      desc: batteryLevel !== null && batteryLevel > 20 ? `Battery at ${batteryLevel}%` : "Keep battery above 20%",
      passed: batteryLevel === null || batteryLevel > 20,
      points: 15,
    },
    {
      title: "Helpline Readiness",
      desc: "112, 1090 & 100 direct dial ready",
      passed: true,
      points: 10,
    },
  ];

  const totalScore = checks.reduce((acc, curr) => (curr.passed ? acc + curr.points : acc), 0);

  const getScoreColor = () => {
    if (totalScore >= 80) return "text-emerald-500 stroke-emerald-500";
    if (totalScore >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col w-full h-full overflow-hidden select-none animate-fadeIn">
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-white dark:bg-slate-900 md:border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        {/* Full-Page Top Header */}
        <div className="shrink-0 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-50/70 to-rose-50/40 dark:from-slate-800 dark:to-slate-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                    Safety Score Analysis
                  </h3>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Personal readiness & protection preparedness index
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Score Badge */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-400 block mb-1">
                Current Readiness
              </span>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                {totalScore} <span className="text-base font-normal text-slate-400">/ 100</span>
              </h2>
              <p className="text-xs font-semibold mt-1 text-slate-600 dark:text-slate-300">
                {totalScore >= 80
                  ? "🛡️ High Protection — Ready for travel"
                  : totalScore >= 50
                  ? "⚠️ Moderate Protection — Complete actions below"
                  : "🚨 Low Protection — Setup recommended"}
              </p>
            </div>

            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getScoreColor()}
                  strokeDasharray={`${totalScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Shield className={`absolute w-8 h-8 ${totalScore >= 80 ? "text-emerald-500" : "text-rose-500"}`} />
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Safety Readiness Checklist
            </h4>

            {checks.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  {item.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                        +{item.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>

                {!item.passed && item.action && (
                  <button
                    onClick={item.action}
                    className="shrink-0 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
