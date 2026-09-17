import React, { useState, useRef, useEffect } from "react";
import {
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

  // Input refs for video & photo
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoCameraInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const photoCameraInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

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
    const photoStampText = report.photoTimestamp || `${report.photoRecordedDate || report.date} at ${report.photoRecordedTime || report.time}`;
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
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                Incident Report & Evidence
              </h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Record photo, video & verified location evidence
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
                  Incident Location (Where it occurred)
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
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
                  This location will be stamped onto photo/video evidence.
                </p>
              </div>

              {/* PHOTO EVIDENCE CAPTURE (Requested Feature) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2.5">
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
                    <div className="relative rounded-2xl overflow-hidden bg-black max-h-52 flex items-center justify-center border border-slate-700 shadow-md">
                      <img
                        src={photoUrl}
                        alt="Photo Evidence"
                        className="w-full h-auto max-h-52 object-contain bg-black"
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
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Live Camera Photo Button */}
                    <button
                      type="button"
                      onClick={() => photoCameraInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Click Live Photo</span>
                    </button>

                    {/* Upload Photo Button */}
                    <button
                      type="button"
                      onClick={() => photoFileInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Takes photo with stamped Date, Time and GPS Location.
                </p>
              </div>

              {/* VIDEO CAPTURE */}
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
                      {/* Date with Time & Location Evidence Watermark Overlay */}
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
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Live Video Camera Button */}
                    <button
                      type="button"
                      onClick={() => videoCameraInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Video className="w-4 h-4" />
                      <span>Record Live Video</span>
                    </button>

                    {/* Upload Video Button */}
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer active:scale-98"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Captures camera footage with verified Date, Time & Location for police records.
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
                💡 <strong>Zero FIR Ready:</strong> Saved privately on device with verified Date, Time & Location for official complaint.
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

                    {/* Photo Evidence Preview with Date, Time & Location */}
                    {r.photoUrl && (
                      <div className="space-y-1 pt-1">
                        <div className="relative rounded-2xl overflow-hidden bg-black max-h-48 flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xs">
                          <img
                            src={r.photoUrl}
                            alt="Captured Evidence"
                            className="w-full h-auto max-h-48 object-contain bg-black"
                          />
                          {/* Photo Evidence Watermark Overlay Badge */}
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
                        <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 px-1 font-medium">
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <span>📸 Photo Captured:</span>
                            <span>{r.photoTimestamp || `${r.photoRecordedDate || r.date} at ${r.photoRecordedTime || r.time}`}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Video player preview if video was recorded with Date, Time & Location */}
                    {r.videoUrl && (
                      <div className="space-y-1 pt-1">
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-44 flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xs">
                          <video
                            src={r.videoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {/* Evidence Date, Time & Location badge */}
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
                      {/* Prominently show incident location */}
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-[11px] truncate max-w-[170px] font-medium" title={r.location}>
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate font-semibold">{r.location}</span>
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
