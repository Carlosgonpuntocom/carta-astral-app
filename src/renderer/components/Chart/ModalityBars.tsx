import { Play, Lock, RefreshCw } from 'lucide-react'
import type { ModalityDistribution } from '../../lib/astrology/chart-game-calculator'
import ProgressBar from '../Transits/ProgressBar'

interface ModalityBarsProps {
  modalities: ModalityDistribution
}

export default function ModalityBars({ modalities }: ModalityBarsProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-xl p-6 border-2 border-indigo-600">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">🎯</span>
        Modalidades
      </h3>

      <div className="space-y-4">
        {/* Cardinal */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6 text-red-400" />
            <span className="text-white font-semibold text-lg">▶️ Cardinal</span>
            <span className="ml-auto text-red-400 font-bold text-xl">{modalities.cardinal}%</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">Iniciativa y liderazgo</p>
          <ProgressBar
            label=""
            value={modalities.cardinal}
            max={100}
            color="red"
            showValue={false}
            size="lg"
          />
        </div>

        {/* Fijo */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold text-lg">🔒 Fijo</span>
            <span className="ml-auto text-yellow-400 font-bold text-xl">{modalities.fixed}%</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">Persistencia y estabilidad</p>
          <ProgressBar
            label=""
            value={modalities.fixed}
            max={100}
            color="yellow"
            showValue={false}
            size="lg"
          />
        </div>

        {/* Mutable */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-6 h-6 text-green-400" />
            <span className="text-white font-semibold text-lg">🔄 Mutable</span>
            <span className="ml-auto text-green-400 font-bold text-xl">{modalities.mutable}%</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">Adaptabilidad y flexibilidad</p>
          <ProgressBar
            label=""
            value={modalities.mutable}
            max={100}
            color="green"
            showValue={false}
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}

