import {
  CRITERIA, type Place, type Mark,
} from '../data/places'
import { populationFor, formatMoney, formatMinutes, formatPct, CORAL_SPRINGS_POP } from '../data/population'
import { crimeFor, classifySafer, formatRate, CORAL_VIOLENT_RATE, CORAL_PROPERTY_RATE, CANADA_CSI_2025 } from '../data/crime'
import { qualifyingHomes } from '../data/homes'
import { NO_QUALIFYING_HOMES } from '../data/homesTypes'
import { nearest } from '../data/amenitiesTypes'
import { DEFAULT_WEIGHTS, rankPlace, type Ranked, type Weights } from './score'

export const WEIGHTS_KEY = 'reloc.weights.v2'

export function loadWeights(): Weights {
  try {
    const v = JSON.parse(localStorage.getItem(WEIGHTS_KEY) ?? 'null')
    if (v) return { ...DEFAULT_WEIGHTS, ...v }
  } catch { /* ignore */ }
  return { ...DEFAULT_WEIGHTS }
}

export function weightsAreDefault(w: Weights): boolean {
  return CRITERIA.every((c) => w[c.key] === DEFAULT_WEIGHTS[c.key])
}

const MARK_SCORE: Record<Mark, number | null> = { pass: 3, partial: 1.5, fail: 0, unknown: null }

export interface WhyCard {
  place: Place
  score: number | null
  known: number
  why: string
  strengths: string[]
  tradeoffs: string[]
  bestHome: ReturnType<typeof qualifyingHomes>[number] | null
  hardFail: boolean
  extra?: Record<string, string | number | null>
}

function bestHome(placeId: string) {
  const homes = qualifyingHomes(placeId)
  if (!homes.length) return null
  const clean = homes.filter((h) => !/fixer|as-is/i.test(h.note ?? ''))
  const pool = clean.length ? clean : homes
  return [...pool].sort((a, b) => a.priceUsd - b.priceUsd)[0]
}

function markLabel(m?: Mark) {
  if (m === 'pass') return 'pass'
  if (m === 'partial') return 'partial / with caveats'
  if (m === 'fail') return 'fail'
  return 'not checked yet'
}

export function scorecardWhy(place: Place, ranked: Ranked, w: Weights): WhyCard {
  const home = bestHome(place.id)
  const strengths: string[] = []
  const tradeoffs: string[] = []
  const safer = classifySafer(crimeFor(place.id))

  for (const c of CRITERIA) {
    if (w[c.key] <= 0) continue
    const s = place.scores[c.key]
    if (!s || s.mark === 'unknown') continue
    const line = `${c.label}: ${markLabel(s.mark)}${s.note ? ` — ${s.note}` : ''}`
    if (s.mark === 'pass') strengths.push(line)
    else tradeoffs.push(line)
  }

  if (home) {
    strengths.push(`A qualifying 4-bedroom, 3-full-bath listing is on file: ${home.address} at US$${home.priceUsd.toLocaleString('en-US')} on ${home.acres} acres.`)
    if (/confirm the lot is unincorporated|outside Cumming city limits/i.test(`${home.note ?? ''} ${home.bathNote ?? ''}`)) {
      tradeoffs.push(`${home.address}: mailing city Cumming — confirm the lot is unincorporated Forsyth County, not the City of Cumming, so the sheriff crime rate still applies.`)
    }
  } else if (place.status !== 'dropped') {
    tradeoffs.push(NO_QUALIFYING_HOMES + '.')
  }

  for (const c of place.cons) {
    if (home && /no qualifying|not found this pass|listing was not found|3-full-bath listing was not/i.test(c)) continue
    tradeoffs.push(c)
  }
  if (place.status === 'parked') tradeoffs.unshift('Parked at his request (Oregon), so this is not a current pick even if the checklist score is solid.')
  if (place.cutReason) tradeoffs.push(place.cutReason)
  if (ranked.hardFail) tradeoffs.unshift('Fails a hard food rule (2+ real Sichuan or 2+ real Turkish within about 35–40 minutes).')

  const bits: string[] = []
  bits.push(`${place.name} scores ${ranked.score == null ? 'n/a' : `${ranked.score.toFixed(2)} / 3`} on ${ranked.known} known checklist marks, using ${weightsAreDefault(w) ? 'the default weights (low crime is the heaviest, at 5)' : 'the weights saved from the Scorecard tab'}.`)
  if (safer.group === 'safer') {
    bits.push(`Sourced official rates are at or below Coral Springs on both violent and property crime (${formatRate(safer.violent)} / ${formatRate(safer.property)} per 100k versus ${formatRate(CORAL_VIOLENT_RATE)} / ${formatRate(CORAL_PROPERTY_RATE)}, FBI 2025).`)
  } else if (safer.group === 'one-sided') {
    bits.push(`Only one of the two official US crime rates is at or below Coral Springs (${formatRate(safer.violent)} violent / ${formatRate(safer.property)} property per 100k).`)
  } else if (safer.group === 'higher') {
    bits.push(`Both official US crime rates are above Coral Springs (${formatRate(safer.violent)} / ${formatRate(safer.property)} per 100k).`)
  } else if (safer.group === 'canada') {
    bits.push(`Canadian crime is not compared with Coral Springs. The Crime Severity Index is ${safer.csi ?? 'not available'} versus Canada’s 2025 national CSI of ${(CANADA_CSI_2025.value as number).toFixed(2)} (approximate, different offence definitions).`)
  } else {
    bits.push('An official violent and property rate that can be compared with Coral Springs is not available, so crime is left out of the average rather than treated as zero.')
  }
  if (home) {
    bits.push(`It also meets the 4-bedroom, 3-full-bath home must, with a listing at ${home.address}.`)
  } else if (place.status !== 'dropped') {
    bits.push('A qualifying 4-bedroom, 3-full-bath listing under US$850K on 1–3 acres has not been confirmed.')
  }
  const food = `Sichuan is a ${markLabel(place.scores.sichuan?.mark)} and Turkish is a ${markLabel(place.scores.turkish?.mark)}.`
  bits.push(food)

  return {
    place, score: ranked.score, known: ranked.known, why: bits.join(' '),
    strengths: strengths.slice(0, 7), tradeoffs: [...new Set(tradeoffs)].slice(0, 7),
    bestHome: home, hardFail: ranked.hardFail,
  }
}

