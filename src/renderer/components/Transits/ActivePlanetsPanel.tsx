import { useState, useMemo } from 'react'
import { Sparkles, HelpCircle, X, TrendingUp } from 'lucide-react'
import type { Transit } from '../../types/astrology'
import ProgressBar from './ProgressBar'
import PlanetLink from './PlanetLink'

interface ActivePlanetsPanelProps {
  transits: Transit[]
}

interface PlanetActivity {
  planet: string
  count: number
  tenseCount: number
  harmoniousCount: number
  conjunctionCount: number
  totalStrength: number
  averageStrength: number
  exactCount: number
}

export default function ActivePlanetsPanel({ transits }: ActivePlanetsPanelProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  // Analizar qué planetas natales están más afectados
  const planetActivity = useMemo(() => {
    const activityMap = new Map<string, PlanetActivity>()

    transits.forEach(transit => {
      const planet = transit.natalPoint
      
      if (!activityMap.has(planet)) {
        activityMap.set(planet, {
          planet,
          count: 0,
          tenseCount: 0,
          harmoniousCount: 0,
          conjunctionCount: 0,
          totalStrength: 0,
          averageStrength: 0,
          exactCount: 0
        })
      }

      const activity = activityMap.get(planet)!
      activity.count++
      activity.totalStrength += transit.strength
      
      if (transit.isTense) activity.tenseCount++
      if (transit.isHarmonious) activity.harmoniousCount++
      if (transit.aspect === 'conjunction') activity.conjunctionCount++
      if (transit.isExact) activity.exactCount++
    })

    // Calcular promedio de fuerza y ordenar
    const activities = Array.from(activityMap.values())
      .map(activity => ({
        ...activity,
        averageStrength: activity.totalStrength / activity.count
      }))
      .sort((a, b) => {
        // Ordenar por: 1) cantidad de tránsitos, 2) fuerza promedio
        if (b.count !== a.count) return b.count - a.count
        return b.averageStrength - a.averageStrength
      })

    return activities
  }, [transits])

  if (planetActivity.length === 0) {
    return null
  }

  // Obtener el máximo para normalizar las barras
  const maxCount = Math.max(...planetActivity.map(p => p.count))

  // Iconos para planetas
  const getPlanetIcon = (planet: string) => {
    const icons: Record<string, string> = {
      'Sol': '☉',
      'Luna': '🌙',
      'Mercurio': '☿',
      'Venus': '♀',
      'Marte': '♂',
      'Júpiter': '♃',
      'Saturno': '♄',
      'Urano': '♅',
      'Neptuno': '♆',
      'Plutón': '♇',
      'Ascendente': '↑',
      'Medio Cielo': 'MC'
    }
    return icons[planet] || '●'
  }

  // Color según actividad
  const getActivityColor = (activity: PlanetActivity) => {
    if (activity.exactCount > 0) return 'yellow'
    if (activity.tenseCount > activity.harmoniousCount) return 'red'
    if (activity.harmoniousCount > activity.tenseCount) return 'green'
    return 'blue'
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-600" />
          Planetas Más Activos Hoy
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
            <h4 className="text-blue-900 font-semibold text-lg">📚 ¿Qué son los Planetas Más Activos?</h4>
            <button onClick={() => setShowExplanation(false)} className="text-blue-600 hover:text-blue-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-blue-800 space-y-3">
            <p>
              Esta sección muestra qué <strong>planetas de tu carta natal</strong> están recibiendo más tránsitos hoy. 
              Un planeta natal "activo" significa que está siendo influenciado por múltiples planetas transitantes.
            </p>
            <div className="bg-white border border-gray-200 rounded p-3">
              <p className="font-bold text-gray-900 mb-2">📊 Cómo interpretar:</p>
              <ul className="text-gray-700 text-xs space-y-2 list-disc list-inside">
                <li><strong>Más tránsitos = más activación:</strong> Si Venus tiene 5 tránsitos, está muy activa hoy. Esto puede significar que temas de relaciones, valores o belleza están en primer plano.</li>
                <li><strong>Fuerza promedio:</strong> Indica qué tan intensos son los tránsitos. Alta fuerza = influencia más notable.</li>
                <li><strong>Colores:</strong> 
                  <span className="text-yellow-700"> Amarillo</span> = tiene tránsitos exactos (muy intenso),
                  <span className="text-red-700"> Rojo</span> = más tránsitos tensos,
                  <span className="text-green-700"> Verde</span> = más tránsitos armónicos,
                  <span className="text-blue-700"> Azul</span> = balanceado.
                </li>
                <li><strong>⚡ Exactos:</strong> Número de tránsitos exactos (orbe &lt; 0.5°). Son los más intensos.</li>
              </ul>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>💡 Ejemplo:</strong> Si Venus tiene 4 tránsitos (3 armónicos, 1 tenso), significa que 
                temas relacionados con Venus (amor, relaciones, valores, belleza, arte) están muy presentes hoy. 
                Puede ser un buen día para trabajar en relaciones o proyectos creativos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de planetas activos */}
      <div className="space-y-3">
        {planetActivity.map((activity) => {
          const color = getActivityColor(activity)
          const intensity = (activity.count / maxCount) * 100
          
          return (
            <div
              key={activity.planet}
              className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getPlanetIcon(activity.planet)}</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      <PlanetLink planetName={activity.planet} showIcon={false} />
                    </h4>
                    <p className="text-xs text-gray-500">
                      {activity.count} tránsito{activity.count !== 1 ? 's' : ''} activo{activity.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      Fuerza: {activity.averageStrength.toFixed(1)}/10
                    </span>
                  </div>
                  {activity.exactCount > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                      ⚡ {activity.exactCount} exacto{activity.exactCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Barra de intensidad */}
              <div className="mb-3">
                <ProgressBar
                  label="Intensidad de activación"
                  value={intensity}
                  max={100}
                  color={color}
                  showValue={false}
                  size="sm"
                />
              </div>

              {/* Desglose de aspectos */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                  <p className="text-red-700 font-semibold">{activity.tenseCount}</p>
                  <p className="text-red-600 text-xs">Tensos</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                  <p className="text-green-700 font-semibold">{activity.harmoniousCount}</p>
                  <p className="text-green-600 text-xs">Armónicos</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
                  <p className="text-yellow-700 font-semibold">{activity.conjunctionCount}</p>
                  <p className="text-yellow-600 text-xs">Conjunciones</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen */}
      {planetActivity.length > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700">
            <strong>🌟 Planeta más activo:</strong>{' '}
            <PlanetLink planetName={planetActivity[0].planet} className="font-bold text-pink-700" />
            {' '}con {planetActivity[0].count} tránsito{planetActivity[0].count !== 1 ? 's' : ''}
            {planetActivity[0].exactCount > 0 && (
              <span className="ml-2 text-yellow-700">
                (⚡ {planetActivity[0].exactCount} exacto{planetActivity[0].exactCount !== 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

