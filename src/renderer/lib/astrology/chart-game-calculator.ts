import type { ChartData } from '../../types/astrology'

// Signos por elemento
const FIRE_SIGNS = ['Aries', 'Leo', 'Sagitario']
const EARTH_SIGNS = ['Tauro', 'Virgo', 'Capricornio']
const AIR_SIGNS = ['Géminis', 'Libra', 'Acuario']
const WATER_SIGNS = ['Cáncer', 'Escorpio', 'Piscis']

// Signos por modalidad
const CARDINAL_SIGNS = ['Aries', 'Cáncer', 'Libra', 'Capricornio']
const FIXED_SIGNS = ['Tauro', 'Leo', 'Escorpio', 'Acuario']
const MUTABLE_SIGNS = ['Géminis', 'Virgo', 'Sagitario', 'Piscis']

// Pesos por planeta (importancia)
const PLANET_WEIGHTS: Record<string, number> = {
  'Sol': 3,
  'Luna': 3,
  'Mercurio': 2,
  'Venus': 2,
  'Marte': 2,
  'Júpiter': 1.5,
  'Saturno': 1.5,
  'Urano': 1,
  'Neptuno': 1,
  'Plutón': 1,
  'Quirón': 0.5,
  'Nodo Norte': 0.5,
  'Nodo Sur': 0.5,
  'Lilith': 0.5
}

export interface ElementDistribution {
  fire: number
  earth: number
  air: number
  water: number
}

export interface ModalityDistribution {
  cardinal: number
  fixed: number
  mutable: number
}

export interface RPGStats {
  INT: number  // Intelecto (Mercurio)
  WIS: number  // Sabiduría (Júpiter) - promedio de mental y emocional
  CHA: number  // Carisma (Venus) - promedio de personal y grupal
  STR: number  // Fuerza/Acción (Marte)
  DEX: number  // Agilidad mental (Ascendente)
  CON: number  // Constitución/Resistencia (Saturno)
  // Desgloses opcionales
  mentalIntuition?: number  // Intuición mental/filosófica
  emotionalIntuition?: number  // Intuición emocional/empática
  personalCharisma?: number  // Magnetismo personal (1 a 1)
  groupCharisma?: number  // Magnetismo grupal (en grupos)
}

export interface Badge {
  icon: string
  title: string
  description: string
  color: string
}

export interface RadarData {
  labels: string[]
  values: number[]
}

// Función para calcular distribución de elementos
export function calculateElements(chart: ChartData): ElementDistribution {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 }
  let totalWeight = 0

  // Contar planetas por elemento
  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.name] || 1
    totalWeight += weight

    if (FIRE_SIGNS.includes(planet.sign)) {
      elements.fire += weight
    } else if (EARTH_SIGNS.includes(planet.sign)) {
      elements.earth += weight
    } else if (AIR_SIGNS.includes(planet.sign)) {
      elements.air += weight
    } else if (WATER_SIGNS.includes(planet.sign)) {
      elements.water += weight
    }
  }

  // Añadir peso del Ascendente (triple)
  if (chart.ascendant) {
    const ascWeight = 3
    totalWeight += ascWeight

    if (FIRE_SIGNS.includes(chart.ascendant)) {
      elements.fire += ascWeight
    } else if (EARTH_SIGNS.includes(chart.ascendant)) {
      elements.earth += ascWeight
    } else if (AIR_SIGNS.includes(chart.ascendant)) {
      elements.air += ascWeight
    } else if (WATER_SIGNS.includes(chart.ascendant)) {
      elements.water += ascWeight
    }
  }

  // Convertir a porcentajes
  if (totalWeight > 0) {
    return {
      fire: Math.round((elements.fire / totalWeight) * 100),
      earth: Math.round((elements.earth / totalWeight) * 100),
      air: Math.round((elements.air / totalWeight) * 100),
      water: Math.round((elements.water / totalWeight) * 100)
    }
  }

  return { fire: 25, earth: 25, air: 25, water: 25 }
}

// Función para calcular distribución de modalidades
export function calculateModalities(chart: ChartData): ModalityDistribution {
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 }
  let totalWeight = 0

  // Contar planetas por modalidad
  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.name] || 1
    totalWeight += weight

    if (CARDINAL_SIGNS.includes(planet.sign)) {
      modalities.cardinal += weight
    } else if (FIXED_SIGNS.includes(planet.sign)) {
      modalities.fixed += weight
    } else if (MUTABLE_SIGNS.includes(planet.sign)) {
      modalities.mutable += weight
    }
  }

  // Añadir peso del Ascendente
  if (chart.ascendant) {
    const ascWeight = 3
    totalWeight += ascWeight

    if (CARDINAL_SIGNS.includes(chart.ascendant)) {
      modalities.cardinal += ascWeight
    } else if (FIXED_SIGNS.includes(chart.ascendant)) {
      modalities.fixed += ascWeight
    } else if (MUTABLE_SIGNS.includes(chart.ascendant)) {
      modalities.mutable += ascWeight
    }
  }

  // Convertir a porcentajes
  if (totalWeight > 0) {
    return {
      cardinal: Math.round((modalities.cardinal / totalWeight) * 100),
      fixed: Math.round((modalities.fixed / totalWeight) * 100),
      mutable: Math.round((modalities.mutable / totalWeight) * 100)
    }
  }

  return { cardinal: 33, fixed: 33, mutable: 34 }
}

