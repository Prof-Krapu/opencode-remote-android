import type { AppController } from "../hooks/useAppController"
import { parentDirectory } from "../utils"
import { FolderIcon, LoadingIcon, PlusIcon } from "../Icons"

export function NewSessionPickerDialog({ controller }: { controller: AppController }) {
  const {
    t,
    showNewSessionPicker,
    setShowNewSessionPicker,
    pickerPath,
    pickerError,
    pickerLoading,
    pickerItems,
    creatingSession,
    createSession,
    browseNewSessionDirectory
  } = controller

  if (!showNewSessionPicker) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={() => setShowNewSessionPicker(false)}>
      <section
        className="modal-card folder-picker fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-session-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="new-session-title">{t('sessions.newSessionTitle')}</h2>
        <p className="subtle">{t('sessions.projectDirectoryDefault')}</p>
        <div className="folder-picker-current">
          <span>{t('sessions.projectDirectoryLabel')}</span>
          <strong>{pickerPath || t('detail.loadingProject')}</strong>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn-secondary" onClick={() => createSession("").catch(() => undefined)} disabled={creatingSession}>
            {t('sessions.useServerDefault')}
          </button>
          <button type="button" className="btn-primary" onClick={() => createSession(pickerPath).catch(() => undefined)} disabled={creatingSession || !pickerPath}>
            {creatingSession ? <LoadingIcon size={16} /> : <PlusIcon size={16} />}
            {t('sessions.useThisFolder')}
          </button>
        </div>
        {pickerError && <div className="error fade-in">✗ {pickerError}</div>}
        <div className="folder-list">
          {pickerLoading ? (
            <div className="empty-state compact"><LoadingIcon size={28} /><p>{t('sessions.folderPickerLoading')}</p></div>
          ) : (
            <>
              {parentDirectory(pickerPath) && (
                <button type="button" className="folder-row" onClick={() => browseNewSessionDirectory(parentDirectory(pickerPath) ?? pickerPath).catch(() => undefined)}>
                  <FolderIcon size={16} />
                  <span>{t('sessions.parentFolder')}</span>
                </button>
              )}
              {pickerItems.length === 0 ? (
                <p className="subtle">{t('sessions.folderPickerEmpty')}</p>
              ) : pickerItems.map((item) => (
                <button key={item.absolute} type="button" className="folder-row" onClick={() => browseNewSessionDirectory(item.absolute).catch(() => undefined)}>
                  <FolderIcon size={16} />
                  <span>{item.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setShowNewSessionPicker(false)}>
            {t('session.cancel')}
          </button>
        </div>
      </section>
    </div>
  )
}
