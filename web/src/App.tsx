import { useAppController } from "./hooks/useAppController"
import { SettingsView } from "./views/SettingsView"
import { SessionsView } from "./views/SessionsView"
import { DetailView } from "./views/DetailView"
import { HelpView } from "./views/HelpView"
import { NewSessionPickerDialog } from "./views/NewSessionPickerDialog"
import { DetailSheet } from "./views/DetailSheet"
import { DeleteSessionDialog } from "./views/DeleteSessionDialog"
import {
  SettingsIcon,
  FolderIcon,
  ChatIcon,
  HelpIcon
} from "./Icons"

function App() {
  const controller = useAppController()
  const { t, view, setView, hasConfiguredServer, config, selectedSession } = controller

  const navItems = [
    { view: "sessions" as const, label: t('nav.sessions'), icon: <FolderIcon size={19} />, disabled: !hasConfiguredServer },
    { view: "detail" as const, label: t('nav.detail'), icon: <ChatIcon size={19} />, disabled: !selectedSession },
    { view: "settings" as const, label: t('nav.settings'), icon: <SettingsIcon size={19} />, disabled: false },
    { view: "help" as const, label: t('nav.help'), icon: <HelpIcon size={19} />, disabled: false }
  ]

  return (
    <div className="app-shell">
      <header className="top-nav fade-in">
        <div className="brand-section">
          <div className="brand-title">
            <img src="/app-icon.png" alt="" className="app-icon" />
            <div>
              <h1>{t('app.title')}</h1>
              <p className="subtle">
                {hasConfiguredServer ? `${config.host}:${config.port}` : t('settings.title')}
              </p>
            </div>
          </div>
        </div>

        <nav className="desktop-nav tab-row" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.view}
              className={view === item.view ? "active" : ""}
              onClick={() => setView(item.view)}
              disabled={item.disabled}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {view === "settings" && <SettingsView controller={controller} />}

      {view === "sessions" && <SessionsView controller={controller} />}

      <NewSessionPickerDialog controller={controller} />

      {view === "detail" && <DetailView controller={controller} />}

      <DetailSheet controller={controller} />

      <DeleteSessionDialog controller={controller} />

      {view === "help" && <HelpView controller={controller} />}

      <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={view === item.view ? "active" : ""}
            onClick={() => {
              setView(item.view);
              if (item.view === "sessions") {
                requestAnimationFrame(() => document.querySelector<HTMLElement>(".session-card.active")?.scrollIntoView({ block: "center" }));
              }
            }}
            disabled={item.disabled}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
