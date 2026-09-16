import React, { useState, useEffect } from "react";
import { MapPin, Navigation, AlertCircle, ShieldCheck, X, Compass, Route } from "lucide-react";

interface SafeRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLat?: number | null;
  userLng?: number | null;
}

export const SafeRouteModal: React.FC<SafeRouteModalProps> = ({
  isOpen,
  onClose,
  userLat,
  userLng,
}) => {
  const [destination, setDestination] = useState("Home (Green Park)");
  const [isTracking, setIsTracking] = useState(false);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [progress, setProgress] = useState(25); // percentage along route
  const [eta, setEta] = useState("14 mins");

  useEffect(() => {
    let interval: any;
    if (isTracking) {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 95) return 95;
          return p + 2;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800 animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-rose-50/40 dark:from-slate-800 dark:to-slate-850">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">Safe Route</h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Blue = on route, red = off route deviation
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
          {/* Destination input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Current Destination</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination (e.g., Home, Metro Station)"
                className="w-full text-xs font-medium text-slate-800 dark:text-slate-100 bg-transparent outline-hidden"
              />
            </div>
          </div>

          {/* Simulated Route Visualizer */}
          <div className="relative w-full h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
            {/* Background grid representing roads */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* SVG Path Route */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 320 180">
              {/* Route line */}
              <path
                d="M 40 140 Q 120 130 140 90 T 280 40"
                fill="none"
                stroke={isOffRoute ? "#ef4444" : "#3b82f6"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={isOffRoute ? "6 6" : "none"}
              />

              {/* Start Pin */}
              <circle cx="40" cy="140" r="7" fill="#10b981" />
              <text x="32" y="165" fontSize="10" fill="#64748b" fontWeight="600">Start</text>

              {/* Destination Pin */}
              <circle cx="280" cy="40" r="7" fill="#ef4444" />
              <text x="235" y="30" fontSize="10" fill="#64748b" fontWeight="600">Destination</text>

              {/* Current traveler position dot */}
              <circle
                cx={40 + (240 * progress) / 100 + (isOffRoute ? 25 : 0)}
                cy={140 - (100 * progress) / 100 + (isOffRoute ? 30 : 0)}
                r="8"
                fill={isOffRoute ? "#dc2626" : "#2563eb"}
                className="animate-pulse"
              />
            </svg>

            {/* Status pill overlay */}
            <div
              className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                isOffRoute
                  ? "bg-rose-500 text-white animate-bounce"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isOffRoute ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>DEVIATION DETECTED! OFF ROUTE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>On Safe Route • Normal</span>
                </>
              )}
            </div>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              ETA: {eta}
            </div>
          </div>

          {/* Route Status Summary */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Journey Progress</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100">{progress}% Completed</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Safe Corridor</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>
          </div>

          {/* Test Route Deviation Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Simulate Route Deviation</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Test if cab turns into unknown route</p>
            </div>
            <button
              onClick={() => setIsOffRoute(!isOffRoute)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isOffRoute
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              }`}
            >
              {isOffRoute ? "Off Route (Active)" : "Test Off Route"}
            </button>
          </div>

          {isOffRoute && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Deviation Alert Triggered!</p>
                <p className="text-[11px] mt-0.5 text-rose-700 dark:text-rose-300">
                  Vehicle has deviated 350m from designated path. Tap below to broadcast warning to your contacts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isTracking
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{isTracking ? "Pause Guidance" : "Start Live Guidance"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
