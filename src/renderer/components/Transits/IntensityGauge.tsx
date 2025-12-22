import { useState } from 'react'
import { AlertTriangle, TrendingUp, HelpCircle, X } from 'lucide-react'
import ProgressBar from './ProgressBar'

interface IntensityGaugeProps {
  intensity: number
  level: 'Bajo' | 'Medio' | 'Alto' | 'Extremo'
  emoji: string
  recommendedMode: string
}

const levelColors = {
  Bajo: 'green' as const,
  Medio: 'blue' as const,
  Alto: 'orange' as const,
  Extremo: 'red' as const
}

const levelBgColors = {
  Bajo: 'bg-green-50 border-green-200',
  Medio: 'bg-blue-50 border-blue-200',
  Alto: 'bg-orange-50 border-orange-200',
  Extremo: 'bg-red-50 border-red-200'
}

export default function IntensityGauge({
  intensity,
  level,
  emoji,
  recommendedMode
}: IntensityGaugeProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  const color = levelColors[level]
  const bgColor = levelBgColors[level]

  const levelTextColors = {
    Bajo: 'text-green-700',
    Medio: 'text-blue-700',
    Alto: 'text-orange-700',
    Extremo: 'text-red-700'
  }

  const levelBorderColors = {
    Bajo: 'border-green-300',
    Medio: 'border-blue-300',
    Alto: 'border-orange-300',
    Extremo: 'border-red-300'
  }

  return (
    <div className={`${bgColor} border-2 rounded-xl p-6 mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Intensidad Global
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="¿Qué es la intensidad global?"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-4xl">{emoji}</span>
          <span className={`text-2xl font-bold px-4 py-2 rounded-lg bg-white border-2 ${levelBorderColors[level]} ${levelTextColors[level]}`}>
            {level}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <ProgressBar
          label="Intensidad"
          value={intensity}
          max={100}
          color={color}
          showValue={true}
          size="lg"
        />
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className={`w-5 h-5 ${level === 'Bajo' ? 'text-green-600' : level === 'Medio' ? 'text-blue-600' : level === 'Alto' ? 'text-orange-600' : 'text-red-600'} mt-0.5`} />
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Modo Recomendado:</p>
            <p className="text-lg font-bold text-gray-900">{recommendedMode}</p>
          </div>
        </div>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-white border border-gray-300 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-gray-900 font-semibold text-lg">📚 ¿Qué es la Intensidad Global?</h4>
            <button onClick={() => setShowExplanation(false)} className="text-gray-600 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              La <strong>Intensidad Global</strong> (0-100%) mide qué tan activos están los tránsitos planetarios hoy. 
              Combina la cantidad, fuerza y tipo de aspectos activos.
            </p>
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-bold text-green-900 mb-1">🟢 Bajo (0-30%)</p>
                <p className="text-green-800 text-xs">Pocos tránsitos activos. Día tranquilo, ideal para descanso y rutinas. No hay mucha presión astrológica.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-bold text-blue-900 mb-1">🔵 Medio (31-60%)</p>
                <p className="text-blue-800 text-xs">Intensidad normal. Día balanceado con algunos tránsitos activos. Puedes seguir con tus actividades normales.</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-bold text-orange-900 mb-1">🟠 Alto (61-80%)</p>
                <p className="text-orange-800 text-xs">Muchos tránsitos activos. Día intenso con cambios y oportunidades. Mantén la calma y aprovecha las energías.</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900 mb-1">🔴 Extremo (81-100%)</p>
                <p className="text-red-800 text-xs">Máxima intensidad astrológica. Día muy activo con múltiples tránsitos importantes. Puede haber cambios significativos. Cuídate y mantén el equilibrio.</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>💡 Recuerda:</strong> La intensidad no es "buena" o "mala", solo indica cuánta energía astrológica está activa. 
                Usa el "Modo Recomendado" para saber cómo manejar el día.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

