import { useAppStore } from '@/store/useAppStore'
import { PenLine } from 'lucide-react'

export default function TopicInput() {
  const { currentTopic, setCurrentTopic } = useAppStore()

  return (
    <div className="card p-4 md:p-5 max-w-xl mx-auto w-full">
      <label className="label-tag">
        <PenLine className="w-3.5 h-3.5" />
        <span>话题</span>
      </label>
      <textarea
        value={currentTopic}
        onChange={(e) => setCurrentTopic(e.target.value)}
        placeholder="比如：为什么现在的年轻人都不爱打电话了？或者随便什么你想聊的..."
        rows={3}
        maxLength={500}
        className="input-field leading-relaxed"
      />
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[10px] text-[var(--text-secondary)] opacity-30 font-mono">
          TOPIC
        </span>
        <span className="text-[10px] text-[var(--text-secondary)] opacity-40 font-mono">
          {currentTopic.length}/500
        </span>
      </div>
    </div>
  )
}
