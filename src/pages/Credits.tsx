import { CREDITS, PLACES, REPORT } from '../data/places'
import { PageHeader } from '../components/ui'

export default function Credits() {
  const photos = PLACES.flatMap((p) => p.photos.map((ph) => ({ ...ph, place: p.short })))
  return (
    <div className="space-y-8">
      <PageHeader title="Credits & method" sub="Where the photos come from and how to read the data." />
      <section className="card p-5">
        <h2 className="mb-2 font-semibold">Image credits</h2>
        <p className="mb-2 text-sm">All photos and maps are from Wikimedia Commons, used under their respective free licences:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">{CREDITS.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {photos.map((ph) => (
            <figure key={ph.src} className="text-xs">
              <img src={ph.src} alt={ph.alt} loading="lazy" className="h-20 w-full rounded-lg object-cover" />
              <figcaption className="mt-1 text-slate-500">{ph.place}: {ph.credit}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-sm">Map tiles © <a className="underline" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p>
      </section>
      <section className="card space-y-2 p-5 text-sm">
        <h2 className="font-semibold">About the data</h2>
        <p>{REPORT.disclaimer}</p>
        <p>Everything here comes from the relocation report dated {REPORT.reportDate}. Anything the report doesn’t state is shown as “not checked yet” rather than guessed. Map markers sit at approximate area centres and are not research findings.</p>
        <p>Ontario places come from the 10 Oct 2026 Ontario scout. Everyday-retail stops (coffee chain, big box, home improvement) were checked on 10 Oct 2026 from store-locator and listing pages plus OpenStreetMap, with OSRM free-flow drive times: good ≤ ~25 min, partial 25–35, fail &gt; 35.</p>
        <p>Checklist marks (✓ / ~ / ✗) come from the report’s comparison table. Marks with a blue dot are read from the report’s text about that place. Scorecard: pass = 3, partial = 1.5, fail = 0; unknown criteria are excluded from a place’s average.</p>
      </section>
    </div>
  )
}
