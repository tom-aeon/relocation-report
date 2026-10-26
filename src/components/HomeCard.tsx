import type { Home } from '../data/homesTypes'
import { HOMES_META } from '../data/homes'
import { AMENITIES } from '../data/amenities'
import { nearest } from '../data/amenitiesTypes'

const fmt = (n: number, c: string) => (c === 'CAD' ? 'CAD $' : '$') + n.toLocaleString('en-US')
export const mapUrl = (a: string) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(a)}`

export function HomeCard({ h, showPlace }: { h: Home; showPlace?: string }) {
  const base = import.meta.env.BASE_URL
  const inRange = h.acres >= 1 && h.acres <= 3
  return (
    <article className="card flex flex-col overflow-hidden" data-testid="home-card" data-url={h.url} data-photo={h.photos[0] ?? ''}>
      <a href={h.url} target="_blank" rel="noopener noreferrer" className="block aspect-[3/2] bg-slate-200 dark:bg-slate-800">
        {h.photos[0] && <img src={base + h.photos[0]} alt={`Listing photo: ${h.address}`} loading="lazy" className="h-full w-full object-cover" />}
      </a>
      <div className="flex flex-1 flex-col gap-1.5 p-4 text-sm">
        {showPlace && <span className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">{showPlace}</span>}
        <div className="text-lg font-bold">{fmt(h.price, h.currency)}{h.currency === 'CAD' && <span className="ml-1 text-xs font-normal text-slate-500">(~US${Math.round(h.priceUsd / 1000)}K)</span>}</div>
        <a href={h.url} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline dark:text-teal-400">{h.address}</a>
        <div>{h.acres} acres{!inRange && <span className="ml-1 rounded bg-amber-100 px-1 text-xs text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">{h.acres < 1 ? 'a bit under 1 acre' : 'over 3 acres'}</span>} · <b>{h.beds ?? '?'} bd</b>{String(h.beds).includes('+') && <span className="text-xs text-slate-500"> (above + below grade)</span>} · <b>{h.baths ?? '?'} ba</b>{h.bathNote && <span className="text-xs text-slate-500"> ({h.bathNote})</span>} · {h.sqft ? `${h.sqft} sq ft` : 'sq ft not listed'}</div>
        <div className="text-xs text-slate-500">~{h.driveMin} min free-flow from the place’s home base{h.sewer ? ` · Sewer: ${h.sewer}` : ''}{h.water ? ` · Water: ${h.water}` : ''}</div>
        <div className="text-xs text-slate-500">{h.daysOnMarket != null && h.daysOnMarket >= 0 ? `${h.daysOnMarket} days on ${h.source}` : h.newListing ? `Flagged “new listing” on ${h.source}` : 'Listing date not shown'}{h.mls ? ` · MLS® ${h.mls}` : ''}</div>
        {AMENITIES[h.placeId] && (() => { const a = AMENITIES[h.placeId]; const f = (k: 'ski' | 'rink' | 'park', l: string) => { const n = nearest(a[k]); return n ? `${l} ~${n.driveMin} min` : null }; return <div className="text-xs text-slate-500" data-testid="home-amen">Area: {[f('ski', 'ski'), f('rink', 'rink'), f('park', 'park')].filter(Boolean).join(' · ')} (from the place’s base)</div> })()}
        {h.note && <div className="text-xs text-amber-700 dark:text-amber-300">{h.note}</div>}
        <div className="text-xs text-slate-500">As of {HOMES_META.asOf}, re-verify. Photo © {h.broker ?? 'listing brokerage'} via {h.source}.</div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <a href={h.url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800" data-testid="view-listing">View listing ↗</a>
          <a href={mapUrl(h.address)} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Map ↗</a>
        </div>
      </div>
    </article>
  )
}

export function HomesNote() {
  return <p className="text-xs text-slate-500">{HOMES_META.note}</p>
}
