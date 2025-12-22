import { useMemo } from 'react'
import type { ChartData } from '../../types/astrology'
import {
  calculateElements,
  calculateModalities,
  calculateRPGStats,
  calculateRadarData,
  calculateBadges,
  calculateStrengthsWeaknesses
} from '../../lib/astrology/chart-game-calculator'
import ElementBars from './ElementBars'
import ModalityBars from './ModalityBars'
import RPGStatsPanel from './RPGStatsPanel'
import BadgesGrid from './BadgesGrid'
import RadarChart from './RadarChart'
import StrengthsWeaknesses from './StrengthsWeaknesses'
import CollapsibleSection from '../CollapsibleSection'

interface ChartGameViewProps {
  chartData: ChartData
}

export default function ChartGameView({ chartData }: ChartGameViewProps) {
  const elements = useMemo(() => calculateElements(chartData), [chartData])
  const modalities = useMemo(() => calculateModalities(chartData), [chartData])
  const stats = useMemo(() => calculateRPGStats(chartData), [chartData])
  const radarData = useMemo(() => calculateRadarData(chartData), [chartData])
  const badges = useMemo(() => calculateBadges(chartData), [chartData])
  const { strengths, weaknesses } = useMemo(() => calculateStrengthsWeaknesses(chartData), [chartData])

  return (
    <div className="space-y-6">
      {/* Stats RPG */}
      <CollapsibleSection
        title="Stats RPG"
        defaultExpanded={true}
      >
        <RPGStatsPanel stats={stats} />
      </CollapsibleSection>

      {/* Gráfico Radar */}
      <CollapsibleSection
        title="Gráfico Radar"
        defaultExpanded={true}
      >
        <RadarChart data={radarData} />
      </CollapsibleSection>

      {/* Elementos y Modalidades en grid */}
      <CollapsibleSection
        title="Elementos y Modalidades"
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-4">
          <ElementBars elements={elements} />
          <ModalityBars modalities={modalities} />
        </div>
      </CollapsibleSection>

      {/* Badges */}
      <CollapsibleSection
        title="Badges"
        defaultExpanded={true}
      >
        <BadgesGrid badges={badges} />
      </CollapsibleSection>

      {/* Fortalezas y Debilidades */}
      <CollapsibleSection
        title="Fortalezas y Debilidades"
        defaultExpanded={true}
      >
        <StrengthsWeaknesses strengths={strengths} weaknesses={weaknesses} />
      </CollapsibleSection>
    </div>
  )
}

