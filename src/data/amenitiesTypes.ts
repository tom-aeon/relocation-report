export interface AmItem { name: string; kind: string; town: string; driveMin: number | null; km: number; source: string; note?: string }
export interface AmCat { items: AmItem[]; note?: string }
export const AM_CATS = [
  ['ski', 'Ski resorts & hills'], ['rink', 'Ice rinks & arenas'], ['park', 'National & state/provincial parks'],
  ['stadium', 'Stadiums & major arenas'], ['university', 'Colleges & universities'], ['hospital', 'Hospitals with ER'], ['golf', 'Golf'],
] as const
export type AmKey = typeof AM_CATS[number][0]
export type PlaceAmenities = Record<AmKey, AmCat> & { asOf: string; method: string }
export const nearest = (c?: AmCat) => c?.items.filter((i) => i.driveMin != null).sort((a, b) => a.driveMin! - b.driveMin!)[0]
