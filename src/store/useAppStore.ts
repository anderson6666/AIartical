import { create } from 'zustand'

export interface HistoryItem {
  id: string
  topic: string
  style: string
  content: string
  createdAt: number
}

interface AppStore {
  apiKey: string
  setApiKey: (key: string) => void
  currentTopic: string
  setCurrentTopic: (topic: string) => void
  currentStyle: string
  setCurrentStyle: (style: string) => void
  generatedContent: string
  setGeneratedContent: (content: string) => void
  appendContent: (chunk: string) => void
  isGenerating: boolean
  setIsGenerating: (val: boolean) => void
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
  generatedContent: '',
  setGeneratedContent: (content: string) => set({ generatedContent: content }),
  appendContent: (chunk: string) =>
    set((state) => ({ generatedContent: state.generatedContent + chunk })),
  isGenerating: false,
  setIsGenerating: (val: boolean) => set({ isGenerating: val }),
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
