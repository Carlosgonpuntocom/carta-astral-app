import { describe, it, expect } from 'vitest'
import { calculateChart } from '../../renderer/lib/astrology/calculator'
import { calculateTransits } from '../../renderer/lib/astrology/transits'
import { calculateRPGStats, calculateElements, calculateBadges } from '../../renderer/lib/astrology/chart-game-calculator'
import type { BirthData, ChartData } from '../../renderer/types/astrology'

describe('Integration: Chart Flow', () => {
  const testBirthData: BirthData = {
    date: '1983-01-01',
    time: '15:30',
    place: 'Palma de Mallorca, España',
    latitude: 39.5696,
    longitude: 2.6502
  }

  it('debe calcular carta completa y derivar todos los datos', async () => {
    // 1. Calcular carta natal
    const chart = await calculateChart(testBirthData)
    expect(chart).toBeDefined()
    expect(chart.planets.length).toBeGreaterThan(0)

    // 2. Calcular elementos
    const elements = calculateElements(chart)
    expect(elements).toBeDefined()
    expect(elements.fire + elements.earth + elements.air + elements.water).toBeGreaterThan(0)

    // 3. Calcular stats RPG
    const stats = calculateRPGStats(chart)
    expect(stats).toBeDefined()
    expect(stats.INT).toBeGreaterThanOrEqual(1)
    expect(stats.WIS).toBeGreaterThanOrEqual(1)
    expect(stats.CHA).toBeGreaterThanOrEqual(1)

    // 4. Calcular badges
    const badges = calculateBadges(chart)
    expect(Array.isArray(badges)).toBe(true)

    // 5. Calcular tránsitos
    const transits = await calculateTransits(chart, new Date())
    expect(Array.isArray(transits)).toBe(true)
  })

  it('debe mantener consistencia entre cálculos relacionados', async () => {
    const chart = await calculateChart(testBirthData)

    // Los elementos calculados deben ser consistentes con los planetas
    const elements = calculateElements(chart)
    const planetSigns = chart.planets.map(p => p.sign)
    
    // Verificar que los signos de los planetas corresponden a los elementos
    const fireSigns = ['Aries', 'Leo', 'Sagitario']
    const earthSigns = ['Tauro', 'Virgo', 'Capricornio']
    const airSigns = ['Géminis', 'Libra', 'Acuario']
    const waterSigns = ['Cáncer', 'Escorpio', 'Piscis']

    const fireCount = planetSigns.filter(s => fireSigns.includes(s)).length
    const earthCount = planetSigns.filter(s => earthSigns.includes(s)).length
    const airCount = planetSigns.filter(s => airSigns.includes(s)).length
    const waterCount = planetSigns.filter(s => waterSigns.includes(s)).length

    // Los porcentajes deben ser aproximadamente correctos
    // Nota: calculateElements usa pesos, no solo conteo, así que puede haber diferencias
    const totalPlanets = chart.planets.length
    if (totalPlanets > 0) {
      // Permitir mayor margen porque calculateElements usa pesos
      expect(Math.abs(elements.fire - (fireCount / totalPlanets) * 100)).toBeLessThan(20)
    }
  })

  it('debe calcular tránsitos para diferentes fechas', async () => {
    const chart = await calculateChart(testBirthData)

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const transitsToday = await calculateTransits(chart, today)
    const transitsTomorrow = await calculateTransits(chart, tomorrow)

    // Los tránsitos pueden variar entre días
    expect(Array.isArray(transitsToday)).toBe(true)
    expect(Array.isArray(transitsTomorrow)).toBe(true)
  })

  it('debe validar que todos los planetas tienen datos completos', async () => {
    const chart = await calculateChart(testBirthData)

    chart.planets.forEach(planet => {
      expect(planet.name).toBeDefined()
      expect(planet.sign).toBeDefined()
      expect(planet.degree).toBeDefined()
      expect(planet.degree).toBeGreaterThanOrEqual(0)
      expect(planet.degree).toBeLessThan(30)
    })
  })

  it('debe validar que los aspectos tienen estructura correcta', async () => {
    const chart = await calculateChart(testBirthData)

    if (chart.aspects && chart.aspects.length > 0) {
      chart.aspects.forEach(aspect => {
        expect(aspect.planet1).toBeDefined()
        expect(aspect.planet2).toBeDefined()
        expect(aspect.type).toBeDefined()
        expect(aspect.orb).toBeDefined()
        expect(aspect.orb).toBeGreaterThanOrEqual(0)
      })
    }
  })
})

