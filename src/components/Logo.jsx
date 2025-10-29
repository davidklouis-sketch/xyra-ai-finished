import React from 'react'

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Xyra.Media logo - neon ring">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#00ff88" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66ffb2" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* soft outer glow */}
      <circle cx="50" cy="50" r="34" fill="url(#glow)" filter="url(#blurGlow)" />
      {/* neon ring */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="url(#ring)" strokeWidth="6" />
      {/* inner dot */}
      <circle cx="50" cy="50" r="4" fill="#00ff88" />
    </svg>
  )
}

export default Logo

