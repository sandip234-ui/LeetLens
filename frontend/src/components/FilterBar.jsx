import React from 'react'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const TIMEFRAMES = [
  { value: '', label: 'All Time' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: 'alltime', label: 'All Time (tag)' },
]

export default function FilterBar({ filters, companies, onChange }) {
  const { difficulty, company, timeframe } = filters

  return (
    <div className="flex flex-wrap items-center gap-2" id="filter-bar">
      {/* Difficulty filter */}
      <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-0.5 gap-0.5">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            id={`filter-difficulty-${d.toLowerCase()}`}
            onClick={() => onChange({ difficulty: d === 'All' ? '' : d })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              (d === 'All' && !difficulty) || difficulty === d
                ? d === 'Easy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : d === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : d === 'Hard'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-white/[0.06] text-white border border-white/[0.1]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timeframe filter */}
      <select
        id="filter-timeframe"
        value={timeframe}
        onChange={e => onChange({ timeframe: e.target.value })}
        className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-slate-300 focus:outline-none focus:border-indigo-500/40 cursor-pointer transition-all"
      >
        {TIMEFRAMES.map(tf => (
          <option key={tf.value} value={tf.value} className="bg-slate-900">
            {tf.label}
          </option>
        ))}
      </select>

      {/* Company filter */}
      <select
        id="filter-company"
        value={company}
        onChange={e => onChange({ company: e.target.value })}
        className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-slate-300 focus:outline-none focus:border-indigo-500/40 cursor-pointer transition-all max-w-[160px]"
      >
        <option value="" className="bg-slate-900">All Companies</option>
        {companies.map(c => (
          <option key={c} value={c} className="bg-slate-900 capitalize">{c}</option>
        ))}
      </select>

      {/* Reset filters */}
      {(difficulty || company || timeframe) && (
        <button
          id="filter-reset-btn"
          onClick={() => onChange({ difficulty: '', company: '', timeframe: '' })}
          className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/[0.1] transition-all"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