export function rankScorecard(places: Place[], w: Weights = DEFAULT_WEIGHTS): WhyCard[] {
  return places
    .filter((p) => !p.minor)
    .map((p) => {
      const r = rankPlace(p, w)
      return scorecardWhy(p, r, w)
    })
    .filter((c) => c.known >= 3 && c.score != null)
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.known - a.known || a.place.short.localeCompare(b.place.short))
}

export interface FamilyFactor {
  key: string
  label: string
  score: number | null
  detail: string
}

export interface FamilyCard extends WhyCard {
  factors: FamilyFactor[]
}

const CS_INCOME = CORAL_SPRINGS_POP.medianIncome.valueUsd as number
const CS_COMMUTE = CORAL_SPRINGS_POP.meanCommute.value as number
const CS_GROWTH = CORAL_SPRINGS_POP.growth.pct as number
const NATIONAL_CSI = CANADA_CSI_2025.value as number

export function familyFactors(place: Place): FamilyFactor[] {
  const out: FamilyFactor[] = []
  const sch = place.scores.schools
  out.push({
    key: 'schools',
    label: 'K-12 schools (and colleges, as marked)',
    score: sch && sch.mark !== 'unknown' ? MARK_SCORE[sch.mark] : null,
    detail: sch && sch.mark !== 'unknown'
      ? `${markLabel(sch.mark)}${sch.note ? ` — ${sch.note}` : ''}${place.schools ? ` ${place.schools}` : ''}`
      : 'No schools mark is in the report for this place, so schools are left out of the average rather than guessed.',
  })

  const safer = classifySafer(crimeFor(place.id))
  if (safer.group === 'safer') {
    out.push({ key: 'safety', label: 'Safety (official US rates vs Coral Springs)', score: 3, detail: `Violent ${formatRate(safer.violent)} and property ${formatRate(safer.property)} per 100k are both at or below Coral Springs (${formatRate(CORAL_VIOLENT_RATE)} / ${formatRate(CORAL_PROPERTY_RATE)}, FBI 2025).` })
  } else if (safer.group === 'one-sided') {
    out.push({ key: 'safety', label: 'Safety (official US rates vs Coral Springs)', score: 1.5, detail: `Only one of the two official rates is at or below Coral Springs: violent ${formatRate(safer.violent)}, property ${formatRate(safer.property)} per 100k.` })
  } else if (safer.group === 'higher') {
    out.push({ key: 'safety', label: 'Safety (official US rates vs Coral Springs)', score: 0, detail: `Both official rates are above Coral Springs: violent ${formatRate(safer.violent)}, property ${formatRate(safer.property)} per 100k.` })
  } else if (safer.group === 'canada') {
    const csi = safer.csi
    const score = csi == null ? null : csi <= NATIONAL_CSI ? 3 : csi <= NATIONAL_CSI * 1.25 ? 1.5 : 0
    out.push({ key: 'safety', label: 'Safety (Canadian CSI vs national, approximate)', score, detail: csi == null
      ? 'A Crime Severity Index is not on file.'
      : `CSI ${csi.toFixed(2)} versus Canada’s 2025 national CSI of ${NATIONAL_CSI.toFixed(2)}. This is approximate and is not compared with Coral Springs (different offence definitions).` })
  } else {
    out.push({ key: 'safety', label: 'Safety', score: null, detail: 'Official rates that can be scored are not available, so safety is left out of the average.' })
  }

  const pop = populationFor(place.id)?.primary
  const inc = pop?.medianIncome.valueUsd ?? null
  const homes = qualifyingHomes(place.id)
  const medPrice = homes.length ? [...homes].sort((a, b) => a.priceUsd - b.priceUsd)[Math.floor(homes.length / 2)].priceUsd : null
  if (medPrice != null && inc) {
    const ratio = medPrice / inc
    const score = ratio <= 3.5 ? 3 : ratio <= 5.5 ? 1.5 : 0
    out.push({ key: 'afford', label: 'Housing cost vs median income', score, detail: `Median priced 4/3 listing in this report is US$${Math.round(medPrice).toLocaleString('en-US')} versus median household income ${formatMoney(inc)} (${ratio.toFixed(2)}× income; Coral Springs income is ${formatMoney(CS_INCOME)}). A ratio at or below 3.5× is treated as a pass, 3.5–5.5× as partial, above 5.5× as a concern. This uses the priced listings we have; it is not a gate.` })
  } else {
    out.push({ key: 'afford', label: 'Housing cost vs median income', score: null, detail: inc == null
      ? 'Median household income is not on file, so affordability is unknown.'
      : 'No priced 4/3 listing is on file, so a price-to-income ratio is not computed. The place is not removed for that reason.' })
  }

  if (inc != null) {
    const score = inc >= CS_INCOME ? 3 : inc >= CS_INCOME * 0.85 ? 1.5 : 0
    out.push({ key: 'income', label: 'Median household income', score, detail: `${pop!.label}: ${formatMoney(inc)} (${pop!.medianIncome.year}) versus Coral Springs ${formatMoney(CS_INCOME)} (${CORAL_SPRINGS_POP.medianIncome.year}). Canadian figures are converted at this report’s 1 USD = 1.4066 CAD rate and are approximate across income years.` })
  } else {
    out.push({ key: 'income', label: 'Median household income', score: null, detail: 'Not on file.' })
  }

  const commute = pop?.meanCommute.value ?? null
  if (commute != null) {
    const score = commute <= 25 ? 3 : commute <= 35 ? 1.5 : 0
    out.push({ key: 'commute', label: 'Mean commute', score, detail: `${formatMinutes(commute)} mean travel time to work (${pop!.label}, ${pop!.meanCommute.year}) versus ${formatMinutes(CS_COMMUTE)} in Coral Springs. At or below 25 min is a pass, 25–35 min partial, over 35 min a concern.` })
  } else {
    out.push({ key: 'commute', label: 'Mean commute', score: null, detail: 'Not on file.' })
  }

  const hosp = place.amenities ? nearest(place.amenities.hospital) : undefined
  if (hosp?.driveMin != null) {
    const score = hosp.driveMin <= 20 ? 3 : hosp.driveMin <= 35 ? 1.5 : 0
    out.push({ key: 'hospital', label: 'Hospital with ER', score, detail: `${hosp.name} is about ${hosp.driveMin} min from the place’s base (amenities as of ${place.amenities!.asOf}).` })
  } else {
    out.push({ key: 'hospital', label: 'Hospital with ER', score: null, detail: 'No sourced hospital drive time is on file.' })
  }

  const park = place.amenities ? nearest(place.amenities.park) : undefined
  const rink = place.amenities ? nearest(place.amenities.rink) : undefined
  if (park?.driveMin != null || rink?.driveMin != null) {
    const p = park?.driveMin
    const r = rink?.driveMin
    const score = (p != null && p <= 30 && r != null && r <= 30) ? 3 : ((p != null && p <= 45) || (r != null && r <= 30)) ? 1.5 : 0
    out.push({ key: 'parks', label: 'Parks and kid recreation', score, detail: [p != null ? `Nearest national/state/provincial park: ${park!.name} ~${p} min` : null, r != null ? `Nearest rink: ${rink!.name} ~${r} min` : null].filter(Boolean).join('. ') + '.' })
  } else {
    out.push({ key: 'parks', label: 'Parks and kid recreation', score: null, detail: 'No sourced park or rink drive time is on file.' })
  }

  const aw = place.scores.airwater
  out.push({
    key: 'airwater',
    label: 'Air and water quality',
    score: aw && aw.mark !== 'unknown' ? MARK_SCORE[aw.mark] : null,
    detail: aw && aw.mark !== 'unknown' ? `${markLabel(aw.mark)}${aw.note ? ` — ${aw.note}` : ''}` : 'Not scored in the report.',
  })

  const uni = place.amenities ? nearest(place.amenities.university) : undefined
  if (uni?.driveMin != null) {
    const score = uni.driveMin <= 30 ? 3 : uni.driveMin <= 60 ? 1.5 : 0
    out.push({ key: 'college', label: 'Colleges nearby', score, detail: `${uni.name} is about ${uni.driveMin} min from the place’s base.` })
  } else {
    out.push({ key: 'college', label: 'Colleges nearby', score: null, detail: 'No sourced college drive time is on file.' })
  }

  const growth = pop?.growth.pct ?? null
  if (growth != null) {
    const score = growth < -5 || growth > 25 ? 0 : growth > 15 || growth < 0 ? 1.5 : 3
    out.push({ key: 'growth', label: 'Population growth / stability', score, detail: `${pop!.label} changed ${formatPct(growth)} from ${pop!.growth.fromYear} to ${pop!.growth.toYear} (Coral Springs ${formatPct(CS_GROWTH)} over ${CORAL_SPRINGS_POP.growth.fromYear}–${CORAL_SPRINGS_POP.growth.toYear}). A roughly 0–15% rise over that span is treated as stable-to-growing; faster growth or a decline is flagged. Periods differ by geography, so this is only a rough stability check.` })
  } else {
    out.push({ key: 'growth', label: 'Population growth / stability', score: null, detail: 'Not on file.' })
  }

  return out
}

