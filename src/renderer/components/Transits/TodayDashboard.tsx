import { useState, useEffect, useMemo } from 'react'
import { Calendar, Filter, Eye, EyeOff, RefreshCw, BookOpen, X, Bell } from 'lucide-react'
import type { ChartData, Transit, TransitSummary } from '../../types/astrology'
import { calculateTransits, calculateTransitSummary } from '../../lib/astrology/transits'
import { calculateDayEnergy, calculateTotalIntensity } from '../../lib/astrology/energy-calculator'
import TransitSummaryComponent from './TransitSummary'
import TransitCard from './TransitCard'
import EnergyMeter from './EnergyMeter'
import IntensityGauge from './IntensityGauge'
import BalanceIndicator from './BalanceIndicator'
import ActivePlanetsPanel from './ActivePlanetsPanel'
import PlanetGuide from './PlanetGuide'
import DayGuidance from './DayGuidance'
import TransitAiAssistant from './TransitAiAssistant'
import TransitCalendar from './TransitCalendar'
import TransitReminders from './TransitReminders'
import CollapsibleSection from '../CollapsibleSection'

interface TodayDashboardProps {
  natalChart: ChartData
  personName?: string
  showCalendar?: boolean
  showReminders?: boolean
  onToggleCalendar?: () => void
  onToggleReminders?: () => void
}

type ViewMode = 'yesterday' | 'today' | 'tomorrow'
type FilterMode = 'all' | 'tense' | 'harmonious' | 'conjunctions'
type FocusMode = boolean

