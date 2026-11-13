export interface Home {
  id: string
  placeId: string
  address: string
  price: number
  currency: 'USD' | 'CAD'
  priceUsd: number
  acres: number
  acresNote?: string
  beds: string | number | null
  baths: string | number | null
  bathNote?: string | null
  sqft: string | number | null
  daysOnMarket?: number | null
  listedDate?: string | null
  newListing?: boolean
  mls?: string | null
  url: string
  source: string
  broker?: string | null
  water?: string | null
  sewer?: string | null
  driveMin: number
  photos: string[]
  note?: string
}

export const total = (x: string | number | null | undefined) => (x == null ? 0 : String(x).split('+').reduce((a, b) => a + (Number(b) || 0), 0))

/** Count of full bathrooms. Half baths named in bathNote, or a .5 listing, are not counted toward the 3-full-bath must. */
export function fullBaths(h: Pick<Home, 'baths' | 'bathNote'>): number {
  const note = (h.bathNote ?? '').toLowerCase()
  const fullMatch = note.match(/(\d+(?:\.\d+)?)\s*full/)
  if (fullMatch && /half/.test(note)) return Math.floor(Number(fullMatch[1]))
  if (h.baths == null) return 0
  const s = String(h.baths).trim()
  if (s.includes('.')) return Math.floor(Number(s) || 0)
  return total(h.baths)
}

export function bedCount(h: Pick<Home, 'beds'>): number {
  return total(h.beds)
}

/** 4+ bedrooms and 3+ full bathrooms. Half baths do not count. */
export function qualifies43(h: Pick<Home, 'beds' | 'baths' | 'bathNote'>): boolean {
  return bedCount(h) >= 4 && fullBaths(h) >= 3
}

export const NO_QUALIFYING_HOMES = 'No qualifying 4/3 homes found yet'
