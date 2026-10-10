import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLACES, placeById } from '../data/places'
import { FavButton, PageHeader, StatusBadge } from '../components/ui'
import { useStore, type Saved } from '../lib/store'

export default function Notes() {
  const { saved, replaceAll, setNote } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const ids = Array.from(new Set([...saved.favorites, ...Object.keys(saved.notes)])).filter((id) => placeById(id))

  const exportJson = () => {
    const data = { app: 'toms-move-relocation-explorer', version: 1, exportedAt: new Date().toISOString(), ...saved }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `relocation-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const importJson = async (file: File) => {
    try {
      const v = JSON.parse(await file.text())
      const valid = new Set(PLACES.map((p) => p.id))
      const favorites: string[] = Array.isArray(v.favorites) ? v.favorites.filter((x: unknown) => typeof x === 'string' && valid.has(x)) : []
      const notes: Record<string, string> = {}
      if (v.notes && typeof v.notes === 'object') for (const [k, t] of Object.entries(v.notes)) if (valid.has(k) && typeof t === 'string') notes[k] = t
      const merged: Saved = { favorites: Array.from(new Set([...saved.favorites, ...favorites])), notes: { ...saved.notes, ...notes } }
      replaceAll(merged)
      setMsg(`Imported ${favorites.length} favorites and ${Object.keys(notes).length} notes (merged with what was here).`)
    } catch {
      setMsg('That file could not be read as notes JSON.')
    }
  }

  return (
    <div>
      <PageHeader title="My favorites & notes" sub="Saved only in this browser (localStorage). Export them to a JSON file to back up or move to another device.">
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={exportJson}>Export JSON</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = '' }} />
          {ids.length > 0 && <button className="btn" onClick={() => { if (confirm('Clear all favorites and notes in this browser?')) replaceAll({ favorites: [], notes: {} }) }}>Clear all</button>}
        </div>
      </PageHeader>
      {msg && <p className="mb-4 rounded-lg bg-teal-50 p-3 text-sm dark:bg-teal-950/40">{msg}</p>}
      {ids.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No favorites or notes yet. Tap ☆ on any place, or write a note on a <Link to="/places" className="text-teal-700 underline">place page</Link>.</div>
      ) : (
        <div className="space-y-3">
          {ids.map((id) => { const p = placeById(id)!; return (
            <div key={id} className="card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <FavButton id={id} />
                <Link to={`/places/${id}`} className="font-semibold hover:underline">{p.name}</Link>
                <StatusBadge status={p.status} />
              </div>
              <textarea className="input w-full" rows={3} value={saved.notes[id] ?? ''} onChange={(e) => setNote(id, e.target.value)} placeholder="Add a note…" aria-label={`Notes for ${p.name}`} />
            </div>
          ) })}
          {saved.favorites.length >= 2 && <Link className="btn" to={`/compare?ids=${saved.favorites.slice(0, 3).join(',')}`}>Compare my top favorites →</Link>}
        </div>
      )}
    </div>
  )
}
