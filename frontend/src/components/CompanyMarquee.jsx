import React, { useRef, useState } from 'react'

/**
 * CompanyMarquee
 * – Two rows: row 1 scrolls left, row 2 scrolls right.
 * – Pause on hover (CSS animation-play-state).
 * – Edge gradient fades.
 * – Clicking a chip still calls onSelect → triggers company filter.
 * – Framer Motion is NOT used here; pure CSS keeps it GPU-friendly
 *   and avoids any layout reflows.
 */

const COMPANIES = [
  { name: 'Google',      initial: 'G', color: '#4285f4', bg: 'rgba(66,133,244,0.12)'  },
  { name: 'Amazon',      initial: 'A', color: '#ff9900', bg: 'rgba(255,153,0,0.12)'   },
  { name: 'Meta',        initial: 'M', color: '#1877f2', bg: 'rgba(24,119,242,0.12)'  },
  { name: 'Microsoft',   initial: 'M', color: '#00a4ef', bg: 'rgba(0,164,239,0.12)'   },
  { name: 'Apple',       initial: 'A', color: '#999999', bg: 'rgba(153,153,153,0.10)' },
  { name: 'Netflix',     initial: 'N', color: '#e50914', bg: 'rgba(229,9,20,0.12)'    },
  { name: 'Uber',        initial: 'U', color: '#ffffff', bg: 'rgba(255,255,255,0.08)' },
  { name: 'Bloomberg',   initial: 'B', color: '#f26522', bg: 'rgba(242,101,34,0.12)'  },
  { name: 'LinkedIn',    initial: 'L', color: '#0a66c2', bg: 'rgba(10,102,194,0.12)'  },
  { name: 'Databricks',  initial: 'D', color: '#ff3621', bg: 'rgba(255,54,33,0.12)'   },
  { name: 'Palantir',    initial: 'P', color: '#7c6af7', bg: 'rgba(124,106,247,0.12)' },
  { name: 'Adobe',       initial: 'A', color: '#ff0000', bg: 'rgba(255,0,0,0.10)'     },
  { name: 'Oracle',      initial: 'O', color: '#f80000', bg: 'rgba(248,0,0,0.10)'     },
]

// Split into two interleaved rows
const ROW1 = COMPANIES.slice(0, 7)   // Google → Bloomberg
const ROW2 = COMPANIES.slice(6)      // Uber → Oracle  (slight overlap keeps it varied)

function MarqueeRow({ items, direction = 'left', onSelect, allCompanies = [], speed = 40 }) {
  const [paused, setPaused] = useState(false)
  // Duplicate array so the loop is seamless
  const doubled = [...items, ...items]

  const animName = direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div
      className="marquee-row-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Edge fades */}
      <div className="marquee-fade-left"  aria-hidden="true" />
      <div className="marquee-fade-right" aria-hidden="true" />

      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '10px',
          width: 'max-content',
          animation: `${animName} ${speed}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {doubled.map((co, idx) => {
          const matched = allCompanies.find(c => c.toLowerCase() === co.name.toLowerCase())
          const clickable = Boolean(matched)

          return (
            <button
              key={`${co.name}-${idx}`}
              onClick={() => clickable && onSelect(matched)}
              disabled={!clickable}
              title={clickable ? `Filter by ${co.name}` : `${co.name} not in dataset`}
              aria-label={`Filter questions by ${co.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(8px)',
                cursor: clickable ? 'pointer' : 'default',
                opacity: clickable ? 1 : 0.45,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'border-color 0.2s, background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                if (!clickable) return
                e.currentTarget.style.borderColor = `${co.color}55`
                e.currentTarget.style.background = co.bg
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Brand-colour avatar */}
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: co.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#fff',
                  flexShrink: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {co.initial}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>
                {co.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CompanyMarquee({ onSelect, allCompanies = [] }) {
  return (
    <section id="featured-companies-section" style={{ overflow: 'hidden' }}>
      {/* Section heading */}
      <div className="section-heading mb-5">
        <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-sm font-semibold text-slate-300">Popular Companies</h2>
        <span
          className="text-[10px] text-slate-500 ml-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '1px 6px' }}
        >
          click to filter
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MarqueeRow
          items={ROW1}
          direction="left"
          onSelect={onSelect}
          allCompanies={allCompanies}
          speed={38}
        />
        <MarqueeRow
          items={ROW2}
          direction="right"
          onSelect={onSelect}
          allCompanies={allCompanies}
          speed={44}
        />
      </div>
    </section>
  )
}
