import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "./components/Header";
import { Drawer } from "./components/Drawer";
import { BottomNav } from "./components/BottomNav";
import { HomeTab } from "./components/HomeTab";
import { ContactsTab } from "./components/ContactsTab";
import { ToolsTab } from "./components/ToolsTab";
import { SosTab } from "./components/SosTab";
import { AssistantTab } from "./components/AssistantTab";
import { FakeCallModal } from "./components/FakeCallModal";
import { QuickExitCalculator } from "./components/QuickExitCalculator";
import { SirenModal } from "./components/SirenModal";
import { SafeRouteModal } from "./components/SafeRouteModal";
import { SafetyScoreModal } from "./components/SafetyScoreModal";
import { IncidentReportModal } from "./components/IncidentReportModal";
import { LocationModal } from "./components/LocationModal";
import { BatteryModal } from "./components/BatteryModal";
import { ActiveTab, EmergencyContact, IncidentReport, LocationInfo, ThemeMode } from "./types";
import {
  getSavedContacts,
  saveContacts,
  getSavedReports,
  generateSafeMessage,
  getSavedTheme,
  saveTheme,
} from "./utils/helpers";
import { soundManager } from "./utils/audio";

export default function App() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isQuickExitOpen, setIsQuickExitOpen] = useState(false);
  const [isSirenModalOpen, setIsSirenModalOpen] = useState(false);
  const [isSafeRouteOpen, setIsSafeRouteOpen] = useState(false);
  const [isSafetyScoreOpen, setIsSafetyScoreOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [triggeredByShake, setTriggeredByShake] = useState(false);

  // App Theme: default system / light / dark
  const [theme, setTheme] = useState<ThemeMode>(getSavedTheme);

  // App State: Shake and Voice SOS enabled by default for direct instant emergency response
  const [contacts, setContacts] = useState<EmergencyContact[]>(getSavedContacts);
  const [reports, setReports] = useState<IncidentReport[]>(getSavedReports);
  const [isShakeEnabled, setIsShakeEnabled] = useState(true);
  const [isVoiceSosEnabled, setIsVoiceSosEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(84);
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isBatterySaverOn, setIsBatterySaverOn] = useState(false);
  const [batteryWarningDismissed, setBatteryWarningDismissed] = useState(false);
  const [safeStatusText, setSafeStatusText] = useState("Safety status ready.");

  // Automatic Battery Saver activation at 20% threshold with warning
  useEffect(() => {
    if (batteryLevel !== null && batteryLevel <= 20) {
      setIsBatterySaverOn(true);
    }
    if (batteryLevel !== null && batteryLevel > 20) {
      setBatteryWarningDismissed(false);
    }
  }, [batteryLevel]);

  // Location State
  const [location, setLocation] = useState<LocationInfo>({
    latitude: 28.6139, // Default fallback New Delhi
    longitude: 77.2090,
    accuracy: 15,
    loading: false,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const isSirenModalOpenRef = useRef(false);
  const lastSosClosedTimeRef = useRef(0);

  // Sync ref to prevent shake triggers when modal is open and manage cooldown
  useEffect(() => {
    isSirenModalOpenRef.current = isSirenModalOpen;
    if (!isSirenModalOpen) {
      lastSosClosedTimeRef.current = Date.now();
    }
  }, [isSirenModalOpen]);

  // Theme synchronization effect
  useEffect(() => {
    saveTheme(theme);
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    if (theme === "dark") {
      applyTheme(true);
    } else if (theme === "light") {
      applyTheme(false);
    } else {
      // System default
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches);
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  };

  // Geolocation fetcher
  const fetchLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({ ...prev, loading: false, error: "Geolocation not supported" }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          loading: false,
          error: null,
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        console.warn("Geolocation access notice:", err.message);
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Battery status fetcher
  useEffect(() => {
    fetchLocation();

    if ("getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener("levelchange", () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        })
        .catch(() => {
          setBatteryLevel(84);
        });
    }
  }, [fetchLocation]);

  // Robust Shake-to-SOS listener: Calibrated for instant physical shake detection on mobile
  useEffect(() => {
    if (!isShakeEnabled) return;

    let isInitialized = false;
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let shakeCount = 0;
    let firstShakeTime = 0;
    let lastShakePeakTime = 0;
    let lastSampleTime = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      // 1. Ignore if SOS modal is currently already open
      if (isSirenModalOpenRef.current) return;

      // 2. Short cooldown of 1.5s after closing SOS to avoid repeat triggers
      const now = Date.now();
      if (now - lastSosClosedTimeRef.current < 1500) return;

      // 3. Sample every 50ms for responsive tracking
      if (now - lastSampleTime < 50) return;
      lastSampleTime = now;

      const acc = event.acceleration;
      const accWithG = event.accelerationIncludingGravity;

      // Baseline initialization to prevent false trigger on first event
      if (!isInitialized) {
        if (accWithG) {
          lastX = accWithG.x || 0;
          lastY = accWithG.y || 0;
          lastZ = accWithG.z || 0;
        }
        isInitialized = true;
        return;
      }

      let isShakePeak = false;
      let isSevereShake = false;

      // Check pure linear acceleration (if available on device)
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        const linearMagnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
        if (linearMagnitude > 20) {
          isSevereShake = true;
          isShakePeak = true;
        } else if (linearMagnitude > 13) {
          isShakePeak = true;
        }
      } else if (accWithG) {
        const curX = accWithG.x || 0;
        const curY = accWithG.y || 0;
        const curZ = accWithG.z || 0;

        const delta = Math.sqrt(
          Math.pow(curX - lastX, 2) +
          Math.pow(curY - lastY, 2) +
          Math.pow(curZ - lastZ, 2)
        );

        lastX = curX;
        lastY = curY;
        lastZ = curZ;

        if (delta > 22) {
          isSevereShake = true;
          isShakePeak = true;
        } else if (delta > 15) {
          isShakePeak = true;
        }
      }

      if (isShakePeak) {
        // Debounce peaks by 120ms
        if (now - lastShakePeakTime > 120) {
          lastShakePeakTime = now;

          // If severe shake, trigger immediately on 1 peak
          if (isSevereShake) {
            shakeCount = 0;
            lastSosClosedTimeRef.current = now;
            setTriggeredByShake(true);
            setIsSirenModalOpen(true);
            if ("vibrate" in navigator) {
              try {
                navigator.vibrate([250, 100, 250]);
              } catch (e) {}
            }
            return;
          }

          if (shakeCount === 0 || now - firstShakeTime > 1500) {
            // First valid shake motion in window
            shakeCount = 1;
            firstShakeTime = now;
          } else {
            shakeCount++;
            // Require 2 quick physical shakes within 1500ms
            if (shakeCount >= 2) {
              shakeCount = 0;
              lastSosClosedTimeRef.current = now;
              setTriggeredByShake(true);
              setIsSirenModalOpen(true);

              if ("vibrate" in navigator) {
                try {
                  navigator.vibrate([250, 100, 250]);
                } catch (e) {}
              }
            }
          }
        }
      }
    };

    window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
    return () => window.removeEventListener("devicemotion", handleDeviceMotion);
  }, [isShakeEnabled]);

  // Voice SOS Listener (Keywords: "help", "bachao", "save me", "emergency", "madad")
  // Automatically pauses when user is on the Assistant tab so AI Voice Mic has exclusive hardware access
  useEffect(() => {
    if (!isVoiceSosEnabled || activeTab === "assistant") {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    let isStarting = false;
    let isRunning = false;
    let isDestroyed = false;
    let recognition: any = null;

    try {
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        isStarting = false;
        isRunning = true;
      };

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript.toLowerCase().trim();

          // Check all emergency trigger variations
          const isTriggered =
            text.includes("help") ||
            text.includes("bachao") ||
            text.includes("bchao") ||
            text.includes("bachaoo") ||
            text.includes("sos") ||
            text.includes("save me") ||
            text.includes("emergency") ||
            text.includes("madad") ||
            text.includes("police") ||
            text.includes("khatra") ||
            text.includes("danger") ||
            text.includes("बचाओ") ||
            text.includes("हेल्प") ||
            text.includes("मदद") ||
            text.includes("पुलिस") ||
            text.includes("खतरा");

          if (isTriggered) {
            if (!isSirenModalOpenRef.current && Date.now() - lastSosClosedTimeRef.current > 1500) {
              lastSosClosedTimeRef.current = Date.now();
              setTriggeredByShake(false);
              setIsSirenModalOpen(true);
              break;
            }
          }
        }
      };

      recognition.onerror = (e: any) => {
        isStarting = false;
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          console.warn("Microphone access for Voice SOS not permitted:", e.error);
        }
      };

      const safeStart = () => {
        if (isDestroyed || !isVoiceSosEnabled || isRunning || isStarting) return;
        try {
          isStarting = true;
          recognition.start();
        } catch (e) {
          isStarting = false;
        }
      };

      recognition.onend = () => {
        isRunning = false;
        isStarting = false;
        if (!isDestroyed && isVoiceSosEnabled) {
          setTimeout(() => {
            if (!isDestroyed && isVoiceSosEnabled && !isRunning) {
              safeStart();
            }
          }, 350);
        }
      };

      safeStart();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Could not initialize voice SOS recognition:", e);
    }

    return () => {
      isDestroyed = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, [isVoiceSosEnabled, activeTab]);

  // Direct toggle for Voice SOS with browser microphone permission initiation
  const handleToggleVoiceSos = async () => {
    if (!isVoiceSosEnabled) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Release track immediately; SpeechRecognition now has browser microphone authorization
          stream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          console.warn("Microphone access request:", e);
        }
      }
      setIsVoiceSosEnabled(true);
    } else {
      setIsVoiceSosEnabled(false);
    }
  };

  // Immediate Voice SOS trigger tester (for user verification)
  const handleTestVoiceSos = () => {
    if (!isSirenModalOpenRef.current) {
      lastSosClosedTimeRef.current = Date.now();
      setTriggeredByShake(false);
      setIsSirenModalOpen(true);
    }
  };

  // Handle Contact additions & removals
  const handleAddContact = (contact: EmergencyContact) => {
    const updated = [...contacts, contact];
    setContacts(updated);
    saveContacts(updated);
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  };

  // "I'm Safe" status update
  const handleTriggerImSafe = () => {
    soundManager.playSafeChime();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setSafeStatusText(`Status marked safe at ${time}. All is well.`);

    const msg = generateSafeMessage(location.latitude, location.longitude);
    if (navigator.share) {
      navigator.share({ title: "SafeHer - I'm Safe", text: msg }).catch(() => {});
    }
  };

  // Direct toggle for Shake-to-SOS with permission handling
  const handleToggleShake = async () => {
    if (!isShakeEnabled) {
      if (typeof (DeviceMotionEvent as any)?.requestPermission === "function") {
        try {
          const res = await (DeviceMotionEvent as any).requestPermission();
          if (res !== "granted") {
            setIsShakeEnabled(false);
            return;
          }
        } catch (e) {
          console.warn("Shake permission notice:", e);
        }
      }
      setIsShakeEnabled(true);
    } else {
      setIsShakeEnabled(false);
    }
  };

  // Manual simulation for shake testing (for desktop & fast verification)
  const handleSimulateShake = useCallback(() => {
    if (isSirenModalOpenRef.current) return;
    lastSosClosedTimeRef.current = Date.now();
    setTriggeredByShake(true);
    setIsSirenModalOpen(true);
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([250, 100, 250]);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDFE] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-rose-100 selection:text-rose-900 transition-colors">
      {/* Container responsive across mobile, tablet, laptop, and desktop */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-xl relative md:border-x border-slate-100 dark:border-slate-800 transition-all">
        {/* Top Header */}
        <Header
          onOpenDrawer={() => setIsDrawerOpen(true)}
          theme={theme}
          onCycleTheme={cycleTheme}
          onSosClick={() => {
            setTriggeredByShake(false);
            setIsSirenModalOpen(true);
          }}
        />

        {/* Low Battery Warning Banner (Auto-triggers at <= 20%) */}
        {batteryLevel !== null && batteryLevel <= 20 && !batteryWarningDismissed && (
          <div className="mx-4 mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md flex items-center justify-between gap-2.5 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">⚠️</span>
              <div>
                <span className="font-black block">Warning: Low Battery ({batteryLevel}%)</span>
                <span className="text-[10px] opacity-95">Battery Saver automatically turned ON to keep Emergency SOS & GPS active.</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsBatteryModalOpen(true)}
                className="px-2.5 py-1 bg-white text-rose-600 rounded-xl text-[10px] font-black cursor-pointer shadow-xs hover:bg-rose-50"
              >
                Saver Settings
              </button>
              <button
                onClick={() => setBatteryWarningDismissed(true)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 text-white text-xs cursor-pointer"
                title="Dismiss warning"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Tab Content */}
        <main className="flex-1 px-4 pt-3">
          {activeTab === "home" && (
            <HomeTab
              onSosClick={() => {
                setTriggeredByShake(false);
                setIsSirenModalOpen(true);
              }}
              onOpenFakeCall={() => setIsFakeCallOpen(true)}
              onCheckLocation={() => setIsLocationModalOpen(true)}
              onCheckBattery={() => setIsBatteryModalOpen(true)}
              onTriggerImSafe={handleTriggerImSafe}
              onOpenSafeRoute={() => setIsSafeRouteOpen(true)}
              onOpenSafetyScore={() => setIsSafetyScoreOpen(true)}
              onQuickExit={() => setIsQuickExitOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              isShakeEnabled={isShakeEnabled}
              onToggleShake={handleToggleShake}
              isVoiceSosEnabled={isVoiceSosEnabled}
              onToggleVoiceSos={handleToggleVoiceSos}
              batteryLevel={batteryLevel}
              isBatterySaverOn={isBatterySaverOn}
              location={location}
              safeStatusText={safeStatusText}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsTab
              contacts={contacts}
              onAddContact={handleAddContact}
              onDeleteContact={handleDeleteContact}
              location={location}
              batteryLevel={batteryLevel}
            />
          )}

          {activeTab === "tools" && (
            <ToolsTab
              isShakeEnabled={isShakeEnabled}
              onToggleShake={handleToggleShake}
              onSimulateShake={handleSimulateShake}
              isVoiceSosEnabled={isVoiceSosEnabled}
              onToggleVoiceSos={handleToggleVoiceSos}
              onOpenBattery={() => setIsBatteryModalOpen(true)}
              isBatterySaverOn={isBatterySaverOn}
              batteryLevel={batteryLevel}
              onOpenSafeRoute={() => setIsSafeRouteOpen(true)}
              onCheckLocation={() => setIsLocationModalOpen(true)}
              onOpenSafetyScore={() => setIsSafetyScoreOpen(true)}
              onTriggerSiren={() => {
                setTriggeredByShake(false);
                setIsSirenModalOpen(true);
              }}
              onOpenFakeCall={() => setIsFakeCallOpen(true)}
              onQuickExit={() => setIsQuickExitOpen(true)}
              location={location}
            />
          )}

          {activeTab === "sos" && (
            <SosTab
              location={location}
              batteryLevel={batteryLevel}
              contacts={contacts}
              onTriggerSiren={() => {
                setTriggeredByShake(false);
                setIsSirenModalOpen(true);
              }}
            />
          )}

          {activeTab === "assistant" && <AssistantTab location={location} />}
        </main>

        {/* Bottom Fixed Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onSosTrigger={() => {
            setTriggeredByShake(false);
            setIsSirenModalOpen(true);
          }}
        />

        {/* Drawer Side Navigation */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenIncidentModal={() => setIsIncidentModalOpen(true)}
          theme={theme}
          onSetTheme={setTheme}
        />

        {/* Modals & Overlays */}
        <FakeCallModal
          isOpen={isFakeCallOpen}
          onClose={() => setIsFakeCallOpen(false)}
          callerName={contacts[0]?.name || "Mom ❤️"}
        />

        <QuickExitCalculator
          isOpen={isQuickExitOpen}
          onExitDisguise={() => setIsQuickExitOpen(false)}
        />

        {/* Siren Modal: Silent SOS by default with direct call, WhatsApp, and SMS options */}
        <SirenModal
          isOpen={isSirenModalOpen}
          onClose={() => {
            setIsSirenModalOpen(false);
            setTriggeredByShake(false);
          }}
          location={location}
          batteryLevel={batteryLevel}
          contacts={contacts}
          triggeredByShake={triggeredByShake}
          isCountdown={false}
        />

        <SafeRouteModal
          isOpen={isSafeRouteOpen}
          onClose={() => setIsSafeRouteOpen(false)}
          userLat={location.latitude}
          userLng={location.longitude}
        />

        <SafetyScoreModal
          isOpen={isSafetyScoreOpen}
          onClose={() => setIsSafetyScoreOpen(false)}
          contacts={contacts}
          hasLocation={!!location.latitude}
          isShakeEnabled={isShakeEnabled}
          isVoiceSosEnabled={isVoiceSosEnabled}
          batteryLevel={batteryLevel}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        <IncidentReportModal
          isOpen={isIncidentModalOpen}
          onClose={() => setIsIncidentModalOpen(false)}
          reports={reports}
          onUpdateReports={setReports}
          currentLocationStr={
            location.latitude
              ? `${location.latitude.toFixed(4)}°N, ${location.longitude?.toFixed(4)}°E`
              : "Near Current Location"
          }
        />

        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          location={location}
          onRefreshLocation={fetchLocation}
          batteryLevel={batteryLevel}
          contacts={contacts}
        />

        {/* Battery Monitor & Power Saver Modal */}
        <BatteryModal
          isOpen={isBatteryModalOpen}
          onClose={() => setIsBatteryModalOpen(false)}
          batteryLevel={batteryLevel}
          setBatteryLevel={setBatteryLevel}
          isBatterySaverOn={isBatterySaverOn}
          onToggleBatterySaver={() => setIsBatterySaverOn(!isBatterySaverOn)}
        />
      </div>
    </div>
  );
}
