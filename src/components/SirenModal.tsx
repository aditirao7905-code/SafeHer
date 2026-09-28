import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  X,
  ArrowLeft,
  Phone,
  PhoneCall,
  MessageSquare,
  Share2,
  Copy,
  Check,
  MapPin,
  Volume2,
  VolumeX,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { LocationInfo, EmergencyContact } from "../types";
import {
  EmergencyCategory,
  EMERGENCY_TEMPLATES,
  generateCategorizedSosMessage,
  buildWhatsAppUrl,
  buildSmsUrl,
} from "../utils/helpers";
import { soundManager } from "../utils/audio";

interface SirenModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: LocationInfo;
  batteryLevel?: number | null;
  contacts?: EmergencyContact[];
  triggeredByShake?: boolean;
  isCountdown?: boolean;
}

export const SirenModal: React.FC<SirenModalProps> = ({
  isOpen,
  onClose,
  location,
  batteryLevel,
  contacts = [],
  triggeredByShake = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>("immediate");
  const [customText, setCustomText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoudSirenActive, setIsLoudSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<"red" | "blue">("red");

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  // Silent SOS mode on open: strictly ensure NO sound plays unless explicitly requested
  useEffect(() => {
    if (!isOpen) {
      soundManager.stopSiren();
      setIsLoudSirenActive(false);
      setIsStrobeActive(false);
      return;
    }

    // Silence any previous audio
    soundManager.stopSiren();
    setIsLoudSirenActive(false);

    // Discreet haptic vibration for silent confirmation
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([150, 80, 150]);
      } catch (e) {}
    }

    return () => {
      soundManager.stopSiren();
    };
  }, [isOpen]);

  // Handle loud siren toggle
  useEffect(() => {
    if (!isOpen) return;

    if (isLoudSirenActive) {
      soundManager.startSiren();
    } else {
      soundManager.stopSiren();
    }
  }, [isOpen, isLoudSirenActive]);

  // Optional visual strobe if loud siren enabled
  useEffect(() => {
    if (!isOpen || !isStrobeActive || !isLoudSirenActive) return;

    const interval = setInterval(() => {
      setStrobeColor((c) => (c === "red" ? "blue" : "red"));
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, isStrobeActive, isLoudSirenActive]);

  if (!isOpen) return null;

  const currentMessage = generateCategorizedSosMessage(
    selectedCategory,
    location?.latitude,
    location?.longitude,
    batteryLevel,
    customText
  );

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = (contact?: EmergencyContact) => {
    const url = buildWhatsAppUrl(contact?.phone || primaryContact?.phone, currentMessage);
    window.open(url, "_blank");
  };

  const handleSendSms = (contact?: EmergencyContact) => {
    const url = buildSmsUrl(contact?.phone || primaryContact?.phone, currentMessage);
    window.location.href = url;
  };

  const handleShareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: "SafeHer Emergency SOS Alert",
        text: currentMessage,
      }).catch(() => {
        handleCopyMessage();
      });
    } else {
      handleCopyMessage();
    }
  };

  const handleClose = () => {
    soundManager.stopSiren();
    setIsLoudSirenActive(false);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-hidden select-none animate-fadeIn transition-colors duration-150 ${
        isLoudSirenActive && isStrobeActive
          ? strobeColor === "red"
            ? "bg-red-700"
            : "bg-blue-700"
          : "bg-slate-900/60 backdrop-blur-sm"
      }`}
    >
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-slate-50 dark:bg-slate-950 md:border-x border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Professional Deep Crimson Top Header */}
        <div className="shrink-0 px-4 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 -ml-1 rounded-2xl hover:bg-white/20 active:bg-white/30 text-white cursor-pointer transition-colors"
              title="Back to Home Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-xs shrink-0">
                <span className="animate-pulse">🚨</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    Emergency SOS
                  </h2>
                  {triggeredByShake && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-xs">
                      Shake Triggered
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-rose-100 font-medium leading-none mt-0.5">
                  Direct Helplines • Live GPS • WhatsApp Dispatch
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Close Alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. DIRECT EMERGENCY CALLING BUTTONS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Direct Emergency Helplines</span>
              </span>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-extrabold uppercase tracking-wide bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200/60 dark:border-red-900/60">
                1-Tap Call
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 112 National Emergency */}
              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 hover:border-red-400 dark:hover:border-red-700 hover:shadow-md transition-all cursor-pointer group flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    Call 112
                  </div>
                  <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold truncate">
                    All Emergency
                  </div>
                </div>
              </a>

              {/* 1090 Women Helpline */}
              <a
                href="tel:1090"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 hover:border-purple-400 dark:hover:border-purple-700 hover:shadow-md transition-all cursor-pointer group flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    1090 Helpline
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold truncate">
                    Women Safety Line
                  </div>
                </div>
              </a>

              {/* 100 Police PCR */}
              <a
                href="tel:100"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    Call 100
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                    Police Control Room
                  </div>
                </div>
              </a>

              {/* 108 Ambulance */}
              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer group flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    Call 108
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                    Medical Ambulance
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* 2. DISTRESS ALERT & DISPATCH */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                <span>Distress Message Alert</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>GPS Live</span>
              </span>
            </div>

            {/* Scenario selector tabs */}
            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedCategory(tpl.id)}
                  className={`p-2.5 rounded-2xl text-left flex items-center gap-2 transition-all cursor-pointer text-xs ${
                    selectedCategory === tpl.id
                      ? "bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 font-medium"
                  }`}
                >
                  <span className="text-sm shrink-0">{tpl.icon}</span>
                  <span className="truncate text-[11px] font-bold">{tpl.title}</span>
                </button>
              ))}
            </div>

            {/* Message Preview Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line relative">
              <p className="text-[11px] text-slate-800 dark:text-slate-100 font-medium line-clamp-3">
                {currentMessage}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {location?.latitude
                    ? `${location.latitude.toFixed(4)}°N, ${location.longitude?.toFixed(4)}°E`
                    : "Fetching GPS coordinates..."}
                </span>
                <button
                  onClick={handleCopyMessage}
                  className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 font-bold cursor-pointer transition-colors text-[10px]"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* DIRECT ACTION BUTTONS: WhatsApp & Normal SMS */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* WhatsApp Button */}
              <button
                onClick={() => handleSendWhatsApp()}
                className="py-3 px-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-base leading-none">💬</span>
                <span>WhatsApp Alert</span>
              </button>

              {/* Normal SMS Button */}
              <button
                onClick={() => handleSendSms()}
                className="py-3 px-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS Alert</span>
              </button>
            </div>

            {/* Share link options */}
            <button
              onClick={handleShareNative}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200/80 dark:border-slate-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via Other Apps</span>
            </button>
          </div>

          {/* 3. OPTIONAL AUDIBLE SIREN DETERRENT */}
          <div className="p-3.5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3 shadow-xs">
            <div className="min-w-0">
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Audible Siren Deterrent</span>
              </h4>
              <p className="text-[10px] text-amber-700 dark:text-amber-300/90 leading-tight mt-0.5">
                High-volume siren to scare away threats or attract nearby public
              </p>
            </div>

            <button
              onClick={() => setIsLoudSirenActive(!isLoudSirenActive)}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                isLoudSirenActive
                  ? "bg-red-600 text-white shadow-md animate-pulse hover:bg-red-700"
                  : "bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-slate-800 shadow-xs"
              }`}
            >
              {isLoudSirenActive ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Siren</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Sound Siren</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Dismiss Bar */}
        <div className="shrink-0 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Are you in a safe place now?
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs cursor-pointer transition-all shadow-sm"
          >
            Close SOS
          </button>
        </div>
      </div>
    </div>
  );
};
