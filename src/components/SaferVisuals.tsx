import { useEffect, useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as MapTooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  CANADA_CSI_2025, CORAL_PROPERTY_RATE, CORAL_SPRINGS, CORAL_SPRINGS_COORDS, CORAL_VIOLENT_RATE,
  LOWCRIME_MORE, SAFER_GROUP_META, crimeFor, formatRate,
  type SaferGroup, type SaferResult,
} from '../data/crime'
import { qualifyingHomes } from '../data/homes'
import { NO_QUALIFYING_HOMES } from '../data/homesTypes'
import type { Place } from '../data/places'
import { useStore } from '../lib/store'

type Groups = Record<SaferGroup, { place: Place; safer: SaferResult }[]>
type Mode = 'violent' | 'property' | 'both'

const FBI_SHORT = 'FBI Crime Data Explorer, 2025, 12 of 12 months (refreshed 15 Oct 2026)'
const CSI_SHORT = 'Statistics Canada, Crime Severity Index, 2025 (The Daily, 22 Jul 2026). Approximate — not comparable to US rates.'
const LONG_TAIL_LABEL = 'no qualifying home yet'
const SAFER_GREEN = SAFER_GROUP_META.safer.color
const ONE_AMBER = SAFER_GROUP_META['one-sided'].color
const CANADA_BLUE = SAFER_GROUP_META.canada.color
const PROPERTY_SAFER = '#86efac'
const PROPERTY_ONE = '#fcd34d'
const PROPERTY_TAIL_STROKE = '#166534'

const TOGGLE_BTN = (on: boolean) =>
  `rounded-full border px-3 py-1 text-sm ${on ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed opacity-60'}`

interface ChartRow {
  key: string
  name: string
  fullName: string
  violent: number
  property: number
  group: 'safer' | 'one-sided'
  kind: 'place' | 'long-tail'
  agency: string
  year: number
  coverage?: string
  source: string
  sourceUrl: string
  placeId?: string
  homeCount: number | null
  noHome: boolean
  reportedZero?: boolean
  zeroNote?: string
}

interface CsiRow {
  key: string
  name: string
  csi: number
  atOrBelow: boolean | null
  agency: string
  year: number
  source: string
  sourceUrl: string
  placeId: string
  homeCount: number
}

function homeLine(row: { kind?: string; homeCount: number | null; noHome?: boolean }): string {
  if (row.kind === 'long-tail' || row.homeCount == null) return LONG_TAIL_LABEL
  if (row.homeCount === 0) return NO_QUALIFYING_HOMES
  return `${row.homeCount} qualifying 4/3 home${row.homeCount === 1 ? '' : 's'}`
}

function buildRows(groups: Groups): ChartRow[] {
  const rows: ChartRow[] = []
  for (const g of ['safer', 'one-sided'] as const) {
    for (const { place, safer } of groups[g]) {
      if (safer.violent == null || safer.property == null) continue
      const crime = crimeFor(place.id)
      const homes = qualifyingHomes(place.id)
      rows.push({
        key: place.id,
        name: place.short,
        fullName: place.name,
        violent: safer.violent,
        property: safer.property,
        group: g,
        kind: 'place',
        agency: safer.agency ?? crime?.violent.agency ?? '',
        year: safer.year ?? crime?.violent.year ?? 2025,
        coverage: crime?.violent.coverage,
        source: FBI_SHORT,
        sourceUrl: crime?.violent.sourceUrl ?? '',
        placeId: place.id,
        homeCount: homes.length,
        noHome: homes.length === 0,
        reportedZero: crime?.violent.reportedZero,
        zeroNote: crime?.violent.reportedZero ? crime.violent.note : undefined,
      })
    }
  }
  for (const area of LOWCRIME_MORE) {
    const v = area.violent.ratePer100k
    const p = area.property.ratePer100k
    if (v == null || p == null) continue
    rows.push({
      key: `lt-${area.name}`,
      name: area.name,
      fullName: `${area.name} — ${area.covers}`,
      violent: v,
      property: p,
      group: 'safer',
      kind: 'long-tail',
      agency: area.violent.agency,
      year: area.violent.year,
      coverage: area.violent.coverage,
      source: FBI_SHORT,
      sourceUrl: area.violent.sourceUrl,
      homeCount: null,
      noHome: true,
      reportedZero: area.violent.reportedZero,
      zeroNote: area.violent.reportedZero ? area.violent.note : undefined,
    })
  }
  rows.sort((a, b) => a.violent - b.violent || a.name.localeCompare(b.name))
  return rows
}

