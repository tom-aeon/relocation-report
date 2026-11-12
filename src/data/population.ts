// Population and community figures for places still in play, plus a Coral Springs, FL baseline.
// Every figure is taken from the named official source. Nothing is estimated.
// A missing figure is null ("not available") — never 0, and never filled in by guesswork.
// Percents, means and currency conversions below are calculated only from published official
// counts or at the app’s existing FX rate, and the method is stored with the figure.
// This file holds only the requested community totals and characteristics.
// Checked 12 Nov 2026.

export const POP_CHECKED = '12 Nov 2026'

/** Same FX rate as Canadian home prices in this app. */
export const FX_USD_CAD = 1.4066
export const FX_NOTE =
  'Canadian dollars converted to US dollars at 1 USD = 1.4066 CAD (ECB rate via frankfurter.dev, 6 Nov 2026), the same rate used for Canadian home prices in this app.'

export const INCOME_YEAR_NOTE =
  'Median household income is not in the same year’s dollars across the border. US figures are ACS 2024 5-year estimates in 2024 inflation-adjusted dollars. Canadian figures are 2020 median household total income in 2020 constant dollars (2021 Census). No inflation adjustment is applied here, so a US–Canada income comparison is approximate.'

export const COMMUTE_YEAR_NOTE =
  'Canadian average commuting duration is from the 2021 Census (reference week in May 2021, during the COVID-19 pandemic) for the employed labour force with a usual place of work or no fixed workplace address. Many people were working from home then, and those who did not commute are outside this average. US mean travel time is from the ACS 2024 5-year estimates (2020–2024) for workers 16 and over who did not work from home. The two are similar in definition but not identical, and the years differ.'

export const POP_METHOD = `US population characteristics (median age, median household income, educational attainment, mean commute) are from the latest American Community Survey 5-year estimates, 2020–2024 (U.S. Census Bureau, ACS 2024 5-year Summary File, retrieved 12 Nov 2026; also on data.census.gov). The most fitting published geography is used (incorporated place, CDP, county subdivision, or county) and is named with each figure. Latest population and recent growth, where the geography has an official estimate, are Census Bureau Vintage 2025 July 1 estimates (2020 to 2025). County subdivisions that are not in the Vintage 2025 place/county files use ACS 2015–2019 vs 2020–2024 for growth instead. Canada figures are from the 2021 Census of Population at the census subdivision (CSD): population and 2016-to-2021 change (table 98-10-0002-01), median age (table 98-10-0022-01), median household total income in 2020 (table 98-10-0057-01), educational attainment (table 98-10-0400-01), and average commuting duration (table 98-10-0458-01). Latest Canadian population and 2020-to-2025 growth are Statistics Canada annual CSD estimates, 2021 boundaries, July 1, 2020 to July 1, 2025 (table 17-10-0155-01, released 14 Jan 2026). A missing figure is shown as “not available,” never as 0 and never guessed. ${INCOME_YEAR_NOTE} ${COMMUTE_YEAR_NOTE} ${FX_NOTE} Checked ${POP_CHECKED}.`

const ACS24 =
  'U.S. Census Bureau, American Community Survey 2024 5-year estimates (2020–2024), retrieved 12 Nov 2026 from the ACS 2024 5-year Summary File (https://www2.census.gov/programs-surveys/acs/summary_file/2024/).'
const ACS19 =
  'U.S. Census Bureau, American Community Survey 2019 5-year estimates (2015–2019), via data.census.gov, retrieved 12 Nov 2026.'
const PEP_SOURCE =
  'U.S. Census Bureau, Vintage 2025 Population Estimates, annual resident population for 1 July. Incorporated-place figures: sub-est2025.csv; county figures: co-est2025-alldata.csv. Retrieved 12 Nov 2026 from https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/.'
const PEP_URL = 'https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv'
const PEP_CO_URL = 'https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv'
const SC_POP = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810000201'
const SC_POP_SRC =
  'Statistics Canada, 2021 Census of Population, table 98-10-0002-01, Population and dwelling counts: Canada and census subdivisions (municipalities). Population 2021, population 2016, and population percentage change 2016 to 2021, as published.'
const SC_AGE = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810002201'
const SC_AGE_SRC =
  'Statistics Canada, 2021 Census of Population, table 98-10-0022-01, Age (in single years), average age and median age and gender: Canada, provinces and territories, census divisions and census subdivisions. Median age, Total – Gender, census year 2021.'
const SC_INC = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810005701'
const SC_INC_SRC =
  'Statistics Canada, 2021 Census of Population, table 98-10-0057-01, Household income statistics by household type: Canada, provinces and territories, census divisions and census subdivisions. Median household total income (2020), 2020 constant dollars, for Total households.'
const SC_EDU = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810040001'
const SC_EDU_SRC =
  'Statistics Canada, 2021 Census of Population, table 98-10-0400-01, Labour force status by highest level of education: Canada, provinces and territories, census divisions and census subdivisions. Count, Total – Gender, Total – Labour force status. “Bachelor’s degree or higher” as a share of “Total – Highest certificate, diploma or degree.” The 25-and-over figure is the sum of the published 25-to-64 and 65-and-over age groups, which together are the entire population 25 and over. Counts are randomly rounded by Statistics Canada.'
const SC_COM = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810045801'
const SC_COM_SRC =
  'Statistics Canada, 2021 Census of Population, table 98-10-0458-01, Main mode of commuting by commuting duration, time leaving for work, age and gender: Canada, provinces and territories, census divisions and census subdivisions. Average commuting duration (in minutes), Count, Total – Time leaving for work, Total – Age, Total – Gender, Total – Main mode of commuting, as published.'
