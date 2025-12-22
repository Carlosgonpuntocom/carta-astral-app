// Declarar tipos para electronAPI (definido en preload)
declare global {
  interface Window {
    electronAPI: {
      readChart: () => Promise<any>
      saveChart: (chartData: any) => Promise<boolean>
    }
  }
}

import type { ChartData } from '../../types/astrology'

export async function loadChart(): Promise<ChartData | null> {
  if (window.electronAPI) {
    return await window.electronAPI.readChart()
  }
  // Fallback: usar localStorage en desarrollo web
  const stored = localStorage.getItem('chart')
  return stored ? JSON.parse(stored) : null
}

export async function saveChart(chartData: ChartData): Promise<boolean> {
  if (window.electronAPI) {
    return await window.electronAPI.saveChart(chartData)
  }
  // Fallback: usar localStorage en desarrollo web
  try {
    localStorage.setItem('chart', JSON.stringify(chartData))
    return true
  } catch (error) {
    console.error('Error guardando chart:', error)
    return false
  }
}

