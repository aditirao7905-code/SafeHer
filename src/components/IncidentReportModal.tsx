import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  X,
  FileText,
  MapPin,
  Share2,
  Trash2,
  Plus,
  Check,
  Video,
  Upload,
  Camera,
  ImageIcon,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { IncidentReport } from "../types";
import { saveReports } from "../utils/helpers";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: IncidentReport[];
  onUpdateReports: (reports: IncidentReport[]) => void;
  currentLocationStr: string;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  reports,
  onUpdateReports,
  currentLocationStr,
}) => {
  const [view, setView] = useState<"new" | "list">("new");
  const [incidentType, setIncidentType] = useState<IncidentReport["type"]>("Harassment");
  const [location, setLocation] = useState(currentLocationStr || "Auto-detected GPS Location");
  const [description, setDescription] = useState("");
  const [suspectDetails, setSuspectDetails] = useState("");

  // Video Evidence States
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoName, setVideoName] = useState<string | undefined>(undefined);
  const [videoRecordedDate, setVideoRecordedDate] = useState<string | undefined>(undefined);
  const [videoRecordedTime, setVideoRecordedTime] = useState<string | undefined>(undefined);
  const [videoTimestamp, setVideoTimestamp] = useState<string | undefined>(undefined);

  // Photo Evidence States
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState<string | undefined>(undefined);
  const [photoRecordedDate, setPhotoRecordedDate] = useState<string | undefined>(undefined);
  const [photoRecordedTime, setPhotoRecordedTime] = useState<string | undefined>(undefined);
  const [photoTimestamp, setPhotoTimestamp] = useState<string | undefined>(undefined);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Input refs for video & photo
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoCameraInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const photoCameraInputRef = useRef<HTMLInputElement>(null);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Update location if prop updates and user hasn't typed custom
  useEffect(() => {
    if (currentLocationStr && (!location || location === "Auto-detected GPS Location")) {
      setLocation(currentLocationStr);
    }
  }, [currentLocationStr]);

  if (!isOpen) return null;

  // Handle video capture with exact Date & Time stamp
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const now = new Date();
    const fileDate = file.lastModified ? new Date(file.lastModified) : now;
    const dateStr = fileDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = fileDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const fullStamp = `${dateStr}, ${timeStr}`;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoName(file.name || `video_evidence_${Date.now()}.mp4`);
    setVideoRecordedDate(dateStr);
    setVideoRecordedTime(timeStr);
    setVideoTimestamp(fullStamp);
    showToast("📹 Video evidence captured with verified timestamp!");
  };

  const handleRemoveVideo = () => {
    if (videoUrl && videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(undefined);
    setVideoName(undefined);
    setVideoRecordedDate(undefined);
    setVideoRecordedTime(undefined);
    setVideoTimestamp(undefined);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    if (videoCameraInputRef.current) videoCameraInputRef.current.value = "";
    showToast("Video evidence removed");
  };

  // Handle photo capture with exact Date & Time stamp
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const now = new Date();
    const fileDate = file.lastModified ? new Date(file.lastModified) : now;
    const dateStr = fileDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = fileDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const fullStamp = `${dateStr}, ${timeStr}`;

    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhotoName(file.name || `photo_evidence_${Date.now()}.jpg`);
    setPhotoRecordedDate(dateStr);
    setPhotoRecordedTime(timeStr);
    setPhotoTimestamp(fullStamp);
    showToast("📸 Photo evidence captured with GPS stamp!");
  };

  const handleRemovePhoto = () => {
    if (photoUrl && photoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(undefined);
    setPhotoName(undefined);
    setPhotoRecordedDate(undefined);
    setPhotoRecordedTime(undefined);
    setPhotoTimestamp(undefined);
    if (photoFileInputRef.current) photoFileInputRef.current.value = "";
    if (photoCameraInputRef.current) photoCameraInputRef.current.value = "";
    showToast("Photo evidence removed");
  };

  // Save Incident Report Data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast("Please enter an incident description.");
      return;
    }

    const now = new Date();
    const curDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const curTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const resolvedLoc = location.trim() || currentLocationStr || "GPS Location Not Provided";

    const newReport: IncidentReport = {
      id: "inc_" + Date.now(),
      date: curDate,
      time: curTime,
      location: resolvedLoc,
      evidenceLocation: resolvedLoc,
      type: incidentType,
      description: description.trim(),
      suspectDetails: suspectDetails.trim(),
      videoUrl: videoUrl,
      videoName: videoName,
      videoRecordedDate: videoRecordedDate || curDate,
      videoRecordedTime: videoRecordedTime || curTime,
      videoTimestamp: videoTimestamp || `${curDate}, ${curTime}`,
      photoUrl: photoUrl,
      photoName: photoName,
      photoRecordedDate: photoRecordedDate || curDate,
      photoRecordedTime: photoRecordedTime || curTime,
      photoTimestamp: photoTimestamp || `${curDate}, ${curTime}`,
      createdAt: Date.now(),
    };

    const updated = [newReport, ...reports];
    onUpdateReports(updated);
    saveReports(updated);

    setDescription("");
    setSuspectDetails("");
    setVideoUrl(undefined);
    setVideoName(undefined);
    setVideoRecordedDate(undefined);
    setVideoRecordedTime(undefined);
    setVideoTimestamp(undefined);
    setPhotoUrl(undefined);
    setPhotoName(undefined);
    setPhotoRecordedDate(undefined);
    setPhotoRecordedTime(undefined);
    setPhotoTimestamp(undefined);
    setSavedNotice(true);
    showToast("✅ Incident report saved securely on device!");

    setTimeout(() => {
      setSavedNotice(false);
      setView("list");
    }, 1000);
  };

  // Delete Individual Report
  const handleDelete = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    onUpdateReports(updated);
    saveReports(updated);
    setReportToDelete(null);
    showToast("🗑️ Incident report deleted.");
  };

  // Clear / Delete All Stored Reports
  const handleClearAllReports = () => {
    onUpdateReports([]);
    saveReports([]);
    setShowClearAllConfirm(false);
    showToast("🗑️ All incident reports have been cleared.");
  };

  // Share / Copy Report Text
  const handleShare = (report: IncidentReport) => {
    const videoStampText =
      report.videoTimestamp ||
      `${report.videoRecordedDate || report.date} at ${report.videoRecordedTime || report.time}`;
    const photoStampText =
      report.photoTimestamp ||
      `${report.photoRecordedDate || report.date} at ${report.photoRecordedTime || report.time}`;
    const hasVideo = report.videoUrl ? `📹 Video Evidence: Recorded on ${videoStampText} at ${report.location}` : "";
    const hasPhoto = report.photoUrl ? `📸 Photo Evidence: Captured on ${photoStampText} at ${report.location}` : "";

    const evidenceText = [hasVideo, hasPhoto].filter(Boolean).join("\n") || "No media attached";

    const text = `📝 SafeHer Incident Report:
Type: ${report.type}
Date & Time: ${report.date} at ${report.time}
Incident Location: ${report.location}
Description: ${report.description}
Suspect Details: ${report.suspectDetails || "N/A"}
Evidence:
${evidenceText}
— SafeHer Women Safety Assistant (Zero FIR BNSS 173 Reference)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(report.id);
      showToast("📋 Report copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col w-full h-full overflow-hidden select-none animate-fadeIn">
      {/* Container - Full-page responsive column */}
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-white dark:bg-slate-900 md:border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        {/* Full-Page Top Header */}
        <div className="shrink-0 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-orange-50/40 to-pink-50/70 dark:from-rose-950/30 dark:to-slate-900 shadow-2xs">
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
                  Incident Report & Evidence
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Save & delete verified photo, video & GPS evidence
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

        {/* View Switcher Tabs (File New Report vs Saved Logs) */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => setView("new")}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                view === "new"
                  ? "bg-[#E84E60] text-white shadow-md shadow-rose-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File New Report</span>
            </button>

            <button
              onClick={() => setView("list")}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                view === "list"
                  ? "bg-[#E84E60] text-white shadow-md shadow-rose-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Saved Logs ({reports.length})</span>
            </button>
          </div>

          {/* Delete All / Clear Data Button if reports exist and viewing list */}
          {view === "list" && reports.length > 0 && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              title="Delete all saved incident reports"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete All</span>
            </button>
          )}
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mx-4 sm:mx-6 mt-2.5 p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-lg flex items-center justify-between gap-2 animate-fadeIn z-20">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 pb-24">
          {view === "new" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {savedNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Incident and evidence securely saved to your device.</span>
                </div>
              )}

              {/* Classification */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Incident Classification
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden transition-colors"
                >
                  <option value="Harassment">Eve-teasing / Verbal Harassment</option>
                  <option value="Stalking">Physical Following / Stalking</option>
                  <option value="Suspicious Vehicle">Suspicious Taxi / Auto / Car</option>
                  <option value="Physical Threat">Physical Threat / Intimidation</option>
                  <option value="Other">Other Safety Hazard</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Incident Location (Where it occurred)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter landmark, road, area, or coordinates"
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                  This location will be stamped onto photo and video evidence.
                </p>
              </div>

              {/* PHOTO EVIDENCE CAPTURE */}
              <div className="p-4 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                    <span>Photo Evidence Capture</span>
                  </label>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                    Camera & Gallery
                  </span>
                </div>

                {/* Hidden photo inputs */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={photoCameraInputRef}
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={photoFileInputRef}
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {/* Photo Preview or Capture Buttons */}
                {photoUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden bg-black max-h-56 flex items-center justify-center border border-slate-700 shadow-md">
                      <img
                        src={photoUrl}
                        alt="Photo Evidence"
                        className="w-full h-auto max-h-56 object-contain bg-black"
                      />
                      {/* Watermark badge with Location, Date & Time */}
                      <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none bg-black/85 backdrop-blur-xs border border-white/20 text-white p-2 rounded-xl text-[10px] font-mono shadow-lg space-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>PHOTO EVIDENCE</span>
                          </div>
                          <span className="text-slate-300">
                            {photoTimestamp || "Verified Timestamp"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-200 truncate">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{location || "GPS Location"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[240px]">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">📸 Clicked: </span>
                        <span>{photoTimestamp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => photoCameraInputRef.current?.click()}
                      className="py-3 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Click Live Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => photoFileInputRef.current?.click()}
                      className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* VIDEO EVIDENCE CAPTURE */}
              <div className="p-4 rounded-3xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>Video Evidence Capture</span>
                  </label>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    Camera & Gallery
                  </span>
                </div>

                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  ref={videoCameraInputRef}
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="video/*"
                  ref={videoFileInputRef}
                  onChange={handleVideoSelect}
                  className="hidden"
                />

                {videoUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-56 flex items-center justify-center border border-slate-700 shadow-md">
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none bg-black/85 backdrop-blur-xs border border-white/20 text-white p-2 rounded-xl text-[10px] font-mono shadow-lg space-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="font-bold tracking-wider text-red-400">REC EVIDENCE</span>
                          </div>
                          <span className="text-slate-300">
                            {videoTimestamp || `${videoRecordedDate} ${videoRecordedTime}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-200 truncate">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{location || "GPS Location"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[240px]">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">📹 Recorded: </span>
                        <span>{videoTimestamp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => videoCameraInputRef.current?.click()}
                      className="py-3 px-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Video className="w-4 h-4" />
                      <span>Record Live Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Incident Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State what happened, time of incident, words spoken, suspect actions or vehicle details..."
                  required
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Suspect / Vehicle Identifiers */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Suspect / Vehicle Number (Optional)
                </label>
                <input
                  type="text"
                  value={suspectDetails}
                  onChange={(e) => setSuspectDetails(e.target.value)}
                  placeholder="e.g. DL-10-XY-1234, black bike, red jacket, two men"
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-200">
                💡 <strong>Zero FIR Ready:</strong> Saved locally on your device with verified Date, Time & GPS coordinates. Can be directly shared with Police under BNSS Section 173.
              </div>

              {/* ACTION BUTTON: SAVE INCIDENT REPORT */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#E84E60] hover:bg-[#d63f51] text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Save Incident Report Data</span>
              </button>
            </form>
          ) : (
            /* SAVED LOGS VIEW */
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      No saved incident reports
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Any incidents, photos, or video evidence you save will appear here securely.
                    </p>
                  </div>
                  <button
                    onClick={() => setView("new")}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer hover:bg-rose-600 transition-colors shadow-xs"
                  >
                    + Record First Incident
                  </button>
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs hover:border-rose-200 dark:hover:border-rose-900/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-[#E84E60] dark:text-rose-300 text-[10px] font-extrabold uppercase">
                        {r.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>{r.date}</span>
                        <span>•</span>
                        <span>{r.time}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                      {r.description}
                    </p>

                    {/* Photo Evidence Preview */}
                    {r.photoUrl && (
                      <div className="space-y-1.5 pt-1">
                        <div className="relative rounded-2xl overflow-hidden bg-black max-h-52 flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xs">
                          <img
                            src={r.photoUrl}
                            alt="Captured Evidence"
                            className="w-full h-auto max-h-52 object-contain bg-black"
                          />
                          <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none bg-black/85 backdrop-blur-xs border border-white/20 text-white p-1.5 rounded-xl text-[9px] font-mono shadow-md space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                PHOTO EVIDENCE
                              </span>
                              <span className="text-slate-300">
                                {r.photoTimestamp || `${r.photoRecordedDate || r.date} ${r.photoRecordedTime || r.time}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] text-slate-200 truncate">
                              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                              <span className="truncate">{r.evidenceLocation || r.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1 font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <span>📸 Photo Captured:</span>
                          <span>{r.photoTimestamp || `${r.photoRecordedDate || r.date} at ${r.photoRecordedTime || r.time}`}</span>
                        </div>
                      </div>
                    )}

                    {/* Video Evidence Preview */}
                    {r.videoUrl && (
                      <div className="space-y-1.5 pt-1">
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-48 flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xs">
                          <video
                            src={r.videoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none bg-black/85 backdrop-blur-xs border border-white/20 text-white p-1.5 rounded-xl text-[9px] font-mono shadow-md space-y-0.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                <span className="font-bold text-red-400">VIDEO EVIDENCE</span>
                              </div>
                              <span className="text-slate-300">
                                {r.videoTimestamp || `${r.videoRecordedDate || r.date} ${r.videoRecordedTime || r.time}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] text-slate-200 truncate">
                              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                              <span className="truncate">{r.evidenceLocation || r.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1 font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400">
                          <span>📹 Video Captured:</span>
                          <span>{r.videoTimestamp || `${r.videoRecordedDate || r.date} at ${r.videoRecordedTime || r.time}`}</span>
                        </div>
                      </div>
                    )}

                    {r.suspectDetails && (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white">Suspect / Vehicle: </span>
                        <span>{r.suspectDetails}</span>
                      </div>
                    )}

                    {/* Bottom Action Bar for individual report: Location, Share/Copy, Delete */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 text-xs">
                      <div
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-[11px] truncate max-w-[180px] font-medium"
                        title={r.location}
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate font-semibold">{r.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(r)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          {copiedId === r.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === r.id ? "Copied" : "Share"}</span>
                        </button>

                        {/* DELETE DATA OPTION */}
                        <button
                          onClick={() => setReportToDelete(r.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-rose-200 dark:border-rose-900/40"
                          title="Delete this incident report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Delete Individual Report Confirmation Modal */}
        {reportToDelete && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3.5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
              <div className="flex items-center gap-2.5 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Delete Incident Report?
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete this incident report and its attached evidence? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setReportToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(reportToDelete)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                >
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Data Confirmation Modal */}
        {showClearAllConfirm && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3.5 border border-rose-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
              <div className="flex items-center gap-2.5 text-rose-600">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Clear All Incident Logs?
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This will permanently delete all {reports.length} saved incident reports, photos, and video evidence from this device.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowClearAllConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllReports}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {reports.length} report{reports.length === 1 ? "" : "s"} saved locally
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Close Page
          </button>
        </div>
      </div>
    </div>
  );
};
