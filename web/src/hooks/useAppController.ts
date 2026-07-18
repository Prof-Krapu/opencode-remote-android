import { useEffect, useMemo, useRef, useState } from "react"
import { api, permissionApi } from "../api"
import { createTranslator, normalizeLanguage, type LanguageCode } from "../i18n"
import type {
  AgentOption,
  CommandInfo,
  DiffFile,
  FileEntry,
  MessageEnvelope,
  ModelOption,
  NoticeType,
  PendingPermission,
  PermissionReply,
  ProjectDashboard,
  ServerConfig,
  Session,
  SessionStatus,
  SessionView,
  ThemePreference,
  TodoItem
} from "../types"
import {
  AGENT_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  MODEL_STORAGE_KEY,
  NEW_SESSION_DIRECTORY_STORAGE_KEY,
  STORAGE_KEY,
  THEME_STORAGE_KEY,
  assistantPayloadLength,
  canTestConfig,
  configKey,
  createLocalAssistantMessage,
  createOptimisticUserMessage,
  defaultConfig,
  extractText,
  hasMatchingUserMessage,
  hasRenderableContent,
  isProjectDirectory,
  messageActivityTime,
  modelFromKey,
  modelKey,
  modelSearchText,
  normalizeDirectory,
  pickString,
  sameModel,
  summarizeJson,
  toFileStatusList,
  toSessionView
} from "../utils"

