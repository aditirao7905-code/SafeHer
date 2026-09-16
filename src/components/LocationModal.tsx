import React, { useState } from "react";
import { X, MapPin, Share2, ExternalLink, RefreshCw, Check, MessageSquare } from "lucide-react";
import { LocationInfo, EmergencyContact } from "../types";
import { generateSosMessage, buildWhatsAppUrl, buildSmsUrl } from "../utils/helpers";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationInfo;
  onRefreshLocation: () => void;
  batteryLevel: number | null;
  contacts: EmergencyContact[];
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onRefreshLocation,
  batteryLevel,
  contacts,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mapUrl = location.latitude && location.longitude
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : "";

  const handleCopyLink = () => {
    if (mapUrl) {
      navigator.clipboard?.writeText(mapUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const primaryContact = contacts[0];
  const shareText = generateSosMessage(location.latitude, location.longitude, batteryLevel);
  const whatsappUrl = buildWhatsAppUrl(primaryContact?.phone, shareText);
  const smsUrl = buildSmsUrl(primaryContact?.phone, shareText);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800 animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-50/70 to-rose-50/40 dark:from-slate-800 dark:to-slate-850">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">My Live Location</h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                High-precision GPS coordinates & map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Coordinates Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">GPS Fixed</span>
              </div>
              <button
                onClick={onRefreshLocation}
                className="flex items-center gap-1 text-[11px] font-bold text-[#E84E60] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            {location.latitude && location.longitude ? (
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400 font-medium">Latitude:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{location.latitude.toFixed(6)}° N</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400 font-medium">Longitude:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{location.longitude.toFixed(6)}° E</span>
                </div>
                {location.accuracy && (
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 font-medium">Accuracy:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">± {Math.round(location.accuracy)} meters</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-500">
                {location.loading ? "Acquiring satellite lock..." : "Location not available. Please allow browser location."}
              </div>
            )}
          </div>

          {/* Interactive Google Map Preview / Link */}
          {mapUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 relative h-32 flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center animate-ping absolute"></div>
              <MapPin className="w-7 h-7 text-[#E84E60] relative z-10 drop-shadow-md" />
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 relative z-10 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#E84E60] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Direct WhatsApp and SMS Location Sharing Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
            >
              <span className="text-base leading-none">💬</span>
              <span>WhatsApp Live</span>
            </a>

            <a
              href={smsUrl}
              className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS Location</span>
            </a>
          </div>

          {/* Copy Coordinates Link */}
          <button
            onClick={handleCopyLink}
            className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-rose-500" />}
            <span>{copied ? "Google Maps Link Copied!" : "Copy Map Coordinates Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
