import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchTitles } from '../api/titles'

export function useInfiniteScroll(typeFilter) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const nextToken = useRef(null)
  const seen = useRef(new Set())
  const mounted = useRef(true)

  // reset on filter change
  useEffect(() => {
    mounted.current = true
    setItems([])
    setHasMore(true)
    nextToken.current = null
    seen.current = new Set()

    loadMore() // initial fetch

    return () => { mounted.current = false }
  }, [typeFilter])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const res = await fetchTitles({
        type: typeFilter,
        nextPageToken: nextToken.current
      })

      if (!mounted.current) return

      const titles = res.titles || []

      if (!titles.length) {
        setHasMore(false)
        return
      }

      // remove duplicates
      const unique = titles.filter(item => {
        const id = item?.id || item?.tconst
        if (!id || seen.current.has(id)) return false
        seen.current.add(id)
        return true
      })

      setItems(prev => [...prev, ...unique])

      // update token
      nextToken.current = res.nextPageToken || null

      if (!nextToken.current) setHasMore(false)

    } catch (err) {
      console.warn(err)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [typeFilter, loading, hasMore])

  return { items, loading, hasMore, loadMore }
}