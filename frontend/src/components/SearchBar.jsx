import React from 'react'

export default function SearchBar({ value, onChange, isLoading }) {
  return (
    <div className="relative w-full">
      {/* Search icon */}
      <div className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400">
        {isLoading ? (
          <svg className="w-5 h-5 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
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
        className="w-full py-4 pl-12 pr-4 text-base text-white transition-all duration-200 border rounded-2xl bg-white/4 border-white/8 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/6 focus:ring-1 focus:ring-indigo-500/30 backdrop-blur-sm"
        autoComplete="off"
        spellCheck="false"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          id="search-clear-btn"
          className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-slate-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
