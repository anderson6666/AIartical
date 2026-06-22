import { History } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import ApiKeyInput from '@/components/ApiKeyInput'
import TopicInput from '@/components/TopicInput'
import StyleSelector from '@/components/StyleSelector'
import ArticleDisplay from '@/components/ArticleDisplay'
import HistoryPanel from '@/components/HistoryPanel'
import { useAppStore } from '@/store/useAppStore'

export default function Home() {
  const { showHistory, setShowHistory, history } = useAppStore()

  return (
    <div className="min-h-screen relative">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-wide">即兴说</span>
          <button
            onClick={() => setShowHistory(true)}
            className="relative p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[9px] text-[var(--bg-primary)] flex items-center justify-center font-bold">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-xl mx-auto px-4 pt-16 pb-12 space-y-6">
        <HeroSection />
        <ApiKeyInput />
        <TopicInput />
        <StyleSelector />
        <ArticleDisplay />
      </main>

      {/* 底部 */}
      <footer className="text-center py-6 text-xs text-[var(--text-secondary)] opacity-30">
        即兴说 · Impromptu — Powered by GLM-4-Flash
      </footer>

      {/* 历史记录面板 */}
      {showHistory && <HistoryPanel />}
    </div>
  )
}
