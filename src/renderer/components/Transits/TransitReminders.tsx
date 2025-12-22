import { useState, useEffect, useMemo } from 'react'
import { Bell, AlertCircle, Calendar, X, Settings, HelpCircle } from 'lucide-react'
import type { ChartData, Transit } from '../../types/astrology'
import { calculateTransits } from '../../lib/astrology/transits'
import PlanetLink from './PlanetLink'

interface TransitRemindersProps {
  natalChart: ChartData
  personName?: string
  onBack?: () => void
}

// Planetas importantes para recordatorios
const IMPORTANT_PLANETS = ['Sol', 'Luna', 'Venus', 'Marte', 'Júpiter', 'Saturno']

// Días hacia adelante para buscar tránsitos
const DAYS_AHEAD = 30

interface Reminder {
  date: Date
  transit: Transit
  daysUntil: number
  importance: 'high' | 'medium' | 'low'
}

export default function TransitReminders({ natalChart, personName, onBack }: TransitRemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set())
  const [showCriticalExplanation, setShowCriticalExplanation] = useState(false)
  const [settings, setSettings] = useState({
    showExactOnly: false,
    showImportantPlanets: true,
    daysAhead: 30,
    minStrength: 7
  })

  // Cargar recordatorios desestimados desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dismissedTransitReminders')
    if (saved) {
      try {
        setDismissedReminders(new Set(JSON.parse(saved)))
      } catch (e) {
        console.error('Error loading dismissed reminders:', e)
      }
    }
  }, [])

  // Calcular recordatorios
  useEffect(() => {
    const loadReminders = async () => {
      if (!natalChart) return

      setLoading(true)
      const newReminders: Reminder[] = []
      const today = new Date()

      try {
        for (let i = 1; i <= settings.daysAhead; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() + i)
          const dateKey = date.toISOString().split('T')[0]

          // Intentar cargar desde caché
          const cacheKey = `transits_${dateKey}`
          const cached = sessionStorage.getItem(cacheKey)

          let transits: Transit[] = []

          if (cached) {
            try {
              const data = JSON.parse(cached)
              transits = data.transits || []
            } catch (e) {
              transits = await calculateTransits(natalChart, date)
            }
          } else {
            transits = await calculateTransits(natalChart, date)
            sessionStorage.setItem(cacheKey, JSON.stringify({ transits }))
          }

          // Filtrar tránsitos importantes
          for (const transit of transits) {
            const isImportantPlanet = IMPORTANT_PLANETS.includes(transit.transitingPlanet) ||
                                     IMPORTANT_PLANETS.includes(transit.natalPoint)
            const isExact = transit.isExact
            const isStrong = transit.strength >= settings.minStrength

            // Criterios para recordatorio
            if (settings.showExactOnly && !isExact) continue
            if (!isExact && !isImportantPlanet && !isStrong) continue
            if (!settings.showImportantPlanets && !isExact && !isStrong) continue

            const daysUntil = i
            let importance: 'high' | 'medium' | 'low' = 'low'

            if (isExact) {
              importance = 'high'
            } else if (isImportantPlanet && isStrong) {
              importance = 'medium'
            } else if (isStrong) {
              importance = 'medium'
            }

            const reminderKey = `${dateKey}_${transit.id}`

            if (!dismissedReminders.has(reminderKey)) {
              newReminders.push({
                date,
                transit,
                daysUntil,
                importance
              })
            }
          }
        }

        // Ordenar por importancia y fecha
        newReminders.sort((a, b) => {
          const importanceOrder = { high: 0, medium: 1, low: 2 }
          const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance]
          if (importanceDiff !== 0) return importanceDiff
          return a.daysUntil - b.daysUntil
        })

        setReminders(newReminders)
      } catch (error) {
        console.error('Error calculando recordatorios:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReminders()
  }, [natalChart, settings, dismissedReminders])

  const dismissReminder = (reminder: Reminder) => {
    const dateKey = reminder.date.toISOString().split('T')[0]
    const reminderKey = `${dateKey}_${reminder.transit.id}`
    const newDismissed = new Set(dismissedReminders)
    newDismissed.add(reminderKey)
    setDismissedReminders(newDismissed)
    localStorage.setItem('dismissedTransitReminders', JSON.stringify([...newDismissed]))
    setReminders(reminders.filter(r => {
      const rKey = `${r.date.toISOString().split('T')[0]}_${r.transit.id}`
      return rKey !== reminderKey
    }))
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-50 border-red-300 text-red-800'
      case 'medium': return 'bg-orange-50 border-orange-300 text-orange-800'
      default: return 'bg-yellow-50 border-yellow-300 text-yellow-800'
    }
  }

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high': return '⚡ Crítico'
      case 'medium': return '⚠️ Importante'
      default: return '📌 Atención'
    }
  }

  const highPriorityReminders = reminders.filter(r => r.importance === 'high')
  const mediumPriorityReminders = reminders.filter(r => r.importance === 'medium')
  const lowPriorityReminders = reminders.filter(r => r.importance === 'low')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg">
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
              <Bell className="w-6 h-6" />
              Recordatorios de Tránsitos
            </h2>
            {personName && (
              <p className="text-orange-100 mt-1">Para {personName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showExactOnly}
              onChange={(e) => setSettings({ ...settings, showExactOnly: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Solo tránsitos exactos</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showImportantPlanets}
              onChange={(e) => setSettings({ ...settings, showImportantPlanets: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Incluir planetas importantes</span>
          </label>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Días hacia adelante: {settings.daysAhead}
            </label>
            <input
              type="range"
              min="7"
              max="90"
              value={settings.daysAhead}
              onChange={(e) => setSettings({ ...settings, daysAhead: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Fuerza mínima: {settings.minStrength}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.minStrength}
              onChange={(e) => setSettings({ ...settings, minStrength: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-700 font-medium mb-1">⚡ Críticos</p>
            <p className="text-3xl font-bold text-red-700">{highPriorityReminders.length}</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
            <p className="text-sm text-orange-700 font-medium mb-1">⚠️ Importantes</p>
            <p className="text-3xl font-bold text-orange-700">{mediumPriorityReminders.length}</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-700 font-medium mb-1">📌 Atención</p>
            <p className="text-3xl font-bold text-yellow-700">{lowPriorityReminders.length}</p>
          </div>
        </div>
      )}

      {/* Lista de recordatorios */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculando recordatorios...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No hay recordatorios próximos</p>
          <p className="text-gray-500 text-sm">Ajusta la configuración para ver más tránsitos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Críticos */}
          {highPriorityReminders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Tránsitos Críticos (Exactos)
                </h3>
                <button
                  onClick={() => setShowCriticalExplanation(!showCriticalExplanation)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="¿Qué son los tránsitos críticos?"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              
              {showCriticalExplanation && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    ¿Qué son los Tránsitos Críticos (Exactos)?
                  </h4>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div>
                      <p className="font-semibold mb-1">⚡ ¿Qué significa "Exacto"?</p>
                      <p>
                        Un tránsito es <strong>exacto</strong> cuando el planeta en tránsito forma un aspecto perfecto 
                        (o casi perfecto, con orbe menor a 0.5°) con un punto de tu carta natal. En este momento, 
                        la influencia del tránsito es <strong>máxima</strong> y más intensa.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">📍 ¿Dónde afectan?</p>
                      <p>
                        Los tránsitos afectan según el <strong>planeta natal</strong> que tocan:
                      </p>
                      <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                        <li><strong>Sol:</strong> Identidad, vitalidad, autoexpresión, confianza</li>
                        <li><strong>Luna:</strong> Emociones, necesidades, hogar, familia</li>
                        <li><strong>Mercurio:</strong> Comunicación, pensamiento, aprendizaje</li>
                        <li><strong>Venus:</strong> Amor, relaciones, valores, belleza</li>
                        <li><strong>Marte:</strong> Acción, energía, pasión, conflictos</li>
                        <li><strong>Júpiter:</strong> Expansión, oportunidades, crecimiento</li>
                        <li><strong>Saturno:</strong> Responsabilidad, límites, estructura, disciplina</li>
                        <li><strong>Urano:</strong> Cambios, innovación, libertad, sorpresas</li>
                        <li><strong>Neptuno:</strong> Inspiración, ilusión, espiritualidad, confusión</li>
                        <li><strong>Plutón:</strong> Transformación, poder, regeneración, crisis</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🔮 ¿Qué tipos de aspectos hay?</p>
                      <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                        <li><strong>Conjunción (0°):</strong> Fusión de energías - puede ser intenso pero también creativo</li>
                        <li><strong>Trígono (120°):</strong> Armonioso - facilita el flujo de energía positiva</li>
                        <li><strong>Cuadratura (90°):</strong> Tensión - desafíos que requieren acción</li>
                        <li><strong>Oposición (180°):</strong> Polaridad - necesidad de equilibrio</li>
                        <li><strong>Sextil (60°):</strong> Oportunidad - facilita conexiones y crecimiento</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">⏰ ¿Cuándo son más importantes?</p>
                      <p>
                        Los tránsitos exactos son especialmente significativos porque representan el <strong>momento pico</strong> 
                        de la influencia. Los días cercanos al tránsito exacto también pueden sentirse, pero el día exacto 
                        suele ser cuando se manifiestan más claramente los cambios, decisiones o eventos relacionados.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">💡 Consejo práctico:</p>
                      <p>
                        Presta atención a estos días críticos. Pueden ser momentos de <strong>decisión importante</strong>, 
                        <strong> cambios significativos</strong>, o <strong>oportunidades de crecimiento</strong>. 
                        Observa qué áreas de tu vida se activan según el planeta natal afectado.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {highPriorityReminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-4 ${getImportanceColor(reminder.importance)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-semibold">
                            {reminder.date.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                          <span className="text-sm opacity-75">
                            ({reminder.daysUntil} {reminder.daysUntil === 1 ? 'día' : 'días'})
                          </span>
                          <span className="px-2 py-1 bg-white/60 rounded text-xs font-semibold">
                            {getImportanceLabel(reminder.importance)}
                          </span>
                        </div>
                        <p className="text-sm mb-1">
                          <PlanetLink planetName={reminder.transit.transitingPlanet} showIcon={false} />{' '}
                          {reminder.transit.aspect === 'conjunction' ? 'conjunción' :
                           reminder.transit.aspect === 'trine' ? 'trígono' :
                           reminder.transit.aspect === 'square' ? 'cuadratura' :
                           reminder.transit.aspect === 'opposition' ? 'oposición' :
                           reminder.transit.aspect === 'sextile' ? 'sextil' : reminder.transit.aspect}{' '}
                          <PlanetLink planetName={reminder.transit.natalPoint} showIcon={false} />
                        </p>
                        <p className="text-xs opacity-75">
                          Fuerza: {reminder.transit.strength}/10 | Orbe: {reminder.transit.orb.toFixed(2)}°
                        </p>
                      </div>
                      <button
                        onClick={() => dismissReminder(reminder)}
                        className="ml-4 p-1 hover:bg-white/40 rounded transition-colors"
                        title="Descartar recordatorio"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Importantes */}
          {mediumPriorityReminders.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tránsitos Importantes</h3>
              <div className="space-y-3">
                {mediumPriorityReminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-4 ${getImportanceColor(reminder.importance)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-semibold">
                            {reminder.date.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                          <span className="text-sm opacity-75">
                            ({reminder.daysUntil} {reminder.daysUntil === 1 ? 'día' : 'días'})
                          </span>
                        </div>
                        <p className="text-sm mb-1">
                          <PlanetLink planetName={reminder.transit.transitingPlanet} showIcon={false} />{' '}
                          {reminder.transit.aspect === 'conjunction' ? 'conjunción' :
                           reminder.transit.aspect === 'trine' ? 'trígono' :
                           reminder.transit.aspect === 'square' ? 'cuadratura' :
                           reminder.transit.aspect === 'opposition' ? 'oposición' :
                           reminder.transit.aspect === 'sextile' ? 'sextil' : reminder.transit.aspect}{' '}
                          <PlanetLink planetName={reminder.transit.natalPoint} showIcon={false} />
                        </p>
                        <p className="text-xs opacity-75">
                          Fuerza: {reminder.transit.strength}/10
                        </p>
                      </div>
                      <button
                        onClick={() => dismissReminder(reminder)}
                        className="ml-4 p-1 hover:bg-white/40 rounded transition-colors"
                        title="Descartar recordatorio"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Atención */}
          {lowPriorityReminders.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Otros Tránsitos</h3>
              <div className="space-y-2">
                {lowPriorityReminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-3 ${getImportanceColor(reminder.importance)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {reminder.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} ({reminder.daysUntil}d)
                          </span>
                          <PlanetLink planetName={reminder.transit.transitingPlanet} showIcon={false} className="text-xs" />{' '}
                          {reminder.transit.aspect.substring(0, 3)}{' '}
                          <PlanetLink planetName={reminder.transit.natalPoint} showIcon={false} className="text-xs" />
                        </div>
                      </div>
                      <button
                        onClick={() => dismissReminder(reminder)}
                        className="ml-4 p-1 hover:bg-white/40 rounded transition-colors"
                        title="Descartar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

