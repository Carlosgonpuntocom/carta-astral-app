import { describe, it, expect } from 'vitest'
import * as horoscopeNamespace from 'circular-natal-horoscope-js'
import { Origin, Horoscope } from '../../../renderer/lib/astrology/horoscope-lib'

/**
 * Regresión: Electron main (Node ESM) y renderer (Vite) resuelven distinto módulos CJS.
 * El helper `horoscope-lib` soporta ambas rutas (named/default) y evita el crash en main.
 */
describe('circular-natal-horoscope-js (compatibilidad CJS/ESM)', () => {
  it('expone Origin y Horoscope en el namespace del paquete', () => {
    expect(horoscopeNamespace).toHaveProperty('Origin')
    expect(horoscopeNamespace).toHaveProperty('Horoscope')
  })

  it('el helper resuelve constructores válidos', () => {
    expect(typeof Origin).toBe('function')
    expect(typeof Horoscope).toBe('function')
  })

  it('smoke: instanciar Origin y Horoscope (mismo uso que calculator / transits)', () => {
    const origin = new Origin({
      year: 1983,
      month: 0,
      date: 1,
      hour: 15,
      minute: 30,
      latitude: 39.5696,
      longitude: 2.6502
    })

    const horoscope = new Horoscope({
      origin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      language: 'en'
    })

    expect(horoscope.CelestialBodies).toBeDefined()
    const all = horoscope.CelestialBodies?.all
    expect(Array.isArray(all)).toBe(true)
    expect((all?.length ?? 0)).toBeGreaterThan(0)
  })
})
