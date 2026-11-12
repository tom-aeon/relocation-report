import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  COMMUTE_YEAR_NOTE, CORAL_SPRINGS_POP, FX_NOTE, INCOME_YEAR_NOTE, POP_CHECKED, POP_METHOD,
  communitiesOf, formatCount, formatMinutes, formatMoney, formatPct, formatYears,
  populationFor, type Community, type CommuteFigure, type EducationFigure, type GrowthFigure,
  type IncomeFigure, type SourcedNumber,
} from '../data/population'
import { NotChecked } from './ui'

const TEAL = '#0d9488'
const SLATE = '#64748b'
const TEAL2 = '#14b8a6'

function SourceLink({ f, label }: { f: SourcedNumber | GrowthFigure; label?: string }) {
  const year = 'period' in f ? f.period : `${f.fromYear}–${f.toYear}`
  return (
    <a className="text-teal-700 underline dark:text-teal-400" href={f.sourceUrl} target="_blank" rel="noopener noreferrer">
      {label ?? f.geography}, {year}
    </a>
  )
}

function Fact({
  label, value, sub, source, testId,
}: {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  source: SourcedNumber | GrowthFigure
  testId: string
}) {
  const missing = 'value' in source ? source.value == null : source.pct == null
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60" data-testid={testId}>
      <h3 className="text-sm font-semibold">{label}</h3>
      {missing ? (
        <p className="mt-1 text-sm"><NotChecked text="not available" /></p>
      ) : (
        <>
          <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          {sub && <p className="text-sm text-slate-600 dark:text-slate-400">{sub}</p>}
        </>
      )}
      <p className="mt-1 text-xs text-slate-500">
        {source.geographyLevel} · <SourceLink f={source} />
        {'note' in source && source.note && <> · {source.note}</>}
      </p>
    </div>
  )
}

function incomeSub(inc: IncomeFigure, coral: IncomeFigure): React.ReactNode {
  const local = formatMoney(inc.value, inc.currency)
  if (inc.currency === 'CAD') {
    return (
      <>
        {local} ({formatMoney(inc.valueUsd, 'USD')})
        {coral.valueUsd != null && inc.valueUsd != null && (
          <> · Coral Springs {formatMoney(coral.valueUsd, 'USD')}</>
        )}
      </>
    )
  }
  return coral.valueUsd != null ? `Coral Springs ${formatMoney(coral.valueUsd, 'USD')}` : null
}

function CommunityBlock({ community, showChart }: { community: Community; showChart: boolean }) {
  const coral = CORAL_SPRINGS_POP
  const pop = community.population
  const survey = community.populationSurvey
  const growth = community.growth
  const censusGrowth = community.censusGrowth
  const inc = community.medianIncome
  const edu = community.bachelorPct
  const commute = community.meanCommute

  return (
    <div className="space-y-3" data-testid={`population-geo-${community.geographyLevel}`}>
      <div>
        <h3 className="font-semibold">{community.label}</h3>
        <p className="text-xs text-slate-500">
          {community.geographyLevel} · {community.geography}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Fact
          testId="pop-total"
          label="Total population"
          value={formatCount(pop.value)}
          sub={
            <>
              {pop.period}
              {survey?.value != null && (
                <> · {survey.period}: {formatCount(survey.value)}</>
              )}
            </>
          }
          source={pop}
        />
        <Fact
          testId="pop-growth"
          label="Recent growth"
          value={growth.pct == null ? null : `${growth.pct > 0 ? '+' : ''}${formatPct(growth.pct)}`}
          sub={
            <>
              {growth.fromYear} to {growth.toYear}
              {growth.fromValue != null && growth.toValue != null && (
                <> · {formatCount(growth.fromValue)} → {formatCount(growth.toValue)}</>
              )}
              {censusGrowth?.pct != null && (
                <>
                  <br />
                  2016–2021 Census: {censusGrowth.pct > 0 ? '+' : ''}{formatPct(censusGrowth.pct)}
                  {censusGrowth.fromValue != null && censusGrowth.toValue != null && (
                    <> ({formatCount(censusGrowth.fromValue)} → {formatCount(censusGrowth.toValue)})</>
                  )}
                </>
              )}
            </>
          }
          source={growth}
        />
        <Fact
          testId="pop-age"
          label="Median age"
          value={formatYears(community.medianAge.value)}
          sub={`Coral Springs ${formatYears(coral.medianAge.value)}`}
          source={community.medianAge}
        />
        <Fact
          testId="pop-income"
          label="Median household income"
          value={inc.currency === 'CAD' ? formatMoney(inc.value, 'CAD') : formatMoney(inc.value, 'USD')}
          sub={incomeSub(inc, coral.medianIncome)}
          source={inc}
        />
        <Fact
          testId="pop-education"
          label="Bachelor’s degree or higher (age 25+)"
          value={formatPct(edu.value)}
          sub={
            <>
              {edu.bachelorPlus != null && edu.total25Plus != null && (
                <>{formatCount(edu.bachelorPlus)} of {formatCount(edu.total25Plus)} adults 25+ · </>
              )}
              Coral Springs {formatPct(coral.bachelorPct.value)}
            </>
          }
          source={edu}
        />
        <Fact
          testId="pop-commute"
          label="Mean commute"
          value={formatMinutes(commute.value)}
          sub={`Coral Springs ${formatMinutes(coral.meanCommute.value)}`}
          source={commute}
        />
      </div>
      {showChart && <PopulationVsChart communities={[community]} />}
      {community.note && <p className="text-sm text-slate-600 dark:text-slate-400">{community.note}</p>}
    </div>
  )
}

