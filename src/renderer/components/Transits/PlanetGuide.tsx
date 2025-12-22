import { useState } from 'react'
import { X, BookOpen, Sparkles } from 'lucide-react'

interface PlanetInfo {
  name: string
  icon: string
  symbol: string
  category: 'personal' | 'social' | 'transpersonal'
  description: string
  natalMeaning: string
  transitMeaning: string
  keywords: string[]
  color: string
  bgColor: string
}

const PLANETS: PlanetInfo[] = [
  {
    name: 'Sol',
    icon: '☉',
    symbol: '☉',
    category: 'personal',
    description: 'El Sol representa tu esencia, tu identidad central y tu voluntad. Es quién eres en tu núcleo más profundo.',
    natalMeaning: 'Tu Sol natal muestra tu signo solar (lo que la mayoría conoce como "tu signo"). Indica tu personalidad básica, cómo te expresas naturalmente, y qué te hace único. Es tu "yo" esencial.',
    transitMeaning: 'Cuando un planeta transita tu Sol natal, activa tu identidad y tu expresión personal. Puede ser un momento de mayor visibilidad, confianza o necesidad de autoafirmación.',
    keywords: ['Identidad', 'Esencia', 'Voluntad', 'Ego', 'Vitalidad', 'Liderazgo'],
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  {
    name: 'Luna',
    icon: '🌙',
    symbol: '☽',
    category: 'personal',
    description: 'La Luna representa tus emociones, necesidades inconscientes, instintos y cómo te nutres emocionalmente.',
    natalMeaning: 'Tu Luna natal muestra tu signo lunar. Indica cómo procesas emociones, qué necesitas para sentirte seguro, y tu mundo interior. Es tu lado más sensible e instintivo.',
    transitMeaning: 'Los tránsitos a tu Luna natal afectan tu mundo emocional, tu hogar, y tus necesidades básicas. Pueden traer cambios de humor, necesidades emocionales, o eventos relacionados con familia y hogar.',
    keywords: ['Emociones', 'Instintos', 'Hogar', 'Maternidad', 'Nutrición', 'Inconsciente'],
    color: 'text-silver-700',
    bgColor: 'bg-gray-50 border-gray-200'
  },
  {
    name: 'Mercurio',
    icon: '☿',
    symbol: '☿',
    category: 'personal',
    description: 'Mercurio rige la comunicación, el pensamiento, el aprendizaje y cómo procesas y compartes información.',
    natalMeaning: 'Tu Mercurio natal muestra cómo piensas, comunicas y aprendes. Indica tu estilo mental, tu curiosidad, y cómo te expresas verbalmente. Está relacionado con la lógica y el razonamiento.',
    transitMeaning: 'Los tránsitos a Mercurio activan tu mente y comunicación. Pueden traer nuevas ideas, conversaciones importantes, o necesidad de aprender algo nuevo. También afecta viajes cortos y tecnología.',
    keywords: ['Comunicación', 'Pensamiento', 'Aprendizaje', 'Curiosidad', 'Lógica', 'Expresión'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    name: 'Venus',
    icon: '♀',
    symbol: '♀',
    category: 'personal',
    description: 'Venus rige el amor, las relaciones, la belleza, los valores, el arte y lo que te da placer.',
    natalMeaning: 'Tu Venus natal muestra cómo amas, qué te atrae, tus valores estéticos y qué te da placer. Indica tu estilo en relaciones, tu relación con el dinero, y tu apreciación por la belleza y el arte.',
    transitMeaning: 'Los tránsitos a Venus activan temas de amor, relaciones, valores y creatividad. Pueden traer nuevas relaciones, cambios en valores, o momentos de mayor apreciación por la belleza y el arte.',
    keywords: ['Amor', 'Relaciones', 'Belleza', 'Valores', 'Arte', 'Placer', 'Dinero'],
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 border-pink-200'
  },
  {
    name: 'Marte',
    icon: '♂',
    symbol: '♂',
    category: 'personal',
    description: 'Marte rige la acción, la agresividad, la pasión, la energía física y cómo te enfrentas a los desafíos.',
    natalMeaning: 'Tu Marte natal muestra cómo actúas, cómo expresas tu ira, y tu energía física. Indica tu impulso, tu coraje, y cómo persigues lo que quieres. Es tu "motor" de acción.',
    transitMeaning: 'Los tránsitos a Marte aumentan tu energía, impulso y necesidad de acción. Pueden traer confrontaciones, proyectos nuevos, o momentos de mayor determinación y coraje.',
    keywords: ['Acción', 'Energía', 'Pasión', 'Ira', 'Coraje', 'Impulso', 'Competitividad'],
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  {
    name: 'Júpiter',
    icon: '♃',
    symbol: '♃',
    category: 'social',
    description: 'Júpiter rige la expansión, la sabiduría, la filosofía, la suerte, el crecimiento y las oportunidades.',
    natalMeaning: 'Tu Júpiter natal muestra dónde encuentras oportunidades, crecimiento y suerte. Indica tus creencias filosóficas, tu optimismo, y áreas donde puedes expandirte y prosperar.',
    transitMeaning: 'Los tránsitos de Júpiter traen oportunidades, crecimiento y expansión. Son generalmente favorables, trayendo suerte, nuevas posibilidades, o momentos de mayor optimismo y fe.',
    keywords: ['Expansión', 'Suerte', 'Sabiduría', 'Filosofía', 'Optimismo', 'Crecimiento', 'Oportunidades'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200'
  },
  {
    name: 'Saturno',
    icon: '♄',
    symbol: '♄',
    category: 'social',
    description: 'Saturno rige la estructura, la disciplina, las responsabilidades, los límites y las lecciones de vida.',
    natalMeaning: 'Tu Saturno natal muestra dónde enfrentas desafíos, responsabilidades y necesidad de estructura. Indica tus miedos, tus límites, y áreas donde necesitas trabajar duro para crecer. Es tu "maestro" que te enseña lecciones importantes.',
    transitMeaning: 'Los tránsitos de Saturno traen responsabilidades, límites y necesidad de disciplina. Pueden ser desafiantes pero también constructivos, enseñándote lecciones importantes y ayudándote a construir estructuras sólidas.',
    keywords: ['Estructura', 'Disciplina', 'Responsabilidad', 'Límites', 'Miedo', 'Lecciones', 'Tiempo'],
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-300'
  },
  {
    name: 'Urano',
    icon: '♅',
    symbol: '♅',
    category: 'transpersonal',
    description: 'Urano rige la innovación, la libertad, la rebelión, lo inesperado y los cambios súbitos.',
    natalMeaning: 'Tu Urano natal muestra dónde necesitas libertad, innovación y romper con lo tradicional. Indica tu individualidad única, tu necesidad de independencia, y áreas donde puedes ser revolucionario.',
    transitMeaning: 'Los tránsitos de Urano traen cambios súbitos, innovación y necesidad de libertad. Pueden ser disruptivos pero también liberadores, trayendo nuevas ideas o rompiendo estructuras obsoletas.',
    keywords: ['Innovación', 'Libertad', 'Rebelión', 'Cambios', 'Individualidad', 'Tecnología', 'Sorpresas'],
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200'
  },
  {
    name: 'Neptuno',
    icon: '♆',
    symbol: '♆',
    category: 'transpersonal',
    description: 'Neptuno rige la espiritualidad, la intuición, los sueños, la ilusión, la compasión y lo trascendente.',
    natalMeaning: 'Tu Neptuno natal muestra dónde eres más intuitivo, espiritual o idealista. Indica tu conexión con lo trascendente, tu capacidad de soñar, y áreas donde puedes ser más compasivo o confundido.',
    transitMeaning: 'Los tránsitos de Neptuno activan la espiritualidad, intuición y sueños. Pueden traer inspiración, confusión, o momentos de mayor conexión con lo trascendente. También pueden traer ilusiones o despertar espiritual.',
    keywords: ['Espiritualidad', 'Intuición', 'Sueños', 'Ilusión', 'Compasión', 'Trascendencia', 'Arte'],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200'
  },
  {
    name: 'Plutón',
    icon: '♇',
    symbol: '♇',
    category: 'transpersonal',
    description: 'Plutón rige la transformación profunda, el poder, la regeneración, lo oculto y los cambios radicales.',
    natalMeaning: 'Tu Plutón natal muestra dónde experimentas transformaciones profundas y poder. Indica áreas donde puedes tener control obsesivo o ser transformado completamente. Es tu capacidad de renacer.',
    transitMeaning: 'Los tránsitos de Plutón traen transformaciones profundas, poder y regeneración. Pueden ser intensos y transformadores, destruyendo lo viejo para dar paso a lo nuevo. Son cambios radicales pero necesarios.',
    keywords: ['Transformación', 'Poder', 'Regeneración', 'Oculto', 'Intensidad', 'Renacimiento', 'Psicología'],
    color: 'text-black',
    bgColor: 'bg-gray-800 border-gray-700'
  },
  {
    name: 'Ascendente',
    icon: '↑',
    symbol: 'ASC',
    category: 'personal',
    description: 'El Ascendente es el punto donde el horizonte este se encuentra con la eclíptica al momento de tu nacimiento.',
    natalMeaning: 'Tu Ascendente (o signo ascendente) muestra cómo te presentas al mundo, tu "máscara social" y la primera impresión que das. Es diferente de tu signo solar y muestra cómo otros te perciben inicialmente.',
    transitMeaning: 'Los tránsitos al Ascendente afectan cómo te presentas al mundo y cómo otros te perciben. Pueden traer cambios en tu apariencia, personalidad externa, o en cómo te relacionas con el mundo.',
    keywords: ['Personalidad externa', 'Primera impresión', 'Apariencia', 'Máscara social', 'Identidad pública'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200'
  },
  {
    name: 'Medio Cielo',
    icon: 'MC',
    symbol: 'MC',
    category: 'personal',
    description: 'El Medio Cielo (MC) es el punto más alto del cielo al momento de tu nacimiento, relacionado con la cúspide de la Casa 10.',
    natalMeaning: 'Tu Medio Cielo muestra tu vocación, carrera, reputación pública y aspiraciones más altas. Indica qué quieres lograr en la vida, tu legado, y cómo te proyectas profesionalmente.',
    transitMeaning: 'Los tránsitos al Medio Cielo afectan tu carrera, reputación y aspiraciones. Pueden traer cambios profesionales, mayor visibilidad pública, o momentos de mayor reconocimiento o ambición.',
    keywords: ['Carrera', 'Vocación', 'Reputación', 'Aspiraciones', 'Legado', 'Público'],
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200'
  }
]

interface PlanetGuideProps {
  selectedPlanet?: string
  onClose?: () => void
}

export default function PlanetGuide({ selectedPlanet, onClose }: PlanetGuideProps) {
  const [activePlanet, setActivePlanet] = useState<string | null>(selectedPlanet || null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlanets = PLANETS.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const displayPlanet = activePlanet
    ? PLANETS.find(p => p.name === activePlanet)
    : null

  const categoryLabels = {
    personal: 'Planetas Personales',
    social: 'Planetas Sociales',
    transpersonal: 'Planetas Transpersonales'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Guía de Planetas</h2>
            <p className="text-sm text-gray-600">Aprende qué significa cada planeta en astrología</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar planeta o palabra clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de planetas */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Planetas</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {Object.entries(
              filteredPlanets.reduce((acc, planet) => {
                if (!acc[planet.category]) acc[planet.category] = []
                acc[planet.category].push(planet)
                return acc
              }, {} as Record<string, typeof PLANETS>)
            ).map(([category, planets]) => (
              <div key={category} className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </p>
                {planets.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => setActivePlanet(planet.name)}
                    className={`w-full text-left p-3 rounded-lg transition-all mb-2 ${
                      activePlanet === planet.name
                        ? `${planet.bgColor} border-2 ${planet.color} font-semibold`
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{planet.icon}</span>
                      <span className={activePlanet === planet.name ? planet.color : 'text-gray-700'}>
                        {planet.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Detalle del planeta */}
        <div className="lg:col-span-2">
          {displayPlanet ? (
            <div className={`${displayPlanet.bgColor} border-2 rounded-xl p-6`}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{displayPlanet.icon}</span>
                <div>
                  <h3 className={`text-3xl font-bold ${displayPlanet.color} mb-2`}>
                    {displayPlanet.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {displayPlanet.category === 'personal' && 'Planeta Personal'}
                    {displayPlanet.category === 'social' && 'Planeta Social'}
                    {displayPlanet.category === 'transpersonal' && 'Planeta Transpersonal'}
                  </p>
                </div>
              </div>

              {/* Descripción general */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">📖 ¿Qué es {displayPlanet.name}?</h4>
                <p className="text-gray-700 leading-relaxed">{displayPlanet.description}</p>
              </div>

              {/* Significado Natal */}
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  ¿Qué es "{displayPlanet.name} Natal"?
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">{displayPlanet.natalMeaning}</p>
                <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-3">
                  <p className="text-sm text-purple-800">
                    <strong>💡 En resumen:</strong> Tu {displayPlanet.name} natal es la posición de {displayPlanet.name} 
                    en el cielo al momento exacto de tu nacimiento. Es parte de tu carta natal y muestra características 
                    permanentes de tu personalidad.
                  </p>
                </div>
              </div>

              {/* Significado en Tránsitos */}
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  🔄 ¿Qué significa cuando {displayPlanet.name} transita?
                </h4>
                <p className="text-gray-700 leading-relaxed">{displayPlanet.transitMeaning}</p>
              </div>

              {/* Palabras clave */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🏷️ Palabras Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {displayPlanet.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Selecciona un planeta de la lista para ver su información
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Función helper para obtener información de un planeta
export function getPlanetInfo(planetName: string): PlanetInfo | undefined {
  return PLANETS.find(p => p.name === planetName)
}

// Función helper para verificar si un texto es un nombre de planeta
export function isPlanetName(text: string): boolean {
  return PLANETS.some(p => p.name === text)
}


