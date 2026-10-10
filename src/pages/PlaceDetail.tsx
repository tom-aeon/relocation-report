import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CRITERIA, ROUNDS, placeById, type Restaurant } from '../data/places'
import { FavButton, MarkDot, MarkLegend, NotChecked, StatusBadge } from '../components/ui'
import { useStore } from '../lib/store'

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm">{value ?? <NotChecked />}</div>
    </div>
  )
}

function FoodList({ title, items }: { title: string; items: Restaurant[] }) {
  return (
    <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-950/40">
      <div className="text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-300">{title} ({items.filter((r) => r.status !== 'closed').length})</div>
      {items.length === 0 ? <p className="mt-1 text-sm"><NotChecked text="none named in the report" /></p> : (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.map((r) => (
            <li key={r.name} className={r.status === 'closed' ? 'line-through opacity-60' : ''}>
              <b>{r.name}</b>{r.area ? `, ${r.area}` : ''} · {r.driveText ?? <NotChecked text="drive time not checked yet" />}
              {r.status === 'closed' && <span className="ml-1 rounded bg-red-100 px-1.5 text-xs text-red-700 no-underline dark:bg-red-900/50 dark:text-red-300">closed</span>}
              {r.status === 'caveat' && <span className="ml-1 rounded bg-amber-100 px-1.5 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">caveat</span>}
              {r.note && <span className="block text-xs text-slate-500">{r.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function PlaceDetail() {
  const { id = '' } = useParams()
  const p = placeById(id)
  const { saved, setNote } = useStore()
  const [photoIdx, setPhotoIdx] = useState(0)
  if (!p) return <div className="card p-8 text-center">Place not found. <Link className="text-teal-700 underline" to="/places">Back to places</Link></div>
  const photo = p.photos[photoIdx] ?? p.photos[0]

  return (
    <article className="space-y-6">
      <Link to="/places" className="text-sm text-teal-700 hover:underline dark:text-teal-400">← All places</Link>
      <div className="card overflow-hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <figure className="relative min-h-60 bg-gradient-to-br from-teal-700 to-sky-800">
          {photo ? (
            <>
              <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs text-white">{photo.credit}</figcaption>
            </>
          ) : <div className="grid h-full min-h-60 place-items-center text-white/70">No photo in the report</div>}
        </figure>
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={p.status} label={p.statusLabel} />
            <span className="text-xs text-slate-500">{p.country} · rounds {p.firstRound}{p.cutRound ? `–${p.cutRound}` : '–now'}</span>
            <FavButton id={p.id} className="ml-auto" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>
          <p className="text-slate-600 dark:text-slate-300">{p.summary}</p>
          {p.cutReason && (
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm dark:bg-red-950/40">
              <b>Why it was {p.status === 'near-miss' ? 'a near-miss' : 'dropped'}{p.cutRound ? ` (round ${p.cutRound}: ${ROUNDS.find((r) => r.n === p.cutRound)?.title})` : ''}:</b> {p.cutReason}
            </div>
          )}
          {p.photos.length > 1 && (
            <div className="flex gap-2 pt-1">
              {p.photos.map((ph, i) => (
                <button key={ph.src} onClick={() => setPhotoIdx(i)} className={`h-14 w-20 overflow-hidden rounded-md ring-2 ${i === photoIdx ? 'ring-teal-600' : 'ring-transparent opacity-70'}`} aria-label={`Show photo: ${ph.alt}`}>
                  <img src={ph.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5">
            <h2 className="mb-3 font-semibold">Example listing(s)</h2>
            {p.listings.length === 0 ? <NotChecked /> : (
              <ul className="space-y-2">
                {p.listings.map((l) => (
                  <li key={l.description} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                    <b>{l.description}</b> — {l.price}
                    <div className="text-xs text-slate-500">{l.asOf ? `As of ${l.asOf}. ` : 'No as-of date in the report. '}{l.note ?? ''} Re-verify before acting.</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="card grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Mountains / lakes" value={p.mountainsLakes} />
            <Field label="Crime" value={p.crime} />
            <Field label="Schools" value={p.schools} />
            <Field label="Infrastructure / airport" value={p.infrastructure} />
            <Field label="Climate" value={p.climate} />
            <Field label="Taxes" value={p.taxes} />
            <Field label="Risks / hazards" value={p.risks} />
            {p.otherFacts.map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
          </section>
          <section className="grid gap-4 sm:grid-cols-2">
            <FoodList title="Sichuan" items={p.restaurants.filter((r) => r.cuisine === 'Sichuan')} />
            <FoodList title="Turkish" items={p.restaurants.filter((r) => r.cuisine === 'Turkish')} />
          </section>
          <p className="text-xs text-slate-500">Drive times are free-flow estimates (no traffic). Restaurant openings and closings change, so confirm before visiting.</p>
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-2 font-semibold text-green-700 dark:text-green-400">Pros</h2>
              {p.pros.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{p.pros.map((x) => <li key={x}>{x}</li>)}</ul> : <NotChecked text="none recorded" />}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 font-semibold text-red-700 dark:text-red-400">Cons</h2>
              {p.cons.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{p.cons.map((x) => <li key={x}>{x}</li>)}</ul> : <NotChecked text="none recorded" />}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 font-semibold">Checklist marks</h2>
            <ul className="space-y-2 text-sm">
              {CRITERIA.map((c) => (
                <li key={c.key} className="flex items-start gap-2">
                  <MarkDot score={p.scores[c.key]} size="sm" />
                  <span><span className="font-medium">{c.label}</span>{p.scores[c.key]?.note && <span className="block text-xs text-slate-500">{p.scores[c.key]!.note}</span>}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 pl-8"><span className="font-medium">Country:</span> {p.country}</li>
            </ul>
            <div className="mt-4 text-xs"><MarkLegend /></div>
            <Link to={`/compare?ids=${p.id}`} className="btn mt-4">Compare this place →</Link>
          </section>
          <section className="card p-5">
            <h2 className="mb-2 font-semibold">My notes</h2>
            <textarea value={saved.notes[p.id] ?? ''} onChange={(e) => setNote(p.id, e.target.value)} rows={6} aria-label="Notes for this place"
              placeholder="Private notes, saved in this browser only…" className="input w-full" />
            <p className="mt-1 text-xs text-slate-500">Saved automatically to this browser. Export from <Link className="underline" to="/notes">My notes</Link>.</p>
          </section>
          {p.coordNote && <p className="text-xs text-slate-500">Map note: {p.coordNote}</p>}
        </aside>
      </div>
    </article>
  )
}