function buildCsi(groups: Groups): CsiRow[] {
  return groups.canada
    .filter((r) => r.safer.csi != null)
    .map(({ place, safer }) => {
      const crime = crimeFor(place.id)
      return {
        key: place.id,
        name: place.short,
        csi: safer.csi as number,
        atOrBelow: safer.csiAtOrBelowNational,
        agency: crime?.csi?.agency ?? safer.agency ?? '',
        year: crime?.csi?.year ?? 2025,
        source: CSI_SHORT,
        sourceUrl: crime?.csi?.sourceUrl ?? '',
        placeId: place.id,
        homeCount: qualifyingHomes(place.id).length,
      }
    })
    .sort((a, b) => a.csi - b.csi || a.name.localeCompare(b.name))
}

function fitLabel(s: string, max: number): string {
  return s.length > max ? s.slice(0, Math.max(1, max - 1)) + '…' : s
}

function splitLabel(s: string, max = 23): string[] {
  let lines: string[]
  if (s.length <= max) lines = [s]
  else {
    const slash = s.indexOf(' / ')
    if (slash > 0 && slash <= max + 3) lines = [s.slice(0, slash), s.slice(slash + 3)]
    else {
      const comma = s.lastIndexOf(', ')
      if (comma > 8 && s.length - comma < 8) lines = [s.slice(0, comma), s.slice(comma + 2)]
      else {
        const sp = s.lastIndexOf(' ', max)
        lines = sp > 8 ? [s.slice(0, sp), s.slice(sp + 1)] : [s]
      }
    }
  }
  return lines.map((ln) => fitLabel(ln, max))
}

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = () => setNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

function AxisTick({
  x, y, payload, rows, fill, max,
}: {
  x?: string | number
  y?: string | number
  payload?: { value?: string }
  rows: Map<string, ChartRow>
  fill: string
  max?: number
}) {
  const name = payload?.value ?? ''
  const row = rows.get(name)
  const lines = splitLabel(name, max ?? 23)
  const sub = row?.kind === 'long-tail' ? LONG_TAIL_LABEL : row?.noHome ? 'no 4/3 home yet' : null
  const all = sub ? [...lines, 'SUB'] : lines
  // Centre the block on the tick.
  const startDy = -((all.length - 1) * 0.55) + 0.35
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text textAnchor="end" fontSize={11} fill={fill}>
        {lines.map((ln, i) => (
          <tspan key={ln} x={-6} dy={`${i === 0 ? startDy : 1.1}em`}>{ln}</tspan>
        ))}
        {sub && (
          <tspan x={-6} dy="1.15em" fontSize={9} fill="#64748b">{sub}</tspan>
        )}
      </text>
    </g>
  )
}

function CsiTick({
  x, y, payload, fill, max,
}: {
  x?: string | number
  y?: string | number
  payload?: { value?: string }
  fill: string
  max?: number
}) {
  const lines = splitLabel(payload?.value ?? '', max ?? 23)
  const startDy = -((lines.length - 1) * 0.55) + 0.35
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text textAnchor="end" fontSize={11} fill={fill}>
        {lines.map((ln, i) => (
          <tspan key={ln} x={-6} dy={`${i === 0 ? startDy : 1.1}em`}>{ln}</tspan>
        ))}
      </text>
    </g>
  )
}

