import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'
import { getTitle, getImage, getYear } from '../api/titles'
import styles from './ProfilePage.module.css'

function MiniCard({ item, onClick }) {
  const img = getImage(item)
  const title = getTitle(item)
  const year = getYear(item)

  return (
    <div className={styles.miniCard} onClick={() => onClick(item)}>
      <div className={styles.miniThumb}>
        {img
          ? <img src={img} alt={title} loading="lazy" />
          : <span>🎬</span>
        }
      </div>
      <p className={styles.miniTitle}>{title}</p>
      {year && <p className={styles.miniYear}>{year}</p>}
    </div>
  )
}

export default function ProfilePage({ onClose, onCardClick }) {
  const { user, logout } = useAuth()
  const { watchlist, history, removeFromWatchlist, clearHistory } = useWatchlist()

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'G'
  const displayName = user?.displayName || user?.email || 'Guest'

  const handleCardClick = (item) => {
    onCardClick(item)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.profileHead}>
          <div className={styles.bigAvatar}>{initial}</div>
          <div>
            <p className={styles.displayName}>{displayName}</p>
            {user?.email && !user?.isGuest && (
              <p className={styles.emailText}>{user.email}</p>
            )}
            {user?.isGuest && <p className={styles.guestTag}>Guest Account</p>}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>My Watchlist</h3>
            <span className={styles.count}>{watchlist.length}</span>
          </div>
          {watchlist.length === 0
            ? <p className={styles.emptyMsg}>Nothing saved yet.</p>
            : (
              <div className={styles.miniRow}>
                {watchlist.map((item, i) => (
                  <MiniCard key={item.id || i} item={item} onClick={handleCardClick} />
                ))}
              </div>
            )
          }
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Watch History</h3>
            {history.length > 0 && (
              <button className={styles.clearBtn} onClick={clearHistory}>Clear</button>
            )}
          </div>
          {history.length === 0
            ? <p className={styles.emptyMsg}>No history yet.</p>
            : (
              <div className={styles.miniRow}>
                {history.map((item, i) => (
                  <MiniCard key={item.id || i} item={item} onClick={handleCardClick} />
                ))}
              </div>
            )
          }
        </div>

        <div className={styles.footer}>
          <button className={styles.signOutBtn} onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}
