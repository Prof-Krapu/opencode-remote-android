import type { AppController } from "../hooks/useAppController"
import { TrashIcon } from "../Icons"

export function DeleteSessionDialog({ controller }: { controller: AppController }) {
  const {
    t,
    sessionToDelete,
    setSessionToDelete,
    deleteSession
  } = controller

  if (!sessionToDelete) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={() => setSessionToDelete(null)}>
      <section
        className="modal-card fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-session-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-session-title">{t('session.deleteTitle')}</h2>
        <p>
          {t('session.deleteBodyPrefix')} <strong>{sessionToDelete.title}</strong>.
        </p>
        <p className="subtle">{sessionToDelete.directory}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setSessionToDelete(null)}>
            {t('session.cancel')}
          </button>
          <button className="btn-danger" onClick={() => deleteSession(sessionToDelete.id)}>
            <TrashIcon size={16} />
            {t('session.deleteConfirm')}
          </button>
        </div>
      </section>
    </div>
  )
}
