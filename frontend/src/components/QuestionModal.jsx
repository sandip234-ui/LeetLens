import React from 'react'

const DIFFICULTY_STYLES = {
  Easy: { badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', bar: 'bg-emerald-400' },
  Medium: { badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20', bar: 'bg-amber-400' },
  Hard: { badge: 'text-rose-400 bg-rose-400/10 border-rose-400/20', bar: 'bg-rose-400' },
}

const TIMEFRAME_LABEL = {
  '6months': '6 Months',
  '1year': '1 Year',
  '2years': '2 Years',
  alltime: 'All Time',
}

export default function QuestionModal({ question, onClose }) {
  if (!question) return null

  const difficulty = question.difficulty || 'Unknown'
  const styles = DIFFICULTY_STYLES[difficulty] || { badge: 'text-slate-400 bg-slate-400/10 border-slate-400/20', bar: 'bg-slate-400' }

  // Group companies by timeframe for organized display
  const byTimeframe = {}
  for (const c of question.companies || []) {
    const tf = c.timeframe || 'unknown'
    if (!byTimeframe[tf]) byTimeframe[tf] = []
    byTimeframe[tf].push(c)
  }

  const timeframeOrder = ['6months', '1year', '2years', 'alltime']
  const sortedTimeframes = Object.keys(byTimeframe).sort(
    (a, b) => (timeframeOrder.indexOf(a) - timeframeOrder.indexOf(b))
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
      id="question-modal-overlay"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl"
        onClick={e => e.stopPropagation()}
        id="question-modal-content"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d1117]/95 backdrop-blur-sm border-b border-white/[0.06] px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-500">#{question.question_id}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
                {difficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{question.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 mt-1 text-slate-400 hover:text-white transition-colors p-1"
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
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="text-xl font-bold text-emerald-400">{question.acceptance || '—'}</div>
              <div className="text-xs text-slate-400 mt-0.5">Acceptance</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="text-xl font-bold text-indigo-400">{question.company_count}</div>
              <div className="text-xs text-slate-400 mt-0.5">Companies</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className={`text-xl font-bold ${styles.badge.split(' ')[0]}`}>{difficulty}</div>
              <div className="text-xs text-slate-400 mt-0.5">Difficulty</div>
            </div>
          </div>

          {/* Companies by timeframe */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Companies Asking This
            </h3>
            <div className="space-y-4">
              {sortedTimeframes.map(tf => (
                <div key={tf}>
                  <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                    {TIMEFRAME_LABEL[tf] || tf}
                  </div>
                  <div className="space-y-1.5">
                    {byTimeframe[tf]
                      .sort((a, b) => b.frequency - a.frequency)
                      .map((c, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-sm text-slate-200 capitalize w-32 shrink-0">{c.company}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${styles.bar} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(c.frequency * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-mono w-10 text-right">
                            {(c.frequency * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
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
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
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
