import { useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { OTHER_MEANING, PLACES, ROUNDS, STATUS_META, isAliveIn, consideredIn, type Status } from '../data/places'
import { PageHeader } from '../components/ui'

const ALL: Status[] = ['best', 'live', 'parked', 'stretch', 'near-miss', 'dropped', 'other']

export default function MapPage() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const round = Number(params.get('round')) || 0
  const statuses = (params.get('s')?.split(',').filter(Boolean) as Status[] | undefined) ?? ALL
  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v === null) n.delete(k); else n.set(k, v)
    setParams(n, { replace: true })
  }
  const toggle = (s: Status) => {
    const next = statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s]
    set('s', next.length === ALL.length ? null : next.join(','))
  }
  const shown = useMemo(() => PLACES.filter((p) => statuses.includes(p.status) && (!round || consideredIn(p, round))), [statuses, round])

  return (
    <div>
      <PageHeader title="Map of every place" sub="Markers are coloured by current status. Click one to open the place. Marker positions are approximate area centres." />
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
      <p className="mb-2 text-xs text-slate-500"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META.other.color }} />{OTHER_MEANING}</p>
      {round > 0 && <p className="mb-2 text-sm text-slate-500">Round {round}: solid markers were still alive after the round; hollow markers were considered and cut in it.</p>}
      <div className="card h-[65vh] min-h-[420px] overflow-hidden">
        <MapContainer center={[42, -98]} zoom={4} scrollWheelZoom className="h-full w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {shown.map((p) => {
            const alive = !round || isAliveIn(p, round)
            const major = !p.minor
            return (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={major ? 10 : 6}
                pathOptions={{ color: '#fff', weight: 2, fillColor: STATUS_META[p.status].color, fillOpacity: alive ? 0.95 : 0.25 }}
                eventHandlers={{ click: () => nav(`/places/${p.id}`) }}>
                <Tooltip direction="top" offset={[0, -6]}>
                  <b>{p.short}</b><br />{p.statusLabel}{p.minor ? ' · cut-list only' : ''}
                </Tooltip>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {shown.filter((p) => !p.minor).map((p) => (
          <Link key={p.id} to={`/places/${p.id}`} className="flex items-center gap-2 hover:underline">
            <span className="h-3 w-3 rounded-full" style={{ background: STATUS_META[p.status].color }} />{p.short}
          </Link>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">{shown.length} markers shown ({shown.filter((p) => p.minor).length} small markers are places only named in a round’s cut list).</p>
    </div>
  )
}
