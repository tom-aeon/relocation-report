import { Link } from 'react-router-dom'
import { CRITERIA, EXTRA_CRITERION, PLACES, REPORT, ROUNDS, placeById } from '../data/places'
import { PlaceCard } from '../components/ui'

export default function Home() {
  const current = ['forsyth', 'happy-valley', 'duvall'].map((id) => placeById(id)!)
  return (
    <div className="space-y-12">
      <section className="relative -mx-4 -mt-8 overflow-hidden px-4 py-14 text-white sm:rounded-b-3xl"
        style={{ background: 'linear-gradient(120deg,rgba(14,52,72,.9),rgba(31,111,139,.75)),url(assets/ga_lanier.jpg) center/cover' }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{REPORT.title}</h1>
          <p className="mt-3 max-w-2xl text-lg opacity-95">An interactive explorer of the US relocation search so far: what he is looking for, which places made it, which didn’t, and why.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {[`Starting point: ${REPORT.startingPoint}`, `Report date: ${REPORT.reportDate}`, `Latest scout: ${REPORT.latestScout}`, `${PLACES.length} places tracked`, `${ROUNDS.length} search rounds`].map((t) => (
              <span key={t} className="rounded-full border border-white/35 bg-white/15 px-3 py-0.5">{t}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/history" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">See how the search narrowed →</Link>
            <Link to="/map" className="rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold hover:bg-white/10">Open the map</Link>
            <Link to="/scorecard" className="rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold hover:bg-white/10">Re-weight the scorecard</Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-bold">Where things stand</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">As of {REPORT.reportDate}. {REPORT.statusHeadline}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((p) => <PlaceCard key={p.id} place={p} />)}
        </div>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-teal-800 to-sky-800 p-5 text-white">
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Key insight · food is the bottleneck</div>
          <p className="mt-1">{REPORT.keyInsight}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-bold">The checklist</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">Every place was judged against these. The food rule is what knocked out the most places.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <li key={c.key} className={`card p-4 ${c.hard ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40' : ''}`}>
              <b className="block">{c.hard ? '! ' : '✓ '}{c.label}</b>
              <span className="text-sm text-slate-600 dark:text-slate-400">{c.detail}</span>
            </li>
          ))}
          <li className="card p-4"><b className="block">✓ {EXTRA_CRITERION.label}</b><span className="text-sm text-slate-600 dark:text-slate-400">{EXTRA_CRITERION.detail}</span></li>
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/places', t: 'Places', d: 'Search and filter every place, with photos, listings and food.' },
          { to: '/compare', t: 'Compare', d: 'Put 2–3 places side by side on every criterion.' },
          { to: '/food', t: 'Food finder', d: 'Every Sichuan and Turkish spot found, filterable by drive time.' },
          { to: '/notes', t: 'My notes', d: 'Favorites and private notes, saved in this browser. Export to JSON.' },
        ].map((x) => (
          <Link key={x.to} to={x.to} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="font-semibold text-teal-700 dark:text-teal-400">{x.t} →</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{x.d}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
