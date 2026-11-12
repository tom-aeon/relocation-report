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
        <p>Ontario places come from the 10 Oct 2026 Ontario scout. A 12 Nov 2026 rescout added Victor / Mendon, NY and Stokesdale / Oak Ridge / Kernersville, NC as live options, Wexford / Pine Township, PA as a near-miss on air, Apex / Holly Springs, NC, rural Guelph/Eramosa, ON and Cochrane, AB as near-misses, and Waxhaw / Lake Norman, NC under Other. Everyday-retail stops (coffee chain, big box, home improvement) were checked on 10 Oct 2026 for earlier places, and on 12 Nov 2026 for the new ones, from OpenStreetMap and scout geocodes, with OSRM free-flow drive times: good ≤ ~25 min, partial 25–35, fail &gt; 35.</p>
        <p>Air &amp; water was checked on 14 Oct 2026 for earlier places still in play, and on 12 Nov 2026 for the November rescout places: EPA AirData and ALA State of the Air 2026 (official county API) in the US, Ontario Ministry of the Environment station statistics (Guelph and Kitchener, 2023–2025) in Canada, utility water reports, EPA SDWIS and UCMR 5 PFAS results, and state/provincial well guidance. Official annual air figures for Cochrane, AB, and some municipal water reports, were not retrieved and are marked not available. Marks: good / partial / concern. Sources are listed on each place page.</p>
        <p>Crime rates vs Coral Springs, FL were checked on 12 Nov 2026 for every place still in play (not dropped). US figures are 2025 FBI Crime Data Explorer agency totals (12 complete months, data refreshed 15 Oct 2026): violent and property offences per 100,000 people the agency serves. Canada figures are 2025 Statistics Canada police-service rates (tables 35-10-0179-01, 35-10-0180-01 and 35-10-0183-01) and the Crime Severity Index (tables 35-10-0187-01, 35-10-0188-01 and 35-10-0190-01; The Daily, 22 Jul 2026). New York town-level figures also look at NY DCJS Index Crimes (dataset ca8h-8gjq, through 2024). Each place uses the most local reporting agency that covers it. A missing figure is “not available,” never 0. US and Canadian offence definitions differ, so cross-border comparisons are approximate. Sources, year and agency are listed on each place page, the crime map layer, and the Graphs page.</p>
        <p>Population and community figures vs Coral Springs, FL were checked on 12 Nov 2026 for every place still in play (not dropped). US characteristics (median age, median household income, share of adults 25+ with a bachelor’s degree or higher, mean commute) are from the Census Bureau’s ACS 2024 5-year estimates (2020–2024) at the most fitting published geography (place, CDP, county subdivision, or county). Latest US population and 2020-to-2025 growth are Vintage 2025 July 1 estimates where that geography is published; county subdivisions that have no Vintage 2025 estimate use ACS 2015–2019 vs 2020–2024 instead. Canada figures are from the 2021 Census Profile tables at the census subdivision (Cantley, Chelsea, Ottawa, Hamilton, Oro-Medonte, King, Guelph/Eramosa, Cochrane), plus Statistics Canada July 1 CSD population estimates through 2025 (table 17-10-0155-01, released 14 Jan 2026). Canadian income is shown in Canadian dollars and in US dollars at the same 1 USD = 1.4066 CAD rate used for home prices. A missing figure is “not available,” never guessed. Sources, year and geography are listed on each place page and on the Graphs page. US and Canadian income years and commute reference periods differ, so those comparisons are approximate.</p>
        <p>Checklist marks (✓ / ~ / ✗) come from the report’s comparison table. Marks with a blue dot are read from the report’s text about that place. Scorecard: pass = 3, partial = 1.5, fail = 0; unknown criteria are excluded from a place’s average.</p>
      </section>
    </div>
  )
}
