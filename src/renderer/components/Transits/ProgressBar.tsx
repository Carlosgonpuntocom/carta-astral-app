import { cn } from '../../lib/utils'

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'orange'
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const colorClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500'
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

export default function ProgressBar({
  label,
  value,
  max,
  color = 'blue',
  showValue = true,
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm font-bold text-gray-900">
            {value.toFixed(1)}/{max}
          </span>
        )}
      </div>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            colorClasses[color],
            "h-full rounded-full transition-all duration-500",
            animated && "ease-out"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

