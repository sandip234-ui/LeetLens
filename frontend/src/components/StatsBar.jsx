import React from 'react'

export default function StatsBar({ stats }) {
  if (!stats) return null
  return (
    <div className="flex items-center justify-center gap-8 text-sm" id="stats-bar">
      <div className="text-center">
        <div className="text-xl font-bold text-indigo-400">
          {stats.unique_questions?.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">Questions</div>
      </div>
      <div className="w-px h-8 bg-white/[0.06]" />
      <div className="text-center">
        <div className="text-xl font-bold text-violet-400">
          {stats.unique_companies?.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">Companies</div>
      </div>
      <div className="w-px h-8 bg-white/[0.06]" />
      <div className="text-center">
        <div className="text-xl font-bold text-emerald-400">
          {stats.total_entries?.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">Data Points</div>
      </div>
    </div>
  )
}
