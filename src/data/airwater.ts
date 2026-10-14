// Air & water findings, checked 14 Oct 2026. Every number below comes from the source named next to it.
// Places with no entry show 'not checked yet'.
import type { Mark } from './places'

export interface AWFact { label: string; value: string; source: string }
export interface AWSource { label: string; url: string }
export interface AirWater {
  checked: string
  overall: Mark
  note: string
  air: { mark: Mark; summary: string; station: string; facts: AWFact[] }
  water: {
    mark: Mark
    summary: string
    municipal: AWFact[]
    listingSupply: string
    wellRisks: string[]
  }
  sources: AWSource[]
}

export const WELL_TEST =
  'Get a full well test before buying, from an accredited lab: bacteria (total coliform / E. coli), nitrate, arsenic, uranium, lead, manganese, fluoride, sodium, plus radon-in-water where flagged and PFAS where a hotspot is nearby. Retest bacteria every year.'

export const AW_METHOD =
  'US air: EPA AirData annual county files (2024 and 2025, downloaded 14 Oct 2026) and American Lung Association “State of the Air” 2026 (covers 2022–2024). EPA’s annual PM2.5 standard is 9 µg/m³; ozone “days over” = days a monitor’s 8-hour ozone topped the 0.070 ppm standard. Canada air: Ontario Ministry of Environment annual station statistics (PM2.5 2003–2025 and ozone files, updated 27 Jul 2026; reference level 8.8 µg/m³) and the Quebec air monitoring network annual means. Water: utility Consumer Confidence Reports / city drinking-water reports, EPA SDWIS violation history and EPA UCMR 5 PFAS results (2023–2025; PFOA/PFOS limit 4 ppt, 2024 rule), and state/provincial well guidance.'

const LISTING_UNKNOWN = 'The example listings don’t say well or septic: not checked yet. Rural acreage outside a water service area is normally on a private well and septic, so confirm with the listing agent.'
const LISTING_UNKNOWN_CA = 'The example listings don’t say well or septic: not checked yet. Rural acreage outside village water systems is normally on a private well and septic, so confirm with the listing agent.'

const EPA_AIRDATA: AWSource = { label: 'EPA AirData pre-generated annual files', url: 'https://aqs.epa.gov/aqsweb/airdata/download_files.html' }
const ON_STATS: AWSource = { label: 'Ontario annual air pollutant statistics (data.ontario.ca)', url: 'https://data.ontario.ca/dataset/annual-air-pollutant-statistics' }
const ON_2023: AWSource = { label: 'Air Quality in Ontario 2023 Report', url: 'https://www.ontario.ca/document/air-quality-ontario-2023-report/10-year-trends-and-annual-results' }
const ON_WELL_HAMILTON: AWSource = { label: 'City of Hamilton: arsenic limits in drinking well water', url: 'https://www.hamilton.ca/home-neighbourhood/home-property/private-wells-cisterns/arsenic-limits-drinking-well-water' }
const PHO_WELL: AWSource = { label: 'Public Health Ontario: well water testing', url: 'https://www.publichealthontario.ca/en/laboratory-services/well-water-testing' }
const OPH_WELL: AWSource = { label: 'Ottawa Public Health: private wells', url: 'https://www.ottawapublichealth.ca/en/public-health-topics/private-wells.aspx' }
const OTT_WATER: AWSource = { label: 'City of Ottawa: Municipal Drinking Water Systems 2025 Summary Report (Apr 2026)', url: 'https://pub-ottawa.escribemeetings.com/filestream.ashx?DocumentId=308346' }
const ala = (state: string, county: string): AWSource => ({ label: `ALA State of the Air 2026: ${county} County`, url: `https://www.lung.org/research/sota/city-rankings/states/${state}/${county.toLowerCase()}` })

