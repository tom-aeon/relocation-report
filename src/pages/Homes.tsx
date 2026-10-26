import { useMemo, useState } from 'react'
import { HOMES, HOMES_META } from '../data/homes'
import { total } from '../data/homesTypes'
import { placeById } from '../data/places'
import { HomeCard, HomesNote } from '../components/HomeCard'
import { PageHeader } from '../components/ui'

export default function Homes() {
  const placeIds = useMemo(() => [...new Set(HOMES.map((h) => h.placeId))], [])
  const [place, setPlace] = useState('all')
  const [cap, setCap] = useState(850000)
  const [minBeds, setMinBeds] = useState(4)
  const [minBaths, setMinBaths] = useState(3)
  const [sort, setSort] = useState<'price' | 'price-desc' | 'acres'>('price')
  const list = HOMES.filter((h) => (place === 'all' || h.placeId === place) && h.priceUsd <= cap && total(h.beds) >= minBeds && total(h.baths) >= minBaths)
    .sort((a, b) => sort === 'price' ? a.priceUsd - b.priceUsd : sort === 'price-desc' ? b.priceUsd - a.priceUsd : b.acres - a.acres)
  return (
    <div className="space-y-4">
      <PageHeader title="Example homes" sub={`Real for-sale houses with 4+ bedrooms and 3+ baths on roughly 1–3 acres under US$850K, checked active as of ${HOMES_META.asOf}. Re-verify before acting.`} />
      <div className="card flex flex-wrap items-end gap-4 p-4 text-sm">
        <label className="flex flex-col gap-1">Place
          <select className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900" value={place} onChange={(e) => setPlace(e.target.value)} data-testid="homes-place">
            <option value="all">All places ({HOMES.length})</option>
            {placeIds.map((id) => <option key={id} value={id}>{placeById(id)?.short ?? id} ({HOMES.filter((h) => h.placeId === id).length})</option>)}
          </select>
        </label>
        <label className="flex min-w-60 flex-col gap-1">Price cap: <b>US${Math.round(cap / 1000)}K</b>
          <input type="range" min={300000} max={850000} step={10000} value={cap} onChange={(e) => setCap(Number(e.target.value))} data-testid="homes-cap" />
        </label>
        <label className="flex flex-col gap-1">Min beds
          <select className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900" value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))} data-testid="homes-minbeds">
            {[4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Min baths
          <select className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900" value={minBaths} onChange={(e) => setMinBaths(Number(e.target.value))} data-testid="homes-minbaths">
            {[3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Sort
          <select className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="price">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="acres">Acres, most first</option>
          </select>
        </label>
        <span className="text-slate-500" data-testid="homes-count" data-count={list.length}>{list.length} shown</span>
      </div>
      <HomesNote />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((h) => <HomeCard key={h.id} h={h} showPlace={placeById(h.placeId)?.short} />)}
      </div>
    </div>
  )
}
