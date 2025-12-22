import { useState, useMemo } from 'react'
import { Users, ArrowUpDown, Heart, TrendingUp } from 'lucide-react'
import type { SavedPerson } from '../types/astrology'
import { calculateAffinity } from '../lib/utils/affinity-calculator'
import { getCompatibilityColor } from '../lib/utils/affinity-calculator'

interface CompatibilityMatrixProps {
  people: SavedPerson[]
  myChart: SavedPerson | null
  onCompare: (person: SavedPerson) => void
  onBack?: () => void
}

type SortMode = 'name' | 'affinity' | 'relationship'

export default function CompatibilityMatrix({ people, myChart, onCompare, onBack }: CompatibilityMatrixProps) {
  const [sortMode, setSortMode] = useState<SortMode>('affinity')
  const [showOnlyWithChart, setShowOnlyWithChart] = useState(true)

  // Filtrar personas (excluir mi carta y opcionalmente las sin carta)
  const otherPeople = useMemo(() => {
    let filtered = people.filter(p => !p.isSelf)
    if (showOnlyWithChart) {
      filtered = filtered.filter(p => p.chartData)
    }
    return filtered
  }, [people, showOnlyWithChart])

  // Calcular afinidades
  const affinities = useMemo(() => {
    if (!myChart?.chartData) return []

    return otherPeople
      .filter(p => p.chartData)
      .map(person => {
        const affinity = calculateAffinity(myChart.chartData!, person.chartData!)
        return {
          person,
          affinity
        }
      })
  }, [otherPeople, myChart])

  // Ordenar
  const sortedAffinities = useMemo(() => {
    const sorted = [...affinities]
    
    switch (sortMode) {
      case 'affinity':
        sorted.sort((a, b) => b.affinity.percentage - a.affinity.percentage)
        break
      case 'name':
        sorted.sort((a, b) => a.person.name.localeCompare(b.person.name))
        break
      case 'relationship':
        sorted.sort((a, b) => {
          const relOrder: Record<string, number> = {
            'pareja': 1,
            'familia': 2,
            'amigo': 3,
            'trabajo': 4,
            'otro': 5
          }
          return (relOrder[a.person.relationship] || 99) - (relOrder[b.person.relationship] || 99)
        })
        break
    }
    
    return sorted
  }, [affinities, sortMode])

  const getAffinityBadgeColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-100 text-green-800 border-green-300'
    if (percentage >= 50) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (percentage >= 35) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'familia': return '👨‍👩‍👧‍👦'
      case 'pareja': return '💑'
      case 'amigo': return '👤'
      case 'trabajo': return '💼'
      default: return '📋'
    }
  }

  if (!myChart?.chartData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Volver
          </button>
        )}
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">Necesitas tener tu carta natal guardada</p>
          <p className="text-gray-500 text-sm">para ver la matriz de compatibilidad</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Volver
          </button>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Matriz de Compatibilidad
            </h2>
            <p className="text-pink-100 mt-1">
              Afinidad astral con todas tus personas guardadas
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyWithChart}
                onChange={(e) => setShowOnlyWithChart(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Solo personas con carta calculada</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="affinity">Por afinidad</option>
              <option value="name">Por nombre</option>
              <option value="relationship">Por relación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {sortedAffinities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium mb-1">Excelente (≥80%)</p>
            <p className="text-3xl font-bold text-green-700">
              {sortedAffinities.filter(a => a.affinity.percentage >= 80).length}
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-700 font-medium mb-1">Muy Buena (65-79%)</p>
            <p className="text-3xl font-bold text-blue-700">
              {sortedAffinities.filter(a => a.affinity.percentage >= 65 && a.affinity.percentage < 80).length}
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-700 font-medium mb-1">Buena (50-64%)</p>
            <p className="text-3xl font-bold text-yellow-700">
              {sortedAffinities.filter(a => a.affinity.percentage >= 50 && a.affinity.percentage < 65).length}
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-700 font-medium mb-1">Regular/Baja (&lt;50%)</p>
            <p className="text-3xl font-bold text-red-700">
              {sortedAffinities.filter(a => a.affinity.percentage < 50).length}
            </p>
          </div>
        </div>
      )}

      {/* Tabla de compatibilidad */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Persona</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Relación</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Afinidad</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Nivel</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedAffinities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {showOnlyWithChart 
                      ? 'No hay personas con carta calculada para comparar'
                      : 'No hay personas guardadas para comparar'}
                  </td>
                </tr>
              ) : (
                sortedAffinities.map(({ person, affinity }) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {person.favorite && (
                          <span className="text-yellow-500">⭐</span>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{person.name}</p>
                          {person.relationshipDetail && (
                            <p className="text-xs text-gray-500">{person.relationshipDetail}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg">{getRelationshipIcon(person.relationship)}</span>
                      <span className="ml-2 text-sm text-gray-600 capitalize">{person.relationship}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getAffinityBadgeColor(affinity.percentage).split(' ')[0]}`}
                            style={{ width: `${affinity.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold" style={{ color: getCompatibilityColor(affinity.percentage) }}>
                          {affinity.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getAffinityBadgeColor(affinity.percentage)}`}>
                        {affinity.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onCompare(person)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center gap-2 mx-auto"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}





