// Servicio de geocoding gratuito usando OpenStreetMap Nominatim
// No requiere API key, completamente gratuito

export interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
  country?: string
  city?: string
}

/**
 * Busca coordenadas de un lugar usando OpenStreetMap Nominatim (gratis)
 * @param placeName Nombre del lugar (ej: "Palma, España" o "Madrid")
 * @returns Coordenadas y nombre completo del lugar
 */
export async function geocodePlace(placeName: string): Promise<GeocodingResult | null> {
  if (!placeName || placeName.trim().length === 0) {
    return null
  }

  try {
    // OpenStreetMap Nominatim API (gratis, sin API key)
    // Rate limit: 1 request por segundo (respetamos esto)
    const encodedPlace = encodeURIComponent(placeName.trim())
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedPlace}&format=json&limit=1&addressdetails=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CartaAstralApp/1.0' // Requerido por Nominatim
      }
    })

    if (!response.ok) {
      console.error('Error en geocoding:', response.statusText)
      return null
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      console.log(`No se encontró el lugar: ${placeName}`)
      return null
    }

    const result = data[0]
    
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      country: result.address?.country,
      city: result.address?.city || result.address?.town || result.address?.village
    }
  } catch (error) {
    console.error('Error en geocoding:', error)
    return null
  }
}

/**
 * Debounce para evitar demasiadas llamadas a la API
 * (Nominatim tiene rate limit de 1 request/segundo)
 */
let lastGeocodeTime = 0
const MIN_TIME_BETWEEN_REQUESTS = 1000 // 1 segundo

export async function geocodePlaceWithDebounce(placeName: string): Promise<GeocodingResult | null> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastGeocodeTime

  if (timeSinceLastRequest < MIN_TIME_BETWEEN_REQUESTS) {
    // Esperar el tiempo restante
    await new Promise(resolve => setTimeout(resolve, MIN_TIME_BETWEEN_REQUESTS - timeSinceLastRequest))
  }

  lastGeocodeTime = Date.now()
  return geocodePlace(placeName)
}