function RateTooltip({
  active, payload,
}: {
  active?: boolean
  payload?: { payload?: ChartRow; dataKey?: string; value?: number; color?: string; name?: string }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  if (!row) return null
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-md dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
      <div className="font-semibold">{row.fullName}</div>
      {row.kind === 'long-tail' && (
        <div className="text-slate-500 dark:text-slate-400">Long-tail area · {LONG_TAIL_LABEL}</div>
      )}
      {row.group === 'one-sided' && (
        <div className="text-amber-700 dark:text-amber-300">One of two rates at or below Coral Springs</div>
      )}
      {payload.map((p) => (
        <div key={String(p.dataKey)} style={{ color: p.color }}>
          {p.dataKey === 'violent' ? 'Violent' : 'Property'}: {formatRate(typeof p.value === 'number' ? p.value : null)} per 100k
        </div>
      ))}
      {row.zeroNote && <div className="mt-1 text-slate-600 dark:text-slate-300">{row.zeroNote}</div>}
      <div className="mt-1 text-slate-500 dark:text-slate-400">
        {row.agency}, {row.year}{row.coverage ? ` · ${row.coverage}` : ''}
      </div>
      <div className="text-slate-500 dark:text-slate-400">{row.source}</div>
      <div className="mt-1">{homeLine(row)}</div>
      {row.placeId && <div className="text-slate-400">Click the bar to open the place page</div>}
    </div>
  )
}

function CsiTooltip({
  active, payload,
}: {
  active?: boolean
  payload?: { payload?: CsiRow; value?: number }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  if (!row) return null
  const national = CANADA_CSI_2025.value as number
  const vs = row.atOrBelow ? 'at or below' : 'above'
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-md dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
      <div className="font-semibold">{row.name}</div>
      <div>Crime Severity Index {row.csi.toFixed(2)} — {vs} Canada’s 2025 national {national.toFixed(2)}</div>
      <div className="mt-1 text-slate-500 dark:text-slate-400">{row.agency}, {row.year}</div>
      <div className="text-slate-500 dark:text-slate-400">{row.source}</div>
      <div className="mt-1">{homeLine({ homeCount: row.homeCount })}</div>
    </div>
  )
}

function barFill(row: ChartRow, metric: 'violent' | 'property', hollow: boolean): string {
  if (hollow) return 'transparent'
  if (row.group === 'one-sided') return metric === 'violent' ? ONE_AMBER : PROPERTY_ONE
  return metric === 'violent' ? SAFER_GREEN : PROPERTY_SAFER
}

function barStroke(row: ChartRow, metric: 'violent' | 'property'): string {
  if (row.kind !== 'long-tail') return 'none'
  return metric === 'violent' ? SAFER_GREEN : PROPERTY_TAIL_STROKE
}

function niceMax(n: number): number {
  if (n <= 0) return 1
  const pad = n * 1.05
  const pow = 10 ** Math.floor(Math.log10(pad))
  const frac = pad / pow
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10
  return nice * pow
}

function openPlace(id?: string) {
  if (id) window.location.hash = `/places/${id}`
}

function placeIdFromBar(d: unknown): string | undefined {
  if (!d || typeof d !== 'object') return undefined
  const o = d as Record<string, unknown>
  if (typeof o.placeId === 'string') return o.placeId
  const payload = o.payload
  if (payload && typeof payload === 'object') {
    const id = (payload as Record<string, unknown>).placeId
    if (typeof id === 'string') return id
  }
  return undefined
}

