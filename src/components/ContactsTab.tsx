import React, { useState } from "react";
import { Phone, MessageSquare, Trash2, Send, ShieldAlert, Check, Plus, MessageCircle } from "lucide-react";
import { EmergencyContact, LocationInfo } from "../types";
import { generateCategorizedSosMessage, buildWhatsAppUrl, buildSmsUrl } from "../utils/helpers";

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
    const msg = generateCategorizedSosMessage("immediate", location.latitude, location.longitude, batteryLevel);
    const url = buildWhatsAppUrl(contact.phone, msg);
    window.open(url, "_blank");
  };

  // Send SOS text to a specific contact via standard SMS
  const handleSendSms = (contact: EmergencyContact) => {
    const msg = generateCategorizedSosMessage("immediate", location.latitude, location.longitude, batteryLevel);
    const url = buildSmsUrl(contact.phone, msg);
    window.location.href = url;
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header - Native System Typography */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">👥</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            Emergency Contacts
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Saved securely on this device.
        </p>
      </div>

      {/* Add Contact Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contact name (e.g. Mom, Brother, Priya)"
              className="w-full text-xs font-medium px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (+91...)"
                className="w-full text-xs font-medium px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 text-slate-800 dark:text-slate-100 outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
            </div>
            <div>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full text-xs font-medium px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 outline-hidden"
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
            className="w-full py-3 rounded-2xl bg-[#E84E60] hover:bg-[#d43f50] text-white font-bold text-xs shadow-md shadow-rose-200 dark:shadow-rose-950 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </form>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs text-center py-8">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">
              No emergency contacts added yet.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add family or trusted friends who will receive your SOS WhatsApp & SMS alert with live GPS.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 hover:border-rose-100 dark:hover:border-rose-900/40 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100/60 dark:border-rose-900/50 flex items-center justify-center shrink-0">
                  <span className="text-lg">👤</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 text-[9px] font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tight mt-0.5">
                    {contact.phone}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Call, WhatsApp, Normal SMS, Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Direct Call */}
                <a
                  href={`tel:${contact.phone}`}
                  className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Direct Phone Call"
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* WhatsApp Alert */}
                <button
                  onClick={() => handleSendWhatsApp(contact)}
                  className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Send Distress Alert via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                {/* Normal SMS Alert */}
                <button
                  onClick={() => handleSendSms(contact)}
                  className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Send Distress Alert via Normal SMS"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteContact(contact.id)}
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
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
      <div className="p-3.5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100/70 dark:border-rose-900/50 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <p className="leading-snug text-[11px]">
          <strong>Dual Channel:</strong> Sends WhatsApp & SMS with live GPS coordinates, even offline.
        </p>
      </div>
    </div>
  );
};