const SC_EST = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710015501'
const SC_EST_SRC =
  'Statistics Canada, table 17-10-0155-01, Population estimates, July 1, by census subdivision, 2021 boundaries (released 14 Jan 2026). Annual estimates as of 1 July.'

export function acsTableUrl(year: 2019 | 2024, table: string, geoid: string): string {
  return `https://data.census.gov/table/ACSDT5Y${year}.${table}?g=${geoid}`
}

export function cadToUsd(cad: number): number {
  return Math.round(cad / FX_USD_CAD)
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export type GeoLevel =
  | 'place'
  | 'CDP'
  | 'county'
  | 'county subdivision'
  | 'CSD'

export interface SourcedNumber {
  value: number | null
  year: number
  /** For multi-year products, e.g. "2020–2024" or "1 July 2025". */
  period: string
  geography: string
  geographyLevel: GeoLevel
  sourceUrl: string
  sourceName: string
  note?: string
}

export interface GrowthFigure {
  pct: number | null
  fromYear: string
  toYear: string
  fromValue: number | null
  toValue: number | null
  geography: string
  geographyLevel: GeoLevel
  sourceUrl: string
  sourceName: string
  note?: string
}

export interface IncomeFigure extends SourcedNumber {
  currency: 'USD' | 'CAD'
  /** For Canadian figures, value converted at FX_USD_CAD. For US figures, same as value. */
  valueUsd: number | null
  fxNote?: string
}

export interface EducationFigure extends SourcedNumber {
  bachelorPlus: number | null
  total25Plus: number | null
  method: string
}

export interface CommuteFigure extends SourcedNumber {
  method: string
  workers?: number | null
  aggregateMinutes?: number | null
}

export interface Community {
  /** Short label, e.g. "Cantley, Quebec". */
  label: string
  geography: string
  geographyLevel: GeoLevel
  country: 'US' | 'Canada'
  /** Headline population: latest official estimate when one exists, otherwise the survey/census count. */
  population: SourcedNumber
  /** ACS 5-year or 2021 Census population, when the headline is a later estimate. */
  populationSurvey?: SourcedNumber
  growth: GrowthFigure
  /** Canada: official 2016-to-2021 Census percentage change, as published. */
  censusGrowth?: GrowthFigure
  medianAge: SourcedNumber
  medianIncome: IncomeFigure
  bachelorPct: EducationFigure
  meanCommute: CommuteFigure
  note?: string
}

export interface PlacePopulation {
  placeId: string
  country: 'US' | 'Canada'
  checked: string
  primary: Community
  also?: Community[]
  note?: string
}

const ACS_EDU_METHOD =
  'Percent of the population 25 years and over with a bachelor’s degree or higher, from ACS 2024 5-year table B15003: (bachelor’s + master’s + professional-school + doctorate) ÷ total population 25 and over, × 100, rounded to one decimal place. Counts are as published.'

const ACS_COM_METHOD =
  'Mean travel time to work (minutes), Census Bureau definition: aggregate travel time of workers 16 years and over who did not work from home (ACS 2024 5-year table B08013) divided by that universe (table B08012), rounded to one decimal place.'

const SC_EDU_METHOD =
  'Percent of the population 25 years and over with a bachelor’s degree or higher. Statistics Canada table 98-10-0400-01 publishes counts for age groups 25 to 64 and 65 years and over (Count, Total – Gender, Total – Labour force status). The 25-and-over figure is the sum of those two published groups, which together are the entire population 25 and over. Counts are randomly rounded by Statistics Canada. Rounded to one decimal place.'

function acsEdu(
  geography: string,
  geographyLevel: GeoLevel,
  geoid: string,
  bachelors: number,
  masters: number,
  prof: number,
  phd: number,
  total25: number,
): EducationFigure {
  const bachelorPlus = bachelors + masters + prof + phd
  return {
    value: round1((bachelorPlus / total25) * 100),
    year: 2024,
    period: '2020–2024',
    geography,
    geographyLevel,
    sourceUrl: acsTableUrl(2024, 'B15003', geoid),
    sourceName: `${ACS24} Table B15003, Educational Attainment for the Population 25 Years and Over.`,
    bachelorPlus,
    total25Plus: total25,
    method: ACS_EDU_METHOD,
  }
}

function acsCommute(
  geography: string,
  geographyLevel: GeoLevel,
  geoid: string,
  aggregateMinutes: number,
  workers: number,
): CommuteFigure {
  return {
    value: round1(aggregateMinutes / workers),
    year: 2024,
    period: '2020–2024',
    geography,
    geographyLevel,
    sourceUrl: acsTableUrl(2024, 'B08013', geoid),
    sourceName: `${ACS24} Tables B08013 (aggregate travel time to work) and B08012 (workers 16 and over who did not work from home).`,
    method: ACS_COM_METHOD,
    workers,
    aggregateMinutes,
  }
}

function acsNum(
  table: string,
  title: string,
  geography: string,
  geographyLevel: GeoLevel,
  geoid: string,
  value: number,
  year: 2019 | 2024 = 2024,
): SourcedNumber {
  const src = year === 2024 ? ACS24 : ACS19
  const period = year === 2024 ? '2020–2024' : '2015–2019'
  return {
    value,
    year,
    period,
    geography,
    geographyLevel,
    sourceUrl: acsTableUrl(year, table, geoid),
    sourceName: `${src} Table ${table}, ${title}.`,
  }
}

function acsIncome(
  geography: string,
  geographyLevel: GeoLevel,
  geoid: string,
  value: number,
): IncomeFigure {
  const base = acsNum(
    'B19013',
    'Median Household Income in the Past 12 Months (in 2024 Inflation-Adjusted Dollars)',
    geography,
    geographyLevel,
    geoid,
    value,
  )
  return {
    value: base.value,
    year: base.year,
    period: base.period,
    geography: base.geography,
    geographyLevel: base.geographyLevel,
    sourceUrl: base.sourceUrl,
    sourceName: base.sourceName,
    note: base.note,
    currency: 'USD',
    valueUsd: value,
  }
}

function pepPop(
  geography: string,
  geographyLevel: GeoLevel,
  value: number,
  year: 2020 | 2025,
  countyFile = false,
): SourcedNumber {
  return {
    value,
    year,
    period: `1 July ${year}`,
    geography,
    geographyLevel,
    sourceUrl: countyFile ? PEP_CO_URL : PEP_URL,
    sourceName: PEP_SOURCE,
  }
}

function pepGrowth(
  geography: string,
  geographyLevel: GeoLevel,
  fromValue: number,
  toValue: number,
  countyFile = false,
): GrowthFigure {
  return {
    pct: round1(((toValue - fromValue) / fromValue) * 100),
    fromYear: '1 July 2020',
    toYear: '1 July 2025',
    fromValue,
    toValue,
    geography,
    geographyLevel,
    sourceUrl: countyFile ? PEP_CO_URL : PEP_URL,
    sourceName: PEP_SOURCE,
  }
}

function acsGrowth(
  geography: string,
  geographyLevel: GeoLevel,
  geoid: string,
  fromValue: number,
  toValue: number,
): GrowthFigure {
  return {
    pct: round1(((toValue - fromValue) / fromValue) * 100),
    fromYear: 'ACS 2015–2019',
    toYear: 'ACS 2020–2024',
    fromValue,
    toValue,
    geography,
    geographyLevel,
    sourceUrl: acsTableUrl(2024, 'B01003', geoid),
    sourceName: `${ACS19} and ${ACS24} Table B01003, Total Population. Growth is the change between two non-overlapping 5-year ACS periods, not a single-year change.`,
    note: 'ACS 5-year figures are period estimates (2015–2019 and 2020–2024). This is not a July-to-July change.',
  }
}

function scEst(geography: string, value: number, year: 2020 | 2025): SourcedNumber {
  return {
    value,
    year,
    period: `1 July ${year}`,
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_EST,
    sourceName: SC_EST_SRC,
  }
}

function scEstGrowth(geography: string, fromValue: number, toValue: number): GrowthFigure {
  return {
    pct: round1(((toValue - fromValue) / fromValue) * 100),
    fromYear: '1 July 2020',
    toYear: '1 July 2025',
    fromValue,
    toValue,
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_EST,
    sourceName: SC_EST_SRC,
  }
}

function scCensusPop(geography: string, value: number, year: 2016 | 2021): SourcedNumber {
  return {
    value,
    year,
    period: `2021 Census (${year} count)`,
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_POP,
    sourceName: SC_POP_SRC,
  }
}

function scCensusGrowth(
  geography: string,
  fromValue: number,
  toValue: number,
  publishedPct: number,
): GrowthFigure {
  return {
    pct: publishedPct,
    fromYear: '2016 Census',
    toYear: '2021 Census',
    fromValue,
    toValue,
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_POP,
    sourceName: SC_POP_SRC,
    note: 'Percentage change as published by Statistics Canada (not recalculated).',
  }
}

function scAge(geography: string, value: number): SourcedNumber {
  return {
    value,
    year: 2021,
    period: '2021 Census',
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_AGE,
    sourceName: SC_AGE_SRC,
  }
}

function scIncome(geography: string, cad: number): IncomeFigure {
  return {
    value: cad,
    year: 2020,
    period: '2020 (2020 constant dollars)',
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_INC,
    sourceName: SC_INC_SRC,
    currency: 'CAD',
    valueUsd: cadToUsd(cad),
    fxNote: FX_NOTE,
  }
}

function scEdu(
  geography: string,
  ba2564: number,
  tot2564: number,
  ba65: number,
  tot65: number,
): EducationFigure {
  const bachelorPlus = ba2564 + ba65
  const total25Plus = tot2564 + tot65
  return {
    value: round1((bachelorPlus / total25Plus) * 100),
    year: 2021,
    period: '2021 Census',
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_EDU,
    sourceName: SC_EDU_SRC,
    bachelorPlus,
    total25Plus,
    method: SC_EDU_METHOD,
    note: `Published counts: 25 to 64 years, bachelor’s or higher ${ba2564.toLocaleString('en-US')} of ${tot2564.toLocaleString('en-US')}; 65 years and over, ${ba65.toLocaleString('en-US')} of ${tot65.toLocaleString('en-US')}.`,
  }
}

function scCommute(geography: string, minutes: number, commuters: number): CommuteFigure {
  return {
    value: minutes,
    year: 2021,
    period: '2021 Census (May 2021 reference week)',
    geography,
    geographyLevel: 'CSD',
    sourceUrl: SC_COM,
    sourceName: SC_COM_SRC,
    method: 'Average commuting duration as published by Statistics Canada (not recalculated).',
    workers: commuters,
  }
}

function usCommunity(opts: {
  label: string
  geography: string
  geographyLevel: GeoLevel
  geoid: string
  acsPop: number
  pep2020?: number
  pep2025?: number
  pepCountyFile?: boolean
  acs2019?: number
  age: number
  income: number
  ba: number
  ma: number
  prof: number
  phd: number
  total25: number
  aggMin: number
  workers: number
  note?: string
}): Community {
  const { geography, geographyLevel, geoid } = opts
  const usePep = opts.pep2020 != null && opts.pep2025 != null
  const population = usePep
    ? pepPop(geography, geographyLevel, opts.pep2025!, 2025, opts.pepCountyFile)
    : acsNum('B01003', 'Total Population', geography, geographyLevel, geoid, opts.acsPop)
  const growth = usePep
    ? pepGrowth(geography, geographyLevel, opts.pep2020!, opts.pep2025!, opts.pepCountyFile)
    : opts.acs2019 != null
      ? acsGrowth(geography, geographyLevel, geoid, opts.acs2019, opts.acsPop)
      : {
          pct: null,
          fromYear: '',
          toYear: '',
          fromValue: null,
          toValue: null,
          geography,
          geographyLevel,
          sourceUrl: acsTableUrl(2024, 'B01003', geoid),
          sourceName: ACS24,
          note: 'not available',
        }
  return {
    label: opts.label,
    geography,
    geographyLevel,
    country: 'US',
    population,
    populationSurvey: usePep
      ? acsNum('B01003', 'Total Population', geography, geographyLevel, geoid, opts.acsPop)
      : undefined,
    growth,
    medianAge: acsNum('B01002', 'Median Age by Sex, Total', geography, geographyLevel, geoid, opts.age),
    medianIncome: acsIncome(geography, geographyLevel, geoid, opts.income),
    bachelorPct: acsEdu(geography, geographyLevel, geoid, opts.ba, opts.ma, opts.prof, opts.phd, opts.total25),
    meanCommute: acsCommute(geography, geographyLevel, geoid, opts.aggMin, opts.workers),
    note: opts.note,
  }
}

function caCommunity(opts: {
  label: string
  geography: string
  census2021: number
  census2016: number
  censusChg: number
  est2020: number
  est2025: number
  age: number
  incomeCad: number
  ba2564: number
  tot2564: number
  ba65: number
  tot65: number
  commute: number
  commuters: number
  note?: string
}): Community {
  const g = opts.geography
  return {
    label: opts.label,
    geography: g,
    geographyLevel: 'CSD',
    country: 'Canada',
    population: scEst(g, opts.est2025, 2025),
    populationSurvey: scCensusPop(g, opts.census2021, 2021),
    growth: scEstGrowth(g, opts.est2020, opts.est2025),
    censusGrowth: scCensusGrowth(g, opts.census2016, opts.census2021, opts.censusChg),
    medianAge: scAge(g, opts.age),
    medianIncome: scIncome(g, opts.incomeCad),
    bachelorPct: scEdu(g, opts.ba2564, opts.tot2564, opts.ba65, opts.tot65),
    meanCommute: scCommute(g, opts.commute, opts.commuters),
    note: opts.note,
  }
}

const CS_GEOID = '1600000US1214400'
const CS_GEO = 'Coral Springs city, Florida'
export const CORAL_SPRINGS_POP: Community = usCommunity({
  label: 'Coral Springs, FL',
  geography: CS_GEO,
  geographyLevel: 'place',
  geoid: CS_GEOID,
  acsPop: 136103,
  pep2020: 134159,
  pep2025: 138783,
  age: 37.5,
  income: 93602,
  ba: 22141,
  ma: 9689,
  prof: 2314,
  phd: 1566,
  total25: 89404,
  aggMin: 1759570,
  workers: 58904,
  note: 'Baseline: current home. Incorporated place (city) in Broward County, Florida.',
})

const DAMASCUS = usCommunity({
  label: 'Damascus CDP, OR',
  geography: 'Damascus CDP, Oregon',
  geographyLevel: 'CDP',
  geoid: '1600000US4117800',
  acsPop: 11437,
  acs2019: 11161,
  age: 45.6,
  income: 122500,
  ba: 1884,
  ma: 634,
  prof: 145,
  phd: 138,
  total25: 8327,
  aggMin: 130145,
  workers: 4690,
  note: 'Census-designated place covering the former city of Damascus (disincorporated). Vintage 2025 place estimates are not published for this CDP. Growth is ACS 2015–2019 vs 2020–2024.',
})

const MARYVILLE_CITY = usCommunity({
  label: 'Maryville city, TN',
  geography: 'Maryville city, Tennessee',
  geographyLevel: 'place',
  geoid: '1600000US4746380',
  acsPop: 32392,
  pep2020: 31999,
  pep2025: 32442,
  age: 40.8,
  income: 81963,
  ba: 4920,
  ma: 2546,
  prof: 589,
  phd: 401,
  total25: 21972,
  aggMin: 327390,
  workers: 14060,
  note: 'Incorporated city, a part of Blount County. Shown for context; the comparison chart uses Blount County, which better matches the acreage focus.',
})

const CANTLEY = caCommunity({
  label: 'Cantley, Quebec',
  geography: 'Cantley, Quebec (CSD 2482020)',
  census2021: 11449,
  census2016: 10699,
  censusChg: 7.0,
  est2020: 11464,
  est2025: 12291,
  age: 40.0,
  incomeCad: 131000,
  ba2564: 2230,
  tot2564: 6565,
  ba65: 300,
  tot65: 1210,
  commute: 26.1,
  commuters: 4065,
})

const CHELSEA = caCommunity({
  label: 'Chelsea, Quebec',
  geography: 'Chelsea, Quebec (CSD 2482025)',
  census2021: 8000,
  census2016: 6909,
  censusChg: 15.8,
  est2020: 7541,
  est2025: 8998,
  age: 43.6,
  incomeCad: 146000,
  ba2564: 2690,
  tot2564: 4330,
  ba65: 495,
  tot65: 1240,
  commute: 22.8,
  commuters: 2215,
})

const OTTAWA = caCommunity({
  label: 'Ottawa, Ontario',
  geography: 'Ottawa, Ontario (CSD 3506008, ville / city)',
  census2021: 1017449,
  census2016: 934243,
  censusChg: 8.9,
  est2020: 1052089,
  est2025: 1188114,
  age: 40.0,
  incomeCad: 102000,
  ba2564: 268935,
  tot2564: 543305,
  ba65: 56455,
  tot65: 160435,
  commute: 23.0,
  commuters: 275695,
  note: 'Carp / Huntley, Dunrobin and North Gower are rural communities inside the City of Ottawa census subdivision. These figures are for the entire city, which is dominated by the urban core, not the rural wards alone. There is no separate 2021 Census Profile for those communities as CSDs.',
})

const HAMILTON = caCommunity({
  label: 'Hamilton, Ontario',
  geography: 'Hamilton, Ontario (CSD 3525005, city)',
  census2021: 569353,
  census2016: 536917,
  censusChg: 6.0,
  est2020: 588282,
  est2025: 640465,
  age: 40.8,
  incomeCad: 86000,
  ba2564: 93940,
  tot2564: 303405,
  ba65: 16560,
  tot65: 98575,
  commute: 25.3,
  commuters: 190275,
  note: 'Rural Flamborough is part of the City of Hamilton census subdivision. These figures are for the entire city, not Flamborough alone. There is no separate 2021 Census Profile for Flamborough as a CSD.',
})

const ORO = caCommunity({
  label: 'Oro-Medonte, Ontario',
  geography: 'Oro-Medonte, Ontario (CSD 3543023, township)',
  census2021: 23017,
  census2016: 21036,
  censusChg: 9.4,
  est2020: 23487,
  est2025: 24681,
  age: 47.6,
  incomeCad: 114000,
  ba2564: 3250,
  tot2564: 12100,
  ba65: 1010,
  tot65: 4920,
  commute: 29.4,
  commuters: 8220,
})

const KING = caCommunity({
  label: 'King, Ontario',
  geography: 'King, Ontario (CSD 3519049, township)',
  census2021: 27333,
  census2016: 24512,
  censusChg: 11.5,
  est2020: 28089,
  est2025: 29077,
  age: 43.2,
  incomeCad: 141000,
  ba2564: 5755,
  tot2564: 14280,
  ba65: 1090,
  tot65: 4415,
  commute: 30.5,
  commuters: 8650,
  note: 'The realistic acreage edge for this place is King Township (and neighbouring Vaughan north). Figures are for King Township, not the City of Toronto.',
})


const VICTOR = usCommunity({
  label: 'Victor town, NY',
  geography: 'Victor town, Ontario County, New York',
  geographyLevel: 'county subdivision',
  geoid: '0600000US3606977387',
  acsPop: 15989,
  pep2020: 15862,
  pep2025: 16422,
  pepCountyFile: false,
  age: 47.8,
  income: 115538,
  ba: 3604,
  ma: 2427,
  prof: 486,
  phd: 324,
  total25: 11803,
  aggMin: 134715,
  workers: 5904,
  note: 'The finger-lakes towns of this place. PEP Vintage 2025 is for the town (a county subdivision), not a city. Town of Mendon figures are under also.',
})

const MENDON = usCommunity({
  label: 'Mendon town, NY',
  geography: 'Mendon town, Monroe County, New York',
  geographyLevel: 'county subdivision',
  geoid: '0600000US3605546558',
  acsPop: 9019,
  pep2020: 9075,
  pep2025: 9072,
  pepCountyFile: false,
  age: 42.6,
  income: 131778,
  ba: 2118,
  ma: 1247,
  prof: 447,
  phd: 135,
  total25: 6245,
  aggMin: 85840,
  workers: 3158,
})

const STOKESDALE = usCommunity({
  label: 'Stokesdale, NC',
  geography: 'Stokesdale town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3765040',
  acsPop: 6004,
  pep2020: 5922,
  pep2025: 6133,
  pepCountyFile: false,
  age: 45.7,
  income: 121071,
  ba: 1233,
  ma: 484,
  prof: 75,
  phd: 38,
  total25: 4235,
  aggMin: 52980,
  workers: 2029,
  note: 'The three towns of this place, plus Summerfield as a nearby comparison (not a fourth town of the place itself). Summerfield town ACS 2024 5-year population is 11,116 (median age 47.3, median household income $133,594, 56.2% of adults 25+ with a bachelor’s or higher, mean commute 27.3 minutes); Census PEP Vintage 2025 is 10,956 (1 Apr 2020) to 11,327 (1 Jul 2025), a 3.4% change. Guilford County is a much larger geography and is not used as a proxy.',
})

const OAK_RIDGE = usCommunity({
  label: 'Oak Ridge, NC',
  geography: 'Oak Ridge town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3748480',
  acsPop: 7744,
  pep2020: 7637,
  pep2025: 7896,
  pepCountyFile: false,
  age: 44.2,
  income: 155385,
  ba: 1651,
  ma: 1017,
  prof: 87,
  phd: 211,
  total25: 5203,
  aggMin: 54070,
  workers: 2628,
})

const KERNERSVILLE = usCommunity({
  label: 'Kernersville, NC',
  geography: 'Kernersville town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3735600',
  acsPop: 27830,
  pep2020: 26565,
  pep2025: 29128,
  pepCountyFile: false,
  age: 39.3,
  income: 71918,
  ba: 4427,
  ma: 2024,
  prof: 241,
  phd: 378,
  total25: 19112,
  aggMin: 277010,
  workers: 12235,
})

const PINE_TWP = usCommunity({
  label: 'Pine Township, PA',
  geography: 'Pine township, Allegheny County, Pennsylvania',
  geographyLevel: 'county subdivision',
  geoid: '0600000US4200360272',
  acsPop: 15224,
  pep2020: 14753,
  pep2025: 15475,
  pepCountyFile: false,
  age: 38.3,
  income: 184591,
  ba: 4385,
  ma: 2065,
  prof: 686,
  phd: 596,
  total25: 10119,
  aggMin: 139410,
  workers: 5383,
  note: 'Wexford is an unincorporated community in Pine Township (and neighbouring McCandless / Franklin Park). Figures here are for Pine Township, a county subdivision, not the City of Pittsburgh. Franklin Park borough is under also.',
})

const FRANKLIN_PARK = usCommunity({
  label: 'Franklin Park, PA',
  geography: 'Franklin Park borough, Allegheny County, Pennsylvania (county subdivision)',
  geographyLevel: 'county subdivision',
  geoid: '0600000US4200327552',
  acsPop: 15235,
  pep2020: 15492,
  pep2025: 14978,
  pepCountyFile: false,
  age: 41.3,
  income: 176875,
  ba: 4368,
  ma: 2367,
  prof: 835,
  phd: 573,
  total25: 10557,
  aggMin: 158160,
  workers: 6270,
})

const APEX = usCommunity({
  label: 'Apex, NC',
  geography: 'Apex town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3701520',
  acsPop: 70630,
  pep2020: 65249,
  pep2025: 80419,
  pepCountyFile: false,
  age: 36.4,
  income: 144135,
  ba: 18070,
  ma: 11476,
  prof: 958,
  phd: 1703,
  total25: 46327,
  aggMin: 587865,
  workers: 23289,
  note: 'The two towns of this place. The 23.2% PEP change for Apex (65,249 on 1 Apr 2020 to 80,419 on 1 Jul 2025) is the official Census estimate; ACS 2024 5-year is a period estimate and is lower. Wake County as a whole is a much larger geography and is not used as a proxy.',
})

const HOLLY_SPRINGS = usCommunity({
  label: 'Holly Springs, NC',
  geography: 'Holly Springs town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3732260',
  acsPop: 45248,
  pep2020: 41570,
  pep2025: 50288,
  pepCountyFile: false,
  age: 36.5,
  income: 135578,
  ba: 11382,
  ma: 6045,
  prof: 956,
  phd: 578,
  total25: 28174,
  aggMin: 426360,
  workers: 14813,
})

const WAXHAW = usCommunity({
  label: 'Waxhaw, NC',
  geography: 'Waxhaw town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3771460',
  acsPop: 22275,
  pep2020: 20781,
  pep2025: 23140,
  pepCountyFile: false,
  age: 36.2,
  income: 131894,
  ba: 4596,
  ma: 2123,
  prof: 400,
  phd: 207,
  total25: 13313,
  aggMin: 244760,
  workers: 7659,
  note: 'Waxhaw is the Union County town of this place. Davidson town (Mecklenburg and Iredell Counties — not Davidson County) is the Lake Norman comparison under also. Union County and Mecklenburg County as wholes are much larger geographies and are not used as proxies.',
})

const DAVIDSON_NC = usCommunity({
  label: 'Davidson, NC',
  geography: 'Davidson town, North Carolina',
  geographyLevel: 'place',
  geoid: '1600000US3716400',
  acsPop: 15660,
  pep2020: 14885,
  pep2025: 16662,
  pepCountyFile: false,
  age: 41.9,
  income: 166556,
  ba: 3661,
  ma: 2476,
  prof: 741,
  phd: 666,
  total25: 9955,
  aggMin: 122960,
  workers: 5089,
})

const GUELPH_ERAMOSA = caCommunity({
  label: 'Guelph/Eramosa, Ontario',
  geography: 'Guelph/Eramosa, Ontario (CSD 3523009, township)',
  census2021: 13904,
  census2016: 12854,
  censusChg: 8.2,
  est2020: 14175,
  est2025: 14870,
  age: 45.2,
  incomeCad: 129000,
  ba2564: 2285,
  tot2564: 7295,
  ba65: 545,
  tot65: 2510,
  commute: 27.4,
  commuters: 4985,
  note: 'Figures are for Guelph/Eramosa Township, not the City of Guelph (a separate CSD). The City of Guelph is the nearest urban centre and is not used as a proxy.',
})

const COCHRANE_AB = caCommunity({
  label: 'Cochrane, Alberta',
  geography: 'Cochrane, Alberta (CSD 4806019, town)',
  census2021: 32199,
  census2016: 25853,
  censusChg: 24.5,
  est2020: 32087,
  est2025: 39397,
  age: 39.2,
  incomeCad: 113000,
  ba2564: 5450,
  tot2564: 17115,
  ba65: 1095,
  tot65: 4525,
  commute: 27.6,
  commuters: 11470,
  note: 'Figures are for the Town of Cochrane, not the City of Calgary and not the Municipal District of Rocky View. The 24.5% census change (2016–2021) and the 1 July 2025 estimate of 39,397 are official Statistics Canada figures.',
})

function ottawaPlace(placeId: string): PlacePopulation {
  return {
    placeId,
    country: 'Canada',
    checked: POP_CHECKED,
    primary: OTTAWA,
    note: OTTAWA.note,
  }
}

export const POPULATION: Record<string, PlacePopulation> = {
  forsyth: {
    placeId: 'forsyth',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Forsyth County, GA',
      geography: 'Forsyth County, Georgia',
      geographyLevel: 'county',
      geoid: '0500000US13117',
      acsPop: 267287,
      pep2020: 252877,
      pep2025: 282805,
      pepCountyFile: true,
      age: 39.7,
      income: 143784,
      ba: 61824,
      ma: 32105,
      prof: 4438,
      phd: 2948,
      total25: 177353,
      aggMin: 2811715,
      workers: 91892,
    }),
    note: 'East Forsyth (Cumming / Pilgrim Mill side) is not itself a census place. Figures are for all of Forsyth County, Georgia, not the east side alone. Cumming city is a small incorporated area (ACS 2020–2024 population 8,469) and is not used as the headline geography.',
  },
  'happy-valley': {
    placeId: 'happy-valley',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Happy Valley city, OR',
      geography: 'Happy Valley city, Oregon',
      geographyLevel: 'place',
      geoid: '1600000US4132050',
      acsPop: 26738,
      pep2020: 23710,
      pep2025: 28916,
      age: 39.0,
      income: 122151,
      ba: 5083,
      ma: 2069,
      prof: 762,
      phd: 224,
      total25: 17524,
      aggMin: 275085,
      workers: 10024,
    }),
    also: [DAMASCUS],
    note: 'The place is Happy Valley / western Damascus. The comparison chart uses Happy Valley city. Damascus is a separate CDP; its official figures are shown alongside. The city has annexed land in recent years, which is part of why the July 2020–2025 estimate rises faster than the CDP.',
  },
  duvall: {
    placeId: 'duvall',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Duvall city, WA',
      geography: 'Duvall city, Washington',
      geographyLevel: 'place',
      geoid: '1600000US5319035',
      acsPop: 8526,
      pep2020: 8045,
      pep2025: 9440,
      age: 36.0,
      income: 197361,
      ba: 2079,
      ma: 958,
      prof: 15,
      phd: 163,
      total25: 5424,
      aggMin: 75535,
      workers: 2426,
    }),
    note: 'Figures are for Duvall city. Acreage in the Snoqualmie Valley outside city limits is a different geography (and is not a single census place). With a small city population, ACS margins of error are wider than for a large county.',
  },
  maryville: {
    placeId: 'maryville',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Blount County, TN',
      geography: 'Blount County, Tennessee',
      geographyLevel: 'county',
      geoid: '0500000US47009',
      acsPop: 139333,
      pep2020: 135666,
      pep2025: 143820,
      pepCountyFile: true,
      age: 43.7,
      income: 77365,
      ba: 18486,
      ma: 7570,
      prof: 1728,
      phd: 1227,
      total25: 101321,
      aggMin: 1487325,
      workers: 58823,
    }),
    also: [MARYVILLE_CITY],
    note: 'The place is Maryville / Blount County, aimed at acreage, so the headline geography is Blount County. Maryville city is shown alongside for context.',
  },
  elizabeth: {
    placeId: 'elizabeth',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Elizabeth CCD, CO',
      geography: 'Elizabeth CCD, Elbert County, Colorado',
      geographyLevel: 'county subdivision',
      geoid: '0600000US0803991190',
      acsPop: 25867,
      acs2019: 23490,
      age: 45.2,
      income: 135930,
      ba: 4812,
      ma: 1565,
      prof: 298,
      phd: 234,
      total25: 18700,
      aggMin: 435900,
      workers: 10439,
    }),
    note: 'Elizabeth-area acreage is typically in unincorporated Elbert County. The Elizabeth county subdivision (CCD) is the most local published geography that covers that area; it is not the same as the small incorporated town. Vintage 2025 estimates are not published for CCDs, so population and growth here are ACS 5-year (2015–2019 vs 2020–2024). For context, Elizabeth town (place) had an ACS 2020–2024 population of 2,244 and a Vintage 2025 estimate of 2,957 on 1 July 2025 (1,710 on 1 July 2020). Elbert County as a whole had a Vintage 2025 estimate of 30,534 on 1 July 2025 (26,211 on 1 July 2020). Town and county figures are from the same ACS 2024 5-year Summary File and Vintage 2025 estimate files cited for the CCD.',
  },
  boise: {
    placeId: 'boise',
    country: 'US',
    checked: POP_CHECKED,
    primary: usCommunity({
      label: 'Boise Hills CCD, ID',
      geography: 'Boise Hills CCD, Ada County, Idaho',
      geographyLevel: 'county subdivision',
      geoid: '0600000US1600190368',
      acsPop: 11557,
      acs2019: 8973,
      age: 45.2,
      income: 149340,
      ba: 2965,
      ma: 1703,
      prof: 272,
      phd: 301,
      total25: 8267,
      aggMin: 94985,
      workers: 3722,
    }),
    note: 'The place is the Boise foothills. Boise Hills CCD is the county subdivision that covers the hills; it is a better fit than Boise city or all of Ada County, whose incomes and education figures are substantially different. Vintage 2025 estimates are not published for this CCD, so population and growth are ACS 5-year (2015–2019 vs 2020–2024). For context, Boise City city ACS 2020–2024 population was 237,242 and median household income $83,904; Ada County population 518,935 and median household income $91,502 (same ACS 2024 5-year Summary File).',
  },
  cantley: {
    placeId: 'cantley',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: CANTLEY,
    also: [CHELSEA],
    note: 'Chelsea and Cantley are neighbouring municipalities (separate census subdivisions) in the MRC des Collines-de-l’Outaouais. Official figures are shown for both; they are not combined, because medians and averages cannot be added. The Graphs page plots both CSDs.',
  },
  'on-carp-huntley': ottawaPlace('on-carp-huntley'),
  'on-dunrobin': ottawaPlace('on-dunrobin'),
  'on-north-gower': ottawaPlace('on-north-gower'),
  'on-flamborough': {
    placeId: 'on-flamborough',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: HAMILTON,
    note: HAMILTON.note,
  },
  'on-oro-medonte': {
    placeId: 'on-oro-medonte',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: ORO,
  },
  toronto: {
    placeId: 'toronto',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: KING,
    note: KING.note,
  },

  'victor-mendon': {
    placeId: 'victor-mendon',
    country: 'US',
    checked: POP_CHECKED,
    primary: VICTOR,
    also: [MENDON],
    note: VICTOR.note,
  },
  stokesdale: {
    placeId: 'stokesdale',
    country: 'US',
    checked: POP_CHECKED,
    primary: STOKESDALE,
    also: [OAK_RIDGE, KERNERSVILLE],
    note: STOKESDALE.note,
  },
  'wexford-pine': {
    placeId: 'wexford-pine',
    country: 'US',
    checked: POP_CHECKED,
    primary: PINE_TWP,
    also: [FRANKLIN_PARK],
    note: PINE_TWP.note,
  },
  'apex-holly-springs': {
    placeId: 'apex-holly-springs',
    country: 'US',
    checked: POP_CHECKED,
    primary: APEX,
    also: [HOLLY_SPRINGS],
    note: APEX.note,
  },
  'guelph-eramosa': {
    placeId: 'guelph-eramosa',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: GUELPH_ERAMOSA,
    note: GUELPH_ERAMOSA.note,
  },
  cochrane: {
    placeId: 'cochrane',
    country: 'Canada',
    checked: POP_CHECKED,
    primary: COCHRANE_AB,
    note: COCHRANE_AB.note,
  },
  'waxhaw-lake-norman': {
    placeId: 'waxhaw-lake-norman',
    country: 'US',
    checked: POP_CHECKED,
    primary: WAXHAW,
    also: [DAVIDSON_NC],
    note: WAXHAW.note,
  },
}

