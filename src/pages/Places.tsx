import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OTHER_MEANING, ROUNDS, STATUS_META, STATUS_ORDER, byStatus, consideredIn, isAliveIn, statusCounts, type Place, type Status } from '../data/places'
import { PageHeader, PlaceCard } from '../components/ui'
import { SaferSection } from '../components/SaferSection'
import { useStore } from '../lib/store'

const ALL: Status[] = STATUS_ORDER

export default function Places() {
  const [params, setParams] = useSearchParams()
  const { saved, activePlaces, rejectedPlaces, rejectedCount, isRejected } = useStore()
  const q = params.get('q') ?? ''
  const round = Number(params.get('round')) || 0
  const roundMode = params.get('rm') === 'considered' ? 'considered' : 'alive'
  const statuses = (params.get('s')?.split(',').filter(Boolean) as Status[] | undefined) ?? ALL
  const favOnly = params.get('fav') === '1'
  const showMinor = params.get('minor') !== '0'
  const showRejected = params.get('rejected') === '1'
  const showSafer = params.get('view') === 'safer'

  const setMany = (changes: Record<string, string | null>) => {
    const n = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') n.delete(k); else n.set(k, v)
    }
    setParams(n, { replace: true })
  }
  const set = (k: string, v: string | null) => setMany({ [k]: v })
  const toggleStatus = (s: Status) => {
    const next = statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s]
    set('s', next.length === ALL.length ? null : next.join(','))
  }

  const base = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const sourceList = showRejected ? rejectedPlaces : activePlaces
    return sourceList.filter((p: Place) => {
      if (favOnly && !saved.favorites.includes(p.id)) return false
      if (!showMinor && p.minor) return false
      if (round && !(roundMode === 'alive' ? isAliveIn(p, round) : consideredIn(p, round))) return false
      if (!needle) return true
      const hay = [p.name, p.short, p.summary, p.statusLabel, p.cutReason, ...p.restaurants.map((r) => `${r.name} ${r.area ?? ''}`), ...p.pros, ...p.cons, saved.notes[p.id] ?? ''].join(' ').toLowerCase()
      return hay.includes(needle)
    }).sort(byStatus)
  }, [q, favOnly, showMinor, round, roundMode, saved, showRejected, activePlaces, rejectedPlaces])

  const counts = statusCounts(base)
  const list = base.filter((p) => statuses.includes(p.status))

  return (
    <div>
      <PageHeader title={showSafer ? 'Safer than Coral Springs' : showRejected ? 'Rejected places' : 'The places'} sub={showSafer ? 'Places whose sourced official crime rates are at or below Coral Springs, plus one-sided, Canadian, and unverified groups. Canadian figures are never counted as at-or-below Coral Springs.' : showRejected ? 'Places you have personally rejected. Click Restore to bring them back to the active list.' : 'Current options first, then everything explored and set aside. Prices and listings are "as of" their dates and should be re-verified; drive times are no-traffic estimates.'} />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setMany({ rejected: null, view: null })}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${!showRejected && !showSafer ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
        >
          Active places ({activePlaces.length})
        </button>
        <button
          onClick={() => setMany({ rejected: '1', view: null })}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${showRejected ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          data-testid="places-rejected-tab"
          data-count={rejectedCount}
        >
          Rejected ({rejectedCount})
        </button>
        <button
          onClick={() => setMany({ rejected: null, view: 'safer' })}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${showSafer ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          data-testid="places-safer-tab"
        >
          Safer than Coral Springs
        </button>
      </div>

      {showSafer ? (
        <SaferSection places={activePlaces} />
      ) : (
      <>
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
                <span className="text-xs text-slate-500" data-testid={`places-count-${s}`} data-count={counts[s]}>{counts[s]}</span>
              </button>
            )
          })}
          <label className="ml-auto flex items-center gap-1.5 text-sm"><input type="checkbox" checked={favOnly} onChange={(e) => set('fav', e.target.checked ? '1' : null)} /> Favorites only</label>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={showMinor} onChange={(e) => set('minor', e.target.checked ? null : '0')} /> Include cut-list-only places</label>
        </div>
      </div>
      <p className="mb-1 text-xs text-slate-500"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META.other.color }} />{OTHER_MEANING}</p>
      <p className="mb-3 text-sm text-slate-500" data-testid="places-total" data-count={list.length}>
        {list.length} of {showRejected ? rejectedCount : activePlaces.length} {showRejected ? 'rejected ' : ''}places
        {round ? ` · round ${round} (${roundMode === 'alive' ? 'alive after it' : 'considered in it'})` : ''}
        {!showRejected && rejectedCount > 0 && <span className="text-slate-400"> · {rejectedCount} rejected</span>}
      </p>
      {list.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {showRejected ? 'No rejected places. Places you reject will appear here.' : 'No places match those filters.'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} data-testid="places-card" data-id={p.id} data-status={p.status} data-rejected={isRejected(p.id) ? '1' : '0'} className="contents">
              <PlaceCard place={p} showReject={!showRejected} />
            </div>
          ))}
        </div>
      )}

      {showRejected && list.length > 0 && (
        <div className="mt-6 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <b>Tip:</b> Click the ↩ button on any card or visit the place detail page to restore it to the active list.
            Rejections are personal preferences stored in your browser and do not affect the canonical research status.
          </p>
        </div>
      )}
      </>
      )}
    </div>
  )
}
