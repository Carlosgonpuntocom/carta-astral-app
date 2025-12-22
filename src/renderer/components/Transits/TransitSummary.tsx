import { useState } from 'react'
import { TrendingUp, AlertCircle, Heart, Zap, HelpCircle, X } from 'lucide-react'
import type { TransitSummary as TransitSummaryType } from '../../types/astrology'
import PlanetLink from './PlanetLink'
import SignLink from '../Chart/SignLink'

interface TransitSummaryProps {
  summary: TransitSummaryType
  date: Date
}

export default function TransitSummary({ summary, date }: TransitSummaryProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  
  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-6 sticky top-4 z-10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Tránsitos Activos
          </h2>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="¿Qué significan estos números?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <span className="text-sm text-gray-600 font-medium">{formatDate(date)}</span>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-blue-900 font-semibold text-lg">📚 ¿Qué significan estos números?</h4>
            <button onClick={() => setShowExplanation(false)} className="text-blue-600 hover:text-blue-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-blue-800 space-y-3">
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-2">📊 Total</p>
              <p className="text-gray-700 text-xs">Número total de tránsitos activos hoy. Un tránsito es cuando un planeta actual forma un aspecto (conjunción, cuadratura, etc.) con un planeta o punto de tu carta natal.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="font-bold text-red-900 mb-2">🔴 Tensos</p>
              <p className="text-red-800 text-xs">Tránsitos de cuadraturas (90°) y oposiciones (180°). Crean tensión pero también oportunidades de crecimiento. No son "malos", solo requieren más acción y atención.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="font-bold text-green-900 mb-2">🟢 Armónicos</p>
              <p className="text-green-800 text-xs">Tránsitos de trígonos (120°) y sextiles (60°). Facilitan el flujo de energía. Las cosas salen bien con menos esfuerzo. Momentos favorables para avanzar.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="font-bold text-yellow-900 mb-2">🟡 Conjunciones</p>
              <p className="text-yellow-800 text-xs">Cuando un planeta transitante está en el mismo grado que un planeta natal (0°). Puede ser intenso y transformador. El planeta transitante "activa" tu planeta natal.</p>
            </div>
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-800">
                <strong>💡 Tip:</strong> Un día con más tránsitos no es necesariamente "mejor" o "peor". 
                Lo importante es entender qué significan y cómo aprovecharlos. Revisa cada tránsito individual para más detalles.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalTransits}</p>
        </div>

        {/* Tensos */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700 font-medium">Tensos</p>
          </div>
          <p className="text-2xl font-bold text-red-700">{summary.tenseCount}</p>
        </div>

        {/* Armónicos */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">Armónicos</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{summary.harmoniousCount}</p>
        </div>

        {/* Conjunciones */}
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-700 font-medium">Conjunciones</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{summary.conjunctionCount}</p>
        </div>
      </div>

      {/* Tránsito más importante */}
      {summary.mostImportant && (
        <div className="mt-4 bg-white rounded-lg p-4 border-2 border-purple-300">
          <p className="text-sm text-gray-600 mb-2 font-medium">⚡ Tránsito más importante:</p>
          <p className="text-lg font-bold text-gray-900 flex items-center gap-1 flex-wrap">
            <PlanetLink planetName={summary.mostImportant.transitingPlanet} showIcon={false} />
            <span>{getAspectName(summary.mostImportant.aspect)}</span>
            <PlanetLink planetName={summary.mostImportant.natalPoint} showIcon={false} />
          </p>
          {summary.mostImportant.isExact && (
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
              ⚡ EXACTO
            </span>
          )}
        </div>
      )}

      {/* Posiciones Sol/Luna */}
      {(summary.sunPosition || summary.moonPosition) && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {summary.sunPosition && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">☉</span>
              <span className="text-gray-700">
                <strong>Sol:</strong> {summary.sunPosition.degree.toFixed(1)}° en <SignLink signName={summary.sunPosition.sign} showIcon={false} className="text-sm" />
              </span>
            </div>
          )}
          {summary.moonPosition && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="text-gray-700">
                <strong>Luna:</strong> {summary.moonPosition.degree.toFixed(1)}° en <SignLink signName={summary.moonPosition.sign} showIcon={false} className="text-sm" />
              </span>
            </div>
          )}
        </div>
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

