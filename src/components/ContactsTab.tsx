import React, { useState } from "react";
import {
  Users,
  Phone,
  PhoneCall,
  Trash2,
  ShieldCheck,
  Plus,
  MessageCircle,
  MessageSquare,
  User,
  Heart,
} from "lucide-react";
import { EmergencyContact, LocationInfo } from "../types";
import {
  generateCategorizedSosMessage,
  buildWhatsAppUrl,
  buildSmsUrl,
} from "../utils/helpers";

interface ContactsTabProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  location: LocationInfo;
  batteryLevel: number | null;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  location,
  batteryLevel,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Family");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: "cnt_" + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      relationship: relation,
      isPrimary: contacts.length === 0,
    };

    onAddContact(newContact);
    setName("");
    setPhone("");
  };

  // Broadcast SOS text to a specific contact via WhatsApp
  const handleSendWhatsApp = (contact: EmergencyContact) => {
    const msg = generateCategorizedSosMessage(
      "immediate",
      location.latitude,
      location.longitude,
      batteryLevel
    );
    const url = buildWhatsAppUrl(contact.phone, msg);
    window.open(url, "_blank");
  };

  // Send SOS text to a specific contact via standard SMS
  const handleSendSms = (contact: EmergencyContact) => {
    const msg = generateCategorizedSosMessage(
      "immediate",
      location.latitude,
      location.longitude,
      batteryLevel
    );
    const url = buildSmsUrl(contact.phone, msg);
    window.location.href = url;
  };

  const getAvatarGradient = (idx: number) => {
    const gradients = [
      "from-rose-500 to-pink-600",
      "from-purple-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-sky-500 to-blue-600",
    ];
    return gradients[idx % gradients.length];
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              Emergency Contacts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Trusted guardians notified instantly in emergency
            </p>
          </div>
        </div>

        <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-900/60">
          {contacts.length} Saved
        </span>
      </div>

      {/* Add Contact Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Add New Guardian
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name (e.g. Mom, Brother, Priya)"
              className="w-full text-xs font-medium pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (+91...)"
                className="w-full text-xs font-medium pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
            </div>
            <div>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full text-xs font-bold px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 outline-hidden cursor-pointer"
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Guardian">Guardian</option>
                <option value="Colleague">Colleague</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-rose-200 dark:shadow-rose-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Save Emergency Contact</span>
          </button>
        </form>
      </div>

      {/* Contacts List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Saved Emergency List
          </span>
          <span className="text-[10px] text-slate-400">
            Tap call or message below
          </span>
        </div>

        {contacts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No emergency contacts added yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              Add family or trusted friends who will receive your SOS WhatsApp & SMS alert with live GPS.
            </p>
          </div>
        ) : (
          contacts.map((contact, idx) => (
            <div
              key={contact.id}
              className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 hover:border-indigo-200 dark:hover:border-indigo-900/40 hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Colorful Initial Avatar Badge */}
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                    idx
                  )} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 text-[9px] font-black uppercase tracking-wider">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tracking-tight">
                      {contact.phone}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded-md">
                      {contact.relationship}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Call, WhatsApp, SMS, Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Direct Call */}
                <a
                  href={`tel:${contact.phone}`}
                  className="w-8.5 h-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title="Direct Phone Call"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>

                {/* WhatsApp Alert */}
                <button
                  onClick={() => handleSendWhatsApp(contact)}
                  className="w-8.5 h-8.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Send Distress Alert via WhatsApp"
                >
                  <span className="text-sm leading-none">💬</span>
                </button>

                {/* Normal SMS Alert */}
                <button
                  onClick={() => handleSendSms(contact)}
                  className="w-8.5 h-8.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Send Distress Alert via SMS"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteContact(contact.id)}
                  className="w-8.5 h-8.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove Contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 shadow-2xs">
        <ShieldCheck className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-snug text-[11px]">
          <strong>Instant Live GPS Dispatch:</strong> Triggering SOS sends real-time coordinates & Google Maps link to all these contacts instantly.
        </p>
      </div>
    </div>
  );
};
