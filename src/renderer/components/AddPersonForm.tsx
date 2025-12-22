import { useState } from 'react'
import { Calendar, Clock, MapPin, X, Search, Loader2 } from 'lucide-react'
import type { BirthData, RelationshipType } from '../types/astrology'
import { geocodePlaceWithDebounce } from '@/lib/utils/geocoding'

interface AddPersonFormProps {
  onSubmit: (data: {
    birthData: BirthData
    relationship: RelationshipType
    relationshipDetail?: string
    notes?: string
    timeIsApproximate?: boolean
  }) => void
  onCancel: () => void
  initialData?: Partial<BirthData>
  initialTimeIsApproximate?: boolean
  isEdit?: boolean
}

export default function AddPersonForm({ onSubmit, onCancel, initialData, initialTimeIsApproximate, isEdit = false }: AddPersonFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    name: initialData?.name || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    place: initialData?.place || '',
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    timezone: initialData?.timezone
  })

  const [relationship, setRelationship] = useState<RelationshipType>('otro')
  const [relationshipDetail, setRelationshipDetail] = useState('')
  const [notes, setNotes] = useState('')
  const [timeIsApproximate, setTimeIsApproximate] = useState(initialTimeIsApproximate || false)
  const [geocoding, setGeocoding] = useState<{
    loading: boolean
    error: string | null
    success: boolean
  }>({ loading: false, error: null, success: false })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      birthData: formData,
      relationship,
      relationshipDetail: relationshipDetail.trim() || undefined,
      notes: notes.trim() || undefined,
      timeIsApproximate: timeIsApproximate || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Editar Persona' : 'Nueva Persona'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre completo"
          required
        />
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de nacimiento *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hora de nacimiento *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={timeIsApproximate}
              onChange={(e) => setTimeIsApproximate(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>La hora es aproximada (no real)</span>
          </label>
        </div>
      </div>

      {/* Lugar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Lugar de nacimiento *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.place}
            onChange={(e) => {
              setFormData({ ...formData, place: e.target.value })
              setGeocoding({ loading: false, error: null, success: false })
            }}
            onBlur={async () => {
              // Buscar coordenadas automáticamente cuando el usuario sale del campo
              if (formData.place && formData.place.trim().length > 3 && (!formData.latitude || !formData.longitude)) {
                setGeocoding({ loading: true, error: null, success: false })
                try {
                  const result = await geocodePlaceWithDebounce(formData.place)
                  if (result) {
                    setFormData({
                      ...formData,
                      latitude: result.latitude,
                      longitude: result.longitude
                    })
                    setGeocoding({ loading: false, error: null, success: true })
                  } else {
                    setGeocoding({ loading: false, error: 'No se encontró el lugar', success: false })
                  }
                } catch (error) {
                  setGeocoding({ loading: false, error: 'Error al buscar coordenadas', success: false })
                }
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Palma, España o Madrid, España"
            required
          />
          <button
            type="button"
            onClick={async () => {
              if (!formData.place || formData.place.trim().length < 3) return
              setGeocoding({ loading: true, error: null, success: false })
              try {
                const result = await geocodePlaceWithDebounce(formData.place)
                if (result) {
                  setFormData({
                    ...formData,
                    latitude: result.latitude,
                    longitude: result.longitude
                  })
                  setGeocoding({ loading: false, error: null, success: true })
                } else {
                  setGeocoding({ loading: false, error: 'No se encontró el lugar', success: false })
                }
              } catch (error) {
                setGeocoding({ loading: false, error: 'Error al buscar coordenadas', success: false })
              }
            }}
            disabled={geocoding.loading || !formData.place || formData.place.trim().length < 3}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            title="Buscar coordenadas automáticamente"
          >
            {geocoding.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
        {geocoding.success && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            ✓ Coordenadas encontradas automáticamente
          </p>
        )}
        {geocoding.error && (
          <p className="mt-1 text-xs text-red-600">
            ⚠️ {geocoding.error}. Puedes introducir las coordenadas manualmente.
          </p>
        )}
        {formData.latitude && formData.longitude && (
          <p className="mt-1 text-xs text-gray-500">
            📍 Coordenadas: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </p>
        )}
      </div>

      {/* Coordenadas (opcional) */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Coordenadas (Opcional - para mayor precisión)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitud</label>
            <input
              type="number"
              step="any"
              value={formData.latitude ?? ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                latitude: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="40.0311"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitud</label>
            <input
              type="number"
              step="any"
              value={formData.longitude ?? ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                longitude: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="-6.0881"
            />
          </div>
        </div>
      </div>

      {/* Relación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de relación *
        </label>
        <select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value as RelationshipType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="familia">👨‍👩‍👧‍👦 Familia</option>
          <option value="pareja">💑 Pareja</option>
          <option value="amigo">👤 Amigo</option>
          <option value="trabajo">💼 Trabajo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Detalle de relación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Relación específica (opcional)
        </label>
        <input
          type="text"
          value={relationshipDetail}
          onChange={(e) => setRelationshipDetail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Mamá, Hermano, Novia, Jefe..."
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Notas adicionales sobre esta persona..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold"
        >
          {isEdit ? 'Actualizar' : 'Guardar Persona'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

