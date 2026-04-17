import { loadLocalEnv } from './load-local-env'
import { app, BrowserWindow, ipcMain, Menu, type MenuItemConstructorOptions } from 'electron'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { ensureAiServiceRunning } from './ensure-ai-service'
import { startApiServer } from './api/server'

loadLocalEnv()

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

/** Menú mínimo en desarrollo: sin esto, en algunos equipos no aparece barra ni atajos para DevTools. */
function setDevelopmentMenu(mainWindow: BrowserWindow): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Ver',
      submenu: [
        {
          label: 'Recargar',
          accelerator: 'F5',
          click: () => mainWindow.reload()
        },
        {
          label: 'Consola / DevTools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow.webContents.isDevToolsOpened()) {
              mainWindow.webContents.closeDevTools()
            } else {
              mainWindow.webContents.openDevTools({ mode: 'detach' })
            }
          }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  mainWindow.setMenuBarVisibility(true)
}

// Función para crear la ventana principal
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Desarrollo: URL real del dev server (electron-vite inyecta ELECTRON_RENDERER_URL; si 5173 está ocupado, el puerto cambia).
  const devRendererUrl = process.env.ELECTRON_RENDERER_URL
  if (devRendererUrl) {
    setDevelopmentMenu(mainWindow)
    mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
      console.error('[main] did-fail-load', { code, desc, url })
    })
    void mainWindow.loadURL(devRendererUrl).then(() => {
      // Ventana aparte: más fácil de ver que el panel acoplado si la página falla o está en blanco.
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    })
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
  void ensureAiServiceRunning()
  createWindow()
  startApiServer()

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

