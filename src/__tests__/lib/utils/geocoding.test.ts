import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  geocodePlace,
  geocodePlaceWithDebounce,
  resetGeocodeDebounceStateForTests
} from '../../../renderer/lib/utils/geocoding'

// Mock de fetch global
global.fetch = vi.fn()

describe('geocoding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-01T12:00:00.000Z'))
    resetGeocodeDebounceStateForTests()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetGeocodeDebounceStateForTests()
  })

  describe('geocodePlace', () => {
    it('debe geocodificar un lugar correctamente', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [
          {
            lat: '39.5696',
            lon: '2.6502',
            display_name: 'Palma, Islas Baleares, España'
          }
        ]
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await geocodePlace('Palma de Mallorca, España')

      expect(result).toBeDefined()
      expect(result.latitude).toBe(39.5696)
      expect(result.longitude).toBe(2.6502)
      expect(result.displayName).toContain('Palma')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('Palma'),
        expect.any(Object)
      )
    })

    it('debe manejar errores de red', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const result = await geocodePlace('Lugar inexistente')
      expect(result).toBeNull()
    })

    it('debe manejar respuestas vacías', async () => {
      const mockResponse = {
        ok: true,
        json: async () => []
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await geocodePlace('Lugar que no existe')
      expect(result).toBeNull()
    })

    it('debe manejar respuestas HTTP no exitosas', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await geocodePlace('Error')
      expect(result).toBeNull()
    })

    it('debe codificar correctamente la URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [
          {
            lat: '40.4168',
            lon: '-3.7038',
            display_name: 'Madrid, España'
          }
        ]
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await geocodePlace('Madrid, España')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('Madrid'),
        expect.any(Object)
      )
    })
  })

  describe('geocodePlaceWithDebounce', () => {
    it('debe aplicar debounce correctamente', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [
          {
            lat: '39.5696',
            lon: '2.6502',
            display_name: 'Palma, España'
          }
        ]
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result1 = await geocodePlaceWithDebounce('Palma')

      const p2 = geocodePlaceWithDebounce('Palma de Mallorca')
      await vi.advanceTimersByTimeAsync(1100)
      const result2 = await p2

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(result2?.latitude).toBe(39.5696)
    })

    it('debe respetar el tiempo mínimo entre llamadas', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [
          {
            lat: '40.4168',
            lon: '-3.7038',
            display_name: 'Madrid, España'
          }
        ]
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      await geocodePlaceWithDebounce('Madrid')

      const promise = geocodePlaceWithDebounce('Barcelona')
      await vi.advanceTimersByTimeAsync(1100)
      const result = await promise

      expect(result).toBeDefined()
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})

