import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
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
    console.log('Bootstrapping: loading companies, stats, and top questions')
    getCompanies()
      .then(r => {
        console.log('Companies loaded:', r.data.companies?.length || 0)
        setCompanies(r.data.companies)
      })
      .catch(err => console.error('Failed to load companies:', err))
    
    getStats()
      .then(r => {
        console.log('Stats loaded:', r.data)
        setStats(r.data)
      })
      .catch(err => console.error('Failed to load stats:', err))
    
    getTopQuestions(20)
      .then(r => {
        console.log('Top questions loaded:', r.data.results?.length || 0)
        setTopQuestions(r.data.results)
      })
      .catch(err => console.error('Failed to load top questions:', err))
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
        console.log('API response:', r.data)
        
        // Verify response structure
        if (!r.data || typeof r.data !== 'object') {
          throw new Error('Invalid response format: expected object')
        }
        
        // Handle the actual response structure: { results: [...], count: number }
        const data = r.data.results
        
        if (!Array.isArray(data)) {
          throw new Error(`Invalid results format: expected array, got ${typeof data}`)
        }
        
        console.log(`Received ${data.length} results from API`)
        
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
        // Check if this is a network/connection error vs other error
        const isNetworkError = 
          err.code === 'ECONNABORTED' ||
          err.code === 'ENOTFOUND' ||
          err.message === 'Network Error' ||
          err.message?.includes('timeout') ||
          err.response?.status === undefined
        
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          // Request was cancelled, don't show error
          console.log('Request cancelled')
          return
        }
        
        if (isNetworkError) {
          console.error('Network error:', err)
          setError('Could not reach the backend. Is the API running?')
        } else {
          // Data parsing or other error
          console.error('Error processing API response:', err)
          setError(`Error: ${err.message}`)
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

  const location = useLocation()

  return (
    <div className="relative min-h-screen bg-grid" style={{ background: '#06080f' }}>
      {/* Ambient glow blobs */}
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />

      {/* ── Header ── */}
      <header
        className="relative top-0 z-20"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(6,8,15,0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          >
            <div
              className="flex items-center justify-center w-8 h-8 text-sm font-black text-white logo-icon rounded-xl shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
            >
              L
            </div>
            <span className="text-base font-bold tracking-tight gradient-text">LeetLens</span>
          </Link>

          {/* Nav */}
          <nav className="items-center hidden gap-1 sm:flex">
            <Link
              to="/about"
              className="nav-link px-3.5 py-1.5 rounded-lg text-sm transition-colors duration-150 hover:bg-white/5"
              style={{
                color: location.pathname === '/about' ? '#e2e8f0' : '#94a3b8',
              }}
            >
              About
            </Link>
            <Link
              to="/#featured-companies-section"
              className="nav-link px-3.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150 hover:bg-white/5"
            >
              Companies
            </Link>
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

      {/* ── Routes ── */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              query={query}
              setQuery={setQuery}
              filters={filters}
              handleFilterChange={handleFilterChange}
              results={results}
              companies={companies}
              stats={stats}
              topQuestions={topQuestions}
              isLoading={isLoading}
              hasSearched={hasSearched}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              error={error}
              suggestions={suggestions}
              handleSuggestionSelect={handleSuggestionSelect}
              handleCompanySelect={handleCompanySelect}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>

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
