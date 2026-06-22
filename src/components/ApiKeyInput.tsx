import { useState } from 'react'
import { KeyRound, Eye, EyeOff, Check, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { verifyApiKey } from '@/utils/api'

type VerifyState = 'idle' | 'verifying' | 'valid' | 'invalid'

export default function ApiKeyInput() {
  const { apiKey, setApiKey } = useAppStore()
  const [showKey, setShowKey] = useState(false)
  const [inputValue, setInputValue] = useState(apiKey)
  const [verifyState, setVerifyState] = useState<VerifyState>(
    apiKey ? 'idle' : 'idle'
  )
  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async () => {
    const key = inputValue.trim()
    if (!key) return

    setVerifyState('verifying')
    setErrorMsg('')

    const result = await verifyApiKey(key)

    if (result.valid) {
      setApiKey(key)
      setVerifyState('valid')
    } else {
      setVerifyState('invalid')
      setErrorMsg(result.message)
    }
  }

  // 输入变化时重置验证状态
  const handleChange = (val: string) => {
    setInputValue(val)
    if (verifyState !== 'idle') {
      setVerifyState('idle')
      setErrorMsg('')
    }
  }

  const isSaved = inputValue.trim() === apiKey && apiKey.length > 0 && verifyState === 'valid'

  return (
    <div className="card p-4 md:p-5 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="label-tag !mb-0">
          <KeyRound className="w-3.5 h-3.5" />
          <span>API Key</span>
          {verifyState === 'valid' && (
            <span className="text-[var(--accent-secondary)] text-[10px] font-mono ml-1">VERIFIED</span>
          )}
        </label>
        <a
          href="https://open.bigmodel.cn/apikey/platform"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent)] hover:text-[var(--accent-secondary)] transition-colors tracking-wider"
        >
          <ExternalLink className="w-3 h-3" />
          获取 Key
        </a>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="输入你的智谱API Key..."
            className={`input-field pr-10 ${
              verifyState === 'invalid' ? '!border-red-500/50 focus:!border-red-500 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''
            } ${
              verifyState === 'valid' ? '!border-[var(--accent-secondary)]/30 focus:!border-[var(--accent-secondary)]' : ''
            }`}
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
          disabled={!inputValue.trim() || verifyState === 'verifying'}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            isSaved
              ? 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/20'
              : verifyState === 'invalid'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
              : 'btn-primary'
          }`}
        >
          {verifyState === 'verifying' ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              验证中
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              已验证
            </span>
          ) : verifyState === 'invalid' ? (
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              重试
            </span>
          ) : '验证'}
        </button>
      </div>
      {verifyState === 'invalid' && errorMsg && (
        <p className="text-[10px] text-red-400 mt-2 font-mono flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errorMsg}
        </p>
      )}
      <p className="text-[10px] text-[var(--text-secondary)] opacity-40 mt-2 font-mono">
        LOCAL STORAGE ONLY · NO UPLOAD
      </p>
    </div>
  )
}
