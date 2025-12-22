import { useState } from 'react'
import type { ChartData } from '../types/astrology'
import { Sparkles, List, Gamepad2, GitBranch, Download } from 'lucide-react'
import ChartGameView from './Chart/ChartGameView'
import AspectsView from './Chart/AspectsView'
import { getPlanetTextColor, getSignTextColor, getHouseTextColor, getSignColor } from '../lib/utils/planet-colors'
import { exportChartToPDF } from '../lib/utils/pdf-export'
import PlanetLink from './Transits/PlanetLink'
import SignLink from './Chart/SignLink'
import HouseLink from './Chart/HouseLink'
import CollapsibleSection from './CollapsibleSection'

interface ChartViewProps {
  chartData: ChartData
}

type ViewMode = 'detailed' | 'game' | 'aspects'

// Función para formatear fecha correctamente (evita problemas de zona horaria)
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  return `${day} de ${months[month - 1]} de ${year}`
}

// Función para formatear grados en formato astrológico (signo° minuto' segundo")
function formatDegrees(decimalDegrees: number): string {
  const sign = Math.floor(decimalDegrees / 30)
  const degreesInSign = decimalDegrees % 30
  const degrees = Math.floor(degreesInSign)
  const minutes = Math.floor((degreesInSign - degrees) * 60)
  const seconds = Math.floor(((degreesInSign - degrees) * 60 - minutes) * 60)
  
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  
  return `${degrees}° ${minutes}' ${seconds}" en ${signs[sign] || '?'}`
}

export default function ChartView({ chartData }: ChartViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('detailed')
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportChartToPDF(chartData)
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{chartData.birthData.name}</h2>
              {chartData.birthData.name.includes('Robe Iniesta') && (
                <p className="text-purple-200 text-sm italic mb-1">
                  En memoria del poeta del rock español
                </p>
              )}
              <p className="text-purple-100">
                Nacido el {formatDate(chartData.birthData.date)} a las {chartData.birthData.time}
                {chartData.birthData.time === '12:00' && chartData.birthData.name.includes('Robe Iniesta') && (
                  <span className="text-purple-200 text-xs ml-2">(hora aproximada)</span>
                )}
              </p>
              <p className="text-purple-100 text-sm">{chartData.birthData.place}</p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Exportar carta a PDF"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Generando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Signos Principales - Sección Destacada */}
      <CollapsibleSection
        title="Tus Signos Principales"
        icon={<Sparkles className="w-5 h-5 text-purple-600" />}
        defaultExpanded={true}
        className="bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 border-2 border-purple-200"
        titleClassName="text-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 -mt-4">
          {/* Signo Solar */}
          {(() => {
            // Debug: mostrar todos los planetas disponibles
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 Planetas disponibles:', chartData.planets.map(p => p.name))
            }
            const sun = chartData.planets.find(p => 
              p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
            )
            return sun ? (
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-400 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">☉</span>
                  <p className="text-xs text-gray-600 font-medium">Signo Solar</p>
                </div>
                <p className="text-2xl font-bold">
                  <SignLink signName={sun.sign} showIcon={false} />
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sun.degree.toFixed(1)}° <SignLink signName={sun.sign} showIcon={false} className="text-sm" />
                </p>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Tu signo principal (lo que la mayoría conoce como "tu signo")
                </p>
              </div>
            ) : null
          })()}

          {/* Signo Lunar */}
          {(() => {
            const moon = chartData.planets.find(p => 
              p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
            )
            return moon ? (
              <div className="bg-white rounded-lg p-4 border-2 border-silver-400 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">☽</span>
                  <p className="text-xs text-gray-600 font-medium">Signo Lunar</p>
                </div>
                <p className="text-2xl font-bold">
                  <SignLink signName={moon.sign} showIcon={false} />
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {moon.degree.toFixed(1)}° <SignLink signName={moon.sign} showIcon={false} className="text-sm" />
                </p>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Cómo procesas emociones y qué necesitas para sentirte seguro
                </p>
              </div>
            ) : null
          })()}

          {/* Ascendente */}
          {chartData.ascendant && (
            <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">↑</span>
                <p className="text-xs text-gray-600 font-medium">Ascendente</p>
              </div>
              <p className="text-2xl font-bold">
                <SignLink signName={chartData.ascendant} showIcon={false} />
              </p>
              <p className="text-xs text-gray-500 mt-1">ASC</p>
              <p className="text-xs text-gray-400 mt-2 italic">
                Cómo te presentas al mundo y la primera impresión que das
              </p>
            </div>
          )}

          {/* Medio Cielo */}
          {chartData.midheaven && (
            <div className="bg-white rounded-lg p-4 border-2 border-amber-400 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">MC</span>
                <p className="text-xs text-gray-600 font-medium">Medio Cielo</p>
              </div>
              <p className="text-2xl font-bold">
                <SignLink signName={chartData.midheaven} showIcon={false} />
              </p>
              <p className="text-xs text-gray-500 mt-1">MC</p>
              <p className="text-xs text-gray-400 mt-2 italic">
                Tu vocación, carrera y aspiraciones más altas
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Tabs de navegación */}
      <div className="flex gap-2 bg-white rounded-xl shadow-lg p-2">
        <button
          onClick={() => setViewMode('detailed')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            viewMode === 'detailed'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <List className="w-5 h-5" />
          Posiciones Detalladas
        </button>
        <button
          onClick={() => setViewMode('game')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            viewMode === 'game'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          Vista Gamificada
        </button>
        <button
          onClick={() => setViewMode('aspects')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            viewMode === 'aspects'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          Aspectos
        </button>
      </div>

      {/* Contenido según modo de vista */}
      {viewMode === 'game' ? (
        <ChartGameView chartData={chartData} />
      ) : viewMode === 'aspects' ? (
        <AspectsView chartData={chartData} />
      ) : (
        <>
          {/* Ascendente y MC */}
          {(chartData.ascendant || chartData.midheaven) && (
            <CollapsibleSection
              title="Ascendente y Medio Cielo"
              defaultExpanded={true}
            >
              <div className="grid grid-cols-2 gap-4 -mt-4">
                {chartData.ascendant && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ascendente</p>
                    <p className="text-xl font-semibold">
                      <SignLink signName={chartData.ascendant} showIcon={false} />
                    </p>
                  </div>
                )}
                {chartData.midheaven && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Medio Cielo (MC)</p>
                    <p className="text-xl font-semibold">
                      <SignLink signName={chartData.midheaven} showIcon={false} />
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Planetas */}
          <CollapsibleSection
            title="Posiciones Planetarias"
            defaultExpanded={true}
          >
            <div className="space-y-2 -mt-4">
              {chartData.planets.map((planet) => (
                <div
                  key={planet.name}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {planet.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <PlanetLink planetName={planet.name} showIcon={false} className="font-medium" />
                      <p className="text-sm text-gray-500">
                        {planet.degree.toFixed(1)}° en <SignLink signName={planet.sign} showIcon={false} className="text-sm" />
                        {planet.house && (
                          <span> (<HouseLink houseNumber={planet.house} showIcon={false} className="text-sm" />)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSignColor(planet.sign).bg} ${getSignTextColor(planet.sign)}`}>
                    <SignLink signName={planet.sign} showIcon={false} />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </>
      )}
    </div>
  )
}

