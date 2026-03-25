import { describe, it, expect } from 'vitest'
import { chartDataToPromptContext } from '../../../renderer/lib/ai/chart-prompt-context'
import type { ChartData } from '../../../renderer/types/astrology'

describe('chartDataToPromptContext', () => {
  it('serializa nacimiento, planetas y aspectos sin inventar campos', () => {
    const chart: ChartData = {
      birthData: {
        name: 'Test',
        date: '1990-01-15',
        time: '14:30',
        place: 'Madrid',
        latitude: 40.4,
        longitude: -3.7
      },
      ascendant: 'Leo',
      midheaven: 'Géminis',
      planets: [
        { name: 'Sol', sign: 'Capricornio', degree: 25.5, house: 10 }
      ],
      aspects: [{ planet1: 'Sol', planet2: 'Luna', type: 'trígono', orb: 1.2 }]
    }
    const raw = chartDataToPromptContext(chart)
    const o = JSON.parse(raw) as Record<string, unknown>
    expect(o.ascendente).toBe('Leo')
    expect(o.medio_cielo).toBe('Géminis')
    expect(o.nacimiento).toMatchObject({
      fecha: '1990-01-15',
      hora: '14:30',
      lugar: 'Madrid',
      latitud: 40.4,
      longitud: -3.7
    })
    expect(Array.isArray(o.planetas)).toBe(true)
    expect(Array.isArray(o.aspectos)).toBe(true)
  })

  it('omite aspectos cuando no hay lista', () => {
    const chart: ChartData = {
      birthData: { name: 'A', date: '2000-01-01', time: '12:00', place: 'X' },
      planets: []
    }
    const o = JSON.parse(chartDataToPromptContext(chart)) as { aspectos: unknown[] }
    expect(o.aspectos).toEqual([])
  })
})
