import { describe, it, expect, beforeEach } from 'vitest'
import { 
  calculateElements, 
  calculateModalities, 
  calculateRPGStats,
  calculateRadarData
} from '../../../renderer/lib/astrology/chart-game-calculator'
import { calculateChart } from '../../../renderer/lib/astrology/calculator'
import type { BirthData, ChartData } from '../../../renderer/types/astrology'

describe('chart-game-calculator (extended)', () => {
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

  // Nota: Las funciones helper (getPlanetStrength, getStelliumPlanets, etc.)
  // son funciones internas no exportadas. Se prueban indirectamente a través
  // de las funciones públicas que las usan (calculateRPGStats, etc.)
  
  describe('Helper functions (tested indirectly)', () => {
    it('debe calcular stats RPG usando funciones helper internas', () => {
      const stats = calculateRPGStats(chart)
      
      // Si las funciones helper funcionan, los stats deberían ser válidos
      expect(stats.INT).toBeGreaterThanOrEqual(1)
      expect(stats.WIS).toBeGreaterThanOrEqual(1)
      expect(stats.CHA).toBeGreaterThanOrEqual(1)
    })
  })

  describe('calculateRadarData', () => {
    it('debe calcular datos para radar chart', () => {
      const radarData = calculateRadarData(chart)
      
      expect(radarData).toBeDefined()
      expect(radarData).toHaveProperty('labels')
      expect(radarData).toHaveProperty('values')
      expect(Array.isArray(radarData.labels)).toBe(true)
      expect(Array.isArray(radarData.values)).toBe(true)
    })

    it('debe tener estructura correcta para radar', () => {
      const radarData = calculateRadarData(chart)
      
      // Verificar que tiene labels y values
      expect(radarData.labels.length).toBeGreaterThan(0)
      expect(radarData.values.length).toBeGreaterThan(0)
      expect(radarData.labels.length).toBe(radarData.values.length)
    })

    it('debe tener valores entre 0 y 100', () => {
      const radarData = calculateRadarData(chart)
      
      radarData.values.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('calculateRPGStats - sub-stats', () => {
    it('debe calcular intuición mental y emocional', () => {
      const stats = calculateRPGStats(chart)
      
      expect(stats.mentalIntuition).toBeDefined()
      expect(stats.emotionalIntuition).toBeDefined()
      expect(stats.mentalIntuition).toBeGreaterThanOrEqual(1)
      expect(stats.mentalIntuition).toBeLessThanOrEqual(10)
      expect(stats.emotionalIntuition).toBeGreaterThanOrEqual(1)
      expect(stats.emotionalIntuition).toBeLessThanOrEqual(10)
    })

    it('debe calcular magnetismo personal y grupal', () => {
      const stats = calculateRPGStats(chart)
      
      expect(stats.personalCharisma).toBeDefined()
      expect(stats.groupCharisma).toBeDefined()
      expect(stats.personalCharisma).toBeGreaterThanOrEqual(1)
      expect(stats.personalCharisma).toBeLessThanOrEqual(10)
      expect(stats.groupCharisma).toBeGreaterThanOrEqual(1)
      expect(stats.groupCharisma).toBeLessThanOrEqual(10)
    })

    it('debe promediar correctamente WIS y CHA', () => {
      const stats = calculateRPGStats(chart)
      
      const expectedWIS = (stats.mentalIntuition + stats.emotionalIntuition) / 2
      const expectedCHA = (stats.personalCharisma + stats.groupCharisma) / 2
      
      // Permitir pequeña diferencia por redondeo
      expect(Math.abs(stats.WIS - expectedWIS)).toBeLessThan(0.1)
      expect(Math.abs(stats.CHA - expectedCHA)).toBeLessThan(0.1)
    })
  })

  describe('Edge cases', () => {
    it('debe manejar chart sin planetas', () => {
      const emptyChart: ChartData = {
        planets: [],
        aspects: [],
        ascendant: 'Aries',
        midheaven: 'Capricornio'
      }

      const elements = calculateElements(emptyChart)
      // Sin planetas, devuelve distribución por defecto (25% cada uno)
      const total = elements.fire + elements.earth + elements.air + elements.water
      expect(total).toBeGreaterThanOrEqual(0)
      expect(total).toBeLessThanOrEqual(100)
    })

    it('debe manejar chart sin aspectos', () => {
      const chartSinAspectos: ChartData = {
        ...chart,
        aspects: []
      }

      const stats = calculateRPGStats(chartSinAspectos)
      expect(stats).toBeDefined()
      expect(stats.INT).toBeGreaterThanOrEqual(1)
    })
  })
})

