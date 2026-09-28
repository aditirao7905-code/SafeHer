import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  X,
  ArrowLeft,
  Phone,
  MessageSquare,
  Send,
  Share2,
  Copy,
  Check,
  MapPin,
  Volume2,
  VolumeX,
  EyeOff,
  AlertTriangle,
  Radio,
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
          : "bg-white dark:bg-slate-950"
      }`}
    >
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-white dark:bg-slate-900 md:border-x border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Full-Page Top Header */}
        <div className="shrink-0 p-4 bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 -ml-1 rounded-2xl hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Back to Home Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    Emergency SOS
                  </h2>
                  {triggeredByShake && (
                    <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                      Shake Triggered
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-rose-100 font-medium">
                  Live GPS • 1-Tap National Helplines & WhatsApp SOS
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Close Alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Stealth Badge */}
        <div className="shrink-0 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/50 px-4 py-2 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Silent Protection Active (No sound playing unless siren turned on)</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. INSTANT CALLING BUTTONS */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <span>📞</span>
                <span>Emergency Calls</span>
              </span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">1-Tap Dial</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 112 All Emergency */}
              <a
                href="tel:112"
                className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-slate-800 dark:text-red-100 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight">Call 112</div>
                  <div className="text-[10px] text-red-600 dark:text-red-300 font-semibold">All Emergency</div>
                </div>
              </a>

              {/* 108 Ambulance / Medical */}
              <a
                href="tel:108"
                className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-800 dark:text-emerald-100 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight">Call 108</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold">Ambulance</div>
                </div>
              </a>

              {/* 1090 Women Helpline */}
              <a
                href="tel:1090"
                className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-slate-800 dark:text-purple-100 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight">1090 Helpline</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-300 font-semibold">Women Line</div>
                </div>
              </a>

              {/* 100 Police PCR */}
              <a
                href="tel:100"
                className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-blue-100 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight">Call 100</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-300 font-semibold">Police PCR</div>
                </div>
              </a>
            </div>
          </div>

          {/* 2. EMERGENCY MESSAGE & LOCATION SHARING */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <span>💬</span>
                <span>Distress Alert</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                GPS Attached
              </span>
            </div>

            {/* Scenario selector tabs */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {EMERGENCY_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedCategory(tpl.id)}
                  className={`px-2 py-1.5 rounded-xl text-left flex items-center gap-1.5 transition-all cursor-pointer text-[11px] ${
                    selectedCategory === tpl.id
                      ? "bg-rose-500 text-white font-bold shadow-2xs"
                      : "bg-white dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 font-medium"
                  }`}
                >
                  <span className="text-xs shrink-0">{tpl.icon}</span>
                  <span className="truncate">{tpl.title}</span>
                </button>
              ))}
            </div>

            {/* Message Preview Box */}
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line relative">
              <p className="line-clamp-3 text-[11px]">{currentMessage}</p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  {location?.latitude
                    ? `${location.latitude.toFixed(4)}°N, ${location.longitude?.toFixed(4)}°E`
                    : "Fetching GPS..."}
                </span>
                <button
                  onClick={handleCopyMessage}
                  className="hover:text-rose-600 flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* DIRECT ACTION BUTTONS: WhatsApp & Normal SMS */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* WhatsApp Button */}
              <button
                onClick={() => handleSendWhatsApp()}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-98"
              >
                <span className="text-sm">💬</span>
                <span>WhatsApp Alert</span>
              </button>

              {/* Normal SMS Button */}
              <button
                onClick={() => handleSendSms()}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS Alert</span>
              </button>
            </div>

            {/* Share link options */}
            <button
              onClick={handleShareNative}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>Share via Other Apps</span>
            </button>
          </div>

          {/* 3. OPTIONAL LOUD SIREN */}
          <div>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Audible Siren</span>
                </h4>
                <p className="text-[10px] text-amber-700 dark:text-amber-300/90 leading-tight">
                  Attract public crowd (Keep OFF if stealth needed)
                </p>
              </div>

              <button
                onClick={() => setIsLoudSirenActive(!isLoudSirenActive)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                  isLoudSirenActive
                    ? "bg-red-600 text-white shadow-md animate-pulse"
                    : "bg-white dark:bg-slate-800 border border-amber-300 text-amber-900 dark:text-amber-200 hover:bg-amber-100"
                }`}
              >
                {isLoudSirenActive ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Sound Siren</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Dismiss */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">
            Safe now?
          </span>
          <button
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-all"
          >
            Close SOS
          </button>
        </div>
      </div>
    </div>
  );
};