export function populationFor(placeId: string): PlacePopulation | undefined {
  return POPULATION[placeId]
}

export function communitiesOf(p: PlacePopulation | Community | undefined): Community[] {
  if (!p) return []
  if ('primary' in p) return [p.primary, ...(p.also ?? [])]
  return [p]
}

export function formatCount(n: number | null | undefined): string {
  if (n == null) return 'not available'
  return n.toLocaleString('en-US')
}

export function formatPct(n: number | null | undefined, digits = 1): string {
  if (n == null) return 'not available'
  return `${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`
}

export function formatYears(n: number | null | undefined): string {
  if (n == null) return 'not available'
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function formatMinutes(n: number | null | undefined): string {
  if (n == null) return 'not available'
  return `${n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} min`
}

export function formatMoney(n: number | null | undefined, currency: 'USD' | 'CAD' = 'USD'): string {
  if (n == null) return 'not available'
  const symbol = currency === 'CAD' ? 'CA$' : 'US$'
  return `${symbol}${n.toLocaleString('en-US')}`
}

export function growthLabel(g: GrowthFigure): string {
  if (g.pct == null || g.fromValue == null || g.toValue == null) return 'not available'
  const sign = g.pct > 0 ? '+' : ''
  return `${sign}${formatPct(g.pct)} (${g.fromYear}–${g.toYear})`
}

/** Every numeric figure that must have source, year and geography. Used by check:sync. */
export function allPopulationFigures(): {
  placeId: string
  kind: string
  value: number | null
  year: number | string
  geography: string
  sourceUrl: string
}[] {
  const rows: {
    placeId: string
    kind: string
    value: number | null
    year: number | string
    geography: string
    sourceUrl: string
  }[] = []
  const addComm = (placeId: string, c: Community, prefix = '') => {
    const pfx = prefix ? `${prefix}.` : ''
    const add = (kind: string, f: SourcedNumber | GrowthFigure) => {
      const value = 'value' in f ? f.value : f.pct
      const year = 'year' in f ? `${f.year}` : `${f.fromYear}–${f.toYear}`
      rows.push({
        placeId,
        kind: pfx + kind,
        value,
        year,
        geography: f.geography,
        sourceUrl: f.sourceUrl,
      })
    }
    add('population', c.population)
    if (c.populationSurvey) add('populationSurvey', c.populationSurvey)
    add('growth', c.growth)
    if (c.censusGrowth) add('censusGrowth', c.censusGrowth)
    add('medianAge', c.medianAge)
    add('medianIncome', c.medianIncome)
    if (c.medianIncome.valueUsd != null && c.medianIncome.currency === 'CAD') {
      rows.push({
        placeId,
        kind: pfx + 'medianIncomeUsd',
        value: c.medianIncome.valueUsd,
        year: `${c.medianIncome.year} (converted)`,
        geography: c.medianIncome.geography,
        sourceUrl: c.medianIncome.sourceUrl,
      })
    }
    add('bachelorPct', c.bachelorPct)
    add('meanCommute', c.meanCommute)
  }
  addComm('coral-springs', CORAL_SPRINGS_POP)
  const seen = new Set<string>()
  for (const p of Object.values(POPULATION)) {
    if (seen.has(p.placeId)) continue
    seen.add(p.placeId)
    addComm(p.placeId, p.primary)
    ;(p.also ?? []).forEach((c, i) => addComm(p.placeId, c, `also${i}`))
  }
  return rows
}

export const POP_PLACE_IDS = Object.keys(POPULATION)
