import type { AppController } from "../hooks/useAppController"
import { agentLabel, formatTime } from "../utils"
import { ChatIcon, CloseIcon, LoadingIcon, PencilIcon, SaveIcon, SendIcon, StopCircleIcon } from "../Icons"
import { MessagePart } from "./MessagePart"
import { PermissionBanner } from "./PermissionBanner"

export function DetailView({ controller }: { controller: AppController }) {
  const {
    t,
    selectedSession,
    setView,
    renamingSessionID,
    renameValue,
    setRenameValue,
    renameSession,
    cancelRename,
    renameInputRef,
    startRename,
    showModelChip,
    setActiveDetailSheet,
    activeAgent,
    activeAgentID,
    activeModelOption,
    projectName,
    todos,
    todosExpanded,
    setTodosExpanded,
    loadingSessionID,
    selectedID,
    renderedMessages,
    showTypingBubble,
    messagesRef,
    messagesEndRef,
    composer,
    setComposer,
    syncChatBottomClearance,
    scrollMessagesToBottom,
    isWorking,
    send,
    abortSession,
    composerRef,
    runtimeError
  } = controller

  return (
    <main className="panel detail fade-in">
      <div className="detail-topbar">
        <button className="btn-secondary" onClick={() => {
          setView("sessions");
          requestAnimationFrame(() => document.querySelector<HTMLElement>(".session-card.active")?.scrollIntoView({ block: "center" }));
        }}>{t('detail.backToSessions')}</button>
        {selectedSession && (
          <span className={`pill ${selectedSession.status}`}>{selectedSession.status}</span>
        )}
      </div>
      <div className="header-row detail-header">
          <div>
          <h2>
            {selectedSession ? (
              <div className="detail-title-row">
                <ChatIcon size={24} className="icon-inline-heading" />
                {renamingSessionID === selectedSession.id ? (
                  <div className="rename-inline">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          renameSession(selectedSession.id, renameValue, selectedSession.directory).catch(() => undefined)
                        } else if (event.key === "Escape") {
                          cancelRename()
                        }
                      }}
                      onBlur={() => {
                        if (renameValue === selectedSession.title || !renameValue.trim()) {
                          cancelRename()
                        }
                      }}
                      placeholder={t('session.renamePlaceholder')}
                      className="rename-input"
                      autoComplete="off"
                    />
                    <button
                      className="btn-primary compact"
                      onClick={() => renameSession(selectedSession.id, renameValue, selectedSession.directory).catch(() => undefined)}
                      onMouseDown={(event) => event.preventDefault()}
                      title={t('session.renameConfirm')}
                    >
                      <SaveIcon size={14} />
                    </button>
                    <button
                      className="btn-secondary compact"
                      onClick={() => cancelRename()}
                      title={t('session.cancel')}
                    >
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    {selectedSession.title}
                    <button
                      className="btn-icon btn-secondary compact"
                      onClick={() => startRename(selectedSession)}
                      title={t('session.renameTitle')}
                      style={{ marginLeft: 'var(--space-1)' }}
                    >
                      <PencilIcon size={14} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              t('detail.selectSession')
            )}
          </h2>
          {selectedSession && (
            <p className="subtle">
              {selectedSession.directory} • {t('sessions.updated', { time: formatTime(selectedSession.updated) })}
            </p>
          )}
          </div>
        </div>

      {selectedSession && (
        <section className="session-context-strip" aria-label={t('detail.contextStripLabel')}>
          {showModelChip && (
            <button type="button" className="context-chip" onClick={() => setActiveDetailSheet("ai")}>
              <span>{t('detail.aiChip')}</span>
              <strong>{agentLabel(activeAgent ?? { id: activeAgentID, name: activeAgentID, mode: "primary" })} · {activeModelOption?.modelName ?? t('detail.modelLoading')}</strong>
            </button>
          )}

          <button type="button" className="context-chip ghost" onClick={() => setActiveDetailSheet("details")}>
            <span>{t('detail.detailsChip')}</span>
            <strong>{projectName || t('detail.projectLabel')}</strong>
          </button>
        </section>
      )}

      {todos.length > 0 && (
        <div className="todo-box">
          <div className="todo-header-row">
            <h3>
              <span style={{ marginRight: 'var(--space-2)' }}>📋</span>
              {t('todo.title')}
            </h3>
            <button
              type="button"
              className="todo-toggle-btn"
              onClick={() => setTodosExpanded((value) => !value)}
              aria-expanded={todosExpanded}
              aria-controls="todo-items-content"
            >
              {todosExpanded ? t('todo.hide') : t('todo.show')}
            </button>
          </div>
          {todosExpanded && (
            <div id="todo-items-content">
              {todos.slice(0, 6).map((item) => (
                <div key={item.id} className="todo-item">
                  <span className={`todo-status ${item.status}`}>
                    {item.status === 'completed' ? '✓' : '○'}
                  </span>
                  <span>{item.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="messages-wrap">
        <div className="messages" ref={messagesRef}>
        {loadingSessionID === selectedID ? (
          <div className="empty-state compact">
            <LoadingIcon size={32} />
            <p>{t('detail.loading')}</p>
          </div>
        ) : renderedMessages.length === 0 && !showTypingBubble ? (
          <div className="empty-state compact">
            <ChatIcon size={40} className="icon-empty-state" />
            <p>{t('detail.emptyTitle')}</p>
            <p className="subtle">{t('detail.emptyHint')}</p>
          </div>
        ) : (
          <>
            {renderedMessages.map((message) => (
              <article key={message.info.id} className={`message ${message.info.role} fade-in`}>
                <header>
                  <strong>
                    {message.info.role === "user" ? t('detail.you') : t('detail.opencode')}
                  </strong>
                  <small>{formatTime(message.info.time.created)}</small>
                </header>
                <div className="message-content">
                  {message.parts.map((part) => (
                    <MessagePart key={part.id} part={part} t={t} />
                  ))}
                </div>
              </article>
            ))}
            {showTypingBubble && (
              <article className="message assistant typing-bubble fade-in" aria-label={t('detail.waiting')}>
                <div className="typing-dots" aria-hidden="true">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </article>
            )}
            <div ref={messagesEndRef} className="messages-end" aria-hidden="true" />
          </>
        )}
        </div>
      </div>

      <PermissionBanner controller={controller} />

      <div className="composer" ref={composerRef}>
        <textarea
          value={composer}
          onChange={(event) => setComposer(event.target.value)}
          placeholder={t('detail.composerPlaceholder')}
          onFocus={() => {
            syncChatBottomClearance()
            setTimeout(() => scrollMessagesToBottom("smooth"), 400)
            const onResize = () => {
              scrollMessagesToBottom("smooth")
              window.removeEventListener("resize", onResize)
            }
            window.addEventListener("resize", onResize, { once: true })
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              if (!isWorking) {
                send().catch(() => undefined)
              }
            }
          }}
          disabled={!selectedSession || isWorking}
        />
        <button
          onClick={isWorking ? abortSession : send}
          disabled={!selectedSession}
          className={isWorking ? "btn-danger" : "btn-primary"}
        >
          {isWorking ? (
            <>
              <StopCircleIcon size={18} />
              {t('detail.waiting')}
            </>
          ) : (
            <>
              <SendIcon size={18} />
              {t('detail.send')}
            </>
          )}
        </button>
      </div>

      {runtimeError && <div className="error fade-in">✗ {runtimeError}</div>}
    </main>
  )
}