// ============================================
// FUNCIONES AUXILIARES PARA CÁLCULOS MEJORADOS
// ============================================

/**
 * Calcula la fuerza de un planeta basado en dignidades y casa
 */
function getPlanetStrength(chart: ChartData, planetName: string): number {
  let strength = 5 // base (0-10)
  
  const planet = chart.planets.find(p => 
    p.name.toLowerCase() === planetName.toLowerCase()
  )
  if (!planet) return 5
  
  // Tabla de dignidades (simplificada)
  const dignities: Record<string, any> = {
    'júpiter': { 
      domicile: ['Sagitario', 'Piscis'], 
      exaltation: 'Cáncer',
      detriment: ['Géminis', 'Virgo'],
      fall: 'Capricornio'
    },
    'neptuno': {
      domicile: 'Piscis',
      exaltation: 'Leo',
      detriment: 'Virgo',
      fall: 'Acuario'
    },
    'venus': {
      domicile: ['Tauro', 'Libra'],
      exaltation: 'Piscis',
      detriment: ['Escorpio', 'Aries'],
      fall: 'Virgo'
    },
    'saturno': {
      domicile: ['Capricornio', 'Acuario'],
      exaltation: 'Libra',
      detriment: ['Cáncer', 'Leo'],
      fall: 'Aries'
    },
    'marte': {
      domicile: ['Aries', 'Escorpio'],
      exaltation: 'Capricornio',
      detriment: ['Libra', 'Tauro'],
      fall: 'Cáncer'
    },
    'mercurio': {
      domicile: ['Géminis', 'Virgo'],
      exaltation: 'Virgo',
      detriment: ['Sagitario', 'Piscis'],
      fall: 'Piscis'
    },
    'sol': {
      domicile: 'Leo',
      exaltation: 'Aries',
      detriment: 'Acuario',
      fall: 'Libra'
    },
    'luna': {
      domicile: 'Cáncer',
      exaltation: 'Tauro',
      detriment: 'Capricornio',
      fall: 'Escorpio'
    }
  }
  
  const planetDignities = dignities[planetName.toLowerCase()]
  if (!planetDignities) return strength
  
  const sign = planet.sign
  
  // Domicilio: +2
  if (Array.isArray(planetDignities.domicile)) {
    if (planetDignities.domicile.includes(sign)) strength += 2
  } else if (planetDignities.domicile === sign) {
    strength += 2
  }
  
  // Exaltación: +1
  if (planetDignities.exaltation === sign) strength += 1
  
  // Detrimento: -1
  if (Array.isArray(planetDignities.detriment)) {
    if (planetDignities.detriment.includes(sign)) strength -= 1
  } else if (planetDignities.detriment === sign) {
    strength -= 1
  }
  
  // Caída: -2
  if (planetDignities.fall === sign) strength -= 2
  
  // Casa angular (1, 4, 7, 10): +1
  if (planet.house && [1, 4, 7, 10].includes(planet.house)) {
    strength += 1
  }
  
  return Math.min(10, Math.max(0, strength))
}

/**
 * Obtiene los planetas que forman un stellium en un signo específico
 */
function getStelliumPlanets(chart: ChartData, sign: string): string[] {
  const planetsInSign = chart.planets.filter(p => 
    p.sign.toLowerCase() === sign.toLowerCase()
  )
  
  // Stellium = 3+ planetas
  return planetsInSign.length >= 3 ? planetsInSign.map(p => p.name) : []
}

/**
 * Verifica si hay un stellium en Sagitario
 */
function hasStelliumInSagittarius(chart: ChartData): boolean {
  return getStelliumPlanets(chart, 'Sagitario').length >= 3
}

/**
 * Verifica si hay planetas en una casa específica
 */
function hasPlanetsInHouse(chart: ChartData, house: number): boolean {
  return chart.planets.some(p => p.house === house)
}

/**
 * Verifica si un planeta específico está en una casa
 */
function hasPlanetInHouse(chart: ChartData, planetName: string, house: number): boolean {
  return chart.planets.some(p => 
    p.name.toLowerCase() === planetName.toLowerCase() && p.house === house
  )
}

/**
 * Cuenta los aspectos tensos (cuadraturas y oposiciones) a un planeta
 */
function getTenseAspects(chart: ChartData, planetName: string): number {
  if (!chart.aspects) return 0
  
  return chart.aspects.filter(aspect => {
    // Validar que planet1 y planet2 existan
    if (!aspect.planet1 || !aspect.planet2) return false
    
    const isTense = ['square', 'opposition'].includes(aspect.type)
    const involvesPlanet = 
      aspect.planet1.toLowerCase() === planetName.toLowerCase() || 
      aspect.planet2.toLowerCase() === planetName.toLowerCase()
    
    return isTense && involvesPlanet
  }).length
}

// ============================================
// CÁLCULOS MEJORADOS DE TODOS LOS STATS
// ============================================

/**
 * Calcula Intuición Mental/Filosófica (patrones, significados profundos)
 */
