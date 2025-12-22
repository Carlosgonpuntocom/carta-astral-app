import { ClipboardList, CheckCircle, AlertTriangle, Lightbulb, HelpCircle, X } from 'lucide-react'
import { useState } from 'react'
import type { Transit } from '../../types/astrology'
import type { DayEnergy } from '../../lib/astrology/energy-calculator'

interface DayGuidanceProps {
  energies: DayEnergy
  intensity: number
  transits: Transit[]
  balance: {
    challenges: number
    opportunities: number
  }
}

// Función para generar resumen del día
function generateDaySummary(
  energies: DayEnergy,
  intensity: number,
  balance: { challenges: number; opportunities: number }
): string {
  // Nivel de intensidad
  const intensityLevel =
    intensity < 30 ? 'tranquilo' :
    intensity < 50 ? 'moderado' :
    intensity < 70 ? 'intenso' :
    'muy intenso'

  // Balance
  const balanceDesc =
    balance.opportunities > balance.challenges * 2 ? 'muy positivo' :
    balance.opportunities > balance.challenges ? 'positivo' :
    balance.opportunities === balance.challenges ? 'equilibrado' :
    'desafiante'

  // Energía dominante
  const energyEntries = Object.entries(energies) as [keyof DayEnergy, number][]
  const maxEnergy = energyEntries.sort((a, b) => b[1] - a[1])[0]

  const energyNames: Record<keyof DayEnergy, string> = {
    action: 'acción y determinación',
    mental: 'claridad mental',
    emotional: 'conexión emocional',
    manifestation: 'concretar proyectos',
    creativity: 'creatividad',
    resistance: 'resistencia'
  }

  const focus = energyNames[maxEnergy[0]]

  return `Día ${intensityLevel} (${intensity}%) con balance ${balanceDesc}. Enfoque principal en ${focus} (${maxEnergy[1].toFixed(1)}/10).`
}

// Función para obtener planetas activos
function getActivePlanets(transits: Transit[]): string[] {
  const planets = new Set<string>()
  transits.forEach(t => {
    planets.add(t.transitingPlanet)
    planets.add(t.natalPoint)
  })
  return Array.from(planets)
}

// Función para obtener planetas en aspectos tensos
function getTensePlanets(tenseTransits: Transit[]): string[] {
  const planets = new Set<string>()
  tenseTransits.forEach(t => {
    planets.add(t.transitingPlanet)
    planets.add(t.natalPoint)
  })
  return Array.from(planets)
}

// Función para generar lista de "Aprovecha Hoy"
function generateDoList(energies: DayEnergy, transits: Transit[]): string[] {
  const list: string[] = []
  const activePlanets = getActivePlanets(transits)

  // Según energías altas
  if (energies.manifestation >= 7) {
    list.push('Organizar y estructurar proyectos')
    list.push('Avanzar en tareas concretas y prácticas')
  }

  if (energies.creativity >= 7) {
    list.push('Trabajar en proyectos creativos o artísticos')
    list.push('Expresar ideas de forma innovadora')
  }

  if (energies.mental >= 7) {
    list.push('Planificar y analizar situaciones')
    list.push('Tomar decisiones importantes con claridad')
  }

  if (energies.emotional >= 7) {
    list.push('Conectar emocionalmente con otros')
    list.push('Atender necesidades afectivas propias y ajenas')
  }

  if (energies.action >= 7) {
    list.push('Iniciar nuevos proyectos o iniciativas')
    list.push('Tomar acción decidida en asuntos pendientes')
  }

  if (energies.resistance >= 9) {
    list.push('Enfrentar desafíos difíciles con determinación')
    list.push('Resistir presiones externas manteniendo tu centro')
  }

  // Según planetas activos
  if (activePlanets.some(p => p === 'Venus' || p === 'Venus')) {
    list.push('Reevaluar valores y prioridades personales')
    list.push('Cuidar y nutrir relaciones importantes')
  }

  if (activePlanets.some(p => p === 'Mercurio' || p === 'Mercury')) {
    list.push('Comunicarte claramente y expresar ideas')
    list.push('Negociar, dialogar y resolver conflictos')
  }

  if (activePlanets.some(p => p === 'Marte' || p === 'Mars')) {
    list.push('Actuar con determinación y coraje')
    list.push('Defender tus intereses y límites')
  }

  if (activePlanets.some(p => p === 'Júpiter' || p === 'Jupiter')) {
    list.push('Aprovechar oportunidades de crecimiento')
    list.push('Expandir horizontes y explorar nuevas posibilidades')
  }

  if (activePlanets.some(p => p === 'Saturno' || p === 'Saturn')) {
    list.push('Establecer estructuras y compromisos')
    list.push('Trabajar con disciplina y responsabilidad')
  }

  // Eliminar duplicados y limitar
  const uniqueList = Array.from(new Set(list))
  return uniqueList.slice(0, 6)
}

