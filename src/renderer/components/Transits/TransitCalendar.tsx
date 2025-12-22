import { useState, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Filter, AlertCircle } from 'lucide-react'
import type { ChartData, Transit } from '../../types/astrology'
import { calculateTransits } from '../../lib/astrology/transits'
import TransitCard from './TransitCard'
import PlanetLink from './PlanetLink'

interface TransitCalendarProps {
  natalChart: ChartData
  personName?: string
  onBack?: () => void
}

type ViewMode = 'month' | 'week'
type FilterMode = 'all' | 'tense' | 'harmonious' | 'exact' | 'important'

// Planetas importantes para destacar
const IMPORTANT_PLANETS = ['Sol', 'Luna', 'Venus', 'Marte', 'Júpiter', 'Saturno']

export default function TransitCalendar({ natalChart, personName, onBack }: TransitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [loading, setLoading] = useState(false)
  const [transitsByDate, setTransitsByDate] = useState<Map<string, Transit[]>>(new Map())
  const [importantTransits, setImportantTransits] = useState<Array<{ date: Date; transit: Transit }>>([])

  // Obtener fechas del mes/semana actual
  const datesToCalculate = useMemo(() => {
    const dates: Date[] = []
    const start = new Date(currentDate)
    
    if (viewMode === 'month') {
      start.setDate(1) // Primer día del mes
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1) // Primer día del mes siguiente
      
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d))
      }
    } else {
      // Semana: lunes a domingo
      const day = start.getDay()
      const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Ajustar a lunes
      start.setDate(diff)
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        dates.push(d)
      }
    }
    
    return dates
  }, [currentDate, viewMode])

  // Calcular tránsitos para todas las fechas
  useEffect(() => {
    const loadTransits = async () => {
      if (!natalChart) return
      
      setLoading(true)
      const newTransitsByDate = new Map<string, Transit[]>()
      const newImportantTransits: Array<{ date: Date; transit: Transit }> = []
      
      try {
        for (const date of datesToCalculate) {
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
              // Si falla el caché, calcular
              transits = await calculateTransits(natalChart, date)
            }
          } else {
            transits = await calculateTransits(natalChart, date)
            // Guardar en caché
            sessionStorage.setItem(cacheKey, JSON.stringify({ transits }))
          }
          
          // Filtrar y destacar importantes
          const filteredTransits = transits.filter(t => {
            if (filterMode === 'tense') return t.isTense
            if (filterMode === 'harmonious') return t.isHarmonious
            if (filterMode === 'exact') return t.isExact
            if (filterMode === 'important') {
              return IMPORTANT_PLANETS.includes(t.transitingPlanet) || 
                     IMPORTANT_PLANETS.includes(t.natalPoint) ||
                     t.isExact
            }
            return true
          })
          
          newTransitsByDate.set(dateKey, filteredTransits)
          
          // Recopilar tránsitos importantes para el resumen
          for (const transit of transits) {
            if (transit.isExact || 
                (IMPORTANT_PLANETS.includes(transit.transitingPlanet) && 
                 IMPORTANT_PLANETS.includes(transit.natalPoint))) {
              newImportantTransits.push({ date, transit })
            }
          }
        }
        
        // Ordenar tránsitos importantes por fecha
        newImportantTransits.sort((a, b) => a.date.getTime() - b.date.getTime())
        
        setTransitsByDate(newTransitsByDate)
        setImportantTransits(newImportantTransits)
      } catch (error) {
        console.error('Error calculando tránsitos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTransits()
  }, [natalChart, datesToCalculate, filterMode])

  // Navegación de fechas
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    }
    setCurrentDate(newDate)
  }

  // Formatear fecha
  const formatDateHeader = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    } else {
      const start = datesToCalculate[0]
      const end = datesToCalculate[datesToCalculate.length - 1]
      return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('es-ES', { month: 'long' })} ${start.getFullYear()}`
    }
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
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
              <Calendar className="w-6 h-6" />
              Calendario de Tránsitos
            </h2>
            {personName && (
              <p className="text-purple-100 mt-1">Para {personName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Navegación */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 min-w-[200px] text-center">
              {formatDateHeader()}
            </h3>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Hoy
            </button>
          </div>

          {/* Vista y Filtros */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'month' ? 'bg-white shadow text-purple-700 font-semibold' : 'text-gray-600'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'week' ? 'bg-white shadow text-purple-700 font-semibold' : 'text-gray-600'
                }`}
              >
                Semana
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos</option>
                <option value="important">Importantes</option>
                <option value="exact">Exactos</option>
                <option value="tense">Tensos</option>
                <option value="harmonious">Armónicos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de tránsitos importantes */}
      {importantTransits.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-gray-900">⚡ Tránsitos Importantes Próximos</h3>
          </div>
          <div className="space-y-2">
            {importantTransits.slice(0, 5).map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {item.date.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      <PlanetLink planetName={item.transit.transitingPlanet} showIcon={false} />{' '}
                      {item.transit.aspect === 'conjunction' ? 'conjunción' :
                       item.transit.aspect === 'trine' ? 'trígono' :
                       item.transit.aspect === 'square' ? 'cuadratura' :
                       item.transit.aspect === 'opposition' ? 'oposición' :
                       item.transit.aspect === 'sextile' ? 'sextil' : item.transit.aspect}{' '}
                      <PlanetLink planetName={item.transit.natalPoint} showIcon={false} />
                      {item.transit.isExact && (
                        <span className="ml-2 text-yellow-700 font-semibold">⚡ EXACTO</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendario */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculando tránsitos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {viewMode === 'month' ? (
            <div className="grid grid-cols-7 gap-2">
              {/* Días de la semana */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Días del mes */}
              {datesToCalculate.map((date, idx) => {
                const dateKey = date.toISOString().split('T')[0]
                const transits = transitsByDate.get(dateKey) || []
                const isCurrentDay = isToday(date)
                
                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border rounded-lg p-2 ${
                      isCurrentDay ? 'bg-purple-50 border-purple-300 border-2' : 'border-gray-200'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isCurrentDay ? 'text-purple-700' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {transits.slice(0, 3).map((transit, tIdx) => (
                        <div
                          key={tIdx}
                          className={`text-xs p-1 rounded ${
                            transit.isTense ? 'bg-red-100 text-red-700' :
                            transit.isHarmonious ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}
                          title={`${transit.transitingPlanet} ${transit.aspect} ${transit.natalPoint}`}
                        >
                          {transit.isExact && '⚡ '}
                          {transit.transitingPlanet.substring(0, 3)} {transit.aspect.substring(0, 3)}
                        </div>
                      ))}
                      {transits.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{transits.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {datesToCalculate.map((date, idx) => {
                const dateKey = date.toISOString().split('T')[0]
                const transits = transitsByDate.get(dateKey) || []
                const isCurrentDay = isToday(date)
                
                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 ${
                      isCurrentDay ? 'bg-purple-50 border-purple-300 border-2' : 'border-gray-200'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-3">
                      {formatDayName(date)}
                      {isCurrentDay && <span className="ml-2 text-purple-700">(Hoy)</span>}
                    </h4>
                    {transits.length > 0 ? (
                      <div className="space-y-2">
                        {transits.map((transit, tIdx) => (
                          <TransitCard key={tIdx} transit={transit} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No hay tránsitos este día</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}





