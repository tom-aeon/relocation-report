import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  CANADA_CSI_2025, CORAL_PROPERTY_RATE, CORAL_SPRINGS, CORAL_VIOLENT_RATE, CROSS_BORDER_NOTE,
  SAFER_GROUP_META, classifySafer, crimeFor, formatRate, type SaferGroup, type SaferResult,
} from '../data/crime'
import { hasQualifyingHomes } from '../data/homes'
import { NO_QUALIFYING_HOMES } from '../data/homesTypes'
import { STATUS_META, type Place } from '../data/places'

export const SAFER_RULE =
  `A US place is “at or below Coral Springs” only when both of its sourced official rates per 100,000 are at or below the Coral Springs Police Department’s 2025 FBI figures: violent ${formatRate(CORAL_VIOLENT_RATE)} and property ${formatRate(CORAL_PROPERTY_RATE)}. A second tier holds US places where both rates are sourced but only one of the two qualifies. Canadian places use different offence definitions, so they are never counted as at-or-below Coral Springs; they appear in a clearly labelled “Canada (approximate)” group, with Crime Severity Index vs Canada’s 2025 national CSI of ${(CANADA_CSI_2025.value as number).toFixed(2)} as context only. Places whose official violent or property rate is not available are listed under “Unverified crime” and are never included in the at-or-below groups.`

export function groupSafer(places: Place[]): Record<SaferGroup, { place: Place; safer: SaferResult }[]> {
  const out: Record<SaferGroup, { place: Place; safer: SaferResult }[]> = {
    safer: [],
    'one-sided': [],
    higher: [],
    canada: [],
    unverified: [],
  }
  for (const place of places) {
    const safer = classifySafer(crimeFor(place.id))
    out[safer.group].push({ place, safer })
  }
  const byViolent = (a: { safer: SaferResult }, b: { safer: SaferResult }) =>
    (a.safer.violent ?? 1e9) - (b.safer.violent ?? 1e9)
  const byCsi = (a: { safer: SaferResult }, b: { safer: SaferResult }) =>
    (a.safer.csi ?? 1e9) - (b.safer.csi ?? 1e9)
  const byName = (a: { place: Place }, b: { place: Place }) => a.place.short.localeCompare(b.place.short)
  out.safer.sort(byViolent)
  out['one-sided'].sort(byViolent)
  out.higher.sort(byViolent)
  out.canada.sort(byCsi)
  out.unverified.sort(byName)
  return out
}

function RateCell({ label, rate, ok, missing }: { label: string; rate: number | null; ok: boolean | null; missing?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      {rate == null ? (
        <div className="font-medium text-slate-500">{missing ?? 'not available'}</div>
      ) : (
        <div className={`font-semibold ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
          {formatRate(rate)} <span className="text-xs font-normal text-slate-500">per 100k</span>
          <span className="ml-1 text-xs font-normal">({ok ? 'at or below' : 'above'})</span>
        </div>
      )}
    </div>
  )
}

function SaferRow({ place, safer, showUsRates, showCsi }: { place: Place; safer: SaferResult; showUsRates?: boolean; showCsi?: boolean }) {
  const noHomes = !hasQualifyingHomes(place.id)
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/places/${place.id}`} className="font-semibold text-teal-800 hover:underline dark:text-teal-300">{place.short}</Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] dark:border-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_META[place.status].color }} />
            {STATUS_META[place.status].label}
          </span>
          {noHomes && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200" data-testid="no-qualifying-homes">
              {NO_QUALIFYING_HOMES}
            </span>
          )}
        </div>
        {safer.agency && safer.year && (
          <div className="mt-0.5 text-xs text-slate-500">{safer.agency}, {safer.year}</div>
        )}
      </div>
      <div className="grid min-w-[16rem] grid-cols-2 gap-3 text-sm">
        {showUsRates && (
          <>
            <RateCell label="Violent" rate={safer.violent} ok={safer.violentAtOrBelow} />
            <RateCell label="Property" rate={safer.property} ok={safer.propertyAtOrBelow} />
          </>
        )}
        {showCsi && (
          <div className="col-span-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Crime Severity Index (context only)</div>
            {safer.csi == null ? (
              <div className="font-medium text-slate-500">not available</div>
            ) : (
              <div className="font-semibold">
                {safer.csi.toFixed(2)}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  vs Canada {(CANADA_CSI_2025.value as number).toFixed(2)} ({safer.csiAtOrBelowNational ? 'at or below' : 'above'} the national index)
                </span>
              </div>
            )}
          </div>
        )}
        {!showUsRates && !showCsi && (
          <div className="col-span-2 text-sm text-slate-500">Official rate not available</div>
        )}
      </div>
    </li>
  )
}

