import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import type { ChartData, Transit, TransitAspectType, BirthData } from '../../types/astrology'
import { getInterpretation } from './interpretations'

// Orbes por planeta (en grados)
const PLANET_ORBS: Record<string, number> = {
  'Luna': 0.5,
  'Sol': 1,
  'Mercurio': 1,
  'Venus': 1,
  'Marte': 1.5,
  'Júpiter': 3,
  'Saturno': 3,
  'Urano': 4,
  'Neptuno': 4,
  'Plutón': 4
}

// Mapeo de nombres de planetas en inglés a español (acepta mayúsculas y minúsculas)
const PLANET_NAMES: Record<string, string> = {
  // Mayúsculas
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
  'Chiron': 'Quirón',
  // Minúsculas (la librería devuelve en minúsculas)
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
  'chiron': 'Quirón'
}

// Mapeo inverso (español → inglés)
const PLANET_NAMES_REVERSE: Record<string, string> = {
  'Sol': 'Sun',
  'Luna': 'Moon',
  'Mercurio': 'Mercury',
  'Venus': 'Venus',
  'Marte': 'Mars',
  'Júpiter': 'Jupiter',
  'Saturno': 'Saturn',
  'Urano': 'Uranus',
  'Neptuno': 'Neptune',
  'Plutón': 'Pluto'
}

// Mapeo de signos en inglés a español (igual que en calculator.ts)
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

// Aspectos mayores con sus ángulos
const MAJOR_ASPECTS: Array<{ type: TransitAspectType; angle: number }> = [
  { type: 'conjunction', angle: 0 },
  { type: 'sextile', angle: 60 },
  { type: 'square', angle: 90 },
  { type: 'trine', angle: 120 },
  { type: 'opposition', angle: 180 }
]

// Función para normalizar ángulo a 0-360
function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360
  while (angle >= 360) angle -= 360
  return angle
}

// Función para calcular diferencia angular (menor arco)
function calculateAngularDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return Math.min(diff, 360 - diff)
}

// Función para detectar si un aspecto está dentro de orbe
function isAspectWithinOrb(
  transitingLongitude: number,
  natalLongitude: number,
  aspectAngle: number,
  orb: number
): { isWithin: boolean; actualOrb: number; isApplying: boolean } {
  const diff = calculateAngularDifference(transitingLongitude, natalLongitude)
  const aspectDiff = Math.abs(diff - aspectAngle)
  
  // Para conjunción (0°), también considerar si está cerca de 360°
  let isWithin = aspectDiff <= orb
  if (aspectAngle === 0) {
    // Para conjunción, también verificar si está cerca de 360° (opuesto)
    const oppositeDiff = Math.abs(diff - 360)
    isWithin = isWithin || oppositeDiff <= orb
  }
  
  if (isWithin) {
    // Determinar si se está acercando o alejando
    // Simplificado: si la diferencia es menor que la del aspecto, se acerca
    const isApplying = diff < aspectAngle || (aspectAngle === 0 && diff < orb)
    
    return {
      isWithin: true,
      actualOrb: aspectDiff,
      isApplying
    }
  }
  
  return { isWithin: false, actualOrb: aspectDiff, isApplying: false }
}

// Función para calcular fuerza del tránsito (1-10)
function calculateStrength(transit: Transit): number {
  let strength = 10
  
  // Reducir por orbe (cuanto más exacto, más fuerte)
  strength -= transit.orb * 2
  
  // Aumentar si es planeta lento
  const slowPlanets = ['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón']
  if (slowPlanets.includes(transit.transitingPlanet)) {
    strength += 2
  }
  
  // Aumentar si afecta a Sol, Luna o Ascendente
  const importantPoints = ['Sol', 'Luna', 'Ascendente']
  if (importantPoints.includes(transit.natalPoint)) {
    strength += 2
  }
  
  // Bonus si es exacto
  if (transit.isExact) {
    strength += 1
  }
  
  return Math.max(1, Math.min(10, Math.round(strength)))
}

