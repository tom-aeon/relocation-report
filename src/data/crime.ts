// Crime rates for places still in play, plus a Coral Springs, FL baseline.
// Every figure is taken from the named official source. Nothing is estimated.
// A missing rate is null ("not available") — never 0. A 0 is used only when
// the source reported zero offences, and is flagged reportedZero.
// US and Canadian offence definitions differ; cross-border comparisons are approximate.
// Checked 12 Nov 2026.

export type CrimeLevel = 'city' | 'county' | 'police service'

export interface CrimeFigure {
  /** Rate per 100,000. null = not available. */
  ratePer100k: number | null
  /** Offence / incident count. null = not available. */
  incidents: number | null
  /** Population the agency served, as given by the source. null if the source did not publish one. */
  population: number | null
  year: number
  agency: string
  level: CrimeLevel
  sourceUrl: string
  sourceName: string
  /** e.g. "12 of 12 months reported" */
  coverage?: string
  note?: string
  /** True when rate 0 means the agency reported zero offences, not missing data. */
  reportedZero?: boolean
}

export interface CrimeIndex {
  value: number | null
  year: number
  agency: string
  level: CrimeLevel | 'CMA' | 'country'
  sourceUrl: string
  sourceName: string
  note?: string
}

export interface PlaceCrime {
  placeId: string
  country: 'US' | 'Canada'
  checked: string
  violent: CrimeFigure
  property: CrimeFigure
  /** Canada only: Crime Severity Index (Canada 2006 = 100). Not comparable to a US rate. */
  csi?: CrimeIndex
  violentCsi?: CrimeIndex
  note?: string
}

export type CrimeBand = 'lower' | 'similar' | 'higher' | 'no-data'

export const CRIME_CHECKED = '12 Nov 2026'

const FBI_CDE = 'https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/explorer/crime/crime-trend'
const FBI_SOURCE =
  'FBI Crime Data Explorer, summarized agency offence data, refreshed 15 Oct 2026. Rate = reported offences ÷ FBI agency population × 100,000, from 12 complete months. Violent crime is murder, rape, robbery and aggravated assault. Property crime is burglary, larceny-theft and motor vehicle theft (arson is counted separately).'
const SC_DAILY = 'https://www150.statcan.gc.ca/n1/daily-quotidien/260722/dq260722a-eng.htm'
const SC_ON_INC = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510018001'
const SC_QC_INC = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510017901'
const SC_ON_CSI = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510018801'
const SC_QC_CSI = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510018701'
const SC_INC_SOURCE =
  'Statistics Canada, Incident-based crime statistics, by detailed violations, police services, 2025 (released 22 Jul 2026). Rate per 100,000 population as published. “Total violent Criminal Code violations” and “Total property crime violations.”'
const SC_CSI_SOURCE =
  'Statistics Canada, Crime severity index and weighted clearance rates, police services, 2025 (released 22 Jul 2026). Canada CSI in 2025 was 75.01 (The Daily, 22 Jul 2026).'

export const CROSS_BORDER_NOTE =
  'US and Canadian crime figures are not directly comparable. The FBI’s violent-crime total is murder, rape, robbery and aggravated assault. Statistics Canada’s “Total violent Criminal Code violations” is broader and also includes offences such as uttering threats and criminal harassment. Property categories also differ (Canada includes mischief; the FBI’s property total is burglary, larceny-theft and motor vehicle theft). Comparisons across the border are approximate and should be read with that caveat. Canadian places also have a Crime Severity Index, which has no US counterpart here.'

export const CRIME_METHOD =
  `US figures are the latest complete calendar year (2025) from the FBI Crime Data Explorer (data refreshed 15 Oct 2026): 12 months of agency offence counts divided by that year’s FBI agency population, × 100,000. The 2026 year is incomplete and is not used. Canada figures are 2025 police-service rates and the Crime Severity Index from Statistics Canada (The Daily, 22 Jul 2026, and tables 35-10-0179-01, 35-10-0180-01, 35-10-0187-01, 35-10-0188-01). Each place uses the most local reporting agency that covers it. A missing figure is shown as “not available,” never as 0. ${CROSS_BORDER_NOTE} Checked ${CRIME_CHECKED}.`

