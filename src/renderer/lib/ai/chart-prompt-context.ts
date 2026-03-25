import type { Aspect, BirthData, ChartData, PlanetPosition } from '../../types/astrology'

function birthSummary(b: BirthData): Record<string, unknown> {
  return {
    fecha: b.date,
    hora: b.time,
    lugar: b.place,
    ...(b.latitude !== undefined && b.longitude !== undefined
      ? { latitud: b.latitude, longitud: b.longitude }
      : {})
  }
}

function planetLine(p: PlanetPosition): Record<string, unknown> {
  return {
    nombre: p.name,
    signo: p.sign,
    grado_en_signo: Math.round(p.degree * 100) / 100,
    ...(p.house !== undefined ? { casa: p.house } : {})
  }
}

function aspectLine(a: Aspect): Record<string, unknown> {
  return {
    entre: [a.planet1, a.planet2],
    tipo: a.type,
    orbe: Math.round(a.orb * 100) / 100
  }
}

/**
 * Serializa la carta ya calculada para enviarla al modelo (sin inventar datos).
 */
export function chartDataToPromptContext(chart: ChartData): string {
  const payload = {
    nacimiento: birthSummary(chart.birthData),
    ascendente: chart.ascendant ?? null,
    medio_cielo: chart.midheaven ?? null,
    planetas: chart.planets.map(planetLine),
    aspectos: chart.aspects?.length ? chart.aspects.map(aspectLine) : []
  }
  return JSON.stringify(payload, null, 2)
}