export function useAppController() {
  const [config, setConfig] = useState<ServerConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultConfig
    try {
      return { ...defaultConfig, ...JSON.parse(saved) }
    } catch {
      return defaultConfig
    }
  })
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY) || navigator.language)
  })
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system"
  })
  const t = useMemo(() => createTranslator(language), [language])

  const [draftConfig, setDraftConfig] = useState<ServerConfig>(config)
  const [connectedVersion, setConnectedVersion] = useState<string>("")
  const [commands, setCommands] = useState<CommandInfo[]>([])
  const [commandFilter, setCommandFilter] = useState<"all" | "skill">("all")
  const [agentOptions, setAgentOptions] = useState<AgentOption[]>([])
  const [agentLoadError, setAgentLoadError] = useState<string | null>(null)
  const [selectedAgentID, setSelectedAgentID] = useState<string>(() => localStorage.getItem(AGENT_STORAGE_KEY) || "build")
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([])
  const [modelLoadError, setModelLoadError] = useState<string | null>(null)
  const [selectedModelKey, setSelectedModelKey] = useState<string | null>(() => localStorage.getItem(MODEL_STORAGE_KEY))
  const [modelQuery, setModelQuery] = useState("")
  const [helpPage, setHelpPage] = useState<"overview" | "server" | "network" | "troubleshooting" | "commands">(
    "overview"
  )
  const [view, setView] = useState<"settings" | "sessions" | "detail" | "help">(() => {
    return config.host && config.port > 0 ? "sessions" : "settings"
  })

  const [sessions, setSessions] = useState<SessionView[]>([])
  const [selectedID, setSelectedID] = useState<string | null>(null)
  const [newSessionDirectory, setNewSessionDirectory] = useState(() => localStorage.getItem(NEW_SESSION_DIRECTORY_STORAGE_KEY) ?? "")
  const [showNewSessionPicker, setShowNewSessionPicker] = useState(false)
  const [pickerPath, setPickerPath] = useState("")
  const [pickerItems, setPickerItems] = useState<FileEntry[]>([])
  const [pickerLoading, setPickerLoading] = useState(false)
  const [pickerError, setPickerError] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageEnvelope[]>([])
  const [optimisticUserMessages, setOptimisticUserMessages] = useState<MessageEnvelope[]>([])
  const [pendingPermissions, setPendingPermissions] = useState<PendingPermission[]>([])
  const [replyingPermissionID, setReplyingPermissionID] = useState<string | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [diffFiles, setDiffFiles] = useState<DiffFile[]>([])

  const [projectDashboard, setProjectDashboard] = useState<ProjectDashboard | null>(null)

  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [todosExpanded, setTodosExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [composer, setComposer] = useState("")
  const [busySending, setBusySending] = useState(false)
  const [loadingSessionID, setLoadingSessionID] = useState<string | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [creatingSession, setCreatingSession] = useState(false)
  const [refreshingSessions, setRefreshingSessions] = useState(false)
  const [awaitingAssistantReply, setAwaitingAssistantReply] = useState(false)
  const [settingsNotice, setSettingsNotice] = useState<{ type: NoticeType; text: string } | null>(null)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "connected" | "reconnecting" | "offline">(
    config.host && config.port > 0 ? "connecting" : "idle"
  )
  const [connectionMessage, setConnectionMessage] = useState<string>("")
  const [lastTestedConfigKey, setLastTestedConfigKey] = useState<string | null>(null)
  const [sessionToDelete, setSessionToDelete] = useState<SessionView | null>(null)
  const [renamingSessionID, setRenamingSessionID] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const renameInputRef = useRef<HTMLInputElement | null>(null)
  const [activeDetailSheet, setActiveDetailSheet] = useState<null | "ai" | "details">(null)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const composerRef = useRef<HTMLDivElement | null>(null)
  const completionAudioRef = useRef<HTMLAudioElement | null>(null)
  const completionShouldPlayRef = useRef(false)
  const wasAwaitingAssistantReplyRef = useRef(false)
  const wasRunningRef = useRef(false)
  const awaitingAssistantBaselineRef = useRef("")
  const loadSelectedRequestRef = useRef(0)
  const backgroundFailureCountRef = useRef(0)
  const initialSessionLoadRef = useRef(true)
  const latestMessageTimesRef = useRef(new Map<string, { sessionUpdated: number; activityTime: number }>())
  const pollingFastRef = useRef(false)
  const sessionsRef = useRef<SessionView[]>([])

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedID) ?? null,
    [sessions, selectedID]
  )
  const projectPath = projectDashboard?.project
    ? pickString(projectDashboard.project.path) || pickString(projectDashboard.project.directory) || pickString(projectDashboard.project.root)
    : null
  const projectName = projectDashboard?.project
    ? pickString(projectDashboard.project.name) || (projectPath ? projectPath.split("/").filter(Boolean).pop() ?? projectPath : null)
    : null
  const vcsBranch = projectDashboard?.vcs
    ? pickString(projectDashboard.vcs.branch) || pickString(projectDashboard.vcs.status) || summarizeJson(projectDashboard.vcs)
    : null
  const selectedModel = useMemo(() => modelFromKey(selectedModelKey), [selectedModelKey])
  const activeModelOption = useMemo(() => {
    if (selectedModel) {
      const explicit = modelOptions.find((option) => sameModel(option, selectedModel))
      if (explicit) return explicit
    }
    if (selectedSession?.model) {
      const current = modelOptions.find((option) => sameModel(option, selectedSession.model))
      if (current) return current
    }
    return modelOptions.find((option) => option.isDefault) ?? modelOptions[0] ?? null
  }, [modelOptions, selectedModel, selectedSession?.model])
  const activeModel = activeModelOption ? { providerID: activeModelOption.providerID, modelID: activeModelOption.modelID, variant: activeModelOption.variant } : selectedModel ?? undefined
  const primaryAgentOptions = useMemo(() => agentOptions.filter((agent) => agent.mode === "primary" || agent.mode === "all"), [agentOptions])
  const activeAgent = useMemo(() => {
    return primaryAgentOptions.find((agent) => agent.id === selectedAgentID)
      ?? primaryAgentOptions.find((agent) => agent.id === "build")
      ?? primaryAgentOptions[0]
      ?? null
  }, [primaryAgentOptions, selectedAgentID])
  const activeAgentID = activeAgent?.id ?? "build"
  const filteredModelOptions = useMemo(() => {
    const text = modelQuery.trim().toLowerCase()
    if (!text) return modelOptions
    return modelOptions.filter((option) => modelSearchText(option).includes(text))
  }, [modelOptions, modelQuery])

  const filteredSessions = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return sessions
    return sessions.filter((session) => {
      return session.title.toLowerCase().includes(text) || session.directory.toLowerCase().includes(text)
    })
  }, [sessions, query])
  const displayedCommands = useMemo(() => {
    if (commandFilter === "skill") return commands.filter((command) => command.source === "skill")
    return commands
  }, [commands, commandFilter])
  const selectedNewSessionDirectory = normalizeDirectory(newSessionDirectory)

  const renderedMessages = useMemo(() => {
    return [...messages, ...optimisticUserMessages]
      .map((message) => ({ ...message, text: extractText(message) }))
      .filter((message) => message.text || hasRenderableContent(message))
  }, [messages, optimisticUserMessages])

  const messageScrollSignature = useMemo(() => {
    return renderedMessages.map((message) => `${message.info.id}:${message.text.length}:${message.parts.length}`).join("|")
  }, [renderedMessages])

  // Only text-bearing assistant messages settle the "awaiting reply" state;
  // tool-only parts must not dismiss the typing bubble early.
  const assistantResponseSignature = useMemo(() => {
    return renderedMessages
      .filter((message) => message.info.role !== "user" && message.text)
      .map((message) => `${message.info.id}:${message.text.length}`)
      .join("|")
  }, [renderedMessages])

  const hasConfiguredServer = Boolean(config.host && config.port > 0)
  const draftConfigKey = configKey(draftConfig)
  const savedConfigKey = configKey(config)
  const hasDraftChanges = draftConfigKey !== savedConfigKey
  const canTestDraft = canTestConfig(draftConfig)
  const testAlreadyPassedForDraft = lastTestedConfigKey === draftConfigKey
  const connectionStatusText = connectionMessage || (connectionState === "connecting"
    ? t('connection.connecting')
    : connectionState === "reconnecting"
      ? t('connection.reconnecting')
      : connectionState === "connected"
        ? t('connection.connected')
        : connectionState === "offline"
          ? t('connection.offline')
          : "")
  const isSessionRunning = Boolean(selectedSession && ["busy", "retry"].includes(selectedSession.status))
  const isWaitingForOpenCodeReply = awaitingAssistantReply || busySending || isSessionRunning
  const isWorking = isWaitingForOpenCodeReply
  const showTypingBubble = Boolean(selectedSession) && isWaitingForOpenCodeReply
  const activeSessions = sessions.filter((session) => ["busy", "retry"].includes(session.status)).length
  const changedSessions = sessions.filter(
    (session) => session.files > 0 || session.additions > 0 || session.deletions > 0
  ).length
  const totalDiffAdditions = diffFiles.reduce((sum, file) => sum + file.additions, 0)
  const totalDiffDeletions = diffFiles.reduce((sum, file) => sum + file.deletions, 0)
  const showModelChip = modelOptions.length > 1 || Boolean(activeModelOption) || primaryAgentOptions.length > 0
  const permissionsBySession = useMemo(() => {
    const map = new Map<string, PendingPermission[]>()
    for (const item of pendingPermissions) {
      const list = map.get(item.sessionID) ?? []
      list.push(item)
      map.set(item.sessionID, list)
    }
    return map
  }, [pendingPermissions])
  const selectedSessionPermissions = selectedSession ? permissionsBySession.get(selectedSession.id) ?? [] : []

  async function openSession(sessionID: string, directory: string) {
    setSelectedID(sessionID)
    setMessages([])
    setOptimisticUserMessages([])
    setTodos([])
    setDiffFiles([])
    setProjectDashboard(null)
    setDashboardError(null)
    setAwaitingAssistantReply(false)
    setRuntimeError(null)
    setView("detail")
    setLoadingSessionID(sessionID)
    try {
      await loadSelected(sessionID, directory)
      await Promise.all([loadAgents(), loadModels()])
    } catch (err) {
      setRuntimeError((err as Error).message)
    }
    setLoadingSessionID((activeID) => (activeID === sessionID ? null : activeID))
  }

  function saveConfig() {
    setConfig(draftConfig)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftConfig))
    setSettingsNotice({ type: "success", text: t('settings.saved') })
    setConnectionState("connecting")
    setConnectionMessage(t('connection.connecting'))
    setRuntimeError(null)
    backgroundFailureCountRef.current = 0
    initialSessionLoadRef.current = true
  }

  async function testConnection(configToTest: ServerConfig) {
    setTestingConnection(true)
    setSettingsNotice({ type: "info", text: t('settings.testingConnection') })
    try {
      const health = await Promise.race([
        api.health(configToTest),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Connection timed out")), 12000))
      ])
      setConnectedVersion(health.version)
      setLastTestedConfigKey(configKey(configToTest))
      setSettingsNotice({ type: "success", text: t('settings.testedNotSaved', { version: health.version }) })
    } catch (err) {
      setSettingsNotice({ type: "error", text: t('settings.connectionFailed', { message: (err as Error).message }) })
    } finally {
      setTestingConnection(false)
    }
  }

  async function refreshSessions(silent = false, preserveSession?: SessionView) {
    if (!config.host || config.port <= 0) return
    if (!silent) {
      setRuntimeError(null)
      setConnectionState(sessions.length === 0 ? "connecting" : "reconnecting")
      setConnectionMessage(sessions.length === 0 ? t('connection.loadingSessions') : t('connection.refreshing'))
    } else if (initialSessionLoadRef.current && sessions.length === 0) {
      setConnectionState("connecting")
      setConnectionMessage(t('connection.loadingSessions'))
    }
    try {
      const items = await api.listGlobalSessions(config).catch(() => api.listSessions(config))
      const directories = [...new Set(items.map((session) => session.directory).filter(Boolean))]
      const [sessionLists, statusMaps] = await Promise.all([
        Promise.all(directories.map((directory) => api.listSessions(config, directory).catch(() => [] as Session[]))),
        Promise.all(directories.map((directory) => api.listStatuses(config, directory).catch(() => ({} as Record<string, SessionStatus>))))
      ])
      const scopedSessions = new Map(sessionLists.flat().map((session) => [session.id, session]))
      const statuses = Object.assign({}, ...statusMaps)
      const hydratedItems = items.map((session) => ({ ...session, ...scopedSessions.get(session.id), project: session.project }))
      const activityTimes = await loadSessionActivityTimes(hydratedItems)
      const mapped = hydratedItems
        .map((session) => toSessionView(session, statuses[session.id], activityTimes.get(session.id)))
        .sort((a, b) => b.updated - a.updated)
      setSessions((current) => {
        const selected = selectedID ? current.find((session) => session.id === selectedID) : null
        const toPreserve = preserveSession ?? selected
        if (!toPreserve || mapped.some((session) => session.id === toPreserve.id)) return mapped
        return [toPreserve, ...mapped].sort((a, b) => b.updated - a.updated)
      })
      backgroundFailureCountRef.current = 0
      initialSessionLoadRef.current = false
      setConnectionState("connected")
      setConnectionMessage(t('connection.connected'))
      setRuntimeError(null)
    } catch (err) {
      const message = (err as Error).message
      if (!silent) {
        setConnectionState("offline")
        setConnectionMessage(t('connection.offline'))
        setRuntimeError(message)
        return
      }

      backgroundFailureCountRef.current += 1
      if (backgroundFailureCountRef.current === 1) {
        setConnectionState("reconnecting")
        setConnectionMessage(t('connection.reconnecting'))
        return
      }

      setConnectionState("offline")
      setConnectionMessage(t('connection.offline'))
      if (backgroundFailureCountRef.current >= 3) {
        setRuntimeError(message)
      }
    }
  }

  async function refreshSessionsWithIndicator() {
    if (refreshingSessions) return
    setRefreshingSessions(true)
    try {
      await refreshSessions()
    } finally {
      setRefreshingSessions(false)
    }
  }

  async function loadCommands() {
    if (!config.host || config.port <= 0) return
    try {
      const list = await api.listCommands(config)
      setCommands(list)
    } catch {
      setCommands([])
    }
  }

  async function loadAgents() {
    if (!config.host || config.port <= 0) return
    try {
      const list = await api.listAgents(config, selectedSession?.directory ?? selectedNewSessionDirectory)
      setAgentOptions(list)
      setAgentLoadError(null)
      const saved = localStorage.getItem(AGENT_STORAGE_KEY) || selectedAgentID
      const primary = list.filter((agent) => agent.mode === "primary" || agent.mode === "all")
      const next = primary.find((agent) => agent.id === saved) ?? primary.find((agent) => agent.id === "build") ?? primary[0]
      if (next) {
        setSelectedAgentID(next.id)
        localStorage.setItem(AGENT_STORAGE_KEY, next.id)
      }
    } catch (err) {
      setAgentLoadError((err as Error).message)
    }
  }

  async function loadModels() {
    if (!config.host || config.port <= 0) return
    try {
      const list = await api.listModels(config, selectedSession?.directory ?? selectedNewSessionDirectory)
      setModelOptions(list)
      setModelLoadError(null)
      const sessionModel = selectedSession?.model
      const sessionOption = sessionModel ? list.find((option) => sameModel(option, sessionModel)) : null
      if (sessionOption) {
        const nextKey = modelKey(sessionOption)
        setSelectedModelKey(nextKey)
        localStorage.setItem(MODEL_STORAGE_KEY, nextKey)
        return
      }
      const saved = modelFromKey(selectedModelKey)
      if (saved && list.some((option) => sameModel(option, saved))) return
      const fallback = list.find((option) => option.isDefault) ?? list[0]
      if (fallback) {
        const nextKey = modelKey(fallback)
        setSelectedModelKey(nextKey)
        localStorage.setItem(MODEL_STORAGE_KEY, nextKey)
      }
    } catch (err) {
      setModelLoadError((err as Error).message)
    }
  }

  async function loadSessionActivityTimes(items: Session[]): Promise<Map<string, number>> {
    const results = await Promise.all(items.map(async (session) => {
      const cached = latestMessageTimesRef.current.get(session.id)
      if (cached?.sessionUpdated === session.time.updated) return [session.id, cached.activityTime] as const

      const latest = await api.loadLatestMessage(config, session.id, session.directory).catch(() => null)
      if (latest === null) return [session.id, session.time.updated] as const
      const activityTime = latest.length > 0 ? Math.max(...latest.map(messageActivityTime)) : session.time.updated
      latestMessageTimesRef.current.set(session.id, { sessionUpdated: session.time.updated, activityTime })
      return [session.id, activityTime] as const
    }))
    return new Map(results)
  }

  function changeModel(nextKey: string) {
    setSelectedModelKey(nextKey)
    localStorage.setItem(MODEL_STORAGE_KEY, nextKey)
  }

  function changeAgent(nextAgentID: string) {
    setSelectedAgentID(nextAgentID)
    localStorage.setItem(AGENT_STORAGE_KEY, nextAgentID)
  }

  async function loadSelected(sessionID: string, directory: string) {
    const requestID = ++loadSelectedRequestRef.current
    const [msg, todo, diff] = await Promise.all([
      api.loadMessages(config, sessionID, directory),
      api.loadTodo(config, sessionID, directory),
      api.loadDiff(config, sessionID, directory).catch(() => [])
    ])
    if (requestID !== loadSelectedRequestRef.current) return
    setMessages((current) => {
      if (assistantPayloadLength(current) > assistantPayloadLength(msg)) return current
      return msg
    })
    setOptimisticUserMessages((current) => current.filter((message) => !hasMatchingUserMessage(msg, message)))
    setTodos(todo)
    setDiffFiles(diff)
    await loadProjectDashboard(directory)
  }

  async function loadProjectDashboard(directory: string) {
    setDashboardError(null)
    try {
      const [project, vcs, fileStatus] = await Promise.all([
        api.loadProjectCurrent(config, directory).catch(() => null),
        api.loadVcs(config, directory).catch(() => null),
        api.loadFileStatus(config, directory).catch(() => [])
      ])
      setProjectDashboard({ project, vcs, files: toFileStatusList(fileStatus) })
    } catch (err) {
      setDashboardError((err as Error).message)
    }
  }

  function syncChatBottomClearance() {
    const container = messagesRef.current
    const composer = composerRef.current
    if (!container || !composer) return

    const composerRect = composer.getBoundingClientRect()
    const composerStyles = window.getComputedStyle(composer)
    const composerBottom = Number.parseFloat(composerStyles.bottom) || 0
    const clearance = Math.ceil(composerRect.height + composerBottom + 16)
    container.style.setProperty("--chat-bottom-clearance", `${clearance}px`)
  }

  function scrollMessagesToBottom(behavior: ScrollBehavior = "smooth") {
    requestAnimationFrame(() => {
      syncChatBottomClearance()
      requestAnimationFrame(() => {
        const container = messagesRef.current
        const end = messagesEndRef.current
        if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior })
        }
        end?.scrollIntoView({ block: "end", behavior })

        const composerRect = composerRef.current?.getBoundingClientRect()
        const endRect = end?.getBoundingClientRect()
        if (composerRect && endRect && endRect.bottom > composerRect.top - 12) {
          const coveredByComposer = endRect.bottom - composerRect.top + 12
          window.scrollBy({ top: coveredByComposer, behavior })
        }
      })
    })
  }

  async function browseNewSessionDirectory(path: string) {
    setPickerLoading(true)
    setPickerError(null)
    try {
      const items = await api.listFiles(config, path, path)
      setPickerPath(path)
      setPickerItems(items.filter((item) => item.type === "directory").sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      setPickerError((err as Error).message)
      setPickerItems([])
    } finally {
      setPickerLoading(false)
    }
  }

  async function openNewSessionPicker() {
    if (creatingSession) return
    setRuntimeError(null)
    setShowNewSessionPicker(true)
    setPickerError(null)
    try {
      const pathInfo = await api.loadPath(config, selectedNewSessionDirectory)
      await browseNewSessionDirectory(selectedNewSessionDirectory ?? pathInfo.directory)
    } catch (err) {
      setPickerError((err as Error).message)
    }
  }

  async function createSession(directory = selectedNewSessionDirectory) {
    if (creatingSession) return
    setCreatingSession(true)
    setRuntimeError(null)
    setPickerError(null)
    try {
      if (directory) {
        const pathInfo = await api.loadPath(config, directory)
        if (!isProjectDirectory(pathInfo)) {
          throw new Error(t('sessions.projectDirectoryInvalid', { directory }))
        }
      }
      const created = await api.createSession(config, "Mobile session", activeModel, directory)
      const createdView = toSessionView(created)
      if (directory) {
        setNewSessionDirectory(directory)
      }
      setShowNewSessionPicker(false)
      setSessions((current) => {
        if (current.some((session) => session.id === created.id)) return current
        return [createdView, ...current].sort((a, b) => b.updated - a.updated)
      })
      setSelectedID(created.id)
      setView("detail")
      await loadSelected(created.id, created.directory)
      await refreshSessions(false, createdView)
    } catch (err) {
      setPickerError((err as Error).message)
      setRuntimeError((err as Error).message)
    } finally {
      setCreatingSession(false)
    }
  }

  async function send() {
    if (!selectedSession) return
    const text = composer.trim()
    if (!text) return

    if (text.startsWith("/")) {
      const normalized = text.slice(1)
      const command = normalized.split(" ")[0]?.trim() ?? ""
      const args = normalized.slice(command.length).trim()
      const localCommand = command.toLowerCase()

      if (localCommand === "help" || localCommand === "commands" || localCommand === "skills") {
        setComposer("")
        setRuntimeError(null)
        setCommandFilter(localCommand === "skills" ? "skill" : "all")
        setHelpPage("commands")
        setView("help")
        return
      }

      if (!command) return

      if (localCommand === "status") {
        const status = [
          `Connection: ${connectionStatusText || connectionState}`,
          `Server: ${hasConfiguredServer ? `${config.host}:${config.port}` : "not configured"}`,
          `Session: ${selectedSession.title} (${selectedSession.status})`,
          `Directory: ${selectedSession.directory}`,
          `Agent: ${activeAgent?.name ?? activeAgentID}`,
          `Model: ${activeModelOption ? `${activeModelOption.providerName} / ${activeModelOption.modelName}` : "default"}`
        ].join("\n")
        setComposer("")
        setRuntimeError(null)
        setOptimisticUserMessages((current) => [
          ...current,
          createOptimisticUserMessage(selectedSession.id, text),
          createLocalAssistantMessage(selectedSession.id, status)
        ])
        scrollMessagesToBottom("smooth")
        return
      }

      let availableCommands = commands
      if (availableCommands.length === 0) {
        try {
          availableCommands = await api.listCommands(config)
          setCommands(availableCommands)
        } catch (err) {
          setRuntimeError(`Cannot load server commands: ${(err as Error).message}`)
          return
        }
      }

      if (!availableCommands.some((item) => item.name === command)) {
        const available = availableCommands.map((item) => `/${item.name}`).join(", ")
        setRuntimeError(`Command not found: "/${command}". Available commands: ${available}`)
        return
      }

      setComposer("")
      const optimisticMessage = createOptimisticUserMessage(selectedSession.id, text)
      setOptimisticUserMessages((current) => [...current, optimisticMessage])
      awaitingAssistantBaselineRef.current = assistantResponseSignature
      completionShouldPlayRef.current = true
      setAwaitingAssistantReply(true)
      scrollMessagesToBottom("smooth")

      setBusySending(true)
      setRuntimeError(null)
      try {
        await api.sendCommand(config, selectedSession.id, command, args, selectedSession.directory, activeModel, activeAgentID)
        await loadSelected(selectedSession.id, selectedSession.directory)
        setOptimisticUserMessages((current) => current.filter((message) => message.info.id !== optimisticMessage.info.id))
        await refreshSessions()
      } catch (err) {
        completionShouldPlayRef.current = false
        setAwaitingAssistantReply(false)
        setOptimisticUserMessages((current) => current.filter((message) => message.info.id !== optimisticMessage.info.id))
        setComposer((current) => current || text)
        setRuntimeError((err as Error).message)
      } finally {
        setBusySending(false)
      }
      return
    }

    setComposer("")
    const optimisticMessage = createOptimisticUserMessage(selectedSession.id, text)
    setOptimisticUserMessages((current) => [...current, optimisticMessage])
    awaitingAssistantBaselineRef.current = assistantResponseSignature
    completionShouldPlayRef.current = true
    setAwaitingAssistantReply(true)
    scrollMessagesToBottom("smooth")

    setBusySending(true)
    setRuntimeError(null)
    try {
      await api.sendPrompt(config, selectedSession.id, text, selectedSession.directory, activeModel, activeAgentID)
      await loadSelected(selectedSession.id, selectedSession.directory)
      await refreshSessions()
    } catch (err) {
      completionShouldPlayRef.current = false
      setAwaitingAssistantReply(false)
      setOptimisticUserMessages((current) => current.filter((message) => message.info.id !== optimisticMessage.info.id))
      setComposer((current) => current || text)
      setRuntimeError((err as Error).message)
    } finally {
      setBusySending(false)
    }
  }

  async function deleteSession(sessionID: string) {
    try {
      await api.deleteSession(config, sessionID, sessionToDelete?.directory)
      if (selectedID === sessionID) {
        setSelectedID(null)
        setMessages([])
        setOptimisticUserMessages([])
        setTodos([])
        setDiffFiles([])
        setProjectDashboard(null)
        setDashboardError(null)
        setView("sessions")
      }
      setSessionToDelete(null)
      await refreshSessions(true)
    } catch (err) {
      setRuntimeError((err as Error).message)
    }
  }

  async function renameSession(sessionID: string, newTitle: string, directory: string) {
    if (!newTitle.trim()) return
    try {
      await api.renameSession(config, sessionID, newTitle.trim(), directory)
      setRenamingSessionID(null)
      setRenameValue("")
      await refreshSessions(true)
    } catch (err) {
      setRuntimeError((err as Error).message)
    }
  }

  function startRename(session: SessionView) {
    setRenameValue(session.title)
    setRenamingSessionID(session.id)
    // Focus the input after render
    setTimeout(() => {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }, 50)
  }

  function cancelRename() {
    setRenamingSessionID(null)
    setRenameValue("")
  }

  async function abortSession() {
    if (!selectedSession) return
    try {
      await api.abort(config, selectedSession.id, selectedSession.directory)
      completionShouldPlayRef.current = false
      setAwaitingAssistantReply(false)
      await refreshSessions()
      await loadSelected(selectedSession.id, selectedSession.directory)
    } catch (err) {
      setRuntimeError((err as Error).message)
    }
  }

  // Pending permission requests can belong to sessions of any project:
  // poll every directory the sessions list currently knows about.
  async function loadPendingPermissions() {
    if (!config.host || config.port <= 0) return
    const directories = [...new Set(sessionsRef.current.map((session) => session.directory).filter(Boolean))]
    const lists = await Promise.all(
      (directories.length > 0 ? directories : [undefined]).map((directory) =>
        permissionApi.listPending(config, directory).catch(() => [] as PendingPermission[])
      )
    )
    const merged = new Map<string, PendingPermission>()
    for (const list of lists) {
      for (const item of list) merged.set(item.id, item)
    }
    setPendingPermissions([...merged.values()])
  }

  async function respondPermission(permission: PendingPermission, reply: PermissionReply) {
    setReplyingPermissionID(permission.id)
    setRuntimeError(null)
    try {
      const directory = sessionsRef.current.find((session) => session.id === permission.sessionID)?.directory
      await permissionApi.reply(config, permission, reply, directory)
      setPendingPermissions((current) => current.filter((item) => item.id !== permission.id))
      await refreshSessions(true)
      if (selectedSession) {
        await loadSelected(selectedSession.id, selectedSession.directory)
      }
    } catch (err) {
      setRuntimeError((err as Error).message)
      await loadPendingPermissions().catch(() => undefined)
    } finally {
      setReplyingPermissionID(null)
    }
  }

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    function applyThemePreference() {
      const resolvedTheme = theme === "system" && mediaQuery.matches ? "dark" : theme === "dark" ? "dark" : "light"
      document.documentElement.dataset.theme = resolvedTheme
      document.documentElement.style.colorScheme = resolvedTheme
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyThemePreference()
    mediaQuery.addEventListener("change", applyThemePreference)
    return () => mediaQuery.removeEventListener("change", applyThemePreference)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(NEW_SESSION_DIRECTORY_STORAGE_KEY, newSessionDirectory)
  }, [newSessionDirectory])

  useEffect(() => {
    sessionsRef.current = sessions
  }, [sessions])

  // Keep the polling cadence decision in a ref so the polling effect below
  // does not re-run its initial loads on every status flip.
  useEffect(() => {
    pollingFastRef.current = awaitingAssistantReply || busySending || isSessionRunning
  }, [awaitingAssistantReply, busySending, isSessionRunning])

  useEffect(() => {
    if (!config.host || config.port <= 0) {
      setConnectionState("idle")
      setConnectionMessage("")
      return
    }
    setConnectionState("connecting")
    setConnectionMessage(t('connection.connecting'))
    backgroundFailureCountRef.current = 0
    initialSessionLoadRef.current = true
    refreshSessions(true).catch(() => undefined)
    loadCommands().catch(() => undefined)
    loadAgents().catch(() => undefined)
    loadModels().catch(() => undefined)
    loadPendingPermissions().catch(() => undefined)
    // Adaptive polling: fast while work is in flight, slow when idle,
    // and no network traffic at all while the app is hidden (battery/data).
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const runTick = () => {
      if (document.hidden) return
      refreshSessions(true).catch(() => undefined)
      loadPendingPermissions().catch(() => undefined)
      if (selectedSession) {
        loadSelected(selectedSession.id, selectedSession.directory).catch(() => undefined)
      }
    }
    const schedule = () => {
      if (cancelled) return
      timer = setTimeout(() => {
        runTick()
        schedule()
      }, pollingFastRef.current ? 1500 : 10000)
    }
    schedule()
    const onVisibilityChange = () => {
      if (cancelled || document.hidden) return
      if (timer) clearTimeout(timer)
      runTick()
      schedule()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [config.host, config.port, config.username, config.password, selectedSession?.id, selectedNewSessionDirectory])

  useEffect(() => {
    if (!hasConfiguredServer) {
      setView("settings")
    }
  }, [hasConfiguredServer])

  useEffect(() => {
    if (view !== "detail") return
    scrollMessagesToBottom("auto")
  }, [view, messageScrollSignature, isWorking, showTypingBubble])

  useEffect(() => {
    if (!awaitingAssistantReply) return
    if (assistantResponseSignature && assistantResponseSignature !== awaitingAssistantBaselineRef.current) {
      setAwaitingAssistantReply(false)
    }
  }, [assistantResponseSignature, awaitingAssistantReply])

  useEffect(() => {
    completionAudioRef.current = new Audio("/audio/staplebops-01.aac")
    completionAudioRef.current.preload = "auto"
  }, [])

  useEffect(() => {
    if (wasAwaitingAssistantReplyRef.current && !awaitingAssistantReply && completionShouldPlayRef.current) {
      completionShouldPlayRef.current = false
      const audio = completionAudioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => undefined)
      }
    }
    wasAwaitingAssistantReplyRef.current = awaitingAssistantReply
  }, [awaitingAssistantReply])

  useEffect(() => {
    if (!selectedSession) {
      wasRunningRef.current = false
      return
    }
    wasRunningRef.current = ["busy", "retry"].includes(selectedSession.status)
  }, [selectedSession?.id, selectedSession?.status])

  return {
    t,
    config,
    setConfig,
    language,
    setLanguage,
    theme,
    setTheme,
    draftConfig,
    setDraftConfig,
    connectedVersion,
    commands,
    commandFilter,
    setCommandFilter,
    agentOptions,
    agentLoadError,
    selectedAgentID,
    modelOptions,
    modelLoadError,
    selectedModelKey,
    modelQuery,
    setModelQuery,
    helpPage,
    setHelpPage,
    view,
    setView,
    sessions,
    selectedID,
    newSessionDirectory,
    showNewSessionPicker,
    setShowNewSessionPicker,
    pickerPath,
    pickerItems,
    pickerLoading,
    pickerError,
    messages,
    optimisticUserMessages,
    todos,
    diffFiles,
    projectDashboard,
    dashboardError,
    todosExpanded,
    setTodosExpanded,
    query,
    setQuery,
    composer,
    setComposer,
    busySending,
    loadingSessionID,
    testingConnection,
    creatingSession,
    refreshingSessions,
    awaitingAssistantReply,
    settingsNotice,
    runtimeError,
    connectionState,
    connectionMessage,
    sessionToDelete,
    setSessionToDelete,
    renamingSessionID,
    renameValue,
    setRenameValue,
    renameInputRef,
    activeDetailSheet,
    setActiveDetailSheet,
    messagesRef,
    messagesEndRef,
    composerRef,
    selectedSession,
    projectPath,
    projectName,
    vcsBranch,
    selectedModel,
    activeModelOption,
    activeModel,
    primaryAgentOptions,
    activeAgent,
    activeAgentID,
    filteredModelOptions,
    filteredSessions,
    displayedCommands,
    selectedNewSessionDirectory,
    renderedMessages,
    hasConfiguredServer,
    hasDraftChanges,
    canTestDraft,
    testAlreadyPassedForDraft,
    connectionStatusText,
    isSessionRunning,
    isWorking,
    showTypingBubble,
    activeSessions,
    changedSessions,
    totalDiffAdditions,
    totalDiffDeletions,
    showModelChip,
    pendingPermissions,
    replyingPermissionID,
    permissionsBySession,
    selectedSessionPermissions,
    loadPendingPermissions,
    respondPermission,
    openSession,
    saveConfig,
    testConnection,
    refreshSessions,
    refreshSessionsWithIndicator,
    loadAgents,
    loadModels,
    changeModel,
    changeAgent,
    loadSelected,
    scrollMessagesToBottom,
    syncChatBottomClearance,
    browseNewSessionDirectory,
    openNewSessionPicker,
    createSession,
    send,
    deleteSession,
    renameSession,
    startRename,
    cancelRename,
    abortSession
  }
}

export type AppController = ReturnType<typeof useAppController>
