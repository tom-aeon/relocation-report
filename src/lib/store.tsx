import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
import { PLACES, type Place } from '../data/places'

export interface Saved {
  favorites: string[]
  notes: Record<string, string>
  rejected: string[]
}
const KEY = 'reloc.saved.v1'

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const v = JSON.parse(raw)
      return {
        favorites: Array.isArray(v.favorites) ? v.favorites : [],
        notes: v.notes && typeof v.notes === 'object' ? v.notes : {},
        rejected: Array.isArray(v.rejected) ? v.rejected : [],
      }
    }
  } catch { /* ignore */ }
  return { favorites: [], notes: {}, rejected: [] }
}

interface Ctx {
  saved: Saved
  toggleFav: (id: string) => void
  setNote: (id: string, text: string) => void
  toggleReject: (id: string) => void
  isRejected: (id: string) => boolean
  replaceAll: (s: Saved) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  activePlaces: Place[]
  rejectedPlaces: Place[]
  rejectedCount: number
}
const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light')

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(saved)) } catch { /* ignore */ } }, [saved])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('reloc.theme', theme) } catch { /* ignore */ }
  }, [theme])

  const activePlaces = useMemo(() =>
    PLACES.filter(p => !saved.rejected.includes(p.id)), [saved.rejected])

  const rejectedPlaces = useMemo(() =>
    PLACES.filter(p => saved.rejected.includes(p.id)), [saved.rejected])

  const ctx: Ctx = {
    saved,
    toggleFav: (id) => setSaved((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
    setNote: (id, text) => setSaved((s) => {
      const notes = { ...s.notes }
      if (text.trim()) notes[id] = text; else delete notes[id]
      return { ...s, notes }
    }),
    toggleReject: (id) => setSaved((s) => ({
      ...s,
      rejected: s.rejected.includes(id) ? s.rejected.filter((r) => r !== id) : [...s.rejected, id],
    })),
    isRejected: (id) => saved.rejected.includes(id),
    replaceAll: (s) => setSaved({ ...s, rejected: Array.isArray(s.rejected) ? s.rejected : [] }),
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    activePlaces,
    rejectedPlaces,
    rejectedCount: saved.rejected.length,
  }
  return <StoreCtx.Provider value={ctx}>{children}</StoreCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('StoreProvider missing')
  return c
}
