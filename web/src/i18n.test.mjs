import assert from 'node:assert/strict'
import { createTranslator, languageOptions, normalizeLanguage } from './i18n.ts'

assert.equal(normalizeLanguage('it'), 'it')
assert.equal(normalizeLanguage('zh-TW'), 'zh-TW')
assert.equal(normalizeLanguage('fr'), 'fr')
assert.equal(normalizeLanguage('fr-FR'), 'fr')
assert.ok(languageOptions.some((language) => language.code === 'zh-TW'))
assert.ok(languageOptions.some((language) => language.code === 'fr'))

const en = createTranslator('en')
const fr = createTranslator('fr')
const it = createTranslator('it')
const zh = createTranslator('zh-TW')

assert.equal(en('sessions.title'), 'Sessions')
assert.equal(fr('sessions.title'), 'Sessions')
assert.equal(it('sessions.title'), 'Sessioni')
assert.equal(zh('sessions.title'), '工作階段')

assert.equal(en('session.deleteTitle'), 'Delete session?')
assert.equal(it('session.deleteTitle'), 'Eliminare la sessione?')
assert.equal(zh('session.deleteTitle'), '刪除工作階段？')

// Unknown keys should remain visible during development instead of rendering blank UI.
assert.equal(en('missing.key'), 'missing.key')
assert.equal(en('detail.opencode'), '🤖 OpenCode')
assert.equal(it('detail.changedFilesTitle'), 'File modificati')
assert.equal(zh('detail.changedFilesTitle'), '已變更檔案')
assert.equal(en('detail.linesAddedDeleted', { additions: 3, deletions: 1 }), '+3 lines · -1 lines')
assert.equal(it('detail.aheadBehind', { ahead: 1, behind: 2 }), '1 avanti · 2 indietro')
assert.equal(zh('detail.fileStatusSource'), '來自 /file/status')
assert.equal(en('detail.fileStatusLabel'), 'Changed files')
assert.equal(it('detail.fileStatusLabel'), 'File modificati')
assert.equal(zh('detail.fileStatusLabel'), '已變更檔案')

assert.equal(en('settings.theme'), 'Theme')
assert.equal(it('settings.themeDark'), 'Scuro')
assert.equal(zh('settings.themeSystem'), '跟隨系統')
assert.equal(en('todo.title'), 'Todo Items')

// Every language must translate every key (no silent fallback to English).
assert.ok(fr('settings.insecureHttpWarning', { host: 'example.com' }).includes('example.com'))
assert.ok(fr('settings.insecureHttpWarning') !== en('settings.insecureHttpWarning'))

console.log('i18n tests passed')
