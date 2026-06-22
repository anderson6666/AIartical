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
    const data = localStorage.getItem('impromptu_history')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveHistory = (items: HistoryItem[]) => {
  localStorage.setItem('impromptu_history', JSON.stringify(items))
}

export const useAppStore = create<AppStore>((set, get) => ({
  apiKey: localStorage.getItem('impromptu_apikey') || '',
  setApiKey: (key: string) => {
    localStorage.setItem('impromptu_apikey', key)
    set({ apiKey: key })
  },
  currentTopic: '',
  setCurrentTopic: (topic: string) => set({ currentTopic: topic }),
  currentStyle: 'podcast',
  setCurrentStyle: (style: string) => set({ currentStyle: style }),
  // 多轮对话
  messages: [],
  setMessages: (msgs: ChatMessage[]) => set({ messages: msgs }),
  addMessage: (msg: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  appendLastAssistant: (chunk: string) =>
    set((state) => {
      const msgs = [...state.messages]
      if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content: msgs[msgs.length - 1].content + chunk,
        }
      }
      return { messages: msgs }
    }),
  clearMessages: () => set({ messages: [] }),
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
