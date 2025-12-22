import { useState } from 'react'
import { Zap, Brain, Heart, Target, Sparkles, Shield, HelpCircle, X } from 'lucide-react'
import type { DayEnergy } from '../../lib/astrology/energy-calculator'
import ProgressBar from './ProgressBar'

interface EnergyMeterProps {
  energy: DayEnergy
}

const energyConfig = [
  { key: 'action' as const, label: 'Acción', icon: Zap, color: 'red' as const, iconColor: 'text-red-600', description: 'Energía física y determinación' },
  { key: 'mental' as const, label: 'Mental', icon: Brain, color: 'blue' as const, iconColor: 'text-blue-600', description: 'Claridad y comunicación' },
  { key: 'emotional' as const, label: 'Emocional', icon: Heart, color: 'purple' as const, iconColor: 'text-purple-600', description: 'Sensibilidad y conexión' },
  { key: 'manifestation' as const, label: 'Manifestación', icon: Target, color: 'green' as const, iconColor: 'text-green-600', description: 'Materialización y estructura' },
  { key: 'creativity' as const, label: 'Creatividad', icon: Sparkles, color: 'yellow' as const, iconColor: 'text-yellow-600', description: 'Expresión artística' },
  { key: 'resistance' as const, label: 'Resistencia', icon: Shield, color: 'orange' as const, iconColor: 'text-orange-600', description: 'Capacidad de manejar desafíos' }
]

export default function EnergyMeter({ energy }: EnergyMeterProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-indigo-600" />
          Energía del Día
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="¿Qué significan estas energías?"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-blue-900 font-semibold text-lg">📚 ¿Qué es la Energía del Día?</h4>
            <button onClick={() => setShowExplanation(false)} className="text-blue-600 hover:text-blue-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-blue-800 space-y-3">
            <p className="text-blue-900 font-medium">
              La energía del día se calcula según los tránsitos planetarios activos. Cada tipo de energía (0-10) 
              indica qué tan favorable es el día para diferentes actividades.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900 mb-1">🔥 Acción (0-10)</p>
                <p className="text-red-800 text-xs">Energía física, determinación y capacidad de iniciar cosas. Alta = buen momento para decisiones importantes y proyectos nuevos. Baja = mejor para descansar y tareas rutinarias.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-bold text-blue-900 mb-1">🧠 Mental (0-10)</p>
                <p className="text-blue-800 text-xs">Claridad mental, comunicación y capacidad de aprendizaje. Alta = excelente para estudiar, escribir, negociar. Baja = mejor evitar decisiones complejas.</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="font-bold text-purple-900 mb-1">💜 Emocional (0-10)</p>
                <p className="text-purple-800 text-xs">Sensibilidad, conexión con otros y expresión de sentimientos. Alta = buen momento para relaciones y arte. Baja = mejor procesar emociones internamente.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-bold text-green-900 mb-1">🎯 Manifestación (0-10)</p>
                <p className="text-green-800 text-xs">Capacidad de materializar ideas en realidad. Alta = buen momento para proyectos prácticos y trabajo. Baja = mejor planificar que ejecutar.</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="font-bold text-yellow-900 mb-1">✨ Creatividad (0-10)</p>
                <p className="text-yellow-800 text-xs">Expresión artística, innovación e inspiración. Alta = excelente para arte, música, diseño. Baja = mejor seguir rutinas establecidas.</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-bold text-orange-900 mb-1">🛡️ Resistencia (0-10)</p>
                <p className="text-orange-800 text-xs">Capacidad de manejar desafíos y presión. Alta = puedes aguantar situaciones difíciles. Baja = mejor evitar conflictos y estrés.</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>💡 Tip:</strong> Usa estos valores para planificar tu día. Si "Acción" está alta, inicia proyectos. Si "Mental" está alta, estudia o trabaja en tareas intelectuales.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {energyConfig.map(({ key, label, icon: Icon, color, iconColor, description }) => (
          <div key={key} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <div>
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            <ProgressBar
              label=""
              value={energy[key]}
              max={10}
              color={color}
              showValue={true}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

