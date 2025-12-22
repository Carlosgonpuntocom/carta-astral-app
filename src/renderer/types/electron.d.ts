// Tipos para la API de Electron expuesta en preload
export interface ElectronAPI {
  readChart: () => Promise<any>
  saveChart: (chartData: any) => Promise<boolean>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

