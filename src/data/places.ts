// All facts below are taken from Tom's relocation report (report date 10 Oct 2026).
// Nothing here is invented: anything the report does not state is left undefined and
// shown in the UI as "not checked yet". Coordinates are approximate area centroids
// used only to place map markers; they are not research findings.

export type Status = 'best' | 'parked' | 'stretch' | 'near-miss' | 'dropped' | 'canada-dropped'
export type Mark = 'pass' | 'partial' | 'fail' | 'unknown'
export type CriterionKey =
  | 'seasons' | 'crime' | 'acreage' | 'mountains' | 'lakes' | 'wildlife'
  | 'schools' | 'museums' | 'infrastructure' | 'sichuan' | 'turkish'

export interface Score {
  mark: Mark
  /** 'table' = the report's comparison-table mark; 'derived' = read from the report's text for that place */
  source: 'table' | 'derived'
  note?: string
}

export interface Restaurant {
  name: string
  cuisine: 'Sichuan' | 'Turkish'
  area?: string
  driveText?: string
  /** Upper bound of the drive estimate in minutes (free-flow, no traffic) when the report gives one */
  driveMin?: number
  status: 'counted' | 'closed' | 'caveat'
  note?: string
}

export interface Listing {
  description: string
  price: string
  asOf?: string
  note?: string
}

export interface Photo { src: string; alt: string; credit: string }
export interface Fact { label: string; value: string }

export interface Place {
  id: string
  name: string
  short: string
  country: 'US' | 'Canada'
  status: Status
  statusLabel: string
  firstRound: number
  /** Round in which the place stopped being in contention (not alive in that round's result) */
  cutRound?: number
  cutReason?: string
  /** Minor = only named in a round's cut list; the report has no further detail */
  minor?: boolean
  summary: string
  lat: number
  lng: number
  coordNote?: string
  listings: Listing[]
  mountainsLakes?: string
  crime?: string
  schools?: string
  infrastructure?: string
  climate?: string
  taxes?: string
  risks?: string
  otherFacts: Fact[]
  restaurants: Restaurant[]
  pros: string[]
  cons: string[]
  scores: Partial<Record<CriterionKey, Score>>
  inUS: boolean
  photos: Photo[]
}

export interface Round {
  n: number
  title: string
  date?: string
  summary: string
  added: string[]
  cut: string[]
  note?: string
}

export const REPORT = {
  title: 'Where should Tom live next?',
  reportDate: '10 Oct 2026',
  latestScout: '30 Sep 2026',
  startingPoint: 'Coral Springs, FL',
  currentLot: '~0.22 acre',
  budget: '~$680–720K (roughly Coral Springs house money)',
  statusHeadline: 'Tom asked to keep hunting for more US places.',
  keyInsight:
    'The hardest part is finding 2+ Sichuan and 2+ Turkish restaurants within ~40 minutes of affordable mountain-and-lake acreage. Land, scenery and safety are much easier to find than the food.',
  disclaimer:
    'Prices and listings are as of the dates shown and should be re-verified before acting on them. Drive times are free-flow estimates (no traffic). Restaurant openings and closings change, so confirm before visiting.',
}

export interface Criterion { key: CriterionKey; label: string; detail: string; hard?: boolean }

export const CRITERIA: Criterion[] = [
  { key: 'seasons', label: 'Four true seasons', detail: 'Real winters, not just a cool spell.' },
  { key: 'crime', label: 'Low crime', detail: 'Safe day-to-day living.' },
  { key: 'acreage', label: 'Acreage at budget', detail: 'A couple of acres (~1–3) at roughly Coral Springs house money (~$680–720K). Current lot is ~0.22 acre.' },
  { key: 'mountains', label: 'Mountains nearby', detail: 'Within about 45–60 minutes.' },
  { key: 'lakes', label: 'Lakes nearby', detail: 'Within about 45–60 minutes.' },
  { key: 'wildlife', label: 'Little dangerous wildlife / hazards', detail: 'In daily life, not just on hikes.' },
  { key: 'schools', label: 'Good schools', detail: 'Good colleges plus solid K-12 / charter options.' },
  { key: 'museums', label: 'Museums within ~60 min', detail: 'Culture within an easy day trip.' },
  { key: 'infrastructure', label: 'Good infrastructure', detail: 'Airport, hospital, broadband.' },
  { key: 'sichuan', label: '2+ real Sichuan', detail: 'Within a ~35–40 min weeknight drive. Real Sichuan = mapo, dan dan, mala, hot pot.', hard: true },
  { key: 'turkish', label: '2+ real Turkish', detail: 'Within a ~35–40 min weeknight drive. Real Turkish = pide, lahmacun, kebab, Iskender. Gyro-only or daytime-only cafes don’t count.', hard: true },
]

export const EXTRA_CRITERION = { label: 'Stay in the US', detail: 'Canada was explored, then dropped.' }

