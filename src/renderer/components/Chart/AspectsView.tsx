import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import type { ChartData } from '../../types/astrology'
import PlanetLink from '../Transits/PlanetLink'
import { getPlanetTextColor } from '../../lib/utils/planet-colors'
import CollapsibleSection from '../CollapsibleSection'

interface AspectsViewProps {
  chartData: ChartData
}

// Traducción de tipos de aspectos
const ASPECT_NAMES: Record<string, string> = {
  'conjunction': 'Conjunción',
  'opposition': 'Oposición',
  'trine': 'Trígono',
  'square': 'Cuadratura',
  'sextile': 'Sextil'
}

// Información sobre qué representa cada planeta/punto
const PLANET_MEANINGS: Record<string, { force: string; areas: string[] }> = {
  'Sol': { force: 'tu identidad, esencia y vitalidad', areas: ['identidad personal', 'autoexpresión', 'confianza', 'liderazgo'] },
  'Luna': { force: 'tus emociones y necesidades', areas: ['mundo emocional', 'hogar', 'familia', 'necesidades básicas'] },
  'Mercurio': { force: 'tu comunicación y pensamiento', areas: ['comunicación', 'aprendizaje', 'expresión mental', 'diálogo'] },
  'Venus': { force: 'el amor y las relaciones', areas: ['amor', 'relaciones', 'valores', 'belleza', 'placer'] },
  'Marte': { force: 'tu pasión y acción', areas: ['energía física', 'impulso', 'determinación', 'confrontación'] },
  'Júpiter': { force: 'la expansión y filosofía', areas: ['crecimiento', 'oportunidades', 'sabiduría', 'optimismo'] },
  'Saturno': { force: 'la estructura y responsabilidad', areas: ['disciplina', 'límites', 'responsabilidades', 'madurez'] },
  'Urano': { force: 'la innovación y libertad', areas: ['cambios súbitos', 'independencia', 'originalidad', 'rebelión'] },
  'Neptuno': { force: 'la espiritualidad e idealismo', areas: ['intuición', 'creatividad', 'espiritualidad', 'sueños'] },
  'Plutón': { force: 'la transformación y poder', areas: ['transformación profunda', 'poder', 'regeneración', 'intensidad'] },
  'Ascendente': { force: 'tu personalidad externa', areas: ['primera impresión', 'cómo te presentas', 'máscara social'] },
  'Medio Cielo': { force: 'tu carrera y vocación', areas: ['carrera profesional', 'vocación', 'reputación pública', 'logros'] },
  'Nodo Norte': { force: 'tu destino y crecimiento', areas: ['crecimiento futuro', 'destino', 'lecciones a aprender', 'evolución'] },
  'Nodo Sur': { force: 'tu karma y lecciones', areas: ['talentos pasados', 'patrones familiares', 'lo que traes de vidas anteriores'] },
  'Quirón': { force: 'las heridas y la sanación', areas: ['heridas emocionales', 'sanación', 'vulnerabilidad', 'compasión'] },
  'Lilith': { force: 'la sombra y autenticidad', areas: ['parte reprimida', 'sexualidad', 'poder femenino', 'autenticidad'] },
  'Sirio': { force: 'la inspiración y guía', areas: ['inspiración', 'guía espiritual', 'maestría', 'elevación'] }
}

