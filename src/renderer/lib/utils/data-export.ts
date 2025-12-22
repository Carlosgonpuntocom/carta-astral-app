import type { SavedPerson } from '../../types/astrology'

// Exportar todas las personas a JSON
export function exportPeopleToJSON(people: SavedPerson[]): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    people: people
  }
  
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `carta-astral-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Importar personas desde JSON
export function importPeopleFromJSON(file: File): Promise<SavedPerson[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)
        
        // Validar estructura
        if (!data.people || !Array.isArray(data.people)) {
          throw new Error('Formato de archivo inválido. Debe contener un array "people".')
        }
        
        // Validar que cada persona tenga los campos mínimos
        const validPeople = data.people.filter((person: any) => {
          return person.name && person.birthData && person.birthData.date
        })
        
        if (validPeople.length === 0) {
          throw new Error('No se encontraron personas válidas en el archivo.')
        }
        
        resolve(validPeople as SavedPerson[])
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo.'))
    }
    
    reader.readAsText(file)
  })
}