function SaferChart({ rows }: { rows: ChartRow[] }) {
  const [mode, setMode] = useState<Mode>('both')
  const { theme } = useStore()
  const narrow = useNarrow()
  const tickFill = theme === 'dark' ? '#e2e8f0' : '#0f172a'
  const refFill = theme === 'dark' ? '#cbd5e1' : '#334155'
  const byName = useMemo(() => new Map(rows.map((r) => [r.name, r])), [rows])
  const axisWidth = narrow ? 108 : 172
  const labelMax = narrow ? 16 : 23
  const showV = mode === 'violent' || mode === 'both'
  const showP = mode === 'property' || mode === 'both'
  const values: number[] = []
  if (showV) {
    values.push(CORAL_VIOLENT_RATE, ...rows.map((r) => r.violent))
  }
  if (showP) {
    values.push(CORAL_PROPERTY_RATE, ...rows.map((r) => r.property))
  }
  const xMax = niceMax(Math.max(0, ...values))
  const wrapped = rows.some((r) => splitLabel(r.name, labelMax).length > 1 || r.noHome)
  const rowH = (mode === 'both' ? 40 : 30) + (wrapped ? 16 : 0)
  const height = Math.max(320, rows.length * rowH + 48)

  return (
    <div data-testid="safer-chart">
      <h3 className="font-semibold">Violent and property crime per 100,000</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Grouped rates for every US place in this section, the one-sided tier, and the long-tail areas
        (hollow bars, labelled “{LONG_TAIL_LABEL}”). Sorted by violent rate, lowest at the top.
        Dashed lines are Coral Springs Police Department, 2025: violent {formatRate(CORAL_VIOLENT_RATE)} and
        property {formatRate(CORAL_PROPERTY_RATE)}. Canada is on a separate CSI chart below — offence definitions differ,
        so Canadian places are never on this US-rate chart.
      </p>
      <div className="mb-3 mt-3 flex flex-wrap gap-2" data-testid="safer-chart-toggle" role="group" aria-label="Crime metric">
        {([
          ['violent', 'Violent'],
          ['property', 'Property'],
          ['both', 'Both'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            aria-pressed={mode === id}
            className={TOGGLE_BTN(mode === id)}
          >
            {label}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">No US places to chart. Long-tail areas still appear unless this list is empty.</p>
      ) : (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 22, right: narrow ? 18 : 20, left: 2, bottom: 8 }}
              barCategoryGap={mode === 'both' ? '18%' : '22%'}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis type="number" domain={[0, xMax]} tick={{ fontSize: 10, fill: tickFill }} />
              <YAxis
                type="category"
                dataKey="name"
                width={axisWidth}
                interval={0}
                tick={(props) => <AxisTick {...props} rows={byName} fill={tickFill} max={labelMax} />}
              />
              <Tooltip content={<RateTooltip />} cursor={{ fill: 'rgba(148,163,184,0.12)' }} />
              {showV && (
                <Bar
                  dataKey="violent"
                  name="Violent"
                  barSize={mode === 'both' ? 10 : 12}
                  radius={[0, 3, 3, 0]}
                  isAnimationActive={false}
                  cursor="pointer"
                  onClick={(d) => openPlace(placeIdFromBar(d))}
                >
                  {rows.map((r) => (
                    <Cell
                      key={`v-${r.key}`}
                      fill={barFill(r, 'violent', r.kind === 'long-tail')}
                      stroke={barStroke(r, 'violent')}
                      strokeWidth={r.kind === 'long-tail' ? 2 : 0}
                      cursor={r.placeId ? 'pointer' : 'default'}
                    />
                  ))}
                </Bar>
              )}
              {showP && (
                <Bar
                  dataKey="property"
                  name="Property"
                  barSize={mode === 'both' ? 10 : 12}
                  radius={[0, 3, 3, 0]}
                  isAnimationActive={false}
                  cursor="pointer"
                  onClick={(d) => openPlace(placeIdFromBar(d))}
                >
                  {rows.map((r) => (
                    <Cell
                      key={`p-${r.key}`}
                      fill={barFill(r, 'property', r.kind === 'long-tail')}
                      stroke={barStroke(r, 'property')}
                      strokeWidth={r.kind === 'long-tail' ? 2 : 0}
                      cursor={r.placeId ? 'pointer' : 'default'}
                    />
                  ))}
                </Bar>
              )}
              {showV && (
                <ReferenceLine
                  x={CORAL_VIOLENT_RATE}
                  stroke={refFill}
                  strokeDasharray="5 3"
                  label={{ value: narrow ? '118.8' : `Coral Springs ${formatRate(CORAL_VIOLENT_RATE)}`, position: 'top', fill: refFill, fontSize: 10 }}
                />
              )}
              {showP && (
                <ReferenceLine
                  x={CORAL_PROPERTY_RATE}
                  stroke={refFill}
                  strokeDasharray="2 3"
                  label={{ value: narrow ? '888' : `Coral Springs ${formatRate(CORAL_PROPERTY_RATE)}`, position: 'insideTopLeft', fill: refFill, fontSize: 10 }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        <li className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: SAFER_GREEN }} />Violent (at or below)</li>
        <li className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: PROPERTY_SAFER }} />Property (at or below)</li>
        <li className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: ONE_AMBER }} />Violent (one of two)</li>
        <li className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: PROPERTY_ONE }} />Property (one of two)</li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm bg-transparent" style={{ boxShadow: `inset 0 0 0 2px ${SAFER_GREEN}` }} />
          Long-tail, {LONG_TAIL_LABEL}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block w-5 border-t-2 border-dashed border-slate-500" />
          Coral Springs baseline
        </li>
      </ul>
    </div>
  )
}