export function PopulationSection({ placeId, country }: { placeId: string; country: 'US' | 'Canada' }) {
  const p = populationFor(placeId)
  const communities = communitiesOf(p)
  return (
    <section className="card p-5" data-testid="population-section">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">Population &amp; community</h2>
        <span className="text-xs text-slate-500">vs Coral Springs, FL · checked {p?.checked ?? POP_CHECKED}</span>
      </div>
      {!p ? (
        <p className="text-sm"><NotChecked text="not available" /></p>
      ) : (
        <div className="space-y-6">
          {country === 'Canada' && (
            <div className="space-y-2">
              <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{INCOME_YEAR_NOTE}</p>
              <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">{COMMUTE_YEAR_NOTE} {FX_NOTE}</p>
            </div>
          )}
          {communities.map((c, i) => (
            <CommunityBlock
              key={c.geography}
              community={c}
              showChart={communities.length === 1 ? i === 0 : false}
            />
          ))}
          {communities.length > 1 && (
            <PopulationVsChart communities={communities} />
          )}
          {p.note && p.note !== p.primary.note && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{p.note}</p>
          )}
          <EduCommuteMethods communities={communities} />
          <p className="text-xs text-slate-500">{POP_METHOD}</p>
        </div>
      )}
    </section>
  )
}

function EduCommuteMethods({ communities }: { communities: Community[] }) {
  const edu = communities[0]?.bachelorPct as EducationFigure | undefined
  const commute = communities[0]?.meanCommute as CommuteFigure | undefined
  if (!edu && !commute) return null
  return (
    <p className="text-xs text-slate-500">
      {edu?.method} {commute?.method}
    </p>
  )
}

function PopulationVsChart({ communities }: { communities: Community[] }) {
  const coral = CORAL_SPRINGS_POP
  const metrics: { key: string; label: string; unit: string; get: (c: Community) => number | null }[] = [
    { key: 'age', label: 'Median age', unit: 'years', get: (c) => c.medianAge.value },
    { key: 'income', label: 'Median household income (US$)', unit: 'USD', get: (c) => c.medianIncome.valueUsd },
    { key: 'edu', label: 'Bachelor’s or higher, age 25+', unit: '%', get: (c) => c.bachelorPct.value },
    { key: 'commute', label: 'Mean commute', unit: 'min', get: (c) => c.meanCommute.value },
  ]
  const colors = [TEAL, TEAL2, '#0f766e']
  return (
    <div className="grid gap-4 sm:grid-cols-2" data-testid="population-chart">
      {metrics.map((m) => {
        const data = [
          { name: 'Coral Springs', value: m.get(coral), fill: SLATE },
          ...communities.map((c, i) => ({
            name: c.label.replace(/, (Quebec|Ontario|Florida|Georgia|Oregon|Washington|Tennessee|Colorado|Idaho)$/, ''),
            value: m.get(c),
            fill: colors[i % colors.length],
          })),
        ]
        if (data.every((d) => d.value == null)) return null
        return (
          <div key={m.key} className="h-52">
            <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{m.label}</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis
                  domain={[0, 'auto']}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) =>
                    m.unit === 'USD'
                      ? Number(v).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })
                      : Number(v).toLocaleString('en-US')
                  }
                />
                <Tooltip
                  formatter={(value) => {
                    if (value == null) return ['not available', m.label]
                    const n = Number(value)
                    if (m.unit === 'USD') return [formatMoney(n, 'USD'), m.label]
                    if (m.unit === '%') return [formatPct(n), m.label]
                    if (m.unit === 'min') return [formatMinutes(n), m.label]
                    return [formatYears(n), m.label]
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  )
}

/** Used by the Graphs page; re-exported for convenience. */
export function populationRowsForGraph(places: { id: string; short: string; country: 'US' | 'Canada'; status: string; minor?: boolean }[]) {
  const rows: {
    placeId: string
    name: string
    geography: string
    country: 'US' | 'Canada'
    status: string
    population: number | null
    popPeriod: string
    growth: number | null
    growthYears: string
    age: number | null
    incomeUsd: number | null
    incomeCurrency: 'USD' | 'CAD'
    incomeLocal: number | null
    bachelorPct: number | null
    commute: number | null
  }[] = []
  const seenGeo = new Set<string>()
  for (const p of places) {
    if (p.minor) continue
    const pop = populationFor(p.id)
    for (const c of communitiesOf(pop)) {
      if (seenGeo.has(c.geography)) continue
      seenGeo.add(c.geography)
      rows.push({
        placeId: p.id,
        name: c.label,
        geography: c.geography,
        country: p.country,
        status: p.status,
        population: c.population.value,
        popPeriod: c.population.period,
        growth: c.growth.pct,
        growthYears: `${c.growth.fromYear}–${c.growth.toYear}`,
        age: c.medianAge.value,
        incomeUsd: c.medianIncome.valueUsd,
        incomeCurrency: c.medianIncome.currency,
        incomeLocal: c.medianIncome.value,
        bachelorPct: c.bachelorPct.value,
        commute: c.meanCommute.value,
      })
    }
  }
  return rows
}

