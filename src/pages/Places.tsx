import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OTHER_MEANING, PLACES, ROUNDS, STATUS_META, consideredIn, isAliveIn, type Status } from '../data/places'
import { PageHeader, PlaceCard } from '../components/ui'
import { useStore } from '../lib/store'

const ALL: Status[] = ['best', 'live', 'parked', 'stretch', 'near-miss', 'dropped', 'other']

export default function Places() {
  const [params, setParams] = useSearchParams()
  const { saved } = useStore()
  const q = params.get('q') ?? ''
  const round = Number(params.get('round')) || 0
  const roundMode = params.get('rm') === 'considered' ? 'considered' : 'alive'
  const statuses = (params.get('s')?.split(',').filter(Boolean) as Status[] | undefined) ?? ALL
  const favOnly = params.get('fav') === '1'
  const showMinor = params.get('minor') !== '0'

  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v === null || v === '') n.delete(k); else n.set(k, v)
    setParams(n, { replace: true })
  }
  const toggleStatus = (s: Status) => {
    const next = statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s]
    set('s', next.length === ALL.length ? null : next.join(','))
  }

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return PLACES.filter((p) => {
      if (!statuses.includes(p.status)) return false
      if (favOnly && !saved.favorites.includes(p.id)) return false
      if (!showMinor && p.minor) return false
      if (round && !(roundMode === 'alive' ? isAliveIn(p, round) : consideredIn(p, round))) return false
      if (!needle) return true
      const hay = [p.name, p.short, p.summary, p.statusLabel, p.cutReason, ...p.restaurants.map((r) => `${r.name} ${r.area ?? ''}`), ...p.pros, ...p.cons, saved.notes[p.id] ?? ''].join(' ').toLowerCase()
      return hay.includes(needle)
    })
  }, [q, statuses, favOnly, showMinor, round, roundMode, saved])

  return (
    <div>
      <PageHeader title="The places" sub="Current options first, then everything explored and set aside. Prices and listings are “as of” their dates and should be re-verified; drive times are no-traffic estimates." />
      <div className="card mb-6 space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <input type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search places, restaurants, notes…" aria-label="Search places" className="input min-w-0 flex-1" />
          <select aria-label="Round filter" className="input" value={round} onChange={(e) => set('round', e.target.value === '0' ? null : e.target.value)}>
            <option value={0}>All rounds</option>
            {ROUNDS.map((r) => <option key={r.n} value={r.n}>Round {r.n}: {r.title}</option>)}
          </select>
          {round > 0 && (
            <select aria-label="Round mode" className="input" value={roundMode} onChange={(e) => set('rm', e.target.value === 'alive' ? null : e.target.value)}>
              <option value="alive">Alive after the round</option>
              <option value="considered">Considered in the round</option>
            </select>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ALL.map((s) => {
            const on = statuses.includes(s)
            return (
              <button key={s} onClick={() => toggleStatus(s)} aria-pressed={on}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${on ? 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800' : 'border-dashed border-slate-300 opacity-50 dark:border-slate-700'}`}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[s].color }} />{STATUS_META[s].label}
                <span className="text-xs text-slate-500">{PLACES.filter((p) => p.status === s).length}</span>
              </button>
            )
          })}
          <label className="ml-auto flex items-center gap-1.5 text-sm"><input type="checkbox" checked={favOnly} onChange={(e) => set('fav', e.target.checked ? '1' : null)} /> Favorites only</label>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={showMinor} onChange={(e) => set('minor', e.target.checked ? null : '0')} /> Include cut-list-only places</label>
        </div>
      </div>
      <p className="mb-1 text-xs text-slate-500"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META.other.color }} />{OTHER_MEANING}</p>
      <p className="mb-3 text-sm text-slate-500">{list.length} of {PLACES.length} places{round ? ` · round ${round} (${roundMode === 'alive' ? 'alive after it' : 'considered in it'})` : ''}</p>
      {list.length === 0 ? <div className="card p-8 text-center text-slate-500">No places match those filters.</div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PlaceCard key={p.id} place={p} />)}</div>
      )}
    </div>
  )
}
