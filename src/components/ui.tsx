import { Link } from 'react-router-dom'
import { STATUS_META, type Mark, type Place, type Score, type Status } from '../data/places'
import { useStore } from '../lib/store'

export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const m = STATUS_META[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.badge}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
      {label ?? m.label}
    </span>
  )
}

const MARK_STYLE: Record<Mark, { sym: string; cls: string; label: string }> = {
  pass: { sym: '✓', cls: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300', label: 'Pass' },
  partial: { sym: '~', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300', label: 'Partial / with caveats' },
  fail: { sym: '✗', cls: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300', label: 'Fail' },
  unknown: { sym: '·', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400', label: 'Not checked yet' },
}

export function MarkDot({ score, size = 'md' }: { score?: Score; size?: 'sm' | 'md' }) {
  const mark: Mark = score?.mark ?? 'unknown'
  const s = MARK_STYLE[mark]
  const title = `${s.label}${score?.source === 'derived' ? ' (derived from report text)' : ''}${score?.note ? ` — ${score.note}` : ''}`
  return (
    <span title={title} aria-label={title}
      className={`relative inline-grid place-items-center rounded-full font-extrabold ${s.cls} ${size === 'sm' ? 'h-6 w-6 text-xs' : 'h-7 w-7 text-sm'}`}>
      {s.sym}
      {score?.source === 'derived' && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />}
    </span>
  )
}

export function MarkLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
      {(['pass', 'partial', 'fail', 'unknown'] as Mark[]).map((m) => (
        <span key={m} className="flex items-center gap-1.5"><MarkDot score={m === 'unknown' ? undefined : { mark: m, source: 'table' }} size="sm" />{MARK_STYLE[m].label}</span>
      ))}
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" />Derived from the report’s text (not its table)</span>
    </div>
  )
}

export function NotChecked({ text = 'not checked yet' }: { text?: string }) {
  return <span className="italic text-slate-400 dark:text-slate-500">{text}</span>
}

export function FavButton({ id, className = '' }: { id: string; className?: string }) {
  const { saved, toggleFav } = useStore()
  const on = saved.favorites.includes(id)
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(id) }}
      aria-pressed={on} aria-label={on ? 'Remove from favorites' : 'Add to favorites'} title={on ? 'Remove from favorites' : 'Add to favorites'}
      className={`rounded-full p-1.5 text-lg leading-none transition hover:scale-110 ${on ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'} ${className}`}>
      {on ? '★' : '☆'}
    </button>
  )
}

export function PlaceCard({ place }: { place: Place }) {
  const { saved } = useStore()
  const photo = place.photos[0]
  const sich = place.restaurants.filter((r) => r.cuisine === 'Sichuan' && r.status !== 'closed').length
  const turk = place.restaurants.filter((r) => r.cuisine === 'Turkish' && r.status !== 'closed').length
  return (
    <Link to={`/places/${place.id}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-36 bg-gradient-to-br from-teal-700 to-sky-800">
        {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
          : <div className="grid h-full place-items-center text-sm text-white/70">No photo in report</div>}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 dark:bg-slate-900/90"><FavButton id={place.id} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2"><StatusBadge status={place.status} label={place.statusLabel} /></div>
        <h3 className="font-semibold leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400">{place.name}</h3>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{place.summary}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Rounds {place.firstRound}{place.cutRound ? `–${place.cutRound}` : '–now'}</span>
          {place.restaurants.length > 0 && <span>· {sich} Sichuan · {turk} Turkish listed</span>}
          {saved.notes[place.id] && <span className="text-teal-700 dark:text-teal-400">· has note</span>}
        </div>
      </div>
    </Link>
  )
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">{sub}</p>}
      </div>
      {children}
    </div>
  )
}
