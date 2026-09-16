import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Radio,
  StopCircle,
  Zap,
  BookOpen,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { LocationInfo } from "../types";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface AssistantTabProps {
  location: LocationInfo;
}

const QUICK_PROMPTS_HI = [
  "🚨 कैब ड्राइवर ने रास्ता बदल दिया, क्या करूं?",
  "⚠️ कोई पीछा कर रहा है, तुरंत क्या करें?",
  "👩‍💻 SafeHer किसने डेवलप किया है?",
  "🥋 आत्मरक्षा (Self Defense) के जरूरी कदम",
  "⚖️ Zero FIR कैसे दर्ज कराएं?",
];

const QUICK_PROMPTS_EN = [
  "🚨 Cab driver took wrong route, what to do?",
  "⚠️ Someone is following me, immediate steps?",
  "👩‍💻 Who developed SafeHer?",
  "🥋 Immediate self defense tactics",
  "⚖️ How to register a Zero FIR?",
];

export const AssistantTab: React.FC<AssistantTabProps> = ({ location }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_welcome",
      sender: "assistant",
      text: "hello, I'm smart women safety assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [inputLang, setInputLang] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState<1.0 | 1.2>(1.0);
  const [lengthPreference, setLengthPreference] = useState<"short" | "medium" | "detailed">("short");
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [micStatus, setMicStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load and cache voices when speech synthesis is ready
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      } catch (e) {}
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Clean text for speech synthesis
  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/[*_~`#>-]/g, " ")
      .replace(/https?:\/\/\S+/g, "link")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Speak message out loud with Hindi & English voice selection
  const speakMessage = (messageId: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const isHindiText = /[\u0900-\u097F]/.test(cleanText) || inputLang === "hi-IN";

      let bestVoice: SpeechSynthesisVoice | undefined;
      if (isHindiText) {
        bestVoice =
          voices.find((v) => v.lang.includes("hi-IN") || v.lang === "hi") ||
          voices.find((v) => v.name.toLowerCase().includes("hindi") || v.name.toLowerCase().includes("swara") || v.name.toLowerCase().includes("lekha"));
      }

      if (!bestVoice) {
        bestVoice =
          voices.find((v) => v.lang === "en-IN" || v.lang.includes("en-IN")) ||
          voices.find((v) => v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("neerja")) ||
          voices.find((v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("robotic")) ||
          voices[0];
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.rate = speechSpeed;
      utterance.pitch = 1.0;

      utterance.onstart = () => setSpeakingMessageId(messageId);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setSpeakingMessageId(null);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setSpeakingMessageId(null);
  };

  // Immediate situational emergency answer fallback
  const getImmediateClientFallback = (query: string, lang: string): string => {
    const isHi = lang === "hi-IN" || /[\u0900-\u097F]/.test(query);
    const lower = query.toLowerCase();

    if (lower.includes("develop") || lower.includes("creator") || lower.includes("banaya") || lower.includes("who made")) {
      return isHi
        ? "SafeHer app ko Aditi Rao (Age 20, Lucknow) ne 2026 mein mahilaon aur ladkiyon ki suraksha ke liye develop kiya hai."
        : "SafeHer was developed by Aditi Rao (Age 20, Lucknow, UP) in 2026 to provide instant women emergency protection.";
    }

    if (lower.includes("cab") || lower.includes("driver") || lower.includes("route") || lower.includes("rasta")) {
      return isHi
        ? "🚨 कैब गलत रास्ते पर (तुरंत 3 कदम):\n1. SafeHer 'Live Location' से WhatsApp पर लोकेशन भेजें।\n2. ड्राइवर को ज़ोर से बोलें: 'मेन रोड पर गाड़ी रोकिए, 112 डायल हो रहा है।'\n3. दरवाज़ा अंदर से खोलें और तुरंत 112 मिलाएं।"
        : "🚨 Cab Emergency (3 Quick Steps):\n1. Share SafeHer Live GPS on WhatsApp with family.\n2. Loudly command driver: 'Keep on main highway, pull over at nearest shop.'\n3. Check child-lock off and dial 112 immediately.";
    }

    if (lower.includes("piche") || lower.includes("stalk") || lower.includes("follow") || lower.includes("chase")) {
      return isHi
        ? "⚠️ पीछा किए जाने पर तुरंत:\n1. सड़क पार करें और किसी खुली दुकान या गार्ड वाले ATM में घुसें।\n2. SafeHer Fake Call चालू करके कान पर लगाएं।\n3. हाथ में चाबी रखें और 112 / 1090 पर कॉल करें।"
        : "⚠️ Being Followed (Immediate Actions):\n1. Cross the street diagonally into an open shop or guarded 24/7 ATM.\n2. Turn on SafeHer Fake Call and speak loudly.\n3. Hold keys between knuckles and dial 112 / 1090.";
    }

    return isHi
      ? "🛡️ तुरंत सुरक्षित जगह या रोशनी में जाएं। अगर कोई भी खतरा है तो ऊपर लाल SOS बटन दबाएं या तुरंत 112 पर कॉल करें।"
      : "🛡️ Move to a well-lit, crowded area immediately. If you feel any threat, tap the red SOS button or dial 112.";
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    stopSpeaking();

    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSpeechTranscript("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          prompt: query,
          lengthPreference,
          language: inputLang === "hi-IN" ? "hindi" : "english",
          history: messages.slice(-4).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            text: m.text,
          })),
          locationContext: location.latitude
            ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude?.toFixed(4)}`
            : undefined,
        }),
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      const botText = data.reply || data.text || getImmediateClientFallback(query, inputLang);
      const botMsgId = "b_" + Date.now();

      const botMsg: Message = {
        id: botMsgId,
        sender: "assistant",
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If Auto Speak is ON, speak the answer aloud automatically
      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(botMsgId, botText);
        }, 120);
      }
    } catch (e) {
      const fallbackId = "b_err_" + Date.now();
      const fallbackText = getImmediateClientFallback(query, inputLang);
      const fallbackMsg: Message = {
        id: fallbackId,
        sender: "assistant",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeak) {
        speakMessage(fallbackId, fallbackText);
      }
    } finally {
      setLoading(false);
    }
  };

  // Voice speech-to-text recognition (smooth, robust, direct activation)
  const handleToggleVoiceInput = () => {
    // If text-to-speech is currently playing, stop it immediately
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setSpeakingMessageId(null);

    if (isListening) {
      setIsListening(false);
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
      setMicStatus("Speech recognition is not supported in this browser. Please type your message.");
      setTimeout(() => setMicStatus(null), 4000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRec();
      recognition.lang = inputLang; // hi-IN or en-IN
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;
      let capturedText = "";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript("");
        setMicStatus(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const trimmed = transcript.trim();
        if (trimmed) {
          capturedText = trimmed;
          setSpeechTranscript(trimmed);
          setInput(trimmed);
        }
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);

        // Filter out completely benign events that are not errors:
        // 'aborted' happens on cancel or reset; 'no-speech' is normal silence
        if (err.error === "aborted" || err.error === "no-speech") {
          return;
        }

        if (err.error === "not-allowed" || err.error === "service-not-allowed") {
          setMicStatus("Microphone access blocked. Please allow mic permission in browser address bar.");
          setTimeout(() => setMicStatus(null), 5000);
        } else if (err.error === "audio-capture") {
          setMicStatus("Microphone hardware is busy. Please close other audio apps and retry.");
          setTimeout(() => setMicStatus(null), 5000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatic voice sending on speech end if text was detected
        if (capturedText && capturedText.trim().length > 1) {
          handleSend(capturedText.trim());
        }
      };

      // Call start directly within click gesture
      recognition.start();
    } catch (e: any) {
      console.warn("Recognition start exception:", e);
      setIsListening(false);
    }
  };

  const quickPrompts = inputLang === "hi-IN" ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  return (
    <div className="space-y-2.5 pb-24 animate-fadeIn flex flex-col h-[calc(100vh-140px)] select-none">
      {/* Top Header with Voice Output Toggle & Speech Speed */}
      <div className="shrink-0 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                SafeHer AI Assistant
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Speaks answers aloud in Hindi & English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Speed toggle */}
            <button
              onClick={() => setSpeechSpeed(speechSpeed === 1.0 ? 1.2 : 1.0)}
              className="px-2 py-1 rounded-lg text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Toggle AI Speech Speed"
            >
              {speechSpeed === 1.0 ? "1.0x" : "1.2x ⚡"}
            </button>

            {/* AI Voice Output Toggle */}
            <button
              onClick={() => {
                if (speakingMessageId) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                autoSpeak
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
              }`}
              title="Toggle AI Voice Speech"
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeak ? "Voice ON" : "Voice OFF"}</span>
            </button>
          </div>
        </div>

        {/* Dual Controls: Language & Answer Length (Short selected by default) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Language:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => {
                  setInputLang("hi-IN");
                  if (isListening && recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch (e) {}
                  }
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  inputLang === "hi-IN"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                🇮🇳 हिंदी
              </button>
              <button
                onClick={() => {
                  setInputLang("en-IN");
                  if (isListening && recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch (e) {}
                  }
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  inputLang === "en-IN"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Answer Length Preference (Default: Short) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Answer Length:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setLengthPreference("short")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lengthPreference === "short"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs font-black border border-rose-200 dark:border-rose-900"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Short</span>
              </button>
              <button
                onClick={() => setLengthPreference("medium")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lengthPreference === "medium"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs font-black border border-rose-200 dark:border-rose-900"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Medium</span>
              </button>
              <button
                onClick={() => setLengthPreference("detailed")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lengthPreference === "detailed"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs font-black border border-rose-200 dark:border-rose-900"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Detailed</span>
              </button>
            </div>
          </div>
        </div>

        {/* If currently speaking, show audio indicator and stop button */}
        {speakingMessageId && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              <span>Speaking audio response...</span>
            </div>
            <button
              onClick={stopSpeaking}
              className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 text-[11px] font-bold cursor-pointer"
            >
              Stop Voice
            </button>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                m.sender === "user"
                  ? "bg-slate-800 dark:bg-slate-700"
                  : "bg-gradient-to-br from-rose-500 to-pink-500 shadow-2xs"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[84%] text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-[#E84E60] text-white rounded-tr-xs shadow-xs font-medium"
                  : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs text-slate-800 dark:text-slate-100 rounded-tl-xs font-normal"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 text-[10px] opacity-75">
                <span>{m.timestamp}</span>
                {m.sender === "assistant" && (
                  <button
                    onClick={() => speakMessage(m.id, m.text)}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Speak this response aloud"
                  >
                    {speakingMessageId === m.id ? (
                      <span className="flex items-center gap-1 text-rose-500 font-bold">
                        <StopCircle className="w-3.5 h-3.5 animate-pulse" />
                        <span>Stop</span>
                      </span>
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Rapid Analyzing feedback */}
        {loading && (
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs pl-10 py-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-bold flex items-center gap-1">
              SafeHer AI is analyzing situation... <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic Status or Notice Message if permission or error occurred */}
      {micStatus && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{micStatus}</span>
          </div>
          <button
            onClick={() => setMicStatus(null)}
            className="p-1 text-amber-700 hover:text-amber-900 rounded-md cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Listening Active Waveform Overlay */}
      {isListening && (
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            {/* Pulsing Voice Equalizer Bars */}
            <div className="flex items-center gap-1 h-5">
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_100ms] h-3"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_200ms] h-5"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_300ms] h-4"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_400ms] h-6"></span>
              <span className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_200ms] h-3"></span>
            </div>

            <div>
              <div className="text-xs font-black">
                Listening ({inputLang === "hi-IN" ? "हिंदी में बोलें..." : "Listening in English..."})
              </div>
              <p className="text-[11px] text-rose-100 truncate max-w-[200px] font-medium mt-0.5">
                {speechTranscript || "Speak your emergency or question now..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                const textToSend = speechTranscript.trim();
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.onend = null;
                    recognitionRef.current.onerror = null;
                    recognitionRef.current.stop();
                  } catch (e) {}
                  recognitionRef.current = null;
                }
                setIsListening(false);
                if (textToSend) {
                  handleSend(textToSend);
                }
              }}
              className="px-3 py-1 bg-white text-rose-600 rounded-xl text-xs font-black cursor-pointer shadow-xs hover:bg-rose-50 active:scale-95"
            >
              Send
            </button>
            <button
              onClick={() => {
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.onend = null;
                    recognitionRef.current.onerror = null;
                    recognitionRef.current.abort();
                  } catch (e) {}
                  recognitionRef.current = null;
                }
                setIsListening(false);
                setSpeechTranscript("");
              }}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/20 text-white text-xs cursor-pointer hover:bg-white/30"
              title="Cancel voice input"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts Chips */}
      <div className="shrink-0 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Send Mic and Action Button */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          {/* Quick Language Toggle Tag inside input bar */}
          <button
            onClick={() => setInputLang(inputLang === "hi-IN" ? "en-IN" : "hi-IN")}
            className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-rose-600 dark:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title="Switch Speech & Query Language"
          >
            {inputLang === "hi-IN" ? "🇮🇳 HI" : "🇬🇧 EN"}
          </button>

          {/* Voice Mic Button */}
          <button
            onClick={handleToggleVoiceInput}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-300 ring-2 ring-rose-300"
                : "text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800"
            }`}
            title="Tap to speak your query (Voice Input)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#E84E60]" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              inputLang === "hi-IN"
                ? "अपनी परेशानी बताएं या माइक टैप करें..."
                : "Type or tap mic (speak query)..."
            }
            className="flex-1 text-xs font-medium text-slate-800 dark:text-slate-100 bg-transparent outline-hidden px-1 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#E84E60] hover:bg-[#d43f50] disabled:opacity-40 text-white cursor-pointer transition-all shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
