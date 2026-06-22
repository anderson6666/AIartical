import { useRef, useCallback, useEffect, useState } from 'react'
import { useAppStore, type ChatMessage } from '@/store/useAppStore'
import { streamGenerate, type ChatMessageApi } from '@/utils/api'
import { Mic, Square, Copy, Check, RotateCcw, Send, Trash2 } from 'lucide-react'

export default function ArticleDisplay() {
  const {
    apiKey,
    currentTopic,
    currentStyle,
    messages,
    addMessage,
    appendLastAssistant,
    clearMessages,
    isGenerating,
    setIsGenerating,
    addHistory,
  } = useAppStore()

  const abortRef = useRef<AbortController | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [followUp, setFollowUp] = useState('')

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 拼接所有助手消息为完整文本（用于复制和保存历史）
  const fullAssistantText = messages
    .filter((m) => m.role === 'assistant')
    .join('\n\n')

  const handleStart = useCallback(async () => {
    if (!apiKey || !currentTopic.trim()) return

    // 清空之前的对话，开始新话题
    clearMessages()
    const userMsg: ChatMessage = { role: 'user', content: currentTopic.trim() }
    addMessage(userMsg)
    addMessage({ role: 'assistant', content: '' })

    setIsGenerating(true)
    abortRef.current = new AbortController()

    const apiMessages: ChatMessageApi[] = [{ role: 'user', content: currentTopic.trim() }]

    streamGenerate(
      apiKey,
      currentStyle,
      apiMessages,
      (chunk) => appendLastAssistant(chunk),
      () => {
        setIsGenerating(false)
        const allMsgs = useAppStore.getState().messages
        const assistantText = allMsgs
          .filter((m) => m.role === 'assistant')
          .join('\n\n')
        if (assistantText) {
          addHistory({
            id: Date.now().toString(),
            topic: currentTopic.trim(),
            style: currentStyle,
            content: assistantText,
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
  }, [apiKey, currentTopic, currentStyle, clearMessages, addMessage, appendLastAssistant, setIsGenerating, addHistory])

  const handleFollowUp = useCallback(async () => {
    if (!apiKey || !followUp.trim() || isGenerating) return

    const userMsg: ChatMessage = { role: 'user', content: followUp.trim() }
    addMessage(userMsg)
    addMessage({ role: 'assistant', content: '' })
    setFollowUp('')
    setIsGenerating(true)
    abortRef.current = new AbortController()

    // 构建完整的对话历史发给API
    const allMsgs = useAppStore.getState().messages
    const apiMessages: ChatMessageApi[] = allMsgs
      .filter((m) => m.content.length > 0) // 过滤掉空的assistant消息
      .map((m) => ({ role: m.role, content: m.content }))

    streamGenerate(
      apiKey,
      currentStyle,
      apiMessages,
      (chunk) => appendLastAssistant(chunk),
      () => {
        setIsGenerating(false)
        // 更新历史
        const updatedMsgs = useAppStore.getState().messages
        const assistantText = updatedMsgs
          .filter((m) => m.role === 'assistant')
          .join('\n\n')
        if (assistantText) {
          addHistory({
            id: Date.now().toString(),
            topic: currentTopic.trim(),
            style: currentStyle,
            content: assistantText,
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
  }, [apiKey, followUp, isGenerating, currentStyle, currentTopic, addMessage, appendLastAssistant, setIsGenerating, addHistory])

  const handleStop = () => {
    abortRef.current?.abort()
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (!fullAssistantText) return
    try {
      await navigator.clipboard.writeText(fullAssistantText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = fullAssistantText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowUp()
    }
  }

  const canStart = apiKey.length > 0 && currentTopic.trim().length > 0 && !isGenerating
  const hasConversation = messages.length > 0

  return (
    <div className="max-w-xl mx-auto w-full space-y-4">
      {/* 开始按钮 */}
      {!hasConversation && (
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`btn-primary w-full py-4 text-base flex items-center justify-center gap-2 ${
            !canStart ? 'opacity-40' : ''
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
      )}

      {/* 对话区域 */}
      {hasConversation && (
        <div className="card animate-fade-in-up flex flex-col" style={{ minHeight: '300px' }}>
          {/* 头部 */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold">{currentTopic}</span>
              <span className="text-xs text-[var(--text-secondary)] opacity-60">
                {messages.filter((m) => m.role === 'user').length} 轮对话
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                title="复制全文"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  clearMessages()
                }}
                className="p-2 rounded-lg hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                title="清空对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[520px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="bg-[var(--accent-dim)] border border-[var(--accent)]/20 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className={`text-sm md:text-base leading-loose whitespace-pre-wrap text-[var(--text-primary)] ${
                    idx === messages.length - 1 && isGenerating && !msg.content ? '' : ''
                  } ${idx === messages.length - 1 && isGenerating ? 'typewriter-cursor' : ''}`}>
                    {msg.content || (
                      <span className="text-[var(--text-secondary)] italic text-xs">正在组织语言...</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* 底部统计 */}
          {fullAssistantText && !isGenerating && (
            <div className="px-5 py-2 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-xs text-[var(--text-secondary)] opacity-50">
                {fullAssistantText.length} 字
              </span>
              <button
                onClick={handleStart}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                重新开始
              </button>
            </div>
          )}

          {/* 跟进输入 */}
          <div className="px-4 py-3 border-t border-[var(--border)]">
            <div className="flex gap-2">
              <textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isGenerating ? '等它说完...' : '继续聊点什么...'}
                disabled={isGenerating}
                rows={1}
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-40"
              />
              <button
                onClick={handleFollowUp}
                disabled={isGenerating || !followUp.trim()}
                className="btn-primary px-4 py-2.5 flex items-center gap-1.5 disabled:opacity-40"
              >
                {isGenerating ? (
                  <Square className="w-4 h-4" onClick={(e) => { e.stopPropagation(); handleStop() }} />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {!apiKey && (
        <p className="text-center text-xs text-[var(--text-secondary)] opacity-50">
          请先输入 API Key 才能使用
        </p>
      )}
      {apiKey && !currentTopic.trim() && !hasConversation && (
        <p className="text-center text-xs text-[var(--text-secondary)] opacity-50">
          输入一个话题，然后点击按钮开始
        </p>
      )}
    </div>
  )
}
