/**
 * Climate and AI-resilience figures for the Future-proof tab.
 * Retrieved 17 Nov 2026. Every figure has a source and a year.
 * Nothing here is estimated. A missing official figure is left unknown.
 * US climate uses FEMA National Risk Index county ratings (v1.20, December 2025).
 * Canadian climate is labelled approximate: Canada has no FEMA-NRI equivalent at the same geography.
 * First Street Foundation county factors were not used — a free, citable bulk extract was not available.
 * Projected counts of extreme-heat days are left unknown; US heat is scored from the NRI heat-wave rating instead.
 */
import type { Place } from './places'
import { qualifyingHomes } from './homes'
import { nearest } from './amenitiesTypes'

export const FUTURE_CHECKED = '17 Nov 2026'

export const NRI_SOURCE = {
  name: 'FEMA National Risk Index, county table, version 1.20.0 (December 2025)',
  url: 'https://www.fema.gov/about/reports-and-data/openfema/nri/v120/NRI_Table_Counties.zip',
  page: 'https://www.fema.gov/about/openfema/data-sets/national-risk-index-data',
  year: 'December 2025',
  version: '1.20.0',
  retrieved: FUTURE_CHECKED,
} as const

export const QCEW_SOURCE = {
  name: 'U.S. Bureau of Labor Statistics, Quarterly Census of Employment and Wages, 2024 annual averages, all ownerships, county',
  url: 'https://www.bls.gov/cew/downloadable-data-files.htm',
  apiPattern: 'https://data.bls.gov/cew/data/api/2024/a/area/{fips}.csv',
  year: 2024,
  retrieved: FUTURE_CHECKED,
} as const

export const EIA_SOURCE = {
  name: 'U.S. Energy Information Administration, Electric Power Annual Table 2.10, average residential price by state, 2025 (final), Form EIA-861',
  url: 'https://www.eia.gov/electricity/annual/html/epa_02_10.html',
  year: 2025,
  usAverageCents: 17.23,
  unit: 'U.S. cents per kWh',
  retrieved: FUTURE_CHECKED,
} as const

export const HQ_SOURCE = {
  name: 'Hydro-Québec, Comparison of Electricity Prices in Major North American Cities 2025',
  url: 'https://www.hydroquebec.com/data/documents-donnees/pdf/comparaison-prix-2025-en.pdf',
  asOf: '1 April 2025',
  year: 2025,
  unit: 'Canadian cents per kWh, residential, 1,000 kWh per month, excluding taxes',
  fxUsdPerCad: 0.697,
  fxNote: 'C$1 = US$0.6970 at noon on 1 April 2025, as published in the report',
  retrieved: FUTURE_CHECKED,
} as const

export const BROOKINGS_SOURCE = {
  name: 'Mark Muro, Shriya Methkupally and Molly Kinder, “The geography of generative AI’s workforce impacts will likely differ from those of previous technologies,” Brookings, 19 February 2025',
  url: 'https://www.brookings.edu/articles/the-geography-of-generative-ais-workforce-impacts-will-likely-differ-from-those-of-previous-technologies/',
  year: 2025,
  retrieved: FUTURE_CHECKED,
} as const

export const NRP_SOURCE = {
  name: 'Public Safety Canada, National Risk Profile, First Public Report, May 2023, revised January 2024',
  url: 'https://www.publicsafety.gc.ca/cnt/rsrcs/pblctns/2023-nrp-pnr/index-en.aspx',
  year: 2024,
} as const

export const IMF_CA_SOURCE = {
  name: 'IMF, Canada Financial Sector Assessment Program, Technical Note on Climate Risks Analysis, Country Report No. 25/234, 22 July 2025',
  url: 'https://www.imf.org/-/media/files/publications/cr/2025/english/1canea2025006-source-pdf.pdf',
  year: 2025,
} as const

export const CCCR_SOURCE = {
  name: 'Canada’s Changing Climate Report 2026, as cited by ClimateData.ca (extreme heat resource, last update August 2026): increases in the intensity and frequency of hot extremes are projected for all regions of Canada (very high confidence)',
  url: 'https://climatedata.ca/resource/extreme-heat-heatwaves/',
  year: 2026,
} as const

export type NriRating =
  | 'Very Low' | 'Relatively Low' | 'Relatively Moderate' | 'Relatively High' | 'Very High'
  | 'No Rating' | 'Not Applicable'

export interface NriCounty {
  fips: string
  geography: string
  role: string
  riskScore: number
  riskRating: string
  ealRating: string
  heat: string
  inlandFlood: string
  coastalFlood: string
  wildfire: string
  strongWind: string
  hurricane: string
  tornado: string
  drought: string
}

export interface QcewCounty {
  fips: string
  geography: string
  year: number
  totalEmployment: number
  governmentEmployment: number | null
  governmentPct: number | null
  healthPct: number | null
  educationPrivatePct: number | null
  constructionPct: number | null
  manufacturingPct: number | null
  transportationPct: number | null
  utilitiesPct: number | null
  informationPct: number | null
  financePct: number | null
  professionalPct: number | null
  highExposurePct: number | null
  lowerExposurePct: number | null
  hhi: number
}

export interface SourcedNote {
  summary: string
  mark: 'pass' | 'partial' | 'fail' | 'unknown'
  sources: { name: string; url: string; year: string | number }[]
  approximate?: boolean
}

export interface FactorScore {
  key: string
  label: string
  score: number | null
  detail: string
}

export interface FutureRanked {
  place: Place
  climate: number | null
  ai: number | null
  combined: number | null
  climateKnown: number
  aiKnown: number
  climateFactors: FactorScore[]
  aiFactors: FactorScore[]
  why: string
  strengths: string[]
  tradeoffs: string[]
}

export const RATING_SCORE: Record<string, number | null> = {
  'Very Low': 3,
  'Relatively Low': 2.4,
  'Relatively Moderate': 1.5,
  'Relatively High': 0.75,
  'Very High': 0,
  'No Rating': null,
  'Not Applicable': null,
}

export const MARK_SCORE = { pass: 3, partial: 1.5, fail: 0, unknown: null as number | null }


/** EIA Table 2.10 residential average, 2025, US cents/kWh. */
export const EIA_RESIDENTIAL_2025: Record<string, { state: string; cents: number }> = {
  forsyth: { state: 'Georgia', cents: 14.74 },
  'happy-valley': { state: 'Oregon', cents: 15.46 },
  duvall: { state: 'Washington', cents: 13.17 },
  golden: { state: 'Colorado', cents: 15.69 },
  draper: { state: 'Utah', cents: 13.02 },
  maryville: { state: 'Tennessee', cents: 13.22 },
  elizabeth: { state: 'Colorado', cents: 15.69 },
  boise: { state: 'Idaho', cents: 11.83 },
  'fort-collins': { state: 'Colorado', cents: 15.69 },
  spokane: { state: 'Washington', cents: 13.17 },
  lebanon: { state: 'New Hampshire', cents: 24.53 },
  'queensbury-wilton': { state: 'New York', cents: 26.39 },
  'post-falls': { state: 'Idaho', cents: 11.83 },
  gilford: { state: 'New Hampshire', cents: 24.53 },
  salem: { state: 'Virginia', cents: 15.28 },
  'victor-mendon': { state: 'New York', cents: 26.39 },
  stokesdale: { state: 'North Carolina', cents: 14.00 },
  'wexford-pine': { state: 'Pennsylvania', cents: 19.29 },
  'apex-holly-springs': { state: 'North Carolina', cents: 14.00 },
  'waxhaw-lake-norman': { state: 'North Carolina', cents: 14.00 },
}

export interface HqPrice {
  city: string
  cadCents: number
  usdCents: number
  note?: string
}

function hq(city: string, cad: number, note?: string): HqPrice {
  return { city, cadCents: cad, usdCents: Math.round(cad * HQ_SOURCE.fxUsdPerCad * 100) / 100, note }
}

