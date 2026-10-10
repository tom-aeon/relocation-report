import { Link, useSearchParams } from 'react-router-dom'
import { PLACES, ROUNDS, isAliveIn, placeById } from '../data/places'
import { PageHeader, PlaceCard, StatusBadge } from '../components/ui'

export default function History() {
  const [params, setParams] = useSearchParams()
  const sel = Number(params.get('round')) || 6
  const round = ROUNDS.find((r) => r.n === sel) ?? ROUNDS[ROUNDS.length - 1]
  const alive = PLACES.filter((p) => isAliveIn(p, round.n))

  return (
    <div>
      <PageHeader title="How the search narrowed" sub="Six rounds, each one tightening the filter. Click a round to see what was added, what got cut and why, and which places were still alive after it." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ol className="relative space-y-3 pl-9 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-teal-600 before:to-green-600">
          {ROUNDS.map((r) => {
            const active = r.n === round.n
            return (
              <li key={r.n} className="relative">
                <span className={`absolute -left-9 top-3 grid h-7 w-7 place-items-center rounded-full text-xs font-bold ring-4 ring-slate-50 dark:ring-slate-950 ${active ? 'bg-teal-700 text-white' : 'bg-white text-teal-700 border border-teal-600 dark:bg-slate-900'}`}>{r.n}</span>
                <button onClick={() => setParams({ round: String(r.n) })} aria-pressed={active}
                  className={`card w-full p-4 text-left transition ${active ? 'ring-2 ring-teal-600' : 'hover:shadow-md'}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">Round {r.n}: {r.title}</h3>
                    <span className="text-xs text-slate-500">{r.date ?? 'date not recorded'}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{r.summary}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-green-700 dark:text-green-400">+{r.added.length} added</span>
                    <span className="text-red-700 dark:text-red-400">−{r.cut.length} cut</span>
                    <span className="text-slate-500">{PLACES.filter((p) => isAliveIn(p, r.n)).length} alive after</span>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Round {round.n} · {round.date ?? 'date not recorded'}</div>
            <h2 className="text-xl font-bold">{round.title}</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{round.summary}</p>
            {round.note && <p className="mt-2 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/40">{round.note}</p>}

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">Added this round</h3>
            {round.added.length === 0 ? <p className="text-sm text-slate-500">Nothing new added.</p> : (
              <div className="mt-1 flex flex-wrap gap-2">
                {round.added.map((id) => { const p = placeById(id)!; return (
                  <Link key={id} to={`/places/${id}`} className="rounded-full bg-green-100 px-3 py-0.5 text-sm text-green-800 hover:underline dark:bg-green-900/50 dark:text-green-300">{p.short}</Link>
                ) })}
              </div>
            )}

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">Cut this round — and why</h3>
            {round.cut.length === 0 ? <p className="text-sm text-slate-500">Nothing cut in this round.</p> : (
              <ul className="mt-1 divide-y divide-slate-100 dark:divide-slate-800">
                {round.cut.map((id) => { const p = placeById(id)!; return (
                  <li key={id} className="flex flex-wrap items-start justify-between gap-2 py-2 text-sm">
                    <Link to={`/places/${id}`} className="font-medium line-through decoration-red-400/60 hover:underline">{p.short}</Link>
                    <span className="max-w-md text-slate-600 dark:text-slate-400">{p.cutReason ?? 'Reason not recorded in the report.'}</span>
                  </li>
                ) })}
              </ul>
            )}
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Still alive after round {round.n} ({alive.length})</h3>
              <div className="flex gap-2">
                <Link className="btn" to={`/places?round=${round.n}`}>Filter places list</Link>
                <Link className="btn" to={`/map?round=${round.n}`}>Show on map</Link>
              </div>
            </div>
            {alive.length === 0 ? <p className="text-sm text-slate-500">No places alive.</p> : (
              <div className="grid gap-3 sm:grid-cols-2">{alive.map((p) => <PlaceCard key={p.id} place={p} />)}</div>
            )}
            {alive.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">Current status of these today: {alive.map((p) => <StatusBadge key={p.id} status={p.status} />)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
