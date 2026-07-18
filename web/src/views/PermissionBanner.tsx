import type { AppController } from "../hooks/useAppController"

export function PermissionBanner({ controller }: { controller: AppController }) {
  const {
    t,
    selectedSessionPermissions,
    respondPermission,
    replyingPermissionID
  } = controller

  if (selectedSessionPermissions.length === 0) return null

  return (
    <div className="permission-banner fade-in" role="alert">
      <h3>🔐 {t('permission.title')}</h3>
      {selectedSessionPermissions.map((permission) => (
        <div key={permission.id} className="permission-item">
          <div className="permission-detail">
            <strong>{permission.action}</strong>
            {permission.resources.length > 0 && (
              <code>{permission.resources.join(", ")}</code>
            )}
          </div>
          <div className="permission-actions">
            <button
              className="btn-primary compact"
              disabled={replyingPermissionID === permission.id}
              onClick={() => respondPermission(permission, "once").catch(() => undefined)}
            >
              {t('permission.allow')}
            </button>
            <button
              className="btn-secondary compact"
              disabled={replyingPermissionID === permission.id}
              onClick={() => respondPermission(permission, "always").catch(() => undefined)}
            >
              {t('permission.always')}
            </button>
            <button
              className="btn-danger compact"
              disabled={replyingPermissionID === permission.id}
              onClick={() => respondPermission(permission, "reject").catch(() => undefined)}
            >
              {t('permission.reject')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
