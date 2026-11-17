import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader, StatusBadge } from '../components/ui'
import { useStore } from '../lib/store'
import {
  familyMethodText, loadWeights, rankFamily, rankScorecard, weightsAreDefault,
  type FamilyCard, type WhyCard,
} from '../lib/rankings'
import { NO_QUALIFYING_HOMES } from '../data/homesTypes'

const TOP = 10

function ScoreBar({ score, testId }: { score: number | null; testId?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" data-testid={testId}>
      <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-green-500" style={{ width: `${((score ?? 0) / 3) * 100}%` }} />
    </div>
  )
}

function RankChart({ rows, testId }: { rows: { name: string; score: number }[]; testId: string }) {
  return (
    <div className="card mb-6 p-4" data-testid={testId}>
      <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Scores for the top {rows.length}</h2>
      <div className="h-[min(420px,70vh)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 3]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="score" name="Score / 3" maxBarSize={18} radius={[0, 4, 4, 0]}>
              {rows.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#0f766e' : '#14b8a6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Card({ row, rank, mode }: { row: WhyCard | FamilyCard; rank: number; mode: string }) {
  const home = row.bestHome
  return (
    <article className="card p-5" data-testid="best-card" data-rank={rank} data-id={row.place.id} data-mode={mode}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">{rank}</span>
        <div className="min-w-0">
          <Link to={`/places/${row.place.id}`} className="font-semibold hover:underline">{row.place.name}</Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge status={row.place.status} label={row.place.statusLabel} />
            {row.hardFail && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">fails a food rule</span>}
            {!home && row.place.status !== 'dropped' && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">{NO_QUALIFYING_HOMES}</span>
            )}
          </div>
        </div>
        <span className="ml-auto text-right">
          <span className="text-2xl font-bold tabular-nums">{row.score == null ? '—' : row.score.toFixed(2)}</span>
          <span className="text-sm text-slate-500"> / 3</span>
          <span className="block text-xs text-slate-500">{row.known} factors known</span>
        </span>
      </div>
      <div className="mt-2"><ScoreBar score={row.score} /></div>
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
            Best listing: {home.address} ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default function BestOverall() {
  const { activePlaces, rejectedCount } = useStore()
  const [params, setParams] = useSearchParams()
  const mode = params.get('view') === 'family' ? 'family' : 'scorecard'
  const [weights] = useState(() => loadWeights())
  const usingDefault = weightsAreDefault(weights)

  const scorecard = useMemo(() => rankScorecard(activePlaces, weights), [activePlaces, weights])
  const family = useMemo(() => rankFamily(activePlaces), [activePlaces])
  const rows = (mode === 'family' ? family : scorecard).slice(0, TOP)
  const chart = rows.filter((r) => r.score != null).map((r) => ({ name: r.place.short, score: Number((r.score as number).toFixed(2)) }))

  const setMode = (next: 'scorecard' | 'family') => {
    const nextParams = new URLSearchParams(params)
    if (next === 'family') nextParams.set('view', 'family')
    else nextParams.delete('view')
    setParams(nextParams, { replace: true })
  }

  return (
    <div data-testid="best-page" data-mode={mode}>
      <PageHeader title="Best overall" sub="A ranked shortlist with a plain-language “why” for each place. Switch between our checklist score and a typical-family ranking that ignores our personal must-haves." />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Best overall ranking">
        <button type="button" role="tab" aria-selected={mode === 'scorecard'} data-testid="best-mode-scorecard"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === 'scorecard' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
          onClick={() => setMode('scorecard')}>Our scorecard</button>
        <button type="button" role="tab" aria-selected={mode === 'family'} data-testid="best-mode-family"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === 'family' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
          onClick={() => setMode('family')}>Typical family</button>
      </div>

      {rejectedCount > 0 && (
        <p className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {rejectedCount} rejected place{rejectedCount === 1 ? '' : 's'} {rejectedCount === 1 ? 'is' : 'are'} hidden from this ranking. Restore {rejectedCount === 1 ? 'it' : 'them'} from the <Link to="/places?rejected=1" className="underline">Places</Link> tab or a place page.
        </p>
      )}

      {mode === 'scorecard' ? (
        <div className="card mb-6 space-y-2 p-4 text-sm leading-relaxed">
          <p><b>How this list is built.</b> It uses the same weighted checklist as the <Link to="/scorecard" className="text-teal-700 underline dark:text-teal-400">Scorecard</Link>, {usingDefault ? 'with the default weights (low crime starts at 5, the heaviest).' : 'with the weights currently saved in this browser from the Scorecard sliders.'} A place’s score is the weighted average of the marks it has; unknown marks are left out, not counted as zero. Food fails are flagged because 2+ real Sichuan and 2+ real Turkish restaurants were a hard rule. A 4-bedroom, 3-full-bath listing under US$850K on about 1–3 acres is a must for us, but it is shown as a strength or a caveat rather than silently dropping a high-scoring place (for example a place with no qualifying home still appears if the checklist score is high). Oregon is parked at his request and is labelled as such if it still ranks.</p>
        </div>
      ) : (
        <div className="card mb-6 space-y-2 p-4 text-sm leading-relaxed whitespace-pre-line">{familyMethodText()}</div>
      )}

      <RankChart rows={chart} testId={mode === 'family' ? 'family-chart' : 'best-chart'} />

      {rows.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No places are left to rank. Restore a rejected place to see this list.</div>
      ) : (
        <ol className="space-y-4">
          {rows.map((row, i) => (
            <li key={row.place.id}><Card row={row} rank={i + 1} mode={mode} /></li>
          ))}
        </ol>
      )}
    </div>
  )
}
