import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

// Convertir funciones de fs a promesas
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

// Función para obtener la ruta del archivo de datos (legacy)
function getChartPath(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../data/chart.json')
  } else {
    return path.join(app.getPath('userData'), 'chart.json')
  }
}

// Función para obtener la ruta del archivo de personas (nuevo)
function getPeoplePath(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../data/people.json')
  } else {
    return path.join(app.getPath('userData'), 'people.json')
  }
}

// Función para obtener el directorio de datos
function getDataDir(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../data')
  } else {
    return app.getPath('userData')
  }
}

// Función para verificar si un archivo existe
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

// Función para asegurar que el directorio existe
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await access(dirPath, fs.constants.F_OK)
  } catch {
    // Si no existe, crear el directorio
    await mkdir(dirPath, { recursive: true })
  }
}

// Función para crear la ventana principal
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // En desarrollo, cargar desde Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // En producción, cargar archivo local desde src/renderer
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// Handlers IPC para leer y guardar chart (legacy - para migración)
ipcMain.handle('read-chart', async () => {
  const filePath = getChartPath()
  try {
    if (await fileExists(filePath)) {
      const data = await readFile(filePath, 'utf-8')
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error('Error leyendo chart:', error)
    return null
  }
})

ipcMain.handle('save-chart', async (_event, chartData: any) => {
  const filePath = getChartPath()
  try {
    await ensureDir(path.dirname(filePath))
    await writeFile(filePath, JSON.stringify(chartData, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error guardando chart:', error)
    return false
  }
})

// Handlers IPC para leer y guardar personas (nuevo sistema)
ipcMain.handle('read-people', async () => {
  const filePath = getPeoplePath()
  try {
    if (await fileExists(filePath)) {
      const data = await readFile(filePath, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error leyendo people:', error)
    return []
  }
})

ipcMain.handle('save-people', async (_event, people: any) => {
  const filePath = getPeoplePath()
  try {
    await ensureDir(path.dirname(filePath))
    await writeFile(filePath, JSON.stringify(people, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error guardando people:', error)
    return false
  }
})

// Cuando Electron está listo, crear la ventana
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Cerrar cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

