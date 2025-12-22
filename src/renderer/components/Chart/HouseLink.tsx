import { useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import { getHouseTextColor, getHouseLinkClasses } from '../../lib/utils/planet-colors'
import HouseGuide from './HouseGuide'

interface HouseLinkProps {
  houseNumber: number
  className?: string
  showIcon?: boolean
}

export default function HouseLink({ houseNumber, className = '', showIcon = true }: HouseLinkProps) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className={`inline-flex items-center gap-1 hover:underline ${getHouseLinkClasses(houseNumber, className)}`}
        title={`Haz clic para aprender sobre la Casa ${houseNumber}`}
      >
        {showIcon && <BookOpen className="w-3 h-3" />}
        Casa {houseNumber}
      </button>

      {/* Modal con la guía */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Guía de Casas Astrológicas</h2>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <HouseGuide selectedHouse={houseNumber} onClose={() => setShowGuide(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}





