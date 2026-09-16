import { EmergencyContact, IncidentReport } from "../types";

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: "c1", name: "Mom ❤️", phone: "+919876543210", relationship: "Mother", isPrimary: true },
  { id: "c2", name: "Papa / Home", phone: "+919812345678", relationship: "Father" },
  { id: "c3", name: "Priya (Best Friend)", phone: "+919898989898", relationship: "Friend" },
];

export const getSavedContacts = (): EmergencyContact[] => {
  try {
    const data = localStorage.getItem("safeher_contacts");
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_CONTACTS;
};

export const saveContacts = (contacts: EmergencyContact[]) => {
  try {
    localStorage.setItem("safeher_contacts", JSON.stringify(contacts));
  } catch (e) {
    console.error("Failed to save contacts:", e);
  }
};

export const getSavedReports = (): IncidentReport[] => {
  try {
    const data = localStorage.getItem("safeher_reports");
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
};

export const saveReports = (reports: IncidentReport[]) => {
  try {
    localStorage.setItem("safeher_reports", JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save reports:", e);
  }
};

// Emergency message types
export type EmergencyCategory = 'immediate' | 'cab' | 'stalking' | 'medical' | 'custom';

export interface EmergencyTemplate {
  id: EmergencyCategory;
  title: string;
  icon: string;
  description: string;
  prefix: string;
}

export const EMERGENCY_TEMPLATES: EmergencyTemplate[] = [
  {
    id: 'immediate',
    title: '🚨 Danger',
    icon: '🚨',
    description: 'Immediate threat',
    prefix: 'EMERGENCY! In danger, need immediate help! Call police 112.',
  },
  {
    id: 'cab',
    title: '🚖 Cab Alert',
    icon: '🚖',
    description: 'Suspicious ride',
    prefix: 'CAB ALERT: Driver taking wrong route. Track my live location!',
  },
  {
    id: 'stalking',
    title: '🚶‍♀️ Followed',
    icon: '🚶‍♀️',
    description: 'Being followed',
    prefix: 'ALERT: Suspicious person following me. Please call me now!',
  },
  {
    id: 'medical',
    title: '🏥 Medical',
    icon: '🏥',
    description: 'Medical distress',
    prefix: 'MEDICAL EMERGENCY: Need immediate medical / ambulance help!',
  },
];

// Generate categorized emergency distress message with live location
export const generateCategorizedSosMessage = (
  category: EmergencyCategory = 'immediate',
  lat?: number | null,
  lng?: number | null,
  battery?: number | null,
  customText?: string
) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const template = EMERGENCY_TEMPLATES.find((t) => t.id === category);
  const headline = customText?.trim() || template?.prefix || EMERGENCY_TEMPLATES[0].prefix;

  let mapLink = 'GPS pending...';
  if (lat && lng) {
    mapLink = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
  }

  const batteryStr = battery !== null && battery !== undefined ? ` • 🔋 ${battery}%` : '';

  return `🚨 EMERGENCY SOS!
${headline}

📍 Live GPS: ${mapLink}
⏰ ${time}${batteryStr}
Call Police 112 if unreachable!`;
};

// Generate standard emergency SMS message (backwards-compatible)
export const generateSosMessage = (lat?: number | null, lng?: number | null, battery?: number | null) => {
  return generateCategorizedSosMessage('immediate', lat, lng, battery);
};

// URL builder for WhatsApp
export const buildWhatsAppUrl = (phone?: string, message?: string) => {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  const encoded = encodeURIComponent(message || '');
  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
};

// URL builder for standard SMS text message
export const buildSmsUrl = (phone?: string, message?: string) => {
  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, '') : '';
  const encoded = encodeURIComponent(message || '');
  if (cleanPhone) {
    return `sms:${cleanPhone}?body=${encoded}`;
  }
  return `sms:?body=${encoded}`;
};

// Theme persistence
export const getSavedTheme = (): 'system' | 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem('safeher_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (e) {}
  return 'system';
};

export const saveTheme = (theme: 'system' | 'light' | 'dark') => {
  try {
    localStorage.setItem('safeher_theme', theme);
  } catch (e) {}
};

// Generate Safe Check-In Message
export const generateSafeMessage = (lat?: number | null, lng?: number | null) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let locStr = "";
  if (lat && lng) {
    locStr = `\n📍 Current Location: https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  }
  return `✅ I'm Safe Update:
I have reached my destination safely at ${time}. All is well!${locStr}
Shared via SafeHer.`;
};
