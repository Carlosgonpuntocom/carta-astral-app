import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import HomePage from './components/HomePage'
import AddPersonForm from './components/AddPersonForm'
import ChartView from './components/ChartView'
import TodayDashboard from './components/Transits/TodayDashboard'
import CompareView from './components/CompareView'
import CompatibilityMatrix from './components/CompatibilityMatrix'
import TransitReminders from './components/Transits/TransitReminders'
import { calculateChart } from './lib/astrology/calculator'
import { 
  loadPeople, 
  savePerson, 
  deletePerson, 
  migrateOldChart 
} from './lib/database/people-storage'
import { DEMO_CHART } from '../shared/constants'
import type { ChartData, BirthData, SavedPerson, RelationshipType } from './types/astrology'

type View = 'home' | 'demo' | 'add-person' | 'edit-person' | 'edit-my-chart' | 'chart' | 'compare' | 'transits' | 'compatibility-matrix' | 'transit-reminders'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [people, setPeople] = useState<SavedPerson[]>([])
  const [myChart, setMyChart] = useState<SavedPerson | null>(null)
  const [currentChartData, setCurrentChartData] = useState<ChartData | null>(null)
  const [currentPerson, setCurrentPerson] = useState<SavedPerson | null>(null)
  const [comparePerson, setComparePerson] = useState<SavedPerson | null>(null)
  const [transitsPerson, setTransitsPerson] = useState<SavedPerson | null>(null)
  const [showTransitCalendar, setShowTransitCalendar] = useState(false)
  const [showTransitReminders, setShowTransitReminders] = useState(false)
  const [loading, setLoading] = useState(false)

  // Cargar personas y migrar datos antiguos al iniciar
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    setLoading(true)
    try {
      // Migrar datos antiguos si existen
      await migrateOldChart()
      
      // Cargar todas las personas
      const loadedPeople = await loadPeople()
      setPeople(loadedPeople)
      
      // Encontrar tu carta
      const myChartData = loadedPeople.find(p => p.isSelf) || null
      setMyChart(myChartData)
    } catch (error) {
      console.error('Error inicializando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshPeople = async () => {
    const loadedPeople = await loadPeople()
    setPeople(loadedPeople)
    const myChartData = loadedPeople.find(p => p.isSelf) || null
    setMyChart(myChartData)
  }

  const handleViewDemo = async () => {
    setLoading(true)
    try {
      const demoChart = await calculateChart(DEMO_CHART)
      setCurrentChartData(demoChart)
      setCurrentView('chart')
    } catch (error) {
      console.error('Error calculando demo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewMyChart = async () => {
    if (!myChart) {
      setCurrentView('edit-my-chart')
      return
    }

    setLoading(true)
    try {
      // Si ya tiene carta calculada, usarla; si no, calcularla
      if (myChart.chartData) {
        setCurrentChartData(myChart.chartData)
      } else {
        const chart = await calculateChart(myChart.birthData)
        setCurrentChartData(chart)
        // Guardar la carta calculada
        await savePerson({ ...myChart, chartData: chart })
      }
      setCurrentView('chart')
    } catch (error) {
      console.error('Error cargando mi carta:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMyChart = () => {
    if (myChart) {
      setCurrentPerson(myChart)
      setCurrentView('edit-my-chart')
    } else {
      setCurrentView('edit-my-chart')
    }
  }

  const handleSaveMyChart = async (data: {
    birthData: BirthData
    relationship: RelationshipType
    relationshipDetail?: string
    notes?: string
    timeIsApproximate?: boolean
  }) => {
    setLoading(true)
    try {
      const chart = await calculateChart(data.birthData)
      
      const personData: SavedPerson = {
        id: myChart?.id || `self-${Date.now()}`,
        isSelf: true,
        name: data.birthData.name,
        birthData: data.birthData,
        relationship: data.relationship,
        relationshipDetail: data.relationshipDetail,
        notes: data.notes,
        timeIsApproximate: data.timeIsApproximate,
        chartData: chart,
        createdAt: myChart?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await savePerson(personData)
      await refreshPeople()
      setCurrentChartData(chart)
      setCurrentView('chart')
    } catch (error) {
      console.error('Error guardando mi carta:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPerson = () => {
    setCurrentPerson(null)
    setCurrentView('add-person')
  }

  const handleSavePerson = async (data: {
    birthData: BirthData
    relationship: RelationshipType
    relationshipDetail?: string
    notes?: string
    timeIsApproximate?: boolean
  }) => {
    setLoading(true)
    try {
      const chart = await calculateChart(data.birthData)
      
      const personData: SavedPerson = {
        id: currentPerson?.id || `person-${Date.now()}`,
        isSelf: false,
        name: data.birthData.name,
        birthData: data.birthData,
        relationship: data.relationship,
        relationshipDetail: data.relationshipDetail,
        notes: data.notes,
        timeIsApproximate: data.timeIsApproximate,
        chartData: chart,
        createdAt: currentPerson?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await savePerson(personData)
      await refreshPeople()
      setCurrentChartData(chart)
      setCurrentView('chart')
    } catch (error) {
      console.error('Error guardando persona:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPerson = async (person: SavedPerson) => {
    setLoading(true)
    try {
      if (person.chartData) {
        setCurrentChartData(person.chartData)
      } else {
        const chart = await calculateChart(person.birthData)
        setCurrentChartData(chart)
        await savePerson({ ...person, chartData: chart })
      }
      setCurrentPerson(person)
      setCurrentView('chart')
    } catch (error) {
      console.error('Error cargando persona:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPerson = (person: SavedPerson) => {
    setCurrentPerson(person)
    setCurrentView('edit-person')
  }

  const handleDeletePerson = async (id: string) => {
    await deletePerson(id)
    await refreshPeople()
  }

  const handleToggleFavorite = async (person: SavedPerson) => {
    const updatedPerson = { ...person, favorite: !person.favorite }
    await savePerson(updatedPerson)
    await refreshPeople()
  }

  const handleImportPeople = async (importedPeople: SavedPerson[]) => {
    const existingPeople = await loadPeople()
    
    // Combinar: mantener existentes y añadir nuevos (por ID)
    const existingIds = new Set(existingPeople.map(p => p.id))
    const newPeople = importedPeople.filter(p => !existingIds.has(p.id))
    
    // Añadir nuevas personas
    for (const person of newPeople) {
      await savePerson(person)
    }
    
    await refreshPeople()
  }

  const handleComparePerson = async (person: SavedPerson) => {
    if (!myChart?.chartData) {
      alert('Necesitas tener tu carta natal guardada para comparar.')
      return
    }

    setLoading(true)
    try {
      // Asegurar que la carta de la otra persona esté calculada
      let otherChartData: ChartData
      if (person.chartData) {
        otherChartData = person.chartData
      } else {
        otherChartData = await calculateChart(person.birthData)
        await savePerson({ ...person, chartData: otherChartData })
      }

      setComparePerson(person)
      setCurrentView('compare')
    } catch (error) {
      console.error('Error preparando comparación:', error)
      alert('Error al preparar la comparación. Asegúrate de que ambas cartas estén calculadas.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewTransits = (person?: SavedPerson) => {
    // Si no se pasa persona, usar mi carta
    const personToView = person || myChart
    if (!personToView) {
      setCurrentView('edit-my-chart')
      return
    }
    
    // Si no tiene carta calculada, intentar calcularla
    if (!personToView.chartData) {
      setCurrentPerson(personToView)
      setCurrentView('edit-person')
      return
    }
    
    setTransitsPerson(personToView)
    setCurrentView('transits')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setCurrentPerson(null)
    setCurrentChartData(null)
    setTransitsPerson(null)
    setShowTransitCalendar(false)
    setShowTransitReminders(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mi Carta Astral</h1>
          </div>
          <p className="text-gray-600">Gestiona tu carta y las de tus personas cercanas</p>
        </header>

        {/* Vista Home */}
        {currentView === 'home' && (
          <HomePage
            myChart={myChart}
            people={people}
            onViewMyChart={handleViewMyChart}
            onEditMyChart={handleEditMyChart}
            onViewDemo={handleViewDemo}
            onAddPerson={handleAddPerson}
            onViewPerson={handleViewPerson}
            onEditPerson={handleEditPerson}
            onDeletePerson={handleDeletePerson}
            onComparePerson={handleComparePerson}
            onToggleFavorite={handleToggleFavorite}
            onImportPeople={handleImportPeople}
            onViewTransits={() => handleViewTransits()}
            onViewPersonTransits={handleViewTransits}
            onViewCompatibilityMatrix={() => setCurrentView('compatibility-matrix')}
            onViewTransitReminders={() => setCurrentView('transit-reminders')}
            onViewDemo={handleViewDemo}
          />
        )}

        {/* Vista de Tránsitos */}
        {currentView === 'transits' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleBackToHome}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Volver al inicio
            </button>
            {!transitsPerson?.chartData ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  {transitsPerson 
                    ? `${transitsPerson.name} no tiene carta natal calculada.`
                    : 'Necesitas tener una carta natal guardada para ver los tránsitos.'}
                </p>
                {transitsPerson ? (
                  <button
                    onClick={() => {
                      setCurrentPerson(transitsPerson)
                      setCurrentView('edit-person')
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Calcular Carta
                  </button>
                ) : (
                  <button
                    onClick={handleEditMyChart}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Añadir Mi Carta
                  </button>
                )}
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando tránsitos...</p>
              </div>
            ) : (
              <TodayDashboard 
                natalChart={transitsPerson.chartData} 
                personName={transitsPerson.name}
                showCalendar={showTransitCalendar}
                showReminders={showTransitReminders}
                onToggleCalendar={() => setShowTransitCalendar(!showTransitCalendar)}
                onToggleReminders={() => setShowTransitReminders(!showTransitReminders)}
              />
            )}
          </div>
        )}

        {/* Formulario: Añadir Persona */}
        {currentView === 'add-person' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AddPersonForm
              onSubmit={handleSavePerson}
              onCancel={handleBackToHome}
            />
          </div>
        )}

        {/* Formulario: Editar Persona */}
        {currentView === 'edit-person' && currentPerson && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AddPersonForm
              onSubmit={handleSavePerson}
              onCancel={handleBackToHome}
              initialData={currentPerson.birthData}
              initialTimeIsApproximate={currentPerson.timeIsApproximate}
              isEdit={true}
            />
          </div>
        )}

        {/* Formulario: Editar Mi Carta */}
        {currentView === 'edit-my-chart' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AddPersonForm
              onSubmit={handleSaveMyChart}
              onCancel={handleBackToHome}
              initialData={myChart?.birthData}
              initialTimeIsApproximate={myChart?.timeIsApproximate}
              isEdit={!!myChart}
            />
          </div>
        )}

        {/* Vista de Comparación */}
        {currentView === 'compare' && myChart?.chartData && comparePerson?.chartData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CompareView
              myChart={myChart.chartData}
              otherChart={comparePerson.chartData}
              myName={myChart.name}
              otherName={comparePerson.name}
              onBack={handleBackToHome}
            />
          </div>
        )}

        {/* Vista de Carta */}
        {currentView === 'chart' && currentChartData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleBackToHome}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Volver al inicio
            </button>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Calculando carta astral...</p>
              </div>
            ) : (
              <ChartView chartData={currentChartData} />
            )}
          </div>
        )}

        {/* Vista de Matriz de Compatibilidad */}
        {currentView === 'compatibility-matrix' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CompatibilityMatrix
              people={people}
              myChart={myChart}
              onCompare={handleComparePerson}
              onBack={handleBackToHome}
            />
          </div>
        )}

        {/* Vista de Recordatorios de Tránsitos */}
        {currentView === 'transit-reminders' && myChart?.chartData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TransitReminders
              natalChart={myChart.chartData}
              personName={myChart.name}
              onBack={handleBackToHome}
            />
          </div>
        )}

        {/* Loading global */}
        {loading && currentView === 'home' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
