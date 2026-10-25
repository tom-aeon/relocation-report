import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BUYING_IN_CANADA, CRITERIA, ROUNDS, placeById, type Restaurant, type Retail, type RetailStop } from '../data/places'
import { FavButton, MarkDot, MarkLegend, NotChecked, StatusBadge } from '../components/ui'
import { useStore } from '../lib/store'
import { HOMES, HOMES_META } from '../data/homes'
import { HomeCard, HomesNote } from '../components/HomeCard'
import { AW_METHOD, WELL_TEST, type AirWater, type AWFact } from '../data/airwater'
import type { Mark } from '../data/places'

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
              {r.address && <span className="block text-xs text-slate-500">{r.address}</span>}
              {r.status === 'closed' && <span className="ml-1 rounded bg-red-100 px-1.5 text-xs text-red-700 no-underline dark:bg-red-900/50 dark:text-red-300">closed</span>}
              {r.status === 'caveat' && <span className="ml-1 rounded bg-amber-100 px-1.5 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">caveat</span>}
              {r.note && <span className="block text-xs text-slate-500">{r.note}</span>}
              {r.openEvidence && <span className="block text-xs italic text-slate-400">Open evidence: {r.openEvidence}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RetailGroup({ title, stops }: { title: string; stops: RetailStop[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      {stops.length === 0 ? <NotChecked /> : (
        <ul className="mt-1 space-y-1.5 text-sm">
          {stops.map((s, i) => (
            <li key={s.name + s.address} className={`flex items-start gap-2 ${i > 0 ? 'opacity-75' : ''}`}>
              <MarkDot score={{ mark: s.mark, source: 'table' }} size="sm" />
              <span><b>{s.name}</b> · {s.driveText}{i === 0 && <span className="ml-1 rounded bg-slate-100 px-1 text-[10px] uppercase dark:bg-slate-800">nearest</span>}
                <span className="block text-xs text-slate-500">{s.address}{s.source && (s.source.startsWith('http') ? <> · <a className="underline" href={s.source} target="_blank" rel="noreferrer">source</a></> : ` · ${s.source}`)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RetailSection({ retail }: { retail?: Retail }) {
  return (
    <section className="card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Everyday retail</h2>
        {retail && <MarkDot score={{ mark: retail.overall, source: 'table' }} size="sm" />}
        {retail && <span className="text-xs text-slate-500">overall · checked {retail.checked}</span>}
      </div>
      {!retail ? <NotChecked /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <RetailGroup title="Coffee chain" stops={retail.coffee} />
            <RetailGroup title="Big box" stops={retail.bigBox} />
            <RetailGroup title="Home improvement" stops={retail.hardware} />
          </div>
          <p className="mt-3 text-xs text-slate-500">From: {retail.base}. {retail.method} Good ≤ ~25 min, partial 25–35, fail &gt; 35. Overall = the weakest of the three.</p>
        </>
      )}
    </section>
  )
}

const AW_LABEL: Record<Mark, string> = { pass: 'good', partial: 'partial', fail: 'concern', unknown: 'not checked yet' }

function AWMark({ mark }: { mark: Mark }) {
  return <span className="inline-flex items-center gap-1"><MarkDot score={{ mark, source: 'table' }} size="sm" /><span className="text-xs font-medium">{AW_LABEL[mark]}</span></span>
}

function FactList({ facts }: { facts: AWFact[] }) {
  return (
    <dl className="mt-2 space-y-1.5 text-sm">
      {facts.map((f) => (
        <div key={f.label}><dt className="inline font-medium">{f.label}: </dt><dd className="inline">{f.value}</dd> <span className="text-xs text-slate-500">({f.source})</span></div>
      ))}
    </dl>
  )
}

function AirWaterSection({ aw }: { aw?: AirWater }) {
  return (
    <section className="card p-5" data-testid="airwater-section">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Air &amp; water</h2>
        {aw && <AWMark mark={aw.overall} />}
        {aw && <span className="text-xs text-slate-500">overall · checked {aw.checked}</span>}
      </div>
      {!aw ? <NotChecked /> : (
        <div className="space-y-4">
          <p className="text-sm">{aw.note}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">Air <AWMark mark={aw.air.mark} /></h3>
              <p className="mt-1 text-sm">{aw.air.summary}</p>
              <p className="mt-1 text-xs text-slate-500">Station: {aw.air.station}</p>
              <FactList facts={aw.air.facts} />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">Water <AWMark mark={aw.water.mark} /></h3>
              <p className="mt-1 text-sm">{aw.water.summary}</p>
              <FactList facts={aw.water.municipal} />
              <p className="mt-3 text-sm"><span className="font-medium">Well or septic? </span>{aw.water.listingSupply}</p>
              <h4 className="mt-3 text-sm font-medium">Well-water risks in the area</h4>
              <ul className="ml-5 list-disc text-sm">{aw.water.wellRisks.map((r) => <li key={r}>{r}</li>)}</ul>
              <p className="mt-3 rounded-md bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"><span className="font-medium">Recommended: </span>{WELL_TEST}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sources</h4>
            <ul className="ml-5 list-disc text-xs">{aw.sources.map((s) => <li key={s.url}><a className="text-teal-700 underline dark:text-teal-400" href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul>
            <p className="mt-2 text-xs text-slate-500">{AW_METHOD} Data changes; re-verify before buying.</p>
          </div>
        </div>
      )}
    </section>
  )
}

function HomesSection({ placeId }: { placeId: string }) {
  const hs = HOMES.filter((h) => h.placeId === placeId)
  const gap = HOMES_META.gaps[placeId]
  return (
    <section className="card p-5" data-testid="homes-section">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Example homes</h2>
        <span className="text-xs text-slate-500">as of {HOMES_META.asOf}, re-verify · <Link to="/homes" className="text-teal-700 underline dark:text-teal-400">all homes</Link></span>
      </div>
      {hs.length === 0 ? <NotChecked text={gap ?? 'not checked yet'} /> : (
        <>
          {gap && <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">{gap}</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{hs.map((h) => <HomeCard key={h.id} h={h} />)}</div>
          <div className="mt-3"><HomesNote /></div>
        </>
      )}
    </section>
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
              <b>{p.status === 'other' ? 'Why it’s in Other' : `Why it was ${p.status === 'near-miss' ? 'a near-miss' : 'dropped'}`}{p.cutRound ? ` (round ${p.cutRound}: ${ROUNDS.find((r) => r.n === p.cutRound)?.title})` : ''}:</b> {p.cutReason}
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
            {p.homeBase && <p className="mb-2 text-xs text-slate-500">Home base for drive times: {p.homeBase}</p>}
            {p.listings.length === 0 ? <NotChecked /> : (
              <ul className="space-y-2">
                {p.listings.map((l) => (
                  <li key={l.description} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                    <b>{l.description}</b> — {l.price}
                    <div className="text-xs text-slate-500">{l.asOf ? `As of ${l.asOf}. ` : 'No as-of date in the report. '}{l.note ?? ''} Re-verify before acting.{l.source && <> · <a className="underline" href={l.source} target="_blank" rel="noreferrer">listing source</a></>}</div>
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
            <Field label="Museums" value={p.museums} />
            <Field label="Wildlife" value={p.wildlifeText} />
            {p.otherFacts.map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
          </section>
          {p.country === 'Canada' && !p.minor && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm dark:border-red-900 dark:bg-red-950/30">
              <h2 className="mb-2 font-semibold">Buying in Canada</h2>
              <ul className="list-disc space-y-1 pl-5">{BUYING_IN_CANADA.map((x) => <li key={x}>{x}</li>)}</ul>
              {p.foreignBuyer && <p className="mt-2"><b>For this place:</b> {p.foreignBuyer}</p>}
              {p.province === 'ON' ? null : <p className="mt-2 text-xs text-slate-500">Quebec has its own rules (immigration via PSTQ); the Ontario NRST does not apply in Quebec.</p>}
            </section>
          )}
          <RetailSection retail={p.retail} />
          <AirWaterSection aw={p.airWater} />
          <HomesSection placeId={p.id} />
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
