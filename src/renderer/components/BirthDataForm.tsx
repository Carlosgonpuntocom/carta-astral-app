import { useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import type { BirthData } from '../types/astrology'

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void
  initialData?: Partial<BirthData>
}

export default function BirthDataForm({ onSubmit, initialData }: BirthDataFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    name: initialData?.name || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    place: initialData?.place || '',
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    timezone: initialData?.timezone
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Fecha de nacimiento
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
          Hora de nacimiento
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Lugar de nacimiento
        </label>
        <input
          type="text"
          value={formData.place}
          onChange={(e) => setFormData({ ...formData, place: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ciudad, País"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 Para mayor precisión, puedes añadir coordenadas abajo (opcional)
        </p>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Coordenadas (Opcional - para mayor precisión)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Latitud
            </label>
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
            <label className="block text-xs text-gray-600 mb-1">
              Longitud
            </label>
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
        <p className="text-xs text-gray-500 mt-2">
          Si no las conoces, se usarán coordenadas aproximadas basadas en el lugar ingresado
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Calcular Mi Carta Astral
      </button>
    </form>
  )
}

