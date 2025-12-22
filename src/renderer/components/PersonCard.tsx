import { Eye, Edit, Trash2, Users, Heart, User, Briefcase, MoreHorizontal, Star, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { SavedPerson, RelationshipType, ChartData } from '../types/astrology'
import { calculateAffinity } from '../lib/utils/affinity-calculator'
import SignLink from './Chart/SignLink'

interface PersonCardProps {
  person: SavedPerson
  myChart?: ChartData | null
  onView: (person: SavedPerson) => void
  onEdit: (person: SavedPerson) => void
  onDelete: (id: string) => void
  onCompare: (person: SavedPerson) => void
  onToggleFavorite: (person: SavedPerson) => void
  onViewTransits?: (person: SavedPerson) => void
}

// Función para formatear fecha a "día mes año"
function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-')
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    const monthIndex = parseInt(month, 10) - 1
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`
    }
    return dateString
  } catch {
    return dateString
  }
}

const RELATIONSHIP_ICONS: Record<RelationshipType, typeof User> = {
  familia: Users,
  pareja: Heart,
  amigo: User,
  trabajo: Briefcase,
  otro: MoreHorizontal
}

const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  familia: 'bg-blue-100 text-blue-700 border-blue-300',
  pareja: 'bg-pink-100 text-pink-700 border-pink-300',
  amigo: 'bg-green-100 text-green-700 border-green-300',
  trabajo: 'bg-purple-100 text-purple-700 border-purple-300',
  otro: 'bg-gray-100 text-gray-700 border-gray-300'
}

export default function PersonCard({ person, myChart, onView, onEdit, onDelete, onCompare, onToggleFavorite, onViewTransits }: PersonCardProps) {
  const [notesExpanded, setNotesExpanded] = useState(false)
  const Icon = RELATIONSHIP_ICONS[person.relationship]
  const colorClasses = RELATIONSHIP_COLORS[person.relationship]

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar a ${person.name}?`)) {
      onDelete(person.id)
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(person)
  }

  // Obtener signos principales si la carta está calculada
  const sun = person.chartData?.planets.find(p => 
    p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
  )
  const moon = person.chartData?.planets.find(p => 
    p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
  )
  const ascendant = person.chartData?.ascendant

  // Calcular afinidad si ambas cartas están disponibles
  const affinity = useMemo(() => {
    if (myChart && person.chartData) {
      return calculateAffinity(myChart, person.chartData)
    }
    return null
  }, [myChart, person.chartData])

  const hasNotes = person.notes && person.notes.trim().length > 0
  const notesPreview = hasNotes && person.notes!.length > 50 
    ? person.notes!.substring(0, 50) + '...' 
    : person.notes

  // Función para obtener color según afinidad
  const getAffinityColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 65) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (percentage >= 35) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className={`bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all ${person.favorite ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{person.name}</h3>
            <p className="text-sm text-gray-600">
              {person.relationshipDetail || person.relationship}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleFavorite}
          className={`p-1 rounded-full transition-colors ${
            person.favorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          title={person.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Star className={`w-5 h-5 ${person.favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-4 space-y-1">
        <p>📅 {formatDate(person.birthData.date)}</p>
        {person.birthData.time && (
          <p className="flex items-center gap-2">
            🕐 {person.birthData.time}
            {person.timeIsApproximate && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold" title="La hora de nacimiento es aproximada">
                ⚠️ Aproximada
              </span>
            )}
          </p>
        )}
        <p>📍 {person.birthData.place}</p>
        
        {/* Grado de afinidad */}
        {affinity && (
          <div className={`mt-2 pt-2 border-t border-gray-200`}>
            <div className={`px-2 py-1 rounded-lg border ${getAffinityColor(affinity.percentage)}`}>
              <p className="text-xs font-semibold">
                💫 Afinidad: {affinity.percentage}% - {affinity.description}
              </p>
            </div>
          </div>
        )}
        
        {/* Signos principales (si la carta está calculada) */}
        {(sun || moon || ascendant) && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
            {sun && (
              <p className="text-xs">
                ☉ Sol: <SignLink signName={sun.sign} showIcon={false} className="font-semibold text-xs" />
              </p>
            )}
            {moon && (
              <p className="text-xs">
                ☽ Luna: <SignLink signName={moon.sign} showIcon={false} className="font-semibold text-xs" />
              </p>
            )}
            {ascendant && (
              <p className="text-xs">
                ↑ Asc: <SignLink signName={ascendant} showIcon={false} className="font-semibold text-xs" />
              </p>
            )}
          </div>
        )}

        {/* Notas expandibles */}
        {hasNotes && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setNotesExpanded(!notesExpanded)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {notesExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Ocultar notas
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Ver notas
                </>
              )}
            </button>
            {notesExpanded && (
              <p className="text-gray-500 italic mt-1 text-xs">💭 {person.notes}</p>
            )}
            {!notesExpanded && (
              <p className="text-gray-400 italic mt-1 text-xs">💭 {notesPreview}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onView(person)}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>
        {person.chartData && onViewTransits && (
          <button
            onClick={() => onViewTransits(person)}
            className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
            title="Ver tránsitos"
          >
            <TrendingUp className="w-4 h-4" />
            Tránsitos
          </button>
        )}
        <button
          onClick={() => onCompare(person)}
          className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
        >
          <Users className="w-4 h-4" />
          Comparar
        </button>
        <button
          onClick={() => onEdit(person)}
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

