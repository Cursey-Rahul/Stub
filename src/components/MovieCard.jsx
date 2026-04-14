import { useState } from 'react'
import { getTitle, getImage, getYear, getRating, getType } from '../api/titles'
import styles from './MovieCard.module.css'

const TYPE_ICON = { tvSeries: '📺', videoGame: '🎮', movie: '🎬', tvMovie: '🎬' }

export default function MovieCard({ item, onClick, style }) {
  const [imgErr, setImgErr] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const title = getTitle(item)
  const image = getImage(item)
  const year = getYear(item)
  const rating = getRating(item)
  const type = getType(item)
  const icon = TYPE_ICON[type] || '🎬'

  return (
    <div className={styles.card} onClick={() => onClick(item)} style={style}>
      <div className={styles.thumb}>
        {!imgLoaded && <div className={styles.skeleton} />}
        {image && !imgErr ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgErr(true)}
            className={styles.img}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        ) : (
          <div className={styles.fallback}><span>{icon}</span></div>
        )}
        <div className={styles.overlay}>
          <div className={styles.playCircle}>▶</div>
          {rating && <span className={styles.ratingBadge}>★ {rating}</span>}
        </div>
        {type && (
          <span className={styles.typePill}>
            {type === 'tvSeries' ? 'TV' : type === 'videoGame' ? 'GAME' : 'FILM'}
          </span>
        )}
      </div>
      <p className={styles.title}>{title}</p>
      {year && <p className={styles.year}>{year}</p>}
    </div>
  )
}
