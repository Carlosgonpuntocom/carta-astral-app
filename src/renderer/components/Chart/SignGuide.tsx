import { X } from 'lucide-react'
import { getSignTextColor } from '../../lib/utils/planet-colors'

interface SignInfo {
  name: string
  element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua'
  modality: 'Cardinal' | 'Fijo' | 'Mutable'
  ruler: string
  description: string
  keywords: string[]
  traits: string[]
  challenges: string[]
}

const SIGNS: SignInfo[] = [
  {
    name: 'Aries',
    element: 'Fuego',
    modality: 'Cardinal',
    ruler: 'Marte',
    description: 'Aries es el primer signo del zodíaco, representando el inicio, la acción y la iniciativa. Es el guerrero del zodíaco, siempre listo para comenzar nuevos proyectos.',
    keywords: ['Iniciativa', 'Acción', 'Liderazgo', 'Impulsividad', 'Valentía', 'Independencia'],
    traits: ['Espontáneo', 'Enérgico', 'Competitivo', 'Directo', 'Pionero', 'Entusiasta'],
    challenges: ['Impaciente', 'Impulsivo', 'Agresivo', 'Egoísta', 'Inconsiderado']
  },
  {
    name: 'Tauro',
    element: 'Tierra',
    modality: 'Fijo',
    ruler: 'Venus',
    description: 'Tauro es el signo de la estabilidad, la sensualidad y la persistencia. Valora la seguridad, el placer y las posesiones materiales.',
    keywords: ['Estabilidad', 'Sensualidad', 'Persistencia', 'Posesiones', 'Paciencia', 'Terquedad'],
    traits: ['Práctico', 'Leal', 'Sensual', 'Paciente', 'Determinado', 'Estable'],
    challenges: ['Terco', 'Posesivo', 'Materialista', 'Resistente al cambio', 'Lento']
  },
  {
    name: 'Géminis',
    element: 'Aire',
    modality: 'Mutable',
    ruler: 'Mercurio',
    description: 'Géminis es el comunicador del zodíaco, curioso, versátil y siempre en movimiento. Representa la dualidad y el intercambio de ideas.',
    keywords: ['Comunicación', 'Curiosidad', 'Versatilidad', 'Dualidad', 'Adaptabilidad', 'Nerviosismo'],
    traits: ['Inteligente', 'Comunicativo', 'Adaptable', 'Curioso', 'Versátil', 'Sociable'],
    challenges: ['Inconsistente', 'Superficial', 'Nervioso', 'Indeciso', 'Chismoso']
  },
  {
    name: 'Cáncer',
    element: 'Agua',
    modality: 'Cardinal',
    ruler: 'Luna',
    description: 'Cáncer es el signo del hogar, la familia y las emociones profundas. Es protector, nutridor y muy sensible.',
    keywords: ['Hogar', 'Familia', 'Emociones', 'Protección', 'Nutrición', 'Sensibilidad'],
    traits: ['Cuidadoso', 'Protector', 'Intuitivo', 'Emocional', 'Leal', 'Nutridor'],
    challenges: ['Demasiado sensible', 'Apegado', 'Manipulador', 'Moody', 'Retraído']
  },
  {
    name: 'Leo',
    element: 'Fuego',
    modality: 'Fijo',
    ruler: 'Sol',
    description: 'Leo es el signo del corazón, la creatividad y la expresión. Es generoso, orgulloso y busca ser el centro de atención.',
    keywords: ['Creatividad', 'Expresión', 'Orgullo', 'Generosidad', 'Dramatismo', 'Liderazgo'],
    traits: ['Creativo', 'Generoso', 'Confiable', 'Caluroso', 'Leal', 'Dramático'],
    challenges: ['Egocéntrico', 'Dramático', 'Orgulloso', 'Necesita atención', 'Dominante']
  },
  {
    name: 'Virgo',
    element: 'Tierra',
    modality: 'Mutable',
    ruler: 'Mercurio',
    description: 'Virgo es el perfeccionista del zodíaco, analítico, práctico y orientado al servicio. Busca mejorar y perfeccionar todo.',
    keywords: ['Perfeccionismo', 'Análisis', 'Servicio', 'Práctica', 'Detalle', 'Crítica'],
    traits: ['Analítico', 'Práctico', 'Organizado', 'Servicial', 'Modesto', 'Detallista'],
    challenges: ['Crítico', 'Perfeccionista', 'Ansioso', 'Rígido', 'Exigente']
  },
  {
    name: 'Libra',
    element: 'Aire',
    modality: 'Cardinal',
    ruler: 'Venus',
    description: 'Libra busca el equilibrio, la armonía y la justicia. Es el signo de las relaciones y la belleza.',
    keywords: ['Equilibrio', 'Armonía', 'Relaciones', 'Belleza', 'Justicia', 'Indecisión'],
    traits: ['Diplomático', 'Equilibrado', 'Social', 'Artístico', 'Justo', 'Encantador'],
    challenges: ['Indeciso', 'Evasivo', 'Dependiente', 'Superficial', 'Evita conflictos']
  },
  {
    name: 'Escorpio',
    element: 'Agua',
    modality: 'Fijo',
    ruler: 'Plutón',
    description: 'Escorpio es el signo de la transformación, la intensidad y el poder. Profundo, misterioso y apasionado.',
    keywords: ['Transformación', 'Intensidad', 'Poder', 'Pasión', 'Secreto', 'Regeneración'],
    traits: ['Intenso', 'Pasional', 'Determinado', 'Leal', 'Perceptivo', 'Transformador'],
    challenges: ['Posesivo', 'Celoso', 'Vengativo', 'Secreto', 'Extremo']
  },
  {
    name: 'Sagitario',
    element: 'Fuego',
    modality: 'Mutable',
    ruler: 'Júpiter',
    description: 'Sagitario es el explorador del zodíaco, optimista, filosófico y siempre buscando nuevas aventuras.',
    keywords: ['Aventura', 'Filosofía', 'Optimismo', 'Expansión', 'Libertad', 'Honestidad'],
    traits: ['Optimista', 'Filosófico', 'Aventurero', 'Honesto', 'Entusiasta', 'Independiente'],
    challenges: ['Táctilmente incorrecto', 'Irresponsable', 'Impaciente', 'Exagerado', 'Evita compromisos']
  },
  {
    name: 'Capricornio',
    element: 'Tierra',
    modality: 'Cardinal',
    ruler: 'Saturno',
    description: 'Capricornio es el signo de la ambición, la disciplina y el logro. Trabajador, responsable y orientado a objetivos.',
    keywords: ['Ambición', 'Disciplina', 'Responsabilidad', 'Logro', 'Estructura', 'Seriedad'],
    traits: ['Ambicioso', 'Disciplinado', 'Responsable', 'Práctico', 'Organizado', 'Determinado'],
    challenges: ['Rígido', 'Frío', 'Pesimista', 'Trabajólico', 'Controlador']
  },
  {
    name: 'Acuario',
    element: 'Aire',
    modality: 'Fijo',
    ruler: 'Urano',
    description: 'Acuario es el innovador del zodíaco, original, independiente y orientado al futuro. Valora la libertad y la humanidad.',
    keywords: ['Innovación', 'Independencia', 'Humanidad', 'Originalidad', 'Libertad', 'Excentricidad'],
    traits: ['Original', 'Independiente', 'Humanitario', 'Intelectual', 'Progresista', 'Amigable'],
    challenges: ['Desapegado', 'Impredecible', 'Rebelde', 'Emocionalmente distante', 'Contrario']
  },
  {
    name: 'Piscis',
    element: 'Agua',
    modality: 'Mutable',
    ruler: 'Neptuno',
    description: 'Piscis es el signo de la compasión, la intuición y la espiritualidad. Sensible, soñador y empático.',
    keywords: ['Compasión', 'Intuición', 'Espiritualidad', 'Sueños', 'Empatía', 'Sacrificio'],
    traits: ['Compasivo', 'Intuitivo', 'Artístico', 'Espiritual', 'Empático', 'Soñador'],
    challenges: ['Evasivo', 'Víctima', 'Confuso', 'Indeciso', 'Escape de la realidad']
  }
]

