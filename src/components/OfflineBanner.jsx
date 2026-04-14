import { useState, useEffect } from 'react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import styles from './OfflineBanner.module.css'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  const [justReconnected, setJustReconnected] = useState(false)
  const [prevOnline, setPrevOnline] = useState(online)

  useEffect(() => {
    if (!prevOnline && online) {
      setJustReconnected(true)
      const t = setTimeout(() => setJustReconnected(false), 3000)
      return () => clearTimeout(t)
    }
    setPrevOnline(online)
  }, [online, prevOnline])

  if (online && !justReconnected) return null

  return (
    <div className={`${styles.banner} ${online ? styles.reconnected : styles.offline}`}>
      {online ? '✓ Back online — content updated' : '⚡ You are offline — showing cached content'}
    </div>
  )
}
