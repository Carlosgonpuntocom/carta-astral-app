import { describe, it, expect, beforeEach } from 'vitest'
import { 
  calculateElements, 
  calculateModalities, 
  calculateRPGStats,
  calculateStrengthsWeaknesses,
  calculateBadges
} from '../../../renderer/lib/astrology/chart-game-calculator'
import { calculateChart } from '../../../renderer/lib/astrology/calculator'
import type { BirthData, ChartData } from '../../../renderer/types/astrology'

describe('chart-game-calculator', () => {
  let chart: ChartData
  const testBirthData: BirthData = {
    date: '1983-01-01',
    time: '15:30',
    place: 'Palma de Mallorca, España',
    latitude: 39.5696,
    longitude: 2.6502
  }

  beforeEach(async () => {
    chart = await calculateChart(testBirthData)
  })

  describe('calculateElements', () => {
    it('debe calcular elementos correctamente', () => {
      const elements = calculateElements(chart)
      
      expect(elements).toBeDefined()
      expect(elements).toHaveProperty('fire')
      expect(elements).toHaveProperty('earth')
      expect(elements).toHaveProperty('air')
      expect(elements).toHaveProperty('water')
    })

    it('debe tener porcentajes entre 0 y 100', () => {
      const elements = calculateElements(chart)
      
      expect(elements.fire).toBeGreaterThanOrEqual(0)
      expect(elements.fire).toBeLessThanOrEqual(100)
      expect(elements.earth).toBeGreaterThanOrEqual(0)
      expect(elements.earth).toBeLessThanOrEqual(100)
      expect(elements.air).toBeGreaterThanOrEqual(0)
      expect(elements.air).toBeLessThanOrEqual(100)
      expect(elements.water).toBeGreaterThanOrEqual(0)
      expect(elements.water).toBeLessThanOrEqual(100)
    })

    it('debe sumar aproximadamente 100%', () => {
      const elements = calculateElements(chart)
      const total = elements.fire + elements.earth + elements.air + elements.water
      
      // Permitir pequeña diferencia por redondeo
      expect(total).toBeGreaterThan(95)
      expect(total).toBeLessThanOrEqual(100)
    })
  })

  describe('calculateModalities', () => {
    it('debe calcular modalidades correctamente', () => {
      const modalities = calculateModalities(chart)
      
      expect(modalities).toBeDefined()
      expect(modalities).toHaveProperty('cardinal')
      expect(modalities).toHaveProperty('fixed')
      expect(modalities).toHaveProperty('mutable')
    })

    it('debe tener porcentajes entre 0 y 100', () => {
      const modalities = calculateModalities(chart)
      
      expect(modalities.cardinal).toBeGreaterThanOrEqual(0)
      expect(modalities.cardinal).toBeLessThanOrEqual(100)
      expect(modalities.fixed).toBeGreaterThanOrEqual(0)
      expect(modalities.fixed).toBeLessThanOrEqual(100)
      expect(modalities.mutable).toBeGreaterThanOrEqual(0)
      expect(modalities.mutable).toBeLessThanOrEqual(100)
    })
  })

  describe('calculateRPGStats', () => {
    it('debe calcular stats RPG correctamente', () => {
      const stats = calculateRPGStats(chart)
      
      expect(stats).toBeDefined()
      expect(stats).toHaveProperty('INT')
      expect(stats).toHaveProperty('WIS')
      expect(stats).toHaveProperty('CHA')
      expect(stats).toHaveProperty('STR')
      expect(stats).toHaveProperty('DEX')
      expect(stats).toHaveProperty('CON')
    })

    it('debe tener valores entre 1 y 10', () => {
      const stats = calculateRPGStats(chart)
      
      expect(stats.INT).toBeGreaterThanOrEqual(1)
      expect(stats.INT).toBeLessThanOrEqual(10)
      expect(stats.WIS).toBeGreaterThanOrEqual(1)
      expect(stats.WIS).toBeLessThanOrEqual(10)
      expect(stats.CHA).toBeGreaterThanOrEqual(1)
      expect(stats.CHA).toBeLessThanOrEqual(10)
      expect(stats.STR).toBeGreaterThanOrEqual(1)
      expect(stats.STR).toBeLessThanOrEqual(10)
      expect(stats.DEX).toBeGreaterThanOrEqual(1)
      expect(stats.DEX).toBeLessThanOrEqual(10)
      expect(stats.CON).toBeGreaterThanOrEqual(1)
      expect(stats.CON).toBeLessThanOrEqual(10)
    })

    it('debe incluir sub-stats para WIS y CHA', () => {
      const stats = calculateRPGStats(chart)
      
      expect(stats.mentalIntuition).toBeDefined()
      expect(stats.emotionalIntuition).toBeDefined()
      expect(stats.personalCharisma).toBeDefined()
      expect(stats.groupCharisma).toBeDefined()
    })
  })

  describe('calculateStrengthsWeaknesses', () => {
    it('debe calcular fortalezas y debilidades', () => {
      const result = calculateStrengthsWeaknesses(chart)
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('strengths')
      expect(result).toHaveProperty('weaknesses')
      expect(Array.isArray(result.strengths)).toBe(true)
      expect(Array.isArray(result.weaknesses)).toBe(true)
    })

    it('debe tener al menos una fortaleza', () => {
      const result = calculateStrengthsWeaknesses(chart)
      expect(result.strengths.length).toBeGreaterThan(0)
    })
  })

  describe('calculateBadges', () => {
    it('debe calcular badges', () => {
      const badges = calculateBadges(chart)
      
      expect(badges).toBeDefined()
      expect(Array.isArray(badges)).toBe(true)
    })

    it('debe devolver badges con estructura correcta', () => {
      const badges = calculateBadges(chart)
      
      badges.forEach(badge => {
        expect(badge).toHaveProperty('title')
        expect(badge).toHaveProperty('description')
        expect(badge).toHaveProperty('icon')
        expect(typeof badge.title).toBe('string')
        expect(typeof badge.description).toBe('string')
      })
    })
  })
})

