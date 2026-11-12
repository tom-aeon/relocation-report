/** Keyless Google Maps search links and embed iframes. */

export function googleMapsSearchUrl(lat?: number, lng?: number, address?: string): string | null {
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  if (address && address.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`
  }
  return null
}

export function googleMapsEmbedUrl(lat?: number, lng?: number, address?: string, zoom = 14): string | null {
  let q: string | null = null
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    q = `${lat},${lng}`
  } else if (address && address.trim()) {
    q = encodeURIComponent(address.trim())
  }
  if (!q) return null
  return `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`
}

export function GoogleMapsLink({
  lat, lng, address, children, className = '', testId = 'google-maps-link',
}: {
  lat?: number
  lng?: number
  address?: string
  children?: React.ReactNode
  className?: string
  testId?: string
}) {
  const href = googleMapsSearchUrl(lat, lng, address)
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} data-testid={testId}>
      {children ?? 'Open in Google Maps ↗'}
    </a>
  )
}

export function GoogleMapEmbed({
  lat, lng, address, title, zoom = 14, className = '', testId = 'google-map-embed',
}: {
  lat?: number
  lng?: number
  address?: string
  title: string
  zoom?: number
  className?: string
  testId?: string
}) {
  const src = googleMapsEmbedUrl(lat, lng, address, zoom)
  if (!src) {
    const href = googleMapsSearchUrl(lat, lng, address)
    if (!href) return null
    return (
      <p className="text-sm text-slate-500" data-testid={`${testId}-fallback`}>
        Map not available here.{' '}
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline dark:text-teal-400">Open in Google Maps ↗</a>
      </p>
    )
  }
  return (
    <div className={`overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`} data-testid={testId}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  )
}