// Función para obtener explicación personalizada del aspecto con colores
function getPersonalizedAspectExplanation(
  planet1: string, 
  planet2: string, 
  aspectType: string, 
  showAllAreas: boolean = false
): { explanation: React.ReactNode; allAreas: Array<{ area: string; planet: string }>; hasMoreAreas: boolean } {
  const p1 = planet1.trim()
  const p2 = planet2.trim()
  
  const meaning1 = PLANET_MEANINGS[p1] || { force: `la energía de ${p1}`, areas: ['esta área'] }
  const meaning2 = PLANET_MEANINGS[p2] || { force: `la energía de ${p2}`, areas: ['esta área'] }
  
  const force1 = meaning1.force
  const force2 = meaning2.force
  
  // Obtener TODAS las áreas de ambos planetas
  const allAreas: Array<{ area: string; planet: string }> = []
  meaning1.areas.forEach(area => allAreas.push({ area, planet: p1 }))
  meaning2.areas.forEach(area => allAreas.push({ area, planet: p2 }))
  
  // Determinar cuántas áreas mostrar
  // Si no está expandido, mostrar 2 de cada planeta (máximo 4 total)
  let displayAreas: Array<{ area: string; planet: string }>
  if (showAllAreas) {
    displayAreas = allAreas
  } else {
    // Tomar 2 del primer planeta y 2 del segundo
    const areas1 = allAreas.filter(a => a.planet === p1).slice(0, 2)
    const areas2 = allAreas.filter(a => a.planet === p2).slice(0, 2)
    displayAreas = [...areas1, ...areas2]
  }
  const hasMoreAreas = allAreas.length > displayAreas.length
  
  // Colores para las fuerzas
  const color1 = getPlanetTextColor(p1)
  const color2 = getPlanetTextColor(p2)
  
  // Renderizar áreas con colores
  const renderAreas = () => {
    if (displayAreas.length === 0) return 'tu vida'
    
    return displayAreas.map((item, index) => {
      const color = getPlanetTextColor(item.planet)
      return (
        <span key={`${item.planet}-${item.area}-${index}`}>
          {index > 0 && ', '}
          <span className={`font-medium ${color}`}>{item.area}</span>
        </span>
      )
    })
  }
  
  let explanation: React.ReactNode
  
  switch (aspectType) {
    case 'conjunction':
      explanation = (
        <>
          Fusión intensa entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Estas dos energías se combinan poderosamente en tu personalidad. Afecta especialmente: {renderAreas()}. Puede ser muy intenso, ya sea creativo o desafiante, dependiendo de cómo integres estas fuerzas.
        </>
      )
      break
    
    case 'opposition':
      explanation = (
        <>
          Polaridad entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Estas dos fuerzas están en tensión, creando un equilibrio dinámico. Afecta especialmente: {renderAreas()}. Necesitas encontrar el equilibrio entre estos dos polos opuestos, integrando ambas energías en lugar de elegir una sobre la otra.
        </>
      )
      break
    
    case 'trine':
      explanation = (
        <>
          Armonía natural entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Estas energías fluyen juntas con facilidad. Afecta especialmente: {renderAreas()}. Es un talento natural que te permite expresar estas áreas de forma fluida y positiva.
        </>
      )
      break
    
    case 'square':
      explanation = (
        <>
          Tensión constructiva entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Estas energías chocan, creando desafíos que te impulsan a crecer. Afecta especialmente: {renderAreas()}. Requiere acción y trabajo consciente para integrar ambas fuerzas y transformar la tensión en crecimiento.
        </>
      )
      break
    
    case 'sextile':
      explanation = (
        <>
          Oportunidad armónica entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Estas energías se apoyan mutuamente. Afecta especialmente: {renderAreas()}. Facilita el desarrollo y la cooperación entre estas áreas, ofreciendo oportunidades de crecimiento si las aprovechas.
        </>
      )
      break
    
    default:
      explanation = (
        <>
          Interacción entre <span className={`font-semibold ${color1}`}>{force1}</span> y <span className={`font-semibold ${color2}`}>{force2}</span>. Afecta especialmente: {renderAreas()}.
        </>
      )
  }
  
  return { explanation, allAreas, hasMoreAreas }
}

// Explicaciones genéricas de cada aspecto (como fallback)
const ASPECT_EXPLANATIONS: Record<string, { description: string; nature: 'neutral' | 'harmonious' | 'tense'; color: string }> = {
  'conjunction': {
    description: 'Los planetas están muy cerca (0°). Fusionan sus energías. Puede ser intenso, dependiendo de los planetas involucrados.',
    nature: 'neutral',
    color: 'yellow'
  },
  'opposition': {
    description: 'Los planetas están opuestos (180°). Crea tensión y polaridad. Requiere equilibrio entre dos fuerzas opuestas.',
    nature: 'tense',
    color: 'red'
  },
  'trine': {
    description: 'Los planetas forman un ángulo de 120°. Flujo armónico y natural. Las cosas salen bien con facilidad.',
    nature: 'harmonious',
    color: 'green'
  },
  'square': {
    description: 'Los planetas forman un ángulo de 90°. Crea tensión y desafíos. Requiere acción y crecimiento.',
    nature: 'tense',
    color: 'orange'
  },
  'sextile': {
    description: 'Los planetas forman un ángulo de 60°. Oportunidad armónica. Facilita la cooperación y el desarrollo.',
    nature: 'harmonious',
    color: 'blue'
  }
}