export const STATUS_META: Record<Status, { label: string; color: string; badge: string }> = {
  best: { label: 'Best option', color: '#16a34a', badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  parked: { label: 'Parked', color: '#d97706', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  stretch: { label: 'Stretch', color: '#7c3aed', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300' },
  'near-miss': { label: 'Near-miss', color: '#0284c7', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
  dropped: { label: 'Dropped', color: '#64748b', badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  'canada-dropped': { label: 'Canada – dropped', color: '#dc2626', badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
}

const T = (mark: Mark, note?: string): Score => ({ mark, source: 'table', note })
const D = (mark: Mark, note: string): Score => ({ mark, source: 'derived', note })

const minor = (
  id: string, name: string, short: string, round: number, reason: string,
  lat: number, lng: number, country: 'US' | 'Canada' = 'US', coordNote?: string,
): Place => ({
  id, name, short, country, status: 'dropped', statusLabel: `Cut in round ${round}`,
  firstRound: round, cutRound: round, cutReason: reason, minor: true,
  summary: `Named in the round ${round} cut list. The report gives no further detail on this place.`,
  lat, lng, coordNote, listings: [], otherFacts: [], restaurants: [], pros: [], cons: [], scores: {},
  inUS: country === 'US', photos: [],
})

const ROUND1_NOREASON = 'Struck from the first shortlist; the report does not record the specific reason.'
const ROUND6_FOOD = 'Killed on food in the 30 Sep 2026 scout.'

export const PLACES: Place[] = [
  {
    id: 'forsyth',
    name: 'East Forsyth County, Georgia',
    short: 'East Forsyth Co., GA',
    country: 'US',
    status: 'best',
    statusLabel: 'Best new option',
    firstRound: 6,
    summary: 'Cumming / Pilgrim Mill side of Lake Lanier. The only new full pass from the 30 Sep 2026 scout, including 3 Turkish and 2 Sichuan spots within ~30 min.',
    lat: 34.25, lng: -84.07,
    listings: [{ description: '2785 Pilgrim Mill Rd — 1.36 acres, ~3,680 sq ft', price: 'listed $665K', asOf: '28 Aug 2026', note: 'Listing was active on that date.' }],
    mountainsLakes: 'Lake Lanier minutes away; Amicalola Falls ~51 min; Mount Yonah ~62 min',
    crime: 'FBI UCR 2024, Forsyth Sheriff: ~45 violent crimes per 100k',
    infrastructure: 'Atlanta airport ~67 min',
    climate: 'Hot, humid, long summers and a short winter',
    otherFacts: [
      { label: 'College', value: 'UNG Dahlonega ~38 min' },
      { label: 'Culture', value: 'Atlanta museums ~67 min' },
    ],
    restaurants: [
      { name: 'Turkuaz', cuisine: 'Turkish', area: 'Suwanee', driveText: '~15 min', driveMin: 15, status: 'counted' },
      { name: 'Ephesus', cuisine: 'Turkish', area: 'Alpharetta', driveText: '~18 min', driveMin: 18, status: 'counted' },
      { name: 'Efendi', cuisine: 'Turkish', area: 'Alpharetta', driveText: '~22 min', driveMin: 22, status: 'counted' },
      { name: 'Masterpiece', cuisine: 'Sichuan', area: 'Duluth, GA', driveText: '~29 min', driveMin: 29, status: 'counted', note: 'Michelin-listed' },
      { name: 'Xi Hotpot', cuisine: 'Sichuan', area: 'Duluth, GA', driveText: '~30 min', driveMin: 30, status: 'counted' },
    ],
    pros: ['Only new full pass in the latest scout', '1.36-acre listing at $665K, under the ~$700K target', 'Lake Lanier minutes away', '3 Turkish and 2 Sichuan within ~30 min'],
    cons: ['Hot, humid, long summers and a short winter', 'Mountains are a planned trip, not a daily backdrop'],
    scores: {
      acreage: T('pass'),
      mountains: T('partial', 'Mountains ~51–62 min'),
      lakes: D('pass', 'Lake Lanier minutes away (table combines mountains + lakes as partial)'),
      crime: T('pass', '~45 violent per 100k (2024)'),
      seasons: T('partial', 'Short winter, long hot summers'),
      museums: D('partial', 'Atlanta museums ~67 min vs ~60 min target'),
      sichuan: T('pass'),
      turkish: T('pass'),
    },
    inUS: true,
    photos: [{ src: 'assets/ga_lanier.jpg', alt: 'Lake Lanier, Georgia, with tree-lined shores', credit: 'Lake Lanier, GA — Thomson200, CC0, via Wikimedia Commons' }],
  },
  {
    id: 'happy-valley',
    name: 'Happy Valley / western Damascus, Oregon',
    short: 'Happy Valley / W. Damascus, OR',
    country: 'US',
    status: 'parked',
    statusLabel: 'Parked at Tom’s request',
    firstRound: 5,
    summary: 'The cleanest full-stack hit of the US search, and it beat Duvall head-to-head. Tom said he isn’t sure about Oregon, so it’s on hold rather than ruled out.',
    lat: 45.43, lng: -122.47,
    listings: [{ description: '~2 acres (typical range, no specific listing in the report)', price: '~$475–620K' }],
    infrastructure: 'PDX ~25–30 min',
    climate: 'Mild Pacific Northwest winters',
    taxes: 'Oregon income tax up to 9.9%',
    otherFacts: [],
    restaurants: [
      { name: 'Sichuan City', cuisine: 'Sichuan', status: 'counted' },
      { name: 'Sichuan Taste', cuisine: 'Sichuan', status: 'counted' },
      { name: 'Ding & Spice', cuisine: 'Sichuan', status: 'counted' },
      { name: 'Shiki Shiki Baba', cuisine: 'Turkish', status: 'counted' },
      { name: 'Chef Agir', cuisine: 'Turkish', status: 'counted' },
      { name: 'Constantinople', cuisine: 'Turkish', status: 'counted' },
    ],
    pros: ['Hits the budget with room to spare', 'Every food requirement met'],
    cons: ['Winters are mild, not a strong four seasons', 'State income tax up to 9.9%'],
    scores: {
      acreage: T('pass'),
      mountains: T('pass'),
      lakes: T('pass'),
      seasons: T('partial', 'Mild PNW winters'),
      infrastructure: D('pass', 'PDX ~25–30 min'),
      sichuan: T('pass'),
      turkish: T('pass'),
    },
    inUS: true,
    photos: [{ src: 'assets/or_hood.jpg', alt: 'Mount Hood seen beyond downtown Portland', credit: 'Mount Hood from downtown Portland — M.O. Stevens, CC BY-SA 4.0, via Wikimedia Commons' }],
  },
  {
    id: 'duvall',
    name: 'Duvall / Snoqualmie Valley, Washington',
    short: 'Duvall / Snoqualmie Valley, WA',
    country: 'US',
    status: 'stretch',
    statusLabel: 'Stretch budget',
    firstRound: 5,
    summary: 'Better Cascades scenery and better food than Oregon, but it costs more. Lost to Happy Valley head-to-head.',
    lat: 47.74, lng: -121.99,
    listings: [{ description: 'Median home / acreage (no specific listing in the report)', price: 'Median ~$850K; acreage ~$980K+' }],
    taxes: 'No state income tax',
    risks: 'Flood risk in the valley',
    otherFacts: [],
    restaurants: [
      { name: 'Dan Gui', cuisine: 'Sichuan', area: 'Bellevue', status: 'counted' },
      { name: 'Frying Fish', cuisine: 'Sichuan', area: 'Bellevue', status: 'counted' },
      { name: 'Spicy PoPo', cuisine: 'Sichuan', area: 'Bellevue', status: 'counted' },
      { name: 'Koza', cuisine: 'Turkish', area: 'Kirkland', status: 'counted' },
      { name: 'Cafe Sabah', cuisine: 'Turkish', area: 'Kirkland', status: 'counted' },
    ],
    pros: ['Better Cascades scenery than Oregon', 'Better food than Oregon', 'No state income tax'],
    cons: ['Acreage well above the ~$700K target', 'Flood risk'],
    scores: {
      acreage: T('fail', 'Acreage ~$980K+'),
      mountains: T('pass'),
      lakes: T('pass'),
      wildlife: T('partial', 'Flood risk'),
      sichuan: T('pass'),
      turkish: T('pass'),
    },
    inUS: true,
    photos: [{ src: 'assets/wa_snoq.jpg', alt: 'Aerial view of the Snoqualmie Valley with mountains', credit: 'Snoqualmie Valley near North Bend & Mount Si — brewbooks, CC BY-SA 2.0, via Wikimedia Commons' }],
  },
  {
    id: 'cantley',
    name: 'Chelsea / Cantley, Quebec',
    short: 'Chelsea / Cantley, QC',
    country: 'Canada',
    status: 'canada-dropped',
    statusLabel: 'Was #1 · dropped (Canada)',
    firstRound: 2,
    cutRound: 5,
    cutReason: 'Ranked #1 in the round 4 three-way comparison, then set aside when Tom decided to stay in the US.',
    summary: 'The only place with a genuine multi-restaurant Sichuan and Turkish scene in rounds 3–4 (thanks to Ottawa). Set aside when Tom decided to stay in the US.',
    lat: 45.56, lng: -75.79,
    listings: [{ description: 'Cantley ~3.38 acres', price: '~$570K CAD (~$410K USD)', }],
    mountainsLakes: 'Gatineau Park; Meech and Philippe lakes',
    schools: 'No US-style charter schools',
    taxes: 'Quebec taxes (~53% top combined rate)',
    otherFacts: [
      { label: 'Immigration', value: 'Via PSTQ' },
      { label: 'Language', value: 'French language / Bill 96' },
    ],
    restaurants: [
      { name: 'Spicy Man', cuisine: 'Sichuan', area: 'Ottawa', status: 'counted' },
      { name: 'Liuyishou', cuisine: 'Sichuan', area: 'Merivale, Ottawa', status: 'counted' },
      { name: 'Sultan Ahmet', cuisine: 'Turkish', area: 'Glebe, Ottawa', status: 'counted' },
      { name: 'Tava', cuisine: 'Turkish', area: 'Kanata, Ottawa', status: 'counted' },
      { name: 'Agha', cuisine: 'Turkish', area: 'Merivale, Ottawa', status: 'counted' },
    ],
    pros: ['Genuine multi-restaurant Sichuan and Turkish scene via Ottawa', '~3.38 acres around ~$410K USD', 'Gatineau Park plus Meech and Philippe lakes'],
    cons: ['Quebec taxes (~53% top combined rate)', 'Immigration via PSTQ', 'French language / Bill 96', 'No US-style charter schools'],
    scores: {
      acreage: T('pass'),
      mountains: T('pass'),
      lakes: T('pass'),
      schools: T('partial', 'No US-style charters'),
      sichuan: T('pass'),
      turkish: T('pass'),
    },
    inUS: false,
    photos: [{ src: 'assets/qc_gatineau.jpg', alt: 'Fall colours at the Eardley Escarpment, Gatineau Park', credit: 'Eardley Escarpment, Gatineau Park — cjuneau, CC BY 2.0, via Wikimedia Commons' }],
  },
  {
    id: 'golden',
    name: 'Golden, Colorado',
    short: 'Golden, CO',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Was #2 (round 4)',
    firstRound: 4,
    cutRound: 5,
    cutReason: 'Round 4 finalist (#2), explored then set aside: over budget for acreage, food breaks down ~40 min out where the acreage is, property crime not low, wildfire risk and bears/lions.',
    summary: 'Mountains right in the yard. Food works from Golden proper but breaks down ~40 min out where the acreage is.',
    lat: 39.755, lng: -105.221,
    listings: [{ description: 'Nice 2-acre homes (typical range)', price: 'Usually $900K–$1.8M' }],
    mountainsLakes: 'Mountains right in the yard',
    crime: 'Property crime not low',
    infrastructure: 'DEN ~55 min',
    risks: 'Wildfire risk; bears and mountain lions',
    otherFacts: [],
    restaurants: [
      { name: 'Wok Spicy', cuisine: 'Sichuan', area: 'From Golden proper', status: 'caveat', note: 'Works from Golden proper, not from acreage ~40 min out' },
      { name: 'Bronze Empire', cuisine: 'Sichuan', area: 'From Golden proper', status: 'caveat', note: 'Works from Golden proper, not from acreage ~40 min out' },
      { name: 'Pizza & Pide', cuisine: 'Turkish', area: 'From Golden proper', status: 'caveat', note: 'Works from Golden proper, not from acreage ~40 min out' },
      { name: 'Bosphorus', cuisine: 'Turkish', area: 'From Golden proper', status: 'caveat', note: 'Works from Golden proper, not from acreage ~40 min out' },
    ],
    pros: ['Mountains right in the yard', 'Food works from Golden proper'],
    cons: ['Over budget for acreage', 'Property crime not low', 'Wildfire risk; bears and mountain lions'],
    scores: {
      acreage: T('fail'),
      mountains: T('pass'),
      lakes: T('pass'),
      crime: T('fail', 'Property crime not low'),
      wildlife: T('fail', 'Wildfire; bears and mountain lions'),
      infrastructure: D('pass', 'DEN ~55 min'),
      sichuan: T('partial', 'Only from Golden proper'),
      turkish: T('partial', 'Only from Golden proper'),
    },
    inUS: true,
    photos: [{ src: 'assets/co_golden.jpg', alt: 'Lookout Mountain hillside near Golden, Colorado', credit: 'Lookout Mountain Park, Golden, CO — Hustvedt, CC BY-SA 3.0, via Wikimedia Commons' }],
  },
  {
    id: 'draper',
    name: 'Draper / Alpine-Highland, Utah',
    short: 'Draper / Alpine-Highland, UT',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Was #3 (round 4)',
    firstRound: 4,
    cutRound: 5,
    cutReason: 'Round 4 finalist (#3), explored then set aside: fails the 2-acre budget and fails multiple Turkish.',
    summary: 'Best schools and lowest crime of any place studied, but fails on land and Turkish food.',
    lat: 40.49, lng: -111.81,
    listings: [{ description: '~1 acre (typical)', price: '$1M+ — 2 acres at ~$700K not realistic' }],
    crime: '~29 violent per 100k (Alpine/Highland, 2024)',
    schools: 'Lone Peak ~97% graduation; real charter options (strongest K-12 seen)',
    otherFacts: [],
    restaurants: [
      { name: 'Beijing Restaurant', cuisine: 'Sichuan', area: 'Sugar House', status: 'counted' },
      { name: 'Chengdu Hotpot', cuisine: 'Sichuan', status: 'counted' },
    ],
    pros: ['Best schools of any place studied', 'Lowest crime of any place studied', 'Sichuan OK'],
    cons: ['Fails the 2-acre budget', 'Fails multiple Turkish'],
    scores: {
      acreage: T('fail'),
      crime: T('pass', '~29 violent per 100k'),
      schools: T('pass', 'Lone Peak ~97% grad, real charters'),
      sichuan: T('pass'),
      turkish: T('fail'),
    },
    inUS: true,
    photos: [],
  },
  {
    id: 'maryville',
    name: 'Maryville / Blount County, Tennessee',
    short: 'Maryville / Blount Co., TN',
    country: 'US',
    status: 'near-miss',
    statusLabel: 'Near-miss (round 6)',
    firstRound: 6,
    cutRound: 6,
    cutReason: 'Only one Sichuan and one Turkish.',
    summary: 'Smokies and TVA lakes. A 6-acre $600K listing went pending (Aug 2026). Only one Sichuan and one Turkish.',
    lat: 35.757, lng: -83.97,
    listings: [{ description: '6 acres', price: '$600K', asOf: 'Aug 2026', note: 'Went pending (Aug 2026).' }],
    mountainsLakes: 'Smokies and TVA lakes',
    otherFacts: [],
    restaurants: [
      { name: 'Asia Kitchen', cuisine: 'Sichuan', status: 'counted', note: 'Only Sichuan option' },
      { name: 'Quality Turkish Market & Deli', cuisine: 'Turkish', status: 'counted', note: 'Only Turkish option' },
    ],
    pros: ['Smokies and TVA lakes', '6 acres at $600K seen (went pending)'],
    cons: ['Only one Sichuan', 'Only one Turkish'],
    scores: {
      acreage: T('pass'),
      mountains: T('pass'),
      lakes: T('pass'),
      sichuan: T('fail'),
      turkish: T('fail'),
    },
    inUS: true,
    photos: [],
  },
  {
    id: 'elizabeth',
    name: 'Elizabeth, Colorado',
    short: 'Elizabeth, CO',
    country: 'US',
    status: 'near-miss',
    statusLabel: 'Near-miss (round 6)',
    firstRound: 6,
    cutRound: 6,
    cutReason: 'Turkish ~49 min; can’t get two Sichuan within 40 min.',
    summary: '2.07 acres at $650K, but Turkish is ~49 min away and two Sichuan within 40 min isn’t possible.',
    lat: 39.36, lng: -104.6,
    listings: [{ description: '5360 Pine Ridge Dr — 2.07 acres', price: '$650K', asOf: '25 Sep 2026', }],
    otherFacts: [{ label: 'Food distance', value: 'Turkish ~49 min' }],
    restaurants: [],
    pros: ['2.07 acres at $650K'],
    cons: ['Turkish ~49 min', 'Can’t get two Sichuan within 40 min'],
    scores: {
      acreage: T('pass'),
      sichuan: T('fail'),
      turkish: T('fail'),
    },
    inUS: true,
    photos: [],
  },
  {
    id: 'boise',
    name: 'Boise foothills, Idaho',
    short: 'Boise foothills, ID',
    country: 'US',
    status: 'near-miss',
    statusLabel: 'Near-miss (round 6)',
    firstRound: 6,
    cutRound: 6,
    cutReason: 'Only one real Sichuan; no two Turkish.',
    summary: 'Mala House is real Sichuan, but there’s no second one, and no two Turkish.',
    lat: 43.65, lng: -116.17,
    listings: [],
    otherFacts: [],
    restaurants: [{ name: 'Mala House', cuisine: 'Sichuan', status: 'counted', note: 'Real Sichuan, but the only one' }],
    pros: ['Mala House is real Sichuan'],
    cons: ['No second Sichuan', 'No two Turkish'],
    scores: { sichuan: T('fail'), turkish: T('fail') },
    inUS: true,
    photos: [],
  },
  {
    id: 'fort-collins',
    name: 'Fort Collins, Colorado',
    short: 'Fort Collins, CO',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 2 #1 · thin',
    firstRound: 2,
    cutRound: 3,
    cutReason: 'Thin when "multiple" Sichuan and Turkish was required.',
    summary: 'Rose to #1 once food was added: Beijing Noodle (Sichuan) and Turkish Cafe Co. Thin when "multiple" was required.',
    lat: 40.585, lng: -105.084,
    listings: [], otherFacts: [],
    restaurants: [
      { name: 'Beijing Noodle', cuisine: 'Sichuan', status: 'counted' },
      { name: 'Turkish Cafe Co', cuisine: 'Turkish', status: 'counted' },
    ],
    pros: ['Rose to #1 once food was added'],
    cons: ['Only one of each cuisine'],
    scores: { sichuan: D('partial', 'One Sichuan (needs 2+)'), turkish: D('partial', 'One Turkish (needs 2+)') },
    inUS: true, photos: [],
  },
  {
    id: 'spokane',
    name: 'Spokane South Hill, Washington',
    short: 'Spokane South Hill, WA',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 2 survivor · thin',
    firstRound: 2,
    cutRound: 3,
    cutReason: 'Thin when "multiple" Sichuan and Turkish was required.',
    summary: 'Anatolia Grill (opened Mar 2026) and Chef Lu’s Sichuan section. Gordy’s Sichuan closed Jan 2025. Thin.',
    lat: 47.63, lng: -117.4,
    listings: [], otherFacts: [],
    restaurants: [
      { name: 'Anatolia Grill', cuisine: 'Turkish', status: 'counted', note: 'Opened Mar 2026' },
      { name: 'Chef Lu’s', cuisine: 'Sichuan', status: 'caveat', note: 'Sichuan section of the menu' },
      { name: 'Gordy’s Sichuan', cuisine: 'Sichuan', status: 'closed', note: 'Closed Jan 2025' },
    ],
    pros: [],
    cons: ['Thin on multiple Sichuan and Turkish', 'Gordy’s Sichuan closed Jan 2025'],
    scores: { sichuan: D('partial', 'Chef Lu’s Sichuan section only'), turkish: D('partial', 'One Turkish') },
    inUS: true, photos: [],
  },
  {
    id: 'lebanon',
    name: 'Lebanon / Enfield, New Hampshire',
    short: 'Lebanon / Enfield, NH',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 2 survivor · thin',
    firstRound: 2,
    cutRound: 3,
    cutReason: 'Thin on multiple Sichuan and Turkish.',
    summary: 'Upper Valley survivor of round 2; thin on multiple Sichuan and Turkish.',
    lat: 43.64, lng: -72.25,
    listings: [], otherFacts: [], restaurants: [], pros: [],
    cons: ['Thin on multiple Sichuan and Turkish'],
    scores: { sichuan: D('partial', 'Survived "one of each", thin on multiple'), turkish: D('partial', 'Survived "one of each", thin on multiple') },
    inUS: true, photos: [],
  },
  {
    id: 'queensbury-wilton',
    name: 'Queensbury / Wilton, New York',
    short: 'Queensbury / Wilton, NY',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 1 shortlist · thin in round 3',
    firstRound: 1,
    cutRound: 3,
    cutReason: 'Only Wilton (south) survived round 2; thin in round 3 when multiple of each was required.',
    summary: 'Shortlisted in round 1; only the southern part of Wilton made it through round 2, and it was thin in round 3.',
    lat: 43.27, lng: -73.67,
    listings: [], otherFacts: [], restaurants: [], pros: [],
    cons: ['Only Wilton (south) survived round 2', 'Thin on multiple Sichuan and Turkish'],
    scores: { sichuan: D('partial', 'Wilton (south) survived "one of each", thin on multiple'), turkish: D('partial', 'Wilton (south) survived "one of each", thin on multiple') },
    inUS: true,
    photos: [
      { src: 'assets/ny_lakegeorge.jpg', alt: 'Lake George village and mountains', credit: 'Lake George — Wikimedia Commons contributors' },
      { src: 'assets/map_ny.jpg', alt: 'Map of the Queensbury / Lake George area', credit: 'Area map — Wikimedia Commons contributors' },
    ],
  },
  {
    id: 'post-falls',
    name: 'Post Falls / Hayden, Idaho',
    short: 'Post Falls / Hayden, ID',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 1 shortlist',
    firstRound: 1,
    cutRound: 2,
    cutReason: 'Did not survive the food criterion.',
    summary: 'First-round shortlist. Did not survive the food criterion.',
    lat: 47.73, lng: -116.86,
    listings: [], otherFacts: [], restaurants: [], pros: [], cons: ['Did not survive the food criterion'],
    scores: {},
    inUS: true,
    photos: [
      { src: 'assets/idaho_cda.jpg', alt: 'Coeur d’Alene waterfront', credit: 'Coeur d’Alene — Wikimedia Commons contributors' },
      { src: 'assets/idaho_haydenlake.jpg', alt: 'Aerial view of Hayden Lake', credit: 'Hayden Lake — Wikimedia Commons contributors' },
      { src: 'assets/map_idaho.jpg', alt: 'Map of the Post Falls / Coeur d’Alene area', credit: 'Area map — Wikimedia Commons contributors' },
    ],
  },
  {
    id: 'gilford',
    name: 'Gilford / Meredith, New Hampshire',
    short: 'Gilford / Meredith, NH',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 1 shortlist',
    firstRound: 1,
    cutRound: 2,
    cutReason: 'Dropped in round 2 on food.',
    summary: 'Shortlisted in round 1; dropped in round 2 on food.',
    lat: 43.6, lng: -71.45,
    listings: [], otherFacts: [], restaurants: [], pros: [], cons: ['Dropped on food'],
    scores: {},
    inUS: true,
    photos: [
      { src: 'assets/nh_winnipesaukee.jpg', alt: 'Lake Winnipesaukee from above', credit: 'Lake Winnipesaukee — Wikimedia Commons contributors' },
      { src: 'assets/nh_meredith.jpg', alt: 'Meredith, NH waterfront', credit: 'Meredith — Wikimedia Commons contributors' },
      { src: 'assets/map_nh.jpg', alt: 'Map of the Gilford / Meredith area', credit: 'Area map — Wikimedia Commons contributors' },
    ],
  },
  {
    id: 'salem',
    name: 'Salem / Botetourt, Virginia',
    short: 'Salem / Botetourt, VA',
    country: 'US',
    status: 'dropped',
    statusLabel: 'Round 1 shortlist',
    firstRound: 1,
    cutRound: 2,
    cutReason: 'Dropped in round 2: Spicity in Blacksburg for Sichuan, but no Turkish.',
    summary: 'Shortlisted in round 1. Dropped in round 2: Spicity in Blacksburg for Sichuan, but no Turkish.',
    lat: 37.3, lng: -80.05,
    listings: [], otherFacts: [],
    restaurants: [{ name: 'Spicity', cuisine: 'Sichuan', area: 'Blacksburg', status: 'counted' }],
    pros: [], cons: ['No Turkish'],
    scores: { sichuan: D('partial', 'One Sichuan (Spicity, Blacksburg)'), turkish: D('fail', 'No Turkish') },
    inUS: true,
    photos: [
      { src: 'assets/va_sml.jpg', alt: 'Smith Mountain Lake marina', credit: 'Smith Mountain Lake — Wikimedia Commons contributors' },
      { src: 'assets/va_salem.jpg', alt: 'Main street in Salem, VA', credit: 'Salem, VA — Wikimedia Commons contributors' },
      { src: 'assets/map_va.jpg', alt: 'Map of the Salem / Botetourt area', credit: 'Area map — Wikimedia Commons contributors' },
    ],
  },
  {
    id: 'collingwood',
    name: 'Collingwood / Blue Mountains, Ontario',
    short: 'Collingwood / Blue Mtns, ON',
    country: 'Canada',
    status: 'dropped',
    statusLabel: 'Round 1 shortlist',
    firstRound: 1,
    cutRound: 2,
    cutReason: 'Dropped in round 2: Barrie, the nearest food option, is ~1 hr away.',
    summary: 'Shortlisted in round 1. Dropped in round 2: Barrie, the nearest food option, is ~1 hr away.',
    lat: 44.5, lng: -80.22,
    listings: [], otherFacts: [{ label: 'Nearest food', value: 'Barrie ~1 hr' }],
    restaurants: [], pros: [], cons: ['Nearest food option (Barrie) ~1 hr away'],
    scores: { sichuan: D('fail', 'Nearest food ~1 hr (Barrie)'), turkish: D('fail', 'Nearest food ~1 hr (Barrie)') },
    inUS: false,
    photos: [
      { src: 'assets/on_georgianbay.jpg', alt: 'Georgian Bay view', credit: 'Georgian Bay — Wikimedia Commons contributors' },
      { src: 'assets/on_bluemountain.jpg', alt: 'Blue Mountain village sign', credit: 'Blue Mountain — Wikimedia Commons contributors' },
      { src: 'assets/on_collingwood.jpg', alt: 'Aerial view of Collingwood, ON', credit: 'Collingwood (aerial) — Wikimedia Commons contributors' },
      { src: 'assets/map_on.jpg', alt: 'Map of the Collingwood area on Georgian Bay', credit: 'Area map — Wikimedia Commons contributors' },
    ],
  },
  // Round 1 cut list (no detail in report)
  minor('bozeman', 'Bozeman, Montana', 'Bozeman, MT', 1, ROUND1_NOREASON, 45.68, -111.04),
  minor('flathead', 'Flathead, Montana', 'Flathead, MT', 1, ROUND1_NOREASON, 48.2, -114.31, 'US', 'Marker placed at Kalispell as the Flathead Valley centre.'),
  minor('asheville', 'Asheville, North Carolina', 'Asheville, NC', 1, ROUND1_NOREASON, 35.595, -82.551),
  minor('boulder', 'Boulder, Colorado', 'Boulder, CO', 1, ROUND1_NOREASON, 40.015, -105.27),
  minor('burlington', 'Burlington (city), Vermont', 'Burlington city, VT', 1, ROUND1_NOREASON, 44.476, -73.212),
  minor('kelowna', 'Kelowna, British Columbia', 'Kelowna, BC', 1, ROUND1_NOREASON, 49.888, -119.496, 'Canada'),
  minor('canmore', 'Canmore, Alberta', 'Canmore, AB', 1, ROUND1_NOREASON, 51.089, -115.358, 'Canada'),
  minor('traverse-city', 'Traverse City, Michigan', 'Traverse City, MI', 1, ROUND1_NOREASON, 44.763, -85.621),
  minor('ithaca', 'Ithaca, New York', 'Ithaca, NY', 1, ROUND1_NOREASON, 42.444, -76.502),
  minor('duluth', 'Duluth', 'Duluth', 1, ROUND1_NOREASON, 46.787, -92.1, 'US', 'The report just says "Duluth"; marker assumes Duluth, MN (Lake Superior).'),
  minor('roanoke', 'Roanoke (city), Virginia', 'Roanoke city, VA', 1, ROUND1_NOREASON, 37.271, -79.941),
  // Round 6 cut list
  minor('colorado-springs', 'Colorado Springs / Monument / Black Forest, Colorado', 'Colorado Springs area, CO', 6, ROUND6_FOOD, 39.0, -104.75),
  minor('chattanooga', 'Chattanooga, Tennessee', 'Chattanooga, TN', 6, ROUND6_FOOD, 35.045, -85.309),
  minor('bellingham', 'Bellingham, Washington', 'Bellingham, WA', 6, ROUND6_FOOD, 48.75, -122.478),
  minor('ogden', 'Ogden, Utah', 'Ogden, UT', 6, ROUND6_FOOD, 41.223, -111.974),
  minor('nw-arkansas', 'Northwest Arkansas', 'NW Arkansas', 6, ROUND6_FOOD, 36.2, -94.17),
  minor('greenville', 'Greenville / Travelers Rest, South Carolina', 'Greenville / Travelers Rest, SC', 6, ROUND6_FOOD, 34.93, -82.42),
  minor('bend', 'Bend, Oregon', 'Bend, OR', 6, ROUND6_FOOD, 44.058, -121.315),
  minor('tacoma', 'Tacoma / Puyallup / Olympia, Washington', 'Tacoma / Puyallup / Olympia, WA', 6, ROUND6_FOOD, 47.15, -122.6),
  minor('huntsville', 'Huntsville, Alabama', 'Huntsville, AL', 6, 'Cut in the 30 Sep 2026 scout for weak mountains.', 34.73, -86.586),
]

// Minor round-6 cuts: the report says these were killed on food
for (const p of PLACES) {
  if (p.minor && p.firstRound === 6 && p.id !== 'huntsville') {
    p.cons = ['Killed on food']
  }
  if (p.id === 'huntsville') p.cons = ['Weak mountains']
}

export const ROUNDS: Round[] = [
  {
    n: 1, title: 'First shortlist (before food)',
    summary: 'Five areas made the first cut before food was considered.',
    added: ['post-falls', 'queensbury-wilton', 'gilford', 'salem', 'collingwood'],
    cut: ['bozeman', 'flathead', 'asheville', 'boulder', 'burlington', 'kelowna', 'canmore', 'traverse-city', 'ithaca', 'duluth', 'roanoke'],
    note: 'Reasons for the round 1 cuts are not recorded in the report.',
  },
  {
    n: 2, title: 'Food added — at least one of each',
    summary: 'Fort Collins jumped to #1 (Beijing Noodle + Turkish Cafe Co). Most of the first shortlist fell away.',
    added: ['fort-collins', 'spokane', 'cantley', 'lebanon'],
    cut: ['post-falls', 'gilford', 'salem', 'collingwood'],
    note: 'Queensbury / Wilton NY carried on as Wilton (south) only.',
  },
  {
    n: 3, title: 'Multiple of each required',
    summary: 'Only Chelsea/Cantley (via Ottawa) had a real scene: 2 Sichuan, 3 Turkish. Fort Collins, Spokane, the Upper Valley and Wilton were too thin.',
    added: [],
    cut: ['fort-collins', 'spokane', 'lebanon', 'queensbury-wilton'],
  },
  {
    n: 4, title: 'Three-way comparison',
    summary: '#1 Chelsea/Cantley QC, #2 Golden CO, #3 Draper/Alpine-Highland UT. Tom then chose to stay in the US.',
    added: ['golden', 'draper'],
    cut: [],
  },
  {
    n: 5, title: 'US-only search',
    summary: 'Happy Valley OR came out as the cleanest full-stack hit and beat Duvall WA head-to-head. Tom isn’t sure about Oregon, so it’s parked.',
    added: ['happy-valley', 'duvall'],
    cut: ['cantley', 'golden', 'draper'],
    note: 'Chelsea/Cantley was dropped because Tom chose to stay in the US; Golden and Draper were set aside after round 4.',
  },
  {
    n: 6, title: 'Latest scout', date: '30 Sep 2026',
    summary: 'One new full pass: East Forsyth County, GA. Near-misses: Maryville TN, Elizabeth CO, Boise foothills.',
    added: ['forsyth'],
    cut: ['maryville', 'elizabeth', 'boise', 'colorado-springs', 'chattanooga', 'bellingham', 'ogden', 'nw-arkansas', 'greenville', 'bend', 'tacoma', 'huntsville'],
    note: 'All struck in this round were killed on food, except Huntsville (weak mountains). Maryville, Elizabeth and Boise were near-misses.',
  },
]

export const CREDITS: string[] = [
  'Lake Lanier, July 2018 — Thomson200, CC0',
  'Mount Hood from downtown, Portland, Oregon — M.O. Stevens, CC BY-SA 4.0',
  'Looking east to Snoqualmie Valley, North Bend and Mount Si — brewbooks, CC BY-SA 2.0',
  'Lookout Mountain Park, Golden CO — Hustvedt, CC BY-SA 3.0',
  'Eardley Escarpment, Gatineau Park — cjuneau, CC BY 2.0',
  'Coeur d’Alene, Hayden Lake, Lake George, Lake Winnipesaukee, Meredith, Smith Mountain Lake, Salem VA, Collingwood (aerial), Georgian Bay, Blue Mountain, and the area maps — Wikimedia Commons contributors (see each file’s Commons page for author and licence)',
]

export const placeById = (id: string) => PLACES.find((p) => p.id === id)

export const isAliveIn = (p: Place, round: number) =>
  p.firstRound <= round && (p.cutRound === undefined || p.cutRound > round)

/** Considered in this round: alive at the end of it, or evaluated and cut in it */
export const consideredIn = (p: Place, round: number) =>
  isAliveIn(p, round) || p.cutRound === round
