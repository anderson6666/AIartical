import { create } from 'zustand'

export interface HistoryItem {
  id: string
  topic: string
  style: string
  content: string
  createdAt: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AppStore {
  apiKey: string
  setApiKey: (key: string) => void
  currentTopic: string
  setCurrentTopic: (topic: string) => void
  currentStyle: string
  setCurrentStyle: (style: string) => void
  // 多轮对话
  messages: ChatMessage[]
  setMessages: (msgs: ChatMessage[]) => void
  addMessage: (msg: ChatMessage) => void
  appendLastAssistant: (chunk: string) => void
  clearMessages: () => void
  flushMessages: () => void
  // 生成状态
  isGenerating: boolean
  setIsGenerating: (val: boolean) => void
  // 历史
  history: HistoryItem[]
  addHistory: (item: HistoryItem) => void
  removeHistory: (id: string) => void
  clearHistory: () => void
  showHistory: boolean
  setShowHistory: (val: boolean) => void
}

const loadHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem('solochat_history')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveHistory = (items: HistoryItem[]) => {
  localStorage.setItem('solochat_history', JSON.stringify(items))
}

const loadMessages = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem('solochat_messages')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveMessages = (msgs: ChatMessage[]) => {
  localStorage.setItem('solochat_messages', JSON.stringify(msgs))
}

export const useAppStore = create<AppStore>((set, get) => ({
  apiKey: localStorage.getItem('solochat_apikey') || '',
  setApiKey: (key: string) => {
    localStorage.setItem('solochat_apikey', key)
    set({ apiKey: key })
  },
  currentTopic: localStorage.getItem('solochat_topic') || '',
  setCurrentTopic: (topic: string) => {
    localStorage.setItem('solochat_topic', topic)
    set({ currentTopic: topic })
  },
  currentStyle: localStorage.getItem('solochat_style') || 'podcast',
  setCurrentStyle: (style: string) => {
    localStorage.setItem('solochat_style', style)
    set({ currentStyle: style })
  },
  // 多轮对话
  messages: loadMessages(),
  setMessages: (msgs: ChatMessage[]) => {
    saveMessages(msgs)
    set({ messages: msgs })
  },
  addMessage: (msg: ChatMessage) => {
    const newMsgs = [...get().messages, msg]
    saveMessages(newMsgs)
    set({ messages: newMsgs })
  },
  // 流式追加——只更新内存，不写localStorage（避免卡顿）
  appendLastAssistant: (chunk: string) => {
    const msgs = [...get().messages]
    if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
      msgs[msgs.length - 1] = {
        ...msgs[msgs.length - 1],
        content: msgs[msgs.length - 1].content + chunk,
      }
    }
    set({ messages: msgs })
  },
  // 流结束后调用，把内存中的消息持久化到localStorage
  flushMessages: () => {
    saveMessages(get().messages)
  },
  clearMessages: () => {
    saveMessages([])
    set({ messages: [] })
  },
  // 生成状态
  isGenerating: false,
  setIsGenerating: (val: boolean) => set({ isGenerating: val }),
  // 历史
  history: loadHistory(),
  addHistory: (item: HistoryItem) => {
    const newHistory = [item, ...get().history].slice(0, 50)
    saveHistory(newHistory)
    set({ history: newHistory })
  },
  removeHistory: (id: string) => {
    const newHistory = get().history.filter((h) => h.id !== id)
    saveHistory(newHistory)
    set({ history: newHistory })
  },
  clearHistory: () => {
    saveHistory([])
    set({ history: [] })
  },
  showHistory: false,
  setShowHistory: (val: boolean) => set({ showHistory: val }),
}))
