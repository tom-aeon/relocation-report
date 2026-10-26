import type { PlaceAmenities } from './amenitiesTypes'
import type { Mark } from './places'
export const AMENITIES: Record<string, PlaceAmenities> = {}
export const OUTDOOR: Record<string, { mark: Exclude<Mark, 'unknown'>; note: string }> = {}
