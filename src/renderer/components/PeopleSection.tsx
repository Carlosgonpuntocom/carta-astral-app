import { Plus, Search, Users, Star, ArrowUpDown, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { SavedPerson } from '../types/astrology'
import PersonCard from './PersonCard'
import { calculateElements, calculateModalities } from '../lib/astrology/chart-game-calculator'
import { calculateAffinity } from '../lib/utils/affinity-calculator'

interface PeopleSectionProps {
  people: SavedPerson[]
  myChart?: { chartData?: import('../types/astrology').ChartData } | null
  onAddPerson: () => void
  onViewPerson: (person: SavedPerson) => void
  onEditPerson: (person: SavedPerson) => void
  onDeletePerson: (id: string) => void
  onComparePerson: (person: SavedPerson) => void
  onToggleFavorite: (person: SavedPerson) => void
  onViewTransits?: (person: SavedPerson) => void
}

type SortOption = 'name' | 'birthDate' | 'createdAt' | 'favorite'
type ElementFilter = 'all' | 'fire' | 'earth' | 'air' | 'water'
type ModalityFilter = 'all' | 'cardinal' | 'fixed' | 'mutable'
type AffinityFilter = 'all' | 'high' | 'medium' | 'low'

// Función helper para obtener signos principales de una persona
function getMainSigns(person: SavedPerson): { sun?: string; moon?: string; ascendant?: string } {
  if (!person.chartData) return {}
  
  const sun = person.chartData.planets.find(p => 
    p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
  )
  const moon = person.chartData.planets.find(p => 
    p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
  )
  
  return {
    sun: sun?.sign,
    moon: moon?.sign,
    ascendant: person.chartData.ascendant
  }
}

// Función helper para verificar si un término coincide con un signo
function matchesSign(searchTerm: string, sign?: string): boolean {
  if (!sign) return false
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const normalizedSign = sign.toLowerCase()
  return normalizedSign.includes(normalizedSearch) || normalizedSearch.includes(normalizedSign)
}

// Función helper para parsear búsqueda por año
function matchesYearRange(searchTerm: string, birthDate: string): boolean {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  
  // Extraer año de la fecha de nacimiento (formato: YYYY-MM-DD)
  const birthYear = parseInt(birthDate.split('-')[0])
  if (isNaN(birthYear)) return false
  
  // Caso 1: Rango (ej: "1980-1990")
  const rangeMatch = normalizedSearch.match(/^(\d{4})-(\d{4})$/)
  if (rangeMatch) {
    const startYear = parseInt(rangeMatch[1])
    const endYear = parseInt(rangeMatch[2])
    return birthYear >= startYear && birthYear <= endYear
  }
  
  // Caso 2: Mayor que (ej: ">1980" o "desde 1980")
  const greaterMatch = normalizedSearch.match(/^(>|desde|después de|after)\s*(\d{4})$/)
  if (greaterMatch) {
    const year = parseInt(greaterMatch[2])
    return birthYear >= year
  }
  
  // Caso 3: Menor que (ej: "<1990" o "antes de 1990")
  const lessMatch = normalizedSearch.match(/^(<|antes de|before)\s*(\d{4})$/)
  if (lessMatch) {
    const year = parseInt(lessMatch[2])
    return birthYear <= year
  }
  
  // Caso 4: Año exacto (ej: "1985")
  const exactMatch = normalizedSearch.match(/^(\d{4})$/)
  if (exactMatch) {
    const year = parseInt(exactMatch[1])
    return birthYear === year
  }
  
  return false
}

export default function PeopleSection({
  people,
  myChart,
  onAddPerson,
  onViewPerson,
  onEditPerson,
  onDeletePerson,
  onComparePerson,
  onToggleFavorite,
  onViewTransits
}: PeopleSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [elementFilter, setElementFilter] = useState<ElementFilter>('all')
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all')
  const [affinityFilter, setAffinityFilter] = useState<AffinityFilter>('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem('people-sort-preference')
    return (saved as SortOption) || 'name'
  })

  // Filtrar personas (excluir tu propia carta)
  const otherPeople = people.filter(p => !p.isSelf)

  // Aplicar filtros
  const filteredPeople = useMemo(() => {
    let result = otherPeople.filter(person => {
      // Búsqueda básica (nombre, lugar, relación)
      const basicSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.birthData.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (person.relationshipDetail || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      // Búsqueda por signo (Sol, Luna, Ascendente)
      const mainSigns = getMainSigns(person)
      const signSearch = matchesSign(searchTerm, mainSigns.sun) ||
                        matchesSign(searchTerm, mainSigns.moon) ||
                        matchesSign(searchTerm, mainSigns.ascendant)
      
      // Búsqueda por año/rango de años
      const yearSearch = matchesYearRange(searchTerm, person.birthData.date)
      
      const matchesSearch = basicSearch || signSearch || yearSearch
      
      const matchesType = filterType === 'all' || person.relationship === filterType
      const matchesFavorite = !showFavoritesOnly || person.favorite

      // Filtro por elemento
      let matchesElement = true
      if (elementFilter !== 'all' && person.chartData) {
        const elements = calculateElements(person.chartData)
        const dominantElement = Object.entries(elements).reduce((a, b) => 
          elements[a[0] as keyof typeof elements] > elements[b[0] as keyof typeof elements] ? a : b
        )[0]
        matchesElement = dominantElement === elementFilter
      }

      // Filtro por modalidad
      let matchesModality = true
      if (modalityFilter !== 'all' && person.chartData) {
        const modalities = calculateModalities(person.chartData)
        const dominantModality = Object.entries(modalities).reduce((a, b) => 
          modalities[a[0] as keyof typeof modalities] > modalities[b[0] as keyof typeof modalities] ? a : b
        )[0]
        matchesModality = dominantModality === modalityFilter
      }

      // Filtro por afinidad
      let matchesAffinity = true
      if (affinityFilter !== 'all' && myChart?.chartData && person.chartData) {
        const affinity = calculateAffinity(myChart.chartData, person.chartData)
        if (affinityFilter === 'high') {
          matchesAffinity = affinity.percentage >= 70
        } else if (affinityFilter === 'medium') {
          matchesAffinity = affinity.percentage >= 40 && affinity.percentage < 70
        } else if (affinityFilter === 'low') {
          matchesAffinity = affinity.percentage < 40
        }
      } else if (affinityFilter !== 'all') {
        // Si no hay mi carta, no se puede calcular afinidad
        matchesAffinity = false
      }

      return matchesSearch && matchesType && matchesFavorite && matchesElement && matchesModality && matchesAffinity
    })

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'birthDate':
          return a.birthData.date.localeCompare(b.birthData.date)
        case 'createdAt':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'favorite':
          if (a.favorite && !b.favorite) return -1
          if (!a.favorite && b.favorite) return 1
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [otherPeople, searchTerm, filterType, showFavoritesOnly, elementFilter, modalityFilter, affinityFilter, myChart, sortBy])

  // Guardar preferencia de ordenación
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    localStorage.setItem('people-sort-preference', newSort)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Personas</h2>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            {otherPeople.length}
          </span>
          {/* Contador de resultados filtrados */}
          {(searchTerm || filterType !== 'all' || showFavoritesOnly || elementFilter !== 'all' || modalityFilter !== 'all' || affinityFilter !== 'all') && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              Mostrando {filteredPeople.length} de {otherPeople.length}
            </span>
          )}
        </div>
        <button
          onClick={onAddPerson}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Persona
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, lugar, relación, signo (Leo, Piscis...) o año (1980, 1980-1990, >1985)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${
              showFavoritesOnly
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favoritos
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Por nombre</option>
              <option value="birthDate">Por fecha nacimiento</option>
              <option value="createdAt">Por fecha creación</option>
              <option value="favorite">Favoritos primero</option>
            </select>
          </div>
          <button
            onClick={() => setFilterType('familia')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'familia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👨‍👩‍👧‍👦 Familia
          </button>
          <button
            onClick={() => setFilterType('pareja')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'pareja'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💑 Pareja
          </button>
          <button
            onClick={() => setFilterType('amigo')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'amigo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👤 Amigos
          </button>
          <button
            onClick={() => setFilterType('trabajo')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'trabajo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💼 Trabajo
          </button>
          
          {/* Botón para mostrar/ocultar filtros avanzados */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${
              showAdvancedFilters || elementFilter !== 'all' || modalityFilter !== 'all' || affinityFilter !== 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros Avanzados
          </button>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Filtros Avanzados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Filtro por elemento */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Elemento Dominante</label>
                <select
                  value={elementFilter}
                  onChange={(e) => setElementFilter(e.target.value as ElementFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todos</option>
                  <option value="fire">🔥 Fuego</option>
                  <option value="earth">🌍 Tierra</option>
                  <option value="air">💨 Aire</option>
                  <option value="water">💧 Agua</option>
                </select>
              </div>

              {/* Filtro por modalidad */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Modalidad Dominante</label>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value as ModalityFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todas</option>
                  <option value="cardinal">⚡ Cardinal</option>
                  <option value="fixed">🔒 Fijo</option>
                  <option value="mutable">🔄 Mutable</option>
                </select>
              </div>

              {/* Filtro por afinidad */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Afinidad conmigo</label>
                <select
                  value={affinityFilter}
                  onChange={(e) => setAffinityFilter(e.target.value as AffinityFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!myChart?.chartData}
                >
                  <option value="all">Todas</option>
                  <option value="high">💫 Alta (≥70%)</option>
                  <option value="medium">⭐ Media (40-69%)</option>
                  <option value="low">💔 Baja (&lt;40%)</option>
                </select>
                {!myChart?.chartData && (
                  <p className="text-xs text-gray-500 mt-1">Necesitas tener tu carta guardada</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de personas */}
      {filteredPeople.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {otherPeople.length === 0
              ? 'No hay personas guardadas'
              : 'No se encontraron personas con los filtros aplicados'}
          </p>
          {otherPeople.length === 0 && (
            <button
              onClick={onAddPerson}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Añadir Primera Persona
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              myChart={myChart?.chartData || null}
              onView={onViewPerson}
              onEdit={onEditPerson}
              onDelete={onDeletePerson}
              onCompare={onComparePerson}
              onToggleFavorite={onToggleFavorite}
              onViewTransits={onViewTransits}
            />
          ))}
        </div>
      )}
    </div>
  )
}

