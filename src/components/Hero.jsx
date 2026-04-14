import { getTitle, getImage, getYear, getRating, getType, getPlot, getGenres, getRuntime } from '../api/titles'
import styles from './Hero.module.css'

export default function Hero({ item, onCardClick }) {
  if (!item) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonInner}>
          <div className={styles.skBar} style={{ width: 80, height: 13 }} />
          <div className={styles.skBar} style={{ width: 340, height: 56, marginTop: 14 }} />
          <div className={styles.skBar} style={{ width: 220, height: 14, marginTop: 14 }} />
          <div className={styles.skBar} style={{ width: 280, height: 46, marginTop: 24 }} />
        </div>
      </div>
    )
  }

  const title = getTitle(item)
  const image = getImage(item)
  const year = getYear(item)
  const rating = getRating(item)
  const type = getType(item)
  const plot = getPlot(item)
  const genres = getGenres(item)
  const runtime = getRuntime(item)

  return (
    <div className={styles.hero}>
      {image && <img src={image} alt={title} className={styles.backdrop} />}
      <div className={styles.gradLeft} />
      <div className={styles.gradBottom} />

      <div className={styles.content}>
        <p className={styles.topLabel}>🔥 Today's Top Pick</p>

        <h1 className={styles.title}>{title}</h1>

        {genres.length > 0 && (
          <div className={styles.genres}>
            {genres.slice(0, 3).map(g => <span key={g} className={styles.genre}>{g}</span>)}
          </div>
        )}

        <div className={styles.meta}>
          {year && <span>{year}</span>}
          {runtime && <span>{runtime}</span>}
          {rating && <span className={styles.rating}>★ {rating}</span>}
          {type && <span className={styles.badge}>{type}</span>}
        </div>

        {plot && <p className={styles.plot}>{plot}</p>}

        <div className={styles.actions}>
          <button className={styles.playBtn} onClick={() => onCardClick(item)}>
            ▶ Play
          </button>
          <button className={styles.infoBtn} onClick={() => onCardClick(item)}>
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  )
}
