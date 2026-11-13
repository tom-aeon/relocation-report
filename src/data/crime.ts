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

/** An additional covering (or context-only) agency for a place that spans more than one jurisdiction. */
export interface CoveringCrime {
  /** What this agency covers. */
  covers: string
  violent: CrimeFigure
  property: CrimeFigure
  note?: string
  /** When true, shown as context only — not the covering agency for the named towns, and not used to classify the place. */
  notTheCoveringAgency?: boolean
}

export interface PlaceCrime {
  placeId: string
  country: 'US' | 'Canada'
  checked: string
  violent: CrimeFigure
  property: CrimeFigure
  /** Other local agencies for the same cluster, each with its own sourced rates. */
  also?: CoveringCrime[]
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
const SC_AB_INC = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510018301'
const SC_AB_CSI = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3510019001'
const NY_DCJS = 'https://data.ny.gov/Public-Safety/Index-Crimes-by-County-and-Agency-Beginning-1990/ca8h-8gjq'
const NY_DCJS_SRC =
  'NY Division of Criminal Justice Services, Index Crimes by County and Agency (Beginning 1990), data.ny.gov dataset ca8h-8gjq. Latest complete year in the table as of 12 Nov 2026 is 2024. The table does not publish a served population, so a rate is not computed from it here.'
const SC_INC_SOURCE =
  'Statistics Canada, Incident-based crime statistics, by detailed violations, police services, 2025 (released 22 Jul 2026). Rate per 100,000 population as published. “Total violent Criminal Code violations” and “Total property crime violations.”'
const SC_CSI_SOURCE =
  'Statistics Canada, Crime severity index and weighted clearance rates, police services, 2025 (released 22 Jul 2026). Canada CSI in 2025 was 75.01 (The Daily, 22 Jul 2026).'

export const CROSS_BORDER_NOTE =
  'US and Canadian crime figures are not directly comparable. The FBI’s violent-crime total is murder, rape, robbery and aggravated assault. Statistics Canada’s “Total violent Criminal Code violations” is broader and also includes offences such as uttering threats and criminal harassment. Property categories also differ (Canada includes mischief; the FBI’s property total is burglary, larceny-theft and motor vehicle theft). Comparisons across the border are approximate and should be read with that caveat. Canadian places also have a Crime Severity Index, which has no US counterpart here.'

export const CRIME_METHOD =
  `US figures are the latest complete calendar year (2025) from the FBI Crime Data Explorer (data refreshed 15 Oct 2026): 12 months of agency offence counts divided by that year’s FBI agency population, × 100,000. The 2026 year is incomplete and is not used. Canada figures are 2025 police-service rates and the Crime Severity Index from Statistics Canada (The Daily, 22 Jul 2026, and tables 35-10-0179-01, 35-10-0180-01, 35-10-0183-01, 35-10-0187-01, 35-10-0188-01, 35-10-0190-01). Each place uses the most local reporting agency that covers it. A missing figure is shown as “not available,” never as 0. ${CROSS_BORDER_NOTE} Checked ${CRIME_CHECKED}.`

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


const missingFigure = (
  agency: string,
  level: CrimeLevel,
  year: number,
  sourceUrl: string,
  sourceName: string,
  note: string,
): CrimeFigure => ({
  ratePer100k: null,
  incidents: null,
  population: null,
  year,
  agency,
  level,
  sourceUrl,
  sourceName,
  note,
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
  'victor-mendon': {
    placeId: 'victor-mendon',
    country: 'US',
    checked: CRIME_CHECKED,
    // Primary: Ontario County Sheriff, which covers Victor (and the 1431 State Route 444 listing). Both covering sheriffs are at or below Coral Springs on both rates.
    violent: fbi("Ontario County Sheriff's Office", 'county', 'NY0340000', 2025, 55, 87462, 62.9, '12 of 12 months reported', {
      note: 'Covers Victor, Farmington, and other Ontario County towns with no municipal PD. Neither Victor nor Mendon has its own PD.',
    }),
    property: fbi("Ontario County Sheriff's Office", 'county', 'NY0340000', 2025, 443, 87462, 506.5, '12 of 12 months reported'),
    also: [
      {
        covers: 'Mendon and other Monroe County towns without a PD',
        violent: fbi("Monroe County Sheriff's Office", 'county', 'NY0270000', 2025, 155, 257401, 60.2, '12 of 12 months reported'),
        property: fbi("Monroe County Sheriff's Office", 'county', 'NY0270000', 2025, 1997, 257401, 775.8, '12 of 12 months reported', {
          note: 'Property is 12.6% lower than Coral Springs (inside the ±15% similar band) and still at or below.',
        }),
        note: 'Most local agency for Mendon, Rush, and other Monroe towns with no PD. Both rates are at or below Coral Springs. Do not use Rochester PD.',
      },
    ],
    note: 'Neither town has its own police department (confirmed against the FBI agency list and NY DCJS). Both covering sheriffs — Ontario County (Victor) 62.9 / 506.5 and Monroe County (Mendon) 60.2 / 775.8 per 100,000 — are at or below Coral Springs (118.8 / 888.0) on both rates, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. Do not use Rochester PD. Supplemental, not used as rates: NY DCJS Index Crimes (dataset ca8h-8gjq), 2024, 12 of 12 months, counts only — Monroe County Sheriff 188 violent / 2,571 property; Ontario County Sheriff 67 violent / 506 property. NY DCJS publishes no population, so no 2024 rate is computed. ' + NY_DCJS_SRC + ' (' + NY_DCJS + ').',
  },
  stokesdale: {
    placeId: 'stokesdale',
    country: 'US',
    checked: CRIME_CHECKED,
    // Primary: Guilford County Sheriff, which covers Stokesdale, Oak Ridge and Summerfield (no town PD). Violent is above Coral Springs, so this place is not in the both-at-or-below group.
    violent: fbi("Guilford County Sheriff's Office", 'county', 'NC0410000', 2025, 202, 132642, 152.3, '12 of 12 months reported', {
      note: 'Covers unincorporated Guilford, including Stokesdale, Oak Ridge and Summerfield (no town PD). Violent is 28.2% higher than Coral Springs.',
    }),
    property: fbi("Guilford County Sheriff's Office", 'county', 'NC0410000', 2025, 828, 132642, 624.2, '12 of 12 months reported'),
    also: [
      {
        covers: 'Unincorporated Forsyth County, North Carolina (not the Georgia Forsyth)',
        violent: fbi("Forsyth County Sheriff's Office (NC)", 'county', 'NC0340000', 2025, 236, 114329, 206.4),
        property: fbi("Forsyth County Sheriff's Office (NC)", 'county', 'NC0340000', 2025, 1382, 114329, 1208.8),
        note: 'Both rates are above Coral Springs.',
      },
      {
        covers: 'Kernersville city',
        violent: fbi('Kernersville Police Department', 'city', 'NC0340100', 2025, 68, 29334, 231.8),
        property: fbi('Kernersville Police Department', 'city', 'NC0340100', 2025, 817, 29334, 2785.2, '12 of 12 months reported', {
          note: 'Property is strikingly high — 213.6% higher than Coral Springs.',
        }),
        note: 'Both rates are above Coral Springs.',
      },
      {
        covers: 'Walnut Cove and unincorporated Stokes County (Hanging Rock side)',
        violent: fbi("Stokes County Sheriff's Office", 'county', 'NC0850000', 2025, 85, 38897, 218.5),
        property: fbi("Stokes County Sheriff's Office", 'county', 'NC0850000', 2025, 297, 38897, 763.6),
        note: 'Violent is 83.9% higher than Coral Springs; property is 14.0% lower.',
      },
    ],
    note: 'Every local covering agency has a violent rate above Coral Springs (118.8 per 100,000), FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026: Guilford Sheriff 152.3 / 624.2, Forsyth County NC Sheriff 206.4 / 1,208.8, Kernersville PD 231.8 / 2,785.2, Stokes Sheriff 218.5 / 763.6. This place is not in the both-at-or-below group. Do not use Greensboro PD or Winston-Salem PD as a proxy. 6101 Trotter Ridge Road, Summerfield, sits in Guilford Sheriff territory and is not a low-crime special-section house.',
  },
  'wexford-pine': {
    placeId: 'wexford-pine',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: fbi('Northern Regional Police Department', 'city', 'PA0021B00', 2025, 14, 41981, 33.3, '12 of 12 months reported', {
      note: 'Covers Pine, Richland, Marshall and Bradford Woods. This is the agency for 231 McKinney Road.',
    }),
    property: fbi('Northern Regional Police Department', 'city', 'PA0021B00', 2025, 111, 41981, 264.4),
    note: 'Northern Regional PD 33.3 / 264.4 per 100,000 is well below Coral Springs (118.8 / 888.0) on both rates, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026, ORI PA0021B00. Do not use Pittsburgh city figures. This place stays a near-miss on air quality (ALA 2026 D / F / Fail for the Pittsburgh area).',
  },
  'apex-holly-springs': {
    placeId: 'apex-holly-springs',
    country: 'US',
    checked: CRIME_CHECKED,
    // Primary: Apex PD. Holly Springs PD is also at or below. Wake County Sheriff (unincorporated) is not used to classify the cities.
    violent: fbi('Apex Police Department', 'city', 'NC0920200', 2025, 42, 78938, 53.2, '12 of 12 months reported', {
      note: 'Property is 9.8% lower than Coral Springs (inside the ±15% similar band) and still at or below.',
    }),
    property: fbi('Apex Police Department', 'city', 'NC0920200', 2025, 632, 78938, 800.6),
    also: [
      {
        covers: 'Holly Springs city',
        violent: fbi('Holly Springs Police Department', 'city', 'NC0921700', 2025, 45, 50637, 88.9),
        property: fbi('Holly Springs Police Department', 'city', 'NC0921700', 2025, 359, 50637, 709.0),
        note: 'Both rates are at or below Coral Springs.',
      },
      {
        covers: 'Unincorporated Wake County only',
        violent: fbi("Wake County Sheriff's Office", 'county', 'NC0920000', 2025, 256, 193737, 132.1, '12 of 12 months reported', {
          note: 'Violent is 11.2% higher than Coral Springs.',
        }),
        property: fbi("Wake County Sheriff's Office", 'county', 'NC0920000', 2025, 1002, 193737, 517.2),
        note: 'Not the covering agency for Apex or Holly Springs city lots. Violent is above Coral Springs. Do not use Apex PD for a sheriff-jurisdiction lot.',
        notTheCoveringAgency: true,
      },
    ],
    note: 'Apex PD 53.2 / 800.6 and Holly Springs PD 88.9 / 709.0 per 100,000 are both at or below Coral Springs (118.8 / 888.0), FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. Wake County Sheriff (unincorporated Wake) is 132.1 / 517.2 — violent is above the bar and is not used to classify the cities. This place stays a near-miss on mountains (Morrow Mountain / Uwharrie well over an hour).',
  },
  'guelph-eramosa': {
    placeId: 'guelph-eramosa',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate(
      'Wellington County, Ontario Provincial Police, municipal',
      'police service',
      2025,
      566,
      529.52,
      SC_ON_INC,
    ),
    property: scRate(
      'Wellington County, Ontario Provincial Police, municipal',
      'police service',
      2025,
      1418,
      1326.6,
      SC_ON_INC,
    ),
    csi: scCsi('Wellington County, Ontario Provincial Police, municipal', 2025, 28.18, SC_ON_CSI),
    violentCsi: scCsi('Wellington County, Ontario Provincial Police, municipal', 2025, 29.28, SC_ON_CSI),
    note: 'Guelph/Eramosa Township is served by the Ontario Provincial Police, Wellington County detachment — not Guelph Police Service (the city) and not Waterloo Regional Police. Figures are for the whole Wellington County OPP municipal contract area (Statistics Canada “Wellington County, Ontario, Ontario Provincial Police, municipal [35073]”), not the township alone. The OPP rural series for Wellington County had no published 2025 CSI or rate (status “not available”). Guelph municipal police in 2025: violent 931.20 and property 2,596.42 per 100,000; CSI 57.82 (tables 35-10-0180-01 and 35-10-0188-01) — a different service.',
  },
  cochrane: {
    placeId: 'cochrane',
    country: 'Canada',
    checked: CRIME_CHECKED,
    violent: scRate(
      'Cochrane, Alberta, Royal Canadian Mounted Police, municipal',
      'police service',
      2025,
      333,
      845.24,
      SC_AB_INC,
      { sourceName: 'Statistics Canada, table 35-10-0183-01, Incident-based crime statistics, police services in Alberta, 2025 (released 22 Jul 2026). Rate per 100,000 as published. “Total violent Criminal Code violations” and “Total property crime violations.”' },
    ),
    property: scRate(
      'Cochrane, Alberta, Royal Canadian Mounted Police, municipal',
      'police service',
      2025,
      865,
      2195.6,
      SC_AB_INC,
      { sourceName: 'Statistics Canada, table 35-10-0183-01, Incident-based crime statistics, police services in Alberta, 2025 (released 22 Jul 2026). Rate per 100,000 as published. “Total violent Criminal Code violations” and “Total property crime violations.”' },
    ),
    csi: scCsi(
      'Cochrane, Alberta, Royal Canadian Mounted Police, municipal',
      2025,
      36.7,
      SC_AB_CSI,
      { sourceName: 'Statistics Canada, table 35-10-0190-01, Crime severity index and weighted clearance rates, police services in Alberta, 2025 (released 22 Jul 2026).' },
    ),
    violentCsi: scCsi(
      'Cochrane, Alberta, Royal Canadian Mounted Police, municipal',
      2025,
      37.78,
      SC_AB_CSI,
      { sourceName: 'Statistics Canada, table 35-10-0190-01, Crime severity index and weighted clearance rates, police services in Alberta, 2025 (released 22 Jul 2026).' },
    ),
    note: 'Figures are for Cochrane RCMP municipal [48900], which matches the town (333 violent incidents ÷ 845.24 per 100,000 implies a served population of about 39,400, in line with the 1 July 2025 CSD estimate of 39,397). West-foothills acreage outside town may be covered by Cochrane RCMP rural [48713], a different series: 2025 violent 1,377.44 and property 3,118.68 per 100,000; CSI 59.48 and violent CSI 73.14 (same tables). Calgary municipal police is not the covering agency.',
  },
  'waxhaw-lake-norman': {
    placeId: 'waxhaw-lake-norman',
    country: 'US',
    checked: CRIME_CHECKED,
    violent: missingFigure(
      'Waxhaw / Davidson / Lake Norman towns (official FBI figure not retrieved)',
      'city',
      2025,
      FBI_CDE,
      FBI_SOURCE,
      'Official FBI 2025 agency-level figures for Waxhaw or Davidson were not retrieved in this pass. Town-level official figures are not available.',
    ),
    property: missingFigure(
      'Waxhaw / Davidson / Lake Norman towns (official FBI figure not retrieved)',
      'city',
      2025,
      FBI_CDE,
      FBI_SOURCE,
      'Official FBI 2025 agency-level figures for Waxhaw or Davidson were not retrieved in this pass. Town-level official figures are not available.',
    ),
    note: 'Waxhaw, Davidson, Cornelius and similar Lake Norman towns have their own departments or contract coverage. Charlotte-Mecklenburg PD is the wrong geography for a lake or Waxhaw lot. Official FBI figures should be pulled before a Coral Springs comparison.',
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


/** Coral Springs baseline rates (FBI CDE 2025, Coral Springs PD, 12 of 12 months). */
export const CORAL_VIOLENT_RATE = CORAL_SPRINGS.violent.ratePer100k as number
export const CORAL_PROPERTY_RATE = CORAL_SPRINGS.property.ratePer100k as number

/**
 * Safer-than-Coral-Springs grouping.
 * - safer: US, both sourced rates at or below the Coral Springs baselines
 * - one-sided: US, both rates sourced, exactly one at or below
 * - higher: US, both sourced rates above
 * - canada: Canadian place — different offence definitions; never counted as at-or-below Coral Springs. CSI is context only.
 * - unverified: a sourced violent or property rate is missing; never included in safer / one-sided
 */
export type SaferGroup = 'safer' | 'one-sided' | 'higher' | 'canada' | 'unverified'

export interface SaferResult {
  group: SaferGroup
  violent: number | null
  property: number | null
  violentAtOrBelow: boolean | null
  propertyAtOrBelow: boolean | null
  csi: number | null
  csiAtOrBelowNational: boolean | null
  agency: string | null
  year: number | null
  country: 'US' | 'Canada' | null
}

export const SAFER_GROUP_META: Record<SaferGroup, { label: string; short: string; color: string; description: string }> = {
  safer: {
    label: 'At or below Coral Springs on both violent and property crime',
    short: 'Both at or below',
    color: '#15803d',
    description: 'Sourced US violent and property rates per 100,000 are both at or below Coral Springs (118.8 / 888.0, 2025).',
  },
  'one-sided': {
    label: 'One of the two rates at or below Coral Springs',
    short: 'One of two',
    color: '#d97706',
    description: 'Both US rates are sourced, but only one is at or below the Coral Springs baseline. The other is higher.',
  },
  higher: {
    label: 'Both rates above Coral Springs',
    short: 'Both higher',
    color: '#dc2626',
    description: 'Sourced US violent and property rates are both above Coral Springs.',
  },
  canada: {
    label: 'Canada (approximate)',
    short: 'Canada (approx.)',
    color: '#0369a1',
    description: 'Canadian offence definitions differ from the FBI’s and are not counted as at-or-below Coral Springs. The Crime Severity Index vs Canada’s 2025 national CSI (75.01) is shown as context only.',
  },
  unverified: {
    label: 'Unverified crime',
    short: 'Unverified',
    color: '#94a3b8',
    description: 'An official violent or property rate is not available. These places are never included in the at-or-below lists, and they are left out of the crime score rather than treated as zero.',
  },
}

function atOrBelow(rate: number | null | undefined, baseline: number): boolean | null {
  if (rate == null) return null
  return rate <= baseline
}

export function classifySafer(c: PlaceCrime | undefined): SaferResult {
  if (!c) {
    return {
      group: 'unverified',
      violent: null,
      property: null,
      violentAtOrBelow: null,
      propertyAtOrBelow: null,
      csi: null,
      csiAtOrBelowNational: null,
      agency: null,
      year: null,
      country: null,
    }
  }
  const violent = c.violent.ratePer100k
  const property = c.property.ratePer100k
  const csi = c.csi?.value ?? null
  const national = CANADA_CSI_2025.value
  const csiAtOrBelowNational = csi != null && national != null ? csi <= national : null
  const vOk = atOrBelow(violent, CORAL_VIOLENT_RATE)
  const pOk = atOrBelow(property, CORAL_PROPERTY_RATE)
  const base = {
    violent,
    property,
    violentAtOrBelow: vOk,
    propertyAtOrBelow: pOk,
    csi,
    csiAtOrBelowNational,
    agency: c.violent.agency,
    year: c.violent.year,
    country: c.country,
  }
  if (c.country === 'Canada') {
    // Even with published rates or CSI, Canada is never in the US at-or-below groups.
    return { group: 'canada', ...base }
  }
  if (violent == null || property == null) {
    return { group: 'unverified', ...base }
  }
  if (vOk && pOk) return { group: 'safer', ...base }
  if (vOk || pOk) return { group: 'one-sided', ...base }
  return { group: 'higher', ...base }
}

/** Scorecard mark for the Low crime criterion, from sourced rates vs Coral Springs. */
export function crimeScoreFromSafer(c: PlaceCrime | undefined): { mark: 'pass' | 'partial' | 'fail' | 'unknown'; source: 'table'; note: string } {
  const r = classifySafer(c)
  if (r.group === 'safer') {
    return {
      mark: 'pass',
      source: 'table',
      note: `Sourced violent ${formatRate(r.violent)} and property ${formatRate(r.property)} per 100k (${r.year}, ${r.agency}) are both at or below Coral Springs (118.8 / 888.0, 2025).`,
    }
  }
  if (r.group === 'one-sided') {
    const v = r.violentAtOrBelow ? 'violent is at or below' : 'violent is above'
    const p = r.propertyAtOrBelow ? 'property is at or below' : 'property is above'
    return {
      mark: 'partial',
      source: 'table',
      note: `Only one of the two sourced rates is at or below Coral Springs (118.8 / 888.0, 2025): ${v} (${formatRate(r.violent)}), ${p} (${formatRate(r.property)}). ${r.year}, ${r.agency}.`,
    }
  }
  if (r.group === 'higher') {
    return {
      mark: 'fail',
      source: 'table',
      note: `Sourced violent ${formatRate(r.violent)} and property ${formatRate(r.property)} per 100k (${r.year}, ${r.agency}) are both above Coral Springs (118.8 / 888.0, 2025).`,
    }
  }
  if (r.group === 'canada') {
    const csiBit = r.csi != null
      ? ` Crime Severity Index ${r.csi.toFixed(2)} vs Canada’s 2025 national CSI of ${(CANADA_CSI_2025.value as number).toFixed(2)} (${r.csiAtOrBelowNational ? 'at or below' : 'above'} the national index) — context only.`
      : ''
    return {
      mark: 'unknown',
      source: 'table',
      note: `Canadian figures use different offence definitions and are not scored against Coral Springs.${csiBit}`,
    }
  }
  return {
    mark: 'unknown',
    source: 'table',
    note: 'Official violent and property rates are not available. This is left out of the score, not treated as zero.',
  }
}


/**
 * Long-tail areas whose sourced official 2025 FBI rates are at or below Coral Springs
 * on both violent and property crime, but which are not in-app places and had no
 * verified qualifying 4-bed / 3-full-bath / 1–3 acre / under US$850K listing this pass.
 * Shown in the Safer than Coral Springs section only. Not counted as in-app places.
 */
export interface LowCrimeArea {
  name: string
  region: 'NY Finger Lakes' | 'Pittsburgh-adjacent'
  covers: string
  violent: CrimeFigure
  property: CrimeFigure
  note: string
  /** Pittsburgh-area air quality applies to the Allegheny County townships. */
  airNote?: string
}

export const LOWCRIME_MORE: LowCrimeArea[] = [
  {
    name: 'Livingston County, NY',
    region: 'NY Finger Lakes',
    covers: 'Unincorporated Lima, Livonia, Avon and other towns without a PD (villages with a PD are different)',
    violent: fbi("Livingston County Sheriff's Office", 'county', 'NY0250000', 2025, 10, 39035, 25.6),
    property: fbi("Livingston County Sheriff's Office", 'county', 'NY0250000', 2025, 228, 39035, 584.1),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No 1–3 acre 3-full listing was verified this pass.',
  },
  {
    name: 'Wayne County, NY',
    region: 'NY Finger Lakes',
    covers: 'Macedon, Walworth and other towns without a PD',
    violent: fbi("Wayne County Sheriff's Office", 'county', 'NY0580000', 2025, 37, 64734, 57.2),
    property: fbi("Wayne County Sheriff's Office", 'county', 'NY0580000', 2025, 214, 64734, 330.6),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No qualifying 1–3 acre listing was verified this pass. Food to Rochester needs a per-address drive-time check.',
  },
  {
    name: 'Genesee County, NY',
    region: 'NY Finger Lakes',
    covers: 'Unincorporated Genesee County towns without a PD',
    violent: fbi("Genesee County Sheriff's Office", 'county', 'NY0180000', 2025, 25, 37876, 66.0),
    property: fbi("Genesee County Sheriff's Office", 'county', 'NY0180000', 2025, 166, 37876, 438.3),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No listing was verified this pass. Food was not re-checked.',
  },
  {
    name: 'Wyoming County, NY',
    region: 'NY Finger Lakes',
    covers: 'Unincorporated Wyoming County (Letchworth is next door)',
    violent: fbi("Wyoming County Sheriff's Office", 'county', 'NY0600000', 2025, 20, 28420, 70.4),
    property: fbi("Wyoming County Sheriff's Office", 'county', 'NY0600000', 2025, 77, 28420, 270.9),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No listing was verified this pass. Rochester food is likely over 40 min from Warsaw.',
  },
  {
    name: 'Yates County, NY',
    region: 'NY Finger Lakes',
    covers: 'Keuka Lake / Penn Yan area (Penn Yan has its own PD)',
    violent: fbi("Yates County Sheriff's Office", 'county', 'NY0610000', 2025, 8, 19537, 40.9),
    property: fbi("Yates County Sheriff's Office", 'county', 'NY0610000', 2025, 63, 19537, 322.5),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. Small served population. Food to Rochester is a stretch. No listing was verified this pass.',
  },
  {
    name: 'Indiana Township, PA',
    region: 'Pittsburgh-adjacent',
    covers: 'Indiana Township (Allegheny County, north of Pittsburgh)',
    violent: fbi('Indiana Township Police Department', 'city', 'PA0020V00', 2025, 0, 7402, 0.0, '12 of 12 months reported', {
      reportedZero: true,
      note: 'Genuine reported zero violent offences, 12 of 12 months — not missing data. Served population is under 10,000, so a single offence would move the rate sharply.',
    }),
    property: fbi('Indiana Township Police Department', 'city', 'PA0020V00', 2025, 14, 7402, 189.1),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No listing was verified this pass.',
    airNote: 'Pittsburgh-area air quality applies (same hard air miss as Wexford / Pine).',
  },
  {
    name: 'Hampton Township, PA',
    region: 'Pittsburgh-adjacent',
    covers: 'Hampton Township (Allegheny County, north of Pittsburgh)',
    violent: fbi('Hampton Township Police Department', 'city', 'PA0023300', 2025, 2, 17835, 11.2),
    property: fbi('Hampton Township Police Department', 'city', 'PA0023300', 2025, 54, 17835, 302.8),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. No listing was verified this pass. Food may work from this belt but was not re-timed.',
    airNote: 'Pittsburgh-area air quality applies (same hard air miss as Wexford / Pine).',
  },
  {
    name: 'West Deer Township, PA',
    region: 'Pittsburgh-adjacent',
    covers: 'West Deer Township (Allegheny County, north of Pittsburgh)',
    violent: fbi('West Deer Township Police Department', 'city', 'PA0021D00', 2025, 3, 12235, 24.5),
    property: fbi('West Deer Township Police Department', 'city', 'PA0021D00', 2025, 21, 12235, 171.6),
    note: 'Both rates at or below Coral Springs, FBI CDE 2025, 12 of 12 months, refreshed 15 Oct 2026. A 4-bed 1.1-acre Active listing (4581 Bakerstown Culmerville Rd) was 2 full + 1 half and was not shown.',
    airNote: 'Pittsburgh-area air quality applies (same hard air miss as Wexford / Pine).',
  },
]

export const CRIME_PLACE_IDS = Object.keys(CRIME)