function calculateMentalIntuition(chart: ChartData): number {
  let intuition = 5 // base
  
  // Júpiter fuerte (filosofía, expansión mental)
  const jupiterStrength = getPlanetStrength(chart, 'Júpiter')
  intuition += (jupiterStrength / 10) * 1.2
  
  // Stellium en Sagitario = intuición filosófica
  if (hasStelliumInSagittarius(chart)) {
    const stelliumPlanets = getStelliumPlanets(chart, 'Sagitario')
    intuition += Math.min(3, stelliumPlanets.length * 0.8)
  }
  
  // Neptuno fuerte = intuición espiritual/mental
  const neptuneStrength = getPlanetStrength(chart, 'Neptuno')
  intuition += (neptuneStrength / 10) * 0.8
  
  // Casa 9 (filosofía, sabiduría superior)
  if (hasPlanetsInHouse(chart, 9)) intuition += 0.3
  
  return Math.min(10, Math.max(1, Math.round(intuition * 10) / 10))
}

/**
 * Calcula Intuición Emocional/Empática (sentir emociones ajenas, empatía)
 */
function calculateEmotionalIntuition(chart: ChartData): number {
  let intuition = 5 // base
  
  // Agua (CRÍTICO para intuición emocional)
  const waterPercentage = calculateElements(chart).water
  intuition += (waterPercentage / 100) * 3 // Agua tiene MUCHO peso aquí
  
  // Luna fuerte (emociones)
  const moonStrength = getPlanetStrength(chart, 'Luna')
  intuition += (moonStrength / 10) * 1.5
  
  // Neptuno (sensibilidad, empatía)
  const neptuneStrength = getPlanetStrength(chart, 'Neptuno')
  intuition += (neptuneStrength / 10) * 0.5
  
  // Casa 12 (inconsciente, empatía profunda)
  if (hasPlanetsInHouse(chart, 12)) intuition += 0.5
  
  return Math.min(10, Math.max(1, Math.round(intuition * 10) / 10))
}

/**
 * Calcula WIS (Sabiduría/Intuición) mejorado - promedio de mental y emocional
 */
function calculateWisdom(chart: ChartData): number {
  const mental = calculateMentalIntuition(chart)
  const emotional = calculateEmotionalIntuition(chart)
  // Promedio simple
  return Math.round(((mental + emotional) / 2) * 10) / 10
}

/**
 * Calcula Magnetismo Personal (1 a 1, relaciones cercanas)
 */
function calculatePersonalCharisma(chart: ChartData): number {
  let charisma = 5 // base
  
  // Venus fuerte (encanto, atractivo personal)
  const venusStrength = getPlanetStrength(chart, 'Venus')
  charisma += (venusStrength / 10) * 1.5
  
  // Luna en Leo (magnetismo emocional)
  const moon = chart.planets.find(p => p.name === 'Luna')
  if (moon?.sign === 'Leo') charisma += 2
  
  // Sol fuerte (presencia, confianza)
  const sunStrength = getPlanetStrength(chart, 'Sol')
  charisma += (sunStrength / 10) * 1
  
  // Casa 5 (expresión creativa, romance)
  if (hasPlanetsInHouse(chart, 5)) charisma += 1
  
  // Casa 7 (relaciones, pareja)
  if (hasPlanetsInHouse(chart, 7)) charisma += 0.5
  
  // Aspectos armónicos a Venus/Luna (facilidad expresiva)
  if (chart.aspects) {
    const venusHarmonious = chart.aspects.filter(aspect => {
      if (!aspect.planet1 || !aspect.planet2) return false
      const isHarmonious = ['trine', 'sextile'].includes(aspect.type)
      const involvesVenus = 
        aspect.planet1.toLowerCase() === 'venus' || 
        aspect.planet2.toLowerCase() === 'venus'
      return isHarmonious && involvesVenus
    }).length
    charisma += venusHarmonious * 0.2
  }
  
  // Aspectos tensos a Venus/Luna (dificultad expresiva) - menos impacto en personal
  const venusTenseAspects = getTenseAspects(chart, 'Venus')
  const moonTenseAspects = getTenseAspects(chart, 'Luna')
  charisma -= (venusTenseAspects + moonTenseAspects) * 0.2
  
  return Math.min(10, Math.max(1, Math.round(charisma * 10) / 10))
}

/**
 * Calcula Magnetismo Grupal (en grupos, situaciones sociales)
 */