const OTTAWA_AIR = (where: string): AirWater['air'] => ({
  mark: 'pass',
  summary: `Clean overall. The nearest provincial station (Ottawa Downtown, urban, so ${where} is likely a bit cleaner) averaged well under the 8.8 µg/m³ reference level in 2024 and 2025. Wildfire smoke shows up as spikes: 2023 (24-hour max 189 µg/m³) and 2025 (9 days above the 24-hour limit).`,
  station: 'Ottawa Downtown (Rideau St.), Ontario MECP',
  facts: [
    { label: 'PM2.5 annual mean', value: '2023: 8.95 · 2024: 5.86 · 2025: 6.68 µg/m³ (reference 8.8)', source: 'Ontario MECP PM2.5 statistics' },
    { label: 'Smoke days', value: '24-hour PM2.5 above the 27 µg/m³ criterion: 9 times in 2023, 0 in 2024, 9 in 2025 (2025 max 90 µg/m³)', source: 'Ontario MECP PM2.5 statistics' },
    { label: 'Ozone', value: '0 hours above the 1-hour criterion in 2023, 2024 and 2025', source: 'Ontario MECP ozone statistics' },
  ],
})

const OTTAWA_WELLS = [
  'Ottawa Public Health tests private wells free for bacteria only (E. coli, total coliform); chemistry (arsenic, uranium, fluoride, sodium) needs a private accredited lab.',
  'Ottawa Public Health advises testing sodium at least every 5 years (20 mg/L advisory level for sodium-restricted diets); the City of Ottawa also offers free fluoride testing for well water.',
  'Ontario limits: arsenic 0.010 mg/L, uranium 0.020 mg/L.',
]

const OTTAWA_MUNI: AWFact[] = [
  { label: 'City of Ottawa systems', value: 'The 2025 summary report says water met Ontario standards; 4 minor non-compliances (staffing / recording failures), none affecting water quality. Relevant only if the lot is inside a city-serviced village.', source: 'City of Ottawa 2025 Summary Report (Apr 2026)' },
]

