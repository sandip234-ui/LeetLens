import React, { useRef, useEffect } from 'react'

const DIFFICULTY_BADGE = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

const TIMEFRAME_LABEL = {
  '6months': '6mo',
  '1year':   '1yr',
  '2years':  '2yr',
  alltime:   'All',
}

export default function QuestionCard({ question, onClick }) {
  const difficulty = question.difficulty || 'Unknown'
  const badgeClass = DIFFICULTY_BADGE[difficulty] || 'text-slate-400 bg-slate-400/10 border border-slate-400/20'

  const topCompanies = question.companies?.slice(0, 3) || []
  const extraCount   = (question.companies?.length || 0) - topCompanies.length
  const acceptanceNum = question.acceptance ? parseFloat(question.acceptance) : null

  // ── Inline BorderGlow: tracks mouse → updates CSS var, no React state ──
  const cardRef  = useRef(null)
  const glowRef  = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    let raf = null

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        glow.style.setProperty('--qgx', `${x}px`)
        glow.style.setProperty('--qgy', `${y}px`)
        glow.style.opacity = '1'
      })
    }

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      glow.style.opacity = '0'
    }

    card.addEventListener('mousemove', onMove, { passive: true })
    card.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={() => onClick?.(question)}
      className="question-card group rounded-2xl border border-white/6 p-5"
      style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}
      id={`question-card-${question.question_id}`}
    >
      {/* ── Border glow layer (indigo spotlight on border strip) ── */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 17,   /* 16px card radius + 1px border */
          padding: 1,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          background: 'radial-gradient(90px circle at var(--qgx, 50%) var(--qgy, 50%), rgba(99,102,241,0.7), transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Top row: number + title + difficulty */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="shrink-0 mt-0.5 font-mono text-xs text-slate-500 bg-slate-800/70 rounded-md px-1.5 py-0.5 border border-slate-700/50">
            #{question.question_id}
          </span>
          <h3 className="text-sm font-semibold leading-snug text-slate-100 group-hover:text-white transition-colors duration-200 line-clamp-2">
            {question.title}
          </h3>
        </div>
        <span className={`shrink-0 mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
          {difficulty}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-3.5">
        {acceptanceNum !== null && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-slate-400">{question.acceptance}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-400/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs text-slate-400">
            {question.company_count} {question.company_count === 1 ? 'company' : 'companies'}
          </span>
        </div>
      </div>

      {/* Company chips */}
      {topCompanies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {topCompanies.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full text-slate-300 capitalize"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.18)',
              }}
            >
              {c.company}
              {c.timeframe && (
                <span className="text-slate-500 text-[9px]">
                  {TIMEFRAME_LABEL[c.timeframe] || c.timeframe}
                </span>
              )}
            </span>
          ))}
          {extraCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-slate-500"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {/* Bottom hover accent line */}
      <div
        className="absolute inset-x-0 bottom-0 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
      />
    </div>
  )
}
