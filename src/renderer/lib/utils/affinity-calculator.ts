import type { ChartData } from '../../types/astrology'

// Función para calcular la longitud absoluta de un planeta (0-360°)
function getAbsoluteLongitude(planet: { sign: string; degree: number }): number {
  const signOrder: Record<string, number> = {
    'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
    'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
    'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
  }
  const signOffset = signOrder[planet.sign] || 0
  return signOffset + planet.degree
}

// Función para calcular el ángulo entre dos longitudes
function calculateAngle(long1: number, long2: number): number {
  let angle = Math.abs(long1 - long2)
  if (angle > 180) angle = 360 - angle
  return angle
}

// Función para detectar aspectos entre dos planetas
function detectAspect(angle: number, orb: number = 8): { type: string; score: number } | null {
  // Conjunción (0°)
  if (angle <= orb || angle >= 360 - orb) {
    return { type: 'conjunction', score: 5 }
  }
  // Sextil (60°)
  if (Math.abs(angle - 60) <= orb) {
    return { type: 'sextile', score: 8 }
  }
  // Cuadratura (90°)
  if (Math.abs(angle - 90) <= orb) {
    return { type: 'square', score: -5 }
  }
  // Trígono (120°)
  if (Math.abs(angle - 120) <= orb) {
    return { type: 'trine', score: 10 }
  }
  // Oposición (180°)
  if (Math.abs(angle - 180) <= orb) {
    return { type: 'opposition', score: -8 }
  }
  return null
}

// Función para normalizar nombre de planeta
function normalizePlanetName(name: string): string {
  const map: Record<string, string> = {
    'Sun': 'Sol', 'sun': 'Sol',
    'Moon': 'Luna', 'moon': 'Luna',
    'Mercury': 'Mercurio', 'mercury': 'Mercurio',
    'Venus': 'Venus', 'venus': 'Venus',
    'Mars': 'Marte', 'mars': 'Marte',
    'Jupiter': 'Júpiter', 'jupiter': 'Júpiter',
    'Saturn': 'Saturno', 'saturn': 'Saturno',
    'Uranus': 'Urano', 'uranus': 'Urano',
    'Neptune': 'Neptuno', 'neptune': 'Neptuno',
    'Pluto': 'Plutón', 'pluto': 'Plutón'
  }
  return map[name] || name
}

// Planetas importantes para calcular afinidad
const IMPORTANT_PLANETS = ['Sol', 'Luna', 'Venus', 'Marte', 'Mercurio']

export interface AffinityResult {
  score: number  // 0-100
  percentage: number  // 0-100
  level: 'excelente' | 'muy buena' | 'buena' | 'regular' | 'baja'
  description: string
}

export function calculateAffinity(chart1: ChartData, chart2: ChartData): AffinityResult {
  if (!chart1 || !chart2) {
    return {
      score: 0,
      percentage: 0,
      level: 'baja',
      description: 'No se puede calcular sin ambas cartas'
    }
  }

  let totalScore = 0
  let aspectCount = 0
  let harmoniousCount = 0
  let tenseCount = 0

  // Calcular aspectos entre planetas importantes
  for (const planet1 of chart1.planets) {
    const p1Name = normalizePlanetName(planet1.name)
    if (!IMPORTANT_PLANETS.includes(p1Name)) continue

    for (const planet2 of chart2.planets) {
      const p2Name = normalizePlanetName(planet2.name)
      if (!IMPORTANT_PLANETS.includes(p2Name)) continue

      const long1 = getAbsoluteLongitude(planet1)
      const long2 = getAbsoluteLongitude(planet2)
      const angle = calculateAngle(long1, long2)
      const aspect = detectAspect(angle, 8)

      if (aspect) {
        totalScore += aspect.score
        aspectCount++
        if (aspect.score > 0) harmoniousCount++
        if (aspect.score < 0) tenseCount++
      }
    }
  }

  // Bonus por signos compatibles (mismo elemento)
  const elements: Record<string, string> = {
    'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
    'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
    'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
    'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua'
  }

  const sun1 = chart1.planets.find(p => normalizePlanetName(p.name) === 'Sol')
  const sun2 = chart2.planets.find(p => normalizePlanetName(p.name) === 'Sol')
  const moon1 = chart1.planets.find(p => normalizePlanetName(p.name) === 'Luna')
  const moon2 = chart2.planets.find(p => normalizePlanetName(p.name) === 'Luna')

  if (sun1 && sun2) {
    const element1 = elements[sun1.sign] || ''
    const element2 = elements[sun2.sign] || ''
    if (element1 === element2) totalScore += 5
  }

  if (moon1 && moon2) {
    const element1 = elements[moon1.sign] || ''
    const element2 = elements[moon2.sign] || ''
    if (element1 === element2) totalScore += 3
  }

  // Normalizar score a 0-100
  // Score base: -50 a +50, lo convertimos a 0-100
  const normalizedScore = Math.max(0, Math.min(100, 50 + totalScore))
  const percentage = Math.round(normalizedScore)

  // Determinar nivel
  let level: AffinityResult['level']
  let description: string

  if (percentage >= 80) {
    level = 'excelente'
    description = 'Excelente conexión astral'
  } else if (percentage >= 65) {
    level = 'muy buena'
    description = 'Muy buena compatibilidad'
  } else if (percentage >= 50) {
    level = 'buena'
    description = 'Buena afinidad'
  } else if (percentage >= 35) {
    level = 'regular'
    description = 'Compatibilidad regular'
  } else {
    level = 'baja'
    description = 'Baja afinidad astral'
  }

  return {
    score: totalScore,
    percentage,
    level,
    description
  }
}

// Función para obtener color según el porcentaje de compatibilidad
export function getCompatibilityColor(percentage: number): string {
  if (percentage >= 70) return '#10b981' // green-500
  if (percentage >= 50) return '#3b82f6' // blue-500
  if (percentage >= 35) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
}

