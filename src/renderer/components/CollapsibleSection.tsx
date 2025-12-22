import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string | ReactNode
  children: ReactNode
  defaultExpanded?: boolean
  icon?: ReactNode
  className?: string
  titleClassName?: string
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  icon,
  className = '',
  titleClassName = ''
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${titleClassName}`}
      >
        <div className="flex items-center gap-2">
          {icon}
          {typeof title === 'string' ? (
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}