function calculateGroupCharisma(chart: ChartData): number {
  let charisma = 5 // base
  
  // Venus fuerte (encanto general)
  const venusStrength = getPlanetStrength(chart, 'Venus')
  charisma += (venusStrength / 10) * 1
  
  // Sol fuerte (presencia, liderazgo)
  const sunStrength = getPlanetStrength(chart, 'Sol')
  charisma += (sunStrength / 10) * 0.8
  
  // Ascendente (primera impresión en grupos)
  if (chart.ascendant) {
    const ascSign = chart.ascendant
    if (['Leo', 'Libra', 'Sagitario'].includes(ascSign)) charisma += 1
    if (['Virgo', 'Capricornio'].includes(ascSign)) charisma -= 0.5
    // Géminis puede reducir en grupos (más individual)
    if (ascSign === 'Géminis') charisma -= 0.5
  }
  
  // Casa 10 (visibilidad pública)
  if (hasPlanetsInHouse(chart, 10)) charisma += 0.8
  
  // REDUCIR por inhibiciones sociales (más impacto en grupos):
  
  // Saturno en 1ª casa (inhibición social)
  if (hasPlanetInHouse(chart, 'Saturno', 1)) charisma -= 2
  
  // Planetas en 12ª casa (timidez, ocultación) - solo si hay 2+
  const planetsIn12 = chart.planets.filter(p => p.house === 12).length
  if (planetsIn12 >= 2) charisma -= 1.5
  
  // Baja agua = menos conexión emocional en grupos
  const waterPercentage = calculateElements(chart).water
  if (waterPercentage < 20) charisma -= 0.5
  
  // Mucho aire puede reducir conexión grupal (más intelectual)
  const airPercentage = calculateElements(chart).air
  if (airPercentage > 50) charisma -= 0.5
  
  // Aspectos tensos a Venus/Luna (dificultad expresiva en grupos)
  const venusTenseAspects = getTenseAspects(chart, 'Venus')
  const moonTenseAspects = getTenseAspects(chart, 'Luna')
  charisma -= (venusTenseAspects + moonTenseAspects) * 0.4
  
  return Math.min(10, Math.max(1, Math.round(charisma * 10) / 10))
}

/**
 * Calcula CHA (Carisma/Magnetismo) mejorado - promedio de personal y grupal
 */
function calculateCharisma(chart: ChartData): number {
  const personal = calculatePersonalCharisma(chart)
  const group = calculateGroupCharisma(chart)
  // Promedio simple
  return Math.round(((personal + group) / 2) * 10) / 10
}

/**
 * Calcula INT (Intelecto) mejorado
 */
function calculateIntellect(chart: ChartData): number {
  let intellect = 5 // base
  
  // Mercurio fuerte (comunicación, pensamiento)
  const mercuryStrength = getPlanetStrength(chart, 'Mercurio')
  intellect += (mercuryStrength / 10) * 1.5
  
  // Casa 3 (comunicación, aprendizaje)
  if (hasPlanetsInHouse(chart, 3)) intellect += 0.8
  
  // Casa 9 (sabiduría superior, filosofía) - también ayuda al intelecto
  if (hasPlanetsInHouse(chart, 9)) intellect += 0.5
  
  // Ascendente en Aire (comunicación natural)
  if (chart.ascendant && AIR_SIGNS.includes(chart.ascendant)) {
    intellect += 1
  }
  
  // Planetas en signos de Aire (comunicación, objetividad)
  const airPlanets = chart.planets.filter(p => AIR_SIGNS.includes(p.sign)).length
  intellect += Math.min(1.5, airPlanets * 0.3)
  
  // Aspectos armónicos a Mercurio (facilidad comunicativa)
  if (chart.aspects) {
    const mercuryHarmonious = chart.aspects.filter(aspect => {
      if (!aspect.planet1 || !aspect.planet2) return false
      const isHarmonious = ['trine', 'sextile'].includes(aspect.type)
      const involvesMercury = 
        aspect.planet1.toLowerCase() === 'mercurio' || 
        aspect.planet2.toLowerCase() === 'mercurio'
      return isHarmonious && involvesMercury
    }).length
    intellect += mercuryHarmonious * 0.2
  }
  
  // Aspectos tensos a Mercurio (dificultad expresiva)
  const mercuryTenseAspects = getTenseAspects(chart, 'Mercurio')
  intellect -= mercuryTenseAspects * 0.3
  
  return Math.min(10, Math.max(1, Math.round(intellect * 10) / 10))
}

/**
 * Calcula STR (Fuerza/Acción) mejorado
 */
function calculateStrength(chart: ChartData): number {
  let strength = 5 // base
  
  // Marte fuerte (acción, impulso)
  const marsStrength = getPlanetStrength(chart, 'Marte')
  strength += (marsStrength / 10) * 1.5
  
  // Casa 1 (identidad, acción personal)
  if (hasPlanetsInHouse(chart, 1)) strength += 0.8
  
  // Casa 10 (carrera, ambición) - también aporta fuerza
  if (hasPlanetsInHouse(chart, 10)) strength += 0.5
  
  // Ascendente en Fuego (energía natural)
  if (chart.ascendant && FIRE_SIGNS.includes(chart.ascendant)) {
    strength += 1
  }
  
  // Planetas en signos de Fuego (energía, pasión)
  const firePlanets = chart.planets.filter(p => FIRE_SIGNS.includes(p.sign)).length
  strength += Math.min(1.5, firePlanets * 0.3)
  
  // Sol fuerte (vitalidad, confianza)
  const sunStrength = getPlanetStrength(chart, 'Sol')
  strength += (sunStrength / 10) * 0.5
  
  // Aspectos armónicos a Marte (facilidad de acción)
  if (chart.aspects) {
    const marsHarmonious = chart.aspects.filter(aspect => {
      if (!aspect.planet1 || !aspect.planet2) return false
      const isHarmonious = ['trine', 'sextile'].includes(aspect.type)
      const involvesMars = 
        aspect.planet1.toLowerCase() === 'marte' || 
        aspect.planet2.toLowerCase() === 'marte'
      return isHarmonious && involvesMars
    }).length
    strength += marsHarmonious * 0.2
  }
  
  // Aspectos tensos a Marte (bloqueos de acción)
  const marsTenseAspects = getTenseAspects(chart, 'Marte')
  strength -= marsTenseAspects * 0.3
  
  // Saturno en 1ª casa puede reducir impulso (pero no tanto como en CHA)
  if (hasPlanetInHouse(chart, 'Saturno', 1)) strength -= 0.5
  
  return Math.min(10, Math.max(1, Math.round(strength * 10) / 10))
}

