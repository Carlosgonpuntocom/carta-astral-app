import { useState } from 'react'
import { Brain, Sparkles, Heart, Zap, Target, Shield, HelpCircle, X } from 'lucide-react'
import type { RPGStats } from '../../lib/astrology/chart-game-calculator'
import ProgressBar from '../Transits/ProgressBar'

interface RPGStatsPanelProps {
  stats: RPGStats
}

const statConfig = [
  { 
    key: 'INT' as const, 
    label: 'INT', 
    fullName: 'Intelecto', 
    icon: Brain, 
    color: 'blue', 
    bgColor: 'bg-blue-500/20', 
    iconColor: 'text-blue-400', 
    description: 'Comunicación y análisis',
    detailedExplanation: 'Mide tu capacidad de comunicación, análisis lógico y procesamiento mental. Se basa en Mercurio (planeta de la comunicación) y planetas en signos de Aire (Géminis, Libra, Acuario). Alto = comunicas ideas claramente, analizas bien. Bajo = puedes mejorar expresándote o estructurando pensamientos.'
  },
  { 
    key: 'WIS' as const, 
    label: 'WIS', 
    fullName: 'Intuición', 
    icon: Sparkles, 
    color: 'purple', 
    bgColor: 'bg-purple-500/20', 
    iconColor: 'text-purple-400', 
    description: 'Intuición filosófica, espiritual y mental',
    detailedExplanation: 'Mide tu intuición filosófica, espiritual y capacidad de ver patrones profundos. Se basa en Júpiter (filosofía), Neptuno (espiritualidad), stelliums en Sagitario, y planetas en Casa 9. Alto = entiendes conceptos abstractos, tienes sabiduría interior. Bajo = puedes desarrollar más reflexión y conexión espiritual.'
  },
  { 
    key: 'CHA' as const, 
    label: 'CHA', 
    fullName: 'Magnetismo', 
    icon: Heart, 
    color: 'red', 
    bgColor: 'bg-red-500/20', 
    iconColor: 'text-red-400', 
    description: 'Encanto y presencia personal',
    detailedExplanation: 'Mide tu magnetismo personal, encanto y cómo te presentas al mundo. Se basa en Venus (encanto), Luna en Leo (magnetismo), Sol (presencia), y Ascendente. Se reduce si hay inhibiciones (Saturno en 1ª casa, planetas en 12ª). Alto = atraes a otros, tienes presencia. Bajo = puedes trabajar en autenticidad y confianza.'
  },
  { 
    key: 'STR' as const, 
    label: 'STR', 
    fullName: 'Fuerza', 
    icon: Zap, 
    color: 'orange', 
    bgColor: 'bg-orange-500/20', 
    iconColor: 'text-orange-400', 
    description: 'Acción y determinación',
    detailedExplanation: 'Mide tu capacidad de acción, determinación y energía para perseguir objetivos. Se basa en Marte (planeta de la acción) y planetas en signos de Fuego (Aries, Leo, Sagitario). Alto = actúas con decisión, tienes impulso. Bajo = puedes desarrollar más iniciativa y coraje.'
  },
  { 
    key: 'DEX' as const, 
    label: 'DEX', 
    fullName: 'Agilidad', 
    icon: Target, 
    color: 'green', 
    bgColor: 'bg-green-500/20', 
    iconColor: 'text-green-400', 
    description: 'Adaptabilidad mental',
    detailedExplanation: 'Mide tu agilidad mental, adaptabilidad y capacidad de cambiar de perspectiva. Se basa en tu Ascendente y planetas en signos Mutables (Géminis, Virgo, Sagitario, Piscis). Alto = te adaptas rápido, eres flexible. Bajo = puedes trabajar en aceptar cambios y ver múltiples perspectivas.'
  },
  { 
    key: 'CON' as const, 
    label: 'CON', 
    fullName: 'Constitución', 
    icon: Shield, 
    color: 'yellow', 
    bgColor: 'bg-yellow-500/20', 
    iconColor: 'text-yellow-400', 
    description: 'Resistencia y disciplina',
    detailedExplanation: 'Mide tu resistencia, disciplina y capacidad de mantener estructura. Se basa en Saturno (disciplina) y planetas en signos de Tierra (Tauro, Virgo, Capricornio). Alto = eres disciplinado, mantienes rutinas. Bajo = puedes desarrollar más estructura y perseverancia.'
  }
]

