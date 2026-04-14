import { createContext, useContext, useState, useEffect } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sv_watchlist')) ?? [] } catch { return [] }
  })
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sv_history')) ?? [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('sv_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem('sv_history', JSON.stringify(history))
  }, [history])

  const addToWatchlist = (item) => {
    setWatchlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      return [item, ...prev]
    })
  }

  const removeFromWatchlist = (id) => {
    setWatchlist(prev => prev.filter(i => i.id !== id))
  }

  const isInWatchlist = (id) => watchlist.some(i => i.id === id)

  const addToHistory = (item) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== item.id)
      return [{ ...item, watchedAt: Date.now() }, ...filtered].slice(0, 50)
    })
  }

  const clearHistory = () => setHistory([])

  return (
    <WatchlistContext.Provider value={{
      watchlist, history,
      addToWatchlist, removeFromWatchlist, isInWatchlist,
      addToHistory, clearHistory
    }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  return useContext(WatchlistContext)
}
