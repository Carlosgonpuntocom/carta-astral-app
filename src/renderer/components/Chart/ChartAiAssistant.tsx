import { useState } from 'react'
import { Bot, Loader2 } from 'lucide-react'
import type { ChartData } from '../../types/astrology'
import CollapsibleSection from '../CollapsibleSection'
import { chartDataToPromptContext } from '../../lib/ai/chart-prompt-context'
import { requestChartSummary, getAiServiceBaseUrl } from '../../lib/ai/ai-service-client'

interface ChartAiAssistantProps {
  chartData: ChartData
}

export default function ChartAiAssistant({ chartData }: ChartAiAssistantProps) {
  const [preguntaOpcional, setPreguntaOpcional] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ model: string; provider: string } | null>(null)

  const baseUrl = getAiServiceBaseUrl()

  const generar = async () => {
    setCargando(true)
    setError(null)
    setRespuesta(null)
    setMeta(null)
    try {
      const ctx = chartDataToPromptContext(chartData)
      const q = preguntaOpcional.trim() || undefined
      const out = await requestChartSummary(ctx, q)
      setRespuesta(out.response)
      setMeta({ model: out.model, provider: out.provider })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setCargando(false)
    }
  }

  return (
    <CollapsibleSection
      title="Asistente de IA (opcional)"
      icon={<Bot className="w-5 h-5 text-indigo-600" aria-hidden />}
      defaultExpanded={false}
      className="border border-indigo-100"
    >
      <div className="space-y-4 p-2 -mt-2">
        <p className="text-sm text-gray-600">
          Genera un resumen divulgativo a partir de los datos ya calculados de esta carta. Requiere{' '}
          <strong>ai-service</strong> en{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">{baseUrl}</code> y un proveedor (p. ej. Ollama).
        </p>

        <div>
          <label htmlFor="chart-ai-pregunta" className="block text-sm font-medium text-gray-700 mb-1">
            Pregunta opcional (si la dejas vacía, solo se pide un resumen general)
          </label>
          <textarea
            id="chart-ai-pregunta"
            value={preguntaOpcional}
            onChange={(e) => setPreguntaOpcional(e.target.value)}
            rows={2}
            maxLength={500}
            disabled={cargando}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-label="Pregunta opcional para el asistente de IA sobre la carta"
            placeholder="Ej.: ¿Qué destacarías del Sol y la Luna en esta carta?"
          />
        </div>

        <button
          type="button"
          onClick={() => void generar()}
          disabled={cargando}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Generar resumen de la carta con inteligencia artificial"
        >
          {cargando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Generando…
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" aria-hidden />
              Generar resumen con IA
            </>
          )}
        </button>

        {cargando && (
          <p className="text-sm text-gray-500" role="status">
            Enviando datos de la carta a ai-service; la respuesta puede tardar unos segundos.
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

        {respuesta && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2">
            {meta && (
              <p className="text-xs text-gray-500">
                Modelo: <span className="font-mono">{meta.model}</span> · Proveedor:{' '}
                <span className="font-mono">{meta.provider}</span>
              </p>
            )}
            <div className="text-gray-800 text-sm whitespace-pre-wrap">{respuesta}</div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}
