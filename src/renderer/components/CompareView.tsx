import { useState, useMemo } from 'react'
import type { ChartData } from '../types/astrology'
import { Users, ArrowLeftRight, Sparkles, HelpCircle, X, Download } from 'lucide-react'
import { calculateElements, calculateRPGStats } from '../lib/astrology/chart-game-calculator'
import PlanetLink from './Transits/PlanetLink'
import { calculateAffinity } from '../lib/utils/affinity-calculator'
import { exportCompareToPDF } from '../lib/utils/compare-pdf-export'
import SignLink from './Chart/SignLink'
import CollapsibleSection from './CollapsibleSection'

interface CompareViewProps {
  myChart: ChartData
  otherChart: ChartData
  myName: string
  otherName: string
  onBack: () => void
}

// Función para calcular la longitud absoluta de un planeta (0-360°)
function getAbsoluteLongitude(planet: { sign: string; degree: number }): number {
  const signOrder: Record<string, number> = {
    'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
    'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
    'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
  }
  const signOffset = signOrder[planet.sign] || 0
  return signOffset + planet.degree
}

// Función para obtener nombre del aspecto en español
function getAspectName(type: string): string {
  const names: Record<string, string> = {
    'conjunction': 'Conjunción',
    'trine': 'Trígono',
    'sextile': 'Sextil',
    'square': 'Cuadratura',
    'opposition': 'Oposición'
  }
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

// Función para normalizar nombre de planeta (inglés → español)
function normalizePlanetName(name: string): string {
  const map: Record<string, string> = {
    'Sun': 'Sol',
    'sun': 'Sol',
    'Moon': 'Luna',
    'moon': 'Luna',
    'Mercury': 'Mercurio',
    'mercury': 'Mercurio',
    'Venus': 'Venus',
    'venus': 'Venus',
    'Mars': 'Marte',
    'mars': 'Marte',
    'Jupiter': 'Júpiter',
    'jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'saturn': 'Saturno',
    'Uranus': 'Urano',
    'uranus': 'Urano',
    'Neptune': 'Neptuno',
    'neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'pluto': 'Plutón'
  }
  return map[name] || name
}

// Función para obtener el área de vida que rige una combinación de planetas
function getPlanetArea(planet1: string, planet2: string): string {
  // Normalizar nombres
  const p1 = normalizePlanetName(planet1)
  const p2 = normalizePlanetName(planet2)
  
  const planetAreas: Record<string, string> = {
    'Sol': 'la identidad y vitalidad',
    'Luna': 'las emociones y necesidades',
    'Mercurio': 'la comunicación y pensamiento',
    'Venus': 'el amor y relaciones',
    'Marte': 'la pasión y acción',
    'Júpiter': 'la expansión y filosofía',
    'Saturno': 'la estructura y responsabilidad',
    'Urano': 'la innovación y libertad',
    'Neptuno': 'la espiritualidad e idealismo',
    'Plutón': 'la transformación y poder',
    'Ascendente': 'la personalidad externa',
    'Medio Cielo': 'la carrera y vocación'
  }

  // Combinaciones específicas
  const combinations: Record<string, string> = {
    'Sol-Luna': 'la conexión emocional y la identidad',
    'Luna-Sol': 'la conexión emocional y la identidad',
    'Venus-Marte': 'el amor, la pasión y las relaciones románticas',
    'Marte-Venus': 'el amor, la pasión y las relaciones románticas',
    'Mercurio-Mercurio': 'la comunicación y el diálogo',
    'Venus-Venus': 'los valores, gustos y atracción mutua',
    'Luna-Luna': 'las necesidades emocionales y el hogar',
    'Sol-Sol': 'la identidad y la vitalidad',
    'Júpiter-Venus': 'el amor, la expansión y la suerte en relaciones',
    'Venus-Júpiter': 'el amor, la expansión y la suerte en relaciones',
    'Saturno-Venus': 'el compromiso, la responsabilidad y la estabilidad en el amor',
    'Venus-Saturno': 'el compromiso, la responsabilidad y la estabilidad en el amor',
    'Marte-Marte': 'la pasión, la acción y la energía',
    'Mercurio-Venus': 'la comunicación en el amor y las relaciones',
    'Venus-Mercurio': 'la comunicación en el amor y las relaciones',
    'Luna-Venus': 'la conexión emocional y afectiva',
    'Venus-Luna': 'la conexión emocional y afectiva',
    'Júpiter-Luna': 'la expansión emocional y el crecimiento',
    'Luna-Júpiter': 'la expansión emocional y el crecimiento',
    'Saturno-Luna': 'la estructura emocional y las responsabilidades',
    'Luna-Saturno': 'la estructura emocional y las responsabilidades',
    'Júpiter-Mercurio': 'la expansión mental y la filosofía',
    'Mercurio-Júpiter': 'la expansión mental y la filosofía',
    'Júpiter-Sol': 'la expansión de la identidad y el crecimiento personal',
    'Sol-Júpiter': 'la expansión de la identidad y el crecimiento personal',
    'Neptuno-Venus': 'el amor idealizado y la espiritualidad',
    'Venus-Neptuno': 'el amor idealizado y la espiritualidad',
    'Plutón-Venus': 'la transformación en el amor y las relaciones',
    'Venus-Plutón': 'la transformación en el amor y las relaciones'
  }

  const key1 = `${p1}-${p2}`
  const key2 = `${p2}-${p1}`
  
  if (combinations[key1]) return combinations[key1]
  if (combinations[key2]) return combinations[key2]
  
  // Si no hay combinación específica, combinar áreas individuales
  // Añadir áreas para planetas menores si no están en la lista
  if (!planetAreas[p1]) {
    // Intentar inferir el área basándose en el nombre o usar genérico
    const minorPlanetAreas: Record<string, string> = {
      'Chiron': 'las heridas y la sanación',
      'Quirón': 'las heridas y la sanación',
      'Nodo Norte': 'el destino y el crecimiento',
      'Nodo Sur': 'el karma y las lecciones',
      'Lilith': 'la sombra y la autenticidad',
      'Ascendente': 'la personalidad externa',
      'Medio Cielo': 'la carrera y vocación',
      'MC': 'la carrera y vocación'
    }
    planetAreas[p1] = minorPlanetAreas[p1] || `la energía de ${p1}`
  }
  
  if (!planetAreas[p2]) {
    const minorPlanetAreas: Record<string, string> = {
      'Chiron': 'las heridas y la sanación',
      'Quirón': 'las heridas y la sanación',
      'Nodo Norte': 'el destino y el crecimiento',
      'Nodo Sur': 'el karma y las lecciones',
      'Lilith': 'la sombra y la autenticidad',
      'Ascendente': 'la personalidad externa',
      'Medio Cielo': 'la carrera y vocación',
      'MC': 'la carrera y vocación'
    }
    planetAreas[p2] = minorPlanetAreas[p2] || `la energía de ${p2}`
  }
  
  const area1 = planetAreas[p1]
  const area2 = planetAreas[p2]
  
  // Si son el mismo planeta, usar singular
  if (p1 === p2) {
    return area1
  }
  
  return `${area1} y ${area2}`
}

// Función para generar interpretación personalizada de un aspecto de sinastría
function getSynastryInterpretation(planet1: string, planet2: string, aspectType: string): string {
  const planetArea = getPlanetArea(planet1, planet2)

  const interpretations: Record<string, Record<string, string>> = {
    'conjunction': {
      'Sol-Luna': 'Fusión emocional profunda. Se entienden a nivel instintivo. Hay química natural y conexión intensa.',
      'Venus-Marte': 'Atracción física y pasión intensa. Hay química sexual y deseo mutuo. Puede ser muy apasionado.',
      'Venus-Venus': 'Valores y gustos similares. Se atraen naturalmente. Hay armonía en lo que les gusta y valoran.',
      'Luna-Luna': 'Entienden sus necesidades emocionales. Hay empatía y comprensión mutua a nivel emocional.',
      'Mercurio-Mercurio': 'Se comunican fácilmente. Piensan de forma similar. Hay buena química mental.',
      'default': `Fusión de energías en ${planetArea}. Puede ser muy intenso, ya sea positivo o desafiante según cómo se maneje. Este aspecto conecta profundamente estas áreas de vuestras vidas.`
    },
    'trine': {
      'Sol-Luna': 'Armonía emocional natural. Se entienden bien, hay química y conexión profunda. La relación fluye fácilmente.',
      'Venus-Marte': 'Atracción y pasión armoniosa. Hay química física y emocional. La relación romántica fluye bien.',
      'Venus-Luna': 'Conexión emocional y afectiva profunda. Se sienten cómodos juntos. Hay ternura y comprensión mutua.',
      'Mercurio-Venus': 'Comunicación armoniosa en el amor. Se expresan bien juntos. Hay buena química conversacional.',
      'Júpiter-Venus': 'Expansión positiva en el amor. Se apoyan mutuamente. Hay suerte y crecimiento en la relación.',
      'default': `Armonía natural en ${planetArea}. Facilita la conexión y el entendimiento mutuo. Las cosas fluyen bien en esta área de vuestras vidas, creando comprensión y apoyo mutuo.`
    },
    'sextile': {
      'Venus-Marte': 'Oportunidades de atracción y pasión. Pueden desarrollar química si se dan la oportunidad. Hay potencial romántico.',
      'Mercurio-Venus': 'Buena comunicación y entendimiento. Se complementan bien en conversaciones. Hay química mental.',
      'Luna-Venus': 'Conexión emocional y afectiva. Se sienten cómodos juntos. Hay ternura y comprensión.',
      'default': `Oportunidades de crecimiento en ${planetArea}. Se apoyan mutuamente en esta área. Hay potencial positivo si trabajan juntos y se dan la oportunidad de desarrollarse.`
    },
    'square': {
      'Venus-Marte': 'Atracción con fricción. Hay química pero también conflictos. Puede haber tensión sexual o romántica.',
      'Sol-Luna': 'Desafíos emocionales. Pueden tener diferentes necesidades. Requiere trabajo para entenderse.',
      'Mercurio-Mercurio': 'Dificultades de comunicación. Piensan diferente. Pueden malinterpretarse. Requiere paciencia.',
      'Saturno-Venus': 'Restricciones o responsabilidades en el amor. Puede haber bloqueos emocionales. Requiere compromiso.',
      'default': `Fricción en ${planetArea}. Puede crear desafíos y tensiones en esta área, pero también crecimiento si trabajan las diferencias y aprenden a complementarse.`
    },
    'opposition': {
      'Venus-Marte': 'Atracción y repulsión. Hay química intensa pero también conflictos. Puede ser pasional pero volátil.',
      'Sol-Luna': 'Polaridades emocionales. Tienen necesidades diferentes. Requiere equilibrio y compromiso.',
      'Mercurio-Mercurio': 'Pensamientos opuestos. Ven las cosas desde ángulos diferentes. Requiere diálogo y respeto mutuo.',
      'default': `Polaridades en ${planetArea}. Pueden atraerse y repelerse en esta área. Requiere equilibrio, compromiso y aceptación de diferencias para que funcione bien.`
    }
  }

  // Buscar interpretación específica
  const key1 = `${planet1}-${planet2}`
  const key2 = `${planet2}-${planet1}`
  const aspectInterpretations = interpretations[aspectType] || {}
  
  const aspectName = getAspectName(aspectType)
  return aspectInterpretations[key1] || 
         aspectInterpretations[key2] || 
         aspectInterpretations['default'] || 
         `Aspecto ${aspectName} en ${planetArea}. Este aspecto conecta estas áreas de vuestras vidas.`
}

// Función para calcular aspectos de sinastría entre dos cartas
function calculateSynastryAspects(chart1: ChartData, chart2: ChartData) {
  const aspects: Array<{
    planet1: string
    planet2: string
    type: string
    orb: number
    description: string
    interpretation: string
  }> = []

  // Comparar cada planeta de la carta 1 con cada planeta de la carta 2
  for (const planet1 of chart1.planets) {
    for (const planet2 of chart2.planets) {
      // Calcular longitudes absolutas (0-360°)
      const long1 = getAbsoluteLongitude(planet1)
      const long2 = getAbsoluteLongitude(planet2)
      
      // Calcular diferencia angular (0-180°)
      const diff = Math.abs(long1 - long2)
      const angle = Math.min(diff, 360 - diff)
      
      // Identificar aspectos mayores
      const aspectRanges = [
        { type: 'conjunction', angle: 0, orb: 8 },
        { type: 'sextile', angle: 60, orb: 6 },
        { type: 'square', angle: 90, orb: 8 },
        { type: 'trine', angle: 120, orb: 8 },
        { type: 'opposition', angle: 180, orb: 8 }
      ]

      for (const aspectRange of aspectRanges) {
        const diffFromAspect = Math.abs(angle - aspectRange.angle)
        if (diffFromAspect <= aspectRange.orb) {
          const isTense = ['square', 'opposition'].includes(aspectRange.type)
          const isHarmonious = ['trine', 'sextile'].includes(aspectRange.type)
          
          // Normalizar nombres de planetas a español
          const planet1Name = normalizePlanetName(planet1.name)
          const planet2Name = normalizePlanetName(planet2.name)
          
          const interpretation = getSynastryInterpretation(planet1Name, planet2Name, aspectRange.type)
          
          aspects.push({
            planet1: planet1Name,
            planet2: planet2Name,
            type: aspectRange.type,
            orb: diffFromAspect,
            description: isTense 
              ? 'Aspecto tenso - Puede generar desafíos o fricción'
              : isHarmonious
              ? 'Aspecto armónico - Facilita la conexión y armonía'
              : 'Conjunción - Fusión de energías, puede ser intenso',
            interpretation
          })
          break
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb) // Ordenar por orbe (más exactos primero)
}

export default function CompareView({ myChart, otherChart, myName, otherName, onBack }: CompareViewProps) {
  const [showMainExplanation, setShowMainExplanation] = useState(false)
  const [showAspectsExplanation, setShowAspectsExplanation] = useState(false)
  const [showElementsExplanation, setShowElementsExplanation] = useState(false)
  const [showStatsExplanation, setShowStatsExplanation] = useState(false)
  const [showAllAspects, setShowAllAspects] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const synastryAspects = useMemo(() => 
    calculateSynastryAspects(myChart, otherChart), 
    [myChart, otherChart]
  )

  const affinity = useMemo(() => 
    calculateAffinity(myChart, otherChart),
    [myChart, otherChart]
  )

  const myElements = useMemo(() => calculateElements(myChart), [myChart])
  const otherElements = useMemo(() => calculateElements(otherChart), [otherChart])

  const myStats = useMemo(() => calculateRPGStats(myChart), [myChart])
  const otherStats = useMemo(() => calculateRPGStats(otherChart), [otherChart])

  const harmoniousAspects = synastryAspects.filter(a => ['trine', 'sextile'].includes(a.type))
  const tenseAspects = synastryAspects.filter(a => ['square', 'opposition'].includes(a.type))
  const conjunctions = synastryAspects.filter(a => a.type === 'conjunction')

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportCompareToPDF(myChart, otherChart, myName, otherName)
    } catch (error) {
      console.error('Error exportando comparación:', error)
      alert('Error al exportar la comparación. Por favor, inténtalo de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  // Obtener signos principales
  const mySun = myChart.planets.find(p => p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun')
  const myMoon = myChart.planets.find(p => p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon')
  const otherSun = otherChart.planets.find(p => p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun')
  const otherMoon = otherChart.planets.find(p => p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon')

  const getAspectColor = (type: string) => {
    switch (type) {
      case 'conjunction': return 'bg-yellow-100 border-yellow-400 text-yellow-800'
      case 'trine': return 'bg-green-100 border-green-400 text-green-800'
      case 'sextile': return 'bg-blue-100 border-blue-400 text-blue-800'
      case 'square': return 'bg-orange-100 border-orange-400 text-orange-800'
      case 'opposition': return 'bg-red-100 border-red-400 text-red-800'
      default: return 'bg-gray-100 border-gray-400 text-gray-800'
    }
  }

  const getAffinityColor = (level: string) => {
    switch (level) {
      case 'excelente': return '#10b981' // green-500
      case 'muy buena': return '#3b82f6' // blue-500
      case 'buena': return '#8b5cf6' // purple-500
      case 'regular': return '#f59e0b' // amber-500
      case 'baja': return '#ef4444' // red-500
      default: return '#6b7280' // gray-500
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Volver
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Comparación de Cartas</h2>
              <p className="text-purple-100">Sinastría entre {myName} y {otherName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
              title="Exportar comparación a PDF"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button
              onClick={() => setShowMainExplanation(!showMainExplanation)}
              className="text-white/80 hover:text-white transition-colors"
              title="¿Qué es la sinastría?"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Explicación principal */}
        {showMainExplanation && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white">📚 ¿Qué es la Sinastría?</h3>
              <button
                onClick={() => setShowMainExplanation(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-white/90 space-y-2">
              <p>
                La <strong>sinastría</strong> es la comparación entre dos cartas astrales para entender cómo interactúan dos personas.
              </p>
              <p>
                <strong>🔍 Aspectos de Sinastría:</strong> Cuando un planeta de tu carta forma un aspecto (ángulo) con un planeta de la otra persona, 
                crea una conexión energética. Los aspectos armónicos (trígonos, sextiles) facilitan la conexión. 
                Los aspectos tensos (cuadraturas, oposiciones) pueden crear desafíos pero también crecimiento.
              </p>
              <p>
                <strong>💡 Comparación de Elementos:</strong> Ver si tienen elementos complementarios (ej: uno tiene mucho fuego, otro mucha tierra) 
                puede indicar equilibrio o desequilibrio en la relación.
              </p>
              <p>
                <strong>⚔️ Stats RPG:</strong> Comparar tus capacidades naturales puede mostrar dónde se complementan o dónde pueden chocar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grado de Afinidad */}
      <CollapsibleSection
        title={
          <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Grado de Afinidad
          </span>
        }
        defaultExpanded={true}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold mb-2" style={{ color: getAffinityColor(affinity.level) }}>
              {affinity.percentage}%
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">{affinity.description}</p>
            <p className="text-sm text-gray-600">{affinity.level}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2">Resumen de Aspectos:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">🟢 Armónicos:</span>
                <span className="text-gray-700">{harmoniousAspects.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">🔴 Tensos:</span>
                <span className="text-gray-700">{tenseAspects.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-semibold">🟡 Conjunciones:</span>
                <span className="text-gray-700">{conjunctions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Signos Principales Comparados */}
      <CollapsibleSection
        title={
          <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Signos Principales
          </span>
        }
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tu carta */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3">{myName}</h4>
            <div className="space-y-2 text-sm">
              {mySun && (
                <div className="flex justify-between">
                  <span className="text-gray-600">☉ Sol:</span>
                  <SignLink signName={mySun.sign} showIcon={false} className="font-semibold" />
                </div>
              )}
              {myMoon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">☽ Luna:</span>
                  <SignLink signName={myMoon.sign} showIcon={false} className="font-semibold" />
                </div>
              )}
              {myChart.ascendant && (
                <div className="flex justify-between">
                  <span className="text-gray-600">↑ Ascendente:</span>
                  <SignLink signName={myChart.ascendant} showIcon={false} className="font-semibold" />
                </div>
              )}
            </div>
          </div>

          {/* Otra carta */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border-2 border-pink-200">
            <h4 className="font-bold text-gray-900 mb-3">{otherName}</h4>
            <div className="space-y-2 text-sm">
              {otherSun && (
                <div className="flex justify-between">
                  <span className="text-gray-600">☉ Sol:</span>
                  <SignLink signName={otherSun.sign} showIcon={false} className="font-semibold" />
                </div>
              )}
              {otherMoon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">☽ Luna:</span>
                  <SignLink signName={otherMoon.sign} showIcon={false} className="font-semibold" />
                </div>
              )}
              {otherChart.ascendant && (
                <div className="flex justify-between">
                  <span className="text-gray-600">↑ Ascendente:</span>
                  <SignLink signName={otherChart.ascendant} showIcon={false} className="font-semibold" />
                </div>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Aspectos de Sinastría */}
      <CollapsibleSection
        title={
          <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-purple-600" />
            Aspectos de Sinastría ({synastryAspects.length})
          </span>
        }
        defaultExpanded={true}
      >
        <div className="flex items-center justify-end mb-4 -mt-4">
          <button
            onClick={() => setShowAspectsExplanation(!showAspectsExplanation)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="¿Qué son los aspectos de sinastría?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Explicación de aspectos */}
        <div className="mb-4">
          {showAspectsExplanation && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">📐 ¿Qué son los Aspectos de Sinastría?</h4>
              <button
                onClick={() => setShowAspectsExplanation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                Un <strong>aspecto de sinastría</strong> ocurre cuando un planeta de tu carta forma un ángulo específico 
                con un planeta de la carta de la otra persona.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="font-semibold text-green-900 mb-1">🟢 Aspectos Armónicos</p>
                  <p className="text-xs text-green-800">
                    <strong>Trígono (120°):</strong> Conexión fluida, comprensión mutua, facilita la relación.<br/>
                    <strong>Sextil (60°):</strong> Oportunidades de crecimiento juntos, apoyo mutuo.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <p className="font-semibold text-orange-900 mb-1">🟠 Aspectos Tensos</p>
                  <p className="text-xs text-orange-800">
                    <strong>Cuadratura (90°):</strong> Fricción, desafíos, pero también crecimiento si se trabajan.<br/>
                    <strong>Oposición (180°):</strong> Polaridades, atracción/repulsión, necesidad de equilibrio.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 md:col-span-2">
                  <p className="font-semibold text-yellow-900 mb-1">🟡 Conjunciones</p>
                  <p className="text-xs text-yellow-800">
                    <strong>Conjunción (0°):</strong> Fusión de energías, intensidad. Puede ser muy positivo o muy desafiante según los planetas involucrados.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                <p className="text-xs text-blue-800">
                  <strong>💡 Ejemplo:</strong> "Tu Venus (amor) en Trígono con su Luna (emociones)" significa que hay 
                  una conexión emocional natural y comprensión mutua en el amor.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
        {synastryAspects.length > 0 ? (
          <div className="space-y-3">
            {(showAllAspects ? synastryAspects : synastryAspects.slice(0, 20)).map((aspect, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${getAspectColor(aspect.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold mb-2 flex items-center gap-1 flex-wrap">
                      <span>{myName}:</span>
                      <PlanetLink planetName={aspect.planet1} showIcon={false} className="font-semibold" />
                      <span>{getAspectName(aspect.type)}</span>
                      <span>{otherName}:</span>
                      <PlanetLink planetName={aspect.planet2} showIcon={false} className="font-semibold" />
                    </p>
                    <p className="text-xs mb-2 opacity-80">{aspect.description}</p>
                    {/* Análisis personalizado */}
                    <div className="mt-3 p-3 bg-white/60 rounded border border-white/40">
                      <p className="text-xs font-semibold text-gray-800 mb-1">💡 Análisis:</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{aspect.interpretation}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">Orbe: {aspect.orb.toFixed(1)}°</p>
                    {aspect.orb < 1 && (
                      <p className="text-xs text-yellow-700 font-semibold mt-1">⚡ Exacto</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {synastryAspects.length > 20 && (
              <div className="text-center mt-4">
                {!showAllAspects ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Mostrando los 20 aspectos más exactos de {synastryAspects.length} totales
                    </p>
                    <button
                      onClick={() => setShowAllAspects(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                    >
                      Ver todos los {synastryAspects.length} aspectos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Mostrando todos los {synastryAspects.length} aspectos
                    </p>
                    <button
                      onClick={() => setShowAllAspects(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
                    >
                      Mostrar solo los 20 más exactos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No se encontraron aspectos mayores entre estas cartas.</p>
        )}
      </CollapsibleSection>

      {/* Comparación de Elementos */}
      <CollapsibleSection
        title="Comparación de Elementos"
        defaultExpanded={true}
      >
        <div className="flex items-center justify-end mb-4 -mt-4">
          <button
            onClick={() => setShowElementsExplanation(!showElementsExplanation)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="¿Qué significan los elementos?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Explicación de elementos */}
        <div className="mb-4">
          {showElementsExplanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🔥🌍💨💧 ¿Qué son los Elementos?</h4>
              <button
                onClick={() => setShowElementsExplanation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <p className="font-semibold text-red-900 mb-1">🔥 Fuego</p>
                  <p className="text-xs text-red-800">Pasión, acción, entusiasmo, iniciativa</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <p className="font-semibold text-green-900 mb-1">🌍 Tierra</p>
                  <p className="text-xs text-green-800">Practicidad, estabilidad, material, concreto</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <p className="font-semibold text-blue-900 mb-1">💨 Aire</p>
                  <p className="text-xs text-blue-800">Comunicación, ideas, mental, social</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                  <p className="font-semibold text-purple-900 mb-1">💧 Agua</p>
                  <p className="text-xs text-purple-800">Emociones, intuición, sensibilidad, profundidad</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <p className="text-xs text-gray-800">
                  <strong>💡 En la comparación:</strong> Si uno tiene mucho fuego y otro mucha tierra, pueden complementarse 
                  (uno aporta acción, otro estabilidad) o chocar (uno es impulsivo, otro cauteloso). 
                  Elementos similares pueden crear entendimiento o falta de balance.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">{myName}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🔥 Fuego:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${myElements.fire}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{myElements.fire}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🌍 Tierra:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${myElements.earth}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{myElements.earth}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">💨 Aire:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${myElements.air}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{myElements.air}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">💧 Agua:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${myElements.water}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{myElements.water}%</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">{otherName}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🔥 Fuego:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${otherElements.fire}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{otherElements.fire}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🌍 Tierra:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${otherElements.earth}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{otherElements.earth}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">💨 Aire:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${otherElements.air}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{otherElements.air}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">💧 Agua:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${otherElements.water}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{otherElements.water}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Comparación de Stats RPG */}
      <CollapsibleSection
        title="Comparación de Stats RPG"
        defaultExpanded={true}
      >
        <div className="flex items-center justify-end mb-4 -mt-4">
          <button
            onClick={() => setShowStatsExplanation(!showStatsExplanation)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="¿Qué significan los stats?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Explicación de stats */}
        <div className="mb-4">
          {showStatsExplanation && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">⚔️ ¿Qué son los Stats RPG?</h4>
              <button
                onClick={() => setShowStatsExplanation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                Los <strong>Stats RPG</strong> son capacidades naturales basadas en tu carta astral (0-10):
              </p>
              <ul className="space-y-1 ml-4 list-disc text-xs">
                <li><strong>INT (Intelecto):</strong> Comunicación y análisis mental</li>
                <li><strong>WIS (Intuición):</strong> Sabiduría filosófica y espiritual</li>
                <li><strong>CHA (Magnetismo):</strong> Encanto y presencia personal</li>
                <li><strong>STR (Fuerza):</strong> Acción y determinación</li>
                <li><strong>DEX (Agilidad):</strong> Adaptabilidad mental</li>
                <li><strong>CON (Constitución):</strong> Resistencia y disciplina</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                <p className="text-xs text-blue-800">
                  <strong>💡 En la comparación:</strong> Stats similares pueden crear entendimiento. Stats complementarios 
                  pueden crear equilibrio (ej: uno tiene alta comunicación, otro alta intuición). Stats muy diferentes 
                  pueden crear desafíos o complementariedad según cómo se manejen.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
        <div className="space-y-4">
          {(['INT', 'WIS', 'CHA', 'STR', 'DEX', 'CON'] as const).map((stat) => (
            <div key={stat} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{stat}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-blue-600">{myName}: {myStats[stat].toFixed(1)}</span>
                  <span className="text-pink-600">{otherName}: {otherStats[stat].toFixed(1)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(myStats[stat] / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500" 
                      style={{ width: `${(otherStats[stat] / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  )
}

