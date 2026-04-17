/**
 * API HTTP local (:8060) para consultas astrológicas (Roberta / dashboard).
 * Contrato: éxito `{ data: ... }`, error `{ detail: "..." }` en español.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import express, { type Request, type Response } from 'express'
import cors from 'cors'

import { calculateChart } from '../../renderer/lib/astrology/calculator'
import {
  calculateTransitSummary,
  calculateTransits,
} from '../../renderer/lib/astrology/transits'
import type { Transit, TransitAspectType } from '../../renderer/types/astrology'
import { getMyChart } from './data-reader'

const PORT = Number(process.env.CARTA_ASTRAL_API_PORT || 8060)

function aspectToSpanish(a: TransitAspectType): string {
  const m: Record<TransitAspectType, string> = {
    conjunction: 'Conjunción',
    opposition: 'Oposición',
    trine: 'Trígono',
    square: 'Cuadratura',
    sextile: 'Sextil',
  }
  return m[a] ?? a
}

function buildVoiceSummary(
  sun: { sign: string; degree: number } | undefined,
  moon: { sign: string; degree: number } | undefined,
  transits: Transit[],
): string {
  let summary = ''
  if (sun) {
    summary += `El Sol está en ${sun.sign} a ${Math.round(sun.degree)} grados. `
  }
  if (moon) {
    summary += `La Luna está en ${moon.sign} a ${Math.round(moon.degree)} grados. `
  }
  if (transits.length > 0) {
    const t = transits[0]
    summary += `${t.transitingPlanet} forma ${aspectToSpanish(t.aspect)} con tu ${t.natalPoint} natal. `
    if (t.interpretation) {
      summary += t.interpretation
    }
  }
  return summary.trim() || 'No hay tránsitos destacados hoy.'
}

export function createApiApp(): express.Express {
  const app = express()

  app.use(
    cors({
      origin: [
        'http://localhost:9000',
        'http://127.0.0.1:9000',
        'http://127.0.0.1:8100',
        'http://localhost:8100',
      ],
    }),
  )
  app.use(express.json())

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      data: {
        status: 'ok',
        service: 'carta-astral-api',
        port: PORT,
      },
    })
  })

  app.get('/api/v1/daily-summary', async (req: Request, res: Response) => {
    try {
      const myChart = getMyChart()
      if (!myChart) {
        return res.status(404).json({
          detail:
            'No hay carta natal configurada. Marca una persona como «Yo» en la app y guarda.',
        })
      }

      const dateStr = (req.query.date as string | undefined)?.trim()
      const targetDate = dateStr ? new Date(dateStr) : new Date()
      if (Number.isNaN(targetDate.getTime())) {
        return res.status(422).json({ detail: 'Parámetro date inválido (usa YYYY-MM-DD).' })
      }

      const natalChart = await calculateChart(myChart.birthData)
      const transits = await calculateTransits(natalChart, targetDate)
      const summary = await calculateTransitSummary(
        transits,
        targetDate,
        myChart.birthData,
      )

      const sun = summary.sunPosition
      const moon = summary.moonPosition

      const destacados = transits.slice(0, 5).map((t) => ({
        planeta_transito: t.transitingPlanet,
        aspecto: aspectToSpanish(t.aspect),
        planeta_natal: t.natalPoint,
        interpretacion: t.interpretation ?? '',
      }))

      const resumenVoz = buildVoiceSummary(sun, moon, transits)

      res.json({
        data: {
          fecha: summary.date,
          sol: sun
            ? { signo: sun.sign, grado: sun.degree }
            : null,
          luna: moon
            ? { signo: moon.sign, grado: moon.degree }
            : null,
          transitos_destacados: destacados,
          resumen_voz: resumenVoz,
          energia_general: transits.length > 0 ? 'variable' : 'neutra',
        },
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Error desconocido al calcular'
      res.status(500).json({ detail: `Error calculando resumen: ${msg}` })
    }
  })

  app.get('/api/v1/transits', async (req: Request, res: Response) => {
    try {
      const myChart = getMyChart()
      if (!myChart) {
        return res.status(404).json({
          detail: 'No hay carta natal configurada.',
        })
      }

      const dateStr = (req.query.date as string | undefined)?.trim()
      const date = dateStr ? new Date(dateStr) : new Date()
      if (Number.isNaN(date.getTime())) {
        return res.status(422).json({ detail: 'Parámetro date inválido (usa YYYY-MM-DD).' })
      }

      const natalChart = await calculateChart(myChart.birthData)
      const transits = await calculateTransits(natalChart, date)

      res.json({
        data: {
          fecha: date.toISOString().split('T')[0],
          transitos: transits.map((t) => ({
            planeta_transito: t.transitingPlanet,
            signo_transito: t.transitingPosition.sign,
            grado_transito: t.transitingPosition.degree,
            aspecto: aspectToSpanish(t.aspect),
            planeta_natal: t.natalPoint,
            signo_natal: t.natalPosition.sign,
            orbe: t.orb,
            exacto: t.isExact,
            interpretacion: t.interpretation ?? '',
          })),
        },
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Error desconocido al calcular'
      res.status(500).json({ detail: `Error calculando tránsitos: ${msg}` })
    }
  })

  app.get('/api/v1/natal-chart', async (_req: Request, res: Response) => {
    try {
      const myChart = getMyChart()
      if (!myChart) {
        return res.status(404).json({
          detail: 'No hay carta natal configurada.',
        })
      }

      const chart = await calculateChart(myChart.birthData)

      res.json({
        data: {
          nombre: myChart.name,
          fecha_nacimiento: myChart.birthData.date,
          lugar: myChart.birthData.place,
          planetas: chart.planets.map((p) => ({
            planeta: p.name,
            signo: p.sign,
            grado: p.degree,
            casa: p.house,
          })),
          ascendente: chart.ascendant
            ? { signo: chart.ascendant }
            : null,
          medio_cielo: chart.midheaven
            ? { signo: chart.midheaven }
            : null,
        },
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Error desconocido'
      res.status(500).json({ detail: `Error obteniendo carta natal: ${msg}` })
    }
  })

  app.get('/api/v1/current-sky', async (_req: Request, res: Response) => {
    try {
      const myChart = getMyChart()
      if (!myChart) {
        return res.status(404).json({
          detail: 'No hay carta natal configurada (se usan coordenadas del perfil para el cielo).',
        })
      }

      const natalChart = await calculateChart(myChart.birthData)
      const now = new Date()
      const transits = await calculateTransits(natalChart, now)
      const summary = await calculateTransitSummary(
        transits,
        now,
        myChart.birthData,
      )

      res.json({
        data: {
          fecha: summary.date,
          sol: summary.sunPosition ?? null,
          luna: summary.moonPosition ?? null,
        },
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Error desconocido'
      res.status(500).json({ detail: `Error calculando cielo actual: ${msg}` })
    }
  })

  return app
}

export function startApiServer(): void {
  const app = createApiApp()
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`[carta-astral-api] Escuchando en http://127.0.0.1:${PORT}`)
  })
}

function isMainModule(): boolean {
  const entry = process.argv[1]
  if (!entry) {
    return false
  }
  const here = path.normalize(fileURLToPath(import.meta.url))
  const run = path.normalize(path.resolve(entry))
  return here === run
}

if (isMainModule()) {
  startApiServer()
}
