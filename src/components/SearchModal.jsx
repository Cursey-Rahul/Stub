import { useState, useEffect, useRef } from 'react'
import { searchByQuery, searchByYear, fetchTitleById } from '../api/titles'
import { useDebounce } from '../hooks/useDebounce'
import MovieCard from './MovieCard'
import styles from './SearchModal.module.css'

export default function SearchModal({ onClose, onCardClick }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 420)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length < 2) { setResults([]); setSearched(false); return }

    const controller = new AbortController()
    setLoading(true)
    setSearched(true)

    const isImdbId = /^tt\d{5,}$/.test(q)
    const isYear = /^\d{4}$/.test(q)

    let fetchFn
    if (isImdbId) {
      fetchFn = fetchTitleById(q, controller.signal).then(d => d ? [d] : [])
    } else if (isYear) {
      fetchFn = searchByYear(q, controller.signal)
    } else {
      fetchFn = searchByQuery(q, controller.signal)
    }

    fetchFn
      .then(data => { setResults(data); setLoading(false) })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false) })

    return () => controller.abort()
  }, [debouncedQuery])

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, year (2023), or IMDB ID (tt1234567)..."
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.body}>
          {loading && (
            <div className={styles.center}>
              <div className={styles.spinner} />
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className={styles.center}>
              <p className={styles.emptyMsg}>No results for "{debouncedQuery}"</p>
            </div>
          )}

          {!loading && !searched && (
            <div className={styles.hints}>
              <p className={styles.hintTitle}>Search tips</p>
              <p className={styles.hint}>• Type a movie or show name</p>
              <p className={styles.hint}>• Enter a year like <strong>2022</strong></p>
              <p className={styles.hint}>• Use an IMDB ID like <strong>tt0111161</strong></p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className={styles.grid}>
              {results.map((item, i) => (
                <MovieCard
                  key={item.id || i}
                  item={item}
                  onClick={item => { onCardClick(item); onClose() }}
                  style={{ animationDelay: `${i * 0.04}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
