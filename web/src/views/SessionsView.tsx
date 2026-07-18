import type { AppController } from "../hooks/useAppController"
import { formatTime } from "../utils"
import { CloseIcon, FolderIcon, LoadingIcon, PencilIcon, PlayIcon, PlusIcon, RefreshIcon, SaveIcon, TrashIcon } from "../Icons"

export function SessionsView({ controller }: { controller: AppController }) {
  const {
    t,
    sessions,
    activeSessions,
    changedSessions,
    connectionStatusText,
    connectionState,
    refreshSessionsWithIndicator,
    refreshingSessions,
    openNewSessionPicker,
    creatingSession,
    query,
    setQuery,
    filteredSessions,
    selectedID,
    openSession,
    renamingSessionID,
    renameValue,
    setRenameValue,
    renameSession,
    cancelRename,
    renameInputRef,
    startRename,
    setSessionToDelete,
    runtimeError
  } = controller

  return (
    <section className="panel sessions fade-in">
      <div className="section-heading">
        <div>
          <h2>{t('sessions.title')}</h2>
          <p className="subtle">
            {t('sessions.summary', { total: sessions.length, active: activeSessions, changed: changedSessions })}
          </p>
          {connectionStatusText && (
            <p className={`connection-status ${connectionState}`}>
              {['connecting', 'reconnecting'].includes(connectionState) && <LoadingIcon size={14} />}
              {connectionStatusText}
            </p>
          )}
        </div>
        <div className="inline-actions">
          <button onClick={refreshSessionsWithIndicator} className="btn-secondary" disabled={refreshingSessions}>
            {refreshingSessions ? <LoadingIcon size={18} /> : <RefreshIcon size={18} />}
            {t('sessions.refresh')}
          </button>
          <button onClick={openNewSessionPicker} className="btn-primary" disabled={creatingSession}>
            {creatingSession ? <LoadingIcon size={18} /> : <PlusIcon size={18} />}
            {creatingSession ? t('sessions.creating') : t('sessions.new')}
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input
          placeholder={t('sessions.searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="search"
        />
      </div>

      <div className="session-list">
        {filteredSessions.length === 0 && ['connecting', 'reconnecting'].includes(connectionState) ? (
          <div className="empty-state connection-pending">
            <LoadingIcon size={40} className="icon-empty-state" />
            <p>{t('sessions.loadingTitle')}</p>
            <p className="subtle">{t('sessions.loadingHint')}</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="empty-state">
            <FolderIcon size={48} className="icon-empty-state" />
            <p>{t('sessions.emptyTitle')}</p>
            <p className="subtle">{connectionState === "offline" ? t('sessions.offlineHint') : t('sessions.emptyHint')}</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <article
              key={session.id}
              className={`session-card ${selectedID === session.id ? "active" : ""} fade-in`}
              onClick={() => openSession(session.id, session.directory).catch(() => undefined)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openSession(session.id, session.directory).catch(() => undefined)
                }
              }}
            >
              <div className="session-card-main">
                <div>
                  {renamingSessionID === session.id ? (
                    <div
                      className="rename-inline"
                      onClick={(event) => event.stopPropagation()}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(event) => setRenameValue(event.target.value)}
                        onKeyDown={(event) => {
                          event.stopPropagation()
                          if (event.key === "Enter") {
                            event.preventDefault()
                            renameSession(session.id, renameValue, session.directory).catch(() => undefined)
                          } else if (event.key === "Escape") {
                            cancelRename()
                          }
                        }}
                        onBlur={() => {
                          // Only cancel if not clicked on save button
                          if (renameValue === session.title || !renameValue.trim()) {
                            cancelRename()
                          }
                        }}
                        placeholder={t('session.renamePlaceholder')}
                        className="rename-input"
                        autoComplete="off"
                      />
                      <button
                        className="btn-primary compact"
                        onClick={(event) => {
                          event.stopPropagation()
                          renameSession(session.id, renameValue, session.directory).catch(() => undefined)
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        title={t('session.renameConfirm')}
                      >
                        <SaveIcon size={14} />
                      </button>
                      <button
                        className="btn-secondary compact"
                        onClick={(event) => {
                          event.stopPropagation()
                          cancelRename()
                        }}
                        title={t('session.cancel')}
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    <h3>{session.title}</h3>
                  )}
                  <p>{session.directory}</p>
                </div>
                <span className={`pill ${session.status}`}>{session.status}</span>
              </div>
              <div className="session-stats">
                {session.files > 0 || session.additions > 0 || session.deletions > 0 ? (
                  <span className="change-summary">
                    <strong>{session.files}</strong> files
                    <strong className="positive">+{session.additions}</strong>
                    <strong className="negative">-{session.deletions}</strong>
                  </span>
                ) : (
                  <span className="subtle">{t('sessions.noFileChanges')}</span>
                )}
                <span className="subtle">{t('sessions.updated', { time: formatTime(session.updated) })}</span>
              </div>
              <div className="inline-actions">
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    openSession(session.id, session.directory).catch(() => undefined)
                  }}
                  className="btn-primary"
                >
                  <PlayIcon size={16} />
                  {t('sessions.open')}
                </button>
                <button
                  className="btn-secondary"
                  onClick={(event) => {
                    event.stopPropagation()
                    startRename(session)
                  }}
                  title={t('session.renameTitle')}
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  className="btn-danger"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSessionToDelete(session)
                  }}
                >
                  <TrashIcon size={16} />
                  {t('sessions.delete')}
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {runtimeError && <div className="error fade-in">✗ {runtimeError}</div>}
    </section>
  )
}