// Función para obtener el color del aspecto
function getAspectColor(aspectType: string): string {
  const aspect = ASPECT_EXPLANATIONS[aspectType]
  if (!aspect) return 'gray'
  
  const colorMap: Record<string, string> = {
    'yellow': 'bg-yellow-100 border-yellow-400 text-yellow-800',
    'red': 'bg-red-100 border-red-400 text-red-800',
    'green': 'bg-green-100 border-green-400 text-green-800',
    'orange': 'bg-orange-100 border-orange-400 text-orange-800',
    'blue': 'bg-blue-100 border-blue-400 text-blue-800',
    'gray': 'bg-gray-100 border-gray-400 text-gray-800'
  }
  
  return colorMap[aspect.color] || colorMap.gray
}

// Función para obtener el emoji del aspecto
function getAspectEmoji(aspectType: string): string {
  const aspect = ASPECT_EXPLANATIONS[aspectType]
  if (!aspect) return '⚪'
  
  if (aspect.nature === 'harmonious') return '🟢'
  if (aspect.nature === 'tense') return '🔴'
  return '🟡'
}

export default function AspectsView({ chartData }: AspectsViewProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [expandedAspect, setExpandedAspect] = useState<number | null>(null)
  const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set())

  if (!chartData.aspects || chartData.aspects.length === 0) {
    return (
      <CollapsibleSection
        title="Aspectos Planetarios"
        defaultExpanded={true}
      >
        <p className="text-gray-600 text-center py-8">No hay aspectos registrados en esta carta.</p>
      </CollapsibleSection>
    )
  }

  // Normalizar tipos de aspectos (por si vienen en diferentes formatos)
  const normalizeAspectType = (type: string): string => {
    const normalized = type.toLowerCase().trim()
    const typeMap: Record<string, string> = {
      'conjunction': 'conjunction',
      'opposition': 'opposition',
      'trine': 'trine',
      'square': 'square',
      'sextile': 'sextile',
      'conjunción': 'conjunction',
      'oposición': 'opposition',
      'trígono': 'trine',
      'cuadratura': 'square',
      'sextil': 'sextile'
    }
    return typeMap[normalized] || normalized
  }

  // Separar aspectos por tipo (normalizando primero)
  const harmoniousAspects = chartData.aspects.filter(a => {
    const normalized = normalizeAspectType(a.type)
    return ['trine', 'sextile'].includes(normalized)
  })
  const tenseAspects = chartData.aspects.filter(a => {
    const normalized = normalizeAspectType(a.type)
    return ['square', 'opposition'].includes(normalized)
  })
  const neutralAspects = chartData.aspects.filter(a => {
    const normalized = normalizeAspectType(a.type)
    return normalized === 'conjunction'
  })

  // Debug: mostrar tipos de aspectos encontrados (solo en desarrollo)
  if (process.env.NODE_ENV === 'development' && chartData.aspects.length > 0) {
    const uniqueTypes = [...new Set(chartData.aspects.map(a => a.type))]
    console.log('🔍 Tipos de aspectos encontrados:', uniqueTypes)
    console.log('📊 Total aspectos:', chartData.aspects.length)
    console.log('🟢 Armónicos:', harmoniousAspects.length)
    console.log('🔴 Tensos:', tenseAspects.length)
    console.log('🟡 Conjunciones:', neutralAspects.length)
  }

  return (
    <CollapsibleSection
      title={
        <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Aspectos Planetarios
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowExplanation(!showExplanation)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="¿Qué son los aspectos?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </span>
      }
      defaultExpanded={true}
    >
      {/* Explicación general */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900">📚 ¿Qué son los Aspectos Planetarios?</h4>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Los <strong>aspectos</strong> son ángulos que forman los planetas entre sí en tu carta natal. 
              Indican cómo las energías de diferentes planetas interactúan en tu personalidad.
            </p>
            <div className="bg-white rounded p-3 space-y-2">
              <p className="font-semibold text-green-900 mb-2">🟢 Aspectos Armónicos (Trígono, Sextil):</p>
              <p className="text-gray-700">
                Facilitan el flujo de energía. Las cosas salen bien con menos esfuerzo. 
                Son talentos naturales o áreas donde experimentas facilidad.
              </p>
            </div>
            <div className="bg-white rounded p-3 space-y-2">
              <p className="font-semibold text-orange-900 mb-2">🔴 Aspectos Tensos (Cuadratura, Oposición):</p>
              <p className="text-gray-700">
                Crean tensión y desafíos. No son "malos", sino áreas que requieren acción y crecimiento. 
                Te impulsan a desarrollar habilidades y superar obstáculos.
              </p>
            </div>
            <div className="bg-white rounded p-3 space-y-2">
              <p className="font-semibold text-yellow-900 mb-2">🟡 Aspectos Neutros (Conjunción):</p>
              <p className="text-gray-700">
                Fusionan las energías de dos planetas. Puede ser intenso, dependiendo de qué planetas estén involucrados.
              </p>
            </div>
            <div className="bg-blue-100 rounded p-3 border border-blue-300">
              <p className="text-xs text-blue-800">
                <strong>💡 Tip:</strong> El <strong>orbe</strong> indica qué tan exacto es el aspecto. 
                Un orbe menor (ej: 0.5°) significa que el aspecto es más fuerte y preciso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{harmoniousAspects.length}</p>
          <p className="text-sm text-green-600">Armónicos</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">{tenseAspects.length}</p>
          <p className="text-sm text-orange-600">Tensos</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{neutralAspects.length}</p>
          <p className="text-sm text-yellow-600">Conjunciones</p>
        </div>
      </div>

      {/* Lista de aspectos */}
      <div className="space-y-3">
        {chartData.aspects.map((aspect, index) => {
          // Normalizar tipo de aspecto para búsqueda
          const normalizedType = aspect.type.toLowerCase().trim()
          const typeMap: Record<string, string> = {
            'conjunction': 'conjunction',
            'opposition': 'opposition',
            'trine': 'trine',
            'square': 'square',
            'sextile': 'sextile',
            'conjunción': 'conjunction',
            'oposición': 'opposition',
            'trígono': 'trine',
            'cuadratura': 'square',
            'sextil': 'sextile'
          }
          const mappedType = typeMap[normalizedType] || normalizedType
          
          const aspectName = ASPECT_NAMES[mappedType] || aspect.type
          const aspectInfo = ASPECT_EXPLANATIONS[mappedType]
          const isExpanded = expandedAspect === index
          
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 transition-all ${getAspectColor(mappedType)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getAspectEmoji(mappedType)}</span>
                    <span className="font-bold text-lg">
                      <PlanetLink planetName={aspect.planet1} /> {aspectName} <PlanetLink planetName={aspect.planet2} />
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">Orbe: {aspect.orb.toFixed(1)}°</span>
                    {aspect.orb < 1 && (
                      <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        ⚡ Exacto
                      </span>
                    )}
                  </div>
                  
                  {/* Explicación expandible */}
                  {isExpanded && (() => {
                    const showAllAreas = expandedAreas.has(index)
                    const result = getPersonalizedAspectExplanation(aspect.planet1, aspect.planet2, mappedType, showAllAreas)
                    
                    return (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <div className="text-sm leading-relaxed opacity-90 font-medium mb-2">
                          {result.explanation}
                        </div>
                        {result.hasMoreAreas && (
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedAreas)
                              if (showAllAreas) {
                                newExpanded.delete(index)
                              } else {
                                newExpanded.add(index)
                              }
                              setExpandedAreas(newExpanded)
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                          >
                            {showAllAreas ? 'Ver menos áreas' : `Ver todas las áreas (${result.allAreas.length} total)`}
                          </button>
                        )}
                        {aspectInfo && (
                          <p className="text-xs leading-relaxed opacity-75 mt-2 italic">
                            {aspectInfo.description}
                          </p>
                        )}
                      </div>
                    )
                  })()}
                </div>
                
                <button
                  onClick={() => setExpandedAspect(isExpanded ? null : index)}
                  className="ml-4 text-gray-600 hover:text-gray-900 transition-colors"
                  title={isExpanded ? 'Ocultar explicación' : 'Ver explicación'}
                >
                  {isExpanded ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <HelpCircle className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}

