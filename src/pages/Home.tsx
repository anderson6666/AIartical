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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/70 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-xl mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#ff6b35] to-[#e85d2a] flex items-center justify-center">
              <span className="text-[8px] font-black text-[#08080c]">I</span>
            </div>
            <span className="font-display text-sm font-bold tracking-wide">即兴说</span>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="relative p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-[var(--accent)] text-[8px] text-[#08080c] flex items-center justify-center font-bold px-1">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-xl mx-auto px-4 pt-14 pb-12 space-y-5">
        <HeroSection />
        <ApiKeyInput />
        <TopicInput />
        <StyleSelector />
        <ArticleDisplay />
      </main>

      {/* 底部 */}
      <footer className="text-center py-6 space-y-1">
        <p className="text-[10px] text-[var(--text-secondary)] opacity-30 font-mono tracking-wider">
          IMPROMPTU · GLM-4-FLASH
        </p>
      </footer>

      {/* 历史记录面板 */}
      {showHistory && <HistoryPanel />}
    </div>
  )
}
