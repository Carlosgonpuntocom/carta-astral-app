// Declarar tipos para electronAPI (definido en preload)
declare global {
  interface Window {
    electronAPI: {
      readPeople: () => Promise<any>
      savePeople: (people: any) => Promise<boolean>
      readChart: () => Promise<any>  // Mantener para migración
    }
  }
}

import type { SavedPerson, ChartData } from '../../types/astrology'

// Función para generar ID único
function generateId(): string {
  if (typeof window !== 'undefined' && (window as any).crypto && (window as any).crypto.randomUUID) {
    return (window as any).crypto.randomUUID()
  }
  // Fallback simple pero único
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

// Cargar todas las personas guardadas
export async function loadPeople(): Promise<SavedPerson[]> {
  if (window.electronAPI) {
    const data = await window.electronAPI.readPeople()
    return data || []
  }
  // Fallback: usar localStorage en desarrollo web
  const stored = localStorage.getItem('people')
  return stored ? JSON.parse(stored) : []
}

// Guardar todas las personas
export async function savePeople(people: SavedPerson[]): Promise<boolean> {
  if (window.electronAPI) {
    return await window.electronAPI.savePeople(people)
  }
  // Fallback: usar localStorage en desarrollo web
  try {
    localStorage.setItem('people', JSON.stringify(people))
    return true
  } catch (error) {
    console.error('Error guardando people:', error)
    return false
  }
}

// Obtener tu carta personal (isSelf: true)
export async function getMyChart(): Promise<SavedPerson | null> {
  const people = await loadPeople()
  return people.find(p => p.isSelf) || null
}

// Obtener una persona por ID
export async function getPersonById(id: string): Promise<SavedPerson | null> {
  const people = await loadPeople()
  return people.find(p => p.id === id) || null
}

// Guardar o actualizar una persona
export async function savePerson(person: SavedPerson): Promise<boolean> {
  const people = await loadPeople()
  
  const existingIndex = people.findIndex(p => p.id === person.id)
  
  if (existingIndex >= 0) {
    // Actualizar existente
    people[existingIndex] = {
      ...person,
      updatedAt: new Date().toISOString()
    }
  } else {
    // Nueva persona
    const newPerson: SavedPerson = {
      ...person,
      id: person.id || generateId(),
      createdAt: person.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    people.push(newPerson)
  }
  
  return await savePeople(people)
}

// Eliminar una persona
export async function deletePerson(id: string): Promise<boolean> {
  const people = await loadPeople()
  const filtered = people.filter(p => p.id !== id)
  
  // No permitir eliminar tu propia carta
  const person = people.find(p => p.id === id)
  if (person?.isSelf) {
    console.warn('No se puede eliminar tu propia carta')
    return false
  }
  
  return await savePeople(filtered)
}

// Migrar chart.json antiguo a people.json
export async function migrateOldChart(): Promise<boolean> {
  try {
    // Verificar si ya existe people.json con datos
    const existingPeople = await loadPeople()
    if (existingPeople.length > 0) {
      console.log('Ya existen personas guardadas, no se necesita migración')
      return true
    }
    
    // Intentar cargar chart.json antiguo
    if (window.electronAPI && window.electronAPI.readChart) {
      const oldChart = await window.electronAPI.readChart()
      
      if (oldChart && oldChart.birthData) {
        // Migrar a nueva estructura
        const myChart: SavedPerson = {
          id: generateId(),
          isSelf: true,
          name: oldChart.birthData.name,
          birthData: oldChart.birthData,
          relationship: 'otro',
          chartData: oldChart,
          createdAt: oldChart.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        await savePerson(myChart)
        console.log('✅ Migración completada: chart.json → people.json')
        return true
      }
    }
    
    return true
  } catch (error) {
    console.error('Error en migración:', error)
    return false
  }
}

