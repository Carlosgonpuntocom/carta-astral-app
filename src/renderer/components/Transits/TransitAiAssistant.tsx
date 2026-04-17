import { useState, useEffect } from 'react'
import { Bot, Loader2 } from 'lucide-react'
import type { Transit, TransitSummary } from '../../types/astrology'
import type { DayEnergy } from '../../lib/astrology/energy-calculator'
import CollapsibleSection from '../CollapsibleSection'
import { transitsToPromptContext } from '../../lib/ai/transit-prompt-context'
import { requestTransitDaySummary, getAiServiceBaseUrl } from '../../lib/ai/ai-service-client'

const STORAGE_PREFIX = 'transit_ai_'

interface CachedTransitAi {
  response: string
  model: string
  provider: string
}

function storageKeyForDate(cacheDateKey: string): string {
  return `${STORAGE_PREFIX}${cacheDateKey}`
}

function readCache(cacheDateKey: string): CachedTransitAi | null {
  try {
    const raw = sessionStorage.getItem(storageKeyForDate(cacheDateKey))
    if (!raw) return null
    const o = JSON.parse(raw) as unknown
    if (!o || typeof o !== 'object') return null
    const c = o as Record<string, unknown>
    if (typeof c.response !== 'string') return null
    return {
      response: c.response,
      model: typeof c.model === 'string' ? c.model : '',
      provider: typeof c.provider === 'string' ? c.provider : ''
    }
  } catch {
    return null
  }
}

function writeCache(cacheDateKey: string, data: CachedTransitAi): void {
  sessionStorage.setItem(storageKeyForDate(cacheDateKey), JSON.stringify(data))
}

export interface TransitAiAssistantProps {
  transits: Transit[]
  summary: TransitSummary | null
  energies: DayEnergy
  /** Fragmento de fecha YYYY-MM-DD para sessionStorage (mismo día que la vista de tránsitos). */
  cacheDateKey: string
}

export default function TransitAiAssistant({
  transits,
  summary,
  energies,
  cacheDateKey
}: TransitAiAssistantProps) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ model: string; provider: string } | null>(null)
  const [desdeCache, setDesdeCache] = useState(false)

  const baseUrl = getAiServiceBaseUrl()

  useEffect(() => {
    setError(null)
    setDesdeCache(false)
    const cached = readCache(cacheDateKey)
    if (cached) {
      setRespuesta(cached.response)
      setMeta({ model: cached.model, provider: cached.provider })
      setDesdeCache(true)
    } else {
      setRespuesta(null)
      setMeta(null)
    }
  }, [cacheDateKey])

  const generar = async () => {
    setCargando(true)
    setError(null)
    setDesdeCache(false)
    try {
      const ctx = transitsToPromptContext(transits, summary, energies)
      const out = await requestTransitDaySummary(ctx)
      setRespuesta(out.response)
      setMeta({ model: out.model, provider: out.provider })
      writeCache(cacheDateKey, {
        response: out.response,
        model: out.model,
        provider: out.provider
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setCargando(false)
    }
  }

  return (
    <CollapsibleSection
      title="Resumen IA del día (opcional)"
      icon={<Bot className="w-5 h-5 text-purple-600" aria-hidden />}
      defaultExpanded={false}
      className="border border-purple-100"
    >
      <div className="space-y-4 p-2 -mt-2">
        <p className="text-sm text-gray-600">
          Complementa la guía del día con un texto breve generado por IA a partir de los tránsitos ya
          calculados. Requiere <strong>ai-service</strong> en{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">{baseUrl}</code>.
        </p>

        <button
          type="button"
          onClick={() => void generar()}
          disabled={cargando || transits.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Generar resumen del día con inteligencia artificial según tránsitos"
        >
          {cargando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Generando…
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" aria-hidden />
              Generar resumen IA
            </>
          )}
        </button>

        {cargando && (
          <p className="text-sm text-gray-500" role="status">
            Enviando contexto de tránsitos a ai-service; la respuesta puede tardar unos segundos.
          </p>
        )}

        {error && (
          <div
            className="rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm p-3"
            role="alert"
          >
            {error}
          </div>
        )}

        {respuesta && !cargando && (
          <details
            className="rounded-lg bg-gray-50 border border-gray-200 p-4"
            aria-label="Resumen del día generado por inteligencia artificial"
          >
            <summary className="cursor-pointer text-sm font-semibold text-purple-800 flex items-center gap-2">
              <span>Ver resumen IA</span>
              {desdeCache && (
                <span className="text-xs font-normal text-gray-500">(guardado en esta sesión)</span>
              )}
            </summary>
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {meta && (
                <p className="text-xs text-gray-500">
                  Modelo: <span className="font-mono">{meta.model}</span> · Proveedor:{' '}
                  <span className="font-mono">{meta.provider}</span>
                </p>
              )}
              <div className="text-gray-800 text-sm whitespace-pre-wrap">{respuesta}</div>
            </div>
          </details>
        )}
      </div>
    </CollapsibleSection>
  )
}