/**
 * Calcula DEX (Agilidad/Adaptabilidad) mejorado
 */
function calculateDexterity(chart: ChartData): number {
  let dexterity = 5 // base
  
  // Ascendente (primera impresión, adaptabilidad)
  if (chart.ascendant) {
    dexterity += 1.5
    
    // Signos mutables (adaptabilidad natural)
    if (MUTABLE_SIGNS.includes(chart.ascendant)) {
      dexterity += 1.5
    }
    
    // Signos de Aire (flexibilidad mental)
    if (AIR_SIGNS.includes(chart.ascendant)) {
      dexterity += 1
    }
  }
  
  // Mercurio fuerte (agilidad mental)
  const mercuryStrength = getPlanetStrength(chart, 'Mercurio')
  dexterity += (mercuryStrength / 10) * 0.8
  
  // Casa 3 (comunicación, adaptabilidad)
  if (hasPlanetsInHouse(chart, 3)) dexterity += 0.5
  
  // Planetas en signos mutables (adaptabilidad)
  const mutablePlanets = chart.planets.filter(p => MUTABLE_SIGNS.includes(p.sign)).length
  dexterity += Math.min(1.5, mutablePlanets * 0.3)
  
  // Planetas en signos de Aire (flexibilidad)
  const airPlanets = chart.planets.filter(p => AIR_SIGNS.includes(p.sign)).length
  dexterity += Math.min(1, airPlanets * 0.2)
  
  // Aspectos armónicos múltiples (facilidad de cambio)
  if (chart.aspects) {
    const harmoniousAspects = chart.aspects.filter(a => 
      ['trine', 'sextile'].includes(a.type)
    ).length
    dexterity += Math.min(1, harmoniousAspects * 0.1)
  }
  
  // Muchos aspectos tensos pueden reducir adaptabilidad
  if (chart.aspects) {
    const tenseAspects = chart.aspects.filter(a => 
      ['square', 'opposition'].includes(a.type)
    ).length
    if (tenseAspects >= 5) dexterity -= 0.5
  }
  
  return Math.min(10, Math.max(1, Math.round(dexterity * 10) / 10))
}

/**
 * Calcula CON (Constitución/Resistencia) mejorado
 */
function calculateConstitution(chart: ChartData): number {
  let constitution = 5 // base
  
  // Saturno fuerte (estructura, disciplina)
  const saturnStrength = getPlanetStrength(chart, 'Saturno')
  constitution += (saturnStrength / 10) * 1.5
  
  // Casa 4 (raíces, estabilidad)
  if (hasPlanetsInHouse(chart, 4)) constitution += 0.5
  
  // Casa 10 (estructura, responsabilidad)
  if (hasPlanetsInHouse(chart, 10)) constitution += 0.8
  
  // Ascendente en Tierra (estabilidad natural)
  if (chart.ascendant && EARTH_SIGNS.includes(chart.ascendant)) {
    constitution += 1
  }
  
  // Planetas en signos de Tierra (practicidad, estructura)
  const earthPlanets = chart.planets.filter(p => EARTH_SIGNS.includes(p.sign)).length
  constitution += Math.min(1.5, earthPlanets * 0.3)
  
  // Aspectos armónicos a Saturno (facilidad de estructura)
  if (chart.aspects) {
    const saturnHarmonious = chart.aspects.filter(aspect => {
      if (!aspect.planet1 || !aspect.planet2) return false
      const isHarmonious = ['trine', 'sextile'].includes(aspect.type)
      const involvesSaturn = 
        aspect.planet1.toLowerCase() === 'saturno' || 
        aspect.planet2.toLowerCase() === 'saturno'
      return isHarmonious && involvesSaturn
    }).length
    constitution += saturnHarmonious * 0.2
  }
  
  // Aspectos tensos a Saturno (dificultad de estructura)
  const saturnTenseAspects = getTenseAspects(chart, 'Saturno')
  constitution -= saturnTenseAspects * 0.3
  
  // Muchos planetas en signos mutables pueden reducir estabilidad
  const mutablePlanets = chart.planets.filter(p => MUTABLE_SIGNS.includes(p.sign)).length
  if (mutablePlanets >= 5) constitution -= 0.5
  
  return Math.min(10, Math.max(1, Math.round(constitution * 10) / 10))
}