// Función para obtener posición de un planeta desde Horoscope
function getPlanetPosition(horoscope: Horoscope, planetKey: string): { sign: string; degree: number; longitude: number } | null {
  const celestialBodies = horoscope.CelestialBodies.all || []
  const planet = celestialBodies.find((p: any) => p.key === planetKey)
  
  if (planet && planet.ChartPosition && planet.ChartPosition.Ecliptic) {
    const longitude = planet.ChartPosition.Ecliptic.DecimalDegrees
    const degree = longitude % 30
    
    // Obtener signo de múltiples formas posibles
    let signEnglish = (planet.Sign?.key || '').toLowerCase()
    if (!signEnglish && (planet as any).sign) {
      signEnglish = String((planet as any).sign).toLowerCase()
    }
    if (!signEnglish) {
      // Calcular signo desde longitud si no está disponible
      const signIndex = Math.floor(longitude / 30)
      const englishSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
      signEnglish = englishSigns[signIndex] || 'aries'
    }
    
    // Traducir signo a español
    let signMapped = SIGN_NAMES[signEnglish]
    if (!signMapped) {
      // Intentar con primera letra mayúscula
      signMapped = SIGN_NAMES[signEnglish.charAt(0).toUpperCase() + signEnglish.slice(1)]
    }
    if (!signMapped) {
      // Fallback: usar el signo en inglés capitalizado
      signMapped = signEnglish.charAt(0).toUpperCase() + signEnglish.slice(1)
    }
    
    const sign = signMapped.charAt(0).toUpperCase() + signMapped.slice(1)
    
    // DEBUG: Verificar traducción
    if (signEnglish !== sign.toLowerCase()) {
      console.log(`  🔄 Traducción signo: ${signEnglish} → ${sign}`)
    }
    
    return {
      sign,
      degree: Math.round(degree * 10) / 10,
      longitude
    }
  }
  
  return null
}

// Función para obtener Ascendente o MC desde Horoscope
function getAnglePosition(horoscope: Horoscope, angleType: 'ascendant' | 'midheaven'): { sign: string; degree: number; longitude: number } | null {
  const angle = angleType === 'ascendant' ? horoscope.Ascendant : horoscope.Midheaven
  
  if (angle && angle.ChartPosition && angle.ChartPosition.Ecliptic) {
    const longitude = angle.ChartPosition.Ecliptic.DecimalDegrees
    const degree = longitude % 30
    
    // Obtener signo de múltiples formas posibles
    let signEnglish = (angle.Sign?.key || '').toLowerCase()
    if (!signEnglish && (angle as any).sign) {
      signEnglish = String((angle as any).sign).toLowerCase()
    }
    if (!signEnglish) {
      // Calcular signo desde longitud si no está disponible
      const signIndex = Math.floor(longitude / 30)
      const englishSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
      signEnglish = englishSigns[signIndex] || 'aries'
    }
    
    // Traducir signo a español
    let signMapped = SIGN_NAMES[signEnglish]
    if (!signMapped) {
      // Intentar con primera letra mayúscula
      signMapped = SIGN_NAMES[signEnglish.charAt(0).toUpperCase() + signEnglish.slice(1)]
    }
    if (!signMapped) {
      // Fallback: usar el signo en inglés capitalizado
      signMapped = signEnglish.charAt(0).toUpperCase() + signEnglish.slice(1)
    }
    
    const sign = signMapped.charAt(0).toUpperCase() + signMapped.slice(1)
    
    return {
      sign,
      degree: Math.round(degree * 10) / 10,
      longitude
    }
  }
  
  return null
}

