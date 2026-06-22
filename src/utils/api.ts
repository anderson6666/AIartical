import { buildSystemPrompt } from './prompt'

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export interface ChatMessageApi {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function streamGenerate(
  apiKey: string,
  style: string,
  messages: ChatMessageApi[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  signal?: AbortSignal,
) {
  const systemPrompt = buildSystemPrompt(style)

  const apiMessages: ChatMessageApi[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: apiMessages,
        stream: true,
        max_tokens: 30000,
        temperature: 1.0,
        top_p: 0.9,
      }),
      signal,
    })

    if (!response.ok) {
      const errText = await response.text()
      let errMsg = `请求失败 (${response.status})`
      try {
        const errJson = JSON.parse(errText)
        errMsg = errJson.error?.message || errMsg
      } catch {
        // ignore parse error
      }
      onError(errMsg)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('无法读取响应流')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))
          const content = json.choices?.[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
        } catch {
          // skip malformed JSON
        }
      }
    }

    onDone()
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      onDone()
      return
    }
    onError(err instanceof Error ? err.message : '未知错误')
  }
}
