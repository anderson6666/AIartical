import { useState } from 'react'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export default function ApiKeyInput() {
  const { apiKey, setApiKey } = useAppStore()
  const [showKey, setShowKey] = useState(false)
  const [inputValue, setInputValue] = useState(apiKey)

  const handleSave = () => {
    setApiKey(inputValue.trim())
  }

  const isSaved = inputValue.trim() === apiKey && apiKey.length > 0

  return (
    <div className="card p-4 md:p-5 max-w-xl mx-auto w-full">
      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
        <KeyRound className="w-4 h-4" />
        智谱 API Key
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的智谱API Key..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            isSaved
              ? 'bg-green-900/30 text-green-400 border border-green-800/50'
              : 'btn-primary'
          }`}
        >
          {isSaved ? '已保存' : '保存'}
        </button>
      </div>
      <p className="text-xs text-[var(--text-secondary)] opacity-50 mt-2">
        仅存储在本地浏览器中，不会上传到任何服务器
      </p>
    </div>
  )
}
