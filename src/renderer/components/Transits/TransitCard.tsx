import { useState } from 'react'
import { AlertCircle, Heart, Zap, TrendingUp, HelpCircle, X } from 'lucide-react'
import type { Transit } from '../../types/astrology'
import ProgressBar from './ProgressBar'
import PlanetLink from './PlanetLink'
import SignLink from '../Chart/SignLink'

interface TransitCardProps {
  transit: Transit
}

export default function TransitCard({ transit }: TransitCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  const aspectColors = getAspectColors(transit.aspect, transit.isTense, transit.isHarmonious)
  const aspectIcon = getAspectIcon(transit.aspect)
  const aspectName = getAspectName(transit.aspect)

  return (
    <div className={`border-2 rounded-xl p-5 mb-4 transition-all hover:shadow-lg ${aspectColors.bg} ${aspectColors.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${aspectColors.iconBg}`}>
            {aspectIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                <PlanetLink planetName={transit.transitingPlanet} showIcon={false} />
                <span className="text-gray-700">{aspectName}</span>
                <PlanetLink planetName={transit.natalPoint} showIcon={false} />
              </h3>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="¿Qué significan estos conceptos?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            {transit.isExact && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                ⚡ EXACTO
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Fuerza</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${aspectColors.bar}`}
                style={{ width: `${(transit.strength / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{transit.strength}/10</span>
          </div>
        </div>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-blue-900 font-semibold text-lg">📚 Conceptos de este tránsito</h4>
            <button onClick={() => setShowExplanation(false)} className="text-blue-600 hover:text-blue-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-blue-800 space-y-3">
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">🔄 ¿Qué es un tránsito?</p>
              <p className="text-gray-700 text-xs">Un tránsito ocurre cuando un planeta en el cielo (transitante) forma un aspecto con un planeta o punto de tu carta natal. Es como si el planeta actual "activara" algo de tu personalidad natal.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">📐 Orbe</p>
              <p className="text-gray-700 text-xs">El orbe es cuántos grados de diferencia hay entre el aspecto perfecto (ej: 90° exacto) y el aspecto actual. Cuanto menor el orbe (ej: 0.5°), más exacto y fuerte es el tránsito. Orbe 0° = perfecto.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">💪 Fuerza (1-10)</p>
              <p className="text-gray-700 text-xs">Mide qué tan importante es este tránsito. Se calcula según: exactitud del orbe, si es planeta lento (más fuerte) o rápido, y si afecta puntos importantes como Sol, Luna o Ascendente.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">🎯 Exactitud (1-10)</p>
              <p className="text-gray-700 text-xs">Mide qué tan cerca está el aspecto de ser perfecto. 10/10 = exacto (orbe 0°), 1/10 = dentro del orbe permitido pero lejos del aspecto perfecto.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">➡️ Estado: Aplicando vs Separando</p>
              <p className="text-gray-700 text-xs">
                <strong>Aplicando:</strong> El planeta se está acercando al aspecto exacto. El tránsito se está intensificando. ⬆️<br/>
                <strong>Separando:</strong> El planeta ya pasó el aspecto exacto y se está alejando. El tránsito se está debilitando. ⬇️
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-1">⚡ EXACTO</p>
              <p className="text-gray-700 text-xs">Cuando el orbe es menor a 0.5°, el tránsito está en su punto máximo de intensidad. Es el momento más fuerte del tránsito.</p>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>💡 Tip:</strong> Los tránsitos no son "buenos" o "malos", son energías que puedes aprovechar. 
                Los tensos requieren acción, los armónicos facilitan el flujo natural.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Posiciones */}
      <div className="bg-white/50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600 mb-1">
              <PlanetLink planetName={transit.transitingPlanet} className="font-semibold" /> transitando:
            </p>
            <p className="text-gray-900 font-medium">
              {transit.transitingPosition.degree.toFixed(1)}° en <SignLink signName={transit.transitingPosition.sign} showIcon={false} className="text-sm" />
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">
              Tu <PlanetLink planetName={transit.natalPoint} className="font-semibold" /> natal:
            </p>
            <p className="text-gray-900 font-medium">
              {transit.natalPosition.degree.toFixed(1)}° en <SignLink signName={transit.natalPosition.sign} showIcon={false} className="text-sm" />
            </p>
          </div>
        </div>
      </div>

      {/* Detalles del aspecto */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Aspecto:</span>
          <span className="font-semibold text-gray-900">{aspectName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Orbe:</span>
          <span className="font-semibold text-gray-900">{transit.orb.toFixed(1)}°</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Estado:</span>
          <span className={`font-semibold ${transit.isApplying ? 'text-green-600' : 'text-orange-600'}`}>
            {transit.isApplying ? 'Aplicando' : 'Separando'}
          </span>
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-white/70 rounded-lg p-3 border-l-4 border-purple-400 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-semibold text-purple-700">📝</span> {transit.interpretation}
        </p>
      </div>

      {/* Barras de progreso gamificadas */}
      <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
        <ProgressBar
          label="Fuerza"
          value={transit.strength}
          max={10}
          color={transit.isTense ? 'red' : transit.isHarmonious ? 'green' : 'blue'}
          showValue={true}
          size="sm"
        />
        
        <ProgressBar
          label="Exactitud"
          value={calculateAccuracy(transit.orb, transit.isExact)}
          max={10}
          color="purple"
          showValue={true}
          size="sm"
        />
      </div>
    </div>
  )
}

function getAspectColors(
  aspect: string,
  isTense: boolean,
  isHarmonious: boolean
): { bg: string; border: string; iconBg: string; bar: string } {
  if (aspect === 'conjunction') {
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      iconBg: 'bg-yellow-100',
      bar: 'bg-yellow-500'
    }
  }
  
  if (isTense) {
    return {
      bg: 'bg-red-50',
      border: 'border-red-400',
      iconBg: 'bg-red-100',
      bar: 'bg-red-500'
    }
  }
  
  if (isHarmonious) {
    return {
      bg: 'bg-green-50',
      border: 'border-green-400',
      iconBg: 'bg-green-100',
      bar: 'bg-green-500'
    }
  }
  
  return {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    iconBg: 'bg-blue-100',
    bar: 'bg-blue-500'
  }
}

function getAspectIcon(aspect: string) {
  switch (aspect) {
    case 'conjunction':
      return <Zap className="w-5 h-5 text-yellow-600" />
    case 'opposition':
    case 'square':
      return <AlertCircle className="w-5 h-5 text-red-600" />
    case 'trine':
    case 'sextile':
      return <Heart className="w-5 h-5 text-green-600" />
    default:
      return <TrendingUp className="w-5 h-5 text-blue-600" />
  }
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

// Función para calcular exactitud basada en orbe
// Orbe 0° = 10/10, orbe máximo permitido = 1/10
function calculateAccuracy(orb: number, isExact: boolean): number {
  if (isExact) {
    return 10 // Exacto = máxima exactitud
  }
  
  // Si el orbe es muy grande (fuera de rango normal), dar valor mínimo
  if (orb > 5) {
    return 1
  }
  
  // Calcular exactitud: cuanto menor el orbe, mayor la exactitud
  // Orbe 0° = 10, orbe 5° = 1
  // Fórmula: 10 - (orb / 5) * 9, pero nunca menos de 1
  const accuracy = Math.max(1, 10 - (orb / 5) * 9)
  return Math.round(accuracy * 10) / 10
}

