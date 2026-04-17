import { calculateTotalIntensity, type DayEnergy } from '../astrology/energy-calculator'
import type { Transit, TransitSummary } from '../../types/astrology'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function transitLine(t: Transit): Record<string, unknown> {
  return {
    planeta_transitor: t.transitingPlanet,
    punto_natal: t.natalPoint,
    aspecto: t.aspect,
    fuerza: t.strength,
    orbe: round2(t.orb),
    es_exacto: t.isExact,
    interpretacion: t.interpretation
  }
}

function summaryBlock(s: TransitSummary | null): Record<string, unknown> | null {
  if (!s) return null
  const base: Record<string, unknown> = {
    fecha: s.date,
    total_transitos: s.totalTransits,
    tensos: s.tenseCount,
    armonicos: s.harmoniousCount,
    conjunciones: s.conjunctionCount
  }
  if (s.mostImportant) {
    base.transito_mas_relevante = {
      planeta_transitor: s.mostImportant.transitingPlanet,
      punto_natal: s.mostImportant.natalPoint,
      aspecto: s.mostImportant.aspect,
      fuerza: s.mostImportant.strength
    }
  }
  if (s.sunPosition) base.sol = { signo: s.sunPosition.sign, grado: round2(s.sunPosition.degree) }
  if (s.moonPosition) base.luna = { signo: s.moonPosition.sign, grado: round2(s.moonPosition.degree) }
  return base
}

function energiesBlock(e: DayEnergy): Record<string, number> {
  return {
    accion: round2(e.action),
    mental: round2(e.mental),
    emocional: round2(e.emotional),
    manifestacion: round2(e.manifestation),
    creatividad: round2(e.creativity),
    resistencia: round2(e.resistance)
  }
}

/**
 * Serializa tránsitos del día ya calculados para enviar al modelo (sin inventar datos).
 */
export function transitsToPromptContext(
  transits: Transit[],
  summary: TransitSummary | null,
  energies: DayEnergy
): string {
  const intensidad = calculateTotalIntensity(transits)
  const payload = {
    transitos_activos: transits.map(transitLine),
    resumen_dia: summaryBlock(summary),
    energias_del_dia: energiesBlock(energies),
    intensidad: {
      valor: intensidad.intensity,
      nivel: intensidad.level,
      modo_recomendado: intensidad.recommendedMode
    }
  }
  return JSON.stringify(payload, null, 2)
}
