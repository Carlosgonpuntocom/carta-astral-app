import { describe, it, expect, beforeEach } from 'vitest'
import { calculateTransits, calculateTransitSummary } from '../../../renderer/lib/astrology/transits'
import { calculateChart } from '../../../renderer/lib/astrology/calculator'
import type { BirthData, ChartData } from '../../../renderer/types/astrology'

describe('transits', () => {
  let natalChart: ChartData
  const testBirthData: BirthData = {
    date: '1983-01-01',
    time: '15:30',
    place: 'Palma de Mallorca, España',
    latitude: 39.5696,
    longitude: 2.6502
  }

  beforeEach(async () => {
    natalChart = await calculateChart(testBirthData)
  })


  describe('calculateTransits', () => {
    it('debe calcular tránsitos para una fecha', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      expect(transits).toBeDefined()
      expect(Array.isArray(transits)).toBe(true)
    })

    it('debe devolver tránsitos con estructura correcta', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      if (transits.length > 0) {
        const transit = transits[0]
        expect(transit).toHaveProperty('id')
        expect(transit).toHaveProperty('transitingPlanet')
        expect(transit).toHaveProperty('natalPoint')
        expect(transit).toHaveProperty('aspect')
        expect(transit).toHaveProperty('orb')
        expect(transit).toHaveProperty('strength')
        expect(transit).toHaveProperty('interpretation')
      }
    })

    it('debe tener orbes válidos (positivos)', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      transits.forEach(transit => {
        expect(transit.orb).toBeGreaterThanOrEqual(0)
        expect(transit.orb).toBeLessThan(10) // Orbe máximo razonable
      })
    })

    it('debe tener fuerza entre 1 y 10', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      transits.forEach(transit => {
        expect(transit.strength).toBeGreaterThanOrEqual(1)
        expect(transit.strength).toBeLessThanOrEqual(10)
      })
    })

    it('debe identificar aspectos exactos correctamente', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      transits.forEach(transit => {
        if (transit.orb < 0.5) {
          expect(transit.isExact).toBe(true)
        }
      })
    })

    it('debe clasificar aspectos como tensos o armónicos', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      
      transits.forEach(transit => {
        const isTense = ['square', 'opposition'].includes(transit.aspect)
        const isHarmonious = ['trine', 'sextile'].includes(transit.aspect)
        const isNeutral = transit.aspect === 'conjunction'
        
        expect(isTense || isHarmonious || isNeutral).toBe(true)
        
        if (isTense) {
          expect(transit.isTense).toBe(true)
        }
        if (isHarmonious) {
          expect(transit.isHarmonious).toBe(true)
        }
      })
    })
  })

  describe('calculateTransitSummary', () => {
    it('debe calcular un resumen de tránsitos', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      const summary = await calculateTransitSummary(transits, date, testBirthData)
      
      expect(summary).toBeDefined()
      expect(summary).toHaveProperty('totalTransits')
      expect(summary).toHaveProperty('tenseCount')
      expect(summary).toHaveProperty('harmoniousCount')
      expect(summary).toHaveProperty('conjunctionCount')
    })

    it('debe contar correctamente los tránsitos', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      const summary = await calculateTransitSummary(transits, date, testBirthData)
      
      expect(summary.totalTransits).toBe(transits.length)
      expect(summary.tenseCount + summary.harmoniousCount + summary.conjunctionCount).toBeLessThanOrEqual(summary.totalTransits)
    })

    it('debe identificar el tránsito más importante', async () => {
      const date = new Date('2024-12-15')
      const transits = await calculateTransits(natalChart, date)
      const summary = await calculateTransitSummary(transits, date, testBirthData)
      
      if (transits.length > 0) {
        expect(summary.mostImportant).toBeDefined()
        expect(summary.mostImportant.strength).toBeGreaterThanOrEqual(1)
      }
    })
  })
})

