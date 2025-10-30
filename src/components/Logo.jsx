import React from 'react'

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="XyraAI logo">
      <defs>
        <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00d9ff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Digital frame/border */}
      <rect x="12" y="12" width="76" height="76" fill="none" stroke="url(#xGradient)" strokeWidth="2" opacity="0.3" />

      {/* Main X shape */}
      <path
        d="M 25 25 L 50 50 L 75 25 M 75 75 L 50 50 L 25 75"
        stroke="url(#xGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />

      {/* Center digital core */}
      <circle cx="50" cy="50" r="8" fill="url(#xGradient)" opacity="0.9" />

      {/* Digital pixel accents - corners */}
      <rect x="18" y="18" width="8" height="8" fill="#00ff88" opacity="0.6" />
      <rect x="74" y="18" width="8" height="8" fill="#00ff88" opacity="0.6" />
      <rect x="18" y="74" width="8" height="8" fill="#00ff88" opacity="0.6" />
      <rect x="74" y="74" width="8" height="8" fill="#00ff88" opacity="0.6" />

      {/* Connecting lines - digital grid */}
      <line x1="22" y1="22" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.2" />
      <line x1="78" y1="22" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.2" />
      <line x1="22" y1="78" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.2" />
      <line x1="78" y1="78" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.2" />
    </svg>
  )
}

export default Logo

