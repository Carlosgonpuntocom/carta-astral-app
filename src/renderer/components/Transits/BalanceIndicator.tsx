import { useState } from 'react'
import { AlertCircle, Heart, TrendingUp, HelpCircle, X } from 'lucide-react'
import ProgressBar from './ProgressBar'

interface BalanceIndicatorProps {
  challenges: number
  opportunities: number
  totalTransits: number
}

export default function BalanceIndicator({
  challenges,
  opportunities,
  totalTransits
}: BalanceIndicatorProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  
  const challengePercentage = totalTransits > 0 ? (challenges / totalTransits) * 100 : 0
  const opportunityPercentage = totalTransits > 0 ? (opportunities / totalTransits) * 100 : 0
  
  // Calcular ratio de forma segura
  const ratio = opportunities > 0 ? (challenges / opportunities).toFixed(2) : challenges > 0 ? '∞' : '0'
  
  // Interpretación del ratio
  const getRatioExplanation = () => {
    if (opportunities === 0 && challenges === 0) {
      return 'No hay tránsitos activos en este momento.'
    }
    if (opportunities === 0) {
      return 'Solo desafíos activos. Momento de resistencia y crecimiento.'
    }
    if (challenges === 0) {
      return 'Solo oportunidades activas. ¡Aprovecha este momento favorable!'
    }
    
    const ratioValue = challenges / opportunities
    if (ratioValue < 0.5) {
      return `Tienes ${(1/ratioValue).toFixed(1)} veces más oportunidades que desafíos. Día muy favorable para avanzar.`
    } else if (ratioValue < 1) {
      return `Tienes ${(1/ratioValue).toFixed(1)} veces más oportunidades que desafíos. Día positivo con algunos retos.`
    } else if (ratioValue === 1) {
      return 'Equilibrio perfecto entre desafíos y oportunidades. Día balanceado.'
    } else if (ratioValue < 2) {
      return `Tienes ${ratioValue.toFixed(1)} veces más desafíos que oportunidades. Día con retos pero manejables.`
    } else {
      return `Tienes ${ratioValue.toFixed(1)} veces más desafíos que oportunidades. Día intenso, enfócate en resistir y aprender.`
    }
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-green-50 border-2 border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-gray-700" />
          Balance: Desafíos vs Oportunidades
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="¿Qué significa esto?"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-blue-900 font-semibold text-lg">📚 ¿Qué significan estos aspectos?</h4>
            <button onClick={() => setShowExplanation(false)} className="text-blue-600 hover:text-blue-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-blue-800 space-y-3">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="font-bold text-red-900 mb-2">🔴 DESAFÍOS (Cuadraturas y Oposiciones)</p>
              <p className="text-red-800 mb-2">Son aspectos que crean tensión o conflicto. No son "malos", sino momentos que requieren acción y crecimiento.</p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-red-700">
                <li><strong>Cuadratura (90°):</strong> Como un obstáculo en tu camino. Te fuerza a actuar, resolver y crecer. Ejemplo: "Tengo que enfrentar este problema ahora".</li>
                <li><strong>Oposición (180°):</strong> Dos fuerzas opuestas que necesitan equilibrio. Ejemplo: "Quiero libertad pero también seguridad". Necesitas encontrar el balance.</li>
              </ul>
              <p className="text-red-800 mt-2 italic">💡 Los desafíos te hacen más fuerte, pero requieren esfuerzo.</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="font-bold text-green-900 mb-2">🟢 OPORTUNIDADES (Trígonos y Sextiles)</p>
              <p className="text-green-800 mb-2">Son aspectos que facilitan el flujo de energía. Las cosas salen bien con menos esfuerzo.</p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-green-700">
                <li><strong>Trígono (120°):</strong> Flujo natural y armónico. Las cosas funcionan bien casi solas. Ejemplo: "Todo encaja perfectamente hoy".</li>
                <li><strong>Sextil (60°):</strong> Oportunidad de crecimiento que puedes aprovechar. Ejemplo: "Puedo aprender algo nuevo si lo intento".</li>
              </ul>
              <p className="text-green-800 mt-2 italic">💡 Las oportunidades son momentos favorables para avanzar y crecer.</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <p className="font-bold text-purple-900 mb-2">💡 ¿QUÉ SIGNIFICA EL RATIO?</p>
              <p className="text-purple-800 mb-2">
                El ratio compara cuántos desafíos tienes por cada oportunidad.
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-purple-700">
                <li><strong>Ratio 0.33 : 1</strong> = Tienes <strong>3 veces más oportunidades que desafíos</strong>. Por cada desafío hay 3 oportunidades. ¡Día muy favorable!</li>
                <li><strong>Ratio 1 : 1</strong> = Equilibrio perfecto. Mismo número de desafíos y oportunidades.</li>
                <li><strong>Ratio 2 : 1</strong> = Tienes el doble de desafíos que oportunidades. Día más intenso, pero manejable.</li>
              </ul>
              <p className="text-purple-800 mt-2">
                <strong>En tu caso:</strong> Ratio 0.33 : 1 significa que tienes <strong>3 veces más oportunidades que desafíos</strong>. 
                Es un día muy favorable para avanzar en tus proyectos y aprovechar las energías positivas.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Desafíos */}
        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <p className="font-bold text-gray-900">Desafíos</p>
              <p className="text-sm text-gray-600">Cuadraturas y Oposiciones</p>
              <p className="text-xs text-gray-500 mt-1">
                Momentos que requieren acción y crecimiento
              </p>
            </div>
            <span className="text-2xl font-bold text-red-600">{challenges}</span>
          </div>
          <ProgressBar
            label=""
            value={challengePercentage}
            max={100}
            color="red"
            showValue={false}
            size="md"
          />
          <p className="text-xs text-gray-500 mt-2">
            {challengePercentage.toFixed(0)}% del total de tránsitos
          </p>
        </div>

        {/* Oportunidades */}
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <p className="font-bold text-gray-900">Oportunidades</p>
              <p className="text-sm text-gray-600">Trígonos y Sextiles</p>
              <p className="text-xs text-gray-500 mt-1">
                Momentos favorables para avanzar y crecer
              </p>
            </div>
            <span className="text-2xl font-bold text-green-600">{opportunities}</span>
          </div>
          <ProgressBar
            label=""
            value={opportunityPercentage}
            max={100}
            color="green"
            showValue={false}
            size="md"
          />
          <p className="text-xs text-gray-500 mt-2">
            {opportunityPercentage.toFixed(0)}% del total de tránsitos
          </p>
        </div>
      </div>

      {/* Balance visual con explicación */}
      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900 text-lg">
            {challenges > opportunities ? '⚠️ Más desafíos' : 
             opportunities > challenges ? '✨ Más oportunidades' : 
             '⚖️ Equilibrado'}
          </span>
          <div className="text-right">
            <span className="text-sm text-gray-600">Ratio: </span>
            <span className="font-bold text-gray-900 text-lg">{ratio} : 1</span>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-gray-800 mb-2">
            📊 Interpretación:
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {getRatioExplanation()}
          </p>
        </div>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>💡 Recuerda:</strong> Los desafíos no son "malos", son momentos de crecimiento. 
            Las oportunidades son favorables, pero también requieren que actúes para aprovecharlas.
          </p>
        </div>
      </div>
    </div>
  )
}

