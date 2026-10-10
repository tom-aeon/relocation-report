import { CRITERIA, type CriterionKey, type Mark, type Place } from '../data/places'

export const MARK_VALUE: Record<Exclude<Mark, 'unknown'>, number> = { pass: 3, partial: 1.5, fail: 0 }

export type Weights = Record<CriterionKey, number>
export const DEFAULT_WEIGHTS: Weights = Object.fromEntries(
  CRITERIA.map((c) => [c.key, c.hard ? 3 : 2]),
) as Weights

export interface Ranked {
  place: Place
  score: number | null
  known: number
  unknown: CriterionKey[]
  derived: CriterionKey[]
  hardFail: boolean
}

export function rankPlace(place: Place, w: Weights): Ranked {
  let sum = 0, wsum = 0, known = 0
  const unknown: CriterionKey[] = []
  const derived: CriterionKey[] = []
  for (const c of CRITERIA) {
    const s = place.scores[c.key]
    if (!s || s.mark === 'unknown') { unknown.push(c.key); continue }
    known++
    if (s.source === 'derived') derived.push(c.key)
    if (w[c.key] <= 0) continue
    sum += MARK_VALUE[s.mark] * w[c.key]
    wsum += w[c.key]
  }
  const hardFail = (['sichuan', 'turkish'] as CriterionKey[]).some((k) => place.scores[k]?.mark === 'fail')
  return { place, score: wsum > 0 ? sum / wsum : null, known, unknown, derived, hardFail }
}
