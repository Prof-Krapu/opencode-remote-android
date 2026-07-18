import type { AppController } from "../hooks/useAppController"
import { agentLabel, formatLimit, modelKey, sameModel } from "../utils"
import { RefreshIcon } from "../Icons"

export function DetailSheet({ controller }: { controller: AppController }) {
  const {
    t,
    activeDetailSheet,
    selectedSession,
    setActiveDetailSheet,
    loadAgents,
    loadModels,
    primaryAgentOptions,
    activeAgentID,
    changeAgent,
    isWorking,
    activeAgent,
    agentLoadError,
    modelOptions,
    modelQuery,
    setModelQuery,
    filteredModelOptions,
    selectedModelKey,
    changeModel,
    modelLoadError,
    activeModelOption,
    projectName,
    projectPath,
    vcsBranch,
    projectDashboard,
    diffFiles,
    totalDiffAdditions,
    totalDiffDeletions,
    dashboardError
  } = controller

  if (!activeDetailSheet || !selectedSession) return null

  return (
    <div className="sheet-backdrop" role="presentation" onClick={() => setActiveDetailSheet(null)}>
      <section
        className="bottom-sheet fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <div>
            <h3 id="detail-sheet-title">
              {activeDetailSheet === "ai" && t('detail.aiTitle')}
              {activeDetailSheet === "details" && t('detail.sessionDetailsTitle')}
            </h3>
            <p className="subtle">
              {activeDetailSheet === "ai" && t('detail.modelHint')}
              {activeDetailSheet === "details" && t('detail.sessionDetailsHint')}
            </p>
          </div>
          <button type="button" className="btn-secondary compact" onClick={() => setActiveDetailSheet(null)}>
            {t('detail.closeSheet')}
          </button>
        </div>

        {activeDetailSheet === "ai" && (
          <div className="sheet-content">
            <button type="button" className="btn-secondary" onClick={() => Promise.all([loadAgents(), loadModels()]).catch(() => undefined)}>
              <RefreshIcon size={16} />
              {t('detail.refreshAi')}
            </button>
            {primaryAgentOptions.length > 0 ? (
              <div className="agent-controls">
                <label htmlFor="agent-select">
                  {t('detail.agentSelectLabel')}
                  <select
                    id="agent-select"
                    value={activeAgentID}
                    onChange={(event) => changeAgent(event.target.value)}
                    disabled={isWorking}
                  >
                    {primaryAgentOptions.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agentLabel(agent)}</option>
                    ))}
                  </select>
                </label>
                <p className="subtle">
                  {activeAgent?.description || t('detail.agentMode', { mode: activeAgent?.mode ?? 'primary' })}
                </p>
              </div>
            ) : (
              <p className="subtle">{agentLoadError ? t('detail.agentLoadError', { message: agentLoadError }) : t('detail.agentLoading')}</p>
            )}
            {modelOptions.length > 0 ? (
              <div className="model-controls">
                <label htmlFor="model-search">
                  {t('detail.modelSelectLabel')}
                  <input
                    id="model-search"
                    value={modelQuery}
                    onChange={(event) => setModelQuery(event.target.value)}
                    placeholder={t('detail.modelSearchPlaceholder')}
                    disabled={isWorking}
                    autoComplete="off"
                  />
                </label>
                <div className="model-option-list" role="listbox" aria-label={t('detail.modelSelectLabel')}>
                  {filteredModelOptions.length > 0 ? (
                    filteredModelOptions.map((option) => {
                      const optionKey = modelKey(option)
                      const active = activeModelOption ? sameModel(option, activeModelOption) : optionKey === selectedModelKey
                      return (
                        <button
                          type="button"
                          key={optionKey}
                          className={active ? "model-option active" : "model-option"}
                          onClick={() => changeModel(optionKey)}
                          disabled={isWorking}
                          role="option"
                          aria-selected={active}
                        >
                          <span>
                            <strong>{option.modelName}</strong>
                            <small>{option.providerName}{option.variant ? ` · ${option.variant}` : ""}</small>
                          </span>
                          {option.isDefault && <em>{t('detail.modelDefault')}</em>}
                        </button>
                      )
                    })
                  ) : (
                    <p className="subtle model-empty">{t('detail.modelSearchEmpty')}</p>
                  )}
                </div>
                {activeModelOption && (
                  <div className="model-meta">
                    <span>{t('detail.modelProvider', { provider: activeModelOption.providerName })}</span>
                    <span>{t('detail.modelContext', { context: formatLimit(activeModelOption.contextLimit), output: formatLimit(activeModelOption.outputLimit) })}</span>
                    <span>{activeModelOption.tools ? t('detail.modelToolsYes') : t('detail.modelToolsNo')}</span>
                    {activeModelOption.variant && <span>{t('detail.modelVariant', { variant: activeModelOption.variant })}</span>}
                  </div>
                )}
              </div>
            ) : (
              <p className="subtle">{modelLoadError ? t('detail.modelLoadError', { message: modelLoadError }) : t('detail.modelLoading')}</p>
            )}
          </div>
        )}

        {activeDetailSheet === "details" && (
          <div className="sheet-content project-dashboard single-column">
            <div className="dashboard-card">
              <span className="dashboard-label">{t('detail.projectLabel')}</span>
              <strong>{projectName || selectedSession.directory}</strong>
              <small>{projectPath || selectedSession.directory}</small>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-label">{t('detail.vcsLabel')}</span>
              <strong>{vcsBranch || t('detail.unavailable')}</strong>
              {projectDashboard?.vcs && (
                <small>{t('detail.aheadBehind', { ahead: projectDashboard.vcs.ahead ?? 0, behind: projectDashboard.vcs.behind ?? 0 })}</small>
              )}
            </div>
            <div className="dashboard-card">
              <span className="dashboard-label">{t('detail.fileStatusLabel')}</span>
              <strong>{diffFiles.length > 0 ? t('detail.filesCount', { count: diffFiles.length }) : (projectDashboard?.files.length ?? 0)}</strong>
              {diffFiles.length > 0 ? (
                <small><span className="positive">+{totalDiffAdditions}</span> <span className="negative">-{totalDiffDeletions}</span></small>
              ) : (
                <small>{dashboardError ? t('detail.dashboardError', { message: dashboardError }) : t('detail.fileStatusSource')}</small>
              )}
            </div>
            <div className="dashboard-card">
              <span className="dashboard-label">{t('detail.agentTitle')}</span>
              <strong>{agentLabel(activeAgent ?? { id: activeAgentID, name: activeAgentID, mode: "primary" })}</strong>
              <small>{t('detail.agentMode', { mode: activeAgent?.mode ?? 'primary' })}</small>
            </div>
            <div className="dashboard-card">
              <span className="dashboard-label">{t('detail.modelTitle')}</span>
              <strong>{activeModelOption?.modelName ?? t('detail.modelLoading')}</strong>
              <small>{activeModelOption?.providerName ?? "-"}</small>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
