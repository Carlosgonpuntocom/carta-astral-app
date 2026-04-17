import { describe, it, expect } from 'vitest'
import { transitsToPromptContext } from '../../../renderer/lib/ai/transit-prompt-context'
import type { Transit, TransitSummary } from '../../../renderer/types/astrology'
import type { DayEnergy } from '../../../renderer/lib/astrology/energy-calculator'

const sampleTransit: Transit = {
  id: 't1',
  transitingPlanet: 'Marte',
  transitingPosition: { sign: 'Aries', degree: 10, longitude: 10 },
  natalPoint: 'Sol',
  natalPosition: { sign: 'Capricornio', degree: 15, longitude: 285 },
  aspect: 'square',
  orb: 1.2,
  isExact: false,
  isApplying: true,
  strength: 7,
  interpretation: 'Tensión accionable con el núcleo identitario.',
  isTense: true,
  isHarmonious: false
}

const energies: DayEnergy = {
  action: 6.5,
  mental: 5,
  emotional: 4.2,
  manifestation: 5.5,
  creativity: 6,
  resistance: 7
}

describe('transitsToPromptContext', () => {
  it('incluye tránsitos activos, energías e intensidad en JSON limpio', () => {
    const summary: TransitSummary = {
      date: '2026-04-11',
      totalTransits: 1,
      tenseCount: 1,
      harmoniousCount: 0,
      conjunctionCount: 0,
      mostImportant: sampleTransit
    }
    const raw = transitsToPromptContext([sampleTransit], summary, energies)
    const o = JSON.parse(raw) as Record<string, unknown>

    expect(Array.isArray(o.transitos_activos)).toBe(true)
    const first = (o.transitos_activos as Record<string, unknown>[])[0]
    expect(first.planeta_transitor).toBe('Marte')
    expect(first.aspecto).toBe('square')
    expect(first.fuerza).toBe(7)
    expect(typeof first.interpretacion).toBe('string')

    expect(o.energias_del_dia).toMatchObject({
      accion: 6.5,
      mental: 5,
      emocional: 4.2,
      manifestacion: 5.5,
      creatividad: 6,
      resistencia: 7
    })

    expect(o.intensidad).toMatchObject({
      valor: expect.any(Number),
      nivel: expect.any(String),
      modo_recomendado: expect.any(String)
    })

    const res = o.resumen_dia as Record<string, unknown>
    expect(res.fecha).toBe('2026-04-11')
    expect(res.transito_mas_relevante).toMatchObject({
      planeta_transitor: 'Marte',
      aspecto: 'square'
    })
  })

  it('admite resumen nulo sin romper el payload', () => {
    const raw = transitsToPromptContext([], null, energies)
    const o = JSON.parse(raw) as { transitos_activos: unknown[]; resumen_dia: null }
    expect(o.transitos_activos).toEqual([])
    expect(o.resumen_dia).toBeNull()
    expect((o as { intensidad: { valor: number } }).intensidad.valor).toBe(0)
  })
})