function Group({
  group, rows, showUsRates, showCsi, testId, extra,
}: {
  group: SaferGroup
  rows: { place: Place; safer: SaferResult }[]
  showUsRates?: boolean
  showCsi?: boolean
  testId: string
  extra?: ReactNode
}) {
  const meta = SAFER_GROUP_META[group]
  return (
    <div data-testid={testId} data-count={rows.length}>
      <h3 className="flex flex-wrap items-center gap-2 font-semibold">
        <span className="h-3 w-3 rounded-full" style={{ background: meta.color }} />
        {meta.label}
        <span className="text-sm font-normal text-slate-500">{rows.length}</span>
      </h3>
      <p className="mb-2 mt-1 text-sm text-slate-600 dark:text-slate-400">{meta.description}</p>
      {extra}
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">None in this group.</p>
      ) : (
        <ul className="space-y-2">{rows.map((r) => <SaferRow key={r.place.id} {...r} showUsRates={showUsRates} showCsi={showCsi} />)}</ul>
      )}
    </div>
  )
}

/** In-play places: not dropped, not cut-list-only. */
export const saferCandidates = (places: Place[]) => places.filter((p) => p.status !== 'dropped' && !p.minor)

export function SaferSection({ places, id }: { places: Place[]; id?: string }) {
  const groups = groupSafer(saferCandidates(places))
  return (
    <section id={id} className="card space-y-6 p-5" data-testid="safer-section">
      <header>
        <h2 className="text-xl font-bold">Safer than Coral Springs</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{SAFER_RULE}</p>
        <p className="mt-2 text-xs text-slate-500">
          Baseline: Coral Springs Police Department, {CORAL_SPRINGS.violent.year} — violent {formatRate(CORAL_VIOLENT_RATE)} and property {formatRate(CORAL_PROPERTY_RATE)} per 100,000
          ({CORAL_SPRINGS.violent.incidents} and {CORAL_SPRINGS.property.incidents} offences among {CORAL_SPRINGS.violent.population?.toLocaleString('en-US')} people served, FBI Crime Data Explorer, 12 of 12 months).
          Checked {CORAL_SPRINGS.checked}.{' '}
          <Link to="/map?layer=safer" className="text-teal-700 underline dark:text-teal-400">View on the map →</Link>
          {' · '}
          <Link to="/scorecard" className="text-teal-700 underline dark:text-teal-400">How this is weighted in the scorecard →</Link>
        </p>
        <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{CROSS_BORDER_NOTE}</p>
      </header>
      <Group group="safer" rows={groups.safer} showUsRates testId="safer-both" />
      <Group group="one-sided" rows={groups['one-sided']} showUsRates testId="safer-one" />
      <Group
        group="canada"
        rows={groups.canada}
        showCsi
        testId="safer-canada"
        extra={<p className="mb-2 text-xs text-slate-500">Rates per 100k are not compared with Coral Springs here, even when published, because the definitions differ.</p>}
      />
      <Group group="unverified" rows={groups.unverified} testId="safer-unverified" />
    </section>
  )
}

export function SaferLegend({ extra }: { extra?: ReactNode }) {
  const keys: SaferGroup[] = ['safer', 'one-sided', 'higher', 'canada', 'unverified']
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400" data-testid="safer-legend">
      {keys.map((g) => (
        <span key={g} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: SAFER_GROUP_META[g].color }} />
          {SAFER_GROUP_META[g].short}
        </span>
      ))}
      {extra}
    </div>
  )
}