/** Hydro-Québec 2025 study, 1,000 kWh/month residential, excluding taxes, Canadian cents/kWh. */
export const HQ_RESIDENTIAL_2025: Record<string, HqPrice> = {
  cantley: hq('Montréal, QC', 8.29, 'Chelsea / Cantley is served in Hydro-Québec territory; Montréal is the Québec city in the study.'),
  'on-carp-huntley': hq('Ottawa, ON', 14.35),
  'on-dunrobin': hq('Ottawa, ON', 14.35),
  'on-north-gower': hq('Ottawa, ON', 14.35),
  'on-flamborough': hq('Toronto, ON', 15.57, 'Hamilton / Flamborough is not a study city; Toronto is the nearest Ontario city in the 2025 report.'),
  'on-oro-medonte': hq('Toronto, ON', 15.57, 'Oro-Medonte is not a study city; Toronto is the nearest Ontario city in the 2025 report. Approximate.'),
  toronto: hq('Toronto, ON', 15.57),
  'guelph-eramosa': hq('Toronto, ON', 15.57, 'Guelph is not a study city; Toronto is the nearest Ontario city in the 2025 report. Approximate.'),
  collingwood: hq('Toronto, ON', 15.57, 'Collingwood is not a study city; Toronto is the nearest Ontario city in the 2025 report. Approximate.'),
  cochrane: hq('Calgary, AB', 22.90, 'Cochrane is in the Calgary region; Calgary is the study city.'),
}

export const BROOKINGS_COUNTY_NOTES: Record<string, string> = {
  duvall:
    'Brookings (19 Feb 2025) names King County, Washington, among counties with elevated generative-AI exposure “of around 40% or more” of workers who could see generative AI affect half or more of their tasks. That is a county-wide occupation-exposure figure, not a Duvall-only rate, and exposure is not the same as job loss.',
}

const src = (name: string, url: string, year: string | number) => ({ name, url, year })

