import { useEffect } from 'react'
import { useWatchlist } from '../context/WatchlistContext'
import {
  getTitle, getImage, getYear, getRating, getType,
  getPlot, getGenres, getRuntime, getStars, getDirectors
} from '../api/titles'
import styles from './MovieModal.module.css'

export default function MovieModal({ item, onClose }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } = useWatchlist()
  const inList = isInWatchlist(item?.id)

  const title = getTitle(item)
  const image = getImage(item)
  const year = getYear(item)
  const rating = getRating(item)
  const type = getType(item)
  const plot = getPlot(item)
  const genres = getGenres(item)
  const runtime = getRuntime(item)
  const stars = getStars(item)
  const directors = getDirectors(item)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handlePlay = () => {
    addToHistory(item)
    onClose()
  }

  const handleWatchlist = () => {
    inList ? removeFromWatchlist(item.id) : addToWatchlist(item)
  }

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.banner}>
          {image
            ? <img src={image} alt={title} className={styles.bannerImg} />
            : <div className={styles.bannerFallback}>🎬</div>
          }
          <div className={styles.bannerGrad} />
          <div className={styles.bannerContent}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.meta}>
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              {rating && <span className={styles.rating}>★ {rating}</span>}
              {type && <span className={styles.badge}>{type}</span>}
            </div>
            <div className={styles.actions}>
              <button className={styles.playBtn} onClick={handlePlay}>▶ Play</button>
              <button
                className={`${styles.listBtn} ${inList ? styles.listActive : ''}`}
                onClick={handleWatchlist}
              >
                {inList ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          {genres.length > 0 && (
            <div className={styles.genres}>
              {genres.map(g => <span key={g} className={styles.genre}>{g}</span>)}
            </div>
          )}

          {plot && <p className={styles.plot}>{plot}</p>}

          <div className={styles.credits}>
            {directors.length > 0 && (
              <div className={styles.creditRow}>
                <span className={styles.creditLabel}>Director</span>
                <span className={styles.creditVal}>{directors.join(', ')}</span>
              </div>
            )}
            {stars.length > 0 && (
              <div className={styles.creditRow}>
                <span className={styles.creditLabel}>Stars</span>
                <span className={styles.creditVal}>{stars.slice(0, 4).join(', ')}</span>
              </div>
            )}
            {item?.id && (
              <div className={styles.creditRow}>
                <span className={styles.creditLabel}>ID</span>
                <span className={styles.creditVal} style={{ color: '#555', fontSize: 12 }}>{item.id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
