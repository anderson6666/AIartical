import { useAppStore } from '@/store/useAppStore'
import { PenLine } from 'lucide-react'

export default function TopicInput() {
  const { currentTopic, setCurrentTopic } = useAppStore()

  return (
    <div className="card p-4 md:p-5 max-w-xl mx-auto w-full">
      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
        <PenLine className="w-4 h-4" />
        想聊什么话题？
      </label>
      <textarea
        value={currentTopic}
        onChange={(e) => setCurrentTopic(e.target.value)}
        placeholder="比如：为什么现在的年轻人都不爱打电话了？或者随便什么你想聊的..."
        rows={3}
        maxLength={500}
        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors leading-relaxed"
      />
      <div className="flex justify-end mt-1">
        <span className="text-xs text-[var(--text-secondary)] opacity-40">
          {currentTopic.length}/500
        </span>
      </div>
    </div>
  )
}