// Función para generar lista de "Evita Hoy"
function generateAvoidList(energies: DayEnergy, transits: Transit[]): string[] {
  const list: string[] = []

  // Según energías bajas
  if (energies.action < 5) {
    list.push('Iniciar proyectos grandes o arriesgados')
    list.push('Tomar decisiones impulsivas sin reflexionar')
  }

  if (energies.mental < 5) {
    list.push('Decisiones complejas que requieran máxima claridad')
    list.push('Análisis profundos o estudios intensivos')
  }

  if (energies.emotional < 5) {
    list.push('Conversaciones emocionales muy profundas')
    list.push('Tomar decisiones basadas solo en sentimientos')
  }

  if (energies.manifestation < 5) {
    list.push('Esperar resultados inmediatos de proyectos')
    list.push('Forzar el cierre de asuntos pendientes')
  }

  // Según aspectos tensos dominantes
  const tenseTransits = transits.filter(t => t.isTense)
  const harmoniousTransits = transits.filter(t => t.isHarmonious)

  if (tenseTransits.length > harmoniousTransits.length * 1.5) {
    list.push('Forzar situaciones o relaciones')
    list.push('Ser demasiado rígido con planes establecidos')
  }

  // Según planetas específicos tensos
  const tensePlanets = getTensePlanets(tenseTransits)

  if (tensePlanets.some(p => p === 'Júpiter' || p === 'Jupiter')) {
    list.push('Gastos impulsivos o compromisos excesivos')
    list.push('Sobreestimar capacidades o recursos')
  }

  if (tensePlanets.some(p => p === 'Saturno' || p === 'Saturn')) {
    list.push('Ser demasiado autocrítico o perfeccionista')
    list.push('Ignorar limitaciones reales o sobrecargarte')
  }

  if (tensePlanets.some(p => p === 'Marte' || p === 'Mars')) {
    list.push('Confrontaciones innecesarias o agresividad')
    list.push('Actuar impulsivamente sin considerar consecuencias')
  }

  if (tensePlanets.some(p => p === 'Urano' || p === 'Uranus')) {
    list.push('Cambios radicales sin planificación')
    list.push('Rebelarte sin causa justificada')
  }

  // Eliminar duplicados y limitar
  const uniqueList = Array.from(new Set(list))
  return uniqueList.slice(0, 5)
}

// Función para generar consejo principal
function generateMainAdvice(transits: Transit[]): string {
  if (transits.length === 0) {
    return 'Día tranquilo sin tránsitos activos. Es un buen momento para descansar, reflexionar y recargar energías. Fluye naturalmente con el día.'
  }

  // Obtener tránsito más fuerte
  const sortedTransits = [...transits].sort((a, b) => b.strength - a.strength)
  const strongest = sortedTransits[0]

  if (!strongest) {
    return 'Día con tránsitos suaves. Aprovecha para avanzar en proyectos y mantener el equilibrio.'
  }

  const planet1 = strongest.transitingPlanet
  const planet2 = strongest.natalPoint
  const aspect = strongest.aspect

  // Normalizar nombres
  const normalize = (name: string) => {
    const map: Record<string, string> = {
      'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Mars': 'Marte',
      'Jupiter': 'Júpiter', 'Saturn': 'Saturno', 'Uranus': 'Urano',
      'Neptune': 'Neptuno', 'Pluto': 'Plutón'
    }
    return map[name] || name
  }

  const p1 = normalize(planet1)
  const p2 = normalize(planet2)

  // Banco de consejos por combinación
  const advice: Record<string, string> = {
    'Saturno-Venus-sextile':
      'Saturno armoniza tu Venus: organiza con método pero no olvides disfrutar. Tu alta resistencia te ayudará a mantener el equilibrio entre responsabilidad y placer.',
    
    'Saturno-Venus-trine':
      'Saturno en trígono con tu Venus: momento ideal para compromisos serios en relaciones. Estructura y estabilidad se combinan con afecto.',
    
    'Júpiter-Venus-opposition':
      'Júpiter desafía tu Venus: modera excesos sin perder optimismo. Balance entre disfrutar y ser sensato. No te comprometas de más.',
    
    'Júpiter-Venus-trine':
      'Júpiter armoniza tu Venus: expansión positiva en amor y valores. Aprovecha oportunidades de crecimiento en relaciones y proyectos que te apasionan.',
    
    'Marte-Sol-square':
      'Marte tensa tu Sol: canaliza la energía en acción productiva, evita confrontaciones innecesarias. Usa tu impulso para avanzar, no para pelear.',
    
    'Marte-Sol-trine':
      'Marte armoniza tu Sol: energía y determinación fluyen bien. Momento ideal para iniciar proyectos y tomar decisiones importantes con confianza.',
    
    'Venus-Luna-trine':
      'Venus armoniza tu Luna: conexión emocional y afectiva profunda. Aprovecha para nutrir relaciones y atender tus necesidades emocionales.',
    
    'Venus-Luna-square':
      'Venus tensa tu Luna: puede haber conflicto entre lo que quieres y lo que necesitas emocionalmente. Tómate tiempo para reflexionar antes de decidir.',
    
    'Mercurio-Mercurio-square':
      'Mercurio tensa tu Mercurio: dificultades de comunicación. Piensa antes de hablar, verifica que te entiendan. Evita malentendidos.',
    
    'Mercurio-Mercurio-trine':
      'Mercurio armoniza tu Mercurio: claridad mental y comunicación fluida. Aprovecha para negociar, aprender y expresar ideas complejas.',
    
    'Saturno-Sol-square':
      'Saturno desafía tu Sol: responsabilidades y límites pueden sentirse restrictivos. Acepta las limitaciones y trabaja con disciplina, no contra ellas.',
    
    'Saturno-Sol-trine':
      'Saturno armoniza tu Sol: estructura y disciplina se alinean con tu identidad. Momento ideal para establecer compromisos a largo plazo.',
    
    'Neptuno-Venus-conjunction':
      'Neptuno fusiona con tu Venus: idealización en el amor. Mantén los pies en la tierra pero no pierdas la magia. Puede haber confusión, sé claro.',
    
    'Plutón-Venus-square':
      'Plutón transforma tu Venus: cambios profundos en valores y relaciones. No fuerces, permite que la transformación ocurra. Puede ser intenso pero necesario.',
    
    'Urano-Sol-square':
      'Urano desafía tu Sol: cambios súbitos en identidad. Sé flexible, acepta lo inesperado. No te aferres a planes rígidos.',
    
    'Urano-Sol-trine':
      'Urano armoniza tu Sol: innovación y libertad se alinean. Aprovecha para romper con lo tradicional y explorar nuevas formas de ser tú mismo.'
  }

  const key1 = `${p1}-${p2}-${aspect}`
  const key2 = `${p2}-${p1}-${aspect}`

  if (advice[key1]) {
    return advice[key1]
  }
  if (advice[key2]) {
    return advice[key2]
  }

  // Consejo genérico basado en tipo de aspecto
  const aspectNames: Record<string, string> = {
    'conjunction': 'Conjunción',
    'trine': 'Trígono',
    'sextile': 'Sextil',
    'square': 'Cuadratura',
    'opposition': 'Oposición'
  }

  const aspectName = aspectNames[aspect] || aspect

  if (strongest.isHarmonious) {
    return `${p1} en ${aspectName} con tu ${p2}: momento armónico. Aprovecha esta energía positiva para avanzar en áreas relacionadas con estos planetas. Las cosas fluyen bien.`
  } else if (strongest.isTense) {
    return `${p1} en ${aspectName} con tu ${p2}: momento desafiante pero de crecimiento. Observa cómo estas energías interactúan. No fuerces, trabaja con las tensiones de forma constructiva.`
  } else {
    return `${p1} en ${aspectName} con tu ${p2}: fusión de energías. Puede ser intenso. Observa cómo se manifiesta y úsalo de forma consciente.`
  }
}