function CsiChart({ rows }: { rows: CsiRow[] }) {
  const { theme } = useStore()
  const narrow = useNarrow()
  const tickFill = theme === 'dark' ? '#e2e8f0' : '#0f172a'
  const refFill = theme === 'dark' ? '#cbd5e1' : '#334155'
  const national = CANADA_CSI_2025.value as number
  const xMax = niceMax(Math.max(national, ...rows.map((r) => r.csi)))
  const height = Math.max(240, rows.length * 36 + 44)
  const axisWidth = narrow ? 108 : 172
  const labelMax = narrow ? 16 : 23
  if (rows.length === 0) return null
  return (
    <div data-testid="safer-csi-chart">
      <h3 className="font-semibold">Canada (approximate) — Crime Severity Index</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Canadian offence definitions differ from the FBI’s, so these places are never counted as at-or-below Coral Springs
        and are not on the US-rate chart. The dashed line is Canada’s 2025 national CSI of {national.toFixed(2)}. Context only.
      </p>
      <div style={{ height }} className="mt-2 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 22, right: narrow ? 18 : 20, left: 2, bottom: 8 }} barCategoryGap="22%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis type="number" domain={[0, xMax]} tick={{ fontSize: 10, fill: tickFill }} />
            <YAxis
              type="category"
              dataKey="name"
              width={axisWidth}
              interval={0}
              tick={(props) => <CsiTick {...props} fill={tickFill} max={labelMax} />}
            />
            <Tooltip content={<CsiTooltip />} cursor={{ fill: 'rgba(148,163,184,0.12)' }} />
            <Bar
              dataKey="csi"
              name="CSI"
              fill={CANADA_BLUE}
              barSize={12}
              radius={[0, 3, 3, 0]}
              isAnimationActive={false}
              cursor="pointer"
              onClick={(d) => openPlace(placeIdFromBar(d))}
            />
            <ReferenceLine
              x={national}
              stroke={refFill}
              strokeDasharray="5 3"
              label={{ value: `Canada ${national.toFixed(2)}`, position: 'top', fill: refFill, fontSize: 10 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type MapPoint =
  | {
      key: string
      kind: 'safer' | 'one-sided'
      name: string
      fullName: string
      lat: number
      lng: number
      violent: number
      property: number
      agency: string
      year: number
      coverage?: string
      source: string
      sourceUrl: string
      placeId: string
      homeCount: number
      reportedZero?: boolean
      zeroNote?: string
    }
  | {
      key: string
      kind: 'long-tail'
      name: string
      fullName: string
      lat: number
      lng: number
      violent: number
      property: number
      agency: string
      year: number
      coverage?: string
      source: string
      sourceUrl: string
      placeId?: undefined
      homeCount: null
      coordNote: string
      reportedZero?: boolean
      zeroNote?: string
    }

function FitAndResize({ positions, sig }: { positions: [number, number][]; sig: string }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    const fit = () => map.fitBounds(bounds, { padding: [32, 32], maxZoom: 6 })
    fit()
    const el = map.getContainer()
    const ro = new ResizeObserver(() => {
      map.invalidateSize()
      fit()
    })
    ro.observe(el)
    const t = window.setTimeout(() => {
      map.invalidateSize()
      fit()
    }, 120)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
    }
    // positions is rebuilt each render; sig is the stable identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, sig])
  return null
}

function pointPath(p: MapPoint): { radius: number; pathOptions: L.PathOptions } {
  if (p.kind === 'long-tail') {
    return {
      radius: 9,
      pathOptions: { color: SAFER_GREEN, weight: 2.5, fillColor: SAFER_GREEN, fillOpacity: 0, dashArray: '4 3' },
    }
  }
  const hasHome = p.homeCount > 0
  if (p.kind === 'safer') {
    return {
      radius: hasHome ? 11 : 7,
      pathOptions: {
        color: hasHome ? '#14532d' : '#fff',
        weight: hasHome ? 3 : 2,
        fillColor: SAFER_GREEN,
        fillOpacity: 0.95,
      },
    }
  }
  return {
    radius: hasHome ? 10 : 8,
    pathOptions: { color: '#fff', weight: 2, fillColor: ONE_AMBER, fillOpacity: 0.95 },
  }
}

function PointPopup({ p }: { p: MapPoint }) {
  return (
    <Popup>
      <div className="text-sm leading-snug">
        <div className="font-semibold">{p.name}</div>
        {p.kind === 'long-tail' && <div className="text-xs text-slate-600">{LONG_TAIL_LABEL}</div>}
        {p.kind === 'one-sided' && <div className="text-xs text-amber-800">One of two rates at or below Coral Springs</div>}
        {p.kind === 'safer' && <div className="text-xs text-emerald-800">Both rates at or below Coral Springs</div>}
        <div className="mt-1">
          Violent {formatRate(p.violent)} · Property {formatRate(p.property)} per 100k
        </div>
        <div className="text-xs text-slate-600">
          {p.agency}, {p.year}{p.coverage ? ` · ${p.coverage}` : ''}
        </div>
        <div className="text-xs text-slate-600">{p.source}</div>
        {p.zeroNote && <div className="mt-1 text-xs">{p.zeroNote}</div>}
        <div className="mt-1">{homeLine(p)}</div>
        {p.kind === 'long-tail' && (
          <div className="text-xs text-slate-500">{p.coordNote}</div>
        )}
        <div className="mt-1">
          {p.placeId ? (
            <a href={`#/places/${p.placeId}`} className="text-teal-700 underline">Open place page →</a>
          ) : (
            <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="text-teal-700 underline">FBI CDE source →</a>
          )}
        </div>
      </div>
    </Popup>
  )
}

function SaferMiniMap({ points, mapKey }: { points: MapPoint[]; mapKey: string }) {
  const positions: [number, number][] = [
    ...points.map((p) => [p.lat, p.lng] as [number, number]),
    [CORAL_SPRINGS_COORDS.lat, CORAL_SPRINGS_COORDS.lng],
  ]
  const sig = `${mapKey}|${points.map((p) => p.key).join(',')}|coral`

  return (
    <div data-testid="safer-embedded-map">
      <h3 className="font-semibold">Where they are</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Green markers are US places at or below Coral Springs on both rates — larger with a dark ring when a qualifying 4/3 home
        was found, smaller when none has been yet. Amber is the one-sided tier. Hollow green markers are long-tail areas at
        their county or township administrative centre, labelled “{LONG_TAIL_LABEL}”. The gold-ringed marker is the Coral Springs baseline.
        Scroll-wheel zoom is off so the page can scroll; use the +/- buttons or drag. Positions are approximate.
      </p>
      <div className="relative mt-3 h-64 w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 sm:h-96 lg:h-[28rem] dark:border-slate-700">
        <MapContainer
          key={sig}
          center={[39, -90]}
          zoom={4}
          scrollWheelZoom={false}
          className="h-full w-full"
          attributionControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitAndResize positions={positions} sig={sig} />
          <CircleMarker
            center={[CORAL_SPRINGS_COORDS.lat, CORAL_SPRINGS_COORDS.lng]}
            radius={8}
            pathOptions={{ color: '#fbbf24', weight: 3, fillColor: '#0f172a', fillOpacity: 1 }}
          >
            <MapTooltip direction="top" offset={[0, -6]}>{CORAL_SPRINGS_COORDS.short}</MapTooltip>
            <Popup>
              <div className="text-sm leading-snug">
                <div className="font-semibold">{CORAL_SPRINGS_COORDS.name}</div>
                <div className="text-xs text-slate-600">Comparison baseline, not a candidate</div>
                <div className="mt-1">
                  Violent {formatRate(CORAL_SPRINGS.violent.ratePer100k)} · Property {formatRate(CORAL_SPRINGS.property.ratePer100k)} per 100k
                </div>
                <div className="text-xs text-slate-600">
                  Coral Springs Police Department, {CORAL_SPRINGS.violent.year}, {FBI_SHORT}
                </div>
              </div>
            </Popup>
          </CircleMarker>
          {points.map((p) => {
            const { radius, pathOptions } = pointPath(p)
            return (
              <CircleMarker key={p.key} center={[p.lat, p.lng]} radius={radius} pathOptions={pathOptions}>
                <MapTooltip direction="top" offset={[0, -6]}>
                  {p.name}{p.kind === 'long-tail' ? ` · ${LONG_TAIL_LABEL}` : ''}
                </MapTooltip>
                <PointPopup p={p} />
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400" data-testid="safer-map-legend">
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ background: SAFER_GREEN, boxShadow: '0 0 0 3px #14532d' }} />
          At or below, with a qualifying 4/3 home
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: SAFER_GREEN }} />
          At or below, no qualifying 4/3 home yet
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-transparent" style={{ boxShadow: `inset 0 0 0 2px ${SAFER_GREEN}` }} />
          Long-tail area, {LONG_TAIL_LABEL}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: ONE_AMBER }} />
          One of two rates
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rotate-45 rounded-sm bg-slate-900 ring-2 ring-amber-400 dark:bg-white" />
          Coral Springs, FL (baseline)
        </li>
      </ul>
    </div>
  )
}

export default function SaferVisuals({ groups }: { groups: Groups }) {
  const rows = useMemo(() => buildRows(groups), [groups])
  const csi = useMemo(() => buildCsi(groups), [groups])
  const points = useMemo<MapPoint[]>(() => {
    const out: MapPoint[] = []
    for (const g of ['safer', 'one-sided'] as const) {
      for (const { place, safer } of groups[g]) {
        if (safer.violent == null || safer.property == null) continue
        const crime = crimeFor(place.id)
        const homes = qualifyingHomes(place.id)
        out.push({
          key: place.id,
          kind: g,
          name: place.short,
          fullName: place.name,
          lat: place.lat,
          lng: place.lng,
          violent: safer.violent,
          property: safer.property,
          agency: safer.agency ?? crime?.violent.agency ?? '',
          year: safer.year ?? crime?.violent.year ?? 2025,
          coverage: crime?.violent.coverage,
          source: FBI_SHORT,
          sourceUrl: crime?.violent.sourceUrl ?? '',
          placeId: place.id,
          homeCount: homes.length,
          reportedZero: crime?.violent.reportedZero,
          zeroNote: crime?.violent.reportedZero ? crime.violent.note : undefined,
        })
      }
    }
    for (const area of LOWCRIME_MORE) {
      const v = area.violent.ratePer100k
      const p = area.property.ratePer100k
      if (v == null || p == null) continue
      out.push({
        key: `lt-${area.name}`,
        kind: 'long-tail',
        name: area.name,
        fullName: area.covers,
        lat: area.lat,
        lng: area.lng,
        violent: v,
        property: p,
        agency: area.violent.agency,
        year: area.violent.year,
        coverage: area.violent.coverage,
        source: FBI_SHORT,
        sourceUrl: area.violent.sourceUrl,
        homeCount: null,
        coordNote: area.coordNote,
        reportedZero: area.violent.reportedZero,
        zeroNote: area.violent.reportedZero ? area.violent.note : undefined,
      })
    }
    return out
  }, [groups])

  const mapKey = [
    ...groups.safer.map((r) => r.place.id),
    ...groups['one-sided'].map((r) => r.place.id),
  ].join('|')

  return (
    <div className="space-y-8" data-testid="safer-graph-map">
      <SaferChart rows={rows} />
      <CsiChart rows={csi} />
      <SaferMiniMap points={points} mapKey={mapKey} />
    </div>
  )
}

