import { useState } from 'react'
import { Flame, Globe, Wind, Droplets, HelpCircle, X } from 'lucide-react'
import type { ElementDistribution } from '../../lib/astrology/chart-game-calculator'
import ProgressBar from '../Transits/ProgressBar'

interface ElementBarsProps {
  elements: ElementDistribution
}

const elementInfo = {
  fire: {
    name: 'Fuego',
    emoji: '🔥',
    description: 'Representa energía, pasión, acción y entusiasmo. Los signos de fuego (Aries, Leo, Sagitario) son dinámicos y espontáneos.',
    interpretation: (percent: number) => {
      if (percent >= 40) return 'Alta energía y pasión. Eres proactivo y entusiasta.'
      if (percent >= 25) return 'Energía equilibrada. Tienes pasión cuando es necesario.'
      return 'Energía más contenida. Oportunidad de cultivar más acción y entusiasmo.'
    }
  },
  earth: {
    name: 'Tierra',
    emoji: '🌍',
    description: 'Representa practicidad, estabilidad, organización y materialidad. Los signos de tierra (Tauro, Virgo, Capricornio) son realistas y estructurados.',
    interpretation: (percent: number) => {
      if (percent >= 40) return 'Alta practicidad y estabilidad. Eres organizado y confiable.'
      if (percent >= 25) return 'Practicidad equilibrada. Sabes ser realista cuando es necesario.'
      return 'Practicidad más flexible. Oportunidad de desarrollar más estructura y organización.'
    }
  },
  air: {
    name: 'Aire',
    emoji: '💨',
    description: 'Representa comunicación, mentalidad, objetividad y socialización. Los signos de aire (Géminis, Libra, Acuario) son intelectuales y comunicativos.',
    interpretation: (percent: number) => {
      if (percent >= 40) return 'Alta comunicación y mentalidad. Eres objetivo y sociable.'
      if (percent >= 25) return 'Comunicación equilibrada. Sabes ser objetivo cuando es necesario.'
      return 'Comunicación más intuitiva. Oportunidad de expandir diálogo y consideración de perspectivas.'
    }
  },
  water: {
    name: 'Agua',
    emoji: '💧',
    description: 'Representa emociones, sensibilidad, intuición y profundidad. Los signos de agua (Cáncer, Escorpio, Piscis) son empáticos y emocionales.',
    interpretation: (percent: number) => {
      if (percent >= 40) return 'Alta sensibilidad y empatía. Eres emocionalmente profundo.'
      if (percent >= 25) return 'Sensibilidad equilibrada. Sabes conectar emocionalmente cuando es necesario.'
      return 'Sensibilidad más contenida. Oportunidad de desarrollar más conexión emocional y empatía.'
    }
  }
}

export default function ElementBars({ elements }: ElementBarsProps) {
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null)

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">⚡</span>
        Elementos
      </h3>

      <div className="space-y-4">
        {/* Fuego */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-white font-semibold text-lg">🔥 Fuego</span>
            <span className="ml-auto text-orange-400 font-bold text-xl">{elements.fire}%</span>
            <button
              onClick={() => setTooltipOpen(tooltipOpen === 'fire' ? null : 'fire')}
              className="text-gray-400 hover:text-orange-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          {tooltipOpen === 'fire' && (
            <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-orange-500/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-orange-300 font-semibold">¿Qué es el elemento Fuego?</h4>
                <button onClick={() => setTooltipOpen(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-2">{elementInfo.fire.description}</p>
              <p className="text-orange-200 text-sm font-medium">{elementInfo.fire.interpretation(elements.fire)}</p>
            </div>
          )}
          <ProgressBar
            label=""
            value={elements.fire}
            max={100}
            color="orange"
            showValue={false}
            size="lg"
          />
        </div>

        {/* Tierra */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-green-500" />
            <span className="text-white font-semibold text-lg">🌍 Tierra</span>
            <span className="ml-auto text-green-400 font-bold text-xl">{elements.earth}%</span>
            <button
              onClick={() => setTooltipOpen(tooltipOpen === 'earth' ? null : 'earth')}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          {tooltipOpen === 'earth' && (
            <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-green-500/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-green-300 font-semibold">¿Qué es el elemento Tierra?</h4>
                <button onClick={() => setTooltipOpen(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-2">{elementInfo.earth.description}</p>
              <p className="text-green-200 text-sm font-medium">{elementInfo.earth.interpretation(elements.earth)}</p>
            </div>
          )}
          <ProgressBar
            label=""
            value={elements.earth}
            max={100}
            color="green"
            showValue={false}
            size="lg"
          />
        </div>

        {/* Aire */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold text-lg">💨 Aire</span>
            <span className="ml-auto text-blue-400 font-bold text-xl">{elements.air}%</span>
            <button
              onClick={() => setTooltipOpen(tooltipOpen === 'air' ? null : 'air')}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          {tooltipOpen === 'air' && (
            <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-blue-500/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-blue-300 font-semibold">¿Qué es el elemento Aire?</h4>
                <button onClick={() => setTooltipOpen(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-2">{elementInfo.air.description}</p>
              <p className="text-blue-200 text-sm font-medium">{elementInfo.air.interpretation(elements.air)}</p>
            </div>
          )}
          <ProgressBar
            label=""
            value={elements.air}
            max={100}
            color="blue"
            showValue={false}
            size="lg"
          />
        </div>

        {/* Agua */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            <span className="text-white font-semibold text-lg">💧 Agua</span>
            <span className="ml-auto text-cyan-400 font-bold text-xl">{elements.water}%</span>
            <button
              onClick={() => setTooltipOpen(tooltipOpen === 'water' ? null : 'water')}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          {tooltipOpen === 'water' && (
            <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-cyan-500/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-cyan-300 font-semibold">¿Qué es el elemento Agua?</h4>
                <button onClick={() => setTooltipOpen(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-2">{elementInfo.water.description}</p>
              <p className="text-cyan-200 text-sm font-medium">{elementInfo.water.interpretation(elements.water)}</p>
            </div>
          )}
          <ProgressBar
            label=""
            value={elements.water}
            max={100}
            color="blue"
            showValue={false}
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}

