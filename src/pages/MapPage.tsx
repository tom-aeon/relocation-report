import { useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { OTHER_MEANING, ROUNDS, STATUS_META, STATUS_ORDER, isAliveIn, consideredIn, type Status } from '../data/places'
import { PageHeader } from '../components/ui'
import { CrimeBandLegend } from '../components/CrimeSection'
import { SaferLegend } from '../components/SaferSection'
import { useStore } from '../lib/store'
import {
  CANADA_CSI_2025, CORAL_SPRINGS, CORAL_SPRINGS_COORDS, CRIME_BAND_META, CROSS_BORDER_NOTE,
  SAFER_GROUP_META, bandForPlace, classifySafer, compareRate, crimeFor, formatPct, formatRate, type CrimeBand,
} from '../data/crime'

const ALL: Status[] = STATUS_ORDER
type Layer = 'status' | 'crime' | 'safer'

export default function MapPage() {
  const nav = useNavigate()
  const { activePlaces, rejectedCount } = useStore()
  const [params, setParams] = useSearchParams()
  const round = Number(params.get('round')) || 0
  const statuses = (params.get('s')?.split(',').filter(Boolean) as Status[] | undefined) ?? ALL
  const raw = params.get('layer')
  const layer: Layer = raw === 'safer' ? 'safer' : raw === 'crime' ? 'crime' : 'status'
  const crimeOn = layer === 'crime'
  const saferOn = layer === 'safer'
  const metric = params.get('metric') === 'property' ? 'property' : 'violent'
  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v === null) n.delete(k); else n.set(k, v)
    setParams(n, { replace: true })
  }
  const toggle = (s: Status) => {
    const next = statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s]
    set('s', next.length === ALL.length ? null : next.join(','))
  }
  const shown = useMemo(() => activePlaces.filter((p) => statuses.includes(p.status) && (!round || consideredIn(p, round))), [statuses, round, activePlaces])

  const setLayer = (l: Layer) => set('layer', l === 'status' ? null : l)

  const sub = saferOn
    ? 'Markers are coloured by whether sourced official US violent and property rates are at or below Coral Springs (118.8 / 888.0 per 100k, 2025). Canadian places are a separate approximate group and are never counted as at-or-below. Click a marker to open the place.'
    : crimeOn
      ? `Markers are coloured by ${metric} crime rate compared with Coral Springs, FL (±15% is similar). Click one to open the place. Marker positions are approximate area centres.`
      : 'Markers are coloured by current status. Click one to open the place. Marker positions are approximate area centres.'

  const layerBtn = (id: Layer, testId: string, label: string) => (
    <button
      type="button"
      onClick={() => setLayer(id)}
      aria-pressed={layer === id}
      data-testid={testId}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${layer === id ? 'border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-200' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}
    >
      {label}
    </button>
  )

  const coralTooltip = (
    <Tooltip direction="top" offset={[0, -6]} permanent={false}>
      <b>{CORAL_SPRINGS_COORDS.short}</b><br />
      Current home · comparison baseline<br />
      Violent {formatRate(CORAL_SPRINGS.violent.ratePer100k)} per 100k · Property {formatRate(CORAL_SPRINGS.property.ratePer100k)} per 100k<br />
      Coral Springs Police Department, 2025, FBI CDE
    </Tooltip>
  )

  return (
    <div>
      <PageHeader title="Map of every place" sub={sub} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {ALL.map((s) => (
          <button key={s} onClick={() => toggle(s)} aria-pressed={statuses.includes(s)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${statuses.includes(s) ? 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800' : 'border-dashed border-slate-300 opacity-50 dark:border-slate-700'}`}>
            <span className="h-3 w-3 rounded-full" style={{ background: STATUS_META[s].color }} />{STATUS_META[s].label}
          </button>
        ))}
        <select aria-label="Round filter" className="input ml-auto" value={round} onChange={(e) => set('round', e.target.value === '0' ? null : e.target.value)}>
          <option value={0}>All rounds</option>
          {ROUNDS.map((r) => <option key={r.n} value={r.n}>Round {r.n}: {r.title}</option>)}
        </select>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {layerBtn('status', 'status-layer-toggle', 'Status')}
        {layerBtn('crime', 'crime-layer-toggle', crimeOn ? 'Crime comparison layer on' : 'Crime comparison (±15%)')}
        {layerBtn('safer', 'safer-layer-toggle', 'Safer than Coral Springs')}
        {crimeOn && (
          <>
            <button type="button" onClick={() => set('metric', null)} aria-pressed={metric === 'violent'}
              className={`rounded-full border px-3 py-1 text-sm ${metric === 'violent' ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed border-slate-300 opacity-60'}`}>Violent crime</button>
            <button type="button" onClick={() => set('metric', 'property')} aria-pressed={metric === 'property'}
              className={`rounded-full border px-3 py-1 text-sm ${metric === 'property' ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800' : 'border-dashed border-slate-300 opacity-60'}`}>Property crime</button>
          </>
        )}
      </div>
      {saferOn ? (
        <div className="mb-2 space-y-1">
          <SaferLegend extra={<span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rotate-45 rounded-sm bg-slate-900 ring-2 ring-amber-400 dark:bg-white" />Coral Springs, FL (baseline)</span>} />
          <p className="text-xs text-slate-600 dark:text-slate-400">Green: both sourced US rates at or below Coral Springs (118.8 / 888.0 per 100k, 2025). Amber: only one of the two qualifies. Red: both higher. Blue: Canada (approximate) — different offence definitions, never counted as at-or-below Coral Springs; CSI vs Canada’s 2025 national index of {(CANADA_CSI_2025.value as number).toFixed(2)} is context only. Grey: official rate not available, never included. The full rule is on the <a className="text-teal-700 underline dark:text-teal-400" href="#/">home page</a> and the <a className="text-teal-700 underline dark:text-teal-400" href="#/scorecard">scorecard</a>.</p>
          <p className="text-xs text-amber-800 dark:text-amber-200">{CROSS_BORDER_NOTE}</p>
        </div>
      ) : crimeOn ? (
        <div className="mb-2 space-y-1">
          <CrimeBandLegend extra={<span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rotate-45 rounded-sm bg-slate-900 ring-2 ring-amber-400 dark:bg-white" />Coral Springs, FL (baseline)</span>} />
          <p className="text-xs text-amber-800 dark:text-amber-200">{CROSS_BORDER_NOTE}</p>
        </div>
      ) : (
        <p className="mb-2 text-xs text-slate-500"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META.other.color }} />{OTHER_MEANING}</p>
      )}
      {round > 0 && <p className="mb-2 text-sm text-slate-500">Round {round}: solid markers were still alive after the round; hollow markers were considered and cut in it.</p>}
      <div className="card h-[65vh] min-h-[420px] overflow-hidden" data-testid="places-map">
        <MapContainer center={(crimeOn || saferOn) ? [42, -90] : [42, -98]} zoom={4} scrollWheelZoom className="h-full w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {(crimeOn || saferOn) && (
            <CircleMarker
              center={[CORAL_SPRINGS_COORDS.lat, CORAL_SPRINGS_COORDS.lng]}
              radius={11}
              pathOptions={{ color: '#fbbf24', weight: 3, fillColor: '#0f172a', fillOpacity: 1 }}
            >
              {coralTooltip}
            </CircleMarker>
          )}
          {shown.map((p) => {
            const alive = !round || isAliveIn(p, round)
            const major = !p.minor
            const crime = crimeFor(p.id)
            const safer = classifySafer(crime)
            const band: CrimeBand = crimeOn ? bandForPlace(crime, metric) : 'no-data'
            const fill = saferOn
              ? SAFER_GROUP_META[safer.group].color
              : crimeOn
                ? CRIME_BAND_META[band].color
                : STATUS_META[p.status].color
            const cmp = crime ? compareRate(crime[metric].ratePer100k, CORAL_SPRINGS[metric].ratePer100k) : null
            return (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={major ? 10 : 6}
                pathOptions={{ color: '#fff', weight: 2, fillColor: fill, fillOpacity: alive ? 0.95 : 0.25 }}
                eventHandlers={{ click: () => nav(`/places/${p.id}`) }}>
                <Tooltip direction="top" offset={[0, -6]}>
                  <b>{p.short}</b><br />
                  {p.statusLabel}{p.minor ? ' · cut-list only' : ''}
                  {crimeOn && (
                    <>
                      <br />
                      {crime && crime[metric].ratePer100k != null
                        ? `${metric === 'violent' ? 'Violent' : 'Property'} ${formatRate(crime[metric].ratePer100k)} per 100k · ${formatPct(cmp!.pct)}`
                        : 'Crime data not available'}
                      {crime && <><br /><span style={{ fontSize: 11 }}>{crime[metric].agency}, {crime[metric].year}</span></>}
                      {p.country === 'Canada' && <><br /><span style={{ fontSize: 11 }}>US–Canada comparison is approximate</span></>}
                    </>
                  )}
                  {saferOn && (
                    <>
                      <br />
                      <span style={{ fontWeight: 600 }}>{SAFER_GROUP_META[safer.group].short}</span>
                      {safer.group === 'canada' ? (
                        <>
                          <br />
                          {safer.csi != null
                            ? `Crime Severity Index ${safer.csi.toFixed(2)} vs Canada ${(CANADA_CSI_2025.value as number).toFixed(2)} (${safer.csiAtOrBelowNational ? 'at or below' : 'above'} the national index) — context only. Not counted as at-or-below Coral Springs.`
                            : 'Crime Severity Index not available. Not counted as at-or-below Coral Springs.'}
                        </>
                      ) : safer.group === 'unverified' ? (
                        <><br />Official violent or property rate not available. Never included in the at-or-below lists.</>
                      ) : (
                        <>
                          <br />
                          Violent {formatRate(safer.violent)} per 100k ({safer.violentAtOrBelow ? 'at or below' : 'above'}) · Property {formatRate(safer.property)} per 100k ({safer.propertyAtOrBelow ? 'at or below' : 'above'})
                          {safer.agency && <>
                            <br /><span style={{ fontSize: 11 }}>{safer.agency}, {safer.year}</span>
                          </>}
                        </>
                      )}
                    </>
                  )}
                </Tooltip>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {shown.filter((p) => !p.minor).map((p) => {
          const crime = crimeFor(p.id)
          const safer = classifySafer(crime)
          const band = crimeOn ? bandForPlace(crime, metric) : null
          const color = saferOn
            ? SAFER_GROUP_META[safer.group].color
            : crimeOn
              ? CRIME_BAND_META[band!].color
              : STATUS_META[p.status].color
          return (
            <Link key={p.id} to={`/places/${p.id}`} className="flex items-center gap-2 hover:underline">
              <span className="h-3 w-3 rounded-full" style={{ background: color }} />{p.short}
              {crimeOn && band && <span className="text-xs text-slate-500">· {CRIME_BAND_META[band].short}</span>}
              {saferOn && <span className="text-xs text-slate-500">· {SAFER_GROUP_META[safer.group].short}</span>}
            </Link>
          )
        })}
        {(crimeOn || saferOn) && (
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="h-3 w-3 rotate-45 rounded-sm bg-slate-900 ring-2 ring-amber-400 dark:bg-white" />Coral Springs, FL (baseline)
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {shown.length} markers shown ({shown.filter((p) => p.minor).length} small markers are places only named in a round's cut list).
        {(crimeOn || saferOn) && <> Coral Springs is the comparison baseline, not a candidate.</>}
        {rejectedCount > 0 && <> · {rejectedCount} personally rejected place{rejectedCount === 1 ? '' : 's'} excluded. <Link to="/places?rejected=1" className="text-teal-700 underline dark:text-teal-400">View rejected →</Link></>}
      </p>
    </div>
  )
}
