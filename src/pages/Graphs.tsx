import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList, Legend, ReferenceLine, ComposedChart
} from 'recharts'
import { HOMES, HOMES_META } from '../data/homes'
import { STATUS_META, STATUS_ORDER, CRITERIA, placeById, type Status, type Place } from '../data/places'
import { DEFAULT_WEIGHTS, rankPlace, type Weights } from '../lib/score'
import { PageHeader } from '../components/ui'
import { CrimeBandLegend } from '../components/CrimeSection'
import { useStore } from '../lib/store'
import {
  CANADA_CSI_2025, CORAL_SPRINGS, CRIME_BAND_META, CRIME_CHECKED, CRIME_METHOD, CROSS_BORDER_NOTE,
  compareRate, crimeFor, formatPct, formatRate,
} from '../data/crime'
import {
  COMMUTE_YEAR_NOTE, CORAL_SPRINGS_POP, INCOME_YEAR_NOTE, POP_CHECKED, POP_METHOD,
  formatCount as formatPopCount, formatMinutes, formatMoney, formatPct as formatPopPct, formatYears,
} from '../data/population'
import { populationRowsForGraph } from '../components/PopulationSection'

const BUDGET_USD = 850000
const CURRENT_STATUSES: Status[] = ['best', 'live', 'stretch', 'parked']

const PLACE_COLORS: Record<string, string> = {
  forsyth: '#16a34a',
  'happy-valley': '#0d9488',
  duvall: '#7c3aed',
  cantley: '#0284c7',
  maryville: '#db2777',
  elizabeth: '#d97706',
  boise: '#dc2626',
  'on-carp-huntley': '#2563eb',
  'on-dunrobin': '#4f46e5',
  'on-north-gower': '#7c3aed',
  'on-flamborough': '#be185d',
  'on-oro-medonte': '#9333ea',
  toronto: '#475569',
}

function getPlaceColor(placeId: string): string {
  return PLACE_COLORS[placeId] ?? '#64748b'
}

