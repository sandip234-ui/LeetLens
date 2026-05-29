import React, { useState, useRef, useEffect } from 'react'

export default function SearchBar({ value, onChange, isLoading, suggestions = [], onSuggestionSelect }) {
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)

  // Rotating placeholder text — cycles every 3 s when the field is empty & unfocused
  const PLACEHOLDERS = [
    'Try: Two Sum, Graph, Dynamic Programming…',
    'Try: Google, Amazon, Binary Search, DP…',
    'Try: Merge Intervals, BFS, Meta, Uber…',
    'Try: question number, title, or company…',
  ]
  const [phIdx, setPhIdx] = useState(0)
  useEffect(() => {
    if (value || focused) return
    const id = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3200)
    return () => clearInterval(id)
  }, [value, focused])

  // ⌘K / Ctrl+K focus shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Detect platform for proper key display
  const isMac = typeof navigator !== 'undefined' ? /Mac|iPod|iPhone|iPad/.test(navigator.platform) : false
  const modifierKey = isMac ? '⌘' : 'Ctrl'

  const showSuggestions = focused && suggestions.length > 0 && value.trim().length > 1

  const handleKeyDown = (e) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      onSuggestionSelect?.(suggestions[activeIdx])
      setActiveIdx(-1)
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  const handleSelect = (s) => {
    onSuggestionSelect?.(s)
    setActiveIdx(-1)
    setFocused(false)
  }

  return (
    <div className="relative w-full search-input-wrapper">

      {/* ── Ambient glow layer (always slightly present, stronger on focus) ── */}
      <div
        className="search-ambient-glow"
        style={{ opacity: focused ? 1 : 0.35 }}
      />

      {/* ── Main container ── */}
      <div
        className={`search-container relative flex items-center rounded-2xl border transition-all duration-300 ${
          focused ? 'search-focused' : 'search-idle'
        }`}
        style={{
          minHeight: '72px',
          padding: '4px'
        }}
      >
        {/* Search icon */}
        <div className="pl-6 pr-4 shrink-0">
          {isLoading ? (
            <svg className="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${focused ? 'text-indigo-400' : 'text-slate-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id="main-search-input"
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setActiveIdx(-1) }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[phIdx]}
          className="flex-1 py-6 text-[17px] font-medium text-white placeholder-slate-400/90 bg-transparent focus:outline-none tracking-[-0.01em]"
          autoComplete="off"
          spellCheck="false"
          aria-label="Search LeetCode questions by title, number, or company"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />

        {/* Right side: clear button or ⌘K badge */}
        <div className="pr-5 flex items-center gap-3 shrink-0">
          {value ? (
            <button
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              id="search-clear-btn"
              className="p-2 rounded-xl transition-all text-slate-400 hover:text-slate-200 hover:bg-white/10"
              aria-label="Clear search"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 search-kbd-badge">
              <kbd className="flex items-center justify-center w-6 h-6 rounded text-[11px] font-semibold search-kbd">
                {modifierKey}
              </kbd>
              <kbd className="flex items-center justify-center w-6 h-6 rounded text-[11px] font-semibold search-kbd">
                K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* ── Autocomplete dropdown ── */}
      {showSuggestions && (
        <div
          className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-white/8 overflow-hidden z-50 animate-slide-down"
          style={{ background: 'rgba(10,13,22,0.97)', backdropFilter: 'blur(20px)' }}
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">
            Suggestions
          </div>
          {suggestions.slice(0, 6).map((s, i) => (
            <button
              key={i}
              role="option"
              aria-selected={activeIdx === i}
              onMouseDown={() => handleSelect(s)}
              className={`autocomplete-item w-full text-left px-4 py-3 flex items-center gap-3 ${
                activeIdx === i ? 'active' : ''
              }`}
            >
              <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-slate-200 flex-1 truncate">{s.title}</span>
              <span className="ml-auto font-mono text-xs text-slate-500 shrink-0">#{s.question_id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
