import React, { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import QuestionCard from './components/QuestionCard'
import QuestionModal from './components/QuestionModal'
import StatsBar from './components/StatsBar'
import { searchQuestions, getCompanies, getStats, getTopQuestions } from './api'

// ─── Debounce hook ─────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ─── Skeleton loader ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-4 w-48" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-3 w-32" />
      <div className="flex gap-2">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-24 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ difficulty: '', company: '', timeframe: '' })
  const [results, setResults] = useState([])
  const [companies, setCompanies] = useState([])
  const [stats, setStats] = useState(null)
  const [topQuestions, setTopQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query, 320)
  const abortRef = useRef(null)

  // ── Bootstrap data ─────────────────────────────────────────────
  useEffect(() => {
    getCompanies().then(r => setCompanies(r.data.companies)).catch(() => {})
    getStats().then(r => setStats(r.data)).catch(() => {})
    getTopQuestions(20).then(r => setTopQuestions(r.data.results)).catch(() => {})
  }, [])

  // ── Search whenever query or filters change ─────────────────────
  useEffect(() => {
    const hasQuery = debouncedQuery.trim() !== ''
    const hasFilter = Object.values(filters).some(v => v !== '')

    if (!hasQuery && !hasFilter) {
      setResults([])
      setHasSearched(false)
      setError(null)
      return
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    searchQuestions({
      q: debouncedQuery,
      difficulty: filters.difficulty,
      company: filters.company,
      timeframe: filters.timeframe,
      limit: 60,
    })
      .then(r => {
        setResults(r.data.results)
        setHasSearched(true)
      })
      .catch(err => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Could not reach the backend. Is the API running?')
        }
      })
      .finally(() => setIsLoading(false))
  }, [debouncedQuery, filters])

  // ── Filter change handler ───────────────────────────────────────
  const handleFilterChange = useCallback(partial => {
    setFilters(prev => ({ ...prev, ...partial }))
  }, [])

  // ── Keyboard: Escape closes modal ──────────────────────────────
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelectedQuestion(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const showHero = !hasSearched && !isLoading && !Object.values(filters).some(v => v !== '')

  return (
    <div className="relative min-h-screen bg-grid" style={{ background: '#060810' }}>
      {/* Ambient glow blobs */}
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-white/4 bg-black/20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">
              L
            </div>
            <span className="text-base font-bold gradient-text tracking-tight">LeetLens</span>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Company-wise LeetCode tracker
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Hero section (only visible before any search) */}
        {showHero && (
          <div className="text-center pt-8 pb-4 space-y-3 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tight leading-tight">
              LeetLens
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Search 1,400+ LeetCode problems across 200 companies.
              Find what <em className="text-slate-300 not-italic">your</em> target company actually asks.
            </p>
            <div className="pt-2">
              <StatsBar stats={stats} />
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="space-y-3">
          <SearchBar value={query} onChange={setQuery} isLoading={isLoading} />
          <FilterBar filters={filters} companies={companies} onChange={handleFilterChange} />
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-300 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2" id="results-skeleton">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && (
          <>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span id="results-count">
                {results.length === 0
                  ? 'No results found'
                  : `${results.length} result${results.length !== 1 ? 's' : ''}`}
              </span>
              {results.length > 0 && (
                <span>Sorted by company count</span>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2" id="results-grid">
                {results.map(q => (
                  <div key={q.question_id} className="animate-fade-up">
                    <QuestionCard
                      question={q}
                      onClick={() => setSelectedQuestion(q)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500" id="no-results">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-base">No questions matched your search.</p>
                <p className="text-sm mt-1">Try a different title, number, or adjust the filters.</p>
              </div>
            )}
          </>
        )}

        {/* Top Questions (shown when no search active) */}
        {showHero && topQuestions.length > 0 && (
          <section className="space-y-3" id="top-questions-section">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Most Asked
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {topQuestions.map(q => (
                <div key={q.question_id} className="animate-fade-up">
                  <QuestionCard
                    question={q}
                    onClick={() => setSelectedQuestion(q)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Detail Modal ── */}
      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/4 mt-16 py-6 text-center text-xs text-slate-600">
        LeetLens · {stats?.unique_questions?.toLocaleString() || '—'} questions · {stats?.unique_companies?.toLocaleString() || '—'} companies
      </footer>
    </div>
  )
}
