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
| **0** | Fork + keystore + secrets + CI cloud verte | 🔄 en cours (build test lancé, run 29623299820) |
| **1** | Locale FR · tests en CI · polling adaptatif · warning sécu http | ⏳ à faire |
| **3** | Refactor `App.tsx` (85 Ko → `views/` + `hooks/`) | ⏳ à faire (**avant** phase 2, ordre délibéré) |
| **2** | Permissions à distance + rendu tool calls | ⏳ à faire |
| **4** | Release `v1.5.0` signée + livraison APK | ⏳ à faire |

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

## Phases restantes — plan détaillé

### Phase 1 — quick wins
1. **Locale FR** dans `web/src/i18n.ts` : ajouter `'fr'` à `LanguageCode`, dictionnaire complet (~150 clés, le type `Record<LanguageCode, Record<TranslationKey, string>>` + `i18n.test.mjs` garantissent l'exhaustivité), entrée `languageOptions`, cas `fr` dans `normalizeLanguage`
2. **CI** : ajouter une étape tests dans `android-apk.yml` après `npm ci` : `npm run test:i18n && npm run test:ui && npm run test:settings && npm run test:model`
3. **Polling adaptatif** dans `App.tsx` : aujourd'hui `setInterval` fixe 3,5 s qui tourne même app masquée → pause sur `document.hidden`/`visibilitychange`, 1,5 s si session sélectionnée `busy|retry` ou réponse attendue, 10 s sinon
4. **Warning sécu** : bandeau dans Settings si config `http` + hôte hors tailnet (`100.64.0.0/10`) / RFC1918 / localhost (+ clés i18n dans les 4 langues)
5. Garde-fous locaux avant push : `cd web && npm ci && npm run test:i18n && npm run test:ui && npm run test:settings && npm run test:model && npm run build`

### Phase 3 — refactor (AVANT phase 2, ordre délibéré)
- `App.tsx` = 85 Ko, ~50 `useState` dans un seul composant. Découper :
  - `web/src/hooks/` : `useServerConfig`, `useSessions`, `useSessionDetail`, `useConnection`
  - `web/src/views/` : `SettingsView`, `SessionsView`, `DetailView`, `HelpView`
  - `web/src/utils.ts` : fonctions pures déjà en tête d'`App.tsx`
- **Comportement strictement identique** ; `npm run test:ui` (ui-regression) + `tsc` comme garde-fous. Commits séparés par extraction.

### Phase 2 — permissions à distance (le vrai `/remote-control`)
- Endpoint de réponse : `POST /session/:id/permissions/:permissionID` body `{response, remember?}` (cf. openapi.json)
- **À déterminer depuis l'OpenAPI figé** : comment les demandes en attente remontent (événement SSE `/event` type `permission.*` ? endpoint dédié ? part de message ?) → implémenter détection + UI **Approuver / Refuser / Toujours** + badge sur la carte session
- Bonus inclus : rendu des parts `tool`/`reasoning` dans les messages (aujourd'hui `extractText` ne garde que `type==="text"`) + bouton copier sur les blocs de code

### Phase 4 — release
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
- Polling actuel : `setInterval(..., 3500)` dans le gros `useEffect` d'`App.tsx` + `loadSessionActivityTimes` = N+1 requêtes (1 appel/session/refresh).
- i18n : `TranslationKey` est un type union exhaustif → ajouter une clé = la traduire dans **les 4 langues** sinon `tsc` et `test:i18n` cassent.
