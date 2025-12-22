import { Database, Sparkles, Download, Upload, Heart, Bell, BookOpen } from 'lucide-react'
import { useState, useRef } from 'react'
import type { SavedPerson, ChartData } from '../types/astrology'
import MyChartSection from './MyChartSection'
import PeopleSection from './PeopleSection'
import TransitsSection from './Transits/TransitsSection'
import Tutorial from './Tutorial'
import { exportPeopleToJSON, importPeopleFromJSON } from '../lib/utils/data-export'

interface HomePageProps {
  myChart: SavedPerson | null
  people: SavedPerson[]
  onViewMyChart: () => void
  onEditMyChart: () => void
  onViewDemo: () => void
  onAddPerson: () => void
  onViewPerson: (person: SavedPerson) => void
  onEditPerson: (person: SavedPerson) => void
  onDeletePerson: (id: string) => void
  onComparePerson: (person: SavedPerson) => void
  onToggleFavorite: (person: SavedPerson) => void
  onViewTransits: () => void
  onViewPersonTransits?: (person: SavedPerson) => void
  onImportPeople: (people: SavedPerson[]) => Promise<void>
  onViewCompatibilityMatrix?: () => void
  onViewTransitReminders?: () => void
}

export default function HomePage({
  myChart,
  people,
  onViewMyChart,
  onEditMyChart,
  onViewDemo,
  onAddPerson,
  onViewPerson,
  onEditPerson,
  onDeletePerson,
  onComparePerson,
  onToggleFavorite,
  onViewTransits,
  onViewPersonTransits,
  onImportPeople,
  onViewCompatibilityMatrix,
  onViewTransitReminders
}: HomePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  
  // Obtener ChartData de mi carta si existe
  const myChartData: ChartData | null = myChart?.chartData || null

  // Calcular estadísticas
  const otherPeople = people.filter(p => !p.isSelf)
  const favoritesCount = otherPeople.filter(p => p.favorite).length
  const relationshipsCount = {
    familia: otherPeople.filter(p => p.relationship === 'familia').length,
    pareja: otherPeople.filter(p => p.relationship === 'pareja').length,
    amigo: otherPeople.filter(p => p.relationship === 'amigo').length,
    trabajo: otherPeople.filter(p => p.relationship === 'trabajo').length,
    otro: otherPeople.filter(p => p.relationship === 'otro').length
  }

  return (
    <div className="space-y-6">
      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial
          onClose={() => setShowTutorial(false)}
          onStartDemo={() => {
            setShowTutorial(false)
            if (onViewDemo) {
              setTimeout(() => onViewDemo(), 300)
            }
          }}
        />
      )}

      {/* Botón de Tutorial */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-4 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              ¿Primera vez aquí?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Aprende a usar todas las funcionalidades con nuestro tutorial interactivo
            </p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Iniciar Tutorial
          </button>
        </div>
      </div>
      {/* Panel de Estadísticas */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Estadísticas Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{otherPeople.length}</div>
            <div className="text-sm text-gray-600 mt-1">Personas guardadas</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">{favoritesCount}</div>
            <div className="text-sm text-gray-600 mt-1">Favoritos</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {myChart ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Mi carta</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(relationshipsCount).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Relaciones</div>
          </div>
        </div>
        {Object.values(relationshipsCount).some(count => count > 0) && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="text-sm text-gray-600 mb-2">Por tipo:</div>
            <div className="flex flex-wrap gap-2">
              {relationshipsCount.familia > 0 && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  👨‍👩‍👧‍👦 Familia: {relationshipsCount.familia}
                </span>
              )}
              {relationshipsCount.pareja > 0 && (
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                  💑 Pareja: {relationshipsCount.pareja}
                </span>
              )}
              {relationshipsCount.amigo > 0 && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  👤 Amigos: {relationshipsCount.amigo}
                </span>
              )}
              {relationshipsCount.trabajo > 0 && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  💼 Trabajo: {relationshipsCount.trabajo}
                </span>
              )}
              {relationshipsCount.otro > 0 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Otros: {relationshipsCount.otro}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Sección: Mi Carta */}
      <section>
        <MyChartSection
          myChart={myChart}
          onViewChart={onViewMyChart}
          onEditChart={onEditMyChart}
        />
      </section>

      {/* Sección: Tránsitos Hoy */}
      {myChart && (
        <section>
          <TransitsSection
            natalChart={myChartData}
            onViewFullDashboard={onViewTransits}
          />
        </section>
      )}

      {/* Sección: Herramientas Avanzadas */}
      {myChart?.chartData && (
        <section>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Herramientas Avanzadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onViewCompatibilityMatrix && (
                <button
                  onClick={onViewCompatibilityMatrix}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-3 text-left"
                >
                  <Heart className="w-6 h-6" />
                  <div>
                    <div className="font-bold">Matriz de Compatibilidad</div>
                    <div className="text-sm opacity-90">Ver afinidad con todas las personas</div>
                  </div>
                </button>
              )}
              {onViewTransitReminders && (
                <button
                  onClick={onViewTransitReminders}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-3 text-left"
                >
                  <Bell className="w-6 h-6" />
                  <div>
                    <div className="font-bold">Recordatorios de Tránsitos</div>
                    <div className="text-sm opacity-90">Tránsitos importantes próximos</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sección: Personas */}
      <section>
        <PeopleSection
          people={people}
          myChart={myChart}
          onAddPerson={onAddPerson}
          onViewPerson={onViewPerson}
          onEditPerson={onEditPerson}
          onDeletePerson={onDeletePerson}
          onComparePerson={onComparePerson}
          onToggleFavorite={onToggleFavorite}
          onViewTransits={onViewPersonTransits}
        />
      </section>

      {/* Sección: Ejemplos */}
      <section>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Ejemplos</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Explora cartas astrales de ejemplo para entender cómo funciona la aplicación.
          </p>
          <button
            onClick={onViewDemo}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
          >
            <Database className="w-5 h-5" />
            Ver Demo: Robe Iniesta (Extremoduro)
          </button>
        </div>
      </section>

      {/* Sección: Backup */}
      <section>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Backup de Datos</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Exporta todas tus cartas guardadas o importa desde un archivo de respaldo.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => exportPeopleToJSON(people)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar Datos
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {importing ? 'Importando...' : 'Importar Datos'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                
                setImporting(true)
                try {
                  const importedPeople = await importPeopleFromJSON(file)
                  await onImportPeople(importedPeople)
                  alert(`✅ Se importaron ${importedPeople.length} personas correctamente.`)
                } catch (error) {
                  console.error('Error importando:', error)
                  alert(`❌ Error al importar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
                } finally {
                  setImporting(false)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

