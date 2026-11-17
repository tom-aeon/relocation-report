import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader, StatusBadge } from '../components/ui'
import { useStore } from '../lib/store'
import { FUTURE_CHECKED, FUTURE_METHOD, rankFutureList, type FutureRanked } from '../data/futureproof'
import { qualifyingHomes } from '../data/homes'

const TOP = 10

function Sub({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value == null ? '—' : value.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 3</span></div>
    </div>
  )
}

function Card({ row, rank }: { row: FutureRanked; rank: number }) {
  const home = qualifyingHomes(row.place.id).sort((a, b) => a.priceUsd - b.priceUsd)[0]
  return (
    <article className="card p-5" data-testid="future-card" data-rank={rank} data-id={row.place.id}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">{rank}</span>
        <div className="min-w-0">
          <Link to={`/places/${row.place.id}`} className="font-semibold hover:underline">{row.place.name}</Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge status={row.place.status} label={row.place.statusLabel} />
            {row.place.country === 'Canada' && (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">Canada · climate approximate</span>
            )}
          </div>
        </div>
        <span className="ml-auto text-right">
          <span className="text-2xl font-bold tabular-nums">{row.combined == null ? '—' : row.combined.toFixed(2)}</span>
          <span className="text-sm text-slate-500"> / 3 combined</span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Sub label="Climate" value={row.climate} />
        <Sub label="AI resilience" value={row.ai} />
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">Climate factors known</div>
          <div className="text-lg font-semibold tabular-nums">{row.climateKnown}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">AI factors known</div>
          <div className="text-lg font-semibold tabular-nums">{row.aiKnown}</div>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-600 to-teal-500" style={{ width: `${((row.combined ?? 0) / 3) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"><b>Why it’s here.</b> {row.why}</p>
      {row.strengths.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {row.strengths.map((s) => <li key={s.slice(0, 80)}>{s}</li>)}
          </ul>
        </div>
      )}
      {row.tradeoffs.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tradeoffs and caveats</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {row.tradeoffs.map((s) => <li key={s.slice(0, 80)}>{s}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/places/${row.place.id}`} className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800">Full place view</Link>
        {home && (
          <a href={home.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">
            A listing on file: {home.address} ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default function FutureProof() {
  const { activePlaces, rejectedCount } = useStore()
  const ranked = useMemo(() => rankFutureList(activePlaces), [activePlaces])
  const top = ranked.slice(0, TOP)
  const chart = top.map((r) => ({
    name: r.place.short,
    Climate: r.climate == null ? 0 : Number(r.climate.toFixed(2)),
    'AI resilience': r.ai == null ? 0 : Number(r.ai.toFixed(2)),
    Combined: r.combined == null ? 0 : Number(r.combined.toFixed(2)),
  }))

  return (
    <div data-testid="future-page">
      <PageHeader title="Future-proof" sub={`Which places look better placed to come through climate change and AI-driven job changes, based on official sources retrieved ${FUTURE_CHECKED}. Every figure is cited. Missing official figures are left unknown, never filled in.`} />

      {rejectedCount > 0 && (
        <p className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {rejectedCount} rejected place{rejectedCount === 1 ? '' : 's'} {rejectedCount === 1 ? 'is' : 'are'} hidden from this ranking. Restore {rejectedCount === 1 ? 'it' : 'them'} from the <Link to="/places?rejected=1" className="underline">Places</Link> tab or a place page.
        </p>
      )}

      <div className="card mb-6 space-y-2 whitespace-pre-line p-4 text-sm leading-relaxed">{FUTURE_METHOD}</div>

      <div className="card mb-6 p-4" data-testid="future-chart">
        <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Climate, AI resilience, and combined scores</h2>
        <div className="h-[min(460px,75vh)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 3]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Climate" fill="#0284c7" maxBarSize={10} radius={[0, 3, 3, 0]} />
              <Bar dataKey="AI resilience" fill="#0f766e" maxBarSize={10} radius={[0, 3, 3, 0]} />
              <Bar dataKey="Combined" fill="#4f46e5" maxBarSize={10} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {top.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No places are left to rank.</div>
      ) : (
        <ol className="space-y-4">
          {top.map((row, i) => (
            <li key={row.place.id}><Card row={row} rank={i + 1} /></li>
          ))}
        </ol>
      )}
    </div>
  )
}
