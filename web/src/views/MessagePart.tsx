import { useRef, useState, type ComponentPropsWithoutRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { MessagePart as MessagePartType } from "../types"
import { normalizeMessageMarkdown, toolCallSummary } from "../utils"

type Translator = (key: string, params?: Record<string, string | number>) => string

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    // Clipboard API unavailable (insecure context): fall through to the legacy path.
  }
  const area = document.createElement("textarea")
  area.value = text
  area.style.position = "fixed"
  area.style.opacity = "0"
  document.body.appendChild(area)
  area.select()
  try {
    document.execCommand("copy")
  } finally {
    document.body.removeChild(area)
  }
}

function PreWithCopy({ t, ...props }: ComponentPropsWithoutRef<"pre"> & { t: Translator }) {
  const preRef = useRef<HTMLPreElement | null>(null)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const text = preRef.current?.textContent ?? ""
    copyText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => undefined)
  }

  return (
    <div className="codeblock">
      <button type="button" className="copy-btn" onClick={copy}>
        {copied ? t('detail.copied') : t('detail.copy')}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  )
}

export function MessagePart({ part, t }: { part: MessagePartType; t: Translator }) {
  if (part.type === "text" && part.text) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: (props) => <PreWithCopy t={t} {...props} />
        }}
      >
        {normalizeMessageMarkdown(part.text)}
      </ReactMarkdown>
    )
  }

  if (part.type === "reasoning" && part.text) {
    return (
      <details className="reasoning-part">
        <summary>💭 {t('detail.reasoning')}</summary>
        <div className="reasoning-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {part.text}
          </ReactMarkdown>
        </div>
      </details>
    )
  }

  if (part.type === "tool") {
    const status = part.state?.status ?? "pending"
    const summary = toolCallSummary(part)
    return (
      <div className={`tool-part ${status}`}>
        <div className="tool-part-header">
          <span className="tool-part-name">🔧 {part.tool}</span>
          <span className={`pill ${status}`}>{status}</span>
        </div>
        {summary && <p className="tool-part-summary">{summary}</p>}
        {part.state?.error && <p className="tool-part-error">{part.state.error}</p>}
      </div>
    )
  }

  return null
}
