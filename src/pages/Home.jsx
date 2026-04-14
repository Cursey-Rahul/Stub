import { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import ContentRow from '../components/ContentRow'
import MovieCard from '../components/MovieCard'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import styles from './Home.module.css'

const TYPE_MAP = {
  home: null,
  movies: 'movie',
  tvshows: 'tvSeries',
  videogames: 'videoGame',
}

const PAGE_HEADINGS = {
  home: 'All Titles',
  movies: 'Movies',
  tvshows: 'TV Shows',
  videogames: 'Video Games',
}

export default function Home({ activePage, onCardClick }) {
  const typeFilter = TYPE_MAP[activePage] ?? null
  const { items, loading, hasMore, loadMore } = useInfiniteScroll(typeFilter)
  const sentinel = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '400px' }
    )
    if (sentinel.current) observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [loadMore])

  const heroItem = items[0] ?? null
  const featuredRow = items.slice(1, 21)
  const gridItems = items.slice(21)

  return (
    <div className={styles.page}>
      {activePage === 'home' && (
        <Hero item={heroItem} onCardClick={onCardClick} />
      )}

      {activePage !== 'home' && (
        <div className={styles.catHeader}>
          <h1 className={styles.catTitle}>{PAGE_HEADINGS[activePage]}</h1>
        </div>
      )}

      {featuredRow.length > 0 && (
        <ContentRow
          heading={activePage === 'home' ? 'Featured' : PAGE_HEADINGS[activePage]}
          items={featuredRow}
          onCardClick={onCardClick}
        />
      )}

      {gridItems.length > 0 && (
        <section className={styles.gridSection}>
          <h2 className={styles.gridHeading}>
            {activePage === 'home' ? 'All Titles' : `More ${PAGE_HEADINGS[activePage]}`}
          </h2>
          <div className={styles.grid}>
            {gridItems.map((item, i) => (
              <MovieCard
                key={item.id || i}
                item={item}
                onClick={onCardClick}
                style={{ animationDelay: `${(i % 10) * 0.04}s` }}
              />
            ))}
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className={styles.skeletonCard} />
            ))}
          </div>
        </section>
      )}

      {loading && items.length === 0 && (
        <div className={styles.initialLoader}>
          <div className={styles.spinner} />
          <p>Loading...</p>
        </div>
      )}

      <div ref={sentinel} style={{ height: 1 }} />

      {!hasMore && items.length > 0 && (
        <p className={styles.endMsg}>— end of results —</p>
      )}
    </div>
  )
}
