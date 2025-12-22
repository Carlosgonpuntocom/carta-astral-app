// Tipos para datos de carta astral
export interface BirthData {
  name: string
  date: string  // YYYY-MM-DD
  time: string  // HH:MM
  place: string
  latitude?: number
  longitude?: number
  timezone?: string
}

export interface PlanetPosition {
  name: string
  sign: string
  degree: number
  house?: number
}

export interface Aspect {
  planet1: string
  planet2: string
  type: string  // 'conjunction', 'opposition', 'trine', 'square', 'sextile', etc.
  orb: number   // Orbe del aspecto
}

export interface ChartData {
  birthData: BirthData
  planets: PlanetPosition[]
  ascendant?: string
  midheaven?: string
  aspects?: Aspect[]
  createdAt?: string
}

// Tipos para gestión de múltiples personas
export type RelationshipType = 'familia' | 'pareja' | 'amigo' | 'trabajo' | 'otro'

export interface SavedPerson {
  id: string  // UUID
  isSelf: boolean  // true solo para tu carta
  name: string
  birthData: BirthData
  relationship: RelationshipType
  relationshipDetail?: string  // "Mamá", "Hermano", "Novia", etc.
  notes?: string
  favorite?: boolean
  timeIsApproximate?: boolean  // true si la hora de nacimiento es aproximada/no real
  chartData?: ChartData  // Carta calculada (opcional, se puede calcular on-demand)
  createdAt: string
  updatedAt: string
}

// Tipos para tránsitos
export type TransitAspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile'

export interface Transit {
  id: string
  transitingPlanet: string  // Planeta que transita (en español)
  transitingPosition: {
    sign: string
    degree: number
    longitude: number  // Grados absolutos (0-360)
  }
  natalPoint: string  // Planeta o punto natal (ej: "Sol", "Ascendente")
  natalPosition: {
    sign: string
    degree: number
    longitude: number  // Grados absolutos (0-360)
  }
  aspect: TransitAspectType
  orb: number  // Orbe del aspecto (diferencia en grados)
  isExact: boolean  // Si orbe < 0.5°
  isApplying: boolean  // Si se está acercando (true) o alejando (false)
  strength: number  // Fuerza del tránsito (1-10)
  interpretation: string  // Texto interpretativo
  isTense: boolean  // true si es cuadratura u oposición
  isHarmonious: boolean  // true si es trígono o sextil
}

export interface TransitSummary {
  date: string
  totalTransits: number
  tenseCount: number
  harmoniousCount: number
  conjunctionCount: number
  mostImportant?: Transit
  sunPosition?: { sign: string; degree: number }
  moonPosition?: { sign: string; degree: number }
}

