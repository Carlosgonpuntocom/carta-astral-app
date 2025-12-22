// Sistema de colores consistente para cada planeta/punto astrológico
// Usado en toda la aplicación para mantener coherencia visual

export interface PlanetColor {
  text: string        // Color del texto
  hover: string       // Color al hacer hover
  bg: string          // Color de fondo (opcional)
  border: string      // Color del borde (opcional)
}

export const PLANET_COLORS: Record<string, PlanetColor> = {
  'Sol': {
    text: 'text-yellow-600',
    hover: 'hover:text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  'Luna': {
    text: 'text-slate-500',
    hover: 'hover:text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  },
  'Mercurio': {
    text: 'text-blue-600',
    hover: 'hover:text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  'Venus': {
    text: 'text-pink-600',
    hover: 'hover:text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200'
  },
  'Marte': {
    text: 'text-red-600',
    hover: 'hover:text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  'Júpiter': {
    text: 'text-purple-600',
    hover: 'hover:text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  'Saturno': {
    text: 'text-stone-700',
    hover: 'hover:text-stone-800',
    bg: 'bg-stone-100',
    border: 'border-stone-300'
  },
  'Urano': {
    text: 'text-cyan-600',
    hover: 'hover:text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  'Neptuno': {
    text: 'text-indigo-600',
    hover: 'hover:text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  'Plutón': {
    text: 'text-black',
    hover: 'hover:text-gray-900',
    bg: 'bg-gray-900',
    border: 'border-gray-800'
  },
  'Ascendente': {
    text: 'text-emerald-600',
    hover: 'hover:text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  'Medio Cielo': {
    text: 'text-amber-600',
    hover: 'hover:text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  'MC': {
    text: 'text-amber-600',
    hover: 'hover:text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  'Nodo Norte': {
    text: 'text-teal-600',
    hover: 'hover:text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200'
  },
  'Nodo Sur': {
    text: 'text-slate-600',
    hover: 'hover:text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  },
  'Quirón': {
    text: 'text-rose-600',
    hover: 'hover:text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200'
  },
  'Chiron': {
    text: 'text-rose-600',
    hover: 'hover:text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200'
  },
  'Lilith': {
    text: 'text-fuchsia-600',
    hover: 'hover:text-fuchsia-700',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-200'
  },
  'Sirio': {
    text: 'text-violet-600',
    hover: 'hover:text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200'
  },
  'Sirius': {
    text: 'text-violet-600',
    hover: 'hover:text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200'
  }
}

// Función para obtener los colores de un planeta (con fallback)
export function getPlanetColor(planetName: string): PlanetColor {
  const normalized = planetName.trim()
  return PLANET_COLORS[normalized] || {
    text: 'text-gray-600',
    hover: 'hover:text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  }
}

// Función para obtener solo la clase de texto (más común)
export function getPlanetTextColor(planetName: string): string {
  return getPlanetColor(planetName).text
}

// Función para obtener clases completas para un enlace de planeta
export function getPlanetLinkClasses(planetName: string, className: string = ''): string {
  const colors = getPlanetColor(planetName)
  return `${colors.text} ${colors.hover} font-medium transition-colors ${className}`
}

// ============================================
// COLORES PARA SIGNOS DEL ZODÍACO
// ============================================

export const SIGN_COLORS: Record<string, PlanetColor> = {
  'Aries': {
    text: 'text-red-600',
    hover: 'hover:text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  'Tauro': {
    text: 'text-green-600',
    hover: 'hover:text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  'Géminis': {
    text: 'text-yellow-600',
    hover: 'hover:text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  'Cáncer': {
    text: 'text-slate-600',
    hover: 'hover:text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  },
  'Leo': {
    text: 'text-orange-600',
    hover: 'hover:text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  },
  'Virgo': {
    text: 'text-amber-600',
    hover: 'hover:text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  'Libra': {
    text: 'text-pink-600',
    hover: 'hover:text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200'
  },
  'Escorpio': {
    text: 'text-red-800',
    hover: 'hover:text-red-900',
    bg: 'bg-red-100',
    border: 'border-red-300'
  },
  'Sagitario': {
    text: 'text-purple-600',
    hover: 'hover:text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  'Capricornio': {
    text: 'text-gray-700',
    hover: 'hover:text-gray-800',
    bg: 'bg-gray-100',
    border: 'border-gray-300'
  },
  'Acuario': {
    text: 'text-cyan-600',
    hover: 'hover:text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  'Piscis': {
    text: 'text-indigo-600',
    hover: 'hover:text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  }
}

// Función para obtener colores de un signo
export function getSignColor(signName: string): PlanetColor {
  const normalized = signName.trim()
  return SIGN_COLORS[normalized] || {
    text: 'text-gray-600',
    hover: 'hover:text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  }
}

// Función para obtener solo la clase de texto de un signo
export function getSignTextColor(signName: string): string {
  return getSignColor(signName).text
}

// Función para obtener clases completas para un enlace de signo
export function getSignLinkClasses(signName: string, className: string = ''): string {
  const colors = getSignColor(signName)
  return `${colors.text} ${colors.hover} font-medium transition-colors ${className}`
}

// ============================================
// COLORES PARA CASAS ASTROLÓGICAS
// ============================================

export const HOUSE_COLORS: Record<number, PlanetColor> = {
  1: { // Ascendente - Identidad
    text: 'text-emerald-600',
    hover: 'hover:text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  2: { // Recursos y valores
    text: 'text-green-600',
    hover: 'hover:text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  3: { // Comunicación y hermanos
    text: 'text-blue-600',
    hover: 'hover:text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  4: { // Hogar y familia
    text: 'text-amber-600',
    hover: 'hover:text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  5: { // Creatividad y romance
    text: 'text-pink-600',
    hover: 'hover:text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200'
  },
  6: { // Salud y trabajo
    text: 'text-orange-600',
    hover: 'hover:text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  },
  7: { // Relaciones y pareja
    text: 'text-purple-600',
    hover: 'hover:text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  8: { // Transformación y recursos compartidos
    text: 'text-red-800',
    hover: 'hover:text-red-900',
    bg: 'bg-red-100',
    border: 'border-red-300'
  },
  9: { // Filosofía y viajes
    text: 'text-indigo-600',
    hover: 'hover:text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  10: { // Carrera y vocación (MC)
    text: 'text-amber-600',
    hover: 'hover:text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  11: { // Amistades y grupos
    text: 'text-cyan-600',
    hover: 'hover:text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  12: { // Inconsciente y espiritualidad
    text: 'text-violet-600',
    hover: 'hover:text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200'
  }
}

// Función para obtener colores de una casa
export function getHouseColor(houseNumber: number): PlanetColor {
  if (houseNumber >= 1 && houseNumber <= 12) {
    return HOUSE_COLORS[houseNumber]
  }
  return {
    text: 'text-gray-600',
    hover: 'hover:text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  }
}

// Función para obtener solo la clase de texto de una casa
export function getHouseTextColor(houseNumber: number): string {
  return getHouseColor(houseNumber).text
}

// Función para obtener clases completas para un enlace de casa
export function getHouseLinkClasses(houseNumber: number, className: string = ''): string {
  const colors = getHouseColor(houseNumber)
  return `${colors.text} ${colors.hover} font-medium transition-colors ${className}`
}

