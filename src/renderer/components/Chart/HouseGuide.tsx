import { X } from 'lucide-react'
import { getHouseTextColor } from '../../lib/utils/planet-colors'

interface HouseInfo {
  number: number
  name: string
  description: string
  areas: string[]
  keywords: string[]
}

const HOUSES: HouseInfo[] = [
  {
    number: 1,
    name: 'Casa de la Identidad',
    description: 'La primera casa representa tu identidad, personalidad, apariencia física y cómo te presentas al mundo. Es tu "yo" exterior.',
    areas: ['Personalidad', 'Apariencia física', 'Primera impresión', 'Autoexpresión', 'Ascendente'],
    keywords: ['Identidad', 'Personalidad', 'Apariencia', 'Autoexpresión', 'Inicio']
  },
  {
    number: 2,
    name: 'Casa de los Recursos',
    description: 'La segunda casa rige tus posesiones materiales, valores, recursos financieros y lo que consideras valioso.',
    areas: ['Dinero', 'Posesiones', 'Valores', 'Recursos', 'Talento natural'],
    keywords: ['Dinero', 'Posesiones', 'Valores', 'Recursos', 'Seguridad material']
  },
  {
    number: 3,
    name: 'Casa de la Comunicación',
    description: 'La tercera casa rige la comunicación, el aprendizaje, los hermanos, los viajes cortos y el entorno inmediato.',
    areas: ['Comunicación', 'Aprendizaje', 'Hermanos', 'Viajes cortos', 'Entorno cercano'],
    keywords: ['Comunicación', 'Aprendizaje', 'Hermanos', 'Viajes', 'Pensamiento']
  },
  {
    number: 4,
    name: 'Casa del Hogar',
    description: 'La cuarta casa representa tu hogar, familia, raíces, privacidad y tu mundo interior más profundo.',
    areas: ['Hogar', 'Familia', 'Raíces', 'Privacidad', 'Mundo interior'],
    keywords: ['Hogar', 'Familia', 'Raíces', 'Privacidad', 'Fundación']
  },
  {
    number: 5,
    name: 'Casa de la Creatividad',
    description: 'La quinta casa rige la creatividad, el romance, los hijos, el placer, los juegos y la autoexpresión creativa.',
    areas: ['Creatividad', 'Romance', 'Hijos', 'Placer', 'Juegos', 'Diversión'],
    keywords: ['Creatividad', 'Romance', 'Hijos', 'Placer', 'Autoexpresión']
  },
  {
    number: 6,
    name: 'Casa del Trabajo',
    description: 'La sexta casa rige el trabajo diario, la salud, las rutinas, el servicio y cómo cuidas de ti mismo.',
    areas: ['Trabajo diario', 'Salud', 'Rutinas', 'Servicio', 'Cuidado personal'],
    keywords: ['Trabajo', 'Salud', 'Rutinas', 'Servicio', 'Organización']
  },
  {
    number: 7,
    name: 'Casa de las Relaciones',
    description: 'La séptima casa representa las relaciones cercanas, el matrimonio, socios y cómo te relacionas con otros.',
    areas: ['Relaciones', 'Matrimonio', 'Socios', 'Contratos', 'Otros'],
    keywords: ['Relaciones', 'Matrimonio', 'Socios', 'Asociaciones', 'Equilibrio']
  },
  {
    number: 8,
    name: 'Casa de la Transformación',
    description: 'La octava casa rige la transformación, recursos compartidos, sexualidad, muerte y renacimiento.',
    areas: ['Transformación', 'Recursos compartidos', 'Sexualidad', 'Muerte', 'Renacimiento'],
    keywords: ['Transformación', 'Recursos compartidos', 'Sexualidad', 'Misterio', 'Poder']
  },
  {
    number: 9,
    name: 'Casa de la Filosofía',
    description: 'La novena casa rige la filosofía, la educación superior, los viajes largos, la religión y la búsqueda de significado.',
    areas: ['Filosofía', 'Educación superior', 'Viajes largos', 'Religión', 'Búsqueda de significado'],
    keywords: ['Filosofía', 'Educación', 'Viajes', 'Religión', 'Expansión mental']
  },
  {
    number: 10,
    name: 'Casa de la Carrera',
    description: 'La décima casa representa tu carrera, reputación, estatus público, ambiciones y cómo te ven los demás.',
    areas: ['Carrera', 'Reputación', 'Estatus público', 'Ambiciones', 'Medio Cielo'],
    keywords: ['Carrera', 'Reputación', 'Estatus', 'Ambiciones', 'Logro público']
  },
  {
    number: 11,
    name: 'Casa de los Amigos',
    description: 'La undécima casa rige los amigos, grupos, esperanzas, sueños y tu visión del futuro.',
    areas: ['Amigos', 'Grupos', 'Esperanzas', 'Sueños', 'Futuro'],
    keywords: ['Amigos', 'Grupos', 'Esperanzas', 'Sueños', 'Humanidad']
  },
  {
    number: 12,
    name: 'Casa del Subconsciente',
    description: 'La duodécima casa rige el subconsciente, los secretos, la espiritualidad, el karma y lo que está oculto.',
    areas: ['Subconsciente', 'Secretos', 'Espiritualidad', 'Karma', 'Lo oculto'],
    keywords: ['Subconsciente', 'Secretos', 'Espiritualidad', 'Karma', 'Sacrificio']
  }
]

interface HouseGuideProps {
  selectedHouse?: number
  onClose: () => void
}

export default function HouseGuide({ selectedHouse, onClose }: HouseGuideProps) {
  const housesToShow = selectedHouse
    ? HOUSES.filter(h => h.number === selectedHouse)
    : HOUSES

  return (
    <div className="space-y-6">
      {housesToShow.map((house) => (
        <div key={house.number} className="space-y-4">
          <div className={`border-2 rounded-lg p-6 ${getHouseTextColor(house.number).replace('text-', 'bg-').replace('-700', '-50')} border-${getHouseTextColor(house.number).replace('text-', '').replace('-700', '-300')}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-3xl font-bold ${getHouseTextColor(house.number)}`}>
                  Casa {house.number}
                </h3>
                <p className="text-lg font-semibold text-gray-700 mt-1">{house.name}</p>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-4">{house.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📍 Áreas de Vida</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {house.areas.map((area, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🔑 Palabras Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {house.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {!selectedHouse && (
        <div className="text-center text-gray-500 text-sm">
          Selecciona una casa específica para ver información detallada
        </div>
      )}
    </div>
  )
}





