import { STYLE_CONFIG, STYLE_KEYS } from '@/utils/prompt'
import { useAppStore } from '@/store/useAppStore'
import { Laugh, Presentation, Headphones, GraduationCap, MessageCircle } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  laugh: Laugh,
  presentation: Presentation,
  headphones: Headphones,
  'graduation-cap': GraduationCap,
  'message-circle': MessageCircle,
}

export default function StyleSelector() {
  const { currentStyle, setCurrentStyle } = useAppStore()

  return (
    <div className="max-w-xl mx-auto w-full">
      <p className="label-tag px-1">
        <span>风格</span>
      </p>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {STYLE_KEYS.map((key) => {
          const config = STYLE_CONFIG[key]
          const IconComp = iconMap[config.icon]
          const isActive = currentStyle === key

          return (
            <button
              key={key}
              onClick={() => setCurrentStyle(key)}
              className={`style-card !p-3 md:!p-4 ${isActive ? 'active' : ''}`}
            >
              {IconComp && (
                <IconComp className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1.5 md:mb-2 transition-colors ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                }`} />
              )}
              <span className={`text-xs md:text-sm font-medium block ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
              }`}>
                {config.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
