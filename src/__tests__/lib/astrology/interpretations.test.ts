import { describe, it, expect } from 'vitest'
import { getInterpretation } from '../../../renderer/lib/astrology/interpretations'
import type { Transit } from '../../../renderer/types/astrology'

describe('interpretations', () => {
  describe('getInterpretation', () => {
    it('debe devolver interpretación para tránsito conocido', () => {
      const transit: Transit = {
        id: 'test-1',
        transitingPlanet: 'Saturno',
        natalPoint: 'Sol',
        aspect: 'square',
        orb: 2.5,
        strength: 8,
        isExact: false,
        isTense: true,
        isHarmonious: false,
        interpretation: ''
      }

      const interpretation = getInterpretation(transit)

      expect(interpretation).toBeDefined()
      expect(typeof interpretation).toBe('string')
      expect(interpretation.length).toBeGreaterThan(0)
    })

    it('debe devolver interpretación para tránsito armónico', () => {
      const transit: Transit = {
        id: 'test-2',
        transitingPlanet: 'Júpiter',
        natalPoint: 'Luna',
        aspect: 'trine',
        orb: 1.5,
        strength: 9,
        isExact: false,
        isTense: false,
        isHarmonious: true,
        interpretation: ''
      }

      const interpretation = getInterpretation(transit)

      expect(interpretation).toBeDefined()
      expect(interpretation.length).toBeGreaterThan(0)
    })

    it('debe devolver interpretación para conjunción', () => {
      const transit: Transit = {
        id: 'test-3',
        transitingPlanet: 'Venus',
        natalPoint: 'Medio Cielo',
        aspect: 'conjunction',
        orb: 0.5,
        strength: 10,
        isExact: true,
        isTense: false,
        isHarmonious: false,
        interpretation: ''
      }

      const interpretation = getInterpretation(transit)

      expect(interpretation).toBeDefined()
      expect(interpretation.length).toBeGreaterThan(0)
    })

    it('debe devolver interpretación genérica para tránsito desconocido', () => {
      const transit: Transit = {
        id: 'test-4',
        transitingPlanet: 'PlanetaDesconocido',
        natalPoint: 'PuntoDesconocido',
        aspect: 'sextile',
        orb: 3.0,
        strength: 5,
        isExact: false,
        isTense: false,
        isHarmonious: true,
        interpretation: ''
      }

      const interpretation = getInterpretation(transit)

      expect(interpretation).toBeDefined()
      expect(typeof interpretation).toBe('string')
      expect(interpretation.length).toBeGreaterThan(0)
    })

    it('debe manejar diferentes tipos de aspectos', () => {
      const aspects = ['conjunction', 'opposition', 'square', 'trine', 'sextile']

      aspects.forEach(aspect => {
        const transit: Transit = {
          id: `test-${aspect}`,
          transitingPlanet: 'Sol',
          natalPoint: 'Luna',
          aspect: aspect as any,
          orb: 2.0,
          strength: 7,
          isExact: false,
          isTense: ['opposition', 'square'].includes(aspect),
          isHarmonious: ['trine', 'sextile'].includes(aspect),
          interpretation: ''
        }

        const interpretation = getInterpretation(transit)
        expect(interpretation).toBeDefined()
        expect(interpretation.length).toBeGreaterThan(0)
      })
    })

    it('debe manejar planetas en español', () => {
      const planets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón']

      planets.forEach(planet => {
        const transit: Transit = {
          id: `test-${planet}`,
          transitingPlanet: planet,
          natalPoint: 'Sol',
          aspect: 'trine',
          orb: 2.0,
          strength: 7,
          isExact: false,
          isTense: false,
          isHarmonious: true,
          interpretation: ''
        }

        const interpretation = getInterpretation(transit)
        expect(interpretation).toBeDefined()
      })
    })
  })
})

