interface DurationTimelineProps {
  start: Date
  end: Date
  current: Date
}

export default function DurationTimeline({ start, end, current }: DurationTimelineProps) {
  const totalDuration = end.getTime() - start.getTime()
  const elapsed = current.getTime() - start.getTime()
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const daysRemaining = Math.ceil((end.getTime() - current.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Inicio: {formatDate(start)}</span>
        <span className={daysRemaining > 0 ? 'text-orange-600 font-semibold' : 'text-gray-500'}>
          {daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Finalizado'}
        </span>
        <span>Fin: {formatDate(end)}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

