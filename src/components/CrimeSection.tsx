import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import {
  CANADA_CSI_2025, CORAL_SPRINGS, CRIME_BAND_META, CRIME_METHOD, CROSS_BORDER_NOTE,
  bandForPlace, compareRate, crimeFor, formatPct, formatRate, type CrimeBand, type CrimeFigure, type PlaceCrime,
} from '../data/crime'
import { NotChecked } from './ui'

function SourceLink({ f }: { f: CrimeFigure }) {
  return (
    <a className="text-teal-700 underline dark:text-teal-400" href={f.sourceUrl} target="_blank" rel="noopener noreferrer">
      {f.agency}, {f.year}
    </a>
  )
}

function BandBadge({ band }: { band: CrimeBand }) {
  const m = CRIME_BAND_META[band]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: m.color }}>
      {m.short}
    </span>
  )
}

function RateBlock({ label, figure, baseline }: { label: string; figure: CrimeFigure; baseline: CrimeFigure }) {
  const cmp = compareRate(figure.ratePer100k, baseline.ratePer100k)
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60" data-testid={`crime-${label.toLowerCase().includes('violent') ? 'violent' : 'property'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <BandBadge band={cmp.band} />
      </div>
      {figure.ratePer100k == null ? (
        <p className="mt-1 text-sm"><NotChecked text="not available" /></p>
      ) : (
        <>
          <p className="mt-1 text-2xl font-bold tabular-nums">{formatRate(figure.ratePer100k)}<span className="ml-1 text-sm font-normal text-slate-500">per 100,000</span></p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{formatPct(cmp.pct)} ({formatRate(baseline.ratePer100k)} in Coral Springs)</p>
          <p className="mt-1 text-xs text-slate-500">
            {figure.incidents != null && <>{figure.incidents.toLocaleString('en-US')} incident{figure.incidents === 1 ? '' : 's'} reported</>}
            {figure.population != null && <> · served population {figure.population.toLocaleString('en-US')}</>}
            {figure.reportedZero && <> · reported zero (not missing data)</>}
            {figure.coverage && <> · {figure.coverage}</>}
          </p>
        </>
      )}
      <p className="mt-1 text-xs text-slate-500">
        {figure.level} · <SourceLink f={figure} />
        {figure.note && <> · {figure.note}</>}
      </p>
    </div>
  )
}

export function CrimeSection({ placeId, country }: { placeId: string; country: 'US' | 'Canada' }) {
  const c = crimeFor(placeId)
  return (
    <section className="card p-5" data-testid="crime-section">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Crime vs Coral Springs, FL</h2>
        {c && <span className="text-xs text-slate-500">checked {c.checked}</span>}
      </div>
      {!c ? (
        <p className="text-sm"><NotChecked text="not available" /></p>
      ) : (
        <div className="space-y-4">
          {country === 'Canada' && (
            <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{CROSS_BORDER_NOTE}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <RateBlock label="Violent crime" figure={c.violent} baseline={CORAL_SPRINGS.violent} />
            <RateBlock label="Property crime" figure={c.property} baseline={CORAL_SPRINGS.property} />
          </div>
          <CrimeVsChart crime={c} />
          {c.csi && (
            <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700" data-testid="crime-csi">
              <h3 className="font-semibold">Crime Severity Index (Canada only)</h3>
              <p className="mt-1">
                {c.csi.agency}: <b>{c.csi.value ?? 'not available'}</b> in {c.csi.year}
                {c.violentCsi?.value != null && <> · violent CSI {c.violentCsi.value}</>}
                . Canada overall was {CANADA_CSI_2025.value} in {CANADA_CSI_2025.year}.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                The CSI has no Coral Springs counterpart. Lower than {CANADA_CSI_2025.value} means less severe police-reported crime than the national index (Canada 2006 = 100).{' '}
                <a className="text-teal-700 underline dark:text-teal-400" href={c.csi.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a>
              </p>
            </div>
          )}
          {c.note && <p className="text-sm text-slate-600 dark:text-slate-400">{c.note}</p>}
          <p className="text-xs text-slate-500">{c.violent.sourceName} {CRIME_METHOD}</p>
        </div>
      )}
    </section>
  )
}

function CrimeVsChart({ crime }: { crime: PlaceCrime }) {
  const data = [
    {
      name: 'Violent',
      place: crime.violent.ratePer100k,
      coral: CORAL_SPRINGS.violent.ratePer100k,
      band: bandForPlace(crime, 'violent'),
    },
    {
      name: 'Property',
      place: crime.property.ratePer100k,
      coral: CORAL_SPRINGS.property.ratePer100k,
      band: bandForPlace(crime, 'property'),
    },
  ]
  if (data.every((d) => d.place == null && d.coral == null)) return null
  return (
    <div className="h-64" data-testid="crime-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => Number(v).toLocaleString('en-US')} />
          <Tooltip
            formatter={(value, name) => [value == null ? 'not available' : `${formatRate(Number(value))} per 100,000`, name === 'place' ? 'This place' : 'Coral Springs']}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend formatter={(v) => (v === 'place' ? 'This place' : 'Coral Springs')} />
          <Bar dataKey="coral" name="coral" fill="#64748b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="place" name="place" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={CRIME_BAND_META[d.band].color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Shared legend for the crime map and graphs. */
export function CrimeBandLegend({ extra }: { extra?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
      {(['lower', 'similar', 'higher', 'no-data'] as CrimeBand[]).map((b) => (
        <span key={b} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: CRIME_BAND_META[b].color }} />
          {CRIME_BAND_META[b].label}
        </span>
      ))}
      {extra}
    </div>
  )
}

