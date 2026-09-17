import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2, User, Grid3X3 } from "lucide-react";
import { soundManager } from "../utils/audio";

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
}

export const FakeCallModal: React.FC<FakeCallModalProps> = ({
  isOpen,
  onClose,
  callerName = "Mom ❤️",
}) => {
  const [callState, setCallState] = useState<"ringing" | "connected">("ringing");
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCallState("ringing");
      setCallSeconds(0);
      setIsKeypadOpen(false);
      soundManager.startRingtone();

      // Trigger realistic phone vibration if supported
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
        } catch (e) {}
      }
    } else {
      soundManager.stopRingtone();
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(0);
        } catch (e) {}
      }
    }

    return () => {
      soundManager.stopRingtone();
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (callState === "connected") {
      timer = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const handleAnswer = () => {
    soundManager.stopRingtone();
    setCallState("connected");
  };

  const handleDecline = () => {
    soundManager.stopRingtone();
    onClose();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between px-6 py-12 select-none animate-fadeIn">
      {/* Top Caller Info */}
      <div className="flex flex-col items-center pt-8">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-5 shadow-inner">
          <User className="w-12 h-12 text-slate-300" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-white mb-1.5">{callerName}</h2>
        <p className="text-sm font-medium text-slate-400">Mobile +91 98765 43210</p>

        <p className="text-sm font-semibold tracking-wider uppercase mt-4 text-emerald-400 animate-pulse">
          {callState === "ringing" ? "Incoming Call..." : formatTimer(callSeconds)}
        </p>
      </div>

      {/* Middle Controls (When Connected) - Pure Native Dialer Style without any app branding */}
      {callState === "connected" ? (
        <div className="flex flex-col items-center my-auto w-full max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-6 w-full">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-colors ${
                isMuted ? "bg-white text-slate-900" : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Mic className="w-6 h-6" />
              <span className="text-[11px]">Mute</span>
            </button>
            <button
              onClick={() => setIsKeypadOpen(!isKeypadOpen)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-colors ${
                isKeypadOpen ? "bg-white text-slate-900" : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Grid3X3 className="w-6 h-6" />
              <span className="text-[11px]">Keypad</span>
            </button>
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-colors ${
                isSpeaker ? "bg-white text-slate-900" : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-[11px]">Speaker</span>
            </button>
          </div>

          {/* Optional Keypad Overlay when user taps Keypad */}
          {isKeypadOpen && (
            <div className="mt-5 grid grid-cols-3 gap-3 w-full bg-slate-900/90 p-4 rounded-3xl border border-slate-800 animate-fadeIn">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((num) => (
                <div
                  key={num}
                  className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-lg font-semibold text-white shadow-inner active:bg-slate-700"
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center my-auto">
          <p className="text-xs text-slate-400">Swipe or tap answer to pretend you're on call</p>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="pb-8">
        {callState === "ringing" ? (
          <div className="flex items-center justify-around max-w-xs mx-auto w-full">
            {/* Decline Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleDecline}
                className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-900/50 active:scale-95 transition-all cursor-pointer"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
              <span className="text-xs font-medium text-slate-300">Decline</span>
            </div>

            {/* Accept Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleAnswer}
                className="w-18 h-18 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 active:scale-95 transition-all cursor-pointer animate-bounce"
              >
                <Phone className="w-8 h-8" />
              </button>
              <span className="text-xs font-medium text-slate-300">Accept</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleDecline}
              className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-900/50 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
