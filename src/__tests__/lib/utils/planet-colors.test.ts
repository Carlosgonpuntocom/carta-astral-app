import { describe, it, expect } from 'vitest'
import { 
  getPlanetColor, 
  getPlanetTextColor, 
  getPlanetLinkClasses, 
  PLANET_COLORS,
  getSignColor,
  getSignTextColor,
  getSignLinkClasses,
  SIGN_COLORS,
  getHouseColor,
  getHouseTextColor,
  getHouseLinkClasses,
  HOUSE_COLORS
} from '../../../renderer/lib/utils/planet-colors'

describe('planet-colors', () => {
  describe('PLANET_COLORS', () => {
    it('debe tener colores definidos para todos los planetas principales', () => {
      const planetasPrincipales = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón']
      
      planetasPrincipales.forEach(planeta => {
        expect(PLANET_COLORS[planeta]).toBeDefined()
        expect(PLANET_COLORS[planeta].text).toBeDefined()
        expect(PLANET_COLORS[planeta].hover).toBeDefined()
      })
    })

    it('debe tener colores para puntos astrológicos', () => {
      const puntos = ['Ascendente', 'Medio Cielo', 'MC', 'Nodo Norte', 'Nodo Sur']
      
      puntos.forEach(punto => {
        expect(PLANET_COLORS[punto]).toBeDefined()
      })
    })

    it('debe tener colores para asteroides', () => {
      const asteroides = ['Quirón', 'Chiron', 'Lilith', 'Sirio', 'Sirius']
      
      asteroides.forEach(asteroide => {
        expect(PLANET_COLORS[asteroide]).toBeDefined()
      })
    })
  })

  describe('getPlanetColor', () => {
    it('debe devolver el color correcto para Sol', () => {
      const color = getPlanetColor('Sol')
      expect(color.text).toBe('text-yellow-600')
      expect(color.hover).toBe('hover:text-yellow-700')
    })

    it('debe devolver el color correcto para Luna', () => {
      const color = getPlanetColor('Luna')
      expect(color.text).toBe('text-gray-600')
    })

    it('debe devolver el color correcto para Venus', () => {
      const color = getPlanetColor('Venus')
      expect(color.text).toBe('text-pink-600')
    })

    it('debe devolver un color por defecto para planetas desconocidos', () => {
      const color = getPlanetColor('PlanetaDesconocido')
      expect(color.text).toBe('text-gray-600')
      expect(color.hover).toBe('hover:text-gray-700')
    })

    it('debe manejar espacios en blanco', () => {
      const color = getPlanetColor('  Sol  ')
      expect(color.text).toBe('text-yellow-600')
    })
  })

  describe('getPlanetTextColor', () => {
    it('debe devolver solo la clase de texto', () => {
      const color = getPlanetTextColor('Sol')
      expect(color).toBe('text-yellow-600')
    })

    it('debe funcionar con planetas en minúsculas (usa fallback)', () => {
      // La función no normaliza a mayúsculas, así que usa fallback
      const color = getPlanetTextColor('sol')
      expect(color).toBe('text-gray-600') // Fallback para planetas no encontrados
    })
    
    it('debe funcionar correctamente con mayúsculas', () => {
      const color = getPlanetTextColor('Sol')
      expect(color).toBe('text-yellow-600')
    })
  })

  describe('getPlanetLinkClasses', () => {
    it('debe devolver clases completas para un enlace', () => {
      const classes = getPlanetLinkClasses('Sol')
      expect(classes).toContain('text-yellow-600')
      expect(classes).toContain('hover:text-yellow-700')
      expect(classes).toContain('font-medium')
    })

    it('debe incluir clases adicionales', () => {
      const classes = getPlanetLinkClasses('Venus', 'custom-class')
      expect(classes).toContain('text-pink-600')
      expect(classes).toContain('custom-class')
    })
  })

  describe('SIGN_COLORS', () => {
    it('debe tener colores definidos para todos los signos del zodíaco', () => {
      const signos = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
      
      signos.forEach(signo => {
        expect(SIGN_COLORS[signo]).toBeDefined()
        expect(SIGN_COLORS[signo].text).toBeDefined()
        expect(SIGN_COLORS[signo].hover).toBeDefined()
      })
    })
  })

  describe('getSignColor', () => {
    it('debe devolver el color correcto para Aries', () => {
      const color = getSignColor('Aries')
      expect(color.text).toBe('text-red-600')
    })

    it('debe devolver el color correcto para Leo', () => {
      const color = getSignColor('Leo')
      expect(color.text).toBe('text-orange-600')
    })

    it('debe devolver un color por defecto para signos desconocidos', () => {
      const color = getSignColor('SignoDesconocido')
      expect(color.text).toBe('text-gray-600')
    })
  })

  describe('getSignTextColor', () => {
    it('debe devolver solo la clase de texto', () => {
      const color = getSignTextColor('Sagitario')
      expect(color).toBe('text-purple-600')
    })
  })

  describe('getSignLinkClasses', () => {
    it('debe devolver clases completas para un enlace de signo', () => {
      const classes = getSignLinkClasses('Libra')
      expect(classes).toContain('text-pink-600')
      expect(classes).toContain('hover:text-pink-700')
      expect(classes).toContain('font-medium')
    })
  })

  describe('HOUSE_COLORS', () => {
    it('debe tener colores definidos para todas las casas (1-12)', () => {
      for (let i = 1; i <= 12; i++) {
        expect(HOUSE_COLORS[i]).toBeDefined()
        expect(HOUSE_COLORS[i].text).toBeDefined()
        expect(HOUSE_COLORS[i].hover).toBeDefined()
      }
    })
  })

  describe('getHouseColor', () => {
    it('debe devolver el color correcto para la casa 1', () => {
      const color = getHouseColor(1)
      expect(color.text).toBe('text-emerald-600')
    })

    it('debe devolver el color correcto para la casa 10', () => {
      const color = getHouseColor(10)
      expect(color.text).toBe('text-amber-600')
    })

    it('debe devolver un color por defecto para casas inválidas', () => {
      const color = getHouseColor(0)
      expect(color.text).toBe('text-gray-600')
      const color2 = getHouseColor(13)
      expect(color2.text).toBe('text-gray-600')
    })
  })

  describe('getHouseTextColor', () => {
    it('debe devolver solo la clase de texto', () => {
      const color = getHouseTextColor(5)
      expect(color).toBe('text-pink-600')
    })
  })

  describe('getHouseLinkClasses', () => {
    it('debe devolver clases completas para un enlace de casa', () => {
      const classes = getHouseLinkClasses(7)
      expect(classes).toContain('text-purple-600')
      expect(classes).toContain('hover:text-purple-700')
      expect(classes).toContain('font-medium')
    })
  })
})

