import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLACES, STATUS_META } from '../data/places'
import { NotChecked, PageHeader } from '../components/ui'

export default function Food() {
  const [cuisine, setCuisine] = useState<'all' | 'Sichuan' | 'Turkish'>('all')
  const [place, setPlace] = useState('all')
  const [maxDrive, setMaxDrive] = useState(60)
  const [includeUnknownDrive, setIncludeUnknownDrive] = useState(true)
  const [hideClosed, setHideClosed] = useState(false)
  const [q, setQ] = useState('')

  const all = useMemo(() => PLACES.flatMap((p) => p.restaurants.map((r) => ({ ...r, place: p }))), [])
  const withFood = PLACES.filter((p) => p.restaurants.length > 0)
  const rows = all.filter((r) => {
    if (cuisine !== 'all' && r.cuisine !== cuisine) return false
    if (place !== 'all' && r.place.id !== place) return false
    if (hideClosed && r.status === 'closed') return false
    if (r.driveMin === undefined) { if (!includeUnknownDrive) return false } else if (r.driveMin > maxDrive) return false
    if (q && !`${r.name} ${r.area ?? ''} ${r.place.short}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader title="Food finder" sub="Every Sichuan and Turkish restaurant named in the research, across all places. Drive times are free-flow estimates from the place (no traffic); most entries have no drive time recorded." />
      <div className="card mb-4 flex flex-wrap items-center gap-3 p-4">
        <input type="search" className="input min-w-0 flex-1" placeholder="Search restaurants…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search restaurants" />
        <div className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700" role="group" aria-label="Cuisine">
          {(['all', 'Sichuan', 'Turkish'] as const).map((c) => (
            <button key={c} onClick={() => setCuisine(c)} aria-pressed={cuisine === c} className={`px-3 py-1.5 text-sm ${cuisine === c ? 'bg-teal-700 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{c === 'all' ? 'Both' : c}</button>
          ))}
        </div>
        <select className="input" value={place} onChange={(e) => setPlace(e.target.value)} aria-label="Place">
          <option value="all">All places</option>
          {withFood.map((p) => <option key={p.id} value={p.id}>{p.short}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">Max drive <b className="tabular-nums">{maxDrive} min</b>
          <input type="range" min={10} max={60} step={5} value={maxDrive} onChange={(e) => setMaxDrive(Number(e.target.value))} className="accent-teal-700" aria-label="Maximum drive time" />
        </label>
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={includeUnknownDrive} onChange={(e) => setIncludeUnknownDrive(e.target.checked)} /> Include unknown drive time</label>
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={hideClosed} onChange={(e) => setHideClosed(e.target.checked)} /> Hide closed</label>
      </div>
      <p className="mb-2 text-sm text-slate-500">{rows.length} of {all.length} restaurants</p>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60">
            <tr><th className="p-3">Restaurant</th><th className="p-3">Cuisine</th><th className="p-3">Area</th><th className="p-3">Drive</th><th className="p-3">For place</th><th className="p-3">Counted?</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.place.id}-${r.name}`} className={`border-t border-slate-100 dark:border-slate-800 ${r.status === 'closed' ? 'opacity-60' : ''}`}>
                <td className={`p-3 font-medium ${r.status === 'closed' ? 'line-through' : ''}`}>{r.name}{r.note && <span className="block text-xs font-normal text-slate-500 no-underline">{r.note}</span>}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.cuisine === 'Sichuan' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'}`}>{r.cuisine}</span></td>
                <td className="p-3">{r.area ?? <NotChecked />}</td>
                <td className="p-3 tabular-nums">{r.driveText ?? <NotChecked />}</td>
                <td className="p-3"><Link to={`/places/${r.place.id}`} className="flex items-center gap-1.5 hover:underline"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[r.place.status].color }} />{r.place.short}</Link></td>
                <td className="p-3">
                  {r.status === 'closed' ? <span className="rounded bg-red-100 px-1.5 text-xs text-red-700 dark:bg-red-900/50 dark:text-red-300">Closed — not counted</span>
                    : r.status === 'caveat' ? <span className="rounded bg-amber-100 px-1.5 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">With caveat</span>
                    : <span className="text-green-700 dark:text-green-400">Counted</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-slate-500">No restaurants match.</p>}
      </div>
      <p className="mt-3 text-xs text-slate-500">“Real” Sichuan = mapo, dan dan, mala, hot pot. “Real” Turkish = pide, lahmacun, kebab, Iskender; gyro-only or daytime-only cafes don’t count. Openings and closings change — confirm before visiting.</p>
    </div>
  )
}