export default function Graphs() {
  const { activePlaces, rejectedCount } = useStore()
  const [countryFilter, setCountryFilter] = useState<'all' | 'US' | 'Canada'>('all')
  const [statusFilter, setStatusFilter] = useState<Status[]>(CURRENT_STATUSES)
  const [selectedPlace, setSelectedPlace] = useState<string>('all')

  const filteredPlaces = useMemo(() =>
    activePlaces.filter(p =>
      !p.minor &&
      statusFilter.includes(p.status) &&
      (countryFilter === 'all' || p.country === countryFilter)
    ), [countryFilter, statusFilter, activePlaces])

  const filteredHomes = useMemo(() =>
    HOMES.filter(h => {
      const place = placeById(h.placeId)
      if (!place) return false
      if (!activePlaces.some(p => p.id === h.placeId)) return false
      if (selectedPlace !== 'all' && h.placeId !== selectedPlace) return false
      if (countryFilter !== 'all' && place.country !== countryFilter) return false
      return statusFilter.includes(place.status)
    }), [countryFilter, statusFilter, selectedPlace, activePlaces])

  const toggleStatus = (s: Status) => {
    setStatusFilter(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Graphs"
        sub={`Visual analysis of homes, places, and criteria. Data timestamps: homes checked ${HOMES_META.asOf}; report date 10 Oct 2026.`}
      />

      <section className="card p-4 space-y-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            Country
            <select
              className="input"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value as 'all' | 'US' | 'Canada')}
              aria-label="Country filter"
            >
              <option value="all">All</option>
              <option value="US">US only</option>
              <option value="Canada">Canada only</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            Place
            <select
              className="input"
              value={selectedPlace}
              onChange={e => setSelectedPlace(e.target.value)}
              aria-label="Place filter"
            >
              <option value="all">All places</option>
              {filteredPlaces.map(p => (
                <option key={p.id} value={p.id}>{p.short}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Status filter">
          {STATUS_ORDER.map(s => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              aria-pressed={statusFilter.includes(s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
                statusFilter.includes(s)
                  ? 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  : 'border-dashed border-slate-300 opacity-50 dark:border-slate-700'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[s].color }} />
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </section>
      {rejectedCount > 0 && (
        <p className="text-sm text-slate-500">{rejectedCount} personally rejected place{rejectedCount === 1 ? '' : 's'} excluded from these graphs. <Link to="/places?rejected=1" className="text-teal-700 underline dark:text-teal-400">View rejected →</Link></p>
      )}

      <PriceAcreageScatter homes={filteredHomes} />
      <HomesPerPlace homes={filteredHomes} places={filteredPlaces} />
      <DriveTimeComparison places={filteredPlaces} />
      <CriteriaScoreChart places={filteredPlaces} />
      <CrimeComparisonChart places={filteredPlaces} />
      <PopulationComparisonChart places={filteredPlaces} />
    </div>
  )
}

interface ScatterDataPoint {
  id: string
  placeId: string
  placeName: string
  address: string
  priceUsd: number
  acres: number
  url: string
  color: string
  currency: string
  originalPrice: number
}

function PriceAcreageScatter({ homes }: { homes: typeof HOMES }) {
  const data: ScatterDataPoint[] = useMemo(() =>
    homes.map(h => {
      const place = placeById(h.placeId)
      return {
        id: h.id,
        placeId: h.placeId,
        placeName: place?.short ?? h.placeId,
        address: h.address,
        priceUsd: h.priceUsd,
        acres: h.acres,
        url: h.url,
        color: getPlaceColor(h.placeId),
        currency: h.currency,
        originalPrice: h.price,
      }
    }), [homes])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ScatterDataPoint }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{d.placeName}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{d.address}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p><b>US$</b> {d.priceUsd.toLocaleString()}{d.currency === 'CAD' ? ` (CA$${d.originalPrice.toLocaleString()})` : ''}</p>
          <p><b>Acres:</b> {d.acres.toFixed(2)}</p>
        </div>
        <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">Click to view listing →</p>
      </div>
    )
  }

  const handleClick = (data: ScatterDataPoint) => {
    window.open(data.url, '_blank', 'noopener,noreferrer')
  }

  if (data.length === 0) {
    return (
      <section className="card p-6">
        <h2 className="text-lg font-bold mb-2">Home Price vs. Acreage</h2>
        <p className="text-slate-500">No homes match the current filters.</p>
      </section>
    )
  }

  const placeIds = [...new Set(data.map(d => d.placeId))]

  return (
    <section className="card p-4 sm:p-6">
      <h2 className="text-lg font-bold mb-1">Home Price vs. Acreage</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        All qualifying homes (4+ bed, 3+ bath) under US${BUDGET_USD.toLocaleString()}. Prices normalized to USD.
        Red line = US${BUDGET_USD.toLocaleString()} budget cap. Click a point to view the listing.
        <span className="block mt-1 text-xs">Data as of {HOMES_META.asOf}. {HOMES_META.fx}</span>
      </p>
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              type="number"
              dataKey="acres"
              name="Acres"
              domain={[0, 'auto']}
              tickFormatter={v => v.toFixed(1)}
              label={{ value: 'Acres', position: 'bottom', offset: 0 }}
              className="text-xs"
            />
            <YAxis
              type="number"
              dataKey="priceUsd"
              name="Price (USD)"
              domain={[400000, BUDGET_USD + 50000]}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
              label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft', offset: 10 }}
              className="text-xs"
            />
            <ZAxis range={[80, 80]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={BUDGET_USD}
              stroke="#dc2626"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `$850K cap`, position: 'right', fill: '#dc2626', fontSize: 12 }}
            />
            {placeIds.map(placeId => (
              <Scatter
                key={placeId}
                name={placeById(placeId)?.short ?? placeId}
                data={data.filter(d => d.placeId === placeId)}
                fill={getPlaceColor(placeId)}
                onClick={(d) => handleClick(d as unknown as ScatterDataPoint)}
                cursor="pointer"
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

interface PlaceHomeData {
  placeId: string
  name: string
  count: number
  minPrice: number | null
  maxPrice: number | null
  avgPrice: number | null
  color: string
  country: string
  status: Status
  noHomes: boolean
  gapReason?: string
}

function HomesPerPlace({ homes, places }: { homes: typeof HOMES; places: Place[] }) {
  const data: PlaceHomeData[] = useMemo(() => {
    const placeHomes = new Map<string, typeof HOMES>()
    homes.forEach(h => {
      const arr = placeHomes.get(h.placeId) ?? []
      arr.push(h)
      placeHomes.set(h.placeId, arr)
    })

    return places
      .filter(p => !p.minor)
      .map(p => {
        const pHomes = placeHomes.get(p.id) ?? []
        const prices = pHomes.map(h => h.priceUsd)
        const gapReason = HOMES_META.gaps[p.id as keyof typeof HOMES_META.gaps]
        return {
          placeId: p.id,
          name: p.short,
          count: pHomes.length,
          minPrice: prices.length ? Math.min(...prices) : null,
          maxPrice: prices.length ? Math.max(...prices) : null,
          avgPrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
          color: getPlaceColor(p.id),
          country: p.country,
          status: p.status,
          noHomes: pHomes.length === 0,
          gapReason,
        }
      })
      .sort((a, b) => b.count - a.count)
  }, [homes, places])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: PlaceHomeData }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{d.name}</p>
        <p className="text-xs text-slate-500">{d.country} · {STATUS_META[d.status].label}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p><b>Qualifying homes:</b> {d.count === 0 ? 'None found' : d.count}</p>
          {d.count > 0 && (
            <>
              <p><b>Price range:</b> ${(d.minPrice! / 1000).toFixed(0)}K – ${(d.maxPrice! / 1000).toFixed(0)}K</p>
              <p><b>Average:</b> ${(d.avgPrice! / 1000).toFixed(0)}K</p>
            </>
          )}
          {d.noHomes && d.gapReason && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{d.gapReason}</p>
          )}
        </div>
        <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">Click to see place details →</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <section className="card p-6">
        <h2 className="text-lg font-bold mb-2">Qualifying Homes Per Place</h2>
        <p className="text-slate-500">No places match the current filters.</p>
      </section>
    )
  }

  return (
    <section className="card p-4 sm:p-6">
      <h2 className="text-lg font-bold mb-1">Qualifying Homes Per Place</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Count of 4+ bed, 3+ bath homes under US$850K per place. Places with 0 homes show why none qualify.
        <span className="block mt-1 text-xs">Data as of {HOMES_META.asOf}.</span>
      </p>
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis type="number" domain={[0, 'auto']} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11 }}
              tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" cursor="pointer">
              {data.map((entry) => (
                <Cell
                  key={entry.placeId}
                  fill={entry.noHomes ? '#94a3b8' : entry.color}
                  cursor="pointer"
                  onClick={() => { window.location.hash = `/places/${entry.placeId}` }}
                />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                formatter={(v) => v === 0 ? 'none' : v}
                className="text-xs fill-slate-600 dark:fill-slate-300"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.some(d => d.noHomes && d.gapReason) && (
        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Places with no qualifying homes:</p>
          <ul className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-400">
            {data.filter(d => d.noHomes && d.gapReason).map(d => (
              <li key={d.placeId}><b>{d.name}:</b> {d.gapReason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

interface DriveTimeData {
  placeId: string
  name: string
  coffee: number | null
  bigBox: number | null
  hardware: number | null
  university: number | null
  hospital: number | null
  country: string
}

function DriveTimeComparison({ places }: { places: Place[] }) {
  const data: DriveTimeData[] = useMemo(() =>
    places
      .filter(p => !p.minor && p.retail)
      .map(p => {
        const retail = p.retail!
        const amenities = p.amenities
        const coffeeMin = retail.coffee[0]?.driveMin ?? null
        const bigBoxMin = retail.bigBox[0]?.driveMin ?? null
        const hardwareMin = retail.hardware[0]?.driveMin ?? null
        const uniMin = amenities?.university?.items[0]?.driveMin ?? null
        const hospitalMin = amenities?.hospital?.items[0]?.driveMin ?? null
        return {
          placeId: p.id,
          name: p.short,
          coffee: coffeeMin,
          bigBox: bigBoxMin,
          hardware: hardwareMin,
          university: uniMin,
          hospital: hospitalMin,
          country: p.country,
        }
      })
      .sort((a, b) => {
        const aTotal = (a.coffee ?? 99) + (a.bigBox ?? 99) + (a.hardware ?? 99)
        const bTotal = (b.coffee ?? 99) + (b.bigBox ?? 99) + (b.hardware ?? 99)
        return aTotal - bTotal
      }), [places])

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number | null; color: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{label}</p>
        <div className="mt-2 space-y-1 text-sm">
          {payload.map(p => (
            <p key={p.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              {p.name}: {p.value === null ? <span className="text-slate-400 italic">unknown</span> : `${p.value} min`}
            </p>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Free-flow OSRM estimates, no traffic</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <section className="card p-6">
        <h2 className="text-lg font-bold mb-2">Drive Time to Amenities</h2>
        <p className="text-slate-500">No retail data available for the selected places.</p>
      </section>
    )
  }

  return (
    <section className="card p-4 sm:p-6">
      <h2 className="text-lg font-bold mb-1">Drive Time to Key Amenities</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Nearest coffee, big box store, hardware store, university, and hospital in free-flow minutes.
        Lower is better. Missing bars = data not available for that place.
        <span className="block mt-1 text-xs">Retail data checked 10 Oct 2026; amenities data 26 Oct 2026.</span>
      </p>
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tickFormatter={v => `${v}m`}
              label={{ value: 'Minutes (free-flow)', position: 'bottom', offset: -5, fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11 }}
              tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="coffee" name="Coffee" fill="#854d0e" stackId="a" />
            <Bar dataKey="bigBox" name="Big Box" fill="#0284c7" stackId="b" />
            <Bar dataKey="hardware" name="Hardware" fill="#16a34a" stackId="c" />
            <Bar dataKey="university" name="University" fill="#7c3aed" stackId="d" />
            <Bar dataKey="hospital" name="Hospital" fill="#dc2626" stackId="e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        <b>Target thresholds:</b> Retail ≤25 min good, 25–35 partial, &gt;35 fail.
      </div>
    </section>
  )
}

interface ScoreData {
  placeId: string
  name: string
  score: number | null
  knownCount: number
  unknownCount: number
  hardFail: boolean
  country: string
  status: Status
}

function CriteriaScoreChart({ places }: { places: Place[] }) {
  const [weights] = useState<Weights>(DEFAULT_WEIGHTS)

  const data: ScoreData[] = useMemo(() =>
    places
      .filter(p => !p.minor)
      .map(p => {
        const r = rankPlace(p, weights)
        return {
          placeId: p.id,
          name: p.short,
          score: r.score,
          knownCount: r.known,
          unknownCount: r.unknown.length,
          hardFail: r.hardFail,
          country: p.country,
          status: p.status,
        }
      })
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1)), [places, weights])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ScoreData }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{d.name}</p>
        <p className="text-xs text-slate-500">{d.country} · {STATUS_META[d.status].label}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p><b>Score:</b> {d.score === null ? 'N/A (insufficient data)' : d.score.toFixed(2)} / 3.00</p>
          <p><b>Criteria known:</b> {d.knownCount} of {CRITERIA.length}</p>
          <p><b>Criteria unknown:</b> {d.unknownCount === 0 ? 'none' : d.unknownCount}</p>
          {d.hardFail && <p className="text-red-600 dark:text-red-400">⚠ Fails a hard food rule</p>}
        </div>
        <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">Click to see scorecard →</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <section className="card p-6">
        <h2 className="text-lg font-bold mb-2">Criteria Score by Place</h2>
        <p className="text-slate-500">No places match the current filters.</p>
      </section>
    )
  }

  return (
    <section className="card p-4 sm:p-6">
      <h2 className="text-lg font-bold mb-1">Criteria Score by Place</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        Weighted score from the default scorecard weights. Pass = 3, Partial = 1.5, Fail = 0.
        Unknown criteria are excluded (not counted as zero). Red border = fails a hard food rule.
      </p>
      <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 p-3 text-xs mb-4">
        <b>Default weights:</b> Hard criteria (Sichuan, Turkish) = 3; standard = 2; optional (outdoor) = 0.
        Scores show {CRITERIA.length} possible criteria; places with more unknowns have thinner evidence.
        <Link to="/scorecard" className="ml-2 text-teal-700 underline dark:text-teal-400">Customize weights →</Link>
      </div>
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} layout="vertical" margin={{ top: 10, right: 50, left: 100, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              type="number"
              domain={[0, 3]}
              ticks={[0, 1, 1.5, 2, 2.5, 3]}
              tickFormatter={v => v.toFixed(1)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11 }}
              tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              cursor="pointer"
              onClick={() => { window.location.hash = '/scorecard' }}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.placeId}
                  fill={entry.score === null ? '#94a3b8' : entry.hardFail ? '#fca5a5' : '#14b8a6'}
                  stroke={entry.hardFail ? '#dc2626' : 'none'}
                  strokeWidth={entry.hardFail ? 2 : 0}
                />
              ))}
              <LabelList
                dataKey="score"
                position="right"
                formatter={(v) => v === null || v === undefined ? '?' : Number(v).toFixed(2)}
                className="text-xs fill-slate-600 dark:fill-slate-300"
              />
            </Bar>
            <ReferenceLine x={1.5} stroke="#d97706" strokeDasharray="3 3" label={{ value: 'partial', position: 'top', fill: '#d97706', fontSize: 10 }} />
            <ReferenceLine x={2.5} stroke="#16a34a" strokeDasharray="3 3" label={{ value: 'good', position: 'top', fill: '#16a34a', fontSize: 10 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {data.some(d => d.unknownCount > 3) && (
        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Sparse data warning:</p>
          <ul className="mt-1 text-xs text-amber-700 dark:text-amber-400">
            {data.filter(d => d.unknownCount > 3).map(d => (
              <li key={d.placeId}>{d.name}: {d.unknownCount} of {CRITERIA.length} criteria unknown</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}


function CrimeComparisonChart({ places }: { places: Place[] }) {
  const [metric, setMetric] = useState<'violent' | 'property'>('violent')
  const baseline = CORAL_SPRINGS[metric].ratePer100k

  const data = useMemo(() => {
    return places
      .filter(p => !p.minor)
      .map(p => {
        const c = crimeFor(p.id)
        const rate = c ? c[metric].ratePer100k : null
        const cmp = compareRate(rate, baseline)
        return {
          placeId: p.id,
          name: p.short,
          country: p.country,
          status: p.status,
          rate,
          coral: baseline,
          band: cmp.band,
          pct: cmp.pct,
          agency: c ? c[metric].agency : null,
          year: c ? c[metric].year : null,
          csi: c?.csi?.value ?? null,
        }
      })
      .sort((a, b) => {
        if (a.rate == null && b.rate == null) return a.name.localeCompare(b.name)
        if (a.rate == null) return 1
        if (b.rate == null) return -1
        return a.rate - b.rate
      })
  }, [places, metric, baseline])

  const canadaShown = data.some(d => d.country === 'Canada')

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: (typeof data)[0] }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{d.name}</p>
        <p className="text-xs text-slate-500">{d.country} · {STATUS_META[d.status].label}</p>
        <p className="mt-1 text-sm"><b>{formatRate(d.rate)}</b> per 100,000</p>
        <p className="text-sm">{formatPct(d.pct)}</p>
        {d.agency && <p className="mt-1 text-xs text-slate-500">{d.agency}, {d.year}</p>}
        {d.country === 'Canada' && d.csi != null && <p className="text-xs text-slate-500">CSI {d.csi} (Canada {CANADA_CSI_2025.value})</p>}
        {d.country === 'Canada' && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">US–Canada comparison is approximate</p>}
        <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">Click to open the place →</p>
      </div>
    )
  }

  return (
    <section className="card p-4 sm:p-6" data-testid="crime-graph">
      <h2 className="text-lg font-bold mb-1">Crime rate vs Coral Springs, FL</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {metric === 'violent' ? 'Violent' : 'Property'} crime per 100,000, compared with Coral Springs Police Department
        ({formatRate(baseline)} per 100,000 in {CORAL_SPRINGS[metric].year}). The dashed line is the Coral Springs rate.
        Colours: lower (green), similar within ±15% (amber), higher (red), not available (grey). Checked {CRIME_CHECKED}.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setMetric('violent')} aria-pressed={metric === 'violent'}
          className={`rounded-full border px-3 py-1 text-sm ${metric === 'violent' ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed opacity-60'}`}>Violent crime</button>
        <button type="button" onClick={() => setMetric('property')} aria-pressed={metric === 'property'}
          className={`rounded-full border px-3 py-1 text-sm ${metric === 'property' ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed opacity-60'}`}>Property crime</button>
      </div>
      <CrimeBandLegend />
      {canadaShown && <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{CROSS_BORDER_NOTE}</p>}
      {data.length === 0 ? (
        <p className="mt-4 text-slate-500">No places match the current filters.</p>
      ) : (
        <div className="mt-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 60, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis type="number" tickFormatter={v => Number(v).toLocaleString('en-US')} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }}
                tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" cursor="pointer"
                onClick={(d) => { const id = (d as { placeId?: string }).placeId; if (id) window.location.hash = `/places/${id}` }}>
                {data.map((entry) => (
                  <Cell key={entry.placeId} fill={CRIME_BAND_META[entry.band].color} />
                ))}
                <LabelList dataKey="rate" position="right"
                  formatter={(v) => v == null || v === undefined ? 'n/a' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 1 })}
                  className="text-xs fill-slate-600 dark:fill-slate-300" />
              </Bar>
              {baseline != null && (
                <ReferenceLine x={baseline} stroke="#0f172a" strokeDasharray="4 3"
                  label={{ value: 'Coral Springs', position: 'top', fill: '#0f172a', fontSize: 10 }} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {canadaShown && (
        <div className="mt-6" data-testid="csi-graph">
          <h3 className="font-semibold mb-1">Crime Severity Index (Canada only)</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            The CSI has no Coral Springs counterpart. The dashed line is Canada’s 2025 national index ({CANADA_CSI_2025.value}).
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.filter(d => d.country === 'Canada' && d.csi != null)} layout="vertical"
                margin={{ top: 10, right: 50, left: 100, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }}
                  tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v} />
                <Tooltip formatter={(v) => [v, 'CSI']} />
                <Bar dataKey="csi" fill="#0d9488" cursor="pointer"
                  onClick={(d) => { const id = (d as { placeId?: string }).placeId; if (id) window.location.hash = `/places/${id}` }}>
                  <LabelList dataKey="csi" position="right" className="text-xs fill-slate-600" />
                </Bar>
                <ReferenceLine x={CANADA_CSI_2025.value!} stroke="#0f172a" strokeDasharray="4 3"
                  label={{ value: 'Canada', position: 'top', fill: '#0f172a', fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">{CRIME_METHOD}</p>
    </section>
  )
}

type PopMetric = 'population' | 'growth' | 'age' | 'income' | 'education' | 'commute'

const POP_METRICS: Record<PopMetric, { label: string; axis: string }> = {
  population: { label: 'Total population', axis: 'people' },
  growth: { label: 'Recent growth', axis: '%' },
  age: { label: 'Median age', axis: 'years' },
  income: { label: 'Median household income (US$)', axis: 'USD' },
  education: { label: 'Bachelor’s or higher, age 25+', axis: '%' },
  commute: { label: 'Mean commute', axis: 'min' },
}

function PopulationComparisonChart({ places }: { places: Place[] }) {
  const [metric, setMetric] = useState<PopMetric>('population')
  const coral = CORAL_SPRINGS_POP

  const data = useMemo(() => {
    const rows = populationRowsForGraph(places)
    const coralRow = {
      placeId: 'coral-springs',
      name: 'Coral Springs, FL (baseline)',
      geography: coral.geography,
      country: 'US' as const,
      status: 'baseline',
      population: coral.population.value,
      popPeriod: coral.population.period,
      growth: coral.growth.pct,
      growthYears: `${coral.growth.fromYear}–${coral.growth.toYear}`,
      age: coral.medianAge.value,
      incomeUsd: coral.medianIncome.valueUsd,
      incomeCurrency: coral.medianIncome.currency,
      incomeLocal: coral.medianIncome.value,
      bachelorPct: coral.bachelorPct.value,
      commute: coral.meanCommute.value,
      isCoral: true,
    }
    const withCoral = [
      coralRow,
      ...rows.map((r) => ({ ...r, isCoral: false })),
    ]
    const valueOf = (r: (typeof withCoral)[0]) => {
      if (metric === 'population') return r.population
      if (metric === 'growth') return r.growth
      if (metric === 'age') return r.age
      if (metric === 'income') return r.incomeUsd
      if (metric === 'education') return r.bachelorPct
      return r.commute
    }
    return withCoral
      .map((r) => ({ ...r, value: valueOf(r) }))
      .sort((a, b) => {
        if (a.value == null && b.value == null) return a.name.localeCompare(b.name)
        if (a.value == null) return 1
        if (b.value == null) return -1
        return a.value - b.value
      })
  }, [places, metric, coral])

  const canadaShown = data.some((d) => d.country === 'Canada' && !d.isCoral)
  const showCanadaNote = data.some((d) => d.country === 'Canada') && (metric === 'income' || metric === 'commute' || metric === 'education' || metric === 'age')

  const formatVal = (v: number | null | undefined) => {
    if (v == null) return 'not available'
    if (metric === 'population') return formatPopCount(v)
    if (metric === 'growth') return `${v > 0 ? '+' : ''}${formatPopPct(v)}`
    if (metric === 'age') return formatYears(v)
    if (metric === 'income') return formatMoney(v, 'USD')
    if (metric === 'education') return formatPopPct(v)
    return formatMinutes(v)
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: (typeof data)[0] }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 max-w-xs">
        <p className="font-semibold text-sm">{d.name}</p>
        <p className="text-xs text-slate-500">{d.geography}</p>
        <p className="text-xs text-slate-500">{d.country}{d.status !== 'baseline' ? ` · ${STATUS_META[d.status as Status]?.label ?? d.status}` : ' · baseline'}</p>
        <p className="mt-1 text-sm"><b>{formatVal(d.value)}</b></p>
        {metric === 'population' && <p className="text-xs text-slate-500">{d.popPeriod}</p>}
        {metric === 'growth' && <p className="text-xs text-slate-500">{d.growthYears}</p>}
        {metric === 'income' && d.incomeCurrency === 'CAD' && d.incomeLocal != null && (
          <p className="text-xs text-slate-500">{formatMoney(d.incomeLocal, 'CAD')} at the app FX rate</p>
        )}
        {d.country === 'Canada' && (metric === 'income' || metric === 'commute') && (
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">US–Canada comparison is approximate (different years)</p>
        )}
        {!d.isCoral && <p className="mt-2 text-xs text-teal-600 dark:text-teal-400">Click to open the place →</p>}
      </div>
    )
  }

  const coralValue = data.find((d) => d.isCoral)?.value ?? null

  return (
    <section className="card p-4 sm:p-6" data-testid="population-graph">
      <h2 className="text-lg font-bold mb-1">Population &amp; community vs Coral Springs, FL</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {POP_METRICS[metric].label}, compared with Coral Springs
        ({formatVal(coralValue)}
        {metric === 'population' && coral.population.period ? `, ${coral.population.period}` : ''}
        {metric === 'growth' ? `, ${coral.growth.fromYear} to ${coral.growth.toYear}` : ''}
        ). The dashed line is the Coral Springs value. Ottawa and Hamilton figures are for the entire city, not the rural community alone. Latest estimates are 1 July 2025 where published; county subdivisions without a Vintage 2025 estimate use ACS 2020–2024. Checked {POP_CHECKED}.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(POP_METRICS) as PopMetric[]).map((k) => (
          <button
            type="button"
            key={k}
            onClick={() => setMetric(k)}
            aria-pressed={metric === k}
            className={`rounded-full border px-3 py-1 text-sm ${metric === k ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed opacity-60'}`}
          >
            {POP_METRICS[k].label}
          </button>
        ))}
      </div>
      {showCanadaNote && metric === 'income' && (
        <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{INCOME_YEAR_NOTE}</p>
      )}
      {showCanadaNote && metric === 'commute' && (
        <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{COMMUTE_YEAR_NOTE}</p>
      )}
      {data.length === 0 ? (
        <p className="mt-4 text-slate-500">No places match the current filters.</p>
      ) : (
        <div className="mt-4 h-[32rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 80, left: 130, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                type="number"
                domain={metric === 'growth' ? ['auto', 'auto'] : [0, 'auto']}
                tickFormatter={(v) =>
                  metric === 'income' || metric === 'population'
                    ? Number(v).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })
                    : Number(v).toLocaleString('en-US')
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => (v.length > 22 ? v.slice(0, 21) + '…' : v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                cursor="pointer"
                onClick={(d) => {
                  const id = (d as { placeId?: string }).placeId
                  if (id && id !== 'coral-springs') window.location.hash = `/places/${id}`
                }}
              >
                {data.map((entry) => (
                  <Cell key={entry.geography} fill={entry.isCoral ? '#64748b' : '#0d9488'} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => (v == null || v === undefined ? 'n/a' : formatVal(Number(v)))}
                  className="text-xs fill-slate-600 dark:fill-slate-300"
                />
              </Bar>
              {coralValue != null && metric !== 'population' && (
                <ReferenceLine
                  x={coralValue}
                  stroke="#0f172a"
                  strokeDasharray="4 3"
                  label={{ value: 'Coral Springs', position: 'top', fill: '#0f172a', fontSize: 10 }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {canadaShown && metric === 'population' && (
        <p className="mt-2 text-xs text-slate-500">
          Canadian totals are 1 July 2025 Statistics Canada CSD estimates; US totals are Census Bureau Vintage 2025 July 1 estimates, except county subdivisions (Elizabeth CCD, Boise Hills CCD) which use ACS 2020–2024. Years are labelled on each place page.
        </p>
      )}
      <p className="mt-4 text-xs text-slate-500">{POP_METHOD}</p>
    </section>
  )
}
