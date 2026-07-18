import type {
  AgentOption,
  FileStatusEntry,
  MessageEnvelope,
  ModelOption,
  ModelSelection,
  PathInfo,
  ServerConfig,
  Session,
  SessionStatus,
  SessionView
} from "./types"

export const STORAGE_KEY = "opencode.remote.server"
export const LANGUAGE_STORAGE_KEY = "opencode.remote.language"
export const MODEL_STORAGE_KEY = "opencode.remote.model"
export const AGENT_STORAGE_KEY = "opencode.remote.agent"
export const THEME_STORAGE_KEY = "opencode.remote.theme"
export const NEW_SESSION_DIRECTORY_STORAGE_KEY = "opencode.remote.newSessionDirectory"

export const defaultConfig: ServerConfig = {
  host: "",
  port: 4096,
  username: "opencode",
  password: ""
}

export function formatTime(epoch: number): string {
  if (!epoch) return "-"
  return new Date(epoch).toLocaleString()
}

export function extractText(msg: MessageEnvelope): string {
  return msg.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n")
    .trim()
}

export function assistantPayloadLength(items: MessageEnvelope[]): number {
  return items
    .filter((message) => message.info.role !== "user")
    .reduce((sum, message) => sum + extractText(message).length, 0)
}

export function normalizeMessageMarkdown(text: string): string {
  return text.includes("\n") ? text : text.replace(/\s-\s(?=\S)/g, "\n- ")
}

export function toFileStatusList(input: FileStatusEntry[] | Record<string, FileStatusEntry>): FileStatusEntry[] {
  if (Array.isArray(input)) return input
  return Object.entries(input).map(([path, value]) => ({ path, ...value }))
}

export function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

export function summarizeJson(value: unknown): string {
  if (value === null || value === undefined) return "-"
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value)
  return JSON.stringify(value)
}

export function configKey(config: ServerConfig): string {
  return JSON.stringify({
    host: config.host.trim(),
    port: config.port,
    username: config.username.trim(),
    password: config.password
  })
}

export function canTestConfig(config: ServerConfig): boolean {
  return Boolean(config.host.trim() && config.port > 0 && config.username.trim())
}

// A host is "private" when traffic to it stays on a trusted network:
// loopback, RFC1918 LAN, mDNS .local, or Tailscale (CGNAT range / .ts.net over WireGuard).
export function isPrivateHost(rawHost: string): boolean {
  const clean = rawHost.trim().replace(/^(https?):\/\//, "").split(/[/:]/)[0].toLowerCase()
  if (!clean) return true
  if (clean === "localhost" || clean === "::1" || clean.endsWith(".local") || clean.endsWith(".ts.net")) return true
  const parts = clean.split(".")
  if (parts.length === 4 && parts.every((part) => /^\d+$/.test(part))) {
    const [a, b] = parts.map(Number)
    if (a === 127 || a === 10) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true
    return false
  }
  return false
}

// Plain HTTP to a non-private host sends the Basic-auth credentials in cleartext.
export function isInsecureHttpConfig(config: ServerConfig): boolean {
  const host = config.host.trim()
  if (!host) return false
  const schemeMatch = host.match(/^(https?):\/\//)
  const scheme = schemeMatch ? schemeMatch[1] : "http"
  return scheme === "http" && !isPrivateHost(host)
}

export function modelKey(model: ModelSelection): string {
  return [model.providerID, model.modelID, model.variant ?? ""].map(encodeURIComponent).join("|")
}

export function modelFromKey(value: string | null): ModelSelection | null {
  if (!value) return null
  const [providerID, modelID, variant] = value.split("|").map((part) => decodeURIComponent(part))
  if (!providerID || !modelID) return null
  return { providerID, modelID, variant: variant || undefined }
}

export function sameModel(a: ModelSelection | null | undefined, b: ModelSelection | null | undefined): boolean {
  return Boolean(a && b && a.providerID === b.providerID && a.modelID === b.modelID && (a.variant ?? "") === (b.variant ?? ""))
}

export function modelSearchText(option: ModelOption): string {
  return [option.modelName, option.modelID, option.providerName, option.providerID, option.variant ?? ""].join(" ").toLowerCase()
}

export function agentLabel(agent: AgentOption): string {
  return agent.name || agent.id
}

export function normalizeDirectory(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function isProjectDirectory(pathInfo: PathInfo): boolean {
  return pathInfo.worktree !== "/"
}

export function messageActivityTime(message: MessageEnvelope): number {
  return Math.max(message.info.time.created, message.info.time.completed ?? 0)
}

export function toSessionView(session: Session, status?: SessionStatus, activityTime = session.time.updated): SessionView {
  return {
    id: session.id,
    title: session.title,
    directory: session.directory,
    updated: activityTime,
    status: status?.type ?? "idle",
    files: session.summary?.files ?? 0,
    additions: session.summary?.additions ?? 0,
    deletions: session.summary?.deletions ?? 0,
    model: session.model ? { providerID: session.model.providerID, modelID: session.model.id, variant: session.model.variant } : undefined
  }
}

export function formatLimit(value?: number): string {
  if (!value) return "-"
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return String(value)
}

export function createOptimisticUserMessage(sessionID: string, text: string): MessageEnvelope {
  const now = Date.now()
  return {
    info: {
      id: `optimistic-${now}`,
      role: "user",
      sessionID,
      time: { created: now }
    },
    parts: [
      {
        id: `optimistic-part-${now}`,
        type: "text",
        text
      }
    ]
  }
}

export function createLocalAssistantMessage(sessionID: string, text: string): MessageEnvelope {
  const now = Date.now()
  return {
    info: {
      id: `local-assistant-${now}`,
      role: "assistant",
      sessionID,
      time: { created: now, completed: now }
    },
    parts: [
      {
        id: `local-assistant-part-${now}`,
        type: "text",
        text
      }
    ]
  }
}

export function hasMatchingUserMessage(messages: MessageEnvelope[], optimistic: MessageEnvelope): boolean {
  const text = extractText(optimistic)
  return messages.some((message) => (
    message.info.sessionID === optimistic.info.sessionID &&
    message.info.role === "user" &&
    extractText(message) === text
  ))
}

export function parentDirectory(path: string): string | null {
  if (!path || path === "/") return null
  const normalized = path.replace(/[/\\]+$/, "")
  const separator = normalized.includes("\\") ? "\\" : "/"
  const index = normalized.lastIndexOf(separator)
  if (index <= 0) return separator === "/" ? "/" : null
  return normalized.slice(0, index)
}

// A message is worth rendering when it carries visible content:
// text, reasoning, or a tool call.
export function hasRenderableContent(msg: MessageEnvelope): boolean {
  return msg.parts.some((part) =>
    (part.type === "text" && part.text?.trim()) ||
    (part.type === "reasoning" && part.text?.trim()) ||
    part.type === "tool"
  )
}

// One-line human summary of a tool call: server title when available,
// otherwise the first non-empty string input, truncated.
export function toolCallSummary(part: { state?: { title?: string; input?: Record<string, unknown> } }): string {
  const title = part.state?.title
  if (title) return title
  const input = part.state?.input
  if (input) {
    for (const value of Object.values(input)) {
      if (typeof value === "string" && value.trim()) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value
      }
    }
  }
  return ""
}
