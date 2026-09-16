export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
}

export interface LocationInfo {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  address?: string;
  timestamp?: number;
  loading: boolean;
  error?: string | null;
}

export interface IncidentReport {
  id: string;
  date: string;
  time: string;
  location: string;
  type: 'Stalking' | 'Harassment' | 'Eve-teasing' | 'Physical Threat' | 'Suspicious Vehicle' | 'Other';
  description: string;
  suspectDetails: string;
  videoUrl?: string;
  videoName?: string;
  videoRecordedDate?: string;
  videoRecordedTime?: string;
  videoTimestamp?: string;
  createdAt: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface SafePlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'metro' | 'women_cell';
  distance: string;
  address: string;
  phone: string;
}

export type ActiveTab = 'home' | 'contacts' | 'sos' | 'tools' | 'assistant';