/** Similar means within ±15% of the Coral Springs rate. */
export const SIMILAR_PCT = 15

const fbi = (
  agency: string,
  level: CrimeLevel,
  ori: string,
  year: number,
  incidents: number,
  population: number,
  rate: number,
  coverage = '12 of 12 months reported',
  extra?: Partial<CrimeFigure>,
): CrimeFigure => ({
  ratePer100k: rate,
  incidents,
  population,
  year,
  agency,
  level,
  sourceUrl: FBI_CDE,
  sourceName: `${FBI_SOURCE} ORI ${ori}.`,
  coverage,
  ...extra,
})

const scRate = (
  agency: string,
  level: CrimeLevel,
  year: number,
  incidents: number,
  rate: number,
  sourceUrl: string,
  extra?: Partial<CrimeFigure>,
): CrimeFigure => ({
  ratePer100k: rate,
  incidents,
  population: null,
  year,
  agency,
  level,
  sourceUrl,
  sourceName: SC_INC_SOURCE,
  ...extra,
})

const scCsi = (
  agency: string,
  year: number,
  value: number,
  sourceUrl: string,
  extra?: Partial<CrimeIndex>,
): CrimeIndex => ({
  value,
  year,
  agency,
  level: 'police service',
  sourceUrl,
  sourceName: SC_CSI_SOURCE,
  ...extra,
})

export const CORAL_SPRINGS: PlaceCrime = {
  placeId: 'coral-springs',
  country: 'US',
  checked: CRIME_CHECKED,
  violent: fbi('Coral Springs Police Department', 'city', 'FL0062800', 2025, 168, 141436, 118.8),
  property: fbi('Coral Springs Police Department', 'city', 'FL0062800', 2025, 1256, 141436, 888.0),
  note: 'Baseline: current home. City police department, Broward County, Florida. Coordinates used on the map are the FBI’s agency location (26.264788, −80.26626).',
}

export const CORAL_SPRINGS_COORDS = { lat: 26.264788, lng: -80.26626, name: 'Coral Springs, FL', short: 'Coral Springs (baseline)' }

const OTTAWA_AGENCY = 'Ottawa Police Service'
const OTTAWA_NOTE =
  'Carp / Huntley, Dunrobin and North Gower are in the City of Ottawa and are served by the Ottawa Police Service. Figures are for the whole service, not the rural wards alone. Ottawa CMA (Ontario part) Crime Severity Index was 50.61 in 2025 (Statistics Canada, The Daily, 22 Jul 2026, Table 35-10-0026-01), close to the police-service CSI of 52.23.'

function ottawaCrime(placeId: string): PlaceCrime {
  return {
    placeId,
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate(OTTAWA_AGENCY, 'police service', 2025, 9576, 805.98, SC_ON_INC),
    property: scRate(OTTAWA_AGENCY, 'police service', 2025, 35700, 3004.76, SC_ON_INC),
    csi: scCsi(OTTAWA_AGENCY, 2025, 52.23, SC_ON_CSI),
    violentCsi: scCsi(OTTAWA_AGENCY, 2025, 62.63, SC_ON_CSI),
    note: OTTAWA_NOTE,
  }
}

