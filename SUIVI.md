# SUIVI.md — opencode-remote-android (fork perso Prof-Krapu)

> **Point d'ancrage de session.** Si tu reprends ce chantier (ex. via `opencode --continue`), **lis ce fichier en entier avant toute action**. Il est la source de vérité de l'état d'avancement, des décisions et des gotchas.

## Contexte

Fork personnel de [`giuliastro/opencode-remote-android`](https://github.com/giuliastro/opencode-remote-android) (Apache-2.0, v1.4.0 à la base) : app Android companion (React 18 + TS + Vite + Capacitor 8) pour piloter un serveur **opencode** depuis un téléphone. Objectif : équivalent du `/remote-control` de Claude Code, **usage personnel uniquement** (pas de PR upstream, décision du 2026-07-18).

- **Fork** : `Prof-Krapu/opencode-remote-android` (public — contrainte GitHub pour les forks de repos publics)
- **Remotes git** : `origin` = fork Prof-Krapu, `upstream` = giuliastro
- **Téléphone cible** : OnePlus Nord 4 (Android, actif sur le tailnet)
- **Build APK** : 100 % cloud via GitHub Actions (`.github/workflows/android-apk.yml`), signé avec le keystore perso (secrets déjà configurés)

## État d'avancement

| Phase | Objet | État |
|---|---|---|
| **A** | Service systemd `opencode-serve` sur le PC | ✅ **FAIT** (2026-07-18) |
| **0** | Fork + keystore + secrets + CI cloud verte | ✅ **FAIT** (run 29623299820, 2m42s) |
| **1** | Locale FR · tests en CI · polling adaptatif · warning sécu http | ✅ **FAIT** (CI verte run 29623754301) |
| **3** | Refactor `App.tsx` (85 Ko → `views/` + `hooks/`) | ✅ **FAIT** (commit be31c38, 4 suites + tsc verts) |
| **2** | Permissions à distance + rendu tool calls | ✅ **FAIT** — ⚠️ validé contre l'OpenAPI mais **pas encore testé sur une vraie demande de permission live** (aucune en attente au moment du dev) |
| **4** | Release `v1.5.0` signée + livraison APK | 🔄 en cours |

## Phase A — serveur opencode (FAIT)

- **Service** : `systemctl --user status opencode-serve` (enabled, linger actif)
- **Bind** : `100.100.128.63:4096` (**IP Tailscale uniquement** — invisible du LAN/Internet ; le funnel est saturé : 443/8443/10000 déjà pris, mais le tailnet n'en a pas besoin)
- **Auth** : HTTP Basic, identifiants dans `~/.config/opencode-serve/env` (chmod 600) — **ne jamais committer ces valeurs**
- **WorkingDirectory** : `~/Documents` ; unit file : `~/.config/systemd/user/opencode-serve.service` (avec `ExecStartPre` qui attend `tailscale0`)
- Vérifs passées : 401 sans auth · `/global/health` → `{"healthy":true,"version":"1.17.15"}` · `/session` liste les sessions réelles
- **OpenAPI de référence** (pour la Phase 2) : `curl -u opencode:$(grep -oP 'OPENCODE_SERVER_PASSWORD=\K.*' ~/.config/opencode-serve/env) http://100.100.128.63:4096/doc` — copie figée dans `/tmp/opencode-remote/openapi.json` (éphémère, re-fetch si absent)

## Phase 0 — fork & CI (EN COURS)

- Keystore : `~/.config/opencode-remote/release.keystore` (600), mot de passe dans `~/.config/opencode-remote/env` (600), alias `opencode-remote`. **Jamais dans le repo.**
- 4 secrets GitHub configurés sur le fork : `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`
- Actions activées via `gh api -X PUT /repos/Prof-Krapu/opencode-remote-android/actions/permissions -F enabled=true` (forks = Actions désactivées par défaut ; `-f` envoie une string → utiliser `-F` booléen)
- Build test : `gh workflow run android-apk.yml -R Prof-Krapu/opencode-remote-android` → vérifier artefact `app-release-signed.apk` présent et signé

## Architecture actuelle (post-refactor, v1.5.0)

- `web/src/hooks/useAppController.ts` — **toute la logique** (état, mémos, handlers, effets, polling) ; retourne un objet `AppController` passé tel quel aux vues. **Garder l'ordre des déclarations** (settings-regression utilise des regex ordre-dépendants : `saveConfig` → `testConnection` → `refreshSessions`).
- `web/src/utils.ts` — fonctions pures + constantes `*_STORAGE_KEY` + `defaultConfig`.
- `web/src/views/` — `SettingsView`, `SessionsView`, `DetailView`, `HelpView`, overlays `NewSessionPickerDialog`/`DetailSheet`/`DeleteSessionDialog`, plus `PermissionBanner` et `MessagePart` (Phase 2). Chaque vue déstructure ce qu'elle utilise du `controller` (`noUnusedLocals` actif → déstructuration exacte).
- `web/src/App.tsx` — shell uniquement (nav, switching de vues).
- Tests de régression (`*-regression.test.mjs`) : lisent la **concaténation** des fichiers sources (`appSources`) — ajouter tout nouveau fichier vue à cette liste.
- **Permissions** : `permissionApi` dans `api.ts` fusionne v1 (`GET /permission`, réponse `POST /session/:id/permissions/:pid` body `{response: once|always|reject}`) et v2 (`GET /api/permission/request`, réponse `POST /api/session/:sid/permission/:rid/reply` body `{reply}`) en `PendingPermission` normalisé ; polling dans le même tick adaptatif que les sessions ; bannière `PermissionBanner` au-dessus du composer + badge 🔐 sur les cartes.
- **Rendu messages** : `MessagePart` rend text (markdown + bouton copier sur `pre`), `reasoning` (repliable), `tool` (carte compacte, `toolCallSummary`). `assistantResponseSignature` ne compte que les messages **avec texte** (sinon la bulle « typing » disparaît dès un tool call — piège corrigé).

## Phase 4 — release (en cours)

1. Bump `web/package.json` → `1.5.0`, push `main`, tag `v1.5.0` → la CI publie la release avec `app-release-signed.apk`
2. `gh release download v1.5.0 -R Prof-Krapu/opencode-remote-android` → APK livré (transfert téléphone : navigateur du OnePlus sur la page de release, ou adb)
3. Config app : host `100.100.128.63`, port `4096`, user `opencode`, mot de passe = celui de `~/.config/opencode-serve/env`

## Commandes utiles

```bash
# Garde-fous locaux (web/)
npm run test:i18n && npm run test:ui && npm run test:settings && npm run test:model && npm run build
# CI : lancer / suivre
gh workflow run android-apk.yml -R Prof-Krapu/opencode-remote-android
gh run list -R Prof-Krapu/opencode-remote-android --limit 3
gh run watch -R Prof-Krapu/opencode-remote-android
# Serveur
systemctl --user status opencode-serve
journalctl --user -u opencode-serve -f
```

## Gotchas

- **Ne jamais committer** : mots de passe (`~/.config/opencode-serve/env`), keystore (`~/.config/opencode-remote/`). Le repo reste propre.
- `gh` dans ce repo : toujours `-R Prof-Krapu/opencode-remote-android` (2 remotes → erreur sinon).
- Workflow release : publie sur tag `v*` **et exige les 4 secrets** pour un tag. Sans tag → artefact signé si secrets présents.
- Polling : adaptatif dans `useAppController` (1,5 s si session occupée/réponse attendue, 10 s sinon, **pause quand app masquée**). `loadSessionActivityTimes` reste N+1 (1 appel/session/refresh, cache par `time.updated`) — amélioration future possible via SSE `/event` (mais `EventSource` ne supporte pas le header `Authorization` → nécessiterait un plugin Capacitor SSE).
- i18n : `TranslationKey` est un type union exhaustif → ajouter une clé = la traduire dans **les 4 langues** sinon `tsc` et `test:i18n` cassent.
