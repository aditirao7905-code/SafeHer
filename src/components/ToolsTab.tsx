import React, { useState } from "react";
import { Shield, MapPin, Phone, ExternalLink, X, Navigation } from "lucide-react";
import { LocationInfo, SafePlace } from "../types";

interface ToolsTabProps {
  isShakeEnabled: boolean;
  onToggleShake: () => void;
  onSimulateShake?: () => void;
  isVoiceSosEnabled: boolean;
  onToggleVoiceSos: () => void;
  onOpenBattery?: () => void;
  isBatterySaverOn?: boolean;
  batteryLevel?: number | null;
  onOpenSafeRoute: () => void;
  onCheckLocation: () => void;
  onOpenSafetyScore: () => void;
  onTriggerSiren: () => void;
  onOpenFakeCall: () => void;
  onQuickExit: () => void;
  location: LocationInfo;
}

const SAMPLE_SAFE_PLACES: SafePlace[] = [
  {
    id: "sp1",
    name: "Central Police Station & Women Help Desk",
    type: "police",
    distance: "0.8 km",
    address: "Civil Lines Main Road, Near Court Complex",
    phone: "112",
  },
  {
    id: "sp2",
    name: "District Government Hospital (24x7 Emergency)",
    type: "hospital",
    distance: "1.4 km",
    address: "Medical Enclave, Block B",
    phone: "108",
  },
  {
    id: "sp3",
    name: "Special Police Unit for Women & Children (SPUWAC)",
    type: "women_cell",
    distance: "2.1 km",
    address: "Sector 9 Institutional Area",
    phone: "1090",
  },
  {
    id: "sp4",
    name: "Metro Station Police Post & Help Booth",
    type: "metro",
    distance: "0.5 km",
    address: "Gate No. 2, Metro Interchange",
    phone: "1511",
  },
];

export const ToolsTab: React.FC<ToolsTabProps> = ({
  isShakeEnabled,
  onToggleShake,
  onSimulateShake,
  isVoiceSosEnabled,
  onToggleVoiceSos,
  onOpenBattery,
  isBatterySaverOn = false,
  batteryLevel = 84,
  onOpenSafeRoute,
  onCheckLocation,
  onOpenSafetyScore,
  onTriggerSiren,
  onOpenFakeCall,
  onQuickExit,
  location,
}) => {
  const [showSafePlacesModal, setShowSafePlacesModal] = useState(false);

  const openGoogleMapsSearch = (query: string) => {
    let url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    if (location.latitude && location.longitude) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.latitude},${location.longitude},14z`;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">🛡️</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            Safety & Protection Tools
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Emergency response, stealth escape, and live utilities.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Shake-to-SOS */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center justify-between">
            <span className="text-2xl">😲</span>
            <button
              onClick={onToggleShake}
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                isShakeEnabled
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {isShakeEnabled ? "ACTIVE" : "OFF"}
            </button>
          </div>
          <div onClick={onToggleShake} className="cursor-pointer">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Shake for SOS
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isShakeEnabled ? "Active • 2 quick shakes" : "Tap to activate"}
            </p>
          </div>
        </div>

        {/* Voice SOS (Clean - no Test button as requested) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px]">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🎤</span>
            <button
              onClick={onToggleVoiceSos}
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                isVoiceSosEnabled
                  ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {isVoiceSosEnabled ? "LISTENING" : "OFF"}
            </button>
          </div>
          <div onClick={onToggleVoiceSos} className="cursor-pointer">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Voice SOS
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Say "Help" or "Bachao"
            </p>
          </div>
        </div>

        {/* Battery Monitor & Saver Tool */}
        <div
          onClick={onOpenBattery}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🔋</span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isBatterySaverOn
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : (batteryLevel ?? 84) <= 20
                  ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {isBatterySaverOn ? "SAVER ON" : `${batteryLevel ?? 84}%`}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Battery Saver
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {(batteryLevel ?? 84) <= 20 ? "Auto-Saver active (≤20%)" : "Preserve SOS standby"}
            </p>
          </div>
        </div>

        {/* Safe Route Tracker */}
        <button
          onClick={onOpenSafeRoute}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">🗺️</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Safe Route
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Deviation & travel tracker
            </p>
          </div>
        </button>

        {/* Live Location */}
        <button
          onClick={onCheckLocation}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">📍</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Live Location
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              GPS coordinates & map
            </p>
          </div>
        </button>

        {/* Safe Places */}
        <button
          onClick={() => setShowSafePlacesModal(true)}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">🏥</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Safe Places
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Police booths & hospitals
            </p>
          </div>
        </button>

        {/* Safety Score */}
        <button
          onClick={onOpenSafetyScore}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">📊</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Safety Score
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Preparedness check
            </p>
          </div>
        </button>

        {/* Fake Call */}
        <button
          onClick={onOpenFakeCall}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">📱</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Fake Call
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Discreet escape ring
            </p>
          </div>
        </button>

        {/* Quick Exit Disguise */}
        <button
          onClick={onQuickExit}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer active:scale-98"
        >
          <span className="text-2xl">🚪</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Quick Exit
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Calculator disguise
            </p>
          </div>
        </button>
      </div>

      {/* Safe Places Modal */}
      {showSafePlacesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800 animate-fadeIn">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-blue-50/40 dark:from-slate-800 dark:to-slate-850">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    Safe Places Nearby
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Verified shelters, police stations & 24/7 help centers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSafePlacesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Find Buttons */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => openGoogleMapsSearch("police station near me")}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>👮 Find Police</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => openGoogleMapsSearch("hospital emergency 24 hours near me")}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>🏥 Find Hospital</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-3">
              {SAMPLE_SAFE_PLACES.map((place) => (
                <div
                  key={place.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{place.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                      {place.distance}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{place.address}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                    <a
                      href={`tel:${place.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {place.phone}</span>
                    </a>

                    <button
                      onClick={() => openGoogleMapsSearch(place.name + " " + place.address)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 flex justify-end">
              <button
                onClick={() => setShowSafePlacesModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Safe Places
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
