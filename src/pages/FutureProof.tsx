import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader, StatusBadge } from '../components/ui'
import { useStore } from '../lib/store'
import {
  FUTURE_CHECKED, FUTURE_METHOD, rankWithCoralBaseline, type FutureRanked,
} from '../data/futureproof'
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

function formatDelta(value: number | null): { text: string; cls: string } | null {
  if (value == null || Number.isNaN(value)) return null
  const abs = Math.abs(value)
  if (abs < 0.005) return { text: 'Same as Coral Springs', cls: 'text-slate-600 dark:text-slate-300' }
  const better = value > 0
  const sign = better ? '+' : '−'
  return {
    text: `${sign}${abs.toFixed(2)} vs Coral Springs (${better ? 'better' : 'worse'})`,
    cls: better ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400',
  }
}

function Deltas({ row, baseline }: { row: FutureRanked; baseline: FutureRanked }) {
  const items = [
    { label: 'Climate', d: formatDelta(row.climate != null && baseline.climate != null ? row.climate - baseline.climate : null) },
    { label: 'AI resilience', d: formatDelta(row.ai != null && baseline.ai != null ? row.ai - baseline.ai : null) },
    { label: 'Combined', d: formatDelta(row.combined != null && baseline.combined != null ? row.combined - baseline.combined : null) },
  ].filter((x) => x.d)
  if (!items.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm" data-testid="future-delta">
      {items.map((x) => (
        <div key={x.label} className={x.d!.cls}>
          <span className="font-medium text-slate-500 dark:text-slate-400">{x.label}: </span>{x.d!.text}
        </div>
      ))}
    </div>
  )
}

function Card({ row, rank, baseline }: { row: FutureRanked; rank: number; baseline: FutureRanked }) {
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
      <Deltas row={row} baseline={baseline} />
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

function BaselineCard({ row, rank, of }: { row: FutureRanked; rank: number; of: number }) {
  return (
    <article className="mb-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 shadow-sm dark:border-amber-500 dark:bg-amber-950/30" data-testid="future-baseline">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">Current home</span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{row.place.name}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Broward County, Florida · scored with the same method as the places below, for comparison only. Not a relocation candidate.</p>
        </div>
        <span className="ml-auto text-right">
          <span className="text-2xl font-bold tabular-nums">{row.combined == null ? '—' : row.combined.toFixed(2)}</span>
          <span className="text-sm text-slate-500"> / 3 combined</span>
          <div className="text-sm font-semibold text-amber-800 dark:text-amber-300" data-testid="future-baseline-rank">
            Would rank #{rank} of {of}
          </div>
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
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${((row.combined ?? 0) / 3) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"><b>Why it scores this way.</b> {row.why}</p>
      {row.tradeoffs.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caveats</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {row.tradeoffs.slice(0, 5).map((s) => <li key={s.slice(0, 80)}>{s}</li>)}
          </ul>
        </div>
      )}
    </article>
  )
}

export default function FutureProof() {
  const { activePlaces, rejectedCount } = useStore()
  const { ranked, baseline, baselineRank, of } = useMemo(() => rankWithCoralBaseline(activePlaces), [activePlaces])
  const top = ranked.slice(0, TOP)
  const chart = [
    {
      name: 'Coral Springs, FL (current)',
      Climate: baseline.climate == null ? 0 : Number(baseline.climate.toFixed(2)),
      'AI resilience': baseline.ai == null ? 0 : Number(baseline.ai.toFixed(2)),
      Combined: baseline.combined == null ? 0 : Number(baseline.combined.toFixed(2)),
      baseline: 1,
    },
    ...top.map((r) => ({
      name: r.place.short,
      Climate: r.climate == null ? 0 : Number(r.climate.toFixed(2)),
      'AI resilience': r.ai == null ? 0 : Number(r.ai.toFixed(2)),
      Combined: r.combined == null ? 0 : Number(r.combined.toFixed(2)),
      baseline: 0,
    })),
  ]

  return (
    <div data-testid="future-page">
      <PageHeader title="Future-proof" sub={`Which places look better placed to come through climate change and AI-driven job changes, based on official sources retrieved ${FUTURE_CHECKED}. Coral Springs, FL — the current home — is scored first, with the same method, so the list below can be compared. Every figure is cited. Missing official figures are left unknown, never filled in.`} />

      <BaselineCard row={baseline} rank={baselineRank} of={of} />

      {rejectedCount > 0 && (
        <p className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {rejectedCount} rejected place{rejectedCount === 1 ? '' : 's'} {rejectedCount === 1 ? 'is' : 'are'} hidden from this ranking. Restore {rejectedCount === 1 ? 'it' : 'them'} from the <Link to="/places?rejected=1" className="underline">Places</Link> tab or a place page.
        </p>
      )}

      <div className="card mb-6 space-y-2 whitespace-pre-line p-4 text-sm leading-relaxed">{FUTURE_METHOD}</div>

      <div className="card mb-6 p-4" data-testid="future-chart">
        <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Climate, AI resilience, and combined scores, with Coral Springs as the first, highlighted row</h2>
        <div className="h-[min(520px,80vh)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 3]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {baseline.combined != null && (
                <ReferenceLine
                  x={Number(baseline.combined.toFixed(2))}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{ value: 'Coral Springs', position: 'top', fontSize: 11, fill: '#d97706' }}
                />
              )}
              <Bar dataKey="Climate" fill="#0284c7" maxBarSize={10} radius={[0, 3, 3, 0]} />
              <Bar dataKey="AI resilience" fill="#0f766e" maxBarSize={10} radius={[0, 3, 3, 0]} />
              <Bar dataKey="Combined" fill="#4f46e5" maxBarSize={10} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">The dashed amber line is Coral Springs’ combined score. The first row is the current home, not a candidate.</p>
      </div>

      {top.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No places are left to rank.</div>
      ) : (
        <ol className="space-y-4">
          {top.map((row, i) => (
            <li key={row.place.id}><Card row={row} rank={i + 1} baseline={baseline} /></li>
          ))}
        </ol>
      )}
    </div>
  )
}
