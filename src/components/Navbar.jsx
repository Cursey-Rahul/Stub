import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'movies', label: 'Movies' },
  { id: 'tvshows', label: 'TV Shows' },
  { id: 'videogames', label: 'Video Games' },
]

export default function Navbar({ active, onNavigate, onSearch, onProfile }) {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'G'

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.solid : ''}`}>
      <span className={styles.logo}>STREAMVAULT</span>

      <ul className={styles.tabs}>
        {TABS.map(tab => (
          <li key={tab.id}>
            <button
              className={`${styles.tab} ${active === tab.id ? styles.activeTab : ''}`}
              onClick={() => onNavigate(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <button className={styles.searchBtn} onClick={onSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button className={styles.avatar} onClick={onProfile}>{initial}</button>
      </div>
    </nav>
  )
}
