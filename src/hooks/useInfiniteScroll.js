import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchTitles } from '../api/titles'

export function useInfiniteScroll(typeFilter) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const seen = useRef(new Set())
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    setItems([])
    setPage(1)
    setHasMore(true)
    seen.current = new Set()
    return () => { mounted.current = false }
  }, [typeFilter])

  useEffect(() => {
    if (!hasMore) return
    const controller = new AbortController()
    setLoading(true)

    fetchTitles({ page, type: typeFilter, limit: 20, signal: controller.signal })
      .then(({ titles }) => {
        if (!mounted.current) return
        if (!titles.length) { setHasMore(false); return }
        const unique = titles.filter(item => {
          if (!item?.id || seen.current.has(item.id)) return false
          seen.current.add(item.id)
          return true
        })
        setItems(prev => [...prev, ...unique])
        if (titles.length < 20) setHasMore(false)
      })
      .catch(err => { if (err.name !== 'AbortError') console.warn(err) })
      .finally(() => { if (mounted.current) setLoading(false) })

    return () => controller.abort()
  }, [page, typeFilter, hasMore])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(p => p + 1)
  }, [loading, hasMore])

  return { items, loading, hasMore, loadMore }
}
