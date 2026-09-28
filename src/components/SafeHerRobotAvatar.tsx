import React from "react";

// Cute 3D Pink Robot Avatar Component for SafeHer
export const SafeHerRobotAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 96,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <defs>
      <linearGradient id="safeher_robotWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="safeher_robotPink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B8B" />
        <stop offset="100%" stopColor="#FF2D55" />
      </linearGradient>
      <linearGradient id="safeher_screenVisor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0B132B" />
        <stop offset="100%" stopColor="#1C2541" />
      </linearGradient>
      <filter id="safeher_shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF2D55" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Headphone band */}
    <path
      d="M26 54C26 34 40 20 60 20C80 20 94 34 94 54"
      stroke="url(#safeher_robotPink)"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Left Ear Cushion */}
    <rect x="20" y="44" width="8" height="20" rx="4" fill="url(#safeher_robotPink)" />
    {/* Right Ear Cushion */}
    <rect x="92" y="44" width="8" height="20" rx="4" fill="url(#safeher_robotPink)" />

    {/* Top Antenna */}
    <path d="M60 20V12" stroke="url(#safeher_robotPink)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="10" r="4.5" fill="#FF2D55" />
    <circle cx="60" cy="10" r="2" fill="#FFFFFF" />

    {/* Robot Head */}
    <rect
      x="28"
      y="32"
      width="64"
      height="50"
      rx="20"
      fill="url(#safeher_robotWhite)"
      filter="url(#safeher_shadowFilter)"
      stroke="#F8FAFC"
      strokeWidth="1.5"
    />

    {/* Visor Screen */}
    <rect x="36" y="41" width="48" height="31" rx="12" fill="url(#safeher_screenVisor)" />

    {/* Left Eye */}
    <ellipse cx="48" cy="54" rx="4.5" ry="6" fill="#00E5FF" />
    <circle cx="46.5" cy="51.5" r="2" fill="#FFFFFF" />
    <circle cx="50" cy="57" r="1" fill="#FFFFFF" />

    {/* Right Eye */}
    <ellipse cx="72" cy="54" rx="4.5" ry="6" fill="#00E5FF" />
    <circle cx="70.5" cy="51.5" r="2" fill="#FFFFFF" />
    <circle cx="74" cy="57" r="1" fill="#FFFFFF" />

    {/* Friendly Smile */}
    <path
      d="M56 63C57.5 65.5 62.5 65.5 64 63"
      stroke="#00E5FF"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Blush Cheeks */}
    <ellipse cx="42" cy="63" rx="3.2" ry="1.8" fill="#FF4081" fillOpacity="0.75" />
    <ellipse cx="78" cy="63" rx="3.2" ry="1.8" fill="#FF4081" fillOpacity="0.75" />

    {/* Body */}
    <path
      d="M42 82C42 82 46 80 60 80C74 80 78 82 78 82L82 102C82 104 80 106 78 106H42C40 106 38 104 38 102L42 82Z"
      fill="url(#safeher_robotWhite)"
      stroke="#E2E8F0"
      strokeWidth="1"
    />

    {/* Heart on chest */}
    <path
      d="M60 97C60 97 54 93.5 54 89.5C54 87.5 55.5 86 57.5 86C58.8 86 59.8 86.8 60 87.5C60.2 86.8 61.2 86 62.5 86C64.5 86 66 87.5 66 89.5C66 93.5 60 97 60 97Z"
      fill="url(#safeher_robotPink)"
    />

    {/* Waving hand */}
    <circle cx="95" cy="80" r="6" fill="url(#safeher_robotWhite)" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M93 76L97 74" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />
    <path d="M97 77L101 76" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />

    {/* Left arm */}
    <circle cx="25" cy="88" r="6" fill="url(#safeher_robotWhite)" stroke="#E2E8F0" strokeWidth="1" />
  </svg>
);
export default SafeHerRobotAvatar;
