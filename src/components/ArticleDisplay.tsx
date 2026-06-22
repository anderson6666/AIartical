import { useRef, useCallback, useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { streamGenerate } from '@/utils/api'
import { Mic, Square, Copy, Check, RotateCcw, Trash2 } from 'lucide-react'

export default function ArticleDisplay() {
  const {
    apiKey,
    currentTopic,
    currentStyle,
    generatedContent,
    setGeneratedContent,
    appendContent,
    isGenerating,
    setIsGenerating,
    addHistory,
  } = useAppStore()

  const abortRef = useRef<AbortController | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // 自动滚动到底部
  useEffect(() => {
    if (contentRef.current && (isGenerating || generatedContent)) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [generatedContent, isGenerating])

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !currentTopic.trim()) return

    setGeneratedContent('')
    setIsGenerating(true)
    abortRef.current = new AbortController()

    streamGenerate(
      apiKey,
      currentTopic.trim(),
      currentStyle,
      (chunk) => appendContent(chunk),
      () => {
        setIsGenerating(false)
        const finalContent = useAppStore.getState().generatedContent
        if (finalContent) {
          addHistory({
            id: Date.now().toString(),
            topic: currentTopic.trim(),
            style: currentStyle,
            content: finalContent,
            createdAt: Date.now(),
          })
        }
      },
      (err) => {
        setIsGenerating(false)
        console.error('生成失败:', err)
      },
      abortRef.current.signal,
    )
  }, [apiKey, currentTopic, currentStyle, setGeneratedContent, appendContent, setIsGenerating, addHistory])

  const handleStop = () => {
    abortRef.current?.abort()
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (!generatedContent) return
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = generatedContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const canGenerate = apiKey.length > 0 && currentTopic.trim().length > 0 && !isGenerating

  return (
    <div className="max-w-xl mx-auto w-full space-y-4">
      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`btn-primary w-full py-4 text-base flex items-center justify-center gap-2 ${
          !canGenerate ? 'opacity-40' : ''
        }`}
      >
        {isGenerating ? (
          <>
            <Square className="w-4 h-4" onClick={(e) => { e.stopPropagation(); handleStop() }} />
            正在说话... 点击停止
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            开始即兴说
          </>
        )}
      </button>

      {/* 文章展示区 */}
      {(generatedContent || isGenerating) && (
        <div className="card p-5 md:p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-display text-lg font-bold">{currentTopic}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {useAppStore.getState().history.find(h =>
                  h.topic === currentTopic &&
                  h.style === currentStyle
                )?.style || currentStyle} 风格
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                title="复制"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              {!isGenerating && (
                <button
                  onClick={handleRegenerate}
                  className="p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  title="重新生成"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div
            ref={contentRef}
            className={`max-h-[480px] overflow-y-auto text-[var(--text-primary)] text-sm md:text-base leading-loose whitespace-pre-wrap ${
              isGenerating ? 'typewriter-cursor' : ''
            }`}
          >
            {generatedContent || (
              <span className="text-[var(--text-secondary)] italic">等待AI开始说话...</span>
            )}
          </div>

          {generatedContent && !isGenerating && (
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
              <span className="text-xs text-[var(--text-secondary)] opacity-50">
                {generatedContent.length} 字
              </span>
            </div>
          )}
        </div>
      )}

      {/* 提示信息 */}
      {!apiKey && (
        <p className="text-center text-xs text-[var(--text-secondary)] opacity-50">
          请先输入 API Key 才能使用
        </p>
      )}
      {apiKey && !currentTopic.trim() && (
        <p className="text-center text-xs text-[var(--text-secondary)] opacity-50">
          输入一个话题，然后点击按钮开始
        </p>
      )}
    </div>
  )
}
