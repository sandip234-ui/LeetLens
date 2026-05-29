import React, { useEffect, useState } from 'react'

const DIFFICULTY_STYLES = {
  Easy:   { badge: 'badge-easy', bar: 'bg-emerald-400', text: 'text-emerald-400' },
  Medium: { badge: 'badge-medium', bar: 'bg-amber-400', text: 'text-amber-400' },
  Hard:   { badge: 'badge-hard', bar: 'bg-rose-400', text: 'text-rose-400' },
}

export default function QuestionModal({ question, onClose }) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  if (!question) return null

  const difficulty = question.difficulty || 'Unknown'
  const styles = DIFFICULTY_STYLES[difficulty] || {
    badge: 'text-slate-400 bg-slate-400/10 border border-slate-400/20',
    bar: 'bg-slate-400',
    text: 'text-slate-400',
  }

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Helper function to format frequency intelligently
  const formatFrequency = (score) => {
    if (score >= 1) {
      return parseFloat(score.toFixed(1)).toString()
    } else {
      return parseFloat(score.toFixed(2)).toString()
    }
  }

  // Aggregate companies across all timeframes
  const aggregatedCompanies = {}
  for (const c of question.companies || []) {
    const company = c.company || 'Unknown'
    if (!aggregatedCompanies[company]) {
      aggregatedCompanies[company] = 0
    }
    aggregatedCompanies[company] += (c.frequency || 0)
  }

  // Convert to array, filter out zero values, and sort by frequency descending
  const sortedCompanies = Object.entries(aggregatedCompanies)
    .map(([company, frequency]) => ({ company, frequency }))
    .filter(c => c.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency)

  const maxFreq = Math.max(...sortedCompanies.map(c => c.frequency), 0.01)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-enter"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
      id="question-modal-overlay"
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl modal-content-enter"
        style={{
          background: 'rgba(10, 13, 20, 0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={e => e.stopPropagation()}
        id="question-modal-content"
      >
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 flex items-start justify-between gap-4"
          style={{
            background: 'rgba(10, 13, 20, 0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50">
                #{question.question_id}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                {difficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold leading-snug text-white">{question.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-150 shrink-0 text-slate-500 hover:text-white hover:bg-white/8"
            id="modal-close-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-4 text-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-2xl font-bold text-emerald-400 mb-0.5">{question.acceptance || '—'}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Acceptance</div>
            </div>
            <div
              className="p-4 text-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-2xl font-bold text-indigo-400 mb-0.5">{question.company_count}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Companies</div>
            </div>
            <div
              className="p-4 text-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className={`text-2xl font-bold mb-0.5 ${styles.text}`}>{difficulty}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Difficulty</div>
            </div>
          </div>

          {/* Companies section */}
          <div>
            <div className="section-heading mb-2 relative">
              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-sm font-semibold text-slate-200">Top Companies Asking This</h3>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="ml-2 w-4 h-4 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors duration-150 shrink-0 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-label="Frequency score information"
              >
                ⓘ
              </button>
              {showTooltip && (
                <div
                  className="absolute top-full left-0 mt-2 z-50 p-3 rounded-lg text-xs text-slate-200 w-48"
                  style={{
                    background: 'rgba(20, 24, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    animation: 'fade-in 0.2s ease-in-out',
                  }}
                >
                  <p className="leading-relaxed">
                    Frequency Score from LeetCode company data. Higher values indicate the question appears more frequently in interviews.
                  </p>
                </div>
              )}
            </div>

            {/* Context label */}
            <div className="text-[11px] text-slate-500 mb-3.5 tracking-wide">
              Frequency Score • Higher = asked more often
            </div>

            <div className="space-y-2">
              {sortedCompanies.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {c.company?.[0]?.toUpperCase()}
                  </div>
                  <span className="w-28 text-sm capitalize text-slate-200 shrink-0 truncate">{c.company}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className={`h-full ${styles.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min((c.frequency / maxFreq) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="w-12 font-mono text-xs text-right text-slate-500 shrink-0">
                    {formatFrequency(c.frequency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LeetCode link */}
          {question.link && (
            <a
              href={question.link.trim()}
              target="_blank"
              rel="noopener noreferrer"
              id="leetcode-link-btn"
              className="btn-primary flex items-center justify-center w-full gap-2 py-3.5 text-sm font-semibold text-white rounded-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open on LeetCode
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