export const CRIME: Record<string, PlaceCrime> = {
  forsyth: {
    placeId: 'forsyth',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi("Forsyth County Sheriff's Office", 'county', 'GA0580000', 2025, 153, 276364, 55.4),
    property: fbi("Forsyth County Sheriff's Office", 'county', 'GA0580000', 2025, 870, 276364, 314.8),
    note: 'East Forsyth acreage is in unincorporated Forsyth County, covered by the sheriff. Cumming Police Department has its own jurisdiction for the city of Cumming but published no offence data in the FBI CDE for 2023–2025. The sheriff’s population is the unincorporated county (not including cities with their own departments).',
  },
  'happy-valley': {
    placeId: 'happy-valley',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi("Clackamas County Sheriff's Office", 'county', 'OR0030000', 2025, 516, 245076, 210.5),
    property: fbi("Clackamas County Sheriff's Office", 'county', 'OR0030000', 2025, 3982, 245076, 1624.8),
    note: 'Happy Valley contracts with the Clackamas County Sheriff’s Office for police services; there is no separate FBI-reporting municipal department. The example listings are in unincorporated Damascus, also covered by the sheriff. These figures are for the sheriff’s entire service area (unincorporated Clackamas County and contract cities), not Happy Valley or Damascus alone.',
  },
  duvall: {
    placeId: 'duvall',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi('Duvall Police Department', 'city', 'WA0171800', 2025, 1, 9484, 10.5, '12 of 12 months reported', {
      note: 'Small-city counts swing a lot: 7 violent offences in 2023 (81.0 per 100,000), then 1 in 2024 and 1 in 2025.',
    }),
    property: fbi('Duvall Police Department', 'city', 'WA0171800', 2025, 16, 9484, 168.7),
    note: 'Most local agency for Duvall itself. Acreage in the Snoqualmie Valley outside city limits is covered by the King County Sheriff’s Office (a different jurisdiction). With a served population under 10,000, a single offence moves the violent-crime rate sharply.',
  },
  maryville: {
    placeId: 'maryville',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi("Blount County Sheriff's Office", 'county', 'TN0050000', 2025, 238, 96610, 246.4),
    property: fbi("Blount County Sheriff's Office", 'county', 'TN0050000', 2025, 312, 96610, 322.9),
    note: 'The place is Maryville / Blount County, aimed at acreage, so the covering agency used here is the Blount County Sheriff’s Office (unincorporated county). Maryville Police Department is a separate city agency: in 2025 it reported 52 violent offences (160.2 per 100,000) and 230 property offences (708.5 per 100,000) among 32,465 people served (FBI CDE, ORI TN0050200, 12 of 12 months, refreshed 15 Oct 2026).',
  },
  elizabeth: {
    placeId: 'elizabeth',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi("Elbert County Sheriff's Office", 'county', 'CO0200000', 2025, 16, 26584, 60.2),
    property: fbi("Elbert County Sheriff's Office", 'county', 'CO0200000', 2025, 64, 26584, 240.7),
    note: 'Elizabeth-area acreage is typically in unincorporated Elbert County, covered by the sheriff. Elizabeth Police Department covers the town proper only (FBI population 3,126 in 2025): it reported 0 violent offences (a genuine reported zero, not missing data) and 20 property offences (639.8 per 100,000) in 2025 (FBI CDE, ORI CO0200100, 12 of 12 months, refreshed 15 Oct 2026). Small-town rates swing sharply.',
  },
  boise: {
    placeId: 'boise',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi("Ada County Sheriff's Office", 'county', 'ID0010000', 2025, 210, 145483, 144.3),
    property: fbi("Ada County Sheriff's Office", 'county', 'ID0010000', 2025, 475, 145483, 326.5),
    note: 'The place is the Boise foothills, where acreage is often unincorporated Ada County, covered by the sheriff. Boise Police Department covers the city: in 2025 it reported 692 violent offences (290.2 per 100,000) and 2,031 property offences (851.8 per 100,000) among 238,450 people served (FBI CDE, ORI ID0010100, 12 of 12 months, refreshed 15 Oct 2026). The two qualifying listings are in southwest Boise valley (83709) and may fall under the city department rather than the sheriff.',
  },
  cantley: {
    placeId: 'cantley',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate(
      "Service de police de la MRC des Collines-de-l'Outaouais",
      'police service',
      2025,
      462,
      787.07,
      SC_QC_INC,
    ),
    property: scRate(
      "Service de police de la MRC des Collines-de-l'Outaouais",
      'police service',
      2025,
      450,
      766.62,
      SC_QC_INC,
    ),
    csi: scCsi("Service de police de la MRC des Collines-de-l'Outaouais", 2025, 26.52, SC_QC_CSI),
    violentCsi: scCsi("Service de police de la MRC des Collines-de-l'Outaouais", 2025, 44.3, SC_QC_CSI),
    note: "Chelsea and Cantley are in the MRC des Collines-de-l'Outaouais and are served by that MRC’s municipal police service (Statistics Canada geography: Collines-de-l'Outaouais Region, Quebec, municipal [24382]). Figures are for the whole MRC service, not Cantley or Chelsea alone. The Ottawa–Gatineau CMA, Quebec part, CSI was 60.55 in 2025 — a wider urban area that includes Gatineau, not this rural MRC.",
  },
  'on-carp-huntley': ottawaCrime('on-carp-huntley'),
  'on-dunrobin': ottawaCrime('on-dunrobin'),
  'on-north-gower': ottawaCrime('on-north-gower'),
  'on-flamborough': {
    placeId: 'on-flamborough',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate('Hamilton Police Service', 'police service', 2025, 7930, 1238.16, SC_ON_INC),
    property: scRate('Hamilton Police Service', 'police service', 2025, 18399, 2872.76, SC_ON_INC),
    csi: scCsi('Hamilton Police Service', 2025, 62.21, SC_ON_CSI),
    violentCsi: scCsi('Hamilton Police Service', 2025, 82.64, SC_ON_CSI),
    note: 'Rural Flamborough is part of the City of Hamilton and is served by the Hamilton Police Service. Figures are for the whole service, not Flamborough alone. Hamilton CMA CSI was 54.82 in 2025 (Statistics Canada, The Daily, 22 Jul 2026, Table 35-10-0026-01); the police-service CSI is 62.21.',
  },
  'on-oro-medonte': {
    placeId: 'on-oro-medonte',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate(
      'Ontario Provincial Police, Orillia (Oro-Medonte) rural detachment',
      'police service',
      2025,
      133,
      538.88,
      SC_ON_INC,
    ),
    property: scRate(
      'Ontario Provincial Police, Orillia (Oro-Medonte) rural detachment',
      'police service',
      2025,
      259,
      1049.39,
      SC_ON_INC,
    ),
    csi: scCsi('Ontario Provincial Police, Orillia (Oro-Medonte) rural detachment', 2025, 24.79, SC_ON_CSI),
    violentCsi: scCsi('Ontario Provincial Police, Orillia (Oro-Medonte) rural detachment', 2025, 30.67, SC_ON_CSI),
    note: 'Oro-Medonte is served by the Ontario Provincial Police. Statistics Canada reports this as “Orillia (Oro-Medonte), Ontario, Ontario Provincial Police, rural [35254].” One example listing is in neighbouring Springwater (Huronia West / Springwater OPP), a different detachment. Barrie CMA CSI was 46.93 in 2025; Barrie itself has a municipal police service and is not the covering agency for Oro-Medonte.',
  },
  toronto: {
    placeId: 'toronto',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate('York Regional Police', 'police service', 2025, 12425, 956.56, SC_ON_INC),
    property: scRate('York Regional Police', 'police service', 2025, 25774, 1984.26, SC_ON_INC),
    csi: scCsi('York Regional Police', 2025, 50.28, SC_ON_CSI),
    violentCsi: scCsi('York Regional Police', 2025, 63.17, SC_ON_CSI),
    note: 'The realistic acreage edge is King Township / Vaughan north, served by York Regional Police, not the Toronto Police Service. Figures are for all of York Region. Toronto Police Service (the city) in 2025: violent 1,158.13 and property 3,185.74 per 100,000; CSI 59.98 (Statistics Canada tables 35-10-0180-01 and 35-10-0188-01). Toronto CMA CSI was 54.99 (The Daily, 22 Jul 2026, Table 35-10-0026-01).',
  },
}

