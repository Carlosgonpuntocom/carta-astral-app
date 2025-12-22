import { contextBridge, ipcRenderer } from 'electron'

// Exponer APIs seguras al renderer usando IPC
contextBridge.exposeInMainWorld('electronAPI', {
  // Leer archivo JSON (legacy - para migración)
  readChart: async (): Promise<any> => {
    try {
      return await ipcRenderer.invoke('read-chart')
    } catch (error) {
      console.error('Error leyendo chart:', error)
      return null
    }
  },

  // Guardar archivo JSON (legacy - para migración)
  saveChart: async (chartData: any): Promise<boolean> => {
    try {
      return await ipcRenderer.invoke('save-chart', chartData)
    } catch (error) {
      console.error('Error guardando chart:', error)
      return false
    }
  },

  // Leer personas (nuevo sistema)
  readPeople: async (): Promise<any> => {
    try {
      return await ipcRenderer.invoke('read-people')
    } catch (error) {
      console.error('Error leyendo people:', error)
      return []
    }
  },

  // Guardar personas (nuevo sistema)
  savePeople: async (people: any): Promise<boolean> => {
    try {
      return await ipcRenderer.invoke('save-people', people)
    } catch (error) {
      console.error('Error guardando people:', error)
      return false
    }
  }
})

