import { useRef } from 'react'
import MovieCard from './MovieCard'
import styles from './ContentRow.module.css'

export default function ContentRow({ heading, items, onCardClick }) {
  const ref = useRef(null)

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 520, behavior: 'smooth' })
  }

  if (!items?.length) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.wrapper}>
        <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll(-1)}>‹</button>
        <div className={`${styles.row} hide-scrollbar`} ref={ref}>
          {items.map((item, i) => (
            <MovieCard
              key={item.id || i}
              item={item}
              onClick={onCardClick}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}
        </div>
        <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  )
}