// Función para formatear fecha en español
function formatDate(date: Date): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName}, ${day} de ${month} de ${year}`
}

export default function TodayDashboard({ natalChart, personName, showCalendar, showReminders, onToggleCalendar, onToggleReminders }: TodayDashboardProps) {
  const [view, setView] = useState<ViewMode>('today')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [focusMode, setFocusMode] = useState<FocusMode>(false)
  const [yesterdayTransits, setYesterdayTransits] = useState<Transit[]>([])
  const [todayTransits, setTodayTransits] = useState<Transit[]>([])
  const [tomorrowTransits, setTomorrowTransits] = useState<Transit[]>([])
  const [yesterdaySummary, setYesterdaySummary] = useState<TransitSummary | null>(null)
  const [todaySummary, setTodaySummary] = useState<TransitSummary | null>(null)
  const [tomorrowSummary, setTomorrowSummary] = useState<TransitSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPlanetGuide, setShowPlanetGuide] = useState(false)

  // Cache key basado en fecha
  const getCacheKey = (date: Date) => {
    return `transits_${date.toISOString().split('T')[0]}`
  }

  // Cargar tránsitos desde cache o calcular
  const loadTransits = async (date: Date, dateType: 'yesterday' | 'today' | 'tomorrow') => {
    const cacheKey = getCacheKey(date)
    const cached = sessionStorage.getItem(cacheKey)
    
    if (cached) {
      try {
        const data = JSON.parse(cached)
        const transitCount = data.transits?.length || 0
        console.log(`📦 Cargando desde caché: ${cacheKey}`, transitCount, 'tránsitos')
        
        // Si el caché tiene 0 tránsitos, puede ser un error previo - recalcular
        if (transitCount === 0) {
          console.log(`⚠️ Caché vacío detectado, recalculando...`)
          // No hacer return, continuar al cálculo
        } else {
          // Caché válido, usar
          if (dateType === 'yesterday') {
            setYesterdayTransits(data.transits || [])
            setYesterdaySummary(data.summary || null)
          } else if (dateType === 'today') {
            setTodayTransits(data.transits || [])
            setTodaySummary(data.summary || null)
          } else {
            setTomorrowTransits(data.transits || [])
            setTomorrowSummary(data.summary || null)
          }
          return
        }
      } catch (e) {
        console.error('Error parsing cache:', e)
        // Continuar al cálculo si hay error parseando
      }
    }

    // Calcular tránsitos
    console.log(`🔄 Calculando tránsitos para ${date.toISOString().split('T')[0]}...`)
    try {
      if (!natalChart) {
        console.error('❌ No hay carta natal disponible')
        setError('No hay carta natal disponible para calcular tránsitos.')
        return
      }
      
      const transits = await calculateTransits(natalChart, date)
      console.log(`✅ Tránsitos calculados: ${transits.length}`)
      const summary = await calculateTransitSummary(transits, date, natalChart.birthData)
      
      // Guardar en cache
      sessionStorage.setItem(cacheKey, JSON.stringify({ transits, summary }))
      console.log(`💾 Guardado en caché: ${cacheKey}`)
      
      if (dateType === 'yesterday') {
        setYesterdayTransits(transits)
        setYesterdaySummary(summary)
      } else if (dateType === 'today') {
        setTodayTransits(transits)
        setTodaySummary(summary)
      } else {
        setTomorrowTransits(transits)
        setTomorrowSummary(summary)
      }
    } catch (err) {
      console.error('❌ Error calculando tránsitos:', err)
      setError(`No se pudieron calcular los tránsitos: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    }
  }

  // Limpiar caché vacío
  const clearEmptyCache = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const yesterdayKey = getCacheKey(yesterday)
    const todayKey = getCacheKey(today)
    const tomorrowKey = getCacheKey(tomorrow)
    
    const dates = [
      { key: yesterdayKey, name: 'ayer' },
      { key: todayKey, name: 'hoy' },
      { key: tomorrowKey, name: 'mañana' }
    ]
    
    dates.forEach(({ key, name }) => {
      const cached = sessionStorage.getItem(key)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          if (!data.transits || data.transits.length === 0) {
            console.log(`🗑️ Limpiando caché vacío para ${name}`)
            sessionStorage.removeItem(key)
          }
        } catch (e) {
          sessionStorage.removeItem(key)
        }
      }
    })
  }

  // Cargar los tres días
  const loadAllDays = async () => {
    setLoading(true)
    setError(null)
    
    // Limpiar caché vacío antes de cargar
    clearEmptyCache()
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    await Promise.all([
      loadTransits(yesterday, 'yesterday'),
      loadTransits(today, 'today'),
      loadTransits(tomorrow, 'tomorrow')
    ])
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  // Cargar al montar
  useEffect(() => {
    console.log('🚀 TodayDashboard montado, natalChart:', natalChart ? 'disponible' : 'NO disponible')
    if (natalChart) {
      loadAllDays()
    } else {
      setError('No hay carta natal disponible.')
      setLoading(false)
    }
  }, [natalChart])

  // Detectar cambio de día
  useEffect(() => {
    const checkDayChange = () => {
      const now = new Date()
      const lastDate = lastUpdate ? new Date(lastUpdate) : null
      
      if (!lastDate || now.getDate() !== lastDate.getDate()) {
        loadAllDays()
      }
    }

    const interval = setInterval(checkDayChange, 60000) // Cada minuto
    return () => clearInterval(interval)
  }, [lastUpdate])

  // Filtrar tránsitos
  const getFilteredTransits = (transits: Transit[]): Transit[] => {
    let filtered = transits

    switch (filter) {
      case 'tense':
        filtered = transits.filter(t => t.isTense)
        break
      case 'harmonious':
        filtered = transits.filter(t => t.isHarmonious)
        break
      case 'conjunctions':
        filtered = transits.filter(t => t.aspect === 'conjunction')
        break
      default:
        filtered = transits
    }

    // Modo enfoque: solo top 3-5
    if (focusMode) {
      filtered = filtered.slice(0, 5)
    }

    return filtered
  }

  // Obtener fecha actual según la vista
  const getCurrentDate = (): Date => {
    const today = new Date()
    if (view === 'yesterday') {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    } else if (view === 'tomorrow') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    }
    return today
  }

  const currentDate = getCurrentDate()
  const currentTransits = view === 'yesterday' ? yesterdayTransits : view === 'today' ? todayTransits : tomorrowTransits
  const currentSummary = view === 'yesterday' ? yesterdaySummary : view === 'today' ? todaySummary : tomorrowSummary
  const filteredTransits = getFilteredTransits(currentTransits)

  // Calcular métricas gamificadas
  const dayEnergy = useMemo(() => calculateDayEnergy(currentTransits), [currentTransits])
  const intensity = useMemo(() => calculateTotalIntensity(currentTransits), [currentTransits])
  const challenges = useMemo(() => currentTransits.filter(t => t.isTense).length, [currentTransits])
  const opportunities = useMemo(() => currentTransits.filter(t => t.isHarmonious).length, [currentTransits])

  if (loading && !todayTransits.length && !todaySummary) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Calculando tránsitos...</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-2 text-xs text-gray-500">Revisa la consola para ver el progreso</p>
        )}
      </div>
    )
  }

  if (error && !todayTransits.length) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4 font-semibold">{error}</p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-2xl mx-auto">
            <p className="text-sm text-red-800 font-semibold mb-2">🔍 Debug Info:</p>
            <p className="text-xs text-red-700">
              • natalChart disponible: {natalChart ? 'Sí' : 'No'}
              <br />
              • Abre la consola del navegador (F12) para ver logs detallados
            </p>
          </div>
        )}
        <button
          onClick={loadAllDays}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </button>
      </div>
    )
  }

  // Si showCalendar es true, mostrar el calendario
  if (showCalendar) {
    return <TransitCalendar natalChart={natalChart} personName={personName} onBack={onToggleCalendar} />
  }

  // Si showReminders es true, mostrar los recordatorios
  if (showReminders) {
    return <TransitReminders natalChart={natalChart} personName={personName} onBack={onToggleReminders} />
  }

  return (
    <div className="space-y-6">
      {/* Título con nombre de la persona */}
      {personName && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Tránsitos de {personName}
            </h2>
            <div className="flex items-center gap-2">
              {onToggleReminders && (
                <button
                  onClick={onToggleReminders}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Bell className="w-4 h-4" />
                  Recordatorios
                </button>
              )}
              {onToggleCalendar && (
                <button
                  onClick={onToggleCalendar}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Calendar className="w-4 h-4" />
                  Ver Calendario
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs AYER / HOY / MAÑANA */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('yesterday')}
            className={`px-4 py-3 rounded-lg font-semibold transition-all flex flex-col items-center gap-1 ${
              view === 'yesterday'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Ayer</span>
            <span className="text-xs opacity-75">
              {formatDate((() => {
                const d = new Date()
                d.setDate(d.getDate() - 1)
                return d
              })())}
            </span>
          </button>
          <button
            onClick={() => setView('today')}
            className={`px-4 py-3 rounded-lg font-semibold transition-all flex flex-col items-center gap-1 ${
              view === 'today'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Hoy</span>
            <span className="text-xs opacity-75">
              {formatDate(new Date())}
            </span>
          </button>
          <button
            onClick={() => setView('tomorrow')}
            className={`px-4 py-3 rounded-lg font-semibold transition-all flex flex-col items-center gap-1 ${
              view === 'tomorrow'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Mañana</span>
            <span className="text-xs opacity-75">
              {formatDate((() => {
                const d = new Date()
                d.setDate(d.getDate() + 1)
                return d
              })())}
            </span>
          </button>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-3">
          {/* Modo Enfoque */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              focusMode
                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Mostrar solo los 5 tránsitos más importantes"
          >
            {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {focusMode ? 'Enfoque' : 'Todos'}
          </button>

          {/* Filtros */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterMode)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
            >
              <option value="all">Todos</option>
              <option value="tense">Tensos</option>
              <option value="harmonious">Armónicos</option>
              <option value="conjunctions">Conjunciones</option>
            </select>
          </div>

          {/* Guía de Planetas */}
          <button
            onClick={() => setShowPlanetGuide(true)}
            className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors flex items-center gap-2 font-medium"
            title="Aprende sobre los planetas"
          >
            <BookOpen className="w-4 h-4" />
            Guía Planetas
          </button>

          {/* Actualizar */}
          <button
            onClick={loadAllDays}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar tránsitos"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal de Guía de Planetas */}
      {showPlanetGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Guía de Planetas</h2>
              <button
                onClick={() => setShowPlanetGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <PlanetGuide onClose={() => setShowPlanetGuide(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Guía Práctica del Día */}
      {currentTransits.length > 0 && (
        <CollapsibleSection
          title="Guía Práctica del Día"
          defaultExpanded={true}
        >
          <DayGuidance
            energies={dayEnergy}
            intensity={intensity.intensity}
            transits={currentTransits}
            balance={{
              challenges,
              opportunities
            }}
          />
        </CollapsibleSection>
      )}

      {currentTransits.length > 0 && (
        <TransitAiAssistant
          transits={currentTransits}
          summary={currentSummary}
          energies={dayEnergy}
          cacheDateKey={getCacheKey(currentDate)}
        />
      )}

      {/* Medidor de Energía del Día */}
      {currentTransits.length > 0 && (
        <CollapsibleSection
          title="Energía del Día"
          defaultExpanded={true}
        >
          <EnergyMeter energy={dayEnergy} />
        </CollapsibleSection>
      )}

      {/* Indicador Global de Intensidad */}
      {currentTransits.length > 0 && (
        <CollapsibleSection
          title="Intensidad Global"
          defaultExpanded={true}
        >
          <IntensityGauge
            intensity={intensity.intensity}
            level={intensity.level}
            emoji={intensity.emoji}
            recommendedMode={intensity.recommendedMode}
          />
        </CollapsibleSection>
      )}

      {/* Balance Desafío vs Oportunidad */}
      {currentTransits.length > 0 && (
        <CollapsibleSection
          title="Balance: Desafíos vs Oportunidades"
          defaultExpanded={true}
        >
          <BalanceIndicator
            challenges={challenges}
            opportunities={opportunities}
            totalTransits={currentTransits.length}
          />
        </CollapsibleSection>
      )}

      {/* Planetas Más Activos */}
      {currentTransits.length > 0 && (
        <CollapsibleSection
          title="Planetas Más Activos Hoy"
          defaultExpanded={true}
        >
          <ActivePlanetsPanel transits={currentTransits} />
        </CollapsibleSection>
      )}

      {/* Resumen ejecutivo */}
      {currentSummary && (
        <CollapsibleSection
          title="Resumen de Tránsitos"
          defaultExpanded={true}
        >
          <TransitSummaryComponent summary={currentSummary} date={currentDate} />
        </CollapsibleSection>
      )}

      {/* Última actualización */}
      {lastUpdate && (
        <div className="text-sm text-gray-500 text-center">
          Última actualización: {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Lista de tránsitos */}
      <CollapsibleSection
        title={`Lista de Tránsitos (${filteredTransits.length})`}
        defaultExpanded={true}
      >
        {filteredTransits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-600 text-lg mb-4">
            {filter === 'all'
              ? 'No hay tránsitos activos en este momento.'
              : `No hay tránsitos ${filter === 'tense' ? 'tensos' : filter === 'harmonious' ? 'armónicos' : 'conjunciones'} activos.`}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-2xl mx-auto">
              <p className="text-sm text-yellow-800 font-semibold mb-2">🔍 Debug Info:</p>
              <p className="text-xs text-yellow-700">
                • Total de tránsitos calculados: {view === 'yesterday' ? yesterdayTransits.length : view === 'today' ? todayTransits.length : tomorrowTransits.length}
                <br />
                • Filtro activo: {filter}
                <br />
                • Modo enfoque: {focusMode ? 'Sí' : 'No'}
                <br />
                • Abre la consola del navegador (F12) para ver logs detallados del cálculo
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {focusMode && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium flex items-center gap-2">
                <EyeOff className="w-5 h-5" />
                Modo Enfoque activo: Mostrando solo los {filteredTransits.length} tránsitos más importantes
              </p>
            </div>
          )}
          
          {filteredTransits.map((transit) => (
            <TransitCard key={transit.id} transit={transit} />
          ))}
        </div>
        )}
      </CollapsibleSection>

      {/* Cambios entre días */}
      {view === 'tomorrow' && todayTransits.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cambios para mañana ({formatDate((() => {
            const d = new Date()
            d.setDate(d.getDate() + 1)
            return d
          })())}):</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <strong>Nuevos tránsitos:</strong>{' '}
              {tomorrowTransits.filter(t => !todayTransits.some(tt => tt.id === t.id)).length}
            </p>
            <p className="text-gray-700">
              <strong>Tránsitos que continúan:</strong>{' '}
              {tomorrowTransits.filter(t => todayTransits.some(tt => tt.id === t.id)).length}
            </p>
            <p className="text-gray-700">
              <strong>Tránsitos que se desactivan:</strong>{' '}
              {todayTransits.filter(t => !tomorrowTransits.some(tt => tt.id === t.id)).length}
            </p>
          </div>
        </div>
      )}
      
      {view === 'today' && yesterdayTransits.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Comparación con ayer ({formatDate((() => {
            const d = new Date()
            d.setDate(d.getDate() - 1)
            return d
          })())}):</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <strong>Nuevos tránsitos hoy:</strong>{' '}
              {todayTransits.filter(t => !yesterdayTransits.some(tt => tt.id === t.id)).length}
            </p>
            <p className="text-gray-700">
              <strong>Tránsitos que continúan:</strong>{' '}
              {todayTransits.filter(t => yesterdayTransits.some(tt => tt.id === t.id)).length}
            </p>
            <p className="text-gray-700">
              <strong>Tránsitos que se desactivaron:</strong>{' '}
              {yesterdayTransits.filter(t => !todayTransits.some(tt => tt.id === t.id)).length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