export default function DayGuidance({ energies, intensity, transits, balance }: DayGuidanceProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  const summary = generateDaySummary(energies, intensity, balance)
  const doList = generateDoList(energies, transits)
  const avoidList = generateAvoidList(energies, transits)
  const mainAdvice = generateMainAdvice(transits)

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-purple-600" />
          Guía Práctica del Día
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="¿Qué es la Guía Práctica?"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Explicación */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-white/80 rounded-lg border border-purple-200">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900">📚 ¿Qué es la Guía Práctica del Día?</h4>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              Esta guía traduce los datos astrológicos en <strong>recomendaciones accionables</strong> para tu día.
            </p>
            <p>
              <strong>📋 Resumen:</strong> Una frase que describe cómo será tu día en general.
            </p>
            <p>
              <strong>✅ Aprovecha Hoy:</strong> Acciones recomendadas basadas en tus energías altas y tránsitos favorables.
            </p>
            <p>
              <strong>⚠️ Evita Hoy:</strong> Cosas que es mejor no hacer según tus energías bajas o tránsitos desafiantes.
            </p>
            <p>
              <strong>💡 Consejo del Día:</strong> Recomendación principal basada en el tránsito más importante.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-2">
              <p className="text-xs text-purple-800">
                <strong>💡 Tip:</strong> Estas son sugerencias basadas en astrología. Úsalas como guía, pero siempre confía en tu intuición y sabiduría personal.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Resumen del día */}
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Tu Día en Resumen
          </h4>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        {/* Aprovecha Hoy */}
        <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Aprovecha Hoy
          </h4>
          {doList.length > 0 ? (
            <ul className="space-y-2">
              {doList.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Día tranquilo, fluye naturalmente.</p>
          )}
        </div>

        {/* Evita Hoy */}
        <div className="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Evita Hoy
          </h4>
          {avoidList.length > 0 ? (
            <ul className="space-y-2">
              {avoidList.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No hay restricciones especiales para hoy.</p>
          )}
        </div>

        {/* Consejo del Día */}
        <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Consejo del Día
          </h4>
          <p className="text-gray-700 leading-relaxed">{mainAdvice}</p>
        </div>
      </div>
    </div>
  )
}

