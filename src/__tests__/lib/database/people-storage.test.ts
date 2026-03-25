import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { SavedPerson, BirthData } from '../../../renderer/types/astrology'

// Mock de window.electronAPI
const mockElectronAPI = {
  readPeople: vi.fn(),
  savePeople: vi.fn(),
  readChart: vi.fn()
}

// Mock global de window
const originalWindow = global.window
beforeEach(() => {
  ;(global as any).window = {
    electronAPI: mockElectronAPI
  }
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  }
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
})

afterEach(() => {
  vi.clearAllMocks()
  ;(global as any).window = originalWindow
})

// Importar después del mock
import { loadPeople, savePerson, deletePerson, getMyChart } from '../../../renderer/lib/database/people-storage'

describe('people-storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockBirthData: BirthData = {
    date: '1983-01-01',
    time: '15:30',
    place: 'Palma de Mallorca, España',
    latitude: 39.5696,
    longitude: 2.6502
  }

  const mockPerson: SavedPerson = {
    id: 'test-id-1',
    name: 'Carlos',
    isSelf: true,
    birthData: mockBirthData,
    relationship: 'otro',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  describe('loadPeople', () => {
    it('debe cargar personas correctamente', async () => {
      const mockPeople: SavedPerson[] = [mockPerson]
      mockElectronAPI.readPeople.mockResolvedValue(mockPeople)

      const result = await loadPeople()

      expect(result).toEqual(mockPeople)
      expect(mockElectronAPI.readPeople).toHaveBeenCalledTimes(1)
    })

    it('debe devolver array vacío si no hay datos', async () => {
      mockElectronAPI.readPeople.mockResolvedValue(null)

      const result = await loadPeople()

      expect(result).toEqual([])
    })

    it('debe usar localStorage como fallback si no hay electronAPI', async () => {
      // Simular que no hay electronAPI
      delete (global as any).window.electronAPI

      const mockPeople = [mockPerson]
      const stored = JSON.stringify(mockPeople)
      ;(localStorage.getItem as any).mockReturnValue(stored)

      const result = await loadPeople()

      expect(result).toEqual(JSON.parse(stored))
      expect(localStorage.getItem).toHaveBeenCalledWith('people')

      // Restaurar
      ;(global as any).window.electronAPI = mockElectronAPI
    })
  })

  describe('savePerson', () => {
    it('debe guardar una persona nueva', async () => {
      const newPerson: SavedPerson = {
        ...mockPerson,
        id: 'new-id',
        name: 'Nueva Persona'
      }

      mockElectronAPI.readPeople.mockResolvedValue([])
      mockElectronAPI.savePeople.mockResolvedValue(true)

      const result = await savePerson(newPerson)

      expect(result).toBe(true)
      expect(mockElectronAPI.savePeople).toHaveBeenCalled()
    })

    it('debe actualizar una persona existente', async () => {
      const updatedPerson: SavedPerson = {
        ...mockPerson,
        name: 'Carlos Actualizado'
      }

      mockElectronAPI.readPeople.mockResolvedValue([mockPerson])
      mockElectronAPI.savePeople.mockResolvedValue(true)

      const result = await savePerson(updatedPerson)

      expect(result).toBe(true)
      expect(mockElectronAPI.savePeople).toHaveBeenCalled()
    })

    it('debe actualizar updatedAt al guardar', async () => {
      const oldDate = new Date('2024-01-01')
      const person: SavedPerson = {
        ...mockPerson,
        updatedAt: oldDate.toISOString()
      }

      mockElectronAPI.readPeople.mockResolvedValue([])
      mockElectronAPI.savePeople.mockResolvedValue(true)

      await savePerson(person)

      expect(mockElectronAPI.savePeople).toHaveBeenCalled()
      const savedPeople = mockElectronAPI.savePeople.mock.calls[0][0]
      const savedPerson = savedPeople.find((p: SavedPerson) => p.id === person.id)

      if (savedPerson) {
        expect(savedPerson.updatedAt).not.toEqual(oldDate.toISOString())
      }
    })
  })

  describe('deletePerson', () => {
    it('debe eliminar una persona correctamente', async () => {
      const people: SavedPerson[] = [
        mockPerson,
        { ...mockPerson, id: 'test-id-2', name: 'Otra Persona', isSelf: false }
      ]

      mockElectronAPI.readPeople.mockResolvedValue(people)
      mockElectronAPI.savePeople.mockResolvedValue(true)

      const result = await deletePerson('test-id-2')

      expect(result).toBe(true)
      expect(mockElectronAPI.savePeople).toHaveBeenCalledWith([mockPerson])
    })

    it('debe manejar eliminación de persona inexistente', async () => {
      mockElectronAPI.readPeople.mockResolvedValue([mockPerson])
      mockElectronAPI.savePeople.mockResolvedValue(true)

      const result = await deletePerson('id-inexistente')

      expect(result).toBe(true)
      expect(mockElectronAPI.savePeople).toHaveBeenCalled()
    })

    it('no debe permitir eliminar tu propia carta', async () => {
      mockElectronAPI.readPeople.mockResolvedValue([mockPerson])

      const result = await deletePerson('test-id-1')

      expect(result).toBe(false)
      expect(mockElectronAPI.savePeople).not.toHaveBeenCalled()
    })
  })

  describe('getMyChart', () => {
    it('debe encontrar la carta propia', async () => {
      const people: SavedPerson[] = [
        { ...mockPerson, id: 'other-id', isSelf: false },
        { ...mockPerson, id: 'self-id', isSelf: true }
      ]

      mockElectronAPI.readPeople.mockResolvedValue(people)

      const result = await getMyChart()

      expect(result).toBeDefined()
      expect(result?.isSelf).toBe(true)
      expect(result?.id).toBe('self-id')
    })

    it('debe devolver null si no hay carta propia', async () => {
      const people: SavedPerson[] = [
        { ...mockPerson, id: 'other-id', isSelf: false }
      ]

      mockElectronAPI.readPeople.mockResolvedValue(people)

      const result = await getMyChart()

      expect(result).toBeNull()
    })
  })
})

