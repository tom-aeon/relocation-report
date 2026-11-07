import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLACES, placeById } from '../data/places'
import { FavButton, PageHeader, RejectButton, StatusBadge } from '../components/ui'
import { useStore, type Saved } from '../lib/store'

export default function Notes() {
  const { saved, replaceAll, setNote, rejectedCount, isRejected } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const ids = Array.from(new Set([...saved.favorites, ...Object.keys(saved.notes)])).filter((id) => placeById(id))

  const exportJson = () => {
    const data = { app: 'the-move-relocation-explorer', version: 2, exportedAt: new Date().toISOString(), ...saved }
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
      const rejected: string[] = Array.isArray(v.rejected) ? v.rejected.filter((x: unknown) => typeof x === 'string' && valid.has(x)) : []
      const merged: Saved = {
        favorites: Array.from(new Set([...saved.favorites, ...favorites])),
        notes: { ...saved.notes, ...notes },
        rejected: Array.from(new Set([...saved.rejected, ...rejected])),
      }
      replaceAll(merged)
      setMsg(`Imported ${favorites.length} favorites, ${Object.keys(notes).length} notes, and ${rejected.length} rejections (merged with what was here).`)
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
          {(ids.length > 0 || rejectedCount > 0) && <button className="btn" onClick={() => { if (confirm('Clear all favorites, notes and rejections in this browser?')) replaceAll({ favorites: [], notes: {}, rejected: [] }) }}>Clear all</button>}
        </div>
      </PageHeader>
      {msg && <p className="mb-4 rounded-lg bg-teal-50 p-3 text-sm dark:bg-teal-950/40">{msg}</p>}

      {rejectedCount > 0 && (
        <div className="mb-6 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Rejected places</h3>
              <p className="text-sm text-slate-500">{rejectedCount} place{rejectedCount === 1 ? '' : 's'} rejected · <Link to="/places?rejected=1" className="text-teal-700 underline dark:text-teal-400">View all →</Link></p>
            </div>
          </div>
        </div>
      )}

      {ids.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No favorites or notes yet. Tap ☆ on any place, or write a note on a <Link to="/places" className="text-teal-700 underline">place page</Link>.</div>
      ) : (
        <div className="space-y-3">
          {ids.map((id) => {
            const p = placeById(id)!
            const rejected = isRejected(id)
            return (
              <div key={id} className={`card p-4 ${rejected ? 'opacity-60' : ''}`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <FavButton id={id} />
                  <Link to={`/places/${id}`} className="font-semibold hover:underline">{p.name}</Link>
                  <StatusBadge status={p.status} />
                  {rejected && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">Rejected</span>}
                  <RejectButton id={id} className="ml-auto" showLabel />
                </div>
                <textarea className="input w-full" rows={3} value={saved.notes[id] ?? ''} onChange={(e) => setNote(id, e.target.value)} placeholder="Add a note…" aria-label={`Notes for ${p.name}`} />
              </div>
            )
          })}
          {saved.favorites.length >= 2 && <Link className="btn" to={`/compare?ids=${saved.favorites.slice(0, 3).join(',')}`}>Compare my top favorites →</Link>}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-sky-50 p-4 text-sm dark:bg-sky-950/40">
        <p className="font-medium text-sky-800 dark:text-sky-300">Export includes:</p>
        <ul className="mt-1 list-disc pl-5 text-sky-700 dark:text-sky-400">
          <li>{saved.favorites.length} favorite{saved.favorites.length === 1 ? '' : 's'}</li>
          <li>{Object.keys(saved.notes).length} note{Object.keys(saved.notes).length === 1 ? '' : 's'}</li>
          <li>{rejectedCount} rejected place{rejectedCount === 1 ? '' : 's'}</li>
        </ul>
      </div>
    </div>
  )
}
