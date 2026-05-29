import React from 'react'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const TIMEFRAMES = [
  { value: '', label: 'All Time' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: 'alltime', label: 'All Time (tag)' },
]

const DIFFICULTY_ACTIVE = {
  All: 'bg-white/10 text-white border-white/20',
  Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
  Hard: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-[0_0_12px_rgba(248,113,113,0.15)]',
}

export default function FilterBar({ filters, companies, onChange }) {
  const { difficulty, company, timeframe } = filters
  const hasActiveFilter = difficulty || company || timeframe

  return (
    <div className="flex flex-wrap items-center gap-2.5" id="filter-bar">
      {/* Difficulty pills */}
      <div
        className="flex rounded-xl p-0.5 gap-0.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {DIFFICULTIES.map(d => {
          const isActive = (d === 'All' && !difficulty) || difficulty === d
          return (
            <button
              key={d}
              id={`filter-difficulty-${d.toLowerCase()}`}
              onClick={() => onChange({ difficulty: d === 'All' ? '' : d })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? DIFFICULTY_ACTIVE[d]
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {d}
            </button>
          )
        })}
      </div>

      {/* Timeframe dropdown */}
      <div className="relative">
        <select
          id="filter-timeframe"
          value={timeframe}
          onChange={e => onChange({ timeframe: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-sm cursor-pointer rounded-xl transition-all duration-200 text-slate-300 focus:outline-none focus:border-indigo-500/40"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {TIMEFRAMES.map(tf => (
            <option key={tf.value} value={tf.value} className="bg-slate-900">
              {tf.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Company dropdown */}
      <div className="relative">
        <select
          id="filter-company"
          value={company}
          onChange={e => onChange({ company: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-sm cursor-pointer rounded-xl transition-all duration-200 text-slate-300 focus:outline-none focus:border-indigo-500/40 max-w-44"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <option value="" className="bg-slate-900">All Companies</option>
          {companies.map(c => (
            <option key={c} value={c} className="capitalize bg-slate-900">{c}</option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilter && (
        <button
          id="filter-reset-btn"
          onClick={() => onChange({ difficulty: '', company: '', timeframe: '' })}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-200 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/8 hover:border-rose-500/20 border border-transparent"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  )
}
