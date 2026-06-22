/**
 * 流式引号转换器
 * 在输出层面把 "" 和 "" 强制转换为 「」，不再依赖 Prompt 约束 AI
 *
 * 用法：
 *   const processor = new QuoteProcessor()
 *   const processed = processor.process(chunk)  // 每个流式 chunk
 *   const final = QuoteProcessor.cleanup(fullText)  // 生成结束后清理
 */
export class QuoteProcessor {
  /** 追踪直引号 " 的开/关状态 */
  private straightOpen = false

  /**
   * 处理单个流式 chunk，逐字符替换引号
   * - " → 交替替换为 「 和 」
   * - " (U+201C) → 「
   * - " (U+201D) → 」
   * - ' (U+2018) → 『（单引号左）
   * - ' (U+2019) → 』（单引号右）
   */
  process(chunk: string): string {
    let result = ''
    for (const char of chunk) {
      if (char === '"') {
        // 直双引号：交替替换
        result += this.straightOpen ? '」' : '「'
        this.straightOpen = !this.straightOpen
      } else if (char === '\u201C') {
        // 左弯引号 "
        result += '「'
        this.straightOpen = false // 重置状态，因为弯引号自带方向
      } else if (char === '\u201D') {
        // 右弯引号 "
        result += '」'
        this.straightOpen = false
      } else if (char === '\u2018') {
        // 左单弯引号 '
        result += '『'
      } else if (char === '\u2019') {
        // 右单弯引号 '
        result += '』'
      } else {
        result += char
      }
    }
    return result
  }

  /**
   * 生成结束后的最终清理
   * - 移除空的 「」
   * - 修复不配对的引号（落单的 「 或 」）
   */
  static cleanup(text: string): string {
    // 移除空的 「」
    let result = text.replace(/「」/g, '')

    // 修复落单的 「 没有配对 」 的情况：在句末补上 」
    // 简单策略：如果最后一个 「 没有对应的 」，补上
    let openCount = 0
    let lastOpenIdx = -1
    for (let i = 0; i < result.length; i++) {
      if (result[i] === '「') {
        openCount++
        lastOpenIdx = i
      } else if (result[i] === '」') {
        openCount--
      }
    }
    // 如果有多余的 「，在最后一个 「 后面找最近的合适位置补 」
    if (openCount > 0 && lastOpenIdx >= 0) {
      // 在最后一个 「 后面找第一个标点或空格位置补上 」
      const afterOpen = result.slice(lastOpenIdx + 1)
      const match = afterOpen.match(/[，。！？、；：\s…—]/)
      if (match && match.index !== undefined) {
        const insertPos = lastOpenIdx + 1 + match.index
        result = result.slice(0, insertPos) + '」' + result.slice(insertPos)
      } else {
        // 没找到标点，直接在末尾补
        result += '」'
      }
    }

    return result
  }

  /** 重置状态（新一轮生成时调用） */
  reset(): void {
    this.straightOpen = false
  }
}
