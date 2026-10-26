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