export const AIRWATER: Record<string, AirWater> = {
  forsyth: {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Water good on county supply; air partial (no county monitor, neighbouring Gwinnett fails the annual PM2.5 grade); wells need radon/uranium tests.',
    air: {
      mark: 'partial',
      summary: 'Forsyth County has no EPA monitor (ALA: “data not collected”). Nearest monitors: Gwinnett (just south) got ozone D, 24-hour particles C and failed the annual PM2.5 grade (design value 9.1); Hall (just north) passed (8.0).',
      station: 'Gwinnett and Hall County monitors (none in Forsyth)',
      facts: [
        { label: 'ALA 2026, Forsyth', value: 'DNC (no data collected) for ozone and particles', source: 'ALA State of the Air 2026' },
        { label: 'ALA 2026, Gwinnett', value: 'Ozone D (5 orange, 1 red day) · 24-h PM C · annual PM Fail (9.1)', source: 'ALA State of the Air 2026' },
        { label: 'ALA 2026, Hall', value: '24-h PM C · annual PM Pass (8.0)', source: 'ALA State of the Air 2026' },
        { label: 'PM2.5 annual mean', value: 'Gwinnett 2024: 8.68 (incomplete year), 2025: 7.91 · Hall 2024: 7.51, 2025: 7.25 µg/m³ (standard 9)', source: 'EPA AirData annual by monitor' },
        { label: 'Ozone days over standard', value: 'Gwinnett: 1 (2024), 0 (2025)', source: 'EPA AirData annual by monitor' },
      ],
    },
    water: {
      mark: 'pass',
      summary: 'County water is clean: met all EPA and Georgia standards, PFAS below the 4 ppt limits, no health-based violations on record.',
      municipal: [
        { label: 'Forsyth County Water & Sewer CCR', value: '2026 report (2025 data): met all EPA and state health standards. Lead 90th percentile within the action level (2024 sampling; next round summer 2027).', source: 'Forsyth County Water Quality Reports' },
        { label: 'PFAS', value: 'Nov 2025 testing of finished water below 4 ppt; no PFAS above EPA UCMR 5 reporting levels.', source: 'Forsyth County “About PFAS”; EPA UCMR 5' },
        { label: 'EPA SDWIS', value: '26 violations on record, 0 health-based, latest in 2021 (mostly report-delivery paperwork).', source: 'EPA SDWIS (GA1170050)' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'Granite-rich Georgia Piedmont: uranium decay can put radon in well water; UGA Extension Forsyth County reports wells in the county testing positive for radon.',
        'UGA Extension recommends yearly basic and bacteria tests for private wells, plus radon/uranium tests in North Georgia (UGA lab, via the Forsyth Extension office).',
      ],
    },
    sources: [
      ala('georgia', 'Forsyth'), ala('georgia', 'Gwinnett'), EPA_AIRDATA,
      { label: 'Forsyth County Water Quality Reports', url: 'https://www.forsythco.com/government/departments/water-sewer/water-quality/' },
      { label: 'Forsyth County: About PFAS', url: 'https://www.forsythco.com/government/departments/water-sewer/educational-resources/about-pfas/' },
      { label: 'UGA Extension Forsyth: radon detected in county well water', url: 'https://site.extension.uga.edu/forsyth/radon-detected-in-county-well-water/' },
    ],
  },
  'happy-valley': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Air mostly clean (median AQI 30–31) but ALA ozone D; Sunrise Water had PFOS at 4.3 ppt in 2 of 16 EPA samples.',
    air: {
      mark: 'pass',
      summary: 'Among the cleanest air in the set: Clackamas County median AQI 30 (2024) and 31 (2025), with 325 and 318 “good” days. ALA still grades ozone D from a few summer days.',
      station: 'Clackamas County monitors (Carus – Spangler Rd for ozone)',
      facts: [
        { label: 'Median AQI', value: '2024: 30 · 2025: 31 (max 127 / 119)', source: 'EPA AirData annual AQI by county' },
        { label: 'Unhealthy-for-sensitive days', value: '2024: 6 · 2025: 2; no “unhealthy” days', source: 'EPA AirData annual AQI by county' },
        { label: 'Ozone days over standard', value: '2024: 4 · 2025: 2 (Carus)', source: 'EPA AirData annual by monitor' },
        { label: 'ALA 2026', value: 'Ozone D (8 orange days) · particles not graded (DNC)', source: 'ALA State of the Air 2026' },
        { label: 'PM2.5 annual mean', value: 'No county annual value against the standard: not checked yet', source: '—' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'Sunrise Water Authority (Happy Valley) meets all standards and has no known lead service lines, but EPA UCMR 5 found PFOS at 4.3 ppt in 2 of 16 samples (Dec 2024 – Sep 2025), just over the 4 ppt limit. That is a one-off survey, not a compliance violation (compliance is a running annual average, due 2029).',
      municipal: [
        { label: 'Sunrise Water CCR', value: '2025 report: all sources meet federal and Oregon standards. Lead 90th percentile 3 ppb (2023, 45 homes, none over 15 ppb). No known lead service lines (2024 inventory).', source: 'Sunrise Water Authority Water Quality' },
        { label: 'PFAS', value: 'PFOS max 4.3 ppt (2 of 16 samples), the only PFAS of 29 detected.', source: 'EPA UCMR 5 (OR4100635)' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'Oregon law: when a home with a domestic well sells, the seller must test for arsenic, nitrate and total coliform and give results to the buyer and the Oregon Health Authority.',
        'Oregon DEQ’s Clackamas drinking water assessment documents private wells above the 10 mg/L nitrate limit; arsenic is a statewide concern.',
      ],
    },
    sources: [
      ala('oregon', 'Clackamas'), EPA_AIRDATA,
      { label: 'Sunrise Water Authority: Water Quality', url: 'https://www.sunrisewateror.gov/your-water/water-quality/' },
      { label: 'EPA UCMR 5 data finder', url: 'https://www.epa.gov/dwucmr/data-summary-fifth-unregulated-contaminant-monitoring-rule' },
      { label: 'Oregon Health Authority: domestic well testing rules', url: 'https://www.oregon.gov/oha/ph/healthyenvironments/drinkingwater/sourcewater/domesticwellsafety/pages/testing-regulations.aspx' },
      { label: 'Oregon DEQ: Clackamas drinking water assessment', url: 'https://www.oregon.gov/deq/wq/Documents/clackamasDWAssessment.pdf' },
    ],
  },
  duvall: {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'City water clean (no PFAS, no health violations); King County ALA grades are F (smoke and summer ozone), though the nearby valley monitors are clean.',
    air: {
      mark: 'partial',
      summary: 'King County gets F grades from ALA for ozone and 24-hour particles (wildfire smoke days), but passes on annual PM2.5 (8.3). The monitors nearest the valley (North Bend, Issaquah) are clean: 0 ozone days over the standard in 2025.',
      station: 'North Bend and Issaquah (Lake Sammamish) ozone monitors; Seattle-area PM2.5 monitors',
      facts: [
        { label: 'ALA 2026', value: 'Ozone F (13 orange days) · 24-h PM F (9 orange, 2 red) · annual PM Pass (8.3)', source: 'ALA State of the Air 2026' },
        { label: 'Median AQI (county)', value: '2024: 41 · 2025: 43', source: 'EPA AirData annual AQI by county' },
        { label: 'Ozone days over standard', value: 'North Bend: 0 (2024), 0 (2025) · Issaquah: 2 (2024), 0 (2025)', source: 'EPA AirData annual by monitor' },
        { label: 'PM2.5 annual mean', value: '4.7–7.0 µg/m³ across King County monitors in 2024–2025 (standard 9)', source: 'EPA AirData annual by monitor' },
      ],
    },
    water: {
      mark: 'pass',
      summary: 'City of Duvall water: no PFAS detected in EPA UCMR 5 (0 of 116 samples), no health-based violations on record.',
      municipal: [
        { label: 'City of Duvall CCR', value: '2026 Water Quality Report (2025 results) published; lead result: not checked yet.', source: 'City of Duvall Water System Information' },
        { label: 'PFAS', value: 'None detected above reporting levels (UCMR 5).', source: 'EPA UCMR 5 (WA5320750)' },
        { label: 'EPA SDWIS', value: '6 violations on record, 0 health-based.', source: 'EPA SDWIS (WA5320750)' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'Washington DOH: arsenic occurs naturally in some Puget Sound groundwater; test at least twice (late summer and early spring), limit 10 ppb.',
        'King County requires arsenic under 10 ppb for new or replacement private wells; 10–50 ppb needs an approved treatment system.',
      ],
    },
    sources: [
      ala('washington', 'King'), EPA_AIRDATA,
      { label: 'City of Duvall: Water System Information', url: 'https://duvallwa.gov/157/Water-System-Information' },
      { label: 'WA DOH: Arsenic and your private well', url: 'https://doh.wa.gov/you-and-your-family/arsenic-and-your-private-well' },
    ],
  },
  maryville: {
    checked: '14 Oct 2026', overall: 'pass',
    note: 'Air passes (ALA C/C/Pass, PM2.5 ~6.4–6.8); city water met all standards with no PFAS detected; karst wells need bacteria tests.',
    air: {
      mark: 'pass',
      summary: 'Decent air: ALA grades ozone C and 24-hour particles C, and the annual PM2.5 passes (design value 7.2). Few bad days: 0 unhealthy-for-sensitive days in 2024, 1 in 2025.',
      station: 'Maryville PM2.5 monitor; Great Smoky Mountains ozone monitors',
      facts: [
        { label: 'ALA 2026', value: 'Ozone C (5 orange days) · 24-h PM C · annual PM Pass (7.2)', source: 'ALA State of the Air 2026' },
        { label: 'PM2.5 annual mean', value: 'Maryville 2024: 6.84 · 2025: 6.41 µg/m³ (standard 9)', source: 'EPA AirData annual by monitor' },
        { label: 'Ozone days over standard', value: 'Smokies monitors: 0 (2024), 1 (2025)', source: 'EPA AirData annual by monitor' },
        { label: 'Median AQI', value: '2024: 47 · 2025: 44', source: 'EPA AirData annual AQI by county' },
      ],
    },
    water: {
      mark: 'pass',
      summary: 'City of Maryville water met all EPA health standards; lead 90th percentile 0.5 ppb; no PFAS detected.',
      municipal: [
        { label: 'Maryville Water Quality Report 2026', value: 'Met all EPA health standards. Lead 90th percentile 0.5 ppb (action level 15); one first sample was high, the retest was 1.3 ppb (suspected sampling error).', source: 'City of Maryville Water Quality Report 2026' },
        { label: 'PFAS', value: 'No detections above reporting limits.', source: 'EPA UCMR 5 (TN0000438)' },
        { label: 'Lead lines', value: 'City reports no city-side lead service lines in use; some customer-side lines unverified.', source: 'City of Maryville Lead and Copper Rule page' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'East Tennessee limestone (karst) wells can pick up bacteria quickly after heavy rain; test for coliform yearly and after floods or cloudy water (UT Extension W1127).',
        'Blount County Environmental Health tests private wells for bacteria on request (865-681-9301).',
      ],
    },
    sources: [
      ala('tennessee', 'Blount'), EPA_AIRDATA,
      { label: 'City of Maryville Water Quality Report 2026', url: 'https://www.maryvillegov.com/uploads/8/2/6/7/8267180/water_quality_report_2026.pdf' },
      { label: 'City of Maryville: Lead and Copper Rule', url: 'https://www.maryvillegov.com/lead.html' },
      { label: 'Blount County Environmental Health', url: 'https://blounttn.gov/299/Environmental-Health' },
    ],
  },
  elizabeth: {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'No Elbert monitor; neighbouring Douglas County fails ozone badly (Denver smog). Town water has an old violation record and no EPA PFAS test.',
    air: {
      mark: 'partial',
      summary: 'Elbert County has no monitor. Next door, Douglas County (Chatfield) and Arapahoe get ALA ozone F (Front Range summer smog). Particles are low: annual PM2.5 about 4.5–5.4 µg/m³.',
      station: 'Douglas (Chatfield State Park) and Arapahoe (Aurora East) monitors; none in Elbert',
      facts: [
        { label: 'ALA 2026, Elbert', value: 'DNC (no data collected)', source: 'ALA State of the Air 2026' },
        { label: 'ALA 2026, Douglas', value: 'Ozone F (50 orange, 5 red days) · 24-h PM B · annual PM Pass (4.6)', source: 'ALA State of the Air 2026' },
        { label: 'ALA 2026, Arapahoe', value: 'Ozone F (34 orange, 2 red) · 24-h PM A · annual PM Pass (5.3)', source: 'ALA State of the Air 2026' },
        { label: 'Ozone days over standard', value: 'Chatfield: 24 (2024), 7 (2025) · Aurora East: 16 (2024), 2 (2025)', source: 'EPA AirData annual by monitor' },
        { label: 'PM2.5 annual mean', value: 'Chatfield 2024: 4.50 · 2025: 4.52 µg/m³', source: 'EPA AirData annual by monitor' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'Town of Elizabeth (groundwater): 191 EPA violations on record, 12 health-based (coliform, latest 1999); most are monitoring lapses from 2004–2008. No EPA UCMR 5 PFAS result on file, so PFAS is untested, not clean. Latest CCR: not checked yet.',
      municipal: [
        { label: 'EPA SDWIS', value: '191 violations: 12 coliform MCL (latest 1999), the rest monitoring/reporting (latest listed 2008).', source: 'EPA SDWIS (CO0120010)' },
        { label: 'PFAS', value: 'No UCMR 5 test on file: not checked yet.', source: 'EPA UCMR 5' },
        { label: 'Town CCR', value: 'Not checked yet.', source: '—' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'Denver Basin bedrock wells: USGS (2003–05 sampling) found generally low nitrate and no uranium over the limit, but wells vary; manganese and iron are the common nuisance issues.',
        'Test coliform and nitrate yearly; uranium, arsenic, fluoride and radon-in-water on purchase.',
      ],
    },
    sources: [
      ala('colorado', 'Elbert'), ala('colorado', 'Douglas'), EPA_AIRDATA,
      { label: 'EPA SDWIS: Town of Elizabeth (CO0120010)', url: 'https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/200?P200_PWSID=CO0120010' },
      { label: 'USGS SIR 2014–5051: Denver Basin groundwater quality', url: 'https://pubs.usgs.gov/sir/2014/5051/' },
    ],
  },
  boise: {
    checked: '14 Oct 2026', overall: 'fail',
    note: 'Worst air in the set: ALA ozone F, 24-hour particles D, and 2024 annual PM2.5 9.2 (over the standard) during smoke season. Water OK.',
    air: {
      mark: 'fail',
      summary: 'ALA grades Ada County ozone F and 24-hour particles D. In 2024, the Meridian monitor averaged 9.2 µg/m³ PM2.5 (over the 9 standard) and the county had 28 unhealthy-for-sensitive and 6 unhealthy days (max AQI 214). 2025 was much cleaner (0 such days).',
      station: 'Meridian (St. Luke’s) and Boise White Pine monitors',
      facts: [
        { label: 'ALA 2026', value: 'Ozone F (26 orange, 2 red, 1 purple) · 24-h PM D · annual PM INC', source: 'ALA State of the Air 2026' },
        { label: 'PM2.5 annual mean', value: 'Meridian 2024: 9.20 · 2025: 4.92 (incomplete year) µg/m³ (standard 9)', source: 'EPA AirData annual by monitor' },
        { label: 'Bad days (county)', value: '2024: 28 sensitive + 6 unhealthy, max AQI 214 · 2025: 0 + 0, max 97', source: 'EPA AirData annual AQI by county' },
        { label: 'Ozone days over standard', value: '1 per monitor in 2024, 0 in 2025', source: 'EPA AirData annual by monitor' },
      ],
    },
    water: {
      mark: 'pass',
      summary: 'Veolia Water Idaho: lead 90th percentile 3 ppb, arsenic 2.71 ppb (limit 10), no PFAS detected, no federal violations recorded.',
      municipal: [
        { label: 'Veolia Water Idaho CCR', value: '2025 report: lead 0.003 mg/L (action level 0.015); arsenic 2.71 ppb.', source: 'Veolia Water Idaho CCR via EPA data' },
        { label: 'PFAS', value: 'Not detected (UCMR 5).', source: 'EPA UCMR 5 (ID4010016)' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'Idaho DEQ / Ada County regional wells study: arsenic, nitrate and uranium are the groundwater constituents of concern.',
        'Idaho DHW: test nitrate and bacteria yearly, arsenic every 3–5 years; free private-well test kits are available.',
      ],
    },
    sources: [
      ala('idaho', 'Ada'), EPA_AIRDATA,
      { label: 'Idaho DEQ: groundwater quality', url: 'https://www.deq.idaho.gov/water-quality/groundwater/groundwater-quality/' },
      { label: 'Idaho DHW: drinking water and private wells', url: 'https://healthandwelfare.idaho.gov/health-wellness/environmental-health/drinking-water-and-private-wells' },
    ],
  },
  cantley: {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Air clean (Gatineau PM2.5 6.0 in 2024); 2023 smoke pushed it to 10.0. All wells here: uranium is a known Outaouais issue.',
    air: {
      mark: 'pass',
      summary: 'Clean outside smoke years. Gatineau – Hull (Quebec network) PM2.5 annual mean 6.01 µg/m³ in 2024 but 10.01 in 2023, the wildfire year. Quebec’s 2023 review says 88% of smog days that year were from wildfires. 2025 annual value not yet published.',
      station: 'Gatineau – Hull (Quebec air monitoring network, station 07002)',
      facts: [
        { label: 'PM2.5 annual mean', value: '2022: 6.86 · 2023: 10.01 · 2024: 6.01 µg/m³ · 2025: not published yet', source: 'Quebec air monitoring network annual means' },
        { label: 'Wildfire smoke', value: '2023: Quebec recorded 340 PM2.5 exceedance-days province-wide vs 66 in 2024', source: 'Institut de la statistique du Québec' },
        { label: 'Ozone', value: 'Not checked yet', source: '—' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'No city water to judge: lots here are on private wells, so quality is per well. The Outaouais is a known uranium area, so test before buying. Gatineau’s municipal report doesn’t apply to Cantley/Chelsea wells (not checked).',
      municipal: [
        { label: 'Municipal supply', value: 'Gatineau drinking water report: not checked yet (doesn’t cover rural Cantley/Chelsea wells).', source: '—' },
      ],
      listingSupply: LISTING_UNKNOWN,
      wellRisks: [
        'INSPQ: naturally occurring uranium in Outaouais wells; exceedances recorded (up to 1,418 µg/L at Kitigan Zibi). Quebec standard 20 µg/L.',
        'Outaouais groundwater study (PACES, Université Laval 2013): uranium over the standard in about 5% of sampled wells.',
        'Quebec guidance: test bacteria twice a year and chemistry (including arsenic, limit 10 µg/L) at least once. The Municipality of Chelsea has its own wells-and-water-quality page.',
      ],
    },
    sources: [
      { label: 'Quebec air network: Gatineau – Hull PM2.5 annual means', url: 'https://www.environnement.gouv.qc.ca/air/reseau-surveillance/graphiques.asp?nom_contaminant=PM25&station=07002' },
      { label: 'Bilan de la qualité de l’air au Québec 2023', url: 'https://www.environnement.gouv.qc.ca/air/bilan/qualite-air-quebec-2023.pdf' },
      { label: 'ISQ: PM2.5 exceedance days', url: 'https://statistique.quebec.ca/fr/produit/publication/indicateurs-progres-depassements-particules-fines' },
      { label: 'INSPQ: uranium in drinking water', url: 'https://www.inspq.qc.ca/eau-potable/uranium' },
      { label: 'Municipalité de Chelsea: puits et qualité de l’eau', url: 'https://www.chelsea.ca/fr/residents/service-municipaux/environnement/puits-et-qualite-de-leau' },
    ],
  },
  'on-carp-huntley': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Air clean (Ottawa PM2.5 5.9–6.7 in 2024–25); smoke in 2023 and 2025. Acreage is on wells: test before buying.',
    air: OTTAWA_AIR('rural Carp'),
    water: {
      mark: 'partial',
      summary: 'Acreage here is on private wells, so quality is per well and unknown until tested. City of Ottawa water met standards in 2025, but only matters inside a serviced village.',
      municipal: OTTAWA_MUNI,
      listingSupply: LISTING_UNKNOWN_CA,
      wellRisks: OTTAWA_WELLS,
    },
    sources: [ON_STATS, ON_2023, OTT_WATER, OPH_WELL, PHO_WELL],
  },
  'on-dunrobin': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Same clean Ottawa air; wells near the river: test bacteria after flooding as well as the usual chemistry.',
    air: OTTAWA_AIR('Dunrobin'),
    water: {
      mark: 'partial',
      summary: 'Private wells, so quality is per well. This area already carries a flood caveat; test bacteria again after any flood.',
      municipal: OTTAWA_MUNI,
      listingSupply: LISTING_UNKNOWN_CA,
      wellRisks: [...OTTAWA_WELLS],
    },
    sources: [ON_STATS, ON_2023, OTT_WATER, OPH_WELL, PHO_WELL],
  },
  'on-north-gower': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Clean Ottawa air; private wells.',
    air: OTTAWA_AIR('North Gower'),
    water: { mark: 'partial', summary: 'Private wells, so quality is per well and unknown until tested.', municipal: OTTAWA_MUNI, listingSupply: LISTING_UNKNOWN_CA, wellRisks: OTTAWA_WELLS },
    sources: [ON_STATS, ON_2023, OTT_WATER, OPH_WELL, PHO_WELL],
  },
  'on-flamborough': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Hamilton air is the dirtiest of the Ontario options (PM2.5 7.1–8.5, over the reference level in 2023). The City lists elevated-arsenic well areas.',
    air: {
      mark: 'partial',
      summary: 'Hamilton stations run higher than Ottawa: PM2.5 7.1–8.5 µg/m³ in 2024–2025, and all three Hamilton stations were over the 8.8 reference level in the 2023 smoke year. There is no rural Flamborough station.',
      station: 'Hamilton West / Mountain / Downtown (Ontario MECP)',
      facts: [
        { label: 'PM2.5 annual mean', value: 'Hamilton West 2023: 9.53 · 2024: 7.06 · 2025: 7.91 · Hamilton Mountain 2023: 10.14 · 2024: 7.28 · 2025: 8.14 µg/m³ (reference 8.8)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Smoke days', value: '24-hour PM2.5 above 27 µg/m³ at Hamilton West: 15 (2023), 1 (2024), 10 (2025)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Ozone', value: '0 hours over the 1-hour criterion at Hamilton West 2023–2025', source: 'Ontario MECP ozone statistics' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'Private wells. The City of Hamilton publishes guidance on elevated arsenic in parts of rural Hamilton and flags western Flamborough/Beverly in its rural well report. The city’s own drinking water report: not checked yet (doesn’t cover wells).',
      municipal: [{ label: 'City of Hamilton drinking water report', value: 'Not checked yet (doesn’t cover rural wells).', source: '—' }],
      listingSupply: LISTING_UNKNOWN_CA,
      wellRisks: [
        'City of Hamilton: naturally elevated arsenic in some rural wells; limit 0.010 mg/L.',
        'Hamilton rural well water quality report (2017) flags western Flamborough/Beverly as a lead-risk area from bedrock.',
        'Ontario limit for uranium: 0.020 mg/L; Public Health Ontario tests bacteria free, chemistry needs a private lab.',
      ],
    },
    sources: [ON_STATS, ON_2023, ON_WELL_HAMILTON, { label: 'Hamilton rural well water quality report (2017)', url: 'https://www.hamilton.ca/sites/default/files/2022-06/waterdistribution-rural-well-water-quality-report-2017.pdf' }, PHO_WELL],
  },
  'on-oro-medonte': {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Clean Barrie air (6.2 in 2024, 7.7 in 2025); private wells or small township systems.',
    air: {
      mark: 'pass',
      summary: 'Barrie station PM2.5 under the reference level every year 2023–2025; smoke spikes in 2023 and 2025.',
      station: 'Barrie (83 Perry St., Ontario MECP)',
      facts: [
        { label: 'PM2.5 annual mean', value: '2023: 8.52 · 2024: 6.18 · 2025: 7.65 µg/m³ (reference 8.8)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Smoke days', value: '24-hour PM2.5 above 27 µg/m³: 12 (2023), 0 (2024), 14 (2025)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Ozone', value: '0 hours over the 1-hour criterion 2023–2025', source: 'Ontario MECP ozone statistics' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'Most rural lots are on private wells; Oro-Medonte runs some small municipal systems, with reports on the township’s Drinking Water page (contents not checked yet). Barrie’s report doesn’t apply.',
      municipal: [{ label: 'Township of Oro-Medonte drinking water', value: 'System reports published; contents not checked yet.', source: 'Township of Oro-Medonte' }],
      listingSupply: LISTING_UNKNOWN_CA,
      wellRisks: ['Ontario limits: arsenic 0.010 mg/L, uranium 0.020 mg/L; test any well with an accredited lab. Public Health Ontario tests bacteria free.'],
    },
    sources: [ON_STATS, ON_2023, { label: 'Township of Oro-Medonte: Drinking Water', url: 'https://www.oro-medonte.ca/working-here/township-departments/environmental-services/drinking-water/' }, PHO_WELL],
  },
  toronto: {
    checked: '14 Oct 2026', overall: 'partial',
    note: 'Air fine for a big metro edge (Newmarket 6.1 / 7.9); King Township acreage is on wells.',
    air: {
      mark: 'pass',
      summary: 'Nearest stations to King Township (Newmarket, Brampton) stayed under the 8.8 reference level 2023–2025; smoke spikes in 2023 and 2025. Newmarket logged a few ozone hours over the 1-hour criterion.',
      station: 'Newmarket and Brampton (Ontario MECP)',
      facts: [
        { label: 'PM2.5 annual mean', value: 'Newmarket 2023: 8.54 · 2024: 6.05 · 2025: 7.85 · Brampton 2024: 6.03 · 2025: 7.35 µg/m³ (reference 8.8)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Smoke days', value: '24-hour PM2.5 above 27 µg/m³ at Newmarket: 13 (2023), 0 (2024), 16 (2025)', source: 'Ontario MECP PM2.5 statistics' },
        { label: 'Ozone', value: 'Newmarket hours over the 1-hour criterion: 3 (2023), 1 (2024), 3 (2025)', source: 'Ontario MECP ozone statistics' },
      ],
    },
    water: {
      mark: 'partial',
      summary: 'The acreage listings are in rural King Township, normally on private wells, not Toronto water. York Region / Toronto drinking water reports: not checked yet (don’t cover wells).',
      municipal: [{ label: 'Toronto / York Region reports', value: 'Not checked yet (don’t cover rural wells).', source: '—' }],
      listingSupply: LISTING_UNKNOWN_CA,
      wellRisks: ['Ontario limits: arsenic 0.010 mg/L, uranium 0.020 mg/L; test any well with an accredited lab. Public Health Ontario tests bacteria free.', 'Well-water risks specific to King Township: not checked yet.'],
    },
    sources: [ON_STATS, ON_2023, PHO_WELL],
  },
}
