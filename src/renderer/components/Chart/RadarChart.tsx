import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { RadarData } from '../../lib/astrology/chart-game-calculator'

interface RadarChartProps {
  data: RadarData
}

export default function RadarChart({ data }: RadarChartProps) {
  // Convertir datos al formato que recharts espera
  const chartData = data.labels.map((label, index) => ({
    attribute: label,
    value: data.values[index],
    fullMark: 10
  }))

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">⭐</span>
        Perfil de Atributos
      </h3>

      <div className="w-full h-96 min-h-[384px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={384}>
          <RechartsRadarChart data={chartData}>
            <PolarGrid stroke="#4B5563" />
            <PolarAngleAxis
              dataKey="attribute"
              tick={{ fill: '#E5E7EB', fontSize: 12, fontWeight: 'bold' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Radar
              name="Atributos"
              dataKey="value"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda de valores */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {data.labels.map((label, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-2">
            <span className="text-gray-300">{label}</span>
            <span className="text-purple-400 font-bold">{data.values[index].toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