export const CANADA_CSI_2025: CrimeIndex = {
  value: 75.01,
  year: 2025,
  agency: 'Canada (national)',
  level: 'country',
  sourceUrl: SC_DAILY,
  sourceName: 'Statistics Canada, The Daily, Police-reported crime statistics in Canada, 2025, 22 Jul 2026. Table 35-10-0026-01.',
}

export function crimeFor(placeId: string): PlaceCrime | undefined {
  return CRIME[placeId]
}

export function compareRate(
  placeRate: number | null | undefined,
  baseline: number | null | undefined,
): { pct: number | null; band: CrimeBand } {
  if (placeRate == null || baseline == null || baseline === 0) return { pct: null, band: 'no-data' }
  const pct = ((placeRate - baseline) / baseline) * 100
  if (Math.abs(pct) <= SIMILAR_PCT) return { pct, band: 'similar' }
  return { pct, band: pct < 0 ? 'lower' : 'higher' }
}

export const CRIME_BAND_META: Record<CrimeBand, { label: string; color: string; short: string }> = {
  lower: { label: 'Lower than Coral Springs', color: '#16a34a', short: 'Lower' },
  similar: { label: 'Similar to Coral Springs (±15%)', color: '#d97706', short: 'Similar' },
  higher: { label: 'Higher than Coral Springs', color: '#dc2626', short: 'Higher' },
  'no-data': { label: 'Not available', color: '#94a3b8', short: 'No data' },
}

