import React, { useState } from "react";
import { Phone, Share2, MapPin, AlertTriangle, ShieldCheck, Check, MessageSquare, MessageCircle, Copy } from "lucide-react";
import { LocationInfo, EmergencyContact } from "../types";
import {
  EmergencyCategory,
  EMERGENCY_TEMPLATES,
  generateCategorizedSosMessage,
  buildWhatsAppUrl,
  buildSmsUrl,
} from "../utils/helpers";

interface SosTabProps {
  location: LocationInfo;
  batteryLevel: number | null;
  contacts: EmergencyContact[];
  onTriggerSiren: () => void;
}

export const SosTab: React.FC<SosTabProps> = ({
  location,
  batteryLevel,
  contacts,
  onTriggerSiren,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>("immediate");
  const [copiedLocation, setCopiedLocation] = useState(false);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const currentMessage = generateCategorizedSosMessage(
    selectedCategory,
    location.latitude,
    location.longitude,
    batteryLevel
  );

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: "SafeHer Emergency SOS Location",
        text: currentMessage,
      }).catch(() => {
        copyToClipboard(currentMessage);
      });
    } else {
      copyToClipboard(currentMessage);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    const url = buildWhatsAppUrl(primaryContact?.phone, currentMessage);
    window.open(url, "_blank");
  };

  const handleSendSms = () => {
    const url = buildSmsUrl(primaryContact?.phone, currentMessage);
    window.location.href = url;
  };

  const handleFindPolice = () => {
    let url = "https://www.google.com/maps/search/police+station+near+me";
    if (location.latitude && location.longitude) {
      url = `https://www.google.com/maps/search/police+station+near+me/@${location.latitude},${location.longitude},14z`;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header - Native System Typography */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">🚨</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            Emergency Help
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Instant 1-tap emergency helplines & live GPS distress alerts.
        </p>
      </div>

      {/* 4 Emergency Helpline Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* 112 Emergency */}
        <a
          href="tel:112"
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/60 transition-all text-center flex flex-col items-center justify-center min-h-[135px] cursor-pointer group active:scale-98"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚨</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">112</h3>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Emergency All-in-One
          </p>
        </a>

        {/* 1090 Women Power Line */}
        <a
          href="tel:1090"
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/60 transition-all text-center flex flex-col items-center justify-center min-h-[135px] cursor-pointer group active:scale-98"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">👮‍♀️</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">1090</h3>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Women Helpline
          </p>
        </a>

        {/* 100 Police */}
        <a
          href="tel:100"
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/60 transition-all text-center flex flex-col items-center justify-center min-h-[135px] cursor-pointer group active:scale-98"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">👮</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">100</h3>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Police Control
          </p>
        </a>

        {/* 108 Ambulance */}
        <a
          href="tel:108"
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/60 transition-all text-center flex flex-col items-center justify-center min-h-[135px] cursor-pointer group active:scale-98"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🚑</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">108</h3>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Ambulance 108
          </p>
        </a>
      </div>

      {/* EMERGENCY MESSAGE (WhatsApp & SMS) with live location options */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span>💬</span>
            <span>Distress Alert</span>
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            GPS Live Attached
          </span>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {EMERGENCY_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedCategory(t.id)}
              className={`px-2.5 py-1.5 rounded-xl text-left text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === t.id
                  ? "bg-rose-500 text-white font-bold shadow-2xs"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 font-medium"
              }`}
            >
              <span>{t.icon}</span>
              <span className="truncate text-[11px]">{t.title}</span>
            </button>
          ))}
        </div>

        {/* Message preview snippet */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line">
          <p className="line-clamp-3">{currentMessage}</p>
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              {location.latitude
                ? `${location.latitude.toFixed(4)}°N, ${location.longitude?.toFixed(4)}°E`
                : "Fetching location..."}
            </span>
            <button
              onClick={() => copyToClipboard(currentMessage)}
              className="font-bold hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedLocation ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLocation ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Dual WhatsApp & Normal Text Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleSendWhatsApp}
            className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Alert</span>
          </button>

          <button
            onClick={handleSendSms}
            className="py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS Alert</span>
          </button>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Share Location via Other Channels */}
        <button
          onClick={handleShareLocation}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#E84E60] hover:bg-[#d43f50] text-white shadow-md shadow-rose-200 dark:shadow-rose-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide">
            {copiedLocation ? "Location Alert Copied!" : "Share Live GPS Location"}
          </span>
        </button>

        {/* Find Nearest Police Station */}
        <button
          onClick={handleFindPolice}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-300 dark:shadow-slate-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <span className="text-lg">👮</span>
          <span className="text-sm font-bold tracking-wide">
            Find Nearest Police Station
          </span>
        </button>
      </div>

      {/* Important Points Notice */}
      <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-semibold leading-snug">
          ⚡ <strong>Important:</strong> 1-Tap direct dials 112, 1090, 100 & 108 with live GPS.
        </p>
      </div>
    </div>
  );
};
