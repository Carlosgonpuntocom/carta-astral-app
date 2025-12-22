import type { Transit } from '../../types/astrology'

export interface DayEnergy {
  action: number       // 0-10 (según Marte, planetas en fuego)
  mental: number       // 0-10 (según Mercurio, aire)
  emotional: number    // 0-10 (según Luna, Venus, agua)
  manifestation: number // 0-10 (según Saturno, tierra)
  creativity: number   // 0-10 (según Leo, 5ª casa)
  resistance: number   // 0-10 (inverso de aspectos tensos)
}

// Signos de fuego, aire, agua, tierra
const FIRE_SIGNS = ['Aries', 'Leo', 'Sagitario']
const AIR_SIGNS = ['Géminis', 'Libra', 'Acuario']
const WATER_SIGNS = ['Cáncer', 'Escorpio', 'Piscis']
const EARTH_SIGNS = ['Tauro', 'Virgo', 'Capricornio']

export function calculateDayEnergy(transits: Transit[]): DayEnergy {
  let action = 5      // Base neutral
  let mental = 5
  let emotional = 5
  let manifestation = 5
  let creativity = 5
  let resistance = 5

  // Contar aspectos tensos para resistencia
  const tenseCount = transits.filter(t => t.isTense).length
  const harmoniousCount = transits.filter(t => t.isHarmonious).length

  // Calcular resistencia (inverso de tensión)
  resistance = Math.max(0, Math.min(10, 10 - (tenseCount * 0.5) + (harmoniousCount * 0.3)))

  for (const transit of transits) {
    const strength = transit.strength / 10 // Normalizar a 0-1
    const modifier = transit.isHarmonious ? 1 : transit.isTense ? -0.5 : 0.5

    // Acción (Marte + signos de fuego)
    if (transit.transitingPlanet === 'Marte' || FIRE_SIGNS.includes(transit.transitingPosition.sign)) {
      action += strength * modifier * 2
    }

    // Mental (Mercurio + signos de aire)
    if (transit.transitingPlanet === 'Mercurio' || AIR_SIGNS.includes(transit.transitingPosition.sign)) {
      mental += strength * modifier * 2
    }

    // Emocional (Luna, Venus + signos de agua)
    if (transit.transitingPlanet === 'Luna' || transit.transitingPlanet === 'Venus' || 
        WATER_SIGNS.includes(transit.transitingPosition.sign)) {
      emotional += strength * modifier * 2
    }

    // Manifestación (Saturno + signos de tierra)
    if (transit.transitingPlanet === 'Saturno' || EARTH_SIGNS.includes(transit.transitingPosition.sign)) {
      manifestation += strength * modifier * 2
    }

    // Creatividad (Leo, 5ª casa - simplificado: tránsitos armónicos a puntos creativos)
    if (transit.isHarmonious && (transit.natalPoint === 'Venus' || transit.natalPoint === 'Sol')) {
      creativity += strength * 1.5
    }
  }

  // Normalizar a 0-10
  return {
    action: Math.max(0, Math.min(10, action)),
    mental: Math.max(0, Math.min(10, mental)),
    emotional: Math.max(0, Math.min(10, emotional)),
    manifestation: Math.max(0, Math.min(10, manifestation)),
    creativity: Math.max(0, Math.min(10, creativity)),
    resistance: Math.max(0, Math.min(10, resistance))
  }
}

export function calculateTotalIntensity(transits: Transit[]): {
  intensity: number
  level: 'Bajo' | 'Medio' | 'Alto' | 'Extremo'
  emoji: string
  recommendedMode: string
} {
  if (transits.length === 0) {
    return {
      intensity: 0,
      level: 'Bajo',
      emoji: '😌',
      recommendedMode: 'Relajación y descanso'
    }
  }

  // Calcular intensidad basada en:
  // - Número de tránsitos
  // - Fuerza promedio
  // - Aspectos exactos
  // - Planetas lentos (más intensos)
  
  const avgStrength = transits.reduce((sum, t) => sum + t.strength, 0) / transits.length
  const exactCount = transits.filter(t => t.isExact).length
  const slowPlanets = transits.filter(t => 
    ['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(t.transitingPlanet)
  ).length

  let intensity = (transits.length / 10) * 30 + // Hasta 30% por cantidad
                  (avgStrength / 10) * 40 +      // Hasta 40% por fuerza
                  (exactCount / transits.length) * 20 + // Hasta 20% por exactitud
                  (slowPlanets / transits.length) * 10  // Hasta 10% por planetas lentos

  intensity = Math.min(100, Math.max(0, intensity))

  let level: 'Bajo' | 'Medio' | 'Alto' | 'Extremo'
  let emoji: string
  let recommendedMode: string

  if (intensity < 25) {
    level = 'Bajo'
    emoji = '😌'
    recommendedMode = 'Relajación y descanso'
  } else if (intensity < 50) {
    level = 'Medio'
    emoji = '😊'
    recommendedMode = 'Actividad normal'
  } else if (intensity < 75) {
    level = 'Alto'
    emoji = '⚡'
    recommendedMode = 'Acción y decisiones importantes'
  } else {
    level = 'Extremo'
    emoji = '🔥'
    recommendedMode = 'Máxima atención y cuidado'
  }

  return {
    intensity: Math.round(intensity),
    level,
    emoji,
    recommendedMode
  }
}

