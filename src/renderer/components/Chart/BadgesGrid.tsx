import type { Badge } from '../../lib/astrology/chart-game-calculator'

interface BadgesGridProps {
  badges: Badge[]
}

const badgeColorClasses: Record<string, string> = {
  yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  red: 'bg-red-500/20 border-red-500/50 text-red-300',
  green: 'bg-green-500/20 border-green-500/50 text-green-300',
  blue: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  purple: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  orange: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
  indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300',
  pink: 'bg-pink-500/20 border-pink-500/50 text-pink-300'
}

export default function BadgesGrid({ badges }: BadgesGridProps) {
  if (badges.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-3xl">🏅</span>
          Logros
        </h3>
        <p className="text-gray-400 text-center py-4">Aún no hay logros desbloqueados.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">🏅</span>
        Logros Desbloqueados
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`${badgeColorClasses[badge.color] || badgeColorClasses.yellow} border-2 rounded-lg p-4 hover:scale-105 transition-transform`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{badge.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{badge.title}</h4>
                <p className="text-sm opacity-90">{badge.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

