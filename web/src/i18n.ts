export type LanguageCode = 'en' | 'fr' | 'it' | 'zh-TW'

type TranslationKey =
  | 'app.title'
  | 'nav.settings'
  | 'nav.sessions'
  | 'nav.detail'
  | 'nav.help'
  | 'menu.title'
  | 'menu.settingsDescription'
  | 'menu.sessionsDescription'
  | 'menu.detailDescription'
  | 'menu.helpDescription'
  | 'settings.title'
  | 'settings.host'
  | 'settings.hostPlaceholder'
  | 'settings.port'
  | 'settings.username'
  | 'settings.password'
  | 'settings.passwordPlaceholder'
  | 'settings.save'
  | 'settings.saving'
  | 'settings.test'
  | 'settings.testing'
  | 'settings.testingConnection'
  | 'settings.saved'
  | 'settings.connectedSaved'
  | 'settings.connectionFailed'
  | 'settings.connectedTo'
  | 'settings.language'
  | 'settings.theme'
  | 'settings.themeSystem'
  | 'settings.themeLight'
  | 'settings.themeDark'
  | 'settings.draftHint'
  | 'settings.testedNotSaved'
  | 'settings.savedButton'
  | 'settings.testOk'
  | 'settings.testNeedsFields'
  | 'settings.testAlreadyPassed'
  | 'settings.readyToTest'
  | 'settings.unsavedChanges'
  | 'settings.noUnsavedChanges'
  | 'settings.insecureHttpWarning'
  | 'connection.connecting'
  | 'connection.loadingSessions'
  | 'connection.refreshing'
  | 'connection.reconnecting'
  | 'connection.connected'
  | 'connection.offline'
  | 'sessions.loadingTitle'
  | 'sessions.loadingHint'
  | 'sessions.offlineHint'
  | 'sessions.title'
  | 'sessions.summary'
  | 'sessions.new'
  | 'sessions.creating'
  | 'sessions.refresh'
  | 'sessions.projectDirectoryLabel'
  | 'sessions.projectDirectoryPlaceholder'
  | 'sessions.projectDirectoryActive'
  | 'sessions.projectDirectoryDefault'
  | 'sessions.newSessionTitle'
  | 'sessions.useServerDefault'
  | 'sessions.useThisFolder'
  | 'sessions.parentFolder'
  | 'sessions.folderPickerLoading'
  | 'sessions.folderPickerEmpty'
  | 'sessions.projectDirectoryInvalid'
  | 'sessions.searchPlaceholder'
  | 'sessions.emptyTitle'
  | 'sessions.emptyHint'
  | 'sessions.noFileChanges'
  | 'sessions.updated'
  | 'sessions.open'
  | 'sessions.delete'
  | 'detail.backToSessions'
  | 'detail.selectSession'
  | 'detail.loading'
  | 'detail.emptyTitle'
  | 'detail.emptyHint'
  | 'detail.composerPlaceholder'
  | 'detail.waiting'
  | 'detail.send'
  | 'detail.jumpToLatest'
  | 'detail.you'
  | 'detail.opencode'
  | 'detail.projectDashboardLabel'
  | 'detail.projectLabel'
  | 'detail.vcsLabel'
  | 'detail.loadingProject'
  | 'detail.unavailable'
  | 'detail.aheadBehind'
  | 'detail.fileStatusLabel'
  | 'detail.fileStatusSource'
  | 'detail.dashboardError'
  | 'detail.changedFilesTitle'
  | 'detail.changedFilesHint'
  | 'detail.filesCount'
  | 'detail.miniDiffAria'
  | 'detail.linesAddedDeleted'
  | 'detail.modelPanelLabel'
  | 'detail.aiTitle'
  | 'detail.refreshAi'
  | 'detail.agentTitle'
  | 'detail.agentSelectLabel'
  | 'detail.agentLoading'
  | 'detail.agentLoadError'
  | 'detail.agentMode'
  | 'detail.modelTitle'
  | 'detail.modelHint'
  | 'detail.refreshModels'
  | 'detail.modelSelectLabel'
  | 'detail.modelSearchPlaceholder'
  | 'detail.modelSearchEmpty'
  | 'detail.modelDefault'
  | 'detail.modelProvider'
  | 'detail.modelContext'
  | 'detail.modelToolsYes'
  | 'detail.modelToolsNo'
  | 'detail.modelVariant'
  | 'detail.modelLoading'
  | 'detail.modelLoadError'
  | 'detail.contextStripLabel'
  | 'detail.aiChip'
  | 'detail.filesChip'
  | 'detail.detailsChip'
  | 'detail.sessionDetailsTitle'
  | 'detail.sessionDetailsHint'
  | 'detail.closeSheet'
  | 'todo.title'
  | 'todo.hide'
  | 'todo.show'
  | 'session.deleteTitle'
  | 'session.deleteBodyPrefix'
  | 'session.cancel'
  | 'session.deleteConfirm'
  | 'session.renameTitle'
  | 'session.renamePlaceholder'
  | 'session.renameConfirm'
  | 'help.title'
  | 'help.overview'
  | 'help.server'
  | 'help.network'
  | 'help.troubleshooting'
  | 'help.commands'

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    'app.title': 'OpenCode Remote',
    'nav.settings': 'Settings',
    'nav.sessions': 'Sessions',
    'nav.detail': 'Detail',
    'nav.help': 'Help',
    'menu.title': 'Menu',
    'menu.settingsDescription': 'Configure server connection',
    'menu.sessionsDescription': 'Manage your sessions',
    'menu.detailDescription': 'Chat with OpenCode',
    'menu.helpDescription': 'Documentation & support',
    'settings.title': 'Server Configuration',
    'settings.host': 'Host Address',
    'settings.hostPlaceholder': '192.168.1.100, localhost, or https://example.com',
    'settings.port': 'Port',
    'settings.username': 'Username',
    'settings.password': 'Password',
    'settings.passwordPlaceholder': 'Optional; leave blank for unsecured local server',
    'settings.save': 'Save Configuration',
    'settings.saving': 'Saving...',
    'settings.test': 'Test Connection',
    'settings.testing': 'Testing...',
    'settings.testingConnection': 'Testing connection...',
    'settings.saved': 'Configuration saved. It will be used for Sessions.',
    'settings.connectedSaved': 'Connected to OpenCode {version}. Configuration saved.',
    'settings.draftHint': 'Edits are drafts until you tap Save. Test checks the fields below without saving or changing page.',
    'settings.testedNotSaved': 'Connection OK: OpenCode {version}. Nothing was saved yet.',
    'settings.savedButton': 'Saved',
    'settings.testOk': 'Test OK',
    'settings.testNeedsFields': 'Enter host, port, and username to test.',
    'settings.testAlreadyPassed': 'This draft already passed the connection test.',
    'settings.readyToTest': 'Ready to test these fields.',
    'settings.unsavedChanges': 'Unsaved changes: tap Save to use them in Sessions.',
    'settings.noUnsavedChanges': 'Saved settings are active.',
    'settings.insecureHttpWarning': 'Warning: {host} is contacted over unencrypted HTTP outside a private network. Your credentials travel in cleartext. Prefer HTTPS or a private network (LAN, Tailscale).',
    'connection.connecting': 'Connecting to OpenCode...',
    'connection.loadingSessions': 'Connecting and loading sessions...',
    'connection.refreshing': 'Refreshing sessions...',
    'connection.reconnecting': 'Connection is slow; retrying quietly...',
    'connection.connected': 'Connected',
    'connection.offline': 'OpenCode is not reachable',
    'settings.connectionFailed': 'Connection failed: {message}',
    'settings.connectedTo': 'Connected to OpenCode {version}',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.themeSystem': 'System',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'sessions.title': 'Sessions',
    'sessions.summary': '{total} total · {active} active · {changed} changed',
    'sessions.new': 'New Session',
    'sessions.creating': 'Creating...',
    'sessions.refresh': 'Refresh',
    'sessions.projectDirectoryLabel': 'Selected folder',
    'sessions.projectDirectoryPlaceholder': '/home/you/project or C:\\Projects\\App',
    'sessions.projectDirectoryActive': 'New sessions use {directory}.',
    'sessions.projectDirectoryDefault': 'Choose the folder for this new session, or use the server default directory.',
    'sessions.newSessionTitle': 'New session folder',
    'sessions.useServerDefault': 'Use server default',
    'sessions.useThisFolder': 'Create here',
    'sessions.parentFolder': 'Parent folder',
    'sessions.folderPickerLoading': 'Loading folders...',
    'sessions.folderPickerEmpty': 'No folders here.',
    'sessions.projectDirectoryInvalid': '{directory} is not an OpenCode project folder. Pick a project/worktree folder, or use the server default.',
    'sessions.searchPlaceholder': 'Search sessions by title or directory...',
    'sessions.emptyTitle': 'No sessions found',
    'sessions.emptyHint': 'Create a new session to get started',
    'sessions.loadingTitle': 'Connecting to OpenCode',
    'sessions.loadingHint': 'Loading sessions. This can take a few seconds on mobile or after the server wakes up.',
    'sessions.offlineHint': 'OpenCode is not reachable yet. Check Settings or try Refresh.',
    'sessions.noFileChanges': 'No file changes',
    'sessions.updated': 'Updated {time}',
    'sessions.open': 'Open',
    'sessions.delete': 'Delete',
    'detail.backToSessions': '← Sessions',
    'detail.selectSession': 'Select a session',
    'detail.loading': 'Loading session...',
    'detail.emptyTitle': 'No messages yet',
    'detail.emptyHint': 'Start a conversation below',
    'detail.composerPlaceholder': 'Type a prompt or command (start with / for slash commands)...',
    'detail.waiting': 'Waiting...',
    'detail.send': 'Send',
    'detail.jumpToLatest': 'Go to latest',
    'detail.you': '👤 You',
    'detail.opencode': '🤖 OpenCode',
    'detail.projectDashboardLabel': 'Project and VCS dashboard',
    'detail.projectLabel': 'Project',
    'detail.vcsLabel': 'VCS',
    'detail.loadingProject': 'Loading...',
    'detail.unavailable': 'Unavailable',
    'detail.aheadBehind': '{ahead} ahead · {behind} behind',
    'detail.fileStatusLabel': 'Changed files',
    'detail.fileStatusSource': 'From /file/status',
    'detail.dashboardError': 'Error: {message}',
    'detail.changedFilesTitle': 'Changed files',
    'detail.changedFilesHint': 'Tap a file to see the mini diff.',
    'detail.filesCount': '{count} files',
    'detail.miniDiffAria': 'Changed files mini diff',
    'detail.linesAddedDeleted': '+{additions} lines · -{deletions} lines',
    'detail.modelPanelLabel': 'AI model picker',
    'detail.aiTitle': 'AI agent and model',
    'detail.refreshAi': 'Refresh AI options',
    'detail.agentTitle': 'Agent',
    'detail.agentSelectLabel': 'Agent for next prompt',
    'detail.agentLoading': 'Loading configured agents...',
    'detail.agentLoadError': 'Cannot load agents: {message}',
    'detail.agentMode': 'Mode: {mode}',
    'detail.modelTitle': 'AI model',
    'detail.modelHint': 'Applies to the next prompt and to new sessions. Current running replies keep their original model.',
    'detail.refreshModels': 'Refresh models',
    'detail.modelSelectLabel': 'Model for next prompt',
    'detail.modelSearchPlaceholder': 'Search models by name or provider...',
    'detail.modelSearchEmpty': 'No models match your search.',
    'detail.modelDefault': 'default',
    'detail.modelProvider': 'Provider: {provider}',
    'detail.modelContext': 'Context {context} · output {output}',
    'detail.modelToolsYes': 'Tools enabled',
    'detail.modelToolsNo': 'No tools',
    'detail.modelVariant': 'Variant: {variant}',
    'detail.modelLoading': 'Loading configured models...',
    'detail.modelLoadError': 'Cannot load models: {message}',
    'detail.contextStripLabel': 'Session context shortcuts',
    'detail.aiChip': 'AI',
    'detail.filesChip': 'Files',
    'detail.detailsChip': 'Details',
    'detail.sessionDetailsTitle': 'Session details',
    'detail.sessionDetailsHint': 'Advanced project, VCS, file and model information.',
    'detail.closeSheet': 'Close',
    'todo.title': 'Todo Items',
    'todo.hide': 'Hide',
    'todo.show': 'Show',
    'session.deleteTitle': 'Delete session?',
    'session.deleteBodyPrefix': 'This will permanently delete',
    'session.cancel': 'Cancel',
    'session.deleteConfirm': 'Delete session',
    'session.renameTitle': 'Rename session',
    'session.renamePlaceholder': 'Enter new name...',
    'session.renameConfirm': 'Rename',
    'help.title': 'Help & Documentation',
    'help.overview': 'Overview',
    'help.server': 'Server',
    'help.network': 'Network',
    'help.troubleshooting': 'Troubleshooting',
    'help.commands': 'Commands'
  },
  fr: {
    'app.title': 'OpenCode Remote',
    'nav.settings': 'Réglages',
    'nav.sessions': 'Sessions',
    'nav.detail': 'Détail',
    'nav.help': 'Aide',
    'menu.title': 'Menu',
    'menu.settingsDescription': 'Configurer la connexion au serveur',
    'menu.sessionsDescription': 'Gérer vos sessions',
    'menu.detailDescription': 'Discuter avec OpenCode',
    'menu.helpDescription': 'Documentation et support',
    'settings.title': 'Configuration du serveur',
    'settings.host': 'Adresse de l’hôte',
    'settings.hostPlaceholder': '192.168.1.100, localhost ou https://exemple.com',
    'settings.port': 'Port',
    'settings.username': 'Nom d’utilisateur',
    'settings.password': 'Mot de passe',
    'settings.passwordPlaceholder': 'Optionnel ; laisser vide pour un serveur local non protégé',
    'settings.save': 'Enregistrer la configuration',
    'settings.saving': 'Enregistrement…',
    'settings.test': 'Tester la connexion',
    'settings.testing': 'Test…',
    'settings.testingConnection': 'Test de la connexion…',
    'settings.saved': 'Configuration enregistrée. Elle sera utilisée dans Sessions.',
    'settings.connectedSaved': 'Connecté à OpenCode {version}. Configuration enregistrée.',
    'settings.draftHint': 'Les modifications restent des brouillons tant que vous ne touchez pas Enregistrer. Test vérifie les champs ci-dessous sans enregistrer ni changer de page.',
    'settings.testedNotSaved': 'Connexion OK : OpenCode {version}. Rien n’a encore été enregistré.',
    'settings.savedButton': 'Enregistré',
    'settings.testOk': 'Test OK',
    'settings.testNeedsFields': 'Saisissez hôte, port et nom d’utilisateur pour tester.',
    'settings.testAlreadyPassed': 'Ce brouillon a déjà passé le test de connexion.',
    'settings.readyToTest': 'Champs prêts pour le test.',
    'settings.unsavedChanges': 'Modifications non enregistrées : touchez Enregistrer pour les utiliser dans Sessions.',
    'settings.noUnsavedChanges': 'Les réglages enregistrés sont actifs.',
    'settings.insecureHttpWarning': 'Attention : {host} est contacté en HTTP non chiffré hors d’un réseau privé. Vos identifiants circulent en clair. Préférez HTTPS ou un réseau privé (LAN, Tailscale).',
    'connection.connecting': 'Connexion à OpenCode…',
    'connection.loadingSessions': 'Connexion et chargement des sessions…',
    'connection.refreshing': 'Actualisation des sessions…',
    'connection.reconnecting': 'Connexion lente ; nouvelle tentative en silence…',
    'connection.connected': 'Connecté',
    'connection.offline': 'OpenCode est injoignable',
    'settings.connectionFailed': 'Échec de la connexion : {message}',
    'settings.connectedTo': 'Connecté à OpenCode {version}',
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.themeSystem': 'Système',
    'settings.themeLight': 'Clair',
    'settings.themeDark': 'Sombre',
    'sessions.title': 'Sessions',
    'sessions.summary': '{total} au total · {active} actives · {changed} modifiées',
    'sessions.new': 'Nouvelle session',
    'sessions.creating': 'Création…',
    'sessions.refresh': 'Actualiser',
    'sessions.projectDirectoryLabel': 'Dossier sélectionné',
    'sessions.projectDirectoryPlaceholder': '/home/vous/projet ou C:\\Projects\\App',
    'sessions.projectDirectoryActive': 'Les nouvelles sessions utiliseront {directory}.',
    'sessions.projectDirectoryDefault': 'Choisissez le dossier de cette nouvelle session, ou utilisez le dossier par défaut du serveur.',
    'sessions.newSessionTitle': 'Dossier de la nouvelle session',
    'sessions.useServerDefault': 'Défaut du serveur',
    'sessions.useThisFolder': 'Créer ici',
    'sessions.parentFolder': 'Dossier parent',
    'sessions.folderPickerLoading': 'Chargement des dossiers…',
    'sessions.folderPickerEmpty': 'Aucun dossier ici.',
    'sessions.projectDirectoryInvalid': '{directory} n’est pas un dossier de projet OpenCode. Choisissez un dossier projet/worktree, ou le dossier par défaut du serveur.',
    'sessions.searchPlaceholder': 'Rechercher des sessions par titre ou dossier…',
    'sessions.emptyTitle': 'Aucune session trouvée',
    'sessions.emptyHint': 'Créez une nouvelle session pour commencer',
    'sessions.loadingTitle': 'Connexion à OpenCode',
    'sessions.loadingHint': 'Chargement des sessions. Cela peut prendre quelques secondes sur mobile ou après la sortie de veille du serveur.',
    'sessions.offlineHint': 'OpenCode n’est pas encore joignable. Vérifiez Réglages ou réessayez avec Actualiser.',
    'sessions.noFileChanges': 'Aucune modification de fichier',
    'sessions.updated': 'Mise à jour {time}',
    'sessions.open': 'Ouvrir',
    'sessions.delete': 'Supprimer',
    'detail.backToSessions': '← Sessions',
    'detail.selectSession': 'Sélectionnez une session',
    'detail.loading': 'Chargement de la session…',
    'detail.emptyTitle': 'Aucun message pour le moment',
    'detail.emptyHint': 'Démarrez une conversation ci-dessous',
    'detail.composerPlaceholder': 'Saisissez un prompt ou une commande (commencez par / pour les commandes slash)…',
    'detail.waiting': 'En attente…',
    'detail.send': 'Envoyer',
    'detail.jumpToLatest': 'Aller au plus récent',
    'detail.you': '👤 Vous',
    'detail.opencode': '🤖 OpenCode',
    'detail.projectDashboardLabel': 'Tableau de bord projet et VCS',
    'detail.projectLabel': 'Projet',
    'detail.vcsLabel': 'VCS',
    'detail.loadingProject': 'Chargement…',
    'detail.unavailable': 'Indisponible',
    'detail.aheadBehind': '{ahead} en avance · {behind} en retard',
    'detail.fileStatusLabel': 'Fichiers modifiés',
    'detail.fileStatusSource': 'Depuis /file/status',
    'detail.dashboardError': 'Erreur : {message}',
    'detail.changedFilesTitle': 'Fichiers modifiés',
    'detail.changedFilesHint': 'Touchez un fichier pour voir le mini diff.',
    'detail.filesCount': '{count} fichiers',
    'detail.miniDiffAria': 'Mini diff des fichiers modifiés',
    'detail.linesAddedDeleted': '+{additions} lignes · -{deletions} lignes',
    'detail.modelPanelLabel': 'Sélecteur de modèle IA',
    'detail.aiTitle': 'Agent et modèle IA',
    'detail.refreshAi': 'Actualiser les options IA',
    'detail.agentTitle': 'Agent',
    'detail.agentSelectLabel': 'Agent pour le prochain prompt',
    'detail.agentLoading': 'Chargement des agents configurés…',
    'detail.agentLoadError': 'Impossible de charger les agents : {message}',
    'detail.agentMode': 'Mode : {mode}',
    'detail.modelTitle': 'Modèle IA',
    'detail.modelHint': 'S’applique au prochain prompt et aux nouvelles sessions. Les réponses en cours conservent leur modèle d’origine.',
    'detail.refreshModels': 'Actualiser les modèles',
    'detail.modelSelectLabel': 'Modèle pour le prochain prompt',
    'detail.modelSearchPlaceholder': 'Rechercher des modèles par nom ou fournisseur…',
    'detail.modelSearchEmpty': 'Aucun modèle ne correspond à votre recherche.',
    'detail.modelDefault': 'défaut',
    'detail.modelProvider': 'Fournisseur : {provider}',
    'detail.modelContext': 'Contexte {context} · sortie {output}',
    'detail.modelToolsYes': 'Outils activés',
    'detail.modelToolsNo': 'Aucun outil',
    'detail.modelVariant': 'Variante : {variant}',
    'detail.modelLoading': 'Chargement des modèles configurés…',
    'detail.modelLoadError': 'Impossible de charger les modèles : {message}',
    'detail.contextStripLabel': 'Raccourcis du contexte de session',
    'detail.aiChip': 'IA',
    'detail.filesChip': 'Fichiers',
    'detail.detailsChip': 'Détails',
    'detail.sessionDetailsTitle': 'Détails de la session',
    'detail.sessionDetailsHint': 'Informations avancées sur le projet, le VCS, les fichiers et le modèle.',
    'detail.closeSheet': 'Fermer',
    'todo.title': 'Tâches',
    'todo.hide': 'Masquer',
    'todo.show': 'Afficher',
    'session.deleteTitle': 'Supprimer la session ?',
    'session.deleteBodyPrefix': 'Cela supprimera définitivement',
    'session.cancel': 'Annuler',
    'session.deleteConfirm': 'Supprimer la session',
    'session.renameTitle': 'Renommer la session',
    'session.renamePlaceholder': 'Saisissez un nouveau nom…',
    'session.renameConfirm': 'Renommer',
    'help.title': 'Aide et documentation',
    'help.overview': 'Vue d’ensemble',
    'help.server': 'Serveur',
    'help.network': 'Réseau',
    'help.troubleshooting': 'Dépannage',
    'help.commands': 'Commandes'
  },
  it: {
    'app.title': 'OpenCode Remote',
    'nav.settings': 'Impostazioni',
    'nav.sessions': 'Sessioni',
    'nav.detail': 'Dettaglio',
    'nav.help': 'Aiuto',
    'menu.title': 'Menu',
    'menu.settingsDescription': 'Configura connessione server',
    'menu.sessionsDescription': 'Gestisci le sessioni',
    'menu.detailDescription': 'Chatta con OpenCode',
    'menu.helpDescription': 'Documentazione e supporto',
    'settings.title': 'Configurazione server',
    'settings.host': 'Indirizzo host',
    'settings.hostPlaceholder': '192.168.1.100, localhost o https://example.com',
    'settings.port': 'Porta',
    'settings.username': 'Username',
    'settings.password': 'Password',
    'settings.passwordPlaceholder': 'Opzionale; lascia vuoto per server locale non protetto',
    'settings.save': 'Salva configurazione',
    'settings.saving': 'Salvataggio...',
    'settings.test': 'Test connessione',
    'settings.testing': 'Test...',
    'settings.testingConnection': 'Test connessione...',
    'settings.saved': 'Configurazione salvata. Verrà usata nelle Sessioni.',
    'settings.connectedSaved': 'Connesso a OpenCode {version}. Configurazione salvata.',
    'settings.draftHint': 'Le modifiche restano in bozza finché tocchi Salva. Test controlla i campi qui sotto senza salvare né cambiare pagina.',
    'settings.testedNotSaved': 'Connessione OK: OpenCode {version}. Non è stato ancora salvato nulla.',
    'settings.savedButton': 'Salvato',
    'settings.testOk': 'Test OK',
    'settings.testNeedsFields': 'Inserisci host, porta e username per fare il test.',
    'settings.testAlreadyPassed': 'Questa bozza ha già superato il test connessione.',
    'settings.readyToTest': 'Campi pronti per il test.',
    'settings.unsavedChanges': 'Modifiche non salvate: tocca Salva per usarle nelle Sessioni.',
    'settings.noUnsavedChanges': 'Le impostazioni salvate sono attive.',
    'settings.insecureHttpWarning': 'Attenzione: {host} viene contattato tramite HTTP non cifrato al di fuori di una rete privata. Le tue credenziali viaggiano in chiaro. Preferisci HTTPS o una rete privata (LAN, Tailscale).',
    'connection.connecting': 'Connessione a OpenCode...',
    'connection.loadingSessions': 'Connessione e caricamento sessioni...',
    'connection.refreshing': 'Aggiornamento sessioni...',
    'connection.reconnecting': 'Connessione lenta; riprovo in silenzio...',
    'connection.connected': 'Connesso',
    'connection.offline': 'OpenCode non è raggiungibile',
    'settings.connectionFailed': 'Connessione fallita: {message}',
    'settings.connectedTo': 'Connesso a OpenCode {version}',
    'settings.language': 'Lingua',
    'settings.theme': 'Tema',
    'settings.themeSystem': 'Sistema',
    'settings.themeLight': 'Chiaro',
    'settings.themeDark': 'Scuro',
    'sessions.title': 'Sessioni',
    'sessions.summary': '{total} totali · {active} attive · {changed} con modifiche',
    'sessions.new': 'Nuova sessione',
    'sessions.creating': 'Creazione...',
    'sessions.refresh': 'Aggiorna',
    'sessions.projectDirectoryLabel': 'Cartella selezionata',
    'sessions.projectDirectoryPlaceholder': '/home/utente/progetto o C:\\Projects\\App',
    'sessions.projectDirectoryActive': 'La nuova sessione userà {directory}.',
    'sessions.projectDirectoryDefault': 'Scegli la cartella per questa nuova sessione, oppure usa la directory predefinita del server.',
    'sessions.newSessionTitle': 'Cartella nuova sessione',
    'sessions.useServerDefault': 'Usa default server',
    'sessions.useThisFolder': 'Crea qui',
    'sessions.parentFolder': 'Cartella superiore',
    'sessions.folderPickerLoading': 'Caricamento cartelle...',
    'sessions.folderPickerEmpty': 'Nessuna cartella qui.',
    'sessions.projectDirectoryInvalid': '{directory} non è una cartella progetto OpenCode. Scegli una cartella progetto/worktree oppure usa il default del server.',
    'sessions.searchPlaceholder': 'Cerca sessioni per titolo o cartella...',
    'sessions.emptyTitle': 'Nessuna sessione trovata',
    'sessions.emptyHint': 'Crea una nuova sessione per iniziare',
    'sessions.loadingTitle': 'Connessione a OpenCode',
    'sessions.loadingHint': 'Carico le sessioni. Su mobile o dopo il risveglio del server può volerci qualche secondo.',
    'sessions.offlineHint': 'OpenCode non è ancora raggiungibile. Controlla Impostazioni o riprova con Aggiorna.',
    'sessions.noFileChanges': 'Nessuna modifica ai file',
    'sessions.updated': 'Aggiornata {time}',
    'sessions.open': 'Apri',
    'sessions.delete': 'Elimina',
    'detail.backToSessions': '← Sessioni',
    'detail.selectSession': 'Seleziona una sessione',
    'detail.loading': 'Caricamento sessione...',
    'detail.emptyTitle': 'Ancora nessun messaggio',
    'detail.emptyHint': 'Inizia una conversazione qui sotto',
    'detail.composerPlaceholder': 'Scrivi un prompt o comando (inizia con / per gli slash command)...',
    'detail.waiting': 'Attesa...',
    'detail.send': 'Invia',
    'detail.jumpToLatest': 'Vai alla fine',
    'detail.you': '👤 Tu',
    'detail.opencode': '🤖 OpenCode',
    'detail.projectDashboardLabel': 'Dashboard progetto e VCS',
    'detail.projectLabel': 'Progetto',
    'detail.vcsLabel': 'VCS',
    'detail.loadingProject': 'Caricamento...',
    'detail.unavailable': 'Non disponibile',
    'detail.aheadBehind': '{ahead} avanti · {behind} indietro',
    'detail.fileStatusLabel': 'File modificati',
    'detail.fileStatusSource': 'Da /file/status',
    'detail.dashboardError': 'Errore: {message}',
    'detail.changedFilesTitle': 'File modificati',
    'detail.changedFilesHint': 'Tocca un file per vedere il mini diff.',
    'detail.filesCount': '{count} file',
    'detail.miniDiffAria': 'Mini diff dei file modificati',
    'detail.linesAddedDeleted': '+{additions} righe · -{deletions} righe',
    'detail.modelPanelLabel': 'Selettore modello AI',
    'detail.aiTitle': 'Agente e modello AI',
    'detail.refreshAi': 'Aggiorna opzioni AI',
    'detail.agentTitle': 'Agente',
    'detail.agentSelectLabel': 'Agente per il prossimo prompt',
    'detail.agentLoading': 'Caricamento agenti configurati...',
    'detail.agentLoadError': 'Impossibile caricare gli agenti: {message}',
    'detail.agentMode': 'Modalità: {mode}',
    'detail.modelTitle': 'Modello AI',
    'detail.modelHint': 'Si applica al prossimo prompt e alle nuove sessioni. Le risposte già in corso restano sul modello originale.',
    'detail.refreshModels': 'Aggiorna modelli',
    'detail.modelSelectLabel': 'Modello per il prossimo prompt',
    'detail.modelSearchPlaceholder': 'Cerca modelli per nome o provider...',
    'detail.modelSearchEmpty': 'Nessun modello corrisponde alla ricerca.',
    'detail.modelDefault': 'default',
    'detail.modelProvider': 'Provider: {provider}',
    'detail.modelContext': 'Contesto {context} · output {output}',
    'detail.modelToolsYes': 'Tool abilitati',
    'detail.modelToolsNo': 'Nessun tool',
    'detail.modelVariant': 'Variante: {variant}',
    'detail.modelLoading': 'Caricamento modelli configurati...',
    'detail.modelLoadError': 'Impossibile caricare i modelli: {message}',
    'detail.contextStripLabel': 'Scorciatoie contesto sessione',
    'detail.aiChip': 'AI',
    'detail.filesChip': 'File',
    'detail.detailsChip': 'Dettagli',
    'detail.sessionDetailsTitle': 'Dettagli sessione',
    'detail.sessionDetailsHint': 'Informazioni avanzate su progetto, VCS, file e modello.',
    'detail.closeSheet': 'Chiudi',
    'todo.title': 'Todo',
    'todo.hide': 'Nascondi',
    'todo.show': 'Mostra',
    'session.deleteTitle': 'Eliminare la sessione?',
    'session.deleteBodyPrefix': 'Questo eliminerà definitivamente',
    'session.cancel': 'Annulla',
    'session.deleteConfirm': 'Elimina sessione',
    'session.renameTitle': 'Rinomina sessione',
    'session.renamePlaceholder': 'Inserisci nuovo nome...',
    'session.renameConfirm': 'Rinomina',
    'help.title': 'Aiuto e documentazione',
    'help.overview': 'Panoramica',
    'help.server': 'Server',
    'help.network': 'Rete',
    'help.troubleshooting': 'Risoluzione problemi',
    'help.commands': 'Comandi'
  },
  'zh-TW': {
    'app.title': 'OpenCode 遠端',
    'nav.settings': '設定',
    'nav.sessions': '工作階段',
    'nav.detail': '詳情',
    'nav.help': '說明',
    'menu.title': '選單',
    'menu.settingsDescription': '設定伺服器連線',
    'menu.sessionsDescription': '管理工作階段',
    'menu.detailDescription': '與 OpenCode 對話',
    'menu.helpDescription': '文件與支援',
    'settings.title': '伺服器設定',
    'settings.host': '主機位址',
    'settings.hostPlaceholder': '192.168.1.100、localhost 或 https://example.com',
    'settings.port': '連接埠',
    'settings.username': '使用者名稱',
    'settings.password': '密碼',
    'settings.passwordPlaceholder': '選填；未受保護的本機伺服器可留空',
    'settings.save': '儲存設定',
    'settings.saving': '儲存中...',
    'settings.test': '測試連線',
    'settings.testing': '測試中...',
    'settings.testingConnection': '正在測試連線...',
    'settings.saved': '設定已儲存，將用於工作階段。',
    'settings.connectedSaved': '已連線至 OpenCode {version}。設定已儲存。',
    'settings.draftHint': '變更會保持草稿，直到點選儲存。測試只檢查下方欄位，不會儲存或切換頁面。',
    'settings.testedNotSaved': '連線正常：OpenCode {version}。尚未儲存任何變更。',
    'settings.savedButton': '已儲存',
    'settings.testOk': '測試正常',
    'settings.testNeedsFields': '請輸入主機、連接埠與使用者名稱以測試。',
    'settings.testAlreadyPassed': '此草稿已通過連線測試。',
    'settings.readyToTest': '欄位已可測試。',
    'settings.unsavedChanges': '有未儲存變更：點選儲存後才會用於工作階段。',
    'settings.noUnsavedChanges': '已儲存的設定正在使用中。',
    'settings.insecureHttpWarning': '警告：{host} 在私人網路之外以未加密的 HTTP 連線。您的憑證將以明文傳輸。請改用 HTTPS 或私人網路（LAN、Tailscale）。',
    'connection.connecting': '正在連線到 OpenCode...',
    'connection.loadingSessions': '正在連線並載入工作階段...',
    'connection.refreshing': '正在重新整理工作階段...',
    'connection.reconnecting': '連線較慢；正在安靜重試...',
    'connection.connected': '已連線',
    'connection.offline': '無法連線到 OpenCode',
    'settings.connectionFailed': '連線失敗：{message}',
    'settings.connectedTo': '已連線至 OpenCode {version}',
    'settings.language': '語言',
    'settings.theme': '主題',
    'settings.themeSystem': '跟隨系統',
    'settings.themeLight': '淺色',
    'settings.themeDark': '深色',
    'sessions.title': '工作階段',
    'sessions.summary': '{total} 總數 · {active} 進行中 · {changed} 有變更',
    'sessions.new': '新增工作階段',
    'sessions.creating': '建立中...',
    'sessions.refresh': '重新整理',
    'sessions.projectDirectoryLabel': '已選資料夾',
    'sessions.projectDirectoryPlaceholder': '/home/you/project 或 C:\\Projects\\App',
    'sessions.projectDirectoryActive': '新工作階段會使用 {directory}。',
    'sessions.projectDirectoryDefault': '為這個新工作階段選擇資料夾，或使用伺服器預設目錄。',
    'sessions.newSessionTitle': '新工作階段資料夾',
    'sessions.useServerDefault': '使用伺服器預設',
    'sessions.useThisFolder': '在這裡建立',
    'sessions.parentFolder': '上一層資料夾',
    'sessions.folderPickerLoading': '正在載入資料夾...',
    'sessions.folderPickerEmpty': '這裡沒有資料夾。',
    'sessions.projectDirectoryInvalid': '{directory} 不是 OpenCode 專案資料夾。請選擇專案/worktree 資料夾，或使用伺服器預設。',
    'sessions.searchPlaceholder': '依標題或目錄搜尋工作階段...',
    'sessions.emptyTitle': '找不到工作階段',
    'sessions.emptyHint': '建立新的工作階段以開始',
    'sessions.loadingTitle': '正在連線到 OpenCode',
    'sessions.loadingHint': '正在載入工作階段。行動裝置或伺服器剛喚醒時可能需要幾秒。',
    'sessions.offlineHint': '尚無法連線到 OpenCode。請檢查設定或重新整理。',
    'sessions.noFileChanges': '沒有檔案變更',
    'sessions.updated': '更新於 {time}',
    'sessions.open': '開啟',
    'sessions.delete': '刪除',
    'detail.backToSessions': '← 工作階段',
    'detail.selectSession': '選擇工作階段',
    'detail.loading': '載入工作階段...',
    'detail.emptyTitle': '尚無訊息',
    'detail.emptyHint': '在下方開始對話',
    'detail.composerPlaceholder': '輸入提示或命令（以 / 開頭使用斜線命令）...',
    'detail.waiting': '等待中...',
    'detail.send': '傳送',
    'detail.jumpToLatest': '前往最新',
    'detail.you': '👤 你',
    'detail.opencode': '🤖 OpenCode',
    'detail.projectDashboardLabel': '專案與 VCS 儀表板',
    'detail.projectLabel': '專案',
    'detail.vcsLabel': 'VCS',
    'detail.loadingProject': '載入中...',
    'detail.unavailable': '無法取得',
    'detail.aheadBehind': '超前 {ahead} · 落後 {behind}',
    'detail.fileStatusLabel': '已變更檔案',
    'detail.fileStatusSource': '來自 /file/status',
    'detail.dashboardError': '錯誤：{message}',
    'detail.changedFilesTitle': '已變更檔案',
    'detail.changedFilesHint': '點選檔案查看迷你 diff。',
    'detail.filesCount': '{count} 個檔案',
    'detail.miniDiffAria': '已變更檔案迷你 diff',
    'detail.linesAddedDeleted': '+{additions} 行 · -{deletions} 行',
    'detail.modelPanelLabel': 'AI 模型選擇器',
    'detail.aiTitle': 'AI 代理與模型',
    'detail.refreshAi': '重新整理 AI 選項',
    'detail.agentTitle': '代理',
    'detail.agentSelectLabel': '下一個提示的代理',
    'detail.agentLoading': '正在載入已設定代理...',
    'detail.agentLoadError': '無法載入代理：{message}',
    'detail.agentMode': '模式：{mode}',
    'detail.modelTitle': 'AI 模型',
    'detail.modelHint': '套用到下一個提示與新工作階段。進行中的回覆仍使用原本模型。',
    'detail.refreshModels': '重新整理模型',
    'detail.modelSelectLabel': '下一個提示的模型',
    'detail.modelSearchPlaceholder': '依名稱或提供者搜尋模型...',
    'detail.modelSearchEmpty': '沒有符合搜尋的模型。',
    'detail.modelDefault': '預設',
    'detail.modelProvider': '提供者：{provider}',
    'detail.modelContext': '上下文 {context} · 輸出 {output}',
    'detail.modelToolsYes': '已啟用工具',
    'detail.modelToolsNo': '無工具',
    'detail.modelVariant': '變體：{variant}',
    'detail.modelLoading': '正在載入已設定模型...',
    'detail.modelLoadError': '無法載入模型：{message}',
    'detail.contextStripLabel': '工作階段情境捷徑',
    'detail.aiChip': 'AI',
    'detail.filesChip': '檔案',
    'detail.detailsChip': '詳細資訊',
    'detail.sessionDetailsTitle': '工作階段詳細資訊',
    'detail.sessionDetailsHint': '專案、VCS、檔案與模型的進階資訊。',
    'detail.closeSheet': '關閉',
    'todo.title': '待辦事項',
    'todo.hide': '隱藏',
    'todo.show': '顯示',
    'session.deleteTitle': '刪除工作階段？',
    'session.deleteBodyPrefix': '這會永久刪除',
    'session.cancel': '取消',
    'session.deleteConfirm': '刪除工作階段',
    'session.renameTitle': '重新命名工作階段',
    'session.renamePlaceholder': '輸入新名稱...',
    'session.renameConfirm': '重新命名',
    'help.title': '說明與文件',
    'help.overview': '總覽',
    'help.server': '伺服器',
    'help.network': '網路',
    'help.troubleshooting': '疑難排解',
    'help.commands': '命令'
  }
}

export const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'zh-TW', label: '繁體中文' }
]

export function normalizeLanguage(value: string | null | undefined): LanguageCode {
  if (value === 'fr' || value?.toLowerCase().startsWith('fr')) return 'fr'
  if (value === 'it' || value?.toLowerCase().startsWith('it')) return 'it'
  if (value === 'zh-TW' || value?.toLowerCase().startsWith('zh')) return 'zh-TW'
  return 'en'
}

export function createTranslator(language: LanguageCode) {
  return (key: string, params: Record<string, string | number> = {}) => {
    const template = translations[language][key as TranslationKey] ?? translations.en[key as TranslationKey] ?? key
    return Object.entries(params).reduce(
      (text, [name, value]) => text.split(`{${name}}`).join(String(value)),
      template
    )
  }
}
