// src/lib/notion/getPageData.ts
// Adapter que reexporta o módulo antigo (OLD_getPageData.ts)
// Assim o restante do código que importa './getPageData' funciona sem mudanças.

export { default } from './OLD_getPageData'
export { loadPageChunk } from './OLD_getPageData'
