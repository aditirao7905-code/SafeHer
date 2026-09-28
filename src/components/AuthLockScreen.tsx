import React, { useState } from "react";
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  UserPlus,
  AlertTriangle,
  Mail,
  CheckCircle2,
} from "lucide-react";

interface AuthLockScreenProps {
  onLoginPrimary: () => void;
  onLoginAnother: (name: string, email: string) => void;
  onEmergencySos: () => void;
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({
  onLoginPrimary,
  onLoginAnother,
  onEmergencySos,
}) => {
  const [showAnotherForm, setShowAnotherForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnotherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!emailInput.trim() || !emailInput.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg("");
    onLoginAnother(nameInput.trim(), emailInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto select-none animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 my-auto">
        {/* SafeHer Emblem & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative">
            <div className="w-18 h-18 rounded-3xl bg-linear-to-tr from-[#E63950] via-[#F43F5E] to-[#FB7185] flex items-center justify-center text-white shadow-xl shadow-rose-500/30 animate-pulse">
              <Shield className="w-10 h-10 fill-white/20 stroke-[2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-amber-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              SafeHer <span className="text-[#E84E60]">Protection</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Smart Women Safety Assistant
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-slate-800 border border-rose-200/80 dark:border-slate-700 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            <span>👩‍💻 Developed by</span>
            <span className="font-extrabold">Aditi Rao</span>
          </div>
        </div>

        {/* Lock Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-tight">
            Account logged out. Please sign in to resume personalized safety protection and features.
          </div>
        </div>

        {/* Option 1: Quick Log In as Aditi Rao */}
        {!showAnotherForm && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    Aditi Rao
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    aditirao7905@gmail.com
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Primary
              </span>
            </div>

            <button
              onClick={onLoginPrimary}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#E84E60] hover:bg-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <span>Log In as Aditi Rao</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setShowAnotherForm(true);
                setErrorMsg("");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Log In to Another Account</span>
            </button>
          </div>
        )}

        {/* Option 2: Log In to Another Account Form */}
        {showAnotherForm && (
          <form onSubmit={handleAnotherSubmit} className="space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enter Another Account Details:
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign In with This Account</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAnotherForm(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel & Back to Aditi Rao
            </button>
          </form>
        )}

        {/* Emergency SOS Quick Bypass */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onEmergencySos}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <span className="text-base">🚨</span>
            <span>Emergency SOS (Access Without Login)</span>
          </button>
        </div>

        {/* Security & Copyright Footer */}
        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Zero-Tracking Sandbox • Encrypted On-Device • SafeHer © 2026
        </div>
      </div>
    </div>
  );
};
