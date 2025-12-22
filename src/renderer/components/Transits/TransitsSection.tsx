import { useState, useEffect } from 'react'
import { TrendingUp, ArrowRight, AlertCircle, Heart } from 'lucide-react'
import type { ChartData, Transit } from '../../types/astrology'
import { calculateTransits, calculateTransitSummary } from '../../lib/astrology/transits'
import PlanetLink from './PlanetLink'

interface TransitsSectionProps {
  natalChart: ChartData | null
  onViewFullDashboard: () => void
}

export default function TransitsSection({ natalChart, onViewFullDashboard }: TransitsSectionProps) {
  const [summary, setSummary] = useState<{
    total: number
    tense: number
    harmonious: number
    mostImportant?: Transit
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (natalChart) {
      loadTodaySummary()
    }
  }, [natalChart])

  const loadTodaySummary = async () => {
    if (!natalChart) return

    setLoading(true)
    try {
      const today = new Date()
      const cacheKey = `transits_${today.toISOString().split('T')[0]}`
      
      // Intentar cargar desde caché primero
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          if (data.transits && data.transits.length > 0) {
            const transitSummary = data.summary || await calculateTransitSummary(data.transits, today, natalChart.birthData)
            setSummary({
              total: transitSummary.totalTransits,
              tense: transitSummary.tenseCount,
              harmonious: transitSummary.harmoniousCount,
              mostImportant: transitSummary.mostImportant
            })
            setLoading(false)
            return
          }
        } catch (e) {
          console.error('Error parsing cache in TransitsSection:', e)
        }
      }
      
      // Calcular si no hay caché válido
      const transits = await calculateTransits(natalChart, today)
      const transitSummary = await calculateTransitSummary(transits, today, natalChart.birthData)
      
      // Guardar en caché
      sessionStorage.setItem(cacheKey, JSON.stringify({ transits, summary: transitSummary }))

      setSummary({
        total: transitSummary.totalTransits,
        tense: transitSummary.tenseCount,
        harmonious: transitSummary.harmoniousCount,
        mostImportant: transitSummary.mostImportant
      })
    } catch (error) {
      console.error('Error cargando resumen de tránsitos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!natalChart) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Tránsitos Hoy</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Añade tu carta natal para ver tus tránsitos diarios.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Tránsitos Hoy</h2>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Calculando tránsitos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Tránsitos Hoy</h2>
        </div>
        <button
          onClick={onViewFullDashboard}
          className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 transition-colors"
        >
          Ver Completo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {summary ? (
        <div className="space-y-4">
          {/* Resumen numérico */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border-2 border-red-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-xs text-red-700 font-medium">Tensos</p>
              </div>
              <p className="text-2xl font-bold text-red-700">{summary.tense}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border-2 border-green-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-medium">Armónicos</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{summary.harmonious}</p>
            </div>
          </div>

          {/* Tránsito más importante */}
          {summary.mostImportant && (
            <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
              <p className="text-sm text-gray-600 mb-2 font-medium">⚡ Tránsito más importante:</p>
              <p className="text-lg font-bold text-gray-900">
                <PlanetLink planetName={summary.mostImportant.transitingPlanet} showIcon={false} className="font-bold" />{' '}
                {getAspectName(summary.mostImportant.aspect)}{' '}
                <PlanetLink planetName={summary.mostImportant.natalPoint} showIcon={false} className="font-bold" />
              </p>
              {summary.mostImportant.isExact && (
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                  ⚡ EXACTO
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No hay tránsitos activos en este momento.</p>
      )}
    </div>
  )
}

function getAspectName(aspect: string): string {
  const names: Record<string, string> = {
    conjunction: 'conjunción',
    opposition: 'oposición',
    trine: 'trígono',
    square: 'cuadratura',
    sextile: 'sextil'
  }
  return names[aspect] || aspect
}