export function rankFamily(places: Place[]): FamilyCard[] {
  const cards: FamilyCard[] = []
  for (const place of places) {
    if (place.minor) continue
    const factors = familyFactors(place)
    const known = factors.filter((f) => f.score != null)
    if (known.length < 3) continue
    const score = known.reduce((a, f) => a + (f.score as number), 0) / known.length
    const strengths: string[] = []
    const tradeoffs: string[] = []
    for (const f of factors) {
      if (f.score == null) continue
      if (f.score >= 2.4) strengths.push(`${f.label}: ${f.detail}`)
      else tradeoffs.push(`${f.label}: ${f.detail}`)
    }
    if (place.status === 'parked') tradeoffs.unshift('Parked at his request (Oregon). It is included here because this list does not use our personal filters, but it is not a current pick.')
    if (place.cutReason) tradeoffs.push(place.cutReason)
    for (const c of place.cons.slice(0, 3)) tradeoffs.push(c)

    const bits: string[] = []
    bits.push(`${place.name} scores ${score.toFixed(2)} / 3 as a typical-family place, averaging ${known.length} sourced family factors (unknown factors are left out, not counted as zero).`)
    bits.push('This ranking does not use our scorecard weights, and it does not require 2+ Sichuan, 2+ Turkish, or a qualifying 4/3 acreage listing.')
    const safe = factors.find((f) => f.key === 'safety')
    const sch = factors.find((f) => f.key === 'schools')
    const inc = factors.find((f) => f.key === 'income')
    const com = factors.find((f) => f.key === 'commute')
    if (sch && sch.score != null) bits.push(`Schools: ${sch.detail}`)
    if (safe && safe.score != null) bits.push(safe.detail)
    else if (inc) bits.push(inc.detail)
    if (com && com.score != null) bits.push(`Commute: ${com.detail}`)

    cards.push({
      place, score, known: known.length, why: bits.join(' '),
      strengths: strengths.slice(0, 7), tradeoffs: [...new Set(tradeoffs)].slice(0, 7),
      bestHome: bestHome(place.id), hardFail: false, factors,
    })
  }
  return cards.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.known - a.known || a.place.short.localeCompare(b.place.short))
}

