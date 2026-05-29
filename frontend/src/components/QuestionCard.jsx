import React from 'react'

const DIFFICULTY_STYLES = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
  Hard: 'text-rose-400 bg-rose-400/10 border border-rose-400/20',
}

const TIMEFRAME_LABEL = {
  '6months': '6 Months',
  '1year': '1 Year',
  '2years': '2 Years',
  alltime: 'All Time',
}

export default function QuestionCard({ question, onClick }) {
  const difficulty = question.difficulty || 'Unknown'
  const badgeStyle = DIFFICULTY_STYLES[difficulty] || 'text-slate-400 bg-slate-400/10 border border-slate-400/20'

  // Show top 5 companies, sorted by frequency already from backend
  const topCompanies = question.companies?.slice(0, 5) || []
  const extraCount = (question.companies?.length || 0) - topCompanies.length

  return (
    <div
      onClick={() => onClick?.(question)}
      className="group relative cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(99,102,241,0.08)] hover:-translate-y-0.5"
      id={`question-card-${question.question_id}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 text-xs font-mono text-slate-500 bg-slate-800/60 rounded-md px-2 py-0.5">
            #{question.question_id}
          </span>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white truncate leading-snug">
            {question.title}
          </h3>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeStyle}`}>
          {difficulty}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-400">
        {question.acceptance && (
          <span className="flex items-center gap-1">
            <span className="text-emerald-400/70">✓</span>
            {question.acceptance}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="text-indigo-400/70">🏢</span>
          <span>{question.company_count} {question.company_count === 1 ? 'company' : 'companies'}</span>
        </span>
      </div>

      {/* Company chips */}
      {topCompanies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topCompanies.map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-700/50 border border-slate-600/30 text-slate-300"
            >
              <span className="capitalize">{c.company}</span>
              {c.timeframe && (
                <span className="text-slate-500 text-[10px]">
                  · {TIMEFRAME_LABEL[c.timeframe] || c.timeframe}
                </span>
              )}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/30">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {/* Hover glow edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
    </div>
  )
}
