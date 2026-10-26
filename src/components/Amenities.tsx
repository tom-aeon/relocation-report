import { AM_CATS, type PlaceAmenities } from '../data/amenitiesTypes'

export function AmenitiesSection({ am }: { am?: PlaceAmenities }) {
  return (
    <section className="card p-5" data-testid="amenities-section">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Nearby amenities</h2>
        {am && <span className="text-xs text-slate-500">as of {am.asOf} · free-flow drive times from the place’s base</span>}
      </div>
      {!am ? <p className="text-sm text-slate-500">not checked yet</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {AM_CATS.map(([k, label]) => (
            <div key={k} data-testid={`am-${k}`}>
              <h3 className="mb-1 text-sm font-semibold">{label}</h3>
              {am[k].note && <p className="mb-1 text-xs text-amber-700 dark:text-amber-300">{am[k].note}</p>}
              <ul className="space-y-1 text-sm">
                {am[k].items.map((i) => (
                  <li key={i.name + i.source}>
                    <b>{i.name}</b> <span className="text-xs text-slate-500">({i.kind}{i.town ? `, ${i.town}` : ''})</span> · {i.driveMin != null ? `~${i.driveMin} min` : `${i.km} km (no route)`}{' '}
                    <a href={i.source} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-700 underline dark:text-teal-400">source</a>
                    {i.note && <span className="block text-xs text-slate-500">{i.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {am && <p className="mt-3 text-xs text-slate-500">{am.method}</p>}
    </section>
  )
}