// Función para calcular stats RPG
export function calculateRPGStats(chart: ChartData): RPGStats {
  const stats: RPGStats = {
    INT: 5,  // Base neutral
    WIS: 5,
    CHA: 5,
    STR: 5,
    DEX: 5,
    CON: 5
  }

  // INT (Intelecto) - Cálculo mejorado
  stats.INT = calculateIntellect(chart)

  // WIS (Sabiduría/Intuición) - Cálculo mejorado (promedio de mental y emocional)
  stats.WIS = calculateWisdom(chart)
  stats.mentalIntuition = calculateMentalIntuition(chart)
  stats.emotionalIntuition = calculateEmotionalIntuition(chart)

  // CHA (Carisma/Magnetismo) - Cálculo mejorado (promedio de personal y grupal)
  stats.CHA = calculateCharisma(chart)
  stats.personalCharisma = calculatePersonalCharisma(chart)
  stats.groupCharisma = calculateGroupCharisma(chart)

  // STR (Fuerza/Acción) - Cálculo mejorado
  stats.STR = calculateStrength(chart)

  // DEX (Agilidad/Adaptabilidad) - Cálculo mejorado
  stats.DEX = calculateDexterity(chart)

  // CON (Constitución/Resistencia) - Cálculo mejorado
  stats.CON = calculateConstitution(chart)

  // Normalizar a 0-10
  return {
    INT: Math.max(0, Math.min(10, Math.round(stats.INT * 10) / 10)),
    WIS: Math.max(0, Math.min(10, Math.round(stats.WIS * 10) / 10)),
    CHA: Math.max(0, Math.min(10, Math.round(stats.CHA * 10) / 10)),
    STR: Math.max(0, Math.min(10, Math.round(stats.STR * 10) / 10)),
    DEX: Math.max(0, Math.min(10, Math.round(stats.DEX * 10) / 10)),
    CON: Math.max(0, Math.min(10, Math.round(stats.CON * 10) / 10)),
    mentalIntuition: Math.max(0, Math.min(10, Math.round(stats.mentalIntuition! * 10) / 10)),
    emotionalIntuition: Math.max(0, Math.min(10, Math.round(stats.emotionalIntuition! * 10) / 10)),
    personalCharisma: Math.max(0, Math.min(10, Math.round(stats.personalCharisma! * 10) / 10)),
    groupCharisma: Math.max(0, Math.min(10, Math.round(stats.groupCharisma! * 10) / 10))
  }
}

// Función para calcular datos del radar
export function calculateRadarData(chart: ChartData): RadarData {
  const labels = [
    'Comunicación',
    'Emoción',
    'Estructura',
    'Creatividad',
    'Espiritualidad',
    'Relaciones',
    'Acción',
    'Expansión'
  ]

  const values = [5, 5, 5, 5, 5, 5, 5, 5] // Base neutral

  // Comunicación (Mercurio, Géminis, 3ª casa)
  const mercury = chart.planets.find(p => p.name === 'Mercurio')
  if (mercury) {
    values[0] += 3
    if (mercury.sign === 'Géminis') values[0] += 2
    if (mercury.house === 3) values[0] += 1
  }
  const geminiPlanets = chart.planets.filter(p => p.sign === 'Géminis').length
  values[0] += geminiPlanets * 0.5

  // Emoción (Luna, Cáncer, 4ª casa)
  const moon = chart.planets.find(p => p.name === 'Luna')
  if (moon) {
    values[1] += 3
    if (moon.sign === 'Cáncer') values[1] += 2
    if (moon.house === 4) values[1] += 1
  }
  const cancerPlanets = chart.planets.filter(p => p.sign === 'Cáncer').length
  values[1] += cancerPlanets * 0.5

  // Estructura (Saturno, Capricornio, 10ª casa)
  const saturn = chart.planets.find(p => p.name === 'Saturno')
  if (saturn) {
    values[2] += 3
    if (saturn.sign === 'Capricornio') values[2] += 2
    if (saturn.house === 10) values[2] += 1
  }
  const capricornPlanets = chart.planets.filter(p => p.sign === 'Capricornio').length
  values[2] += capricornPlanets * 0.5

  // Creatividad (Venus, Leo, 5ª casa)
  const venus = chart.planets.find(p => p.name === 'Venus')
  if (venus) {
    values[3] += 3
    if (venus.sign === 'Leo') values[3] += 2
    if (venus.house === 5) values[3] += 1
  }
  const leoPlanets = chart.planets.filter(p => p.sign === 'Leo').length
  values[3] += leoPlanets * 0.5

  // Espiritualidad (Neptuno, Piscis, 12ª casa)
  const neptune = chart.planets.find(p => p.name === 'Neptuno')
  if (neptune) {
    values[4] += 3
    if (neptune.sign === 'Piscis') values[4] += 2
    if (neptune.house === 12) values[4] += 1
  }
  const piscesPlanets = chart.planets.filter(p => p.sign === 'Piscis').length
  values[4] += piscesPlanets * 0.5

  // Relaciones (Venus, Libra, 7ª casa)
  if (venus) {
    values[5] += 2
    if (venus.sign === 'Libra') values[5] += 2
    if (venus.house === 7) values[5] += 1
  }
  const libraPlanets = chart.planets.filter(p => p.sign === 'Libra').length
  values[5] += libraPlanets * 0.5

  // Acción (Marte, Aries, 1ª casa)
  const mars = chart.planets.find(p => p.name === 'Marte')
  if (mars) {
    values[6] += 3
    if (mars.sign === 'Aries') values[6] += 2
    if (mars.house === 1) values[6] += 1
  }
  const ariesPlanets = chart.planets.filter(p => p.sign === 'Aries').length
  values[6] += ariesPlanets * 0.5

  // Expansión (Júpiter, Sagitario, 9ª casa)
  const jupiter = chart.planets.find(p => p.name === 'Júpiter')
  if (jupiter) {
    values[7] += 3
    if (jupiter.sign === 'Sagitario') values[7] += 2
    if (jupiter.house === 9) values[7] += 1
  }
  const sagittariusPlanets = chart.planets.filter(p => p.sign === 'Sagitario').length
  values[7] += sagittariusPlanets * 0.5

  // Normalizar a 0-10
  return {
    labels,
    values: values.map(v => Math.max(0, Math.min(10, Math.round(v * 10) / 10)))
  }
}

