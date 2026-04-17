import { describe, it, expect } from 'vitest'
import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import * as horoscopeNamespace from 'circular-natal-horoscope-js'

/**
 * Regresión: el bundle publicado es CommonJS (`module.exports = { Origin, Horoscope }`).
 * En el renderer (Vite/ESM) `import lib from 'circular-natal-horoscope-js'` falla:
 * «does not provide an export named 'default'».
 * Hay que usar siempre importaciones nombradas `{ Origin, Horoscope }`.
 */
describe('circular-natal-horoscope-js (contrato ESM)', () => {
  it('expone Origin y Horoscope como exports nombrados', () => {
    expect(horoscopeNamespace).toHaveProperty('Origin')
    expect(horoscopeNamespace).toHaveProperty('Horoscope')
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
