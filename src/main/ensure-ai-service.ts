/**
 * Al abrir Carta Astral: si ai-service no responde, intentar arrancar start.bat / start.sh
 * bajo SERVICES_ROOT (ecosistema D:\services\).
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const DEFAULT_AI_URL = 'http://127.0.0.1:8100'
const DEFAULT_WINDOWS_SERVICES = 'D:\\services'

export function resolveAiServiceBaseUrl(): string {
  const raw = process.env.AI_SERVICE_URL?.trim()
  if (raw) return raw.replace(/\/$/, '')
  return DEFAULT_AI_URL.replace(/\/$/, '')
}

export function healthCheckUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/health`
}

export function shouldAutoStartAiService(): boolean {
  const v = process.env.AUTO_START_AI_SERVICE?.trim().toLowerCase()
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false
  return true
}

export function resolveServicesRoot(): string | null {
  const explicit = process.env.SERVICES_ROOT?.trim()
  if (explicit) return path.normalize(explicit)
  if (process.platform === 'win32') return path.normalize(DEFAULT_WINDOWS_SERVICES)
  return null
}

export function resolveAiServiceStartScript(servicesRoot: string): string {
  const sub = path.join(servicesRoot, 'ai-service')
  if (process.platform === 'win32') {
    return path.join(sub, 'start.bat')
  }
  return path.join(sub, 'start.sh')
}

export async function checkAiServiceHealth(
  baseUrl: string,
  fetchFn: typeof fetch,
  timeoutMs: number
): Promise<boolean> {
  const url = healthCheckUrl(baseUrl)
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetchFn(url, { signal: controller.signal, method: 'GET' })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

export async function waitForAiServiceHealth(
  baseUrl: string,
  fetchFn: typeof fetch,
  options: { maxWaitMs: number; intervalMs: number; timeoutPerCheckMs: number }
): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < options.maxWaitMs) {
    if (await checkAiServiceHealth(baseUrl, fetchFn, options.timeoutPerCheckMs)) {
      return true
    }
    await new Promise((r) => setTimeout(r, options.intervalMs))
  }
  return false
}

/** Windows: ventana minimizada, proceso independiente del Electron. */
export function launchAiServiceWindows(startBatPath: string): void {
  const comspec = process.env.ComSpec || 'cmd.exe'
  const child = spawn(comspec, ['/c', 'start', '/min', '', startBatPath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  })
  child.unref()
}

export function launchAiServiceUnix(startShPath: string): void {
  const child = spawn('/bin/bash', [startShPath], {
    detached: true,
    stdio: 'ignore'
  })
  child.unref()
}

export async function ensureAiServiceRunning(): Promise<void> {
  if (!shouldAutoStartAiService()) {
    console.info('[carta-astral] AUTO_START_AI_SERVICE desactivado; no se arranca ai-service.')
    return
  }

  const baseUrl = resolveAiServiceBaseUrl()
  const fetchFn = globalThis.fetch.bind(globalThis)

  if (await checkAiServiceHealth(baseUrl, fetchFn, 2500)) {
    console.info('[carta-astral] ai-service ya disponible en', baseUrl)
    return
  }

  const servicesRoot = resolveServicesRoot()
  if (!servicesRoot) {
    console.error(
      '[carta-astral] ai-service no responde. Define SERVICES_ROOT (ruta al clon de services) para auto-arranque en este SO, o inicia ai-service a mano.'
    )
    return
  }

  const scriptPath = resolveAiServiceStartScript(servicesRoot)
  try {
    await fs.access(scriptPath, fs.constants.F_OK)
  } catch {
    console.error(
      '[carta-astral] No existe el script de arranque:',
      scriptPath,
      '— revisa SERVICES_ROOT o arranca ai-service manualmente.'
    )
    return
  }

  console.info('[carta-astral] Arrancando ai-service desde', scriptPath)
  try {
    if (process.platform === 'win32') {
      launchAiServiceWindows(scriptPath)
    } else {
      launchAiServiceUnix(scriptPath)
    }
  } catch (e) {
    console.error('[carta-astral] Error al lanzar ai-service:', e)
    return
  }

  const ok = await waitForAiServiceHealth(baseUrl, fetchFn, {
    maxWaitMs: 60_000,
    intervalMs: 2000,
    timeoutPerCheckMs: 3000
  })
  if (ok) {
    console.info('[carta-astral] ai-service respondiendo en', baseUrl)
  } else {
    console.error(
      '[carta-astral] ai-service no respondió a tiempo en',
      baseUrl,
      '— revisa .env en ai-service, Ollama, o arranca con start.bat y mira la consola.'
    )
  }
}
