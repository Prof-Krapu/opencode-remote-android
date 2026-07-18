import { languageOptions, normalizeLanguage } from "../i18n"
import type { ThemePreference } from "../types"
import type { AppController } from "../hooks/useAppController"
import { isInsecureHttpConfig } from "../utils"
import { LoadingIcon, SaveIcon, TestIcon } from "../Icons"

export function SettingsView({ controller }: { controller: AppController }) {
  const {
    t,
    config,
    hasConfiguredServer,
    language,
    setLanguage,
    theme,
    setTheme,
    draftConfig,
    setDraftConfig,
    saveConfig,
    testConnection,
    testingConnection,
    hasDraftChanges,
    canTestDraft,
    testAlreadyPassedForDraft,
    settingsNotice,
    connectedVersion
  } = controller

  return (
    <section className="panel settings fade-in">
      <div className="section-heading">
        <div>
          <h2>{t('settings.title')}</h2>
          <p className="subtle">{hasConfiguredServer ? `${config.host}:${config.port}` : t('settings.hostPlaceholder')}</p>
          <p className="subtle">{t('settings.draftHint')}</p>
        </div>
      </div>

      <div className="form-grid">
      <label htmlFor="language">
        {t('settings.language')}
        <select
          id="language"
          value={language}
          onChange={(event) => setLanguage(normalizeLanguage(event.target.value))}
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
      </label>

      <label htmlFor="theme">
        {t('settings.theme')}
        <select
          id="theme"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemePreference)}
        >
          <option value="system">{t('settings.themeSystem')}</option>
          <option value="light">{t('settings.themeLight')}</option>
          <option value="dark">{t('settings.themeDark')}</option>
        </select>
      </label>

      <label htmlFor="host">
        {t('settings.host')}
        <input
          id="host"
          value={draftConfig.host}
          onChange={(event) => setDraftConfig({ ...draftConfig, host: event.target.value })}
          placeholder={t('settings.hostPlaceholder')}
        />
      </label>

      <label htmlFor="port">
        {t('settings.port')}
        <input
          id="port"
          type="number"
          value={draftConfig.port}
          onChange={(event) => setDraftConfig({ ...draftConfig, port: Number(event.target.value || 0) })}
          placeholder="4096"
        />
      </label>

      <label htmlFor="username">
        {t('settings.username')}
        <input
          id="username"
          value={draftConfig.username}
          onChange={(event) => setDraftConfig({ ...draftConfig, username: event.target.value })}
          placeholder="opencode"
        />
      </label>

      <label htmlFor="password">
        {t('settings.password')}
        <input
          id="password"
          type="password"
          value={draftConfig.password}
          onChange={(event) => setDraftConfig({ ...draftConfig, password: event.target.value })}
          placeholder={t('settings.passwordPlaceholder')}
        />
      </label>
      </div>

      <div className="actions">
        <button
          onClick={saveConfig}
          disabled={testingConnection || !hasDraftChanges}
          className="btn-primary"
        >
          <SaveIcon size={18} />
          {hasDraftChanges ? t('settings.save') : t('settings.savedButton')}
        </button>
        <button
          onClick={() => testConnection(draftConfig)}
          className="btn-secondary"
          disabled={testingConnection || !canTestDraft || testAlreadyPassedForDraft}
          title={!canTestDraft ? t('settings.testNeedsFields') : testAlreadyPassedForDraft ? t('settings.testAlreadyPassed') : undefined}
        >
          {testingConnection ? (
            <>
              <LoadingIcon size={18} />
              {t('settings.testing')}
            </>
          ) : (
            <>
              <TestIcon size={18} />
              {testAlreadyPassedForDraft ? t('settings.testOk') : t('settings.test')}
            </>
          )}
        </button>
      </div>

      {settingsNotice && (
        <div className={`notice ${settingsNotice.type} fade-in`}>
          {settingsNotice.type === 'success' && '✓ '}
          {settingsNotice.type === 'error' && '✗ '}
          {settingsNotice.type === 'info' && 'ℹ '}
          {settingsNotice.text}
        </div>
      )}

      {isInsecureHttpConfig(draftConfig) && (
        <div className="notice error fade-in">
          {t('settings.insecureHttpWarning', { host: draftConfig.host.trim() })}
        </div>
      )}

      <div className="connection-help">
        <span>{canTestDraft ? t('settings.readyToTest') : t('settings.testNeedsFields')}</span>
        <span>{hasDraftChanges ? t('settings.unsavedChanges') : t('settings.noUnsavedChanges')}</span>
      </div>

      {connectedVersion && testAlreadyPassedForDraft && (
        <div className="notice success fade-in">
          <TestIcon size={16} />
          {t('settings.connectedTo', { version: connectedVersion })}
        </div>
      )}
    </section>
  )
}
