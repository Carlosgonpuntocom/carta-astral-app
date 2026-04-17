/**
 * Lectura sincrónica de people.json (misma convención que main.ts: dev → data/, prod → userData).
 * API con tsx (sin Electron): data/ en la raíz del repo o CARTA_ASTRAL_PEOPLE_JSON.
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
import path from 'path'

import type { SavedPerson } from '../../renderer/types/astrology'

const _require = createRequire(import.meta.url)
const __dirname_api = path.dirname(fileURLToPath(import.meta.url))

function getPeoplePath(): string {
  const fromEnv = process.env.CARTA_ASTRAL_PEOPLE_JSON?.trim()
  if (fromEnv) {
    return path.resolve(fromEnv)
  }
  const repoData = path.normalize(
    path.join(__dirname_api, '../../../data/people.json'),
  )
  if (process.env.NODE_ENV === 'development') {
    return repoData
  }
  if (!process.versions?.electron) {
    return repoData
  }
  const { app } = _require('electron') as { app: { getPath: (n: string) => string } }
  return path.join(app.getPath('userData'), 'people.json')
}

export function readPeopleSync(): SavedPerson[] {
  const filePath = getPeoplePath()
  if (!fs.existsSync(filePath)) {
    return []
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content) as unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getMyChart(): SavedPerson | null {
  const people = readPeopleSync()
  return people.find((p) => p.isSelf) || null
}
