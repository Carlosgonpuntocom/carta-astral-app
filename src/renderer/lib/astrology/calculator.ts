// Importar el módulo - Vite debería resolverlo correctamente con la configuración
import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import type { BirthData, PlanetPosition, ChartData, Aspect } from '../../types/astrology'

// Mapeo de nombres de planetas en inglés a español (incluye mayúsculas y minúsculas)
const PLANET_NAMES: Record<string, string> = {
  // Versiones capitalizadas - Planetas principales
  'Sun': 'Sol',
  'Moon': 'Luna',
  'Mercury': 'Mercurio',
  'Venus': 'Venus',
  'Mars': 'Marte',
  'Jupiter': 'Júpiter',
  'Saturn': 'Saturno',
  'Uranus': 'Urano',
  'Neptune': 'Neptuno',
  'Pluto': 'Plutón',
  // Versiones en minúsculas - Planetas principales
  'sun': 'Sol',
  'moon': 'Luna',
  'mercury': 'Mercurio',
  'venus': 'Venus',
  'mars': 'Marte',
  'jupiter': 'Júpiter',
  'saturn': 'Saturno',
  'uranus': 'Urano',
  'neptune': 'Neptuno',
  'pluto': 'Plutón',
  // Puntos astrológicos
  'Ascendant': 'Ascendente',
  'ascendant': 'Ascendente',
  'ASC': 'Ascendente',
  'asc': 'Ascendente',
  'Midheaven': 'Medio Cielo',
  'midheaven': 'Medio Cielo',
  'MC': 'Medio Cielo',
  'mc': 'Medio Cielo',
  'North Node': 'Nodo Norte',
  'north node': 'Nodo Norte',
  'NorthNode': 'Nodo Norte',
  'northnode': 'Nodo Norte',
  'True Node': 'Nodo Norte',
  'true node': 'Nodo Norte',
  'TrueNode': 'Nodo Norte',
  'truenode': 'Nodo Norte',
  'South Node': 'Nodo Sur',
  'south node': 'Nodo Sur',
  'SouthNode': 'Nodo Sur',
  'southnode': 'Nodo Sur',
  // Asteroides y puntos menores
  'Chiron': 'Quirón',
  'chiron': 'Quirón',
  'Lilith': 'Lilith',
  'lilith': 'Lilith',
  'Sirius': 'Sirio',
  'sirius': 'Sirio'
}

// Mapeo de signos en inglés a español (incluye versiones en mayúsculas y minúsculas)
const SIGN_NAMES: Record<string, string> = {
  // Versiones capitalizadas
  'Aries': 'Aries',
  'Taurus': 'Tauro',
  'Gemini': 'Géminis',
  'Cancer': 'Cáncer',
  'Leo': 'Leo',
  'Virgo': 'Virgo',
  'Libra': 'Libra',
  'Scorpio': 'Escorpio',
  'Sagittarius': 'Sagitario',
  'Capricorn': 'Capricornio',
  'Aquarius': 'Acuario',
  'Pisces': 'Piscis',
  // Versiones en minúsculas
  'aries': 'Aries',
  'taurus': 'Tauro',
  'gemini': 'Géminis',
  'cancer': 'Cáncer',
  'leo': 'Leo',
  'virgo': 'Virgo',
  'libra': 'Libra',
  'scorpio': 'Escorpio',
  'sagittarius': 'Sagitario',
  'capricorn': 'Capricornio',
  'aquarius': 'Acuario',
  'pisces': 'Piscis'
}

