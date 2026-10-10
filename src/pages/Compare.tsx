import { Link, useSearchParams } from 'react-router-dom'
import { CRITERIA, PLACES, placeById, type Place } from '../data/places'
import { MarkDot, MarkLegend, NotChecked, PageHeader, StatusBadge } from '../components/ui'

const DEFAULT = ['forsyth', 'happy-valley', 'duvall']

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('ids')
  const ids = (raw ? raw.split(',') : DEFAULT).filter((id) => placeById(id)).slice(0, 3)
  const places = ids.map((id) => placeById(id)!) as Place[]
  const setIds = (next: string[]) => setParams({ ids: next.join(',') }, { replace: true })
  const options = [...PLACES].sort((a, b) => Number(!!a.minor) - Number(!!b.minor))

  const rows: { label: string; render: (p: Place) => React.ReactNode }[] = [
    { label: 'Status', render: (p) => <StatusBadge status={p.status} label={p.statusLabel} /> },
    { label: 'Rounds', render: (p) => `${p.firstRound}${p.cutRound ? `–${p.cutRound}` : '–now'}` },
    { label: 'Example listing', render: (p) => p.listings.length ? p.listings.map((l) => <div key={l.description}>{l.description} — {l.price}<span className="block text-xs text-slate-500">{l.asOf ? `as of ${l.asOf}` : 'no as-of date'}; re-verify</span></div>) : <NotChecked /> },
    ...CRITERIA.map((c) => ({ label: c.label, render: (p: Place) => (
      <div className="flex items-start gap-2"><MarkDot score={p.scores[c.key]} size="sm" /><span className="text-xs text-slate-500">{p.scores[c.key]?.note ?? (p.scores[c.key] ? '' : 'not checked yet')}</span></div>
    ) })),
    { label: 'In the US', render: (p) => <MarkDot score={{ mark: p.inUS ? 'pass' : 'fail', source: 'table' }} size="sm" /> },
    { label: 'Mountains / lakes', render: (p) => p.mountainsLakes ?? <NotChecked /> },
    { label: 'Crime', render: (p) => p.crime ?? <NotChecked /> },
    { label: 'Schools', render: (p) => p.schools ?? <NotChecked /> },
    { label: 'Infrastructure', render: (p) => p.infrastructure ?? <NotChecked /> },
    { label: 'Climate', render: (p) => p.climate ?? <NotChecked /> },
    { label: 'Taxes', render: (p) => p.taxes ?? <NotChecked /> },
    { label: 'Risks', render: (p) => p.risks ?? <NotChecked /> },
    { label: 'Sichuan named', render: (p) => list(p, 'Sichuan') },
    { label: 'Turkish named', render: (p) => list(p, 'Turkish') },
    { label: 'Pros', render: (p) => p.pros.length ? <ul className="list-disc pl-4">{p.pros.map((x) => <li key={x}>{x}</li>)}</ul> : <NotChecked text="none recorded" /> },
    { label: 'Cons', render: (p) => p.cons.length ? <ul className="list-disc pl-4">{p.cons.map((x) => <li key={x}>{x}</li>)}</ul> : <NotChecked text="none recorded" /> },
    { label: 'Why dropped', render: (p) => p.cutReason ?? '—' },
  ]

  return (
    <div>
      <PageHeader title="Compare places" sub="Pick 2–3 places to see them side by side on every criterion." />
      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-2">
            <select aria-label={`Place ${i + 1}`} className="input min-w-0 flex-1" value={ids[i] ?? ''}
              onChange={(e) => { const n = [...ids]; if (e.target.value) n[i] = e.target.value; else n.splice(i, 1); setIds(Array.from(new Set(n.filter(Boolean)))) }}>
              <option value="">{i < 2 ? '— choose a place —' : '— optional third —'}</option>
              {options.map((p) => <option key={p.id} value={p.id} disabled={ids.includes(p.id) && ids[i] !== p.id}>{p.short}{p.minor ? ' (cut-list only)' : ''}</option>)}
            </select>
          </div>
        ))}
      </div>
      {places.length < 2 && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/40">Pick at least two places to compare.</p>}
      {places.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="sticky left-0 w-44 bg-white p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">Criterion</th>
                {places.map((p) => (
                  <th key={p.id} className="p-3 text-left align-bottom">
                    {p.photos[0] && <img src={p.photos[0].src} alt="" className="mb-2 h-20 w-full rounded-lg object-cover" />}
                    <Link to={`/places/${p.id}`} className="font-semibold text-teal-700 hover:underline dark:text-teal-400">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-slate-100 align-top last:border-0 dark:border-slate-800">
                  <th className="sticky left-0 bg-white p-3 text-left font-medium dark:bg-slate-900">{r.label}</th>
                  {places.map((p) => <td key={p.id} className="p-3">{r.render(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 text-xs"><MarkLegend /></div>
    </div>
  )
}

function list(p: Place, cuisine: 'Sichuan' | 'Turkish') {
  const r = p.restaurants.filter((x) => x.cuisine === cuisine)
  if (!r.length) return <NotChecked text="none named" />
  return <ul>{r.map((x) => <li key={x.name} className={x.status === 'closed' ? 'line-through opacity-60' : ''}>{x.name}{x.driveText ? ` (${x.driveText})` : ''}{x.status === 'caveat' ? ' *' : ''}{x.status === 'closed' ? ' — closed' : ''}</li>)}</ul>
}
