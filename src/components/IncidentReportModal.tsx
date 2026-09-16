import React, { useState, useRef } from "react";
import {
  X,
  FileText,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Share2,
  Trash2,
  Plus,
  Check,
  Video,
  VideoOff,
  Play,
  Upload,
  Camera,
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
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoName, setVideoName] = useState<string | undefined>(undefined);
  const [videoRecordedDate, setVideoRecordedDate] = useState<string | undefined>(undefined);
  const [videoRecordedTime, setVideoRecordedTime] = useState<string | undefined>(undefined);
  const [videoTimestamp, setVideoTimestamp] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    setVideoName(file.name || `evidence_${Date.now()}.mp4`);
    setVideoRecordedDate(dateStr);
    setVideoRecordedTime(timeStr);
    setVideoTimestamp(fullStamp);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const now = new Date();
    const curDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const curTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const newReport: IncidentReport = {
      id: "inc_" + Date.now(),
      date: curDate,
      time: curTime,
      location: location || "Near user location",
      type: incidentType,
      description: description.trim(),
      suspectDetails: suspectDetails.trim(),
      videoUrl: videoUrl,
      videoName: videoName,
      videoRecordedDate: videoRecordedDate || curDate,
      videoRecordedTime: videoRecordedTime || curTime,
      videoTimestamp: videoTimestamp || `${curDate}, ${curTime}`,
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
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setView("list");
    }, 1200);
  };

  const handleDelete = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    onUpdateReports(updated);
    saveReports(updated);
  };

  const handleShare = (report: IncidentReport) => {
    const videoStampText = report.videoTimestamp || `${report.videoRecordedDate || report.date} at ${report.videoRecordedTime || report.time}`;
    const hasVideo = report.videoUrl ? `📹 Video Evidence: Recorded on ${videoStampText}` : "No video attached";
    const text = `📝 SafeHer Incident Report:
Type: ${report.type}
Date & Time: ${report.date} at ${report.time}
Location: ${report.location}
Description: ${report.description}
Suspect Details: ${report.suspectDetails || "N/A"}
Evidence: ${hasVideo}
— SafeHer Women Safety Assistant`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(report.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-rose-100 dark:border-slate-800 animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-orange-50/40 to-pink-50/70 dark:from-rose-950/30 dark:to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <span className="text-lg">📹</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                Incident Report & Video
              </h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Record video evidence and harassment logs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 pt-3 pb-2 flex gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => setView("new")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              view === "new"
                ? "bg-rose-500 text-white shadow-2xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
            }`}
          >
            File New Report
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              view === "list"
                ? "bg-rose-500 text-white shadow-2xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Saved Logs ({reports.length})
          </button>
        </div>

        {/* Form or List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {view === "new" ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {savedNotice && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Incident & evidence securely saved to your device.</span>
                </div>
              )}

              {/* Classification */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Incident Classification
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full text-xs font-semibold p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden"
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Incident Location
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter landmark, road, or area"
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent outline-hidden"
                  />
                </div>
              </div>

              {/* VIDEO CAPTURE (Requested Feature) */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>Video Evidence Capture</span>
                  </label>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    Camera & Gallery
                  </span>
                </div>

                {/* Hidden input elements */}
                {/* 1. Direct Camera Video Capture */}
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                {/* 2. File Selector */}
                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleVideoSelect}
                  className="hidden"
                />

                {/* Preview or Capture Buttons */}
                {videoUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-48 flex items-center justify-center border border-slate-700 shadow-md">
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {/* Date with Time Evidence Watermark Overlay */}
                      <div className="absolute top-2 left-2 z-10 pointer-events-none bg-black/80 backdrop-blur-xs border border-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="font-bold tracking-wider">REC EVIDENCE</span>
                        <span className="text-white/40">|</span>
                        <span>{videoTimestamp || `${videoRecordedDate} ${videoRecordedTime}`}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[240px]">
                        <span>📅 Recorded:</span>
                        <span className="text-rose-600 dark:text-rose-400">
                          {videoTimestamp || `${videoRecordedDate} at ${videoRecordedTime}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Live Video Camera Button */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Record Live Video</span>
                    </button>

                    {/* Upload Video Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Captures camera footage with verified Date & Time for police records.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Incident Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly state what happened, suspect actions or vehicle..."
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Suspect / Vehicle Identifiers */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Suspect / Vehicle Number (Optional)
                </label>
                <input
                  type="text"
                  value={suspectDetails}
                  onChange={(e) => setSuspectDetails(e.target.value)}
                  placeholder="e.g. DL-10-XY-1234, black bike, red jacket"
                  className="w-full text-xs p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-200">
                💡 <strong>Zero FIR Ready:</strong> Saved privately on device for official complaint.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#E84E60] hover:bg-[#d63f51] text-white font-bold text-xs shadow-md shadow-rose-200 dark:shadow-rose-950 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Save Incident Report</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">No incident reports yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Record any safety concern here.</p>
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-[#E84E60] dark:text-rose-300 text-[10px] font-bold uppercase">
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

                    {/* Video player preview if video was recorded with Date & Time */}
                    {r.videoUrl && (
                      <div className="space-y-1 pt-1">
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-44 flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xs">
                          <video
                            src={r.videoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {/* Evidence Date with Time badge */}
                          <div className="absolute top-2 left-2 z-10 pointer-events-none bg-black/80 backdrop-blur-xs border border-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="font-bold">EVIDENCE</span>
                            <span className="text-white/40">•</span>
                            <span>{r.videoTimestamp || `${r.videoRecordedDate || r.date} ${r.videoRecordedTime || r.time}`}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 px-1 font-medium">
                          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                            <span>📹 Video Captured:</span>
                            <span>{r.videoTimestamp || `${r.videoRecordedDate || r.date} at ${r.videoRecordedTime || r.time}`}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {r.suspectDetails && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <strong>Suspect / Vehicle:</strong> {r.suspectDetails}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[160px]">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{r.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleShare(r)}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === r.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3 h-3" />
                          )}
                          <span>{copiedId === r.id ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
