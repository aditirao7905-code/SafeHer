import React from "react";
import {
  ArrowLeft,
  X,
  Shield,
  ShieldCheck,
  Sparkles,
  Compass,
  Lock,
  Phone,
  Mic,
  Trash2,
  FileText,
  ExternalLink,
} from "lucide-react";

interface AboutSafeHerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSafeHerModal: React.FC<AboutSafeHerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col w-full h-full overflow-hidden select-none animate-fadeIn">
      {/* Container - Full page responsive column */}
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-white dark:bg-slate-900 md:border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        {/* Full-Page Top Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
              title="Back to Home Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  About SafeHer
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mission • Safety Architecture • National Helplines
              </p>
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

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 pb-24 text-slate-800 dark:text-slate-200">
          {/* 1. Hero Brand Presentation Card */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-rose-50 via-white to-pink-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30 border border-rose-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E63950] to-[#FB7185] flex items-center justify-center text-white shadow-lg shadow-rose-500/25 mb-3">
              <Shield className="w-9 h-9 fill-white/20 stroke-[2]" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              SafeHer <span className="text-[#FF2D55]">Ecosystem</span>
            </h1>
            <p className="text-xs font-bold text-[#FF2D55] mt-1">
              Smart Women Safety & Emergency Protection Platform
            </p>
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 text-[11px] font-extrabold text-slate-700 dark:text-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Version 2.4 • Production Certified • 2026</span>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              Empowering every woman, girl, and student with panic-proof protection, real-time emergency SOS defense, and confidential legal guidance across India.
            </p>
          </div>

          {/* 2. Founder & Lead Software Engineer Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Founder & Software Engineer</span>
            </div>

            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                Aditi Rao
              </div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Lead Software Engineer & Creator (Lucknow, Uttar Pradesh, India)
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs italic leading-relaxed text-slate-700 dark:text-slate-200">
              <div className="font-bold text-[#FF2D55] not-italic mb-1">💡 Vision & Core Philosophy:</div>
              “Technology should not only make our lives easier, it should make our lives safer.”
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              SafeHer was designed, architected, and developed by software engineer <strong>Aditi Rao</strong> with deep empathy for women’s real-world safety challenges. Combining rapid SOS engineering, real-time GPS dispatch, and emergency psychological de-escalation, she created SafeHer as a Tech-for-Good mission to protect women and students everywhere.
            </p>
          </div>

          {/* 3. Section: What is SafeHer? */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>What is SafeHer?</span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
              An All-in-One Instant Emergency Response & Personal Defense Ecosystem
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              SafeHer is a comprehensive digital safety and emergency response ecosystem built specifically for women, college girls, late-shift professionals, and solo travelers. Unlike traditional communication tools that require multiple confusing taps, SafeHer is engineered around <strong>zero-cognitive-overhead</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
                <span className="text-base shrink-0">⚡</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Instant 1-Tap SOS Defense:</strong> Triggers emergency acoustic alarms, generates live Google Maps GPS coordinates, and alerts primary trusted contacts without delay.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
                <span className="text-base shrink-0">📹</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Incident Evidence Capture:</strong> Record photo and video evidence stamped with verified date, time and GPS coordinates for police reports, with full data save and delete controls.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
                <span className="text-base shrink-0">🤖</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Multilingual Situational Assistant:</strong> Delivers instant step-by-step guidance in Hindi, Hinglish, English, Bengali, Punjabi, Marathi, and Urdu for stalking, harassment, cab safety, and emergencies.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
                <span className="text-base shrink-0">📞</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Tactical Fake Call Escape:</strong> Simulates a realistic incoming phone call with live audio dialog to help women gracefully de-escalate uncomfortable or threatening encounters.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
                <span className="text-base shrink-0">⚖️</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Direct Legal Rights Protection:</strong> Educates and provides immediate statutory references for Zero FIR under BNSS Section 173 (CrPC 154) and women arrest safeguards.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Section: Why SafeHer Exists? */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Why SafeHer Exists</span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
              Bridging the Critical Vulnerabilities of Real-World Women's Transit
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every day, millions of women navigate public transport, late-night transit, isolated routes, and unfamiliar cabs. SafeHer was created to solve five fundamental real-world vulnerabilities:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF2D55] text-base leading-none">•</span>
                <span><strong>Overcoming Panic Paralysis:</strong> During real danger, adrenaline causes motor fumbling. SafeHer replaces complex menus with prominent 1-touch panic controls and full-screen responsiveness.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF2D55] text-base leading-none">•</span>
                <span><strong>Cab & Auto Route Deviation Defense:</strong> When a driver takes an unexpected detour, SafeHer enables immediate 1-tap live GPS dispatch to family and police.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF2D55] text-base leading-none">•</span>
                <span><strong>Non-Confrontational Escape:</strong> Harassment often escalates if confronted. SafeHer's Fake Call lets women excuse themselves under the pretext of an urgent family call.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF2D55] text-base leading-none">•</span>
                <span><strong>Bridging the Legal Awareness Gap:</strong> Many women are denied help due to jurisdictional excuses. SafeHer clarifies the statutory power of Zero FIR so no victim is turned away.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF2D55] text-base leading-none">•</span>
                <span><strong>Fearless Freedom:</strong> No woman should ever have to abandon educational or professional aspirations due to transit insecurity.</span>
              </li>
            </ul>
          </div>

          {/* 5. Section: Comprehensive Privacy Policy & Data Security */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Privacy Policy & Data Security</span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
              Zero-Tracking, Local-First Architecture & Absolute Confidentiality
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              SafeHer is built on strict zero-surveillance and local-first privacy principles. We understand that personal safety data is sensitive:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>1. Zero Background Location Tracking</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  SafeHer NEVER continuously tracks, uploads, or stores your GPS coordinates in the background. Geolocation permissions are accessed strictly client-side and only when you intentionally trigger SOS, share WhatsApp location, or query safety routes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>2. Local Storage & Zero Data Brokering</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Your emergency contacts, incident reports, custom notes, and user preferences reside strictly in your device's secured browser sandbox (<code className="font-mono text-rose-500">localStorage</code>). We do NOT harvest, monetize, or sell user phone numbers or identity data to third-party data brokers.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span>3. Ephemeral Microphone & Audio Processing</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Speech recognition operates directly in-memory during active voice sessions. SafeHer does not record, archive, or upload private background room audio to any surveillance database.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>4. Direct Emergency Dispatch Without Middlemen</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Emergency calls (112, 1090) and WhatsApp SOS messages originate directly from your device's native telephony and messaging clients, eliminating third-party intercept vulnerabilities.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  <span>5. Absolute User Data Sovereignty</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  You maintain 100% control of your records. You can delete individual incident reports, wipe incident history, or delete trusted contacts instantly with a single tap.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Section: Official National Emergency Numbers */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-red-50 to-rose-50 dark:from-slate-900 dark:to-red-950/40 border border-red-200 dark:border-red-900/50 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Official 24x7 National Emergency Helplines</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 flex items-center justify-between hover:bg-red-50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="font-black text-red-600 text-sm">112</div>
                  <div className="text-[10px] text-slate-500">National Emergency (All-in-One)</div>
                </div>
                <Phone className="w-4 h-4 text-red-600" />
              </a>

              <a
                href="tel:1090"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between hover:bg-rose-50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="font-black text-rose-600 text-sm">1090</div>
                  <div className="text-[10px] text-slate-500">Women Power Line (24x7)</div>
                </div>
                <Phone className="w-4 h-4 text-rose-600" />
              </a>

              <a
                href="tel:181"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="font-black text-slate-800 dark:text-white text-sm">181</div>
                  <div className="text-[10px] text-slate-500">Women Domestic & Crisis</div>
                </div>
                <Phone className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="tel:1091"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="font-black text-slate-800 dark:text-white text-sm">1091</div>
                  <div className="text-[10px] text-slate-500">Women in Distress</div>
                </div>
                <Phone className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            SafeHer Ecosystem • Aditi Rao
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#E84E60] hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            Close & Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
