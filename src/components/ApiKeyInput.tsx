import { useState } from 'react'
import { KeyRound, Eye, EyeOff, Check } from 'lucide-react'
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
      <label className="label-tag">
        <KeyRound className="w-3.5 h-3.5" />
        <span>API Key</span>
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的智谱API Key..."
            className="input-field pr-10"
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
              ? 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/20'
              : 'btn-primary'
          }`}
        >
          {isSaved ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              已保存
            </span>
          ) : '保存'}
        </button>
      </div>
      <p className="text-[10px] text-[var(--text-secondary)] opacity-40 mt-2 font-mono">
        LOCAL STORAGE ONLY · NO UPLOAD
      </p>
    </div>
  )
}
