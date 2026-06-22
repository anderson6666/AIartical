import { useAppStore } from '@/store/useAppStore'
import { History, X, Trash2, Clock } from 'lucide-react'

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

const styleLabelMap: Record<string, string> = {
  standup: '脱口秀',
  ted: 'TED演讲',
  podcast: '播客闲聊',
  lecture: '课堂讲授',
  chat: '朋友聊天',
}

export default function HistoryPanel() {
  const { history, showHistory, setShowHistory, removeHistory, clearHistory, setGeneratedContent } =
    useAppStore()

  if (!showHistory) return null

  return (
    <>
      {/* 移动端底部抽屉 */}
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--bg-card)] rounded-t-2xl max-h-[70vh] overflow-hidden animate-fade-in-up">
          {/* 拖动条 */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-[var(--text-secondary)] opacity-30" />
          </div>

          {/* 标题栏 */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 text-sm font-medium">
              <History className="w-4 h-4 text-[var(--accent)]" />
              历史记录 ({history.length})
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('确定清空所有历史记录？')) clearHistory()
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 列表 */}
          <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-center text-sm text-[var(--text-secondary)] py-8">
                还没有历史记录
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => {
                        setGeneratedContent(item.content)
                        setShowHistory(false)
                      }}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium text-sm line-clamp-2">{item.topic}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                          {styleLabelMap[item.style] || item.style}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)] opacity-60">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => removeHistory(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 桌面端侧边面板 */}
      <div className="hidden md:block fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[var(--bg-card)] border-l border-[var(--border)] animate-fade-in-up shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 text-sm font-medium">
              <History className="w-4 h-4 text-[var(--accent)]" />
              历史记录 ({history.length})
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('确定清空所有历史记录？')) clearHistory()
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-57px)] p-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-center text-sm text-[var(--text-secondary)] py-12">
                还没有历史记录
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 group hover:border-[var(--accent)]/30 transition-all cursor-pointer"
                  onClick={() => {
                    setGeneratedContent(item.content)
                    setShowHistory(false)
                  }}
                >
                  <p className="font-medium text-sm line-clamp-2 mb-2">{item.topic}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                        {styleLabelMap[item.style] || item.style}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)] opacity-60">
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeHistory(item.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