export const WATER_SUPPLY: Record<string, SourcedNote> = {
  forsyth: {
    mark: 'partial',
    summary: 'Metro Atlanta, including Forsyth County, relies heavily on Lake Lanier and the Chattahoochee (ACF) basin, which has a documented history of drought and interstate allocation disputes. Water is available but is not as secure as a Great Lakes or St. Lawrence supply.',
    sources: [
      src('U.S. Army Corps of Engineers, Mobile District — Lake Sidney Lanier / ACF', 'https://www.sam.usace.army.mil/Missions/Civil-Works/Recreation/Lake-Sidney-Lanier/', 2026),
      src('Atlanta Regional Commission, water supply planning', 'https://atlantaregional.org/what-we-do/natural-resources/water-supply/', 2026),
    ],
  },
  'happy-valley': {
    mark: 'pass',
    summary: 'Western Oregon is in the Columbia River basin and is generally water-rich compared with the Colorado River basin. Recent Pacific Northwest drought and wildfire summers are a caveat, not a structural shortage on the scale of the Southwest.',
    sources: [src('U.S. EPA, Columbia River', 'https://www.epa.gov/columbiariver', 2026)],
  },
  duvall: {
    mark: 'pass',
    summary: 'King County and the Snoqualmie Valley sit in the western Cascades / Puget Sound drainage, a relatively wet basin. County-wide drought ratings in the National Risk Index are Very Low. This is not a Colorado River supply.',
    sources: [
      src('FEMA National Risk Index v1.20, King County drought rating', NRI_SOURCE.url, 'December 2025'),
      src('U.S. EPA, Columbia River / Puget Sound region', 'https://www.epa.gov/columbiariver', 2026),
    ],
  },
  cantley: {
    mark: 'pass',
    approximate: true,
    summary: 'Chelsea and Cantley sit on the Ottawa River / St. Lawrence system, a large, relatively secure surface-water supply. Approximate: this is a basin description, not a municipal utility audit.',
    sources: [src('Ottawa River Regulation Planning Board', 'https://ottawariver.ca/', 2026)],
  },
  golden: {
    mark: 'partial',
    summary: 'Jefferson County on Colorado’s Front Range depends in part on snowpack and transmountain diversions from the Colorado River basin, which the U.S. Bureau of Reclamation has managed under shortage conditions in recent years.',
    sources: [src('U.S. Bureau of Reclamation, Colorado River Basin', 'https://www.usbr.gov/ColoradoRiverBasin/', 2026)],
  },
  draper: {
    mark: 'partial',
    summary: 'The Salt Lake and Utah County Wasatch Front relies on snowpack and regional rivers, with known pressure on the Great Salt Lake and on Colorado River basin connections used by some Utah providers.',
    sources: [
      src('U.S. Bureau of Reclamation, Colorado River Basin', 'https://www.usbr.gov/ColoradoRiverBasin/', 2026),
      src('Utah Division of Water Resources', 'https://water.utah.gov/', 2026),
    ],
  },
  maryville: {
    mark: 'pass',
    summary: 'Blount County is in the Tennessee River basin, a large regulated river system, and is not dependent on the Colorado River.',
    sources: [src('Tennessee Valley Authority, Tennessee River system', 'https://www.tva.com/energy/our-power-system/hydroelectric', 2026)],
  },
  elizabeth: {
    mark: 'partial',
    summary: 'Elbert County sits on the eastern Front Range / South Platte side of the Denver region, which depends in part on snowpack and Colorado River transmountain diversions.',
    sources: [src('U.S. Bureau of Reclamation, Colorado River Basin', 'https://www.usbr.gov/ColoradoRiverBasin/', 2026)],
  },
  boise: {
    mark: 'partial',
    summary: 'Ada County and the Treasure Valley depend on the Snake River and managed irrigation/aquifer systems in a region with recurring drought, even though the NRI drought rating is Very Low.',
    sources: [src('U.S. Bureau of Reclamation, Snake River / Pacific Northwest Region', 'https://www.usbr.gov/pn/', 2026)],
  },
  'fort-collins': {
    mark: 'partial',
    summary: 'Larimer County and Northern Colorado use Cache la Poudre / South Platte supplies plus Colorado River transmountain water.',
    sources: [src('U.S. Bureau of Reclamation, Colorado River Basin', 'https://www.usbr.gov/ColoradoRiverBasin/', 2026)],
  },
  spokane: {
    mark: 'pass',
    summary: 'Spokane County is supplied largely by the Spokane Valley-Rathdrum Prairie aquifer and the Spokane River, a relatively abundant Northwest source, with drought still a periodic regional concern.',
    sources: [src('U.S. EPA, Columbia River', 'https://www.epa.gov/columbiariver', 2026)],
  },
  lebanon: {
    mark: 'pass',
    summary: 'The Upper Valley sits on the Connecticut River system in a humid Northeast basin, not a Colorado River supply.',
    sources: [src('U.S. EPA, Connecticut River / Long Island Sound', 'https://www.epa.gov/tmdl/connecticut-river-long-island-sound-tmdl', 2026)],
  },
  'queensbury-wilton': {
    mark: 'pass',
    summary: 'Warren and Saratoga counties sit in the Hudson / Lake George drainage of a humid Northeast basin with abundant surface water.',
    sources: [src('U.S. EPA, Hudson River', 'https://www.epa.gov/hudsonriver', 2026)],
  },
  'post-falls': {
    mark: 'pass',
    summary: 'Kootenai County is in the Spokane Valley-Rathdrum Prairie aquifer / Coeur d’Alene–Spokane system, a large Northwest groundwater and lake source.',
    sources: [src('U.S. EPA, Columbia River', 'https://www.epa.gov/columbiariver', 2026)],
  },
  gilford: {
    mark: 'pass',
    summary: 'Belknap County and the Lakes Region sit on Lake Winnipesaukee and related New Hampshire surface waters in a humid Northeast basin.',
    sources: [src('New Hampshire Department of Environmental Services, lakes and rivers', 'https://www.des.nh.gov/', 2026)],
  },
  salem: {
    mark: 'pass',
    summary: 'Salem and Botetourt County sit in the Roanoke River basin of humid western Virginia, not a Colorado River supply.',
    sources: [src('Virginia Department of Environmental Quality, water resources', 'https://www.deq.virginia.gov/our-programs/water', 2026)],
  },
  'victor-mendon': {
    mark: 'pass',
    summary: 'Ontario County is in the Finger Lakes region of the Great Lakes / St. Lawrence basin, a large and relatively secure freshwater supply.',
    sources: [src('U.S. EPA, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  stokesdale: {
    mark: 'pass',
    summary: 'The Piedmont Triad is not on the Colorado River. North Carolina’s Piedmont has a generally adequate water supply with periodic drought, which the NRI records as Relatively Moderate (Guilford) or Relatively Low (Forsyth, NC).',
    sources: [src('FEMA National Risk Index v1.20, Guilford and Forsyth County, NC drought ratings', NRI_SOURCE.url, 'December 2025')],
  },
  'wexford-pine': {
    mark: 'pass',
    summary: 'Allegheny County sits at the Ohio River headwaters (Allegheny, Monongahela and Ohio), a large humid-basin supply.',
    sources: [src('U.S. EPA, Ohio River', 'https://www.epa.gov/aboutepa/epa-region-3-mid-atlantic', 2026)],
  },
  'apex-holly-springs': {
    mark: 'pass',
    summary: 'Wake County relies on regional reservoirs and rivers in a humid Atlantic-slope basin (including Jordan Lake as a nearby source in this report). It is not Colorado River-dependent. Periodic drought remains a Carolina Piedmont caveat.',
    sources: [src('U.S. Army Corps of Engineers, Wilmington District — Jordan Lake', 'https://www.saw.usace.army.mil/Locations/District-Lakes-and-Dams/B-Everett-Jordan/', 2026)],
  },
  'waxhaw-lake-norman': {
    mark: 'pass',
    summary: 'Union County and Lake Norman sit on the Catawba River system, a large regulated Piedmont supply, not the Colorado River. Drought can still tighten reservoir rules in dry years.',
    sources: [src('U.S. EPA, Catawba / Yadkin–Pee Dee basins (Region 4)', 'https://www.epa.gov/aboutepa/about-epa-region-4-southeast', 2026)],
  },
  'on-carp-huntley': {
    mark: 'pass',
    approximate: true,
    summary: 'West Carleton draws on the Ottawa River / St. Lawrence system, a large freshwater supply. Approximate basin description, not a utility audit.',
    sources: [src('Ottawa River Regulation Planning Board', 'https://ottawariver.ca/', 2026)],
  },
  'on-dunrobin': {
    mark: 'pass',
    approximate: true,
    summary: 'Dunrobin is also on the Ottawa River system. The place itself already carries a flood caveat; water quantity is not the main concern.',
    sources: [src('Ottawa River Regulation Planning Board', 'https://ottawariver.ca/', 2026)],
  },
  'on-north-gower': {
    mark: 'pass',
    approximate: true,
    summary: 'North Gower sits in the Rideau / Ottawa River system of the St. Lawrence basin.',
    sources: [src('Ottawa River Regulation Planning Board', 'https://ottawariver.ca/', 2026)],
  },
  'on-flamborough': {
    mark: 'pass',
    approximate: true,
    summary: 'Rural Flamborough is in the Great Lakes / St. Lawrence basin (western Lake Ontario / Niagara). Approximate.',
    sources: [src('U.S. EPA / Environment and Climate Change Canada, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  'on-oro-medonte': {
    mark: 'pass',
    approximate: true,
    summary: 'Oro-Medonte sits between Lake Simcoe and Georgian Bay in the Great Lakes basin.',
    sources: [src('U.S. EPA / Environment and Climate Change Canada, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  toronto: {
    mark: 'pass',
    approximate: true,
    summary: 'The Toronto area is supplied from Lake Ontario in the Great Lakes system, a large freshwater source. Approximate.',
    sources: [src('U.S. EPA / Environment and Climate Change Canada, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  'guelph-eramosa': {
    mark: 'pass',
    approximate: true,
    summary: 'Guelph/Eramosa is in the Grand River watershed of the Great Lakes / St. Lawrence basin. Approximate.',
    sources: [src('U.S. EPA / Environment and Climate Change Canada, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  collingwood: {
    mark: 'pass',
    approximate: true,
    summary: 'Collingwood sits on Georgian Bay in the Great Lakes basin.',
    sources: [src('U.S. EPA / Environment and Climate Change Canada, Great Lakes', 'https://www.epa.gov/greatlakes', 2026)],
  },
  cochrane: {
    mark: 'partial',
    approximate: true,
    summary: 'Cochrane is on the Bow River in the South Saskatchewan basin, which depends on Rocky Mountain snowpack and has documented drought and allocation pressure in Alberta. This is not a Great Lakes supply.',
    sources: [src('Government of Alberta, Bow River / South Saskatchewan River Basin', 'https://www.alberta.ca/south-saskatchewan-river-basin', 2026)],
  },
}

export const CANADA_CLIMATE: Record<string, SourcedNote> = {
  cantley: {
    mark: 'partial',
    approximate: true,
    summary: 'No FEMA-style county risk index exists here. Public Safety Canada lists Ottawa-Gatineau among large cities with high-risk flood areas. The IMF (2025) notes Québec’s exposure to extreme cold, ice storms, flooding and wildfires. Heat extremes are projected to increase across Canada (CCCR 2026). The 2017 and 2019 Ottawa–Gatineau floods are documented history, and wildfire-smoke spikes already appear in this report’s air quality notes. Approximate, and not comparable to a U.S. NRI score.',
    sources: [NRP_SOURCE, IMF_CA_SOURCE, CCCR_SOURCE],
  },
  'on-carp-huntley': {
    mark: 'partial',
    approximate: true,
    summary: 'Same Ottawa River climate as the capital region: flood risk in the Ottawa–Gatineau area (National Risk Profile), Ontario heat, flooding and tornado exposure (IMF 2025), and rising hot extremes (CCCR 2026). Wildfire-smoke days are already noted in the air quality section. Approximate.',
    sources: [NRP_SOURCE, IMF_CA_SOURCE, CCCR_SOURCE],
  },
  'on-dunrobin': {
    mark: 'partial',
    approximate: true,
    summary: 'Same Ottawa-region climate as Carp, with an extra, already-recorded flood caveat on this place. Approximate; not an NRI score.',
    sources: [NRP_SOURCE, IMF_CA_SOURCE, CCCR_SOURCE],
  },
  'on-north-gower': {
    mark: 'partial',
    approximate: true,
    summary: 'Same Ottawa-region climate as Carp and Dunrobin (flood, heat, ice, smoke). Approximate.',
    sources: [NRP_SOURCE, IMF_CA_SOURCE, CCCR_SOURCE],
  },
  'on-flamborough': {
    mark: 'partial',
    approximate: true,
    summary: 'Southern Ontario: the IMF (2025) flags extreme heat, flooding and tornadoes for the province. Great Lakes water is a strength. Approximate regional statement, not a township model.',
    sources: [IMF_CA_SOURCE, CCCR_SOURCE, NRP_SOURCE],
  },
  'on-oro-medonte': {
    mark: 'partial',
    approximate: true,
    summary: 'Simcoe County / Georgian Bay: Ontario heat, flood and tornado exposure (IMF 2025) in a lake-effect snow region, with Great Lakes water. Approximate.',
    sources: [IMF_CA_SOURCE, CCCR_SOURCE],
  },
  toronto: {
    mark: 'partial',
    approximate: true,
    summary: 'The National Risk Profile lists Toronto among large cities in high-risk flood areas. Southern Ontario also faces rising heat (CCCR 2026, IMF 2025). Lake Ontario water is a strength. Approximate.',
    sources: [NRP_SOURCE, IMF_CA_SOURCE, CCCR_SOURCE],
  },
  'guelph-eramosa': {
    mark: 'partial',
    approximate: true,
    summary: 'Southern Ontario regional climate: heat, flooding and tornado exposure (IMF 2025) with Great Lakes-basin water. Approximate.',
    sources: [IMF_CA_SOURCE, CCCR_SOURCE],
  },
  collingwood: {
    mark: 'partial',
    approximate: true,
    summary: 'Georgian Bay / Niagara Escarpment: Ontario heat and flood exposure (IMF 2025) plus lake-effect weather, with Great Lakes water. Approximate.',
    sources: [IMF_CA_SOURCE, CCCR_SOURCE],
  },
  cochrane: {
    mark: 'fail',
    approximate: true,
    summary: 'The IMF (2025) flags the Prairies, including Alberta, for drought, flooding, hail and wildfires, and finds fire weather expanding under a high-emissions path. Public Safety Canada’s 2025 outlook also pointed to elevated western wildfire risk under drought. This report already notes summer wildfire smoke at Cochrane. Approximate, and not an NRI score.',
    sources: [IMF_CA_SOURCE, NRP_SOURCE, src('Public Safety Canada, 2025 flood and wildfire early look (transition binder, 10 Sep 2025)', 'https://www.publicsafety.gc.ca/cnt/trnsprnc/brfng-mtrls/trnstn-bndrs/20250910-2/03a-en.aspx', 2025)],
  },
}

export const NRI_COUNTIES: Record<string, NriCounty[]> = {
  'forsyth': [
    {
      fips: '13117', geography: "Forsyth County, Georgia", role: "primary",
      riskScore: 86.1323, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Moderate", hurricane: "Very Low",
      tornado: "Relatively High", drought: "No Rating",
    }
  ],
  'happy-valley': [
    {
      fips: '41005', geography: "Clackamas County, Oregon", role: "primary",
      riskScore: 94.8791, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Moderate", inlandFlood: "Relatively High", coastalFlood: "Very Low",
      wildfire: "Relatively Low", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively Low", drought: "Very Low",
    }
  ],
  'duvall': [
    {
      fips: '53033', geography: "King County, Washington", role: "primary — county-wide; Duvall is inland in the Snoqualmie Valley, so coastal and some river-flood ratings for the county may overstate risk at the town",
      riskScore: 99.6819, riskRating: "Very High", ealRating: "Very High",
      heat: "Relatively High", inlandFlood: "Very High", coastalFlood: "Relatively Moderate",
      wildfire: "Relatively Low", strongWind: "Very Low", hurricane: "Not Applicable",
      tornado: "Relatively Moderate", drought: "Very Low",
    }
  ],
  'golden': [
    {
      fips: '08059', geography: "Jefferson County, Colorado", role: "primary",
      riskScore: 94.9427, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Low", inlandFlood: "Relatively High", coastalFlood: "Not Applicable",
      wildfire: "Relatively High", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively High", drought: "Very Low",
    }
  ],
  'draper': [
    {
      fips: '49035', geography: "Salt Lake County, Utah", role: "Draper",
      riskScore: 98.5687, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Moderate", inlandFlood: "Relatively Moderate", coastalFlood: "No Rating",
      wildfire: "Relatively High", strongWind: "Relatively Moderate", hurricane: "Not Applicable",
      tornado: "Relatively Moderate", drought: "Relatively Low",
    },
    {
      fips: '49049', geography: "Utah County, Utah", role: "Alpine / Highland",
      riskScore: 95.3244, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Moderate", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively High", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively Low", drought: "Relatively Moderate",
    }
  ],
  'maryville': [
    {
      fips: '47009', geography: "Blount County, Tennessee", role: "primary",
      riskScore: 74.1730, riskRating: "Relatively Low", ealRating: "Relatively Low",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively Low", strongWind: "Relatively Moderate", hurricane: "Very Low",
      tornado: "Relatively Moderate", drought: "Relatively Low",
    }
  ],
  'elizabeth': [
    {
      fips: '08039', geography: "Elbert County, Colorado", role: "primary",
      riskScore: 36.5776, riskRating: "Very Low", ealRating: "Relatively Low",
      heat: "Very Low", inlandFlood: "Very Low", coastalFlood: "Not Applicable",
      wildfire: "Relatively Moderate", strongWind: "Relatively Low", hurricane: "Not Applicable",
      tornado: "Relatively Low", drought: "Relatively Low",
    }
  ],
  'boise': [
    {
      fips: '16001', geography: "Ada County, Idaho", role: "primary",
      riskScore: 87.7545, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Moderate", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively High", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively Low", drought: "Very Low",
    }
  ],
  'fort-collins': [
    {
      fips: '08069', geography: "Larimer County, Colorado", role: "primary",
      riskScore: 90.1399, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively High", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively High", drought: "Relatively Low",
    }
  ],
  'spokane': [
    {
      fips: '53063', geography: "Spokane County, Washington", role: "primary",
      riskScore: 89.9809, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Moderate", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively Moderate", strongWind: "Relatively High", hurricane: "Not Applicable",
      tornado: "Relatively Low", drought: "Very Low",
    }
  ],
  'lebanon': [
    {
      fips: '33009', geography: "Grafton County, New Hampshire", role: "primary",
      riskScore: 81.7748, riskRating: "Relatively Moderate", ealRating: "Relatively Low",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Relatively Low",
      tornado: "Very Low", drought: "No Rating",
    }
  ],
  'queensbury-wilton': [
    {
      fips: '36113', geography: "Warren County, New York", role: "Queensbury",
      riskScore: 62.3092, riskRating: "Relatively Low", ealRating: "Relatively Low",
      heat: "Very Low", inlandFlood: "Relatively Low", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Relatively Low",
      tornado: "Relatively Low", drought: "No Rating",
    },
    {
      fips: '36091', geography: "Saratoga County, New York", role: "Wilton",
      riskScore: 73.0280, riskRating: "Relatively Low", ealRating: "Relatively Moderate",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Moderate", hurricane: "Relatively Low",
      tornado: "Relatively Moderate", drought: "No Rating",
    }
  ],
  'post-falls': [
    {
      fips: '16055', geography: "Kootenai County, Idaho", role: "primary",
      riskScore: 78.9758, riskRating: "Relatively Low", ealRating: "Relatively Low",
      heat: "Relatively Moderate", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Relatively Low", strongWind: "Relatively Low", hurricane: "Not Applicable",
      tornado: "Very Low", drought: "Very Low",
    }
  ],
  'gilford': [
    {
      fips: '33001', geography: "Belknap County, New Hampshire", role: "primary",
      riskScore: 57.3791, riskRating: "Relatively Low", ealRating: "Relatively Low",
      heat: "Relatively Low", inlandFlood: "Relatively Low", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Relatively Low",
      tornado: "Relatively Low", drought: "Relatively Low",
    }
  ],
  'salem': [
    {
      fips: '51775', geography: "Salem city, Virginia", role: "Salem (independent city)",
      riskScore: 18.6387, riskRating: "Very Low", ealRating: "Very Low",
      heat: "Very Low", inlandFlood: "Relatively Low", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Very Low",
      tornado: "Very Low", drought: "No Rating",
    },
    {
      fips: '51023', geography: "Botetourt County, Virginia", role: "Botetourt County",
      riskScore: 18.0980, riskRating: "Very Low", ealRating: "Very Low",
      heat: "Very Low", inlandFlood: "Relatively Low", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Very Low",
      tornado: "Very Low", drought: "Very Low",
    }
  ],
  'victor-mendon': [
    {
      fips: '36069', geography: "Ontario County, New York", role: "primary",
      riskScore: 63.5496, riskRating: "Relatively Low", ealRating: "Relatively Low",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Moderate", hurricane: "Relatively Low",
      tornado: "Relatively Low", drought: "Relatively Moderate",
    }
  ],
  'stokesdale': [
    {
      fips: '37081', geography: "Guilford County, North Carolina", role: "Stokesdale / Oak Ridge",
      riskScore: 93.4478, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Moderate", inlandFlood: "Relatively High", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Moderate", hurricane: "Relatively Moderate",
      tornado: "Relatively Moderate", drought: "Relatively Moderate",
    },
    {
      fips: '37067', geography: "Forsyth County, North Carolina", role: "Kernersville is partly in this county",
      riskScore: 91.5394, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Moderate", inlandFlood: "Relatively High", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively High", hurricane: "Relatively Moderate",
      tornado: "Relatively High", drought: "Relatively Low",
    }
  ],
  'wexford-pine': [
    {
      fips: '42003', geography: "Allegheny County, Pennsylvania", role: "primary — county-wide; Wexford / Pine is a northern suburb, so city-river flood ratings may not match the township",
      riskScore: 98.0916, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Moderate", inlandFlood: "Very High", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively High", hurricane: "Relatively Low",
      tornado: "Relatively High", drought: "No Rating",
    }
  ],
  'apex-holly-springs': [
    {
      fips: '37183', geography: "Wake County, North Carolina", role: "primary",
      riskScore: 95.5471, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively High", inlandFlood: "Relatively High", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively Low", hurricane: "Relatively Moderate",
      tornado: "Relatively High", drought: "Relatively Low",
    }
  ],
  'waxhaw-lake-norman': [
    {
      fips: '37179', geography: "Union County, North Carolina", role: "Waxhaw",
      riskScore: 89.0585, riskRating: "Relatively Moderate", ealRating: "Relatively Moderate",
      heat: "Relatively Low", inlandFlood: "Relatively Moderate", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively High", hurricane: "Relatively Low",
      tornado: "Relatively High", drought: "Relatively Moderate",
    },
    {
      fips: '37119', geography: "Mecklenburg County, North Carolina", role: "Charlotte / some Lake Norman shoreline",
      riskScore: 97.0738, riskRating: "Relatively High", ealRating: "Relatively High",
      heat: "Relatively Moderate", inlandFlood: "Relatively High", coastalFlood: "Not Applicable",
      wildfire: "Very Low", strongWind: "Relatively High", hurricane: "Relatively Moderate",
      tornado: "Relatively High", drought: "Very Low",
    }
  ]
}

export const QCEW_COUNTIES: Record<string, QcewCounty[]> = {
  'forsyth': [
    {
      fips: '13117', geography: "Forsyth County, Georgia", year: 2024,
      totalEmployment: 88777, governmentEmployment: 9536,
      governmentPct: 10.7, healthPct: 15.5,
      educationPrivatePct: 1.4, constructionPct: 8.3,
      manufacturingPct: 9.2, transportationPct: 2.4,
      utilitiesPct: 0.5, informationPct: 1.2,
      financePct: 2.2, professionalPct: 7.2,
      highExposurePct: 11.1, lowerExposurePct: 20.7,
      hhi: 905,
    }
  ],
  'happy-valley': [
    {
      fips: '41005', geography: "Clackamas County, Oregon", year: 2024,
      totalEmployment: 174320, governmentEmployment: 17044,
      governmentPct: 9.8, healthPct: 14.9,
      educationPrivatePct: 1.3, constructionPct: 8.3,
      manufacturingPct: 10.1, transportationPct: 2.3,
      utilitiesPct: 0.2, informationPct: 1.5,
      financePct: 3.0, professionalPct: 6.7,
      highExposurePct: 12.8, lowerExposurePct: 23.6,
      hhi: 834,
    }
  ],
  'duvall': [
    {
      fips: '53033', geography: "King County, Washington", year: 2024,
      totalEmployment: 1449785, governmentEmployment: 178581,
      governmentPct: 12.3, healthPct: 11.3,
      educationPrivatePct: 1.7, constructionPct: 4.9,
      manufacturingPct: 6.3, transportationPct: 4.3,
      utilitiesPct: 0.1, informationPct: 8.9,
      financePct: 2.7, professionalPct: 10.4,
      highExposurePct: 27.9, lowerExposurePct: 15.8,
      hhi: 762,
    }
  ],
  'golden': [
    {
      fips: '08059', geography: "Jefferson County, Colorado", year: 2024,
      totalEmployment: 248082, governmentEmployment: 36011,
      governmentPct: 14.5, healthPct: 12.9,
      educationPrivatePct: 1.6, constructionPct: 7.2,
      manufacturingPct: 8.0, transportationPct: 1.2,
      utilitiesPct: 0.3, informationPct: 1.7,
      financePct: 2.6, professionalPct: 11.9,
      highExposurePct: 17.5, lowerExposurePct: 17.0,
      hhi: 936,
    }
  ],
  'draper': [
    {
      fips: '49035', geography: "Salt Lake County, Utah", year: 2024,
      totalEmployment: 796203, governmentEmployment: 110819,
      governmentPct: 13.9, healthPct: 9.7,
      educationPrivatePct: 2.1, constructionPct: 6.9,
      manufacturingPct: 7.6, transportationPct: 5.4,
      utilitiesPct: 0.2, informationPct: 2.8,
      financePct: 6.4, professionalPct: 9.5,
      highExposurePct: 20.6, lowerExposurePct: 20.5,
      hhi: 779,
    },
    {
      fips: '49049', geography: "Utah County, Utah", year: 2024,
      totalEmployment: 295152, governmentEmployment: 34281,
      governmentPct: 11.6, healthPct: 12.9,
      educationPrivatePct: 4.8, constructionPct: 10.3,
      manufacturingPct: 8.0, transportationPct: 1.8,
      utilitiesPct: 0.2, informationPct: 4.3,
      financePct: 2.9, professionalPct: 8.7,
      highExposurePct: 16.9, lowerExposurePct: 20.7,
      hhi: 846,
    }
  ],
  'maryville': [
    {
      fips: '47009', geography: "Blount County, Tennessee", year: 2024,
      totalEmployment: 56991, governmentEmployment: 7966,
      governmentPct: 14.0, healthPct: 7.7,
      educationPrivatePct: 1.4, constructionPct: 5.0,
      manufacturingPct: 16.1, transportationPct: 7.7,
      utilitiesPct: 0.2, informationPct: 0.7,
      financePct: 4.7, professionalPct: 3.6,
      highExposurePct: 10.6, lowerExposurePct: 28.9,
      hhi: 967,
    }
  ],
  'elizabeth': [
    {
      fips: '08039', geography: "Elbert County, Colorado", year: 2024,
      totalEmployment: 4889, governmentEmployment: 1152,
      governmentPct: 23.6, healthPct: 2.6,
      educationPrivatePct: 1.0, constructionPct: 20.8,
      manufacturingPct: 2.7, transportationPct: null,
      utilitiesPct: null, informationPct: 1.4,
      financePct: 2.3, professionalPct: 7.0,
      highExposurePct: 11.3, lowerExposurePct: 25.8,
      hhi: 1322,
    }
  ],
  'boise': [
    {
      fips: '16001', geography: "Ada County, Idaho", year: 2024,
      totalEmployment: 288010, governmentEmployment: 38069,
      governmentPct: 13.2, healthPct: 15.1,
      educationPrivatePct: 1.3, constructionPct: 7.6,
      manufacturingPct: 6.4, transportationPct: 3.1,
      utilitiesPct: 0.4, informationPct: 1.1,
      financePct: 4.4, professionalPct: 7.3,
      highExposurePct: 14.7, lowerExposurePct: 17.9,
      hhi: 864,
    }
  ],
  'fort-collins': [
    {
      fips: '08069', geography: "Larimer County, Colorado", year: 2024,
      totalEmployment: 175265, governmentEmployment: 39281,
      governmentPct: 22.4, healthPct: 10.3,
      educationPrivatePct: 1.2, constructionPct: 6.3,
      manufacturingPct: 8.4, transportationPct: 2.2,
      utilitiesPct: 0.2, informationPct: 1.4,
      financePct: 2.0, professionalPct: 7.6,
      highExposurePct: 11.6, lowerExposurePct: 17.9,
      hhi: 1078,
    }
  ],
  'spokane': [
    {
      fips: '53063', geography: "Spokane County, Washington", year: 2024,
      totalEmployment: 243161, governmentEmployment: 37001,
      governmentPct: 15.2, healthPct: 19.7,
      educationPrivatePct: 1.9, constructionPct: 5.7,
      manufacturingPct: 6.7, transportationPct: 4.1,
      utilitiesPct: 0.2, informationPct: 1.1,
      financePct: 3.7, professionalPct: 4.8,
      highExposurePct: 10.9, lowerExposurePct: 17.4,
      hhi: 1005,
    }
  ],
  'lebanon': [
    {
      fips: '33009', geography: "Grafton County, New Hampshire", year: 2024,
      totalEmployment: 54323, governmentEmployment: 6246,
      governmentPct: 11.5, healthPct: 24.5,
      educationPrivatePct: 10.8, constructionPct: 3.1,
      manufacturingPct: 8.5, transportationPct: 1.5,
      utilitiesPct: 0.2, informationPct: 0.8,
      financePct: 1.7, professionalPct: 4.0,
      highExposurePct: 7.4, lowerExposurePct: 14.0,
      hhi: 1236,
    }
  ],
  'queensbury-wilton': [
    {
      fips: '36113', geography: "Warren County, New York", year: 2024,
      totalEmployment: 36956, governmentEmployment: 4624,
      governmentPct: 12.5, healthPct: 16.1,
      educationPrivatePct: 0.7, constructionPct: 4.1,
      manufacturingPct: 8.5, transportationPct: null,
      utilitiesPct: null, informationPct: 2.5,
      financePct: 3.0, professionalPct: 2.8,
      highExposurePct: 10.1, lowerExposurePct: 13.4,
      hhi: 992,
    },
    {
      fips: '36091', geography: "Saratoga County, New York", year: 2024,
      totalEmployment: 92800, governmentEmployment: 12154,
      governmentPct: 13.1, healthPct: 13.6,
      educationPrivatePct: 2.7, constructionPct: 5.9,
      manufacturingPct: 7.1, transportationPct: 3.8,
      utilitiesPct: 0.3, informationPct: 1.1,
      financePct: 4.0, professionalPct: 6.7,
      highExposurePct: 14.2, lowerExposurePct: 17.1,
      hhi: 850,
    }
  ],
  'post-falls': [
    {
      fips: '16055', geography: "Kootenai County, Idaho", year: 2024,
      totalEmployment: 71068, governmentEmployment: 8463,
      governmentPct: 11.9, healthPct: 18.0,
      educationPrivatePct: 1.2, constructionPct: 9.7,
      manufacturingPct: 7.2, transportationPct: 1.4,
      utilitiesPct: 0.5, informationPct: 1.0,
      financePct: 2.7, professionalPct: 4.8,
      highExposurePct: 8.9, lowerExposurePct: 19.6,
      hhi: 1023,
    }
  ],
  'gilford': [
    {
      fips: '33001', geography: "Belknap County, New Hampshire", year: 2024,
      totalEmployment: 25854, governmentEmployment: 3983,
      governmentPct: 15.4, healthPct: 12.5,
      educationPrivatePct: 1.2, constructionPct: 6.0,
      manufacturingPct: 8.0, transportationPct: 1.5,
      utilitiesPct: 0.7, informationPct: 0.8,
      financePct: 1.7, professionalPct: 2.5,
      highExposurePct: 7.0, lowerExposurePct: 16.9,
      hhi: 1122,
    }
  ],
  'salem': [
    {
      fips: '51775', geography: "Salem city, Virginia", year: 2024,
      totalEmployment: 20481, governmentEmployment: 4036,
      governmentPct: 19.7, healthPct: 16.9,
      educationPrivatePct: 3.1, constructionPct: null,
      manufacturingPct: 13.2, transportationPct: null,
      utilitiesPct: null, informationPct: 0.6,
      financePct: 2.1, professionalPct: 3.0,
      highExposurePct: 6.9, lowerExposurePct: 13.2,
      hhi: 1114,
    },
    {
      fips: '51023', geography: "Botetourt County, Virginia", year: 2024,
      totalEmployment: 11729, governmentEmployment: 1657,
      governmentPct: 14.1, healthPct: null,
      educationPrivatePct: null, constructionPct: 6.4,
      manufacturingPct: 20.7, transportationPct: null,
      utilitiesPct: null, informationPct: 0.3,
      financePct: 1.5, professionalPct: 2.5,
      highExposurePct: 5.4, lowerExposurePct: 27.1,
      hhi: 1021,
    }
  ],
  'victor-mendon': [
    {
      fips: '36069', geography: "Ontario County, New York", year: 2024,
      totalEmployment: 53913, governmentEmployment: 7896,
      governmentPct: 14.6, healthPct: 14.1,
      educationPrivatePct: 2.1, constructionPct: 6.3,
      manufacturingPct: 11.6, transportationPct: 3.7,
      utilitiesPct: 0.1, informationPct: 1.3,
      financePct: 1.6, professionalPct: 2.9,
      highExposurePct: 8.2, lowerExposurePct: 22.9,
      hhi: 955,
    }
  ],
  'stokesdale': [
    {
      fips: '37081', geography: "Guilford County, North Carolina", year: 2024,
      totalEmployment: 287996, governmentEmployment: 31971,
      governmentPct: 11.1, healthPct: 13.4,
      educationPrivatePct: 2.0, constructionPct: 4.9,
      manufacturingPct: 10.8, transportationPct: 6.4,
      utilitiesPct: 0.1, informationPct: 1.2,
      financePct: 3.3, professionalPct: 4.6,
      highExposurePct: 10.9, lowerExposurePct: 22.3,
      hhi: 849,
    },
    {
      fips: '37067', geography: "Forsyth County, North Carolina", year: 2024,
      totalEmployment: 192587, governmentEmployment: 18822,
      governmentPct: 9.8, healthPct: 22.4,
      educationPrivatePct: 3.6, constructionPct: 4.3,
      manufacturingPct: 8.4, transportationPct: null,
      utilitiesPct: null, informationPct: 0.8,
      financePct: 4.7, professionalPct: 4.3,
      highExposurePct: 12.3, lowerExposurePct: 12.7,
      hhi: 1024,
    }
  ],
  'wexford-pine': [
    {
      fips: '42003', geography: "Allegheny County, Pennsylvania", year: 2024,
      totalEmployment: 670637, governmentEmployment: 63366,
      governmentPct: 9.4, healthPct: 19.6,
      educationPrivatePct: 5.3, constructionPct: 4.5,
      manufacturingPct: 5.2, transportationPct: 3.4,
      utilitiesPct: 0.4, informationPct: 1.7,
      financePct: 5.8, professionalPct: 8.5,
      highExposurePct: 20.0, lowerExposurePct: 13.7,
      hhi: 892,
    }
  ],
  'apex-holly-springs': [
    {
      fips: '37183', geography: "Wake County, North Carolina", year: 2024,
      totalEmployment: 653153, governmentEmployment: 86752,
      governmentPct: 13.3, healthPct: 12.0,
      educationPrivatePct: 1.8, constructionPct: 7.0,
      manufacturingPct: 3.6, transportationPct: 3.0,
      utilitiesPct: 0.3, informationPct: 3.8,
      financePct: 4.1, professionalPct: 11.7,
      highExposurePct: 21.1, lowerExposurePct: 14.1,
      hhi: 837,
    }
  ],
  'waxhaw-lake-norman': [
    {
      fips: '37179', geography: "Union County, North Carolina", year: 2024,
      totalEmployment: 74299, governmentEmployment: 9635,
      governmentPct: 13.0, healthPct: 6.9,
      educationPrivatePct: 2.6, constructionPct: 13.5,
      manufacturingPct: 16.7, transportationPct: 3.3,
      utilitiesPct: 0.3, informationPct: 0.9,
      financePct: 2.0, professionalPct: 4.2,
      highExposurePct: 7.2, lowerExposurePct: 33.9,
      hhi: 986,
    },
    {
      fips: '37119', geography: "Mecklenburg County, North Carolina", year: 2024,
      totalEmployment: 788436, governmentEmployment: 80994,
      governmentPct: 10.3, healthPct: 8.4,
      educationPrivatePct: 1.8, constructionPct: 5.2,
      manufacturingPct: 4.4, transportationPct: 6.5,
      utilitiesPct: 0.3, informationPct: 2.7,
      financePct: 11.1, professionalPct: 9.0,
      highExposurePct: 26.5, lowerExposurePct: 16.5,
      hhi: 736,
    }
  ]
}


function mean(nums: Array<number | null | undefined>): { avg: number | null; known: number } {
  const v = nums.filter((n): n is number => typeof n === 'number')
  return { avg: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null, known: v.length }
}

function ratingAvg(ratings: string[]): number | null {
  return mean(ratings.map((r) => RATING_SCORE[r] ?? null)).avg
}

function windScore(c: NriCounty): number | null {
  return ratingAvg([c.strongWind, c.hurricane, c.tornado])
}

export function climateFactors(place: Place): FactorScore[] {
  const out: FactorScore[] = []
  const nri = NRI_COUNTIES[place.id]
  if (nri?.length) {
    const heat = ratingAvg(nri.map((c) => c.heat))
    const flood = ratingAvg(nri.map((c) => c.inlandFlood))
    const coastal = ratingAvg(nri.map((c) => c.coastalFlood))
    const fire = ratingAvg(nri.map((c) => c.wildfire))
    const wind = mean(nri.map(windScore)).avg
    const drought = ratingAvg(nri.map((c) => c.drought))
    const geogs = nri.map((c) => `${c.geography} (${c.riskRating}, score ${c.riskScore.toFixed(1)})`).join('; ')
    out.push({ key: 'heat', label: 'Heat-wave rating (NRI)', score: heat, detail: nri.map((c) => `${c.geography}: ${c.heat}`).join('; ') + '. Projected extreme-heat day counts are not scored (no uniform official county table applied).' })
    out.push({ key: 'flood', label: 'Inland flood rating (NRI)', score: flood, detail: nri.map((c) => `${c.geography}: ${c.inlandFlood}`).join('; ') })
    if (coastal != null) out.push({ key: 'coastal', label: 'Coastal flood rating (NRI)', score: coastal, detail: nri.map((c) => `${c.geography}: ${c.coastalFlood}`).join('; ') })
    out.push({ key: 'wildfire', label: 'Wildfire rating (NRI)', score: fire, detail: nri.map((c) => `${c.geography}: ${c.wildfire}`).join('; ') })
    out.push({ key: 'wind', label: 'Wind / hurricane / tornado (NRI)', score: wind, detail: nri.map((c) => `${c.geography}: strong wind ${c.strongWind}, hurricane ${c.hurricane}, tornado ${c.tornado}`).join('; ') })
    out.push({ key: 'drought', label: 'Drought rating (NRI)', score: drought, detail: nri.map((c) => `${c.geography}: ${c.drought}`).join('; ') })
    out.push({ key: 'nri-context', label: 'Overall NRI (context only, not in the score)', score: null, detail: `${geogs}. Overall NRI risk scores rise with the value of what a county can lose, so large counties often look riskier than small ones. Hazard ratings, not this composite, go into the climate sub-score. ${nri.map((c) => c.role).filter((r) => r !== 'primary').join(' ')}`.trim() })
  } else if (CANADA_CLIMATE[place.id]) {
    const c = CANADA_CLIMATE[place.id]
    out.push({ key: 'canada-climate', label: 'Canadian climate (approximate)', score: MARK_SCORE[c.mark], detail: c.summary })
  } else {
    out.push({ key: 'climate', label: 'Climate risk index', score: null, detail: 'No FEMA NRI county extract or sourced Canadian regional climate note is on file for this place.' })
  }

  const water = WATER_SUPPLY[place.id]
  out.push({
    key: 'water',
    label: 'Water-supply security',
    score: water ? MARK_SCORE[water.mark] : null,
    detail: water ? `${water.summary}${water.approximate ? ' Approximate.' : ''}` : 'Not sourced in this pass.',
  })

  const aw = place.airWater
  if (aw) {
    const smoke = /smoke|wildfire/i.test(`${aw.note} ${aw.air.summary}`)
    if (smoke) {
      const mark = aw.air.mark
      out.push({ key: 'smoke', label: 'Wildfire smoke (from this report’s air notes)', score: MARK_SCORE[mark], detail: aw.air.summary })
    }
  }
  return out
}

function powerScore(place: Place): FactorScore {
  const eia = EIA_RESIDENTIAL_2025[place.id]
  const hqPrice = HQ_RESIDENTIAL_2025[place.id]
  if (eia) {
    const c = eia.cents
    const avg = EIA_SOURCE.usAverageCents
    const score = c <= avg ? 3 : c <= avg + 5 ? 1.5 : 0
    return { key: 'power', label: 'Residential electricity price (state, EIA 2025)', score, detail: `${eia.state} averaged ${c.toFixed(2)} ¢/kWh in 2025 versus a U.S. average of ${avg.toFixed(2)} ¢/kWh (EIA Table 2.10, final). State average, not a town rate. Grid reliability (SAIDI/SAIFI) is not scored — it was not pulled in a uniform official table this pass.` }
  }
  if (hqPrice) {
    const c = hqPrice.usdCents
    const avg = EIA_SOURCE.usAverageCents
    const score = c <= avg ? 3 : c <= avg + 5 ? 1.5 : 0
    return { key: 'power', label: 'Residential electricity price (Hydro-Québec 2025 city study)', score, detail: `${hqPrice.city}: ${hqPrice.cadCents.toFixed(2)} Canadian ¢/kWh excluding taxes at 1,000 kWh/month on 1 April 2025 (${c.toFixed(2)} U.S. ¢/kWh at the report’s C$1 = US$0.6970). ${hqPrice.note ?? ''} Compared only loosely with the EIA 2025 U.S. average of ${avg.toFixed(2)} ¢/kWh — different methods. Grid reliability is not scored.` }
  }
  return { key: 'power', label: 'Electricity price', score: null, detail: 'No EIA state or Hydro-Québec study city price is on file.' }
}

function selfSufficiency(place: Place): FactorScore {
  const homes = qualifyingHomes(place.id)
  const acres = homes.filter((h) => h.acres >= 1)
  const aw = place.airWater
  const well = aw ? /well/i.test(`${aw.water.listingSupply} ${aw.water.wellRisks.join(' ')} ${aw.note}`) : false
  if (!acres.length && !place.listings.length) {
    return { key: 'self', label: 'Acreage / well self-sufficiency', score: null, detail: 'No priced acreage listing is on file to judge lot-level self-sufficiency.' }
  }
  if (acres.length && well) {
    return { key: 'self', label: 'Acreage / well self-sufficiency', score: 3, detail: `${acres.length} priced listing(s) on at least 1 acre, and this report’s water notes treat private wells as typical or listed. A well test is still required before buying.` }
  }
  if (acres.length) {
    return { key: 'self', label: 'Acreage / well self-sufficiency', score: 1.5, detail: `${acres.length} priced listing(s) on at least 1 acre. Well versus municipal water is not clearly a pass in the water notes.` }
  }
  return { key: 'self', label: 'Acreage / well self-sufficiency', score: 1.5, detail: 'The report mentions acreage here, but a qualifying priced 1-acre-plus listing was not confirmed in the current homes list.' }
}

function broadbandFactor(place: Place): FactorScore {
  const text = `${place.infrastructure ?? ''} ${place.listings.map((l) => `${l.description} ${l.note ?? ''}`).join(' ')}`
  if (/fibre|fiber|fibe|broadband/i.test(text)) {
    return { key: 'broadband', label: 'Broadband (from this report only)', score: 3, detail: 'The report already notes fibre or broadband at this place or on an example listing. This is not a new FCC or CRTC coverage survey.' }
  }
  return { key: 'broadband', label: 'Broadband', score: null, detail: 'No fibre/broadband mention is in this report’s infrastructure or listing notes, and a new official coverage extract was not added this pass.' }
}

export function aiFactors(place: Place): FactorScore[] {
  const out: FactorScore[] = []
  const q = QCEW_COUNTIES[place.id]
  if (q?.length) {
    const high = mean(q.map((c) => c.highExposurePct)).avg
    const low = mean(q.map((c) => c.lowerExposurePct)).avg
    const gov = mean(q.map((c) => c.governmentPct)).avg
    const health = mean(q.map((c) => c.healthPct)).avg
    const constr = mean(q.map((c) => c.constructionPct)).avg
    const mfg = mean(q.map((c) => c.manufacturingPct)).avg
    const resilient = [gov, health, constr, mfg, mean(q.map((c) => c.transportationPct)).avg].every((n) => n == null)
      ? null
      : [gov, health, constr, mfg, mean(q.map((c) => c.transportationPct)).avg].reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
    const hhi = mean(q.map((c) => c.hhi)).avg
    const geog = q.map((c) => c.geography).join('; ')
    const highScore = high == null ? null : high <= 10 ? 3 : high <= 18 ? 1.5 : 0
    const resScore = resilient == null ? null : resilient >= 40 ? 3 : resilient >= 28 ? 1.5 : 0
    const divScore = hhi == null ? null : hhi <= 900 ? 3 : hhi <= 1100 ? 1.5 : 0
    let highDetail = `${geog}, 2024 annual QCEW: share of employment in information, finance, professional services and management is ${high == null ? 'not fully disclosed' : `${high.toFixed(1)}%`}. Lower-exposure goods and trades (agriculture, mining, utilities, construction, manufacturing, transportation) are ${low == null ? 'not fully disclosed' : `${low.toFixed(1)}%`}. This is an industry-mix proxy, not a published Brookings occupation-exposure rate. Exposure is not the same as job loss.`
    if (BROOKINGS_COUNTY_NOTES[place.id]) highDetail += ` ${BROOKINGS_COUNTY_NOTES[place.id]}`
    out.push({ key: 'exposure', label: 'Higher-exposure industry share (QCEW 2024)', score: highScore, detail: highDetail })
    out.push({ key: 'resilient-jobs', label: 'Healthcare, government and trades share (QCEW 2024)', score: resScore, detail: `${geog}: government ${gov ?? 'n/a'}%, health care ${health ?? 'n/a'}%, construction ${constr ?? 'n/a'}%, manufacturing ${mfg ?? 'n/a'}% of total employment (2024 annual). County-wide, not town-only.` })
    out.push({ key: 'diversity', label: 'Economic diversity (HHI of sector shares)', score: divScore, detail: `${geog}: Herfindahl index of QCEW sector shares is ${hhi == null ? 'unknown' : Math.round(hhi)}. Lower is more diverse. Built only from disclosed sectors.` })
  } else if (place.country === 'Canada') {
    out.push({ key: 'exposure', label: 'Industry mix / AI occupational exposure', score: null, detail: 'No Statistics Canada CMA industry-mix extract was added this pass, and Brookings county exposure figures are U.S.-only. Left unknown rather than guessed.' })
  } else {
    out.push({ key: 'exposure', label: 'Industry mix / AI occupational exposure', score: null, detail: 'No QCEW county extract is on file for this place.' })
  }

  const uni = place.amenities ? nearest(place.amenities.university) : undefined
  if (uni?.driveMin != null) {
    const score = uni.driveMin <= 30 ? 3 : uni.driveMin <= 60 ? 1.5 : 0
    out.push({ key: 'university', label: 'University / college nearby', score, detail: `${uni.name} is about ${uni.driveMin} min from the place’s base (this report’s amenities, ${place.amenities!.asOf}). Useful for retraining; it does not cancel occupational exposure.` })
  } else {
    out.push({ key: 'university', label: 'University / college nearby', score: null, detail: 'No sourced university drive time is on file.' })
  }

  out.push(powerScore(place))
  out.push(broadbandFactor(place))
  out.push(selfSufficiency(place))
  return out
}

function whyFuture(place: Place, climate: number | null, ai: number | null, combined: number | null, cf: FactorScore[], af: FactorScore[]): { why: string; strengths: string[]; tradeoffs: string[] } {
  const strengths: string[] = []
  const tradeoffs: string[] = []
  for (const f of [...cf, ...af]) {
    if (f.score == null) continue
    if (f.score >= 2.4) strengths.push(`${f.label}: ${f.detail}`)
    else if (f.score <= 1.5) tradeoffs.push(`${f.label}: ${f.detail}`)
  }
  if (place.status === 'parked') tradeoffs.unshift('This place is parked at his request (Oregon), so it is shown for context rather than as a current pick.')
  if (place.cutReason) tradeoffs.push(place.cutReason)
  const bits: string[] = []
  bits.push(`${place.name} has a combined future-proof score of ${combined == null ? 'not available' : `${combined.toFixed(2)} / 3`}, from a climate sub-score of ${climate == null ? 'unknown' : `${climate.toFixed(2)} / 3`} and an AI-resilience sub-score of ${ai == null ? 'unknown' : `${ai.toFixed(2)} / 3`}.`)
  const clim = cf.find((f) => f.key === 'canada-climate' || f.key === 'heat' || f.key === 'nri-context')
  if (clim) bits.push(clim.key === 'canada-climate' ? clim.detail : (cf.find((f) => f.key === 'nri-context')?.detail ?? clim.detail))
  const water = cf.find((f) => f.key === 'water')
  if (water) bits.push(water.detail)
  const exp = af.find((f) => f.key === 'exposure')
  if (exp) bits.push(exp.detail)
  if (place.country === 'Canada') bits.push('Canadian climate and power figures are approximate and are not compared as if they were FEMA NRI or EIA state averages.')
  return { why: bits.slice(0, 4).join(' '), strengths: strengths.slice(0, 6), tradeoffs: tradeoffs.slice(0, 6) }
}

export function rankFuture(place: Place): FutureRanked {
  const cf = climateFactors(place)
  const af = aiFactors(place)
  const cRaw = mean(cf.filter((f) => f.key !== 'nri-context').map((f) => f.score))
  const aRaw = mean(af.map((f) => f.score))
  // A sub-score is only used when enough official factors were found, so a single
  // cheap-power or water note cannot top the list on thin evidence.
  const c = { avg: cRaw.known >= 2 ? cRaw.avg : null, known: cRaw.known }
  const a = { avg: aRaw.known >= 3 ? aRaw.avg : null, known: aRaw.known }
  const both = mean([c.avg, a.avg])
  const text = whyFuture(place, c.avg, a.avg, both.avg, cf, af)
  return {
    place,
    climate: c.avg,
    ai: a.avg,
    combined: both.avg,
    climateKnown: c.known,
    aiKnown: a.known,
    climateFactors: cf,
    aiFactors: af,
    ...text,
  }
}

export function rankFutureList(places: Place[]): FutureRanked[] {
  return places
    .filter((p) => !p.minor)
    .map(rankFuture)
    .filter((r) => r.combined != null && (r.climateKnown + r.aiKnown) >= 5)
    .sort((a, b) => (b.combined ?? -1) - (a.combined ?? -1) || (b.climateKnown + b.aiKnown) - (a.climateKnown + a.aiKnown) || a.place.short.localeCompare(b.place.short))
}

export const FUTURE_METHOD = `US climate uses FEMA’s National Risk Index county table, version 1.20.0 (December 2025): heat-wave, inland flood, coastal flood (when it applies), wildfire, wind/hurricane/tornado, and drought ratings. Ratings map to 0–3 (Very Low = 3, Very High = 0). The overall NRI risk score is shown for context but is not averaged in, because it rises with the value of what a county can lose and so favours small counties. Water-supply security is a separate, sourced basin note (for example Great Lakes / St. Lawrence versus Colorado River or Lake Lanier dependence). Wildfire smoke is scored only when this report’s air-quality notes already mention it. Projected counts of extreme-heat days are left unknown — no single official county table was applied. First Street Foundation factors were not used.

Canadian climate is labelled approximate. Canada has no FEMA-NRI equivalent at county scale in this file. Notes use Public Safety Canada’s National Risk Profile (2023, revised January 2024), the IMF’s July 2025 Canada climate-risk technical note, and ClimateData.ca’s citation of Canada’s Changing Climate Report 2026 on rising hot extremes. They are not compared as if they were NRI scores.

AI resilience does not use our food, acreage, or 4/3 listing rules as gates. For U.S. places, 2024 BLS QCEW county employment supplies an industry-mix proxy: the share in information, finance, professional services and management (higher generative-AI exposure per Brookings, 19 February 2025, which built on OpenAI/Eloundou et al. 2023), the share in health care, government, construction and manufacturing, and a sector Herfindahl diversity index. County figures describe the whole county, not just the town. Brookings’ published “around 40% or more” occupation-exposure figure is cited only for King County, which that paper names. Canadian industry mix is left unknown. Other AI factors, when sourced, are university drive time from this report, EIA 2025 state (or Hydro-Québec 1 April 2025 city) residential electricity prices, broadband only if this report already mentions fibre, and acreage/well self-sufficiency from existing listings and water notes. Grid reliability is not scored. Unknown factors are left out of the average, never treated as zero. A climate sub-score is used only when at least two climate factors are known; an AI sub-score only when at least three are known, so a single cheap-power or water note cannot top the list. Combined rank is the average of the climate and AI sub-scores when both exist, and a place needs at least five known factors in total to appear in the ranked list.`