// Función para recalcular carta natal y obtener longitudes exactas
async function getNatalLongitudes(birthData: BirthData): Promise<{
  planets: Map<string, number>
  ascendant?: number
  midheaven?: number
}> {
  const latitude = birthData.latitude ?? 39.571396
  const longitude = birthData.longitude ?? 2.622432
  
  // Parsear fecha de nacimiento
  const [year, monthStr, day] = birthData.date.split('-').map(Number)
  const [hour, minute] = birthData.time.split(':').map(Number)
  const month = monthStr - 1  // 0-11
  
  // Crear Origin para carta natal
  const natalOrigin = new Origin({
    year,
    month,
    date: day,
    hour,
    minute,
    latitude,
    longitude
  })
  
  // Crear Horoscope natal
  const natalHoroscope = new Horoscope({
    origin: natalOrigin,
    houseSystem: 'placidus',
    zodiac: 'tropical',
    language: 'en'
  })
  
  const natalLongitudes = new Map<string, number>()
  
  // Obtener longitudes de planetas natales
  const natalPlanets = natalHoroscope.CelestialBodies.all || []
  console.log('🔍 DEBUG getNatalLongitudes:')
  console.log('  Planetas encontrados en horoscope natal:', natalPlanets.length)
  for (const planet of natalPlanets) {
    const planetKey = (planet as any).key
    // Normalizar clave (la librería puede devolver en minúsculas)
    const normalizedKey = planetKey?.toLowerCase() || planetKey
    const planetName = PLANET_NAMES[normalizedKey] || PLANET_NAMES[planetKey]
    
    // Solo procesar planetas principales (ignorar Chiron, Sirius, etc. por ahora)
    if (!planetName || !['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(planetName)) {
      console.log(`  ⏭️ Saltando planeta: key=${planetKey} (no es planeta principal)`)
      continue
    }
    
    if (planet.ChartPosition && planet.ChartPosition.Ecliptic) {
      const longitude = planet.ChartPosition.Ecliptic.DecimalDegrees
      natalLongitudes.set(planetName, longitude)
      console.log(`  ✓ ${planetName}: ${longitude.toFixed(2)}°`)
    } else {
      console.log(`  ⚠️ Planeta sin posición: ${planetName} (key=${planetKey})`)
    }
  }
  
  // Obtener Ascendente y MC
  let ascendantLongitude: number | undefined
  let midheavenLongitude: number | undefined
  
  if (natalHoroscope.Ascendant && natalHoroscope.Ascendant.ChartPosition) {
    ascendantLongitude = natalHoroscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees
  }
  
  if (natalHoroscope.Midheaven && natalHoroscope.Midheaven.ChartPosition) {
    midheavenLongitude = natalHoroscope.Midheaven.ChartPosition.Ecliptic.DecimalDegrees
  }
  
  return {
    planets: natalLongitudes,
    ascendant: ascendantLongitude,
    midheaven: midheavenLongitude
  }
}

// Función principal para calcular tránsitos
export async function calculateTransits(
  natalChart: ChartData,
  date: Date
): Promise<Transit[]> {
  try {
    const transits: Transit[] = []
    
    // Obtener coordenadas de la carta natal
    const birthData = natalChart.birthData
    const latitude = birthData.latitude ?? 39.571396
    const longitude = birthData.longitude ?? 2.622432
    
    // Obtener longitudes natales exactas
    const natalLongitudes = await getNatalLongitudes(birthData)
    
    // DEBUG: Verificar planetas natales encontrados
    console.log('🔍 DEBUG Tránsitos:')
    console.log('  Planetas natales encontrados:', Array.from(natalLongitudes.planets.keys()))
    console.log('  Ascendente natal:', natalLongitudes.ascendant)
    console.log('  MC natal:', natalLongitudes.midheaven)
    
    // Parsear fecha de tránsito
    const transitYear = date.getFullYear()
    const transitMonth = date.getMonth()  // 0-11
    const transitDate = date.getDate()
    const transitHour = 12  // Mediodía para tránsitos diarios
    const transitMinute = 0
    
    // Crear Origin para la fecha de tránsito
    const transitOrigin = new Origin({
      year: transitYear,
      month: transitMonth,
      date: transitDate,
      hour: transitHour,
      minute: transitMinute,
      latitude,
      longitude
    })
    
    // Crear Horoscope para tránsitos
    const transitHoroscope = new Horoscope({
      origin: transitOrigin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      language: 'en'
    })
    
    // Obtener posiciones de planetas transitantes
    const transitingPlanets = transitHoroscope.CelestialBodies.all || []
    
    // DEBUG: Verificar planetas transitantes
    console.log('  Planetas transitantes encontrados:', transitingPlanets.length)
    
    // Comparar cada planeta transitante con cada planeta natal
    for (const transitingPlanet of transitingPlanets) {
      const transitingKey = (transitingPlanet as any).key
      // Normalizar clave (la librería devuelve en minúsculas)
      const normalizedKey = transitingKey?.toLowerCase() || transitingKey
      const transitingName = PLANET_NAMES[normalizedKey] || PLANET_NAMES[transitingKey]
      
      // Solo procesar planetas principales (ignorar Chiron, Sirius, etc. por ahora)
      if (!transitingName || !['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(transitingName)) {
        continue
      }
      
      const transitingPos = getPlanetPosition(transitHoroscope, transitingKey)
      if (!transitingPos) {
        console.log(`  ⚠️ No se pudo obtener posición de ${transitingName}`)
        continue
      }
      
      // DEBUG: Verificar traducción de signo
      const signFromPlanet = (transitingPlanet as any).Sign?.key || 'unknown'
      console.log(`  ✓ ${transitingName} transitando: ${transitingPos.longitude.toFixed(2)}° (${transitingPos.degree.toFixed(1)}° ${transitingPos.sign}) [original: ${signFromPlanet}]`)
      
      // Comparar con planetas natales
      for (const [natalPlanetName, natalLongitude] of natalLongitudes.planets.entries()) {
        // Obtener información del planeta natal desde ChartData
        const natalPlanet = natalChart.planets.find(p => p.name === natalPlanetName)
        if (!natalPlanet) {
          console.log(`  ⚠️ Planeta natal ${natalPlanetName} no encontrado en ChartData`)
          continue
        }
        
        console.log(`    Comparando con ${natalPlanetName} natal: ${natalLongitude.toFixed(2)}°`)
        
        // Calcular aspectos
        for (const aspect of MAJOR_ASPECTS) {
          const orb = PLANET_ORBS[transitingName] || 3
          const aspectCheck = isAspectWithinOrb(
            transitingPos.longitude,
            natalLongitude,
            aspect.angle,
            orb
          )
          
          // DEBUG: Log de aspectos verificados
          if (aspectCheck.actualOrb < orb + 5) { // Log si está cerca del orbe
            console.log(`      ${aspect.type} (${aspect.angle}°): orbe=${aspectCheck.actualOrb.toFixed(2)}°, límite=${orb}°, dentro=${aspectCheck.isWithin}`)
          }
          
          if (aspectCheck.isWithin) {
            console.log(`      ✅ TRÁNSITO ENCONTRADO: ${transitingName} ${aspect.type} ${natalPlanetName}`)
            const isTense = aspect.type === 'square' || aspect.type === 'opposition'
            const isHarmonious = aspect.type === 'trine' || aspect.type === 'sextile'
            
            const natalDegree = natalLongitude % 30
            const natalSignIndex = Math.floor(natalLongitude / 30)
            const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
            const natalSign = signs[natalSignIndex] || natalPlanet.sign
            
            const transit: Transit = {
              id: `${transitingKey}_${aspect.type}_${natalPlanetName}_${date.toISOString()}`,
              transitingPlanet: transitingName,
              transitingPosition: transitingPos,
              natalPoint: natalPlanetName,
              natalPosition: {
                sign: natalSign,
                degree: Math.round(natalDegree * 10) / 10,
                longitude: natalLongitude
              },
              aspect: aspect.type,
              orb: Math.round(aspectCheck.actualOrb * 10) / 10,
              isExact: aspectCheck.actualOrb < 0.5,
              isApplying: aspectCheck.isApplying,
              strength: 0,  // Se calculará después
              interpretation: getInterpretation(transitingName, aspect.type, natalPlanetName),
              isTense,
              isHarmonious
            }
            
            transit.strength = calculateStrength(transit)
            transits.push(transit)
          }
        }
      }
      
      // Comparar con Ascendente natal
      if (natalLongitudes.ascendant !== undefined && natalChart.ascendant) {
        for (const aspect of MAJOR_ASPECTS) {
          const orb = PLANET_ORBS[transitingName] || 3
          const aspectCheck = isAspectWithinOrb(
            transitingPos.longitude,
            natalLongitudes.ascendant,
            aspect.angle,
            orb
          )
          
          if (aspectCheck.isWithin) {
            const isTense = aspect.type === 'square' || aspect.type === 'opposition'
            const isHarmonious = aspect.type === 'trine' || aspect.type === 'sextile'
            
            const ascDegree = natalLongitudes.ascendant % 30
            const ascSignIndex = Math.floor(natalLongitudes.ascendant / 30)
            const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
            const ascSign = signs[ascSignIndex] || natalChart.ascendant
            
            const transit: Transit = {
              id: `${transitingKey}_${aspect.type}_ascendant_${date.toISOString()}`,
              transitingPlanet: transitingName,
              transitingPosition: transitingPos,
              natalPoint: 'Ascendente',
              natalPosition: {
                sign: ascSign,
                degree: Math.round(ascDegree * 10) / 10,
                longitude: natalLongitudes.ascendant
              },
              aspect: aspect.type,
              orb: Math.round(aspectCheck.actualOrb * 10) / 10,
              isExact: aspectCheck.actualOrb < 0.5,
              isApplying: aspectCheck.isApplying,
              strength: 0,
              interpretation: getInterpretation(transitingName, aspect.type, 'Ascendente'),
              isTense,
              isHarmonious
            }
            
            transit.strength = calculateStrength(transit)
            transits.push(transit)
          }
        }
      }
      
      // Comparar con MC natal
      if (natalLongitudes.midheaven !== undefined && natalChart.midheaven) {
        for (const aspect of MAJOR_ASPECTS) {
          const orb = PLANET_ORBS[transitingName] || 3
          const aspectCheck = isAspectWithinOrb(
            transitingPos.longitude,
            natalLongitudes.midheaven,
            aspect.angle,
            orb
          )
          
          if (aspectCheck.isWithin) {
            const isTense = aspect.type === 'square' || aspect.type === 'opposition'
            const isHarmonious = aspect.type === 'trine' || aspect.type === 'sextile'
            
            const mcDegree = natalLongitudes.midheaven % 30
            const mcSignIndex = Math.floor(natalLongitudes.midheaven / 30)
            const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
            const mcSign = signs[mcSignIndex] || natalChart.midheaven
            
            const transit: Transit = {
              id: `${transitingKey}_${aspect.type}_midheaven_${date.toISOString()}`,
              transitingPlanet: transitingName,
              transitingPosition: transitingPos,
              natalPoint: 'Medio Cielo',
              natalPosition: {
                sign: mcSign,
                degree: Math.round(mcDegree * 10) / 10,
                longitude: natalLongitudes.midheaven
              },
              aspect: aspect.type,
              orb: Math.round(aspectCheck.actualOrb * 10) / 10,
              isExact: aspectCheck.actualOrb < 0.5,
              isApplying: aspectCheck.isApplying,
              strength: 0,
              interpretation: getInterpretation(transitingName, aspect.type, 'Medio Cielo'),
              isTense,
              isHarmonious
            }
            
            transit.strength = calculateStrength(transit)
            transits.push(transit)
          }
        }
      }
    }
    
    // Ordenar por fuerza (más importante primero)
    transits.sort((a, b) => b.strength - a.strength)
    
    // DEBUG: Resumen final
    console.log(`\n📊 RESUMEN DE TRÁNSITOS:`)
    console.log(`  Total encontrados: ${transits.length}`)
    console.log(`  Tensos: ${transits.filter(t => t.isTense).length}`)
    console.log(`  Armónicos: ${transits.filter(t => t.isHarmonious).length}`)
    console.log(`  Conjunciones: ${transits.filter(t => t.aspect === 'conjunction').length}`)
    if (transits.length > 0) {
      console.log(`  Top 3:`)
      transits.slice(0, 3).forEach((t, i) => {
        console.log(`    ${i + 1}. ${t.transitingPlanet} ${t.aspect} ${t.natalPoint} (fuerza: ${t.strength}/10, orbe: ${t.orb}°)`)
      })
    } else {
      console.log(`  ⚠️ No se encontraron tránsitos. Verifica:`)
      console.log(`    - Que los planetas natales se hayan encontrado correctamente`)
      console.log(`    - Que los planetas transitantes se hayan encontrado correctamente`)
      console.log(`    - Que los orbes no sean demasiado estrictos`)
    }
    console.log('─'.repeat(50))
    
    return transits
  } catch (error) {
    console.error('Error calculando tránsitos:', error)
    throw new Error(`Error al calcular tránsitos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Función auxiliar para obtener índice de signo
function getSignIndex(sign: string): number {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ]
  const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()
  return signs.indexOf(normalizedSign) >= 0 ? signs.indexOf(normalizedSign) : 0
}

// Función para calcular resumen de tránsitos
export async function calculateTransitSummary(
  transits: Transit[],
  date: Date,
  birthData: BirthData
): Promise<import('../../types/astrology').TransitSummary> {
  const tenseCount = transits.filter(t => t.isTense).length
  const harmoniousCount = transits.filter(t => t.isHarmonious).length
  const conjunctionCount = transits.filter(t => t.aspect === 'conjunction').length
  
  // Obtener posiciones de Sol y Luna para el resumen
  const latitude = birthData.latitude ?? 39.571396
  const longitude = birthData.longitude ?? 2.622432
  const transitYear = date.getFullYear()
  const transitMonth = date.getMonth()
  const transitDate = date.getDate()
  
  const transitOrigin = new Origin({
    year: transitYear,
    month: transitMonth,
    date: transitDate,
    hour: 12,
    minute: 0,
    latitude,
    longitude
  })
  
  const transitHoroscope = new Horoscope({
    origin: transitOrigin,
    houseSystem: 'placidus',
    zodiac: 'tropical',
    language: 'en'
  })
  
  const sunPos = getPlanetPosition(transitHoroscope, 'Sun')
  const moonPos = getPlanetPosition(transitHoroscope, 'Moon')
  
  return {
    date: date.toISOString().split('T')[0],
    totalTransits: transits.length,
    tenseCount,
    harmoniousCount,
    conjunctionCount,
    mostImportant: transits.length > 0 ? transits[0] : undefined,
    sunPosition: sunPos ? { sign: sunPos.sign, degree: sunPos.degree } : undefined,
    moonPosition: moonPos ? { sign: moonPos.sign, degree: moonPos.degree } : undefined
  }
}