// Función para detectar badges/logros
export function calculateBadges(chart: ChartData): Badge[] {
  const badges: Badge[] = []

  // Stellium (3+ planetas en mismo signo)
  const signCounts: Record<string, number> = {}
  for (const planet of chart.planets) {
    signCounts[planet.sign] = (signCounts[planet.sign] || 0) + 1
  }
  for (const [sign, count] of Object.entries(signCounts)) {
    if (count >= 3) {
      badges.push({
        icon: '🏆',
        title: `Stellium en ${sign}`,
        description: `${count} planetas concentrados. Energía intensa en este área.`,
        color: 'yellow'
      })
    }
  }

  // Ascendente por elemento
  if (chart.ascendant) {
    if (FIRE_SIGNS.includes(chart.ascendant)) {
      badges.push({
        icon: '🔥',
        title: 'Ascendente Fuego',
        description: 'Energía y pasión. Proyección dinámica.',
        color: 'red'
      })
    } else if (EARTH_SIGNS.includes(chart.ascendant)) {
      badges.push({
        icon: '🌍',
        title: 'Ascendente Tierra',
        description: 'Estabilidad y practicidad. Presencia sólida.',
        color: 'green'
      })
    } else if (AIR_SIGNS.includes(chart.ascendant)) {
      badges.push({
        icon: '⚡',
        title: 'Ascendente Aire',
        description: 'Mente tecnológica. Comunicación y adaptabilidad.',
        color: 'blue'
      })
    } else if (WATER_SIGNS.includes(chart.ascendant)) {
      badges.push({
        icon: '💧',
        title: 'Ascendente Agua',
        description: 'Sensibilidad y empatía. Conexión emocional profunda.',
        color: 'purple'
      })
    }
  }

  // Sol y Luna en mismo elemento
  const sun = chart.planets.find(p => p.name === 'Sol')
  const moon = chart.planets.find(p => p.name === 'Luna')
  if (sun && moon) {
    const sunElement = getElement(sun.sign)
    const moonElement = getElement(moon.sign)
    if (sunElement === moonElement) {
      badges.push({
        icon: '☀️🌙',
        title: 'Sol-Luna Alineados',
        description: `Ambos en ${sunElement}. Armonía entre razón y emoción.`,
        color: 'orange'
      })
    }
  }

  // Dominancia de elemento
  const elements = calculateElements(chart)
  const maxElement = Object.entries(elements).reduce((a, b) => elements[a[0] as keyof ElementDistribution] > elements[b[0] as keyof ElementDistribution] ? a : b)
  if (maxElement[1] >= 50) {
    const elementNames = { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua' }
    const elementEmojis = { fire: '🔥', earth: '🌍', air: '💨', water: '💧' }
    if (maxElement[1] >= 60) {
      badges.push({
        icon: elementEmojis[maxElement[0] as keyof typeof elementEmojis] || '⭐',
        title: `Dominancia Extrema ${elementNames[maxElement[0] as keyof typeof elementNames]}`,
        description: `${maxElement[1]}% de ${elementNames[maxElement[0] as keyof typeof elementNames]}. Personalidad muy definida en este aspecto.`,
        color: 'indigo'
      })
    } else {
      badges.push({
        icon: '⭐',
        title: `Dominancia ${elementNames[maxElement[0] as keyof typeof elementNames]}`,
        description: `${maxElement[1]}% de ${elementNames[maxElement[0] as keyof typeof elementNames]}. Personalidad definida.`,
        color: 'indigo'
      })
    }
  }

  // Aspectos importantes
  if (chart.aspects && chart.aspects.length > 0) {
    const exactAspects = chart.aspects.filter(a => a.orb < 1)
    if (exactAspects.length >= 3) {
      badges.push({
        icon: '✨',
        title: 'Aspectos Exactos',
        description: `${exactAspects.length} aspectos muy precisos. Energía concentrada.`,
        color: 'pink'
      })
    }
  }

  // Déficit de Agua (desarrollo emocional)
  if (elements.water < 20) {
    badges.push({
      icon: '🌊',
      title: 'Déficit Agua',
      description: `Solo ${elements.water}% de agua. Oportunidad de desarrollar sensibilidad emocional y conexión profunda.`,
      color: 'cyan'
    })
  }

  // Luna en Fuego (creatividad emocional)
  if (moon && FIRE_SIGNS.includes(moon.sign)) {
    badges.push({
      icon: '🔥🌙',
      title: 'Luna en Fuego',
      description: `Luna en ${moon.sign}. Emociones apasionadas y creatividad emocional intensa.`,
      color: 'orange'
    })
  }

  // Déficit de Fuego (energía)
  if (elements.fire < 15) {
    badges.push({
      icon: '⚡',
      title: 'Baja Energía Fuego',
      description: `Solo ${elements.fire}% de fuego. Oportunidad de cultivar más pasión y acción.`,
      color: 'red'
    })
  }

  // Déficit de Tierra (practicidad)
  if (elements.earth < 15) {
    badges.push({
      icon: '🌱',
      title: 'Baja Practicidad',
      description: `Solo ${elements.earth}% de tierra. Oportunidad de desarrollar más estructura y organización.`,
      color: 'green'
    })
  }

  // Déficit de Aire (comunicación)
  if (elements.air < 15) {
    badges.push({
      icon: '💭',
      title: 'Baja Comunicación',
      description: `Solo ${elements.air}% de aire. Oportunidad de expandir diálogo y objetividad.`,
      color: 'blue'
    })
  }

  return badges
}

// Función auxiliar para obtener elemento de un signo
function getElement(sign: string): string {
  if (FIRE_SIGNS.includes(sign)) return 'Fuego'
  if (EARTH_SIGNS.includes(sign)) return 'Tierra'
  if (AIR_SIGNS.includes(sign)) return 'Aire'
  if (WATER_SIGNS.includes(sign)) return 'Agua'
  return 'Desconocido'
}

// Función para calcular fortalezas y áreas de crecimiento (tono constructivo)
export function calculateStrengthsWeaknesses(chart: ChartData): {
  strengths: string[]
  weaknesses: string[]
} {
  const strengths: string[] = []
  const weaknesses: string[] = []

  const stats = calculateRPGStats(chart)
  const elements = calculateElements(chart)

  // Fortalezas basadas en stats altos
  if (stats.INT >= 7) strengths.push('Comunicación clara y análisis profundo')
  if (stats.WIS >= 7) strengths.push('Sabiduría y comprensión intuitiva')
  if (stats.CHA >= 7) strengths.push('Carisma y capacidad de conexión')
  if (stats.STR >= 7) strengths.push('Determinación y capacidad de acción')
  if (stats.DEX >= 7) strengths.push('Agilidad mental y adaptabilidad')
  if (stats.CON >= 7) strengths.push('Resistencia y disciplina')

  // Fortalezas basadas en elementos
  if (elements.fire >= 40) strengths.push('Energía y pasión intensas')
  if (elements.earth >= 40) strengths.push('Practicidad y estabilidad')
  if (elements.air >= 40) strengths.push('Comunicación y mentalidad abierta')
  if (elements.water >= 40) strengths.push('Sensibilidad y empatía profunda')

  // Áreas de crecimiento basadas en stats (tono constructivo)
  if (stats.INT < 4) {
    weaknesses.push('Oportunidad de desarrollar comunicación más clara. Practica expresar ideas complejas de forma simple.')
  }
  if (stats.WIS < 4) {
    weaknesses.push('Espacio para cultivar más intuición. Meditación y reflexión pueden ayudarte a conectar con tu sabiduría interior.')
  }
  if (stats.CHA < 4) {
    weaknesses.push('Potencial para desarrollar más carisma. Trabaja en la autenticidad y conexión genuina con otros.')
  }
  if (stats.STR < 4) {
    weaknesses.push('Oportunidad de fortalecer la determinación. Establece metas pequeñas y celebra cada logro.')
  }
  if (stats.DEX < 4) {
    weaknesses.push('Espacio para mejorar la adaptabilidad. Practica aceptar cambios y verlos como oportunidades.')
  }
  if (stats.CON < 4) {
    weaknesses.push('Potencial para desarrollar más estructura. Rutinas y disciplina pueden ayudarte a alcanzar tus objetivos.')
  }

  // Áreas de crecimiento basadas en desequilibrios (específicas y constructivas)
  if (elements.fire < 15) {
    weaknesses.push(`Desarrollo de energía y pasión (${elements.fire}% fuego). Incorpora actividades físicas y proyectos que te entusiasmen para equilibrar tu energía.`)
  }
  if (elements.earth < 15) {
    weaknesses.push(`Cultivo de practicidad y estabilidad (${elements.earth}% tierra). Establece rutinas y objetivos concretos para anclar tus ideas.`)
  }
  if (elements.air < 15) {
    weaknesses.push(`Expansión de comunicación y objetividad (${elements.air}% aire). Practica el diálogo abierto y la consideración de múltiples perspectivas.`)
  }
  if (elements.water < 15) {
    const waterPercent = elements.water
    weaknesses.push(`Desarrollo emocional y sensibilidad (${waterPercent}% agua). Explora tu mundo emocional a través de arte, música o terapia para conectar más profundamente contigo y otros.`)
  }

  return { strengths, weaknesses }
}