export function bandForPlace(c: PlaceCrime | undefined, kind: 'violent' | 'property' = 'violent'): CrimeBand {
  if (!c) return 'no-data'
  return compareRate(c[kind].ratePer100k, CORAL_SPRINGS[kind].ratePer100k).band
}

export function formatRate(n: number | null | undefined): string {
  if (n == null) return 'not available'
  return n.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 })
}

export function formatPct(pct: number | null): string {
  if (pct == null) return 'not available'
  const abs = Math.abs(pct)
  const rounded = abs < 10 ? abs.toFixed(0) : Math.round(abs).toString()
  if (Math.abs(pct) <= SIMILAR_PCT) {
    const dir = pct === 0 ? 'the same as' : pct < 0 ? 'lower than' : 'higher than'
    return `${rounded}% ${dir} Coral Springs (within ±${SIMILAR_PCT}%, similar)`
  }
  return pct < 0 ? `${rounded}% lower than Coral Springs` : `${rounded}% higher than Coral Springs`
}

/** Every figure (rate or index) that must have source, year and agency. Used by check:sync. */
export function allCrimeFigures(): { placeId: string; kind: string; year: number; agency: string; sourceUrl: string; rateOrValue: number | null; incidents?: number | null; reportedZero?: boolean }[] {
  const rows: { placeId: string; kind: string; year: number; agency: string; sourceUrl: string; rateOrValue: number | null; incidents?: number | null; reportedZero?: boolean }[] = []
  const add = (placeId: string, kind: string, f: CrimeFigure | CrimeIndex) => {
    const rateOrValue = 'ratePer100k' in f ? f.ratePer100k : f.value
    rows.push({
      placeId,
      kind,
      year: f.year,
      agency: f.agency,
      sourceUrl: f.sourceUrl,
      rateOrValue,
      incidents: 'incidents' in f ? f.incidents : undefined,
      reportedZero: 'reportedZero' in f ? f.reportedZero : undefined,
    })
  }
  const places = [CORAL_SPRINGS, ...Object.values(CRIME)]
  // Deduplicate Ottawa-shared figures still once per place (each place has its own entry).
  const seen = new Set<string>()
  for (const p of places) {
    const key = p.placeId
    if (seen.has(key)) continue
    seen.add(key)
    add(p.placeId, 'violent', p.violent)
    add(p.placeId, 'property', p.property)
    if (p.csi) add(p.placeId, 'csi', p.csi)
    if (p.violentCsi) add(p.placeId, 'violentCsi', p.violentCsi)
  }
  add('canada', 'csi', CANADA_CSI_2025)
  return rows
}

export const CRIME_PLACE_IDS = Object.keys(CRIME)
