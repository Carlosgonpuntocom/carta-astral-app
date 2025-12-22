import { TrendingUp, TrendingDown } from 'lucide-react'

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

export default function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Fortalezas */}
      <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-xl p-6 border-2 border-green-600">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-300" />
          <h3 className="text-2xl font-bold text-white">Fortalezas</h3>
        </div>
        {strengths.length === 0 ? (
          <p className="text-green-200">Analizando tu carta...</p>
        ) : (
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-green-100">
                <span className="text-green-400 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Áreas de Crecimiento */}
      <div className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl p-6 border-2 border-blue-500">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-300 rotate-180" />
          <h3 className="text-2xl font-bold text-white">Áreas de Crecimiento</h3>
        </div>
        {weaknesses.length === 0 ? (
          <p className="text-blue-200">Tu carta está muy equilibrada. ¡Sigue cultivando tus fortalezas!</p>
        ) : (
          <ul className="space-y-3">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3 text-blue-100 bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                <span className="text-blue-300 mt-1 text-xl">🌱</span>
                <span className="flex-1">{weakness}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