interface SignGuideProps {
  selectedSign?: string
  onClose: () => void
}

export default function SignGuide({ selectedSign, onClose }: SignGuideProps) {
  const signsToShow = selectedSign
    ? SIGNS.filter(s => s.name.toLowerCase() === selectedSign.toLowerCase())
    : SIGNS

  return (
    <div className="space-y-6">
      {signsToShow.map((sign) => (
        <div key={sign.name} className="space-y-4">
          <div className={`border-2 rounded-lg p-6 ${getSignTextColor(sign.name).replace('text-', 'bg-').replace('-700', '-50')} border-${getSignTextColor(sign.name).replace('text-', '').replace('-700', '-300')}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-3xl font-bold ${getSignTextColor(sign.name)}`}>{sign.name}</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-semibold">
                  {sign.element}
                </span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-semibold">
                  {sign.modality}
                </span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-semibold">
                  Regido por {sign.ruler}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-4">{sign.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✨ Características Positivas</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {sign.traits.map((trait, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">⚠️ Desafíos</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {sign.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-orange-600">!</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-white/60 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🔑 Palabras Clave</h4>
              <div className="flex flex-wrap gap-2">
                {sign.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {!selectedSign && (
        <div className="text-center text-gray-500 text-sm">
          Selecciona un signo específico para ver información detallada
        </div>
      )}
    </div>
  )
}





