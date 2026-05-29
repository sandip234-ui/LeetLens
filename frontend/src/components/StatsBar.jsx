import React, { useState, useEffect, useRef } from 'react'
import BorderGlow from './BorderGlow'

function AnimatedNumber({ target, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const animRef = useRef(null)

  useEffect(() => {
    if (!target) return
    const num = typeof target === 'string' ? parseFloat(target.replace(/,/g, '')) : target
    if (isNaN(num)) { setDisplay(target); return }

    const duration = 1200
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * num))
      if (progress < 1) animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [target])

  const formatted = typeof display === 'number' ? display.toLocaleString() : display
  return <span>{formatted}{suffix}</span>
}

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Questions',
      value: stats?.unique_questions,
      suffix: '',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-indigo-400',
      glowRgb: '99 102 241',
      glow: 'rgba(99,102,241,0.15)',
      borderHover: 'rgba(99,102,241,0.35)',
    },
    {
      label: 'Companies',
      value: stats?.unique_companies,
      suffix: '+',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'text-violet-400',
      glowRgb: '139 92 246',
      glow: 'rgba(139,92,246,0.15)',
      borderHover: 'rgba(139,92,246,0.35)',
    },
    {
      label: 'Data Points',
      value: stats?.total_entries,
      suffix: '+',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-emerald-400',
      glowRgb: '52 211 153',
      glow: 'rgba(52,211,153,0.15)',
      borderHover: 'rgba(52,211,153,0.35)',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3" id="stats-bar">
      {cards.map((card, i) => (
        <BorderGlow
          key={card.label}
          glowColor={card.glowRgb}
          borderRadius={20}
          glowRadius={70}
          glowIntensity={0.35}
          borderWidth={1}
          style={{ animationDelay: `${i * 80}ms` }}
          className="animate-fade-up"
        >
          <div
            className="stat-card rounded-2xl p-2 sm:p-3 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className={`flex justify-center mb-1.5 ${card.color} opacity-50`}>
              <div className="w-3.5 h-3.5">
                {card.icon}
              </div>
            </div>
            <div className={`text-lg sm:text-xl font-bold tracking-tight mb-0.5 ${card.color} opacity-80`}>
              {stats ? (
                <AnimatedNumber target={card.value} suffix={card.suffix} />
              ) : (
                <div className="skeleton h-6 w-14 mx-auto" />
              )}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{card.label}</div>
          </div>
        </BorderGlow>
      ))}
    </div>
  )
}
