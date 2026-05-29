import React, { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import QuestionCard from './components/QuestionCard'
import QuestionModal from './components/QuestionModal'
import StatsCards from './components/StatsBar'
import CompanyMarquee from './components/CompanyMarquee'
import LightPillar from './components/LightPillar'
import BorderGlow from './components/BorderGlow'
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

// ─── Skeleton card ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 space-y-3.5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="w-8 h-5 rounded-md skeleton shrink-0" />
          <div className="skeleton h-4 w-48 mt-0.5" />
        </div>
        <div className="h-5 rounded-full skeleton w-14 shrink-0" />
      </div>
      <div className="flex gap-4">
        <div className="skeleton h-3.5 w-16" />
        <div className="skeleton h-3.5 w-24" />
      </div>
      <div className="flex gap-1.5">
        <div className="w-20 h-5 rounded-full skeleton" />
        <div className="w-16 h-5 rounded-full skeleton" />
        <div className="w-12 h-5 rounded-full skeleton" />
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
  const [suggestions, setSuggestions] = useState([])

  const debouncedQuery = useDebounce(query, 320)
  const abortRef = useRef(null)

  // ── Bootstrap ───────────────────────────────────────────────────
  useEffect(() => {
    getCompanies().then(r => setCompanies(r.data.companies)).catch(() => {})
    getStats().then(r => setStats(r.data)).catch(() => {})
    getTopQuestions(20).then(r => setTopQuestions(r.data.results)).catch(() => {})
  }, [])

  // ── Search ──────────────────────────────────────────────────────
  useEffect(() => {
    const hasQuery = debouncedQuery.trim() !== ''
    const hasFilter = Object.values(filters).some(v => v !== '')

    if (!hasQuery && !hasFilter) {
      setResults([])
      setSuggestions([])
      setHasSearched(false)
      setError(null)
      return
    }

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
        const data = r.data.results
        setResults(data)
        setHasSearched(true)
        // Build suggestions from results for autocomplete
        if (hasQuery && debouncedQuery.trim().length > 1) {
          setSuggestions(data.slice(0, 6))
        } else {
          setSuggestions([])
        }
      })
      .catch(err => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Could not reach the backend. Is the API running?')
        }
      })
      .finally(() => setIsLoading(false))
  }, [debouncedQuery, filters])

  const handleFilterChange = useCallback(partial => {
    setFilters(prev => ({ ...prev, ...partial }))
  }, [])

  const handleCompanySelect = useCallback(companyName => {
    setFilters(prev => ({ ...prev, company: companyName }))
  }, [])

  const handleSuggestionSelect = useCallback(question => {
    setQuery(question.title)
    setSuggestions([])
  }, [])

  // ── Escape closes modal ─────────────────────────────────────────
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelectedQuestion(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const showHero = !hasSearched && !isLoading && !Object.values(filters).some(v => v !== '')
  const totalResults = results.length

  return (
    <div className="relative min-h-screen bg-grid" style={{ background: '#06080f' }}>
      {/* Ambient glow blobs */}
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />

      {/* ── Header ── */}
      <header
        className="relative sticky top-0 z-20"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(6,8,15,0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 text-sm font-black text-white logo-icon rounded-xl shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
            >
              L
            </div>
            <span className="text-base font-bold tracking-tight gradient-text">LeetLens</span>
          </div>

          {/* Nav */}
          <nav className="items-center hidden gap-1 sm:flex">
            <a
              href="#top-questions-section"
              className="nav-link px-3.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150 hover:bg-white/5"
            >
              Top Questions
            </a>
            <a
              href="#featured-companies-section"
              className="nav-link px-3.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150 hover:bg-white/5"
            >
              Companies
            </a>
            <a
              href="https://github.com/sandip234-ui/LeetLens"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-all duration-150 hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-6xl px-4 py-8 mx-auto space-y-8 sm:px-6 sm:py-12">

        {/* ── Hero section (with LightPillar background) ── */}
        {showHero && (
          <div
            className="pt-4 pb-3 space-y-3 text-center hero-section sm:pt-10 animate-fade-up"
            style={{ borderRadius: 24, marginLeft: -4, marginRight: -4 }}
          >
            {/* Light pillar sits behind all hero content */}
            <LightPillar />

            {/* All hero content is positioned above the pillar via relative z-index */}
            <div className="relative z-10 space-y-3">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 border"
                style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.22)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                1,400+ LeetCode Problems · 200+ Companies
              </div>

              <h1 className="max-w-3xl mx-auto text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl gradient-text-hero">
                Find What Top Companies Actually Ask
              </h1>
            </div>
          </div>
        )}

        {/* ── Stats cards ── */}
        {showHero && (
          <div className="flex justify-center -mb-2">
            <div className="w-full max-w-md">
              <StatsCards stats={stats} />
            </div>
          </div>
        )}

        {/* ── Search + Filters (with premium animated glow) ── */}
        <div className="mt-0 space-y-2" id="search-section">
          <BorderGlow
            glowColor="139 92 246"
            borderRadius={24}
            glowRadius={80}
            glowIntensity={1.2}
            borderWidth={2}
            animated={true}
            edgeSensitivity={40}
            coneSpread={35}
            className="search-bar-glow-wrapper"
          >
            <SearchBar
              value={query}
              onChange={setQuery}
              isLoading={isLoading}
              suggestions={suggestions}
              onSuggestionSelect={handleSuggestionSelect}
            />
          </BorderGlow>
          {/* Filters - only show after search or when typing */}
          {(query.trim() !== '' || hasSearched) && (
            <div className="animate-filters-in">
              <FilterBar
                filters={filters}
                companies={companies}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* ── Error state ── */}
        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 text-sm rounded-xl text-rose-300"
            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2" id="results-skeleton">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Results ── */}
        {!isLoading && hasSearched && (
          <div className="space-y-4 animate-results-in">
            <>
            {/* Results count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  id="results-count"
                  className="text-xs font-medium px-2.5 py-1 rounded-full text-slate-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {totalResults === 0 ? 'No results' : `${totalResults} result${totalResults !== 1 ? 's' : ''}`}
                </span>
              </div>
              {totalResults > 0 && (
                <span className="text-xs text-slate-500">Sorted by company count</span>
              )}
            </div>

            {/* Results grid */}
            {totalResults > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2" id="results-grid">
                {results.map(q => (
                  <div key={q.question_id} className="animate-fade-up">
                    <QuestionCard question={q} onClick={() => setSelectedQuestion(q)} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div
                className="py-20 text-center rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                id="no-results"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  🔍
                </div>
                <h3 className="mb-1 text-base font-semibold text-slate-300">No questions found</h3>
                <p className="max-w-xs mx-auto text-sm text-slate-500">
                  Try another title, question number, or adjust your filters.
                </p>
                <button
                  onClick={() => {
                    setQuery('')
                    setFilters({ difficulty: '', company: '', timeframe: '' })
                  }}
                  className="px-4 py-2 mt-5 text-xs font-medium transition-all rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/8"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
          </div>
        )}

        {/* ── Company marquee (hero only) ── */}
        {showHero && companies.length > 0 && (
          <CompanyMarquee
            onSelect={handleCompanySelect}
            allCompanies={companies}
          />
        )}

        {/* ── Top / Most Asked Questions (show only after search) ── */}
        {!isLoading && hasSearched && topQuestions.length > 0 && (
          <section className="space-y-4 animate-filters-in" id="top-questions-section" style={{ animationDelay: '100ms' }}>
            <div className="section-heading">
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-300">Most Asked Questions</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {topQuestions.map(q => (
                <div key={q.question_id} className="animate-fade-up">
                  <QuestionCard question={q} onClick={() => setSelectedQuestion(q)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Detail modal ── */}
      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {/* ── Footer ── */}
      <footer
        className="relative z-10 py-10 mt-20"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-6xl px-4 mx-auto sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 mb-2 sm:justify-start">
                <div
                  className="flex items-center justify-center w-6 h-6 text-xs font-black text-white rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
                >
                  L
                </div>
                <span className="text-sm font-bold gradient-text">LeetLens</span>
              </div>
              <p className="mb-1 text-xs text-slate-600">Company-wise LeetCode Analytics Platform</p>
              <div className="flex items-center justify-center gap-2 text-xs sm:justify-start text-slate-600">
                <span>{stats?.unique_questions?.toLocaleString() || '—'} Questions</span>
                <span>·</span>
                <span>{stats?.unique_companies?.toLocaleString() || '—'} Companies</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Built with React + FastAPI</span>
              <span className="w-px h-4 bg-white/10" />
              <a
                href="https://github.com/sandip234-ui/LeetLens"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
