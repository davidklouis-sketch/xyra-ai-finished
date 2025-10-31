import React from 'react'

const Logo = ({ className = "w-10 h-10", animate = false, float = false }) => {
  return (
    <div className={`relative ${className} ${float ? 'logo-float' : ''}`}>
      <img
        src="/xyra-logo.png"
        alt="XYRA AI Logo"
        className={`w-full h-full object-contain hover:drop-shadow-[0_0_15px_rgba(48,248,237,0.8)] transition-all duration-300 ${animate ? 'logo-animate' : 'drop-shadow-[0_0_8px_rgba(48,248,237,0.5)]'}`}
        style={{
          filter: animate ? undefined : 'brightness(1.1)',
        }}
      />
    </div>
  )
}

export default Logo