export default function RPGStatsPanel({ stats }: RPGStatsPanelProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-slate-600">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">⚔️</span>
          Stats RPG
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-gray-400 hover:text-gray-200 transition-colors"
          title="¿Qué son los Stats RPG?"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Explicación expandible */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-gray-800/70 rounded-lg border border-gray-600">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-semibold text-white">📚 ¿Qué son los Stats RPG?</h4>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              Los <strong className="text-white">Stats RPG</strong> son una forma gamificada de entender tu carta astral. 
              Cada stat (estadística) mide una capacidad o característica basada en las posiciones de tus planetas natales.
            </p>
            <div className="bg-gray-900/50 rounded p-3 space-y-2">
              <p className="font-semibold text-white mb-2">📊 Escala de 0 a 10:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li><strong className="text-green-400">8-10 (Alto):</strong> Esta característica es muy fuerte en ti. Es una de tus fortalezas naturales.</li>
                <li><strong className="text-yellow-400">6-7.9 (Medio):</strong> Tienes una capacidad moderada. Puedes desarrollarla más con práctica.</li>
                <li><strong className="text-gray-400">0-5.9 (Bajo):</strong> Esta área puede ser un desafío. No significa que no puedas desarrollarla, solo que requiere más esfuerzo.</li>
              </ul>
            </div>
            <div className="bg-purple-900/30 rounded p-3 border border-purple-700/50">
              <p className="text-xs text-purple-200">
                <strong>💡 Tip:</strong> Estos stats se calculan basándose en la posición de tus planetas, sus dignidades, 
                aspectos, y casas astrológicas. No son absolutos, sino indicadores de tus tendencias naturales.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statConfig.map(({ key, label, fullName, icon: Icon, color, bgColor, iconColor, description, detailedExplanation }) => {
          const value = stats[key]
          const level = value >= 8 ? 'Alto' : value >= 6 ? 'Medio' : 'Bajo'
          const levelColor = value >= 8 ? 'text-green-400' : value >= 6 ? 'text-yellow-400' : 'text-gray-400'
          const [showStatHelp, setShowStatHelp] = useState(false)

          return (
            <div key={key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{label}</span>
                    <span className="text-gray-400 text-sm">({fullName})</span>
                    <button
                      onClick={() => setShowStatHelp(!showStatHelp)}
                      className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
                      title={`¿Qué significa ${fullName}?`}
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                    <span className={`ml-auto font-bold text-xl ${levelColor}`}>{value.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{description}</p>
                </div>
              </div>
              
              {/* Explicación detallada del stat */}
              {showStatHelp && (
                <div className="mb-3 p-3 bg-gray-900/70 rounded border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-semibold text-white">{fullName} - Explicación</h5>
                    <button
                      onClick={() => setShowStatHelp(false)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">{detailedExplanation}</p>
                  
                  {/* Desglose para WIS */}
                  {key === 'WIS' && stats.mentalIntuition !== undefined && stats.emotionalIntuition !== undefined && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <h6 className="text-xs font-semibold text-white mb-2">📊 Tu Intuición en Detalle:</h6>
                      <div className="space-y-2">
                        <div className="bg-purple-900/20 rounded p-2 border border-purple-700/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-purple-300 flex items-center gap-1">
                              🧠 Intuición Mental:
                            </span>
                            <span className="text-xs font-bold text-purple-200">
                              {stats.mentalIntuition.toFixed(1)}/10
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Ver patrones, significados profundos, insights filosóficos. Basado en Stellium Sag, Júpiter, Neptuno, Casa 9.
                          </p>
                        </div>
                        <div className="bg-blue-900/20 rounded p-2 border border-blue-700/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-blue-300 flex items-center gap-1">
                              💧 Intuición Emocional:
                            </span>
                            <span className="text-xs font-bold text-blue-200">
                              {stats.emotionalIntuition.toFixed(1)}/10
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Sentir emociones ajenas, empatía visceral, leer ambientes. Basado en Agua, Luna, Neptuno, Casa 12.
                          </p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50 mt-2">
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {stats.mentalIntuition > stats.emotionalIntuition + 2 ? (
                              <>
                                <strong className="text-purple-300">💡 Tu fuerte es la intuición conceptual.</strong> La intuición emocional es un área de desarrollo.
                              </>
                            ) : stats.emotionalIntuition > stats.mentalIntuition + 2 ? (
                              <>
                                <strong className="text-blue-300">💡 Tu fuerte es la intuición emocional.</strong> La intuición mental es un área de desarrollo.
                              </>
                            ) : (
                              <>
                                <strong className="text-green-300">💡 Tienes un buen equilibrio</strong> entre intuición mental y emocional.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Desglose para CHA */}
                  {key === 'CHA' && stats.personalCharisma !== undefined && stats.groupCharisma !== undefined && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <h6 className="text-xs font-semibold text-white mb-2">📊 Tu Magnetismo en Detalle:</h6>
                      <div className="space-y-2">
                        <div className="bg-red-900/20 rounded p-2 border border-red-700/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-red-300 flex items-center gap-1">
                              👤 Magnetismo Personal:
                            </span>
                            <span className="text-xs font-bold text-red-200">
                              {stats.personalCharisma.toFixed(1)}/10
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Encanto en relaciones 1 a 1, conexión cercana. Basado en Venus, Luna en Leo, Sol, Casa 5 y 7.
                          </p>
                        </div>
                        <div className="bg-orange-900/20 rounded p-2 border border-orange-700/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-orange-300 flex items-center gap-1">
                              👥 Magnetismo Grupal:
                            </span>
                            <span className="text-xs font-bold text-orange-200">
                              {stats.groupCharisma.toFixed(1)}/10
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Presencia en grupos, situaciones sociales. Basado en Ascendente, Casa 10, y se reduce por inhibiciones sociales.
                          </p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50 mt-2">
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {stats.personalCharisma > stats.groupCharisma + 1.5 ? (
                              <>
                                <strong className="text-red-300">💡 Tu fuerte es el magnetismo personal.</strong> Puedes trabajar en tu presencia en grupos.
                              </>
                            ) : stats.groupCharisma > stats.personalCharisma + 1.5 ? (
                              <>
                                <strong className="text-orange-300">💡 Tu fuerte es el magnetismo grupal.</strong> Brillas en situaciones sociales.
                              </>
                            ) : (
                              <>
                                <strong className="text-green-300">💡 Tienes un buen equilibrio</strong> entre magnetismo personal y grupal.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <ProgressBar
                label=""
                value={value}
                max={10}
                color={color as 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'orange'}
                showValue={false}
                size="md"
              />
              <p className={`text-xs mt-2 ${levelColor} font-semibold`}>
                Nivel: {level}
              </p>
              {/* Nota especial para CHA si hay diferencia significativa */}
              {key === 'CHA' && stats.personalCharisma !== undefined && stats.groupCharisma !== undefined && (
                Math.abs(stats.personalCharisma - stats.groupCharisma) > 1.5 && (
                  <p className="text-xs text-gray-400 mt-1 italic">
                    {stats.personalCharisma > stats.groupCharisma 
                      ? '💡 Alto magnetismo personal, puede variar en grupos'
                      : '💡 Brillas en grupos, el magnetismo personal puede desarrollarse más'}
                  </p>
                )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