export function familyMethodText(): string {
  const csi = (CANADA_CSI_2025.value as number).toFixed(2)
  return `This list is for a typical family, not for our personal must-haves. It does not use the Scorecard sliders, and it does not treat Sichuan/Turkish restaurants, 1–3 acres, or a 4-bedroom / 3-full-bath listing as a gate. A place with no qualifying home can still rank; if we have no priced listing, housing affordability is simply left out of the average.

Each place is scored 0–3 on the family factors we already have in this report, and the rank is the average of the factors that have a mark. Unknown factors are omitted, never treated as zero, so a high score on thin evidence is possible — check the “known” count.

The factors are: K-12 schools (the report’s schools mark, which often also notes colleges); safety (US official violent and property rates at or below Coral Springs’ 118.8 / 888.0 per 100k, FBI 2025; Canadian places use Crime Severity Index versus Canada’s 2025 national CSI of ${csi} and are labelled approximate, never compared with Coral Springs); housing cost versus median household income when a priced 4/3 listing exists (≤3.5× income = pass, 3.5–5.5× = partial, higher = concern); median household income versus Coral Springs; mean commute (≤25 min pass, 25–35 partial, >35 concern); drive time to a hospital with ER; parks and rinks; air and water quality; drive time to a college; and population growth over the sourced period (about 0–15% treated as stable-to-growing). Income and commute years differ between the US and Canada, so those comparisons are approximate.`
}
