import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CRITERIA, PLACES } from '../data/places'
import { DEFAULT_WEIGHTS, rankPlace, type Weights } from '../lib/score'
import { MarkDot, PageHeader, StatusBadge } from '../components/ui'

const KEY = 'reloc.weights.v1'

export default function Scorecard() {
  const [w, setW] = useState<Weights>(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) ?? 'null'); if (v) return { ...DEFAULT_WEIGHTS, ...v } } catch { /* ignore */ }
    return DEFAULT_WEIGHTS
  })
  const [usOnly, setUsOnly] = useState(true)
  const [minKnown, setMinKnown] = useState(3)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(w)) } catch { /* ignore */ } }, [w])

  const ranked = useMemo(() => PLACES
    .filter((p) => !p.minor && (!usOnly || p.inUS))
    .map((p) => rankPlace(p, w))
    .filter((r) => r.known >= minKnown)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.known - a.known), [w, usOnly, minKnown])

  return (
    <div>
      <PageHeader title="Weighted scorecard" sub="Drag the sliders to say what matters most. The ranking updates live." />
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-20">
          {CRITERIA.map((c) => (
            <label key={c.key} className="block">
              <div className="flex justify-between text-sm"><span className="font-medium">{c.label}</span><span className="tabular-nums text-slate-500">{w[c.key]}</span></div>
              <input type="range" min={0} max={5} step={1} value={w[c.key]} onChange={(e) => setW({ ...w, [c.key]: Number(e.target.value) })} className="w-full accent-teal-700" aria-label={`Weight for ${c.label}`} />
            </label>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button className="btn" onClick={() => setW(DEFAULT_WEIGHTS)}>Reset</button>
            <button className="btn" onClick={() => setW(Object.fromEntries(CRITERIA.map((c) => [c.key, c.key === 'sichuan' || c.key === 'turkish' ? 5 : 1])) as Weights)}>Food first</button>
            <button className="btn" onClick={() => setW(Object.fromEntries(CRITERIA.map((c) => [c.key, ['acreage', 'mountains', 'lakes'].includes(c.key) ? 5 : 1])) as Weights)}>Land first</button>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usOnly} onChange={(e) => setUsOnly(e.target.checked)} /> US only (his rule)</label>
          <label className="block text-sm">Hide places with fewer than <b>{minKnown}</b> known criteria
            <input type="range" min={1} max={8} value={minKnown} onChange={(e) => setMinKnown(Number(e.target.value))} className="w-full accent-teal-700" aria-label="Minimum known criteria" />
          </label>
        </aside>

        <div className="space-y-4">
          <div className="rounded-xl border-l-4 border-sky-500 bg-sky-50 p-4 text-sm dark:bg-sky-950/40">
            <b>How scoring works.</b> Each criterion gets a base score from the report’s marks: pass = 3, partial / with caveats = 1.5, fail = 0.
            Most marks come from the report’s comparison table; a few (blue dot) are read from the report’s text about that place, e.g. a ~67 min museum drive against a ~60 min target.
            A place’s score is the weighted average over only the criteria it has a mark for; unknown (“not checked yet”) criteria are left out rather than counted as zero, and listed under each place.
            So a place with few marks can rank high on thin evidence — check the “known” count. A food fail (Sichuan or Turkish) is flagged because it was a hard rule.
          </div>
          <ol className="space-y-3">
            {ranked.map((r, i) => (
              <li key={r.place.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">{i + 1}</span>
                  <Link to={`/places/${r.place.id}`} className="font-semibold hover:underline">{r.place.name}</Link>
                  <StatusBadge status={r.place.status} />
                  {r.hardFail && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">fails a food rule</span>}
                  <span className="ml-auto text-right">
                    <span className="text-2xl font-bold tabular-nums">{r.score === null ? '—' : r.score.toFixed(2)}</span><span className="text-sm text-slate-500"> / 3</span>
                    <span className="block text-xs text-slate-500">{r.known}/{CRITERIA.length} criteria known</span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-green-500 transition-all" style={{ width: `${((r.score ?? 0) / 3) * 100}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {CRITERIA.map((c) => (
                    <span key={c.key} className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs ${w[c.key] === 0 ? 'opacity-40' : ''} border-slate-200 dark:border-slate-700`}>
                      <MarkDot score={r.place.scores[c.key]} size="sm" />{c.label}
                    </span>
                  ))}
                </div>
                {r.unknown.length > 0 && <p className="mt-2 text-xs text-slate-500">Excluded as not checked yet: {r.unknown.map((k) => CRITERIA.find((c) => c.key === k)!.label).join(', ')}</p>}
              </li>
            ))}
          </ol>
          {ranked.length === 0 && <p className="card p-6 text-center text-slate-500">No places with enough known criteria. Lower the minimum.</p>}
        </div>
      </div>
    </div>
  )
}