// Función para parsear fecha y hora
// IMPORTANTE: La librería circular-natal-horoscope-js usa meses 0-11 (0 = enero, 11 = diciembre)
// Por lo tanto, debemos restar 1 al mes que viene del formato YYYY-MM-DD
function parseDateTime(dateStr: string, timeStr: string) {
  const [year, monthStr, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  
  // Convertir mes de formato humano (1-12) a formato librería (0-11)
  const month = monthStr - 1
  
  // Validación
  if (month < 0 || month > 11) {
    throw new Error(`Mes inválido: ${monthStr}. Debe estar entre 1 y 12.`)
  }
  
  return { year, month, date: day, hour, minute }
}

// Función para obtener coordenadas si no están disponibles
// Por ahora, si no hay coordenadas, usamos coordenadas de Palma de Mallorca
// En el futuro se puede integrar geocoding para convertir "ciudad" a lat/long
function getCoordinates(birthData: BirthData): { latitude: number; longitude: number } {
  if (birthData.latitude !== undefined && birthData.longitude !== undefined) {
    return {
      latitude: birthData.latitude,
      longitude: birthData.longitude
    }
  }
  
  // Coordenadas por defecto: Hospital Son Dureta, Palma de Mallorca
  // Estas son las coordenadas del hospital donde muchas personas nacen en Palma
  console.info(
    `📍 No se proporcionaron coordenadas para "${birthData.place}". ` +
    `Usando coordenadas del Hospital Son Dureta, Palma (39.571396, 2.622432). ` +
    `Para mayor precisión, añade las coordenadas exactas en el formulario.`
  )
  return { latitude: 39.571396, longitude: 2.622432 }
}

// Función para convertir grados a signo
function degreesToSign(degrees: number): string {
  const signIndex = Math.floor(degrees / 30)
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  return signs[signIndex] || 'Aries'
}

// Función principal para calcular carta astral
export async function calculateChart(birthData: BirthData): Promise<ChartData> {
  try {
    // Parsear fecha y hora
    const { year, month, date, hour, minute } = parseDateTime(birthData.date, birthData.time)
    
    // Obtener coordenadas
    const { latitude, longitude } = getCoordinates(birthData)
    
    // ===== DEBUGGING: Información de entrada =====
    console.group('🔍 DEBUG: Cálculo de Carta Astral')
    console.log('📅 Datos de entrada:')
    console.log('  - Fecha original:', birthData.date)
    console.log('  - Fecha parseada:', `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')} (mes ${month + 1} = ${month} en formato 0-11)`)
    console.log('  - Hora local:', birthData.time, `(${hour}:${minute})`)
    console.log('  - Lugar:', birthData.place)
    console.log('  - Coordenadas:', { latitude, longitude })
    console.log('  - Zona horaria proporcionada:', birthData.timezone || 'No especificada')
    
    // Crear instancia de Origin con los datos de nacimiento
    const origin = new Origin({
      year,
      month,
      date,
      hour,
      minute,
      latitude,
      longitude
    })
    
    // ===== DEBUGGING: Información del Origin =====
    console.log('🌍 Objeto Origin creado:')
    console.log('  - Año:', origin.year)
    console.log('  - Mes:', origin.month, '(0-11, donde 0=enero)')
    console.log('  - Día:', origin.date)
    console.log('  - Hora:', origin.hour)
    console.log('  - Minuto:', origin.minute)
    console.log('  - Latitud:', origin.latitude)
    console.log('  - Longitud:', origin.longitude)
    console.log('  - Zona horaria detectada:', (origin as any).timezone?.name || 'No disponible')
    console.log('  - Hora local formateada:', (origin as any).localTimeFormatted || 'No disponible')
    console.log('  - Hora UTC formateada:', (origin as any).utcTimeFormatted || 'No disponible')
    console.log('  - Tiempo sidéreo local:', (origin as any).localSiderealTime || 'No disponible')
    console.log('  - Fecha juliana:', (origin as any).julianDate || 'No disponible')
    
    // Crear Horoscope a partir del Origin
    const horoscope = new Horoscope({
      origin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      language: 'en'
    })
    
    // ===== DEBUGGING: Información del Horoscope =====
    console.log('⭐ Horoscope creado:')
    console.log('  - Sistema de casas:', 'placidus')
    console.log('  - Zodíaco:', 'tropical')
    
    // Extraer planetas del Horoscope
    const planetsData = horoscope.CelestialBodies
    const planets: PlanetPosition[] = []
    
    // Mapear cada planeta
    // La librería devuelve planetas como array en all, o como objeto con claves
    const planetsArray = planetsData.all || []
    
    for (const planetData of planetsArray) {
      if (planetData && planetData.ChartPosition && planetData.ChartPosition.Ecliptic) {
        const longitude = planetData.ChartPosition.Ecliptic.DecimalDegrees
        
        // Calcular grados dentro del signo (0-30)
        const degrees = longitude % 30
        
        // Obtener el signo del objeto planetData
        const signEnglish = (planetData.Sign?.key || degreesToSign(longitude)).toLowerCase()
        // Mapear a español y capitalizar primera letra
        const signMapped = SIGN_NAMES[signEnglish] || SIGN_NAMES[signEnglish.charAt(0).toUpperCase() + signEnglish.slice(1)] || signEnglish
        const sign = signMapped.charAt(0).toUpperCase() + signMapped.slice(1)
        
        // Obtener nombre en español (si existe en el mapeo)
        const planetKey = planetData.key || ''
        const name = PLANET_NAMES[planetKey] || planetData.label || planetKey
        
        planets.push({
          name,
          sign,
          degree: Math.round(degrees * 10) / 10, // Redondear a 1 decimal
          house: planetData.House?.id
        })
      }
    }
    
    // Ordenar planetas en orden tradicional
    const planetOrder = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón']
    planets.sort((a, b) => {
      const indexA = planetOrder.indexOf(a.name)
      const indexB = planetOrder.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    
    // Extraer Ascendente y Medio Cielo del Horoscope
    let ascendant: string | undefined
    let midheaven: string | undefined
    
    // ===== DEBUGGING: Ascendente y Medio Cielo =====
    console.log('📐 Ángulos calculados:')
    
    if (horoscope.Ascendant) {
      const ascData = horoscope.Ascendant
      const ascEcliptic = ascData.ChartPosition?.Ecliptic?.DecimalDegrees
      const ascHorizon = ascData.ChartPosition?.Horizon?.DecimalDegrees
      const ascSign = ascData.Sign
      
      console.log('  🔺 ASCENDENTE:')
      console.log('    - Grados eclípticos:', ascEcliptic)
      console.log('    - Grados horizonte:', ascHorizon)
      console.log('    - Signo (key):', ascSign?.key)
      console.log('    - Signo (label):', ascSign?.label)
      console.log('    - Objeto completo:', ascData)
      
      if (ascSign) {
        const ascendantSignEnglish = (ascSign.key || '').toLowerCase()
        const signMapped = SIGN_NAMES[ascendantSignEnglish] || SIGN_NAMES[ascendantSignEnglish.charAt(0).toUpperCase() + ascendantSignEnglish.slice(1)] || ascendantSignEnglish
        ascendant = signMapped.charAt(0).toUpperCase() + signMapped.slice(1)
        console.log('    - Signo final (español):', ascendant)
      }
    } else {
      console.warn('  ⚠️ Ascendente no disponible')
    }
    
    if (horoscope.Midheaven) {
      const mcData = horoscope.Midheaven
      const mcEcliptic = mcData.ChartPosition?.Ecliptic?.DecimalDegrees
      const mcSign = mcData.Sign
      
      console.log('  🔺 MEDIO CIELO (MC):')
      console.log('    - Grados eclípticos:', mcEcliptic)
      console.log('    - Signo (key):', mcSign?.key)
      console.log('    - Signo (label):', mcSign?.label)
      
      if (mcSign) {
        const mcSignEnglish = (mcSign.key || '').toLowerCase()
        const signMapped = SIGN_NAMES[mcSignEnglish] || SIGN_NAMES[mcSignEnglish.charAt(0).toUpperCase() + mcSignEnglish.slice(1)] || mcSignEnglish
        midheaven = signMapped.charAt(0).toUpperCase() + signMapped.slice(1)
        console.log('    - Signo final (español):', midheaven)
      }
    } else {
      console.warn('  ⚠️ Medio Cielo no disponible')
    }
    
    // ===== DEBUGGING: Casas =====
    if (horoscope.Houses && horoscope.Houses.length > 0) {
      console.log('🏠 Casas calculadas (primeras 3):')
      horoscope.Houses.slice(0, 3).forEach((house, idx) => {
        const houseEcliptic = house.ChartPosition?.Ecliptic?.DecimalDegrees
        console.log(`  - Casa ${idx + 1}:`, houseEcliptic, '°', `(${house.Sign?.key})`)
      })
    }
    
    console.groupEnd()
    
    // Extraer aspectos si están disponibles
    const aspects: Aspect[] = []
    if (horoscope.Aspects && horoscope.Aspects.all && Array.isArray(horoscope.Aspects.all)) {
      // Mapeo de tipos de aspectos (normalizar a inglés)
      const aspectTypeMap: Record<string, string> = {
        'Conjunction': 'conjunction',
        'Opposition': 'opposition',
        'Trine': 'trine',
        'Square': 'square',
        'Sextile': 'sextile',
        'conjunction': 'conjunction',
        'opposition': 'opposition',
        'trine': 'trine',
        'square': 'square',
        'sextile': 'sextile'
      }
      
      for (const aspectData of horoscope.Aspects.all) {
        if (aspectData && typeof aspectData === 'object') {
          const aspect = aspectData as any
          // Función mejorada para normalizar y traducir nombres de planetas
          const normalizePlanetName = (key: string | undefined, label: string | undefined): string => {
            // Intentar primero con la key
            if (key) {
              const normalized = key.trim()
              // Búsqueda exacta
              if (PLANET_NAMES[normalized]) return PLANET_NAMES[normalized]
              // Búsqueda case-insensitive
              const lowerKey = normalized.toLowerCase()
              for (const [engKey, spaName] of Object.entries(PLANET_NAMES)) {
                if (engKey.toLowerCase() === lowerKey) return spaName
              }
            }
            // Intentar con el label
            if (label) {
              const normalized = label.trim()
              // Búsqueda exacta
              if (PLANET_NAMES[normalized]) return PLANET_NAMES[normalized]
              // Búsqueda case-insensitive
              const lowerLabel = normalized.toLowerCase()
              for (const [engKey, spaName] of Object.entries(PLANET_NAMES)) {
                if (engKey.toLowerCase() === lowerLabel) return spaName
              }
            }
            // Si no se encuentra, devolver el original (key o label)
            return key || label || 'Desconocido'
          }
          
          const planet1 = normalizePlanetName(aspect.point1Key, aspect.point1Label)
          const planet2 = normalizePlanetName(aspect.point2Key, aspect.point2Label)
          
          // Normalizar tipo de aspecto
          const rawType = aspect.label || aspect.aspectKey || aspect.type || 'unknown'
          const normalizedType = aspectTypeMap[rawType] || rawType.toLowerCase()
          
          aspects.push({
            planet1: planet1,
            planet2: planet2,
            type: normalizedType,
            orb: aspect.orb || 0
          })
        }
      }
    }
    
    // Guardar información de debug en el objeto de retorno
    const result: ChartData = {
      birthData,
      planets,
      ascendant,
      midheaven,
      aspects: aspects.length > 0 ? aspects : undefined,
      createdAt: new Date().toISOString()
    }
    
    // Añadir información de debug al objeto (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      (result as any).debug = {
        origin: {
          year: origin.year,
          month: origin.month,
          date: origin.date,
          hour: origin.hour,
          minute: origin.minute,
          latitude: origin.latitude,
          longitude: origin.longitude,
          timezone: (origin as any).timezone?.name,
          localTime: (origin as any).localTimeFormatted,
          utcTime: (origin as any).utcTimeFormatted,
          localSiderealTime: (origin as any).localSiderealTime,
          julianDate: (origin as any).julianDate
        },
        ascendant: horoscope.Ascendant ? {
          eclipticDegrees: horoscope.Ascendant.ChartPosition?.Ecliptic?.DecimalDegrees,
          horizonDegrees: horoscope.Ascendant.ChartPosition?.Horizon?.DecimalDegrees,
          sign: horoscope.Ascendant.Sign?.key,
          signLabel: horoscope.Ascendant.Sign?.label
        } : null,
        midheaven: horoscope.Midheaven ? {
          eclipticDegrees: horoscope.Midheaven.ChartPosition?.Ecliptic?.DecimalDegrees,
          sign: horoscope.Midheaven.Sign?.key,
          signLabel: horoscope.Midheaven.Sign?.label
        } : null
      }
    }
    
    return result
  } catch (error) {
    console.error('Error calculando carta astral:', error)
    throw new Error(`Error al calcular la carta astral: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

