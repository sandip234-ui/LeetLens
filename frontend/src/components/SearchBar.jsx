import React from 'react'

export default function SearchBar({ value, onChange, isLoading }) {
  return (
    <div className="relative w-full">
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      <input
        id="main-search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by title, number, or keyword…"
        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-base focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 backdrop-blur-sm"
        autoComplete="off"
        spellCheck="false"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          id="search-clear-btn"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
