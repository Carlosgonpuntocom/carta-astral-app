import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, BookOpen, Sparkles, Users, TrendingUp, Heart, Calendar, Download, Upload, Star } from 'lucide-react'
import { DEMO_CHART } from '../../shared/constants'

interface TutorialProps {
  onClose: () => void
  onStartDemo?: () => void
}

type TutorialStep = {
  id: number
  title: string
  content: React.ReactNode
  highlight?: string // Selector CSS para resaltar elementos
}

export default function Tutorial({ onClose, onStartDemo }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps: TutorialStep[] = [
    {
      id: 0,
      title: '¡Bienvenido a Mi Carta Astral!',
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Este tutorial te guiará por todas las funcionalidades de la aplicación usando la carta de ejemplo de <strong>Robe Iniesta (Extremoduro)</strong>.
          </p>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>💡 Tip:</strong> Puedes cerrar este tutorial en cualquier momento y volver a abrirlo desde el botón de ayuda.
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📋 Datos de ejemplo:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Nombre:</strong> {DEMO_CHART.name}</li>
              <li><strong>Fecha:</strong> {DEMO_CHART.date}</li>
              <li><strong>Lugar:</strong> {DEMO_CHART.place}</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: '1. Ver tu Carta Astral',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La <strong>carta astral</strong> es el mapa de tu personalidad y destino según la posición de los planetas en el momento de tu nacimiento.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200">
            <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              ¿Qué verás en tu carta?
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
              <li><strong>Signos principales:</strong> Sol, Luna, Ascendente</li>
              <li><strong>Posiciones planetarias:</strong> Dónde está cada planeta y en qué signo</li>
              <li><strong>Aspectos:</strong> Relaciones entre planetas (armónicos y tensos)</li>
              <li><strong>Casas astrológicas:</strong> 12 áreas de vida</li>
              <li><strong>Estadísticas RPG:</strong> Fuerza, Inteligencia, Carisma, etc.</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>🎯 Práctica:</strong> Haz clic en "Ver Demo: Robe Iniesta" para ver una carta completa y explorar todas sus secciones.
            </p>
            {onStartDemo && (
              <button
                onClick={onStartDemo}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Ver Carta de Ejemplo
              </button>
            )}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '2. Añadir tu Carta Natal',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Para usar todas las funcionalidades, necesitas <strong>guardar tu carta natal</strong> con tus datos de nacimiento.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">📝 Datos necesarios:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>Fecha de nacimiento:</strong> Día, mes y año</li>
              <li><strong>Hora de nacimiento:</strong> Lo más exacta posible (afecta casas y Ascendente)</li>
              <li><strong>Lugar de nacimiento:</strong> Ciudad y país</li>
              <li><strong>⚠️ Hora aproximada:</strong> Marca esta opción si no conoces la hora exacta</li>
            </ul>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> Si no conoces tu hora de nacimiento, puedes usar las 12:00 (mediodía) como aproximación. 
              El sistema te indicará que la hora es aproximada.
            </p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>🎯 Práctica:</strong> Haz clic en "Añadir Mi Carta" en la sección superior para guardar tus datos.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3. Explorar Aspectos',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Los <strong>aspectos</strong> son las relaciones angulares entre planetas. Te muestran cómo interactúan las diferentes energías en tu carta.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
              <p className="font-semibold text-green-900 text-sm mb-1">✅ Aspectos Armónicos</p>
              <ul className="text-xs text-green-800 space-y-0.5">
                <li>• Trígono (120°)</li>
                <li>• Sextil (60°)</li>
              </ul>
              <p className="text-xs text-green-700 mt-1">Facilitan el flujo de energía</p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <p className="font-semibold text-red-900 text-sm mb-1">⚠️ Aspectos Tensos</p>
              <ul className="text-xs text-red-800 space-y-0.5">
                <li>• Cuadratura (90°)</li>
                <li>• Oposición (180°)</li>
              </ul>
              <p className="text-xs text-red-700 mt-1">Crean desafíos y tensiones</p>
            </div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>🎨 Colores educativos:</strong> Cada planeta tiene un color único para facilitar su identificación. 
              Las áreas de vida afectadas también se muestran con colores.
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>🎯 Práctica:</strong> En la vista de carta, explora la sección "Aspectos" y haz clic en cada uno para ver su interpretación detallada.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '4. Tránsitos Diarios',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Los <strong>tránsitos</strong> muestran cómo los planetas actuales interactúan con tu carta natal. Te ayudan a entender las energías del día.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200">
            <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Funcionalidades de Tránsitos:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
              <li><strong>Dashboard diario:</strong> Ayer, Hoy, Mañana</li>
              <li><strong>Calendario:</strong> Vista mensual/semanal de tránsitos futuros</li>
              <li><strong>Recordatorios:</strong> Tránsitos importantes próximos</li>
              <li><strong>Filtros:</strong> Tensos, armónicos, exactos</li>
            </ul>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>⚡ Tránsitos Exactos:</strong> Son los más importantes. Ocurren cuando un planeta forma un aspecto perfecto (orbe &lt; 0.5°) 
              con un punto de tu carta natal. Son momentos de máxima influencia.
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>🎯 Práctica:</strong> Si tienes tu carta guardada, ve a "Tránsitos Hoy" y explora las diferentes vistas y filtros.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '5. Añadir Personas',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Puedes guardar las cartas de <strong>personas cercanas</strong> para compararlas contigo o ver sus tránsitos.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Tipos de relación:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside ml-2">
              <li><strong>👨‍👩‍👧‍👦 Familia:</strong> Padres, hermanos, hijos</li>
              <li><strong>💑 Pareja:</strong> Relaciones románticas</li>
              <li><strong>👤 Amigo:</strong> Amistades cercanas</li>
              <li><strong>💼 Trabajo:</strong> Colegas, socios</li>
              <li><strong>📋 Otro:</strong> Cualquier otra relación</li>
            </ul>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>⭐ Favoritos:</strong> Puedes marcar personas como favoritas para acceder a ellas rápidamente.
            </p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>📝 Notas:</strong> Añade notas personalizadas a cada persona para recordar detalles importantes.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: '6. Comparar Cartas (Sinastría)',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La <strong>sinastría</strong> compara dos cartas para analizar la compatibilidad y las dinámicas de relación.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border-2 border-pink-200">
            <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              ¿Qué verás en la comparación?
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
              <li><strong>Grado de Afinidad:</strong> Porcentaje de compatibilidad (0-100%)</li>
              <li><strong>Signos principales:</strong> Comparación de Sol, Luna, Ascendente</li>
              <li><strong>Aspectos de sinastría:</strong> Cómo se relacionan tus planetas con los suyos</li>
              <li><strong>Elementos y modalidades:</strong> Distribución comparativa</li>
              <li><strong>Estadísticas RPG:</strong> Comparación de características</li>
            </ul>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📊 Matriz de Compatibilidad:</strong> Ve a "Herramientas Avanzadas" → "Matriz de Compatibilidad" 
              para ver la afinidad con todas tus personas guardadas de un vistazo.
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>🎯 Práctica:</strong> Añade al menos una persona y luego haz clic en "Comparar" en su tarjeta para ver la sinastría completa.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: '7. Búsqueda y Filtros',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La aplicación tiene un <strong>sistema de búsqueda avanzado</strong> para encontrar personas rápidamente.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">🔍 Búsqueda por:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside ml-2">
              <li><strong>Nombre:</strong> Busca por nombre de la persona</li>
              <li><strong>Lugar:</strong> Busca por ciudad o país de nacimiento</li>
              <li><strong>Relación:</strong> Busca por tipo de relación</li>
              <li><strong>Signo:</strong> Busca por signo solar, lunar o ascendente</li>
              <li><strong>Año:</strong> Busca por año de nacimiento (ej: "1990" o "1990-1995")</li>
            </ul>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">🎛️ Filtros Avanzados:</p>
            <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside ml-2">
              <li><strong>Elemento:</strong> Fuego, Tierra, Aire, Agua</li>
              <li><strong>Modalidad:</strong> Cardinal, Fijo, Mutable</li>
              <li><strong>Afinidad:</strong> Alta, Media, Baja compatibilidad</li>
            </ul>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>📊 Contador de resultados:</strong> Siempre verás cuántas personas coinciden con tu búsqueda.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: '8. Exportar e Importar',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Puedes hacer <strong>backup de todos tus datos</strong> para no perder información o transferirla a otro dispositivo.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
              <p className="font-semibold text-green-900 text-sm mb-1 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </p>
              <p className="text-xs text-green-800">
                Descarga un archivo JSON con todas tus personas guardadas, incluyendo cartas calculadas.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <p className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </p>
              <p className="text-xs text-blue-800">
                Restaura tus datos desde un archivo JSON previamente exportado.
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> Haz backup regularmente, especialmente antes de actualizar la aplicación o cambiar de dispositivo.
            </p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>📄 Exportar a PDF:</strong> También puedes exportar cartas individuales y comparaciones a PDF desde sus respectivas vistas.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: '9. Herramientas Avanzadas',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La aplicación incluye <strong>herramientas avanzadas</strong> para análisis más profundos.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border-2 border-pink-200">
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Matriz de Compatibilidad
              </p>
              <p className="text-sm text-gray-700">
                Ve la afinidad astrológica con todas tus personas guardadas en una tabla completa. 
                Ordena por afinidad, nombre o relación.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-200">
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Calendario de Tránsitos
              </p>
              <p className="text-sm text-gray-700">
                Vista mensual o semanal de todos los tránsitos futuros. Filtra por tipo y ve resúmenes de tránsitos importantes.
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-600" />
                Recordatorios de Tránsitos
              </p>
              <p className="text-sm text-gray-700">
                Recibe alertas de tránsitos importantes próximos. Configura días hacia adelante, fuerza mínima y tipos de tránsitos.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: '¡Listo para empezar!',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200 text-center">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Ya conoces todas las funcionalidades!</h3>
            <p className="text-gray-700">
              Ahora puedes explorar la aplicación con confianza. Recuerda que siempre puedes volver a este tutorial.
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">🚀 Próximos pasos sugeridos:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside ml-2">
              <li>Añade tu carta natal con tus datos de nacimiento</li>
              <li>Explora la carta de ejemplo de Robe Iniesta</li>
              <li>Añade algunas personas cercanas</li>
              <li>Compara tu carta con otras</li>
              <li>Revisa tus tránsitos diarios</li>
            </ol>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> Los colores en la aplicación son educativos y te ayudan a identificar rápidamente planetas, signos y casas.
            </p>
          </div>
          {onStartDemo && (
            <div className="text-center">
              <button
                onClick={onStartDemo}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-lg"
              >
                Ver Carta de Ejemplo
              </button>
            </div>
          )}
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Tutorial Interactivo</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              title="Cerrar tutorial"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-white/90 mt-2">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentStepData.title}</h3>
          <div className="text-gray-700">{currentStepData.content}</div>
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isFirstStep
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-purple-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Ir al paso ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={isLastStep ? onClose : nextStep}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isLastStep
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isLastStep ? 'Comenzar' : 'Siguiente'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}





