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
      <p className="text-sm text-[var(--text-secondary)] mb-3 px-1">选择演讲风格</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STYLE_KEYS.map((key) => {
          const config = STYLE_CONFIG[key]
          const IconComp = iconMap[config.icon]
          const isActive = currentStyle === key

          return (
            <button
              key={key}
              onClick={() => setCurrentStyle(key)}
              className={`style-card ${isActive ? 'active' : ''}`}
            >
              {IconComp && <IconComp className={`w-5 h-5 mx-auto mb-2 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />}
              <span className={`text-sm font-medium block ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {config.label}
              </span>
              <span className="text-xs text-[var(--text-secondary)] opacity-60 mt-1 block hidden sm:block">
                {config.desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
