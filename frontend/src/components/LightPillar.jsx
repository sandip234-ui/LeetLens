import React from 'react'

/**
 * LightPillar – inspired by ReactBits light pillar background.
 * Renders vertical translucent beams + a soft radial bloom,
 * entirely via inline SVG + CSS. No JS animation libraries needed.
 * GPU-friendly: only opacity & transform are animated.
 */
export default function LightPillar({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`light-pillar-root ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* ── Central radial bloom ── */}
      <div
        className="light-pillar-bloom"
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: 900,
          height: 600,
          background:
            'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 35%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />

      {/* ── SVG vertical pillars ── */}
      <svg
        className="light-pillar-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Pillar gradient — bright top, fades to transparent */}
          <linearGradient id="pillar-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a5b4fc" stopOpacity="0.22" />
            <stop offset="40%"  stopColor="#818cf8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pillar-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="0.18" />
            <stop offset="50%"  stopColor="#a78bfa" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pillar-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.12" />
            <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
          {/* Soft blur filter */}
          <filter id="pillar-blur" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="pillar-blur-sm" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Wide centre pillar */}
        <rect
          x="44%" y="-5%"
          width="12%" height="75%"
          rx="6%" fill="url(#pillar-a)"
          filter="url(#pillar-blur)"
          className="pillar-anim pillar-anim-1"
        />

        {/* Left-centre pillar */}
        <rect
          x="28%" y="-5%"
          width="7%" height="60%"
          rx="4%" fill="url(#pillar-b)"
          filter="url(#pillar-blur)"
          className="pillar-anim pillar-anim-2"
        />

        {/* Right-centre pillar */}
        <rect
          x="65%" y="-5%"
          width="7%" height="55%"
          rx="4%" fill="url(#pillar-b)"
          filter="url(#pillar-blur)"
          className="pillar-anim pillar-anim-3"
        />

        {/* Far-left thin accent */}
        <rect
          x="14%" y="-5%"
          width="3.5%" height="45%"
          rx="2%" fill="url(#pillar-c)"
          filter="url(#pillar-blur-sm)"
          className="pillar-anim pillar-anim-4"
        />

        {/* Far-right thin accent */}
        <rect
          x="83%" y="-5%"
          width="3.5%" height="40%"
          rx="2%" fill="url(#pillar-c)"
          filter="url(#pillar-blur-sm)"
          className="pillar-anim pillar-anim-5"
        />
      </svg>

      {/* ── Bottom fade-to-dark so content below doesn't look floaty ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, transparent, #06080f)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
