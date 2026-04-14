const BASE = 'https://api.imdbapi.dev'

const cache = new Map()

async function apiFetch(path, signal) {
  if (cache.has(path)) return cache.get(path)
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) throw new Error(`${res.status}`)
  const data = await res.json()
  cache.set(path, data)
  return data
}

export async function fetchTitles({ page = 1, limit = 20, type = null, signal } = {}) {
  let path = `/titles?limit=${limit}&page=${page}`
  if (type) path += `&type=${type}`
  const data = await apiFetch(path, signal)
  return { titles: data?.titles ?? [], total: data?.totalCount ?? 0 }
}

export async function fetchTitleById(id, signal) {
  const data = await apiFetch(`/titles/${id}`, signal)
  return data
}

export async function searchByQuery(query, signal) {
  const path = `/titles/search?query=${encodeURIComponent(query)}&limit=12`
  const data = await apiFetch(path, signal)
  return data?.titles ?? []
}

export async function searchByYear(year, signal) {
  const path = `/titles?startYear=${year}&limit=12`
  const data = await apiFetch(path, signal)
  return data?.titles ?? []
}

export function getTitle(item) {
  return item?.primaryTitle || item?.originalTitle || 'Untitled'
}

export function getImage(item) {
  return item?.primaryImage?.url ?? null
}

export function getYear(item) {
  return item?.startYear ?? ''
}

export function getRating(item) {
  const r = item?.rating?.aggregateRating
  return r ? parseFloat(r).toFixed(1) : null
}

export function getType(item) {
  return item?.type ?? ''
}

export function getPlot(item) {
  return item?.plot ?? ''
}

export function getGenres(item) {
  return item?.genres ?? []
}

export function getRuntime(item) {
  if (!item?.runtimeSeconds) return ''
  const mins = Math.round(item.runtimeSeconds / 60)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export function getStars(item) {
  return (item?.stars ?? []).map(s => s.displayName).filter(Boolean)
}

export function getDirectors(item) {
  return (item?.directors ?? []).map(d => d.displayName).filter(Boolean)
}
