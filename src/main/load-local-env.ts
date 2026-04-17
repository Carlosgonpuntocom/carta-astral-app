import fs from 'fs'
import path from 'path'

/**
 * Carga `.env` desde la raíz del proyecto (cwd en dev) sin dependencia dotenv.
 * No sobrescribe variables ya definidas en el entorno.
 */
export function loadLocalEnv(): void {
  const file = path.join(process.cwd(), '.env')
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch {
    return
  }
  for (const line of raw.split(/\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = val
    }
  }
}
