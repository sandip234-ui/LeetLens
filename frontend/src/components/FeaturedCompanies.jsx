import React from 'react'

const FEATURED = [
  { name: 'Google',      emoji: 'G', color: '#4285f4' },
  { name: 'Amazon',      emoji: 'A', color: '#ff9900' },
  { name: 'Meta',        emoji: 'M', color: '#0866ff' },
  { name: 'Microsoft',   emoji: 'M', color: '#00a4ef' },
  { name: 'Apple',       emoji: 'A', color: '#888888' },
  { name: 'Uber',        emoji: 'U', color: '#000000' },
  { name: 'Netflix',     emoji: 'N', color: '#e50914' },
  { name: 'Databricks',  emoji: 'D', color: '#ff3621' },
  { name: 'Bloomberg',   emoji: 'B', color: '#f26522' },
  { name: 'LinkedIn',    emoji: 'L', color: '#0a66c2' },
]

export default function FeaturedCompanies({ onSelect, allCompanies = [] }) {
  // Match featured names to actual company list (case-insensitive)
  const getCount = (name) => {
    // Just show the chip; count will be resolved from the actual data if available
    return allCompanies.find(c => c.toLowerCase() === name.toLowerCase())
  }

  return (
    <section id="featured-companies-section">
      <div className="section-heading mb-4">
        <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-sm font-semibold text-slate-300">Popular Companies</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {FEATURED.map((co, i) => {
          const matched = getCount(co.name)
          return (
            <button
              key={co.name}
              onClick={() => matched && onSelect(matched)}
              className="company-chip animate-fade-up flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
              style={{
                animationDelay: `${i * 40}ms`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                opacity: matched ? 1 : 0.5,
                cursor: matched ? 'pointer' : 'default',
              }}
              disabled={!matched}
              title={matched ? `Filter by ${co.name}` : `${co.name} not in dataset`}
            >
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ background: co.color }}
              >
                {co.emoji}
              </div>
              <span className="text-xs font-medium text-slate-200 whitespace-nowrap">{co.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
