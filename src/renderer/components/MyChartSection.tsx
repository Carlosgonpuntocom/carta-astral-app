import { User, Eye, Edit } from 'lucide-react'
import type { SavedPerson } from '../types/astrology'

interface MyChartSectionProps {
  myChart: SavedPerson | null
  onViewChart: () => void
  onEditChart: () => void
}

export default function MyChartSection({ myChart, onViewChart, onEditChart }: MyChartSectionProps) {
  if (!myChart) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Mi Carta Astral</h2>
        </div>
        <p className="text-blue-100 mb-4">
          Aún no has guardado tu carta astral. Crea tu carta para empezar.
        </p>
        <button
          onClick={onEditChart}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Crear Mi Carta
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Mi Carta Astral</h2>
            <p className="text-purple-100 text-sm">{myChart.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onViewChart}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Carta
          </button>
          <button
            onClick={onEditChart}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors font-semibold flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-purple-200">Fecha de nacimiento</p>
          <p className="font-semibold">{myChart.birthData.date}</p>
        </div>
        <div>
          <p className="text-purple-200">Lugar</p>
          <p className="font-semibold">{myChart.birthData.place}</p>
        </div>
      </div>
    </div>
  )
}

