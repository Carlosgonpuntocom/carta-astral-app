import { describe, it, expect } from 'vitest'
import { calculateChart } from '../../../renderer/lib/astrology/calculator'
import type { BirthData } from '../../../renderer/types/astrology'

describe('calculator', () => {
  describe('calculateChart', () => {
    const testBirthData: BirthData = {
      date: '1983-01-01',
      time: '15:30',
      place: 'Palma de Mallorca, España',
      latitude: 39.5696,
      longitude: 2.6502
    }

    it('debe calcular una carta natal correctamente', async () => {
      const chart = await calculateChart(testBirthData)
      
      expect(chart).toBeDefined()
      expect(chart.planets).toBeDefined()
      expect(Array.isArray(chart.planets)).toBe(true)
      expect(chart.planets.length).toBeGreaterThan(0)
    })

    it('debe incluir planetas principales', async () => {
      const chart = await calculateChart(testBirthData)
      const planetNames = chart.planets.map(p => p.name)
      
      expect(planetNames).toContain('Sol')
      expect(planetNames).toContain('Luna')
      expect(planetNames).toContain('Mercurio')
      expect(planetNames).toContain('Venus')
      expect(planetNames).toContain('Marte')
    })

    it('debe tener Ascendente y Medio Cielo', async () => {
      const chart = await calculateChart(testBirthData)
      
      expect(chart.ascendant).toBeDefined()
      expect(chart.midheaven).toBeDefined()
      expect(typeof chart.ascendant).toBe('string')
      expect(typeof chart.midheaven).toBe('string')
    })

    it('debe tener aspectos calculados', async () => {
      const chart = await calculateChart(testBirthData)
      
      expect(chart.aspects).toBeDefined()
      expect(Array.isArray(chart.aspects)).toBe(true)
    })

    it('debe traducir nombres de planetas a español', async () => {
      const chart = await calculateChart(testBirthData)
      const planetNames = chart.planets.map(p => p.name)
      
      // Verificar que no hay nombres en inglés
      expect(planetNames).not.toContain('Sun')
      expect(planetNames).not.toContain('Moon')
      expect(planetNames).not.toContain('Mercury')
    })

    it('debe traducir signos a español', async () => {
      const chart = await calculateChart(testBirthData)
      
      // Verificar que los signos están en español
      chart.planets.forEach(planet => {
        expect(planet.sign).not.toContain('Sagittarius')
        expect(planet.sign).not.toContain('Pisces')
        expect(planet.sign).not.toContain('Cancer')
      })
    })

    it('debe tener grados válidos (0-30)', async () => {
      const chart = await calculateChart(testBirthData)
      
      chart.planets.forEach(planet => {
        expect(planet.degree).toBeGreaterThanOrEqual(0)
        expect(planet.degree).toBeLessThan(30)
      })
    })

    it('debe tener casas válidas (1-12)', async () => {
      const chart = await calculateChart(testBirthData)
      
      chart.planets.forEach(planet => {
        if (planet.house !== undefined) {
          expect(planet.house).toBeGreaterThanOrEqual(1)
          expect(planet.house).toBeLessThanOrEqual(12)
        }
      })
    })

    it('debe manejar diferentes fechas correctamente', async () => {
      const birthData2: BirthData = {
        ...testBirthData,
        date: '1990-06-15',
        time: '12:00'
      }
      
      const chart = await calculateChart(birthData2)
      expect(chart).toBeDefined()
      expect(chart.planets.length).toBeGreaterThan(0)
    })
  })
})

